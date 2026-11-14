import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from 'react';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import {
  db,
  OperationType,
  handleFirestoreError,
} from '../firebase';
import {
  StudentSubmission,
  getAllSubmissions,
  hydrateSubmissionsFromIndexedDB,
  getSubmission as getSubFromStorage,
  saveSubmission as saveSubToStorage,
  updateTeacherReview as updateReviewInStorage,
  clearSubmission as clearSubFromStorage,
} from '../utils/audioStorage';

interface AudioSubmissionsContextType {
  submissions: Record<string, StudentSubmission>;
  cloudSubmissions: StudentSubmission[];
  allSubmissionsList: StudentSubmission[];
  localStudentId: string;
  studentDisplayName: string;
  setStudentDisplayName: (name: string) => void;
  cloudConnected: boolean;
  cloudError: string | null;
  syncingQuestionId: string | null;
  syncSubmissionNow: (questionId: string) => Promise<boolean>;
  saveAudioRecording: (
    questionId: string,
    audioDataUrl: string,
    meta: {
      scenarioId: number;
      scenarioTitle?: string;
      questionText: string;
      studentText?: string;
      studentName?: string;
    }
  ) => StudentSubmission;
  saveStudentText: (
    questionId: string,
    studentText: string,
    meta?: {
      scenarioId?: number;
      scenarioTitle?: string;
      questionText?: string;
    }
  ) => StudentSubmission;
  gradeSubmission: (
    questionId: string,
    score: number,
    feedback: string,
    firestoreDocId?: string
  ) => Promise<StudentSubmission | null>;
  deleteSubmission: (questionId: string, firestoreDocId?: string) => Promise<void>;
  getSubmission: (questionId: string) => StudentSubmission | null;
  reloadSubmissions: () => void;
}

const AudioSubmissionsContext = createContext<AudioSubmissionsContextType | undefined>(undefined);

function mapSubmissionsList(list: StudentSubmission[]): Record<string, StudentSubmission> {
  const map: Record<string, StudentSubmission> = {};
  list.forEach((sub) => {
    if (sub && sub.questionId) {
      map[sub.questionId] = sub;
    }
  });
  return map;
}

function sanitizeId(raw: string, maxLen: number): string {
  const cleaned = raw.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, maxLen);
  return cleaned || 'item';
}

function getOrCreateLocalStudentId(): string {
  const key = 'hanyu-student-device-id';
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const existing = localStorage.getItem(key);
      if (existing && /^[a-zA-Z0-9_-]{4,60}$/.test(existing)) {
        return existing;
      }
      const generated = `stu_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
      const safe = sanitizeId(generated, 60);
      localStorage.setItem(key, safe);
      return safe;
    }
  } catch {
    // ignore
  }
  return `stu_${Date.now().toString(36)}`;
}

function loadSavedStudentName(): string {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('hanyu-student-name') || '';
    }
  } catch {
    // ignore
  }
  return '';
}

export const AudioSubmissionsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [submissions, setSubmissions] = useState<Record<string, StudentSubmission>>({});
  const [cloudSubmissions, setCloudSubmissions] = useState<StudentSubmission[]>([]);
  const [cloudConnected, setCloudConnected] = useState<boolean>(false);
  const [cloudError, setCloudError] = useState<string | null>(null);
  const [syncingQuestionId, setSyncingQuestionId] = useState<string | null>(null);
  const [studentDisplayName, setStudentDisplayNameState] = useState<string>(loadSavedStudentName);

  const localStudentIdRef = useRef<string>(getOrCreateLocalStudentId());
  const studentNameRef = useRef<string>(studentDisplayName);

  const setStudentDisplayName = (name: string) => {
    const trimmed = name.slice(0, 100);
    setStudentDisplayNameState(trimmed);
    studentNameRef.current = trimmed;
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('hanyu-student-name', trimmed);
      }
    } catch {
      // ignore
    }
  };

  const resolveEffectiveStudentName = (override?: string): string => {
    const candidate = override || studentNameRef.current || 'Học viên';
    return candidate.trim().slice(0, 100) || 'Học viên';
  };

  const reloadSubmissions = () => {
    try {
      const list = getAllSubmissions();
      setSubmissions(mapSubmissionsList(list));
    } catch (e) {
      console.warn('Lỗi nạp submissions:', e);
    }
  };

  // Push a single local submission directly to Firestore (no login required)
  const pushSubmissionToFirestore = async (sub: StudentSubmission): Promise<boolean> => {
    const uid = sanitizeId(sub.studentUid || localStudentIdRef.current, 60);
    const qId = sanitizeId(sub.questionId, 64);
    const docId = `${uid}_${qId}`.slice(0, 128);
    const docPath = `submissions/${docId}`;

    if (sub.audioDataUrl && sub.audioDataUrl.length > 850000) {
      setCloudError(
        'Bản ghi âm vượt quá giới hạn 850KB của đám mây. Hãy thu âm ngắn hơn (dưới ~90 giây) để gửi lên giáo viên.'
      );
      return false;
    }

    setSyncingQuestionId(sub.questionId);
    setCloudError(null);

    try {
      const docRef = doc(db, 'submissions', docId);
      let existsOnServer = false;

      try {
        const snap = await getDoc(docRef);
        existsOnServer = snap.exists();
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        if (msg.includes('permission') || msg.includes('PERMISSION_DENIED')) {
          handleFirestoreError(err, OperationType.GET, docPath);
        }
        throw err;
      }

      const safeScenarioId = Math.min(20, Math.max(1, Math.floor(Number(sub.scenarioId) || 1)));
      const safeName = resolveEffectiveStudentName(sub.studentName);
      const safeScenarioTitle = (sub.scenarioTitle || '').trim().slice(0, 200);
      const safeQuestionText =
        (sub.questionText || 'Câu hỏi luyện nói').trim().slice(0, 500) || 'Câu hỏi luyện nói';
      const safeStudentText = (sub.studentText || '').slice(0, 2000);
      const safeTimestamp = Math.max(1, Math.floor(sub.timestamp || Date.now()));

      if (!existsOnServer) {
        const createPayload: Record<string, any> = {
          studentUid: uid,
          studentName: safeName,
          questionId: qId,
          scenarioId: safeScenarioId,
          questionText: safeQuestionText,
          studentText: safeStudentText,
          timestamp: safeTimestamp,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };
        if (safeScenarioTitle) {
          createPayload.scenarioTitle = safeScenarioTitle;
        }
        if (sub.audioDataUrl) {
          createPayload.audioDataUrl = sub.audioDataUrl;
        }

        try {
          await setDoc(docRef, createPayload);
        } catch (err) {
          handleFirestoreError(err, OperationType.CREATE, docPath);
        }
      } else {
        const updatePayload: Record<string, any> = {
          studentName: safeName,
          questionText: safeQuestionText,
          studentText: safeStudentText,
          timestamp: safeTimestamp,
          updatedAt: serverTimestamp(),
        };
        if (safeScenarioTitle) {
          updatePayload.scenarioTitle = safeScenarioTitle;
        }
        if (sub.audioDataUrl) {
          updatePayload.audioDataUrl = sub.audioDataUrl;
        }

        try {
          await updateDoc(docRef, updatePayload);
        } catch (err) {
          handleFirestoreError(err, OperationType.UPDATE, docPath);
        }
      }

      const synced = saveSubToStorage(sub.questionId, {
        ...sub,
        id: docId,
        studentUid: uid,
        studentName: safeName,
        syncedToCloud: true,
      });
      setSubmissions((prev) => ({ ...prev, [sub.questionId]: synced }));
      return true;
    } catch (err: any) {
      const msg = err?.message || String(err);
      if (msg.includes('Quota exceeded')) {
        setCloudError('Đã đạt giới hạn miễn phí hôm nay của Firestore. Hạn mức sẽ tự đặt lại vào ngày mai.');
      } else {
        setCloudError('Không thể đồng bộ bản ghi lên đám mây: ' + msg);
      }
      return false;
    } finally {
      setSyncingQuestionId((cur) => (cur === sub.questionId ? null : cur));
    }
  };

  // Initial local hydration + real-time Firestore listener (no login required)
  useEffect(() => {
    reloadSubmissions();

    hydrateSubmissionsFromIndexedDB().then((list) => {
      setSubmissions(mapSubmissionsList(list));
      // Push any previously un-synced local recordings automatically
      list.forEach((localSub) => {
        if (localSub.audioDataUrl && !localSub.syncedToCloud) {
          void pushSubmissionToFirestore(localSub);
        }
      });
    });

    const handleUpdate = () => {
      reloadSubmissions();
    };
    window.addEventListener('hanyu-submissions-updated', handleUpdate);

    const colRef = collection(db, 'submissions');
    const q = query(colRef, where('scenarioId', '>=', 1), where('scenarioId', '<=', 20));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setCloudConnected(true);
        setCloudError(null);
        const docs: StudentSubmission[] = [];
        const myStudentId = localStudentIdRef.current;

        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as any;
          const item: StudentSubmission = {
            id: docSnap.id,
            studentUid: data.studentUid,
            scenarioId: Number(data.scenarioId) || 1,
            scenarioTitle: data.scenarioTitle,
            questionId: data.questionId,
            questionText: data.questionText || '',
            studentText: data.studentText || '',
            audioDataUrl: data.audioDataUrl,
            timestamp: Number(data.timestamp) || Date.now(),
            studentName: data.studentName || 'Học viên',
            teacherScore: data.teacherScore !== undefined ? Number(data.teacherScore) : undefined,
            teacherFeedback: data.teacherFeedback,
            reviewedAt: data.reviewedAt !== undefined ? Number(data.reviewedAt) : undefined,
            syncedToCloud: true,
          };
          docs.push(item);

          // Sync teacher grading/feedback back to this student's device state
          if (data.studentUid === myStudentId && item.questionId) {
            const localExisting = getSubFromStorage(item.questionId);
            const merged = saveSubToStorage(item.questionId, {
              ...localExisting,
              ...item,
              audioDataUrl: item.audioDataUrl || localExisting?.audioDataUrl,
              syncedToCloud: true,
            });
            setSubmissions((prev) => ({ ...prev, [item.questionId]: merged }));
          }
        });

        docs.sort((a, b) => b.timestamp - a.timestamp);
        setCloudSubmissions(docs);
      },
      (error) => {
        const msg = error instanceof Error ? error.message : String(error);
        if (msg.includes('Quota exceeded')) {
          setCloudError('Đã đạt giới hạn đọc miễn phí hôm nay của Firestore.');
          return;
        }
        handleFirestoreError(error, OperationType.LIST, 'submissions');
      }
    );

    return () => {
      window.removeEventListener('hanyu-submissions-updated', handleUpdate);
      unsubscribe();
    };
  }, []);

  const syncSubmissionNow = async (questionId: string): Promise<boolean> => {
    const sub = submissions[questionId] || getSubFromStorage(questionId);
    if (!sub) return false;
    return pushSubmissionToFirestore(sub);
  };

  const saveAudioRecording = (
    questionId: string,
    audioDataUrl: string,
    meta: {
      scenarioId: number;
      scenarioTitle?: string;
      questionText: string;
      studentText?: string;
      studentName?: string;
    }
  ): StudentSubmission => {
    const existing = getSubFromStorage(questionId);
    const effectiveName = resolveEffectiveStudentName(meta.studentName || existing?.studentName);
    const uid = existing?.studentUid || localStudentIdRef.current;

    const updated = saveSubToStorage(questionId, {
      id: `${sanitizeId(uid, 60)}_${sanitizeId(questionId, 64)}`.slice(0, 128),
      scenarioId: meta.scenarioId,
      scenarioTitle: meta.scenarioTitle,
      questionId,
      questionText: meta.questionText,
      studentText: meta.studentText !== undefined ? meta.studentText : (existing?.studentText || ''),
      audioDataUrl,
      timestamp: Date.now(),
      studentName: effectiveName,
      studentUid: uid,
      syncedToCloud: false,
    });

    setSubmissions((prev) => ({ ...prev, [questionId]: updated }));
    void pushSubmissionToFirestore(updated);

    return updated;
  };

  const saveStudentText = (
    questionId: string,
    studentText: string,
    meta?: {
      scenarioId?: number;
      scenarioTitle?: string;
      questionText?: string;
    }
  ): StudentSubmission => {
    const existing = getSubFromStorage(questionId);
    const effectiveName = resolveEffectiveStudentName(existing?.studentName);
    const uid = existing?.studentUid || localStudentIdRef.current;

    const updated = saveSubToStorage(questionId, {
      id: existing?.id || `${sanitizeId(uid, 60)}_${sanitizeId(questionId, 64)}`.slice(0, 128),
      scenarioId: meta?.scenarioId || existing?.scenarioId || 1,
      scenarioTitle: meta?.scenarioTitle || existing?.scenarioTitle,
      questionId,
      questionText: meta?.questionText || existing?.questionText || '',
      studentText,
      audioDataUrl: existing?.audioDataUrl,
      timestamp: Date.now(),
      studentName: effectiveName,
      studentUid: uid,
      syncedToCloud: existing?.syncedToCloud,
    });

    setSubmissions((prev) => ({ ...prev, [questionId]: updated }));
    return updated;
  };

  const gradeSubmission = async (
    questionId: string,
    score: number,
    feedback: string,
    firestoreDocId?: string
  ): Promise<StudentSubmission | null> => {
    const safeScore = Math.min(10, Math.max(0, Number(score) || 0));
    const safeFeedback = (feedback || '').slice(0, 2000);
    const reviewedAt = Date.now();
    const targetDocId = firestoreDocId || submissions[questionId]?.id;

    if (targetDocId) {
      const docPath = `submissions/${targetDocId}`;
      try {
        await updateDoc(doc(db, 'submissions', targetDocId), {
          teacherScore: safeScore,
          teacherFeedback: safeFeedback,
          reviewedAt,
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, docPath);
      }
    }

    const updated = updateReviewInStorage(questionId, safeScore, safeFeedback);
    if (updated) {
      setSubmissions((prev) => ({ ...prev, [questionId]: updated }));
    }
    return updated;
  };

  const deleteSubmission = async (questionId: string, firestoreDocId?: string): Promise<void> => {
    const targetDocId =
      firestoreDocId ||
      submissions[questionId]?.id ||
      `${sanitizeId(localStudentIdRef.current, 60)}_${sanitizeId(questionId, 64)}`.slice(0, 128);

    if (targetDocId) {
      const docPath = `submissions/${targetDocId}`;
      try {
        await deleteDoc(doc(db, 'submissions', targetDocId));
      } catch (err: any) {
        const msg = err?.message || String(err);
        if (msg.includes('permission') || msg.includes('PERMISSION_DENIED')) {
          handleFirestoreError(err, OperationType.DELETE, docPath);
        }
      }
    }

    clearSubFromStorage(questionId);
    setSubmissions((prev) => {
      const next = { ...prev };
      delete next[questionId];
      return next;
    });
  };

  const getSubmission = (questionId: string): StudentSubmission | null => {
    return submissions[questionId] || getSubFromStorage(questionId);
  };

  // Merge cloud submissions + any local-only submissions (e.g. demo seeds)
  const mergedSubmissionsMap: Record<string, StudentSubmission> = {};
  cloudSubmissions.forEach((c) => {
    const key = c.id || c.questionId;
    mergedSubmissionsMap[key] = c;
  });
  Object.values(submissions).forEach((loc) => {
    const docKey =
      loc.id ||
      `${sanitizeId(localStudentIdRef.current, 60)}_${sanitizeId(loc.questionId, 64)}`.slice(0, 128);
    if (!mergedSubmissionsMap[docKey] && !mergedSubmissionsMap[loc.questionId]) {
      mergedSubmissionsMap[loc.questionId] = loc;
    }
  });
  const allSubmissionsList = Object.values(mergedSubmissionsMap).sort(
    (a, b) => b.timestamp - a.timestamp
  );

  return (
    <AudioSubmissionsContext.Provider
      value={{
        submissions,
        cloudSubmissions,
        allSubmissionsList,
        localStudentId: localStudentIdRef.current,
        studentDisplayName,
        setStudentDisplayName,
        cloudConnected,
        cloudError,
        syncingQuestionId,
        syncSubmissionNow,
        saveAudioRecording,
        saveStudentText,
        gradeSubmission,
        deleteSubmission,
        getSubmission,
        reloadSubmissions,
      }}
    >
      {children}
    </AudioSubmissionsContext.Provider>
  );
};

const fallbackContextValue: AudioSubmissionsContextType = {
  submissions: {},
  cloudSubmissions: [],
  allSubmissionsList: [],
  localStudentId: 'stu_local',
  studentDisplayName: '',
  setStudentDisplayName: () => {},
  cloudConnected: false,
  cloudError: null,
  syncingQuestionId: null,
  syncSubmissionNow: async () => false,
  saveAudioRecording: (id, url, meta) => ({
    scenarioId: meta.scenarioId,
    scenarioTitle: meta.scenarioTitle,
    questionId: id,
    questionText: meta.questionText,
    studentText: meta.studentText || '',
    audioDataUrl: url,
    timestamp: Date.now(),
  }),
  saveStudentText: (id, text, meta) => ({
    scenarioId: meta?.scenarioId || 1,
    questionId: id,
    questionText: meta?.questionText || '',
    studentText: text,
    timestamp: Date.now(),
  }),
  gradeSubmission: async () => null,
  deleteSubmission: async () => {},
  getSubmission: (id) => getSubFromStorage(id),
  reloadSubmissions: () => {},
};

export function useAudioSubmissions(): AudioSubmissionsContextType {
  const context = useContext(AudioSubmissionsContext);
  return context || fallbackContextValue;
}

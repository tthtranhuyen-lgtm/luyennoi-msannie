import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  StudentSubmission,
  getAllSubmissions,
  getSubmission as getSubFromStorage,
  saveSubmission as saveSubToStorage,
  updateTeacherReview as updateReviewInStorage,
  clearSubmission as clearSubFromStorage,
} from '../utils/audioStorage';

interface AudioSubmissionsContextType {
  submissions: Record<string, StudentSubmission>;
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
    feedback: string
  ) => StudentSubmission | null;
  deleteSubmission: (questionId: string) => void;
  getSubmission: (questionId: string) => StudentSubmission | null;
  allSubmissionsList: StudentSubmission[];
  reloadSubmissions: () => void;
}

const AudioSubmissionsContext = createContext<AudioSubmissionsContextType | undefined>(undefined);

export const AudioSubmissionsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [submissions, setSubmissions] = useState<Record<string, StudentSubmission>>({});

  const reloadSubmissions = () => {
    try {
      const list = getAllSubmissions();
      const map: Record<string, StudentSubmission> = {};
      list.forEach((sub) => {
        if (sub && sub.questionId) {
          map[sub.questionId] = sub;
        }
      });
      setSubmissions(map);
    } catch (e) {
      console.warn('Lỗi nạp submissions:', e);
    }
  };

  useEffect(() => {
    reloadSubmissions();

    const handleUpdate = () => {
      reloadSubmissions();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('hanyu-submissions-updated', handleUpdate);
      return () => {
        window.removeEventListener('hanyu-submissions-updated', handleUpdate);
      };
    }
  }, []);

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
    const existing = submissions[questionId] || getSubFromStorage(questionId);
    const updated = saveSubToStorage(questionId, {
      scenarioId: meta.scenarioId,
      scenarioTitle: meta.scenarioTitle,
      questionId,
      questionText: meta.questionText,
      studentText: meta.studentText !== undefined ? meta.studentText : (existing?.studentText || ''),
      audioDataUrl,
      timestamp: Date.now(),
      studentName: meta.studentName || existing?.studentName || 'Học viên',
    });

    setSubmissions((prev) => ({ ...prev, [questionId]: updated }));
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
    const existing = submissions[questionId] || getSubFromStorage(questionId);
    const updated = saveSubToStorage(questionId, {
      scenarioId: meta?.scenarioId || existing?.scenarioId || 1,
      scenarioTitle: meta?.scenarioTitle || existing?.scenarioTitle,
      questionId,
      questionText: meta?.questionText || existing?.questionText || '',
      studentText,
      audioDataUrl: existing?.audioDataUrl,
      timestamp: Date.now(),
      studentName: existing?.studentName || 'Học viên',
    });

    setSubmissions((prev) => ({ ...prev, [questionId]: updated }));
    return updated;
  };

  const gradeSubmission = (
    questionId: string,
    score: number,
    feedback: string
  ): StudentSubmission | null => {
    const updated = updateReviewInStorage(questionId, score, feedback);
    if (updated) {
      setSubmissions((prev) => ({ ...prev, [questionId]: updated }));
    }
    return updated;
  };

  const deleteSubmission = (questionId: string) => {
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

  const allSubmissionsList = Object.values(submissions).sort((a, b) => b.timestamp - a.timestamp);

  return (
    <AudioSubmissionsContext.Provider
      value={{
        submissions,
        saveAudioRecording,
        saveStudentText,
        gradeSubmission,
        deleteSubmission,
        getSubmission,
        allSubmissionsList,
        reloadSubmissions,
      }}
    >
      {children}
    </AudioSubmissionsContext.Provider>
  );
};

const fallbackContextValue: AudioSubmissionsContextType = {
  submissions: {},
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
  gradeSubmission: () => null,
  deleteSubmission: () => {},
  getSubmission: (id) => getSubFromStorage(id),
  allSubmissionsList: [],
  reloadSubmissions: () => {},
};

export function useAudioSubmissions(): AudioSubmissionsContextType {
  const context = useContext(AudioSubmissionsContext);
  return context || fallbackContextValue;
}

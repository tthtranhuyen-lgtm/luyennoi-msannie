// Audio recording and storage helper for student speaking practice & teacher grading
// Uses IndexedDB (for large audio files) + in-memory cache + localStorage metadata fallback

export interface StudentSubmission {
  scenarioId: number;
  scenarioTitle?: string;
  questionId: string;
  questionText: string;
  studentText: string;
  audioDataUrl?: string; // base64 recorded audio
  timestamp: number;
  studentName?: string;
  teacherScore?: number; // 0 - 10
  teacherFeedback?: string;
  reviewedAt?: number;
}

function pickSupportedAudioMimeType(): string | undefined {
  if (typeof MediaRecorder === 'undefined' || typeof MediaRecorder.isTypeSupported !== 'function') {
    return undefined;
  }
  const candidates = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/mp4',
    'audio/ogg;codecs=opus',
  ];
  return candidates.find((type) => {
    try {
      return MediaRecorder.isTypeSupported(type);
    } catch {
      return false;
    }
  });
}

class AudioRecordingManager {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private stream: MediaStream | null = null;
  private activeMimeType: string = 'audio/webm';

  public async startRecording(): Promise<void> {
    // Clean up any lingering previous recorder/stream safely
    this.cancelRecording();
    this.audioChunks = [];

    if (
      typeof navigator === 'undefined' ||
      !navigator.mediaDevices ||
      !navigator.mediaDevices.getUserMedia
    ) {
      throw new Error('Trình duyệt không hỗ trợ thu âm MediaRecorder.');
    }

    if (typeof MediaRecorder === 'undefined') {
      throw new Error('Trình duyệt không hỗ trợ ghi âm MediaRecorder.');
    }

    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const preferredMime = pickSupportedAudioMimeType();
    this.mediaRecorder = preferredMime
      ? new MediaRecorder(this.stream, { mimeType: preferredMime })
      : new MediaRecorder(this.stream);

    this.activeMimeType = this.mediaRecorder.mimeType || preferredMime || 'audio/webm';

    this.mediaRecorder.ondataavailable = (event: BlobEvent) => {
      if (event.data && event.data.size > 0) {
        this.audioChunks.push(event.data);
      }
    };

    // Pass 250ms timeslice so audio chunks are collected continuously and never lost on stop
    this.mediaRecorder.start(250);
  }

  public stopRecording(): Promise<{ blob: Blob; dataUrl: string }> {
    return new Promise((resolve, reject) => {
      const recorder = this.mediaRecorder;
      if (!recorder) {
        return reject(new Error('Chưa bắt đầu thu âm.'));
      }

      const cleanupStream = () => {
        if (this.stream) {
          try {
            this.stream.getTracks().forEach((track) => track.stop());
          } catch {
            // ignore
          }
          this.stream = null;
        }
        this.mediaRecorder = null;
      };

      if (recorder.state === 'inactive') {
        cleanupStream();
        if (this.audioChunks.length === 0) {
          return reject(new Error('Không thu được dữ liệu âm thanh. Vui lòng thử lại.'));
        }
        const blob = new Blob(this.audioChunks, { type: this.activeMimeType });
        const reader = new FileReader();
        reader.onloadend = () => resolve({ blob, dataUrl: reader.result as string });
        reader.onerror = reject;
        reader.readAsDataURL(blob);
        return;
      }

      recorder.onstop = () => {
        try {
          const mimeType = recorder.mimeType || this.activeMimeType || 'audio/webm';
          const blob = new Blob(this.audioChunks, { type: mimeType });
          cleanupStream();

          if (!blob || blob.size === 0) {
            return reject(new Error('Bản ghi âm bị trống (0 bytes). Hãy nói vào micro và thử lại.'));
          }

          const reader = new FileReader();
          reader.onloadend = () => {
            const dataUrl = reader.result as string;
            if (!dataUrl || !dataUrl.startsWith('data:')) {
              return reject(new Error('Không thể chuyển đổi dữ liệu âm thanh.'));
            }
            resolve({ blob, dataUrl });
          };
          reader.onerror = () => reject(new Error('Lỗi đọc dữ liệu âm thanh.'));
          reader.readAsDataURL(blob);
        } catch (e) {
          cleanupStream();
          reject(e);
        }
      };

      try {
        if (typeof recorder.requestData === 'function') {
          try {
            recorder.requestData();
          } catch {
            // ignore
          }
        }
        recorder.stop();
      } catch (e) {
        cleanupStream();
        reject(e);
      }
    });
  }

  public cancelRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      try {
        this.mediaRecorder.onstop = null;
        this.mediaRecorder.stop();
      } catch {
        // ignore
      }
    }
    this.mediaRecorder = null;
    if (this.stream) {
      try {
        this.stream.getTracks().forEach((track) => track.stop());
      } catch {
        // ignore
      }
      this.stream = null;
    }
    this.audioChunks = [];
  }
}

export const audioRecorder = new AudioRecordingManager();

// Primary in-memory store (always authoritative in current session)
const inMemorySubmissions: Record<string, StudentSubmission> = {};
const STORAGE_PREFIX = 'hanyu-submission-';

// IndexedDB persistence for large audio recordings (GitHub Pages shares 5MB localStorage per origin!)
const IDB_NAME = 'hanyu-feixing-audio-db';
const IDB_STORE = 'submissions';
const IDB_VERSION = 1;

function openSubmissionsDB(): Promise<IDBDatabase | null> {
  return new Promise((resolve) => {
    try {
      if (typeof indexedDB === 'undefined') {
        resolve(null);
        return;
      }
      const req = indexedDB.open(IDB_NAME, IDB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(IDB_STORE)) {
          db.createObjectStore(IDB_STORE, { keyPath: 'questionId' });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

async function saveToIndexedDB(submission: StudentSubmission): Promise<void> {
  try {
    const db = await openSubmissionsDB();
    if (!db) return;
    await new Promise<void>((resolve) => {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      tx.objectStore(IDB_STORE).put(submission);
      tx.oncomplete = () => {
        db.close();
        resolve();
      };
      tx.onerror = () => {
        db.close();
        resolve();
      };
    });
  } catch {
    // ignore
  }
}

async function deleteFromIndexedDB(questionId: string): Promise<void> {
  try {
    const db = await openSubmissionsDB();
    if (!db) return;
    await new Promise<void>((resolve) => {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      tx.objectStore(IDB_STORE).delete(questionId);
      tx.oncomplete = () => {
        db.close();
        resolve();
      };
      tx.onerror = () => {
        db.close();
        resolve();
      };
    });
  } catch {
    // ignore
  }
}

export async function hydrateSubmissionsFromIndexedDB(): Promise<StudentSubmission[]> {
  try {
    const db = await openSubmissionsDB();
    if (!db) return getAllSubmissions();
    const idbItems = await new Promise<StudentSubmission[]>((resolve) => {
      const tx = db.transaction(IDB_STORE, 'readonly');
      const req = tx.objectStore(IDB_STORE).getAll();
      req.onsuccess = () => {
        db.close();
        resolve(Array.isArray(req.result) ? req.result : []);
      };
      req.onerror = () => {
        db.close();
        resolve([]);
      };
    });

    idbItems.forEach((item) => {
      if (item && item.questionId) {
        const current = inMemorySubmissions[item.questionId];
        if (!current) {
          inMemorySubmissions[item.questionId] = item;
        } else {
          inMemorySubmissions[item.questionId] = {
            ...item,
            ...current,
            audioDataUrl: current.audioDataUrl || item.audioDataUrl,
          };
        }
      }
    });
  } catch {
    // ignore
  }
  return getAllSubmissions();
}

function safeWriteLocalStorage(questionId: string, submission: StudentSubmission): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  const key = STORAGE_PREFIX + questionId;
  try {
    localStorage.setItem(key, JSON.stringify(submission));
  } catch {
    // QuotaExceededError on localStorage (common with audio base64 on shared origins like github.io).
    // Fallback: store metadata without audioDataUrl in localStorage while keeping full audio in IndexedDB + memory!
    try {
      const withoutAudio: StudentSubmission = {
        ...submission,
        audioDataUrl: undefined,
      };
      localStorage.setItem(key, JSON.stringify(withoutAudio));
    } catch {
      // ignore if localStorage is completely unavailable
    }
  }
}

function safeRemoveLocalStorage(questionId: string): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(STORAGE_PREFIX + questionId);
    }
  } catch {
    // ignore
  }
}

function mergeSubmissions(a: StudentSubmission, b: StudentSubmission): StudentSubmission {
  const newer = (b.timestamp || 0) >= (a.timestamp || 0) ? b : a;
  const older = newer === b ? a : b;
  return {
    ...older,
    ...newer,
    audioDataUrl: newer.audioDataUrl || older.audioDataUrl,
    studentText: newer.studentText !== undefined ? newer.studentText : older.studentText,
  };
}

export function saveSubmission(
  questionId: string,
  data: Partial<StudentSubmission>
): StudentSubmission {
  const existing = getSubmission(questionId) || {
    scenarioId: 1,
    questionId,
    questionText: '',
    studentText: '',
    timestamp: Date.now(),
  };

  const updated: StudentSubmission = {
    ...existing,
    ...data,
    // Never accidentally wipe audioDataUrl when saving text-only or review updates
    audioDataUrl: data.audioDataUrl !== undefined ? data.audioDataUrl : existing.audioDataUrl,
    timestamp: data.timestamp || Date.now(),
  };

  // 1. Update authoritative in-memory store immediately
  inMemorySubmissions[questionId] = updated;

  // 2. Persist full submission (including audioDataUrl) to IndexedDB asynchronously
  void saveToIndexedDB(updated);

  // 3. Persist to localStorage (with safe metadata fallback if quota exceeded)
  safeWriteLocalStorage(questionId, updated);

  // 4. Notify listeners
  try {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('hanyu-submissions-updated', { detail: updated }));
    }
  } catch (err) {
    console.warn('Lỗi thông báo cập nhật bản ghi:', err);
  }

  return updated;
}

export function updateTeacherReview(
  questionId: string,
  teacherScore: number,
  teacherFeedback: string
): StudentSubmission | null {
  const existing = getSubmission(questionId);
  if (!existing) return null;

  return saveSubmission(questionId, {
    teacherScore,
    teacherFeedback,
    reviewedAt: Date.now(),
  });
}

export function getSubmission(questionId: string): StudentSubmission | null {
  const mem = inMemorySubmissions[questionId] || null;
  let lsItem: StudentSubmission | null = null;
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const val = localStorage.getItem(STORAGE_PREFIX + questionId);
      if (val) lsItem = JSON.parse(val);
    }
  } catch {
    lsItem = null;
  }

  if (mem && lsItem) return mergeSubmissions(lsItem, mem);
  return mem || lsItem;
}

export function getAllSubmissions(): StudentSubmission[] {
  const mergedMap: Record<string, StudentSubmission> = {};

  // Read localStorage first
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(STORAGE_PREFIX)) {
          const val = localStorage.getItem(key);
          if (val) {
            try {
              const parsed: StudentSubmission = JSON.parse(val);
              if (parsed && parsed.questionId) {
                mergedMap[parsed.questionId] = parsed;
              }
            } catch {
              // ignore
            }
          }
        }
      }
    }
  } catch (e) {
    console.warn('Lỗi đọc submissions:', e);
  }

  // Merge authoritative inMemorySubmissions (preserves audioDataUrl even when localStorage hits quota!)
  Object.keys(inMemorySubmissions).forEach((qId) => {
    const mem = inMemorySubmissions[qId];
    if (mem) {
      mergedMap[qId] = mergedMap[qId] ? mergeSubmissions(mergedMap[qId], mem) : mem;
    }
  });

  return Object.values(mergedMap).sort((a, b) => b.timestamp - a.timestamp);
}

export function clearSubmission(questionId: string): void {
  delete inMemorySubmissions[questionId];
  safeRemoveLocalStorage(questionId);
  void deleteFromIndexedDB(questionId);
  try {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('hanyu-submissions-updated'));
    }
  } catch {
    // ignore
  }
}

export function formatSafeTime(timestamp?: number | string | null): string {
  if (!timestamp) return '';
  const num = typeof timestamp === 'number' ? timestamp : Number(timestamp);
  if (isNaN(num) || num <= 0) return '';
  try {
    const d = new Date(num);
    return isNaN(d.getTime()) ? '' : d.toLocaleTimeString('vi-VN');
  } catch {
    return '';
  }
}

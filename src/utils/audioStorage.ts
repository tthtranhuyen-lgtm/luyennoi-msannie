// Audio recording and storage helper for student speaking practice & teacher grading

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

class AudioRecordingManager {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private stream: MediaStream | null = null;

  public async startRecording(): Promise<void> {
    this.audioChunks = [];
    if (typeof navigator === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('Trình duyệt không hỗ trợ thu âm MediaRecorder.');
    }

    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.mediaRecorder = new MediaRecorder(this.stream);

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.audioChunks.push(event.data);
      }
    };

    this.mediaRecorder.start();
  }

  public stopRecording(): Promise<{ blob: Blob; dataUrl: string }> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        return reject(new Error('Chưa bắt đầu thu âm.'));
      }

      this.mediaRecorder.onstop = async () => {
        try {
          const mimeType = this.mediaRecorder?.mimeType || 'audio/webm';
          const blob = new Blob(this.audioChunks, { type: mimeType });

          // Stop all media tracks to release microphone
          if (this.stream) {
            this.stream.getTracks().forEach((track) => track.stop());
            this.stream = null;
          }

          const reader = new FileReader();
          reader.onloadend = () => {
            const dataUrl = reader.result as string;
            resolve({ blob, dataUrl });
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        } catch (e) {
          reject(e);
        }
      };

      try {
        this.mediaRecorder.stop();
      } catch (e) {
        reject(e);
      }
    });
  }

  public cancelRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      try {
        this.mediaRecorder.stop();
      } catch (e) {
        // ignore
      }
    }
    if (this.stream) {
      try {
        this.stream.getTracks().forEach((track) => track.stop());
      } catch (e) {
        // ignore
      }
      this.stream = null;
    }
    this.audioChunks = [];
  }
}

export const audioRecorder = new AudioRecordingManager();

// In-memory memory store fallback if localStorage is blocked by iframe security policy
const inMemoryStore: Record<string, string> = {};
const STORAGE_PREFIX = 'hanyu-submission-';

function safeGetItem(key: string): string | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem(key);
    }
  } catch (e) {
    // fallback
  }
  return inMemoryStore[key] || null;
}

function safeSetItem(key: string, value: string): void {
  inMemoryStore[key] = value;
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(key, value);
    }
  } catch (e) {
    // ignore
  }
}

function safeRemoveItem(key: string): void {
  delete inMemoryStore[key];
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(key);
    }
  } catch (e) {
    // ignore
  }
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
    timestamp: data.timestamp || existing.timestamp || Date.now(),
  };

  try {
    safeSetItem(STORAGE_PREFIX + questionId, JSON.stringify(updated));
    // Dispatch custom event safely
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('hanyu-submissions-updated', { detail: updated }));
    }
  } catch (err) {
    console.warn('Lỗi lưu bản ghi:', err);
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
  try {
    const val = safeGetItem(STORAGE_PREFIX + questionId);
    if (!val) return null;
    return JSON.parse(val);
  } catch (e) {
    return null;
  }
}

export function getAllSubmissions(): StudentSubmission[] {
  const submissions: StudentSubmission[] = [];
  try {
    // Read from localStorage if available
    if (typeof window !== 'undefined' && window.localStorage) {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(STORAGE_PREFIX)) {
          const val = safeGetItem(key);
          if (val) {
            try {
              submissions.push(JSON.parse(val));
            } catch (e) {
              // ignore
            }
          }
        }
      }
    }
  } catch (e) {
    console.warn('Lỗi đọc submissions:', e);
  }

  // Also include any inMemory items not yet in submissions
  Object.keys(inMemoryStore).forEach((key) => {
    if (key.startsWith(STORAGE_PREFIX)) {
      try {
        const parsed = JSON.parse(inMemoryStore[key]);
        if (!submissions.some((s) => s.questionId === parsed.questionId)) {
          submissions.push(parsed);
        }
      } catch (e) {
        // ignore
      }
    }
  });

  return submissions.sort((a, b) => b.timestamp - a.timestamp);
}

export function clearSubmission(questionId: string): void {
  safeRemoveItem(STORAGE_PREFIX + questionId);
  try {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('hanyu-submissions-updated'));
    }
  } catch (e) {
    // ignore
  }
}

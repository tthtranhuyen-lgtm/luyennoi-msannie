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
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
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
      };

      this.mediaRecorder.stop();
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
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
    this.audioChunks = [];
  }
}

export const audioRecorder = new AudioRecordingManager();

// Local storage helpers for recordings and teacher reviews
const STORAGE_PREFIX = 'hanyu-submission-';

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
    localStorage.setItem(STORAGE_PREFIX + questionId, JSON.stringify(updated));
    // Dispatch custom event so UI updates immediately across components
    window.dispatchEvent(new CustomEvent('hanyu-submissions-updated', { detail: updated }));
  } catch (err) {
    console.warn('Lỗi lưu bản ghi vào localStorage:', err);
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
    const val = localStorage.getItem(STORAGE_PREFIX + questionId);
    if (!val) return null;
    return JSON.parse(val);
  } catch (e) {
    return null;
  }
}

export function getAllSubmissions(): StudentSubmission[] {
  const submissions: StudentSubmission[] = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_PREFIX)) {
        const val = localStorage.getItem(key);
        if (val) {
          try {
            submissions.push(JSON.parse(val));
          } catch (e) {
            // ignore
          }
        }
      }
    }
  } catch (e) {
    console.warn('Lỗi đọc submissions:', e);
  }
  return submissions.sort((a, b) => b.timestamp - a.timestamp);
}

export function clearSubmission(questionId: string): void {
  try {
    localStorage.removeItem(STORAGE_PREFIX + questionId);
    window.dispatchEvent(new CustomEvent('hanyu-submissions-updated'));
  } catch (e) {
    // ignore
  }
}

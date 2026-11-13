import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  Square,
  RotateCcw,
  CheckCircle,
  Download,
  AlertCircle,
  GraduationCap,
  Sparkles,
  Loader2,
  Cloud,
  UploadCloud,
  LogIn,
} from 'lucide-react';
import { audioRecorder, formatSafeTime } from '../utils/audioStorage';
import { useAudioSubmissions } from '../context/AudioSubmissionsContext';
import { ChineseSpeechRecognizer } from '../utils/speech';

interface AudioRecorderProps {
  scenarioId: number;
  scenarioTitle?: string;
  questionId: string;
  questionText: string;
  studentText?: string;
  onTranscriptRecorded?: (transcript: string) => void;
  className?: string;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({
  scenarioId,
  scenarioTitle,
  questionId,
  questionText,
  studentText = '',
  onTranscriptRecorded,
  className = '',
}) => {
  const {
    getSubmission,
    saveAudioRecording,
    deleteSubmission,
    user,
    syncingQuestionId,
    syncSubmissionNow,
    signInWithGoogle,
  } = useAudioSubmissions();
  const isSyncingToCloud = syncingQuestionId === questionId;

  const submission = getSubmission(questionId);
  const [localAudioUrl, setLocalAudioUrl] = useState<string | undefined>(submission?.audioDataUrl);
  const audioDataUrl = submission?.audioDataUrl || localAudioUrl;

  const [isRecording, setIsRecording] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const timerRef = useRef<number | null>(null);
  const recognizerRef = useRef<ChineseSpeechRecognizer | null>(null);
  const currentTranscriptRef = useRef<string>('');
  const isRecordingRef = useRef<boolean>(false);

  // Sync local fallback URL with context submission (e.g. after IndexedDB hydration)
  useEffect(() => {
    if (submission?.audioDataUrl) {
      setLocalAudioUrl(submission.audioDataUrl);
    } else if (!submission && localAudioUrl) {
      setLocalAudioUrl(undefined);
    }
  }, [submission?.audioDataUrl]);

  // Clean up timer & recognizer on unmount
  useEffect(() => {
    recognizerRef.current = new ChineseSpeechRecognizer();
    return () => {
      isRecordingRef.current = false;
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
      if (recognizerRef.current) {
        recognizerRef.current.stopListening();
      }
    };
  }, []);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getDownloadExtension = (dataUrl?: string) => {
    if (!dataUrl) return 'webm';
    if (dataUrl.startsWith('data:audio/mp4')) return 'm4a';
    if (dataUrl.startsWith('data:audio/ogg')) return 'ogg';
    return 'webm';
  };

  const handleStartRecording = async () => {
    setErrorMessage(null);
    setConfirmDelete(false);
    setLiveTranscript('');
    currentTranscriptRef.current = '';

    try {
      // 1. Start media audio recording (native webm/mp4 audio chunks)
      await audioRecorder.startRecording();
      isRecordingRef.current = true;
      setIsRecording(true);
      setRecordSeconds(0);

      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = window.setInterval(() => {
        setRecordSeconds((prev) => prev + 1);
      }, 1000);

      // 2. Start Chinese Speech-to-Text Recognition to transcribe spoken words in real time
      if (recognizerRef.current && recognizerRef.current.isSupported()) {
        recognizerRef.current.startListening(
          {
            onResult: (transcript) => {
              if (!isRecordingRef.current) return;
              setLiveTranscript(transcript);
              currentTranscriptRef.current = transcript;
              // Notify parent so "Ghi chú / Nháp câu trả lời" updates in real time!
              if (onTranscriptRecorded) {
                onTranscriptRecorded(transcript);
              }
            },
            onError: (err) => {
              console.warn('Nhận dạng tiếng Trung:', err);
            },
          },
          studentText
        );
      }
    } catch (err: any) {
      isRecordingRef.current = false;
      setIsRecording(false);
      setErrorMessage(
        err?.message ||
          'Không thể truy cập microphone. Vui lòng cho phép quyền truy cập micro trên trình duyệt của bạn.'
      );
    }
  };

  const handleStopRecording = async () => {
    isRecordingRef.current = false;
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (recognizerRef.current) {
      recognizerRef.current.stopListening();
    }

    setIsRecording(false);
    setIsSaving(true);

    try {
      const { dataUrl } = await audioRecorder.stopRecording();
      const finalRecordedText = currentTranscriptRef.current || liveTranscript || studentText;

      // Immediately reflect audio in local state & persist in context + IndexedDB
      setLocalAudioUrl(dataUrl);
      saveAudioRecording(questionId, dataUrl, {
        scenarioId,
        scenarioTitle,
        questionText,
        studentText: finalRecordedText,
      });

      if (onTranscriptRecorded && finalRecordedText) {
        onTranscriptRecorded(finalRecordedText);
      }
    } catch (err: any) {
      setErrorMessage('Lỗi lưu bản ghi âm: ' + (err?.message || 'Không xác định'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelRecording = () => {
    isRecordingRef.current = false;
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (recognizerRef.current) {
      recognizerRef.current.stopListening();
    }
    setIsRecording(false);
    setRecordSeconds(0);
    setLiveTranscript('');
    audioRecorder.cancelRecording();
  };

  const handleDeleteAudio = () => {
    deleteSubmission(questionId);
    setLocalAudioUrl(undefined);
    setLiveTranscript('');
    setConfirmDelete(false);
  };

  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm space-y-3 transition-all ${className}`}
    >
      {/* Header bar: Recording label and status */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-2">
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              isRecording
                ? 'bg-rose-500 animate-ping'
                : isSaving
                ? 'bg-amber-500 animate-pulse'
                : audioDataUrl
                ? 'bg-emerald-500'
                : 'bg-slate-300'
            }`}
          />
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
            {isRecording
              ? 'Đang ghi âm & Nhận dạng giọng nói...'
              : isSaving
              ? 'Đang lưu tệp ghi âm...'
              : audioDataUrl
              ? 'Bản ghi âm bài nói của bạn'
              : 'Ghi âm câu trả lời trực tiếp'}
          </span>
        </div>

        {audioDataUrl && !isRecording && !isSaving && (
          isSyncingToCloud ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
              <span>Đang gửi lên Giáo viên...</span>
            </span>
          ) : submission?.syncedToCloud ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full">
              <Cloud className="w-3.5 h-3.5 text-emerald-600" />
              <span>Đã gửi lên Giáo viên (Đám mây)</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
              <CheckCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>Đã lưu trên máy (Chưa gửi đám mây)</span>
            </span>
          )
        )}
      </div>

      {/* Error alert if mic permission or saving failed */}
      {errorMessage && (
        <div className="bg-rose-50 border border-rose-300 text-rose-800 rounded-xl p-3 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span className="font-medium">{errorMessage}</span>
        </div>
      )}

      {/* ACTIVE RECORDING STATE */}
      {isRecording ? (
        <div className="bg-rose-50/70 border-2 border-dashed border-rose-300 rounded-xl p-4 space-y-3 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center recording-pulse shrink-0">
                <Mic className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-rose-950 font-mono">
                    🔴 {formatTime(recordSeconds)}
                  </span>
                  <span className="text-xs text-rose-700 font-semibold">
                    &bull; Nói to, rõ ràng theo ngữ cảnh sân bay
                  </span>
                </div>
                <p className="text-[11px] text-rose-600 mt-0.5">
                  Nội dung bạn nói đang được chuyển thành chữ và điền trực tiếp vào ô bên trên.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={handleCancelRecording}
                className="px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 transition-colors"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleStopRecording}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-500/30 flex items-center gap-1.5 transition-all"
              >
                <Square className="w-3.5 h-3.5 fill-white" />
                <span>Hoàn Tất &amp; Lưu Bản Ghi</span>
              </button>
            </div>
          </div>

          {/* Real-time recognized speech preview chip */}
          {liveTranscript && (
            <div className="bg-white/90 p-3 rounded-xl border border-rose-200 shadow-2xs space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-rose-700 uppercase tracking-wide">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Đang nghe được:</span>
              </div>
              <p className="text-sm font-bold text-slate-900 leading-snug">{liveTranscript}</p>
            </div>
          )}
        </div>
      ) : isSaving ? (
        <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 flex items-center justify-center gap-2 text-xs font-bold text-blue-800">
          <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
          <span>Đang xử lý &amp; lưu tệp ghi âm bài nói...</span>
        </div>
      ) : audioDataUrl ? (
        /* PLAYBACK STATE: NATIVE BROWSER AUDIO PLAYER */
        <div className="space-y-3 pt-1 animate-fade-in">
          <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span className="font-semibold text-slate-700">
                Trình phát âm thanh trình duyệt (Native Audio Player):
              </span>
              <span className="text-[11px] text-slate-400">
                {formatSafeTime(submission?.timestamp)}
              </span>
            </div>

            <audio
              controls
              src={audioDataUrl}
              className="w-full h-11 rounded-lg focus:outline-none"
              preload="metadata"
            >
              Trình duyệt của bạn không hỗ trợ phần tử âm thanh HTML5.
            </audio>
          </div>

          {/* Prompt to send recording to Teacher cloud inbox if not yet signed in or not synced */}
          {!user ? (
            <div className="bg-amber-50/90 border border-amber-200 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <p className="text-xs text-amber-900 font-medium">
                Bản ghi hiện mới lưu trên máy bạn. Hãy đăng nhập Google để tự động gửi file ghi âm này về <strong>Góc Giáo Viên</strong>!
              </p>
              <button
                type="button"
                onClick={signInWithGoogle}
                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shrink-0 shadow-xs transition-all cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Đăng nhập &amp; Gửi Giáo viên</span>
              </button>
            </div>
          ) : !submission?.syncedToCloud && !isSyncingToCloud ? (
            <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-3 flex items-center justify-between gap-2.5">
              <span className="text-xs text-blue-900 font-medium">
                Bấm gửi nếu bạn muốn đồng bộ lại bản ghi này lên Góc Giáo Viên:
              </span>
              <button
                type="button"
                onClick={() => syncSubmissionNow(questionId)}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shrink-0"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Gửi bài cho Giáo viên</span>
              </button>
            </div>
          ) : null}

          {/* Action buttons: Re-record, Download, Delete */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleStartRecording}
                className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold border border-blue-200 flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Thu âm lại câu này</span>
              </button>

              <a
                href={audioDataUrl}
                download={`bai_noi_${questionId}.${getDownloadExtension(audioDataUrl)}`}
                className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold border border-slate-200 flex items-center gap-1.5 transition-colors"
                title="Tải tệp âm thanh ghi âm về máy tính/điện thoại"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Tải tệp ghi âm</span>
              </a>
            </div>

            {confirmDelete ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDeleteAudio}
                  className="px-2.5 py-1 rounded-lg bg-rose-600 text-white text-[11px] font-bold hover:bg-rose-700"
                >
                  Xác nhận xóa
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="text-[11px] text-slate-500 hover:text-slate-700 font-semibold"
                >
                  Hủy
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="text-[11px] text-slate-400 hover:text-rose-600 transition-colors"
              >
                Xóa bản ghi
              </button>
            )}
          </div>

          {/* Teacher feedback notice if teacher has already inspected & graded */}
          {submission?.teacherScore !== undefined && (
            <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white rounded-xl p-3.5 border border-blue-400/20 shadow-md space-y-1.5 mt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-amber-300" />
                  <span className="text-xs font-bold text-blue-200">
                    Giáo Viên Đã Kiểm Tra &amp; Chấm Điểm
                  </span>
                </div>
                <div className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-xs shadow-xs">
                  ⭐ {submission.teacherScore.toFixed(1)} / 10
                </div>
              </div>
              <p className="text-xs text-blue-100/90 leading-relaxed font-medium">
                {submission.teacherFeedback || 'Phát âm tốt, đạt yêu cầu tình huống.'}
              </p>
            </div>
          )}
        </div>
      ) : (
        /* INITIAL STATE: PROMPT TO START RECORDING */
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <p className="text-xs text-slate-500 font-medium">
            Bấm nút micro để thu âm bài nói. Lời bạn nói sẽ tự động hiển thị trong ô nháp và giáo viên
            sẽ nghe để chấm điểm.
          </p>

          <button
            type="button"
            onClick={handleStartRecording}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-sm shadow-blue-500/20 flex items-center justify-center gap-2 transition-all shrink-0"
          >
            <Mic className="w-4 h-4 text-white" />
            <span>Bắt Đầu Ghi Âm Trực Tiếp</span>
          </button>
        </div>
      )}
    </div>
  );
};

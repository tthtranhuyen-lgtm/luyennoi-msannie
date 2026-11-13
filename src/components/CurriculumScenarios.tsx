import React, { useState, useEffect } from 'react';
import {
  Volume2,
  Square,
  ChevronDown,
  RotateCcw,
  Plane,
  Sparkles,
  BookOpen,
  Cloud,
  LogIn,
  UserCheck,
  AlertCircle,
} from 'lucide-react';
import {
  CURRICULUM_SCENARIOS,
  CurriculumScenario,
  Step1Question,
} from '../data/curriculumData';
import { speakChinese, stopSpeaking, getNativeVoiceDisplayName } from '../utils/speech';
import { AudioRecorder } from './AudioRecorder';
import { useAudioSubmissions } from '../context/AudioSubmissionsContext';

interface CurriculumScenariosProps {
  showPinyin: boolean;
  showTranslation: boolean;
  speechRate: number;
}

export const CurriculumScenarios: React.FC<CurriculumScenariosProps> = ({
  showPinyin,
  showTranslation,
  speechRate,
}) => {
  const {
    getSubmission,
    saveStudentText,
    user,
    studentDisplayName,
    setStudentDisplayName,
    signInWithGoogle,
    authError,
    cloudError,
  } = useAudioSubmissions();

  // Accordion state (open first scenario by default)
  const [openScenarioId, setOpenScenarioId] = useState<number | null>(1);

  // Audio playing states for native speech
  const [activeSpeechId, setActiveSpeechId] = useState<string | null>(null);
  const [isPlayingAll, setIsPlayingAll] = useState<string | null>(null);

  // Student notes state
  const [studentNotes, setStudentNotes] = useState<Record<string, string>>({});

  useEffect(() => {
    // Load student notes from context / localStorage
    const initialNotes: Record<string, string> = {};
    CURRICULUM_SCENARIOS.forEach((sc) => {
      sc.step1Questions.forEach((q) => {
        const sub = getSubmission(q.noteKey);
        if (sub && sub.studentText) {
          initialNotes[q.noteKey] = sub.studentText;
        } else {
          try {
            const local = localStorage.getItem('airport-notes-' + q.noteKey);
            if (local) initialNotes[q.noteKey] = local;
          } catch (e) {
            // ignore
          }
        }
      });
    });
    setStudentNotes(initialNotes);

    return () => {
      stopSpeaking();
    };
  }, []);

  const handleNoteChange = (q: Step1Question, scenario: CurriculumScenario, value: string) => {
    setStudentNotes((prev) => ({ ...prev, [q.noteKey]: value }));
    try {
      localStorage.setItem('airport-notes-' + q.noteKey, value);
    } catch (e) {
      // ignore
    }
    saveStudentText(q.noteKey, value, {
      scenarioId: scenario.id,
      scenarioTitle: scenario.title,
      questionText: q.chinese,
    });
  };

  const playSingle = (text: string, id: string) => {
    if (activeSpeechId === id) {
      stopSpeaking();
      setActiveSpeechId(null);
      setIsPlayingAll(null);
      return;
    }
    stopSpeaking();
    setIsPlayingAll(null);
    setActiveSpeechId(id);
    speakChinese(
      text,
      speechRate,
      () => setActiveSpeechId(id),
      () => setActiveSpeechId(null)
    );
  };

  const playAllLines = (lines: string[], targetId: string) => {
    if (isPlayingAll === targetId) {
      stopSpeaking();
      setIsPlayingAll(null);
      setActiveSpeechId(null);
      return;
    }
    stopSpeaking();
    setIsPlayingAll(targetId);

    let currentIndex = 0;
    const playNext = () => {
      if (currentIndex >= lines.length) {
        setIsPlayingAll(null);
        setActiveSpeechId(null);
        return;
      }
      const text = lines[currentIndex];
      currentIndex++;
      speakChinese(text, speechRate, undefined, () => {
        setTimeout(playNext, 400);
      });
    };
    playNext();
  };

  const handleStopAll = () => {
    stopSpeaking();
    setActiveSpeechId(null);
    setIsPlayingAll(null);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto px-4 sm:px-6 py-6">
      {/* Intro Aviation Banner */}
      <div className="glass-panel-navy rounded-3xl p-6 sm:p-7 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-semibold text-blue-200">
              <Plane className="w-3.5 h-3.5 -rotate-45 text-amber-300" />
              <span>Quy trình luyện nói 2 bước &bull; Tích hợp thành phần AudioRecorder</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              🎬 6 Tình Huống Luyện Nói Khẩu Ngữ Sân Bay Thực Tế
            </h2>
            <p className="text-xs sm:text-sm text-blue-100/90 max-w-2xl leading-relaxed">
              <strong>Bước 1:</strong> Nghe câu hỏi giọng bản xứ, sử dụng thành phần{' '}
              <strong>AudioRecorder</strong> để ghi âm trực tiếp và phát lại bản ghi của bạn bằng trình
              phát native của trình duyệt.<br />
              <strong>Bước 2:</strong> Đối chiếu với đáp án chuẩn. Mọi bản ghi được tự động lưu vào
              hệ thống để giáo viên có thể kiểm tra và chấm điểm tại tab <strong>Góc Giáo Viên</strong>!
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-2 shrink-0">
            <div className="text-[11px] bg-slate-900/60 border border-slate-700/80 px-3 py-1.5 rounded-xl text-blue-200">
              🎙 {getNativeVoiceDisplayName()}
            </div>
            <button
              onClick={handleStopAll}
              className="text-xs bg-rose-500/20 text-rose-200 hover:bg-rose-500/40 font-bold px-3 py-1.5 rounded-xl border border-rose-400/30 transition-all flex items-center gap-1"
            >
              <Square className="w-3 h-3 fill-rose-300" />
              <span>Dừng tất cả âm thanh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Student Identity & Cloud Sync Status Bar */}
      <div className="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/90 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1 space-y-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-blue-600" />
            <span>Họ và tên học sinh (hiển thị cho giáo viên khi gửi bài ghi âm):</span>
          </label>
          <input
            type="text"
            value={studentDisplayName}
            onChange={(e) => setStudentDisplayName(e.target.value)}
            placeholder="Ví dụ: Nguyễn Minh Anh - Lớp 10A1"
            maxLength={100}
            className="w-full sm:max-w-md px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 shrink-0">
          {user ? (
            <div className="px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <Cloud className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Đã kết nối đám mây: mọi bản ghi âm sẽ tự động gửi về cho Giáo viên</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={signInWithGoogle}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Đăng nhập Google để gửi bài ghi âm cho Giáo viên</span>
            </button>
          )}
        </div>
      </div>

      {(authError || cloudError) && (
        <div className="bg-rose-50 border border-rose-300 text-rose-800 rounded-2xl p-4 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1 font-medium">
            {authError && <p>{authError}</p>}
            {cloudError && <p>{cloudError}</p>}
          </div>
        </div>
      )}

      {/* 6 Scenarios list */}
      <div className="space-y-6">
        {CURRICULUM_SCENARIOS.map((sc) => {
          const isOpen = openScenarioId === sc.id;
          return (
            <article
              key={sc.id}
              className={`glass-card rounded-3xl border transition-all duration-300 overflow-hidden shadow-sm hover:shadow-md ${
                isOpen ? 'border-blue-500/40 ring-4 ring-blue-500/10' : 'border-slate-200'
              }`}
            >
              {/* Accordion Head */}
              <div
                onClick={() => setOpenScenarioId(isOpen ? null : sc.id)}
                className="flex items-center gap-4 p-5 sm:p-6 cursor-pointer select-none bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 text-white transition-colors"
              >
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-black text-lg flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/30">
                  {sc.id}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                    {sc.title}
                  </h3>
                  <p className="text-xs text-blue-200/80 mt-0.5">{sc.subTitle}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="hidden sm:inline-block text-[11px] font-semibold text-blue-200 bg-white/10 px-3 py-1 rounded-full border border-white/15">
                    {sc.step1Questions.length} câu hỏi thực hành
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-blue-300 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </div>

              {/* Accordion Body */}
              {isOpen && (
                <div className="p-5 sm:p-7 space-y-6 animate-fade-in bg-slate-50/50">
                  {/* Context Block */}
                  <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-1">
                    <span className="inline-block text-[11px] font-extrabold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md">
                      Bối cảnh tình huống
                    </span>
                    <p className="text-sm text-slate-700 leading-relaxed font-medium">{sc.context}</p>
                  </div>

                  {/* Roles & Tasks Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
                      <span className="inline-block text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md mb-2">
                        Nhân vật
                      </span>
                      <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700">
                        {sc.roles.map((r, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-emerald-600 font-bold">&bull;</span>
                            <span>
                              <strong className="text-slate-900">{r.name}:</strong> {r.description}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
                      <span className="inline-block text-[11px] font-extrabold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-md mb-2">
                        Mục tiêu luyện nói
                      </span>
                      <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700">
                        {sc.tasks.map((task, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-amber-600 font-bold">▸</span>
                            <span>{task}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* BƯỚC 1: TỰ TRẢ LỜI & GHI ÂM (TÍCH HỢP THÀNH PHẦN AUDIORECORDER) */}
                  <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-blue-200/90 shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-blue-100 pb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-xl bg-blue-600 text-white shadow-xs">
                          BƯỚC 1
                        </span>
                        <div>
                          <h4 className="text-base sm:text-lg font-extrabold text-blue-950 flex items-center gap-1.5">
                            <span>🎙 Tự Trả Lời &amp; Ghi Âm Trực Tiếp</span>
                          </h4>
                          <span className="text-xs text-slate-500 font-medium">
                            Nghe câu hỏi bản xứ → Thu âm trực tiếp &bull; Phát lại bằng native audio player
                          </span>
                        </div>
                      </div>

                      {/* Play all questions button */}
                      <button
                        onClick={() =>
                          playAllLines(
                            sc.step1Questions.map((q) => q.chinese),
                            `free-${sc.id}`
                          )
                        }
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 self-start sm:self-auto ${
                          isPlayingAll === `free-${sc.id}`
                            ? 'bg-amber-500 text-white animate-pulse'
                            : 'bg-slate-900 hover:bg-blue-900 text-white shadow-sm'
                        }`}
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>
                          {isPlayingAll === `free-${sc.id}` ? 'Đang phát...' : '▶ Nghe tất cả câu hỏi'}
                        </span>
                      </button>
                    </div>

                    <div className="space-y-5 pt-1">
                      {sc.step1Questions.map((q) => {
                        const noteVal = studentNotes[q.noteKey] || '';

                        return (
                          <div
                            key={q.id}
                            className="bg-slate-50/70 rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3"
                          >
                            {/* Question row */}
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-start gap-3">
                                <button
                                  onClick={() => playSingle(q.chinese, `q-${q.id}`)}
                                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                                    activeSpeechId === `q-${q.id}`
                                      ? 'bg-amber-500 text-white animate-pulse'
                                      : 'bg-blue-100 text-blue-800 hover:bg-blue-600 hover:text-white'
                                  }`}
                                  title="Nghe phát âm chuẩn người bản xứ"
                                >
                                  <Volume2 className="w-4 h-4" />
                                </button>
                                <div>
                                  <div className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                                    {q.chinese}
                                  </div>
                                  {showPinyin && (
                                    <div className="text-xs font-mono text-slate-500 mt-0.5">
                                      {q.pinyin}
                                    </div>
                                  )}
                                  {showTranslation && (
                                    <div className="text-xs text-slate-600 mt-1">{q.vietnamese}</div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Ghi chú / Nháp câu trả lời tự động cập nhật theo bản ghi âm */}
                            <div className="space-y-1.5 pt-1">
                              <div className="flex items-center justify-between text-xs text-slate-700 font-bold">
                                <span className="flex items-center gap-1.5">
                                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                                  <span>Ghi chú / Nháp câu trả lời (Tự động điền khi bạn ghi âm):</span>
                                </span>
                                {noteVal && (
                                  <button
                                    onClick={() => handleNoteChange(q, sc, '')}
                                    className="text-slate-400 hover:text-slate-600 flex items-center gap-1 text-[11px] font-normal"
                                  >
                                    <RotateCcw className="w-3 h-3" />
                                    <span>Xóa nội dung</span>
                                  </button>
                                )}
                              </div>
                              <textarea
                                value={noteVal}
                                onChange={(e) => handleNoteChange(q, sc, e.target.value)}
                                placeholder="🎙 Khi bạn bấm thu âm ở bên dưới, nội dung tiếng Trung bạn nói sẽ tự động hiển thị tại đây (bạn cũng có thể chỉnh sửa gõ thêm)..."
                                rows={2}
                                className="w-full px-3 py-2.5 bg-white rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none resize-none leading-relaxed transition-all shadow-2xs"
                              />
                            </div>

                            {/* DEDICATED AudioRecorder COMPONENT */}
                            <AudioRecorder
                              scenarioId={sc.id}
                              scenarioTitle={sc.title}
                              questionId={q.noteKey}
                              questionText={q.chinese}
                              studentText={noteVal}
                              onTranscriptRecorded={(transcript) => {
                                handleNoteChange(q, sc, transcript);
                              }}
                              className="mt-2"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* BƯỚC 2: HƯỚNG DẪN TRẢ LỜI CHUẨN */}
                  <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-emerald-200 shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-100 pb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-xl bg-emerald-600 text-white shadow-xs">
                          BƯỚC 2
                        </span>
                        <div>
                          <h4 className="text-base sm:text-lg font-extrabold text-emerald-950">
                            📖 Hướng Dẫn Trả Lời Chuẩn Của Người Bản Xứ
                          </h4>
                          <span className="text-xs text-slate-500 font-medium">
                            Đối chiếu với mẫu câu trả lời chuẩn xác và ngữ điệu tự nhiên
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          playAllLines(
                            sc.step2QAPairs.flatMap((qa) => [
                              qa.question.chinese,
                              qa.answer.chinese,
                            ]),
                            `guide-${sc.id}`
                          )
                        }
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 self-start sm:self-auto ${
                          isPlayingAll === `guide-${sc.id}`
                            ? 'bg-amber-500 text-white animate-pulse'
                            : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm'
                        }`}
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>
                          {isPlayingAll === `guide-${sc.id}`
                            ? 'Đang phát...'
                            : '▶ Nghe tất cả câu chuẩn'}
                        </span>
                      </button>
                    </div>

                    <div className="space-y-4 pt-1">
                      {sc.step2QAPairs.map((qa) => (
                        <div
                          key={qa.id}
                          className="bg-emerald-50/40 rounded-2xl border border-emerald-200/80 p-4 sm:p-5 space-y-3 shadow-xs"
                        >
                          {/* Question */}
                          <div className="flex items-start gap-3">
                            <button
                              onClick={() => playSingle(qa.question.chinese, `q-${qa.id}`)}
                              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                                activeSpeechId === `q-${qa.id}`
                                  ? 'bg-amber-500 text-white animate-pulse'
                                  : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-600 hover:text-white'
                              }`}
                              title="Nghe câu hỏi"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                            <div>
                              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md inline-block mb-1">
                                Câu hỏi
                              </span>
                              <div className="text-sm font-bold text-slate-900 leading-snug">
                                {qa.question.chinese}
                              </div>
                              {showPinyin && (
                                <div className="text-xs font-mono text-emerald-800 mt-0.5">
                                  {qa.question.pinyin}
                                </div>
                              )}
                              {showTranslation && (
                                <div className="text-xs text-slate-600 mt-0.5">
                                  {qa.question.vietnamese}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Model Answer */}
                          <div className="flex items-start gap-3 bg-white/90 p-3.5 rounded-xl border border-emerald-200">
                            <button
                              onClick={() => playSingle(qa.answer.chinese, `ans-${qa.id}`)}
                              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                                activeSpeechId === `ans-${qa.id}`
                                  ? 'bg-amber-500 text-white animate-pulse'
                                  : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
                              }`}
                              title="Nghe câu trả lời mẫu chuẩn"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                            <div>
                              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-900 bg-emerald-200/80 px-2 py-0.5 rounded-md inline-block mb-1">
                                Câu trả lời mẫu chuẩn
                              </span>
                              <div className="text-sm font-bold text-emerald-950 leading-snug">
                                {qa.answer.chinese}
                              </div>
                              {showPinyin && (
                                <div className="text-xs font-mono text-emerald-800 mt-0.5">
                                  {qa.answer.pinyin}
                                </div>
                              )}
                              {showTranslation && (
                                <div className="text-xs text-slate-700 mt-0.5">
                                  {qa.answer.vietnamese}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Hội Thoại Mẫu Đầy Đủ & Ghi Âm Tổng Thể */}
                  <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div>
                        <h4 className="text-base font-extrabold text-slate-900">
                          💬 Hội Thoại Mẫu Toàn Cảnh
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Nghe trọn vẹn đoạn hội thoại giữa nhân viên hàng không và hành khách
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          playAllLines(
                            sc.fullDialogue.map((d) => `${d.speaker}: ${d.chinese}`),
                            `dialogue-${sc.id}`
                          )
                        }
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                          isPlayingAll === `dialogue-${sc.id}`
                            ? 'bg-amber-500 text-white animate-pulse'
                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                        }`}
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>
                          {isPlayingAll === `dialogue-${sc.id}`
                            ? 'Đang phát hội thoại...'
                            : '▶ Nghe cả đoạn'}
                        </span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {sc.fullDialogue.map((line, dIdx) => (
                        <div
                          key={dIdx}
                          className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100"
                        >
                          <button
                            onClick={() => playSingle(line.chinese, `dial-${sc.id}-${dIdx}`)}
                            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                              activeSpeechId === `dial-${sc.id}-${dIdx}`
                                ? 'bg-amber-500 text-white'
                                : 'bg-white text-slate-700 hover:bg-blue-600 hover:text-white border border-slate-200'
                            }`}
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                          <div className="flex-1">
                            <span className="text-xs font-extrabold text-blue-900 block mb-0.5">
                              {line.speaker}:
                            </span>
                            <div className="text-sm font-bold text-slate-900">{line.chinese}</div>
                            {showPinyin && (
                              <div className="text-xs font-mono text-slate-500 mt-0.5">
                                {line.pinyin}
                              </div>
                            )}
                            {showTranslation && (
                              <div className="text-xs text-slate-600 mt-1">{line.vietnamese}</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Scenario Master Recording */}
                    <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                      <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span>Thu âm thực hành trọn vẹn tình huống này:</span>
                      </div>
                      {studentNotes[`dialogue-full-${sc.id}`] && (
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 font-medium">
                          <span className="font-bold text-slate-600 block mb-0.5">Nội dung ghi âm nhận dạng được:</span>
                          {studentNotes[`dialogue-full-${sc.id}`]}
                        </div>
                      )}
                      <AudioRecorder
                        scenarioId={sc.id}
                        scenarioTitle={sc.title}
                        questionId={`dialogue-full-${sc.id}`}
                        questionText={`Luyện nói trọn vẹn tình huống ${sc.id}: ${sc.title}`}
                        studentText={studentNotes[`dialogue-full-${sc.id}`] || ''}
                        onTranscriptRecorded={(transcript) => {
                          setStudentNotes((prev) => ({ ...prev, [`dialogue-full-${sc.id}`]: transcript }));
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
};

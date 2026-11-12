import React, { useState, useEffect, useRef } from 'react';
import {
  Zap,
  Volume2,
  Mic,
  MicOff,
  Sparkles,
  Clock,
  ArrowRight,
  HelpCircle,
  Radio,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { QUICK_CHALLENGES, AIRPORT_ANNOUNCEMENTS } from '../data/chineseData';
import { speakChinese, stopSpeaking, ChineseSpeechRecognizer } from '../utils/speech';

interface QuickReflexChallengeProps {
  showPinyin: boolean;
  showTranslation: boolean;
  speechRate: number;
}

export const QuickReflexChallenge: React.FC<QuickReflexChallengeProps> = ({
  showPinyin,
  showTranslation,
  speechRate,
}) => {
  const [subTab, setSubTab] = useState<'reflex' | 'broadcast'>('reflex');

  // Reflex state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(25);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [userSpeech, setUserSpeech] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<any | null>(null);
  const [showHint, setShowHint] = useState(false);

  // Broadcast state
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(AIRPORT_ANNOUNCEMENTS[0]);
  const [isPlayingAnn, setIsPlayingAnn] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);

  const currentChallenge = QUICK_CHALLENGES[currentIndex];
  const timerRef = useRef<any>(null);
  const speechRecognizerRef = useRef<ChineseSpeechRecognizer | null>(null);

  useEffect(() => {
    speechRecognizerRef.current = new ChineseSpeechRecognizer();
    return () => {
      stopSpeaking();
      if (timerRef.current) clearInterval(timerRef.current);
      if (speechRecognizerRef.current) speechRecognizerRef.current.stopListening();
    };
  }, []);

  useEffect(() => {
    if (subTab !== 'reflex') return;
    setUserSpeech('');
    setEvaluation(null);
    setShowHint(false);
    setTimeLeft(25);
    setIsTimerRunning(true);

    setTimeout(() => {
      speakChinese(currentChallenge.questionChinese, speechRate);
    }, 400);

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setIsTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, subTab]);

  const toggleRecording = () => {
    if (!speechRecognizerRef.current) return;

    if (isRecording) {
      speechRecognizerRef.current.stopListening();
      setIsRecording(false);
    } else {
      setIsRecording(true);
      setUserSpeech('');
      speechRecognizerRef.current.startListening({
        onStart: () => setIsRecording(true),
        onResult: (transcript, isFinal) => {
          setUserSpeech(transcript);
          if (isFinal) {
            setIsRecording(false);
          }
        },
        onError: () => setIsRecording(false),
        onEnd: () => setIsRecording(false),
      });
    }
  };

  const handleEvaluate = async () => {
    if (!userSpeech.trim() || isEvaluating) return;

    if (timerRef.current) clearInterval(timerRef.current);
    setIsTimerRunning(false);
    setIsEvaluating(true);

    try {
      const response = await fetch('/api/evaluate-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userText: userSpeech.trim(),
          targetText: currentChallenge.hintChinese,
          context: `Phản xạ nhanh tại: ${currentChallenge.scenario}. Câu hỏi: "${currentChallenge.questionChinese}". Từ vựng cần thiết: ${currentChallenge.targetKeywords.join(', ')}`,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setEvaluation(data.evaluation);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const nextChallenge = () => {
    setCurrentIndex((prev) => (prev + 1) % QUICK_CHALLENGES.length);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Sub tabs switcher */}
      <div className="flex items-center justify-center gap-2 bg-slate-200/80 p-1.5 rounded-2xl w-fit mx-auto border border-slate-300">
        <button
          onClick={() => {
            stopSpeaking();
            setSubTab('reflex');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            subTab === 'reflex'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-700 hover:text-blue-700'
          }`}
        >
          <Zap className="w-4 h-4 text-amber-400" />
          <span>Phản Xạ Nhanh 25s</span>
        </button>

        <button
          onClick={() => {
            stopSpeaking();
            setSubTab('broadcast');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            subTab === 'broadcast'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-700 hover:text-blue-700'
          }`}
        >
          <Radio className="w-4 h-4 text-emerald-400" />
          <span>Nghe Loa Sân Bay</span>
        </button>
      </div>

      {subTab === 'reflex' ? (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider text-amber-800 font-bold">
                  Thử Thách Áp Lực Sân Bay
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  Phòng Phản Xạ Khẩu Ngữ (25 Giây)
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-slate-100 px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs">
                <Clock
                  className={`w-4 h-4 ${timeLeft <= 5 ? 'text-rose-500 animate-ping' : 'text-amber-600'}`}
                />
                <span className="text-slate-500">Còn lại:</span>
                <span
                  className={`font-mono font-bold text-sm ${timeLeft <= 5 ? 'text-rose-600 font-black' : 'text-slate-900'}`}
                >
                  {timeLeft}s
                </span>
              </div>

              <span className="text-xs text-slate-500 font-bold">
                Câu {currentIndex + 1}/{QUICK_CHALLENGES.length}
              </span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-800">
                {currentChallenge.scenario}
              </span>
              <button
                onClick={() => speakChinese(currentChallenge.questionChinese, speechRate)}
                className="text-xs text-blue-700 hover:text-blue-800 font-bold flex items-center gap-1.5 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200"
              >
                <Volume2 className="w-4 h-4" />
                <span>Phát lại câu hỏi</span>
              </button>
            </div>

            <div className="space-y-2 bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <p className="text-xl sm:text-2xl font-bold text-slate-900 leading-relaxed">
                {currentChallenge.questionChinese}
              </p>
              {showPinyin && (
                <p className="text-xs font-mono text-blue-700">{currentChallenge.questionPinyin}</p>
              )}
              {showTranslation && (
                <p className="text-xs text-slate-600 pt-1 border-t border-slate-200">
                  {currentChallenge.questionVietnamese}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Câu trả lời phản xạ của bạn:</span>
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="text-amber-700 hover:text-amber-800 flex items-center gap-1 font-bold"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{showHint ? 'Ẩn gợi ý' : 'Xem gợi ý câu mẫu'}</span>
                </button>
              </div>

              {showHint && (
                <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs text-amber-900 animate-fade-in">
                  <strong>Gợi ý: </strong>
                  {currentChallenge.hintChinese}
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={toggleRecording}
                  className={`p-4 rounded-2xl font-bold flex items-center justify-center transition-all shrink-0 ${
                    isRecording
                      ? 'bg-rose-500 text-white animate-pulse shadow-md'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                  }`}
                  title={isRecording ? 'Đang nghe...' : 'Bật micro'}
                >
                  {isRecording ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6 text-blue-600" />}
                </button>

                <textarea
                  value={userSpeech}
                  onChange={(e) => setUserSpeech(e.target.value)}
                  placeholder="Nói to hoặc gõ câu trả lời tiếng Trung của bạn..."
                  rows={2}
                  className="flex-1 bg-slate-50 text-slate-900 p-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500 placeholder:text-slate-400 resize-none font-medium"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleEvaluate}
                  disabled={!userSpeech.trim() || isEvaluating}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 disabled:opacity-40 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>{isEvaluating ? 'AI đang phân tích...' : 'Nộp Câu Trả Lời & Xem Điểm'}</span>
                </button>

                <button
                  onClick={nextChallenge}
                  className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <span>Câu kế tiếp</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {evaluation && (
              <div className="bg-gradient-to-br from-amber-50 to-orange-50/70 border border-amber-200 rounded-2xl p-5 text-xs space-y-3 animate-fade-in text-slate-800 shadow-sm">
                <div className="flex items-center justify-between border-b border-amber-200/80 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-amber-900">Kết quả phản xạ:</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900 font-black">
                      {evaluation.fluencyLevel}
                    </span>
                  </div>
                  <div className="text-xl font-black text-amber-700">
                    {evaluation.score}
                    <span className="text-xs text-slate-500">/100đ</span>
                  </div>
                </div>

                <p className="text-slate-700 leading-relaxed font-medium">
                  {evaluation.feedbackVi}
                </p>

                {evaluation.pronunciationTipsVi && (
                  <div className="bg-white p-2.5 rounded-xl border border-amber-200 text-slate-700">
                    <strong className="text-amber-900 block mb-0.5">Lời khuyên phát âm:</strong>
                    <span>{evaluation.pronunciationTipsVi}</span>
                  </div>
                )}

                {evaluation.betterAlternative && (
                  <div className="bg-white p-3 rounded-xl border border-amber-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-900">Cách trả lời tự nhiên nhất:</span>
                      <button
                        onClick={() => speakChinese(evaluation.betterAlternative, speechRate)}
                        className="text-amber-700 hover:text-amber-800 flex items-center gap-1 font-bold"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Nghe</span>
                      </button>
                    </div>
                    <p className="text-sm font-bold text-slate-900">{evaluation.betterAlternative}</p>
                    <p className="text-[11px] font-mono text-blue-700">
                      {evaluation.betterAlternativePinyin}
                    </p>
                    <p className="text-[11px] text-slate-600">{evaluation.betterAlternativeVi}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Broadcast Tab */
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-1">
                Bản tin phát thanh:
              </span>
              <h3 className="text-xl font-bold text-slate-900">{selectedAnnouncement.title}</h3>
            </div>

            <button
              onClick={() => {
                setIsPlayingAnn(true);
                speakChinese(
                  selectedAnnouncement.chinese,
                  speechRate,
                  () => setIsPlayingAnn(true),
                  () => setIsPlayingAnn(false)
                );
              }}
              className={`px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all shadow-xs ${
                isPlayingAnn
                  ? 'bg-amber-400 text-slate-950 animate-pulse'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              <Volume2 className="w-5 h-5" />
              <span>{isPlayingAnn ? 'Đang phát loa sân bay...' : 'Nghe bản tin loa'}</span>
            </button>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
            <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
              {selectedAnnouncement.chinese}
            </p>
            {showPinyin && (
              <p className="text-xs font-mono text-emerald-800 leading-relaxed">
                {selectedAnnouncement.pinyin}
              </p>
            )}
            {showTranslation && (
              <p className="text-xs text-slate-600 pt-2 border-t border-slate-200 leading-relaxed">
                {selectedAnnouncement.vietnamese}
              </p>
            )}
          </div>

          <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200 space-y-3">
            <h4 className="text-sm font-bold text-emerald-900">
              Câu hỏi kiểm tra phản xạ nghe hiểu:
            </h4>
            <p className="text-sm font-semibold text-slate-900">
              {selectedAnnouncement.quiz.question}
            </p>

            <div className="space-y-2">
              {selectedAnnouncement.quiz.options.map((opt, i) => {
                const isSelected = selectedOption === i;
                const isCorrect = i === selectedAnnouncement.quiz.correctIndex;
                let btnStyle = 'bg-white text-slate-700 border-slate-200 hover:border-slate-300';

                if (isAnswerSubmitted) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-100 border-emerald-500 text-emerald-900 font-bold';
                  } else if (isSelected && !isCorrect) {
                    btnStyle = 'bg-rose-100 border-rose-400 text-rose-800 line-through';
                  }
                } else if (isSelected) {
                  btnStyle = 'bg-blue-50 border-blue-500 text-blue-900 font-bold';
                }

                return (
                  <button
                    key={i}
                    disabled={isAnswerSubmitted}
                    onClick={() => setSelectedOption(i)}
                    className={`w-full p-3.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {isAnswerSubmitted && isCorrect && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                    )}
                    {isAnswerSubmitted && isSelected && !isCorrect && (
                      <XCircle className="w-4 h-4 text-rose-500 shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>

            {!isAnswerSubmitted ? (
              <button
                onClick={() => {
                  if (selectedOption !== null) setIsAnswerSubmitted(true);
                }}
                disabled={selectedOption === null}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold text-xs shadow-xs transition-all"
              >
                Kiểm tra đáp án
              </button>
            ) : (
              <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs flex items-center justify-between">
                <span className="text-slate-700">
                  {selectedOption === selectedAnnouncement.quiz.correctIndex
                    ? '🎉 Chính xác! Bạn đã nghe bắt được thông tin quan trọng của loa sân bay.'
                    : '💡 Chưa đúng, bạn hãy bấm nghe lại loa và đọc lại từ khóa nhé.'}
                </span>
                <button
                  onClick={() => {
                    setSelectedOption(null);
                    setIsAnswerSubmitted(false);
                  }}
                  className="text-blue-600 hover:text-blue-700 font-bold ml-2 underline shrink-0"
                >
                  Làm lại
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

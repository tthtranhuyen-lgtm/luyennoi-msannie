import React, { useState } from 'react';
import { Radio, Volume2, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { AIRPORT_ANNOUNCEMENTS } from '../data/chineseData';
import { speakChinese, stopSpeaking } from '../utils/speech';

interface BroadcastSimulatorProps {
  showPinyin: boolean;
  showTranslation: boolean;
  speechRate: number;
}

export const BroadcastSimulator: React.FC<BroadcastSimulatorProps> = ({
  showPinyin,
  showTranslation,
  speechRate,
}) => {
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(AIRPORT_ANNOUNCEMENTS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);

  const handlePlayAnnouncement = (text: string) => {
    stopSpeaking();
    setIsPlaying(true);
    speakChinese(
      text,
      speechRate,
      () => setIsPlaying(true),
      () => setIsPlaying(false)
    );
  };

  const handleSelectAnnouncement = (ann: (typeof AIRPORT_ANNOUNCEMENTS)[0]) => {
    stopSpeaking();
    setSelectedAnnouncement(ann);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setIsPlaying(false);
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswerSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
            <Radio className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold">
              Mô Phỏng Loa Phát Thanh Nhà Ga
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Luyện Nghe Loa Sân Bay (机场广播)
            </h2>
          </div>
        </div>

        {/* Tab selection */}
        <div className="flex items-center gap-2 bg-slate-800 p-1.5 rounded-2xl border border-slate-700">
          {AIRPORT_ANNOUNCEMENTS.map((ann, idx) => (
            <button
              key={ann.id}
              onClick={() => handleSelectAnnouncement(ann)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedAnnouncement.id === ann.id
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Loa #{idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Broadcast Speaker Simulation Box */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1">
              Bản tin phát thanh:
            </span>
            <h3 className="text-xl font-bold text-white">{selectedAnnouncement.title}</h3>
          </div>

          <button
            onClick={() => handlePlayAnnouncement(selectedAnnouncement.chinese)}
            className={`px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg ${
              isPlaying
                ? 'bg-amber-400 text-slate-950 animate-pulse'
                : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20'
            }`}
          >
            <Volume2 className="w-5 h-5" />
            <span>{isPlaying ? 'Đang phát loa sân bay...' : 'Nghe bản tin loa'}</span>
          </button>
        </div>

        {/* Announcement Script */}
        <div className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700/60 space-y-3">
          <p className="text-lg font-medium text-white leading-relaxed">
            {selectedAnnouncement.chinese}
          </p>
          {showPinyin && (
            <p className="text-xs font-mono text-sky-300 leading-relaxed">
              {selectedAnnouncement.pinyin}
            </p>
          )}
          {showTranslation && (
            <p className="text-xs text-slate-300 pt-2 border-t border-slate-700/60 leading-relaxed">
              {selectedAnnouncement.vietnamese}
            </p>
          )}
        </div>

        {/* Comprehension Quiz */}
        <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-4">
          <h4 className="text-sm font-bold text-emerald-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Câu hỏi kiểm tra phản xạ nghe hiểu:
          </h4>
          <p className="text-sm font-semibold text-white">
            {selectedAnnouncement.quiz.question}
          </p>

          <div className="space-y-2">
            {selectedAnnouncement.quiz.options.map((opt, i) => {
              const isSelected = selectedOption === i;
              const isCorrect = i === selectedAnnouncement.quiz.correctIndex;
              let btnStyle = 'bg-slate-900/80 text-slate-300 border-slate-700 hover:border-slate-600';

              if (isAnswerSubmitted) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold';
                } else if (isSelected && !isCorrect) {
                  btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-300 line-through';
                }
              } else if (isSelected) {
                btnStyle = 'bg-sky-500/20 border-sky-500 text-sky-200 font-bold';
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
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                  )}
                  {isAnswerSubmitted && isSelected && !isCorrect && (
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>

          {!isAnswerSubmitted ? (
            <button
              onClick={handleCheckAnswer}
              disabled={selectedOption === null}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:opacity-40 text-white font-bold text-xs shadow-md transition-all"
            >
              Kiểm tra đáp án
            </button>
          ) : (
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs flex items-center justify-between">
              <span className="text-slate-300">
                {selectedOption === selectedAnnouncement.quiz.correctIndex
                  ? '🎉 Chính xác! Bạn đã nghe bắt được thông tin quan trọng của loa sân bay.'
                  : '💡 Chưa đúng, bạn hãy bấm nghe lại loa và đọc lại từ khóa nhé.'}
              </span>
              <button
                onClick={() => {
                  setSelectedOption(null);
                  setIsAnswerSubmitted(false);
                }}
                className="text-sky-400 hover:text-sky-300 font-bold ml-2 underline shrink-0"
              >
                Làm lại
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

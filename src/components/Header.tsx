import React from 'react';
import { Plane, Languages, BookOpen, GraduationCap, Zap, Square, Volume2 } from 'lucide-react';
import { stopSpeaking, getNativeVoiceDisplayName } from '../utils/speech';

interface HeaderProps {
  activeTab: 'curriculum' | 'teacher' | 'vocabulary' | 'reflex';
  setActiveTab: (tab: 'curriculum' | 'teacher' | 'vocabulary' | 'reflex') => void;
  showPinyin: boolean;
  setShowPinyin: (show: boolean) => void;
  showTranslation: boolean;
  setShowTranslation: (show: boolean) => void;
  speechRate: number;
  setSpeechRate: (rate: number) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  showPinyin,
  setShowPinyin,
  showTranslation,
  setShowTranslation,
  speechRate,
  setSpeechRate,
}) => {
  return (
    <header className="relative bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 text-white shadow-xl border-b border-blue-900/50">
      {/* Decorative background watermark with its own overflow-hidden to prevent cutting off outer elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        <div className="absolute -right-10 -top-14 text-[200px] font-black opacity-[0.04] rotate-[-20deg]">
          ✈
        </div>
        <div className="absolute left-1/4 -bottom-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Main Brand & Hero Title */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-12 text-center relative z-10">
        <div className="inline-flex items-center gap-2 bg-blue-500/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide text-sky-200 border border-blue-400/30 mb-3.5 shadow-sm">
          <Plane className="w-3.5 h-3.5 -rotate-45 text-amber-300" />
          <span>Hệ Thống Luyện Khẩu Ngữ Sân Bay &bull; Giọng Bản Xứ Người Thật</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white drop-shadow-sm">
          ✈️ 机场口语练习
        </h1>
        <p className="text-sm sm:text-lg font-bold text-sky-200 mt-1.5">
          Luyện Nói Tiếng Trung Chủ Đề Sân Bay &bull; HanYu FeiXing
        </p>
        <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl mx-auto font-normal leading-relaxed">
          6 tình huống thực tế &bull; Quy trình 2 bước (Tự trả lời &amp; Thu âm → Đối chiếu đáp án) &bull;
          Nghe lại bài nói &bull; Giáo viên kiểm tra &amp; chấm điểm trực tiếp
        </p>

        {/* Native Speaker Audio Badge */}
        <div className="inline-flex items-center gap-2 mt-3.5 px-3.5 py-1 rounded-full bg-slate-900/90 border border-blue-400/30 text-[11px] text-blue-200 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <Volume2 className="w-3 h-3 text-sky-300" />
          <span>Đồng bộ âm thanh: {getNativeVoiceDisplayName()}</span>
        </div>
      </div>

      {/* Standalone Navigation & Controls Bar */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-6 relative z-30">
        <nav aria-label="Điều hướng chính" className="bg-white rounded-2xl shadow-xl border border-slate-200/90 p-3 sm:p-4 text-slate-700">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3.5">
            {/* Primary Module Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
              <button
                onClick={() => setActiveTab('curriculum')}
                className={`px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shrink-0 ${
                  activeTab === 'curriculum'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30 ring-2 ring-blue-600/20'
                    : 'text-slate-600 hover:text-blue-700 hover:bg-blue-50/80 bg-slate-50/80 border border-slate-200/70'
                }`}
              >
                <span>🎬 6 Bài Luyện Nói 2 Bước</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-md font-extrabold ${
                    activeTab === 'curriculum'
                      ? 'bg-amber-300 text-slate-950'
                      : 'bg-amber-100 text-amber-900'
                  }`}
                >
                  Chính
                </span>
              </button>

              <button
                onClick={() => setActiveTab('teacher')}
                className={`px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shrink-0 ${
                  activeTab === 'teacher'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30 ring-2 ring-blue-600/20'
                    : 'text-slate-600 hover:text-blue-700 hover:bg-blue-50/80 bg-slate-50/80 border border-slate-200/70'
                }`}
              >
                <GraduationCap
                  className={`w-4 h-4 ${activeTab === 'teacher' ? 'text-amber-300' : 'text-amber-600'}`}
                />
                <span>Góc Giáo Viên (Kiểm Tra)</span>
              </button>

              <button
                onClick={() => setActiveTab('vocabulary')}
                className={`px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shrink-0 ${
                  activeTab === 'vocabulary'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30 ring-2 ring-blue-600/20'
                    : 'text-slate-600 hover:text-blue-700 hover:bg-blue-50/80 bg-slate-50/80 border border-slate-200/70'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>12 Từ Vựng &amp; 36 Mẫu Câu</span>
              </button>

              <button
                onClick={() => setActiveTab('reflex')}
                className={`px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shrink-0 ${
                  activeTab === 'reflex'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30 ring-2 ring-blue-600/20'
                    : 'text-slate-600 hover:text-blue-700 hover:bg-blue-50/80 bg-slate-50/80 border border-slate-200/70'
                }`}
              >
                <Zap
                  className={`w-4 h-4 ${activeTab === 'reflex' ? 'text-amber-300' : 'text-amber-500'}`}
                />
                <span>Phản Xạ &amp; Loa Sân Bay</span>
              </button>
            </div>

            {/* Quick Learning Aids & Controls */}
            <div className="flex items-center gap-2 text-xs flex-wrap justify-start lg:justify-end pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
              {/* Pinyin Toggle */}
              <button
                onClick={() => setShowPinyin(!showPinyin)}
                className={`px-3 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 border shadow-xs ${
                  showPinyin
                    ? 'bg-sky-50 text-sky-800 border-sky-300 ring-1 ring-sky-300'
                    : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                }`}
                title="Bật hoặc tắt phiên âm Pinyin"
              >
                <Languages className="w-3.5 h-3.5 text-sky-600" />
                <span>Pinyin: <strong className={showPinyin ? 'text-sky-900' : 'text-slate-500'}>{showPinyin ? 'BẬT' : 'TẮT'}</strong></span>
              </button>

              {/* Translation Toggle */}
              <button
                onClick={() => setShowTranslation(!showTranslation)}
                className={`px-3 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 border shadow-xs ${
                  showTranslation
                    ? 'bg-indigo-50 text-indigo-800 border-indigo-300 ring-1 ring-indigo-300'
                    : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                }`}
                title="Bật hoặc tắt dịch nghĩa tiếng Việt"
              >
                <span>Dịch: <strong className={showTranslation ? 'text-indigo-900' : 'text-slate-500'}>{showTranslation ? 'BẬT' : 'TẮT'}</strong></span>
              </button>

              {/* Speech Speed Rate */}
              <div className="flex items-center bg-slate-100/90 rounded-xl p-1 border border-slate-200 shadow-xs">
                <span className="text-[10px] text-slate-500 font-semibold px-1.5 hidden sm:inline">Tốc độ:</span>
                {[
                  { label: '0.7x', rate: 0.7 },
                  { label: '1.0x', rate: 1.0 },
                  { label: '1.2x', rate: 1.2 },
                ].map((s) => (
                  <button
                    key={s.label}
                    onClick={() => setSpeechRate(s.rate)}
                    className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                      speechRate === s.rate
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-blue-700 hover:bg-white/60'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {/* Stop Audio Button */}
              <button
                onClick={() => stopSpeaking()}
                className="px-2.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/90 transition-all font-bold flex items-center gap-1 shadow-xs"
                title="Dừng tất cả âm thanh đang phát"
              >
                <Square className="w-3.5 h-3.5 fill-rose-600" />
                <span className="hidden sm:inline text-xs">Dừng loa</span>
              </button>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

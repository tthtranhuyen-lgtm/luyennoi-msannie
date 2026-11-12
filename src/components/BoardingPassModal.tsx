import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Plane, Award, CheckCircle2, TrendingUp, X, Sparkles, RefreshCw } from 'lucide-react';

export interface ScenarioReport {
  overallScore: number;
  fluencyRating: string;
  vocabularyCoveragePercent: number;
  masteredKeywords: string[];
  praisePointsVi: string[];
  improvementTipsVi: string[];
  flightBadgeTitle: string;
}

interface BoardingPassModalProps {
  report: ScenarioReport;
  scenarioTitle: string;
  userRole: string;
  onClose: () => void;
  onRestart: () => void;
}

export const BoardingPassModal: React.FC<BoardingPassModalProps> = ({
  report,
  scenarioTitle,
  userRole,
  onClose,
  onRestart,
}) => {
  useEffect(() => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-blue-200 overflow-hidden my-8 text-slate-800">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/10 hover:bg-black/20 text-white flex items-center justify-center transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Boarding Pass Header banner */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-700 to-sky-600 text-white p-6 relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between pr-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <Plane className="w-6 h-6 -rotate-45 text-white" />
              </div>
              <div>
                <span className="text-xs uppercase tracking-widest text-sky-200 font-bold">
                  Boarding Pass &bull; Chứng Nhận Khẩu Ngữ
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  HÀNG KHÔNG KHẨU NGỮ HANYU
                </h2>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/20 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div>
              <span className="text-sky-200 block">TÌNH HUỐNG:</span>
              <span className="font-bold text-white text-sm">{scenarioTitle}</span>
            </div>
            <div>
              <span className="text-sky-200 block">VAI DIỄN:</span>
              <span className="font-bold text-white text-sm">{userRole}</span>
            </div>
            <div>
              <span className="text-sky-200 block">DANH HIỆU SÂN BAY:</span>
              <span className="font-bold text-amber-300 text-sm flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                {report.flightBadgeTitle}
              </span>
            </div>
          </div>
        </div>

        {/* Boarding Pass Body */}
        <div className="p-6 space-y-6">
          {/* Score & Fluency Highlight */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-100">
              <span className="text-xs text-slate-500 font-bold block">ĐIỂM NÓI TỔNG THỂ</span>
              <div className="text-4xl font-black text-blue-700 mt-1">
                {report.overallScore}
                <span className="text-lg font-normal text-slate-400">/100</span>
              </div>
              <span className="text-xs font-bold text-blue-900 mt-0.5 block">
                {report.overallScore >= 90
                  ? '🌟 Xuất sắc đẳng cấp'
                  : report.overallScore >= 75
                  ? '👍 Rất tốt & tự nhiên'
                  : '💪 Khá & tiến bộ'}
              </span>
            </div>

            <div className="bg-indigo-50/70 p-4 rounded-2xl border border-indigo-100">
              <span className="text-xs text-slate-500 font-bold block">
                ĐỘ LƯU LOÁT &amp; TỰ NHIÊN
              </span>
              <div className="text-2xl font-black text-indigo-700 mt-2">
                {report.fluencyRating}
              </div>
              <span className="text-xs text-slate-500 mt-1 block">Tốc độ phản xạ hội thoại</span>
            </div>

            <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-100">
              <span className="text-xs text-slate-500 font-bold block">TỪ VỰNG MỤC TIÊU</span>
              <div className="text-3xl font-black text-emerald-700 mt-1">
                {report.vocabularyCoveragePercent}%
              </div>
              <span className="text-xs text-slate-500 mt-0.5 block">Độ phủ từ vựng chuẩn</span>
            </div>
          </div>

          {/* Mastered Keywords */}
          {report.masteredKeywords && report.masteredKeywords.length > 0 && (
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Từ vựng sân bay bạn đã vận dụng chính xác:
              </h4>
              <div className="flex flex-wrap gap-2">
                {report.masteredKeywords.map((kw, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-white rounded-lg text-sm font-bold text-emerald-800 border border-emerald-200 shadow-xs"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Teacher Commentary & Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl">
              <h4 className="font-bold text-sm text-emerald-900 flex items-center gap-1.5 mb-2">
                <Award className="w-4 h-4 text-emerald-600" />
                Điểm nổi bật &amp; Khen ngợi:
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {report.praisePointsVi.map((pt, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold mt-0.5">&bull;</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl">
              <h4 className="font-bold text-sm text-amber-900 flex items-center gap-1.5 mb-2">
                <TrendingUp className="w-4 h-4 text-amber-600" />
                Lời khuyên để nói chuẩn hơn:
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {report.improvementTipsVi.map((tip, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-amber-600 font-bold mt-0.5">&bull;</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              onClick={onRestart}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-sm font-bold flex items-center justify-center gap-2 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              Luyện lại tình huống này
            </button>
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Plane className="w-4 h-4 -rotate-45" />
              Khám phá tình huống khác
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

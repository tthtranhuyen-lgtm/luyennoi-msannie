import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Volume2,
  CheckCircle,
  Clock,
  RotateCcw,
  Sparkles,
  Download,
  Filter,
  BookOpen,
  Cloud,
  AlertCircle,
} from 'lucide-react';
import {
  StudentSubmission,
  saveSubmission,
  formatSafeTime,
} from '../utils/audioStorage';
import { useAudioSubmissions } from '../context/AudioSubmissionsContext';
import { CURRICULUM_SCENARIOS } from '../data/curriculumData';
import { speakChinese } from '../utils/speech';

interface TeacherDashboardProps {
  speechRate: number;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ speechRate }) => {
  const {
    allSubmissionsList: submissions,
    gradeSubmission,
    deleteSubmission,
    reloadSubmissions,
    cloudConnected,
    cloudError,
  } = useAudioSubmissions();
  const [selectedScenarioFilter, setSelectedScenarioFilter] = useState<number | 'all'>('all');

  const getSubKey = (sub: StudentSubmission) => sub.id || sub.questionId;

  // Grade state per submission: { [subKey]: { score: number, feedback: string, saved: boolean } }
  const [gradingState, setGradingState] = useState<
    Record<string, { score: number; feedback: string; saved?: boolean }>
  >({});

  useEffect(() => {
    const initialGrading: Record<string, { score: number; feedback: string; saved?: boolean }> = {};
    submissions.forEach((sub) => {
      const subKey = getSubKey(sub);
      initialGrading[subKey] = {
        score: sub.teacherScore !== undefined ? sub.teacherScore : 9.0,
        feedback: sub.teacherFeedback || '',
      };
    });
    setGradingState((prev) => ({ ...initialGrading, ...prev }));
  }, [submissions]);

  const handleScoreChange = (subKey: string, score: number) => {
    setGradingState((prev) => ({
      ...prev,
      [subKey]: { ...(prev[subKey] || { feedback: '' }), score, saved: false },
    }));
  };

  const handleFeedbackChange = (subKey: string, feedback: string) => {
    setGradingState((prev) => ({
      ...prev,
      [subKey]: { ...(prev[subKey] || { score: 9.0 }), feedback, saved: false },
    }));
  };

  const handleAddQuickFeedback = (subKey: string, snippet: string) => {
    setGradingState((prev) => {
      const current = prev[subKey]?.feedback || '';
      const separator = current.trim() ? '; ' : '';
      return {
        ...prev,
        [subKey]: {
          ...(prev[subKey] || { score: 9.0 }),
          feedback: current + separator + snippet,
          saved: false,
        },
      };
    });
  };

  const handleSaveReview = async (sub: StudentSubmission) => {
    const subKey = getSubKey(sub);
    const data = gradingState[subKey] || { score: 9.0, feedback: '' };
    await gradeSubmission(sub.questionId, data.score, data.feedback, sub.id);
    setGradingState((prev) => ({
      ...prev,
      [subKey]: { ...data, saved: true },
    }));
  };

  // Pre-seed demo submissions so teacher can test right away
  const handleSeedDemoSubmissions = () => {
    const demos: Partial<StudentSubmission>[] = [
      {
        scenarioId: 1,
        scenarioTitle: 'Tình huống 1: Hỏi thông tin chuyến bay',
        questionId: 'sc1-q1',
        questionText: '我想请问一下，去北京的航班在哪个登机口？',
        studentText: '您好，飞往北京的航班在12号登机口，请您提前半小时准备登机。',
        timestamp: Date.now() - 1000 * 60 * 15,
        studentName: 'Nguyễn Văn An (HS01)',
        teacherScore: 9.5,
        teacherFeedback: 'Phát âm thanh 4 rất dứt khoát! Ngữ điệu tự nhiên, phản xạ tốt.',
        reviewedAt: Date.now() - 1000 * 60 * 5,
      },
      {
        scenarioId: 2,
        scenarioTitle: 'Tình huống 2: Mua vé & Chọn chỗ ngồi',
        questionId: 'sc2-q1',
        questionText: '您好，您需要靠窗还是靠走道的座位？',
        studentText: '我想订一张靠窗户的座位，可以看外面的风景吗？',
        timestamp: Date.now() - 1000 * 60 * 30,
        studentName: 'Trần Thị Mai (HS02)',
      },
      {
        scenarioId: 3,
        scenarioTitle: 'Tình huống 3: Hành lý ký gửi & Quá cân',
        questionId: 'sc3-q1',
        questionText: '您的这个箱子超重了两公斤，需要补交行李托运费。',
        studentText: '请问超重一公斤要多少钱？我可以把一些衣服拿出来随身携带吗？',
        timestamp: Date.now() - 1000 * 60 * 45,
        studentName: 'Lê Hoàng Nam (HS03)',
      },
    ];

    demos.forEach((d) => {
      saveSubmission(d.questionId!, d);
    });
    reloadSubmissions();
  };

  // Filtered list
  const filteredSubmissions =
    selectedScenarioFilter === 'all'
      ? submissions
      : submissions.filter((s) => s.scenarioId === selectedScenarioFilter);

  // Stats calculation
  const totalSubmissions = submissions.length;
  const gradedCount = submissions.filter((s) => s.teacherScore !== undefined).length;
  const pendingCount = totalSubmissions - gradedCount;
  const avgScore =
    gradedCount > 0
      ? (
          submissions
            .filter((s) => s.teacherScore !== undefined)
            .reduce((acc, cur) => acc + (cur.teacherScore || 0), 0) / gradedCount
        ).toFixed(1)
      : '0.0';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6 animate-fade-in">
      {/* Teacher Header Banner */}
      <div className="glass-panel-navy rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute -right-6 -bottom-8 opacity-10 text-[160px] pointer-events-none select-none">
          👨‍🏫
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-blue-500/25 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-semibold text-blue-200">
              <GraduationCap className="w-4 h-4 text-amber-300" />
              <span>Cổng Giảng Viên &bull; Đánh Giá &amp; Chấm Điểm Phát Âm</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              👨‍🏫 Góc Giáo Viên: Kiểm Tra Bài Nói Của Học Sinh
            </h2>
            <p className="text-sm text-blue-100/90 max-w-2xl font-normal leading-relaxed">
              Nghe trực tiếp bản ghi âm giọng nói của học sinh từ các bài tập tình huống sân bay. Cho
              điểm thang 10, nhận xét phát âm, thanh điệu và gửi phản hồi chuẩn xác cho từng em.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-col items-center sm:items-end gap-2 shrink-0">
            <button
              onClick={handleSeedDemoSubmissions}
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Nạp 3 bài mẫu để thử nghiệm</span>
            </button>
            <span className="text-[11px] text-blue-200">Dữ liệu đồng bộ tự động theo thời gian thực</span>
          </div>
        </div>

        {/* Metric Cards Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-blue-400/20">
          <div className="bg-slate-900/60 border border-slate-700/60 rounded-2xl p-3.5 backdrop-blur-md">
            <span className="text-xs text-blue-200 font-medium block">Tổng số bài nộp</span>
            <div className="text-2xl font-black text-white mt-0.5">{totalSubmissions}</div>
          </div>
          <div className="bg-emerald-950/50 border border-emerald-500/30 rounded-2xl p-3.5 backdrop-blur-md">
            <span className="text-xs text-emerald-200 font-medium block">Đã chấm điểm</span>
            <div className="text-2xl font-black text-emerald-300 mt-0.5">{gradedCount} bài</div>
          </div>
          <div className="bg-amber-950/50 border border-amber-500/30 rounded-2xl p-3.5 backdrop-blur-md">
            <span className="text-xs text-amber-200 font-medium block">Chờ giáo viên nghe</span>
            <div className="text-2xl font-black text-amber-300 mt-0.5">{pendingCount} bài</div>
          </div>
          <div className="bg-blue-950/50 border border-blue-500/30 rounded-2xl p-3.5 backdrop-blur-md">
            <span className="text-xs text-blue-200 font-medium block">Điểm trung bình</span>
            <div className="text-2xl font-black text-amber-300 mt-0.5">{avgScore} / 10</div>
          </div>
        </div>
      </div>

      {/* Teacher Cloud Sync Status Banner */}
      <div className="rounded-2xl p-4 sm:p-5 border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-emerald-50/90 border-emerald-200 text-emerald-900">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-emerald-600 text-white">
            <Cloud className="w-5 h-5" />
          </div>
          <div className="space-y-0.5 text-xs sm:text-sm">
            <div className="font-bold text-emerald-950">
              {cloudConnected
                ? 'Đã kết nối Góc Giáo Viên Đám Mây (Không cần đăng nhập Google)'
                : 'Đang kết nối tới máy chủ lưu bài ghi âm...'}
            </div>
            <p className="text-xs text-emerald-800">
              Tự động nhận bài ghi âm từ học sinh ở mọi thiết bị theo thời gian thực ngay khi các em thu âm xong.
            </p>
          </div>
        </div>
      </div>

      {cloudError && (
        <div className="rounded-2xl p-4 bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-2.5 text-xs">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold">{cloudError}</p>
          </div>
        </div>
      )}

      {/* Filter and Controls */}
      <div className="glass-card rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-700">
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <Filter className="w-4 h-4 text-blue-600 shrink-0" />
          <span className="text-xs font-bold text-slate-500 shrink-0">Lọc theo tình huống:</span>

          <button
            onClick={() => setSelectedScenarioFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedScenarioFilter === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            Tất cả ({submissions.length})
          </button>

          {CURRICULUM_SCENARIOS.map((sc) => {
            const count = submissions.filter((s) => s.scenarioId === sc.id).length;
            return (
              <button
                key={sc.id}
                onClick={() => setSelectedScenarioFilter(sc.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedScenarioFilter === sc.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                TH {sc.id} ({count})
              </button>
            );
          })}
        </div>

        <button
          onClick={reloadSubmissions}
          className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 self-end sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Làm mới danh sách</span>
        </button>
      </div>

      {/* Submissions List */}
      {filteredSubmissions.length === 0 ? (
        <div className="glass-card rounded-3xl p-10 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Chưa có bài nói nào trong mục này</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            Học sinh có thể vào tab <strong>&quot;6 Bài Luyện Nói 2 Bước&quot;</strong>, bật micro thu âm
            câu trả lời của mình. Bản ghi âm sẽ tự động chuyển về đây để giáo viên nghe và chấm điểm.
          </p>
          <div className="pt-2">
            <button
              onClick={handleSeedDemoSubmissions}
              className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20"
            >
              + Tạo 3 bài thu âm mẫu của học sinh để thử nghiệm ngay
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredSubmissions.map((sub, idx) => {
            const subKey = getSubKey(sub);
            const currentGrade = gradingState[subKey] || {
              score: sub.teacherScore !== undefined ? sub.teacherScore : 9.0,
              feedback: sub.teacherFeedback || '',
            };
            const fileExt = sub.audioDataUrl?.includes('audio/mp4')
              ? 'm4a'
              : sub.audioDataUrl?.includes('audio/ogg')
              ? 'ogg'
              : 'webm';

            return (
              <div
                key={subKey || `${sub.questionId}-${idx}`}
                className="glass-card rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-all space-y-4"
              >
                {/* Header row: Scenario & Student name */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
                      #{sub.scenarioId}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        {sub.scenarioTitle || `Tình huống ${sub.scenarioId}`}
                      </h4>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2 flex-wrap">
                        <span>Học sinh: {sub.studentName || 'Học viên'}</span>
                        <span>&bull;</span>
                        <Clock className="w-3 h-3 inline text-slate-400" />
                        <span>{formatSafeTime(sub.timestamp)}</span>
                        {sub.syncedToCloud && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-sky-50 text-sky-700 border border-sky-200 font-semibold text-[10px]">
                            <Cloud className="w-3 h-3" />
                            <span>Đám mây</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {sub.teacherScore !== undefined ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Đã chấm: {sub.teacherScore}/10</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Chờ giáo viên chấm</span>
                      </span>
                    )}

                    <button
                      onClick={() => deleteSubmission(sub.questionId, sub.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                      title="Xóa bài nộp này"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Question Info */}
                <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-200/70 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                      Câu hỏi tình huống:
                    </span>
                    <button
                      onClick={() => speakChinese(sub.questionText, speechRate)}
                      className="text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 text-[11px]"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Nghe giọng bản xứ</span>
                    </button>
                  </div>
                  <div className="text-sm font-bold text-slate-900">{sub.questionText}</div>
                </div>

                {/* Student's Answer & Voice Recording */}
                <div className="bg-blue-50/50 rounded-2xl p-4 border border-blue-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                      Bài nói của học sinh:
                    </span>

                    {/* Audio recording player */}
                    {sub.audioDataUrl ? (
                      <div className="flex items-center gap-2">
                        <a
                          href={sub.audioDataUrl}
                          download={`hoc_sinh_${sub.questionId}.${fileExt}`}
                          className="px-2.5 py-1 text-slate-600 hover:text-blue-700 bg-white border border-slate-200 rounded-lg transition-colors flex items-center gap-1 font-semibold text-[11px]"
                          title="Tải tệp ghi âm về máy"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Tải file ghi âm</span>
                        </a>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-slate-400 text-xs italic">
                        <span>(Học sinh gõ chữ trực tiếp)</span>
                      </div>
                    )}
                  </div>

                  {/* Native HTML5 Audio Player for Teacher */}
                  {sub.audioDataUrl && (
                    <div className="bg-white/90 p-2 rounded-xl border border-blue-200 shadow-2xs">
                      <audio
                        controls
                        src={sub.audioDataUrl}
                        className="w-full h-10 rounded-lg focus:outline-none"
                        preload="metadata"
                      >
                        Trình duyệt không hỗ trợ thẻ audio.
                      </audio>
                    </div>
                  )}

                  {/* Transcript or student note text */}
                  <div className="p-3 bg-white rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 leading-relaxed">
                    {sub.studentText ? (
                      sub.studentText
                    ) : (
                      <span className="italic text-slate-400">Không có văn bản ghi chú.</span>
                    )}
                  </div>
                </div>

                {/* Teacher Grading & Feedback Section */}
                <div className="bg-amber-50/60 rounded-2xl p-4 border border-amber-200 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-amber-700" />
                      <span className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                        Giáo viên nhận xét &amp; Chấm điểm:
                      </span>
                    </div>

                    {/* Score Slider & Value */}
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium text-slate-600">Thang điểm:</span>
                      <input
                        type="range"
                        min="5"
                        max="10"
                        step="0.5"
                        value={currentGrade.score}
                        onChange={(e) =>
                          handleScoreChange(subKey, parseFloat(e.target.value))
                        }
                        className="w-28 accent-blue-600 cursor-pointer"
                      />
                      <div className="w-14 text-center px-2 py-0.5 rounded-lg bg-blue-600 text-white font-black text-sm">
                        {currentGrade.score.toFixed(1)}đ
                      </div>
                    </div>
                  </div>

                  {/* Quick feedback tag buttons */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[11px] text-amber-800 font-semibold mr-1">
                      Gợi ý nhận xét nhanh:
                    </span>
                    {[
                      '⭐ Phát âm thanh 4 rất dứt khoát',
                      '👍 Ngữ điệu tự nhiên, lưu loát',
                      '⚠️ Cần chú ý biến điệu 一 (yī)',
                      '🎯 Dùng từ ngữ rất chính xác',
                      '💪 Cần luyện nói to hơn',
                      '✈️ Đạt yêu cầu giao tiếp sân bay',
                    ].map((snippet) => (
                      <button
                        key={snippet}
                        type="button"
                        onClick={() => handleAddQuickFeedback(subKey, snippet)}
                        className="text-[11px] bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-md transition-colors"
                      >
                        + {snippet}
                      </button>
                    ))}
                  </div>

                  {/* Feedback textarea */}
                  <textarea
                    value={currentGrade.feedback}
                    onChange={(e) => handleFeedbackChange(subKey, e.target.value)}
                    placeholder="Gõ nhận xét chi tiết của giáo viên về phát âm, thanh điệu hoặc ngữ pháp..."
                    rows={2}
                    className="w-full bg-white text-slate-800 p-2.5 rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-xs font-medium placeholder:text-slate-400 resize-none"
                  />

                  {/* Save button */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-500">
                      {currentGrade.saved
                        ? 'Đã lưu đánh giá thành công!'
                        : sub.reviewedAt
                        ? `Đã lưu lần cuối: ${formatSafeTime(sub.reviewedAt)}`
                        : 'Chưa lưu đánh giá'}
                    </span>

                    <button
                      onClick={() => handleSaveReview(sub)}
                      className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Lưu đánh giá của giáo viên</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

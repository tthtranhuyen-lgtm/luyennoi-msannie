import React, { useState, useRef, useEffect } from 'react';
import {
  Plane,
  Mic,
  MicOff,
  Send,
  Volume2,
  Sparkles,
  Award,
  CheckCircle2,
  ChevronRight,
  RefreshCw,
  Lightbulb,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ArrowRight,
  Edit3,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { SCENARIOS, RoleplayScenario } from '../data/chineseData';
import { speakChinese, stopSpeaking, ChineseSpeechRecognizer } from '../utils/speech';
import { BoardingPassModal, ScenarioReport } from './BoardingPassModal';

export interface GrammarAnalysis {
  hasError: boolean;
  issueVi: string;
  correctedPart?: string;
  explanationVi: string;
}

export interface PronunciationAnalysis {
  toneNotesVi: string;
  pinyinBreakdown: string;
  difficultSoundsVi?: string;
}

export interface RevisionSuggestion {
  chinese: string;
  pinyin: string;
  vietnamese: string;
  whyBetterVi: string;
}

export interface InstantFeedback {
  score: number;
  fluencyLevel: string;
  commentVi: string;
  grammarAnalysis?: GrammarAnalysis;
  pronunciationAnalysis?: PronunciationAnalysis;
  revisionSuggestion?: RevisionSuggestion;
  betterExpression?: string;
  betterExpressionPinyin?: string;
  betterExpressionVi?: string;
  targetKeywordsFound: string[];
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  chinese: string;
  pinyin?: string;
  vietnamese?: string;
  instantFeedback?: InstantFeedback;
}

interface RoleplayStudioProps {
  showPinyin: boolean;
  showTranslation: boolean;
  speechRate: number;
}

export const RoleplayStudio: React.FC<RoleplayStudioProps> = ({
  showPinyin,
  showTranslation,
  speechRate,
}) => {
  const [selectedScenario, setSelectedScenario] = useState<RoleplayScenario | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [summaryReport, setSummaryReport] = useState<ScenarioReport | null>(null);
  const [suggestedReplies, setSuggestedReplies] = useState<
    Array<{ chinese: string; pinyin: string; vietnamese: string }>
  >([]);
  const [activeSpeechId, setActiveSpeechId] = useState<string | null>(null);
  const [usedKeywords, setUsedKeywords] = useState<Set<string>>(new Set());
  const [showRequirementDetails, setShowRequirementDetails] = useState(false);
  const [recordingError, setRecordingError] = useState<string | null>(null);
  const [appliedRevisionNotice, setAppliedRevisionNotice] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const speechRecognizerRef = useRef<ChineseSpeechRecognizer | null>(null);

  useEffect(() => {
    speechRecognizerRef.current = new ChineseSpeechRecognizer();
    return () => {
      stopSpeaking();
      if (speechRecognizerRef.current) {
        speechRecognizerRef.current.stopListening();
      }
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleStartScenario = (scenario: RoleplayScenario) => {
    stopSpeaking();
    setSelectedScenario(scenario);
    setUsedKeywords(new Set());
    setSummaryReport(null);
    setRecordingError(null);
    setAppliedRevisionNotice(null);

    const initialMsg: ChatMessage = {
      id: 'msg-init-' + Date.now(),
      sender: 'ai',
      chinese: scenario.initialAiGreeting.chinese,
      pinyin: scenario.initialAiGreeting.pinyin,
      vietnamese: scenario.initialAiGreeting.vietnamese,
    };
    setMessages([initialMsg]);
    setSuggestedReplies(scenario.suggestedPhrases);

    setTimeout(() => {
      handlePlaySpeech(scenario.initialAiGreeting.chinese, initialMsg.id);
    }, 400);
  };

  const handlePlaySpeech = (text: string, id: string) => {
    if (activeSpeechId === id) {
      stopSpeaking();
      setActiveSpeechId(null);
      return;
    }
    setActiveSpeechId(id);
    speakChinese(
      text,
      speechRate,
      () => setActiveSpeechId(id),
      () => setActiveSpeechId(null)
    );
  };

  const toggleRecording = () => {
    setRecordingError(null);
    if (!speechRecognizerRef.current) return;

    if (isRecording) {
      speechRecognizerRef.current.stopListening();
      setIsRecording(false);
    } else {
      setIsRecording(true);
      speechRecognizerRef.current.startListening({
        onStart: () => setIsRecording(true),
        onResult: (transcript, isFinal) => {
          setInputText(transcript);
          if (isFinal) {
            setIsRecording(false);
          }
        },
        onError: (err) => {
          setIsRecording(false);
          setRecordingError(err);
        },
        onEnd: () => setIsRecording(false),
      });
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || !selectedScenario || isLoading) return;

    if (isRecording && speechRecognizerRef.current) {
      speechRecognizerRef.current.stopListening();
      setIsRecording(false);
    }

    const userMsgId = 'user-' + Date.now();
    const newUserMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      chinese: text,
    };

    const newHistory = [...messages, newUserMsg];
    setMessages(newHistory);
    setInputText('');
    setIsLoading(true);
    setRecordingError(null);
    setAppliedRevisionNotice(null);

    try {
      const response = await fetch('/api/roleplay-turn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenarioTitle: selectedScenario.title,
          scenarioContext: selectedScenario.context,
          targetVocabulary: selectedScenario.targetVocabulary,
          userRole: selectedScenario.roles.student.roleName,
          aiRole: selectedScenario.roles.ai.roleName,
          history: newHistory.map((m) => ({
            sender: m.sender,
            text: m.chinese,
          })),
          userMessage: text,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === userMsgId
              ? {
                  ...msg,
                  instantFeedback: data.instantFeedback,
                }
              : msg
          )
        );

        if (data.instantFeedback?.targetKeywordsFound) {
          setUsedKeywords((prev) => {
            const next = new Set(prev);
            data.instantFeedback.targetKeywordsFound.forEach((kw: string) => next.add(kw));
            return next;
          });
        }

        const aiMsgId = 'ai-' + Date.now();
        const aiMsg: ChatMessage = {
          id: aiMsgId,
          sender: 'ai',
          chinese: data.aiReply.chinese,
          pinyin: data.aiReply.pinyin,
          vietnamese: data.aiReply.vietnamese,
        };

        setMessages((prev) => [...prev, aiMsg]);
        setSuggestedReplies(data.suggestedReplies || []);

        handlePlaySpeech(data.aiReply.chinese, aiMsgId);
      } else {
        alert(data.error || 'Có lỗi xảy ra.');
      }
    } catch (err: any) {
      console.error('Error sending message:', err);
      alert('Không thể kết nối đến máy chủ AI.');
    } finally {
      setIsLoading(false);
    }
  };

  // Direct Revision: apply suggested sentence directly to input text box
  const applyRevisionToInput = (revisedChinese: string) => {
    setInputText(revisedChinese);
    setAppliedRevisionNotice(`Đã áp dụng câu sửa: "${revisedChinese}" vào ô nhập! Bạn có thể nhấn Gửi hoặc sửa thêm.`);
    setTimeout(() => {
      setAppliedRevisionNotice(null);
    }, 5000);
  };

  const handleFinishScenario = async () => {
    if (!selectedScenario || messages.length < 2) {
      alert('Bạn hãy nói ít nhất 1-2 câu với AI trước khi nhận điểm tổng kết nhé!');
      return;
    }

    setIsGeneratingSummary(true);
    try {
      const response = await fetch('/api/scenario-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenarioTitle: selectedScenario.title,
          userRole: selectedScenario.roles.student.roleName,
          history: messages.map((m) => ({
            sender: m.sender,
            text: m.chinese,
          })),
          targetVocabulary: selectedScenario.targetVocabulary,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSummaryReport(data.report);
      } else {
        alert('Không thể tạo bảng tổng kết.');
      }
    } catch (err) {
      console.error('Error generating summary:', err);
      alert('Lỗi tạo chứng nhận.');
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
      {!selectedScenario ? (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
            <div className="max-w-2xl">
              <span className="text-xs uppercase tracking-widest text-sky-200 font-bold bg-white/20 px-3 py-1 rounded-full border border-white/20">
                Phòng Đối Thoại Trực Tiếp Với AI
              </span>
              <h2 className="text-2xl sm:text-3xl font-black mt-3 tracking-tight">
                Chọn Tình Huống Nhập Vai &amp; Sửa Lỗi Tức Thì
              </h2>
              <p className="text-sky-100 text-sm mt-2 leading-relaxed">
                Đóng vai đối thoại trực tiếp nhiều lượt với AI. AI không chỉ trả lời mà còn thực hiện{' '}
                <strong className="text-amber-300">phân tích chi tiết lỗi ngữ pháp, thanh điệu/phát âm</strong>{' '}
                và đưa ra <strong className="text-amber-300">gợi ý sửa đổi trực tiếp vào giao diện</strong>!
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SCENARIOS.map((sc) => (
              <div
                key={sc.id}
                onClick={() => handleStartScenario(sc)}
                className="bg-white rounded-3xl border border-slate-200 hover:border-blue-500 hover:shadow-lg p-5 flex flex-col justify-between transition-all cursor-pointer group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800">
                      Tình huống {sc.number}
                    </span>
                    <span className="text-2xl">{sc.roles.student.avatar}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                    {sc.title}
                  </h3>
                  <div className="text-xs text-blue-600 font-medium">{sc.titleChinese}</div>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    {sc.context}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <span className="text-[11px] font-semibold text-slate-400 block mb-1.5 uppercase">
                      Từ vựng mục tiêu:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {sc.targetVocabulary.slice(0, 5).map((voc, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[11px] rounded-md font-medium"
                        >
                          {voc}
                        </span>
                      ))}
                      {sc.targetVocabulary.length > 5 && (
                        <span className="text-[11px] text-slate-400 font-medium self-center">
                          +{sc.targetVocabulary.length - 5}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 flex items-center justify-between text-xs font-bold text-blue-600 group-hover:text-blue-800">
                  <span>Bắt đầu đối thoại AI</span>
                  <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Active Header Bar */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm text-slate-800 space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedScenario(null)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 transition-all"
                >
                  &larr; Đổi tình huống
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-blue-100 text-blue-800 font-extrabold px-2 py-0.5 rounded-md">
                      TH {selectedScenario.number}
                    </span>
                    <h2 className="text-base sm:text-lg font-bold text-slate-900">
                      {selectedScenario.title}{' '}
                      <span className="text-slate-500 text-sm font-normal">
                        ({selectedScenario.titleChinese})
                      </span>
                    </h2>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{selectedScenario.tagline}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center">
                <div className="hidden sm:flex items-center gap-2 text-xs bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200">
                  <span className="text-slate-500">Bạn là:</span>
                  <span className="font-bold text-blue-900">
                    {selectedScenario.roles.student.avatar} {selectedScenario.roles.student.roleName}
                  </span>
                </div>

                <button
                  onClick={handleFinishScenario}
                  disabled={isGeneratingSummary || messages.length < 2}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 disabled:opacity-40 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>
                    {isGeneratingSummary ? 'Đang chấm...' : 'Nhận Điểm & Boarding Pass'}
                  </span>
                </button>
              </div>
            </div>

            {/* Target Vocabulary Chips */}
            <div className="pt-3 border-t border-slate-100 flex items-center gap-2 flex-wrap">
              <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Mục tiêu từ vựng:
              </span>
              {selectedScenario.targetVocabulary.map((word) => {
                const isUsed = usedKeywords.has(word);
                return (
                  <span
                    key={word}
                    className={`text-xs px-2 py-0.5 rounded-md font-bold transition-all ${
                      isUsed
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}
                  >
                    {isUsed ? `✓ ${word}` : word}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Applied Revision Alert Toast */}
          {appliedRevisionNotice && (
            <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-3 text-xs text-emerald-900 flex items-center justify-between gap-2 animate-fade-in shadow-xs">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium">{appliedRevisionNotice}</span>
              </div>
              <button
                onClick={() => setAppliedRevisionNotice(null)}
                className="text-emerald-700 hover:text-emerald-900 font-bold ml-2 underline text-[11px]"
              >
                Đóng
              </button>
            </div>
          )}

          {/* Chat Messages Log */}
          <div className="bg-slate-50/70 border border-slate-200 rounded-3xl p-4 sm:p-6 min-h-[420px] max-h-[580px] overflow-y-auto space-y-5 shadow-inner">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                {/* Character Name Label */}
                <div className="flex items-center gap-1.5 mb-1 text-xs text-slate-400 px-1 font-semibold">
                  <span>
                    {msg.sender === 'user'
                      ? `${selectedScenario.roles.student.avatar} ${selectedScenario.roles.student.roleName}`
                      : `${selectedScenario.roles.ai.avatar} ${selectedScenario.roles.ai.roleName}`}
                  </span>
                </div>

                {/* Speech Bubble */}
                <div
                  className={`max-w-[90%] sm:max-w-[80%] rounded-2xl p-4 shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-xs'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-base sm:text-lg font-bold leading-relaxed">{msg.chinese}</p>
                      {showPinyin && msg.pinyin && (
                        <p
                          className={`text-xs font-mono ${
                            msg.sender === 'user' ? 'text-sky-200' : 'text-slate-500'
                          }`}
                        >
                          {msg.pinyin}
                        </p>
                      )}
                      {showTranslation && msg.vietnamese && (
                        <p
                          className={`text-xs pt-1 border-t ${
                            msg.sender === 'user'
                              ? 'border-white/20 text-sky-100'
                              : 'border-slate-100 text-slate-600'
                          }`}
                        >
                          {msg.vietnamese}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => handlePlaySpeech(msg.chinese, msg.id)}
                      className={`p-2 rounded-xl transition-all shrink-0 ${
                        activeSpeechId === msg.id
                          ? 'bg-amber-400 text-slate-950 animate-pulse'
                          : msg.sender === 'user'
                          ? 'bg-white/20 hover:bg-white/30 text-white'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                      title="Nghe phát âm"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* DETAILED PEDAGOGICAL DIAGNOSTIC CARD FOR USER'S MESSAGE */}
                {msg.sender === 'user' && msg.instantFeedback && (
                  <div className="mt-2.5 max-w-[92%] sm:max-w-[85%] w-full bg-white border border-blue-200 rounded-2xl p-4 sm:p-5 text-xs shadow-md space-y-3.5 text-slate-800 animate-fade-in">
                    {/* Header: Score + Fluency + Summary */}
                    <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-2.5 gap-2">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-blue-600" />
                        <span className="font-extrabold text-blue-950 text-sm">
                          Phân Tích Sư Phạm Chi Tiết
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-extrabold text-[11px] border border-blue-200">
                          {msg.instantFeedback.fluencyLevel || 'Tốt'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-2.5 py-0.5 rounded-full font-black text-xs shadow-xs">
                        <span>{msg.instantFeedback.score}</span>
                        <span className="text-[10px] text-blue-100">/100đ</span>
                      </div>
                    </div>

                    {/* Teacher's summary comment */}
                    <p className="text-slate-700 font-medium leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      {msg.instantFeedback.commentVi}
                    </p>

                    {/* 1. Grammar Diagnostic */}
                    {msg.instantFeedback.grammarAnalysis && (
                      <div
                        className={`p-3 rounded-xl border space-y-1 ${
                          msg.instantFeedback.grammarAnalysis.hasError
                            ? 'bg-rose-50/70 border-rose-200 text-rose-950'
                            : 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 font-bold">
                          {msg.instantFeedback.grammarAnalysis.hasError ? (
                            <>
                              <AlertTriangle className="w-4 h-4 text-rose-600" />
                              <span className="text-rose-900 font-black">Lỗi ngữ pháp &amp; trật tự từ:</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              <span className="text-emerald-900 font-black">Ngữ pháp: Chuẩn xác</span>
                            </>
                          )}
                        </div>
                        <p className="text-[11px] font-semibold">
                          {msg.instantFeedback.grammarAnalysis.issueVi}
                        </p>
                        <p className="text-[11px] opacity-90 leading-relaxed">
                          {msg.instantFeedback.grammarAnalysis.explanationVi}
                        </p>
                      </div>
                    )}

                    {/* 2. Pronunciation & Tone Diagnostic (based on recording) */}
                    {msg.instantFeedback.pronunciationAnalysis && (
                      <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 text-amber-950 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-black text-amber-900 flex items-center gap-1.5">
                            <Volume2 className="w-4 h-4 text-amber-600" />
                            Phân tích phát âm &amp; thanh điệu (dựa trên bản ghi):
                          </span>
                        </div>

                        {msg.instantFeedback.pronunciationAnalysis.pinyinBreakdown && (
                          <div className="text-[11px] font-mono text-amber-900 bg-white/70 px-2 py-1 rounded-lg border border-amber-200/60">
                            Phiên âm: {msg.instantFeedback.pronunciationAnalysis.pinyinBreakdown}
                          </div>
                        )}

                        <p className="text-[11px] leading-relaxed">
                          {msg.instantFeedback.pronunciationAnalysis.toneNotesVi}
                        </p>

                        {msg.instantFeedback.pronunciationAnalysis.difficultSoundsVi && (
                          <p className="text-[11px] text-amber-800 font-medium">
                            {msg.instantFeedback.pronunciationAnalysis.difficultSoundsVi}
                          </p>
                        )}
                      </div>
                    )}

                    {/* 3. Direct Revision Suggestion with Direct Interface Action */}
                    {msg.instantFeedback.revisionSuggestion && (
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50/80 border border-blue-200 rounded-xl p-3.5 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-blue-950 flex items-center gap-1.5">
                            <Edit3 className="w-4 h-4 text-blue-600" />
                            Gợi ý sửa đổi trực tiếp (Chuẩn bản xứ):
                          </span>

                          <button
                            onClick={() =>
                              handlePlaySpeech(
                                msg.instantFeedback!.revisionSuggestion!.chinese,
                                msg.id + '-rev'
                              )
                            }
                            className="text-blue-700 hover:text-blue-800 font-bold flex items-center gap-1 text-[11px] bg-white px-2 py-0.5 rounded-lg border border-blue-200 shadow-2xs"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Nghe mẫu</span>
                          </button>
                        </div>

                        {/* Revised sentence */}
                        <div className="bg-white p-2.5 rounded-xl border border-blue-200/80 space-y-0.5">
                          <p className="text-sm font-bold text-slate-900">
                            {msg.instantFeedback.revisionSuggestion.chinese}
                          </p>
                          {msg.instantFeedback.revisionSuggestion.pinyin && (
                            <p className="text-[11px] font-mono text-blue-700">
                              {msg.instantFeedback.revisionSuggestion.pinyin}
                            </p>
                          )}
                          {msg.instantFeedback.revisionSuggestion.vietnamese && (
                            <p className="text-[11px] text-slate-500">
                              {msg.instantFeedback.revisionSuggestion.vietnamese}
                            </p>
                          )}
                        </div>

                        {msg.instantFeedback.revisionSuggestion.whyBetterVi && (
                          <p className="text-[11px] text-slate-600 italic">
                            💡 {msg.instantFeedback.revisionSuggestion.whyBetterVi}
                          </p>
                        )}

                        {/* Direct action button to apply revised text into input */}
                        <div className="pt-1 flex items-center justify-end">
                          <button
                            onClick={() =>
                              applyRevisionToInput(msg.instantFeedback!.revisionSuggestion!.chinese)
                            }
                            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all"
                            title="Điền câu sửa này vào ô nhập để luyện lại"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                            <span>Áp dụng câu sửa vào ô nhập</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Detected Vocabulary Chips */}
                    {msg.instantFeedback.targetKeywordsFound?.length > 0 && (
                      <div className="flex items-center gap-1.5 text-slate-500 text-[11px] pt-1 border-t border-slate-100">
                        <span>Từ vựng mục tiêu đã dùng:</span>
                        <div className="flex flex-wrap gap-1">
                          {msg.instantFeedback.targetKeywordsFound.map((kw, i) => (
                            <span
                              key={i}
                              className="bg-emerald-100 text-emerald-800 px-2 py-0.2 rounded font-bold border border-emerald-200"
                            >
                              ✓ {kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-slate-500 text-xs italic bg-white p-3 rounded-2xl w-fit border border-slate-200 shadow-xs">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce delay-100" />
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce delay-200" />
                <span>AI đang nghe, phân tích ngữ pháp/thanh điệu và chuẩn bị đối đáp...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Recording error if any */}
          {recordingError && (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3 text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{recordingError}</span>
            </div>
          )}

          {/* Suggested Replies Tray */}
          {suggestedReplies.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 mb-2">
                <Lightbulb className="w-3.5 h-3.5" />
                <span>Gợi ý câu đối thoại tiếp theo (Nhấn để điền hoặc luyện theo):</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {suggestedReplies.map((sug, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setInputText(sug.chinese);
                      handlePlaySpeech(sug.chinese, 'sug-' + i);
                    }}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-left transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-900 group-hover:text-blue-700 line-clamp-1">
                        {sug.chinese}
                      </p>
                      <Volume2 className="w-3 h-3 text-slate-400 group-hover:text-blue-600 shrink-0 ml-1" />
                    </div>
                    {showPinyin && (
                      <p className="text-[10px] font-mono text-slate-500 line-clamp-1">
                        {sug.pinyin}
                      </p>
                    )}
                    {showTranslation && (
                      <p className="text-[10px] text-slate-600 line-clamp-1 mt-0.5">
                        {sug.vietnamese}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input & Mic Bar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-3 flex items-center gap-2 shadow-sm">
            <button
              onClick={toggleRecording}
              className={`p-3 rounded-xl font-bold flex items-center justify-center transition-all ${
                isRecording
                  ? 'bg-rose-500 text-white animate-pulse shadow-md shadow-rose-500/20'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
              title={isRecording ? 'Đang nghe...' : 'Bật micro để nói tiếng Trung'}
            >
              {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-blue-600" />}
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              placeholder="Nói qua micro hoặc gõ câu tiếng Trung của bạn tại đây..."
              className="flex-1 bg-slate-50 focus:bg-white text-slate-900 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 text-sm placeholder:text-slate-400 font-medium transition-all"
            />

            <button
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim() || isLoading}
              className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold text-sm flex items-center gap-1.5 shadow-sm transition-all shrink-0"
            >
              <span>Gửi</span>
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {summaryReport && selectedScenario && (
        <BoardingPassModal
          report={summaryReport}
          scenarioTitle={selectedScenario.title}
          userRole={selectedScenario.roles.student.roleName}
          onClose={() => setSummaryReport(null)}
          onRestart={() => handleStartScenario(selectedScenario)}
        />
      )}
    </div>
  );
};

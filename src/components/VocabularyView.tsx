import React, { useState, useRef, useEffect } from 'react';
import {
  Volume2,
  Mic,
  MicOff,
  Sparkles,
  BookOpen,
  Search,
  CheckCircle2,
  AlertCircle,
  X,
  RotateCcw,
} from 'lucide-react';
import { VOCABULARY_LIST, VocabularyItem, SentenceExample } from '../data/chineseData';
import { speakChinese, stopSpeaking, ChineseSpeechRecognizer } from '../utils/speech';

interface VocabularyViewProps {
  showPinyin: boolean;
  showTranslation: boolean;
  speechRate: number;
}

export const VocabularyView: React.FC<VocabularyViewProps> = ({
  showPinyin,
  showTranslation,
  speechRate,
}) => {
  const [selectedWord, setSelectedWord] = useState<VocabularyItem>(VOCABULARY_LIST[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSpeechId, setActiveSpeechId] = useState<string | null>(null);

  // Shadowing & Speech Evaluation state
  const [shadowingSentence, setShadowingSentence] = useState<SentenceExample | null>(null);
  const [userTranscript, setUserTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<any | null>(null);
  const [recordingError, setRecordingError] = useState<string | null>(null);

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

  const handlePlay = (text: string, id: string) => {
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

  const filteredWords = VOCABULARY_LIST.filter(
    (item) =>
      item.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.pinyin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.vietnamese.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startShadowing = (sentence: SentenceExample) => {
    setShadowingSentence(sentence);
    setUserTranscript('');
    setEvaluationResult(null);
    setRecordingError(null);
    handlePlay(sentence.chinese, 'shadow-' + sentence.id);
  };

  const toggleRecording = () => {
    setRecordingError(null);
    if (!speechRecognizerRef.current) return;

    if (isRecording) {
      speechRecognizerRef.current.stopListening();
      setIsRecording(false);
    } else {
      setIsRecording(true);
      setUserTranscript('');
      speechRecognizerRef.current.startListening({
        onStart: () => setIsRecording(true),
        onResult: (transcript, isFinal) => {
          setUserTranscript(transcript);
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

  const handleEvaluate = async () => {
    if (!shadowingSentence || !userTranscript.trim() || isEvaluating) return;

    setIsEvaluating(true);
    setRecordingError(null);
    try {
      const response = await fetch('/api/evaluate-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userText: userTranscript.trim(),
          targetText: shadowingSentence.chinese,
          context: `Từ vựng "${selectedWord.word}" (${selectedWord.vietnamese}) tại sân bay`,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setEvaluationResult(data.evaluation);
      } else {
        alert(data.error || 'Lỗi đánh giá');
      }
    } catch (err) {
      console.error('Error evaluating speech:', err);
      alert('Không thể kết nối đến AI chấm điểm.');
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Search & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 p-5 rounded-3xl shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-blue-100 text-blue-800 font-bold px-2.5 py-0.5 rounded-full">
              Từ Vựng Cốt Lõi
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              12 Từ Vựng &amp; 36 Mẫu Câu Thực Tế
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Tra cứu cách dùng, cụm từ đi kèm, nghe phát âm và luyện nói Shadowing với chấm điểm AI
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm từ vựng, pinyin, nghĩa..."
            className="w-full bg-slate-50 text-slate-800 pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 12 Words list */}
        <div className="lg:col-span-4 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 px-1">
            Danh mục từ vựng ({filteredWords.length}/12)
          </div>
          <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1">
            {filteredWords.map((item) => {
              const isSelected = selectedWord.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedWord(item)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-blue-50 border-blue-500 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs ${
                        isSelected ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.id}
                    </div>
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-slate-900">{item.word}</span>
                        {showPinyin && (
                          <span className="text-xs font-mono text-blue-600">{item.pinyin}</span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">{item.vietnamese}</p>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlay(item.word, 'word-' + item.id);
                    }}
                    className={`p-2 rounded-xl transition-all ${
                      activeSpeechId === 'word-' + item.id
                        ? 'bg-amber-400 text-slate-950 animate-pulse'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                    title="Nghe phát âm"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Vocabulary Details */}
        <div className="lg:col-span-8 space-y-5">
          {/* Main Word Overview */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-500 flex items-center justify-center text-white text-3xl font-black shadow-md shadow-blue-500/20">
                  {selectedWord.word.substring(0, 1)}
                </div>
                <div>
                  <div className="flex items-baseline gap-3">
                    <h3 className="text-3xl font-extrabold text-slate-900 tracking-wide">
                      {selectedWord.word}
                    </h3>
                    <span className="text-lg font-mono text-blue-600 font-semibold">
                      {selectedWord.pinyin}
                    </span>
                  </div>
                  <p className="text-base font-semibold text-slate-600 mt-0.5">
                    {selectedWord.vietnamese}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handlePlay(selectedWord.word, 'main-word-' + selectedWord.id)}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-xs ${
                  activeSpeechId === 'main-word-' + selectedWord.id
                    ? 'bg-amber-400 text-slate-950'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                <Volume2 className="w-4 h-4" />
                <span>Phát âm chuẩn</span>
              </button>
            </div>

            {/* Grammar Usage Guide */}
            <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 text-xs text-amber-950">
              <span className="font-bold block mb-1">📌 Hướng dẫn &amp; Quy tắc sử dụng:</span>
              <p className="leading-relaxed">{selectedWord.usageGuide}</p>
            </div>

            {/* Common Collocations */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Cụm từ thông dụng hay đi kèm:
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedWord.commonCollocations.map((col, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePlay(col.split(' ')[0], 'col-' + idx)}
                    className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 text-xs font-semibold text-slate-700 transition-all flex items-center gap-1.5"
                  >
                    <span>{col}</span>
                    <Volume2 className="w-3 h-3 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 3 Practical Sentences */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              3 Mẫu câu thực tế chuyên sâu (Thực hành giao tiếp sân bay)
            </h4>

            {selectedWord.sentences.map((sent, index) => (
              <div
                key={sent.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-blue-300 transition-all space-y-3 shadow-xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">Mẫu câu {index + 1}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePlay(sent.chinese, 'sent-' + sent.id)}
                      className={`p-2 rounded-xl transition-all ${
                        activeSpeechId === 'sent-' + sent.id
                          ? 'bg-amber-400 text-slate-950 animate-pulse'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                      title="Nghe mẫu câu"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => startShadowing(sent)}
                      className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
                    >
                      <Mic className="w-3.5 h-3.5" />
                      <span>Luyện nói</span>
                    </button>
                  </div>
                </div>

                <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
                  {sent.chinese}
                </p>

                {showPinyin && (
                  <p className="text-xs font-mono text-blue-700 leading-relaxed">{sent.pinyin}</p>
                )}

                {showTranslation && (
                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    {sent.vietnamese}
                  </p>
                )}

                {sent.breakdown && (
                  <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex items-start gap-1.5">
                    <span className="text-blue-700 font-bold shrink-0">Ngữ pháp cốt lõi:</span>
                    <span className="text-slate-700">{sent.breakdown}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Shadowing Modal */}
      {shadowingSentence && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl space-y-5 my-8 text-slate-800">
            <button
              onClick={() => {
                setShadowingSentence(null);
                stopSpeaking();
              }}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs uppercase tracking-wider text-blue-700 font-bold bg-blue-100 px-2.5 py-1 rounded-full">
                Phòng Luyện Phát Âm &amp; Đọc Mẫu (Shadowing)
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-2">
                Luyện nói câu mẫu: &quot;{selectedWord.word}&quot;
              </h3>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Câu mẫu chuẩn:</span>
                <button
                  onClick={() => handlePlay(shadowingSentence.chinese, 'modal-play')}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Nghe lại</span>
                </button>
              </div>
              <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
                {shadowingSentence.chinese}
              </p>
              <p className="text-xs font-mono text-blue-600">{shadowingSentence.pinyin}</p>
              <p className="text-xs text-slate-600 bg-white p-2 rounded-lg border border-slate-100">
                {shadowingSentence.vietnamese}
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Giọng nói của bạn (nhấn micro để nói tiếng Trung):</span>
                {userTranscript && (
                  <button
                    onClick={() => setUserTranscript('')}
                    className="text-slate-400 hover:text-slate-600 flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Xóa làm lại</span>
                  </button>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={toggleRecording}
                  className={`p-4 rounded-2xl font-bold flex items-center justify-center transition-all shrink-0 ${
                    isRecording
                      ? 'bg-rose-500 text-white animate-pulse shadow-md shadow-rose-500/30'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                  title={isRecording ? 'Đang ghi âm...' : 'Nhấn để nói'}
                >
                  {isRecording ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6 text-blue-600" />}
                </button>

                <textarea
                  value={userTranscript}
                  onChange={(e) => setUserTranscript(e.target.value)}
                  placeholder="Bật micro hoặc gõ câu tiếng Trung bạn vừa nói vào đây..."
                  rows={2}
                  className="flex-1 bg-slate-50 text-slate-900 p-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500 placeholder:text-slate-400 resize-none font-medium"
                />
              </div>

              {recordingError && (
                <div className="text-xs text-rose-600 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{recordingError}</span>
                </div>
              )}

              <button
                onClick={handleEvaluate}
                disabled={!userTranscript.trim() || isEvaluating}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>
                  {isEvaluating ? 'AI đang chấm điểm & phân tích...' : 'Chấm Điểm & Phản Hồi Ngay Lập Tức'}
                </span>
              </button>
            </div>

            {/* AI Evaluation Result */}
            {evaluationResult && (
              <div className="bg-gradient-to-br from-blue-50/90 to-indigo-50/70 border border-blue-200 rounded-2xl p-4 text-xs space-y-2.5 animate-fade-in text-slate-800">
                <div className="flex items-center justify-between border-b border-blue-200/70 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-blue-900">Kết quả đánh giá AI:</span>
                    <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold border border-blue-200">
                      {evaluationResult.fluencyLevel}
                    </span>
                  </div>
                  <div className="text-lg font-black text-blue-700">
                    {evaluationResult.score}
                    <span className="text-xs text-slate-500">/100đ</span>
                  </div>
                </div>

                <p className="text-slate-700 font-medium leading-relaxed">
                  {evaluationResult.feedbackVi}
                </p>

                {evaluationResult.pronunciationTipsVi && (
                  <div className="bg-white/80 p-2.5 rounded-xl border border-blue-200 text-slate-700">
                    <strong className="text-blue-900 block mb-0.5">Lời khuyên thanh điệu:</strong>
                    <span>{evaluationResult.pronunciationTipsVi}</span>
                  </div>
                )}

                {evaluationResult.betterAlternative && (
                  <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-900">
                        Cách nói tự nhiên hơn của người bản xứ:
                      </span>
                      <button
                        onClick={() => handlePlay(evaluationResult.betterAlternative, 'eval-better')}
                        className="text-emerald-700 hover:text-emerald-800 flex items-center gap-1 font-bold"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>Nghe</span>
                      </button>
                    </div>
                    <p className="text-sm font-bold text-emerald-950">
                      {evaluationResult.betterAlternative}
                    </p>
                    <p className="text-[11px] font-mono text-emerald-700">
                      {evaluationResult.betterAlternativePinyin}
                    </p>
                    <p className="text-[11px] text-slate-600">
                      {evaluationResult.betterAlternativeVi}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

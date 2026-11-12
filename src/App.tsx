import React, { useState } from 'react';
import { Header } from './components/Header';
import { CurriculumScenarios } from './components/CurriculumScenarios';
import { TeacherDashboard } from './components/TeacherDashboard';
import { VocabularyView } from './components/VocabularyView';
import { QuickReflexChallenge } from './components/QuickReflexChallenge';
import { Plane } from 'lucide-react';
import { AudioSubmissionsProvider } from './context/AudioSubmissionsContext';

export default function App() {
  const [activeTab, setActiveTab] = useState<'curriculum' | 'teacher' | 'vocabulary' | 'reflex'>(
    'curriculum'
  );
  const [showPinyin, setShowPinyin] = useState<boolean>(true);
  const [showTranslation, setShowTranslation] = useState<boolean>(true);
  const [speechRate, setSpeechRate] = useState<number>(0.9);

  return (
    <AudioSubmissionsProvider>
      <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-blue-600 selection:text-white antialiased">
        {/* Top Header */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          showPinyin={showPinyin}
          setShowPinyin={setShowPinyin}
          showTranslation={showTranslation}
          setShowTranslation={setShowTranslation}
          speechRate={speechRate}
          setSpeechRate={setSpeechRate}
        />

        {/* Main Content Area */}
        <main className="flex-1 pt-16 pb-16">
          {activeTab === 'curriculum' && (
            <CurriculumScenarios
              showPinyin={showPinyin}
              showTranslation={showTranslation}
              speechRate={speechRate}
            />
          )}

          {activeTab === 'teacher' && (
            <TeacherDashboard speechRate={speechRate} />
          )}

          {activeTab === 'vocabulary' && (
            <VocabularyView
              showPinyin={showPinyin}
              showTranslation={showTranslation}
              speechRate={speechRate}
            />
          )}

          {activeTab === 'reflex' && (
            <QuickReflexChallenge
              showPinyin={showPinyin}
              showTranslation={showTranslation}
              speechRate={speechRate}
            />
          )}
        </main>

        {/* Luxury Navy Footer */}
        <footer className="border-t border-slate-200/80 bg-white/80 backdrop-blur-md text-xs text-slate-500 py-6 px-4">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="flex items-center gap-2 text-slate-700">
              <Plane className="w-4 h-4 text-blue-600 -rotate-45" />
              <span className="font-bold text-slate-900">
                ✈️ 机场口语练习 &bull; HanYu FeiXing
              </span>
              <span className="hidden sm:inline text-slate-400">
                - Luyện nói tiếng Trung chủ đề Sân bay theo tình huống thực tế
              </span>
            </div>
            <div className="text-slate-500 font-medium">
              Chúc các bạn học sinh luyện nói thật tốt và tự tin! 🛫✨
            </div>
          </div>
        </footer>
      </div>
    </AudioSubmissionsProvider>
  );
}

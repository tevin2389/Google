import React from "react";
import { 
  Sparkles, 
  Gamepad2, 
  BarChart2, 
  BookOpen, 
  Laptop, 
  CheckCircle2,
  Cpu,
  Globe,
  Flame
} from "lucide-react";
import { OllamaSettings } from "../types";

interface NavbarProps {
  activeTab: "work" | "stats";
  setActiveTab: (tab: "work" | "stats") => void;
  openPlaybook: () => void;
  openOllamaModal: () => void;
  openWindowsBot: () => void;
  openConnectionModal: () => void;
  ollamaSettings: OllamaSettings;
  blogCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  openPlaybook,
  openOllamaModal,
  openWindowsBot,
  openConnectionModal,
  ollamaSettings,
  blogCount,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 via-amber-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-orange-500/20 ring-1 ring-white/10">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  AutoBlog Pro
                </span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-300 border border-orange-500/30 flex items-center gap-1">
                  <Globe className="w-2.5 h-2.5" /> 해외 구글 블로그
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                구글 블로그 전용 3단 AI 무인 자동화 (주제 AI ➔ 글쓰기 AI ➔ 발행 및 분석 AI)
              </p>
            </div>
          </div>

          {/* GAME-STYLE 2 MAIN BUTTONS: [작업] & [통계] */}
          <div className="flex items-center p-1 rounded-2xl bg-slate-900 border border-slate-800 shadow-inner">
            <button
              id="nav-tab-work"
              onClick={() => setActiveTab("work")}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all ${
                activeTab === "work"
                  ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30 ring-1 ring-orange-400/50 scale-[1.02]"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/80"
              }`}
            >
              <Gamepad2 className="w-4 h-4" />
              <span>작업 (Work)</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${activeTab === "work" ? "bg-black/30 text-white" : "bg-slate-800 text-slate-400"}`}>
                {blogCount}
              </span>
            </button>

            <button
              id="nav-tab-stats"
              onClick={() => setActiveTab("stats")}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all ${
                activeTab === "stats"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30 ring-1 ring-indigo-400/50 scale-[1.02]"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/80"
              }`}
            >
              <BarChart2 className="w-4 h-4" />
              <span>통계 (Stats)</span>
            </button>
          </div>

          {/* Quick Shortcuts & Modal Triggers */}
          <div className="flex items-center gap-2">
            {/* AI & Blog Connection Status Indicator */}
            <button
              id="btn-navbar-connection-status"
              onClick={openConnectionModal}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 shadow-sm transition-all hover:border-cyan-500/50"
              title="AI 엔진 및 구글 블로그 채널 연결 상태 보기"
            >
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                <span className="text-slate-300">
                  {ollamaSettings.useOllama && ollamaSettings.isConnected ? "Ollama 로컬 AI" : "Gemini 클라우드 AI"}
                </span>
              </div>
              <div className="w-px h-3 bg-slate-700 hidden sm:block" />
              <div className="hidden sm:flex items-center gap-1 text-orange-300">
                <Globe className="w-3 h-3 text-orange-400" />
                <span>블로그 {blogCount}개</span>
              </div>
            </button>

            {/* Ollama Switcher */}
            <button
              id="btn-navbar-ollama"
              onClick={openOllamaModal}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                ollamaSettings.useOllama
                  ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/25"
                  : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
              }`}
              title="로컬 Ollama 설정 (100% 무료 무제한)"
            >
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden md:inline">Ollama 무료</span>
            </button>

            {/* Windows Bot trigger */}
            <button
              id="btn-navbar-windows-bot"
              onClick={openWindowsBot}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-indigo-300 border border-slate-800 transition-colors"
              title="윈도우 24시간 무인 실행 패키지 (bot.py + run_bot.bat)"
            >
              <Laptop className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">윈도우 봇</span>
            </button>

            {/* Playbook */}
            <button
              id="btn-open-playbook"
              onClick={openPlaybook}
              className="hidden lg:flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>수익화 비법</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

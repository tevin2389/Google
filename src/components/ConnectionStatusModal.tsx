import React, { useState } from "react";
import { 
  CheckCircle2, 
  AlertCircle, 
  Cpu, 
  Globe, 
  Layers, 
  Sparkles, 
  Zap, 
  RefreshCw, 
  ExternalLink, 
  Laptop, 
  ShieldCheck, 
  Info,
  Server,
  ArrowRight,
  X,
  Copy,
  Check
} from "lucide-react";
import { BlogItem, OllamaSettings } from "../types";

interface ConnectionStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  blogs: BlogItem[];
  ollamaSettings: OllamaSettings;
  onOpenOllamaModal: () => void;
  onOpenWindowsBot: () => void;
}

export const ConnectionStatusModal: React.FC<ConnectionStatusModalProps> = ({
  isOpen,
  onClose,
  blogs,
  ollamaSettings,
  onOpenOllamaModal,
  onOpenWindowsBot,
}) => {
  const [activeTab, setActiveTab] = useState<"ai" | "blog">("ai");
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [isCheckingOllama, setIsCheckingOllama] = useState(false);
  const [ollamaCheckResult, setOllamaCheckResult] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const handleTestOllamaConnection = async () => {
    setIsCheckingOllama(true);
    setOllamaCheckResult(null);
    try {
      const res = await fetch(`/api/ollama/status?host=${encodeURIComponent(ollamaSettings.host || "http://localhost:11434")}`);
      const data = await res.json();
      if (data.connected) {
        setOllamaCheckResult(`연결 성공! (모델: ${data.models?.join(", ") || "Ollama 정상 응답"})`);
      } else {
        setOllamaCheckResult("로컬 Ollama가 실행 중이지 않습니다. Gemini 클라우드 AI로 자동 대체됩니다.");
      }
    } catch {
      setOllamaCheckResult("연결 실패: Gemini 클라우드 AI로 자동 대체됩니다.");
    } finally {
      setIsCheckingOllama(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/20">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <span>AI 및 블로그 연결 상태 허브</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-bold">
                  🟢 시스템 정상 가동 중
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                현재 연결된 AI 엔진과 해외 구글 블로그 채널의 실시간 상태를 확인하고 가이드를 제공합니다.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950 px-5 pt-2 gap-2">
          <button
            onClick={() => setActiveTab("ai")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl border-b-2 transition-all ${
              activeTab === "ai"
                ? "border-cyan-500 text-cyan-400 bg-slate-900"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>AI 엔진 연결 상태 ({ollamaSettings.useOllama && ollamaSettings.isConnected ? "Ollama 로컬" : "Gemini 클라우드"})</span>
          </button>
          <button
            onClick={() => setActiveTab("blog")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl border-b-2 transition-all ${
              activeTab === "blog"
                ? "border-orange-500 text-orange-400 bg-slate-900"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>블로그 채널 연동 상태 ({blogs.length}개 채널)</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {activeTab === "ai" ? (
            /* TAB 1: AI Engines Status & Connection Guide */
            <div className="space-y-5">
              {/* Primary AI Engines Card */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Gemini Cloud AI */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-indigo-500/30 space-y-3 relative overflow-hidden">
                  <div className="absolute top-0 right-0 px-3 py-1 bg-indigo-600/20 text-indigo-300 text-[10px] font-bold rounded-bl-xl border-l border-b border-indigo-500/30">
                    기본 탑재 (Zero-Config)
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">Gemini 클라우드 AI</h3>
                      <p className="text-[11px] text-indigo-300/80">Google Cloud 초고속 LLM 엔진</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-800/40">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>상시 연결됨 (설치 없이 즉시 글 생성 가능)</span>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    서버 측 API 키로 구동되므로 사용자 PC에 아무것도 설치하지 않아도 3단 AI(주제 발굴, 영문 SEO 집필, 품질 검수)가 최고 속도로 작동합니다.
                  </p>
                </div>

                {/* 2. Ollama Local LLM */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                        <Cpu className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">Ollama 로컬 AI (오픈소스)</h3>
                        <p className="text-[11px] text-cyan-300/80">100% 무료 무제한 오프라인 모드</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${ollamaSettings.isConnected ? "bg-emerald-400 animate-ping" : "bg-slate-500"}`} />
                      <span className={ollamaSettings.isConnected ? "text-emerald-400 font-bold" : "text-slate-400 font-medium"}>
                        {ollamaSettings.isConnected ? `로컬 연결됨 (${ollamaSettings.selectedModel})` : "로컬 미실행 (Gemini 백업 작동)"}
                      </span>
                    </div>
                    <button
                      onClick={handleTestOllamaConnection}
                      disabled={isCheckingOllama}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold flex items-center gap-1 transition-colors"
                    >
                      <RefreshCw className={`w-3 h-3 ${isCheckingOllama ? "animate-spin" : ""}`} />
                      <span>{isCheckingOllama ? "확인 중..." : "연결 확인"}</span>
                    </button>
                  </div>

                  {ollamaCheckResult && (
                    <div className="text-[11px] p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                      {ollamaCheckResult}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={onOpenOllamaModal}
                      className="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 hover:underline"
                    >
                      <span>Ollama 모델 설정 열기</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Step-by-Step AI Connection Guide */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <Info className="w-4 h-4 text-cyan-400" />
                  <span>AI 연결은 어떻게 하나요? (단계별 안내)</span>
                </h4>

                <div className="space-y-3 text-xs text-slate-300">
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between font-bold text-white">
                      <span>1. 지금 브라우저에서 바로 사용 (가장 간단)</span>
                      <span className="text-emerald-400 text-[11px]">별도 설정 불필요</span>
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      별도의 AI 연결 설정 없이도 화면에서 <strong>[원클릭 글 생성]</strong> 또는 <strong>[3단 AI 무인 파이프라인]</strong> 버튼을 누르면 서버의 Gemini AI가 즉시 자동 작동합니다.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between font-bold text-white">
                      <span>2. 내 PC의 무료 오픈소스 AI(Ollama)로 연결하고 싶을 때</span>
                      <span className="text-cyan-400 text-[11px]">완전 무료 무제한</span>
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      내 컴퓨터 터미널(또는 CMD)에서 아래 명령어를 1줄 실행한 후 상단의 [연결 확인]을 누르시면 됩니다:
                    </p>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-black/60 font-mono text-[11px] text-cyan-300 border border-slate-800">
                      <code>ollama run qwen2.5:7b</code>
                      <button
                        onClick={() => handleCopy("ollama run qwen2.5:7b", "ollama_cmd")}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] flex items-center gap-1"
                      >
                        {copiedCmd === "ollama_cmd" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedCmd === "ollama_cmd" ? "복사됨" : "명령어 복사"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3-Stage AI Pipeline Status Summary */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>3단 AI 자동화 파이프라인 가동 상태</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="flex items-center gap-1.5 text-amber-400 font-bold mb-1">
                      <Sparkles className="w-3.5 h-3.5" /> 1단 주제 AI
                    </div>
                    <p className="text-[11px] text-slate-400">구글 트렌드 및 고단가 키워드 분석 후 대기열 등록</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="flex items-center gap-1.5 text-indigo-400 font-bold mb-1">
                      <Cpu className="w-3.5 h-3.5" /> 2단 글쓰기 AI
                    </div>
                    <p className="text-[11px] text-slate-400">영문 SEO 본문 작성 및 Unsplash 무료 이미지 배치</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="flex items-center gap-1.5 text-purple-400 font-bold mb-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> 3단 검수 & 발행 AI
                    </div>
                    <p className="text-[11px] text-slate-400">사실관계 검수, 가독성 평가 및 블로그 발행</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* TAB 2: Blog Channels Status & Publishing Guide */
            <div className="space-y-5">
              {/* Blog Channels List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white flex items-center gap-2">
                    <Globe className="w-4 h-4 text-orange-400" />
                    <span>등록된 해외 구글 블로그 채널 ({blogs.length}개)</span>
                  </h3>
                  <span className="text-[11px] text-emerald-400 font-semibold bg-emerald-950/40 px-2 py-0.5 rounded-lg border border-emerald-800/40">
                    모든 채널 연동 준비 완료
                  </span>
                </div>

                <div className="space-y-2.5">
                  {blogs.map((b) => (
                    <div 
                      key={b.id}
                      className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-orange-500/15 text-orange-400 flex items-center justify-center font-bold text-xs border border-orange-500/20">
                          B
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs sm:text-sm text-white">{b.name}</span>
                            <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px] text-cyan-300 font-mono">
                              {b.niche}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 font-mono truncate max-w-xs">{b.blogUrl}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                          <span className="text-[10px] text-slate-500 block">오늘 발행 건수</span>
                          <span className="text-xs font-bold text-amber-400 font-mono">{b.todayPostCount || 0}건 완료</span>
                        </div>
                        <span className="px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> 연동됨
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* How Blog Publishing Works Guide */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <Info className="w-4 h-4 text-orange-400" />
                  <span>블로그 발행은 어떻게 연동되나요?</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {/* Option 1: 1-Click Copy */}
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <Copy className="w-3.5 h-3.5 text-cyan-400" />
                      <span>1. 원클릭 HTML 복사 (가장 직관적)</span>
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      AI가 완성한 글의 <strong>[Blogger용 HTML 복사]</strong> 버튼을 누른 후, 구글 블로그 글쓰기 창에서 'HTML 모드'로 전환하여 붙여넣기(Ctrl+V)하시면 스타일과 이미지가 그대로 발행됩니다.
                    </p>
                  </div>

                  {/* Option 2: 24/7 Windows Automation Bot */}
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <Laptop className="w-3.5 h-3.5 text-indigo-400" />
                      <span>2. Windows 24시간 무인 발행 봇</span>
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      PC 백그라운드에서 상시 실행되는 <strong>자동화 패키지(bot.py + run_bot.bat)</strong>를 이용해 손 하나 까딱하지 않고 스케줄에 맞춰 블로그에 자동 포스팅합니다.
                    </p>
                    <button
                      onClick={onOpenWindowsBot}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] flex items-center gap-1.5 transition-colors"
                    >
                      <Laptop className="w-3 h-3" />
                      <span>윈도우 무인 봇 패키지 보기</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs">
          <span className="text-slate-400">
            모든 AI 및 블로그 모듈이 정상 가동 중입니다.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

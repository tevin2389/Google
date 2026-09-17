import React, { useState, useEffect } from "react";
import { 
  Laptop, 
  Terminal, 
  Download, 
  Copy, 
  Check, 
  Play, 
  Settings, 
  FileCode, 
  Cpu, 
  Layers, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  FolderOpen,
  Sparkles,
  ExternalLink
} from "lucide-react";
import { BlogItem, OllamaSettings } from "../types";
import { X } from "lucide-react";

interface WindowsBotDownloaderProps {
  blogs: BlogItem[];
  ollamaSettings: OllamaSettings;
  queueKeywords?: string[];
  isModal?: boolean;
  onClose?: () => void;
}

export const WindowsBotDownloader: React.FC<WindowsBotDownloaderProps> = ({
  blogs,
  ollamaSettings,
  queueKeywords = [],
  isModal = false,
  onClose,
}) => {
  const [wpSiteUrl, setWpSiteUrl] = useState("https://myblog.com");
  const [wpUser, setWpUser] = useState("admin");
  const [wpAppPassword, setWpAppPassword] = useState("xxxx xxxx xxxx xxxx");
  const [useOllamaDirect, setUseOllamaDirect] = useState(true);

  const [botCode, setBotCode] = useState("");
  const [batchCode, setBatchCode] = useState("");
  const [powershellCode, setPowershellCode] = useState("");
  const [activeCodeTab, setActiveCodeTab] = useState<"python" | "bat" | "schedule">("python");
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // Fetch updated Windows script whenever blogs or settings change
  useEffect(() => {
    fetch("/api/generate-windows-script", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        blogs,
        ollamaHost: ollamaSettings.host,
        useOllamaDirect,
        wpSiteUrl,
        wpUser,
        wpAppPassword,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setBotCode(data.pythonScript);
        setBatchCode(data.batchRunner);
        setPowershellCode(data.powershellScheduler);
      })
      .catch((err) => console.error("Script fetch error:", err));
  }, [blogs, ollamaSettings, useOllamaDirect, wpSiteUrl, wpUser, wpAppPassword]);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleDownloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const content = (
    <div className="space-y-8">
      {/* Hero Explainer for Windows Execution */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950/40 border border-cyan-500/30 rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center shadow-lg shadow-cyan-500/10">
              <Laptop className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white">
                  윈도우 전용 무인 구글 블로그 3단 AI 봇 패키지
                </h2>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  더블클릭 원클릭 가동
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                "윈도우에서 돌아가는 프로그램 만들 수 있어? Ollama로 100% 무료 무제한 가능해?" — <strong>네, 완벽하게 구현되어 있습니다!</strong><br />
                내 컴퓨터(Windows)에서 <code className="text-cyan-300 font-mono">run_bot.bat</code>을 더블클릭하면, 
                <strong>3대 AI(주제 AI ➔ 글쓰기 AI ➔ 발행 및 분석 AI)</strong>가 백그라운드에서 주기 및 긴급(10초) 타이머에 맞춰 {blogs.length}개의 구글 블로그를 무인 관리합니다.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleDownloadFile("run_bot.bat", batchCode)}
              className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-600/30 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>run_bot.bat 다운로드</span>
            </button>
            <button
              onClick={() => handleDownloadFile("bot.py", botCode)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-2 border border-slate-700 transition-all"
            >
              <FileCode className="w-4 h-4" />
              <span>bot.py 다운로드</span>
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors border border-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* 3 Steps Guide Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1.5">
            <div className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-[11px]">1</span>
              <span>스크립트 2개 다운로드</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              우측 상단 버튼으로 <code className="text-slate-200">bot.py</code>와 <code className="text-slate-200">run_bot.bat</code>을 다운로드하여 윈도우의 원하는 폴더에 넣습니다.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1.5">
            <div className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-[11px]">2</span>
              <span>run_bot.bat 더블 클릭 실행</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              윈도우 탐색기에서 더블클릭하면 Ollama 상태 확인 및 필수 라이브러리 자동 설치 후 3대 AI 백그라운드 스레드가 작동합니다.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1.5">
            <div className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-[11px]">3</span>
              <span>24시간 무인 수익 파이프라인</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              주제 AI가 발굴한 글이 타이머 만료 시 글쓰기 AI와 발행 AI를 거쳐 블로그로 자동 발행 및 <code className="text-slate-200">published_posts/</code>에 영구 보관됩니다.
            </p>
          </div>
        </div>
      </div>

      {/* Main Configurations & Code Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Configuration & Blog List Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-5">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Settings className="w-4 h-4 text-cyan-400" />
              <span>윈도우 봇 연동 환경 설정</span>
            </h3>

            {/* Ollama Switcher */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-white flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  Ollama 로컬 직결 (무제한 무료)
                </span>
                <input
                  type="checkbox"
                  checked={useOllamaDirect}
                  onChange={(e) => setUseOllamaDirect(e.target.checked)}
                  className="w-4 h-4 accent-cyan-500"
                />
              </div>
              <p className="text-[11px] text-slate-400">
                Ollama 로컬 호스트: <span className="font-mono text-cyan-300">{ollamaSettings.host}</span>
              </p>
            </div>

            {/* Managed Blogs Summary */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300">
                  봇에 등록된 블로그 채널 ({blogs.length}개)
                </span>
              </div>
              <div className="space-y-2">
                {blogs.map((b) => (
                  <div
                    key={b.id}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-white block">{b.name}</span>
                      <span className="text-[11px] text-slate-400">
                        {b.platform.toUpperCase()} · 카테고리: {b.niche}
                      </span>
                    </div>
                    <div className="text-right text-[10px] text-cyan-400 font-mono">
                      <div>집필 대기: {b.defaultWriteDelaySec}s</div>
                      <div>발행 대기: {b.defaultPublishDelaySec}s</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Optional WordPress Details */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
              <div className="font-semibold text-cyan-300">워드프레스 자동 발행 정보 (선택 사항)</div>
              <div className="space-y-1">
                <label className="text-slate-400 text-[11px]">워드프레스 사이트 주소</label>
                <input
                  type="text"
                  value={wpSiteUrl}
                  onChange={(e) => setWpSiteUrl(e.target.value)}
                  placeholder="https://myblog.com"
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-slate-400 text-[11px]">관리자 ID</label>
                  <input
                    type="text"
                    value={wpUser}
                    onChange={(e) => setWpUser(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 text-[11px]">응용 프로그램 비밀번호</label>
                  <input
                    type="password"
                    value={wpAppPassword}
                    onChange={(e) => setWpAppPassword(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Code Inspector & Windows Scheduler Guide */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            {/* Tab Bar */}
            <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveCodeTab("python")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    activeCodeTab === "python"
                      ? "bg-cyan-600 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  bot.py (3단 AI 멀티블로그 봇)
                </button>
                <button
                  onClick={() => setActiveCodeTab("bat")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    activeCodeTab === "bat"
                      ? "bg-cyan-600 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  run_bot.bat (원클릭 실행기)
                </button>
                <button
                  onClick={() => setActiveCodeTab("schedule")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    activeCodeTab === "schedule"
                      ? "bg-cyan-600 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  윈도우 부팅 자동화 스케줄러
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const content =
                      activeCodeTab === "python"
                        ? botCode
                        : activeCodeTab === "bat"
                        ? batchCode
                        : powershellCode;
                    handleCopy(content, activeCodeTab);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 border border-slate-700"
                >
                  {copiedType === activeCodeTab ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedType === activeCodeTab ? "복사됨!" : "코드 복사"}</span>
                </button>
              </div>
            </div>

            {/* Code Content */}
            <div className="p-4 bg-slate-950 max-h-[500px] overflow-y-auto">
              {activeCodeTab === "python" && (
                <pre className="text-xs font-mono text-cyan-300 leading-relaxed overflow-x-auto">
                  {botCode}
                </pre>
              )}
              {activeCodeTab === "bat" && (
                <pre className="text-xs font-mono text-emerald-400 leading-relaxed overflow-x-auto">
                  {batchCode}
                </pre>
              )}
              {activeCodeTab === "schedule" && (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-300">
                    💡 <strong>컴퓨터 켜지면 무인으로 돌리는 법 (작업 스케줄러):</strong><br />
                    PowerShell을 관리자 권한으로 열고 아래 한 줄을 실행하면, 윈도우 부팅 시 자동으로 무인 봇이 백그라운드에서 실행됩니다.
                  </div>
                  <pre className="text-xs font-mono text-amber-300 leading-relaxed overflow-x-auto bg-slate-900 p-3 rounded-lg border border-slate-800">
                    {powershellCode}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
        <div className="w-full max-w-5xl my-8 bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl">
          {content}
        </div>
      </div>
    );
  }

  return content;
};

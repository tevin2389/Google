import React, { useState } from "react";
import { 
  X, 
  Cpu, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Terminal, 
  Sparkles, 
  ShieldCheck,
  ExternalLink
} from "lucide-react";
import { OllamaSettings } from "../types";

interface OllamaSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: OllamaSettings;
  onSave: (newSettings: OllamaSettings) => void;
}

export const OllamaSettingsModal: React.FC<OllamaSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave,
}) => {
  const [host, setHost] = useState(settings.host || "http://localhost:11434");
  const [model, setModel] = useState(settings.selectedModel || "qwen2.5:7b");
  const [useOllama, setUseOllama] = useState(settings.useOllama);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    ok: boolean;
    models?: string[];
    message?: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);

    try {
      const res = await fetch(`/api/ollama/status?host=${encodeURIComponent(host)}`);
      const data = await res.json();
      if (data.connected) {
        setTestResult({
          ok: true,
          models: data.models,
          message: `Ollama가 정상 연결되었습니다! (${data.models.length}개 모델 탐지됨)`,
        });
      } else {
        setTestResult({
          ok: false,
          message: "Ollama 응답 대기 중입니다. 윈도우 PC에서 'ollama run qwen2.5:7b'를 켜두시면 윈도우 무인 봇이 100% 무료 무제한으로 직결됩니다.",
        });
      }
    } catch (e: any) {
      setTestResult({
        ok: false,
        message: "연결 확인 실패: " + e.message,
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = () => {
    onSave({
      host,
      selectedModel: model,
      useOllama,
      isConnected: testResult ? testResult.ok : settings.isConnected,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Ollama 로컬 AI 엔진 설정</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-semibold border border-emerald-500/30">
                  100% 무료 · API 비용 0원
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                내 컴퓨터(Windows)의 GPU로 API 제한 없이 무제한 자동 글 생성
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

        {/* Body */}
        <div className="p-6 space-y-5 text-xs text-slate-300">
          {/* Toggle */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <div>
              <span className="font-bold text-sm text-white block">Ollama AI 엔진 활성화</span>
              <p className="text-slate-400 text-[11px] mt-0.5">
                활성화 시 유료 토큰 걱정 없이 로컬 Ollama 모델을 최우선으로 사용하여 글을 작성합니다.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={useOllama}
                onChange={(e) => setUseOllama(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
            </label>
          </div>

          {/* Host Input */}
          <div className="space-y-1.5">
            <label className="block font-semibold text-slate-200">
              Ollama 로컬 주소 (기본 포트 11434)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={host}
                onChange={(e) => setHost(e.target.value)}
                placeholder="http://localhost:11434"
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
              />
              <button
                onClick={handleTestConnection}
                disabled={testing}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold border border-slate-700 flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${testing ? "animate-spin" : ""}`} />
                <span>연결 테스트</span>
              </button>
            </div>
          </div>

          {/* Model Selector */}
          <div className="space-y-1.5">
            <label className="block font-semibold text-slate-200">
              사용할 Ollama 모델 선택
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
            >
              <option value="qwen2.5:7b">Qwen 2.5 7B (강력 추천: 한국어 글쓰기 최고 성능)</option>
              <option value="qwen2.5:14b">Qwen 2.5 14B (고품질 전문 지식 포스팅)</option>
              <option value="exaone3.5:7.8b">LG EXAONE 3.5 7.8B (한국어 특화 모델)</option>
              <option value="llama3.1:8b">Llama 3.1 8B (글로벌 범용 고속 모델)</option>
              <option value="gemma2:9b">Google Gemma 2 9B (구글의 가벼운 모델)</option>
              <option value="deepseek-r1:8b">DeepSeek R1 8B (추론 및 심층 논리형 모델)</option>
            </select>
          </div>

          {/* Connection Result */}
          {testResult && (
            <div
              className={`p-3.5 rounded-xl border flex items-start gap-2.5 ${
                testResult.ok
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                  : "bg-amber-500/10 border-amber-500/30 text-amber-200"
              }`}
            >
              {testResult.ok ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
              )}
              <div className="text-[11px] leading-relaxed">
                {testResult.message}
              </div>
            </div>
          )}

          {/* Quick Guide */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-slate-300">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>윈도우 명령 프롬프트(CMD)에서 3초 만에 모델 받기</span>
            </div>
            <div className="p-2.5 rounded-lg bg-black/70 font-mono text-cyan-300 text-[11px] select-all">
              ollama run qwen2.5:7b
            </div>
            <p className="text-[10px] text-slate-500">
              위 명령어를 한 번만 실행해 두면, 윈도우 무인 봇이 백그라운드에서 Ollama를 통해 글을 무제한 무료로 찍어냅니다.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            * 로컬 연결 실패 시 클라우드 AI로 자동 안전 백업
          </span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
            >
              취소
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 shadow-lg shadow-cyan-600/30 transition-all"
            >
              설정 저장 적용
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

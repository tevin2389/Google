import React, { useState, useEffect } from "react";
import { 
  X, 
  Sparkles, 
  Settings, 
  Save, 
  Bot, 
  Cpu, 
  Clock, 
  FileText, 
  ShieldCheck, 
  DollarSign, 
  Sliders, 
  RotateCcw,
  CheckCircle2,
  Image as ImageIcon,
  Search,
  ExternalLink
} from "lucide-react";
import { BlogItem, StageAiConfig, WritingTone, PostLength, OllamaSettings, AutoImageConfig } from "../types";

interface AiStageSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stage: "topic" | "writer" | "publisher";
  blog: BlogItem;
  ollamaSettings: OllamaSettings;
  onSaveConfig: (stage: "topic" | "writer" | "publisher", config: StageAiConfig) => void;
}

export const AiStageSettingsModal: React.FC<AiStageSettingsModalProps> = ({
  isOpen,
  onClose,
  stage,
  blog,
  ollamaSettings,
  onSaveConfig,
}) => {
  const currentConfig: StageAiConfig = 
    stage === "topic" 
      ? blog.topicAiConfig || {} 
      : stage === "writer" 
      ? blog.writerAiConfig || {} 
      : blog.analyticsAiConfig || {};

  const [customPrompt, setCustomPrompt] = useState(currentConfig.customPrompt || "");
  const [model, setModel] = useState(currentConfig.model || blog.ollamaModel || ollamaSettings.selectedModel || "qwen2.5:7b");
  const [tone, setTone] = useState<WritingTone>(currentConfig.tone || "expert");
  const [targetLength, setTargetLength] = useState<PostLength>(currentConfig.targetLength || "medium");
  const [delaySec, setDelaySec] = useState<number>(
    currentConfig.delaySec ?? (stage === "topic" ? blog.defaultWriteDelaySec : blog.defaultPublishDelaySec)
  );
  const [includeAdSlots, setIncludeAdSlots] = useState<boolean>(currentConfig.includeAdSlots ?? true);
  const [includeFaq, setIncludeFaq] = useState<boolean>(currentConfig.includeFaq ?? true);
  
  // Automatic Image Insertion Settings for Writer AI
  const [imageEnabled, setImageEnabled] = useState<boolean>(currentConfig.autoImageConfig?.enabled ?? true);
  const [imageProvider, setImageProvider] = useState<"all" | "wikimedia" | "openverse" | "unsplash">(currentConfig.autoImageConfig?.provider || "all");
  const [defaultImages, setDefaultImages] = useState<number>(currentConfig.autoImageConfig?.defaultImages || 2);
  const [maxImages, setMaxImages] = useState<number>(currentConfig.autoImageConfig?.maxImages || 3);
  const [requireLicenseCheck, setRequireLicenseCheck] = useState<boolean>(currentConfig.autoImageConfig?.requireLicenseCheck ?? true);
  
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const cfg = 
        stage === "topic" 
          ? blog.topicAiConfig || {} 
          : stage === "writer" 
          ? blog.writerAiConfig || {} 
          : blog.analyticsAiConfig || {};

      setCustomPrompt(cfg.customPrompt || "");
      setModel(cfg.model || blog.ollamaModel || ollamaSettings.selectedModel || "qwen2.5:7b");
      setTone(cfg.tone || "expert");
      setTargetLength(cfg.targetLength || "medium");
      setDelaySec(cfg.delaySec ?? (stage === "topic" ? blog.defaultWriteDelaySec : blog.defaultPublishDelaySec));
      setIncludeAdSlots(cfg.includeAdSlots ?? true);
      setIncludeFaq(cfg.includeFaq ?? true);
      
      const imgCfg = cfg.autoImageConfig || blog.autoImageConfig;
      setImageEnabled(imgCfg?.enabled ?? true);
      setImageProvider(imgCfg?.provider || "all");
      setDefaultImages(imgCfg?.defaultImages || 2);
      setMaxImages(imgCfg?.maxImages || 3);
      setRequireLicenseCheck(imgCfg?.requireLicenseCheck ?? true);

      setIsSaved(false);
    }
  }, [isOpen, stage, blog]);

  if (!isOpen) return null;

  const stageTitles = {
    topic: {
      name: "1단: 글 주제 발굴 AI (Topic AI)",
      color: "cyan",
      badge: "주제 발굴 & 키워드 분석",
      desc: "해외(미국/유럽) 고단가 검색어(High CPC)와 최신 실시간 이슈를 발굴하는 AI의 전용 설정입니다.",
      defaultPrompt: "미국 및 영미권 검색 사용자를 위한 고단가 금융/테크/SaaS 분야의 클릭 유도형 영문 주제 발굴. 롱테일 키워드와 상위 노출 의도를 반영할 것.",
    },
    writer: {
      name: "2단: 글쓰기 AI (Writer AI)",
      color: "indigo",
      badge: "영문 SEO 집필 & 애드센스 탑재",
      desc: "대기열에서 넘어온 주제를 구글 검색엔진 최적화(SEO) 및 구글 애드센스 고단가 광고 슬롯이 포함된 영문 기사로 작성하는 AI 설정입니다.",
      defaultPrompt: "Google Blogger 최적화 영문 SEO 기사 작성. H2/H3 계층 구조, 3줄 핵심 요약, 비교 테이블 1개 이상 필수 포함, <!-- GOOGLE_ADSENSE_HIGH_CPC_UNIT --> 광고 슬롯 최적 배치, 미국 원어민 전문 카피라이팅 톤 유지.",
    },
    publisher: {
      name: "3단: 발행 및 분석 AI (Publisher & Analytics AI)",
      color: "purple",
      badge: "블로그 발행 & 품질 진단",
      desc: "작성 완료된 글을 구글 블로그(Blogger)에 업로드하고 SEO 점수(90점+) 및 예상 애드센스 CPC를 진단하는 AI 설정입니다.",
      defaultPrompt: "작성된 영문 기사의 가독성, 체류시간 확보 요건, 리치 스니펫 대응력 및 구글 애드센스 고단가 클릭 유도성을 정밀 분석하여 SEO 점수와 예상 CPC를 산출할 것.",
    },
  };

  const info = stageTitles[stage];

  const handleSave = () => {
    const autoImageConfig: AutoImageConfig = {
      enabled: imageEnabled,
      provider: imageProvider,
      defaultImages,
      maxImages,
      minImages: 1,
      requireLicenseCheck,
      quality: "high",
    };

    onSaveConfig(stage, {
      customPrompt,
      model,
      tone,
      targetLength,
      delaySec,
      includeAdSlots,
      includeFaq,
      ...(stage === "writer" ? { autoImageConfig } : {}),
    });
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 600);
  };

  const handleResetToDefault = () => {
    setCustomPrompt(info.defaultPrompt);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg ${
              stage === "topic"
                ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                : stage === "writer"
                ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                : "bg-purple-500/20 text-purple-400 border border-purple-500/30"
            }`}>
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">{info.name} 개별 설정</h2>
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[11px] font-bold border border-slate-700">
                  {blog.name}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{info.desc}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Form */}
        <div className="space-y-5">
          {/* AI Model Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>이 AI가 사용할 LLM 모델</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: "qwen2.5:7b", name: "Qwen 2.5 7B", desc: "한국어/영어 최고 성능" },
                { id: "llama3.1:8b", name: "Llama 3.1 8B", desc: "글로벌 표준 영문 특화" },
                { id: "deepseek-r1:8b", name: "DeepSeek R1 8B", desc: "추론/SEO 논리 특화" },
                { id: "mistral:7b", name: "Mistral 7B", desc: "빠른 요약 & 속도" },
                { id: "cloud-gemini", name: "Cloud Gemini", desc: "구글 클라우드 모델" },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setModel(m.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    model === m.id
                      ? "bg-cyan-500/15 border-cyan-500 text-white shadow-md shadow-cyan-500/10"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                  }`}
                >
                  <p className="text-xs font-bold text-slate-200">{m.name}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{m.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Custom System Prompt for this AI */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-indigo-400" />
                <span>사용자 지정 AI 프롬프트 (System Prompt)</span>
              </label>
              <button
                type="button"
                onClick={handleResetToDefault}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 hover:underline"
              >
                <RotateCcw className="w-3 h-3" />
                <span>추천 기본값 불러오기</span>
              </button>
            </div>
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              rows={4}
              placeholder={info.defaultPrompt}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs leading-relaxed focus:outline-none focus:border-cyan-500 transition-colors font-mono"
            />
            <p className="text-[11px] text-slate-500">
              💡 이 블로그의 {info.badge} 시 AI가 가장 먼저 참고하는 지침입니다.
            </p>
          </div>

          {/* Stage-Specific Extra Settings */}
          {stage === "writer" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
              {/* Target Length */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">목표 글 분량</label>
                <select
                  value={targetLength}
                  onChange={(e) => setTargetLength(e.target.value as PostLength)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="short">약 1,200자 (핵심 요약형)</option>
                  <option value="medium">약 2,000자 (이상적 체류시간 확보형 - 권장)</option>
                  <option value="long">약 3,200자 이상 (초고밀도 딥다이브 가이드)</option>
                </select>
              </div>

              {/* Tone */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">글쓰기 톤앤매너</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value as WritingTone)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="expert">전문 분석가 & 리서처 톤 (신뢰도 극대화)</option>
                  <option value="friendly">친근한 테크 인사이더 톤 (대화형)</option>
                  <option value="concise">핵심 불렛포인트 중심 빠른 브리핑 톤</option>
                </select>
              </div>

              {/* Toggle Options */}
              <div className="sm:col-span-2 pt-2 border-t border-slate-800 flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={includeAdSlots}
                    onChange={(e) => setIncludeAdSlots(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 bg-slate-800 border-slate-700 focus:ring-indigo-500"
                  />
                  <span>구글 애드센스 고단가 광고 슬롯 자동 삽입</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={includeFaq}
                    onChange={(e) => setIncludeFaq(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 bg-slate-800 border-slate-700 focus:ring-indigo-500"
                  />
                  <span>구글 리치 스니펫 대응 FAQ 3선 포함</span>
                </label>
              </div>

              {/* Automatic Image Search & Insertion Settings */}
              <div className="sm:col-span-2 pt-4 border-t border-slate-800/80 space-y-3 bg-slate-900/50 p-4 rounded-xl border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <ImageIcon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white">자동 이미지 검색 & 본문 삽입 엔진</span>
                      <p className="text-[11px] text-slate-400">Ollama 판단 ➔ 인터넷 검색 ➔ 이미지 선별 ➔ figure/출처 자동 삽입</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={imageEnabled}
                      onChange={(e) => setImageEnabled(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>

                {imageEnabled && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-slate-300">이미지 검색 제공자</label>
                      <select
                        value={imageProvider}
                        onChange={(e) => setImageProvider(e.target.value as any)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-[11px] text-slate-200"
                      >
                        <option value="all">전체 통합 (위키미디어+Openverse+Unsplash)</option>
                        <option value="wikimedia">Wikimedia Commons (풍부한 저작권 메타)</option>
                        <option value="openverse">Openverse (Creative Commons 공식)</option>
                        <option value="unsplash">Unsplash Editorial (고화질 상업용 CDN)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-slate-300">기본 삽입 장수</label>
                      <select
                        value={defaultImages}
                        onChange={(e) => setDefaultImages(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-[11px] text-slate-200"
                      >
                        <option value={1}>1장 (도입부 대표 이미지)</option>
                        <option value={2}>2장 (도입부 + 본문 중간 구조도 - 권장)</option>
                        <option value={3}>3장 (도입부 + 중간 상세 2장)</option>
                        <option value={4}>4장 (최대 4장)</option>
                      </select>
                    </div>

                    <div className="space-y-1 flex flex-col justify-end">
                      <label className="flex items-center gap-2 cursor-pointer text-[11px] text-slate-300 py-1.5">
                        <input
                          type="checkbox"
                          checked={requireLicenseCheck}
                          onChange={(e) => setRequireLicenseCheck(e.target.checked)}
                          className="w-3.5 h-3.5 rounded text-emerald-600 bg-slate-950 border-slate-700"
                        />
                        <span>상업적 CC / 무료 라이선스 검증</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Default Delay Time */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {stage === "topic" 
                  ? "글쓰기 대기열 기본 카운트다운 시간 (초)" 
                  : "발행 대기열 기본 카운트다운 시간 (초)"}
              </span>
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={delaySec}
                onChange={(e) => setDelaySec(Math.max(5, parseInt(e.target.value) || 10))}
                className="w-36 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-cyan-500"
                min={5}
                max={86400}
              />
              <div className="flex items-center gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => setDelaySec(10)}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px]"
                >
                  10초 (긴급)
                </button>
                <button
                  type="button"
                  onClick={() => setDelaySec(60)}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px]"
                >
                  1분
                </button>
                <button
                  type="button"
                  onClick={() => setDelaySec(300)}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px]"
                >
                  5분
                </button>
                <button
                  type="button"
                  onClick={() => setDelaySec(3600)}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px]"
                >
                  1시간
                </button>
              </div>
            </div>
            <p className="text-[11px] text-slate-500">
              대기열에 새로 등록될 때 부여되는 기본 타이머입니다. (대기열 화면에서 개별 항목마다 + - 버튼으로 1분/15분/1시간 단위로 실시간 조절 가능)
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
          >
            취소
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaved}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-600/25 transition-all"
          >
            {isSaved ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>설정 저장 완료!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{info.name} 설정 저장</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

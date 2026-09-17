import React, { useState } from "react";
import { 
  Sparkles, 
  BrainCircuit, 
  Flame, 
  Lightbulb, 
  TrendingUp, 
  RotateCw, 
  ArrowRight, 
  CheckCircle2, 
  DollarSign, 
  Compass, 
  Target,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { BlogItem, DirectorAdvice, OllamaSettings } from "../types";

interface BlogDirectorAdvisorProps {
  blog: BlogItem;
  waitingWriteCount: number;
  waitingPublishCount: number;
  recentTopics: string[];
  ollamaSettings: OllamaSettings;
  onApplyRecommendedTopic: (topic: string, isUrgent: boolean) => void;
  onUpdateDirectorAdvice: (advice: DirectorAdvice) => void;
}

export const BlogDirectorAdvisor: React.FC<BlogDirectorAdvisorProps> = ({
  blog,
  waitingWriteCount,
  waitingPublishCount,
  recentTopics,
  ollamaSettings,
  onApplyRecommendedTopic,
  onUpdateDirectorAdvice,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  // Default initial advice tailored to the blog
  const currentAdvice: DirectorAdvice = blog.directorAdvice || {
    statusAssessment: `현재 '${blog.name}' 블로그는 오늘 총 ${blog.todayPostCount}건 발행되어 일일 목표(${blog.dailyGoal || 5}건) 대비 안정적인 진척도를 보이고 있습니다.`,
    actionPlan: `미국/영미권 검색자들의 고단가 구매 의도(Commercial Intent)를 겨냥하여 '${blog.niche}' 분야의 최신 비교 분석 기사를 대기열에 추가할 것을 권장합니다.`,
    recommendedTopic: `The Ultimate 2026 Comparison: Top 5 Solutions in ${blog.niche} for Global Teams`,
    urgency: "urgent",
    expectedCpc: "$4.80 ~ $6.20",
    strategyTips: [
      "H2 섹션 직후 구글 고단가 인피드 애드센스 슬롯 집중 배치",
      "미국 사용자들의 평균 체류시간 3분 이상을 위한 비교 요약 표 삽입",
      "FAQ 질문 3개로 구글 검색 결과 피처드 스니펫(Featured Snippet) 선점",
    ],
    lastUpdated: "방금 전",
  };

  const handleRequestAdvice = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/blog-advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blogId: blog.id,
          blogName: blog.name,
          niche: blog.niche,
          platform: blog.platform,
          todayPostCount: blog.todayPostCount,
          waitingWriteCount,
          waitingPublishCount,
          recentTopics,
          pastArticles: blog.articleDatabase || [],
          useOllama: ollamaSettings.useOllama,
          ollamaModel: blog.ollamaModel || ollamaSettings.selectedModel,
          ollamaHost: ollamaSettings.host,
        }),
      });

      if (!res.ok) throw new Error("총괄 AI 조언 생성 실패");
      const data = await res.json();

      const newAdvice: DirectorAdvice = {
        statusAssessment: data.statusAssessment,
        actionPlan: data.actionPlan,
        recommendedTopic: data.recommendedTopic,
        urgency: data.urgency || "urgent",
        expectedCpc: data.expectedCpc || "$5.00",
        strategyTips: data.strategyTips || [
          "H2 태그 직후 애드센스 광고 배치",
          "체류시간 증대를 위한 인터랙티브 표 서식 적용",
        ],
        lastUpdated: new Date().toLocaleTimeString(),
      };

      onUpdateDirectorAdvice(newAdvice);
    } catch (e) {
      console.error("Advisor error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-cyan-400 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-1.5">
                <span>블로그 총괄 디렉터 AI</span>
                <span className="text-indigo-400 font-mono text-xs font-normal">
                  (Chief Executive Advisor)
                </span>
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold">
                {blog.name} 전담
              </span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold font-mono">
                DB 아티클 {blog.articleDatabase?.length || 0}건 연계
              </span>
            </div>
            <p className="text-xs text-slate-400">
              현재 블로그의 발행 실적, 검색 트렌드 및 파이프라인 대기열을 실시간 분석하여 최적의 수익화 전략을 지시합니다.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            id="btn-ask-director-ai"
            onClick={handleRequestAdvice}
            disabled={isLoading}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>{isLoading ? "전략 분석 중..." : "실시간 맞춤 조언 요청"}</span>
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expandable Strategic Insights Body */}
      {isExpanded && (
        <div className="space-y-4 pt-2 border-t border-indigo-900/30">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Status Assessment */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/90 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
                <Compass className="w-4 h-4 text-indigo-400" />
                <span>📊 실시간 블로그 진단 리포트</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {currentAdvice.statusAssessment}
              </p>
            </div>

            {/* 2. Tactical Action Plan */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/90 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <span>💡 디렉터의 핵심 실천 전략</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {currentAdvice.actionPlan}
              </p>
            </div>
          </div>

          {/* Recommended Topic & 1-Click Action Box */}
          {currentAdvice.recommendedTopic && (
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/50 border border-indigo-500/30 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-rose-400" />
                  <span className="text-xs font-bold text-white">
                    🎯 총괄 AI가 추천하는 지금 가장 돈이 되는 영문 주제:
                  </span>
                </div>
                {currentAdvice.expectedCpc && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-bold font-mono self-start sm:self-auto">
                    예상 애드센스 CPC: {currentAdvice.expectedCpc}
                  </span>
                )}
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                <p className="text-xs sm:text-sm font-bold text-cyan-200 leading-snug">
                  "{currentAdvice.recommendedTopic}"
                </p>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onApplyRecommendedTopic(currentAdvice.recommendedTopic!, true)}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-rose-600/30 transition-all"
                  >
                    <Flame className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
                    <span>🚨 10초 긴급 모드로 즉시 실행</span>
                  </button>

                  <button
                    onClick={() => onApplyRecommendedTopic(currentAdvice.recommendedTopic!, false)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-1.5 border border-slate-700 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>💡 일반 파이프라인 추가</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Strategy Chips */}
          {currentAdvice.strategyTips && currentAdvice.strategyTips.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap text-[11px] text-slate-400 pt-1">
              <span className="font-semibold text-slate-300">📌 고수익 최적화 팁:</span>
              {currentAdvice.strategyTips.map((tip, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-indigo-950/40 text-indigo-300 border border-indigo-800/40 flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3 h-3 text-cyan-400 shrink-0" />
                  <span>{tip}</span>
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

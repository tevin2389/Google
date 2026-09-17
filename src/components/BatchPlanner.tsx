import React, { useState } from "react";
import { 
  Calendar, 
  Sparkles, 
  ArrowRight, 
  Plus, 
  Check, 
  Clock, 
  Layers, 
  FileText,
  Flame
} from "lucide-react";
import { BatchPlanItem } from "../types";

interface BatchPlannerProps {
  onSelectTopic: (topic: string) => void;
  onAddAllToQueue: (keywords: string[]) => void;
}

export const BatchPlanner: React.FC<BatchPlannerProps> = ({
  onSelectTopic,
  onAddAllToQueue,
}) => {
  const [niche, setNiche] = useState("2026 정부지원금 및 청년 재테크");
  const [days, setDays] = useState(14);
  const [targetPlatform, setTargetPlatform] = useState("tistory");
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<BatchPlanItem[]>([]);
  const [addedAll, setAddedAll] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGeneratePlan = async () => {
    setLoading(true);
    setErrorMsg(null);
    setAddedAll(false);

    try {
      const response = await fetch("/api/generate-batch-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ niche, days, targetPlatform }),
      });

      if (!response.ok) {
        throw new Error("플랜 생성 중 오류가 발생했습니다.");
      }

      const data = await response.json();
      setPlan(data.plan || []);
    } catch (err: any) {
      setErrorMsg(err.message || "플랜 생성 실패");
    } finally {
      setLoading(false);
    }
  };

  const handleAddAll = () => {
    if (plan.length > 0) {
      const keywords = plan.map((p) => p.keyword || p.title);
      onAddAllToQueue(keywords);
      setAddedAll(true);
      setTimeout(() => setAddedAll(false), 3000);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 border border-purple-500/20 rounded-2xl p-6 shadow-xl">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold border border-purple-500/30">
            <Layers className="w-3.5 h-3.5" />
            <span>꾸준함이 수익을 만듭니다: 14~30일치 원클릭 플랜</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            연속 자동 포스팅 마스터 캘린더 생성기
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            방문자가 끊이지 않고 구글 검색 상위 노출을 독점하기 위해, 서로 꼬리를 물며 링크를 유도하는 
            체계적인 14일/30일치 블로그 포스팅 일정을 AI가 한 번에 기획합니다.
          </p>
        </div>
      </div>

      {/* Inputs */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-6 space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              핵심 블로그 주제 / 카테고리
            </label>
            <input
              type="text"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              placeholder="예: 2026 청년 지원 정책 및 세금 절세"
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="md:col-span-3 space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              포스팅 일수
            </label>
            <select
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="w-full px-3 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
            >
              <option value={7}>7일치 플랜 (빠른 시작)</option>
              <option value={14}>14일치 플랜 (권장)</option>
              <option value={30}>30일치 완벽 정복 플랜</option>
            </select>
          </div>

          <div className="md:col-span-3 flex items-end">
            <button
              onClick={handleGeneratePlan}
              disabled={loading}
              className={`w-full py-3 px-4 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 shadow-lg transition-all ${
                loading
                  ? "bg-slate-700 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-500 shadow-purple-600/30"
              }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>30일 플랜 기획 중...</span>
                </>
              ) : (
                <>
                  <Calendar className="w-4 h-4" />
                  <span>캘린더 플랜 자동 생성</span>
                </>
              )}
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            {errorMsg}
          </div>
        )}
      </div>

      {/* Plan Results */}
      {plan.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-400" />
              <span>총 {plan.length}일치 단계별 포스팅 플랜</span>
            </h3>

            <button
              onClick={handleAddAll}
              disabled={addedAll}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                addedAll
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700"
              }`}
            >
              {addedAll ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span>{addedAll ? "윈도우 봇 대기열에 등록 완료!" : "모든 키워드 윈도우 봇 대기열에 일괄 등록"}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {plan.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-900/90 border border-slate-800 hover:border-purple-500/40 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4 transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      Day {item.day || idx + 1}
                    </span>
                    <span className="text-[11px] font-semibold text-amber-400">
                      수익성: {item.cpcPotential || "최상"}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white leading-snug">
                    {item.title}
                  </h4>

                  <div className="text-xs text-indigo-300 font-medium">
                    키워드: #{item.keyword}
                  </div>

                  {item.keyContentPoints && item.keyContentPoints.length > 0 && (
                    <div className="pt-2 border-t border-slate-800/80 space-y-1">
                      <span className="text-[10px] text-slate-500 uppercase font-semibold">핵심 다룰 내용:</span>
                      {item.keyContentPoints.map((pt, pIdx) => (
                        <p key={pIdx} className="text-xs text-slate-400 flex items-start gap-1.5">
                          <span className="text-purple-400 shrink-0">•</span>
                          <span>{pt}</span>
                        </p>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <button
                    onClick={() => onSelectTopic(item.title || item.keyword)}
                    className="w-full py-2 px-3 rounded-xl bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/30 text-purple-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>이 글 바로 작성하기</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

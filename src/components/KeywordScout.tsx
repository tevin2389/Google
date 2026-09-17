import React, { useState } from "react";
import { 
  Search, 
  Sparkles, 
  TrendingUp, 
  DollarSign, 
  ArrowRight, 
  Flame, 
  Award, 
  ShieldCheck, 
  Zap,
  Check,
  Plus
} from "lucide-react";
import { KeywordItem } from "../types";

interface KeywordScoutProps {
  onSelectKeyword: (keyword: string) => void;
  onAddToWindowsQueue: (keyword: string) => void;
}

export const KeywordScout: React.FC<KeywordScoutProps> = ({
  onSelectKeyword,
  onAddToWindowsQueue,
}) => {
  const [niche, setNiche] = useState("금융 및 재테크");
  const [targetPlatform, setTargetPlatform] = useState("tistory");
  const [monetizationGoal, setMonetizationGoal] = useState("adsense");
  const [loading, setLoading] = useState(false);
  const [keywords, setKeywords] = useState<KeywordItem[]>([]);
  const [addedQueueList, setAddedQueueList] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const presetNiches = [
    { label: "금융 및 재테크", desc: "애드센스 고단가 CPC 1위 ($2~$8+)" },
    { label: "2026 정부지원금 & 복지", desc: "매월 폭발적 트래픽 & 신청 유도" },
    { label: "가전제품 & IT 테크", desc: "쿠팡파트너스 3% 수수료 극대화" },
    { label: "건강식품 & 영양제", desc: "지속적인 스테디셀러 검색량" },
    { label: "직장인 부업 & 절세", desc: "2030 직장인 타겟 고수익" },
  ];

  const handleSearch = async (targetNiche = niche) => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch("/api/generate-keywords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          niche: targetNiche,
          targetPlatform,
          monetizationGoal,
        }),
      });

      if (!response.ok) {
        throw new Error("키워드 분석 중 오류가 발생했습니다.");
      }

      const data = await response.json();
      setKeywords(data.keywords || []);
    } catch (err: any) {
      setErrorMsg(err.message || "키워드 분석 실패");
    } finally {
      setLoading(false);
    }
  };

  const handleAddQueue = (keyword: string) => {
    onAddToWindowsQueue(keyword);
    setAddedQueueList((prev) => [...prev, keyword]);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-blue-500/20 rounded-2xl p-6 shadow-xl">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-500/30">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>수익화 90%는 '키워드'에서 결정됩니다</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            블루오션 황금 키워드 & 고단가 CPC 발굴기
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            구글 검색엔진 알고리즘과 국내 블로그 트렌드를 분석하여, 검색량은 많고 경쟁은 적으면서 
            클릭당 단가(CPC)가 높은 키워드를 발굴합니다.
          </p>
        </div>

        {/* Preset Chips */}
        <div className="flex flex-wrap gap-2 pt-5">
          {presetNiches.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                setNiche(item.label);
                handleSearch(item.label);
              }}
              className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all text-left ${
                niche === item.label
                  ? "bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30"
                  : "bg-slate-950/60 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
              }`}
            >
              <div className="font-bold">{item.label}</div>
              <div className="text-[10px] opacity-75">{item.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-6 space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              분석할 카테고리 또는 관심 분야
            </label>
            <div className="relative">
              <input
                type="text"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="예: 2026 연말정산, 신용카드 혜택, 로봇청소기"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm"
              />
            </div>
          </div>

          <div className="md:col-span-3 space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              타겟 블로그 플랫폼
            </label>
            <select
              value={targetPlatform}
              onChange={(e) => setTargetPlatform(e.target.value)}
              className="w-full px-3 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
            >
              <option value="tistory">티스토리 (애드센스)</option>
              <option value="naver">네이버 (애드포스트/제휴)</option>
              <option value="wordpress">워드프레스 (글로벌 SEO)</option>
            </select>
          </div>

          <div className="md:col-span-3 flex items-end">
            <button
              onClick={() => handleSearch()}
              disabled={loading}
              className={`w-full py-3 px-4 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 shadow-lg transition-all ${
                loading
                  ? "bg-slate-700 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30"
              }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>황금 키워드 분석 중...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>황금 키워드 탐색</span>
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

      {/* Keywords List Results */}
      {keywords.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>분석 완료: 즉시 돈이 되는 추천 키워드 6선</span>
            </h3>
            <span className="text-xs text-slate-400">
              클릭 시 즉시 블로그 글 작성기로 이동합니다
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {keywords.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-5 shadow-lg transition-all hover:shadow-indigo-500/10 flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  {/* Top Bar: Keyword + Score Badge */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-xs font-semibold text-indigo-400 mb-0.5 block">
                        추천 #{idx + 1}
                      </span>
                      <h4 className="text-lg font-black text-white group-hover:text-indigo-200 transition-colors">
                        {item.keyword}
                      </h4>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                        <Zap className="w-3 h-3 text-emerald-400" />
                        수익 점수 {item.profitabilityScore}점
                      </span>
                    </div>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">월 검색량</span>
                      <span className="font-bold text-slate-200">{item.searchVolume}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">경쟁도</span>
                      <span className="font-bold text-indigo-300">{item.competition}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">예상 CPC</span>
                      <span className="font-bold text-amber-300">{item.expectedCpc}</span>
                    </div>
                  </div>

                  {/* Strategy Tips */}
                  <div className="space-y-1.5 text-xs">
                    <div className="text-slate-300 leading-relaxed">
                      <span className="font-semibold text-slate-400">💡 수익 전략: </span>
                      {item.monetizationStrategy}
                    </div>
                    <div className="text-slate-400 text-[11px]">
                      <span className="font-semibold text-slate-500">🎯 타겟 심리: </span>
                      {item.targetAudience}
                    </div>
                  </div>

                  {/* Recommended Titles */}
                  {item.recommendedTitles && item.recommendedTitles.length > 0 && (
                    <div className="space-y-1 pt-1 border-t border-slate-800/60">
                      <span className="text-[11px] font-semibold text-slate-400">
                        🔥 추천 고클릭 제목:
                      </span>
                      <div className="space-y-1">
                        {item.recommendedTitles.map((title, tIdx) => (
                          <div
                            key={tIdx}
                            className="text-xs text-slate-300 bg-slate-950/40 px-2.5 py-1.5 rounded-lg border border-slate-800/60 flex items-center justify-between"
                          >
                            <span className="truncate">{title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Bottom Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => onSelectKeyword(item.keyword)}
                    className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20 transition-colors"
                  >
                    <span>이 키워드로 글 쓰기</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleAddQueue(item.keyword)}
                    disabled={addedQueueList.includes(item.keyword)}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-colors ${
                      addedQueueList.includes(item.keyword)
                        ? "bg-slate-800 border-slate-700 text-emerald-400"
                        : "bg-slate-950 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800"
                    }`}
                    title="윈도우 무인 자동화 봇 대기열에 추가"
                  >
                    {addedQueueList.includes(item.keyword) ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>대기열 추가됨</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>봇 대기열</span>
                      </>
                    )}
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

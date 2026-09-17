import React, { useState } from "react";
import { 
  Sparkles, 
  Copy, 
  Check, 
  Download, 
  FileText, 
  Code, 
  Eye, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  Tag, 
  Share2,
  Sliders,
  Flame,
  ArrowRight,
  AlertCircle
} from "lucide-react";
import { BlogPlatform, MonetizationType, WritingTone, PostLength, GeneratedPost, SavedPost } from "../types";

interface PostGeneratorProps {
  initialKeyword?: string;
  onSavePost: (post: SavedPost) => void;
  onSendToWindowsQueue: (keyword: string) => void;
}

export const PostGenerator: React.FC<PostGeneratorProps> = ({
  initialKeyword = "",
  onSavePost,
  onSendToWindowsQueue,
}) => {
  const [topic, setTopic] = useState(initialKeyword);
  const [platform, setPlatform] = useState<BlogPlatform>("tistory");
  const [monetizationType, setMonetizationType] = useState<MonetizationType>("adsense");
  const [tone, setTone] = useState<WritingTone>("expert");
  const [targetLength, setTargetLength] = useState<PostLength>("medium");
  const [includeAdSlots, setIncludeAdSlots] = useState(true);
  const [includeCta, setIncludeCta] = useState(true);
  const [includeFaq, setIncludeFaq] = useState(true);
  const [customKeywords, setCustomKeywords] = useState("");

  const [loading, setLoading] = useState(false);
  const [generatedPost, setGeneratedPost] = useState<GeneratedPost | null>(null);
  const [activeView, setActiveView] = useState<"preview" | "html" | "markdown">("preview");
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [selectedTitleIndex, setSelectedTitleIndex] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Quick suggestion topics
  const quickPicks = [
    { label: "청년도약계좌 혜택 및 신청 조건", category: "애드센스 고CPC" },
    { label: "가성비 로봇청소기 추천 TOP 5", category: "쿠팡 파트너스" },
    { label: "2026 연말정산 환급금 조회 방법", category: "정부지원 트래픽" },
    { label: "미국 배당주 ETF 세금 아끼는 법", category: "금융 재테크" },
    { label: "티스토리 구글 애드센스 고단가 세팅법", category: "블로그 운영" },
  ];

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setErrorMsg("포스팅 주제 또는 핵심 키워드를 입력해주세요.");
      return;
    }

    setErrorMsg(null);
    setLoading(true);

    try {
      const response = await fetch("/api/generate-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          platform,
          monetizationType,
          tone,
          targetLength,
          includeAdSlots,
          includeCta,
          includeFaq,
          customKeywords,
        }),
      });

      if (!response.ok) {
        throw new Error("서버에서 글을 생성하는 중 오류가 발생했습니다.");
      }

      const data = await response.json();
      setGeneratedPost(data);
      setSelectedTitleIndex(0);

      // Auto save to local storage
      const saved: SavedPost = {
        id: "post_" + Date.now(),
        title: data.selectedTitle || data.titles?.[0] || topic,
        platform,
        keyword: topic,
        createdAt: new Date().toLocaleDateString("ko-KR"),
        htmlContent: data.contentHtml,
        markdownContent: data.contentMarkdown,
        tags: data.tags || [],
      };
      onSavePost(saved);
    } catch (err: any) {
      setErrorMsg(err.message || "글 생성 실패");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleDownloadHtml = () => {
    if (!generatedPost) return;
    const title = generatedPost.titles[selectedTitleIndex] || "blog_post";
    const fullHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <meta name="description" content="${generatedPost.metaDescription}">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Pretendard", Roboto, sans-serif; line-height: 1.8; color: #333; max-width: 820px; margin: 40px auto; padding: 0 20px; }
    h2 { font-size: 1.7rem; border-left: 5px solid #4f46e5; padding-left: 12px; margin-top: 40px; }
    h3 { font-size: 1.3rem; margin-top: 25px; color: #1e1b4b; }
    .ad-slot { background: #f8fafc; border: 2px dashed #cbd5e1; padding: 25px; text-align: center; margin: 30px 0; border-radius: 8px; color: #64748b; font-weight: 500; }
    .cta-btn { display: inline-block; background: #4f46e5; color: #ffffff !important; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
  </style>
</head>
<body>
  <h1>${title}</h1>
  ${generatedPost.contentHtml}
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.slice(0, 30)}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/20 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                구글 애드센스 & 제휴마케팅 수익 극대화 포스팅 스튜디오
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                체류시간(Dwell Time)을 늘리고 클릭률(CTR)을 높이는 고수익 서식과 광고 배치 구조로 자동 생성합니다.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">빠른 키워드 추천:</span>
            <div className="flex flex-wrap gap-1.5">
              {quickPicks.slice(0, 3).map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setTopic(item.label)}
                  className="text-xs px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                >
                  {item.label.slice(0, 10)}...
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Post Settings & Prompt */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-5 backdrop-blur-sm shadow-xl">
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-400" />
              1. 포스팅 조건 설정
            </h3>

            {/* Topic Input */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">
                포스팅 주제 또는 타겟 키워드 <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  id="input-post-topic"
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="예: 2026 청년도약계좌 이자율 및 비과세 혜택"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm"
                />
              </div>
            </div>

            {/* Target Platform Selection */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">
                발행 플랫폼 선택
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "tistory", name: "티스토리", desc: "애드센스 최적화", color: "from-orange-500/20 to-amber-500/20 border-orange-500/40" },
                  { id: "naver", name: "네이버", desc: "애드포스트/제휴", color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/40" },
                  { id: "wordpress", name: "워드프레스", desc: "글로벌 SEO/API", color: "from-blue-500/20 to-indigo-500/20 border-blue-500/40" },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPlatform(p.id as BlogPlatform)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      platform === p.id
                        ? `bg-gradient-to-br ${p.color} border-indigo-500 text-white shadow-md`
                        : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                    }`}
                  >
                    <div className="font-bold text-xs">{p.name}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{p.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Monetization Model */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">
                수익화 유형 (어떻게 돈을 벌 것인가?)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "adsense", name: "구글 애드센스", tip: "체류시간 & 고단가 광고 유도" },
                  { id: "coupang", name: "쿠팡/제휴마케팅", tip: "제품 비교 & 구매전환 버튼" },
                  { id: "info", name: "정부지원금/신청", tip: "공식 신청 링크 클릭 극대화" },
                  { id: "review", name: "실사용 리뷰/후기", tip: "신뢰도 기반 구매 유도" },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMonetizationType(m.id as MonetizationType)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      monetizationType === m.id
                        ? "bg-indigo-600/20 border-indigo-500 text-white"
                        : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <div className="font-semibold text-xs text-indigo-300">{m.name}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{m.tip}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Tone & Length */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">문체 (말투)</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value as WritingTone)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="expert">전문가 신뢰형 (~합니다)</option>
                  <option value="friendly">친근한 소통형 (~해요/다정)</option>
                  <option value="concise">핵심 요약 스피드형</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">포스팅 분량</label>
                <select
                  value={targetLength}
                  onChange={(e) => setTargetLength(e.target.value as PostLength)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="short">약 1,200자 (핵심 요약)</option>
                  <option value="medium">약 2,000자 (권장 체류시간)</option>
                  <option value="long">약 3,000자+ (전문가 가이드)</option>
                </select>
              </div>
            </div>

            {/* Monetization Enhancer Toggles */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="block text-xs font-semibold text-slate-300">
                수익 극대화 자동 서식 옵션
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeAdSlots}
                    onChange={(e) => setIncludeAdSlots(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 bg-slate-950 border-slate-700 focus:ring-indigo-500"
                  />
                  <span>애드센스 상·중·하단 최적 광고 슬롯(배너 박스) 삽입</span>
                </label>
                <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeCta}
                    onChange={(e) => setIncludeCta(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 bg-slate-950 border-slate-700 focus:ring-indigo-500"
                  />
                  <span>클릭률 높은 행동유도(CTA) 버튼 서식 자동 포함</span>
                </label>
                <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeFaq}
                    onChange={(e) => setIncludeFaq(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 bg-slate-950 border-slate-700 focus:ring-indigo-500"
                  />
                  <span>검색 노출을 잡는 자주 묻는 질문(FAQ) Q&A 섹션 추가</span>
                </label>
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              id="btn-generate-post"
              type="button"
              onClick={handleGenerate}
              disabled={loading}
              className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 shadow-lg transition-all ${
                loading
                  ? "bg-slate-700 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 hover:from-indigo-500 hover:to-blue-500 shadow-indigo-600/30 active:scale-[0.99]"
              }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>AI 수익화 블로그 글 작성 중 (약 3~5초)...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>원클릭 AI 수익화 블로그 글 생성하기</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Generated Post Results & Copy/Export */}
        <div className="lg:col-span-7 space-y-6">
          {!generatedPost && !loading && (
            <div className="h-full min-h-[460px] bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center p-8 text-center text-slate-400 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-indigo-400">
                <FileText className="w-8 h-8" />
              </div>
              <div className="max-w-md">
                <h3 className="font-bold text-base text-slate-200">
                  작성할 주제를 입력하고 생성 버튼을 눌러보세요
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  티스토리, 네이버, 워드프레스 맞춤형 서식과 함께 고수익 애드센스 광고 슬롯, 
                  클릭률 30%를 부르는 5가지 제목 후보, SEO 메타태그가 즉시 완성됩니다.
                </p>
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setTopic("2026 청년도약계좌 혜택 및 신청 조건 총정리");
                  }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600/30"
                >
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>추천 고수익 주제 바로 불러오기</span>
                </button>
              </div>
            </div>
          )}

          {loading && (
            <div className="min-h-[460px] bg-slate-900/80 border border-slate-800 rounded-2xl flex flex-col items-center justify-center p-8 text-center text-slate-300 space-y-5">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
                <Sparkles className="w-6 h-6 text-indigo-400 absolute inset-0 m-auto" />
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-lg text-white">
                  SEO 검색 1위 & 고수익 블로그 글 작성 중...
                </h4>
                <div className="space-y-1 text-xs text-slate-400">
                  <p>✓ 구글/네이버 검색 알고리즘 H2, H3 소제목 태그 구조화</p>
                  <p>✓ 클릭률(CTR) 30% 보장 매력적인 헤드라인 5종 조합</p>
                  <p>✓ 애드센스 광고 효율을 극대화하는 서식 및 배치 적용</p>
                </div>
              </div>
            </div>
          )}

          {generatedPost && !loading && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl space-y-0">
              {/* Header Bar */}
              <div className="p-5 border-b border-slate-800 bg-slate-950/60 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {platform === "tistory" ? "티스토리 서식" : platform === "naver" ? "네이버 서식" : "워드프레스 HTML"}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    읽는 시간: {generatedPost.estimatedReadingTime || "약 3분"}
                  </span>
                </div>

                {/* View Toggles & Actions */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-slate-900 rounded-lg p-1 border border-slate-800 text-xs">
                    <button
                      onClick={() => setActiveView("preview")}
                      className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 font-medium transition-colors ${
                        activeView === "preview"
                          ? "bg-indigo-600 text-white"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>서식 미리보기</span>
                    </button>
                    <button
                      onClick={() => setActiveView("html")}
                      className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 font-medium transition-colors ${
                        activeView === "html"
                          ? "bg-indigo-600 text-white"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <Code className="w-3.5 h-3.5" />
                      <span>HTML 코드</span>
                    </button>
                    <button
                      onClick={() => setActiveView("markdown")}
                      className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 font-medium transition-colors ${
                        activeView === "markdown"
                          ? "bg-indigo-600 text-white"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>마크다운</span>
                    </button>
                  </div>

                  <button
                    onClick={() => handleCopy(generatedPost.contentHtml, "all_html")}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
                  >
                    {copiedType === "all_html" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedType === "all_html" ? "복사완료!" : "HTML 복사"}</span>
                  </button>

                  <button
                    onClick={handleDownloadHtml}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700"
                    title="HTML 파일로 다운로드"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Title Selection Bar */}
              <div className="p-5 border-b border-slate-800 bg-slate-900/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    클릭을 부르는 제목 선택 (클릭 시 선택 변경)
                  </span>
                  <button
                    onClick={() => handleCopy(generatedPost.titles[selectedTitleIndex], "title")}
                    className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                  >
                    {copiedType === "title" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    제목만 복사
                  </button>
                </div>
                <div className="space-y-1.5">
                  {generatedPost.titles?.map((t, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedTitleIndex(idx)}
                      className={`w-full text-left px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center justify-between gap-3 ${
                        selectedTitleIndex === idx
                          ? "bg-indigo-600/20 border border-indigo-500 text-indigo-200 font-semibold"
                          : "bg-slate-950/40 border border-slate-800/80 text-slate-300 hover:bg-slate-800"
                      }`}
                    >
                      <span className="truncate">
                        <span className="text-indigo-400 mr-2 font-bold">#{idx + 1}</span>
                        {t}
                      </span>
                      {selectedTitleIndex === idx && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/30 text-indigo-300 shrink-0">
                          선택됨
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Meta Description & 3-Line Summary */}
              <div className="p-4 bg-slate-950/40 border-b border-slate-800 text-xs space-y-2">
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-slate-400 shrink-0">SEO 설명문:</span>
                  <span className="text-slate-300">{generatedPost.metaDescription}</span>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  <span className="font-semibold text-slate-400 shrink-0 flex items-center gap-1 mr-1">
                    <Tag className="w-3 h-3" /> 태그:
                  </span>
                  {generatedPost.tags?.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] border border-slate-700"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Main Content Area */}
              <div className="p-6 max-h-[600px] overflow-y-auto">
                {activeView === "preview" && (
                  <div className="bg-slate-950 rounded-xl p-6 border border-slate-800/80 text-slate-200 shadow-inner">
                    <h1 className="text-xl sm:text-2xl font-extrabold text-white mb-6 pb-4 border-b border-slate-800">
                      {generatedPost.titles[selectedTitleIndex]}
                    </h1>
                    {/* Rendered HTML */}
                    <div
                      className="prose prose-invert prose-indigo max-w-none text-sm leading-relaxed space-y-4"
                      dangerouslySetInnerHTML={{ __html: generatedPost.contentHtml }}
                    />
                  </div>
                )}

                {activeView === "html" && (
                  <div className="relative">
                    <pre className="bg-slate-950 rounded-xl p-4 text-xs font-mono text-emerald-400 overflow-x-auto border border-slate-800 max-h-[500px]">
                      {generatedPost.contentHtml}
                    </pre>
                  </div>
                )}

                {activeView === "markdown" && (
                  <div className="relative">
                    <pre className="bg-slate-950 rounded-xl p-4 text-xs font-mono text-cyan-300 overflow-x-auto border border-slate-800 max-h-[500px]">
                      {generatedPost.contentMarkdown}
                    </pre>
                  </div>
                )}
              </div>

              {/* Monetization Strategy Footer */}
              {generatedPost.monetizationGuide && (
                <div className="p-5 bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-950 border-t border-slate-800 text-xs space-y-2">
                  <div className="font-bold text-indigo-300 flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    <span>이 글의 수익 극대화 핵심 팁</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-slate-300 pt-1">
                    <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                      <span className="font-semibold text-slate-200 block mb-1">🎯 광고 최적 위치</span>
                      <p className="text-[11px] text-slate-400">{generatedPost.monetizationGuide.recommendedAdPlacement}</p>
                    </div>
                    <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                      <span className="font-semibold text-slate-200 block mb-1">🔗 제휴 링크/CTA 팁</span>
                      <p className="text-[11px] text-slate-400">{generatedPost.monetizationGuide.affiliateTips}</p>
                    </div>
                    <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                      <span className="font-semibold text-slate-200 block mb-1">⏱️ 체류시간 2배 늘리기</span>
                      <p className="text-[11px] text-slate-400">{generatedPost.monetizationGuide.retentionHacks}</p>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => onSendToWindowsQueue(topic)}
                      className="text-xs text-cyan-300 hover:text-cyan-200 flex items-center gap-1 font-semibold"
                    >
                      <span>이 키워드를 윈도우 무인 자동화 봇 대기열로 보내기</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

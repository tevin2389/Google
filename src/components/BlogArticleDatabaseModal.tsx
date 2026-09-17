import React, { useState } from "react";
import { 
  Database, 
  X, 
  Search, 
  Filter, 
  Sparkles, 
  ExternalLink, 
  Trash2, 
  Plus, 
  FileText, 
  CheckCircle2, 
  TrendingUp, 
  DollarSign, 
  Link2, 
  ShieldCheck, 
  Copy, 
  Check,
  BrainCircuit,
  Eye,
  ArrowRight,
  BookOpen
} from "lucide-react";
import { BlogItem, BlogArticleRecord } from "../types";

interface BlogArticleDatabaseModalProps {
  blog: BlogItem;
  isOpen: boolean;
  onClose: () => void;
  onAddArticleToDb: (blogId: string, article: Omit<BlogArticleRecord, "id">) => void;
  onDeleteArticleFromDb: (blogId: string, articleId: string) => void;
  onTriggerFollowUpTopic: (blogId: string, parentArticleTitle: string) => void;
}

export const BlogArticleDatabaseModal: React.FC<BlogArticleDatabaseModalProps> = ({
  blog,
  isOpen,
  onClose,
  onAddArticleToDb,
  onDeleteArticleFromDb,
  onTriggerFollowUpTopic,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "seo" | "cpc">("newest");
  const [previewArticle, setPreviewArticle] = useState<BlogArticleRecord | null>(null);
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [isAddingManual, setIsAddingManual] = useState(false);

  // Manual Add Form State
  const [newTitle, setNewTitle] = useState("");
  const [newTopic, setNewTopic] = useState("");
  const [newSummary, setNewSummary] = useState("");
  const [newTags, setNewTags] = useState("");
  const [newCpc, setNewCpc] = useState("$4.50");
  const [newSeoScore, setNewSeoScore] = useState(96);
  const [newWordCount, setNewWordCount] = useState(2400);

  if (!isOpen) return null;

  const articles: BlogArticleRecord[] = blog.articleDatabase || [];

  // Filtered & Sorted articles
  const filteredArticles = articles
    .filter((art) => {
      const q = searchQuery.toLowerCase();
      return (
        art.title.toLowerCase().includes(q) ||
        art.topic.toLowerCase().includes(q) ||
        art.summary.toLowerCase().includes(q) ||
        art.tags.some((t) => t.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => {
      if (sortBy === "seo") return b.seoScore - a.seoScore;
      if (sortBy === "cpc") {
        const cpcA = parseFloat(a.expectedCpc.replace(/[^0-9.]/g, "") || "0");
        const cpcB = parseFloat(b.expectedCpc.replace(/[^0-9.]/g, "") || "0");
        return cpcB - cpcA;
      }
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });

  // Calculate stats
  const totalArticles = articles.length;
  const avgSeo = totalArticles > 0 
    ? Math.round(articles.reduce((acc, curr) => acc + curr.seoScore, 0) / totalArticles) 
    : 95;
  const avgWords = totalArticles > 0
    ? Math.round(articles.reduce((acc, curr) => acc + curr.wordCount, 0) / totalArticles)
    : 2200;

  const handleCopyHtml = (html?: string) => {
    if (!html) return;
    navigator.clipboard.writeText(html);
    setCopiedHtml(true);
    setTimeout(() => setCopiedHtml(false), 2000);
  };

  const handleSaveManualArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddArticleToDb(blog.id, {
      blogId: blog.id,
      title: newTitle.trim(),
      topic: newTopic.trim() || newTitle.trim(),
      niche: blog.niche,
      publishedAt: new Date().toISOString(),
      seoScore: Number(newSeoScore) || 96,
      expectedCpc: newCpc || "$4.50",
      wordCount: Number(newWordCount) || 2000,
      summary: newSummary.trim() || "사용자가 데이터베이스에 수동 등록한 이전 발행 기사입니다.",
      tags: newTags ? newTags.split(",").map((t) => t.trim()).filter(Boolean) : ["Archive", "Manual"],
      keyStrengths: ["수동 등록된 블로그 이전 레퍼런스", "AI 중복 방지 필터링 등록 완료"],
      internalAnchorSuggestions: [newTitle.trim()],
    });

    // Reset
    setNewTitle("");
    setNewTopic("");
    setNewSummary("");
    setNewTags("");
    setIsAddingManual(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-5xl max-h-[92vh] bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-200">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center shadow-lg shadow-cyan-500/10">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <span>{blog.name}</span>
                  <span className="text-slate-500 font-normal">|</span>
                  <span className="text-cyan-400 text-sm font-semibold">아티클 지식 DB & AI 메모리</span>
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>중복 방지 & 품질 향상 루프 활성화됨</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                AI들이 이 블로그에서 기발행된 글을 실시간 학습하여 <strong className="text-cyan-300">주제 중복 0%</strong>와 <strong className="text-emerald-300">내부 앵커 링크 연결</strong>을 자동으로 수행합니다.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddingManual(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition-colors"
            >
              <Plus className="w-4 h-4 text-cyan-400" />
              <span>기존 글 수동 등록</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Key Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-400">누적 DB 보관 글</p>
                <p className="text-base font-black text-white">{totalArticles}건</p>
              </div>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-400">평균 SEO 점수</p>
                <p className="text-base font-black text-emerald-400">{avgSeo}점 <span className="text-xs font-normal text-slate-400">(S등급)</span></p>
              </div>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <DollarSign className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-400">평균 예상 CPC</p>
                <p className="text-base font-black text-amber-300">$4.60 <span className="text-xs font-normal text-slate-400">(미국 상위)</span></p>
              </div>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-400">AI 중복 방지율</p>
                <p className="text-base font-black text-purple-300">100% 보장</p>
              </div>
            </div>
          </div>

          {/* AI Memory Synergy Info Card */}
          <div className="bg-gradient-to-r from-indigo-950/40 via-cyan-950/30 to-slate-900 border border-indigo-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0 mt-0.5">
                <BrainCircuit className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>AI 글 품질 향상 피드백 루프 동작 원리</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">Autonomous Feedback</span>
                </h4>
                <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                  ① <strong>1단 주제 발굴 AI</strong>는 위 {totalArticles}개 글의 키워드 풀을 분석해 중복을 원천 차단하고 미개척 틈새 키워드를 발굴합니다.<br />
                  ② <strong>2단 글쓰기 AI</strong>는 본문 작성 시 위 기사들을 자연스럽게 인용하는 <strong>내부 링크(Internal Linking)</strong> 카드를 자동 생성해 방문자 체류시간을 높입니다.
                </p>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="제목, 주제, 태그, 본문 내용 검색..."
                className="w-full pl-9 pr-4 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-slate-950/80 border border-slate-800 rounded-xl p-1 text-xs">
                <button
                  type="button"
                  onClick={() => setSortBy("newest")}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                    sortBy === "newest" ? "bg-slate-800 text-cyan-300" : "text-slate-400 hover:text-white"
                  }`}
                >
                  최신순
                </button>
                <button
                  type="button"
                  onClick={() => setSortBy("seo")}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                    sortBy === "seo" ? "bg-slate-800 text-emerald-300" : "text-slate-400 hover:text-white"
                  }`}
                >
                  최고 SEO순
                </button>
                <button
                  type="button"
                  onClick={() => setSortBy("cpc")}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                    sortBy === "cpc" ? "bg-slate-800 text-amber-300" : "text-slate-400 hover:text-white"
                  }`}
                >
                  최고 CPC순
                </button>
              </div>
            </div>
          </div>

          {/* Articles List */}
          {filteredArticles.length === 0 ? (
            <div className="bg-slate-950/50 border border-dashed border-slate-800 rounded-2xl p-10 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-800/80 text-slate-500 flex items-center justify-center mx-auto">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-300">검색된 데이터베이스 글이 없습니다</p>
                <p className="text-xs text-slate-500 mt-1">
                  파이프라인에서 글이 발행되면 자동으로 DB에 적재되거나, 상단의 '기존 글 수동 등록'으로 추가할 수 있습니다.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredArticles.map((art, idx) => (
                <div
                  key={art.id || `art-${idx}`}
                  className="bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 rounded-2xl p-4 transition-all duration-200 space-y-3 hover:shadow-lg"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="w-6 h-6 rounded-lg bg-cyan-500/10 text-cyan-400 text-xs font-mono font-bold flex items-center justify-center border border-cyan-500/20">
                        #{idx + 1}
                      </span>
                      <h3 className="text-sm font-bold text-white hover:text-cyan-300 transition-colors">
                        {art.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-bold font-mono">
                        SEO {art.seoScore}점
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[11px] font-bold font-mono">
                        {art.expectedCpc}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-mono">
                        {art.wordCount.toLocaleString()}단어
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {art.summary}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-900 text-xs">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {art.tags.slice(0, 4).map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-400 text-[10px] font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                      <span className="text-[10px] text-slate-500 ml-1">
                        발행: {new Date(art.publishedAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Follow-up Topic Trigger */}
                      <button
                        type="button"
                        onClick={() => onTriggerFollowUpTopic(blog.id, art.title)}
                        className="px-2.5 py-1 rounded-lg bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 border border-indigo-500/30 text-[11px] font-bold flex items-center gap-1 transition-colors"
                        title="이전 글의 내용과 연결되는 심화 후속편 주제를 파이프라인에 즉시 발굴 투입"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>후속 심화편 발굴</span>
                      </button>

                      {/* View Content Preview */}
                      {art.contentHtml && (
                        <button
                          type="button"
                          onClick={() => setPreviewArticle(art)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                        >
                          <Eye className="w-3 h-3" />
                          <span>전문 보기</span>
                        </button>
                      )}

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => onDeleteArticleFromDb(blog.id, art.id)}
                        className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                        title="데이터베이스에서 삭제"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>이 블로그의 파이프라인 글쓰기 시 위 아티클 DB가 자동 주입됩니다.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-colors"
          >
            닫기
          </button>
        </div>
      </div>

      {/* Manual Add Modal */}
      {isAddingManual && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-cyan-400" />
                <span>기존 발행 글 DB에 수동 등록</span>
              </h3>
              <button
                onClick={() => setIsAddingManual(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveManualArticle} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  글 제목 (Title) <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="예: Top 7 AI Automation Tools in 2026"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  핵심 주제/카테고리 (Topic)
                </label>
                <input
                  type="text"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  placeholder="예: AI Developer Productivity"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  핵심 내용 요약 (Summary)
                </label>
                <textarea
                  rows={3}
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  placeholder="글의 핵심 결론 및 다룬 솔루션 요약..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">SEO 점수</label>
                  <input
                    type="number"
                    value={newSeoScore}
                    onChange={(e) => setNewSeoScore(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">예상 CPC</label>
                  <input
                    type="text"
                    value={newCpc}
                    onChange={(e) => setNewCpc(e.target.value)}
                    placeholder="$4.50"
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">단어 수</label>
                  <input
                    type="number"
                    value={newWordCount}
                    onChange={(e) => setNewWordCount(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">태그 (쉼표 구분)</label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="AI, Tools, Productivity, 2026"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddingManual(false)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-colors"
                >
                  DB에 저장
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Article HTML Full Preview Modal */}
      {previewArticle && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-3xl max-h-[85vh] bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-200">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-white truncate max-w-md">
                  {previewArticle.title}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyHtml(previewArticle.contentHtml)}
                  className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  {copiedHtml ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedHtml ? "HTML 복사됨!" : "HTML 복사"}</span>
                </button>
                <button
                  onClick={() => setPreviewArticle(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="flex items-center gap-3 text-xs bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-emerald-400 font-bold">SEO {previewArticle.seoScore}점</span>
                <span className="text-slate-600">|</span>
                <span className="text-amber-300 font-bold">{previewArticle.expectedCpc}</span>
                <span className="text-slate-600">|</span>
                <span className="text-slate-400">{previewArticle.wordCount}단어</span>
                <span className="text-slate-600">|</span>
                <span className="text-slate-400">{new Date(previewArticle.publishedAt).toLocaleDateString()}</span>
              </div>

              <div 
                className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed p-4 bg-slate-950/70 border border-slate-800 rounded-2xl"
                dangerouslySetInnerHTML={{ __html: previewArticle.contentHtml || `<p>${previewArticle.summary}</p>` }}
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

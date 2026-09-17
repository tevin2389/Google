import React, { useState } from "react";
import { 
  ArrowLeft, 
  Globe, 
  Sparkles, 
  Flame, 
  Clock, 
  CheckCircle2, 
  Play, 
  Pause, 
  AlertTriangle, 
  Trash2, 
  Copy, 
  Check, 
  FileText, 
  ExternalLink,
  Laptop,
  Cpu,
  BarChart2,
  Layers,
  ChevronRight,
  Code,
  Settings,
  Sliders,
  Plus,
  Minus,
  Database,
  ShieldCheck,
  Link2,
  BookOpen
} from "lucide-react";
import { BlogItem, PipelineItem, PipelineLog, OllamaSettings, StageAiConfig, DirectorAdvice, BlogArticleRecord } from "../types";
import { BlogDirectorAdvisor } from "./BlogDirectorAdvisor";
import { AiStageSettingsModal } from "./AiStageSettingsModal";
import { BlogArticleDatabaseModal } from "./BlogArticleDatabaseModal";

interface DedicatedBlogPipelineProps {
  blog: BlogItem;
  onBackToBlogs: () => void;
  pipelineItems: PipelineItem[];
  logs: PipelineLog[];
  isAutopilotRunning: boolean;
  onToggleAutopilot: () => void;
  onTriggerTopicAi: (blogId: string, isUrgent: boolean, customTopic?: string) => Promise<void>;
  onTriggerWriteNow: (itemId: string) => Promise<void>;
  onTriggerPublishNow: (itemId: string) => Promise<void>;
  onDeleteItem: (itemId: string) => void;
  onAdjustItemDelay: (itemId: string, deltaSec: number) => void;
  onUpdateBlogConfig: (updatedBlog: BlogItem) => void;
  ollamaSettings: OllamaSettings;
  onOpenOllamaModal: () => void;
  onOpenWindowsBot: () => void;
  onAddArticleToDb?: (blogId: string, article: Omit<BlogArticleRecord, "id">) => void;
  onDeleteArticleFromDb?: (blogId: string, articleId: string) => void;
}

export const DedicatedBlogPipeline: React.FC<DedicatedBlogPipelineProps> = ({
  blog,
  onBackToBlogs,
  pipelineItems,
  logs,
  isAutopilotRunning,
  onToggleAutopilot,
  onTriggerTopicAi,
  onTriggerWriteNow,
  onTriggerPublishNow,
  onDeleteItem,
  onAdjustItemDelay,
  onUpdateBlogConfig,
  ollamaSettings,
  onOpenOllamaModal,
  onOpenWindowsBot,
  onAddArticleToDb,
  onDeleteArticleFromDb,
}) => {
  const [selectedArticleItem, setSelectedArticleItem] = useState<PipelineItem | null>(null);
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [configModalStage, setConfigModalStage] = useState<"topic" | "writer" | "publisher" | null>(null);
  const [isDatabaseOpen, setIsDatabaseOpen] = useState(false);

  // Filter items specifically for this blog
  const blogItems = pipelineItems.filter((item) => item.blogId === blog.id);
  const waitingWriteItems = blogItems.filter(
    (item) => item.stage === "waiting_write" || item.stage === "writing"
  );
  const waitingPublishItems = blogItems.filter(
    (item) => item.stage === "waiting_publish" || item.stage === "publishing"
  );
  const publishedItems = blogItems.filter((item) => item.stage === "published");

  const blogLogs = logs.filter(
    (log) => log.blogName === blog.name || log.blogName === "시스템"
  );

  const handleCopyHtml = (html: string) => {
    navigator.clipboard.writeText(html);
    setCopiedHtml(true);
    setTimeout(() => setCopiedHtml(false), 2500);
  };

  const handleSaveStageConfig = (stage: "topic" | "writer" | "publisher", config: StageAiConfig) => {
    const updated: BlogItem = {
      ...blog,
      topicAiConfig: stage === "topic" ? config : blog.topicAiConfig,
      writerAiConfig: stage === "writer" ? config : blog.writerAiConfig,
      analyticsAiConfig: stage === "publisher" ? config : blog.analyticsAiConfig,
      defaultWriteDelaySec: stage === "topic" && config.delaySec ? config.delaySec : blog.defaultWriteDelaySec,
      defaultPublishDelaySec: stage === "publisher" && config.delaySec ? config.delaySec : blog.defaultPublishDelaySec,
    };
    onUpdateBlogConfig(updated);
  };

  const handleUpdateDirectorAdvice = (advice: DirectorAdvice) => {
    const updated: BlogItem = {
      ...blog,
      directorAdvice: advice,
    };
    onUpdateBlogConfig(updated);
  };

  // Helper to display human-readable countdown
  const formatRemainingTime = (sec: number) => {
    if (sec <= 0) return "0초 (즉시 진행)";
    const hours = Math.floor(sec / 3600);
    const minutes = Math.floor((sec % 3600) / 60);
    const seconds = sec % 60;

    if (hours > 0) {
      return `${hours}시간 ${minutes > 0 ? `${minutes}분 ` : ""}${seconds > 0 ? `${seconds}초` : ""}`;
    }
    if (minutes > 0) {
      return `${minutes}분 ${seconds > 0 ? `${seconds}초` : ""}`;
    }
    return `${seconds}초`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Navigation & Header */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              id="btn-back-to-blogs"
              onClick={onBackToBlogs}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center gap-1.5 text-xs font-semibold border border-slate-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>← 블로그 목록</span>
            </button>

            <div className="h-6 w-px bg-slate-800 hidden sm:block" />

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="w-7 h-7 rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center">
                  <Globe className="w-4 h-4" />
                </span>
                <h1 className="text-lg sm:text-xl font-black text-white">
                  {blog.name}
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-300 border border-orange-500/20 text-[11px] font-bold">
                  Google Blogger
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-bold font-mono">
                  오늘 발행: {blog.todayPostCount || publishedItems.length}개
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                <strong className="text-slate-300">주제:</strong> {blog.niche}
                {blog.blogUrl && (
                  <span className="ml-2 text-slate-500 font-mono">({blog.blogUrl})</span>
                )}
              </p>
            </div>
          </div>

          {/* Quick Actions for this Blog */}
          <div className="flex items-center gap-2 flex-wrap w-full md:w-auto justify-end">
            {/* Urgent Topic AI (10s) */}
            <button
              id="btn-urgent-topic-ai"
              onClick={() => onTriggerTopicAi(blog.id, true)}
              className="px-3 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-red-600/30 transition-all"
              title="실시간 해외 급상승 키워드를 발굴하여 10초 카운트다운 후 자동 집필"
            >
              <Flame className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
              <span>🚨 긴급 이슈 발굴 (10초)</span>
            </button>

            {/* Normal Topic AI */}
            <button
              id="btn-normal-topic-ai"
              onClick={() => onTriggerTopicAi(blog.id, false)}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>💡 고수익 주제 발굴</span>
            </button>

            {/* Autopilot Toggle */}
            <button
              id="btn-toggle-autopilot"
              onClick={onToggleAutopilot}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                isAutopilotRunning
                  ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/25"
                  : "bg-slate-800 text-slate-400 border-slate-700 hover:text-white"
              }`}
            >
              {isAutopilotRunning ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5" />}
              <span>{isAutopilotRunning ? "오토파일럿 ON" : "일시정지"}</span>
            </button>

            {/* 📚 블로그 글 DB & AI 지식 베이스 버튼 */}
            <button
              id="btn-open-article-database"
              onClick={() => setIsDatabaseOpen(true)}
              className="px-3 py-2 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-500/40 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
              title="이 블로그의 과거 기발행 글 DB 확인 및 AI 중복 방지/품질 피드백 관리"
            >
              <Database className="w-3.5 h-3.5 text-cyan-400" />
              <span>📚 글 DB & AI 메모리 ({blog.articleDatabase?.length || 0})</span>
            </button>

            {/* Windows Bot */}
            <button
              id="btn-dedicated-windows-bot"
              onClick={onOpenWindowsBot}
              className="px-3 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="윈도우에서 24시간 무인 가동할 수 있는 bot.py 및 run_bot.bat"
            >
              <Laptop className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">윈도우 봇</span>
            </button>
          </div>
        </div>

        {/* Database Intelligence Strip */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-800/80 text-xs flex-wrap bg-slate-950/40 -mx-6 -mb-6 px-6 py-3 rounded-b-3xl">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-slate-300 flex items-center gap-1.5 font-medium">
              <Database className="w-3.5 h-3.5 text-cyan-400" />
              <span>DB 연동 기사: <strong className="text-cyan-300">{blog.articleDatabase?.length || 0}건</strong></span>
            </span>
            <span className="text-slate-700 hidden sm:inline">•</span>
            <span className="text-emerald-400 flex items-center gap-1 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>주제 중복 방지 100% 가동 중</span>
            </span>
            <span className="text-slate-700 hidden sm:inline">•</span>
            <span className="text-indigo-300 flex items-center gap-1 font-medium">
              <Link2 className="w-3.5 h-3.5" />
              <span>본문 내 이전 글 앵커 링크 자동 연결</span>
            </span>
          </div>

          <button
            onClick={() => setIsDatabaseOpen(true)}
            className="text-cyan-400 hover:text-cyan-300 text-[11px] font-bold flex items-center gap-1 transition-colors hover:underline"
          >
            <span>블로그 아티클 DB 관리하기 →</span>
          </button>
        </div>
      </div>

      {/* 🌟 블로그 총괄 디렉터 AI (Chief Blog Executive Advisor) */}
      <BlogDirectorAdvisor
        blog={blog}
        waitingWriteCount={waitingWriteItems.length}
        waitingPublishCount={waitingPublishItems.length}
        recentTopics={blogItems.slice(0, 5).map((i) => i.topic)}
        ollamaSettings={ollamaSettings}
        onApplyRecommendedTopic={(topic, isUrgent) => {
          onTriggerTopicAi(blog.id, isUrgent, topic);
        }}
        onUpdateDirectorAdvice={handleUpdateDirectorAdvice}
      />

      {/* 3-Stage Pipeline Queues (각 AI 칸에 개별 설정 버튼 및 대기열 시간 조절기 탑재) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ========================================================================= */}
        {/* Stage 1: Topic AI & Writer Queue (1단: 글 주제 발굴 AI & 글쓰기 대기열) */}
        {/* ========================================================================= */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 flex flex-col justify-between shadow-xl space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-bold">
                  1
                </span>
                <span className="font-bold text-sm text-white">
                  글 주제 발굴 AI & 대기열
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Dedicated Settings Button for Topic AI */}
                <button
                  onClick={() => setConfigModalStage("topic")}
                  className="px-2.5 py-1 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/50 text-cyan-300 border border-cyan-800/40 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                  title="1단 주제 발굴 AI 프롬프트 및 모델 개별 설정"
                >
                  <Settings className="w-3 h-3" />
                  <span>AI 설정</span>
                </button>

                <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 font-mono text-xs font-bold">
                  {waitingWriteItems.length}건
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
              <span>주제 발굴 후 카운트다운 완료 시 글쓰기 AI로 전달</span>
              <span className="text-slate-500 font-mono text-[10px]">
                기본 {blog.defaultWriteDelaySec}초
              </span>
            </div>

            {/* List of items in Writer Queue */}
            <div className="space-y-3 mt-4 max-h-[520px] overflow-y-auto pr-1">
              {waitingWriteItems.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-slate-950/60 border border-dashed border-slate-800 text-slate-500 text-xs space-y-2">
                  <Clock className="w-6 h-6 mx-auto text-slate-600" />
                  <p>현재 대기 중인 글쓰기 항목이 없습니다.</p>
                  <button
                    onClick={() => onTriggerTopicAi(blog.id, true)}
                    className="text-cyan-400 hover:underline font-semibold text-xs"
                  >
                    + 긴급 이슈 주제 발굴하기 (10초)
                  </button>
                </div>
              ) : (
                waitingWriteItems.map((item) => {
                  const isWriting = item.stage === "writing";

                  return (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 shadow-sm hover:border-cyan-500/30 transition-colors"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span
                          className={`px-2 py-0.5 rounded-full font-bold flex items-center gap-1 ${
                            item.urgency === "urgent"
                              ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                              : "bg-slate-800 text-slate-300"
                          }`}
                        >
                          {item.urgency === "urgent" ? (
                            <Flame className="w-3 h-3 text-rose-400" />
                          ) : (
                            <Clock className="w-3 h-3 text-slate-400" />
                          )}
                          <span>{item.urgency === "urgent" ? "긴급 이슈 (10초)" : "정기 주제"}</span>
                        </span>

                        <span className="text-slate-500 font-mono text-[10px]">
                          {item.createdAt}
                        </span>
                      </div>

                      <h3 className="font-bold text-xs sm:text-sm text-slate-100 leading-snug">
                        {item.topic}
                      </h3>

                      {/* Remaining Timer Display */}
                      <div className="flex items-center justify-between pt-1 text-xs font-mono font-bold">
                        {isWriting ? (
                          <span className="text-amber-400 flex items-center gap-1.5 animate-pulse">
                            <Sparkles className="w-3.5 h-3.5" /> 글쓰기 AI 집필 진행 중...
                          </span>
                        ) : (
                          <span className="text-cyan-300 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-cyan-400" />
                            <span>⏳ {formatRemainingTime(item.remainingDelaySec)} 후 집필</span>
                          </span>
                        )}

                        {!isWriting && (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => onTriggerWriteNow(item.id)}
                              className="px-2.5 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-[11px] font-bold transition-colors"
                              title="타이머를 건너뛰고 지금 즉시 글쓰기 AI 가동"
                            >
                              즉시 작성
                            </button>
                            <button
                              onClick={() => onDeleteItem(item.id)}
                              className="p-1 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-red-400 transition-colors"
                              title="대기열에서 삭제"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* ⏱️ User-Requested Time Adjustment Bar (+ - 1분, 15분, 1시간 단위) */}
                      {!isWriting && (
                        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-1 flex-wrap text-[10px]">
                          <span className="text-slate-400 font-medium">시간 조절:</span>
                          <div className="flex items-center gap-1 flex-wrap">
                            {/* Decrement Buttons */}
                            <button
                              onClick={() => onAdjustItemDelay(item.id, -3600)}
                              title="1시간 단축"
                              className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-mono font-bold border border-slate-700 transition-colors"
                            >
                              -1h
                            </button>
                            <button
                              onClick={() => onAdjustItemDelay(item.id, -900)}
                              title="15분 단축"
                              className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-mono font-bold border border-slate-700 transition-colors"
                            >
                              -15m
                            </button>
                            <button
                              onClick={() => onAdjustItemDelay(item.id, -60)}
                              title="1분 단축"
                              className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-mono font-bold border border-slate-700 transition-colors"
                            >
                              -1m
                            </button>

                            <div className="w-px h-3 bg-slate-700 mx-0.5" />

                            {/* Increment Buttons */}
                            <button
                              onClick={() => onAdjustItemDelay(item.id, 60)}
                              title="1분 연장"
                              className="px-1.5 py-0.5 rounded bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 hover:text-cyan-200 font-mono font-bold border border-cyan-800/40 transition-colors"
                            >
                              +1m
                            </button>
                            <button
                              onClick={() => onAdjustItemDelay(item.id, 900)}
                              title="15분 연장"
                              className="px-1.5 py-0.5 rounded bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 hover:text-cyan-200 font-mono font-bold border border-cyan-800/40 transition-colors"
                            >
                              +15m
                            </button>
                            <button
                              onClick={() => onAdjustItemDelay(item.id, 3600)}
                              title="1시간 연장"
                              className="px-1.5 py-0.5 rounded bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 hover:text-cyan-200 font-mono font-bold border border-cyan-800/40 transition-colors"
                            >
                              +1h
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Stage 2: Writer AI & Publisher Queue (2단: 글쓰기 AI & 발행 대기열) */}
        {/* ========================================================================= */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 flex flex-col justify-between shadow-xl space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold">
                  2
                </span>
                <span className="font-bold text-sm text-white">
                  글쓰기 AI & 발행 대기열
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Dedicated Settings Button for Writer AI */}
                <button
                  onClick={() => setConfigModalStage("writer")}
                  className="px-2.5 py-1 rounded-lg bg-indigo-950/40 hover:bg-indigo-900/50 text-indigo-300 border border-indigo-800/40 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                  title="2단 글쓰기 AI 프롬프트, 분량, 톤앤매너 개별 설정"
                >
                  <Settings className="w-3 h-3" />
                  <span>AI 설정</span>
                </button>

                <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 font-mono text-xs font-bold">
                  {waitingPublishItems.length}건
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
              <span>집필 완료된 영문 SEO 글 카운트다운 만료 시 블로그로 발행</span>
              <span className="text-slate-500 font-mono text-[10px]">
                기본 {blog.defaultPublishDelaySec}초
              </span>
            </div>

            {/* List of items in Publisher Queue */}
            <div className="space-y-3 mt-4 max-h-[520px] overflow-y-auto pr-1">
              {waitingPublishItems.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-slate-950/60 border border-dashed border-slate-800 text-slate-500 text-xs space-y-2">
                  <CheckCircle2 className="w-6 h-6 mx-auto text-slate-600" />
                  <p>발행 대기 중인 글이 없습니다.</p>
                  <p className="text-[11px] text-slate-600">글쓰기 대기열의 타이머가 만료되면 여기에 자동 등록됩니다.</p>
                </div>
              ) : (
                waitingPublishItems.map((item) => {
                  const isPublishing = item.stage === "publishing";
                  const title = item.generatedArticle?.selectedTitle || item.topic;

                  return (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl bg-slate-950 border border-indigo-900/40 space-y-3 shadow-sm hover:border-indigo-500/40 transition-colors"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>영문 SEO 집필 완료</span>
                        </span>

                        {item.generatedArticle?.seoScore && (
                          <span className="text-amber-400 font-mono font-bold text-xs">
                            SEO: {item.generatedArticle.seoScore}점
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-xs sm:text-sm text-slate-100 leading-snug">
                        {title}
                      </h3>

                      {/* Remaining Timer Display */}
                      <div className="flex items-center justify-between pt-1 text-xs font-mono font-bold">
                        {isPublishing ? (
                          <span className="text-purple-400 flex items-center gap-1.5 animate-pulse">
                            <Sparkles className="w-3.5 h-3.5" /> 구글 블로그 발행 진행 중...
                          </span>
                        ) : (
                          <span className="text-indigo-300 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-indigo-400" />
                            <span>⏳ {formatRemainingTime(item.remainingDelaySec)} 후 발행</span>
                          </span>
                        )}

                        {!isPublishing && (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => setSelectedArticleItem(item)}
                              className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium"
                              title="작성된 영문 본문과 광고 슬롯 미리보기"
                            >
                              미리보기
                            </button>
                            <button
                              onClick={() => onTriggerPublishNow(item.id)}
                              className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold transition-colors"
                              title="카운트다운 즉시 만료 및 블로그 발행"
                            >
                              즉시 발행
                            </button>
                          </div>
                        )}
                      </div>

                      {/* ⏱️ User-Requested Time Adjustment Bar (+ - 1분, 15분, 1시간 단위) */}
                      {!isPublishing && (
                        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-1 flex-wrap text-[10px]">
                          <span className="text-slate-400 font-medium">시간 조절:</span>
                          <div className="flex items-center gap-1 flex-wrap">
                            {/* Decrement Buttons */}
                            <button
                              onClick={() => onAdjustItemDelay(item.id, -3600)}
                              title="1시간 단축"
                              className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-mono font-bold border border-slate-700 transition-colors"
                            >
                              -1h
                            </button>
                            <button
                              onClick={() => onAdjustItemDelay(item.id, -900)}
                              title="15분 단축"
                              className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-mono font-bold border border-slate-700 transition-colors"
                            >
                              -15m
                            </button>
                            <button
                              onClick={() => onAdjustItemDelay(item.id, -60)}
                              title="1분 단축"
                              className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-mono font-bold border border-slate-700 transition-colors"
                            >
                              -1m
                            </button>

                            <div className="w-px h-3 bg-slate-700 mx-0.5" />

                            {/* Increment Buttons */}
                            <button
                              onClick={() => onAdjustItemDelay(item.id, 60)}
                              title="1분 연장"
                              className="px-1.5 py-0.5 rounded bg-indigo-950/60 hover:bg-indigo-900/60 text-indigo-300 hover:text-indigo-200 font-mono font-bold border border-indigo-800/40 transition-colors"
                            >
                              +1m
                            </button>
                            <button
                              onClick={() => onAdjustItemDelay(item.id, 900)}
                              title="15분 연장"
                              className="px-1.5 py-0.5 rounded bg-indigo-950/60 hover:bg-indigo-900/60 text-indigo-300 hover:text-indigo-200 font-mono font-bold border border-indigo-800/40 transition-colors"
                            >
                              +15m
                            </button>
                            <button
                              onClick={() => onAdjustItemDelay(item.id, 3600)}
                              title="1시간 연장"
                              className="px-1.5 py-0.5 rounded bg-indigo-950/60 hover:bg-indigo-900/60 text-indigo-300 hover:text-indigo-200 font-mono font-bold border border-indigo-800/40 transition-colors"
                            >
                              +1h
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Stage 3: Publisher & Analytics AI (3단: 발행 및 분석 AI & 실적 목록) */}
        {/* ========================================================================= */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 flex flex-col justify-between shadow-xl space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold">
                  3
                </span>
                <span className="font-bold text-sm text-white">
                  발행 및 분석 AI ({publishedItems.length}개)
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Dedicated Settings Button for Analytics & Publishing AI */}
                <button
                  onClick={() => setConfigModalStage("publisher")}
                  className="px-2.5 py-1 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 border border-emerald-800/40 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                  title="3단 발행 및 분석 AI 프롬프트 및 기준 개별 설정"
                >
                  <Settings className="w-3 h-3" />
                  <span>AI 설정</span>
                </button>

                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 font-mono text-xs font-bold">
                  발행 성공
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 mt-2">
              최종 발행된 글의 품질 점수 및 예상 애드센스 단가 분석 리포트입니다.
            </p>

            {/* List of Published items */}
            <div className="space-y-3 mt-4 max-h-[520px] overflow-y-auto pr-1">
              {publishedItems.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-slate-950/60 border border-dashed border-slate-800 text-slate-500 text-xs space-y-2">
                  <Layers className="w-6 h-6 mx-auto text-slate-600" />
                  <p>오늘 발행 완료된 글이 아직 없습니다.</p>
                  <p className="text-[11px] text-slate-600">파이프라인이 완료되면 여기에 자동 축적됩니다.</p>
                </div>
              ) : (
                publishedItems.map((item) => {
                  const title = item.generatedArticle?.selectedTitle || item.topic;
                  const cpc = item.analyticsReport?.estimatedCpc || "$3.20";
                  const score = item.analyticsReport?.seoScore || 95;

                  return (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl bg-slate-950 border border-emerald-900/40 space-y-2.5 shadow-sm hover:border-emerald-500/40 transition-colors"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>발행 완료 ({item.publishedAt || "오늘"})</span>
                        </span>
                        <span className="text-amber-400 font-mono font-bold">
                          예상 CPC: {cpc}
                        </span>
                      </div>

                      <h3 className="font-bold text-xs sm:text-sm text-white leading-snug">
                        {title}
                      </h3>

                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                        <span className="text-[11px] text-slate-400 font-mono">
                          SEO {score}점 · 가독성 A+
                        </span>
                        <button
                          onClick={() => setSelectedArticleItem(item)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white text-[11px] font-semibold flex items-center gap-1 transition-colors"
                        >
                          <FileText className="w-3 h-3" />
                          <span>글 보기/HTML 복사</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Scoped Real-time Log Console */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 space-y-3 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              [{blog.name}] 실시간 3단 AI 무인 엔진 콘솔 로그
            </h2>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            엔진: {ollamaSettings.useOllama ? `Ollama (${blog.ollamaModel || ollamaSettings.selectedModel})` : "Cloud AI"}
          </span>
        </div>

        <div className="font-mono text-xs text-slate-300 space-y-1.5 max-h-40 overflow-y-auto pr-2">
          {blogLogs.length === 0 ? (
            <p className="text-slate-600">로그 대기 중...</p>
          ) : (
            blogLogs.map((log) => (
              <div key={log.id} className="flex items-start gap-2 leading-relaxed">
                <span className="text-slate-500 text-[10px] shrink-0">[{log.timestamp}]</span>
                <span className="text-slate-300">{log.message}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Article Detail / Google Blogger Export Modal */}
      {selectedArticleItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-3xl max-h-[85vh] bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl flex flex-col text-slate-100">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[11px] font-bold text-orange-400 uppercase tracking-wider">
                  구글 블로그(Google Blogger) 포스팅 데이터
                </span>
                <h2 className="text-lg font-bold text-white mt-0.5 line-clamp-1">
                  {selectedArticleItem.generatedArticle?.selectedTitle || selectedArticleItem.topic}
                </h2>
              </div>
              <button
                onClick={() => setSelectedArticleItem(null)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
              >
                닫기
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto my-4 space-y-4 pr-2">
              {/* Stats badges */}
              <div className="flex items-center gap-3 flex-wrap text-xs">
                <span className="px-3 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold">
                  SEO 점수: {selectedArticleItem.generatedArticle?.seoScore || 95}점
                </span>
                <span className="px-3 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold">
                  예상 애드센스 단가: {selectedArticleItem.analyticsReport?.estimatedCpc || "$3.50"}
                </span>
                <span className="px-3 py-1 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-bold">
                  태그: {selectedArticleItem.generatedArticle?.tags?.join(", ") || "Global, AI, Tech"}
                </span>
              </div>

              {/* Rendered HTML Preview */}
              <div className="p-5 rounded-2xl bg-white text-slate-900 overflow-x-auto shadow-inner">
                <div 
                  className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: selectedArticleItem.generatedArticle?.contentHtml || "<p>내용 없음</p>",
                  }}
                />
              </div>
            </div>

            {/* Modal Footer: 1-Click Copy for Blogger */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs text-slate-400">
                구글 블로그 글쓰기 창에 'HTML 보기' 모드로 전환 후 바로 붙여넣기하세요.
              </span>

              <button
                onClick={() =>
                  handleCopyHtml(selectedArticleItem.generatedArticle?.contentHtml || "")
                }
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-orange-500/20"
              >
                {copiedHtml ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedHtml ? "HTML 복사 완료!" : "Google Blogger용 HTML 복사"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Individual AI Stage Settings Modal */}
      {configModalStage && (
        <AiStageSettingsModal
          isOpen={true}
          onClose={() => setConfigModalStage(null)}
          stage={configModalStage}
          blog={blog}
          ollamaSettings={ollamaSettings}
          onSaveConfig={handleSaveStageConfig}
        />
      )}

      {/* 📚 Blog Article Database & AI Memory Modal */}
      {isDatabaseOpen && (
        <BlogArticleDatabaseModal
          blog={blog}
          isOpen={isDatabaseOpen}
          onClose={() => setIsDatabaseOpen(false)}
          onAddArticleToDb={(blogId, article) => {
            if (onAddArticleToDb) {
              onAddArticleToDb(blogId, article);
            } else {
              const newRecord: BlogArticleRecord = {
                ...article,
                id: `art_${Date.now()}`,
              };
              const updated: BlogItem = {
                ...blog,
                articleDatabase: [newRecord, ...(blog.articleDatabase || [])],
              };
              onUpdateBlogConfig(updated);
            }
          }}
          onDeleteArticleFromDb={(blogId, articleId) => {
            if (onDeleteArticleFromDb) {
              onDeleteArticleFromDb(blogId, articleId);
            } else {
              const updated: BlogItem = {
                ...blog,
                articleDatabase: (blog.articleDatabase || []).filter((a) => a.id !== articleId),
              };
              onUpdateBlogConfig(updated);
            }
          }}
          onTriggerFollowUpTopic={(blogId, parentArticleTitle) => {
            setIsDatabaseOpen(false);
            // Trigger topic AI with deep dive follow-up prompt
            onTriggerTopicAi(blogId, true, `Deep-dive Follow-up Analysis to: "${parentArticleTitle}"`);
          }}
        />
      )}
    </div>
  );
};

import React, { useState } from "react";
import { 
  Sparkles, 
  PenTool, 
  Send, 
  BarChart3, 
  Clock, 
  Flame, 
  Zap, 
  Play, 
  Pause, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  Eye, 
  Copy, 
  Check, 
  Trash2, 
  Terminal, 
  Settings, 
  Cpu, 
  Layers, 
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  FileText,
  Image as ImageIcon
} from "lucide-react";
import { BlogItem, PipelineItem, PipelineLog, OllamaSettings } from "../types";

interface TrioPipelineDashboardProps {
  blogs: BlogItem[];
  selectedBlogId: string;
  onSelectBlog: (id: string) => void;
  pipelineItems: PipelineItem[];
  logs: PipelineLog[];
  isAutopilotRunning: boolean;
  onToggleAutopilot: () => void;
  onTriggerTopicAi: (blogId: string, isUrgent: boolean) => Promise<void>;
  onTriggerWriteNow: (itemId: string) => Promise<void>;
  onTriggerPublishNow: (itemId: string) => Promise<void>;
  onDeleteItem: (itemId: string) => void;
  ollamaSettings: OllamaSettings;
  onOpenOllamaModal: () => void;
  onOpenBlogModal: () => void;
  onOpenWindowsBotModal: () => void;
}

export const TrioPipelineDashboard: React.FC<TrioPipelineDashboardProps> = ({
  blogs,
  selectedBlogId,
  onSelectBlog,
  pipelineItems,
  logs,
  isAutopilotRunning,
  onToggleAutopilot,
  onTriggerTopicAi,
  onTriggerWriteNow,
  onTriggerPublishNow,
  onDeleteItem,
  ollamaSettings,
  onOpenOllamaModal,
  onOpenBlogModal,
  onOpenWindowsBotModal,
}) => {
  const [selectedPostPreview, setSelectedPostPreview] = useState<PipelineItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isTriggeringTopic, setIsTriggeringTopic] = useState(false);
  const [filterBlogId, setFilterBlogId] = useState<string>("all");

  const currentBlog = blogs.find((b) => b.id === selectedBlogId) || blogs[0];

  // Filter items by blog if not "all"
  const filteredItems = filterBlogId === "all" 
    ? pipelineItems 
    : pipelineItems.filter((item) => item.blogId === filterBlogId);

  // Group by stage
  const writingQueueItems = filteredItems.filter(
    (item) => item.stage === "topic_discovered" || item.stage === "waiting_write" || item.stage === "writing"
  );
  const publishingQueueItems = filteredItems.filter(
    (item) => item.stage === "waiting_publish" || item.stage === "publishing"
  );
  const publishedItems = filteredItems.filter((item) => item.stage === "published");

  const handleCopyContent = (item: PipelineItem) => {
    if (!item.generatedArticle) return;
    navigator.clipboard.writeText(item.generatedArticle.contentHtml);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleTriggerTopic = async (urgent: boolean) => {
    setIsTriggeringTopic(true);
    try {
      const targetBlogId = filterBlogId === "all" ? currentBlog.id : filterBlogId;
      await onTriggerTopicAi(targetBlogId, urgent);
    } finally {
      setIsTriggeringTopic(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Multi-Blog Selector & Status Controls */}
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-md">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          {/* Blog Selection Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-cyan-400" />
              블로그 채널:
            </span>
            <button
              onClick={() => setFilterBlogId("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterBlogId === "all"
                  ? "bg-cyan-600 text-white shadow-lg shadow-cyan-600/30"
                  : "bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              전체 통합 ({pipelineItems.length})
            </button>
            {blogs.map((b) => {
              const isSelected = filterBlogId === b.id;
              const count = pipelineItems.filter((i) => i.blogId === b.id).length;
              return (
                <button
                  key={b.id}
                  onClick={() => {
                    setFilterBlogId(b.id);
                    onSelectBlog(b.id);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    isSelected
                      ? "bg-slate-800 text-cyan-300 border border-cyan-500/50 shadow-md shadow-cyan-500/10"
                      : "bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                  <span>{b.name}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-400">
                    {count}
                  </span>
                </button>
              );
            })}
            <button
              onClick={onOpenBlogModal}
              className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1"
            >
              <Settings className="w-3.5 h-3.5 text-purple-400" />
              <span>블로그 관리</span>
            </button>
          </div>

          {/* Quick Engine Status & Master Autopilot Toggle */}
          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-end">
            {/* Ollama Status Button */}
            <button
              onClick={onOpenOllamaModal}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-colors ${
                ollamaSettings.useOllama
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20"
                  : "bg-slate-800 border-slate-700 text-slate-400 hover:text-white"
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>
                {ollamaSettings.useOllama ? `Ollama (${ollamaSettings.selectedModel})` : "클라우드 AI 모드"}
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </button>

            {/* Windows 24H Bot Download Button */}
            <button
              onClick={onOpenWindowsBotModal}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-all"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>윈도우 무인 봇 받기</span>
            </button>

            {/* Master Autopilot Run Button */}
            <button
              onClick={onToggleAutopilot}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg transition-all ${
                isAutopilotRunning
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30"
                  : "bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-600/30"
              }`}
            >
              {isAutopilotRunning ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>오토파일럿 일시정지</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>3단 AI 자동화 가동</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Active Pipeline Flow Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Stage 1 Header Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-950/40 to-slate-900 border border-cyan-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">1. 글 주제 AI</span>
                <span className="text-[10px] text-cyan-300/80">실시간 고수익 키워드 발굴</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleTriggerTopic(true)}
                disabled={isTriggeringTopic}
                className="px-2.5 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 text-[11px] font-bold flex items-center gap-1 transition-colors"
                title="10초 후 즉시 글쓰기로 넘어가는 실시간 긴급 주제 발굴"
              >
                <Flame className="w-3 h-3 text-red-400 animate-bounce" />
                <span>긴급 10s 발굴</span>
              </button>
              <button
                onClick={() => handleTriggerTopic(false)}
                disabled={isTriggeringTopic}
                className="px-2.5 py-1 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 text-[11px] font-bold flex items-center gap-1 transition-colors"
                title="정기 스케줄에 따른 고수익 주제 발굴"
              >
                <Zap className="w-3 h-3 text-cyan-400" />
                <span>정기 발굴</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stage 2 Header Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-indigo-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <PenTool className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">2. 글쓰기 AI (Writer)</span>
                <span className="text-[10px] text-indigo-300/80">대기열 타이머 0s 시 자동 집필</span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 text-[11px] font-bold border border-indigo-500/20">
              대기 {writingQueueItems.length}건
            </span>
          </div>
        </div>

        {/* Stage 3 Header Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-950/40 to-slate-900 border border-purple-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                <Send className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">3. 발행 및 분석 AI</span>
                <span className="text-[10px] text-purple-300/80">타이머 0s 시 블로그 자동 발행</span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-300 text-[11px] font-bold border border-purple-500/20">
              발행 대기 {publishingQueueItems.length}건
            </span>
          </div>
        </div>
      </div>

      {/* 3-Stage Interactive Pipeline Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* COLUMN 1: 글쓰기 대기열 (Writer AI Queue) */}
        <div className="flex flex-col h-full bg-slate-950/80 border border-slate-800 rounded-3xl p-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <h4 className="font-bold text-sm text-white">글쓰기 대기열</h4>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-cyan-300 font-mono">
              {writingQueueItems.length}개
            </span>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto max-h-[620px] pr-1">
            {writingQueueItems.length === 0 ? (
              <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-slate-800 text-slate-500">
                <Sparkles className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                <p className="text-xs font-medium">대기 중인 주제가 없습니다.</p>
                <p className="text-[11px] text-slate-600 mt-1">
                  상단의 [긴급 10s 발굴] 버튼을 누르면 즉시 테스트 대기열이 생성됩니다.
                </p>
              </div>
            ) : (
              writingQueueItems.map((item) => {
                const targetBlog = blogs.find((b) => b.id === item.blogId);
                const isWriting = item.stage === "writing";
                const isUrgent = item.urgency === "urgent";

                return (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      isWriting
                        ? "bg-cyan-950/40 border-cyan-500 shadow-lg shadow-cyan-500/20 animate-pulse"
                        : "bg-slate-900 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between text-[11px] mb-2">
                      <span className="font-bold text-slate-300 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                        {targetBlog?.name || "블로그"}
                      </span>
                      {isUrgent ? (
                        <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 font-bold border border-red-500/30 flex items-center gap-1 text-[10px]">
                          <Flame className="w-3 h-3 text-red-400" />
                          긴급 (10초)
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px]">
                          정기 스케줄
                        </span>
                      )}
                    </div>

                    {/* Topic Title */}
                    <p 
                      onClick={() => setSelectedPostPreview(item)}
                      className="text-xs font-bold text-white leading-snug mb-3 cursor-pointer hover:text-cyan-300 hover:underline transition-colors flex items-center justify-between gap-1 group"
                      title="글 주제 상세 및 대기열 정보 팝업 열기"
                    >
                      <span>{item.topic}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-cyan-400 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" />
                    </p>

                    {/* Timer / Progress Bar */}
                    {isWriting ? (
                      <div className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center gap-2 text-cyan-300 text-xs font-bold">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>글쓰기 AI가 글 작성 중...</span>
                      </div>
                    ) : (
                      <div className="space-y-1.5 mb-3">
                        <div className="flex items-center justify-between text-[11px] font-mono">
                          <span className="text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-cyan-400" />
                            집필 시작까지:
                          </span>
                          <span className="font-bold text-cyan-300">
                            {item.remainingDelaySec}초 남음
                          </span>
                        </div>
                        {/* Progress Bar */}
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-cyan-500 h-full rounded-full transition-all duration-1000"
                            style={{
                              width: `${Math.max(
                                0,
                                Math.min(
                                  100,
                                  ((item.totalDelaySec - item.remainingDelaySec) /
                                    Math.max(1, item.totalDelaySec)) *
                                    100
                                )
                              )}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Action Controls */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                      <button
                        onClick={() => onDeleteItem(item.id)}
                        className="p-1 rounded-lg text-slate-500 hover:text-red-400 transition-colors"
                        title="대기열에서 취소/삭제"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      {!isWriting && (
                        <button
                          onClick={() => onTriggerWriteNow(item.id)}
                          className="px-2.5 py-1 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 text-[11px] font-bold flex items-center gap-1 transition-all"
                        >
                          <Zap className="w-3 h-3 text-cyan-400" />
                          <span>즉시 글쓰기 (0s)</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* COLUMN 2: 발행 대기열 (Publishing Queue) */}
        <div className="flex flex-col h-full bg-slate-950/80 border border-slate-800 rounded-3xl p-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
            <div className="flex items-center gap-2">
              <Send className="w-4 h-4 text-indigo-400" />
              <h4 className="font-bold text-sm text-white">발행 대기열</h4>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-indigo-300 font-mono">
              {publishingQueueItems.length}개
            </span>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto max-h-[620px] pr-1">
            {publishingQueueItems.length === 0 ? (
              <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-slate-800 text-slate-500">
                <PenTool className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                <p className="text-xs font-medium">발행 대기 중인 글이 없습니다.</p>
                <p className="text-[11px] text-slate-600 mt-1">
                  글쓰기 AI가 집필을 완료하면 이곳으로 자동 이관됩니다.
                </p>
              </div>
            ) : (
              publishingQueueItems.map((item) => {
                const targetBlog = blogs.find((b) => b.id === item.blogId);
                const isPublishing = item.stage === "publishing";

                return (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      isPublishing
                        ? "bg-indigo-950/40 border-indigo-500 shadow-lg shadow-indigo-500/20 animate-pulse"
                        : "bg-slate-900 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between text-[11px] mb-2">
                      <span className="font-bold text-slate-300 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                        {targetBlog?.name || "블로그"}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-500/30">
                        작성 완료 · 검수 중
                      </span>
                    </div>

                    {/* Post Title */}
                    <p 
                      onClick={() => setSelectedPostPreview(item)}
                      className="text-xs font-bold text-white leading-snug mb-1 cursor-pointer hover:text-indigo-300 hover:underline transition-colors flex items-center justify-between gap-1 group"
                      title="작성된 글 내용 팝업 열기"
                    >
                      <span>{item.generatedArticle?.selectedTitle || item.topic}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-indigo-400 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" />
                    </p>

                    <p className="text-[11px] text-slate-400 line-clamp-2 mb-3">
                      {item.generatedArticle?.metaDescription || "고수익 애드센스 최적화 글이 완성되었습니다."}
                    </p>

                    {/* Timer */}
                    {isPublishing ? (
                      <div className="p-2 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center gap-2 text-indigo-300 text-xs font-bold">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>블로그로 최종 전송 발행 중...</span>
                      </div>
                    ) : (
                      <div className="space-y-1.5 mb-3">
                        <div className="flex items-center justify-between text-[11px] font-mono">
                          <span className="text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-indigo-400" />
                            최종 발행까지:
                          </span>
                          <span className="font-bold text-indigo-300">
                            {item.remainingDelaySec}초 남음
                          </span>
                        </div>
                        {/* Progress Bar */}
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-indigo-500 h-full rounded-full transition-all duration-1000"
                            style={{
                              width: `${Math.max(
                                0,
                                Math.min(
                                  100,
                                  ((item.totalDelaySec - item.remainingDelaySec) /
                                    Math.max(1, item.totalDelaySec)) *
                                    100
                                )
                              )}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Action Controls */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setSelectedPostPreview(item)}
                          className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-semibold flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          <span>미리보기</span>
                        </button>
                        <button
                          onClick={() => onDeleteItem(item.id)}
                          className="p-1 rounded-lg text-slate-500 hover:text-red-400"
                          title="대기열 취소"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {!isPublishing && (
                        <button
                          onClick={() => onTriggerPublishNow(item.id)}
                          className="px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-[11px] font-bold flex items-center gap-1 transition-all"
                        >
                          <Send className="w-3 h-3 text-indigo-400" />
                          <span>즉시 발행 (0s)</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* COLUMN 3: 발행 완료 & 분석 AI (Published & Analytics) */}
        <div className="flex flex-col h-full bg-slate-950/80 border border-slate-800 rounded-3xl p-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <h4 className="font-bold text-sm text-white">발행 완료 & 분석 리포트</h4>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-emerald-300 font-mono">
              {publishedItems.length}개
            </span>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto max-h-[620px] pr-1">
            {publishedItems.length === 0 ? (
              <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-slate-800 text-slate-500">
                <BarChart3 className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                <p className="text-xs font-medium">아직 발행 완료된 글이 없습니다.</p>
                <p className="text-[11px] text-slate-600 mt-1">
                  발행이 완료되면 실시간 SEO 점수와 예상 수익 리포트가 표시됩니다.
                </p>
              </div>
            ) : (
              publishedItems.map((item) => {
                const targetBlog = blogs.find((b) => b.id === item.blogId);
                const article = item.generatedArticle;
                const analysis = item.analyticsReport;

                return (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-2.5"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-slate-300 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        {targetBlog?.name || "블로그"}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold text-[10px] border border-emerald-500/30 flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        발행 완료
                      </span>
                    </div>

                    {/* Title */}
                    <p 
                      onClick={() => setSelectedPostPreview(item)}
                      className="text-xs font-bold text-white leading-snug cursor-pointer hover:text-emerald-300 hover:underline transition-colors flex items-center justify-between gap-1 group"
                      title="발행 완료 글 내용 및 분석 리포트 팝업 열기"
                    >
                      <span>{article?.selectedTitle || item.topic}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-emerald-400 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" />
                    </p>

                    {/* Analytics AI Score Card */}
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-3 gap-2 text-center text-[10px]">
                      <div>
                        <span className="text-slate-500 block">SEO 점수</span>
                        <span className="font-bold text-emerald-400 text-xs">
                          {analysis?.seoScore || 95}점
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">예상 CPC</span>
                        <span className="font-bold text-cyan-400 text-xs">
                          {analysis?.estimatedCpc || "$2.40"}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">체류 등급</span>
                        <span className="font-bold text-purple-400 text-xs">
                          {analysis?.readabilityGrade || "A+"}
                        </span>
                      </div>
                    </div>

                    {/* Action Controls */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                      <button
                        onClick={() => setSelectedPostPreview(item)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>글 전문 보기</span>
                      </button>

                      <button
                        onClick={() => handleCopyContent(item)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold flex items-center gap-1 transition-colors"
                      >
                        {copiedId === item.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span>복사됨!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-emerald-400" />
                            <span>원클릭 복사</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Real-time Live 3-AI Interaction Log Console */}
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-950 border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <h4 className="font-bold text-xs text-white uppercase tracking-wider">
              3단 AI 실시간 파이프라인 상호작용 콘솔 (Live Trio-AI Logs)
            </h4>
          </div>
          <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            무인 실시간 모니터링 활성
          </span>
        </div>

        <div className="h-32 overflow-y-auto font-mono text-[11px] p-3 rounded-2xl bg-black/80 border border-slate-900 space-y-1.5 select-text">
          {logs.length === 0 ? (
            <div className="text-slate-600 italic">
              파이프라인 이벤트 대기 중... 상단의 발굴 버튼을 누르면 AI 상호작용이 기록됩니다.
            </div>
          ) : (
            logs.map((log) => {
              const badgeColor =
                log.aiType === "topic"
                  ? "text-cyan-400"
                  : log.aiType === "writer"
                  ? "text-indigo-400"
                  : log.aiType === "publisher"
                  ? "text-purple-400"
                  : "text-emerald-400";

              return (
                <div key={log.id} className="leading-relaxed flex items-start gap-2">
                  <span className="text-slate-600 shrink-0">[{log.timestamp}]</span>
                  <span className={`font-bold shrink-0 ${badgeColor}`}>
                    [{log.blogName}] [{log.aiType.toUpperCase()}]
                  </span>
                  <span className="text-slate-300">{log.message}</span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Post Preview & Topic Queue Modal */}
      {selectedPostPreview && (() => {
        const previewBlog = blogs.find((b) => b.id === selectedPostPreview.blogId);
        const hasArticle = !!selectedPostPreview.generatedArticle;

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[88vh] text-slate-100">
              {/* Modal Header */}
              <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${
                      selectedPostPreview.stage === "waiting_write" || selectedPostPreview.stage === "writing"
                        ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/30"
                        : selectedPostPreview.stage === "waiting_publish" || selectedPostPreview.stage === "publishing"
                        ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/30"
                        : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                    }`}>
                      {selectedPostPreview.stage === "waiting_write" ? "⏳ 1단 글쓰기 대기열" :
                       selectedPostPreview.stage === "writing" ? "✍️ 1단 글쓰기 AI 집필 중" :
                       selectedPostPreview.stage === "waiting_publish" ? "📬 2단 블로그 발행 대기열" :
                       selectedPostPreview.stage === "publishing" ? "🚀 2단 발행 전송 중" :
                       "✅ 3단 발행 완료 아카이브"}
                    </span>
                    {previewBlog && (
                      <span className="text-slate-400 text-xs">
                        채널: <strong className="text-slate-200">{previewBlog.name}</strong>
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-base sm:text-lg text-white line-clamp-2 mt-1">
                    {selectedPostPreview.generatedArticle?.selectedTitle || selectedPostPreview.topic}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedPostPreview(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors ml-2 shrink-0"
                >
                  ✕
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs text-slate-300">
                {hasArticle && selectedPostPreview.generatedArticle ? (
                  <>
                    {/* Badges */}
                    <div className="flex items-center gap-2.5 flex-wrap text-xs">
                      <span className="px-3 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold">
                        SEO 점수: {selectedPostPreview.generatedArticle.seoScore || 95}점
                      </span>
                      <span className="px-3 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold">
                        예상 애드센스 단가: {selectedPostPreview.analyticsReport?.estimatedCpc || "$2.40"}
                      </span>
                      {selectedPostPreview.generatedArticle.images && selectedPostPreview.generatedArticle.images.length > 0 && (
                        <span className="px-3 py-1 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-bold flex items-center gap-1.5">
                          <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                          <span>AI 이미지 {selectedPostPreview.generatedArticle.images.length}장 삽입 완료</span>
                        </span>
                      )}
                    </div>

                    {/* Meta description */}
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400 font-bold">SEO 메타 디스크립션:</span>
                        <span className="text-emerald-400 font-mono text-[10px]">구글 스니펫 최적화</span>
                      </div>
                      <p className="text-slate-200 leading-relaxed">
                        {selectedPostPreview.generatedArticle.metaDescription}
                      </p>
                      {selectedPostPreview.generatedArticle.tags && selectedPostPreview.generatedArticle.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {selectedPostPreview.generatedArticle.tags.map((t, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md bg-slate-800 text-cyan-300 text-[10px]"
                            >
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Review AI Quality Report */}
                    {(selectedPostPreview.generatedArticle.reviewResult || selectedPostPreview.reviewResult) && (() => {
                      const review = selectedPostPreview.generatedArticle?.reviewResult || selectedPostPreview.reviewResult;
                      if (!review) return null;
                      return (
                        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-950/40 to-slate-950 border border-indigo-500/30 space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <ShieldCheck className="w-4 h-4 text-indigo-400" />
                              <span className="text-xs font-bold text-indigo-200">리뷰 & 팩트체킹 AI 품질 진단 리포트</span>
                            </div>
                            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-lg border ${
                              review.passed ? "bg-emerald-950 text-emerald-300 border-emerald-500/40" : "bg-amber-950 text-amber-300 border-amber-500/40"
                            }`}>
                              종합 평점: {review.overallScore}점 ({review.passed ? "검수 통과" : "보강 권장"})
                            </span>
                          </div>
                          {review.summaryFeedback && (
                            <p className="text-xs text-slate-300 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                              💡 {review.summaryFeedback}
                            </p>
                          )}
                          {review.suggestions && review.suggestions.length > 0 && (
                            <div className="text-[11px] text-slate-300 space-y-1">
                              <span className="font-semibold text-indigo-300 block">권장 개선 및 수익화 조언:</span>
                              {review.suggestions.map((sug, sIdx) => (
                                <p key={sIdx} className="text-slate-400 pl-2 border-l-2 border-indigo-500/50">
                                  • {sug}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })()}

                    {/* Attached Images Gallery */}
                    {selectedPostPreview.generatedArticle.images && selectedPostPreview.generatedArticle.images.length > 0 && (
                      <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <ImageIcon className="w-4 h-4 text-emerald-400" />
                            <span className="text-xs font-bold text-white">본문 자동 배치 이미지 메타데이터</span>
                          </div>
                          <span className="text-[11px] text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded-lg border border-emerald-800/60">
                            검수 완료 ({selectedPostPreview.generatedArticle.images.length}장)
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {selectedPostPreview.generatedArticle.images.map((img, idx) => (
                            <div key={img.id || idx} className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900 border border-slate-800/80 text-[11px]">
                              <img 
                                src={img.thumbnailUrl || img.imageUrl} 
                                alt={img.altText} 
                                className="w-12 h-12 rounded-lg object-cover border border-slate-700 shrink-0" 
                              />
                              <div className="overflow-hidden space-y-0.5">
                                <p className="font-semibold text-slate-200 truncate">{img.caption || img.altText}</p>
                                <p className="text-[10px] text-slate-400 truncate">검색어: {img.searchKeyword} | {img.position}</p>
                                <p className="text-[10px] text-cyan-400 truncate">출처: {img.sourceName} ({img.license})</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Rendered HTML Post */}
                    <div className="p-5 rounded-2xl bg-white text-slate-900 overflow-x-auto shadow-inner prose prose-sm max-w-none">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: selectedPostPreview.generatedArticle.contentHtml,
                        }}
                      />
                    </div>
                  </>
                ) : (
                  /* Topic Queue Details (Not yet written) */
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4" /> 1단 발굴 주제 상세 및 자동 집필 예약
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 font-mono text-[11px] border border-cyan-800/40">
                          {selectedPostPreview.urgency === "urgent" ? "🔥 긴급 이슈 (10초)" : "⏰ 정기 스케줄"}
                        </span>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                        <span className="text-[11px] text-slate-400 block font-medium">타겟 발굴 주제:</span>
                        <p className="text-sm font-bold text-white leading-relaxed">
                          {selectedPostPreview.topic}
                        </p>
                      </div>

                      {previewBlog && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                            <span className="text-slate-400 text-[11px]">발행 대상 채널:</span>
                            <p className="font-semibold text-slate-200">{previewBlog.name}</p>
                            <p className="text-[10px] text-slate-500 truncate">{previewBlog.blogUrl}</p>
                          </div>

                          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                            <span className="text-slate-400 text-[11px]">타겟 틈새 니치 & 독자층:</span>
                            <p className="font-semibold text-cyan-300">{previewBlog.niche}</p>
                            <p className="text-[10px] text-slate-400 truncate">{previewBlog.targetAudience}</p>
                          </div>
                        </div>
                      )}

                      <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
                        <span className="text-slate-400 flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-cyan-400" />
                          집필 시작까지 남은 시간:
                        </span>
                        <span className="font-mono font-bold text-cyan-300 text-sm">
                          {selectedPostPreview.remainingDelaySec}초 남음
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-900/40 text-[11px] text-cyan-200/90 leading-relaxed space-y-1">
                        <p className="font-bold flex items-center gap-1 text-cyan-300">
                          <CheckCircle2 className="w-3.5 h-3.5" /> 자동화 파이프라인 안내:
                        </p>
                        <p>
                          타이머가 0초에 도달하면 <strong>2단 글쓰기 AI(Writer)</strong>가 자동으로 영문 SEO 본문을 집필하고, 라이선스 무료 이미지를 검색하여 본문 요소별로 배치한 뒤 <strong>리뷰·어드바이저 AI</strong> 품질 검수까지 원스톱으로 마칩니다.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between flex-wrap gap-2">
                {hasArticle ? (
                  <>
                    <span className="text-[11px] text-slate-500">
                      구글 블로그, 티스토리 등에 바로 붙여넣기 가능한 완성본입니다.
                    </span>
                    <div className="flex gap-2">
                      {selectedPostPreview.stage === "waiting_publish" && (
                        <button
                          onClick={() => {
                            onTriggerPublishNow(selectedPostPreview.id);
                            setSelectedPostPreview(null);
                          }}
                          className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 flex items-center gap-1.5 transition-colors"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>지금 즉시 블로그 발행</span>
                        </button>
                      )}
                      <button
                        onClick={() => handleCopyContent(selectedPostPreview)}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 flex items-center gap-1.5 transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>본문 전체 복사</span>
                      </button>
                      <button
                        onClick={() => setSelectedPostPreview(null)}
                        className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                      >
                        닫기
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        onDeleteItem(selectedPostPreview.id);
                        setSelectedPostPreview(null);
                      }}
                      className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-red-300 hover:bg-red-950/40 flex items-center gap-1.5 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>대기열에서 삭제</span>
                    </button>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          onTriggerWriteNow(selectedPostPreview.id);
                          setSelectedPostPreview(null);
                        }}
                        className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 flex items-center gap-2 shadow-lg shadow-cyan-600/20 transition-all"
                      >
                        <Zap className="w-4 h-4 text-amber-300" />
                        <span>⚡ 지금 즉시 글쓰기 AI 가동 (0s)</span>
                      </button>
                      <button
                        onClick={() => setSelectedPostPreview(null)}
                        className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                      >
                        닫기
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

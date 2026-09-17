export type BlogPlatform = "blogger" | "wordpress" | "tistory" | "naver";

export type MonetizationType = "adsense" | "coupang" | "info" | "review";

export type WritingTone = "expert" | "friendly" | "concise";

export type PostLength = "short" | "medium" | "long";

export interface StageAiConfig {
  customPrompt?: string;
  model?: string;
  tone?: WritingTone;
  targetLength?: PostLength;
  delaySec?: number;
  includeAdSlots?: boolean;
  includeFaq?: boolean;
}

export interface DirectorAdvice {
  statusAssessment: string;
  actionPlan: string;
  recommendedTopic?: string;
  urgency?: "urgent" | "normal";
  expectedCpc?: string;
  strategyTips?: string[];
  lastUpdated?: string;
}

export interface BlogArticleRecord {
  id: string;
  blogId: string;
  title: string;
  topic: string;
  niche: string;
  publishedAt: string;
  seoScore: number;
  expectedCpc: string;
  wordCount: number;
  summary: string;
  tags: string[];
  contentHtml?: string;
  aiModel?: string;
  keyStrengths?: string[];
  internalAnchorSuggestions?: string[];
  urgency?: "urgent" | "normal";
}

export interface BlogItem {
  id: string;
  name: string;
  platform: BlogPlatform;
  niche: string;
  blogUrl?: string;
  targetAudience?: string;
  todayPostCount: number; // 오늘 하루 올린 블로그 갯수
  totalPostCount?: number;
  dailyGoal?: number;
  targetKeywords?: string[];
  focusKeywords?: string[];
  ollamaModel?: string;
  topicAiPrompt?: string;
  writerAiPrompt?: string;
  analyticsAiPrompt?: string;
  topicAiConfig?: StageAiConfig;
  writerAiConfig?: StageAiConfig;
  analyticsAiConfig?: StageAiConfig;
  directorAdvice?: DirectorAdvice;
  articleDatabase?: BlogArticleRecord[]; // 블로그별 고유 아티클 DB 및 AI 지식 메모리
  topicAiIntervalMinutes?: number;
  defaultWriteDelaySec: number; // e.g., 10 for urgent, 180 for normal
  defaultPublishDelaySec: number; // e.g., 60 for fast, 3600 for safe
  isActive?: boolean;
  active?: boolean;
  color?: string;
}

export type PipelineStage = 
  | "topic_discovered" 
  | "waiting_write" 
  | "writing" 
  | "waiting_publish" 
  | "publishing" 
  | "published" 
  | "failed";

export interface PipelineItem {
  id: string;
  blogId: string;
  blogName?: string;
  topic: string;
  suggestedBy?: "topic_ai" | "manual";
  urgency: "urgent" | "normal" | "scheduled";
  stage: PipelineStage;
  status?: PipelineStage;
  
  // Timers
  totalDelaySec: number;
  remainingDelaySec: number;
  writeRemainingSec?: number;
  writeTotalSec?: number;
  publishRemainingSec?: number;
  publishTotalSec?: number;

  generatedArticle?: {
    selectedTitle: string;
    contentHtml: string;
    metaDescription?: string;
    tags: string[];
    keyTakeaways?: string[];
    monetizationTips?: string[];
    seoScore?: number;
  };
  postData?: GeneratedPost;

  analyticsReport?: {
    seoScore: number;
    estimatedCpc: string;
    readabilityGrade: string;
    targetAudienceMatch?: string;
    keyStrengths?: string[];
  };
  analytics?: {
    seoScore: number;
    expectedCpc: string;
    wordCount: number;
    retentionGrade: string;
  };

  createdAt: number | string;
  writingStartedAt?: number | string;
  writingFinishedAt?: number | string;
  publishedAt?: number | string;
  error?: string;
}

export interface OllamaSettings {
  host: string;
  selectedModel: string;
  useOllama: boolean;
  isConnected: boolean;
}

export interface PipelineLog {
  id: string;
  timestamp: string;
  blogName: string;
  aiType: "topic" | "writer" | "publisher" | "director" | "system";
  aiRole?: "topic_ai" | "writer_ai" | "publisher_ai" | "director" | "system";
  message: string;
  level?: "info" | "success" | "warning" | "error";
}

export interface KeywordItem {
  keyword: string;
  searchVolume: string;
  competition: string;
  expectedCpc: string;
  profitabilityScore: number;
  recommendedTitles: string[];
  targetAudience: string;
  monetizationStrategy: string;
}

export interface GeneratedPost {
  titles: string[];
  selectedTitle: string;
  metaDescription: string;
  tags: string[];
  summary: string;
  estimatedReadingTime: string;
  contentHtml: string;
  contentMarkdown: string;
  monetizationGuide?: {
    recommendedAdPlacement: string;
    affiliateTips: string;
    retentionHacks: string;
  };
}

export interface BatchPlanItem {
  day: number;
  keyword: string;
  title: string;
  category: string;
  cpcPotential: string;
  keyContentPoints: string[];
}

export interface SavedPost {
  id: string;
  title: string;
  platform: BlogPlatform;
  keyword: string;
  createdAt: string;
  htmlContent: string;
  markdownContent: string;
  tags: string[];
}

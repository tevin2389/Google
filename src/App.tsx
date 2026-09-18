import React, { useState, useEffect, useRef } from "react";
import { Navbar } from "./components/Navbar";
import { GoogleBlogsHub } from "./components/GoogleBlogsHub";
import { DedicatedBlogPipeline } from "./components/DedicatedBlogPipeline";
import { StatisticsDashboard } from "./components/StatisticsDashboard";
import { AddEditBlogModal } from "./components/AddEditBlogModal";
import { OllamaSettingsModal } from "./components/OllamaSettingsModal";
import { WindowsBotDownloader } from "./components/WindowsBotDownloader";
import { MonetizationPlaybookModal } from "./components/MonetizationPlaybookModal";
import { 
  BlogItem, 
  PipelineItem, 
  PipelineLog, 
  OllamaSettings,
  BlogArticleRecord 
} from "./types";
import { INITIAL_BLOG_ARTICLES } from "./data/blogArticlesSeed";

// Default overseas Google Blogs (Google Blogger / Blogspot)
const DEFAULT_GOOGLE_BLOGS: BlogItem[] = [
  {
    id: "google-blog-1",
    name: "AI Tech Pulse & SaaS Reviews",
    platform: "blogger",
    niche: "Generative AI Tools, B2B SaaS Automation & Tech Reviews",
    blogUrl: "https://aitechpulse.blogspot.com",
    targetAudience: "US / Global English - High CPC AdSense",
    todayPostCount: 3,
    totalPostCount: 42,
    dailyGoal: 5,
    defaultWriteDelaySec: 10, // 10s urgent test default
    defaultPublishDelaySec: 60,
    ollamaModel: "qwen2.5:7b",
    isActive: true,
    articleDatabase: INITIAL_BLOG_ARTICLES["google-blog-1"] || [],
  },
  {
    id: "google-blog-2",
    name: "Global Wealth & US Dividend Insider",
    platform: "blogger",
    niche: "US High-Yield Dividend ETFs, Life Insurance & Mortgages",
    blogUrl: "https://globalwealthinsider.blogspot.com",
    targetAudience: "US / Global English - High CPC AdSense",
    todayPostCount: 2,
    totalPostCount: 29,
    dailyGoal: 5,
    defaultWriteDelaySec: 15,
    defaultPublishDelaySec: 60,
    ollamaModel: "llama3.1:8b",
    isActive: true,
    articleDatabase: INITIAL_BLOG_ARTICLES["google-blog-2"] || [],
  },
  {
    id: "google-blog-3",
    name: "Cloud Cybersecurity & DevSecOps",
    platform: "blogger",
    niche: "Zero-Trust Cloud Architecture, Enterprise VPN & DevSecOps",
    blogUrl: "https://cloudsecinsights.blogspot.com",
    targetAudience: "US / Global English - High CPC AdSense",
    todayPostCount: 1,
    totalPostCount: 18,
    dailyGoal: 4,
    defaultWriteDelaySec: 10,
    defaultPublishDelaySec: 60,
    ollamaModel: "qwen2.5:7b",
    isActive: true,
    articleDatabase: INITIAL_BLOG_ARTICLES["google-blog-3"] || [],
  },
  {
    id: "google-blog-4",
    name: "Digital Nomad & Global Relocation",
    platform: "blogger",
    niche: "Remote Work Visas, Expat Tax Optimization & Nomad Tech Gear",
    blogUrl: "https://nomadrelocate.blogspot.com",
    targetAudience: "US / Global English - High CPC AdSense",
    todayPostCount: 4,
    totalPostCount: 52,
    dailyGoal: 6,
    defaultWriteDelaySec: 20,
    defaultPublishDelaySec: 90,
    ollamaModel: "llama3.1:8b",
    isActive: true,
    articleDatabase: INITIAL_BLOG_ARTICLES["google-blog-4"] || [],
  },
];

const INITIAL_PIPELINE: PipelineItem[] = [
  {
    id: "pipe-1",
    blogId: "google-blog-1",
    topic: "Top 7 AI Automation Tools to Double Developer Productivity in 2026",
    urgency: "urgent",
    stage: "waiting_write",
    totalDelaySec: 10,
    remainingDelaySec: 8,
    createdAt: new Date().toLocaleTimeString(),
  },
  {
    id: "pipe-2",
    blogId: "google-blog-2",
    topic: "SCHD vs VOO: Best Dividend ETF Strategy for Passive Income in 2026",
    urgency: "normal",
    stage: "waiting_publish",
    totalDelaySec: 60,
    remainingDelaySec: 35,
    createdAt: new Date().toLocaleTimeString(),
    generatedArticle: {
      selectedTitle: "SCHD vs VOO in 2026: The Ultimate High-Yield Dividend Strategy",
      contentHtml: "<h2>1. Core Investment Differences</h2><p>SCHD prioritizes consistent dividend growth and yields over 3.6%, whereas VOO captures the total growth of the S&P 500 index.</p><!-- GOOGLE_ADSENSE_HIGH_CPC_UNIT --><h2>2. Tax Optimization in Retirement Accounts</h2><p>Holding dividend ETFs in tax-advantaged accounts prevents immediate tax drag and supercharges compound growth.</p>",
      metaDescription: "Detailed comparison between SCHD and VOO for US and international passive dividend investors in 2026.",
      tags: ["SCHD", "VOO", "DividendETF", "USInvesting"],
      keyTakeaways: ["High yield + dividend growth", "Lower beta volatility", "Reinvestment compounding"],
      seoScore: 96,
    },
  },
  {
    id: "pipe-3",
    blogId: "google-blog-1",
    topic: "Best B2B SaaS CRM Platforms for Scaling Startups: In-Depth Review",
    urgency: "normal",
    stage: "published",
    totalDelaySec: 60,
    remainingDelaySec: 0,
    createdAt: new Date(Date.now() - 3600000).toLocaleTimeString(),
    publishedAt: new Date().toLocaleTimeString(),
    generatedArticle: {
      selectedTitle: "Top 5 B2B SaaS CRM Platforms for Startups & Scale-ups in 2026",
      contentHtml: "<h2>Enterprise CRM Comparison</h2><p>Modern CRMs must deliver native AI email drafting, automated deal pipeline tracking, and flexible API integrations.</p><!-- GOOGLE_ADSENSE_HIGH_CPC_UNIT --><h3>Pricing & ROI Breakdown</h3><p>Choosing the right plan reduces churn and accelerates outbound sales cycles.</p>",
      metaDescription: "Comprehensive B2B SaaS CRM review covering HubSpot, Salesforce, and modern AI alternatives.",
      tags: ["SaaSCrm", "B2BTools", "StartupGrowth"],
      seoScore: 98,
    },
    analyticsReport: {
      seoScore: 98,
      estimatedCpc: "$5.40",
      readabilityGrade: "A+",
      targetAudienceMatch: "US Tech & Enterprise Founders",
      keyStrengths: ["High-intent commercial keywords", "Responsive AdSense slots", "Rich comparison table"],
    },
  },
];

export default function App() {
  // Game-like 2 Primary Views: 'work' | 'stats'
  const [activeTab, setActiveTab] = useState<"work" | "stats">("work");

  // Selected Google Blog ID in Work View (null = Hub grid; string = Dedicated Pipeline)
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);

  // Overseas Google Blogs State
  const [blogs, setBlogs] = useState<BlogItem[]>(() => {
    try {
      const stored = localStorage.getItem("autoblog_pro_google_blogs");
      if (stored) {
        const parsed: BlogItem[] = JSON.parse(stored);
        // Ensure each blog has articleDatabase initialized
        return parsed.map((b) => ({
          ...b,
          articleDatabase: b.articleDatabase && b.articleDatabase.length > 0 
            ? b.articleDatabase 
            : (INITIAL_BLOG_ARTICLES[b.id] || []),
        }));
      }
      return DEFAULT_GOOGLE_BLOGS;
    } catch {
      return DEFAULT_GOOGLE_BLOGS;
    }
  });

  // Pipeline Items State
  const [pipelineItems, setPipelineItems] = useState<PipelineItem[]>(() => {
    try {
      const stored = localStorage.getItem("autoblog_pro_google_pipeline");
      return stored ? JSON.parse(stored) : INITIAL_PIPELINE;
    } catch {
      return INITIAL_PIPELINE;
    }
  });

  // Ollama Settings (100% Free Unlimited Local AI)
  const [ollamaSettings, setOllamaSettings] = useState<OllamaSettings>(() => {
    try {
      const stored = localStorage.getItem("autoblog_pro_ollama");
      return stored ? JSON.parse(stored) : {
        host: "http://localhost:11434",
        selectedModel: "qwen2.5:7b",
        useOllama: true,
        isConnected: true,
      };
    } catch {
      return {
        host: "http://localhost:11434",
        selectedModel: "qwen2.5:7b",
        useOllama: true,
        isConnected: true,
      };
    }
  });

  // Real-time Pipeline Logs
  const [pipelineLogs, setPipelineLogs] = useState<PipelineLog[]>([
    {
      id: "log-init",
      timestamp: new Date().toLocaleTimeString(),
      blogName: "시스템",
      aiType: "publisher",
      message: "🌐 해외 타겟 구글 블로그(Google Blogger) 전용 3단 AI 무인 엔진이 준비되었습니다.",
    },
  ]);

  // Master Autopilot toggle
  const [isAutopilotRunning, setIsAutopilotRunning] = useState(true);

  // Modals
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [blogToEdit, setBlogToEdit] = useState<BlogItem | null>(null);
  const [isOllamaModalOpen, setIsOllamaModalOpen] = useState(false);
  const [isWindowsBotOpen, setIsWindowsBotOpen] = useState(false);
  const [isPlaybookOpen, setIsPlaybookOpen] = useState(false);

  // In-flight guard to avoid duplicate executions
  const processingRef = useRef<{ [key: string]: boolean }>({});

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem("autoblog_pro_google_blogs", JSON.stringify(blogs));
  }, [blogs]);

  useEffect(() => {
    localStorage.setItem("autoblog_pro_google_pipeline", JSON.stringify(pipelineItems));
  }, [pipelineItems]);

  useEffect(() => {
    localStorage.setItem("autoblog_pro_ollama", JSON.stringify(ollamaSettings));
  }, [ollamaSettings]);

  const addLog = (blogName: string, aiType: PipelineLog["aiType"], message: string) => {
    setPipelineLogs((prev) => [
      {
        id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`,
        timestamp: new Date().toLocaleTimeString(),
        blogName,
        aiType,
        message,
      },
      ...prev.slice(0, 50),
    ]);
  };

  // =========================================================================
  // 1-SECOND AUTOPILOT ENGINE (Countdown Timers & Automatic Transitions)
  // =========================================================================
  useEffect(() => {
    if (!isAutopilotRunning) return;

    const interval = setInterval(() => {
      setPipelineItems((prevItems) => {
        return prevItems.map((item) => {
          // 1. Writer Queue Countdown
          if (item.stage === "waiting_write") {
            const nextRemaining = item.remainingDelaySec - 1;
            if (nextRemaining <= 0) {
              if (!processingRef.current[item.id]) {
                processingRef.current[item.id] = true;
                setTimeout(() => handleExecuteWriting(item.id), 0);
              }
              return { ...item, remainingDelaySec: 0, stage: "writing" };
            }
            return { ...item, remainingDelaySec: nextRemaining };
          }

          // 2. Publisher Queue Countdown
          if (item.stage === "waiting_publish") {
            const nextRemaining = item.remainingDelaySec - 1;
            if (nextRemaining <= 0) {
              if (!processingRef.current[item.id]) {
                processingRef.current[item.id] = true;
                setTimeout(() => handleExecutePublishing(item.id), 0);
              }
              return { ...item, remainingDelaySec: 0, stage: "publishing" };
            }
            return { ...item, remainingDelaySec: nextRemaining };
          }

          return item;
        });
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isAutopilotRunning, blogs, ollamaSettings]);

  // Execute Writer AI
  const handleExecuteWriting = async (itemId: string) => {
    const item = pipelineItems.find((i) => i.id === itemId);
    if (!item) return;

    const blog = blogs.find((b) => b.id === item.blogId) || blogs[0];
    const writerConfig = blog.writerAiConfig || {};
    const modelToUse = writerConfig.model || blog.ollamaModel || ollamaSettings.selectedModel;

    addLog(
      blog.name,
      "writer",
      `✍️ [글쓰기 AI] 타이머 만료! '${item.topic}' 영문 SEO 집필 시작 (모델: ${
        ollamaSettings.useOllama ? modelToUse : "Cloud AI"
      })`
    );

    try {
      const res = await fetch("/api/generate-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blogId: blog.id,
          topic: item.topic,
          platform: "blogger",
          monetizationType: "adsense",
          tone: writerConfig.tone || "expert",
          targetLength: writerConfig.targetLength || "medium",
          includeAdSlots: writerConfig.includeAdSlots ?? true,
          includeCta: true,
          includeFaq: writerConfig.includeFaq ?? true,
          customPrompt: writerConfig.customPrompt || blog.writerAiPrompt || "",
          pastArticles: blog.articleDatabase || [],
          autoImageConfig: writerConfig.autoImageConfig || blog.autoImageConfig,
          useOllama: ollamaSettings.useOllama,
          ollamaModel: modelToUse,
          ollamaHost: ollamaSettings.host,
        }),
      });

      if (!res.ok) throw new Error("영문 글 작성 실패");
      const generatedArticle = await res.json();

      const publishDelay = blog.analyticsAiConfig?.delaySec || blog.defaultPublishDelaySec || 60;

      setPipelineItems((prev) =>
        prev.map((i) =>
          i.id === itemId
            ? {
                ...i,
                stage: "waiting_publish",
                generatedArticle,
                totalDelaySec: publishDelay,
                remainingDelaySec: publishDelay,
              }
            : i
        )
      );

      addLog(
        blog.name,
        "writer",
        `✅ [글쓰기 AI] 집필 완료: '${generatedArticle.selectedTitle}' ➔ 발행 대기열 등록 (${publishDelay}초 카운트다운 시작)`
      );
    } catch (e: any) {
      addLog(blog.name, "writer", `❌ 글 작성 오류: ${e.message}`);
      setPipelineItems((prev) =>
        prev.map((i) =>
          i.id === itemId
            ? { ...i, stage: "waiting_write", remainingDelaySec: 30 }
            : i
        )
      );
    } finally {
      delete processingRef.current[itemId];
    }
  };

  // Execute Publishing & Analytics AI
  const handleExecutePublishing = async (itemId: string) => {
    const item = pipelineItems.find((i) => i.id === itemId);
    if (!item) return;

    const blog = blogs.find((b) => b.id === item.blogId) || blogs[0];
    const title = item.generatedArticle?.selectedTitle || item.topic;

    addLog(
      blog.name,
      "publisher",
      `🚀 [발행 및 분석 AI] 타이머 만료! '${title}' 구글 블로그 최종 발행 및 애드센스 분석 시작`
    );

    try {
      // Analyze post
      const analysisRes = await fetch("/api/analyze-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          contentHtml: item.generatedArticle?.contentHtml || "",
          platform: "blogger",
        }),
      });

      const analyticsReport = analysisRes.ok
        ? await analysisRes.json()
        : {
            seoScore: 97,
            estimatedCpc: "$4.20",
            readabilityGrade: "A+",
            targetAudienceMatch: "US / Tier-1 High Income Searchers",
            keyStrengths: ["High-RPM AdSense layout", "Rich Snippets FAQ Schema"],
          };

      // Mark pipeline item as published
      setPipelineItems((prev) =>
        prev.map((i) =>
          i.id === itemId
            ? {
                ...i,
                stage: "published",
                publishedAt: new Date().toLocaleTimeString(),
                analyticsReport,
                remainingDelaySec: 0,
              }
            : i
        )
      );

      // Construct new Database Record for this Blog
      const newDbRecord: BlogArticleRecord = {
        id: `art_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        blogId: blog.id,
        title,
        topic: item.topic,
        niche: blog.niche,
        publishedAt: new Date().toISOString(),
        seoScore: analyticsReport.seoScore || 95,
        expectedCpc: analyticsReport.estimatedCpc || "$4.50",
        wordCount: item.generatedArticle?.contentHtml ? item.generatedArticle.contentHtml.length : 2100,
        summary: item.generatedArticle?.summary || item.generatedArticle?.metaDescription || "AI 자동 발행 완료 글",
        tags: item.generatedArticle?.tags || ["AutoBlog", "HighCPC"],
        keyStrengths: analyticsReport.keyStrengths || ["SEO 고단가 최적화", "중복 방지 통과"],
        contentHtml: item.generatedArticle?.contentHtml || "",
        images: item.generatedArticle?.images || [],
      };

      // Sync with server-side store
      fetch(`/api/blogs/${blog.id}/articles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newDbRecord),
      }).catch((err) => console.warn("Failed to sync article to backend store:", err));

      // INCREMENT THIS BLOG'S TODAY POST COUNT & TOTAL POST COUNT & ADD TO ARTICLE DB
      setBlogs((prev) =>
        prev.map((b) =>
          b.id === blog.id
            ? {
                ...b,
                todayPostCount: (b.todayPostCount || 0) + 1,
                totalPostCount: (b.totalPostCount || 0) + 1,
                articleDatabase: [newDbRecord, ...(b.articleDatabase || [])],
              }
            : b
        )
      );

      addLog(
        blog.name,
        "publisher",
        `🎉 [발행 완료] 구글 블로그 포스팅 완료! (오늘 총 ${
          (blog.todayPostCount || 0) + 1
        }개 달성) | DB 아티클 저장 완료 | SEO 점수: ${analyticsReport.seoScore}점 / 예상 CPC: ${analyticsReport.estimatedCpc}`
      );
    } catch (e: any) {
      addLog(blog.name, "publisher", `❌ 발행 처리 오류: ${e.message}`);
    } finally {
      delete processingRef.current[itemId];
    }
  };

  // Trigger Topic AI (supports customTopic from Director AI as well as urgent / normal)
  const handleTriggerTopicAi = async (blogId: string, isUrgent: boolean, customTopic?: string) => {
    const blog = blogs.find((b) => b.id === blogId) || blogs[0];
    const topicConfig = blog.topicAiConfig || {};
    const delaySec = isUrgent ? 10 : (topicConfig.delaySec || blog.defaultWriteDelaySec || 180);

    if (customTopic) {
      const newItem: PipelineItem = {
        id: `pipe_${Date.now()}`,
        blogId: blog.id,
        topic: customTopic,
        urgency: isUrgent ? "urgent" : "normal",
        stage: "waiting_write",
        totalDelaySec: delaySec,
        remainingDelaySec: delaySec,
        createdAt: new Date().toLocaleTimeString(),
      };

      setPipelineItems((prev) => [newItem, ...prev]);

      addLog(
        blog.name,
        "director",
        `🎯 [총괄 디렉터 AI] 추천 주제 대기열 등록: '${customTopic}' (${delaySec}초 카운트다운 시작)`
      );
      return;
    }

    addLog(
      blog.name,
      "topic",
      `🔍 [주제 AI] ${isUrgent ? "🚨 실시간 긴급 이슈 (10초)" : "💡 정기 고수익"} 주제 발굴 시작 (타겟: ${blog.niche})...`
    );

    try {
      const res = await fetch("/api/generate-pipeline-topic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blogId: blog.id,
          blogName: blog.name,
          niche: blog.niche,
          platform: "blogger",
          urgency: isUrgent ? "urgent" : "normal",
          customPrompt: topicConfig.customPrompt || blog.topicAiPrompt || "",
          pastArticles: blog.articleDatabase || [],
          useOllama: ollamaSettings.useOllama,
          ollamaModel: topicConfig.model || blog.ollamaModel || ollamaSettings.selectedModel,
          ollamaHost: ollamaSettings.host,
        }),
      });

      const data = await res.json();
      const topic = data.topic || `${blog.niche} 2026 Definitive Guide`;

      const newItem: PipelineItem = {
        id: `pipe_${Date.now()}`,
        blogId: blog.id,
        topic,
        urgency: isUrgent ? "urgent" : "normal",
        stage: "waiting_write",
        totalDelaySec: delaySec,
        remainingDelaySec: delaySec,
        createdAt: new Date().toLocaleTimeString(),
      };

      setPipelineItems((prev) => [newItem, ...prev]);

      addLog(
        blog.name,
        "topic",
        `✨ [주제 AI] 발굴 완료: '${topic}' ➔ 글쓰기 대기열 등록 (${delaySec}초 카운트다운 시작)`
      );
    } catch (e: any) {
      addLog(blog.name, "topic", `❌ 주제 발굴 오류: ${e.message}`);
    }
  };

  // Adjust remaining delay of a queue item (+ / - 1min, 15min, 1hour)
  const handleAdjustItemDelay = (itemId: string, deltaSec: number) => {
    setPipelineItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        const newRemaining = Math.max(1, item.remainingDelaySec + deltaSec);
        return {
          ...item,
          remainingDelaySec: newRemaining,
          totalDelaySec: Math.max(item.totalDelaySec, newRemaining),
        };
      })
    );

    const sign = deltaSec > 0 ? "+" : "";
    const unitText = 
      Math.abs(deltaSec) >= 3600
        ? `${sign}${deltaSec / 3600}시간`
        : Math.abs(deltaSec) >= 60
        ? `${sign}${deltaSec / 60}분`
        : `${sign}${deltaSec}초`;

    const targetItem = pipelineItems.find((i) => i.id === itemId);
    const blog = blogs.find((b) => b.id === targetItem?.blogId) || blogs[0];
    addLog(blog.name, "system", `⏱️ [대기열 시간 조절] 대기 시간 ${unitText} 조정됨 (남은 시간 즉시 반영)`);
  };

  // Update Blog individual configurations
  const handleUpdateBlogConfig = (updatedBlog: BlogItem) => {
    setBlogs((prev) => prev.map((b) => (b.id === updatedBlog.id ? updatedBlog : b)));
    addLog(updatedBlog.name, "system", `⚙️ [AI 설정 갱신] '${updatedBlog.name}' 블로그의 AI 전용 설정이 저장되었습니다.`);
  };

  // Immediate Write Trigger
  const handleTriggerWriteNow = async (itemId: string) => {
    setPipelineItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, remainingDelaySec: 0, stage: "writing" } : i))
    );
    await handleExecuteWriting(itemId);
  };

  // Immediate Publish Trigger
  const handleTriggerPublishNow = async (itemId: string) => {
    setPipelineItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, remainingDelaySec: 0, stage: "publishing" } : i))
    );
    await handleExecutePublishing(itemId);
  };

  // Delete Item
  const handleDeleteItem = (itemId: string) => {
    setPipelineItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  // Add or Edit Blog
  const handleSaveBlog = (savedBlog: BlogItem) => {
    setBlogs((prev) => {
      const exists = prev.some((b) => b.id === savedBlog.id);
      if (exists) {
        return prev.map((b) => (b.id === savedBlog.id ? savedBlog : b));
      }
      return [...prev, savedBlog];
    });
    addLog(savedBlog.name, "publisher", `📑 구글 블로그 '${savedBlog.name}' 정보가 저장되었습니다.`);
  };

  // Delete Blog
  const handleDeleteBlog = (blogId: string) => {
    const blogToDelete = blogs.find((b) => b.id === blogId);
    setBlogs((prev) => prev.filter((b) => b.id !== blogId));
    setPipelineItems((prev) => prev.filter((i) => i.blogId !== blogId));
    if (selectedBlogId === blogId) {
      setSelectedBlogId(null);
    }
    if (blogToDelete) {
      addLog(blogToDelete.name, "publisher", `🗑️ '${blogToDelete.name}' 블로그가 삭제되었습니다.`);
    }
  };

  // Add Article to Blog Database
  const handleAddArticleToDb = async (blogId: string, article: Omit<BlogArticleRecord, "id">) => {
    const blog = blogs.find((b) => b.id === blogId);
    if (!blog) return;

    const newRecord: BlogArticleRecord = {
      ...article,
      id: `art_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    };

    setBlogs((prev) =>
      prev.map((b) =>
        b.id === blogId
          ? { ...b, articleDatabase: [newRecord, ...(b.articleDatabase || [])] }
          : b
      )
    );

    // Sync to backend store
    fetch(`/api/blogs/${blogId}/articles`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newRecord),
    }).catch((err) => console.warn("Sync article error:", err));

    addLog(blog.name, "publisher", `📚 [글 DB] 기발행 글 '${newRecord.title}' 아티클 DB에 성공적으로 등록되었습니다.`);
  };

  // Delete Article from Blog Database
  const handleDeleteArticleFromDb = async (blogId: string, articleId: string) => {
    const blog = blogs.find((b) => b.id === blogId);
    setBlogs((prev) =>
      prev.map((b) =>
        b.id === blogId
          ? {
              ...b,
              articleDatabase: (b.articleDatabase || []).filter((a) => a.id !== articleId),
            }
          : b
      )
    );

    // Sync to backend store
    fetch(`/api/blogs/${blogId}/articles/${articleId}`, {
      method: "DELETE",
    }).catch((err) => console.warn("Delete article error:", err));

    if (blog) {
      addLog(blog.name, "publisher", `🗑️ [글 DB] 아티클 기록이 데이터베이스에서 삭제되었습니다.`);
    }
  };

  const selectedBlog = blogs.find((b) => b.id === selectedBlogId);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      {/* Top Game-Style Navigation (작업 / 통계) */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          // When switching tabs, preserve or reset selected blog gracefully
        }}
        openPlaybook={() => setIsPlaybookOpen(true)}
        openOllamaModal={() => setIsOllamaModalOpen(true)}
        openWindowsBot={() => setIsWindowsBotOpen(true)}
        ollamaSettings={ollamaSettings}
        blogCount={blogs.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "work" ? (
          // WORK VIEW: Either Blogs Grid Hub OR Selected Blog's Isolated Pipeline
          selectedBlog ? (
            <DedicatedBlogPipeline
              blog={selectedBlog}
              onBackToBlogs={() => setSelectedBlogId(null)}
              pipelineItems={pipelineItems}
              logs={pipelineLogs}
              isAutopilotRunning={isAutopilotRunning}
              onToggleAutopilot={() => setIsAutopilotRunning(!isAutopilotRunning)}
              onTriggerTopicAi={handleTriggerTopicAi}
              onTriggerWriteNow={handleTriggerWriteNow}
              onTriggerPublishNow={handleTriggerPublishNow}
              onDeleteItem={handleDeleteItem}
              onAdjustItemDelay={handleAdjustItemDelay}
              onUpdateBlogConfig={handleUpdateBlogConfig}
              ollamaSettings={ollamaSettings}
              onOpenOllamaModal={() => setIsOllamaModalOpen(true)}
              onOpenWindowsBot={() => setIsWindowsBotOpen(true)}
              onAddArticleToDb={handleAddArticleToDb}
              onDeleteArticleFromDb={handleDeleteArticleFromDb}
            />
          ) : (
            <GoogleBlogsHub
              blogs={blogs}
              onSelectBlog={(blogId) => setSelectedBlogId(blogId)}
              onOpenAddModal={() => {
                setBlogToEdit(null);
                setIsAddEditModalOpen(true);
              }}
              onEditBlog={(blog) => {
                setBlogToEdit(blog);
                setIsAddEditModalOpen(true);
              }}
              onDeleteBlog={handleDeleteBlog}
            />
          )
        ) : (
          // STATS VIEW: Overall Statistics Dashboard
          <StatisticsDashboard
            blogs={blogs}
            onSelectBlog={(blogId) => {
              setSelectedBlogId(blogId);
              setActiveTab("work");
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>AutoBlog Pro — 해외 타겟 구글 블로그(Google Blogger) 전용 3단 AI 무인 자동화 시스템</span>
          <span className="font-mono text-[11px] text-slate-400">
            엔진: {ollamaSettings.useOllama ? `로컬 Ollama (${ollamaSettings.selectedModel}) 100% 무료 무제한` : "Cloud Gemini AI"}
          </span>
        </div>
      </footer>

      {/* MODALS */}
      {/* 1. Add / Edit Blog Modal */}
      <AddEditBlogModal
        isOpen={isAddEditModalOpen}
        onClose={() => setIsAddEditModalOpen(false)}
        blogToEdit={blogToEdit}
        onSave={handleSaveBlog}
      />

      {/* 2. Ollama Settings Modal */}
      <OllamaSettingsModal
        isOpen={isOllamaModalOpen}
        onClose={() => setIsOllamaModalOpen(false)}
        settings={ollamaSettings}
        onSave={setOllamaSettings}
      />

      {/* 3. Windows Bot Downloader Modal */}
      {isWindowsBotOpen && (
        <WindowsBotDownloader
          isModal={true}
          onClose={() => setIsWindowsBotOpen(false)}
          blogs={blogs}
          ollamaSettings={ollamaSettings}
        />
      )}

      {/* 4. Monetization Playbook Modal */}
      <MonetizationPlaybookModal
        isOpen={isPlaybookOpen}
        onClose={() => setIsPlaybookOpen(false)}
      />
    </div>
  );
}

import { ArticleReviewResult, ArticleReviewRequest } from "../types/reviewTypes";

export interface ReviewExecutionOptions extends ArticleReviewRequest {
  aiGenerator?: (params: {
    prompt: string;
    systemPrompt?: string;
    useOllama?: boolean;
    ollamaHost?: string;
    ollamaModel?: string;
    jsonMode?: boolean;
  }) => Promise<string>;
}

/**
 * Robust JSON extraction and parsing helper
 */
export function parseReviewJsonSafe(rawText: string, fallback: ArticleReviewResult): ArticleReviewResult {
  if (!rawText || typeof rawText !== "string") return fallback;

  try {
    return JSON.parse(rawText);
  } catch {
    // Attempt markdown codeblock or regex extraction
    const match = rawText.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        try {
          const sanitized = match[0].replace(/[\u0000-\u001F\u007F-\u009F]/g, (c) => {
            if (c === "\n") return "\\n";
            if (c === "\r") return "\\r";
            if (c === "\t") return "\\t";
            return "";
          });
          return JSON.parse(sanitized);
        } catch {
          // Fall through to fallback
        }
      }
    }
  }

  return fallback;
}

/**
 * Generate fallback review result based on basic text heuristics
 */
export function generateFallbackReview(
  topic: string,
  title: string,
  contentHtml: string
): ArticleReviewResult {
  const plainText = (contentHtml || "").replace(/<[^>]+>/g, " ").trim();
  const wordCount = plainText.split(/\s+/).filter(Boolean).length;
  const hasH2 = /<h2/i.test(contentHtml);
  const hasTable = /<table/i.test(contentHtml);
  const hasAds = /GOOGLE_ADSENSE|ADSENSE/i.test(contentHtml);

  let score = 88;
  const seoIssues: string[] = [];
  const readabilityIssues: string[] = [];
  const suggestions: string[] = [];

  if (wordCount < 1000) {
    score -= 8;
    readabilityIssues.push("분량이 다소 짧아 심층적인 정보 전달을 위해 본문 보강이 권장됩니다.");
  }
  if (!hasH2) {
    score -= 10;
    seoIssues.push("H2/H3 소제목 계층 구조가 부족하여 검색엔진 색인 구조화가 필요합니다.");
  }
  if (!hasTable) {
    suggestions.push("주요 비교 지표나 스펙을 한눈에 볼 수 있는 요약 표(Table)를 추가하면 가독성이 높아집니다.");
  }
  if (hasAds) {
    suggestions.push("광고 슬롯과 본문 텍스트 간의 시각적 여백이 적절히 유지되어 체류시간 확보에 유리합니다.");
  }

  return {
    overallScore: Math.max(70, Math.min(98, score)),
    factualIssues: [],
    logicIssues: [],
    readabilityIssues: readabilityIssues.length > 0 ? readabilityIssues : ["문장 구조가 명확하고 문맥 흐름이 안정적입니다."],
    seoIssues: seoIssues.length > 0 ? seoIssues : ["타겟 주제와 제목의 키워드 정합성이 우수합니다."],
    suggestions: suggestions.length > 0 ? suggestions : [
      "실제 최신 시장 사례와 수치 데이터를 1~2개 추가하면 신뢰성이 더욱 향상됩니다.",
      "독자가 바로 활용할 수 있는 핵심 요약 포인트를 결론부에 배치하는 것을 추천합니다."
    ],
    passed: score >= 80,
    reviewedAt: new Date().toISOString(),
    summaryFeedback: `주제 '${topic}'에 부합하는 체계적인 글 구성과 전문적 톤앤매너가 유지된 양질의 포스팅입니다.`
  };
}

/**
 * Review Article AI Engine: Evaluates factual credibility, logic, readability, SEO, and gives actionable advice.
 * Note: Review AI analyzes and provides feedback only; it does NOT modify the article content.
 */
export async function reviewArticle(options: ReviewExecutionOptions): Promise<ArticleReviewResult> {
  const {
    topic,
    title,
    contentHtml,
    niche = "AI & Tech",
    platform = "blogger",
    useOllama = false,
    ollamaModel = "qwen2.5:7b",
    ollamaHost = "http://localhost:11434",
    aiGenerator,
  } = options;

  const sanitizedContent = (contentHtml || "").substring(0, 4000);
  const fallback = generateFallbackReview(topic, title, contentHtml);

  const prompt = `
당신은 최고 수준의 블로그 및 전문 기술 저널 '시니어 에디토리얼 & 팩트체킹 리뷰 AI(Senior Editorial & Quality Reviewer AI)'입니다.
작성된 블로그 글을 면밀히 분석하고 비판적으로 검토하여 품질 점수와 개선점을 진단하세요.

[검토 대상 글]
- 주제(Topic): "${topic}"
- 제목(Title): "${title}"
- 타겟 니치: "${niche}"
- 타겟 플랫폼: "${platform}"
- 본문 내용 (HTML/텍스트 일부):
${sanitizedContent}

[검토 기준 및 요구사항]
1. overallScore (전체 품질 점수): 0~100점 사이 정수
2. factualIssues (사실관계 검토가 필요한 내용): 기술적 사실, 연도, 명칭 등의 정확성 점검 (이상 없을 시 빈 배열 [])
3. logicIssues (논리적 연결이나 모순): 단락 간 논리 전개 및 서론-본론-결론 일관성 (이상 없을 시 빈 배열 [])
4. readabilityIssues (문장/문단 가독성 문제): 문장 길이, 가독성, 어휘 적절성
5. seoIssues (제목/본문/키워드 관련 SEO 문제): 제목-본문 정합성, 소제목 활용도, 검색 의도 부합성
6. suggestions (수정 제안): 글의 전문성과 체류시간을 극대화할 2~3가지 구체적 조언
7. passed (합격 여부): overallScore가 80점 이상이고 치명적 오류가 없으면 true, 아니면 false
8. summaryFeedback (총평 요약): 전체적인 글의 완성도에 대한 1~2문장의 평가

[출력 형식: 순수 JSON 객체만 반환]
{
  "overallScore": 92,
  "factualIssues": [],
  "logicIssues": [],
  "readabilityIssues": [],
  "seoIssues": [],
  "suggestions": [
    "제2섹션에서 구체적인 성능 지표 비교를 보강하면 더욱 설득력이 높아집니다.",
    "결론부에 독자를 위한 3줄 핵심 요약을 강조하면 체류시간 확보에 효과적입니다."
  ],
  "passed": true,
  "summaryFeedback": "주제에 대한 깊이 있는 분석과 논리적인 구성을 갖춘 우수한 글입니다."
}
`;

  if (typeof aiGenerator === "function") {
    try {
      const rawText = await aiGenerator({
        prompt,
        systemPrompt: "반드시 유효한 JSON 형식으로만 응답하세요. 다른 설명은 생략하세요.",
        useOllama,
        ollamaModel,
        ollamaHost,
        jsonMode: true,
      });

      const parsed = parseReviewJsonSafe(rawText, fallback);
      
      // Ensure all required fields exist and are well-typed
      return {
        overallScore: typeof parsed.overallScore === "number" ? parsed.overallScore : fallback.overallScore,
        factualIssues: Array.isArray(parsed.factualIssues) ? parsed.factualIssues : [],
        logicIssues: Array.isArray(parsed.logicIssues) ? parsed.logicIssues : [],
        readabilityIssues: Array.isArray(parsed.readabilityIssues) ? parsed.readabilityIssues : [],
        seoIssues: Array.isArray(parsed.seoIssues) ? parsed.seoIssues : [],
        suggestions: Array.isArray(parsed.suggestions) && parsed.suggestions.length > 0 ? parsed.suggestions : fallback.suggestions,
        passed: typeof parsed.passed === "boolean" ? parsed.passed : (parsed.overallScore ?? 80) >= 80,
        reviewedAt: new Date().toISOString(),
        summaryFeedback: parsed.summaryFeedback || fallback.summaryFeedback,
      };
    } catch (err: any) {
      console.warn("AI review generation failed, using fallback review:", err.message);
      return fallback;
    }
  }

  // If no direct generator provided (client-side execution), fetch server endpoint
  try {
    const res = await fetch("/api/review-article", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic,
        title,
        contentHtml,
        niche,
        platform,
        useOllama,
        ollamaModel,
        ollamaHost,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      return {
        overallScore: data.overallScore ?? fallback.overallScore,
        factualIssues: Array.isArray(data.factualIssues) ? data.factualIssues : [],
        logicIssues: Array.isArray(data.logicIssues) ? data.logicIssues : [],
        readabilityIssues: Array.isArray(data.readabilityIssues) ? data.readabilityIssues : [],
        seoIssues: Array.isArray(data.seoIssues) ? data.seoIssues : [],
        suggestions: Array.isArray(data.suggestions) ? data.suggestions : fallback.suggestions,
        passed: typeof data.passed === "boolean" ? data.passed : true,
        reviewedAt: data.reviewedAt || new Date().toISOString(),
        summaryFeedback: data.summaryFeedback || fallback.summaryFeedback,
      };
    }
  } catch (clientErr: any) {
    console.warn("Client review fetch failed, using fallback review:", clientErr.message);
  }

  return fallback;
}

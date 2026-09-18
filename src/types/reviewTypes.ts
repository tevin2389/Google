// Types for Article Review & Editorial Advisor AI

export interface ArticleReviewResult {
  overallScore: number;          // 전체 품질 점수 (0-100)
  factualIssues: string[];       // 사실관계 검토가 필요한 내용
  logicIssues: string[];         // 논리적 연결이나 모순
  readabilityIssues: string[];   // 문장/문단 가독성 문제
  seoIssues: string[];           // 제목/본문/키워드 관련 SEO 문제
  suggestions: string[];         // 수정 제안
  passed: boolean;               // 추가 수정이 필요한지 여부 (합격 기준 통과 여부)
  reviewedAt?: string;           // 리뷰 완료 일시
  summaryFeedback?: string;      // 총평 요약
}

export interface ArticleReviewRequest {
  topic: string;
  title: string;
  contentHtml: string;
  niche?: string;
  platform?: string;
  useOllama?: boolean;
  ollamaModel?: string;
  ollamaHost?: string;
}

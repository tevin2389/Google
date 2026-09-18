// Image types and interfaces for Automatic AI Image Insertion System

export interface ArticleImageRecord {
  id: string;
  articleId?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  sourceUrl: string;
  sourceName: string;
  license: string;
  licenseUrl?: string;
  searchKeyword: string;
  position: string;
  altText: string;
  caption: string;
  selected?: boolean;
  width?: number;
  height?: number;
  createdAt: string;
}

export interface ImageSearchCandidate {
  id: string;
  title: string;
  imageUrl: string;
  thumbnailUrl: string;
  sourceUrl: string;
  sourceName: string;
  license: string;
  licenseUrl?: string;
  width?: number;
  height?: number;
  searchKeyword: string;
  provider: "wikimedia" | "openverse" | "unsplash" | "custom";
}

export interface ImageNeedDecision {
  need_images: boolean;
  reason?: string;
  images: Array<{
    keyword: string;
    purpose: string;
    position: "intro" | "middle_section" | "conclusion" | string;
    suggestedAlt?: string;
  }>;
}

export interface ImageSelectionDecision {
  selectedCandidateId: string;
  position: string;
  caption: string;
  alt: string;
  reason: string;
}

export interface ImageReviewAudit {
  isApproved: boolean;
  score: number;
  checks: {
    relevance: boolean;
    excessiveCount: boolean;
    duplicateDetected: boolean;
    altQuality: boolean;
    captionQuality: boolean;
    attributionPresent: boolean;
    urlIntegrity: boolean;
  };
  comments: string[];
  suggestedAction?: "keep" | "replace" | "omit";
}

export interface AutoImageConfig {
  enabled: boolean;
  minImages: number;
  defaultImages: number;
  maxImages: number;
  provider: "all" | "wikimedia" | "openverse" | "unsplash";
  requireLicenseCheck: boolean;
  quality: "standard" | "high";
}

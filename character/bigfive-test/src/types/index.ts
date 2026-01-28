export interface Question {
  number: number;
  text: string;
}

export interface Answer {
  questionNumber: number;
  score: number; // 1-5
}

export interface Facet {
  name: string;
  nameEn: string;
  questions: number[];
}

export interface Dimension {
  name: string;
  nameEn: string;
  description: string;
  facets: Record<string, Facet>;
}

export interface ScoringConfig {
  dimensions: Record<string, Dimension>;
  reverseScored: number[];
  likertScale: Record<string, string>;
  norms: {
    male: Record<string, { mean: number; sd: number }>;
    female: Record<string, { mean: number; sd: number }>;
  };
}

export interface FacetScore {
  facetId: string;
  facetName: string;
  facetNameEn: string;
  rawScore: number;
  questions: number[];
}

export interface DimensionScore {
  dimensionId: string;
  dimensionName: string;
  dimensionNameEn: string;
  rawScore: number;
  percentile: number;
  tScore: number;
  level: 'low' | 'average' | 'high';
  facetScores: FacetScore[];
}

export interface TestResult {
  answers: Answer[];
  dimensionScores: DimensionScore[];
  completedAt: Date;
  gender?: 'male' | 'female';
}

export type TestView = 'intro' | 'test' | 'results';

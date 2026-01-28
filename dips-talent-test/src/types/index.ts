export interface Question {
  number: number;
  text: string;
  dimensionId: string;
}

export interface Answer {
  questionNumber: number;
  score: number; // 1-5
}

export interface DimensionScore {
  dimensionId: string;
  dimensionName: string;
  dimensionNameEn: string;
  rawScore: number;       // Sum of 4 questions, range 4-20
  percentage: number;     // (rawScore - 4) / 16 * 100, normalized 0-100%
  level: 'low' | 'average' | 'high' | 'very_high';
  isTopTalent: boolean;
}

export interface TestResult {
  answers: Answer[];
  dimensionScores: DimensionScore[];
  topTalents: DimensionScore[];
  completedAt: Date;
}

export type TestView = 'intro' | 'test' | 'results';

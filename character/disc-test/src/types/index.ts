export interface Question {
  number: number;
  text: string;
  dimensionId: string;
}

export interface Answer {
  questionNumber: number;
  score: number;
}

export interface DimensionScore {
  dimensionId: string;
  dimensionName: string;
  dimensionNameEn: string;
  rawScore: number;
  percentage: number;
  level: 'low' | 'average' | 'high' | 'very_high';
  isPrimary: boolean;
  isSecondary: boolean;
}

export interface TestResult {
  answers: Answer[];
  dimensionScores: DimensionScore[];
  primaryStyle: string;
  secondaryStyle: string;
  discPattern: string;
  completedAt: Date;
}

export type TestView = 'intro' | 'test' | 'results';

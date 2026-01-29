export interface Question {
  number: number;
  text: string;
  factorId: string; // A-Q2 representing 16 factors
  isReverse: boolean; // true if reverse-scored item
}

export interface Answer {
  questionNumber: number;
  score: number; // 1-5
}

export interface FactorScore {
  factorId: string;
  factorName: string;
  factorNameEn: string;
  rawScore: number; // sum of answers for this factor
  stenScore: number; // 1-10 standardized sten score
  lowLabel: string; // description of low pole
  highLabel: string; // description of high pole
  percentage: number; // normalized percentage for visualization
  level: 'low' | 'average' | 'high';
}

export interface TestResult {
  answers: Answer[];
  factorScores: FactorScore[];
  completedAt: Date;
}

export type TestView = 'intro' | 'test' | 'results';

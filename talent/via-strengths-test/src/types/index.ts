export interface Question {
  number: number;
  text: string;
  strengthId: string; // e.g., "curiosity", "love_of_learning", etc.
}

export interface Answer {
  question: number;
  value: number; // 1-5
}

export interface StrengthScore {
  strengthId: string; // e.g., "curiosity", "love_of_learning", etc.
  strengthName: string;
  strengthNameEn: string;
  virtue: string; // One of 6 virtues
  rawScore: number; // 5-25 (5 questions × 1-5 score)
  percentage: number; // normalized percentage (0-100)
  rank: number; // 1-24 (1 = highest score)
  isSignature: boolean; // true if in top 5
}

export interface TestResult {
  answers: Answer[];
  strengthScores: StrengthScore[]; // sorted by rank
  signatureStrengths: StrengthScore[]; // top 5
  completedAt: Date;
}

export type TestView = 'intro' | 'test' | 'results';

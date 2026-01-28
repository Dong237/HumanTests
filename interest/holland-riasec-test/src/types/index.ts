export interface Question {
  number: number;
  text: string;
  typeId: string; // 'R', 'I', 'A', 'S', 'E', 'C'
}

export interface Answer {
  questionNumber: number;
  score: number; // 1-5
}

export interface TypeScore {
  typeId: string;
  typeName: string;
  typeNameEn: string;
  rawScore: number;       // Sum of 10 questions, range 10-50
  percentage: number;     // (rawScore - 10) / 40 * 100
  level: 'low' | 'average' | 'high' | 'very_high';
  isTopInterest: boolean;
}

export interface TestResult {
  answers: Answer[];
  typeScores: TypeScore[];
  hollandCode: string;    // Top 3 type IDs, e.g. "RIA"
  completedAt: Date;
}

export type TestView = 'intro' | 'test' | 'results';

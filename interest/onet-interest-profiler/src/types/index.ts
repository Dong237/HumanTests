export interface Question {
  number: number;
  text: string;
  typeId: string; // 'R' | 'I' | 'A' | 'S' | 'E' | 'C'
}

export interface Answer {
  questionNumber: number;
  score: number; // 0-4
}

export interface TypeScore {
  typeId: string;
  typeName: string;
  typeNameEn: string;
  rawScore: number;       // Sum of 10 questions, range 0-40
  percentage: number;     // rawScore / 40 * 100
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

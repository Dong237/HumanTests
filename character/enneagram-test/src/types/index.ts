export interface Question {
  number: number;
  text: string;
  typeId: number; // 1-9 representing Enneagram types
}

export interface Answer {
  questionNumber: number;
  score: number; // 1-5
}

export interface TypeScore {
  typeId: number;
  typeName: string;
  typeNameEn: string;
  triad: 'heart' | 'head' | 'gut'; // emotional center
  rawScore: number; // 10-50 (10 questions × 1-5 score)
  percentage: number; // normalized percentage
  level: 'low' | 'average' | 'high' | 'very_high';
  isPrimary: boolean;
  wing?: string; // e.g., "3" or "5" for type 4
}

export interface TestResult {
  answers: Answer[];
  typeScores: TypeScore[];
  primaryType: number; // 1-9
  wing: number | null; // adjacent type with higher score
  enneagramCode: string; // e.g., "4w5", "9w1"
  triad: 'heart' | 'head' | 'gut';
  completedAt: Date;
}

export type TestView = 'intro' | 'test' | 'results';

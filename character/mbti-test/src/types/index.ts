export interface Question {
  number: number;
  text: string;
  dichotomy: string; // "EI", "SN", "TF", "JP"
  direction: string; // "E", "I", "S", "N", "T", "F", "J", "P"
}

export interface Answer {
  questionNumber: number;
  score: number; // 1-5
}

export interface DichotomyScore {
  dichotomy: string; // "EI", "SN", "TF", "JP"
  dichotomyName: string;
  dichotomyNameEn: string;
  firstPole: string; // "E", "S", "T", "J"
  secondPole: string; // "I", "N", "F", "P"
  firstPoleScore: number; // 0-100
  secondPoleScore: number; // 0-100
  preference: string; // which pole is preferred
  clarity: 'very_clear' | 'clear' | 'moderate' | 'slight'; // preference strength
}

export interface TestResult {
  answers: Answer[];
  dichotomyScores: DichotomyScore[];
  typeCode: string; // "INTJ", "ENFP", etc.
  completedAt: Date;
}

export type TestView = 'intro' | 'test' | 'results';

import type { Answer, DichotomyScore } from '../types';
import scoringConfig from '../data/mbti-scoring.json';
import questions from '../data/mbti-questions.json';

function getClarityLevel(percentage: number): 'very_clear' | 'clear' | 'moderate' | 'slight' {
  if (percentage >= 70) return 'very_clear';
  if (percentage >= 60) return 'clear';
  if (percentage >= 55) return 'moderate';
  return 'slight';
}

export function calculateScores(answers: Answer[]): {
  dichotomyScores: DichotomyScore[],
  typeCode: string
} {
  const answerMap = new Map(answers.map(a => [a.questionNumber, a.score]));

  // Initialize scores for each pole
  const poleScores: Record<string, number> = {
    E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0
  };

  // Calculate raw scores
  questions.questions.forEach(q => {
    const answer = answerMap.get(q.number);
    if (answer !== undefined) {
      // Score contribution: 0-4 (answer - 1)
      const contribution = answer - 1;
      poleScores[q.direction] += contribution;
    }
  });

  // Build dichotomy scores
  const dichotomyScores: DichotomyScore[] = [];
  const typeLetters: string[] = [];

  const dichotomyList = ['EI', 'SN', 'TF', 'JP'];

  dichotomyList.forEach(dichotomy => {
    const config = (scoringConfig.dichotomies as any)[dichotomy];
    const firstPole = dichotomy[0];
    const secondPole = dichotomy[1];

    const firstScore = poleScores[firstPole];
    const secondScore = poleScores[secondPole];
    const total = firstScore + secondScore;

    const firstPercentage = total > 0 ? Math.round((firstScore / total) * 100) : 50;
    const secondPercentage = 100 - firstPercentage;

    const preference = firstPercentage >= 50 ? firstPole : secondPole;
    const strongerPercentage = Math.max(firstPercentage, secondPercentage);

    dichotomyScores.push({
      dichotomy,
      dichotomyName: config.name,
      dichotomyNameEn: config.nameEn,
      firstPole,
      secondPole,
      firstPoleScore: firstPercentage,
      secondPoleScore: secondPercentage,
      preference,
      clarity: getClarityLevel(strongerPercentage),
    });

    typeLetters.push(preference);
  });

  const typeCode = typeLetters.join('');

  return { dichotomyScores, typeCode };
}

export function getClarityLabel(clarity: string): string {
  switch (clarity) {
    case 'very_clear': return '非常明确';
    case 'clear': return '明确';
    case 'moderate': return '中等';
    case 'slight': return '轻微';
    default: return '中等';
  }
}

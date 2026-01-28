import type { Answer, DimensionScore, FacetScore, ScoringConfig } from '../types';
import scoringConfig from '../data/bigfive-scoring.json';

const config = scoringConfig as ScoringConfig;

/**
 * Calculate the actual score for a question, handling reverse scoring
 */
function getActualScore(questionNumber: number, rawScore: number): number {
  if (config.reverseScored.includes(questionNumber)) {
    // Reverse score: 1→5, 2→4, 3→3, 4→2, 5→1
    return 6 - rawScore;
  }
  return rawScore;
}

/**
 * Calculate raw score for a facet
 */
function calculateFacetScore(
  facetQuestions: number[],
  answers: Answer[]
): number {
  const answerMap = new Map(answers.map(a => [a.questionNumber, a.score]));

  let total = 0;
  for (const qNum of facetQuestions) {
    const rawScore = answerMap.get(qNum);
    if (rawScore !== undefined) {
      total += getActualScore(qNum, rawScore);
    }
  }

  return total;
}

/**
 * Convert raw score to T-score using normative data
 */
function calculateTScore(
  rawScore: number,
  mean: number,
  sd: number
): number {
  // T-score formula: T = 50 + 10 * (X - M) / SD
  return Math.round(50 + 10 * (rawScore - mean) / sd);
}

/**
 * Convert T-score to percentile (approximate)
 */
function tScoreToPercentile(tScore: number): number {
  // Approximate conversion using normal distribution
  const z = (tScore - 50) / 10;

  // Simple approximation of cumulative normal distribution
  const percentile = 50 * (1 + erf(z / Math.sqrt(2)));

  return Math.round(Math.max(1, Math.min(99, percentile)));
}

/**
 * Error function approximation for normal distribution
 */
function erf(x: number): number {
  // Abramowitz and Stegun approximation
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x);

  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

  return sign * y;
}

/**
 * Determine score level based on T-score
 */
function getScoreLevel(tScore: number): 'low' | 'average' | 'high' {
  if (tScore < 45) return 'low';
  if (tScore > 55) return 'high';
  return 'average';
}

/**
 * Calculate all dimension and facet scores from answers
 */
export function calculateScores(
  answers: Answer[],
  gender: 'male' | 'female' = 'male'
): DimensionScore[] {
  const dimensionScores: DimensionScore[] = [];

  const norms = config.norms[gender];

  for (const [dimensionId, dimension] of Object.entries(config.dimensions)) {
    const facetScores: FacetScore[] = [];
    let dimensionRawScore = 0;

    // Calculate facet scores
    for (const [facetId, facet] of Object.entries(dimension.facets)) {
      const rawScore = calculateFacetScore(facet.questions, answers);
      dimensionRawScore += rawScore;

      facetScores.push({
        facetId,
        facetName: facet.name,
        facetNameEn: facet.nameEn,
        rawScore,
        questions: facet.questions,
      });
    }

    // Get normative data for this dimension
    const normData = norms[dimensionId];
    const tScore = calculateTScore(dimensionRawScore, normData.mean, normData.sd);
    const percentile = tScoreToPercentile(tScore);
    const level = getScoreLevel(tScore);

    dimensionScores.push({
      dimensionId,
      dimensionName: dimension.name,
      dimensionNameEn: dimension.nameEn,
      rawScore: dimensionRawScore,
      percentile,
      tScore,
      level,
      facetScores,
    });
  }

  return dimensionScores;
}

/**
 * Get interpretation text for a dimension based on score level
 */
export function getDimensionInterpretation(
  dimensionId: string,
  level: 'low' | 'average' | 'high'
): string {
  const interpretations: Record<string, Record<string, string>> = {
    N: {
      low: '您情绪稳定，很少感到焦虑或沮丧。在压力下能保持冷静，不容易被负面情绪困扰。',
      average: '您的情绪稳定性处于正常水平，偶尔会有一些焦虑或担忧，但总体上能够很好地管理自己的情绪。',
      high: '您可能较容易体验到负面情绪，如焦虑、愤怒或抑郁。在压力下可能感到不堪重负，建议学习一些情绪管理技巧。',
    },
    E: {
      low: '您更倾向于独处，喜欢安静的环境。您可能比较内向，不太寻求他人的陪伴，但这并不意味着您不友好。',
      average: '您在社交性方面处于平衡状态，既能享受与他人相处的时光，也珍惜独处的时间。',
      high: '您非常外向，喜欢与人交往，充满活力。您在社交场合如鱼得水，喜欢成为关注的焦点，追求刺激和新鲜感。',
    },
    O: {
      low: '您更喜欢传统和熟悉的事物，偏好实际和具体的思维方式。您可能对艺术和抽象概念兴趣不大。',
      average: '您对新事物保持适度的开放态度，在传统和创新之间找到平衡。',
      high: '您富有想象力和创造力，对新观念、艺术和各种体验持开放态度。您好奇心强，喜欢探索新的可能性。',
    },
    A: {
      low: '您在人际交往中更注重自己的利益，可能比较强硬和竞争。您倾向于质疑他人的动机。',
      average: '您在合作与竞争之间保持平衡，既能为他人着想，也会维护自己的利益。',
      high: '您富有同情心，乐于助人，信任他人。您重视和谐的人际关系，愿意为他人做出牺牲。',
    },
    C: {
      low: '您可能比较随性，不太在意计划和组织。您可能容易拖延，对细节不太关注。',
      average: '您在自律性方面处于正常水平，既有一定的组织性，也保持一定的灵活性。',
      high: '您非常有责任心和自律性，做事有条理，目标明确。您可靠、勤奋，追求卓越。',
    },
  };

  return interpretations[dimensionId]?.[level] || '';
}

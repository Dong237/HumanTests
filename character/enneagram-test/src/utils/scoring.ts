import type { Answer, TypeScore } from '../types';

// Type 1-9 triad mapping
const TRIAD_MAP: Record<number, 'heart' | 'head' | 'gut'> = {
  1: 'gut',   // The Reformer
  2: 'heart', // The Helper
  3: 'heart', // The Achiever
  4: 'heart', // The Individualist
  5: 'head',  // The Investigator
  6: 'head',  // The Loyalist
  7: 'head',  // The Enthusiast
  8: 'gut',   // The Challenger
  9: 'gut',   // The Peacemaker
};

// Adjacent types for wing calculation (circular: 9 -> 1)
function getAdjacentTypes(typeId: number): [number, number] {
  const prev = typeId === 1 ? 9 : typeId - 1;
  const next = typeId === 9 ? 1 : typeId + 1;
  return [prev, next];
}

function getScoreLevel(rawScore: number): 'low' | 'average' | 'high' | 'very_high' {
  // Score range 10-50 (10 questions × 1-5)
  // Thresholds: 40+ very_high, 32-39 high, 20-31 average, <20 low
  if (rawScore >= 40) return 'very_high';
  if (rawScore >= 32) return 'high';
  if (rawScore >= 20) return 'average';
  return 'low';
}

export function calculateScores(answers: Answer[], scoringConfig: any): {
  typeScores: TypeScore[],
  primaryType: number,
  wing: number | null,
  enneagramCode: string,
  triad: 'heart' | 'head' | 'gut'
} {
  const answerMap = new Map(answers.map(a => [a.questionNumber, a.score]));
  const typeScores: TypeScore[] = [];

  // Calculate raw scores for each type (1-9)
  for (let typeId = 1; typeId <= 9; typeId++) {
    const typeConfig = scoringConfig.types[typeId];
    let rawScore = 0;

    // Sum scores for all questions of this type
    for (const qNum of typeConfig.questions) {
      rawScore += answerMap.get(qNum) ?? 0;
    }

    // Calculate percentage: (rawScore - 10) / 40 * 100 (10 is min, 50 is max)
    const percentage = Math.round(((rawScore - 10) / 40) * 100);

    typeScores.push({
      typeId,
      typeName: typeConfig.name,
      typeNameEn: typeConfig.nameEn,
      triad: TRIAD_MAP[typeId],
      rawScore,
      percentage,
      level: getScoreLevel(rawScore),
      isPrimary: false,
    });
  }

  // Sort by score descending to determine primary type
  const sorted = [...typeScores].sort((a, b) => b.rawScore - a.rawScore);
  const primaryType = sorted[0].typeId;
  const primaryTriad = TRIAD_MAP[primaryType];

  // Determine wing: higher of two adjacent types
  const [adj1, adj2] = getAdjacentTypes(primaryType);
  const adj1Score = typeScores.find(t => t.typeId === adj1)!.rawScore;
  const adj2Score = typeScores.find(t => t.typeId === adj2)!.rawScore;
  const wing = adj1Score >= adj2Score ? adj1 : adj2;

  // Mark primary type
  typeScores.forEach(t => {
    t.isPrimary = t.typeId === primaryType;
    if (t.typeId === primaryType) {
      t.wing = wing.toString();
    }
  });

  const enneagramCode = `${primaryType}w${wing}`;

  return { typeScores, primaryType, wing, enneagramCode, triad: primaryTriad };
}

export function getLevelLabel(level: string): string {
  switch (level) {
    case 'very_high': return '非常突出';
    case 'high': return '较强';
    case 'average': return '中等';
    case 'low': return '较弱';
    default: return '中等';
  }
}

export function getTriadLabel(triad: 'heart' | 'head' | 'gut'): string {
  switch (triad) {
    case 'heart': return '情感中心';
    case 'head': return '思维中心';
    case 'gut': return '本能中心';
  }
}

export function getTriadDescription(triad: 'heart' | 'head' | 'gut'): string {
  switch (triad) {
    case 'heart':
      return '情感中心类型（2、3、4）关注形象、认可和人际关系，容易受到羞耻感的困扰。';
    case 'head':
      return '思维中心类型（5、6、7）关注安全、信息和可能性，容易受到恐惧感的困扰。';
    case 'gut':
      return '本能中心类型（8、9、1）关注行动、控制和正义，容易受到愤怒感的困扰。';
  }
}

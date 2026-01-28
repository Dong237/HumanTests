import type { Answer, DimensionScore } from '../types';
import scoringConfig from '../data/disc-scoring.json';

function getScoreLevel(rawScore: number): 'low' | 'average' | 'high' | 'very_high' {
  // Score range 7-35. Thresholds: 28+ very_high, 21-27 high, 14-20 average, <14 low
  if (rawScore >= 28) return 'very_high';
  if (rawScore >= 21) return 'high';
  if (rawScore >= 14) return 'average';
  return 'low';
}

export function calculateScores(answers: Answer[]): {
  dimensionScores: DimensionScore[],
  primaryStyle: string,
  secondaryStyle: string,
  discPattern: string
} {
  const answerMap = new Map(answers.map(a => [a.questionNumber, a.score]));
  const dimensionScores: DimensionScore[] = [];

  for (const [dimId, dimConfig] of Object.entries(scoringConfig.dimensions)) {
    let rawScore = 0;
    for (const qNum of (dimConfig as any).questions) {
      rawScore += answerMap.get(qNum) ?? 0;
    }

    // Percentage: (rawScore - 7) / 28 * 100 (7 is min, 35 is max)
    const percentage = Math.round(((rawScore - 7) / 28) * 100);

    dimensionScores.push({
      dimensionId: dimId,
      dimensionName: (dimConfig as any).name,
      dimensionNameEn: (dimConfig as any).nameEn,
      rawScore,
      percentage,
      level: getScoreLevel(rawScore),
      isPrimary: false,
      isSecondary: false,
    });
  }

  // Sort by score descending to determine primary and secondary
  const sorted = [...dimensionScores].sort((a, b) => b.rawScore - a.rawScore);

  // Mark primary and secondary
  const primaryId = sorted[0].dimensionId;
  const secondaryId = sorted[1].dimensionId;

  dimensionScores.forEach(d => {
    d.isPrimary = d.dimensionId === primaryId;
    d.isSecondary = d.dimensionId === secondaryId;
  });

  // DISC pattern = primary + secondary (e.g., "DI", "SC", "ID")
  const discPattern = primaryId + secondaryId;

  return { dimensionScores, primaryStyle: primaryId, secondaryStyle: secondaryId, discPattern };
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

export function getDimensionInterpretation(
  dimensionId: string,
  level: 'low' | 'average' | 'high' | 'very_high'
): string {
  const interpretations: Record<string, Record<string, string>> = {
    D: {
      low: '您在支配性方面表现较低，倾向于合作协商而非直接掌控，在团队中更愿意配合他人。',
      average: '您有适度的支配倾向，能在需要时展现果断和领导力，同时也能与他人协作。',
      high: '您有较强的支配倾向，善于做决策，喜欢掌控局面，注重效率和结果。',
      very_high: '您有非常强的支配倾向！果断自信，目标明确，天生具有领导力，善于在压力下做出决策。',
    },
    I: {
      low: '您在社交影响方面表现较低，更倾向于独立工作，不太依赖社交互动获取能量。',
      average: '您有适度的社交影响力，能在需要时展现热情和魅力，也能保持独立专注。',
      high: '您有较强的社交影响力，热情开朗，善于沟通，能够激励和感染身边的人。',
      very_high: '您有非常强的社交影响力！乐观积极，富有感染力，是天生的社交者和激励者。',
    },
    S: {
      low: '您在稳健性方面表现较低，喜欢变化和新鲜感，在快节奏环境中更自如。',
      average: '您有适度的稳健性，既能保持稳定可靠，又能在需要时适应变化。',
      high: '您有较强的稳健性，耐心可靠，善于倾听，注重团队和谐与人际关系。',
      very_high: '您有非常强的稳健性！忠诚稳重，是最值得信赖的伙伴，善于维护团队凝聚力。',
    },
    C: {
      low: '您在谨慎性方面表现较低，更关注大局而非细节，行动迅速，不过度分析。',
      average: '您有适度的谨慎性，既能关注重要细节，又不会过度纠结，较好地平衡质量和效率。',
      high: '您有较强的谨慎性，注重细节和精确，善于分析，追求高标准和品质。',
      very_high: '您有非常强的谨慎性！逻辑严谨，追求完美，是天生的分析者和品质守护者。',
    },
  };

  return interpretations[dimensionId]?.[level] || '';
}

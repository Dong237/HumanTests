import type { Answer, FactorScore, TestResult } from '../types';

// Sten score normalization data - typical means and SDs for each factor
// Based on 16PF normative data (raw scores typically range from 10-50 for 10 items)
const stenNorms: Record<string, { mean: number; sd: number; lowLabel: string; highLabel: string }> = {
  A: { mean: 30, sd: 6, lowLabel: '保留的', highLabel: '外向的' },
  B: { mean: 25, sd: 5, lowLabel: '具体思维', highLabel: '抽象思维' },
  C: { mean: 30, sd: 6, lowLabel: '情绪不稳定', highLabel: '情绪稳定' },
  E: { mean: 30, sd: 6, lowLabel: '顺从的', highLabel: '支配的' },
  F: { mean: 30, sd: 6, lowLabel: '严肃的', highLabel: '轻松的' },
  G: { mean: 30, sd: 6, lowLabel: '权宜的', highLabel: '有原则的' },
  H: { mean: 30, sd: 6, lowLabel: '羞怯的', highLabel: '大胆的' },
  I: { mean: 30, sd: 6, lowLabel: '理智的', highLabel: '敏感的' },
  L: { mean: 30, sd: 6, lowLabel: '信赖的', highLabel: '怀疑的' },
  M: { mean: 30, sd: 6, lowLabel: '现实的', highLabel: '想象的' },
  N: { mean: 30, sd: 6, lowLabel: '坦率的', highLabel: '世故的' },
  O: { mean: 30, sd: 6, lowLabel: '自信的', highLabel: '忧虑的' },
  Q1: { mean: 30, sd: 6, lowLabel: '保守的', highLabel: '开放变革' },
  Q2: { mean: 30, sd: 6, lowLabel: '依赖群体', highLabel: '自立的' },
  Q3: { mean: 30, sd: 6, lowLabel: '灵活的', highLabel: '自律的' },
  Q4: { mean: 30, sd: 6, lowLabel: '放松的', highLabel: '紧张的' },
};

/**
 * Convert raw score to sten score (1-10 scale)
 * Sten scores have mean of 5.5 and SD of 2
 */
function convertToSten(rawScore: number, factorId: string): number {
  const norms = stenNorms[factorId];
  if (!norms) return 5.5; // default middle score

  // Calculate z-score: (X - M) / SD
  const zScore = (rawScore - norms.mean) / norms.sd;

  // Convert to sten: 5.5 + 2 * z
  const sten = 5.5 + 2 * zScore;

  // Clamp to 1-10 range
  return Math.max(1, Math.min(10, Math.round(sten * 10) / 10));
}

/**
 * Determine score level based on sten score
 */
function getStenLevel(stenScore: number): 'low' | 'average' | 'high' {
  if (stenScore < 4) return 'low';
  if (stenScore > 7) return 'high';
  return 'average';
}

/**
 * Calculate all factor scores from answers
 */
export function calculateScores(
  answers: Answer[],
  scoringData: any
): TestResult {
  const answerMap = new Map(answers.map(a => [a.questionNumber, a.score]));
  const factorScores: FactorScore[] = [];

  // Calculate raw score for each factor
  for (const [factorId, factor] of Object.entries(scoringData.factors)) {
    const factorData = factor as any;
    let rawScore = 0;

    // Sum scores for all questions in this factor
    for (const question of factorData.questions) {
      const qNum = question.number;
      const userScore = answerMap.get(qNum);

      if (userScore !== undefined) {
        // Handle reverse scoring: if reverse, score = 6 - answer
        const actualScore = question.isReverse ? (6 - userScore) : userScore;
        rawScore += actualScore;
      }
    }

    // Convert to sten score
    const stenScore = convertToSten(rawScore, factorId);

    // Calculate percentage for visualization (sten 1-10 mapped to 0-100%)
    const percentage = Math.round(((stenScore - 1) / 9) * 100);

    // Get level
    const level = getStenLevel(stenScore);

    // Get bipolar labels
    const norms = stenNorms[factorId];

    factorScores.push({
      factorId,
      factorName: factorData.name,
      factorNameEn: factorData.nameEn,
      rawScore,
      stenScore,
      lowLabel: norms.lowLabel,
      highLabel: norms.highLabel,
      percentage,
      level,
    });
  }

  // Sort by factor ID (A, B, C, ..., Q4)
  factorScores.sort((a, b) => {
    const factorOrder = ['A', 'B', 'C', 'E', 'F', 'G', 'H', 'I', 'L', 'M', 'N', 'O', 'Q1', 'Q2', 'Q3', 'Q4'];
    return factorOrder.indexOf(a.factorId) - factorOrder.indexOf(b.factorId);
  });

  return {
    answers,
    factorScores,
    completedAt: new Date(),
  };
}

/**
 * Get interpretation text for a factor based on score level
 */
export function getFactorInterpretation(
  factorId: string,
  level: 'low' | 'average' | 'high'
): string {
  const interpretations: Record<string, Record<string, string>> = {
    A: {
      low: '您倾向于保留和独立，喜欢独自工作，对他人较为疏远和正式。',
      average: '您在社交性方面处于平衡状态，既能与人合作，也能独立工作。',
      high: '您外向热情，乐于与人交往，善于建立人际关系，喜欢团队合作。',
    },
    B: {
      low: '您倾向于具体思维，更关注实际问题和眼前的事物。',
      average: '您在抽象推理方面处于正常水平，能够处理一般的概念性问题。',
      high: '您善于抽象思维和理论分析，学习能力强，能够快速掌握复杂概念。',
    },
    C: {
      low: '您可能较容易受到情绪困扰，在压力下容易感到不安和焦虑。',
      average: '您的情绪稳定性处于正常水平,大多数时候能够控制情绪。',
      high: '您情绪稳定成熟，能够在压力下保持冷静，适应能力强。',
    },
    E: {
      low: '您倾向于谦逊顺从，尊重权威，避免冲突,善于配合他人。',
      average: '您在支配性方面处于平衡状态，既能领导也能跟随。',
      high: '您自信果断，具有领导欲望，喜欢掌控局面，敢于表达自己的观点。',
    },
    F: {
      low: '您严肃谨慎，倾向于深思熟虑，较为克制和内敛。',
      average: '您在活泼性方面处于平衡状态，能够灵活调整。',
      high: '您热情活泼，乐观开朗，富有幽默感，善于活跃气氛。',
    },
    G: {
      low: '您较为灵活变通，不太受传统规则束缚，倾向于权宜处理。',
      average: '您在规则意识方面处于正常水平，能够权衡原则与灵活性。',
      high: '您有责任心和原则性，重视道德规范，做事认真负责。',
    },
    H: {
      low: '您在社交场合可能感到羞怯和不自在，倾向于回避陌生环境。',
      average: '您在社交大胆性方面处于正常水平，能够适应多数社交场合。',
      high: '您大胆自信，不怕陌生环境，敢于冒险，善于在公众场合表现自己。',
    },
    I: {
      low: '您理智务实，注重逻辑和事实，较少受情感影响。',
      average: '您在敏感性方面处于平衡状态，既理性又有同理心。',
      high: '您感情细腻敏感，富有同情心，重视情感和审美体验。',
    },
    L: {
      low: '您信任他人，容易接受他人观点，较少怀疑和戒备。',
      average: '您在怀疑性方面处于正常水平，能够适度信任他人。',
      high: '您警觉多疑，倾向于质疑他人动机，对环境保持警惕。',
    },
    M: {
      low: '您现实务实，关注具体事物，注重实际结果。',
      average: '您在想象力方面处于平衡状态，既务实又有一定创意。',
      high: '您富有想象力，喜欢抽象思考，关注内心世界和理想。',
    },
    N: {
      low: '您坦率直接，不善于掩饰，表里如一。',
      average: '您在世故性方面处于正常水平，能够适度运用社交技巧。',
      high: '您精明世故，善于察言观色，懂得在不同场合表现得体。',
    },
    O: {
      low: '您自信镇定，较少担忧，对自己能力有信心。',
      average: '您在忧虑性方面处于正常水平，偶尔会有担心。',
      high: '您倾向于忧虑和自责，对问题较为敏感，容易感到不安。',
    },
    Q1: {
      low: '您尊重传统，倾向于保守，喜欢熟悉和稳定的事物。',
      average: '您在变革开放性方面处于平衡状态，能够接受适度变化。',
      high: '您思想开放，乐于尝试新事物，对变革持积极态度。',
    },
    Q2: {
      low: '您依赖群体，喜欢与他人共同决策，重视集体意见。',
      average: '您在自立性方面处于平衡状态，既能独立又能合作。',
      high: '您独立自主，喜欢自己做决定，不依赖他人意见。',
    },
    Q3: {
      low: '您较为随性灵活，不太在意细节和规划。',
      average: '您在自律性方面处于正常水平，有一定的计划性。',
      high: '您自律严格，做事有条理，注重计划和细节。',
    },
    Q4: {
      low: '您放松平和，较少焦虑，能够保持轻松心态。',
      average: '您在紧张性方面处于正常水平，偶尔会有压力感。',
      high: '您可能感到紧张和压力，精力充沛但也容易烦躁不安。',
    },
  };

  return interpretations[factorId]?.[level] || '';
}

/**
 * Get level label in Chinese
 */
export function getLevelLabel(level: 'low' | 'average' | 'high'): string {
  switch (level) {
    case 'low': return '偏低';
    case 'average': return '中等';
    case 'high': return '偏高';
    default: return '中等';
  }
}

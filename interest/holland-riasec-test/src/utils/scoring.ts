import type { Answer, TypeScore } from '../types';
import scoringConfig from '../data/holland-scoring.json';

function getScoreLevel(rawScore: number): 'low' | 'average' | 'high' | 'very_high' {
  if (rawScore >= 40) return 'very_high';
  if (rawScore >= 30) return 'high';
  if (rawScore >= 20) return 'average';
  return 'low';
}

export function calculateScores(answers: Answer[]): { typeScores: TypeScore[], hollandCode: string } {
  const answerMap = new Map(answers.map(a => [a.questionNumber, a.score]));
  const typeScores: TypeScore[] = [];

  for (const [typeId, typeConfig] of Object.entries(scoringConfig.types)) {
    let rawScore = 0;
    for (const qNum of (typeConfig as any).questions) {
      rawScore += answerMap.get(qNum) ?? 0;
    }

    const percentage = Math.round(((rawScore - 10) / 40) * 100);

    typeScores.push({
      typeId,
      typeName: (typeConfig as any).name,
      typeNameEn: (typeConfig as any).nameEn,
      rawScore,
      percentage,
      level: getScoreLevel(rawScore),
      isTopInterest: false,
    });
  }

  // Sort by score descending to determine top 3
  const sorted = [...typeScores].sort((a, b) => b.rawScore - a.rawScore);

  // Mark top 3 as isTopInterest
  const topIds = new Set(sorted.slice(0, 3).map(t => t.typeId));
  typeScores.forEach(t => { t.isTopInterest = topIds.has(t.typeId); });

  // Holland code = top 3 type IDs joined
  const hollandCode = sorted.slice(0, 3).map(t => t.typeId).join('');

  return { typeScores, hollandCode };
}

export function getLevelLabel(level: string): string {
  switch (level) {
    case 'very_high': return '非常突出';
    case 'high': return '较强';
    case 'average': return '一般';
    case 'low': return '较弱';
    default: return '一般';
  }
}

export function getTypeInterpretation(
  typeId: string,
  level: 'low' | 'average' | 'high' | 'very_high'
): string {
  const interpretations: Record<string, Record<string, string>> = {
    R: {
      low: '动手操作和实际工作不是您的主要兴趣方向，您可能更倾向于脑力劳动或与人交往的工作。',
      average: '您对动手操作和实际工作有一定的兴趣，能够胜任需要动手的任务，但这不是您最主要的兴趣方向。',
      high: '您对动手操作和实际工作有较强的兴趣，喜欢与具体事物打交道，善于解决实际问题。',
      very_high: '您对动手操作和实际工作有非常强烈的兴趣！您喜欢与具体事物打交道，享受通过双手创造和修理东西的过程。',
    },
    I: {
      low: '纯粹的研究和理论分析不是您的主要兴趣方向，您可能更喜欢实际操作或社交互动的工作。',
      average: '您对研究和分析有一定的兴趣，能够进行基本的分析和探索工作。',
      high: '您对研究和探索有较强的兴趣，享受深入分析问题、探索未知领域的过程。',
      very_high: '您对研究和探索有非常强烈的兴趣！您享受深入分析问题和探索未知领域，对知识的追求是您重要的内在动力。',
    },
    A: {
      low: '纯粹的艺术创作和创造性活动不是您的主要兴趣方向，您可能更偏好结构化和明确的工作。',
      average: '您对艺术和创造性活动有一定的兴趣，能够欣赏美的事物，偶尔喜欢参与创造性活动。',
      high: '您对创造性活动和艺术表达有较强的兴趣，富有想象力，喜欢自由表达。',
      very_high: '您对创造性活动和艺术表达有非常强烈的兴趣！您富有想象力，追求独特和创新，享受自由表达的过程。',
    },
    S: {
      low: '与人密切交往和服务他人不是您的主要兴趣方向，您可能更喜欢独立工作或与事物打交道。',
      average: '您对与人交往和帮助他人有一定的兴趣，能够在团队中良好地合作。',
      high: '您对与人交往和帮助他人有较强的兴趣，善于沟通、关心他人。',
      very_high: '您对与人交往和帮助他人有非常强烈的兴趣！您善于沟通、关心他人，享受在团队中协作和服务的过程。',
    },
    E: {
      low: '领导、管理和商业竞争不是您的主要兴趣方向，您可能更喜欢执行和专业技术类的工作。',
      average: '您对领导和商业活动有一定的兴趣，能够在需要时承担领导角色。',
      high: '您对领导、管理和商业活动有较强的兴趣，自信果断，善于影响他人。',
      very_high: '您对领导、管理和商业活动有非常强烈的兴趣！您自信果断，善于说服和影响他人，享受竞争和成就的过程。',
    },
    C: {
      low: '高度结构化和规范化的工作不是您的主要兴趣方向，您可能更喜欢灵活、自由的工作方式。',
      average: '您对有序和结构化的工作有一定的兴趣，能够处理需要细心和规范的任务。',
      high: '您对有序、系统化的工作有较强的兴趣，注重细节，追求准确和效率。',
      very_high: '您对有序、系统化的工作有非常强烈的兴趣！您注重细节，追求准确和效率，享受在结构化环境中工作的过程。',
    },
  };

  return interpretations[typeId]?.[level] || '';
}

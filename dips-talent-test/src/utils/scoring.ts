import type { Answer, DimensionScore } from '../types';
import scoringConfig from '../data/dips-scoring.json';

function getScoreLevel(rawScore: number): 'low' | 'average' | 'high' | 'very_high' {
  if (rawScore >= 17) return 'very_high';
  if (rawScore >= 13) return 'high';
  if (rawScore >= 9) return 'average';
  return 'low';
}

export function calculateScores(answers: Answer[]): DimensionScore[] {
  const answerMap = new Map(answers.map(a => [a.questionNumber, a.score]));
  const dimensionScores: DimensionScore[] = [];

  for (const [dimId, dim] of Object.entries(scoringConfig.dimensions)) {
    let rawScore = 0;
    for (const qNum of (dim as any).questions) {
      rawScore += answerMap.get(qNum) ?? 0;
    }

    const percentage = Math.round(((rawScore - 4) / 16) * 100);

    dimensionScores.push({
      dimensionId: dimId,
      dimensionName: (dim as any).name,
      dimensionNameEn: (dim as any).nameEn,
      rawScore,
      percentage,
      level: getScoreLevel(rawScore),
      isTopTalent: false,
    });
  }

  // Mark top talents
  const sorted = [...dimensionScores].sort((a, b) => b.rawScore - a.rawScore);
  const topCount = sorted.length >= 3 && sorted[2].rawScore >= sorted[0].rawScore - 4 ? 3 : 2;
  const topIds = new Set(sorted.slice(0, topCount).map(d => d.dimensionId));
  dimensionScores.forEach(d => { d.isTopTalent = topIds.has(d.dimensionId); });

  return dimensionScores;
}

export function getLevelLabel(level: string): string {
  switch (level) {
    case 'very_high': return '突出天赋';
    case 'high': return '较强';
    case 'average': return '一般';
    case 'low': return '待发展';
    default: return '一般';
  }
}

export function getDimensionInterpretation(
  dimensionId: string,
  level: 'low' | 'average' | 'high' | 'very_high'
): string {
  const interpretations: Record<string, Record<string, string>> = {
    A: {
      low: '语言表达可能不是您最强的领域，您可能更倾向于通过行动而非语言来表达自己。',
      average: '您的语言能力处于中等水平，日常交流没有问题，但在需要高度语言技巧的场景中可能需要更多准备。',
      high: '您具备较强的语言天赋，善于表达和沟通，能够清晰地传达复杂概念。',
      very_high: '您在语言方面具有突出天赋，表达清晰有力，善于说服他人，是天生的沟通高手。',
    },
    B: {
      low: '逻辑推理和数学运算不是您的强项，您可能更擅长直觉思维和感性判断。',
      average: '您具备基本的逻辑思维和数学能力，能够处理日常生活和工作中的逻辑问题。',
      high: '您拥有较强的逻辑分析能力，善于发现规律和进行推理。',
      very_high: '您在逻辑和数学方面具有突出天赋，善于系统分析和抽象思维，是天生的问题解决者。',
    },
    C: {
      low: '空间想象不是您的强项，您可能更倾向于语言或逻辑方式来理解世界。',
      average: '您具备一般的空间感知能力，能够处理基本的空间相关任务。',
      high: '您拥有较强的空间想象力，善于在脑海中构建和操作三维图像。',
      very_high: '您在空间感知方面具有突出天赋，能够轻松进行复杂的空间推理和可视化。',
    },
    D: {
      low: '自我认知和情绪管理方面还有提升空间，建议多关注和觉察自己的内在状态。',
      average: '您具备一定的自我认知能力，能够基本管理自己的情绪和需求。',
      high: '您拥有较强的内省能力，善于理解自己的情绪和动机，能在压力下保持冷静。',
      very_high: '您在自我认知方面具有突出天赋，对自己有深刻的了解，情绪管理能力出色。',
    },
    E: {
      low: '人际交往不是您最擅长的领域，您可能更享受独立工作的环境。',
      average: '您具备基本的人际交往能力，能够与他人良好地合作和沟通。',
      high: '您拥有较强的人际天赋，善于理解他人、与人沟通，是良好的团队协作者。',
      very_high: '您在人际方面具有突出天赋，天生善于理解和影响他人，是出色的人际沟通者。',
    },
    F: {
      low: '身体协调和运动方面不是您的强项，您可能更擅长脑力活动。',
      average: '您具备一般的身体协调能力，能完成日常体力任务。',
      high: '您拥有较好的身体协调能力，动作灵活准确，擅长需要身体技能的任务。',
      very_high: '您在身体控制方面具有突出天赋，手眼协调出色，身体灵活性和精确度很高。',
    },
    G: {
      low: '音乐方面不是您最突出的天赋，但这不影响您欣赏音乐的能力。',
      average: '您对音乐有一定的感知能力，能够感受节奏和旋律。',
      high: '您拥有较强的音乐天赋，对音调和节奏敏感，具有良好的音乐表现力。',
      very_high: '您在音乐方面具有突出天赋，对音乐有天生的敏感度，在演奏和感知方面都很出色。',
    },
    H: {
      low: '与自然相关的感知不是您的强项，您可能更适应城市化的生活环境。',
      average: '您对自然有一定的亲近感，能够基本理解和应对自然环境。',
      high: '您拥有较强的自然感知力，善于观察和理解自然界的事物。',
      very_high: '您在自然方面具有突出天赋，与动植物有天然的亲和力，善于洞察自然规律。',
    },
    I: {
      low: '创造性思维不是您最突出的方面，您可能更擅长执行和完善已有方案。',
      average: '您具备一定的创造力，能够在需要时提出新的想法和解决方案。',
      high: '您拥有较强的创造天赋，思维活跃，善于产生新颖的想法。',
      very_high: '您在创造力方面具有突出天赋，思维独特，善于突破常规，是天生的创新者。',
    },
    J: {
      low: '美学感知不是您最强的领域，您可能更注重功能性而非外观。',
      average: '您具备基本的审美能力，能够分辨和欣赏美的事物。',
      high: '您拥有较强的美学天赋，对色彩、形式和设计有良好的感知。',
      very_high: '您在美学方面具有突出天赋，对视觉美有天生的敏感度，善于创造和谐美感。',
    },
  };

  return interpretations[dimensionId]?.[level] || '';
}

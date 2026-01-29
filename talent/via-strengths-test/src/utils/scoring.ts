import type { Answer, StrengthScore, TestResult } from '../types';

export function calculateScores(answers: Answer[], scoringData: any): TestResult {
  const answerMap = new Map(answers.map(a => [a.question, a.value]));
  const strengthScores: StrengthScore[] = [];

  // Calculate raw scores for each of the 24 strengths
  const strengthKeys = Object.keys(scoringData.strengths);
  for (const strengthKey of strengthKeys) {
    const strengthConfig = scoringData.strengths[strengthKey];
    let rawScore = 0;

    // Sum scores for all 5 questions of this strength
    for (const qNum of strengthConfig.questions) {
      rawScore += answerMap.get(qNum) ?? 0;
    }

    // Calculate percentage: (rawScore - 5) / 20 * 100 (5 is min, 25 is max)
    const percentage = Math.round(((rawScore - 5) / 20) * 100);

    strengthScores.push({
      strengthId: strengthKey,
      strengthName: strengthConfig.name,
      strengthNameEn: strengthConfig.nameEn,
      virtue: strengthConfig.virtue,
      rawScore,
      percentage,
      rank: 0, // will be assigned after sorting
      isSignature: false, // will be set for top 5
    });
  }

  // Sort by raw score descending to determine ranks
  const sorted = [...strengthScores].sort((a, b) => {
    // Sort by rawScore descending, then by strengthId ascending for ties
    if (b.rawScore !== a.rawScore) {
      return b.rawScore - a.rawScore;
    }
    return a.strengthId.localeCompare(b.strengthId);
  });

  // Assign ranks
  sorted.forEach((strength, index) => {
    strength.rank = index + 1;
    strength.isSignature = index < 5; // Top 5 are signature strengths
  });

  // Get signature strengths (top 5)
  const signatureStrengths = sorted.slice(0, 5);

  return {
    answers,
    strengthScores: sorted,
    signatureStrengths,
    completedAt: new Date(),
  };
}

export function getVirtueLabel(virtue: string): string {
  const virtueLabels: Record<string, string> = {
    wisdom: '智慧与知识',
    courage: '勇气',
    humanity: '仁爱',
    justice: '正义',
    temperance: '节制',
    transcendence: '超越',
  };
  return virtueLabels[virtue] || virtue;
}

export function getVirtueColor(virtue: string): string {
  const virtueColors: Record<string, string> = {
    wisdom: '#3B82F6', // blue
    courage: '#EF4444', // red
    humanity: '#EC4899', // pink
    justice: '#8B5CF6', // purple
    temperance: '#10B981', // green
    transcendence: '#F59E0B', // amber
  };
  return virtueColors[virtue] || '#6B7280';
}

export function getVirtueDescription(virtue: string): string {
  const descriptions: Record<string, string> = {
    wisdom: '智慧与知识美德涉及获取和使用知识的认知优势。',
    courage: '勇气美德涉及面对内外阻力时实现目标的情感优势。',
    humanity: '仁爱美德涉及照顾和与他人建立友谊的人际优势。',
    justice: '正义美德涉及构建健康社区生活的公民优势。',
    temperance: '节制美德涉及防止过度的优势。',
    transcendence: '超越美德涉及建立与更广阔宇宙联系和提供意义的优势。',
  };
  return descriptions[virtue] || '';
}

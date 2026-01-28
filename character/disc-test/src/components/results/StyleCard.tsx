import React from 'react';
import { InfoIcon } from '../InfoIcon';
import type { DimensionScore } from '../../types';
import { getLevelLabel, getDimensionInterpretation } from '../../utils/scoring';
import styleData from '../../data/style-explanations.json';
import scoringConfig from '../../data/disc-scoring.json';

interface StyleCardProps {
  dimension: DimensionScore;
}

const StyleCard: React.FC<StyleCardProps> = ({ dimension }) => {
  const styleInfo = (styleData as any).styles[dimension.dimensionId] as any;
  const dimConfig = scoringConfig.dimensions[dimension.dimensionId as keyof typeof scoringConfig.dimensions] as any;

  const scoreLevel = dimension.level;
  let scoreData;

  if (scoreLevel === 'very_high' || scoreLevel === 'high') {
    scoreData = styleInfo.highScore;
  } else if (scoreLevel === 'average') {
    scoreData = styleInfo.averageScore;
  } else {
    scoreData = styleInfo.lowScore;
  }

  const getBgColor = () => {
    if (dimension.isPrimary) return 'from-amber-50 to-orange-50 border-amber-200';
    if (dimension.isSecondary) return 'from-gray-50 to-slate-50 border-gray-300';
    if (scoreLevel === 'very_high') return 'from-amber-50 to-orange-50 border-amber-200';
    if (scoreLevel === 'high') return 'from-green-50 to-emerald-50 border-green-200';
    if (scoreLevel === 'low') return 'from-blue-50 to-cyan-50 border-blue-200';
    return 'from-gray-50 to-slate-50 border-gray-200';
  };

  const getLevelBadgeColor = () => {
    if (scoreLevel === 'very_high') return 'bg-amber-100 text-amber-800';
    if (scoreLevel === 'high') return 'bg-green-100 text-green-800';
    if (scoreLevel === 'low') return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className={`excalidraw-card bg-gradient-to-br ${getBgColor()} ${dimension.isPrimary ? 'ring-4 ring-amber-400' : ''}`}>
      {/* Header */}
      <div className="p-6 border-b-2 border-gray-800">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-full border-3 border-gray-800 flex items-center justify-center text-2xl"
              style={{ backgroundColor: styleInfo.color }}
            >
              {styleInfo.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-gray-800">{styleInfo.name}</h2>
                <span className="text-gray-500">({styleInfo.nameEn})</span>
                {dimension.isPrimary && (
                  <span className="px-2 py-0.5 bg-amber-200 border-2 border-amber-400 rounded-full text-xs font-bold text-amber-800">
                    主导风格
                  </span>
                )}
                {dimension.isSecondary && (
                  <span className="px-2 py-0.5 bg-gray-200 border-2 border-gray-400 rounded-full text-xs font-bold text-gray-700">
                    次要风格
                  </span>
                )}
                <InfoIcon
                  title={styleInfo.name}
                  content={
                    <div className="space-y-4">
                      <p className="text-gray-700">{styleInfo.fullDescription}</p>
                      <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                        <p className="text-sm text-amber-800"><strong>简述：</strong>{styleInfo.shortDescription}</p>
                      </div>
                    </div>
                  }
                />
              </div>
              <p className="text-gray-600 text-sm mt-1">{styleInfo.shortDescription}</p>
            </div>
          </div>
        </div>

        {/* Scores */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-white p-3 rounded-xl border-2 border-gray-800 text-center">
            <div className="text-2xl font-bold text-gray-800">{dimension.rawScore}/35</div>
            <div className="text-xs text-gray-600 mt-1">
              原始分
              <InfoIcon
                title="原始分"
                size="sm"
                content="原始分是您在该行为维度7道题目的总分。每题1-5分，总分范围为7-35分。得分越高表示该行为倾向越明显。"
              />
            </div>
          </div>
          <div className="bg-white p-3 rounded-xl border-2 border-gray-800 text-center">
            <div className="text-2xl font-bold text-gray-800">{dimension.percentage}%</div>
            <div className="text-xs text-gray-600 mt-1">
              百分比
              <InfoIcon
                title="百分比"
                size="sm"
                content="百分比将您的原始分转换为0-100%的标准化尺度，便于直观比较不同维度的相对强弱。"
              />
            </div>
          </div>
        </div>

        {/* Score Interpretation */}
        <div className="mt-4 p-4 bg-white rounded-xl border-2 border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-bold text-gray-800">风格强度：</span>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getLevelBadgeColor()}`}>
              {getLevelLabel(scoreLevel)}
            </span>
            <span className="text-sm text-gray-600">({scoreData.range})</span>
          </div>
          <p className="text-gray-700">
            {getDimensionInterpretation(dimension.dimensionId, dimension.level)}
          </p>
        </div>
      </div>

      {/* Career Recommendations */}
      <div className="p-6 space-y-4">
        <div>
          <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
            💼 推荐职业方向
          </h3>
          <div className="flex flex-wrap gap-2">
            {(dimConfig as any).careers.map((career: string, idx: number) => (
              <span
                key={idx}
                className="px-3 py-1 bg-white border-2 border-gray-800 rounded-full text-sm text-gray-700"
              >
                {career}
              </span>
            ))}
          </div>
        </div>

        {/* Traits & Tips for high/very_high/low */}
        {(scoreLevel === 'very_high' || scoreLevel === 'high') && 'traits' in scoreData && (
          <>
            <div>
              <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                🎯 特征表现
              </h3>
              <div className="flex flex-wrap gap-2">
                {(scoreData as any).traits?.map((trait: string, idx: number) => (
                  <span key={idx} className="px-3 py-1 bg-white border-2 border-gray-800 rounded-full text-sm text-gray-700">
                    {trait}
                  </span>
                ))}
              </div>
            </div>

            {(scoreData as any).strengths && (
              <div>
                <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                  ✨ 优势
                </h3>
                <div className="bg-white p-3 rounded-xl border-2 border-green-300">
                  <ul className="space-y-1">
                    {(scoreData as any).strengths.map((strength: string, idx: number) => (
                      <li key={idx} className="text-gray-700 text-sm flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">✓</span>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {(scoreData as any).challenges && (
              <div>
                <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                  ⚡ 注意事项
                </h3>
                <div className="bg-white p-3 rounded-xl border-2 border-orange-300">
                  <ul className="space-y-1">
                    {(scoreData as any).challenges.map((challenge: string, idx: number) => (
                      <li key={idx} className="text-gray-700 text-sm flex items-start gap-2">
                        <span className="text-orange-500 mt-0.5">!</span>
                        <span>{challenge}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {(scoreData as any).developmentTips && (
              <div>
                <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                  📈 发展建议
                </h3>
                <div className="bg-white p-3 rounded-xl border-2 border-purple-300">
                  <ul className="space-y-2">
                    {(scoreData as any).developmentTips.map((tip: string, idx: number) => (
                      <li key={idx} className="text-gray-700 text-sm flex items-start gap-2">
                        <span className="text-purple-500 mt-0.5">→</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </>
        )}

        {scoreLevel === 'average' && 'traits' in scoreData && (
          <div>
            <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              🎯 特征表现
            </h3>
            <div className="flex flex-wrap gap-2">
              {(scoreData as any).traits?.map((trait: string, idx: number) => (
                <span key={idx} className="px-3 py-1 bg-white border-2 border-gray-800 rounded-full text-sm text-gray-700">
                  {trait}
                </span>
              ))}
            </div>
            <p className="text-gray-600 text-sm mt-3">{(scoreData as any).description}</p>
          </div>
        )}

        {scoreLevel === 'low' && 'traits' in scoreData && (
          <>
            <div>
              <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                🎯 特征表现
              </h3>
              <div className="flex flex-wrap gap-2">
                {(scoreData as any).traits?.map((trait: string, idx: number) => (
                  <span key={idx} className="px-3 py-1 bg-white border-2 border-gray-800 rounded-full text-sm text-gray-700">
                    {trait}
                  </span>
                ))}
              </div>
              <p className="text-gray-600 text-sm mt-3">{(scoreData as any).description}</p>
            </div>
            {(scoreData as any).developmentTips && (
              <div>
                <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                  📈 发展建议
                </h3>
                <div className="bg-white p-3 rounded-xl border-2 border-purple-300">
                  <ul className="space-y-2">
                    {(scoreData as any).developmentTips.map((tip: string, idx: number) => (
                      <li key={idx} className="text-gray-700 text-sm flex items-start gap-2">
                        <span className="text-purple-500 mt-0.5">→</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StyleCard;

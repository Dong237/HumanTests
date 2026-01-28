import React, { useState } from 'react';
import { InfoIcon } from '../InfoIcon';
import dimensionData from '../../data/dimension-explanations.json';
import type { DimensionScore } from '../../types';

interface DimensionCardProps {
  dimension: DimensionScore;
}

const DimensionCard: React.FC<DimensionCardProps> = ({ dimension }) => {
  const [showFacets, setShowFacets] = useState(false);

  const dimData = dimensionData[dimension.dimensionId as keyof typeof dimensionData];

  // Determine score level
  let scoreLevel: 'high' | 'average' | 'low';
  let scoreData;

  if (dimension.tScore > 60) {
    scoreLevel = 'high';
    scoreData = dimData.highScore;
  } else if (dimension.tScore >= 40) {
    scoreLevel = 'average';
    scoreData = dimData.averageScore;
  } else {
    scoreLevel = 'low';
    scoreData = dimData.lowScore;
  }

  const getBgColor = () => {
    if (scoreLevel === 'high') return 'from-red-50 to-orange-50 border-red-200';
    if (scoreLevel === 'low') return 'from-blue-50 to-cyan-50 border-blue-200';
    return 'from-green-50 to-emerald-50 border-green-200';
  };

  return (
    <div className={`excalidraw-card mb-6 bg-gradient-to-br ${getBgColor()}`}>
      {/* Header */}
      <div className="p-6 border-b-2 border-gray-800">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-full border-3 border-gray-800 flex items-center justify-center text-2xl`}
              style={{ backgroundColor: dimData.color }}
            >
              {dimData.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-gray-800">{dimData.name}</h2>
                <span className="text-gray-500">({dimData.nameEn})</span>
                <InfoIcon
                  title={dimData.name}
                  content={
                    <div className="space-y-4">
                      <p className="text-gray-700">{dimData.fullDescription}</p>
                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-800"><strong>简述：</strong>{dimData.shortDescription}</p>
                      </div>
                    </div>
                  }
                />
              </div>
              <p className="text-gray-600 text-sm mt-1">{dimData.shortDescription}</p>
            </div>
          </div>
        </div>

        {/* Scores */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="bg-white p-3 rounded-xl border-2 border-gray-800 text-center">
            <div className="text-2xl font-bold text-gray-800">{dimension.rawScore}</div>
            <div className="text-xs text-gray-600 mt-1">
              原始分
              <InfoIcon
                title="原始分"
                size="sm"
                content="原始分是您在该维度48道题目（6个子维度×8题）的总分。每题1-5分，总分范围为48-240分。原始分需要转换为T分数才能与常模比较。"
              />
            </div>
          </div>
          <div className="bg-white p-3 rounded-xl border-2 border-gray-800 text-center">
            <div className="text-2xl font-bold text-gray-800">{dimension.tScore}</div>
            <div className="text-xs text-gray-600 mt-1">
              T分数
              <InfoIcon
                title="T分数"
                size="sm"
                content="T分数是标准化得分，平均值为50，标准差为10。它让您的得分与常模群体进行比较。T分>60表示较高，40-60为平均，<40为较低。"
              />
            </div>
          </div>
          <div className="bg-white p-3 rounded-xl border-2 border-gray-800 text-center">
            <div className="text-2xl font-bold text-gray-800">{dimension.percentile}%</div>
            <div className="text-xs text-gray-600 mt-1">
              百分位
              <InfoIcon
                title="百分位"
                size="sm"
                content="百分位表示您的得分超过了百分之多少的人。例如，百分位75意味着您的得分超过了75%的人。"
              />
            </div>
          </div>
        </div>

        {/* Score Interpretation */}
        <div className="mt-4 p-4 bg-white rounded-xl border-2 border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-bold text-gray-800">您的水平：</span>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
              scoreLevel === 'high' ? 'bg-red-100 text-red-800' :
              scoreLevel === 'low' ? 'bg-blue-100 text-blue-800' :
              'bg-green-100 text-green-800'
            }`}>
              {scoreLevel === 'high' ? '较高' : scoreLevel === 'low' ? '较低' : '平均'}
            </span>
            <span className="text-sm text-gray-600">({scoreData.range})</span>
          </div>
          <p className="text-gray-700">{scoreData.description}</p>
        </div>
      </div>

      {/* Detailed Interpretation */}
      {scoreLevel !== 'average' && scoreData && 'traits' in scoreData && (
        <div className="p-6 space-y-4">
          {/* Traits */}
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

          {/* Strengths */}
          <div>
            <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              ✨ 优势
            </h3>
            <div className="bg-white p-3 rounded-xl border-2 border-green-300">
              <ul className="space-y-1">
                {(scoreData as any).strengths?.map((strength: string, idx: number) => (
                  <li key={idx} className="text-gray-700 text-sm flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Challenges */}
          {(scoreData as any).challenges && (scoreData as any).challenges.length > 0 && (
            <div>
              <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                ⚡ 挑战
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

          {/* Development Tips */}
          {(scoreData as any).developmentTips && (scoreData as any).developmentTips.length > 0 && (
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
        </div>
      )}

      {/* Facets Expandable Section */}
      <div className="border-t-2 border-gray-800">
        <button
          onClick={() => setShowFacets(!showFacets)}
          className="w-full p-4 flex items-center justify-between hover:bg-white/50 transition-colors"
        >
          <span className="font-bold text-gray-800 flex items-center gap-2">
            🔍 查看6个子维度详情
            <InfoIcon
              title="子维度 (Facets)"
              size="sm"
              content={`每个大维度包含6个子维度（facets），更细致地描述您的人格特质。${dimData.name}的6个子维度分别测量该维度的不同方面。`}
            />
          </span>
          <span className="text-2xl transform transition-transform duration-200"
            style={{ transform: showFacets ? 'rotate(180deg)' : 'rotate(0deg)' }}>
            ▼
          </span>
        </button>

        {showFacets && (
          <div className="p-6 pt-0 grid grid-cols-1 md:grid-cols-2 gap-4">
            {dimension.facetScores.map((facet) => {
              const facetData = dimData.facets[facet.facetId as keyof typeof dimData.facets] as any;
              const maxScore = 40; // 8 questions × 5 points max
              return (
                <div key={facet.facetId} className="bg-white p-4 rounded-xl border-2 border-gray-300">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-800">{facetData.name}</span>
                      <InfoIcon
                        title={facetData.name}
                        size="sm"
                        content={
                          <div className="space-y-2">
                            <p className="text-gray-700">{facetData.description}</p>
                            <div className="bg-green-50 p-2 rounded border border-green-200">
                              <p className="text-sm text-green-800"><strong>高分：</strong>{facetData.highMeans}</p>
                            </div>
                            <div className="bg-blue-50 p-2 rounded border border-blue-200">
                              <p className="text-sm text-blue-800"><strong>低分：</strong>{facetData.lowMeans}</p>
                            </div>
                          </div>
                        }
                      />
                    </div>
                    <span className="text-sm font-bold text-gray-600">{facet.rawScore}/{maxScore}</span>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full border border-gray-800 overflow-hidden">
                    <div
                      className="h-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, (facet.rawScore / maxScore) * 100)}%`,
                        backgroundColor: dimData.color,
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-2">{facetData.description}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DimensionCard;

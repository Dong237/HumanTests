import React from 'react';
import { InfoIcon } from '../InfoIcon';
import type { TypeScore } from '../../types';
import { getLevelLabel, getTypeInterpretation } from '../../utils/scoring';
import typeData from '../../data/type-descriptions.json';
import scoringConfig from '../../data/onet-scoring.json';

interface TypeCardProps {
  typeScore: TypeScore;
}

const TypeCard: React.FC<TypeCardProps> = ({ typeScore }) => {
  const tData = (typeData as any).types[typeScore.typeId] as any;
  const tConfig = scoringConfig.types[typeScore.typeId as keyof typeof scoringConfig.types] as any;

  const scoreLevel = typeScore.level;

  // Map score level to display range
  const getScoreRange = () => {
    if (scoreLevel === 'very_high') return '32-40';
    if (scoreLevel === 'high') return '24-31';
    if (scoreLevel === 'average') return '16-23';
    return '0-15';
  };

  const getBgColor = () => {
    if (scoreLevel === 'very_high') return 'from-purple-50 to-indigo-50 border-purple-200';
    if (scoreLevel === 'high') return 'from-indigo-50 to-blue-50 border-indigo-200';
    if (scoreLevel === 'low') return 'from-blue-50 to-cyan-50 border-blue-200';
    return 'from-gray-50 to-slate-50 border-gray-200';
  };

  const getLevelBadgeColor = () => {
    if (scoreLevel === 'very_high') return 'bg-purple-100 text-purple-800';
    if (scoreLevel === 'high') return 'bg-indigo-100 text-indigo-800';
    if (scoreLevel === 'low') return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className={`excalidraw-card bg-gradient-to-br ${getBgColor()} ${typeScore.isTopInterest ? 'ring-4 ring-purple-300' : ''}`}>
      {/* Header */}
      <div className="p-6 border-b-2 border-gray-800">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-full border-3 border-gray-800 flex items-center justify-center text-2xl"
              style={{ backgroundColor: tData.color }}
            >
              {tData.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-gray-800">{tData.name}</h2>
                <span className="text-gray-500">({tData.nameEn})</span>
                {typeScore.isTopInterest && (
                  <span className="px-2 py-0.5 bg-purple-200 border-2 border-purple-400 rounded-full text-xs font-bold text-purple-800">
                    ⭐ 核心兴趣
                  </span>
                )}
                <InfoIcon
                  title={tData.name}
                  content={
                    <div className="space-y-4">
                      <p className="text-gray-700">{tData.overview}</p>
                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-800"><strong>简述：</strong>{tData.tagline}</p>
                      </div>
                    </div>
                  }
                />
              </div>
              <p className="text-gray-600 text-sm mt-1">{tData.tagline}</p>
            </div>
          </div>
        </div>

        {/* Scores */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-white p-3 rounded-xl border-2 border-gray-800 text-center">
            <div className="text-2xl font-bold text-gray-800">{typeScore.rawScore}/40</div>
            <div className="text-xs text-gray-600 mt-1">
              原始分
              <InfoIcon
                title="原始分"
                size="sm"
                content="原始分是您在该兴趣类型10道题目的总分。每题0-4分，总分范围为0-40分。得分越高表示该类型兴趣越强。"
              />
            </div>
          </div>
          <div className="bg-white p-3 rounded-xl border-2 border-gray-800 text-center">
            <div className="text-2xl font-bold text-gray-800">{typeScore.percentage}%</div>
            <div className="text-xs text-gray-600 mt-1">
              百分比
              <InfoIcon
                title="百分比"
                size="sm"
                content="百分比将您的原始分转换为0-100%的标准化尺度，便于直观比较不同兴趣类型的相对强弱。"
              />
            </div>
          </div>
        </div>

        {/* Score Interpretation */}
        <div className="mt-4 p-4 bg-white rounded-xl border-2 border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-bold text-gray-800">兴趣水平：</span>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getLevelBadgeColor()}`}>
              {getLevelLabel(scoreLevel)}
            </span>
            <span className="text-sm text-gray-600">({getScoreRange()}分)</span>
          </div>
          <p className="text-gray-700">
            {getTypeInterpretation(typeScore.typeId, typeScore.level)}
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
            {(tConfig as any).careers.map((career: string, idx: number) => (
              <span
                key={idx}
                className="px-3 py-1 bg-white border-2 border-gray-800 rounded-full text-sm text-gray-700"
              >
                {career}
              </span>
            ))}
          </div>
        </div>

        {/* Traits - always show */}
        {tData.characteristics?.traits && (
          <div>
            <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              🎯 特征表现
            </h3>
            <div className="flex flex-wrap gap-2">
              {tData.characteristics.traits.slice(0, 6).map((trait: string, idx: number) => (
                <span key={idx} className="px-3 py-1 bg-white border-2 border-gray-800 rounded-full text-sm text-gray-700">
                  {trait}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Strengths - show for high interest levels */}
        {(scoreLevel === 'very_high' || scoreLevel === 'high') && tData.strengths?.list && (
          <div>
            <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              ✨ 优势能力
            </h3>
            <div className="bg-white p-3 rounded-xl border-2 border-green-300">
              <ul className="space-y-1">
                {tData.strengths.list.map((strength: string, idx: number) => (
                  <li key={idx} className="text-gray-700 text-sm flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Development suggestions */}
        {tData.development?.suggestions && (
          <div>
            <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              📈 发展建议
            </h3>
            <div className="bg-white p-3 rounded-xl border-2 border-purple-300">
              <ul className="space-y-2">
                {tData.development.suggestions.slice(0, 4).map((tip: string, idx: number) => (
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
    </div>
  );
};

export default TypeCard;

import React from 'react';
import type { TypeScore } from '../../types';
import { InfoIcon } from '../InfoIcon';
import { getLevelLabel } from '../../utils/scoring';

interface TypeCardProps {
  typeScore: TypeScore;
  typeProfile: any;
}

const TypeCard: React.FC<TypeCardProps> = ({ typeScore, typeProfile }) => {
  const getBgColorClass = () => {
    switch (typeScore.triad) {
      case 'gut': return 'from-amber-50 to-orange-50';
      case 'heart': return 'from-rose-50 to-pink-50';
      case 'head': return 'from-blue-50 to-indigo-50';
      default: return 'from-gray-50 to-gray-100';
    }
  };

  const getBorderColorClass = () => {
    switch (typeScore.triad) {
      case 'gut': return 'border-amber-200';
      case 'heart': return 'border-rose-200';
      case 'head': return 'border-blue-200';
      default: return 'border-gray-200';
    }
  };

  return (
    <div className={`bg-gradient-to-r ${getBgColorClass()} p-6 rounded-xl border-2 ${getBorderColorClass()}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">{typeProfile.icon}</span>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                类型 {typeScore.typeId} - {typeScore.typeName}
                {typeScore.isPrimary && (
                  <span className="text-sm px-2 py-1 bg-yellow-200 border-2 border-yellow-400 rounded-full">
                    主导类型
                  </span>
                )}
                <InfoIcon
                  title={`类型${typeScore.typeId} - ${typeScore.typeName}`}
                  content={
                    <div className="space-y-3">
                      <p className="text-gray-700">{typeProfile.fullDescription}</p>
                      <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-200">
                        <p className="text-indigo-800 font-medium">
                          情感中心：{typeScore.triad === 'gut' ? '本能中心' : typeScore.triad === 'heart' ? '情感中心' : '思维中心'}
                        </p>
                      </div>
                    </div>
                  }
                />
              </h3>
              <p className="text-gray-600">{typeScore.typeNameEn}</p>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-gray-800">{typeScore.rawScore}</div>
          <div className="text-sm text-gray-600">分数</div>
          <div className="text-sm text-gray-500 mt-1">{typeScore.percentage}%</div>
          <div className="mt-2 px-3 py-1 bg-white border-2 border-gray-300 rounded-full text-sm">
            {getLevelLabel(typeScore.level)}
          </div>
        </div>
      </div>

      {typeScore.isPrimary && (
        <>
          {/* Core Motivation */}
          <div className="mb-4 bg-white p-4 rounded-lg border-2 border-gray-200">
            <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              <span>🎯</span>
              核心动机
            </h4>
            <p className="text-gray-700">{typeProfile.coreMotivation}</p>
          </div>

          {/* Core Fear */}
          <div className="mb-4 bg-white p-4 rounded-lg border-2 border-gray-200">
            <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              <span>😰</span>
              核心恐惧
            </h4>
            <p className="text-gray-700">{typeProfile.coreFear}</p>
          </div>

          {/* Core Desire */}
          <div className="mb-4 bg-white p-4 rounded-lg border-2 border-gray-200">
            <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              <span>💝</span>
              核心渴望
            </h4>
            <p className="text-gray-700">{typeProfile.coreDesire}</p>
          </div>

          {/* Strengths */}
          <div className="mb-4 bg-white p-4 rounded-lg border-2 border-gray-200">
            <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span>✨</span>
              主要优势
            </h4>
            <ul className="space-y-2">
              {typeProfile.strengths.map((strength: string, idx: number) => (
                <li key={idx} className="text-gray-700 flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses */}
          <div className="mb-4 bg-white p-4 rounded-lg border-2 border-gray-200">
            <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span>⚠️</span>
              成长空间
            </h4>
            <ul className="space-y-2">
              {typeProfile.weaknesses.map((weakness: string, idx: number) => (
                <li key={idx} className="text-gray-700 flex items-start gap-2">
                  <span className="text-orange-500 mt-1">•</span>
                  <span>{weakness}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Wing Explanation */}
          {typeScore.wing && (
            <div className="mb-4 bg-white p-4 rounded-lg border-2 border-gray-200">
              <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                <span>🦋</span>
                侧翼类型: {typeScore.wing}
              </h4>
              <p className="text-gray-700">
                您的侧翼是类型{typeScore.wing}。侧翼是您主导类型相邻的类型，它会影响和调节您的核心类型特征，使您的性格更加丰富和独特。
              </p>
            </div>
          )}

          {/* Development Path */}
          <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
            <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span>🌱</span>
              成长建议
            </h4>
            <ul className="space-y-2">
              {typeProfile.developmentPath.map((suggestion: string, idx: number) => (
                <li key={idx} className="text-gray-700 flex items-start gap-2">
                  <span className="text-indigo-500 mt-1">→</span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      {!typeScore.isPrimary && (
        <div className="bg-white p-3 rounded-lg border-2 border-gray-200">
          <p className="text-gray-600 text-sm">{typeProfile.brief}</p>
        </div>
      )}
    </div>
  );
};

export default TypeCard;

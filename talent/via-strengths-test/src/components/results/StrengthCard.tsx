import React, { useState } from 'react';
import type { StrengthScore } from '../../types';
import { getVirtueColor, getVirtueLabel } from '../../utils/scoring';
import { InfoIcon } from '../InfoIcon';

interface StrengthCardProps {
  strength: StrengthScore;
  profile?: any; // strength profile from strength-profiles.json
}

const StrengthCard: React.FC<StrengthCardProps> = ({ strength, profile }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!profile) {
    return (
      <div
        className="excalidraw-card bg-white border-l-4"
        style={{ borderLeftColor: getVirtueColor(strength.virtue) }}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-bold text-gray-800">{strength.strengthName}</h3>
              <span className="text-sm text-gray-500">({strength.strengthNameEn})</span>
              {strength.isSignature && (
                <span className="px-2 py-0.5 bg-yellow-200 text-yellow-800 text-xs font-semibold rounded-full border border-yellow-400">
                  ⭐ 标志性优势
                </span>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>美德：{getVirtueLabel(strength.virtue)}</span>
              <span>排名：第 {strength.rank} 名</span>
              <span>得分：{strength.rawScore}/25 ({strength.percentage}%)</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="excalidraw-card bg-white border-l-4 hover:shadow-xl transition-shadow"
      style={{ borderLeftColor: getVirtueColor(strength.virtue) }}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors"
      >
        <div className="flex-1 text-left">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-bold text-gray-800">{strength.strengthName}</h3>
            <span className="text-sm text-gray-500">({strength.strengthNameEn})</span>
            {strength.isSignature && (
              <span className="px-2 py-0.5 bg-yellow-200 text-yellow-800 text-xs font-semibold rounded-full border border-yellow-400">
                ⭐ 标志性优势
              </span>
            )}
            <InfoIcon
              title={strength.strengthName}
              content={profile.description}
            />
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span
              className="px-2 py-0.5 rounded text-white font-medium"
              style={{ backgroundColor: getVirtueColor(strength.virtue) }}
            >
              {getVirtueLabel(strength.virtue)}
            </span>
            <span className="font-semibold">排名：第 {strength.rank} 名</span>
            <span>得分：{strength.rawScore}/25 ({strength.percentage}%)</span>
          </div>
        </div>
        <span className="text-2xl transform transition-transform duration-200 ml-4"
          style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          ▼
        </span>
      </button>

      {isExpanded && profile && (
        <div className="px-4 pb-4 space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h4 className="font-semibold text-gray-800 mb-2">描述</h4>
            <p className="text-gray-700 text-sm leading-relaxed">{profile.description}</p>
          </div>

          {profile.benefits && (
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-900 mb-2">优势与益处</h4>
              <ul className="space-y-1">
                {profile.benefits.map((benefit: string, idx: number) => (
                  <li key={idx} className="text-green-800 text-sm flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {profile.examples && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">实践示例</h4>
              <ul className="space-y-1">
                {profile.examples.map((example: string, idx: number) => (
                  <li key={idx} className="text-blue-800 text-sm flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>{example}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {profile.developmentTips && (
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h4 className="font-semibold text-purple-900 mb-2">发展建议</h4>
              <ul className="space-y-1">
                {profile.developmentTips.map((tip: string, idx: number) => (
                  <li key={idx} className="text-purple-800 text-sm flex items-start gap-2">
                    <span className="text-purple-500 mt-0.5">💡</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StrengthCard;

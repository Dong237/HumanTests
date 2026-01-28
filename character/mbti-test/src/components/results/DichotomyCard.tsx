import React, { useState } from 'react';
import { InfoIcon } from '../InfoIcon';
import type { DichotomyScore } from '../../types';
import { getClarityLabel } from '../../utils/scoring';
import scoringConfig from '../../data/mbti-scoring.json';

interface DichotomyCardProps {
  score: DichotomyScore;
}

const DichotomyCard: React.FC<DichotomyCardProps> = ({ score }) => {
  const [expanded, setExpanded] = useState(false);

  const config = (scoringConfig.dichotomies as any)[score.dichotomy];
  const poles = config.poles;
  const preferredPole = poles[score.preference];
  const nonPreferredPole = poles[score.preference === score.firstPole ? score.secondPole : score.firstPole];

  const getClarityBadgeColor = () => {
    switch (score.clarity) {
      case 'very_clear': return 'bg-purple-200 text-purple-800';
      case 'clear': return 'bg-indigo-200 text-indigo-800';
      case 'moderate': return 'bg-blue-200 text-blue-800';
      case 'slight': return 'bg-gray-200 text-gray-800';
    }
  };

  const preferredPercentage = score.preference === score.firstPole
    ? score.firstPoleScore
    : score.secondPoleScore;

  return (
    <div className="excalidraw-card bg-gradient-to-br from-purple-50 to-indigo-50">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full border-3 border-gray-800 bg-purple-100 flex items-center justify-center text-2xl">
            {preferredPole.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-gray-800">{score.dichotomyName}</h3>
              <span className="text-gray-500 text-sm">({score.dichotomyNameEn})</span>
              <InfoIcon
                title={score.dichotomyName}
                content={
                  <div className="space-y-3">
                    <p className="text-gray-700">
                      {score.dichotomyName}维度衡量的是{poles[score.firstPole].label}与{poles[score.secondPole].label}之间的偏好。
                      您的得分显示您偏好{preferredPole.label}（{score.preference}），
                      偏好强度为{getClarityLabel(score.clarity)}。
                    </p>
                    <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                      <p className="text-purple-800 font-medium">{preferredPole.icon} {preferredPole.label}: {preferredPole.description}</p>
                    </div>
                    <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-200">
                      <p className="text-indigo-800 font-medium">{nonPreferredPole.icon} {nonPreferredPole.label}: {nonPreferredPole.description}</p>
                    </div>
                  </div>
                }
              />
            </div>
            <p className="text-gray-600 text-sm mt-1">
              偏好：<span className="font-semibold text-purple-700">{preferredPole.label} ({score.preference})</span>
            </p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getClarityBadgeColor()}`}>
          {getClarityLabel(score.clarity)}
        </span>
      </div>

      {/* Percentage Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="font-semibold text-purple-700">
            {poles[score.firstPole].icon} {poles[score.firstPole].label} ({score.firstPole})
          </span>
          <span className="font-semibold text-indigo-700">
            {poles[score.secondPole].icon} {poles[score.secondPole].label} ({score.secondPole})
          </span>
        </div>
        <div className="h-6 rounded-full border-2 border-gray-800 overflow-hidden flex">
          <div
            className="bg-gradient-to-r from-purple-400 to-purple-500 flex items-center justify-center text-xs font-bold text-white transition-all duration-500"
            style={{ width: `${score.firstPoleScore}%` }}
          >
            {score.firstPoleScore}%
          </div>
          <div
            className="bg-gradient-to-r from-indigo-400 to-indigo-500 flex items-center justify-center text-xs font-bold text-white transition-all duration-500"
            style={{ width: `${score.secondPoleScore}%` }}
          >
            {score.secondPoleScore}%
          </div>
        </div>
      </div>

      {/* Preferred Pole Description */}
      <div className="bg-white p-4 rounded-xl border-2 border-purple-200 mb-3">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">{preferredPole.icon}</span>
          <h4 className="font-bold text-gray-800">
            您的偏好：{preferredPole.label} ({score.preference}) — {preferredPercentage}%
          </h4>
        </div>
        <p className="text-gray-700 text-sm leading-relaxed">{preferredPole.description}</p>
      </div>

      {/* Expandable: Show both poles */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-center text-sm text-purple-600 hover:text-purple-800 transition-colors py-2"
      >
        {expanded ? '收起详情 ▲' : '查看两极详情 ▼'}
      </button>

      {expanded && (
        <div className="space-y-3 mt-2">
          <div className="bg-purple-50 p-4 rounded-xl border-2 border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{poles[score.firstPole].icon}</span>
              <h4 className="font-bold text-purple-800">
                {poles[score.firstPole].label} ({score.firstPole}) — {poles[score.firstPole].labelEn}
              </h4>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">{poles[score.firstPole].description}</p>
          </div>
          <div className="bg-indigo-50 p-4 rounded-xl border-2 border-indigo-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{poles[score.secondPole].icon}</span>
              <h4 className="font-bold text-indigo-800">
                {poles[score.secondPole].label} ({score.secondPole}) — {poles[score.secondPole].labelEn}
              </h4>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">{poles[score.secondPole].description}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DichotomyCard;

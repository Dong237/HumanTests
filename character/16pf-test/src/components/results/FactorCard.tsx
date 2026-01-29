import React from 'react';
import type { FactorScore } from '../../types';
import { InfoIcon } from '../InfoIcon';
import { getFactorInterpretation } from '../../utils/scoring';

interface FactorCardProps {
  factorScore: FactorScore;
  factorProfile: any;
}

const FactorCard: React.FC<FactorCardProps> = ({ factorScore, factorProfile }) => {
  const { factorId, factorName, factorNameEn, stenScore, lowLabel, highLabel, level } = factorScore;

  // Get level-specific description
  const levelDescription = factorProfile?.levels?.[level] || getFactorInterpretation(factorId, level);

  // Get color based on level
  const getLevelColor = () => {
    if (level === 'low') return 'bg-blue-50 border-blue-200';
    if (level === 'high') return 'bg-orange-50 border-orange-200';
    return 'bg-gray-50 border-gray-200';
  };

  const getLevelBadge = () => {
    if (level === 'low') return 'bg-blue-100 text-blue-800 border-blue-300';
    if (level === 'high') return 'bg-orange-100 text-orange-800 border-orange-300';
    return 'bg-gray-100 text-gray-800 border-gray-300';
  };

  return (
    <div className={`excalidraw-card ${getLevelColor()}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold text-teal-700">{factorId}</span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-gray-800">{factorName}</h3>
              <InfoIcon
                title={`${factorId} - ${factorName} (${factorNameEn})`}
                content={
                  <div className="space-y-3">
                    <p className="text-gray-700">{factorProfile?.fullDescription || `${factorName}人格因子`}</p>
                    <div className="bg-teal-50 p-3 rounded-lg border border-teal-200">
                      <p className="text-teal-800 text-sm">
                        <strong>低分极:</strong> {lowLabel}<br />
                        <strong>高分极:</strong> {highLabel}
                      </p>
                    </div>
                    {factorProfile?.characteristics && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <h4 className="font-semibold text-gray-700 mb-2">典型特征</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {factorProfile.characteristics.map((char: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-teal-500">•</span>
                              <span>{char}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                }
              />
            </div>
            <p className="text-sm text-gray-600">{factorNameEn}</p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full border-2 font-semibold text-sm ${getLevelBadge()}`}>
          Sten: {stenScore}
        </div>
      </div>

      {/* Bipolar Scale */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span className="font-medium">{lowLabel}</span>
          <span className="font-medium">{highLabel}</span>
        </div>
        <div className="relative h-6 bg-gray-200 rounded-lg border-2 border-gray-800 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-200 via-white to-orange-200" />
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-400" />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-teal-500
              border-2 border-gray-800 shadow-lg transition-all"
            style={{ left: `calc(${((stenScore - 1) / 9) * 100}% - 10px)` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-0.5">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((sten) => (
            <span key={sten} className={stenScore === sten ? 'font-bold text-teal-600' : ''}>
              {sten}
            </span>
          ))}
        </div>
      </div>

      {/* Level Description */}
      <div className="bg-white p-4 rounded-xl border-2 border-gray-300">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-semibold text-gray-700">
            您的得分水平: {level === 'low' ? '偏低' : level === 'high' ? '偏高' : '中等'}
          </span>
        </div>
        <p className="text-gray-700 text-sm leading-relaxed">{levelDescription}</p>
      </div>

      {/* Additional Insights */}
      {factorProfile?.implications && factorProfile.implications[level] && (
        <div className="mt-3 bg-teal-50 p-3 rounded-xl border-2 border-teal-200">
          <h4 className="font-semibold text-teal-900 text-sm mb-1">职业与生活启示</h4>
          <p className="text-teal-800 text-sm">{factorProfile.implications[level]}</p>
        </div>
      )}
    </div>
  );
};

export default FactorCard;

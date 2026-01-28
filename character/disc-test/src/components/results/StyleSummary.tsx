import React from 'react';
import type { DimensionScore } from '../../types';
import scoringConfig from '../../data/disc-scoring.json';

interface StyleSummaryProps {
  dimensionScores: DimensionScore[];
  discPattern: string;
}

export const StyleSummary: React.FC<StyleSummaryProps> = ({ dimensionScores, discPattern }) => {
  const primary = dimensionScores.find((d) => d.isPrimary);
  const secondary = dimensionScores.find((d) => d.isSecondary);

  const getPrimaryConfig = () => {
    if (!primary) return null;
    return (scoringConfig.dimensions as any)[primary.dimensionId];
  };

  const getSecondaryConfig = () => {
    if (!secondary) return null;
    return (scoringConfig.dimensions as any)[secondary.dimensionId];
  };

  const primaryConfig = getPrimaryConfig();
  const secondaryConfig = getSecondaryConfig();

  return (
    <div className="excalidraw-card mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        您的DISC风格模式
      </h2>

      {/* Pattern Display */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-100 to-orange-100
          rounded-2xl border-3 border-gray-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <span className="text-5xl font-bold text-gray-800">{discPattern}</span>
        </div>
        <p className="text-gray-600 mt-3">
          主导风格: {primary?.dimensionName} | 次要风格: {secondary?.dimensionName}
        </p>
      </div>

      {/* Primary Style */}
      {primaryConfig && primary && (
        <div className="mb-6 p-6 rounded-xl border-2 border-gray-800 bg-amber-50">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">{primaryConfig.icon}</span>
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                主导风格: {primaryConfig.name}
              </h3>
              <p className="text-sm text-gray-600">{primaryConfig.nameEn}</p>
            </div>
            <span className="ml-auto text-2xl font-bold text-amber-600">
              {primary.rawScore}分
            </span>
          </div>
          <p className="text-gray-700">{primaryConfig.description}</p>
        </div>
      )}

      {/* Secondary Style */}
      {secondaryConfig && secondary && (
        <div className="p-6 rounded-xl border-2 border-gray-300 bg-gray-50">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{secondaryConfig.icon}</span>
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                次要风格: {secondaryConfig.name}
              </h3>
              <p className="text-sm text-gray-600">{secondaryConfig.nameEn}</p>
            </div>
            <span className="ml-auto text-xl font-bold text-gray-600">
              {secondary.rawScore}分
            </span>
          </div>
          <p className="text-gray-600 text-sm">{secondaryConfig.description}</p>
        </div>
      )}

      {/* Career Recommendations */}
      {primaryConfig && (
        <div className="mt-6 p-4 bg-white rounded-xl border-2 border-gray-300">
          <h4 className="font-bold text-gray-800 mb-2">适合的职业方向</h4>
          <div className="flex flex-wrap gap-2">
            {primaryConfig.careers.map((career: string, index: number) => (
              <span
                key={index}
                className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium"
              >
                {career}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StyleSummary;

import React from 'react';
import type { DimensionScore } from '../../types';
import scoringConfig from '../../data/dips-scoring.json';

interface TalentSummaryProps {
  topTalents: DimensionScore[];
  allScores: DimensionScore[];
}

const TalentSummary: React.FC<TalentSummaryProps> = ({ topTalents, allScores }) => {
  const getDimConfig = (dimId: string) => {
    return scoringConfig.dimensions[dimId as keyof typeof scoringConfig.dimensions] as {
      name: string;
      nameEn: string;
      icon: string;
      color: string;
      careers: string[];
    };
  };

  // Create talent DNA string
  const talentDNA = topTalents.map(t => getDimConfig(t.dimensionId).name.replace('天赋', '')).join(' + ');

  return (
    <div className="excalidraw-card bg-gradient-to-br from-amber-50 to-orange-50">
      <h2 className="text-3xl font-bold mb-2 text-gray-800 flex items-center gap-3">
        <span>🏆</span>
        您的核心天赋
      </h2>
      <p className="text-gray-600 mb-6">基于测试结果，以下是您最突出的天赋方向</p>

      {/* Talent DNA */}
      <div className="bg-white p-4 rounded-xl border-2 border-amber-300 mb-6 text-center">
        <p className="text-sm text-amber-700 mb-1">您的天赋DNA</p>
        <p className="text-2xl font-bold text-amber-900">{talentDNA}</p>
      </div>

      {/* Top Talents Podium */}
      <div className="space-y-4 mb-6">
        {topTalents.map((talent, idx) => {
          const config = getDimConfig(talent.dimensionId);
          return (
            <div
              key={talent.dimensionId}
              className="bg-white p-5 rounded-xl border-2 border-gray-800 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div
                    className="w-14 h-14 rounded-full border-3 border-gray-800 flex items-center justify-center text-2xl"
                    style={{ backgroundColor: config.color }}
                  >
                    {config.icon}
                  </div>
                  <div className="text-center mt-1">
                    <span className="text-xs font-bold text-amber-700">
                      #{idx + 1}
                    </span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-bold text-gray-800">{config.name}</h3>
                    <span className="text-sm text-gray-500">({config.nameEn})</span>
                  </div>
                  {/* Score bar */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex-1 bg-gray-200 h-3 rounded-full border border-gray-800 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${talent.percentage}%`,
                          backgroundColor: config.color,
                        }}
                      />
                    </div>
                    <span className="font-bold text-gray-800 text-lg">{talent.rawScore}/20</span>
                  </div>
                  {/* Career tags */}
                  <div className="flex flex-wrap gap-2">
                    {config.careers.slice(0, 5).map((career, cIdx) => (
                      <span
                        key={cIdx}
                        className="px-3 py-1 rounded-full text-xs font-medium border-2 border-gray-800"
                        style={{ backgroundColor: `${config.color}40` }}
                      >
                        {career}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick overview of all dimensions */}
      <div className="bg-white p-4 rounded-xl border-2 border-gray-300">
        <h4 className="font-bold text-gray-700 mb-3">全部天赋概览</h4>
        <div className="space-y-2">
          {allScores
            .sort((a, b) => b.rawScore - a.rawScore)
            .map((dim) => {
              const config = getDimConfig(dim.dimensionId);
              return (
                <div key={dim.dimensionId} className="flex items-center gap-2">
                  <span className="text-sm w-6">{config.icon}</span>
                  <span className="text-sm text-gray-700 w-28 truncate">{config.name}</span>
                  <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${dim.percentage}%`,
                        backgroundColor: config.color,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-600 w-10 text-right">{dim.rawScore}</span>
                  {dim.isTopTalent && <span className="text-xs">⭐</span>}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default TalentSummary;

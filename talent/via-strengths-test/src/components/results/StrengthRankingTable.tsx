import React from 'react';
import type { StrengthScore } from '../../types';
import { getVirtueColor, getVirtueLabel } from '../../utils/scoring';

interface StrengthRankingTableProps {
  strengthScores: StrengthScore[];
}

const StrengthRankingTable: React.FC<StrengthRankingTableProps> = ({ strengthScores }) => {
  // Group by virtue for organized display
  const groupedByVirtue = strengthScores.reduce((acc, score) => {
    if (!acc[score.virtue]) {
      acc[score.virtue] = [];
    }
    acc[score.virtue].push(score);
    return acc;
  }, {} as Record<string, StrengthScore[]>);

  const virtueOrder = ['wisdom', 'courage', 'humanity', 'justice', 'temperance', 'transcendence'];

  return (
    <div className="w-full">
      {/* Table Header */}
      <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-t-xl border-2 border-gray-800 overflow-hidden">
        <div className="grid grid-cols-12 gap-2 p-4 font-bold text-gray-800 text-sm">
          <div className="col-span-1 text-center">排名</div>
          <div className="col-span-3">品格优势</div>
          <div className="col-span-3">英文名称</div>
          <div className="col-span-2">美德</div>
          <div className="col-span-2 text-center">得分</div>
          <div className="col-span-1 text-center">标志</div>
        </div>
      </div>

      {/* Table Body - Grouped by Virtue */}
      <div className="border-2 border-t-0 border-gray-800 rounded-b-xl overflow-hidden">
        {virtueOrder.map((virtue) => {
          const virtueStrengths = groupedByVirtue[virtue] || [];
          if (virtueStrengths.length === 0) return null;

          return (
            <div key={virtue}>
              {/* Virtue Section Header */}
              <div
                className="p-2 font-semibold text-white text-sm flex items-center gap-2"
                style={{ backgroundColor: getVirtueColor(virtue) }}
              >
                <span>{getVirtueLabel(virtue)}</span>
                <span className="text-xs opacity-80">({virtueStrengths.length}项)</span>
              </div>

              {/* Strengths in this virtue */}
              {virtueStrengths.map((strength, idx) => (
                <div
                  key={strength.strengthId}
                  className={`grid grid-cols-12 gap-2 p-3 text-sm hover:bg-gray-50 transition-colors ${
                    idx !== virtueStrengths.length - 1 ? 'border-b border-gray-200' : ''
                  } ${strength.isSignature ? 'bg-yellow-50' : ''}`}
                >
                  {/* Rank */}
                  <div className="col-span-1 text-center">
                    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full font-bold ${
                      strength.rank === 1 ? 'bg-yellow-400 text-yellow-900' :
                      strength.rank === 2 ? 'bg-gray-300 text-gray-800' :
                      strength.rank === 3 ? 'bg-orange-400 text-orange-900' :
                      strength.isSignature ? 'bg-blue-200 text-blue-900' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {strength.rank}
                    </span>
                  </div>

                  {/* Strength Name */}
                  <div className="col-span-3 font-medium text-gray-800">
                    {strength.strengthName}
                  </div>

                  {/* English Name */}
                  <div className="col-span-3 text-gray-600 italic">
                    {strength.strengthNameEn}
                  </div>

                  {/* Virtue */}
                  <div className="col-span-2">
                    <span
                      className="inline-block px-2 py-0.5 rounded text-white text-xs font-medium"
                      style={{ backgroundColor: getVirtueColor(strength.virtue) }}
                    >
                      {getVirtueLabel(strength.virtue)}
                    </span>
                  </div>

                  {/* Score */}
                  <div className="col-span-2 text-center">
                    <span className="font-bold text-indigo-600">
                      {strength.rawScore}/25
                    </span>
                    <span className="text-xs text-gray-500 ml-1">
                      ({strength.percentage}%)
                    </span>
                  </div>

                  {/* Signature Badge */}
                  <div className="col-span-1 text-center">
                    {strength.isSignature && (
                      <span className="text-xl" title="标志性优势">⭐</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 p-4 bg-gray-50 rounded-xl border-2 border-gray-300">
        <div className="flex flex-wrap gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 bg-yellow-400 rounded-full border border-yellow-600"></span>
            <span>第1名</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 bg-gray-300 rounded-full border border-gray-500"></span>
            <span>第2名</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 bg-orange-400 rounded-full border border-orange-600"></span>
            <span>第3名</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">⭐</span>
            <span>标志性优势（前5名）</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrengthRankingTable;

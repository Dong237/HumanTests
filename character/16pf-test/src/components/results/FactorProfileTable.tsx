import React from 'react';
import type { FactorScore } from '../../types';

interface FactorProfileTableProps {
  factorScores: FactorScore[];
}

const FactorProfileTable: React.FC<FactorProfileTableProps> = ({ factorScores }) => {
  const getLevelColor = (level: string) => {
    if (level === 'low') return 'text-blue-700 bg-blue-100';
    if (level === 'high') return 'text-orange-700 bg-orange-100';
    return 'text-gray-700 bg-gray-100';
  };

  const getLevelLabel = (level: string) => {
    if (level === 'low') return '偏低';
    if (level === 'high') return '偏高';
    return '中等';
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-2 border-gray-800">
        <thead>
          <tr className="bg-teal-100 border-b-2 border-gray-800">
            <th className="px-4 py-3 text-left font-bold text-gray-800 border-r-2 border-gray-800">因子</th>
            <th className="px-4 py-3 text-left font-bold text-gray-800 border-r-2 border-gray-800">名称</th>
            <th className="px-4 py-3 text-center font-bold text-gray-800 border-r-2 border-gray-800">Sten</th>
            <th className="px-4 py-3 text-left font-bold text-gray-800 border-r-2 border-gray-800">双极描述</th>
            <th className="px-4 py-3 text-center font-bold text-gray-800">水平</th>
          </tr>
        </thead>
        <tbody>
          {factorScores.map((factor, index) => (
            <tr
              key={factor.factorId}
              className={`border-b-2 border-gray-800 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
            >
              <td className="px-4 py-3 font-bold text-teal-700 border-r-2 border-gray-800">
                {factor.factorId}
              </td>
              <td className="px-4 py-3 border-r-2 border-gray-800">
                <div className="font-medium text-gray-800">{factor.factorName}</div>
                <div className="text-xs text-gray-600">{factor.factorNameEn}</div>
              </td>
              <td className="px-4 py-3 text-center font-bold text-teal-700 border-r-2 border-gray-800">
                {factor.stenScore}
              </td>
              <td className="px-4 py-3 border-r-2 border-gray-800">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-blue-700">{factor.lowLabel}</span>
                  <div className="flex-1 relative h-4 bg-gray-200 rounded border border-gray-400">
                    <div
                      className="absolute top-0 bottom-0 w-1 bg-teal-500 border border-gray-800 rounded"
                      style={{ left: `calc(${((factor.stenScore - 1) / 9) * 100}% - 2px)` }}
                    />
                  </div>
                  <span className="text-orange-700">{factor.highLabel}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-center">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getLevelColor(factor.level)}`}>
                  {getLevelLabel(factor.level)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FactorProfileTable;

import React from 'react';
import type { FactorScore } from '../../types';

interface BipolarScalesProps {
  scores: FactorScore[];
}

const BipolarScales: React.FC<BipolarScalesProps> = ({ scores }) => {
  // Color palette for factors
  const getFactorColor = (index: number): string => {
    const colors = [
      'bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-yellow-500',
      'bg-lime-500', 'bg-green-500', 'bg-emerald-500', 'bg-teal-500',
      'bg-cyan-500', 'bg-sky-500', 'bg-blue-500', 'bg-indigo-500',
      'bg-violet-500', 'bg-purple-500', 'bg-fuchsia-500', 'bg-pink-500',
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="space-y-4">
      {scores.map((factor, index) => {
        // Calculate position (sten 1-10 mapped to 0-100%)
        const position = ((factor.stenScore - 1) / 9) * 100;

        return (
          <div key={factor.factorId} className="space-y-1">
            {/* Factor Label */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-800 w-8">{factor.factorId}</span>
                <span className="text-sm font-medium text-gray-700">{factor.factorName}</span>
              </div>
              <span className="text-sm font-bold text-teal-700">
                Sten: {factor.stenScore}
              </span>
            </div>

            {/* Bipolar Scale */}
            <div className="relative">
              {/* Low and High Labels */}
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span className="max-w-[45%] text-left">{factor.lowLabel}</span>
                <span className="max-w-[45%] text-right">{factor.highLabel}</span>
              </div>

              {/* Scale Bar */}
              <div className="relative h-8 bg-gray-200 rounded-lg border-2 border-gray-800 overflow-hidden">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-100 via-white to-orange-100" />

                {/* Midpoint line */}
                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-400 z-10" />

                {/* Score dot */}
                <div
                  className={`absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full ${getFactorColor(index)}
                    border-3 border-gray-800 shadow-lg z-20 transition-all duration-300`}
                  style={{ left: `calc(${position}% - 12px)` }}
                />
              </div>

              {/* Sten scale markers */}
              <div className="flex justify-between text-xs text-gray-400 mt-0.5 px-1">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((sten) => (
                  <span key={sten} className={factor.stenScore === sten ? 'font-bold text-teal-600' : ''}>
                    {sten}
                  </span>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BipolarScales;

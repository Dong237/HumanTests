import React from 'react';
import type { StrengthScore } from '../../types';
import { getVirtueColor } from '../../utils/scoring';

interface SignaturePodiumProps {
  signatureStrengths: StrengthScore[];
}

const SignaturePodium: React.FC<SignaturePodiumProps> = ({ signatureStrengths }) => {
  // Top 5 signature strengths
  const top5 = signatureStrengths.slice(0, 5);

  // Podium heights (percentages)
  const podiumHeights = [85, 100, 70, 55, 40]; // 2nd, 1st, 3rd, 4th, 5th

  // Podium colors
  const podiumColors = [
    'bg-gradient-to-t from-gray-300 to-gray-400', // 2nd - Silver
    'bg-gradient-to-t from-yellow-400 to-yellow-500', // 1st - Gold
    'bg-gradient-to-t from-orange-400 to-orange-500', // 3rd - Bronze
    'bg-gradient-to-t from-blue-300 to-blue-400', // 4th - Blue
    'bg-gradient-to-t from-purple-300 to-purple-400', // 5th - Purple
  ];

  const rankLabels = ['🥈 2nd', '🥇 1st', '🥉 3rd', '4th', '5th'];
  const displayOrder = [1, 0, 2, 3, 4]; // Rearrange for podium effect (2nd, 1st, 3rd, 4th, 5th)

  return (
    <div className="w-full py-8">
      <div className="flex items-end justify-center gap-2 md:gap-4">
        {displayOrder.map((index) => {
          const strength = top5[index];
          if (!strength) return null;

          const height = podiumHeights[index];
          const color = podiumColors[index];
          const label = rankLabels[index];

          return (
            <div
              key={strength.strengthId}
              className="flex flex-col items-center"
              style={{ width: '18%', minWidth: '100px' }}
            >
              {/* Strength name and score above podium */}
              <div className="mb-2 text-center">
                <div
                  className="inline-block px-3 py-1 rounded-full text-white font-bold text-xs mb-1"
                  style={{ backgroundColor: getVirtueColor(strength.virtue) }}
                >
                  {label}
                </div>
                <p className="font-bold text-gray-800 text-sm leading-tight mb-1">
                  {strength.strengthName}
                </p>
                <p className="text-xs text-gray-600">{strength.strengthNameEn}</p>
                <p className="text-sm font-semibold text-indigo-600 mt-1">
                  {strength.rawScore}/25
                </p>
                <p className="text-xs text-gray-500">{strength.percentage}%</p>
              </div>

              {/* Podium bar */}
              <div
                className={`w-full ${color} rounded-t-xl border-2 border-gray-800 flex items-end justify-center pb-3 transition-all duration-300 hover:scale-105 shadow-lg`}
                style={{ height: `${height}px` }}
              >
                <span className="text-white font-bold text-lg drop-shadow-md">
                  #{strength.rank}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Base line */}
      <div className="w-full h-2 bg-gray-300 border-2 border-gray-800 mt-0 rounded"></div>

      {/* Legend */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 italic">
          ⭐ 您的五大标志性优势 - 这些是最能代表您品格的核心优势
        </p>
      </div>
    </div>
  );
};

export default SignaturePodium;

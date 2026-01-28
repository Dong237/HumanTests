import React from 'react';
import type { TypeScore } from '../../types';

interface EnneagramCircleProps {
  scores: TypeScore[];
}

const EnneagramCircle: React.FC<EnneagramCircleProps> = ({ scores }) => {
  const centerX = 200;
  const centerY = 200;
  const radius = 140;

  // Calculate position for each type on the circle
  // Type 9 at top (0°), then clockwise: 1, 2, 3, 4, 5, 6, 7, 8
  const getPosition = (typeId: number) => {
    // Start at top (9 o'clock position) and go clockwise
    const angle = ((typeId - 9) * 40 - 90) * (Math.PI / 180); // 40° between each type
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    return { x, y };
  };

  // Get color for each type based on triad
  const getTypeColor = (triad: string) => {
    switch (triad) {
      case 'gut': return '#8B7355'; // brown for gut (1, 8, 9)
      case 'heart': return '#C44569'; // rose for heart (2, 3, 4)
      case 'head': return '#4A90E2'; // blue for head (5, 6, 7)
      default: return '#718096';
    }
  };

  // Draw inner connection lines (Enneagram symbol pattern)
  const innerLines = [
    [1, 4], [4, 2], [2, 8], [8, 5], [5, 7], [7, 1], // inner triangle connections
  ];

  const maxScore = Math.max(...scores.map(s => s.rawScore));

  return (
    <div className="flex justify-center items-center">
      <svg width="400" height="400" viewBox="0 0 400 400" className="drop-shadow-md">
        {/* Background circle */}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="2"
        />

        {/* Inner connection lines */}
        {innerLines.map(([type1, type2], idx) => {
          const pos1 = getPosition(type1);
          const pos2 = getPosition(type2);
          return (
            <line
              key={idx}
              x1={pos1.x}
              y1={pos1.y}
              x2={pos2.x}
              y2={pos2.y}
              stroke="#D1D5DB"
              strokeWidth="1"
              strokeDasharray="4 2"
            />
          );
        })}

        {/* Outer circle connections */}
        {scores.map((_, idx) => {
          const type1 = idx + 1;
          const type2 = (idx % 9) + 1;
          const pos1 = getPosition(type1);
          const pos2 = getPosition(type2);
          return (
            <line
              key={`circle-${idx}`}
              x1={pos1.x}
              y1={pos1.y}
              x2={pos2.x}
              y2={pos2.y}
              stroke="#E5E7EB"
              strokeWidth="2"
            />
          );
        })}

        {/* Score indicators and type labels */}
        {scores.map((typeScore) => {
          const pos = getPosition(typeScore.typeId);
          const color = getTypeColor(typeScore.triad);
          const scoreSize = 10 + (typeScore.rawScore / maxScore) * 20;
          const isPrimary = typeScore.isPrimary;

          return (
            <g key={typeScore.typeId}>
              {/* Score circle */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={scoreSize}
                fill={color}
                stroke={isPrimary ? '#FFD700' : '#374151'}
                strokeWidth={isPrimary ? 4 : 2}
                opacity={0.9}
              />

              {/* Type number */}
              <text
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                dominantBaseline="central"
                fill="white"
                fontSize="14"
                fontWeight="bold"
              >
                {typeScore.typeId}
              </text>

              {/* Type label outside */}
              <text
                x={pos.x + (pos.x > centerX ? 30 : pos.x < centerX ? -30 : 0)}
                y={pos.y + (pos.y > centerY ? 20 : pos.y < centerY ? -20 : 30)}
                textAnchor="middle"
                fill="#374151"
                fontSize="11"
                fontWeight="500"
              >
                {typeScore.typeName}
              </text>

              {/* Score text */}
              <text
                x={pos.x}
                y={pos.y + scoreSize + 16}
                textAnchor="middle"
                fill="#6B7280"
                fontSize="10"
              >
                {typeScore.rawScore}
              </text>
            </g>
          );
        })}

        {/* Center label */}
        <text
          x={centerX}
          y={centerY}
          textAnchor="middle"
          dominantBaseline="central"
          fill="#9CA3AF"
          fontSize="12"
          fontWeight="500"
        >
          九型人格
        </text>
      </svg>
    </div>
  );
};

export default EnneagramCircle;

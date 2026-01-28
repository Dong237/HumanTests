import React from 'react';

interface ScoreDistributionProps {
  tScore: number;
  percentile: number;
  dimensionName: string;
  color: string;
}

const ScoreDistribution: React.FC<ScoreDistributionProps> = ({
  tScore,
  percentile,
  dimensionName,
  color,
}) => {
  // Calculate position as percentage (T-score range typically 20-80, normalized to 0-100%)
  const position = Math.max(0, Math.min(100, ((tScore - 20) / 60) * 100));

  // Generate bell curve points
  const generateBellCurve = () => {
    const points: { x: number; y: number }[] = [];
    const width = 300;
    const height = 100;

    // Normal distribution centered at 50 (T-score)
    for (let x = 0; x <= width; x += 2) {
      const t = (x / width) * 60 + 20; // Map to T-score range 20-80
      const normalized = (t - 50) / 10; // Normalize to standard deviations
      const y = height * Math.exp(-(normalized ** 2) / 2); // Bell curve formula
      points.push({ x, y: height - y });
    }

    return points;
  };

  const points = generateBellCurve();
  const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  // Get score range description
  const getRangeDescription = () => {
    if (tScore >= 70) return { label: '非常高', color: 'text-red-600', range: '≥98百分位' };
    if (tScore >= 60) return { label: '较高', color: 'text-orange-600', range: '84-97百分位' };
    if (tScore >= 40) return { label: '平均', color: 'text-green-600', range: '16-84百分位' };
    if (tScore >= 30) return { label: '较低', color: 'text-blue-600', range: '3-16百分位' };
    return { label: '非常低', color: 'text-purple-600', range: '≤2百分位' };
  };

  const range = getRangeDescription();

  return (
    <div className="bg-white p-6 rounded-xl border-2 border-gray-800">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-800 mb-1">
          {dimensionName} - 群体分布位置
        </h3>
        <p className="text-sm text-gray-600">
          您在人群中的相对位置（基于常模）
        </p>
      </div>

      {/* Bell Curve Visualization */}
      <div className="relative mb-6">
        <svg
          width="100%"
          height="120"
          viewBox="0 0 300 120"
          className="overflow-visible"
          style={{ filter: 'drop-shadow(2px 2px 0px rgba(0, 0, 0, 0.2))' }}
        >
          {/* Background shaded regions */}
          {/* Very Low */}
          <rect x="0" y="0" width="45" height="100" fill="#E0E7FF" opacity="0.3" />
          {/* Low */}
          <rect x="45" y="0" width="45" height="100" fill="#DBEAFE" opacity="0.3" />
          {/* Average */}
          <rect x="90" y="0" width="120" height="100" fill="#D1FAE5" opacity="0.3" />
          {/* High */}
          <rect x="210" y="0" width="45" height="100" fill="#FED7AA" opacity="0.3" />
          {/* Very High */}
          <rect x="255" y="0" width="45" height="100" fill="#FECACA" opacity="0.3" />

          {/* Bell curve */}
          <path
            d={`${pathData} L 300 100 L 0 100 Z`}
            fill={color}
            opacity="0.2"
            stroke={color}
            strokeWidth="2"
          />

          {/* User's position marker */}
          <line
            x1={position * 3}
            y1="0"
            x2={position * 3}
            y2="100"
            stroke="#000"
            strokeWidth="3"
            strokeDasharray="5,5"
          />
          <circle
            cx={position * 3}
            cy="105"
            r="5"
            fill="#000"
            stroke="#fff"
            strokeWidth="2"
          />

          {/* Label */}
          <text
            x={position * 3}
            y="118"
            textAnchor="middle"
            fontSize="10"
            fontWeight="bold"
            fill="#000"
          >
            您
          </text>
        </svg>

        {/* T-Score axis labels */}
        <div className="flex justify-between text-xs text-gray-600 mt-1 px-1">
          <span>20</span>
          <span>30</span>
          <span>40</span>
          <span className="font-bold">50</span>
          <span>60</span>
          <span>70</span>
          <span>80</span>
        </div>
        <div className="text-center text-xs text-gray-500 mt-1">T分数</div>
      </div>

      {/* Score Summary */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-300">
          <div className="text-2xl font-bold text-gray-800">{tScore}</div>
          <div className="text-xs text-gray-600">您的T分</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-300">
          <div className="text-2xl font-bold text-gray-800">{percentile}%</div>
          <div className="text-xs text-gray-600">超过人群</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-300">
          <div className={`text-lg font-bold ${range.color}`}>{range.label}</div>
          <div className="text-xs text-gray-600">{range.range}</div>
        </div>
      </div>

      {/* Interpretation */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-900">
          <strong>解读：</strong>
          您的得分为 <strong className={range.color}>{tScore}</strong>（T分），
          处于<strong className={range.color}>{range.label}</strong>水平，
          这意味着您在此维度上的得分超过了约 <strong>{percentile}%</strong> 的人。
          {tScore >= 60 && ' 您在这一特质上表现突出，明显高于一般水平。'}
          {tScore >= 40 && tScore < 60 && ' 您在这一特质上处于正常范围，与大多数人相似。'}
          {tScore < 40 && ' 您在这一特质上的表现低于一般水平，这本身没有好坏之分。'}
        </p>
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-gray-300">
        <div className="flex flex-wrap gap-3 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-purple-200 border border-purple-300 rounded"></div>
            <span className="text-gray-600">非常低</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-200 border border-blue-300 rounded"></div>
            <span className="text-gray-600">较低</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-200 border border-green-300 rounded"></div>
            <span className="text-gray-600">平均</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-orange-200 border border-orange-300 rounded"></div>
            <span className="text-gray-600">较高</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-200 border border-red-300 rounded"></div>
            <span className="text-gray-600">非常高</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreDistribution;

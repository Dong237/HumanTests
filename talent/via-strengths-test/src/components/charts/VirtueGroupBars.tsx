import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import type { StrengthScore } from '../../types';
import { getVirtueColor } from '../../utils/scoring';

interface VirtueGroupBarsProps {
  scores: StrengthScore[];
}

const VirtueGroupBars: React.FC<VirtueGroupBarsProps> = ({ scores }) => {
  // Flatten all scores with virtue colors
  const chartData = scores.map(score => ({
    name: score.strengthName,
    score: score.rawScore,
    percentage: score.percentage,
    rank: score.rank,
    virtue: score.virtue,
    isSignature: score.isSignature,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg border-2 border-gray-800 shadow-lg">
          <p className="font-bold text-gray-800">{data.name}</p>
          <p className="text-sm text-gray-600">得分: {data.score}/25</p>
          <p className="text-sm text-gray-600">百分比: {data.percentage}%</p>
          <p className="text-sm text-gray-600">排名: 第{data.rank}名</p>
          {data.isSignature && (
            <p className="text-sm text-indigo-600 font-semibold mt-1">⭐ 标志性优势</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={600}>
      <BarChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis
          dataKey="name"
          angle={-45}
          textAnchor="end"
          height={100}
          tick={{ fill: '#374151', fontSize: 11 }}
          interval={0}
        />
        <YAxis
          label={{ value: '得分', angle: -90, position: 'insideLeft', style: { fill: '#374151' } }}
          tick={{ fill: '#374151' }}
          domain={[0, 25]}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ paddingTop: '20px' }}
          formatter={(_value) => <span style={{ color: '#374151' }}>品格优势得分</span>}
        />
        <Bar dataKey="score" name="品格优势得分" radius={[8, 8, 0, 0]}>
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={getVirtueColor(entry.virtue)}
              opacity={entry.isSignature ? 1 : 0.6}
              stroke={entry.isSignature ? '#1F2937' : 'none'}
              strokeWidth={entry.isSignature ? 2 : 0}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default VirtueGroupBars;

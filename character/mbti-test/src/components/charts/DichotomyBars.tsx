import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import type { DichotomyScore } from '../../types';

interface Props {
  scores: DichotomyScore[];
}

const DichotomyBars: React.FC<Props> = ({ scores }) => {
  // Transform data: show first pole score as positive, second pole as the remainder
  // We use a stacked bar showing both poles
  const data = scores.map(d => ({
    name: d.dichotomyName,
    dichotomy: d.dichotomy,
    firstPole: d.firstPole,
    secondPole: d.secondPole,
    firstPoleScore: d.firstPoleScore,
    secondPoleScore: d.secondPoleScore,
    preference: d.preference,
    label: `${d.firstPole} ${d.firstPoleScore}% / ${d.secondPole} ${d.secondPoleScore}%`,
  }));

  const colors = {
    first: '#8B5CF6',  // purple-500
    second: '#6366F1', // indigo-500
  };

  return (
    <div id="dichotomy-chart">
      <h3 className="text-2xl font-bold mb-4 text-center">维度偏好分布图</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical" margin={{ left: 30, right: 30 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
          <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 13 }} />
          <Tooltip
            formatter={(value: number | undefined, name: string | undefined) => {
              const label = name === 'firstPoleScore' ? '第一极' : '第二极';
              return [`${value ?? 0}%`, label];
            }}
            labelFormatter={(label: unknown) => {
              const item = data.find(d => d.name === String(label));
              if (!item) return String(label);
              return `${item.firstPole} vs ${item.secondPole}`;
            }}
          />
          <ReferenceLine x={50} stroke="#666" strokeDasharray="5 5" />
          <Bar dataKey="firstPoleScore" stackId="a" radius={[0, 0, 0, 0]}>
            {data.map((_entry, index) => (
              <Cell key={`first-${index}`} fill={colors.first} stroke="#000" strokeWidth={1} />
            ))}
          </Bar>
          <Bar dataKey="secondPoleScore" stackId="a" radius={[0, 8, 8, 0]}>
            {data.map((_entry, index) => (
              <Cell key={`second-${index}`} fill={colors.second} stroke="#000" strokeWidth={1} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {data.map((d) => (
          <div key={d.dichotomy} className="flex items-center gap-2 text-sm">
            <span className="font-semibold text-purple-700">{d.firstPole}</span>
            <span className="text-gray-500">{d.firstPoleScore}%</span>
            <span className="text-gray-400">/</span>
            <span className="font-semibold text-indigo-700">{d.secondPole}</span>
            <span className="text-gray-500">{d.secondPoleScore}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DichotomyBars;

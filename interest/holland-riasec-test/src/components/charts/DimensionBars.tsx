import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { TypeScore } from '../../types';

interface Props {
  scores: TypeScore[];
}

const colors: Record<string, string> = {
  R: '#FF6B6B',
  I: '#4ECDC4',
  A: '#45B7D1',
  S: '#96CEB4',
  E: '#FFEAA7',
  C: '#DDA0DD',
};

const DimensionBars: React.FC<Props> = ({ scores }) => {
  const data = scores.map(type => ({
    name: type.typeName,
    score: type.rawScore,
    id: type.typeId,
    fullName: `${type.typeName} (${type.typeNameEn})`,
  }));

  return (
    <div id="bar-chart">
      <h3 className="text-2xl font-bold mb-4 text-center">兴趣类型得分柱状图</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" domain={[0, 50]} />
          <YAxis dataKey="name" type="category" width={60} tick={{ fontSize: 13 }} />
          <Tooltip
            formatter={(value: number | string | undefined) => [`${value}/50`, '得分']}
            labelFormatter={(label: unknown) => {
              const item = data.find(d => d.name === String(label));
              return item?.fullName || String(label);
            }}
          />
          <Bar dataKey="score" radius={[0, 8, 8, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[entry.id]} stroke="#000" strokeWidth={2} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DimensionBars;

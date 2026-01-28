import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { DimensionScore } from '../../types';

interface Props {
  scores: DimensionScore[];
}

const colors: Record<string, string> = {
  A: '#FF6B6B',
  B: '#4ECDC4',
  C: '#45B7D1',
  D: '#96CEB4',
  E: '#FFEAA7',
  F: '#DDA0DD',
  G: '#FF8C94',
  H: '#7FB069',
  I: '#F39C12',
  J: '#E056A0',
};

const DimensionBars: React.FC<Props> = ({ scores }) => {
  const data = scores.map(dim => ({
    name: dim.dimensionName.replace('身体-动觉天赋', '动觉').replace('逻辑-算数天赋', '逻辑').replace('天赋', ''),
    score: dim.rawScore,
    id: dim.dimensionId,
    fullName: dim.dimensionName,
  }));

  return (
    <div id="bar-chart">
      <h3 className="text-2xl font-bold mb-4 text-center">维度得分柱状图</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" domain={[0, 20]} />
          <YAxis dataKey="name" type="category" width={60} tick={{ fontSize: 12 }} />
          <Tooltip
            formatter={(value: number | string | undefined) => [`${value}/20`, '得分']}
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

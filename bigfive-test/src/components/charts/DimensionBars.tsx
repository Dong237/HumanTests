import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { DimensionScore } from '../../types';

interface Props {
  scores: DimensionScore[];
}

const DimensionBars: React.FC<Props> = ({ scores }) => {
  const colors: Record<string, string> = {
    N: '#FFB3BA',
    E: '#FFDFBA',
    O: '#BAE1FF',
    A: '#BAFFC9',
    C: '#D4BAFF',
  };

  const data = scores.map(dim => ({
    name: dim.dimensionName,
    score: dim.percentile,
    id: dim.dimensionId,
  }));

  return (
    <div className="excalidraw-card" id="bar-chart">
      <h3 className="text-2xl font-bold mb-4 text-center">维度得分柱状图</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Bar dataKey="score" radius={[8, 8, 0, 0]}>
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

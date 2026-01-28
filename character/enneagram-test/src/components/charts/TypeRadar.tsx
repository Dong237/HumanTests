import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import type { TypeScore } from '../../types';

interface TypeRadarProps {
  scores: TypeScore[];
}

const TypeRadar: React.FC<TypeRadarProps> = ({ scores }) => {
  // Prepare data for radar chart
  const chartData = scores.map(s => ({
    type: `${s.typeId}号`,
    score: s.rawScore,
    fullLabel: `${s.typeId}号 - ${s.typeName}`,
    percentage: s.percentage,
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <RadarChart data={chartData}>
        <PolarGrid stroke="#E5E7EB" />
        <PolarAngleAxis
          dataKey="type"
          tick={{ fill: '#374151', fontSize: 14, fontWeight: 500 }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 50]}
          tick={{ fill: '#6B7280', fontSize: 12 }}
        />
        <Radar
          name="得分"
          dataKey="score"
          stroke="#6366F1"
          fill="#818CF8"
          fillOpacity={0.6}
          strokeWidth={2}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            border: '2px solid #374151',
            borderRadius: '12px',
            padding: '8px 12px',
            boxShadow: '4px 4px 0px 0px rgba(0,0,0,0.1)',
          }}
          formatter={(value: number | undefined, _name: string | undefined, props: any) => [
            `${value ?? 0}分 (${props.payload.percentage}%)`,
            props.payload.fullLabel
          ]}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
};

export default TypeRadar;

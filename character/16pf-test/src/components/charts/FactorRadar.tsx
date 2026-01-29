import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import type { FactorScore } from '../../types';

interface FactorRadarProps {
  scores: FactorScore[];
}

const FactorRadar: React.FC<FactorRadarProps> = ({ scores }) => {
  // Transform data for Recharts
  const data = scores.map((factor) => ({
    factor: factor.factorId,
    sten: factor.stenScore,
    fullName: factor.factorName,
  }));

  return (
    <ResponsiveContainer width="100%" height={500}>
      <RadarChart data={data}>
        <PolarGrid stroke="#cbd5e1" strokeWidth={1} />
        <PolarAngleAxis
          dataKey="factor"
          tick={{ fill: '#1f2937', fontSize: 12, fontWeight: 'bold' }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 10]}
          tick={{ fill: '#6b7280', fontSize: 10 }}
          tickCount={6}
        />
        <Radar
          name="Sten分数"
          dataKey="sten"
          stroke="#14b8a6"
          fill="#14b8a6"
          fillOpacity={0.6}
          strokeWidth={2}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            border: '2px solid #1f2937',
            borderRadius: '8px',
            boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
          }}
          formatter={(value: any, _name: string | undefined, props: any) => [
            `Sten: ${value}`,
            props.payload.fullName,
          ]}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
};

export default FactorRadar;

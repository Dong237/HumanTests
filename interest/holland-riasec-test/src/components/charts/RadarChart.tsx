import React from 'react';
import { Radar, RadarChart as RechartsRadar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import type { TypeScore } from '../../types';

interface Props {
  scores: TypeScore[];
}

const RadarChartComponent: React.FC<Props> = ({ scores }) => {
  const data = scores.map(type => ({
    dimension: type.typeName,
    score: type.percentage,
    fullMark: 100,
  }));

  return (
    <div id="radar-chart">
      <h3 className="text-2xl font-bold mb-4 text-center">六维兴趣雷达图</h3>
      <ResponsiveContainer width="100%" height={450}>
        <RechartsRadar data={data}>
          <PolarGrid stroke="#333" />
          <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 13 }} />
          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
          <Radar name="兴趣" dataKey="score" stroke="#14B8A6" fill="#14B8A6" fillOpacity={0.5} />
        </RechartsRadar>
      </ResponsiveContainer>
    </div>
  );
};

export default RadarChartComponent;

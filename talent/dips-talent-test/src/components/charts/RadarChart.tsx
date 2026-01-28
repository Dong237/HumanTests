import React from 'react';
import { Radar, RadarChart as RechartsRadar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import type { DimensionScore } from '../../types';

interface Props {
  scores: DimensionScore[];
}

const RadarChartComponent: React.FC<Props> = ({ scores }) => {
  const data = scores.map(dim => ({
    dimension: dim.dimensionName.replace('-', '\n'),
    score: dim.percentage,
    fullMark: 100,
  }));

  return (
    <div id="radar-chart">
      <h3 className="text-2xl font-bold mb-4 text-center">十维天赋雷达图</h3>
      <ResponsiveContainer width="100%" height={450}>
        <RechartsRadar data={data}>
          <PolarGrid stroke="#333" />
          <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 11 }} />
          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
          <Radar name="天赋" dataKey="score" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.5} />
        </RechartsRadar>
      </ResponsiveContainer>
    </div>
  );
};

export default RadarChartComponent;

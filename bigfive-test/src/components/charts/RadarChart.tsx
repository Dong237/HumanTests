import React from 'react';
import { Radar, RadarChart as RechartsRadar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import type { DimensionScore } from '../../types';

interface Props {
  scores: DimensionScore[];
}

const RadarChartComponent: React.FC<Props> = ({ scores }) => {
  const data = scores.map(dim => ({
    dimension: dim.dimensionName,
    score: dim.percentile,
    fullMark: 100,
  }));

  return (
    <div className="excalidraw-card" id="radar-chart">
      <h3 className="text-2xl font-bold mb-4 text-center">五维人格雷达图</h3>
      <ResponsiveContainer width="100%" height={400}>
        <RechartsRadar data={data}>
          <PolarGrid stroke="#333" />
          <PolarAngleAxis dataKey="dimension" />
          <PolarRadiusAxis angle={90} domain={[0, 100]} />
          <Radar name="得分" dataKey="score" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
        </RechartsRadar>
      </ResponsiveContainer>
    </div>
  );
};

export default RadarChartComponent;

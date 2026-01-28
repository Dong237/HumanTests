import React, { useState } from 'react';
import type { TestResult } from '../../types';
import RadarChart from '../charts/RadarChart';
import DimensionBars from '../charts/DimensionBars';
import StyleCard from './StyleCard';
import StyleSummary from './StyleSummary';
import { InfoIcon } from '../InfoIcon';
import { downloadAsPDF, downloadAsCSV, downloadAsJSON, copyToClipboard } from '../../utils/download';

interface Props {
  result: TestResult;
  onRestart: () => void;
}

const Results: React.FC<Props> = ({ result, onRestart }) => {
  const [copiedMessage, setCopiedMessage] = useState('');
  const [showStyleDetails, setShowStyleDetails] = useState(true);

  const handleCopy = async () => {
    const success = await copyToClipboard(result);
    setCopiedMessage(success ? '已复制到剪贴板！' : '复制失败');
    setTimeout(() => setCopiedMessage(''), 3000);
  };

  const sortedDimensions = [...result.dimensionScores].sort((a, b) => b.rawScore - a.rawScore);

  return (
    <div id="results-container" className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="excalidraw-card text-center bg-gradient-to-r from-orange-50 to-amber-50">
          <h1 className="text-5xl font-bold mb-4 text-gray-800">🎉 测试完成！</h1>
          <p className="text-xl text-gray-600 mb-2">恭喜您完成了全部 28 道题目</p>
          <p className="text-2xl font-bold text-amber-700 mb-2">
            您的DISC风格模式：{result.discPattern}
          </p>
          <p className="text-gray-500">
            完成时间：{new Date(result.completedAt).toLocaleString('zh-CN')}
          </p>
        </div>

        {/* DISC Style Summary */}
        <StyleSummary
          dimensionScores={result.dimensionScores}
          discPattern={result.discPattern}
        />

        {/* Visualization Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="excalidraw-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">雷达图</h3>
              <InfoIcon
                title="雷达图说明"
                content="雷达图直观展示您在四个行为维度上的得分分布。图形越向外延伸，表示该行为倾向越强烈。四边形的形状反映了您的行为风格特点。"
              />
            </div>
            <RadarChart scores={result.dimensionScores} />
          </div>

          <div className="excalidraw-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">柱状图</h3>
              <InfoIcon
                title="柱状图说明"
                content="柱状图显示您在每个行为维度的原始得分。满分35分（7题×5分），得分越高表示该行为倾向越明显。"
              />
            </div>
            <DimensionBars scores={result.dimensionScores} />
          </div>
        </div>

        {/* Detailed Style Cards */}
        <div className="excalidraw-card">
          <button
            onClick={() => setShowStyleDetails(!showStyleDetails)}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div>
              <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <span>🔍</span>
                四大行为风格详细解读
              </h2>
              <p className="text-gray-600 mt-2">
                点击 (i) 图标了解更多关于每个行为风格的信息
              </p>
            </div>
            <span className="text-2xl transform transition-transform duration-200"
              style={{ transform: showStyleDetails ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              ▼
            </span>
          </button>

          {showStyleDetails && (
            <div className="p-6 pt-2 space-y-6">
              {sortedDimensions.map((dimension) => (
                <StyleCard key={dimension.dimensionId} dimension={dimension} />
              ))}
            </div>
          )}
        </div>

        {/* Important Notes */}
        <div className="excalidraw-card bg-gradient-to-r from-blue-50 to-purple-50">
          <h3 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-3">
            <span>📝</span>
            重要说明
          </h3>
          <div className="space-y-3 text-sm text-gray-700">
            <div className="bg-white p-4 rounded-lg border-2 border-amber-200">
              <p><strong>🏷️ DISC理论：</strong>DISC理论认为，每个人都是四种行为风格的独特组合。您的DISC模式 <strong>{result.discPattern}</strong> 代表了您最突出的两种行为风格组合，这种组合影响您的沟通方式、工作习惯和人际互动。</p>
            </div>
            <div className="bg-white p-4 rounded-lg border-2 border-blue-200">
              <p><strong>🔄 行为与性格：</strong>DISC描述的是可观察的行为倾向，而非固定的性格。行为可以根据情境调整。了解自己的自然倾向，有助于在不同场景中更好地适应和沟通。</p>
            </div>
            <div className="bg-white p-4 rounded-lg border-2 border-green-200">
              <p><strong>🤝 团队协作：</strong>不同DISC风格的人在团队中扮演不同角色。D型推动决策，I型活跃气氛，S型维护和谐，C型保证质量。了解彼此的风格有助于更好地协作。</p>
            </div>
            <div className="bg-white p-4 rounded-lg border-2 border-orange-200">
              <p><strong>⚠️ 专业建议：</strong>本测试结果仅供个人参考。如需做出重要的职业决策或深入了解自己的行为模式，建议结合专业的心理咨询或职业规划服务。</p>
            </div>
          </div>
        </div>

        {/* Download Options */}
        <div className="excalidraw-card">
          <h3 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-3">
            <span>💾</span>
            下载您的报告
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button onClick={() => downloadAsPDF(result)} className="excalidraw-button bg-red-200 hover:bg-red-300">
              📄 PDF报告
            </button>
            <button onClick={() => downloadAsCSV(result)} className="excalidraw-button bg-green-200 hover:bg-green-300">
              📊 CSV数据
            </button>
            <button onClick={() => downloadAsJSON(result)} className="excalidraw-button bg-blue-200 hover:bg-blue-300">
              📋 JSON数据
            </button>
            <button onClick={handleCopy} className="excalidraw-button bg-purple-200 hover:bg-purple-300">
              📝 复制文本
            </button>
          </div>
          {copiedMessage && <p className="text-green-600 mt-2 text-center font-semibold">{copiedMessage}</p>}
        </div>

        {/* Actions */}
        <div className="text-center space-y-4">
          <p className="text-gray-600">
            建议结合其他性格测试和职业规划咨询，全面了解您的行为模式和发展方向
          </p>
          <button
            onClick={onRestart}
            className="excalidraw-button bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-lg px-8 py-3"
          >
            🔄 重新测试
          </button>
        </div>
      </div>
    </div>
  );
};

export default Results;

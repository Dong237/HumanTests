import React, { useState } from 'react';
import type { TestResult } from '../types';
import RadarChart from './charts/RadarChart';
import DimensionBars from './charts/DimensionBars';
import DimensionCard from './results/DimensionCard';
import TalentSummary from './results/TalentSummary';
import { InfoIcon } from './InfoIcon';
import { downloadPDF, downloadCSV, downloadJSON, copyToClipboard } from '../utils/download';

interface Props {
  result: TestResult;
  onRestart: () => void;
}

const Results: React.FC<Props> = ({ result, onRestart }) => {
  const [copiedMessage, setCopiedMessage] = useState('');
  const [showDimensionDetails, setShowDimensionDetails] = useState(true);

  const handleCopy = async () => {
    const success = await copyToClipboard(result);
    setCopiedMessage(success ? '已复制到剪贴板！' : '复制失败');
    setTimeout(() => setCopiedMessage(''), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="excalidraw-card text-center bg-gradient-to-r from-amber-50 to-rose-50">
          <h1 className="text-5xl font-bold mb-4 text-gray-800">🎉 测试完成！</h1>
          <p className="text-xl text-gray-600 mb-2">恭喜您完成了全部 40 道题目</p>
          <p className="text-gray-500">
            完成时间：{new Date(result.completedAt).toLocaleString('zh-CN')}
          </p>
        </div>

        {/* Top Talents Summary */}
        <TalentSummary topTalents={result.topTalents} allScores={result.dimensionScores} />

        {/* Visualization Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="excalidraw-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">雷达图</h3>
              <InfoIcon
                title="雷达图说明"
                content="雷达图直观展示您在十个天赋维度上的得分分布。图形越向外延伸，表示该天赋越突出。"
              />
            </div>
            <RadarChart scores={result.dimensionScores} />
          </div>

          <div className="excalidraw-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">柱状图</h3>
              <InfoIcon
                title="柱状图说明"
                content="柱状图显示您在每个天赋维度的原始得分。满分20分，得分越高表示该天赋越突出。"
              />
            </div>
            <DimensionBars scores={result.dimensionScores} />
          </div>
        </div>

        {/* Detailed Dimension Cards */}
        <div className="excalidraw-card">
          <button
            onClick={() => setShowDimensionDetails(!showDimensionDetails)}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div>
              <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <span>🔍</span>
                十大天赋详细解读
              </h2>
              <p className="text-gray-600 mt-2">
                点击 (i) 图标了解更多关于每个天赋维度的信息
              </p>
            </div>
            <span className="text-2xl transform transition-transform duration-200"
              style={{ transform: showDimensionDetails ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              ▼
            </span>
          </button>

          {showDimensionDetails && (
            <div className="p-6 pt-2 space-y-6">
              {result.dimensionScores
                .sort((a, b) => b.rawScore - a.rawScore)
                .map((dim) => (
                  <DimensionCard key={dim.dimensionId} dimension={dim} />
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
            <div className="bg-white p-4 rounded-lg border-2 border-blue-200">
              <p><strong>🔄 天赋与兴趣：</strong>研究表明，天赋与兴趣经常不一致。您可能对某些领域很有兴趣但天赋一般，也可能在不感兴趣的领域拥有出色天赋。建议将本测试结果与兴趣测试（如RIASEC模型）对照分析。</p>
            </div>
            <div className="bg-white p-4 rounded-lg border-2 border-green-200">
              <p><strong>🌱 发展潜力：</strong>天赋可以通过后天努力进一步发展。低分不代表无法提升，高分也需要持续练习才能转化为真正的能力。</p>
            </div>
            <div className="bg-white p-4 rounded-lg border-2 border-orange-200">
              <p><strong>⚠️ 自评局限：</strong>本测试采用自评方式，很多人对自身天赋的认识存在"盲区"。建议结合他人反馈或专业心理测试，获得更全面的天赋认知。</p>
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
            <button onClick={() => downloadPDF(result)} className="excalidraw-button bg-red-200 hover:bg-red-300">
              📄 PDF报告
            </button>
            <button onClick={() => downloadCSV(result)} className="excalidraw-button bg-green-200 hover:bg-green-300">
              📊 CSV数据
            </button>
            <button onClick={() => downloadJSON(result)} className="excalidraw-button bg-blue-200 hover:bg-blue-300">
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
            建议结合兴趣测试和他人反馈，全面了解您的天赋潜能
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

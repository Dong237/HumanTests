import React, { useState } from 'react';
import type { TestResult } from '../types';
import RadarChart from './charts/RadarChart';
import DimensionBars from './charts/DimensionBars';
import TypeCard from './results/TypeCard';
import HollandCodeSummary from './results/HollandCodeSummary';
import { InfoIcon } from './InfoIcon';
import { downloadPDF, downloadCSV, downloadJSON, copyToClipboard } from '../utils/download';

interface Props {
  result: TestResult;
  onRestart: () => void;
}

const Results: React.FC<Props> = ({ result, onRestart }) => {
  const [copiedMessage, setCopiedMessage] = useState('');
  const [showTypeDetails, setShowTypeDetails] = useState(true);

  const handleCopy = async () => {
    const success = await copyToClipboard(result);
    setCopiedMessage(success ? '已复制到剪贴板！' : '复制失败');
    setTimeout(() => setCopiedMessage(''), 3000);
  };

  const topInterests = result.typeScores
    .filter(t => t.isTopInterest)
    .sort((a, b) => b.rawScore - a.rawScore);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-cyan-50 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="excalidraw-card text-center bg-gradient-to-r from-green-50 to-teal-50">
          <h1 className="text-5xl font-bold mb-4 text-gray-800">🎉 测试完成！</h1>
          <p className="text-xl text-gray-600 mb-2">恭喜您完成了全部 60 道题目</p>
          <p className="text-2xl font-bold text-teal-700 mb-2">
            您的Holland代码：{result.hollandCode}
          </p>
          <p className="text-gray-500">
            完成时间：{new Date(result.completedAt).toLocaleString('zh-CN')}
          </p>
        </div>

        {/* Holland Code Summary */}
        <HollandCodeSummary
          hollandCode={result.hollandCode}
          topInterests={topInterests}
          allScores={result.typeScores}
        />

        {/* Visualization Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="excalidraw-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">雷达图</h3>
              <InfoIcon
                title="雷达图说明"
                content="雷达图直观展示您在六个兴趣类型上的得分分布。图形越向外延伸，表示该兴趣越强烈。六角形的形状反映了您的兴趣结构特点。"
              />
            </div>
            <RadarChart scores={result.typeScores} />
          </div>

          <div className="excalidraw-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">柱状图</h3>
              <InfoIcon
                title="柱状图说明"
                content="柱状图显示您在每个兴趣类型的原始得分。满分50分（10题×5分），得分越高表示该兴趣越强烈。"
              />
            </div>
            <DimensionBars scores={result.typeScores} />
          </div>
        </div>

        {/* Detailed Type Cards */}
        <div className="excalidraw-card">
          <button
            onClick={() => setShowTypeDetails(!showTypeDetails)}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div>
              <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <span>🔍</span>
                六大兴趣类型详细解读
              </h2>
              <p className="text-gray-600 mt-2">
                点击 (i) 图标了解更多关于每个兴趣类型的信息
              </p>
            </div>
            <span className="text-2xl transform transition-transform duration-200"
              style={{ transform: showTypeDetails ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              ▼
            </span>
          </button>

          {showTypeDetails && (
            <div className="p-6 pt-2 space-y-6">
              {result.typeScores
                .sort((a, b) => b.rawScore - a.rawScore)
                .map((type) => (
                  <TypeCard key={type.typeId} typeScore={type} />
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
            <div className="bg-white p-4 rounded-lg border-2 border-teal-200">
              <p><strong>🏷️ Holland理论：</strong>Holland认为，人的职业兴趣与工作环境的匹配程度越高，个人的职业满意度和成就感就越高。您的Holland代码 <strong>{result.hollandCode}</strong> 代表了您最突出的三种兴趣类型组合。</p>
            </div>
            <div className="bg-white p-4 rounded-lg border-2 border-blue-200">
              <p><strong>🔄 兴趣与天赋：</strong>兴趣和天赋是职业选择的两个重要维度。您可能对某些领域很有兴趣但天赋一般，也可能在不感兴趣的领域拥有天赋。建议将本测试结果与天赋测试（如DIPS模型）对照分析。</p>
            </div>
            <div className="bg-white p-4 rounded-lg border-2 border-green-200">
              <p><strong>🌱 动态发展：</strong>职业兴趣可能随着年龄、经历和环境的变化而发展。建议定期重新评估，特别是在职业转折点或人生重要阶段。</p>
            </div>
            <div className="bg-white p-4 rounded-lg border-2 border-orange-200">
              <p><strong>⚠️ 专业建议：</strong>本测试结果仅供个人参考。如需做出重要的职业决策，建议结合专业的职业规划咨询。</p>
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
            建议结合天赋测试和职业规划咨询，全面了解您的职业发展方向
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

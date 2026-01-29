import React, { useState } from 'react';
import type { TestResult } from '../../types';
import SignaturePodium from '../charts/SignaturePodium';
import VirtueGroupBars from '../charts/VirtueGroupBars';
import StrengthCard from './StrengthCard';
import StrengthRankingTable from './StrengthRankingTable';
import { InfoIcon } from '../InfoIcon';
import { downloadAsPDF, downloadAsCSV, downloadAsJSON, copyToClipboard } from '../../utils/download';

interface ResultsProps {
  result: TestResult;
  strengthProfiles?: any; // from strength-profiles.json
  onRestart: () => void;
}

const Results: React.FC<ResultsProps> = ({ result, strengthProfiles, onRestart }) => {
  const [copiedMessage, setCopiedMessage] = useState('');
  const [showAllStrengths, setShowAllStrengths] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(result);
    setCopiedMessage(success ? '已复制到剪贴板！' : '复制失败');
    setTimeout(() => setCopiedMessage(''), 3000);
  };

  return (
    <div id="results-container" className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="excalidraw-card text-center bg-gradient-to-r from-blue-50 to-indigo-50">
          <h1 className="text-5xl font-bold mb-4 text-gray-800">🎉 测试完成！</h1>
          <p className="text-xl text-gray-600 mb-2">恭喜您完成了全部 120 道题目</p>
          <p className="text-lg text-gray-500">
            完成时间：{new Date(result.completedAt).toLocaleString('zh-CN')}
          </p>
        </div>

        {/* Signature Strengths Summary */}
        <div className="excalidraw-card bg-gradient-to-r from-yellow-50 to-amber-50">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
              <span>⭐</span>
              您的标志性优势
              <InfoIcon
                title="标志性优势"
                content="标志性优势是您最核心的品格优势（前5名），代表了您独特的品格特征。这些优势最能体现您的价值观和行为方式，使用它们会让您感到充实和有活力。"
              />
            </h2>
            <p className="text-gray-600 mb-4">
              以下是您在24项品格优势中得分最高的5项，它们是最能代表您的核心优势
            </p>
          </div>

          {/* Top 5 Badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {result.signatureStrengths.map((strength, idx) => (
              <div
                key={strength.strengthId}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border-2 border-gray-800 shadow-md"
              >
                <span className="text-lg">
                  {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '⭐'}
                </span>
                <span className="font-bold text-gray-800">{strength.strengthName}</span>
                <span className="text-sm text-gray-500">({strength.strengthNameEn})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Signature Podium Visualization */}
        <div className="excalidraw-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold text-gray-800">标志性优势排名</h3>
            <InfoIcon
              title="排名展示"
              content="可视化展示您的五大标志性优势，第1名是您得分最高的品格优势，依次类推。"
            />
          </div>
          <SignaturePodium signatureStrengths={result.signatureStrengths} />
        </div>

        {/* All 24 Strengths Bar Chart */}
        <div className="excalidraw-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold text-gray-800">全部24项品格优势得分</h3>
            <InfoIcon
              title="品格优势柱状图"
              content="展示您在全部24项VIA品格优势上的得分分布。不同颜色代表不同的美德类别，标志性优势（前5名）以更深的颜色和边框突出显示。"
            />
          </div>
          <VirtueGroupBars scores={result.strengthScores} />
        </div>

        {/* Ranking Table */}
        <div className="excalidraw-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold text-gray-800">品格优势完整排名</h3>
            <InfoIcon
              title="完整排名表"
              content="按美德分类展示您在24项品格优势上的完整排名和得分。表格按六大美德分组，便于您了解自己在不同美德类别中的优势分布。"
            />
          </div>
          <StrengthRankingTable strengthScores={result.strengthScores} />
        </div>

        {/* Detailed Strength Cards */}
        <div className="excalidraw-card">
          <button
            onClick={() => setShowAllStrengths(!showAllStrengths)}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div>
              <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <span>🔍</span>
                品格优势详细解读
              </h2>
              <p className="text-gray-600 mt-2">
                点击展开查看每项品格优势的详细说明、实践示例和发展建议
              </p>
            </div>
            <span className="text-2xl transform transition-transform duration-200"
              style={{ transform: showAllStrengths ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              ▼
            </span>
          </button>

          {showAllStrengths && (
            <div className="p-6 pt-2 space-y-4">
              {result.strengthScores.map((strength) => (
                <StrengthCard
                  key={strength.strengthId}
                  strength={strength}
                  profile={strengthProfiles?.strengths?.[strength.strengthId]}
                />
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
            <div className="bg-white p-4 rounded-lg border-2 border-indigo-200">
              <p><strong>🌟 标志性优势的运用：</strong>研究表明，经常运用您的标志性优势能够显著提升幸福感和生活满意度。建议您在日常生活、工作和人际关系中有意识地发挥这些优势。</p>
            </div>
            <div className="bg-white p-4 rounded-lg border-2 border-blue-200">
              <p><strong>🔄 全面发展：</strong>虽然标志性优势是您的核心优势，但其他品格优势同样重要。了解并发展所有24项优势，有助于您应对不同情境的挑战。</p>
            </div>
            <div className="bg-white p-4 rounded-lg border-2 border-green-200">
              <p><strong>🎯 实践建议：</strong>选择1-2项标志性优势，每周尝试以新的方式运用它们。例如，如果"好奇心"是您的优势，可以尝试学习一项新技能或探索新的兴趣爱好。</p>
            </div>
            <div className="bg-white p-4 rounded-lg border-2 border-orange-200">
              <p><strong>⚠️ 专业建议：</strong>本测试结果仅供个人参考和自我探索。如需做出重要的职业决策或深入了解自己的品格优势，建议结合专业的心理咨询或职业规划服务。</p>
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
            建议定期重新测试（如每年一次），观察您的品格优势随时间的变化
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

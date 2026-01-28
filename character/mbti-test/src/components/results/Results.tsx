import React, { useState } from 'react';
import type { TestResult } from '../../types';
import DichotomyBars from '../charts/DichotomyBars';
import TypeCard from './TypeCard';
import DichotomyCard from './DichotomyCard';
import { InfoIcon } from '../InfoIcon';
import { downloadAsPDF, downloadAsCSV, downloadAsJSON, copyToClipboard } from '../../utils/download';

interface Props {
  result: TestResult;
  onRestart: () => void;
}

const Results: React.FC<Props> = ({ result, onRestart }) => {
  const [copiedMessage, setCopiedMessage] = useState('');
  const [showDichotomyDetails, setShowDichotomyDetails] = useState(true);

  const handleCopy = async () => {
    const success = await copyToClipboard(result);
    setCopiedMessage(success ? '已复制到剪贴板！' : '复制失败');
    setTimeout(() => setCopiedMessage(''), 3000);
  };

  return (
    <div id="results-container" className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="excalidraw-card text-center bg-gradient-to-r from-purple-50 to-indigo-50">
          <h1 className="text-5xl font-bold mb-4 text-gray-800">🎉 测试完成！</h1>
          <p className="text-xl text-gray-600 mb-2">恭喜您完成了全部 70 道题目</p>
          <p className="text-3xl font-bold text-purple-700 mb-2">
            您的MBTI人格类型：{result.typeCode}
          </p>
          <p className="text-gray-500">
            完成时间：{new Date(result.completedAt).toLocaleString('zh-CN')}
          </p>
        </div>

        {/* Type Profile Card */}
        <TypeCard typeCode={result.typeCode} />

        {/* Visualization Chart */}
        <div className="excalidraw-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800">维度偏好分布</h3>
            <InfoIcon
              title="维度偏好分布"
              content="此图展示您在四个二分法维度上的偏好分布。每个维度的两极得分之和为100%。50%线表示无偏好，偏离越多表示偏好越明确。"
            />
          </div>
          <DichotomyBars scores={result.dichotomyScores} />
        </div>

        {/* Detailed Dichotomy Cards */}
        <div className="excalidraw-card">
          <button
            onClick={() => setShowDichotomyDetails(!showDichotomyDetails)}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div>
              <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <span>🔍</span>
                四大维度详细解读
              </h2>
              <p className="text-gray-600 mt-2">
                点击 (i) 图标了解更多关于每个维度的信息
              </p>
            </div>
            <span className="text-2xl transform transition-transform duration-200"
              style={{ transform: showDichotomyDetails ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              ▼
            </span>
          </button>

          {showDichotomyDetails && (
            <div className="p-6 pt-2 space-y-6">
              {result.dichotomyScores.map((score) => (
                <DichotomyCard key={score.dichotomy} score={score} />
              ))}
            </div>
          )}
        </div>

        {/* Important Notes */}
        <div className="excalidraw-card bg-gradient-to-r from-purple-50 to-indigo-50">
          <h3 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-3">
            <span>📝</span>
            重要说明
          </h3>
          <div className="space-y-3 text-sm text-gray-700">
            <div className="bg-white p-4 rounded-lg border-2 border-purple-200">
              <p><strong>🧬 人格类型：</strong>您的MBTI类型 <strong>{result.typeCode}</strong> 代表了您在四个维度上的自然偏好组合。这不是能力的衡量，而是偏好的描述。每种类型都有独特的优势和成长空间。</p>
            </div>
            <div className="bg-white p-4 rounded-lg border-2 border-indigo-200">
              <p><strong>🔄 偏好与能力：</strong>MBTI描述的是您的自然偏好，而非固定不变的特质。您可以在任何维度上发展技能，偏好只表示您更自然和舒适的方式。</p>
            </div>
            <div className="bg-white p-4 rounded-lg border-2 border-blue-200">
              <p><strong>📊 偏好强度：</strong>注意每个维度的偏好清晰度。"轻微"偏好意味着您在两极之间较为灵活，"非常明确"则表示强烈的倾向性。</p>
            </div>
            <div className="bg-white p-4 rounded-lg border-2 border-orange-200">
              <p><strong>⚠️ 专业建议：</strong>本测试结果仅供个人参考和自我探索。如需做出重要的职业决策或深入了解自己，建议结合专业的心理咨询服务。</p>
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
            建议结合其他性格测试和职业规划咨询，全面了解您的人格类型和发展方向
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

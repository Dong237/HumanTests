import React, { useState } from 'react';
import type { TestResult } from '../../types';
import EnneagramCircle from '../charts/EnneagramCircle';
import TypeRadar from '../charts/TypeRadar';
import TypeCard from './TypeCard';
import { InfoIcon } from '../InfoIcon';
import { getTriadLabel, getTriadDescription } from '../../utils/scoring';
import { downloadAsPDF, downloadAsCSV, downloadAsJSON, copyToClipboard } from '../../utils/download';

interface Props {
  result: TestResult;
  typeProfiles: any;
  onRestart: () => void;
}

const Results: React.FC<Props> = ({ result, typeProfiles, onRestart }) => {
  const [copiedMessage, setCopiedMessage] = useState('');
  const [showTypeDetails, setShowTypeDetails] = useState(true);

  const handleCopy = async () => {
    const success = await copyToClipboard(result);
    setCopiedMessage(success ? '已复制到剪贴板！' : '复制失败');
    setTimeout(() => setCopiedMessage(''), 3000);
  };

  const sortedTypes = [...result.typeScores].sort((a, b) => b.rawScore - a.rawScore);
  const primaryTypeProfile = typeProfiles[result.primaryType];

  return (
    <div id="results-container" className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="excalidraw-card text-center bg-gradient-to-r from-purple-50 to-indigo-50">
          <h1 className="text-5xl font-bold mb-4 text-gray-800">🎉 测试完成！</h1>
          <p className="text-xl text-gray-600 mb-2">恭喜您完成了全部 90 道题目</p>
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-4xl">{primaryTypeProfile.icon}</span>
            <p className="text-3xl font-bold text-indigo-700">
              您的类型：{result.enneagramCode}
            </p>
          </div>
          <p className="text-xl text-gray-700 mb-2">
            {primaryTypeProfile.name} - {primaryTypeProfile.nameEn}
          </p>
          <p className="text-lg text-gray-600 mb-2">
            情感中心：{getTriadLabel(result.triad)}
          </p>
          <p className="text-gray-500">
            完成时间：{new Date(result.completedAt).toLocaleString('zh-CN')}
          </p>
        </div>

        {/* Primary Type Summary */}
        <div className="excalidraw-card bg-gradient-to-r from-indigo-50 to-purple-50">
          <div className="flex items-start gap-4">
            <span className="text-6xl">{primaryTypeProfile.icon}</span>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-800 mb-3">
                类型 {result.primaryType} - {primaryTypeProfile.name}
              </h2>
              <p className="text-lg text-gray-700 mb-3">{primaryTypeProfile.tagline}</p>
              <p className="text-gray-600 leading-relaxed">{primaryTypeProfile.fullDescription}</p>
            </div>
          </div>
        </div>

        {/* Triad Explanation */}
        <div className="excalidraw-card">
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-2xl font-bold text-gray-800">
              您的情感中心：{getTriadLabel(result.triad)}
            </h3>
            <InfoIcon
              title="三大情感中心"
              content={
                <div className="space-y-3">
                  <p>九型人格将9种类型分为三个情感中心，每个中心有其特定的情感反应模式和关注重点。</p>
                  <div className="space-y-2">
                    <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                      <p className="font-bold text-amber-900">本能中心（类型8、9、1）</p>
                      <p className="text-amber-800 text-sm">关注行动、控制和正义，容易受到愤怒感的困扰。</p>
                    </div>
                    <div className="bg-rose-50 p-3 rounded-lg border border-rose-200">
                      <p className="font-bold text-rose-900">情感中心（类型2、3、4）</p>
                      <p className="text-rose-800 text-sm">关注形象、认可和人际关系，容易受到羞耻感的困扰。</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <p className="font-bold text-blue-900">思维中心（类型5、6、7）</p>
                      <p className="text-blue-800 text-sm">关注安全、信息和可能性，容易受到恐惧感的困扰。</p>
                    </div>
                  </div>
                </div>
              }
            />
          </div>
          <div className="bg-indigo-50 p-4 rounded-xl border-2 border-indigo-200">
            <p className="text-gray-700 leading-relaxed">{getTriadDescription(result.triad)}</p>
          </div>
        </div>

        {/* Visualization Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="excalidraw-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">九型人格圆环图</h3>
              <InfoIcon
                title="九型人格圆环图说明"
                content="圆环图展示九型人格的完整结构。圆点大小表示得分高低，金色边框标记您的主导类型。虚线连接展示类型之间的内在关联。"
              />
            </div>
            <EnneagramCircle scores={result.typeScores} />
          </div>

          <div className="excalidraw-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">雷达图</h3>
              <InfoIcon
                title="雷达图说明"
                content="雷达图直观展示您在九种人格类型上的得分分布。图形越向外延伸，表示该类型特征越明显。"
              />
            </div>
            <TypeRadar scores={result.typeScores} />
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
                九型人格详细解读
              </h2>
              <p className="text-gray-600 mt-2">
                点击 (i) 图标了解更多关于每个类型的信息
              </p>
            </div>
            <span className="text-2xl transform transition-transform duration-200"
              style={{ transform: showTypeDetails ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              ▼
            </span>
          </button>

          {showTypeDetails && (
            <div className="p-6 pt-2 space-y-6">
              {sortedTypes.map((typeScore) => (
                <TypeCard
                  key={typeScore.typeId}
                  typeScore={typeScore}
                  typeProfile={typeProfiles[typeScore.typeId]}
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
              <p><strong>🏷️ 九型人格理论：</strong>九型人格是一个深刻的性格系统，描述了九种基本的人格类型及其动机、恐惧和欲望。每种类型都有其独特的世界观和行为模式。您的类型 <strong>{result.enneagramCode}</strong> 代表了您的核心人格类型和侧翼影响。</p>
            </div>
            <div className="bg-white p-4 rounded-lg border-2 border-blue-200">
              <p><strong>🦋 侧翼概念：</strong>侧翼是您主导类型相邻的两个类型中得分较高的一个。侧翼会影响和调节您的核心类型特征，使您的性格更加丰富和独特。例如，4w3会比4w5更外向和追求成就。</p>
            </div>
            <div className="bg-white p-4 rounded-lg border-2 border-green-200">
              <p><strong>🌱 成长路径：</strong>九型人格理论强调自我认知和成长。了解自己的类型有助于认识核心动机和盲点，从而实现个人成长和人际关系的改善。每种类型都有其健康和不健康的状态。</p>
            </div>
            <div className="bg-white p-4 rounded-lg border-2 border-orange-200">
              <p><strong>⚠️ 专业建议：</strong>本测试结果仅供个人参考。九型人格是一个复杂的系统，需要深入学习和自我觉察。如需深入了解或进行个人成长，建议寻求专业的九型人格导师或心理咨询师的帮助。</p>
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
            建议深入学习九型人格理论，并结合其他性格测试全面了解自己
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

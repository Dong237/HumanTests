import React, { useState } from 'react';
import type { TestResult } from '../../types';
import BipolarScales from '../charts/BipolarScales';
import FactorRadar from '../charts/FactorRadar';
import FactorCard from './FactorCard';
import FactorProfileTable from './FactorProfileTable';
import { InfoIcon } from '../InfoIcon';
import { downloadAsPDF, downloadAsCSV, downloadAsJSON, copyToClipboard } from '../../utils/download';

interface Props {
  result: TestResult;
  factorProfiles: any;
  onRestart: () => void;
}

const Results: React.FC<Props> = ({ result, factorProfiles, onRestart }) => {
  const [copiedMessage, setCopiedMessage] = useState('');
  const [showFactorDetails, setShowFactorDetails] = useState(true);

  const handleCopy = async () => {
    const success = await copyToClipboard(result);
    setCopiedMessage(success ? '已复制到剪贴板！' : '复制失败');
    setTimeout(() => setCopiedMessage(''), 3000);
  };

  // Get summary statistics
  const highFactors = result.factorScores.filter(f => f.level === 'high');
  const lowFactors = result.factorScores.filter(f => f.level === 'low');
  const averageSten = Math.round((result.factorScores.reduce((sum, f) => sum + f.stenScore, 0) / 16) * 10) / 10;

  return (
    <div id="results-container" className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-sky-50 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="excalidraw-card text-center bg-gradient-to-r from-teal-50 to-cyan-50">
          <h1 className="text-5xl font-bold mb-4 text-gray-800">🎉 测试完成！</h1>
          <p className="text-xl text-gray-600 mb-2">恭喜您完成了全部 163 道题目</p>
          <div className="flex items-center justify-center gap-2 mb-2">
            <p className="text-3xl font-bold text-teal-700">
              16PF 人格因子测试结果
            </p>
          </div>
          <p className="text-lg text-gray-700 mb-2">
            平均 Sten 分数: {averageSten}
          </p>
          <p className="text-gray-500">
            完成时间：{new Date(result.completedAt).toLocaleString('zh-CN')}
          </p>
        </div>

        {/* Summary Card */}
        <div className="excalidraw-card bg-gradient-to-r from-cyan-50 to-teal-50">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
            <span>📊</span>
            人格剖面概览
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-orange-50 p-4 rounded-xl border-2 border-orange-200">
              <h3 className="font-bold text-orange-900 mb-2">突出因子 (Sten ≥ 8)</h3>
              {highFactors.length > 0 ? (
                <ul className="space-y-1">
                  {highFactors.map(f => (
                    <li key={f.factorId} className="text-orange-800 text-sm">
                      <strong>{f.factorId}</strong> - {f.factorName}: Sten {f.stenScore} ({f.highLabel})
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-orange-700 text-sm">无突出高分因子</p>
              )}
            </div>
            <div className="bg-blue-50 p-4 rounded-xl border-2 border-blue-200">
              <h3 className="font-bold text-blue-900 mb-2">弱势因子 (Sten ≤ 3)</h3>
              {lowFactors.length > 0 ? (
                <ul className="space-y-1">
                  {lowFactors.map(f => (
                    <li key={f.factorId} className="text-blue-800 text-sm">
                      <strong>{f.factorId}</strong> - {f.factorName}: Sten {f.stenScore} ({f.lowLabel})
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-blue-700 text-sm">无明显低分因子</p>
              )}
            </div>
          </div>
        </div>

        {/* Factor Profile Table */}
        <div className="excalidraw-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <span>📋</span>
              16 因子得分总览
            </h3>
            <InfoIcon
              title="因子得分表格说明"
              content={
                <div className="space-y-2">
                  <p>该表格展示了您在16个人格因子上的标准化得分（Sten分数）。</p>
                  <p><strong>Sten分数:</strong> 1-10的标准化分数，平均值为5.5，标准差为2。</p>
                  <p><strong>水平划分:</strong></p>
                  <ul className="text-sm space-y-1 ml-4">
                    <li>• 偏低: Sten 1-3 (倾向于低分极)</li>
                    <li>• 中等: Sten 4-7 (处于平衡状态)</li>
                    <li>• 偏高: Sten 8-10 (倾向于高分极)</li>
                  </ul>
                </div>
              }
            />
          </div>
          <FactorProfileTable factorScores={result.factorScores} />
        </div>

        {/* Visualization Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="excalidraw-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">双极量表图</h3>
              <InfoIcon
                title="双极量表图说明"
                content="双极量表图展示每个因子的两个极端特征。圆点位置表示您在该因子上的得分倾向。越靠近某一极，说明您越具有该极的特征。"
              />
            </div>
            <BipolarScales scores={result.factorScores} />
          </div>

          <div className="excalidraw-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">雷达图</h3>
              <InfoIcon
                title="雷达图说明"
                content="雷达图直观展示您在16个人格因子上的得分分布。图形越向外延伸，表示该因子得分越高。通过雷达图可以快速识别您的人格特征模式。"
              />
            </div>
            <FactorRadar scores={result.factorScores} />
          </div>
        </div>

        {/* Detailed Factor Cards */}
        <div className="excalidraw-card">
          <button
            onClick={() => setShowFactorDetails(!showFactorDetails)}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div>
              <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <span>🔍</span>
                16 因子详细解读
              </h2>
              <p className="text-gray-600 mt-2">
                点击 (i) 图标了解更多关于每个因子的信息
              </p>
            </div>
            <span className="text-2xl transform transition-transform duration-200"
              style={{ transform: showFactorDetails ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              ▼
            </span>
          </button>

          {showFactorDetails && (
            <div className="p-6 pt-2 grid grid-cols-1 gap-6">
              {result.factorScores.map((factorScore) => (
                <FactorCard
                  key={factorScore.factorId}
                  factorScore={factorScore}
                  factorProfile={factorProfiles[factorScore.factorId]}
                />
              ))}
            </div>
          )}
        </div>

        {/* Important Notes */}
        <div className="excalidraw-card bg-gradient-to-r from-blue-50 to-teal-50">
          <h3 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-3">
            <span>📝</span>
            重要说明
          </h3>
          <div className="space-y-3 text-sm text-gray-700">
            <div className="bg-white p-4 rounded-lg border-2 border-teal-200">
              <p><strong>🧬 16PF理论：</strong>16PF（16种人格因子问卷）由心理学家雷蒙德·卡特尔（Raymond Cattell）开发，基于因素分析识别出16个基本人格特质。这些因子相互独立，共同构成了完整的人格剖面图。</p>
            </div>
            <div className="bg-white p-4 rounded-lg border-2 border-blue-200">
              <p><strong>📊 Sten评分系统：</strong>Sten（Standard Ten）是一种标准十分制评分系统，将原始分数转换为1-10的标准分。Sten分数便于比较和解释，其中5-6为平均水平，1-3为低分，8-10为高分。</p>
            </div>
            <div className="bg-white p-4 rounded-lg border-2 border-cyan-200">
              <p><strong>🎯 应用价值：</strong>16PF广泛应用于职业规划、人员选拔、团队建设、心理咨询等领域。了解自己的人格特征有助于更好地认识自己的优势和发展方向，改善人际关系和工作表现。</p>
            </div>
            <div className="bg-white p-4 rounded-lg border-2 border-orange-200">
              <p><strong>⚠️ 专业建议：</strong>本测试结果仅供个人参考和自我探索。如需专业的人格评估和职业指导，建议咨询专业的心理咨询师或职业规划师。人格具有多面性和发展性，测试结果是对当前状态的反映。</p>
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
            建议深入学习16PF理论，并结合其他性格测试全面了解自己
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

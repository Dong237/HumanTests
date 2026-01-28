import React, { useState } from 'react';
import type { TestResult } from '../types';
import RadarChart from './charts/RadarChart';
import DimensionBars from './charts/DimensionBars';
import DimensionCard from './results/DimensionCard';
import ScoreDistribution from './results/ScoreDistribution';
import { InfoIcon } from './InfoIcon';
import { downloadPDF, downloadCSV, downloadJSON, copyToClipboard } from '../utils/download';
import dimensionData from '../data/dimension-explanations.json';
import normsData from '../data/statistical-norms.json';

interface Props {
  result: TestResult;
  onRestart: () => void;
}

const Results: React.FC<Props> = ({ result, onRestart }) => {
  const [copiedMessage, setCopiedMessage] = useState('');
  const [showGenderComparison, setShowGenderComparison] = useState(false);
  const [selectedDimForDist, setSelectedDimForDist] = useState<string | null>(null);
  const [showDimensionDetails, setShowDimensionDetails] = useState(true);

  const handleCopy = async () => {
    const success = await copyToClipboard(result);
    setCopiedMessage(success ? '已复制到剪贴板！' : '复制失败');
    setTimeout(() => setCopiedMessage(''), 3000);
  };

  // Calculate profile summary
  const getProfileSummary = () => {
    const highTraits = result.dimensionScores
      .filter(d => d.tScore > 60)
      .map(d => dimensionData[d.dimensionId as keyof typeof dimensionData].name);

    const lowTraits = result.dimensionScores
      .filter(d => d.tScore < 40)
      .map(d => dimensionData[d.dimensionId as keyof typeof dimensionData].name);

    return { highTraits, lowTraits };
  };

  const { highTraits, lowTraits } = getProfileSummary();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="excalidraw-card text-center bg-gradient-to-r from-green-50 to-blue-50">
          <h1 className="text-5xl font-bold mb-4 text-gray-800">🎉 测试完成！</h1>
          <p className="text-xl text-gray-600 mb-2">恭喜您完成了全部 240 道题目</p>
          <p className="text-gray-500">
            完成时间：{new Date(result.completedAt).toLocaleString('zh-CN')}
          </p>
        </div>

        {/* Overview Summary */}
        <div className="excalidraw-card bg-gradient-to-br from-purple-50 to-pink-50">
          <h2 className="text-3xl font-bold mb-4 text-gray-800 flex items-center gap-3">
            <span>📊</span>
            您的人格画像
          </h2>
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-xl border-2 border-gray-800">
              <p className="text-gray-700 leading-relaxed">
                根据大五人格模型的评估，您的人格特征呈现出独特的组合。
                {highTraits.length > 0 && (
                  <span className="ml-1">
                    您在 <strong className="text-red-600">{highTraits.join('、')}</strong> 维度上得分较高，
                  </span>
                )}
                {lowTraits.length > 0 && (
                  <span className="ml-1">
                    在 <strong className="text-blue-600">{lowTraits.join('、')}</strong> 维度上得分较低。
                  </span>
                )}
                {highTraits.length === 0 && lowTraits.length === 0 && (
                  <span className="ml-1">
                    您在五个维度上的得分都处于平均范围，显示出平衡的人格特质。
                  </span>
                )}
              </p>
            </div>

            {/* Key Strengths */}
            {highTraits.length > 0 && (
              <div className="bg-white p-5 rounded-xl border-2 border-green-300">
                <h3 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                  ✨ 突出优势
                </h3>
                <p className="text-gray-700 text-sm">
                  基于您的高分维度，您可能在以下方面表现突出：
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {result.dimensionScores
                    .filter(d => d.tScore > 60)
                    .flatMap(d => {
                      const dimData = dimensionData[d.dimensionId as keyof typeof dimensionData];
                      return dimData.highScore.strengths?.slice(0, 2) || [];
                    })
                    .map((strength, idx) => (
                      <span key={idx} className="px-3 py-1 bg-green-50 border-2 border-green-300 rounded-full text-sm text-green-800">
                        {strength}
                      </span>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Visualization Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="excalidraw-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">雷达图</h3>
              <InfoIcon
                title="雷达图说明"
                content="雷达图直观展示您在五个维度上的得分分布。图形越向外延伸，表示该维度得分越高。完美的五边形表示所有维度都处于平均水平。"
              />
            </div>
            <RadarChart scores={result.dimensionScores} />
          </div>

          <div className="excalidraw-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">柱状图</h3>
              <InfoIcon
                title="柱状图说明"
                content="柱状图显示您在每个维度的T分数。50为平均值，60以上为较高，40以下为较低。"
              />
            </div>
            <DimensionBars scores={result.dimensionScores} />
          </div>
        </div>

        {/* Score Distribution Toggle */}
        <div className="excalidraw-card bg-blue-50">
          <h3 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-3">
            <span>📈</span>
            群体分布位置
            <InfoIcon
              title="常模比较"
              content={
                <div className="space-y-2">
                  <p>以下分布图基于{normsData.metadata.year}年中国样本数据（n={normsData.metadata.sampleSize.total}）。</p>
                  <p>显示您的得分在人群中的相对位置。钟形曲线代表正态分布，竖线标记您的位置。</p>
                  <p className="text-sm text-gray-600">数据来源：{normsData.metadata.source}</p>
                </div>
              }
            />
          </h3>
          <p className="text-gray-700 mb-4">点击维度查看您在该维度的群体分布位置</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
            {result.dimensionScores.map(dim => {
              const dimData = dimensionData[dim.dimensionId as keyof typeof dimensionData];
              return (
                <button
                  key={dim.dimensionId}
                  onClick={() => setSelectedDimForDist(selectedDimForDist === dim.dimensionId ? null : dim.dimensionId)}
                  className={`excalidraw-button text-sm py-2 transition-all ${
                    selectedDimForDist === dim.dimensionId
                      ? 'bg-gray-800 text-white'
                      : 'bg-white hover:bg-gray-100'
                  }`}
                >
                  {dimData.name}
                </button>
              );
            })}
          </div>
          {selectedDimForDist && (() => {
            const dim = result.dimensionScores.find(d => d.dimensionId === selectedDimForDist)!;
            const dimData = dimensionData[dim.dimensionId as keyof typeof dimensionData];
            return (
              <ScoreDistribution
                tScore={dim.tScore}
                percentile={dim.percentile}
                dimensionName={dimData.name}
                color={dimData.color}
              />
            );
          })()}
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
                五大维度详细解读
              </h2>
              <p className="text-gray-600 mt-2">
                点击 (i) 图标了解更多关于每个维度的信息，展开子维度查看更细致的分析
              </p>
            </div>
            <span className="text-2xl transform transition-transform duration-200"
              style={{ transform: showDimensionDetails ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              ▼
            </span>
          </button>

          {showDimensionDetails && (
            <div className="p-6 pt-2 space-y-6">
              {result.dimensionScores.map((dim) => (
                <DimensionCard key={dim.dimensionId} dimension={dim} />
              ))}
            </div>
          )}
        </div>

        {/* Gender Comparison */}
        <div className="excalidraw-card">
          <button
            onClick={() => setShowGenderComparison(!showGenderComparison)}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <span>👥</span>
              性别差异统计参考
              <InfoIcon
                title="性别差异说明"
                size="sm"
                content={
                  <div className="space-y-3">
                    <p className="text-sm">{normsData.metadata.note}</p>
                    <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
                      <p className="text-sm text-yellow-800">
                        <strong>⚠️ 重要提示：</strong>
                        这些是群体统计趋势，不代表所有个体。个体差异远大于性别差异。
                      </p>
                    </div>
                  </div>
                }
              />
            </h3>
            <span className="text-2xl transform transition-transform duration-200"
              style={{ transform: showGenderComparison ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              ▼
            </span>
          </button>

          {showGenderComparison && (
            <div className="p-6 pt-2 space-y-4">
              <div className="bg-yellow-50 p-4 rounded-xl border-2 border-yellow-200">
                <p className="text-sm text-yellow-800 mb-3">
                  <strong>📚 数据来源：</strong>戴晓阳, 姚树桥, 蔡太生, 等. NEO个性问卷修订本在中国的应用研究[J]. 中国心理卫生杂志, 2004(03):27-30+26.
                </p>
                <p className="text-sm text-yellow-800">
                  <strong>👥 样本信息：</strong>
                  <br />
                  • 样本量：男性 {normsData.metadata.sampleSize.male} 人，女性 {normsData.metadata.sampleSize.female} 人，共 {normsData.metadata.sampleSize.total} 人
                  <br />
                  • 年龄范围：21-81岁正常成人
                  <br />
                  • 采样地区：{normsData.metadata.region}
                  <br />
                  • 测试年份：{normsData.metadata.year}年
                </p>
              </div>

              <div className="bg-orange-50 p-4 rounded-xl border-2 border-orange-200">
                <p className="text-sm text-orange-800">
                  <strong>⚠️ 重要局限性：</strong>
                  <br />
                  • 该研究距今已有{new Date().getFullYear() - normsData.metadata.year}年，社会文化背景可能已发生变化
                  <br />
                  • 样本主要来自中国大陆特定地区，可能不完全代表其他地区人群
                  <br />
                  • 群体统计趋势不能预测个体特征，个体差异远大于性别差异
                </p>
              </div>

              {Object.entries(normsData.genderComparison).map(([dimId, data]) => {
                const dimData = dimensionData[dimId as keyof typeof dimensionData];
                return (
                  <div key={dimId} className="bg-white p-5 rounded-xl border-2 border-gray-300">
                    <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <span style={{ color: dimData.color }}>●</span>
                      {data.dimensionName}
                      {data.significance && (
                        <span className="text-xs text-red-600">
                          {data.significance === '**' ? '极显著差异' : '显著差异'}
                        </span>
                      )}
                    </h4>

                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                        <div className="text-xs text-blue-600 mb-1">男性平均</div>
                        <div className="text-2xl font-bold text-blue-800">
                          T={data.male.tMean}
                        </div>
                        <div className="text-xs text-blue-600">
                          原始分: {data.male.rawMean.toFixed(1)} (SD={data.male.rawSd.toFixed(1)})
                        </div>
                      </div>
                      <div className="bg-pink-50 p-3 rounded-lg border border-pink-200">
                        <div className="text-xs text-pink-600 mb-1">女性平均</div>
                        <div className="text-2xl font-bold text-pink-800">
                          T={data.female.tMean}
                        </div>
                        <div className="text-xs text-pink-600">
                          原始分: {data.female.rawMean.toFixed(1)} (SD={data.female.rawSd.toFixed(1)})
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-gray-700 mb-2">{data.interpretation}</p>
                    <p className="text-xs text-gray-500 italic">{data.caveat}</p>
                  </div>
                );
              })}

              <div className="bg-purple-50 p-4 rounded-xl border-2 border-purple-200">
                <p className="text-sm text-purple-800">
                  <strong>💡 提示：</strong>{normsData.generalNotes.individualDifferences}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* General Notes */}
        <div className="excalidraw-card bg-gradient-to-r from-blue-50 to-purple-50">
          <h3 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-3">
            <span>📝</span>
            重要说明
          </h3>
          <div className="space-y-3 text-sm text-gray-700">
            <div className="bg-white p-4 rounded-lg border-2 border-blue-200">
              <p><strong>🔄 稳定性：</strong>{normsData.generalNotes.stability}</p>
            </div>
            <div className="bg-white p-4 rounded-lg border-2 border-green-200">
              <p><strong>🌍 情境性：</strong>{normsData.generalNotes.context}</p>
            </div>
            <div className="bg-white p-4 rounded-lg border-2 border-orange-200">
              <p><strong>⚠️ 局限性：</strong>{normsData.generalNotes.limitations}</p>
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
            建议 6 个月后重测，了解您人格特质的变化
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

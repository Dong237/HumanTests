import React from 'react';
import type { TypeScore } from '../../types';
import scoringConfig from '../../data/holland-scoring.json';

interface HollandCodeSummaryProps {
  hollandCode: string;
  topInterests: TypeScore[];
  allScores: TypeScore[];
}

const HollandCodeSummary: React.FC<HollandCodeSummaryProps> = ({ hollandCode, topInterests, allScores }) => {
  const getTypeConfig = (typeId: string) => {
    return scoringConfig.types[typeId as keyof typeof scoringConfig.types] as {
      name: string;
      nameEn: string;
      icon: string;
      color: string;
      careers: string[];
    };
  };

  // Career recommendations based on Holland Code combinations
  const getCodeCareerSuggestion = (code: string): string => {
    const suggestions: Record<string, string> = {
      RIA: '技术创新、工程设计、产品开发',
      RIS: '医疗技术、职业康复、体育教练',
      RIE: '技术管理、工程项目经理、技术创业',
      RIC: '质量工程、系统管理、精密制造',
      RAS: '工艺美术、景观设计、手工创作',
      RAE: '建筑设计、室内装修经营、技术产品营销',
      RAC: '制图员、CAD设计师、技术文档编写',
      RSE: '体育管理、职业培训、安全管理',
      RSC: '医疗护理技术、实验室管理、设备维护',
      REC: '生产管理、物流管理、施工管理',
      IAS: '科学传播、学术研究、教育技术',
      IAE: '创新研发、技术咨询、科技创业',
      IAC: '数据可视化、科学编辑、技术写作',
      ISE: '教育研究、科学教育、健康促进',
      ISC: '医学研究、实验室管理、临床数据分析',
      IEC: '技术管理、数据科学、金融工程',
      ASE: '广告创意、品牌策划、艺术教育',
      ASC: '出版编辑、图书馆管理、文化遗产保护',
      AEC: '时尚管理、创意产业、艺术品经纪',
      SEC: '人力资源管理、教育行政、组织培训',
      ECS: '企业管理、项目管理、商业咨询',
    };

    // Try exact match first, then try any permutation
    if (suggestions[code]) return suggestions[code];

    const chars = code.split('');
    for (const perm of [
      [0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]
    ]) {
      const key = perm.map(i => chars[i]).join('');
      if (suggestions[key]) return suggestions[key];
    }

    return '请结合您的前三类型特点探索职业方向';
  };

  const codeLetters = hollandCode.split('');

  return (
    <div className="excalidraw-card bg-gradient-to-br from-green-50 to-teal-50">
      <h2 className="text-3xl font-bold mb-2 text-gray-800 flex items-center gap-3">
        <span>🏷️</span>
        您的Holland职业代码
      </h2>
      <p className="text-gray-600 mb-6">基于测试结果，以下是您的职业兴趣类型分析</p>

      {/* Holland Code Display */}
      <div className="bg-white p-6 rounded-xl border-2 border-teal-300 mb-6 text-center">
        <p className="text-sm text-teal-700 mb-3">您的Holland三字代码</p>
        <div className="flex items-center justify-center gap-4 mb-4">
          {codeLetters.map((letter, idx) => {
            const config = getTypeConfig(letter);
            return (
              <div key={idx} className="flex flex-col items-center">
                <div
                  className="w-16 h-16 rounded-full border-3 border-gray-800 flex items-center justify-center text-3xl shadow-lg"
                  style={{ backgroundColor: config.color }}
                >
                  {config.icon}
                </div>
                <span className="text-2xl font-bold text-gray-800 mt-2">{letter}</span>
                <span className="text-sm text-gray-600">{config.name}</span>
              </div>
            );
          })}
        </div>
        <p className="text-3xl font-bold text-teal-800 tracking-widest">{hollandCode}</p>
      </div>

      {/* Career Recommendations based on code */}
      <div className="bg-white p-4 rounded-xl border-2 border-green-300 mb-6">
        <h4 className="font-bold text-green-800 mb-2 flex items-center gap-2">
          💼 代码组合推荐方向
        </h4>
        <p className="text-gray-700">{getCodeCareerSuggestion(hollandCode)}</p>
      </div>

      {/* Top Interests with Score Bars */}
      <div className="space-y-4 mb-6">
        {topInterests.map((interest, idx) => {
          const config = getTypeConfig(interest.typeId);
          return (
            <div
              key={interest.typeId}
              className="bg-white p-5 rounded-xl border-2 border-gray-800 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div
                    className="w-14 h-14 rounded-full border-3 border-gray-800 flex items-center justify-center text-2xl"
                    style={{ backgroundColor: config.color }}
                  >
                    {config.icon}
                  </div>
                  <div className="text-center mt-1">
                    <span className="text-xs font-bold text-teal-700">
                      #{idx + 1}
                    </span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-bold text-gray-800">{config.name}</h3>
                    <span className="text-sm text-gray-500">({config.nameEn})</span>
                  </div>
                  {/* Score bar */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex-1 bg-gray-200 h-3 rounded-full border border-gray-800 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${interest.percentage}%`,
                          backgroundColor: config.color,
                        }}
                      />
                    </div>
                    <span className="font-bold text-gray-800 text-lg">{interest.rawScore}/50</span>
                  </div>
                  {/* Career tags */}
                  <div className="flex flex-wrap gap-2">
                    {config.careers.slice(0, 5).map((career, cIdx) => (
                      <span
                        key={cIdx}
                        className="px-3 py-1 rounded-full text-xs font-medium border-2 border-gray-800"
                        style={{ backgroundColor: `${config.color}40` }}
                      >
                        {career}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick overview of all types */}
      <div className="bg-white p-4 rounded-xl border-2 border-gray-300">
        <h4 className="font-bold text-gray-700 mb-3">全部兴趣类型概览</h4>
        <div className="space-y-2">
          {allScores
            .sort((a, b) => b.rawScore - a.rawScore)
            .map((type) => {
              const config = getTypeConfig(type.typeId);
              return (
                <div key={type.typeId} className="flex items-center gap-2">
                  <span className="text-sm w-6">{config.icon}</span>
                  <span className="text-sm text-gray-700 w-16 truncate">{config.name}</span>
                  <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${type.percentage}%`,
                        backgroundColor: config.color,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-600 w-10 text-right">{type.rawScore}</span>
                  {type.isTopInterest && <span className="text-xs">⭐</span>}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default HollandCodeSummary;

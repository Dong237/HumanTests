import React, { useState } from 'react';
import { InfoIcon } from '../InfoIcon';
import scoringConfig from '../../data/mbti-scoring.json';

interface TestIntroProps {
  onStart: () => void;
}

const TestIntro: React.FC<TestIntroProps> = ({ onStart }) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['overview']));

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const dichotomies = scoringConfig.dichotomies;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Welcome Section */}
        <div className="excalidraw-card mb-8 text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-3">
            MBTI 人格类型测试
          </h1>
          <p className="text-xl text-gray-600 mb-2">探索您的人格类型，发现独特的自我</p>
          <p className="text-lg text-purple-600 italic">基于Myers-Briggs人格类型理论</p>
        </div>

        {/* Overview Section */}
        <div className="excalidraw-card mb-6">
          <button
            onClick={() => toggleSection('overview')}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <span>📖</span>
              测试概览
            </h2>
            <span className="text-2xl transform transition-transform duration-200"
              style={{ transform: expandedSections.has('overview') ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              ▼
            </span>
          </button>
          {expandedSections.has('overview') && (
            <div className="p-6 pt-2 space-y-4">
              <p className="text-gray-700 leading-relaxed">
                MBTI (Myers-Briggs Type Indicator) 人格类型指标是由Katherine Cook Briggs和Isabel Briggs Myers
                基于荣格的心理类型理论开发的人格评估工具。该测试通过四个维度的偏好组合，将人格分为16种类型，
                帮助您深入了解自己的认知方式、决策风格和生活态度。
              </p>
              <div className="bg-purple-50 p-4 rounded-xl border-2 border-purple-200">
                <h3 className="font-semibold text-purple-900 mb-3">核心特点</h3>
                <ul className="space-y-2">
                  {[
                    '基于荣格心理类型理论，全球最广泛使用的人格测评工具',
                    '70道精选题目，评估四个核心人格维度',
                    '16种独特人格类型，每种都有独特的优势和发展方向',
                    '包含认知功能分析和职业发展建议',
                    '帮助您理解自己的沟通方式和决策风格',
                    '测试结果可下载保存，方便日后回顾',
                  ].map((feature, idx) => (
                    <li key={idx} className="text-gray-700 flex items-start gap-2">
                      <span className="text-purple-500 mt-1">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Four Dichotomies */}
        <div className="excalidraw-card mb-6">
          <button
            onClick={() => toggleSection('dichotomies')}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <span>🧠</span>
              四大人格维度
            </h2>
            <span className="text-2xl transform transition-transform duration-200"
              style={{ transform: expandedSections.has('dichotomies') ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              ▼
            </span>
          </button>
          {expandedSections.has('dichotomies') && (
            <div className="p-6 pt-2 space-y-4">
              <p className="text-gray-700 leading-relaxed">
                MBTI理论认为，人格由四个基本维度（二分法）组成，每个维度有两个相反的极。
                您在每个维度上的偏好组合，构成了您独特的四字母人格代码。
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {Object.entries(dichotomies).map(([key, dichConfig]) => {
                  const config = dichConfig as any;
                  const poles = config.poles;
                  const poleKeys = Object.keys(poles);
                  return (
                    <div key={key} className="bg-white p-4 rounded-xl border-2 border-gray-300 hover:border-purple-400 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <h3 className="text-lg font-bold text-gray-800">{config.name}</h3>
                          <InfoIcon
                            title={config.name}
                            content={
                              <div className="space-y-3">
                                {poleKeys.map((pole: string) => (
                                  <div key={pole} className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                                    <p className="text-purple-800 font-medium">
                                      {poles[pole].icon} {poles[pole].label} ({poles[pole].labelEn})
                                    </p>
                                    <p className="text-gray-700 text-sm mt-1">{poles[pole].description}</p>
                                  </div>
                                ))}
                              </div>
                            }
                          />
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 text-center p-2 bg-purple-50 rounded-lg border border-purple-200">
                            <span className="text-2xl">{poles[poleKeys[0]].icon}</span>
                            <p className="font-semibold text-purple-800 text-sm mt-1">
                              {poles[poleKeys[0]].label} ({poleKeys[0]})
                            </p>
                          </div>
                          <span className="text-gray-400 font-bold text-xl">vs</span>
                          <div className="flex-1 text-center p-2 bg-indigo-50 rounded-lg border border-indigo-200">
                            <span className="text-2xl">{poles[poleKeys[1]].icon}</span>
                            <p className="font-semibold text-indigo-800 text-sm mt-1">
                              {poles[poleKeys[1]].label} ({poleKeys[1]})
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 16 Types Overview */}
        <div className="excalidraw-card mb-6">
          <button
            onClick={() => toggleSection('types')}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <span>🏷️</span>
              16种人格类型
            </h2>
            <span className="text-2xl transform transition-transform duration-200"
              style={{ transform: expandedSections.has('types') ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              ▼
            </span>
          </button>
          {expandedSections.has('types') && (
            <div className="p-6 pt-2 space-y-4">
              <p className="text-gray-700 leading-relaxed">
                四个维度的偏好组合产生了16种独特的人格类型。每种类型都有自己的优势、成长方向和适合的发展路径。
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                {[
                  { code: 'ISTJ', name: '检查者' },
                  { code: 'ISFJ', name: '守护者' },
                  { code: 'INFJ', name: '提倡者' },
                  { code: 'INTJ', name: '建筑师' },
                  { code: 'ISTP', name: '鉴赏家' },
                  { code: 'ISFP', name: '探险家' },
                  { code: 'INFP', name: '调停者' },
                  { code: 'INTP', name: '逻辑学家' },
                  { code: 'ESTP', name: '企业家' },
                  { code: 'ESFP', name: '表演者' },
                  { code: 'ENFP', name: '竞选者' },
                  { code: 'ENTP', name: '辩论家' },
                  { code: 'ESTJ', name: '总经理' },
                  { code: 'ESFJ', name: '执政官' },
                  { code: 'ENFJ', name: '主人公' },
                  { code: 'ENTJ', name: '指挥官' },
                ].map((type) => (
                  <div key={type.code} className="bg-gradient-to-r from-purple-50 to-indigo-50 p-3 rounded-xl border-2 border-purple-200 text-center">
                    <span className="font-bold text-purple-800 text-lg">{type.code}</span>
                    <p className="text-gray-600 text-sm mt-1">{type.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* How to Take Section */}
        <div className="excalidraw-card mb-6">
          <button
            onClick={() => toggleSection('howto')}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <span>✍️</span>
              答题指南
            </h2>
            <span className="text-2xl transform transition-transform duration-200"
              style={{ transform: expandedSections.has('howto') ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              ▼
            </span>
          </button>
          {expandedSections.has('howto') && (
            <div className="p-6 pt-2 space-y-4">
              {[
                { step: 1, title: '阅读描述', description: '仔细阅读每道题目的描述，思考它在日常生活中是否符合您的真实表现。', tip: '不要过度思考，选择您的第一直觉反应。' },
                { step: 2, title: '选择程度', description: '根据描述与您的符合程度，在5个选项中选择最合适的一个。', tip: '没有对错之分，每个选择都反映您的独特之处。' },
                { step: 3, title: '保持真实', description: '选择最真实反映您日常行为和偏好的选项，而非您理想中的自己。', tip: '真实的回答会带来更准确和有意义的结果。' },
              ].map((instruction) => (
                <div key={instruction.step} className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-xl border-2 border-purple-200">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold flex-shrink-0">
                      {instruction.step}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 mb-1">{instruction.title}</h3>
                      <p className="text-gray-700 text-sm mb-2">{instruction.description}</p>
                      <p className="text-purple-700 text-sm italic">💡 {instruction.tip}</p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Likert Scale */}
              <div className="mt-6 bg-purple-50 p-5 rounded-xl border-2 border-purple-200">
                <h3 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
                  Likert 5点量表
                  <InfoIcon
                    title="Likert 5点量表"
                    content={
                      <div className="space-y-2">
                        <p>Likert量表是心理学研究中常用的自评工具，通过5个等级来衡量您对每个描述的符合程度。</p>
                        <p>本测试中，5点量表从"非常不同意"到"非常同意"，帮助您精确评估各项人格偏好。</p>
                      </div>
                    }
                  />
                </h3>
                <p className="text-purple-800 mb-4">每道题有5个选项，请选择最符合您真实情况的一项：</p>
                <div className="space-y-2">
                  {[
                    { value: 1, label: '非常不同意', when: '这个描述完全不符合您' },
                    { value: 2, label: '比较不同意', when: '这个描述大多不符合您' },
                    { value: 3, label: '中立', when: '您不确定或两者皆有' },
                    { value: 4, label: '比较同意', when: '这个描述大多符合您' },
                    { value: 5, label: '非常同意', when: '这个描述完全符合您' },
                  ].map((option) => (
                    <div key={option.value} className="flex items-center gap-3 bg-white p-2 rounded-lg border border-purple-200">
                      <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center font-bold text-purple-900">
                        {option.value}
                      </div>
                      <div className="flex-1">
                        <span className="font-semibold text-gray-800">{option.label}</span>
                        <span className="text-gray-600 text-sm ml-2">— {option.when}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* What to Expect Section */}
        <div className="excalidraw-card mb-6">
          <button
            onClick={() => toggleSection('expect')}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <span>🎁</span>
              测试结果包含
            </h2>
            <span className="text-2xl transform transition-transform duration-200"
              style={{ transform: expandedSections.has('expect') ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              ▼
            </span>
          </button>
          {expandedSections.has('expect') && (
            <div className="p-6 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { icon: '🧬', title: '四字母人格代码', description: '基于四个维度偏好的独特人格类型编码' },
                  { icon: '📊', title: '维度偏好分析', description: '每个维度的详细得分和偏好强度' },
                  { icon: '🧠', title: '认知功能解读', description: '您的认知功能栈和信息处理方式' },
                  { icon: '💼', title: '职业发展建议', description: '适合您人格类型的职业方向推荐' },
                ].map((section, idx) => (
                  <div key={idx} className="bg-gradient-to-br from-purple-50 to-indigo-50 p-4 rounded-xl border-2 border-purple-200">
                    <div className="text-3xl mb-2">{section.icon}</div>
                    <h3 className="font-bold text-gray-800 mb-2">{section.title}</h3>
                    <p className="text-gray-600 text-sm">{section.description}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 bg-blue-50 p-4 rounded-xl border-2 border-blue-200 text-center">
                <p className="text-gray-700">
                  ⏱️ 预计用时
                  <span className="font-bold ml-2">(10-15分钟)</span>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Privacy & Disclaimer */}
        <div className="excalidraw-card mb-6">
          <div className="p-6 space-y-4">
            <div className="bg-green-50 p-4 rounded-xl border-2 border-green-200">
              <h3 className="font-bold text-green-900 mb-2 flex items-center gap-2">
                <span>🔒</span>
                隐私保护
              </h3>
              <ul className="space-y-1">
                {[
                  '所有数据仅保存在您的浏览器本地',
                  '不会上传任何个人信息到服务器',
                  '您可以随时清除浏览器数据来删除记录',
                ].map((assurance, idx) => (
                  <li key={idx} className="text-green-800 text-sm flex items-start gap-2">
                    <span className="mt-1">✓</span>
                    <span>{assurance}</span>
                  </li>
                ))}
              </ul>
              <p className="text-green-700 text-sm mt-3 italic">您的隐私是我们最重视的事项之一。</p>
            </div>

            <div className="bg-orange-50 p-4 rounded-xl border-2 border-orange-200">
              <h3 className="font-bold text-orange-900 mb-3 flex items-center gap-2">
                <span>⚠️</span>
                免责声明
              </h3>
              <div className="space-y-2">
                <div className="p-2 rounded-lg border bg-red-50 border-red-200">
                  <p className="text-sm text-red-800">
                    ⚠️ 本测试仅供个人参考和自我探索，不能替代专业心理咨询或诊断。
                  </p>
                </div>
                <div className="p-2 rounded-lg border bg-blue-50 border-blue-200">
                  <p className="text-sm text-blue-800">
                    ℹ️ 人格类型没有好坏之分，每种类型都有独特的优势和成长空间。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ready to Start */}
        <div className="excalidraw-card mb-6">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
              <span>✅</span>
              准备开始
            </h2>
            <div className="bg-blue-50 p-5 rounded-xl border-2 border-blue-200 mb-6">
              <h3 className="font-semibold text-blue-900 mb-3">建议确保以下条件：</h3>
              <div className="space-y-2">
                {[
                  '有10-15分钟不受打扰的时间',
                  '处于安静、放松的环境中',
                  '准备好以真实的自我来回答问题',
                  '了解这是探索自我的旅程，没有对错之分',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="text-blue-500 mt-0.5">✓</span>
                    <span className="text-blue-800">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-xl border-2 border-purple-200 mb-6">
              <p className="text-purple-800 leading-relaxed">
                💖 每个人都是独特的，MBTI帮助您更好地理解自己的天赋和偏好。请享受这段自我探索的旅程！
              </p>
            </div>
            <div className="text-center">
              <button
                onClick={onStart}
                className="excalidraw-button text-lg px-12 py-4 text-white bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 cursor-pointer transition-all transform hover:scale-105"
              >
                🚀 开始测试 (70题)
              </button>
            </div>
          </div>
        </div>

        {/* Scientific Basis */}
        <div className="excalidraw-card mb-6 opacity-80">
          <button
            onClick={() => toggleSection('science')}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
              <span>🔬</span>
              科学基础与参考文献
            </h3>
            <span className="text-xl transform transition-transform duration-200"
              style={{ transform: expandedSections.has('science') ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              ▼
            </span>
          </button>
          {expandedSections.has('science') && (
            <div className="p-6 pt-2 space-y-3 text-sm text-gray-600">
              <p>MBTI基于Carl Gustav Jung的心理类型理论，由Katherine Cook Briggs和Isabel Briggs Myers在20世纪40年代开发。</p>
              <p>经过数十年的研究和验证，MBTI已成为全球使用最广泛的人格评估工具之一，每年有超过200万人参与测试。</p>
              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2">应用领域</h4>
                <ul className="space-y-1">
                  {[
                    '职业规划与发展 — 找到适合自己人格的职业方向',
                    '团队建设与协作 — 理解不同类型的沟通和工作风格',
                    '个人成长与自我认知 — 深入了解自己的优势和盲点',
                    '人际关系改善 — 理解差异，提升沟通效果',
                  ].map((app, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="text-purple-500">•</span>
                      {app}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2">参考文献</h4>
                <p className="text-xs text-gray-500 mb-1">Jung, C.G. (1921). Psychological Types.</p>
                <p className="text-xs text-gray-500 mb-1">Myers, I.B. & Myers, P.B. (1995). Gifts Differing: Understanding Personality Type.</p>
                <p className="text-xs text-gray-500 mb-1">McCaulley, M.H. (2000). Myers-Briggs Type Indicator: A bridge between counseling and consulting.</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                <p className="text-purple-800 text-sm">
                  📌 题目来源：
                  <a
                    href="https://openpsychometrics.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 underline hover:text-purple-800 ml-1"
                  >
                    Open Psychometrics
                  </a>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestIntro;

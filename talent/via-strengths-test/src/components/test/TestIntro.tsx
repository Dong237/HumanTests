import React, { useState } from 'react';
import { InfoIcon } from '../InfoIcon';
import introData from '../../data/test-introduction.json';

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Welcome Section */}
        <div className="excalidraw-card mb-8 text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-3">
            {introData.welcome.title}
          </h1>
          <p className="text-xl text-gray-600 mb-2">{introData.welcome.subtitle}</p>
          <p className="text-lg text-indigo-600 italic">{introData.welcome.tagline}</p>
        </div>

        {/* Overview Section */}
        <div className="excalidraw-card mb-6">
          <button
            onClick={() => toggleSection('overview')}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <span>📖</span>
              {introData.overview.title}
            </h2>
            <span className="text-2xl transform transition-transform duration-200"
              style={{ transform: expandedSections.has('overview') ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              ▼
            </span>
          </button>
          {expandedSections.has('overview') && (
            <div className="p-6 pt-2 space-y-4">
              <p className="text-gray-700 leading-relaxed">{introData.overview.description}</p>
              <div className="bg-indigo-50 p-4 rounded-xl border-2 border-indigo-200">
                <h3 className="font-semibold text-indigo-900 mb-3">核心特点</h3>
                <ul className="space-y-2">
                  {introData.overview.features.map((feature, idx) => (
                    <li key={idx} className="text-gray-700 flex items-start gap-2">
                      <span className="text-indigo-500 mt-1">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* VIA Model - 6 Virtues */}
        <div className="excalidraw-card mb-6">
          <button
            onClick={() => toggleSection('virtues')}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <span>🧠</span>
              {introData.viaModel.title}
            </h2>
            <span className="text-2xl transform transition-transform duration-200"
              style={{ transform: expandedSections.has('virtues') ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              ▼
            </span>
          </button>
          {expandedSections.has('virtues') && (
            <div className="p-6 pt-2 space-y-4">
              <p className="text-gray-700 leading-relaxed">{introData.viaModel.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {introData.viaModel.virtues.map((virtue) => (
                  <div key={virtue.id} className="bg-white p-4 rounded-xl border-2 border-gray-300 hover:border-indigo-400 transition-colors">
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">{virtue.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-bold text-gray-800">{virtue.name}</h3>
                          <InfoIcon
                            title={virtue.name}
                            content={
                              <div className="space-y-3">
                                <p className="text-gray-700">{virtue.description}</p>
                                <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-200">
                                  <p className="text-indigo-800 font-medium">包含品格优势：{virtue.strengths}</p>
                                </div>
                              </div>
                            }
                          />
                        </div>
                        <p className="text-gray-600 text-sm">{virtue.description}</p>
                        <p className="text-gray-500 text-xs mt-1">包含：{virtue.strengths}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Signature Strengths Explanation */}
        <div className="excalidraw-card mb-6">
          <button
            onClick={() => toggleSection('signature')}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <span>⭐</span>
              {introData.signatureStrengths.title}
            </h2>
            <span className="text-2xl transform transition-transform duration-200"
              style={{ transform: expandedSections.has('signature') ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              ▼
            </span>
          </button>
          {expandedSections.has('signature') && (
            <div className="p-6 pt-2 space-y-4">
              <p className="text-gray-700 leading-relaxed">{introData.signatureStrengths.description}</p>
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl border-2 border-indigo-200">
                <h3 className="font-semibold text-indigo-900 mb-3">标志性优势的特征</h3>
                <ul className="space-y-2">
                  {introData.signatureStrengths.characteristics.map((char, idx) => (
                    <li key={idx} className="text-gray-700 flex items-start gap-2">
                      <span className="text-indigo-500 mt-1">⭐</span>
                      <span>{char}</span>
                    </li>
                  ))}
                </ul>
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
              {introData.howToTake.title}
            </h2>
            <span className="text-2xl transform transition-transform duration-200"
              style={{ transform: expandedSections.has('howto') ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              ▼
            </span>
          </button>
          {expandedSections.has('howto') && (
            <div className="p-6 pt-2 space-y-4">
              {introData.howToTake.instructions.map((instruction) => (
                <div key={instruction.step} className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border-2 border-blue-200">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold flex-shrink-0">
                      {instruction.step}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 mb-1">{instruction.title}</h3>
                      <p className="text-gray-700 text-sm mb-2">{instruction.description}</p>
                      <p className="text-indigo-700 text-sm italic">💡 {instruction.tip}</p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Likert Scale */}
              <div className="mt-6 bg-purple-50 p-5 rounded-xl border-2 border-purple-200">
                <h3 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
                  {introData.howToTake.likertScale.title}
                  <InfoIcon
                    title="Likert 5点量表"
                    content={
                      <div className="space-y-2">
                        <p>Likert量表是心理学研究中常用的自评工具，通过5个等级来衡量您对每个描述的符合程度。</p>
                        <p>本测试中，5点量表从"非常不符合"到"非常符合"，帮助您精确评估各项品格优势。</p>
                      </div>
                    }
                  />
                </h3>
                <p className="text-purple-800 mb-4">{introData.howToTake.likertScale.description}</p>
                <div className="space-y-2">
                  {introData.howToTake.likertScale.options.map((option) => (
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
              {introData.whatToExpect.title}
            </h2>
            <span className="text-2xl transform transition-transform duration-200"
              style={{ transform: expandedSections.has('expect') ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              ▼
            </span>
          </button>
          {expandedSections.has('expect') && (
            <div className="p-6 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {introData.whatToExpect.sections.map((section, idx) => (
                  <div key={idx} className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border-2 border-blue-200">
                    <div className="text-3xl mb-2">{section.icon}</div>
                    <h3 className="font-bold text-gray-800 mb-2">{section.title}</h3>
                    <p className="text-gray-600 text-sm">{section.description}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 bg-blue-50 p-4 rounded-xl border-2 border-blue-200 text-center">
                <p className="text-gray-700">
                  ⏱️ {introData.whatToExpect.timeEstimate.description}
                  <span className="font-bold ml-2">
                    ({introData.whatToExpect.timeEstimate.min}-{introData.whatToExpect.timeEstimate.max}分钟)
                  </span>
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
                {introData.privacy.title}
              </h3>
              <ul className="space-y-1">
                {introData.privacy.assurances.map((assurance, idx) => (
                  <li key={idx} className="text-green-800 text-sm flex items-start gap-2">
                    <span className="mt-1">✓</span>
                    <span>{assurance}</span>
                  </li>
                ))}
              </ul>
              <p className="text-green-700 text-sm mt-3 italic">{introData.privacy.note}</p>
            </div>

            <div className="bg-orange-50 p-4 rounded-xl border-2 border-orange-200">
              <h3 className="font-bold text-orange-900 mb-3 flex items-center gap-2">
                <span>⚠️</span>
                {introData.disclaimer.title}
              </h3>
              <div className="space-y-2">
                {introData.disclaimer.points.map((point, idx) => (
                  <div key={idx} className={`p-2 rounded-lg border ${
                    point.type === 'warning' ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'
                  }`}>
                    <p className={`text-sm ${point.type === 'warning' ? 'text-red-800' : 'text-blue-800'}`}>
                      {point.type === 'warning' ? '⚠️ ' : 'ℹ️ '}
                      {point.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Ready to Start Checklist */}
        <div className="excalidraw-card mb-6">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
              <span>✅</span>
              {introData.readyToStart.title}
            </h2>
            <div className="bg-blue-50 p-5 rounded-xl border-2 border-blue-200 mb-6">
              <h3 className="font-semibold text-blue-900 mb-3">建议确保以下条件：</h3>
              <div className="space-y-2">
                {introData.readyToStart.checklist.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="text-blue-500 mt-0.5">✓</span>
                    <span className="text-blue-800">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border-2 border-blue-200 mb-6">
              <p className="text-indigo-800 leading-relaxed">
                💖 {introData.readyToStart.encouragement}
              </p>
            </div>
            <div className="text-center">
              <button
                onClick={onStart}
                className="excalidraw-button text-lg px-12 py-4 text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 cursor-pointer transition-all transform hover:scale-105"
              >
                🚀 {introData.readyToStart.buttonText}
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
              {introData.scientificBasis.title}
            </h3>
            <span className="text-xl transform transition-transform duration-200"
              style={{ transform: expandedSections.has('science') ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              ▼
            </span>
          </button>
          {expandedSections.has('science') && (
            <div className="p-6 pt-2 space-y-3 text-sm text-gray-600">
              <p>{introData.scientificBasis.development}</p>
              <p>{introData.scientificBasis.validation}</p>
              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2">应用领域</h4>
                <ul className="space-y-1">
                  {introData.scientificBasis.applications.map((app, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="text-indigo-500">•</span>
                      {app}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2">参考文献</h4>
                {introData.scientificBasis.references.map((ref, idx) => (
                  <p key={idx} className="text-xs text-gray-500 mb-1">{ref}</p>
                ))}
              </div>
              <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-200">
                <p className="text-indigo-800 text-sm">
                  📌 题目来源：
                  <a
                    href={introData.scientificBasis.source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 underline hover:text-indigo-800 ml-1"
                  >
                    {introData.scientificBasis.source.name}
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

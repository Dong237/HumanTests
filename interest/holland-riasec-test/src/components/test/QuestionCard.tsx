import React from 'react';
import type { Question, Answer } from '../../types';

interface QuestionCardProps {
  question: Question;
  currentAnswer?: Answer;
  onAnswer: (score: number) => void;
  onPrevious: () => void;
  onNext: () => void;
  isFirst: boolean;
  isLast: boolean;
  progress: number;
  totalQuestions: number;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  currentAnswer,
  onAnswer,
  onPrevious,
  onNext,
  isFirst,
  isLast,
  progress,
  totalQuestions,
}) => {
  const likertOptions = [
    { value: 1, label: '非常不感兴趣', color: 'bg-red-200 hover:bg-red-300' },
    { value: 2, label: '不太感兴趣', color: 'bg-orange-200 hover:bg-orange-300' },
    { value: 3, label: '一般', color: 'bg-yellow-200 hover:bg-yellow-300' },
    { value: 4, label: '比较感兴趣', color: 'bg-green-200 hover:bg-green-300' },
    { value: 5, label: '非常感兴趣', color: 'bg-teal-200 hover:bg-teal-300' },
  ];

  const handleAnswerClick = (score: number) => {
    onAnswer(score);
    // Auto-advance to next question after a brief delay for visual feedback
    if (!isLast) {
      setTimeout(() => {
        onNext();
      }, 300);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              进度: {question.number} / {totalQuestions} 题
            </span>
            <span className="text-sm font-medium text-gray-700">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill bg-gradient-to-r from-teal-400 to-green-400"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="excalidraw-card">
          <div className="text-center mb-8">
            <div className="inline-block px-4 py-2 bg-teal-100 rounded-full border-2 border-teal-300 mb-4">
              <span className="text-teal-900 font-semibold">
                题目 {question.number}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-medium text-gray-800 leading-relaxed">
              {question.text}
            </h2>
          </div>

          {/* Likert Scale Options */}
          <div className="space-y-3">
            {likertOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswerClick(option.value)}
                className={`
                  w-full p-4 rounded-xl border-2 border-gray-800 transition-all
                  ${currentAnswer?.score === option.value
                    ? 'ring-4 ring-teal-400 shadow-lg scale-105'
                    : 'hover:scale-102'
                  }
                  ${option.color}
                `}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-800">{option.label}</span>
                  {currentAnswer?.score === option.value && (
                    <span className="text-2xl">✓</span>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 gap-4">
            <button
              onClick={onPrevious}
              disabled={isFirst}
              className={`
                excalidraw-button flex-1
                ${isFirst
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }
              `}
            >
              ← 上一题
            </button>
            <button
              onClick={onNext}
              disabled={!currentAnswer}
              className={`
                excalidraw-button flex-1
                ${!currentAnswer
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : isLast
                    ? 'bg-gradient-to-r from-green-400 to-teal-400 text-white hover:from-green-500 hover:to-teal-500'
                    : 'bg-gradient-to-r from-teal-400 to-green-400 text-white hover:from-teal-500 hover:to-green-500'
                }
              `}
            >
              {isLast ? '完成测试 ✓' : '下一题 →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;

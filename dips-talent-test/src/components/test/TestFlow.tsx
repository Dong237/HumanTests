import React, { useState, useEffect } from 'react';
import QuestionCard from './QuestionCard';
import type { Question, Answer } from '../../types';
import questionsData from '../../data/dips-questions.json';

interface TestFlowProps {
  onComplete: (answers: Answer[]) => void;
}

const TestFlow: React.FC<TestFlowProps> = ({ onComplete }) => {
  const questions: Question[] = questionsData.questions;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);

  // Load saved progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('dips-progress');
    if (saved) {
      const { answers: savedAnswers, index } = JSON.parse(saved);
      setAnswers(savedAnswers);
      setCurrentIndex(index);
    }
  }, []);

  // Save progress
  useEffect(() => {
    localStorage.setItem('dips-progress', JSON.stringify({
      answers,
      index: currentIndex,
    }));
  }, [answers, currentIndex]);

  const handleAnswer = (score: number) => {
    const questionNumber = questions[currentIndex].number;
    const newAnswers = answers.filter(a => a.questionNumber !== questionNumber);
    newAnswers.push({ questionNumber, score });
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Complete the test
      localStorage.removeItem('dips-progress');
      onComplete(answers);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const currentQuestion = questions[currentIndex];
  const currentAnswer = answers.find(a => a.questionNumber === currentQuestion.number);
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <QuestionCard
      question={currentQuestion}
      currentAnswer={currentAnswer}
      onAnswer={handleAnswer}
      onNext={handleNext}
      onPrevious={handlePrevious}
      isFirst={currentIndex === 0}
      isLast={currentIndex === questions.length - 1}
      progress={progress}
      totalQuestions={questions.length}
    />
  );
};

export default TestFlow;

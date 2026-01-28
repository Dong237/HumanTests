import { useState, useEffect } from 'react';
import TestIntro from './components/test/TestIntro';
import TestFlow from './components/test/TestFlow';
import Results from './components/results/Results';
import { calculateScores } from './utils/scoring';
import type { Answer, TestResult, TestView, Question } from './types';

// Import data files - these will be created separately
import questionsData from './data/enneagram-questions.json';
import scoringConfig from './data/enneagram-scoring.json';
import typeProfiles from './data/type-profiles.json';
import introData from './data/test-introduction.json';

function App() {
  const [view, setView] = useState<TestView>('intro');
  const [result, setResult] = useState<TestResult | null>(null);

  // Check for saved progress on mount
  useEffect(() => {
    const saved = localStorage.getItem('enneagram-progress');
    if (saved) {
      const { answers } = JSON.parse(saved);
      if (answers && answers.length > 0) {
        // User has progress, stay on intro but could add a "continue" option
        console.log('Found saved progress with', answers.length, 'answers');
      }
    }
  }, []);

  const handleStart = () => {
    setView('test');
  };

  const handleComplete = (answers: Answer[]) => {
    const { typeScores, primaryType, wing, enneagramCode, triad } = calculateScores(
      answers,
      scoringConfig
    );

    const testResult: TestResult = {
      answers,
      typeScores,
      primaryType,
      wing,
      enneagramCode,
      triad,
      completedAt: new Date(),
    };

    setResult(testResult);
    setView('results');
  };

  const handleRestart = () => {
    setResult(null);
    setView('intro');
    localStorage.removeItem('enneagram-progress');
  };

  const questions: Question[] = (questionsData as any).questions;

  return (
    <div className="min-h-screen bg-gray-50">
      {view === 'intro' && (
        <TestIntro onStart={handleStart} introData={introData} />
      )}
      {view === 'test' && (
        <TestFlow onComplete={handleComplete} questions={questions} />
      )}
      {view === 'results' && result && (
        <Results result={result} typeProfiles={typeProfiles} onRestart={handleRestart} />
      )}
    </div>
  );
}

export default App;

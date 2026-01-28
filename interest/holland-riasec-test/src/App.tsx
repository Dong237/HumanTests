import { useState } from 'react';
import TestIntro from './components/TestIntro';
import TestFlow from './components/test/TestFlow';
import Results from './components/Results';
import { calculateScores } from './utils/scoring';
import type { Answer, TestResult, TestView } from './types';

function App() {
  const [view, setView] = useState<TestView>('intro');
  const [result, setResult] = useState<TestResult | null>(null);

  const handleStart = () => {
    setView('test');
  };

  const handleComplete = (answers: Answer[]) => {
    const { typeScores, hollandCode } = calculateScores(answers);
    const testResult: TestResult = {
      answers,
      typeScores,
      hollandCode,
      completedAt: new Date(),
    };
    setResult(testResult);
    setView('results');
  };

  const handleRestart = () => {
    setResult(null);
    setView('intro');
    localStorage.removeItem('holland-progress');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {view === 'intro' && <TestIntro onStart={handleStart} />}
      {view === 'test' && <TestFlow onComplete={handleComplete} />}
      {view === 'results' && result && <Results result={result} onRestart={handleRestart} />}
    </div>
  );
}

export default App;

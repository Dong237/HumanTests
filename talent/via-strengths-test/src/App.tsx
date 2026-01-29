import { useState } from 'react';
import TestIntro from './components/test/TestIntro';
import TestFlow from './components/test/TestFlow';
import Results from './components/results/Results';
import { calculateScores } from './utils/scoring';
import type { Answer, TestResult, TestView } from './types';
import scoringData from './data/via-scoring.json';
import strengthProfiles from './data/strength-profiles.json';

function App() {
  const [view, setView] = useState<TestView>('intro');
  const [result, setResult] = useState<TestResult | null>(null);

  const handleStart = () => {
    setView('test');
  };

  const handleComplete = (answers: Answer[]) => {
    const testResult = calculateScores(answers, scoringData);
    setResult(testResult);
    setView('results');
  };

  const handleRestart = () => {
    setResult(null);
    setView('intro');
    localStorage.removeItem('via-strengths-progress');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {view === 'intro' && <TestIntro onStart={handleStart} />}
      {view === 'test' && <TestFlow onComplete={handleComplete} />}
      {view === 'results' && result && (
        <Results
          result={result}
          strengthProfiles={strengthProfiles}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}

export default App;

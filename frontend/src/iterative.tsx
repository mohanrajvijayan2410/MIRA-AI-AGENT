import React, { useState } from 'react';
import { Brain, Sparkles } from 'lucide-react';
import { TaskInput } from './components/TaskInput';
import { MethodSelector } from './components/MethodSelector';
import { GenerateButton } from './components/GenerateButton';
import { OutputDisplay } from './components/OutputDisplay';
import { IterativeService } from './services/iterativeService';
import { SequencingMethod, ComparisonResult, IterativeMethodResponse } from './types';
import { SequentialMethodResponse, ParallelMethodResponse } from './services/iterativeService';

const iterativeService = new IterativeService();


function App() {
  const [task, setTask] = useState('');
  const [method, setMethod] = useState<SequencingMethod | 'both'>('sequential');
  const [iterativeResponse, setIterativeResponse] = useState<IterativeMethodResponse | null>(null);
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGeneratePlan = async () => {
    if (!task.trim()) return;

    setLoading(true);
    setError(null);
    setComparisonResult(null);
    setIterativeResponse(null);

    try {
      if (method === 'both') {
        const response = await iterativeService.callFeatureComparison(task);
        console.log(response);
        setIterativeResponse(response);
      } else {
        let response: SequentialMethodResponse | ParallelMethodResponse;
        if (method === 'sequential') {
          response = await iterativeService.callSequentialMethod(task);
        } else {
          response = await iterativeService.callParallelMethod(task);
        }
        
        setIterativeResponse(response);
        setComparisonResult(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = task.trim().length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">

            <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold  text-black  text-center sm:text-left">
             ITERATIVE METHOD -
            </h1>
            <div className='h-10'>
        
            <img src="krama.png" alt="" />
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Input Panel */}
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 shadow-lg border border-white/20">
          

              <div className="space-y-4 sm:space-y-6">
                <TaskInput
                  value={task}
                  onChange={setTask}
                  placeholder="e.g., Wash and Hang 5 Shirts and 5 Towels"
                />
                <MethodSelector
                  value={method}
                  onChange={setMethod}
                />
                <GenerateButton
                  onClick={handleGeneratePlan}
                  loading={loading}
                  disabled={!isFormValid}
                />
              </div>
            </div>
          </div>

          {/* Output Panel */}
          <div className="space-y-4 sm:space-y-6">
            <OutputDisplay
              content=""
              comparisonResult={comparisonResult}
              iterativeResponse={iterativeResponse}
              loading={loading}
              error={error}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

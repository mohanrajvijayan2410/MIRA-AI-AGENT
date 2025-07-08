import React, { useState } from 'react';
import { Brain, Sparkles } from 'lucide-react';
import { TaskInput } from './components/TaskInput';
import { MethodSelector } from './components/MethodSelector';
import { ApiSelector } from './components/ApiSelector';
import { GenerateButton } from './components/GenerateButton';
import { OutputDisplay } from './components/OutputDisplay';
import { ApiService } from './services/apiService';
import { createPrompt } from './services/promptService';
import { AI_PROVIDERS } from './config/aiProviders';
import { SequencingMethod, ComparisonResult } from './types';

const apiService = new ApiService();

function App() {
  const [task, setTask] = useState('');
  const [method, setMethod] = useState<SequencingMethod | 'both'>('sequential');
  const [selectedProvider, setSelectedProvider] = useState('');
  const [generatedPlan, setGeneratedPlan] = useState('');
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGeneratePlan = async () => {
    if (!task.trim() || !selectedProvider) return;

    setLoading(true);
    setError(null);
    setComparisonResult(null);

    try {
      const provider = AI_PROVIDERS.find(p => p.id === 'groq');
      if (!provider) {
        throw new Error('Selected provider not found');
      }

      if (method === 'both') {
        const sequentialPrompt = createPrompt(task, 'sequential');
        const parallelPrompt = createPrompt(task, 'parallel');

        const [sequentialPlan, parallelPlan] = await Promise.all([
          apiService.generatePlan(provider, sequentialPrompt),
          apiService.generatePlan(provider, parallelPrompt)
        ]);

        setComparisonResult({
          sequential: sequentialPlan,
          parallel: parallelPlan
        });
        setGeneratedPlan('');
      } else {
        const prompt = createPrompt(task, method);
        const plan = await apiService.generatePlan(provider, prompt);
        setGeneratedPlan(plan);
        setComparisonResult(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = task.trim().length > 0 && selectedProvider;

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
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Configuration</h2>
              </div>

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
                <ApiSelector
                  providers={AI_PROVIDERS}
                  value={selectedProvider}
                  onChange={setSelectedProvider}
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
              content={generatedPlan}
              comparisonResult={comparisonResult}
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

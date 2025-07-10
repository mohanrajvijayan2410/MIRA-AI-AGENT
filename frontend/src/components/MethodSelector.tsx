import React from 'react';
import { ArrowRight, Shuffle, GitCompare } from 'lucide-react';
import { SequencingMethod } from '../types';

interface MethodSelectorProps {
  value: SequencingMethod | 'both';
  onChange: (method: SequencingMethod | 'both') => void;
}

export const MethodSelector: React.FC<MethodSelectorProps> = ({ value, onChange }) => {
  const methods = [
    {
      id: 'sequential' as SequencingMethod,
      name: 'Sequential Method',
      description: 'Complete each object\'s full process before starting the next object',
      icon: ArrowRight
    },
    {
      id: 'parallel' as SequencingMethod,
      name: 'Step-by-Step Parallel Method',
      description: 'Group all similar actions together for parallel execution',
      icon: Shuffle
    },
    {
      id: 'both' as const,
      name: 'Feature Comparison',
      description: 'Compare both sequential and parallel methods side by side',
      icon: GitCompare
    }
  ];

  return (
    <div className="space-y-2">

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {methods.map((method) => {
          const Icon = method.icon;
          return (
            <button
              key={method.id}
              onClick={() => onChange(method.id)}
              className={`p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                value === method.id
                  ? 'border-blue-500 bg-blue-50 text-blue-900'
                  : 'border-gray-200 bg-white/80 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start sm:items-center gap-2 sm:gap-3">
                <Icon className={`w-4 h-4 sm:w-5 sm:h-5 mt-0.5 sm:mt-0 flex-shrink-0 ${value === method.id ? 'text-blue-600' : 'text-gray-500'}`} />
                <div>
                  <div className="text-sm sm:text-base font-medium">{method.name}</div>
                  <div className="text-xs sm:text-sm text-gray-600 mt-1">{method.description}</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
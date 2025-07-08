import React from 'react';
import { Cloud } from 'lucide-react';
import { AIProvider } from '../types';

interface ApiSelectorProps {
  providers: AIProvider[];
  value: string;
  onChange: (providerId: string) => void;
}

export const ApiSelector: React.FC<ApiSelectorProps> = ({ providers, value, onChange }) => {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <Cloud className="w-4 h-4" />
        AI Provider
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
      >
    
        {providers.map((provider) => (
          <option key={provider.id} value={provider.id} defaultChecked>
            {provider.name}
          </option>
        ))}
      </select>
    </div>
  );
};
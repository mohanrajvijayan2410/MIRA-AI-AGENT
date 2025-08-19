import React from 'react';
import { FileText } from 'lucide-react';

interface TaskInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const TaskInput: React.FC<TaskInputProps> = ({ 
  value, 
  onChange, 
  placeholder = "Enter your task description..." 
}) => {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <FileText className="w-4 h-4" />
        Task Description
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-14 sm:h-22 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200 bg-white/80 backdrop-blur-sm"
        rows={3}
      />
      <div className="text-xs text-gray-500">
        {value.length}/500 characters
      </div>
    </div>
  );
};
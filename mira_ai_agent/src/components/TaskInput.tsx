import React from 'react';
import { FileText } from 'lucide-react';

interface TaskInputProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  maxLength?: number;
}

export const TaskInput: React.FC<TaskInputProps> = ({ 
  value = "", 
  onChange, 
  placeholder = "Enter your task description...",
  disabled = false,
  onKeyDown,
  maxLength = 500,
}) => {
  const currentLength = (value || "").length;

  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <FileText className="w-4 h-4" />
        Task Description
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full h-20 sm:h-24 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200 bg-white/80 backdrop-blur-sm"
        rows={3}
      />
      <div className="text-xs text-gray-500">
        {currentLength}/{maxLength} characters
      </div>
    </div>
  );
};

export default TaskInput;
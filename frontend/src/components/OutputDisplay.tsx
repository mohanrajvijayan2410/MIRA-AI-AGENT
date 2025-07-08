import React from 'react';
import { FileText, Copy, CheckCircle, Clock, ArrowRight, CheckSquare, AlertCircle, GitCompare } from 'lucide-react';
import { PlanRenderer } from './PlanRenderer';
import { ComparisonTable } from './ComparisonTable';
import { ComparisonResult } from '../types';

interface OutputDisplayProps {
  content: string;
  comparisonResult: ComparisonResult | null;
  loading: boolean;
  error: string | null;
}

export const OutputDisplay: React.FC<OutputDisplayProps> = ({ content, comparisonResult, loading, error }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      const textToCopy = comparisonResult 
        ? `Sequential Method:\n${comparisonResult.sequential}\n\nParallel Method:\n${comparisonResult.parallel}`
        : content;
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-200 shadow-lg">
        <div className="animate-pulse space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-300 to-purple-300 rounded-lg"></div>
            <div className="w-48 h-6 bg-gray-300 rounded-lg"></div>
          </div>
          
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-3 sm:p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                  <div className="w-32 h-4 bg-gray-300 rounded"></div>
                </div>
                <div className="space-y-2 ml-8 sm:ml-10">
                  <div className="w-full h-3 bg-gray-300 rounded"></div>
                  <div className="w-3/4 h-3 bg-gray-300 rounded"></div>
                  <div className="w-5/6 h-3 bg-gray-300 rounded"></div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
            <div className="w-40 h-5 bg-gray-300 rounded mb-3"></div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-8 bg-gray-300 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 sm:p-6 shadow-lg">
        <div className="flex items-center gap-3 text-red-700 mb-3">
          <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="font-semibold text-base sm:text-lg">Generation Failed</span>
        </div>
        <p className="text-sm sm:text-base text-red-600 leading-relaxed">{error}</p>
        <div className="mt-3 sm:mt-4 p-3 bg-red-100 rounded-lg">
          <p className="text-xs sm:text-sm text-red-700">
            💡 <strong>Tip:</strong> Try selecting a different AI provider or simplifying your task description.
          </p>
        </div>
      </div>
    );
  }

  if (!content && !comparisonResult) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 border-2 border-dashed border-gray-300 rounded-xl p-6 sm:p-8 lg:p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">Ready to Generate</h3>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            Enter your task, select a sequencing method and AI provider, then click "Generate Plan" to see your structured execution plan appear here.
          </p>
        </div>
      </div>
    );
  }

  const isComparison = !!comparisonResult;
  const displayTitle = isComparison ? 'Method Comparison Results' : 'Generated Execution Plan';
  const displayIcon = isComparison ? GitCompare : CheckSquare;

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200 shadow-lg overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200 gap-3 sm:gap-0">
        <div className="flex items-center gap-3">
    
          <div>
            <span className="text-sm sm:text-base font-semibold text-gray-800">{displayTitle}</span>
            <div className="text-xs text-gray-600 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {new Date().toLocaleString()}
            </div>
          </div>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-600 hover:text-gray-800 hover:bg-white/80 rounded-lg transition-all duration-200 border border-gray-200 hover:border-gray-300 w-full sm:w-auto justify-center sm:justify-start"
        >
          {copied ? (
            <>
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-green-600">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              {isComparison ? 'Copy Comparison' : 'Copy Plan'}
            </>
          )}
        </button>
      </div>
      
      <div className="max-h-[400px] sm:max-h-[500px] lg:max-h-[600px] overflow-y-auto">
        {isComparison ? (
          <ComparisonTable comparisonResult={comparisonResult} />
        ) : (
          <PlanRenderer content={content} />
        )}
      </div>
    </div>
  );
};
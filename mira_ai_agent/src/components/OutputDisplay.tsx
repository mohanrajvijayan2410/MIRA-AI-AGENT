import React from 'react';
import { FileText, Copy, CheckCircle, Clock, ArrowRight, CheckSquare, AlertCircle, GitCompare } from 'lucide-react';
import { PlanRenderer } from './PlanRenderer';
import { ComparisonTable } from './ComparisonTable';
import { ComparisonResult, IterativeMethodResponse, FeatureComparisonResult } from '../types';
import { resolve } from 'path';

interface OutputDisplayProps {
  content: string;
  comparisonResult: ComparisonResult | null;
  iterativeResponse?: IterativeMethodResponse | null;
  featureComparison?: FeatureComparisonResult | null;
  loading: boolean;
  error: string | null;
}

export const OutputDisplay: React.FC<OutputDisplayProps> = ({ 
  content, 
  comparisonResult, 
  iterativeResponse,
  featureComparison,
  loading, 
  error 
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      const textToCopy = featureComparison
        ? JSON.stringify(featureComparison, null, 2)
        : comparisonResult 
        ? `Sequential Method:\n${comparisonResult.sequential}\n\nParallel Method:\n${comparisonResult.parallel}`
        : iterativeResponse
        ? JSON.stringify(iterativeResponse, null, 2)
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

  

  const isComparison = !!comparisonResult || !!featureComparison;
  const isIterative = !!iterativeResponse;
  
  let displayTitle = 'Generated Execution Plan';
  if (featureComparison) displayTitle = 'Feature Comparison Results';
  else if (comparisonResult) displayTitle = 'Method Comparison Results';
  else if (iterativeResponse) displayTitle = `${iterativeResponse.method} Plan`;
  
  const displayIcon = isComparison ? GitCompare : CheckSquare;

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200 shadow-lg overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200 gap-3 sm:gap-0">
        <div className="flex items-center gap-3">
    
          <div>
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
        {featureComparison ? (
          <FeatureComparisonTable featureComparison={featureComparison} />
        ) : comparisonResult ? (
          <ComparisonTable comparisonResult={comparisonResult} />
        ) : iterativeResponse ? (
          <IterativePlanRenderer response={iterativeResponse} />
        ) : (
          <PlanRenderer content={iterativeResponse} />
        )}
      </div>
    </div>
  );
};

// New component for feature comparison
const FeatureComparisonTable: React.FC<{ featureComparison: FeatureComparisonResult }> = ({ featureComparison }) => {
  return (
    <div className="p-4 sm:p-6">
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        <div className="bg-gray-50 px-4 sm:px-6 py-3 border-b border-gray-200">
          <h4 className="text-base font-medium text-gray-800 flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-purple-600" />
            Feature Comparison Analysis
          </h4>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Feature
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                  Sequential Method
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-purple-500 uppercase tracking-wider">
                  Parallel Method
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {featureComparison.table.map((row, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    {row.feature}
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-sm text-blue-800">
                    {row.sequential}
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-sm text-purple-800">
                    {row.parallel}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// New component for iterative method responses
const IterativePlanRenderer: React.FC<{ response: IterativeMethodResponse }> = ({ response }) => {
  const getMethodColor = (method: string) => {
    return 'from-gray-500 to-gray-600';
  };
  console.log(response);

  const getInstructionTypeColor = (type: string) => {
    if (type.toLowerCase().includes('simple')) return 'from-green-500 to-emerald-500';
    if (type.toLowerCase().includes('purpose')) return 'from-blue-500 to-cyan-500';
    if (type.toLowerCase().includes('mandatory')) return 'from-red-500 to-pink-500';
    if (type.toLowerCase().includes('conditional')) return 'from-purple-500 to-violet-500';
    return 'from-orange-500 to-amber-500';
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header Section */}


      <div className="prose max-w-full" dangerouslySetInnerHTML={{ __html: response }}></div>


    </div>
  );
};
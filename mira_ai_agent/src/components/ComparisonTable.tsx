import React from 'react';
import { 
  ArrowRight, 
  Shuffle, 
  Clock, 
  CheckCircle2, 
  GitBranch,
  Zap,
  BarChart3,
  Target,
  Timer,
  Network
} from 'lucide-react';
import { ComparisonResult } from '../types';

interface ComparisonTableProps {
  comparisonResult: ComparisonResult;
}

interface ParsedStep {
  number: number;
  requiredState: string;
  instruction: string;
  instructionType: string;
  resultingState: string;
  dependencies: string;
}

interface ParsedPlan {
  task: string;
  method: string;
  generated: string;
  steps: ParsedStep[];
  totalSteps: number;
  estimatedTime: string;
  criticalPath: string;
  parallelOpportunities: string;
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({ comparisonResult }) => {
  const parsePlan = (content: string): ParsedPlan | null => {
    try {
      const lines = content.split('\n');
      const plan: ParsedPlan = {
        task: '',
        method: '',
        generated: '',
        steps: [],
        totalSteps: 0,
        estimatedTime: '',
        criticalPath: '',
        parallelOpportunities: ''
      };

      // Extract header information
      for (const line of lines) {
        if (line.includes('**Task**:')) {
          plan.task = line.replace('**Task**:', '').trim();
        }
        if (line.includes('**Method**:')) {
          plan.method = line.replace('**Method**:', '').trim();
        }
        if (line.includes('**Generated**:')) {
          plan.generated = line.replace('**Generated**:', '').trim();
        }
      }

      // Extract steps
      let currentStep: Partial<ParsedStep> = {};
      let stepNumber = 0;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        if (line.match(/^Step \d+:/)) {
          if (currentStep.number) {
            plan.steps.push(currentStep as ParsedStep);
          }
          stepNumber++;
          currentStep = { number: stepNumber };
        }
        
        if (line.startsWith('- Required State:')) {
          currentStep.requiredState = line.replace('- Required State:', '').trim();
        }
        if (line.startsWith('- Instruction:')) {
          currentStep.instruction = line.replace('- Instruction:', '').trim();
        }
        if (line.startsWith('- Instruction Type:')) {
          currentStep.instructionType = line.replace('- Instruction Type:', '').trim();
        }
        if (line.startsWith('- Resulting State:')) {
          currentStep.resultingState = line.replace('- Resulting State:', '').trim();
        }
        if (line.startsWith('- Dependencies:')) {
          currentStep.dependencies = line.replace('- Dependencies:', '').trim();
        }
      }

      if (currentStep.number) {
        plan.steps.push(currentStep as ParsedStep);
      }

      // Extract summary information
      for (const line of lines) {
        if (line.includes('- Total Steps:')) {
          plan.totalSteps = parseInt(line.replace('- Total Steps:', '').trim()) || plan.steps.length;
        }
        if (line.includes('- Estimated Time:')) {
          plan.estimatedTime = line.replace('- Estimated Time:', '').trim();
        }
        if (line.includes('- Critical Path:')) {
          plan.criticalPath = line.replace('- Critical Path:', '').trim();
        }
        if (line.includes('- Parallel Opportunities:')) {
          plan.parallelOpportunities = line.replace('- Parallel Opportunities:', '').trim();
        }
      }

      return plan;
    } catch (error) {
      console.error('Error parsing plan:', error);
      return null;
    }
  };

  const sequentialPlan = parsePlan(comparisonResult.sequential);
  const parallelPlan = parsePlan(comparisonResult.parallel);

  if (!sequentialPlan || !parallelPlan) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 font-medium">Unable to parse comparison data</p>
          <p className="text-yellow-700 text-sm mt-1">Displaying raw content:</p>
        </div>
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Sequential Method</h3>
            <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono leading-relaxed bg-gray-50 p-4 rounded-lg">
              {comparisonResult.sequential}
            </pre>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Parallel Method</h3>
            <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono leading-relaxed bg-gray-50 p-4 rounded-lg">
              {comparisonResult.parallel}
            </pre>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-lg p-4 sm:p-6 border border-green-100">
        <div className="flex items-start gap-4">

          <div className="flex-1">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 break-words">{sequentialPlan.task}</h2>
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm">
              <div className="flex items-center gap-2 text-green-700">
                <BarChart3 className="w-4 h-4" />
                <span className="font-medium">Comparison Analysis</span>
              </div>
              <div className="flex items-center gap-2 text-teal-700">
                <Clock className="w-4 h-4" />
                <span className="font-medium">Generated:</span>
                <span className="break-words">{sequentialPlan.generated}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Method Overview Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <ArrowRight className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-blue-800">Sequential Completion</h3>
          </div>
          <p className="text-sm text-blue-700 mb-4">Complete each object's full process before starting the next</p>
          
          <div className="space-y-2 text-xs sm:text-sm">
            <div className="flex justify-between">
              <span className="text-blue-600 font-medium">Total Steps:</span>
              <span className="text-blue-800">{sequentialPlan.totalSteps}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-600 font-medium">Est. Time:</span>
              <span className="text-blue-800">{sequentialPlan.estimatedTime}</span>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 sm:p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Shuffle className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-purple-800">Step-by-Step Parallel Method</h3>
          </div>
          <p className="text-sm text-purple-700 mb-4">Group similar actions together for parallel execution</p>
          
          <div className="space-y-2 text-xs sm:text-sm">
            <div className="flex justify-between">
              <span className="text-purple-600 font-medium">Total Steps:</span>
              <span className="text-purple-800">{parallelPlan.totalSteps}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-600 font-medium">Est. Time:</span>
              <span className="text-purple-800">{parallelPlan.estimatedTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Steps Comparison Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        <div className="bg-gray-50 px-3 sm:px-6 py-2 sm:py-3 border-b border-gray-200">
          <h4 className="text-sm sm:text-base font-medium text-gray-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
            Step-by-Step Comparison
          </h4>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Step
                </th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                  Sequential Method
                </th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-purple-500 uppercase tracking-wider">
                  Parallel Method
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Array.from({ length: Math.max(sequentialPlan.steps.length, parallelPlan.steps.length) }, (_, index) => {
                const seqStep = sequentialPlan.steps[index];
                const parStep = parallelPlan.steps[index];
                
                return (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                        {index + 1}
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      {seqStep ? (
                        <div className="space-y-2">
                          <div className="text-xs sm:text-sm font-medium text-blue-800 break-words">
                            {seqStep.instruction}
                          </div>
                          <div className="text-xs text-blue-600">
                            <span className="font-medium">Type:</span> {seqStep.instructionType}
                          </div>
                          <div className="text-xs text-blue-600">
                            <span className="font-medium">Dependencies:</span> {seqStep.dependencies}
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs sm:text-sm">—</span>
                      )}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      {parStep ? (
                        <div className="space-y-2">
                          <div className="text-xs sm:text-sm font-medium text-purple-800 break-words">
                            {parStep.instruction}
                          </div>
                          <div className="text-xs text-purple-600">
                            <span className="font-medium">Type:</span> {parStep.instructionType}
                          </div>
                          <div className="text-xs text-purple-600">
                            <span className="font-medium">Dependencies:</span> {parStep.dependencies}
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs sm:text-sm">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Sequential Summary */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-5">
          <h4 className="text-sm sm:text-base font-semibold text-blue-800 mb-3 flex items-center gap-2">
            <ArrowRight className="w-4 h-4" />
            Sequential Analysis
          </h4>
          
          <div className="space-y-3">
            <div className="bg-white rounded-lg p-3 border border-blue-200">
              <div className="flex items-center gap-2 mb-1">
                <Timer className="w-4 h-4 text-blue-600" />
                <span className="text-xs sm:text-sm font-medium text-blue-700">Critical Path</span>
              </div>
              <p className="text-xs sm:text-sm text-blue-800 break-words">{sequentialPlan.criticalPath}</p>
            </div>
            
            <div className="bg-white rounded-lg p-3 border border-blue-200">
              <div className="flex items-center gap-2 mb-1">
                <Network className="w-4 h-4 text-blue-600" />
                <span className="text-xs sm:text-sm font-medium text-blue-700">Parallel Opportunities</span>
              </div>
              <p className="text-xs sm:text-sm text-blue-800 break-words">{sequentialPlan.parallelOpportunities}</p>
            </div>
          </div>
        </div>

        {/* Parallel Summary */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 sm:p-5">
          <h4 className="text-sm sm:text-base font-semibold text-purple-800 mb-3 flex items-center gap-2">
            <Shuffle className="w-4 h-4" />
            Parallel Analysis
          </h4>
          
          <div className="space-y-3">
            <div className="bg-white rounded-lg p-3 border border-purple-200">
              <div className="flex items-center gap-2 mb-1">
                <Timer className="w-4 h-4 text-purple-600" />
                <span className="text-xs sm:text-sm font-medium text-purple-700">Critical Path</span>
              </div>
              <p className="text-xs sm:text-sm text-purple-800 break-words">{parallelPlan.criticalPath}</p>
            </div>
            
            <div className="bg-white rounded-lg p-3 border border-purple-200">
              <div className="flex items-center gap-2 mb-1">
                <Network className="w-4 h-4 text-purple-600" />
                <span className="text-xs sm:text-sm font-medium text-purple-700">Parallel Opportunities</span>
              </div>
              <p className="text-xs sm:text-sm text-purple-800 break-words">{parallelPlan.parallelOpportunities}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Differences */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 sm:p-6 border border-amber-200">
        <h4 className="text-sm sm:text-base font-semibold text-amber-800 mb-3 flex items-center gap-2">
          <Zap className="w-4 h-4" />
          Key Differences & Recommendations
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h5 className="text-xs sm:text-sm font-medium text-amber-700">Sequential Advantages:</h5>
            <ul className="text-xs text-amber-800 space-y-1">
              <li>• Simpler to follow and execute</li>
              <li>• Less coordination required</li>
              <li>• Better for single-person tasks</li>
              <li>• Easier error tracking</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h5 className="text-xs sm:text-sm font-medium text-amber-700">Parallel Advantages:</h5>
            <ul className="text-xs text-amber-800 space-y-1">
              <li>• Potentially faster completion</li>
              <li>• Better resource utilization</li>
              <li>• Suitable for team execution</li>
              <li>• Optimized workflow efficiency</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
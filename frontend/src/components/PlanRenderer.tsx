import React from 'react';
import { 
  Play, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Zap, 
  Target,
  GitBranch,
  Timer,
  BarChart3,
  Network
} from 'lucide-react';
import { DependencyTable } from './DependencyTable';

interface PlanRendererProps {
  content: string;
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

export const PlanRenderer: React.FC<PlanRendererProps> = ({ content }) => {
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

  const getInstructionTypeIcon = (type: string) => {
    if (type.toLowerCase().includes('simple')) return <Play className="w-4 h-4" />;
    if (type.toLowerCase().includes('purpose')) return <Target className="w-4 h-4" />;
    if (type.toLowerCase().includes('conditional')) return <GitBranch className="w-4 h-4" />;
    return <Zap className="w-4 h-4" />;
  };

  const getInstructionTypeColor = (type: string) => {
    if (type.toLowerCase().includes('simple')) return 'from-green-500 to-emerald-500';
    if (type.toLowerCase().includes('purpose')) return 'from-blue-500 to-cyan-500';
    if (type.toLowerCase().includes('conditional')) return 'from-purple-500 to-violet-500';
    return 'from-orange-500 to-amber-500';
  };

  const parsedPlan = parsePlan(content);

  if (!parsedPlan) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 font-medium">Unable to parse the plan format</p>
          <p className="text-yellow-700 text-sm mt-1">Displaying raw content:</p>
        </div>
        <pre className="mt-4 text-sm text-gray-800 whitespace-pre-wrap font-mono leading-relaxed bg-gray-50 p-4 rounded-lg">
          {content}
        </pre>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 sm:p-6 border border-blue-100">
        <div className="flex items-start gap-4">

          <div className="flex-1">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 break-words">{parsedPlan.task}</h2>
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm">
              <div className="flex items-center gap-2 text-blue-700">
                <BarChart3 className="w-4 h-4" />
                <span className="font-medium">Method:</span>
                <span className="break-words">{parsedPlan.method}</span>
              </div>
              <div className="flex items-center gap-2 text-purple-700">
                <Clock className="w-4 h-4" />
                <span className="font-medium">Generated:</span>
                <span className="break-words">{parsedPlan.generated}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Steps Section */}
      <div className="space-y-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
          Execution Steps
        </h3>
        
        <div className="space-y-3">
          {parsedPlan.steps.map((step, index) => (
            <div key={step.number} className="relative">
              {/* Connection Line */}
              {index < parsedPlan.steps.length - 1 && (
                <div className="absolute left-5 sm:left-6 top-12 sm:top-16 w-0.5 h-6 sm:h-8 bg-gradient-to-b from-gray-300 to-transparent"></div>
              )}
              
              <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex items-start gap-4">
                  {/* Step Number */}
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 text-sm sm:text-base">
                    {step.number}
                  </div>
                  
                  <div className="flex-1 space-y-2 sm:space-y-3 min-w-0">
                    {/* Instruction */}
                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                      <div className="flex items-center gap-2 mb-2">
      
                        <span className="text-xs sm:text-sm font-medium text-gray-600 break-words">{step.instructionType}</span>
                      </div>
                      <p className="text-sm sm:text-base text-gray-800 font-medium break-words">{step.instruction}</p>
                    </div>
                    
                    {/* State Transitions */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 sm:p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs sm:text-sm font-medium text-black">Required State</span>
                        </div>
                        <p className="text-blue-700 text-xs sm:text-sm break-words">{step.requiredState}</p>
                      </div>
                      
                      <div className="bg-green-50 border border-green-200 rounded-lg p-2 sm:p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs sm:text-sm font-medium text-black">Resulting State</span>
                        </div>
                        <p className="text-green-700 text-xs sm:text-sm break-words">{step.resultingState}</p>
                      </div>
                    </div>
                    
                    {/* Dependencies */}
                    <div className="flex items-center gap-2 text-xs sm:text-sm">
                      <GitBranch className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                      <span className="font-medium text-gray-600">Dependencies:</span>
                      <span className={`px-2 py-1 rounded-full text-xs break-words ${
                        step.dependencies.toLowerCase().includes('none') 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {step.dependencies}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dependency Table */}
      <DependencyTable steps={parsedPlan.steps} />

      {/* Summary Section */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-4 sm:p-6 border border-indigo-100">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
          Execution Summary
        </h3>
        
        <div className="space-y-3 sm:space-y-4">
          {/* Total Steps Row */}
          <div className="bg-white rounded-lg p-3 sm:p-4 border border-indigo-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div>
                  <span className="text-sm sm:text-base font-medium text-gray-700">Total Steps</span>
                  <p className="text-xs text-gray-500">Number of execution steps required</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl sm:text-2xl font-bold text-blue-600">{parsedPlan.totalSteps}</p>
                <p className="text-xs text-blue-500">steps</p>
              </div>
            </div>
          </div>
          
          {/* Estimated Time Row */}
          <div className="bg-white rounded-lg p-3 sm:p-4 border border-indigo-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Timer className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div>
                  <span className="text-sm sm:text-base font-medium text-gray-700">Estimated Time</span>
                  <p className="text-xs text-gray-500">Expected duration to complete</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg sm:text-xl font-bold text-green-600 break-words">{parsedPlan.estimatedTime}</p>
                <p className="text-xs text-green-500">duration</p>
              </div>
            </div>
          </div>
          
          {/* Critical Path Row */}
          <div className="bg-white rounded-lg p-3 sm:p-4 border border-indigo-200 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <span className="text-sm sm:text-base font-medium text-gray-700">Critical Path</span>
                    <p className="text-xs text-gray-500">Steps that cannot be parallelized</p>
                  </div>
                  <div className="sm:text-right">
                    <p className="text-sm sm:text-base text-red-600 font-medium break-words">{parsedPlan.criticalPath}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Parallel Opportunities Row */}
          <div className="bg-white rounded-lg p-3 sm:p-4 border border-indigo-200 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-500 to-violet-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Network className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <span className="text-sm sm:text-base font-medium text-gray-700">Parallel Opportunities</span>
                    <p className="text-xs text-gray-500">Steps that can run simultaneously</p>
                  </div>
                  <div className="sm:text-right">
                    <p className="text-sm sm:text-base text-purple-600 font-medium break-words">{parsedPlan.parallelOpportunities}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
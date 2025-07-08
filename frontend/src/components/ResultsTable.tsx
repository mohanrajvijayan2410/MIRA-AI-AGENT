import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, FileText, Target, Zap, BookOpen, Loader2, AlertCircle, Tag, Settings, Clock } from 'lucide-react';
import { SearchResult, AIProvider } from '../types';
import { generateInstructions, generateDurationEstimate } from '../utils/aiProviders';
import { AIProviderSelector } from './AIProviderSelector';

interface TaskDetailsProps {
  result: SearchResult | null;
  hasSearched: boolean;
  duration: string;
  isGeneratingDuration: boolean;
  durationError: string | null;
  generateDuration: () => void;
}

export const TaskDetails: React.FC<TaskDetailsProps> = ({
  result,
  hasSearched,
  duration,
  isGeneratingDuration,
  durationError,
  generateDuration
}) => {
  if (!hasSearched || !result) return null;
  const { item } = result;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden w-full max-w-4xl">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
        <h3 className="text-xl font-semibold text-white">Task Details</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
        {/* Duration Box */}
        <div className="p-6 hover:bg-gray-50 transition-colors">
          <div className="h-full flex flex-col">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col items-start mb-3">
                  <h4 className="font-semibold text-gray-900 text-sm">Duration</h4>
                  {!isGeneratingDuration && !durationError && duration && (
                    <button
                      onClick={generateDuration}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors flex items-center gap-1 mt-1"
                    >
                      <Settings className="w-3 h-3" />
                      Regenerate
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex-1 flex items-center">
              {isGeneratingDuration && (
                <div className="flex items-center gap-3 w-full">
                  <Loader2 className="w-4 h-4 text-blue-600 animate-spin flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-blue-700 font-medium text-sm">Estimating...</p>
                    <p className="text-xs text-blue-600">Analyzing complexity</p>
                  </div>
                </div>
              )}

              {durationError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 w-full">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-red-800 font-medium text-sm">Failed to estimate</p>
                      <p className="text-xs text-red-600 mt-1 break-words">{durationError}</p>
                      <button
                        onClick={generateDuration}
                        className="mt-2 text-xs bg-red-100 hover:bg-red-200 text-red-700 px-2 py-1 rounded-lg transition-colors"
                      >
                        Try Again
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {duration && !isGeneratingDuration && !durationError && (
                <div className="w-full">
                  <p className="text-gray-800 font-semibold text-lg break-words">{duration}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions Box */}
        <div className="p-6 hover:bg-gray-50 transition-colors">
          <div className="h-full flex flex-col">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                <Zap className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 text-sm">Actions</h4>
              </div>
            </div>
            
            <div className="flex-1 flex items-start">
              <div className="w-full">
                <p className="text-gray-700 text-sm leading-relaxed break-words whitespace-pre-wrap">
                  {item.Actions}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Objects Box */}
        <div className="p-6 hover:bg-gray-50 transition-colors">
          <div className="h-full flex flex-col">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg flex-shrink-0">
                <Target className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 text-sm">Objects</h4>
              </div>
            </div>
            
            <div className="flex-1 flex items-start">
              <div className="w-full">
                <p className="text-gray-700 text-sm leading-relaxed break-words whitespace-pre-wrap">
                  {item.Objects}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ResultsTableProps {
  result: SearchResult | null;
  hasSearched: boolean;
  query: string;
}
              
export const ResultsTable: React.FC<ResultsTableProps> = ({ result, hasSearched, query }) => {
  const [instructions, setInstructions] = useState<string>('');
  const [isGeneratingInstructions, setIsGeneratingInstructions] = useState(false);
  const [instructionsError, setInstructionsError] = useState<string | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>('groq');
  const [duration, setDuration] = useState<string>('');
  const [isGeneratingDuration, setIsGeneratingDuration] = useState(false);
  const [durationError, setDurationError] = useState<string | null>(null);

  useEffect(() => {
    if (result && result.item) {
      generateAIInstructions();
      generateDuration();
    }
  }, [result]);

  const generateAIInstructions = async () => {
    if (!result?.item) return;

    setIsGeneratingInstructions(true);
    setInstructionsError(null);
    setInstructions('');

    try {
      const generatedInstructions = await generateInstructions(
        result.item.Description,
        result.item.Actions,
        result.item.Objects,
        selectedProvider
      );
      setInstructions(generatedInstructions);
    } catch (error) {
      setInstructionsError(error instanceof Error ? error.message : 'Failed to generate instructions');
    } finally {
      setIsGeneratingInstructions(false);
    }
  };

  const generateDuration = async () => {
    if (!result?.item) return;

    setIsGeneratingDuration(true);
    setDurationError(null);
    setDuration('');

    try {
      const estimatedDuration = await generateDurationEstimate(
        result.item.Description,
        result.item.Actions,
        result.item.Objects
      );
      setDuration(estimatedDuration);
    } catch (error) {
      setDurationError(error instanceof Error ? error.message : 'Failed to generate duration estimate');
    } finally {
      setIsGeneratingDuration(false);
    }
  };

  const handleProviderChange = (provider: AIProvider) => {
    setSelectedProvider(provider);
    // Auto-regenerate instructions when provider changes
    if (result?.item && instructions) {
      generateAIInstructions();
    }
  };

  const getStepTypeColor = (stepType: string) => {
    const type = stepType.toLowerCase();
    if (type.includes('simple')) {
      return 'bg-blue-100 text-blue-700 border-blue-200';
    } else if (type.includes('goal') || type.includes('purpose')) {
      return 'bg-purple-100 text-purple-700 border-purple-200';
    } else if (type.includes('reason')) {
      return 'bg-green-100 text-green-700 border-green-200';
    } else if (type.includes('sequence') || type.includes('instruction in sequence')) {
      return 'bg-indigo-100 text-indigo-700 border-indigo-200';
    } else if (type.includes('exclusive')) {
      return 'bg-orange-100 text-orange-700 border-orange-200';
    } else if (type.includes('mandatory')) {
      return 'bg-red-100 text-red-700 border-red-200';
    }
    return 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const formatMIRAInstructions = (text: string) => {
    const sections = text.split('####').filter(section => section.trim());
    const formattedSections: JSX.Element[] = [];

    sections.forEach((section, index) => {
      const lines = section.trim().split('\n').filter(line => line.trim());
      const title = lines[0]?.trim();

      if (title === 'Stepwise Instructions with Classification' || title.includes('Stepwise Instructions')) {
        // Parse stepwise instructions
        const steps = parseStepwiseInstructions(lines.slice(1));
        formattedSections.push(
          <div key={index} className="space-y-6">
            <h5 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-orange-600" />
              Stepwise Instructions with Classification
            </h5>
            <div className="space-y-6">
              {steps}
            </div>
          </div>
        );
      } else if (title === 'Dependency Table') {
        // Parse dependency table
        const dependencyData = parseDependencyTable(lines.slice(1));
        formattedSections.push(
          <div key={index} className="space-y-6">
            <h5 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-600" />
              Dependency Table
            </h5>
            <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Step</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Depends On</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Objects Involved</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Classification</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Consistency Condition Satisfied?</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dependencyData.map((row, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                            {row.step}
                          </div>
                          <span className="text-sm font-medium text-gray-900">{row.step}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{row.dependsOn}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{row.objects}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`
                          px-3 py-1 rounded-full text-xs font-medium border
                          ${getStepTypeColor(row.classification)}
                        `}>
                          {row.classification}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`
                          px-3 py-1 rounded-full text-xs font-medium
                          ${row.consistency === 'Yes' ? 'bg-green-100 text-green-700' : 
                            row.consistency === 'No' ? 'bg-red-100 text-red-700' : 
                            'bg-gray-100 text-gray-700'}
                        `}>
                          {row.consistency}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      } else if (title === 'Final Sequenced Plan') {
        // Parse final plan
        const planSteps = parseFinalPlan(lines.slice(1));
        formattedSections.push(
          <div key={index} className="space-y-6">
            <h5 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              Final Sequenced Plan
            </h5>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <ol className="list-decimal list-inside space-y-2">
                {planSteps.map((step, stepIndex) => (
                  <li key={stepIndex} className="text-gray-800 leading-relaxed">
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        );
      }
    });

    return (
      <div className="space-y-8">
        {formattedSections}
      </div>
    );
  };

  const parseStepwiseInstructions = (lines: string[]) => {
    const steps: JSX.Element[] = [];
    let currentStep: any = null;
    let stepNumber = 0;

    lines.forEach(line => {
      const trimmedLine = line.trim();
      
      if (trimmedLine.match(/^\d+\./)) {
        // New step
        if (currentStep) {
          steps.push(renderStep(currentStep, stepNumber));
        }
        stepNumber++;
        currentStep = {
          description: trimmedLine.replace(/^\d+\.\s*/, ''),
          requiredState: '',
          resultingState: '',
          type: '',
          dependencies: '',
          consistency: '',
          reason: ''
        };
      } else if (trimmedLine.startsWith('Required state:')) {
        if (currentStep) currentStep.requiredState = trimmedLine.replace('Required state:', '').trim();
      } else if (trimmedLine.startsWith('Resulting state:')) {
        if (currentStep) currentStep.resultingState = trimmedLine.replace('Resulting state:', '').trim();
      } else if (trimmedLine.startsWith('Type:')) {
        if (currentStep) currentStep.type = trimmedLine.replace('Type:', '').trim();
      } else if (trimmedLine.startsWith('Dependencies:')) {
        if (currentStep) currentStep.dependencies = trimmedLine.replace('Dependencies:', '').trim();
      } else if (trimmedLine.startsWith('Consistency:')) {
        if (currentStep) currentStep.consistency = trimmedLine.replace('Consistency:', '').trim();
      } else if (trimmedLine.startsWith('Reason:')) {
        if (currentStep) currentStep.reason = trimmedLine.replace('Reason:', '').trim();
      }
    });

    // Add the last step
    if (currentStep) {
      steps.push(renderStep(currentStep, stepNumber));
    }

    return steps;
  };

  const renderStep = (step: any, stepNumber: number) => {
    return (
      <div key={stepNumber} className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex gap-4 mb-4">
          <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
            {stepNumber}
          </div>
          <div className="flex-1">
            <h6 className="font-semibold text-gray-900 mb-2">{step.description}</h6>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
          <div>
            <span className="font-medium text-gray-700">Required State:</span>
            <p className="text-gray-600 mt-1">{step.requiredState || 'N/A'}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Resulting State:</span>
            <p className="text-gray-600 mt-1">{step.resultingState || 'N/A'}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Dependencies:</span>
            <p className="text-gray-600 mt-1">{step.dependencies || 'None'}</p>
          </div>
          {step.reason && (
            <div>
              <span className="font-medium text-gray-700">Reason:</span>
              <p className="text-gray-600 mt-1">{step.reason}</p>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-4 mt-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-gray-500" />
            <span className={`
              px-3 py-1 rounded-full text-xs font-medium border
              ${getStepTypeColor(step.type)}
            `}>
              {step.type}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Consistency:</span>
            <span className={`
              px-2 py-1 rounded-full text-xs font-medium
              ${step.consistency === 'Yes' ? 'bg-green-100 text-green-700' : 
                step.consistency === 'No' ? 'bg-red-100 text-red-700' : 
                'bg-gray-100 text-gray-700'}
            `}>
              {step.consistency || 'N/A'}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const parseDependencyTable = (lines: string[]) => {
    const dependencies: any[] = [];
    
    lines.forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith('|') && !trimmedLine.includes('Step') && !trimmedLine.includes('---')) {
        const columns = trimmedLine.split('|').map(col => col.trim()).filter(col => col);
        if (columns.length >= 5) {
          dependencies.push({
            step: columns[0],
            dependsOn: columns[1] === '—' ? 'None' : columns[1],
            objects: columns[2],
            classification: columns[3],
            consistency: columns[4] === '—' ? 'N/A' : columns[4]
          });
        }
      }
    });
    
    return dependencies;
  };

  const parseFinalPlan = (lines: string[]) => {
    return lines
      .filter(line => line.trim().match(/^\d+\./))
      .map(line => line.trim().replace(/^\d+\.\s*/, ''));
  };

  const formatInstructions = (text: string) => {
    // Check if the text contains the new MIRA format
    if (text.includes('#### Stepwise Instructions') || text.includes('#### Dependency Table')) {
      return formatMIRAInstructions(text);
    }

    // Fallback to old format parsing
    const lines = text.split('\n').filter(line => line.trim());
    const formattedSteps: JSX.Element[] = [];
    let stepNumber = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line.match(/^\d+\./)) {
        // This is a numbered step
        stepNumber++;
        const stepContent = line.replace(/^\d+\.\s*/, '');
        
        // Extract duration and type from the step content
        const durationMatch = stepContent.match(/DUR\s+([^T]+)/);
        const typeMatch = stepContent.match(/Type:\s*(.+)$/);
        
        let stepText = stepContent;
        let duration = '';
        let instructionType = '';
        
        if (durationMatch) {
          duration = durationMatch[1].trim();
          // Remove DUR part from step text
          stepText = stepContent.replace(/DUR\s+[^T]+/, '').trim();
        }
        
        if (typeMatch) {
          instructionType = typeMatch[1].trim();
          // Remove Type part from step text
          stepText = stepText.replace(/Type:\s*.+$/, '').trim();
        }
        
        // Clean up any remaining colons or extra spaces
        stepText = stepText.replace(/:\s*$/, '').trim();

        formattedSteps.push(
          <div key={stepNumber} className="mb-6 last:mb-0">
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                {stepNumber}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-gray-800 leading-relaxed font-medium mb-2 break-words">
                  {stepText}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                  {duration && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4 flex-shrink-0" />
                      <span className="break-words">{duration}</span>
                    </span>
                  )}
                </div>
                {instructionType && (
                  <span className={`
                    px-3 py-1 rounded-full text-xs font-medium border
                    ${getStepTypeColor(instructionType)}
                  `}>
                    {instructionType}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      }
    }

    return formattedSteps.length > 0 ? formattedSteps : (
      <p className="text-gray-700 leading-relaxed break-words">{text}</p>
    );
  };

  if (!hasSearched) {
    return null;
  }

  if (!result) {
    return (
      <div className="w-full max-w-4xl mx-auto mt-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          <div className="text-center">
            <XCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No matching description found
            </h3>
            <p className="text-gray-600 mb-4">
              We couldn't find a close match for "{query}" in the CSV data.
            </p>
            <div className="text-sm text-gray-500 bg-gray-50 rounded-lg p-4">
              <p className="font-medium mb-2">Tips for better results:</p>
              <ul className="text-left space-y-1">
                <li>• Try using different keywords or phrases</li>
                <li>• Check for typos in your search query</li>
                <li>• Use more general terms if your search is too specific</li>
                <li>• Ensure your CSV contains relevant descriptions</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Task Details Section */}
      {/* <TaskDetails
        result={result}
        hasSearched={hasSearched}
        duration={duration}
        isGeneratingDuration={isGeneratingDuration}
        durationError={durationError}
        generateDuration={generateDuration}
      /> */}

      {/* Instructions Section */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 px-6 py-4">
          <h3 className="text-xl font-semibold text-white">MIRA Protocol Instructions</h3>
        </div>

        <div className="p-6 bg-gradient-to-br from-orange-50 to-yellow-50">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-orange-100 rounded-lg flex-shrink-0">
              <BookOpen className="w-5 h-5 text-orange-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-4">
                {!isGeneratingInstructions && !instructionsError && instructions && (
                  <button
                    onClick={generateAIInstructions}
                    className="text-sm text-orange-600 hover:text-orange-700 font-medium transition-colors flex items-center gap-1"
                  >
                    <Settings className="w-4 h-4" />
                    Regenerate
                  </button>
                )}
              </div>

              {/* AI Provider Selector */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Choose AI Provider:
                </label>
                <div className="max-w-md">
                  <AIProviderSelector
                    selectedProvider={selectedProvider}
                    onProviderChange={handleProviderChange}
                    disabled={isGeneratingInstructions}
                  />
                </div>
              </div>

              {isGeneratingInstructions && (
                <div className="flex items-center gap-3 py-8">
                  <Loader2 className="w-6 h-6 text-orange-600 animate-spin flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-orange-700 font-medium">Generating MIRA instructions...</p>
                    <p className="text-sm text-orange-600">
                      AI is analyzing task details, dependencies, and creating classified steps
                    </p>
                  </div>
                </div>
              )}

              {instructionsError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-red-800 font-medium">Failed to generate instructions</p>
                      <p className="text-sm text-red-600 mt-1 break-words">{instructionsError}</p>
                      <button
                        onClick={generateAIInstructions}
                        className="mt-3 text-sm bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-lg transition-colors"
                      >
                        Try Again
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Scrollable Instructions Area */}
              {instructions && !isGeneratingInstructions && !instructionsError && (
                <div className="bg-white rounded-lg border border-orange-200 max-h-[500px] overflow-y-auto">
                  <div className="p-6 space-y-4">
                    {formatInstructions(instructions)}
                  </div>
                  
                  {/* Step Type Legend - Fixed at bottom */}
                  <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
                    <h5 className="text-sm font-medium text-gray-700 mb-3">MIRA Protocol Types:</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-100 border border-blue-200 rounded"></div>
                        <span className="text-gray-600">Simple Instruction</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-purple-100 border border-purple-200 rounded"></div>
                        <span className="text-gray-600">Instruction with Goal</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-100 border border-green-200 rounded"></div>
                        <span className="text-gray-600">Instruction with Reason</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-indigo-100 border border-indigo-200 rounded"></div>
                        <span className="text-gray-600">Instruction with Sequence</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-orange-100 border border-orange-200 rounded"></div>
                        <span className="text-gray-600">Exclusive Instruction</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-100 border border-red-200 rounded"></div>
                        <span className="text-gray-600">Mandatory Instruction</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Send, Loader2, X, Check } from 'lucide-react';
import { IterativeService } from './iterativeService';

const iterativeService = new IterativeService();

interface ChatMessage {
  id: number;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface IterativeResults {
  sequential: string | null;
  parallel: string | null;
  comparison: string | null;
}

const getBadgeColor = (type: string) => {
  const lower = (type || '').toLowerCase();
  if (lower.includes('simple')) return 'bg-blue-100 text-blue-800 border-blue-300';
  if (lower.includes('purpose') || lower.includes('goal')) return 'bg-purple-100 text-purple-800 border-purple-300';
  if (lower.includes('sequence') || lower.includes('sequential') || lower.includes('then')) return 'bg-amber-100 text-amber-800 border-amber-300';
  if (lower.includes('exclusive') || lower.includes('or')) return 'bg-emerald-100 text-emerald-800 border-emerald-300';
  if (lower.includes('mandatory') || lower.includes('and')) return 'bg-red-100 text-red-800 border-red-300';
  return 'bg-indigo-100 text-indigo-800 border-indigo-300';
};

const makeBadgeHtml = (stepNum: number, activeType: string, labelPrefix: string = 'Type: ') => {
  const badgeColor = getBadgeColor(activeType);
  return `<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${badgeColor} border shadow-xs cursor-pointer hover:ring-2 hover:ring-blue-400 hover:scale-[1.02] transition-all my-1 select-none" data-edit-step="${stepNum}" data-current-type="${activeType}" title="Click to edit instruction type">${labelPrefix}<span class="underline decoration-dotted underline-offset-2 font-bold">${activeType}</span> <svg class="w-3.5 h-3.5 ml-0.5 inline opacity-80 pointer-events-none" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg></span>`;
};

const enhanceHtmlWithTypeBadges = (
  html: string,
  customTypes: Record<number, string> = {}
): string => {
  let stepCounter = 0;

  // 1. Replace in list items (li) or paragraphs (p)
  let transformed = html.replace(/(<li>|<p[^>]*>)([\s\S]*?)(<\/li>|<\/p>)/gi, (match, openTag, inner, closeTag) => {
    // A. Check for "Type: [Instruction Type]"
    const typeMatch = inner.match(/(Type:\s*)([^\n<]+)/i);
    if (typeMatch) {
      stepCounter++;
      const stepNum = stepCounter;
      const originalType = typeMatch[2].trim();
      const activeType = customTypes[stepNum] || originalType;
      const badge = makeBadgeHtml(stepNum, activeType, 'Type: ');
      const newInner = inner.replace(/(Type:\s*)([^\n<]+)/i, badge);
      return `${openTag}${newInner}${closeTag}`;
    }

    // B. Check for arrow syntax: "→ [Instruction Type]" or "-> [Instruction Type]"
    const arrowMatch = inner.match(/([→\->—–]\s*)([A-Za-z0-9\s-]+Instruction)/i);
    if (arrowMatch) {
      stepCounter++;
      const stepNum = stepCounter;
      const originalType = arrowMatch[2].trim();
      const activeType = customTypes[stepNum] || originalType;
      const badge = makeBadgeHtml(stepNum, activeType, '→ ');
      const newInner = inner.replace(/([→\->—–]\s*)([A-Za-z0-9\s-]+Instruction)/i, badge);
      return `${openTag}${newInner}${closeTag}`;
    }

    return match;
  });

  // 2. Also enhance Dependency Table rows with editable badges
  transformed = transformed.replace(/<tr[^>]*>([\s\S]*?)<\/tr>/gi, (trMatch, trInner) => {
    const tdMatches = [...trInner.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)];
    if (tdMatches.length >= 4) {
      const stepText = tdMatches[0][1].replace(/<[^>]+>/g, '').trim();
      const stepNum = parseInt(stepText, 10);
      const classCell = tdMatches[3][1].replace(/<[^>]+>/g, '').trim();

      const isInstructionType = /(Simple|Purpose|Sequence|Sequential|Exclusive|Mandatory|Reason|Goal)\s*Instruction/i.test(classCell);
      if (isInstructionType || (!isNaN(stepNum) && customTypes[stepNum])) {
        const activeType = (!isNaN(stepNum) && customTypes[stepNum]) || classCell;
        const badge = makeBadgeHtml(!isNaN(stepNum) ? stepNum : 0, activeType, '');
        const fourthTd = tdMatches[3][0];
        const newFourthTd = fourthTd.replace(/>[\s\S]*?<\/td>/i, `>${badge}</td>`);
        return trMatch.replace(fourthTd, newFourthTd);
      }
    }
    return trMatch;
  });

  return transformed;
};

interface InteractivePlanViewProps {
  title: string;
  headerBg: string;
  htmlContent: string;
  method: 'sequential' | 'parallel';
  customTypes: Record<number, string>;
  onEditType: (method: 'sequential' | 'parallel', stepNumber: number, currentType: string) => void;
}

const InteractivePlanView: React.FC<InteractivePlanViewProps> = ({
  title,
  headerBg,
  htmlContent,
  method,
  customTypes,
  onEditType,
}) => {
  const enhancedHtml = useMemo(() => {
    return enhanceHtmlWithTypeBadges(htmlContent, customTypes);
  }, [htmlContent, customTypes]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = (e.target as HTMLElement).closest('[data-edit-step]');
    if (target) {
      const stepNum = target.getAttribute('data-edit-step');
      const currentType = target.getAttribute('data-current-type') || '';
      if (stepNum) {
        onEditType(method, parseInt(stepNum, 10), currentType);
      }
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200 shadow-lg overflow-hidden">
      <div className={`${headerBg} px-4 sm:px-6 py-3 flex items-center justify-between`}>
        <h3 className="text-lg sm:text-xl font-semibold text-white">{title}</h3>
        <span className="text-xs text-white/80 hidden sm:inline-block">
          💡 Click any instruction type badge to edit
        </span>
      </div>
      <div className="p-4 sm:p-6 overflow-y-auto" onClick={handleClick}>
        <div
          className="prose max-w-none text-sm sm:text-base"
          dangerouslySetInnerHTML={{ __html: enhancedHtml }}
        />
      </div>
    </div>
  );
};

function Iterative() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState<string>('');
  const [results, setResults] = useState<IterativeResults>({
    sequential: null,
    parallel: null,
    comparison: null,
  });

  const [customStepTypes, setCustomStepTypes] = useState<{
    sequential: Record<number, string>;
    parallel: Record<number, string>;
  }>({
    sequential: {},
    parallel: {},
  });

  const [editingStep, setEditingStep] = useState<{
    method: 'sequential' | 'parallel';
    stepNumber: number;
    currentType: string;
  } | null>(null);

  const [customTypeInput, setCustomTypeInput] = useState<string>('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, results]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentTask = inputValue;
    setInputValue('');
    setIsLoading(true);
    setLoadingStatus('Generating Sequential Plan (Step 1/3)...');
    setResults({ sequential: null, parallel: null, comparison: null });
    setCustomStepTypes({ sequential: {}, parallel: {} });
    setEditingStep(null);

    try {
      const botMessage: ChatMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: `Analyzing "${currentTask}" across Sequential, Step-by-Step Parallel, and Comparison methods...`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);

      // 1. Sequential Method
      const sequentialResult = await iterativeService.callSequentialMethod(currentTask);
      setResults((prev) => ({ ...prev, sequential: sequentialResult }));

      setLoadingStatus('Generating Step-by-Step Parallel Plan (Step 2/3)...');
      await new Promise((r) => setTimeout(r, 700));

      // 2. Parallel Method
      const parallelResult = await iterativeService.callParallelMethod(currentTask);
      setResults((prev) => ({ ...prev, parallel: parallelResult }));

      setLoadingStatus('Comparing Methods & Trade-offs (Step 3/3)...');
      await new Promise((r) => setTimeout(r, 700));

      // 3. Feature Comparison Method
      const comparisonResult = await iterativeService.callFeatureComparison(currentTask);
      setResults((prev) => ({ ...prev, comparison: comparisonResult }));

      const completionMessage: ChatMessage = {
        id: Date.now() + 2,
        type: 'bot',
        content: `Complete analysis for "${currentTask}" generated below. You can click any instruction type badge to customize it.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, completionMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: Date.now() + 3,
        type: 'bot',
        content: `Sorry, I encountered an error processing your request: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setLoadingStatus('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleOpenEdit = (
    method: 'sequential' | 'parallel',
    stepNumber: number,
    currentType: string
  ) => {
    setEditingStep({ method, stepNumber, currentType });
    setCustomTypeInput(customStepTypes[method][stepNumber] || currentType);
  };

  const handleSaveStepType = () => {
    if (!editingStep || !customTypeInput.trim()) return;

    setCustomStepTypes((prev) => ({
      ...prev,
      [editingStep.method]: {
        ...prev[editingStep.method],
        [editingStep.stepNumber]: customTypeInput.trim(),
      },
    }));

    setEditingStep(null);
  };

  const standardTypes = [
    'Simple Instruction',
    'Instruction with Purpose',
    'Instruction in Sequence',
    'Exclusive Instruction',
    'Mandatory Instruction',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8 pt-4 sm:pt-6">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-black text-center sm:text-left">
            SeqParallelo -
          </h1>
          <div className="h-10">
            <img src="krama.png" alt="" />
          </div>
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 pb-4">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Welcome Message */}
          {messages.length === 0 && !isLoading && (
            <div className="text-center py-8 sm:py-12">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 sm:p-8 shadow-lg border border-white/20 max-w-2xl mx-auto">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
                  Welcome to SeqParallelo
                </h2>
                <p className="text-gray-600 mb-6">
                  Enter a task description below and I'll analyze it using three different methods:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <h3 className="font-medium text-blue-800">Sequential Method</h3>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <h3 className="font-medium text-purple-800">Step-by-Step Parallel Method</h3>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <h3 className="font-medium text-green-800">Comparison</h3>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-2xl rounded-lg p-4 shadow-sm ${
                  message.type === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-800 border border-gray-200'
                }`}
              >
                <p className="break-words">{message.content}</p>
                <div className="text-xs opacity-70 mt-2">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}

          {/* Results Display */}
          {(results.sequential || results.parallel || results.comparison) && (
            <div className="space-y-6">
              {/* Sequential Method Result with Custom Edit */}
              {results.sequential && (
                <InteractivePlanView
                  title="Sequential Completion Method"
                  headerBg="bg-blue-600"
                  htmlContent={results.sequential}
                  method="sequential"
                  customTypes={customStepTypes.sequential}
                  onEditType={handleOpenEdit}
                />
              )}

              {/* Parallel Method Result with Custom Edit */}
              {results.parallel && (
                <InteractivePlanView
                  title="Step-by-Step Parallel Method"
                  headerBg="bg-purple-600"
                  htmlContent={results.parallel}
                  method="parallel"
                  customTypes={customStepTypes.parallel}
                  onEditType={handleOpenEdit}
                />
              )}

              {/* Feature Comparison Result */}
              {results.comparison && (
                <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200 shadow-lg overflow-hidden">
                  <div className="bg-green-600 px-4 sm:px-6 py-3">
                    <h3 className="text-lg sm:text-xl font-semibold text-white">Comparison</h3>
                  </div>
                  <div className="p-4 sm:p-6 overflow-y-auto">
                    <div
                      className="prose max-w-none text-sm sm:text-base"
                      dangerouslySetInnerHTML={{ __html: results.comparison }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex justify-center py-8">
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200">
                <div className="flex items-center space-x-3">
                  <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                  <div>
                    <p className="text-gray-800 font-medium">{loadingStatus || 'Processing your task...'}</p>
                    <p className="text-sm text-gray-600">ISAA Multi-Method Planning Analysis</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Edit Type Modal */}
      {editingStep && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold">
                  {editingStep.stepNumber}
                </div>
                <h3 className="font-semibold text-gray-900 text-base">
                  Edit Instruction Type (Step {editingStep.stepNumber})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingStep(null)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-600 mb-3">
              Select an ISAA Protocol type or type a custom instruction classification:
            </p>

            {/* Quick Type Selection Badges */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {standardTypes.map((type) => {
                const isSelected = customTypeInput === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setCustomTypeInput(type)}
                    className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm font-medium'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
                    }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>

            {/* Custom Input */}
            <div className="space-y-1.5 mb-5">
              <label className="block text-xs font-medium text-gray-700">
                Instruction Type:
              </label>
              <input
                type="text"
                value={customTypeInput}
                onChange={(e) => setCustomTypeInput(e.target.value)}
                placeholder="e.g., Mandatory Instruction or Custom Tag"
                className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-gray-800"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveStepType();
                  if (e.key === 'Escape') setEditingStep(null);
                }}
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingStep(null)}
                className="px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveStepType}
                disabled={!customTypeInput.trim()}
                className="px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                <Check className="w-3.5 h-3.5" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fixed Input Area */}
      <div className="border-t border-gray-200 bg-white/80 backdrop-blur-sm p-4 flex-shrink-0 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <div className="flex gap-3 sm:gap-4">
            <div className="flex-1">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter your task description (e.g., 'Verify 5 UPS and approve 3 switches in the laboratory.')"
                className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none bg-white shadow-sm text-sm sm:text-base"
                rows={2}
                disabled={isLoading}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className={`px-4 sm:px-6 py-3 sm:py-4 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                inputValue.trim() && !isLoading
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transform hover:scale-105'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
              <span className="hidden sm:inline">
                {isLoading ? 'Processing...' : 'Analyze'}
              </span>
            </button>
          </div>
          <div className="text-xs text-gray-500 mt-2 text-center sm:text-left">
            Press Enter to send • {(inputValue || '').length}/500 characters
          </div>
        </div>
      </div>
    </div>
  );
}

export default Iterative;

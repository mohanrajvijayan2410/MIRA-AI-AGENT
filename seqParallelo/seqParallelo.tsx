import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { IterativeService } from './iterativeService';
import { SequentialMethodResponse, ParallelMethodResponse } from './iterativeService';

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

function Iterative() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<IterativeResults>({
    sequential: null,
    parallel: null,
    comparison: null
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, results]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentTask = inputValue;
    setInputValue('');
    setIsLoading(true);
    setResults({ sequential: null, parallel: null, comparison: null });

    try {
      // Add bot message indicating processing
      const botMessage: ChatMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: `Processing "${currentTask}" using all three methods...`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);

      // Call all three methods in parallel
      const [sequentialResult, parallelResult, comparisonResult] = await Promise.all([
        iterativeService.callSequentialMethod(currentTask),
        iterativeService.callParallelMethod(currentTask),
        iterativeService.callFeatureComparison(currentTask)
      ]);

      setResults({
        sequential: sequentialResult,
        parallel: parallelResult,
        comparison: comparisonResult
      });

    } catch (error) {
      const errorMessage: ChatMessage = {
        id: Date.now() + 2,
        type: 'bot',
        content: `Sorry, I encountered an error processing your request: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8 pt-4 sm:pt-6">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-black text-center sm:text-left">
            SeqParallelo -
          </h1>
          <div className='h-10'>
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
                  Welcome to the SeqParallelo   
                </h2>
                <p className="text-gray-600 mb-6">
                  Enter a task description below and I'll analyze it using three different methods:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <h3 className="font-medium text-blue-800">Sequential Method</h3>
                    {/* <p className="text-blue-600 text-xs mt-1">Complete each object fully before moving to the next</p> */}
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <h3 className="font-medium text-purple-800">Step-by-Step Parallel Method</h3>
                    {/* <p className="text-purple-600 text-xs mt-1">Group similar actions together</p> */}
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <h3 className="font-medium text-green-800">Comparison</h3>
                    {/* <p className="text-green-600 text-xs mt-1">Side-by-side analysis</p> */}
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
              {/* Sequential Method Result */}
              {results.sequential && (
                <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200 shadow-lg overflow-hidden">
                  <div className="bg-blue-600 px-4 sm:px-6 py-3">
                    <h3 className="text-lg sm:text-xl font-semibold text-white">Sequential Completion Method</h3>
                  </div>
                  <div className="p-4 sm:p-6  overflow-y-auto">
                    <div 
                      className="prose max-w-none text-sm sm:text-base"
                      dangerouslySetInnerHTML={{ __html: results.sequential }}
                    />
                  </div>
                </div>
              )}

              {/* Parallel Method Result */}
              {results.parallel && (
                <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200 shadow-lg overflow-hidden">
                  <div className="bg-purple-600 px-4 sm:px-6 py-3">
                    <h3 className="text-lg sm:text-xl font-semibold text-white">Step-by-Step Parallel Method</h3>
                  </div>
                  <div className="p-4 sm:p-6   overflow-y-auto">
                    <div 
                      className="prose max-w-none text-sm sm:text-base"
                      dangerouslySetInnerHTML={{ __html: results.parallel }}
                    />
                  </div>
                </div>
              )}

              {/* Feature Comparison Result */}
              {results.comparison && (
                <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200 shadow-lg overflow-hidden">
                  <div className="bg-green-600 px-4 sm:px-6 py-3">
                    <h3 className="text-lg sm:text-xl font-semibold text-white">Comparison</h3>
                  </div>
                  <div className="p-4 sm:p-6  overflow-y-auto">
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
                    <p className="text-gray-800 font-medium">Processing your task...</p>
                    <p className="text-sm text-gray-600">Analyzing with all three methods</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Fixed Input Area */}
      <div className="border-t border-gray-200 bg-white/80 backdrop-blur-sm p-4 flex-shrink-0 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <div className="flex gap-3 sm:gap-4">
            <div className="flex-1">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter your task description (e.g., 'Wash and Hang 5 Shirts and 5 Towels')"
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
            Press Enter to send • {inputValue.length}/500 characters
          </div>
        </div>
      </div>
    </div>
  );
}

export default Iterative;
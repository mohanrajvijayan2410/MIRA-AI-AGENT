import React, { useState, useCallback, useMemo } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { CSVRow } from '../types';

interface SearchBoxProps {
  onSearch: (query: string) => void;
  isSearching?: boolean;
  disabled?: boolean;
  csvData: CSVRow[];
}

export const SearchBox: React.FC<SearchBoxProps> = ({ 
  onSearch, 
  isSearching = false, 
  disabled = false,
  csvData
}) => {
  const [selectedDescription, setSelectedDescription] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const uniqueDescriptions = useMemo(() => (
    Array.from(new Set(csvData.map(row => row.Description)))
      .filter(desc => desc && desc.trim())
      .sort()
  ), [csvData]);

  const filteredDescriptions = useMemo(() => (
    uniqueDescriptions.filter(desc =>
      desc.toLowerCase().includes(inputValue.toLowerCase())
    )
  ), [inputValue, uniqueDescriptions]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDescription && !disabled) {
      onSearch(selectedDescription);
      setIsOpen(false);
    }
  }, [selectedDescription, onSearch, disabled]);

  const handleDescriptionSelect = (description: string) => {
    setSelectedDescription(description);
    setIsOpen(false);
    setInputValue(''); // reset input on selection
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md ml-4">
      <div className="flex flex-col sm:flex-row gap-2 w-full">
        <div className="flex-1 relative">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            disabled={disabled || isSearching || uniqueDescriptions.length === 0}
            className={`
              w-full px-3 py-2 text-left border border-gray-300 rounded-xl
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none
              transition-all duration-200 ease-in-out flex items-center justify-between gap-2
              ${disabled || uniqueDescriptions.length === 0 ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:border-gray-400'}
              ${isSearching ? 'bg-gray-50' : ''}
            `}
          >
            <span className={`text-sm ${selectedDescription ? 'text-gray-900' : 'text-gray-500'} break-words whitespace-pre-line w-full`}
              style={{ wordBreak: 'break-word' }}>
              {selectedDescription || 'Select a description to search...'}
            </span>
            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {isOpen && uniqueDescriptions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-80 overflow-y-auto">
              
              {/* Input to filter */}
              <div className="p-2 border-b border-gray-200">
                <input
                  type="text"
                  placeholder="Type to filter..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Info Message */}
              <div className="px-4 py-2 text-xs text-gray-600 border-b border-gray-200">
                <p>
                  Type to filter through {uniqueDescriptions.length} descriptions or use dropdown to browse all
                  {inputValue.trim() && filteredDescriptions.length !== uniqueDescriptions.length && (
                    <span className="ml-1 font-medium text-blue-600">
                      ({filteredDescriptions.length} matches found)
                    </span>
                  )}
                </p>
              </div>

              {filteredDescriptions.length > 0 ? (
                filteredDescriptions.map((description, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleDescriptionSelect(description)}
                    className="w-full px-4 py-3 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors border-b border-gray-100 last:border-b-0"
                  >
                    <span className="text-gray-900 line-clamp-2 text-sm">{description}</span>
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-gray-400">No matches found.</div>
              )}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={!selectedDescription || disabled || isSearching}
          className={`
            px-4 py-2 rounded-xl font-medium w-full sm:w-auto
            transition-all duration-200 ease-in-out flex items-center gap-2 justify-center text-sm
            ${selectedDescription && !disabled && !isSearching
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          <Search className="w-4 h-4" />
          {isSearching ? 'Searching...' : 'Search'}
        </button>
      </div>

      {/* Click outside to close dropdown */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </form>
  );
};

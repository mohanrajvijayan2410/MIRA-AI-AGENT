import React, { useCallback, useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, X } from 'lucide-react';
import { parseCSV } from '../utils/csvParser';
import { CSVRow, UploadState } from '../types';

interface CSVUploaderProps {
  onDataLoaded: (data: CSVRow[]) => void;
}

export const CSVUploader: React.FC<CSVUploaderProps> = ({ onDataLoaded }) => {
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    isUploaded: false,
    error: null,
    fileName: null,
  });
  
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFile = useCallback(async (file: File) => {
    if (!file.name.endsWith('.csv')) {
      setUploadState(prev => ({
        ...prev,
        error: 'Please upload a CSV file',
        isUploaded: false,
      }));
      return;
    }

    setUploadState({
      isUploading: true,
      isUploaded: false,
      error: null,
      fileName: file.name,
    });

    try {
      const data = await parseCSV(file);
      setUploadState({
        isUploading: false,
        isUploaded: true,
        error: null,
        fileName: file.name,
      });
      onDataLoaded(data);
    } catch (error) {
      setUploadState({
        isUploading: false,
        isUploaded: false,
        error: error instanceof Error ? error.message : 'Failed to parse CSV',
        fileName: null,
      });
    }
  }, [onDataLoaded]);

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  }, []);

  const resetUpload = () => {
    setUploadState({
      isUploading: false,
      isUploaded: false,
      error: null,
      fileName: null,
    });
  };

  return (
<div className="w-full max-w-sm ml-4 text-left">
  <div
    className={`
      relative border border-dashed rounded-md p-4 text-sm transition-all duration-300 ease-in-out
      ${isDragOver ? 'border-blue-300 bg-blue-50' : 'border-gray-300 bg-gray-50'}
      ${uploadState.isUploaded ? 'border-green-300 bg-green-50' : ''}
      ${uploadState.error ? 'border-red-300 bg-red-50' : ''}
      hover:border-blue-400 hover:bg-blue-50 cursor-pointer
    `}
    onDrop={handleDrop}
    onDragOver={handleDragOver}
    onDragLeave={handleDragLeave}
  >
    <input
      type="file"
      accept=".csv"
      onChange={handleFileInput}
      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      disabled={uploadState.isUploading}
    />

    <div className="text-center space-y-3">
      {uploadState.isUploading ? (
        <div className="space-y-2">
          <div className="w-6 h-6 mx-auto border-2 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-blue-600 font-medium text-sm">Processing...</p>
        </div>
      ) : uploadState.isUploaded ? (
        <div className="space-y-2">
          <CheckCircle className="w-5 h-5 mx-auto text-green-600" />
          <p className="text-green-600 font-medium text-sm">Upload successful!</p>
          <p className="text-xs text-gray-500">{uploadState.fileName}</p>
          <button
            onClick={resetUpload}
            className="inline-flex items-center gap-1 px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition"
          >
            <X className="w-3 h-3" />
            Upload Different
          </button>
        </div>
      ) : uploadState.error ? (
        <div className="space-y-2">
          <AlertCircle className="w-5 h-5 mx-auto text-red-600" />
          <p className="text-red-600 font-medium text-sm">Upload failed</p>
          <p className="text-xs text-red-500">{uploadState.error}</p>
          <button
            onClick={resetUpload}
            className="inline-flex items-center gap-1 px-3 py-1 text-xs bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <Upload className="w-6 h-6 mx-auto text-gray-400" />
          <p className="text-sm font-medium text-gray-700">Upload your CSV</p>
          <p className="text-xs text-gray-500">Drag and drop or click</p>
          <div className="text-[10px] text-gray-400 space-y-0.5">
            <p>Required: Description, Actions, Objects</p>
            <p>Format: .csv</p>
          </div>
        </div>
      )}
    </div>
  </div>
</div>

  );
};
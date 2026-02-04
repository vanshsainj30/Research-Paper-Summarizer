import React from 'react';

function LoadingSpinner() {
  return (
    <div className="bg-white rounded-lg shadow-md p-12">
      <div className="flex flex-col items-center justify-center space-y-6">
        {/* Animated Spinner */}
        <div className="relative">
          <div className="w-20 h-20 border-4 border-blue-200 rounded-full"></div>
          <div className="w-20 h-20 border-4 border-blue-600 rounded-full animate-spin border-t-transparent absolute top-0 left-0"></div>
        </div>

        {/* Loading Text */}
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">
            Processing your document...
          </h3>
          <p className="text-sm text-gray-600">
            The AI is analyzing and generating your summary
          </p>
        </div>

        {/* Progress Steps */}
        <div className="w-full max-w-md space-y-3 mt-4">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-700">Text extracted successfully</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-700">Running PEGASUS model</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-700">Generating summary</span>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6 w-full max-w-md">
          <p className="text-xs text-blue-900 text-center">
            Processing time depends on document length. Large documents may take 30-60
            seconds.
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoadingSpinner;

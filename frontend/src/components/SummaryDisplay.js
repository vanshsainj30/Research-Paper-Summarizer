import React, { useState } from 'react';

function SummaryDisplay({ summary }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(summary.summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Generated Summary
          </h3>
          <button
            onClick={handleCopy}
            className="flex items-center space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-all"
          >
            {copied ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Copied!</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Summary Text */}
      <div className="p-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
          <p className="text-gray-800 leading-relaxed text-base">
            {summary.summary}
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {summary.original_length.toLocaleString()}
            </div>
            <div className="text-xs text-gray-600 mt-1">Original Words</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {summary.summary_length.toLocaleString()}
            </div>
            <div className="text-xs text-gray-600 mt-1">Summary Words</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {summary.compression_ratio}%
            </div>
            <div className="text-xs text-gray-600 mt-1">Compression</div>
          </div>
        </div>
      </div>

      {/* Quality Indicators */}
      <div className="px-6 py-4 bg-blue-50 border-t border-blue-200">
        <div className="flex items-start space-x-2">
          <svg
            className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="text-sm text-blue-900">
            <p className="font-semibold mb-1">About this summary:</p>
            <p className="text-blue-800">
              Generated using PEGASUS (Pre-training with Extracted Gap-sentences for
              Abstractive SUmmarization Sequence-to-sequence), a state-of-the-art
              transformer model specifically trained on arXiv research papers for
              high-quality abstractive summarization.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SummaryDisplay;

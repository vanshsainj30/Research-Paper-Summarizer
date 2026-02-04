import React from 'react';

function TextInput({ text, onTextChange }) {
  const wordCount = text.split(/\s+/).filter((w) => w.length > 0).length;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Paste Research Paper Text
      </h3>
      
      <textarea
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
        placeholder="Paste your research paper abstract, introduction, or full text here...&#10;&#10;The system works best with at least 500 words of text."
        className="w-full h-96 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
      />

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Word count: <span className="font-medium">{wordCount.toLocaleString()}</span>
        </div>
        
        {text && (
          <button
            onClick={() => onTextChange('')}
            className="text-sm text-red-600 hover:text-red-800 underline"
          >
            Clear text
          </button>
        )}
      </div>

      <div className="mt-4 text-xs text-gray-500 space-y-1">
        <p>✓ Minimum 100 characters required</p>
        <p>✓ Best results with 500+ words</p>
        <p>✓ Academic and technical content works best</p>
      </div>
    </div>
  );
}

export default TextInput;

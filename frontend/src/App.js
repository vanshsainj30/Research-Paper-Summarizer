import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import TextInput from './components/TextInput';
import SummaryDisplay from './components/SummaryDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';

function App() {
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' or 'text'
  const [extractedText, setExtractedText] = useState('');
  const [pastedText, setPastedText] = useState('');
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [summaryLength, setSummaryLength] = useState(200);
  const [pdfMetadata, setPdfMetadata] = useState(null);

  const API_URL = 'http://localhost:8000';

  const handleFileUpload = async (file) => {
    setLoading(true);
    setError('');
    setPdfMetadata(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_URL}/upload_pdf`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to upload PDF');
      }

      const data = await response.json();
      setExtractedText(data.text);
      setPdfMetadata({
        word_count: data.word_count,
        page_count: data.page_count,
      });
      setError('');
    } catch (err) {
      setError(err.message);
      setExtractedText('');
    } finally {
      setLoading(false);
    }
  };

  const handleSummarize = async () => {
    const textToSummarize = activeTab === 'upload' ? extractedText : pastedText;

    if (!textToSummarize || textToSummarize.trim().length < 100) {
      setError('Please provide at least 100 characters of text to summarize.');
      return;
    }

    setLoading(true);
    setError('');
    setSummary(null);

    try {
      const response = await fetch(`${API_URL}/summarize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: textToSummarize,
          max_length: summaryLength,
          min_length: Math.floor(summaryLength * 0.4),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to generate summary');
      }

      const data = await response.json();
      setSummary(data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setExtractedText('');
    setPastedText('');
    setSummary(null);
    setError('');
    setPdfMetadata(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-lg">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Research Paper Summarizer
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  AI-powered abstractive summarization using PEGASUS
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                google/pegasus-arxiv
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Selection */}
        <div className="bg-white rounded-lg shadow-md p-1 mb-6 inline-flex">
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-6 py-2 rounded-md font-medium transition-all ${
              activeTab === 'upload'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Upload PDF
          </button>
          <button
            onClick={() => setActiveTab('text')}
            className={`px-6 py-2 rounded-md font-medium transition-all ${
              activeTab === 'text'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Paste Text
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Input */}
          <div className="space-y-6">
            {activeTab === 'upload' ? (
              <FileUpload onFileUpload={handleFileUpload} loading={loading} />
            ) : (
              <TextInput text={pastedText} onTextChange={setPastedText} />
            )}

            {/* PDF Metadata */}
            {pdfMetadata && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-blue-900 mb-2">
                  PDF Information
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-blue-700">Pages:</span>
                    <span className="ml-2 font-medium text-blue-900">
                      {pdfMetadata.page_count}
                    </span>
                  </div>
                  <div>
                    <span className="text-blue-700">Words:</span>
                    <span className="ml-2 font-medium text-blue-900">
                      {pdfMetadata.word_count.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Extracted/Pasted Text Preview */}
            {(extractedText || pastedText) && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Text Preview
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {activeTab === 'upload'
                      ? extractedText.substring(0, 500) + '...'
                      : pastedText.substring(0, 500) +
                        (pastedText.length > 500 ? '...' : '')}
                  </p>
                </div>
                <div className="mt-3 text-sm text-gray-600">
                  Word count:{' '}
                  <span className="font-medium">
                    {(activeTab === 'upload'
                      ? extractedText
                      : pastedText
                    )
                      .split(/\s+/)
                      .filter((w) => w.length > 0).length.toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            {/* Summary Length Control */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Summary Length (words)
              </label>
              <div className="space-y-3">
                <input
                  type="range"
                  min="100"
                  max="400"
                  step="50"
                  value={summaryLength}
                  onChange={(e) => setSummaryLength(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Concise (100)</span>
                  <span className="font-medium text-blue-600">
                    {summaryLength} words
                  </span>
                  <span>Detailed (400)</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={handleSummarize}
                disabled={loading || (!extractedText && !pastedText)}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
              >
                {loading ? 'Processing...' : 'Generate Summary'}
              </button>
              <button
                onClick={handleClear}
                className="px-6 py-3 rounded-lg font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Right Panel - Output */}
          <div className="space-y-6">
            {error && <ErrorMessage message={error} onClose={() => setError('')} />}
            
            {loading && <LoadingSpinner />}
            
            {summary && !loading && <SummaryDisplay summary={summary} />}

            {!summary && !loading && !error && (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                  <svg
                    className="w-10 h-10 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Summary Yet
                </h3>
                <p className="text-gray-600">
                  Upload a PDF or paste text, then click "Generate Summary" to see
                  results here.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-600">
            B.Tech Final Year Project | Powered by HuggingFace Transformers & FastAPI
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;

'use client';

import React, { useState } from 'react';
import CsvUploader from '../components/CsvUploader';
import CsvPreviewTable from '../components/CsvPreviewTable';
import ProgressIndicator from '../components/ProgressIndicator';
import ResultsTable from '../components/ResultsTable';
import { importCsvRows } from '../lib/api';


export default function Home() {
  const [step, setStep] = useState('UPLOAD'); // UPLOAD, PREVIEW, PROCESSING, RESULTS
  const [csvData, setCsvData] = useState([]);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleFileLoaded = (data) => {
    setError(null);
    setCsvData(data);
    setStep('PREVIEW');
  };

  const handleConfirmImport = async () => {
    setStep('PROCESSING');
    setError(null);
    try {
      const response = await importCsvRows(csvData);
      setResults(response);
      setStep('RESULTS');
    } catch (err) {
      console.error("Mapping error:", err);
      setError(err.message || 'An unexpected error occurred during processing.');
      setStep('PREVIEW');
    }
  };

  const handleCancelPreview = () => {
    setCsvData([]);
    setError(null);
    setStep('UPLOAD');
  };

  const handleReset = () => {
    setStep('UPLOAD');
    setCsvData([]);
    setResults(null);
    setError(null);
  };

  return (
    <main className="flex-1 bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden pb-16 min-h-screen">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-violet-500/5 blur-[120px] pointer-events-none"></div>

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none"></div>

      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-10 relative z-10 flex-1 flex flex-col justify-start">
        {/* Brand Banner */}
        <header className="mb-10 text-left flex flex-col sm:flex-row justify-between items-start border-b border-slate-900 pb-6 gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 to-violet-500 flex items-center justify-center font-bold text-slate-950 text-lg shadow-md shadow-cyan-500/10 shrink-0 mt-0.5">
              GE
            </div>
            <div className="flex flex-col gap-1 mr-8 sm:mr-16">
              <h1 className="text-xl font-bold bg-gradient-to-r from-slate-100 to-slate-350 bg-clip-text text-transparent leading-none">
                GrowEasy AI CSV Importer
              </h1>
              <p className="text-xs text-slate-500 font-mono tracking-wider uppercase">
                Stateless Lead Schema Engine
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 sm:self-start">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-semibold text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1 rounded-full">
              Gemini 2.5 Flash Connected
            </span>
          </div>
        </header>

        {error && (
          <div className="w-full max-w-2xl mx-auto mb-6 p-4 rounded-xl bg-rose-950/20 border border-rose-900/30 text-rose-350 flex items-start gap-3 backdrop-blur-md animate-pulse">
            <svg className="w-5 h-5 text-rose-450 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div className="flex-1 text-sm">
              <span className="font-semibold">Processing Failed:</span> {error}
            </div>
            <button onClick={() => setError(null)} className="text-rose-400 hover:text-rose-300">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        <div className="flex-1 flex flex-col justify-center py-6">
          {step === 'UPLOAD' && (
            <div className="animate-fade-in my-auto">
              <div className="max-w-2xl mx-auto text-center mb-8">
                <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight sm:text-4xl">
                  Import CSV leads with AI mapping
                </h2>
                <p className="mt-3 text-slate-400 max-w-xl mx-auto text-base">
                  Upload any CSV lead export. Our model will intelligently detect, parse, and structure your columns to fit the target CRM layout instantly.
                </p>
              </div>
              <CsvUploader onFileLoaded={handleFileLoaded} onError={setError} />
            </div>
          )}

          {step === 'PREVIEW' && (
            <CsvPreviewTable
              data={csvData}
              onConfirm={handleConfirmImport}
              onCancel={handleCancelPreview}
            />
          )}

          {step === 'PROCESSING' && (
            <ProgressIndicator totalRows={csvData.length} />
          )}

          {step === 'RESULTS' && results && (
            <ResultsTable results={results} onReset={handleReset} />
          )}
        </div>
      </div>

      <footer className="text-center text-xs text-slate-600 mt-16 border-t border-slate-900/60 pt-6 pb-8">
        <p>Position Applied: Software Developer (Full-Time) • GrowEasy AI CSV Importer © 2026</p>
      </footer>
    </main>
  );
}

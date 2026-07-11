'use client';

import React, { useCallback, useState } from 'react';
import Papa from 'papaparse';


export default function CsvUploader({ onFileLoaded, onError }) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [fileName, setFileName] = useState(null);

  const processFile = useCallback((file) => {
    if (!file) return;

    // Validate that it is indeed a CSV file
    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (file.type !== 'text/csv' && fileExtension !== 'csv') {
      onError('Invalid file type. Please upload a valid CSV file (.csv).');
      return;
    }

    setFileName(file.name);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: 'greedy',
      complete: (results) => {
        if (results.errors.length > 0 && results.data.length === 0) {
          console.error("PapaParse errors:", results.errors);
          onError(`Parsing failed: ${results.errors[0].message}`);
          return;
        }

        if (results.data.length === 0) {
          onError('The uploaded CSV file contains no data rows.');
          return;
        }

        // Pass headers and rows back to parent
        onFileLoaded(results.data);
      },
      error: (err) => {
        onError(`CSV parsing failed: ${err.message}`);
      }
    });
  }, [onFileLoaded, onError]);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, [processFile]);

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`relative group flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 backdrop-blur-md cursor-pointer
          ${isDragActive
            ? 'border-cyan-400 bg-cyan-950/20 shadow-[0_0_20px_rgba(34,211,238,0.25)]'
            : 'border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/60'
          }`}
      >
        {/* Glow decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-violet-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        <input
          type="file"
          id="csv-file-input"
          accept=".csv"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
          onChange={handleFileInput}
        />

        <div className="relative z-10 flex flex-col items-center pointer-events-none">
          {/* Cloud Upload Icon */}
          <div className="w-16 h-16 mb-4 rounded-2xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:border-cyan-400/40 group-hover:shadow-cyan-950/30 transition-all duration-300">
            <svg
              className="w-8 h-8 text-cyan-400 group-hover:text-violet-400 transition-colors duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>

          <h3 className="text-lg font-medium text-slate-200 mb-1">
            {fileName ? `Selected: ${fileName}` : 'Upload your leads CSV'}
          </h3>

          <p className="text-slate-400 text-sm mb-4">
            Drag and drop your file here, or click to browse
          </p>

          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-350 border border-slate-750">
            Only .csv files accepted
          </span>
        </div>
      </div>
    </div>
  );
}

'use client';

import React from 'react';


export default function CsvPreviewTable({ data, onConfirm, onCancel }) {
  if (!data || data.length === 0) return null;

  const headers = Object.keys(data[0]);

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
            CSV Raw Preview ({data.length} records detected)
          </h2>
          <p className="text-slate-400 text-sm mt-0.5">
            Reviewing raw file columns before starting AI-based mapping.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl transition-all duration-200"
          >
            Clear File
          </button>
          <button
            onClick={onConfirm}
            className="relative group px-5 py-2 text-sm font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-violet-400 hover:from-cyan-300 hover:to-violet-300 rounded-xl transition-all duration-300 shadow-[0_4px_20px_rgba(34,211,238,0.2)] hover:shadow-[0_4px_25px_rgba(34,211,238,0.35)] active:scale-95 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-1.5">
              Confirm & Import
              <svg className="w-4 h-4 text-slate-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </button>
        </div>
      </div>

      <div className="relative w-full border border-white/10 bg-slate-900/60 rounded-xl overflow-hidden shadow-2xl backdrop-blur-md">
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-slate-900/90 to-transparent pointer-events-none z-10"></div>

        <div className="max-h-[400px] overflow-auto custom-scrollbar">
          <table className="w-full border-collapse text-left text-sm text-slate-350">
            <thead className="sticky top-0 bg-slate-950 border-b border-slate-800/80 z-20">
              <tr>
                <th className="px-6 py-4 font-semibold text-cyan-400/90 select-none">#</th>
                {headers.map((header) => (
                  <th
                    key={header}
                    className="px-6 py-4 font-semibold text-slate-200 select-none whitespace-nowrap"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/45">
              {data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="hover:bg-slate-800/15 transition-colors duration-150"
                >
                  <td className="px-6 py-3.5 font-mono text-slate-500 bg-slate-950/20">{rowIndex + 1}</td>
                  {headers.map((header) => (
                    <td key={header} className="px-6 py-3.5 whitespace-nowrap overflow-hidden text-ellipsis max-w-[220px]">
                      {row[header] !== undefined && row[header] !== null ? String(row[header]) : ''}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

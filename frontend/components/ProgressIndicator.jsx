'use client';

import React from 'react';


export default function ProgressIndicator({ totalRows }) {
  const batchCount = Math.ceil(totalRows / 15);
  const estimatedSeconds = Math.max(3, batchCount * 2.5);

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-900/50 border border-slate-800/80 backdrop-blur-xl rounded-2xl shadow-2xl max-w-md w-full mx-auto my-12 relative overflow-hidden">
      <div className="absolute -top-12 -right-12 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl"></div>
      <div className="absolute -bottom-12 -left-12 w-24 h-24 bg-violet-500/10 rounded-full blur-xl"></div>

      <div className="relative w-24 h-24 mb-6">
        <div className="absolute inset-0 rounded-full border-4 border-slate-800/60"></div>
        <div className="absolute inset-0 rounded-full border-4 border-t-cyan-400 border-r-violet-500 animate-spin"></div>
        <div className="absolute inset-4 rounded-full bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center shadow-inner border border-slate-800/55">
          <span className="text-xs text-cyan-400 font-mono tracking-widest font-bold">GEMINI</span>
          <span className="text-[10px] text-slate-500 font-mono">2.5 FLASH</span>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-slate-100 mb-2 tracking-tight">
        Analyzing & Mapping Columns
      </h3>

      <p className="text-slate-400 text-sm text-center mb-6 max-w-xs">
        Chunking <span className="text-cyan-400 font-semibold">{totalRows}</span> rows into <span className="text-violet-400 font-semibold">{batchCount}</span> sequential batches for optimal rate-limit handling.
      </p>

      <div className="w-full bg-slate-800/60 h-2.5 rounded-full overflow-hidden mb-3 border border-slate-700/30">
        <div className="bg-gradient-to-r from-cyan-400 via-violet-500 to-cyan-400 h-full w-full animate-[pulse_1.5s_infinite]"></div>
      </div>

      <div className="flex flex-col gap-1 items-center justify-center">
        <div className="text-xs font-mono text-slate-500">
          Estimated wait time: <span className="text-slate-350">~{Math.round(estimatedSeconds)}s</span>
        </div>
        <div className="text-[11px] text-slate-500 italic animate-pulse">
          Please do not refresh the page...
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';

const formatJson = (obj) => {
  if (!obj || typeof obj !== 'object') return <span className="text-slate-500">{"{}"}</span>;
  const entries = Object.entries(obj);
  if (entries.length === 0) return <span className="text-slate-500">{"{}"}</span>;

  return (
    <pre className="font-mono text-[11px] text-slate-300 whitespace-pre-wrap break-all leading-normal bg-slate-950/65 p-3 rounded-lg border border-slate-850/80 max-h-[150px] overflow-auto custom-scrollbar select-text">
      <span className="text-slate-550">{"{"}</span>
      <div className="pl-4">
        {entries.map(([key, val], index) => (
          <div key={key} className="py-0.5">
            <span className="text-cyan-400/85">&quot;{key}&quot;</span>
            <span className="text-slate-500">: </span>
            <span className="text-slate-200">&quot;{String(val)}&quot;</span>
            {index < entries.length - 1 && <span className="text-slate-500">,</span>}
          </div>
        ))}
      </div>
      <span className="text-slate-550">{"}"}</span>
    </pre>
  );
};


export default function ResultsTable({ results, onReset }) {
  const [activeTab, setActiveTab] = useState('imported');
  const { imported = [], skipped = [], total_imported = 0, total_skipped = 0 } = results;

  const schemaFields = [
    'created_at', 'name', 'email', 'country_code', 'mobile_without_country_code', 'company',
    'city', 'state', 'country', 'lead_owner', 'crm_status', 'crm_note', 'data_source',
    'possession_time', 'description'
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'GOOD_LEAD_FOLLOW_UP':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
            GOOD LEAD
          </span>
        );
      case 'SALE_DONE':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-950/60 text-cyan-400 border border-cyan-800/40">
            SALE DONE
          </span>
        );
      case 'DID_NOT_CONNECT':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-950/60 text-amber-400 border border-amber-800/40">
            NO CONNECT
          </span>
        );
      case 'BAD_LEAD':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-950/60 text-rose-450 border border-rose-800/40">
            BAD LEAD
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800/50 text-slate-400 border border-slate-700/30">
            UNKNOWN
          </span>
        );
    }
  };

  const getSourceBadge = (source) => {
    if (!source) return <span className="text-slate-500">-</span>;
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-800/80 text-violet-300 border border-slate-700/35">
        {source}
      </span>
    );
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-in">

      {/* Summary Dashboard Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
            Import Summary
          </h2>
          <p className="text-slate-400 text-sm mt-0.5">
            Statistical breakdown of the Gemini mapping process.
          </p>
        </div>
        <button
          onClick={onReset}
          className="px-5 py-2.5 text-sm font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
        >
          Import Another CSV
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Success Card */}
        <div className="relative group overflow-hidden p-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl shadow-xl backdrop-blur-md">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-xl transition-transform duration-500 group-hover:scale-110"></div>
          <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Imported Leads</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-4xl font-extrabold text-cyan-400">{total_imported}</span>
            <span className="text-sm text-slate-500">records mapped</span>
          </div>
        </div>

        {/* Skipped Card */}
        <div className="relative group overflow-hidden p-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl shadow-xl backdrop-blur-md">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-xl transition-transform duration-500 group-hover:scale-110"></div>
          <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Skipped Records</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-4xl font-extrabold text-rose-400">{total_skipped}</span>
            <span className="text-sm text-slate-500">records bypassed</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => setActiveTab('imported')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all duration-200 ${activeTab === 'imported'
            ? 'border-cyan-400 text-cyan-450 bg-cyan-950/10'
            : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
        >
          Imported Leads ({total_imported})
        </button>
        <button
          onClick={() => setActiveTab('skipped')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all duration-200 ${activeTab === 'skipped'
            ? 'border-rose-400 text-rose-400 bg-rose-950/10'
            : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
        >
          Skipped Records ({total_skipped})
        </button>
      </div>

      {/* Tab Panels */}
      <div className="w-full">
        {activeTab === 'imported' ? (
          imported.length === 0 ? (
            <div className="text-center py-12 bg-slate-900/20 border border-dashed border-slate-850 rounded-2xl text-slate-500 text-sm">
              No leads were imported.
            </div>
          ) : (
            <div className="relative border border-white/10 bg-slate-900/60 rounded-xl overflow-hidden shadow-2xl backdrop-blur-md">
              {/* Fade affordance overlay */}
              <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-slate-900/90 to-transparent pointer-events-none z-10"></div>
              <div className="max-h-[500px] overflow-auto custom-scrollbar">
                <table className="w-full border-collapse text-left text-xs text-slate-300">
                  <thead className="sticky top-0 bg-slate-950 border-b border-slate-800/80 z-20">
                    <tr>
                      <th className="px-5 py-3.5 font-semibold text-cyan-400/90 select-none">#</th>
                      {schemaFields.map((field) => (
                        <th key={field} className="px-5 py-3.5 font-semibold text-slate-200 select-none whitespace-nowrap">
                          {field}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/30">
                    {imported.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/10 transition-colors duration-150">
                        <td className="px-5 py-3 font-mono text-slate-500 bg-slate-950/15">{idx + 1}</td>
                        {schemaFields.map((field) => (
                          <td key={field} className="px-5 py-3 whitespace-nowrap max-w-[240px] overflow-hidden text-ellipsis">
                            {field === 'crm_status' ? (
                              getStatusBadge(row[field])
                            ) : field === 'data_source' ? (
                              getSourceBadge(row[field])
                            ) : row[field] !== undefined && row[field] !== null ? (
                              String(row[field])
                            ) : (
                              ''
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        ) : skipped.length === 0 ? (
          <div className="text-center py-12 bg-slate-900/20 border border-dashed border-slate-850 rounded-2xl text-slate-500 text-sm">
            No records were skipped.
          </div>
        ) : (
          <div className="relative border border-white/10 bg-slate-900/60 rounded-xl overflow-hidden shadow-2xl backdrop-blur-md">
            {/* Fade affordance overlay */}
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-slate-900/90 to-transparent pointer-events-none z-10"></div>
            <div className="max-h-[500px] overflow-auto custom-scrollbar">
              <table className="w-full border-collapse text-left text-xs text-slate-350">
                <thead className="sticky top-0 bg-slate-950 border-b border-slate-800/80 z-20">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-rose-450 select-none w-16">#</th>
                    <th className="px-6 py-4 font-semibold text-slate-200 select-none w-1/3">Reason for Bypass</th>
                    <th className="px-6 py-4 font-semibold text-slate-200 select-none">Original CSV Data</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/35">
                  {skipped.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/15 transition-colors duration-150 align-top">
                      <td className="px-6 py-4 font-mono text-slate-500 bg-slate-950/15 w-16">{idx + 1}</td>
                      <td className="px-6 py-4 w-1/3">
                        <span className="inline-flex items-start gap-1.5 text-rose-350 font-medium bg-rose-950/10 px-2.5 py-1 rounded-lg border border-rose-900/30">
                          <svg className="w-3.5 h-3.5 mt-0.5 text-rose-450 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          {item.reason || "Validation failed"}
                        </span>
                      </td>
                      <td className="px-6 py-4 select-text">
                        {formatJson(item.original_row)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

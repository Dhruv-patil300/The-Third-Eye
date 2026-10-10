'use client';

import React, { useState } from 'react';
import { useCase } from '@/context/CaseContext';
import {
  Briefcase,
  ChevronDown,
  Plus,
  FilePlus2,
  Search,
  RotateCcw,
  Shield,
  Layers,
  Crosshair,
  Radio,
} from 'lucide-react';

export function Header() {
  const {
    cases,
    activeCaseId,
    activeCase,
    setActiveCaseId,
    globalSearch,
    setGlobalSearch,
    setShowNewCaseModal,
    setShowNewEvidenceModal,
    resetToDemo,
    loading,
  } = useCase();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [resetting, setResetting] = useState(false);

  const handleReset = async () => {
    if (
      confirm(
        'Restore investigation database to Pimpri Chinchwad Police benchmark case (FIR No. 0389/2025 Wakad PS)? Custom additions will be reset to authentic benchmark.'
      )
    ) {
      setResetting(true);
      await resetToDemo();
      setResetting(false);
    }
  };

  return (
    <header className="h-14 bg-[#0A141F] border-b border-[#1A2A3A] px-4 flex items-center justify-between sticky top-0 z-30 shadow-md select-none text-slate-100">
      {/* Left: Active Case Selector & Police Station Context */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-[#22364A] hover:border-sky-500/60 bg-[#0E1A27] hover:bg-[#132334] transition-all text-left shadow-sm"
          >
            <Shield className="w-4 h-4 text-sky-400 flex-shrink-0" />
            <div className="max-w-[280px]">
              <div className="text-[9px] uppercase font-mono font-bold text-sky-400 tracking-wider flex items-center gap-1.5">
                <span>ACTIVE POLICE STATION CASE</span>
                {activeCase?.priority === 'high' && (
                  <span className="text-[8px] font-mono px-1 py-0.2 rounded bg-rose-950 text-rose-300 font-semibold border border-rose-800">
                    PRIORITY HIGH
                  </span>
                )}
              </div>
              <div className="text-xs font-bold text-white truncate font-sans">
                {activeCase ? `${activeCase.referenceNumber}: ${activeCase.title}` : 'No Case Selected'}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
          </button>

          {/* Case Dropdown */}
          {dropdownOpen && (
            <div
              className="absolute left-0 mt-1 w-84 bg-[#0D1824] border border-[#22364A] rounded-lg shadow-2xl py-1 z-50 text-xs text-slate-200"
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <div className="px-3 py-1.5 text-[9px] font-mono font-bold text-slate-400 uppercase border-b border-[#1A2A3A] flex items-center justify-between">
                <span>PCPC INVESTIGATION DOSSIERS</span>
                <span className="text-sky-400">{cases.length} loaded</span>
              </div>

              <div className="max-h-60 overflow-y-auto py-1">
                {cases.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setActiveCaseId(c.id);
                      setDropdownOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left hover:bg-[#142334] flex items-start justify-between gap-2 transition-colors ${
                      c.id === activeCaseId ? 'bg-sky-950/50 border-l-2 border-sky-400' : ''
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="font-semibold text-white truncate">{c.title}</div>
                      <div className="text-[10px] text-slate-400 font-mono flex items-center gap-2 mt-0.5">
                        <span>{c.referenceNumber}</span>
                        <span>•</span>
                        <span>{new Date(c.incidentDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="p-2 border-t border-[#1A2A3A]">
                <button
                  onClick={() => {
                    setShowNewCaseModal(true);
                    setDropdownOpen(false);
                  }}
                  className="w-full py-1.5 px-2 bg-sky-900/40 hover:bg-sky-900/70 text-sky-200 rounded font-mono text-[11px] flex items-center justify-center gap-1.5 transition-colors border border-sky-700/60"
                >
                  <Plus className="w-3 h-3" />
                  <span>Register New FIR Case File</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Classification Tag */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0D1824] border border-[#1A2A3A] text-[10px] font-mono text-slate-300">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>SECURITY LEVEL: CONFIDENTIAL // PCPC CIID</span>
        </div>
      </div>

      {/* Center: Global Search Bar */}
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            placeholder="Search FIR, suspect, vehicle plate, CDR mast, or location..."
            className="w-full pl-9 pr-14 py-1.5 bg-[#0D1824] border border-[#22364A] rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-sky-500 transition-colors font-sans"
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-mono text-slate-400 bg-[#142334] px-1.5 py-0.5 rounded border border-[#22364A]">
            Ctrl+K
          </span>
        </div>
      </div>

      {/* Right: Operational Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowNewEvidenceModal(true)}
          className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold transition-all shadow-md flex items-center gap-1.5"
        >
          <FilePlus2 className="w-3.5 h-3.5" />
          <span>Ingest Evidence</span>
        </button>

        <button
          onClick={handleReset}
          disabled={resetting}
          title="Restore Pimpri Chinchwad benchmark case"
          className="p-1.5 text-slate-400 hover:text-white hover:bg-[#142334] rounded-lg border border-[#22364A] transition-colors"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin' : ''}`} />
        </button>
      </div>
    </header>
  );
}

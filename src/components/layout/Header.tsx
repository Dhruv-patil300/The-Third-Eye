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
  CheckCircle2,
  AlertCircle,
  Shield,
  Layers,
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
    if (confirm('Reset investigation database to the demonstration benchmark case? Any custom additions will be restored to benchmark.')) {
      setResetting(true);
      await resetToDemo();
      setResetting(false);
    }
  };

  return (
    <header className="h-14 bg-white border-b border-border-light px-4 flex items-center justify-between sticky top-0 z-30 shadow-subtle select-none">
      {/* Left: Active Case Selector & Context */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded border border-border-light hover:border-brand-mutedBlueTeal bg-bg-main hover:bg-bg-highlight/50 transition-colors text-left"
          >
            <Briefcase className="w-4 h-4 text-brand-steelBlue flex-shrink-0" />
            <div className="max-w-[280px]">
              <div className="text-[10px] uppercase font-semibold text-text-secondary tracking-wider flex items-center gap-1.5">
                <span>Active Case</span>
                {activeCase?.priority === 'high' && (
                  <span className="text-[9px] px-1 py-0.2 rounded bg-status-criticalBg text-status-critical font-medium border border-status-criticalBorder">
                    High Priority
                  </span>
                )}
              </div>
              <div className="text-xs font-semibold text-text-primary truncate font-sans">
                {activeCase ? `${activeCase.referenceNumber}: ${activeCase.title}` : 'No Case Selected'}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-text-secondary ml-1" />
          </button>

          {/* Case Dropdown */}
          {dropdownOpen && (
            <div
              className="absolute left-0 mt-1 w-80 bg-white border border-border-light rounded-md shadow-dropdown py-1 z-50 text-xs"
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <div className="px-3 py-1.5 text-[10px] font-semibold text-text-secondary uppercase border-b border-border-subtle flex items-center justify-between">
                <span>Available Investigations</span>
                <span className="text-brand-steelBlue">{cases.length} loaded</span>
              </div>

              <div className="max-h-60 overflow-y-auto py-1">
                {cases.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setActiveCaseId(c.id);
                      setDropdownOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left hover:bg-bg-main flex items-start justify-between gap-2 transition-colors ${
                      c.id === activeCaseId ? 'bg-bg-highlight/40 border-l-2 border-brand-steelBlue' : ''
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="font-semibold text-text-primary truncate">{c.title}</div>
                      <div className="text-[10px] text-text-secondary flex items-center gap-2 mt-0.5">
                        <span className="font-mono">{c.referenceNumber}</span>
                        <span>•</span>
                        <span>{new Date(c.incidentDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-medium flex-shrink-0 ${
                        c.status === 'active'
                          ? 'bg-status-successBg text-status-success'
                          : 'bg-bg-muted text-text-secondary'
                      }`}
                    >
                      {c.status}
                    </span>
                  </button>
                ))}
              </div>

              <div className="border-t border-border-subtle p-1.5 bg-bg-main/50 flex items-center gap-2">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    setShowNewCaseModal(true);
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1 px-2 rounded bg-brand-deepTeal text-white text-[11px] font-medium hover:bg-brand-darkSteelTeal transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  <span>Create New Case</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Center: Global Quick Search */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <Search className="w-3.5 h-3.5 text-text-muted absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search evidence, witnesses, vehicles, claims..."
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-bg-main border border-border-light rounded focus:outline-none focus:border-brand-steelBlue focus:bg-white text-text-primary placeholder:text-text-muted transition-colors"
          />
          {globalSearch && (
            <button
              onClick={() => setGlobalSearch('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary text-[10px]"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Right: Quick Action Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleReset}
          disabled={resetting}
          title="Reset database to the rich demonstration case benchmark"
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-text-secondary bg-white border border-border-light hover:bg-bg-main rounded transition-colors"
        >
          <RotateCcw className={`w-3.5 h-3.5 text-text-secondary ${resetting ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Reset Demo</span>
        </button>

        <button
          onClick={() => setShowNewEvidenceModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-brand-deepTeal hover:bg-brand-darkSteelTeal rounded shadow-subtle transition-colors"
        >
          <FilePlus2 className="w-3.5 h-3.5 text-brand-softBlue" />
          <span>Ingest Evidence</span>
        </button>

        {/* Investigator Badge */}
        <div className="hidden lg:flex items-center gap-2 pl-3 ml-1 border-l border-border-light">
          <div className="w-7 h-7 rounded-full bg-brand-mutedBlueTeal/20 border border-brand-mutedBlueTeal/30 flex items-center justify-center text-brand-deepTeal">
            <Shield className="w-3.5 h-3.5" />
          </div>
          <div className="text-left">
            <div className="text-xs font-semibold text-text-primary leading-tight">
              Insp. A. Sen
            </div>
            <div className="text-[10px] text-text-secondary leading-none">Cyber Unit 4</div>
          </div>
        </div>
      </div>
    </header>
  );
}

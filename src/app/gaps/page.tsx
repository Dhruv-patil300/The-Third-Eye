'use client';

import React, { useEffect, useState } from 'react';
import { useCase } from '@/context/CaseContext';
import { InvestigationGap, GapStatus } from '@/types';
import {
  Search,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Filter,
  FileQuestion,
  Shield,
  HelpCircle,
  XCircle,
} from 'lucide-react';

export default function InvestigationGapsPage() {
  const { activeCaseId, activeCase } = useCase();

  const [gaps, setGaps] = useState<InvestigationGap[]>([]);
  const [selectedGap, setSelectedGap] = useState<InvestigationGap | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [dismissalNote, setDismissalNote] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchGaps = async () => {
    if (!activeCaseId) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/cases/${activeCaseId}/gaps`);
      const json = await res.json();
      if (json.success && json.data) {
        setGaps(json.data);
        if (json.data.length > 0 && !selectedGap) {
          setSelectedGap(json.data[0]);
        } else if (selectedGap) {
          const updated = json.data.find((g: InvestigationGap) => g.id === selectedGap.id);
          if (updated) setSelectedGap(updated);
        }
      }
    } catch (err) {
      console.error('Failed to load gaps:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGaps();
  }, [activeCaseId]);

  const handleUpdateStatus = async (id: string, newStatus: GapStatus) => {
    try {
      const res = await fetch(`/api/cases/${activeCaseId}/gaps`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          updates: {
            status: newStatus,
            dismissalReason: newStatus === 'dismissed' ? dismissalNote : undefined,
          },
        }),
      });
      if (res.ok) {
        await fetchGaps();
      }
    } catch (err) {
      console.error('Failed to update gap status:', err);
    }
  };

  const filtered = gaps.filter((g) => statusFilter === 'all' || g.status === statusFilter);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-text-primary tracking-tight flex items-center gap-2">
            <Search className="w-5 h-5 text-status-warning" />
            <span>Investigation Gap Detection & Triage</span>
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Systematic identification of uncorroborated assertions, camera blackouts, missing records, and procedural voids.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-text-secondary">Filter Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 border border-border-light rounded bg-white text-xs focus:outline-none"
          >
            <option value="all">All Gaps ({gaps.length})</option>
            <option value="open">Open</option>
            <option value="investigating">Investigating</option>
            <option value="addressed">Addressed</option>
            <option value="dismissed">Dismissed</option>
          </select>
        </div>
      </div>

      {/* Main 2-Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: List of Gaps */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider px-1 flex items-center justify-between">
            <span>Detected Gaps ({filtered.length})</span>
            <span>Case: {activeCase?.referenceNumber}</span>
          </div>

          <div className="space-y-2.5">
            {filtered.map((gap) => {
              const isSelected = selectedGap?.id === gap.id;
              return (
                <div
                  key={gap.id}
                  onClick={() => setSelectedGap(gap)}
                  className={`bg-white border rounded-lg p-3.5 cursor-pointer transition-all shadow-subtle ${
                    isSelected
                      ? 'border-brand-steelBlue ring-2 ring-brand-steelBlue/20 bg-bg-highlight/20'
                      : 'border-border-light hover:border-brand-mutedBlueTeal hover:bg-bg-main/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="font-mono text-[9px] font-bold text-text-secondary uppercase px-1.5 py-0.5 rounded bg-bg-muted">
                      {gap.id}
                    </span>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-semibold ${
                        gap.severity === 'critical'
                          ? 'bg-status-criticalBg text-status-critical border border-status-criticalBorder'
                          : 'bg-status-warningBg text-status-warning border border-status-warningBorder'
                      }`}
                    >
                      {gap.severity}
                    </span>
                  </div>

                  <h3 className="font-bold text-xs text-text-primary leading-snug">
                    {gap.title}
                  </h3>

                  <p className="text-[11px] text-text-secondary mt-1.5 line-clamp-2">
                    {gap.description}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-border-subtle flex items-center justify-between text-[10px]">
                    <span className="capitalize text-text-secondary">
                      {gap.category.replace('_', ' ')}
                    </span>
                    <span className="font-semibold text-text-primary uppercase">
                      {gap.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Deep-Dive Gap Details */}
        <div className="lg:col-span-7">
          {selectedGap ? (
            <div className="bg-white border border-border-light rounded-lg shadow-card p-5 space-y-4 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border-subtle pb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-[10px] font-bold text-brand-deepTeal bg-bg-highlight px-2 py-0.5 rounded border border-border-subtle">
                      {selectedGap.id}
                    </span>
                    <span className="text-[10px] uppercase font-semibold text-text-secondary">
                      {selectedGap.category.replace('_', ' ')}
                    </span>
                  </div>
                  <h2 className="text-sm font-bold text-text-primary">{selectedGap.title}</h2>
                </div>

                {/* Status Toggle Dropdown */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="font-semibold text-text-secondary text-[11px]">Status:</span>
                  <select
                    value={selectedGap.status}
                    onChange={(e) => handleUpdateStatus(selectedGap.id, e.target.value as any)}
                    className="px-2.5 py-1 text-xs font-semibold rounded border border-border-light bg-white focus:outline-none focus:border-brand-steelBlue"
                  >
                    <option value="open">Open</option>
                    <option value="investigating">Investigating</option>
                    <option value="addressed">Addressed</option>
                    <option value="dismissed">Dismissed</option>
                  </select>
                </div>
              </div>

              {/* Factual Description */}
              <div className="space-y-1">
                <span className="font-semibold text-text-primary block">Observed Factual Gap</span>
                <p className="p-3 bg-bg-main rounded border border-border-subtle text-text-primary leading-relaxed">
                  {selectedGap.description}
                </p>
              </div>

              {/* Why It Matters */}
              <div className="space-y-1">
                <span className="font-semibold text-text-primary block">Investigative Significance</span>
                <p className="p-3 bg-bg-highlight/30 rounded border border-border-subtle text-text-primary leading-relaxed">
                  {selectedGap.whyItMatters}
                </p>
              </div>

              {/* What Is Unknown */}
              <div className="space-y-1">
                <span className="font-semibold text-text-primary block">What Remains Unresolved</span>
                <p className="p-3 bg-status-warningBg/30 rounded border border-status-warningBorder text-text-primary leading-relaxed font-mono text-[11px]">
                  {selectedGap.whatIsUnknown}
                </p>
              </div>

              {/* Actionable Next Step */}
              <div className="space-y-1">
                <span className="font-semibold text-text-primary block">
                  Recommended Concrete Verification Action
                </span>
                <div className="p-3 bg-status-successBg/40 border border-status-successBorder rounded text-status-success font-medium flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span className="text-text-primary">{selectedGap.suggestedNextStep}</span>
                </div>
              </div>

              {/* Dismissal Reason Form if dismissed */}
              {selectedGap.status === 'dismissed' && (
                <div className="pt-3 border-t border-border-subtle space-y-2">
                  <label className="font-semibold text-text-secondary block">
                    Document Reason for Dismissal
                  </label>
                  <textarea
                    rows={2}
                    value={dismissalNote}
                    onChange={(e) => setDismissalNote(e.target.value)}
                    placeholder="e.g. Ruled non-material following physical lock inspection..."
                    className="w-full p-2 border border-border-light rounded text-xs"
                  />
                  <button
                    onClick={() => handleUpdateStatus(selectedGap.id, 'dismissed')}
                    className="px-3 py-1 bg-brand-deepTeal text-white rounded text-xs font-medium"
                  >
                    Save Dismissal Record
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white border border-border-light rounded-lg p-12 text-center text-xs text-text-secondary shadow-card">
              Select an investigation gap from the list to review why it matters and recommended next steps.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

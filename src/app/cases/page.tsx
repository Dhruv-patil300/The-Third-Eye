'use client';

import React, { useState } from 'react';
import { useCase } from '@/context/CaseContext';
import { Case } from '@/types';
import {
  Briefcase,
  Plus,
  Search,
  Calendar,
  MapPin,
  User,
  Shield,
  FolderOpen,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  Archive,
} from 'lucide-react';

export default function CasesPage() {
  const {
    cases,
    activeCaseId,
    setActiveCaseId,
    setShowNewCaseModal,
    refreshCases,
  } = useCase();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [editingCase, setEditingCase] = useState<Case | null>(null);

  const filteredCases = cases.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.incidentLocation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateCase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCase) return;

    try {
      const res = await fetch(`/api/cases/${editingCase.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingCase),
      });
      if (res.ok) {
        await refreshCases();
        setEditingCase(null);
      }
    } catch (err) {
      console.error('Update case failed:', err);
    }
  };

  const handleDeleteCase = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete case "${title}"? All associated evidence, timeline events, and contradictions will be removed.`)) {
      try {
        const res = await fetch(`/api/cases/${id}`, { method: 'DELETE' });
        if (res.ok) {
          await refreshCases();
        }
      } catch (err) {
        console.error('Delete case failed:', err);
      }
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-text-primary tracking-tight flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-brand-steelBlue" />
            <span>Case Management Workspace</span>
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Organize, configure, and isolate distinct investigative matters and jurisdiction records.
          </p>
        </div>

        <button
          onClick={() => setShowNewCaseModal(true)}
          className="px-3.5 py-2 bg-brand-deepTeal text-white rounded text-xs font-semibold hover:bg-brand-darkSteelTeal transition-colors shadow-subtle flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Initialize New Case</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-border-light rounded-lg p-4 shadow-subtle flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-3.5 h-3.5 text-text-muted absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search cases by reference, title, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 border border-border-light rounded bg-bg-main focus:bg-white focus:outline-none focus:border-brand-steelBlue"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-text-secondary font-medium">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 border border-border-light rounded bg-white focus:outline-none focus:border-brand-steelBlue"
          >
            <option value="all">All Statuses ({cases.length})</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Cases Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCases.map((c) => {
          const isActive = c.id === activeCaseId;
          return (
            <div
              key={c.id}
              className={`bg-white rounded-lg border transition-all flex flex-col justify-between p-5 shadow-card ${
                isActive
                  ? 'border-brand-steelBlue ring-2 ring-brand-steelBlue/20'
                  : 'border-border-light hover:border-brand-mutedBlueTeal'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="font-mono text-[10px] font-semibold text-brand-deepTeal bg-bg-highlight/60 px-2 py-0.5 rounded border border-border-subtle">
                    {c.referenceNumber}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-semibold ${
                        c.priority === 'high'
                          ? 'bg-status-criticalBg text-status-critical border border-status-criticalBorder'
                          : 'bg-bg-muted text-text-secondary'
                      }`}
                    >
                      {c.priority}
                    </span>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-semibold ${
                        c.status === 'active'
                          ? 'bg-status-successBg text-status-success border border-status-successBorder'
                          : 'bg-bg-muted text-text-secondary'
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>
                </div>

                <h3 className="font-bold text-sm text-text-primary leading-snug mt-1">
                  {c.title}
                </h3>

                <p className="text-xs text-text-secondary mt-2 line-clamp-3 leading-relaxed">
                  {c.summary || 'No preliminary summary documented for this matter.'}
                </p>

                <div className="mt-4 pt-3 border-t border-border-subtle space-y-1.5 text-[11px] text-text-secondary">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3 h-3 text-brand-steelBlue flex-shrink-0" />
                    <span className="truncate">{c.incidentLocation}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3 text-brand-steelBlue flex-shrink-0" />
                    <span>{new Date(c.incidentDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-3 h-3 text-brand-steelBlue flex-shrink-0" />
                    <span>Lead: {c.leadInvestigator}</span>
                  </div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="mt-5 pt-3 border-t border-border-subtle flex items-center justify-between gap-2 text-xs">
                {isActive ? (
                  <span className="text-[11px] text-status-success font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Current Active Case</span>
                  </span>
                ) : (
                  <button
                    onClick={() => setActiveCaseId(c.id)}
                    className="px-2.5 py-1 bg-brand-deepTeal text-white rounded text-[11px] font-medium hover:bg-brand-darkSteelTeal transition-colors flex items-center gap-1"
                  >
                    <FolderOpen className="w-3 h-3" />
                    <span>Open Case</span>
                  </button>
                )}

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditingCase(c)}
                    title="Edit Case Details"
                    className="p-1 text-text-secondary hover:text-brand-steelBlue rounded hover:bg-bg-main"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  {c.id !== 'case-greenwood-2025' && (
                    <button
                      onClick={() => handleDeleteCase(c.id, c.title)}
                      title="Delete Case"
                      className="p-1 text-text-secondary hover:text-status-critical rounded hover:bg-bg-main"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Case Modal */}
      {editingCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 select-none">
          <div className="bg-white rounded-lg border border-border-light shadow-modal w-full max-w-lg overflow-hidden text-xs">
            <div className="px-5 py-3 bg-bg-main border-b border-border-light flex items-center justify-between">
              <h3 className="font-semibold text-text-primary">Edit Case: {editingCase.referenceNumber}</h3>
              <button onClick={() => setEditingCase(null)} className="text-text-muted hover:text-text-primary">
                ✕
              </button>
            </div>
            <form onSubmit={handleUpdateCase} className="p-5 space-y-3">
              <div>
                <label className="block font-medium mb-1">Case Title</label>
                <input
                  type="text"
                  value={editingCase.title}
                  onChange={(e) => setEditingCase({ ...editingCase, title: e.target.value })}
                  className="w-full px-2.5 py-1.5 border border-border-light rounded focus:outline-none focus:border-brand-steelBlue"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1">Status</label>
                  <select
                    value={editingCase.status}
                    onChange={(e) => setEditingCase({ ...editingCase, status: e.target.value as any })}
                    className="w-full px-2.5 py-1.5 border border-border-light rounded bg-white"
                  >
                    <option value="active">Active</option>
                    <option value="archived">Archived</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium mb-1">Priority</label>
                  <select
                    value={editingCase.priority}
                    onChange={(e) => setEditingCase({ ...editingCase, priority: e.target.value as any })}
                    className="w-full px-2.5 py-1.5 border border-border-light rounded bg-white"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-medium mb-1">Incident Summary</label>
                <textarea
                  rows={4}
                  value={editingCase.summary}
                  onChange={(e) => setEditingCase({ ...editingCase, summary: e.target.value })}
                  className="w-full px-2.5 py-1.5 border border-border-light rounded focus:outline-none focus:border-brand-steelBlue"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2 border-t border-border-light">
                <button
                  type="button"
                  onClick={() => setEditingCase(null)}
                  className="px-3 py-1.5 border border-border-light rounded text-text-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-brand-deepTeal text-white rounded font-medium hover:bg-brand-darkSteelTeal"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

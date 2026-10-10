'use client';

import React, { useEffect, useState } from 'react';
import { useCase } from '@/context/CaseContext';
import { EvidenceItem, VerificationStatus } from '@/types';
import {
  FileText,
  Plus,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  Clock,
  Shield,
  FileCheck2,
  Trash2,
  Eye,
  Hash,
  User,
  Calendar,
  ExternalLink,
} from 'lucide-react';

export default function EvidenceVaultPage() {
  const { activeCaseId, activeCase, setShowNewEvidenceModal, globalSearch } = useCase();

  const [evidenceList, setEvidenceList] = useState<EvidenceItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<EvidenceItem | null>(null);
  const [searchTerm, setSearchTerm] = useState(globalSearch || '');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchEvidence = async () => {
    if (!activeCaseId) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/cases/${activeCaseId}/evidence`);
      const json = await res.json();
      if (json.success && json.data) {
        setEvidenceList(json.data);
        if (json.data.length > 0 && !selectedItem) {
          setSelectedItem(json.data[0]);
        } else if (selectedItem) {
          const updated = json.data.find((e: EvidenceItem) => e.id === selectedItem.id);
          if (updated) setSelectedItem(updated);
        }
      }
    } catch (err) {
      console.error('Failed to load evidence:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvidence();
  }, [activeCaseId]);

  useEffect(() => {
    if (globalSearch) setSearchTerm(globalSearch);
  }, [globalSearch]);

  const handleUpdateStatus = async (id: string, newStatus: VerificationStatus) => {
    try {
      const res = await fetch(`/api/evidence/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verificationStatus: newStatus }),
      });
      if (res.ok) {
        await fetchEvidence();
      }
    } catch (err) {
      console.error('Failed to update evidence status:', err);
    }
  };

  const handleDeleteEvidence = async (id: string, title: string) => {
    if (confirm(`Remove evidence item "${title}" from the case vault?`)) {
      try {
        const res = await fetch(`/api/evidence/${id}`, { method: 'DELETE' });
        if (res.ok) {
          setSelectedItem(null);
          await fetchEvidence();
        }
      } catch (err) {
        console.error('Delete evidence failed:', err);
      }
    }
  };

  const filtered = evidenceList.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.extractedText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sourceDescription.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || item.evidenceType === typeFilter;
    const matchesStatus = statusFilter === 'all' || item.verificationStatus === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-text-primary tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-steelBlue" />
            <span>Evidence Vault & Repository</span>
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Tamper-evident evidence storage, extraction inspection, and source chain of custody records for{' '}
            <span className="font-semibold text-text-primary">{activeCase?.referenceNumber}</span>.
          </p>
        </div>

        <button
          onClick={() => setShowNewEvidenceModal(true)}
          className="px-3.5 py-2 bg-brand-deepTeal text-white rounded text-xs font-semibold hover:bg-brand-darkSteelTeal transition-colors shadow-subtle flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Ingest New Evidence</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-border-light rounded-lg p-3.5 shadow-subtle flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-3.5 h-3.5 text-text-muted absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search extracted statements, titles, hashes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 border border-border-light rounded bg-bg-main focus:bg-white focus:outline-none focus:border-brand-steelBlue"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5">
            <span className="text-text-secondary font-medium">Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-2 py-1.5 border border-border-light rounded bg-white focus:outline-none focus:border-brand-steelBlue text-xs"
            >
              <option value="all">All Types</option>
              <option value="fir_document">FIR Document</option>
              <option value="witness_statement">Witness Statement</option>
              <option value="cctv_observation">CCTV Observation</option>
              <option value="digital_record">Digital Record</option>
              <option value="movement_record">Movement Record</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-text-secondary font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2 py-1.5 border border-border-light rounded bg-white focus:outline-none focus:border-brand-steelBlue text-xs"
            >
              <option value="all">All Statuses</option>
              <option value="verified">Verified</option>
              <option value="unverified">Unverified</option>
              <option value="disputed">Disputed</option>
              <option value="debunked">Debunked</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main 2-Column Workspace: Left List, Right Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Evidence List */}
        <div className="lg:col-span-5 space-y-2.5">
          <div className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider px-1 flex items-center justify-between">
            <span>Evidence Records ({filtered.length})</span>
            <span>Case: {activeCase?.referenceNumber}</span>
          </div>

          {filtered.length === 0 ? (
            <div className="bg-white border border-border-light rounded-lg p-8 text-center text-xs text-text-secondary">
              No evidence matching search filters.
            </div>
          ) : (
            filtered.map((item) => {
              const isSelected = selectedItem?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`bg-white border rounded-lg p-3.5 cursor-pointer transition-all shadow-subtle ${
                    isSelected
                      ? 'border-brand-steelBlue ring-2 ring-brand-steelBlue/20 bg-bg-highlight/20'
                      : 'border-border-light hover:border-brand-mutedBlueTeal hover:bg-bg-main/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono text-[9px] font-semibold text-brand-deepTeal uppercase px-1.5 py-0.5 rounded bg-bg-muted">
                      {item.id}
                    </span>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-semibold ${
                        item.verificationStatus === 'verified'
                          ? 'bg-status-successBg text-status-success border border-status-successBorder'
                          : item.verificationStatus === 'disputed'
                          ? 'bg-status-criticalBg text-status-critical border border-status-criticalBorder'
                          : 'bg-status-warningBg text-status-warning border border-status-warningBorder'
                      }`}
                    >
                      {item.verificationStatus}
                    </span>
                  </div>

                  <h3 className="font-semibold text-xs text-text-primary mt-1.5 leading-snug">
                    {item.title}
                  </h3>

                  <div className="text-[11px] text-text-secondary mt-1 line-clamp-2">
                    {item.sourceDescription}
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-border-subtle flex items-center justify-between text-[10px] text-text-secondary">
                    <span className="capitalize">{item.evidenceType.replace('_', ' ')}</span>
                    <span>{new Date(item.dateReceived).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Evidence Inspector & Verbatim Text Viewer */}
        <div className="lg:col-span-7">
          {selectedItem ? (
            <div className="bg-white border border-border-light rounded-lg shadow-card overflow-hidden text-xs">
              {/* Header */}
              <div className="p-4 bg-bg-main border-b border-border-light flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold text-brand-deepTeal bg-white px-2 py-0.5 rounded border border-border-light">
                      {selectedItem.id}
                    </span>
                    <span className="text-[10px] uppercase font-semibold text-text-secondary">
                      {selectedItem.evidenceType.replace('_', ' ')}
                    </span>
                  </div>
                  <h2 className="text-sm font-bold text-text-primary mt-1">
                    {selectedItem.title}
                  </h2>
                </div>

                {/* Verification Control Dropdown */}
                <div className="flex items-center gap-2">
                  <select
                    value={selectedItem.verificationStatus}
                    onChange={(e) => handleUpdateStatus(selectedItem.id, e.target.value as any)}
                    className="px-2.5 py-1 text-xs font-semibold rounded border border-border-light bg-white focus:outline-none focus:border-brand-steelBlue"
                  >
                    <option value="unverified">Status: Unverified</option>
                    <option value="verified">Status: Verified</option>
                    <option value="disputed">Status: Disputed</option>
                    <option value="debunked">Status: Debunked</option>
                  </select>

                  <button
                    onClick={() => handleDeleteEvidence(selectedItem.id, selectedItem.title)}
                    title="Remove item from vault"
                    className="p-1 text-text-secondary hover:text-status-critical rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Provenance & File Integrity Strip */}
              <div className="px-4 py-2.5 bg-bg-highlight/30 border-b border-border-subtle grid grid-cols-2 md:grid-cols-4 gap-2 text-[10px] text-text-secondary font-mono">
                <div>
                  <span className="font-semibold text-text-primary block">Integrity Hash:</span>
                  <span className="truncate block" title={selectedItem.fileHash}>
                    {selectedItem.fileHash?.slice(0, 16)}...
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-text-primary block">Recorded By:</span>
                  <span className="truncate block">{selectedItem.recordedBy}</span>
                </div>
                <div>
                  <span className="font-semibold text-text-primary block">Date Received:</span>
                  <span>{new Date(selectedItem.dateReceived).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="font-semibold text-text-primary block">Processing:</span>
                  <span className="uppercase text-status-success font-semibold">
                    {selectedItem.processingStatus}
                  </span>
                </div>
              </div>

              {/* Verbatim Content Viewer */}
              <div className="p-4 space-y-4">
                <div>
                  <h3 className="font-semibold text-xs text-text-primary mb-1.5 flex items-center justify-between">
                    <span>Extracted Verbatim Record Content</span>
                    <span className="text-[10px] text-text-secondary font-normal font-mono">
                      UTF-8 Document Buffer
                    </span>
                  </h3>
                  <div className="bg-bg-main p-3.5 rounded border border-border-subtle font-mono text-[11px] text-text-primary whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto">
                    {selectedItem.extractedText || 'No textual content extracted from binary.'}
                  </div>
                </div>

                {/* Extracted Factual Claims */}
                {selectedItem.claims && selectedItem.claims.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-xs text-text-primary mb-1.5">
                      Extracted Claims & Assertions ({selectedItem.claims.length})
                    </h3>
                    <div className="space-y-2">
                      {selectedItem.claims.map((claim, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded bg-bg-main/60 border border-border-subtle text-xs space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-[11px] text-brand-deepTeal">
                              Claimant: {claim.claimant}
                            </span>
                            <span className="text-[9px] uppercase px-1 py-0.2 bg-white rounded border border-border-subtle">
                              {claim.claimType} (Conf: {(claim.confidence * 100).toFixed(0)}%)
                            </span>
                          </div>
                          <div className="text-text-primary italic">"{claim.text}"</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Chain of Custody */}
                {selectedItem.sourceProvenance && (
                  <div className="pt-2 border-t border-border-subtle text-[11px] text-text-secondary">
                    <span className="font-semibold text-text-primary">Chain of Custody: </span>
                    {selectedItem.sourceProvenance.chainOfCustody?.join(' → ') || 'Direct Ingestion'}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white border border-border-light rounded-lg p-12 text-center text-xs text-text-secondary shadow-card">
              Select an evidence item from the repository to inspect extracted text and source provenance.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

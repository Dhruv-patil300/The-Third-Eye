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
  ShieldCheck,
  Radio,
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
    <div className="space-y-6 max-w-7xl mx-auto text-slate-100">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950/80 text-sky-300 font-bold border border-sky-800">
              CHAIN OF CUSTODY VAULT
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              WAKAD PS // PCPC FORENSIC REGISTRY
            </span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-sky-400" />
            <span>Certified Evidence Vault & Repository</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Cryptographically sealed forensic repository, OCR transcripts, and telecommunication packet archives for{' '}
            <span className="font-semibold text-slate-200">{activeCase?.referenceNumber}</span>.
          </p>
        </div>

        <button
          onClick={() => setShowNewEvidenceModal(true)}
          className="px-3.5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold transition-all shadow-md flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Ingest New Evidence</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0C1724] border border-[#1E2E3F] rounded-xl p-3.5 shadow-md flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full md:w-84">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search transcripts, hashes, IMEI, CDR nodes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 border border-[#22364A] rounded-lg bg-[#08121B] text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 font-sans"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto font-mono text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-2.5 py-1.5 border border-[#22364A] rounded-lg bg-[#0E1A27] text-slate-200 focus:outline-none focus:border-sky-500"
            >
              <option value="all">All Types</option>
              <option value="fir_document">FIR Document</option>
              <option value="witness_statement">Witness Statement</option>
              <option value="cctv_observation">CCTV Observation</option>
              <option value="digital_record">Digital Record</option>
              <option value="movement_record">Movement Record</option>
              <option value="forensic_report">Forensic Report</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Verification:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 border border-[#22364A] rounded-lg bg-[#0E1A27] text-slate-200 focus:outline-none focus:border-sky-500"
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
          <div className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider px-1 flex items-center justify-between">
            <span>Evidence Records ({filtered.length})</span>
            <span className="text-sky-400">{activeCase?.referenceNumber}</span>
          </div>

          {filtered.length === 0 ? (
            <div className="bg-[#0C1724] border border-[#1E2E3F] rounded-xl p-8 text-center text-xs text-slate-400 font-mono">
              No evidence matching search filters.
            </div>
          ) : (
            filtered.map((item) => {
              const isSelected = selectedItem?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`bg-[#0C1724] border rounded-xl p-3.5 cursor-pointer transition-all shadow-md ${
                    isSelected
                      ? 'border-sky-500 ring-2 ring-sky-500/20 bg-[#122030]'
                      : 'border-[#1E2E3F] hover:border-sky-500/60 hover:bg-[#101D2B]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono text-[9px] font-bold text-sky-400 uppercase px-1.5 py-0.5 rounded bg-[#08121B]">
                      {item.id.toUpperCase()}
                    </span>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-mono uppercase font-bold ${
                        item.verificationStatus === 'verified'
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                          : item.verificationStatus === 'disputed'
                          ? 'bg-rose-950/80 text-rose-300 border border-rose-800'
                          : 'bg-amber-950/80 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {item.verificationStatus}
                    </span>
                  </div>

                  <h3 className="font-bold text-xs text-white mt-1.5 leading-snug font-sans">
                    {item.title}
                  </h3>

                  <div className="text-[11px] text-slate-300 mt-1 line-clamp-2 font-sans">
                    {item.sourceDescription}
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-[#1E2E3F] flex items-center justify-between text-[10px] font-mono text-slate-400">
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
            <div className="bg-[#0C1724] border border-[#1E2E3F] rounded-xl shadow-xl overflow-hidden text-xs">
              {/* Header */}
              <div className="p-4 bg-[#0F1B2A] border-b border-[#1E2E3F] flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold text-sky-400 bg-[#08121B] px-2 py-0.5 rounded border border-[#1E2E3F]">
                      {selectedItem.id.toUpperCase()}
                    </span>
                    <span className="text-[10px] uppercase font-mono font-bold text-slate-400">
                      {selectedItem.evidenceType.replace('_', ' ')}
                    </span>
                  </div>
                  <h2 className="text-sm font-bold text-white mt-1 font-sans">
                    {selectedItem.title}
                  </h2>
                </div>

                {/* Verification Control Dropdown */}
                <div className="flex items-center gap-2">
                  <select
                    value={selectedItem.verificationStatus}
                    onChange={(e) => handleUpdateStatus(selectedItem.id, e.target.value as any)}
                    className="px-2.5 py-1 text-xs font-mono font-semibold rounded-lg border border-[#22364A] bg-[#08121B] text-slate-200 focus:outline-none focus:border-sky-500"
                  >
                    <option value="unverified">Status: Unverified</option>
                    <option value="verified">Status: Verified</option>
                    <option value="disputed">Status: Disputed</option>
                    <option value="debunked">Status: Debunked</option>
                  </select>

                  <button
                    onClick={() => handleDeleteEvidence(selectedItem.id, selectedItem.title)}
                    title="Remove item from vault"
                    className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Provenance & File Integrity Strip */}
              <div className="px-4 py-2.5 bg-[#09131E] border-b border-[#1E2E3F] grid grid-cols-2 md:grid-cols-4 gap-2 text-[10px] text-slate-400 font-mono">
                <div>
                  <span className="text-slate-200 font-bold block">Integrity SHA-256:</span>
                  <span className="truncate block text-sky-400" title={selectedItem.fileHash}>
                    {selectedItem.fileHash?.slice(0, 18)}...
                  </span>
                </div>
                <div>
                  <span className="text-slate-200 font-bold block">Officer / Collector:</span>
                  <span className="truncate block text-slate-300">{selectedItem.recordedBy}</span>
                </div>
                <div>
                  <span className="text-slate-200 font-bold block">Date Logged:</span>
                  <span className="text-slate-300">{new Date(selectedItem.dateReceived).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-slate-200 font-bold block">Ingestion Integrity:</span>
                  <span className="uppercase text-emerald-400 font-bold">
                    {selectedItem.processingStatus}
                  </span>
                </div>
              </div>

              {/* Verbatim Content Viewer */}
              <div className="p-4 space-y-4">
                <div>
                  <h3 className="font-bold text-xs text-white mb-1.5 flex items-center justify-between font-mono">
                    <span>VERBATIM RECORD CONTENT // CERTIFIED TRANSCRIPT</span>
                    <span className="text-[10px] text-sky-400 font-normal">
                      Sec 65B BNSS Compliant Buffer
                    </span>
                  </h3>
                  <div className="bg-[#08121B] p-3.5 rounded-lg border border-[#1E2E3F] font-mono text-[11px] text-slate-200 whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto shadow-inner">
                    {selectedItem.extractedText || 'No textual content extracted from binary.'}
                  </div>
                </div>

                {/* Extracted Factual Claims */}
                {selectedItem.claims && selectedItem.claims.length > 0 && (
                  <div>
                    <h3 className="font-bold text-xs text-white mb-1.5 font-mono">
                      EXTRACTED PROBATIVE CLAIMS ({selectedItem.claims.length})
                    </h3>
                    <div className="space-y-2">
                      {selectedItem.claims.map((claim, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-lg bg-[#0F1C2B] border border-[#1E2E3F] text-xs space-y-1"
                        >
                          <div className="flex items-center justify-between font-mono">
                            <span className="font-bold text-[11px] text-sky-400">
                              Claimant: {claim.claimant}
                            </span>
                            <span className="text-[9px] uppercase px-1.5 py-0.2 bg-[#08121B] rounded border border-[#1E2E3F] text-slate-300">
                              {claim.claimType} (Conf: {(claim.confidence * 100).toFixed(0)}%)
                            </span>
                          </div>
                          <div className="text-slate-200 italic font-sans">"{claim.text}"</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Chain of Custody */}
                {selectedItem.sourceProvenance && (
                  <div className="pt-2 border-t border-[#1E2E3F] text-[11px] text-slate-400 font-mono">
                    <span className="font-bold text-slate-200">Certified Chain of Custody: </span>
                    <span className="text-sky-300">
                      {selectedItem.sourceProvenance.chainOfCustody?.join(' → ') || 'Direct Ingestion'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-[#0C1724] border border-[#1E2E3F] rounded-xl p-12 text-center text-xs text-slate-400 font-mono shadow-xl">
              Select an evidence item from the repository to inspect extracted text and source provenance.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

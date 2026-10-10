'use client';

import React, { useEffect, useState } from 'react';
import { useCase } from '@/context/CaseContext';
import { useLanguage } from '@/context/LanguageContext';
import { EvidenceItem, VerificationStatus } from '@/types';
import { FileText, Plus, Search, Trash2 } from 'lucide-react';

export default function EvidenceVaultPage() {
  const { t } = useLanguage();
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
    <div className="mx-auto max-w-[1500px] space-y-6 text-[#1d2430]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.18em] text-[#667085]">
            <span className="rounded-full border border-[#d9d1c8] bg-white px-2.5 py-1 shadow-sm">{t('evidence.provenance')}</span>
            <span>{t('nav.evidence')}</span>
          </div>

          <h1 className="flex items-center gap-3 text-2xl font-semibold tracking-[-0.04em] text-[#1d2430]">
            <FileText className="h-5 w-5 text-[#52616f]" />
            <span>{t('evidence.title')}</span>
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-[#586370]">
            {t('evidence.description')}{' '}
            <span className="font-semibold text-[#1d2430]">{activeCase?.referenceNumber}</span>.
          </p>
        </div>

        <button
          onClick={() => setShowNewEvidenceModal(true)}
          className="inline-flex items-center gap-2 self-start rounded-xl border border-[#d9d1c8] bg-[#1f2937] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#283548]"
        >
          <Plus className="h-4 w-4" />
          {t('evidence.add')}
        </button>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-[#e6dfd5] bg-white/80 p-3.5 shadow-[0_18px_35px_rgba(31,41,55,0.04)] backdrop-blur-sm md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#7a8593]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('evidence.search')}
            className="w-full rounded-xl border border-[#d9d1c8] bg-[#f8f5f1] pl-9 pr-3 py-2 text-sm text-[#1d2430] placeholder-[#7a8593] focus:border-[#9aa6b2] focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-[#586370]">
          <div className="flex items-center gap-2">
            <span>{t('evidence.type')}:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-lg border border-[#d9d1c8] bg-white px-2.5 py-1.5 text-[#1d2430] focus:border-[#9aa6b2] focus:outline-none"
            >
              <option value="all">{t('common.all')}</option>
              <option value="fir_document">{t('evidence.kind.fir_document')}</option>
              <option value="witness_statement">{t('evidence.kind.witness_statement')}</option>
              <option value="cctv_observation">{t('evidence.kind.cctv_observation')}</option>
              <option value="digital_record">{t('evidence.kind.digital_record')}</option>
              <option value="movement_record">{t('evidence.kind.movement_record')}</option>
              <option value="forensic_report">{t('evidence.kind.forensic_report')}</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span>{t('evidence.statusPrefix')}:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-[#d9d1c8] bg-white px-2.5 py-1.5 text-[#1d2430] focus:border-[#9aa6b2] focus:outline-none"
            >
              <option value="all">{t('common.all')}</option>
              <option value="verified">{t('common.verified')}</option>
              <option value="unverified">{t('common.unverified')}</option>
              <option value="disputed">{t('common.disputed')}</option>
              <option value="debunked">{t('common.debunked')}</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-3 lg:col-span-5">
          <div className="flex items-center justify-between px-1 text-[11px] font-mono font-bold uppercase tracking-[0.14em] text-[#667085]">
            <span>{t('dashboard.evidenceRepo')} ({filtered.length})</span>
            <span className="text-[#455569]">{activeCase?.referenceNumber}</span>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-[#e6dfd5] bg-white/80 p-8 text-center text-xs font-mono text-[#67717d] shadow-sm">
              {t('common.noData')}
            </div>
          ) : (
            filtered.map((item) => {
              const isSelected = selectedItem?.id === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedItem(item)}
                  className={`w-full rounded-2xl border p-3.5 text-left shadow-sm transition ${
                    isSelected
                      ? 'border-[#b7c1ca] bg-[#f8f5f1] shadow-[0_16px_28px_rgba(31,41,55,0.06)]'
                      : 'border-[#e6dfd5] bg-white hover:border-[#d1d9df] hover:bg-[#faf8f5]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="rounded-md border border-[#d9d1c8] bg-[#f3efe8] px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase text-[#475669]">
                      {item.id.toUpperCase()}
                    </span>
                    <span
                      className={`rounded-md border px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase ${
                        item.verificationStatus === 'verified'
                          ? 'border-[#cfe0d5] bg-[#edf5f0] text-[#44715a]'
                          : item.verificationStatus === 'disputed'
                            ? 'border-[#e5c7c7] bg-[#fdf1f1] text-[#ad5a5a]'
                            : 'border-[#ebdcc3] bg-[#fdf5ea] text-[#a16b2f]'
                      }`}
                    >
                      {item.verificationStatus}
                    </span>
                  </div>

                  <h3 className="mt-2 text-sm font-semibold text-[#1d2430]">{item.title}</h3>
                  <p className="mt-1 text-xs text-[#586370]">{item.sourceDescription}</p>

                  <div className="mt-3 flex items-center justify-between border-t border-[#eee7df] pt-2 text-[10px] font-mono text-[#667085]">
                    <span>{item.evidenceType.replace('_', ' ')}</span>
                    <span>{new Date(item.dateReceived).toLocaleDateString()}</span>
                  </div>
                </button>
              );
            })
          )}
        </div>

        <div className="lg:col-span-7">
          {selectedItem ? (
            <div className="overflow-hidden rounded-2xl border border-[#e6dfd5] bg-white/90 shadow-[0_18px_35px_rgba(31,41,55,0.05)]">
              <div className="flex flex-col gap-3 border-b border-[#e6dfd5] bg-[#f7f4ef] p-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-md border border-[#d9d1c8] bg-white px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-[#475669]">
                      {selectedItem.id.toUpperCase()}
                    </span>
                    <span className="font-mono text-[10px] uppercase text-[#667085]">
                      {selectedItem.evidenceType.replace('_', ' ')}
                    </span>
                  </div>
                  <h2 className="mt-2 text-base font-semibold text-[#1d2430]">{selectedItem.title}</h2>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedItem.verificationStatus}
                    onChange={(e) => handleUpdateStatus(selectedItem.id, e.target.value as any)}
                    className="rounded-lg border border-[#d9d1c8] bg-white px-2.5 py-1.5 text-xs font-mono text-[#1d2430] focus:outline-none"
                  >
                    <option value="unverified">Status: Unverified</option>
                    <option value="verified">Status: Verified</option>
                    <option value="disputed">Status: Disputed</option>
                    <option value="debunked">Status: Debunked</option>
                  </select>

                  <button
                    onClick={() => handleDeleteEvidence(selectedItem.id, selectedItem.title)}
                    className="rounded-lg border border-[#d9d1c8] bg-white p-2 text-[#586370] transition hover:text-[#1d2430]"
                    title="Remove item from vault"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="grid gap-2 border-b border-[#e6dfd5] bg-[#fcfaf7] p-3 text-[10px] font-mono text-[#586370] md:grid-cols-4">
                <div>
                  <div className="text-[#1d2430]">{t('evidence.hash')}</div>
                  <div className="mt-1 text-[#475669]">{selectedItem.fileHash ? `${selectedItem.fileHash.slice(0, 18)}…` : t('reports.notSupplied')}</div>
                </div>
                <div>
                  <div className="text-[#1d2430]">{t('evidence.collector')}</div>
                  <div className="mt-1 text-[#475669]">{selectedItem.recordedBy}</div>
                </div>
                <div>
                  <div className="text-[#1d2430]">{t('evidence.logged')}</div>
                  <div className="mt-1 text-[#475669]">{new Date(selectedItem.dateReceived).toLocaleDateString()}</div>
                </div>
                <div>
                  <div className="text-[#1d2430]">{t('evidence.ingestion')}</div>
                  <div className="mt-1 text-[#44715a] uppercase">{selectedItem.processingStatus}</div>
                </div>
              </div>

              <div className="space-y-5 p-4">
                <div>
                  <div className="mb-2 flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.14em] text-[#667085]">
                    <span>{t('evidence.transcript')}</span>
                    <span className="text-[#475669]">{t('evidence.buffer')}</span>
                  </div>
                  <pre className="max-h-[420px] overflow-y-auto whitespace-pre-wrap rounded-xl border border-[#e6dfd5] bg-[#faf8f5] p-4 text-[11px] leading-6 text-[#253042]">
                    {selectedItem.extractedText || t('evidence.noTranscript')}
                  </pre>
                </div>

                {selectedItem.claims && selectedItem.claims.length > 0 && (
                  <div>
                    <div className="mb-2 text-[10px] font-mono uppercase tracking-[0.14em] text-[#667085]">
                      {t('evidence.claims')} ({selectedItem.claims.length})
                    </div>
                    <div className="space-y-2">
                      {selectedItem.claims.map((claim, idx) => (
                        <div key={idx} className="rounded-xl border border-[#e6dfd5] bg-[#f9f7f3] p-3">
                          <div className="mb-1 flex items-center justify-between gap-3 text-[10px] font-mono text-[#586370]">
                            <span className="font-bold text-[#475669]">{t('evidence.claimant')}: {claim.claimant}</span>
                            <span className="rounded-md border border-[#d9d1c8] bg-white px-1.5 py-0.5 text-[#586370]">
                              {claim.claimType} • {(claim.confidence * 100).toFixed(0)}%
                            </span>
                          </div>
                          <p className="text-sm text-[#253042]">“{claim.text}”</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedItem.sourceProvenance && (
                  <div className="border-t border-[#e6dfd5] pt-3 text-[11px] font-mono text-[#586370]">
                    <span className="font-bold text-[#1d2430]">{t('evidence.chain')}:</span>{' '}
                    {selectedItem.sourceProvenance.chainOfCustody?.join(' → ') || t('evidence.direct')}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-[#e6dfd5] bg-white/85 p-14 text-center text-xs font-mono text-[#67717d] shadow-sm">
              {t('evidence.selectPrompt')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { useCase } from '@/context/CaseContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  X,
  FilePlus2,
  Upload,
  FileText,
  Video,
  Radio,
  FileCheck2,
  AlertCircle,
  Loader2,
  Sparkles,
  Shield,
} from 'lucide-react';

export function NewEvidenceModal({ onEvidenceCreated }: { onEvidenceCreated?: () => void }) {
  const { t } = useLanguage();
  const { showNewEvidenceModal, setShowNewEvidenceModal, activeCaseId, activeCase } = useCase();

  const [tab, setTab] = useState<'upload' | 'manual'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [evidenceType, setEvidenceType] = useState('witness_statement');
  const [sourceDescription, setSourceDescription] = useState('');
  const [recordedBy, setRecordedBy] = useState('');
  const [manualText, setManualText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successInfo, setSuccessInfo] = useState<any | null>(null);

  if (!showNewEvidenceModal) return null;

  const handleClose = () => {
    setShowNewEvidenceModal(false);
    setFile(null);
    setTitle('');
    setManualText('');
    setSuccessInfo(null);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (tab === 'upload' && !file) {
      setError(t('newEvidence.chooseFile'));
      return;
    }
    if (tab === 'manual' && !manualText.trim()) {
      setError(t('newEvidence.enterText'));
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      setSuccessInfo(null);

      if (tab === 'upload') {
        const formData = new FormData();
        if (file) formData.append('file', file);
        formData.append('title', title.trim() || file?.name || 'Uploaded Document');
        formData.append('evidenceType', evidenceType);
        formData.append('sourceDescription', sourceDescription.trim() || 'Uploaded file');
        formData.append('recordedBy', recordedBy);

        const res = await fetch(`/api/cases/${activeCaseId}/evidence`, {
          method: 'POST',
          body: formData,
        });
        const json = await res.json();
        if (!json.success) throw new Error(json.error || 'Upload failed');
        setSuccessInfo(json.data);
      } else {
        const res = await fetch(`/api/cases/${activeCaseId}/evidence`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: title.trim() || 'Manual Evidence Record',
            evidenceType,
            sourceDescription: sourceDescription.trim() || 'Recorded by Investigator',
            extractedText: manualText.trim(),
            recordedBy,
          }),
        });
        const json = await res.json();
        if (!json.success) throw new Error(json.error || 'Submission failed');
        setSuccessInfo(json.data);
      }

      if (onEvidenceCreated) {
        onEvidenceCreated();
      }
    } catch (err: any) {
      setError(err.message || 'Error processing evidence');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 select-none text-slate-100">
      <div className="bg-[#0C1724] rounded-xl border border-[#1E2E3F] shadow-2xl w-full max-w-xl overflow-hidden text-xs">
        {/* Header */}
        <div className="px-5 py-3.5 bg-[#0F1B2A] border-b border-[#1E2E3F] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FilePlus2 className="w-4 h-4 text-sky-400" />
            <div>
              <h3 className="font-bold text-sm text-white font-mono uppercase tracking-wide">
                {t('newEvidence.title')}
              </h3>
              <p className="text-[10px] text-slate-400 font-mono">
                {t('header.activeCase')}:{' '}
                <span className="font-bold text-sky-400">
                  {activeCase?.referenceNumber || activeCaseId}
                </span>
              </p>
            </div>
          </div>
          <button onClick={handleClose} className="text-slate-400 hover:text-white p-1 rounded transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-[#1E2E3F] bg-[#08121B] text-xs font-mono">
          <button
            type="button"
            onClick={() => {
              setTab('upload');
              setError('');
            }}
            className={`flex-1 py-2.5 px-4 font-semibold flex items-center justify-center gap-2 border-b-2 transition-colors ${
              tab === 'upload'
                ? 'border-sky-500 text-sky-300 bg-[#0C1724]'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{t('newEvidence.upload')} (PDF / DOCX / TXT / CSV)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setTab('manual');
              setError('');
            }}
            className={`flex-1 py-2.5 px-4 font-semibold flex items-center justify-center gap-2 border-b-2 transition-colors ${
              tab === 'manual'
                ? 'border-sky-500 text-sky-300 bg-[#0C1724]'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{t('newEvidence.manual')}</span>
          </button>
        </div>

        {/* Form Body */}
        {successInfo ? (
          <div className="p-6 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-400 mx-auto flex items-center justify-center">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white font-mono uppercase">
                {t('newEvidence.success')}
              </h4>
              <p className="text-xs text-slate-300 mt-1 max-w-md mx-auto font-sans">
                {t('newEvidence.successDetail')}
              </p>
            </div>

            <div className="bg-[#08121B] p-3 rounded-lg border border-[#1E2E3F] text-left text-xs space-y-1 font-mono">
              <div className="font-bold text-white font-sans">{successInfo.title}</div>
              <div className="text-[11px] text-slate-400">{t('newEvidence.type')}: <span className="text-sky-300">{t(`evidence.kind.${successInfo.evidenceType}`)}</span></div>
              <div className="text-[11px] text-slate-400">{t('evidence.claims')}: <span className="font-bold text-sky-400">{successInfo.claims?.length || 0}</span></div>
              <div className="text-[11px] text-slate-400">{t('evidence.hash')}: <span className="text-emerald-400 text-[10px]">{successInfo.fileHash || t('reports.notSupplied')}</span></div>
            </div>

            <div className="flex justify-center gap-3 pt-2 font-mono">
              <button
                type="button"
                onClick={() => {
                  setSuccessInfo(null);
                  setTitle('');
                  setManualText('');
                  setFile(null);
                }}
                className="px-3.5 py-1.5 border border-[#22364A] text-slate-300 rounded-lg text-xs hover:bg-[#122030]"
              >
                {t('newEvidence.addAnother')}
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold"
              >
                {t('newEvidence.done')}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
            {error && (
              <div className="p-2.5 rounded-lg bg-rose-950/80 border border-rose-800 text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-mono text-[11px] font-bold text-slate-300 uppercase mb-1">
                  {t('newEvidence.type')} *
                </label>
                <select
                  value={evidenceType}
                  onChange={(e) => setEvidenceType(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-[#22364A] rounded-lg bg-[#08121B] text-slate-100 focus:outline-none focus:border-sky-500 font-mono"
                >
                  <option value="witness_statement">{t('evidence.kind.witness_statement')}</option>
                  <option value="fir_document">{t('evidence.kind.fir_document')}</option>
                  <option value="cctv_observation">{t('evidence.kind.cctv_observation')}</option>
                  <option value="movement_record">{t('evidence.kind.movement_record')}</option>
                  <option value="digital_record">{t('evidence.kind.digital_record')}</option>
                  <option value="forensic_report">{t('evidence.kind.forensic_report')}</option>
                  <option value="physical_evidence">{t('evidence.kind.physical_evidence')}</option>
                  <option value="other">{t('evidence.kind.other')}</option>
                </select>
              </div>

              <div>
                <label className="block font-mono text-[11px] font-bold text-slate-300 uppercase mb-1">
                  {t('newEvidence.recordTitle')} *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sworn Panchnama of Recovery"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-[#22364A] rounded-lg bg-[#08121B] text-slate-100 focus:outline-none focus:border-sky-500 font-sans"
                  required
                />
              </div>
            </div>

            {tab === 'upload' ? (
              <div>
                <label className="block font-mono text-[11px] font-bold text-slate-300 uppercase mb-1">
                  {t('newEvidence.attachment')} (PDF, DOCX, TXT, CSV, JPEG) *
                </label>
                <div className="border-2 border-dashed border-[#1E2E3F] hover:border-sky-500 rounded-lg p-5 text-center cursor-pointer bg-[#08121B] transition-colors">
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setFile(e.target.files[0]);
                        if (!title) setTitle(e.target.files[0].name.replace(/\.[^/.]+$/, ''));
                      }
                    }}
                  />
                  <label htmlFor="file-upload" className="cursor-pointer block">
                    <Upload className="w-6 h-6 text-sky-400 mx-auto mb-1.5" />
                    <div className="font-semibold text-white">
                      {file ? file.name : t('newEvidence.selectFile')}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {t('newEvidence.supported')}
                    </div>
                    {file && (
                      <div className="text-[10px] font-mono text-sky-400 mt-1">
                        Size: {(file.size / 1024).toFixed(1)} KB
                      </div>
                    )}
                  </label>
                </div>
              </div>
            ) : (
              <div>
                <label className="block font-mono text-[11px] font-bold text-slate-300 uppercase mb-1">
                  {t('newEvidence.manualText')} *
                </label>
                <textarea
                  rows={5}
                  placeholder={`Paste statement verbatim, e.g.:\n"On 24-Oct-2025 at 22:18 hours, rear service Door 2B was disarmed via emergency code 7291..."`}
                  value={manualText}
                  onChange={(e) => setManualText(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-[#22364A] rounded-lg bg-[#08121B] text-slate-100 focus:outline-none focus:border-sky-500 font-mono text-[11px]"
                  required
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-mono text-[11px] font-bold text-slate-300 uppercase mb-1">
                  {t('newEvidence.source')}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Wakad Police Station Diary"
                  value={sourceDescription}
                  onChange={(e) => setSourceDescription(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-[#22364A] rounded-lg bg-[#08121B] text-slate-100 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] font-bold text-slate-300 uppercase mb-1">
                  {t('newEvidence.collector')}
                </label>
                <input
                  type="text"
                  value={recordedBy}
                  onChange={(e) => setRecordedBy(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-[#22364A] rounded-lg bg-[#08121B] text-slate-100 focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[#1E2E3F] flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                <Sparkles className="w-3 h-3 text-sky-400" />
                <span>{t('newEvidence.processing')}</span>
              </div>

              <div className="flex items-center gap-2 font-mono">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-3 py-1.5 border border-[#22364A] text-slate-400 hover:text-white rounded-lg"
                >
                  {t('newEvidence.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-lg shadow-md flex items-center gap-1.5 disabled:opacity-60"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{submitting ? t('newEvidence.processing') : t('newEvidence.submit')}</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

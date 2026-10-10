'use client';

import React, { useState } from 'react';
import { useCase } from '@/context/CaseContext';
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
} from 'lucide-react';

export function NewEvidenceModal({ onEvidenceCreated }: { onEvidenceCreated?: () => void }) {
  const { showNewEvidenceModal, setShowNewEvidenceModal, activeCaseId, activeCase } = useCase();

  const [tab, setTab] = useState<'upload' | 'manual'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [evidenceType, setEvidenceType] = useState('witness_statement');
  const [sourceDescription, setSourceDescription] = useState('');
  const [recordedBy, setRecordedBy] = useState('Inspector A. Sen');
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
      setError('Please select a file to upload.');
      return;
    }
    if (tab === 'manual' && !manualText.trim()) {
      setError('Please enter the statement or record text.');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 select-none">
      <div className="bg-white rounded-lg border border-border-light shadow-modal w-full max-w-xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 bg-bg-main border-b border-border-light flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FilePlus2 className="w-4 h-4 text-brand-steelBlue" />
            <div>
              <h3 className="font-semibold text-sm text-text-primary">
                Ingest Evidence into Investigation Vault
              </h3>
              <p className="text-[10px] text-text-secondary">
                Target Case:{' '}
                <span className="font-mono font-medium text-brand-steelBlue">
                  {activeCase?.referenceNumber || activeCaseId}
                </span>
              </p>
            </div>
          </div>
          <button onClick={handleClose} className="text-text-muted hover:text-text-primary p-1 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-border-light bg-bg-muted/40 text-xs">
          <button
            type="button"
            onClick={() => {
              setTab('upload');
              setError('');
            }}
            className={`flex-1 py-2.5 px-4 font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${
              tab === 'upload'
                ? 'border-brand-steelBlue text-brand-deepTeal bg-white font-semibold'
                : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload File (PDF / DOCX / TXT / IMG)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setTab('manual');
              setError('');
            }}
            className={`flex-1 py-2.5 px-4 font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${
              tab === 'manual'
                ? 'border-brand-steelBlue text-brand-deepTeal bg-white font-semibold'
                : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Manual Statement / Log Entry</span>
          </button>
        </div>

        {/* Form Body */}
        {successInfo ? (
          <div className="p-6 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-status-successBg border border-status-successBorder text-status-success mx-auto flex items-center justify-center">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-text-primary">Evidence Successfully Ingested & Processed</h4>
              <p className="text-xs text-text-secondary mt-1 max-w-md mx-auto">
                Text was extracted and analyzed for named entities, timestamps, and factual claims.
              </p>
            </div>

            <div className="bg-bg-main p-3 rounded border border-border-subtle text-left text-xs space-y-1">
              <div className="font-medium text-text-primary">{successInfo.title}</div>
              <div className="text-[11px] text-text-secondary">Type: <span className="font-mono">{successInfo.evidenceType}</span></div>
              <div className="text-[11px] text-text-secondary">Extracted Claims: <span className="font-semibold text-brand-steelBlue">{successInfo.claims?.length || 0}</span></div>
              <div className="text-[11px] text-text-secondary">Hash: <span className="font-mono text-[10px]">{successInfo.fileHash}</span></div>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setSuccessInfo(null);
                  setTitle('');
                  setManualText('');
                  setFile(null);
                }}
                className="px-3 py-1.5 border border-border-light text-text-primary rounded text-xs hover:bg-bg-main"
              >
                Ingest Another Item
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-1.5 bg-brand-deepTeal text-white rounded text-xs hover:bg-brand-darkSteelTeal font-medium"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
            {error && (
              <div className="p-2.5 rounded bg-status-criticalBg border border-status-criticalBorder text-status-critical flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-text-primary mb-1">
                  Evidence Classification *
                </label>
                <select
                  value={evidenceType}
                  onChange={(e) => setEvidenceType(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-border-light rounded focus:outline-none focus:border-brand-steelBlue bg-white"
                >
                  <option value="witness_statement">Witness Statement</option>
                  <option value="fir_document">FIR / Police Report</option>
                  <option value="cctv_observation">CCTV Observation Record</option>
                  <option value="movement_record">Movement / Toll / Travel Record</option>
                  <option value="digital_record">Digital CDR / Keypad / Device Record</option>
                  <option value="forensic_report">Forensic / Ballistic / DNA Report</option>
                  <option value="physical_evidence">Physical Evidence Inventory</option>
                  <option value="other">Other Document</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-text-primary mb-1">
                  Evidence Title / Designation *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sworn Statement of Security Guard"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-border-light rounded focus:outline-none focus:border-brand-steelBlue"
                  required
                />
              </div>
            </div>

            {tab === 'upload' ? (
              <div>
                <label className="block font-medium text-text-primary mb-1">
                  File Attachment (PDF, DOCX, TXT, CSV, JPEG) *
                </label>
                <div className="border-2 border-dashed border-border-light hover:border-brand-steelBlue rounded-md p-4 text-center cursor-pointer bg-bg-main/40 transition-colors">
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
                    <Upload className="w-6 h-6 text-brand-mutedBlueTeal mx-auto mb-1.5" />
                    <div className="font-medium text-text-primary">
                      {file ? file.name : 'Click to select or drag and drop document'}
                    </div>
                    <div className="text-[10px] text-text-secondary mt-0.5">
                      Supports PDF, Microsoft Word (.docx), Plain Text (.txt), CSV, and Images
                    </div>
                    {file && (
                      <div className="text-[10px] font-mono text-brand-steelBlue mt-1">
                        Size: {(file.size / 1024).toFixed(1)} KB
                      </div>
                    )}
                  </label>
                </div>
              </div>
            ) : (
              <div>
                <label className="block font-medium text-text-primary mb-1">
                  Verbatim Statement or Log Text *
                </label>
                <textarea
                  rows={5}
                  placeholder={`Paste or type statement verbatim, e.g.:\n"At 21:15 hours, I observed a silver car idling near the alley. An individual in a dark jacket stepped out and entered through Door 2B..."`}
                  value={manualText}
                  onChange={(e) => setManualText(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-border-light rounded focus:outline-none focus:border-brand-steelBlue font-mono text-[11px]"
                  required
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-text-primary mb-1">
                  Source Provenance / Origin
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sector 4 Police Diary / Witness Interview"
                  value={sourceDescription}
                  onChange={(e) => setSourceDescription(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-border-light rounded focus:outline-none focus:border-brand-steelBlue"
                />
              </div>

              <div>
                <label className="block font-medium text-text-primary mb-1">
                  Collector / Recording Officer
                </label>
                <input
                  type="text"
                  value={recordedBy}
                  onChange={(e) => setRecordedBy(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-border-light rounded focus:outline-none focus:border-brand-steelBlue"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-border-light flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[10px] text-text-secondary">
                <Sparkles className="w-3 h-3 text-brand-mutedBlueTeal" />
                <span>Deterministic extraction + AI verification enabled</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-3 py-1.5 border border-border-light text-text-secondary hover:bg-bg-main rounded font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-1.5 bg-brand-deepTeal hover:bg-brand-darkSteelTeal text-white font-medium rounded shadow-subtle flex items-center gap-1.5 disabled:opacity-60"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{submitting ? 'Extracting & Ingesting...' : 'Ingest & Process'}</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

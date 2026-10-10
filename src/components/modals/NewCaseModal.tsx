'use client';

import React, { useState } from 'react';
import { useCase } from '@/context/CaseContext';
import { X, Briefcase, Plus, AlertCircle } from 'lucide-react';

export function NewCaseModal() {
  const { showNewCaseModal, setShowNewCaseModal, createCase } = useCase();

  const [title, setTitle] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [caseType, setCaseType] = useState('Commercial Burglary');
  const [incidentLocation, setIncidentLocation] = useState('');
  const [summary, setSummary] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('high');
  const [leadInvestigator, setLeadInvestigator] = useState('Inspector A. Sen');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!showNewCaseModal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !referenceNumber.trim()) {
      setError('Please provide both case title and reference number.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      await createCase({
        title: title.trim(),
        referenceNumber: referenceNumber.trim(),
        caseType,
        incidentLocation: incidentLocation.trim() || 'Undetermined Location',
        summary: summary.trim(),
        priority,
        leadInvestigator,
        status: 'active',
        incidentDate: new Date().toISOString(),
        tags: [caseType, `${priority.toUpperCase()} Priority`],
      });
      setShowNewCaseModal(false);
      // Reset form
      setTitle('');
      setReferenceNumber('');
      setSummary('');
    } catch (err: any) {
      setError(err.message || 'Failed to create case');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 select-none">
      <div className="bg-white rounded-lg border border-border-light shadow-modal w-full max-w-lg overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-3.5 bg-bg-main border-b border-border-light flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-brand-steelBlue" />
            <h3 className="font-semibold text-sm text-text-primary">
              Initialize New Investigation Case
            </h3>
          </div>
          <button
            onClick={() => setShowNewCaseModal(false)}
            className="text-text-muted hover:text-text-primary p-1 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {error && (
            <div className="p-2.5 rounded bg-status-criticalBg border border-status-criticalBorder text-status-critical flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-text-primary mb-1">
                Case Reference / FIR No. *
              </label>
              <input
                type="text"
                placeholder="e.g. FIR-2025-0914"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-border-light rounded focus:outline-none focus:border-brand-steelBlue"
                required
              />
            </div>

            <div>
              <label className="block font-medium text-text-primary mb-1">
                Investigation Type
              </label>
              <select
                value={caseType}
                onChange={(e) => setCaseType(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-border-light rounded focus:outline-none focus:border-brand-steelBlue bg-white"
              >
                <option value="Commercial Burglary">Commercial Burglary</option>
                <option value="Homicide / Suspicious Death">Homicide / Suspicious Death</option>
                <option value="Financial Fraud & Embezzlement">Financial Fraud & Embezzlement</option>
                <option value="Digital Cyber Breach">Digital Cyber Breach</option>
                <option value="Kidnapping / Missing Person">Kidnapping / Missing Person</option>
                <option value="Counterfeit & Smuggling">Counterfeit & Smuggling</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-medium text-text-primary mb-1">
              Case Title / Working Designation *
            </label>
            <input
              type="text"
              placeholder="e.g. Vault Keypad Override at Central Bullion House"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-border-light rounded focus:outline-none focus:border-brand-steelBlue"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-text-primary mb-1">
                Incident Location
              </label>
              <input
                type="text"
                placeholder="e.g. 12 High Street, District 2"
                value={incidentLocation}
                onChange={(e) => setIncidentLocation(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-border-light rounded focus:outline-none focus:border-brand-steelBlue"
              />
            </div>

            <div>
              <label className="block font-medium text-text-primary mb-1">
                Priority Level
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-2.5 py-1.5 border border-border-light rounded focus:outline-none focus:border-brand-steelBlue bg-white"
              >
                <option value="high">High (Active Incident)</option>
                <option value="medium">Medium (Standard Investigation)</option>
                <option value="low">Low (Preliminary Inquiry)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-medium text-text-primary mb-1">
              Lead Investigating Officer
            </label>
            <input
              type="text"
              value={leadInvestigator}
              onChange={(e) => setLeadInvestigator(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-border-light rounded focus:outline-none focus:border-brand-steelBlue"
            />
          </div>

          <div>
            <label className="block font-medium text-text-primary mb-1">
              Preliminary Incident Summary
            </label>
            <textarea
              rows={3}
              placeholder="Outline reported timeline, known victims, suspected entry vectors, or initial disclosures..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-border-light rounded focus:outline-none focus:border-brand-steelBlue"
            />
          </div>

          <div className="pt-3 border-t border-border-light flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowNewCaseModal(false)}
              className="px-3 py-1.5 border border-border-light text-text-secondary hover:bg-bg-main rounded font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-1.5 bg-brand-deepTeal hover:bg-brand-darkSteelTeal text-white font-medium rounded shadow-subtle flex items-center gap-1.5 disabled:opacity-60"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{submitting ? 'Creating Case...' : 'Initialize Case'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useCase } from '@/context/CaseContext';
import { useLanguage } from '@/context/LanguageContext';
import { PCPC_TACTICAL_GEOPOINTS, MapMarker } from '@/lib/mapData';
import {
  MapPin,
  Shield,
  Radio,
  Camera,
  AlertTriangle,
  Plus,
  X,
  Save,
  CheckCircle2,
  Crosshair,
  Navigation,
} from 'lucide-react';

const TacticalMapComponent = dynamic(
  () => import('@/components/map/TacticalMap'),
  {
    ssr: false,
    loading: () => (
      <div className="h-[720px] w-full flex flex-col items-center justify-center bg-[#fbf9f5] border border-[#e2dcd2] rounded-xl text-[#64748b] gap-2">
        <div className="w-8 h-8 border-3 border-[#0284c7] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-mono font-medium tracking-wide">
          Initializing PCPC Tactical Map & OpenStreetMap tiles…
        </span>
      </div>
    ),
  }
);

const BLANK_MARKER = {
  title: '',
  category: 'crime_scene' as MapMarker['category'],
  latitude: '18.5985',
  longitude: '73.7634',
  locationName: '',
  timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' IST',
  description: '',
  evidenceRef: '',
  sourceType: 'Investigating Officer Observation',
  disputed: false,
  photoUrl: '',
};

export default function MapPage() {
  const { activeCaseId, activeCase } = useCase();
  const { t } = useLanguage();

  const [customMarkers, setCustomMarkers] = useState<MapMarker[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState(BLANK_MARKER);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Fetch custom markers for active case
  const fetchCustomMarkers = async () => {
    if (!activeCaseId) return;
    try {
      const res = await fetch(`/api/cases/${activeCaseId}/map-markers`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setCustomMarkers(json.data);
        }
      }
    } catch (err) {
      console.error('Failed to fetch custom markers:', err);
    }
  };

  useEffect(() => {
    fetchCustomMarkers();
  }, [activeCaseId]);

  const baseMarkers = PCPC_TACTICAL_GEOPOINTS.filter(
    (m) => m.caseId === activeCaseId
  );
  const fallbackMarkers = baseMarkers.length > 0 ? baseMarkers : PCPC_TACTICAL_GEOPOINTS;
  const displayMarkers: MapMarker[] = [...customMarkers, ...fallbackMarkers];

  const handleAddMarker = async () => {
    if (!activeCaseId || !formData.title.trim()) return;
    const lat = parseFloat(formData.latitude);
    const lng = parseFloat(formData.longitude);
    if (isNaN(lat) || isNaN(lng)) return;

    try {
      setSubmitting(true);
      const res = await fetch(`/api/cases/${activeCaseId}/map-markers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          latitude: lat,
          longitude: lng,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setSubmitSuccess(true);
          setCustomMarkers((prev) => [json.data, ...prev]);
          setTimeout(() => {
            setShowAddModal(false);
            setFormData(BLANK_MARKER);
            setSubmitSuccess(false);
          }, 800);
        }
      }
    } catch (err) {
      console.error('Failed to add marker:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const setPresetCoords = (lat: string, lng: string, name: string) => {
    setFormData((f) => ({
      ...f,
      latitude: lat,
      longitude: lng,
      locationName: f.locationName || name,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e2dcd2] pb-5">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono tracking-wider text-[#64748b] uppercase">
            <span>PCPC GIS Command Center</span>
            <span>•</span>
            <span className="text-[#0284c7] font-semibold">Smart City Surveillance Grid</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1e293b] mt-1">
            Tactical GIS Telemetry & Geo-Verification Map
          </h1>
          <p className="text-xs text-[#64748b] mt-1 max-w-2xl">
            Corroborate suspect claims and statements against live cell mast tower radii, smart city ANPR gateway telemetry, and forensic crime scenes across Pimpri Chinchwad.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="px-3 py-1.5 rounded-lg border border-[#cbd5e1] bg-white text-xs font-mono text-[#334155] shadow-xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Active Case: <strong>{activeCase?.referenceNumber || 'All PCPC Cases'}</strong></span>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0284c7] hover:bg-[#0369a1] text-white rounded-lg font-mono font-semibold text-xs transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Telemetry Point</span>
          </button>
        </div>
      </div>

      {/* Map Module */}
      <TacticalMapComponent
        markers={displayMarkers}
        activeCaseTitle={activeCase?.title}
      />

      {/* Strategic Intelligence Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-[#e2dcd2] bg-white shadow-xs space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#0284c7]">
            <Radio className="w-4 h-4" />
            <span>Tower Triangulation Accuracy</span>
          </div>
          <p className="text-xs text-[#475569] leading-relaxed">
            Mast cell logs from Jio and Airtel provide azimuth sector coverage within a 280-350m radius of target incidents in Wakad and Chakan MIDC.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-[#e2dcd2] bg-white shadow-xs space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#059669]">
            <Camera className="w-4 h-4" />
            <span>ANPR Transit Telemetry</span>
          </div>
          <p className="text-xs text-[#475569] leading-relaxed">
            High-speed optical OCR at Dange Chowk (#WK-44) and HP Chowk (#CK-12) captures vehicle transit stamps accurate to ±1.5 seconds.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-[#e2dcd2] bg-white shadow-xs space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-red-600">
            <AlertTriangle className="w-4 h-4" />
            <span>Alibi Contradiction Mapping</span>
          </div>
          <p className="text-xs text-[#475569] leading-relaxed">
            Geo-coordinates immediately highlight distance vs. time impossibilities between claimed restaurant / workshop alibis and actual cellular presence.
          </p>
        </div>
      </div>

      {/* Add Telemetry Point Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#0C1724] border border-[#22364A] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto text-slate-100">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E2E3F]">
              <div className="flex items-center gap-2">
                <Navigation className="w-5 h-5 text-sky-400" />
                <div>
                  <span className="text-[10px] font-mono text-sky-400 font-bold uppercase tracking-widest block">
                    PCPC TACTICAL GIS TELEMETRY
                  </span>
                  <h2 className="text-sm font-bold text-white font-sans">
                    Register New Geo-Telemetry / Verification Point
                  </h2>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-5 space-y-4 text-xs">
              <div>
                <label className="font-mono text-[11px] font-bold text-slate-300 block uppercase mb-1">
                  Location / Marker Title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData((f) => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Airtel Tower Mast #404-869-21943 Azimuth Sector Ping"
                  className="w-full p-2.5 bg-[#08121B] border border-[#22364A] rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-mono text-[11px] font-bold text-slate-300 block uppercase mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData((f) => ({ ...f, category: e.target.value as any }))}
                    className="w-full p-2.5 bg-[#08121B] border border-[#22364A] rounded-lg text-xs text-slate-200 focus:outline-none focus:border-sky-500 font-mono"
                  >
                    <option value="crime_scene">Crime Scene (Red/Blue)</option>
                    <option value="tower">Cell Tower Triangulation (Purple)</option>
                    <option value="anpr">ANPR Transit Gateway (Emerald)</option>
                    <option value="suspect_seen">Suspect Sighting / Alibi (Amber)</option>
                    <option value="seizure">Evidence / Vehicle Seizure (Orange)</option>
                  </select>
                </div>

                <div>
                  <label className="font-mono text-[11px] font-bold text-slate-300 block uppercase mb-1">
                    Timestamp / Observation Time
                  </label>
                  <input
                    type="text"
                    value={formData.timestamp}
                    onChange={(e) => setFormData((f) => ({ ...f, timestamp: e.target.value }))}
                    placeholder="e.g. 24-Oct-2025 22:45 IST"
                    className="w-full p-2.5 bg-[#08121B] border border-[#22364A] rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>
              </div>

              {/* Coordinates Section with Quick Presets */}
              <div className="p-3 bg-[#08121B] border border-[#22364A] rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-bold text-sky-400 uppercase flex items-center gap-1.5">
                    <Crosshair className="w-3.5 h-3.5" />
                    GPS Coordinates (WGS-84)
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Quick Sectors:</span>
                </div>

                {/* Preset Chips */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => setPresetCoords('18.5985', '73.7634', 'Datta Mandir Rd, Wakad')}
                    className="px-2 py-0.5 rounded bg-sky-950/80 border border-sky-800 text-[10px] font-mono text-sky-300 hover:bg-sky-900 cursor-pointer"
                  >
                    Wakad Datta Mandir
                  </button>
                  <button
                    type="button"
                    onClick={() => setPresetCoords('18.6012', '73.7658', 'Dange Chowk Flyover Junction, PCMC')}
                    className="px-2 py-0.5 rounded bg-sky-950/80 border border-sky-800 text-[10px] font-mono text-sky-300 hover:bg-sky-900 cursor-pointer"
                  >
                    Dange Chowk ANPR
                  </button>
                  <button
                    type="button"
                    onClick={() => setPresetCoords('18.7610', '73.8562', 'Chakan MIDC Phase 2 Industrial Sector')}
                    className="px-2 py-0.5 rounded bg-sky-950/80 border border-sky-800 text-[10px] font-mono text-sky-300 hover:bg-sky-900 cursor-pointer"
                  >
                    Chakan Phase II
                  </button>
                  <button
                    type="button"
                    onClick={() => setPresetCoords('18.7324', '73.6745', 'Old Mumbai-Pune Highway, Talegaon')}
                    className="px-2 py-0.5 rounded bg-sky-950/80 border border-sky-800 text-[10px] font-mono text-sky-300 hover:bg-sky-900 cursor-pointer"
                  >
                    Talegaon Alibi Sector
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="font-mono text-[10px] text-slate-400 block mb-1">Latitude</label>
                    <input
                      type="text"
                      value={formData.latitude}
                      onChange={(e) => setFormData((f) => ({ ...f, latitude: e.target.value }))}
                      className="w-full p-2 bg-[#0C1724] border border-[#22364A] rounded-lg text-xs font-mono text-slate-200 focus:outline-none focus:border-sky-500"
                    />
                  </div>
                  <div>
                    <label className="font-mono text-[10px] text-slate-400 block mb-1">Longitude</label>
                    <input
                      type="text"
                      value={formData.longitude}
                      onChange={(e) => setFormData((f) => ({ ...f, longitude: e.target.value }))}
                      className="w-full p-2 bg-[#0C1724] border border-[#22364A] rounded-lg text-xs font-mono text-slate-200 focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>
              </div>

              {/* Location Name & Address */}
              <div>
                <label className="font-mono text-[11px] font-bold text-slate-300 block uppercase mb-1">
                  Location Name / Physical Address
                </label>
                <input
                  type="text"
                  value={formData.locationName}
                  onChange={(e) => setFormData((f) => ({ ...f, locationName: e.target.value }))}
                  placeholder="e.g. Near HP Petrol Pump, Chakan-Talegaon Link Road, Pune 410501"
                  className="w-full p-2.5 bg-[#08121B] border border-[#22364A] rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 font-sans"
                />
              </div>

              {/* Evidence Reference & Source */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-mono text-[11px] font-bold text-slate-300 block uppercase mb-1">
                    Evidence / Case Reference
                  </label>
                  <input
                    type="text"
                    value={formData.evidenceRef}
                    onChange={(e) => setFormData((f) => ({ ...f, evidenceRef: e.target.value }))}
                    placeholder="e.g. Exh-CDR-404 / ANPR Log #219"
                    className="w-full p-2.5 bg-[#08121B] border border-[#22364A] rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>
                <div>
                  <label className="font-mono text-[11px] font-bold text-slate-300 block uppercase mb-1">
                    Source Type
                  </label>
                  <input
                    type="text"
                    value={formData.sourceType}
                    onChange={(e) => setFormData((f) => ({ ...f, sourceType: e.target.value }))}
                    placeholder="e.g. Telecom CDR Subpoena / PCMC Smart City"
                    className="w-full p-2.5 bg-[#08121B] border border-[#22364A] rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 font-sans"
                  />
                </div>
              </div>

              {/* Photo URL */}
              <div>
                <label className="font-mono text-[11px] font-bold text-slate-300 block uppercase mb-1">
                  Scene / Telemetry Evidence Photo URL (Optional)
                </label>
                <input
                  type="text"
                  value={formData.photoUrl}
                  onChange={(e) => setFormData((f) => ({ ...f, photoUrl: e.target.value }))}
                  placeholder="https://... or uploaded image URL"
                  className="w-full p-2.5 bg-[#08121B] border border-[#22364A] rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 font-mono"
                />
              </div>

              {/* Description */}
              <div>
                <label className="font-mono text-[11px] font-bold text-slate-300 block uppercase mb-1">
                  Investigative Significance / Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Explain why this geo-point is crucial to the prosecution's chargesheet..."
                  className="w-full p-2.5 bg-[#08121B] border border-[#22364A] rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 resize-none font-sans"
                />
              </div>

              {/* Disputed Checkbox */}
              <div className="flex items-center gap-2.5 pt-1">
                <input
                  type="checkbox"
                  id="disputed-check"
                  checked={formData.disputed}
                  onChange={(e) => setFormData((f) => ({ ...f, disputed: e.target.checked }))}
                  className="w-4 h-4 rounded border-[#22364A] bg-[#08121B] text-rose-500 focus:ring-0 cursor-pointer"
                />
                <label htmlFor="disputed-check" className="text-xs text-slate-300 font-sans cursor-pointer select-none">
                  Flag as <strong className="text-rose-400">Disputed / Debunked Alibi</strong> (Displays in red indicator to highlight contradiction)
                </label>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 pb-5 flex items-center justify-end gap-3 border-t border-[#1E2E3F] pt-4">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-1.5 rounded-lg border border-[#22364A] text-slate-300 text-xs font-mono hover:bg-[#1a2535] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddMarker}
                disabled={submitting || !formData.title.trim()}
                className={`flex items-center gap-1.5 px-5 py-1.5 rounded-lg text-white text-xs font-mono font-semibold transition-all cursor-pointer ${
                  submitSuccess
                    ? 'bg-emerald-600'
                    : submitting || !formData.title.trim()
                    ? 'bg-sky-900/50 cursor-not-allowed'
                    : 'bg-[#0284c7] hover:bg-[#0369a1]'
                }`}
              >
                {submitSuccess ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" /> Plotted
                  </>
                ) : submitting ? (
                  <>
                    <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Plotting…
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" /> Plot on Map
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

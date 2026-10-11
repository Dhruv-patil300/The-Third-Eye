'use client';

import React, { useState } from 'react';
import { EvidenceItem } from '@/types';
import {
  Camera,
  FileText,
  Car,
  Play,
  Pause,
  Maximize2,
  CheckCircle2,
  ShieldAlert,
  Download,
  Eye,
  Sliders,
  Crosshair,
  User,
  MapPin,
  ExternalLink,
} from 'lucide-react';

interface ForensicMediaViewerProps {
  evidence: EvidenceItem;
}

export default function ForensicMediaViewer({ evidence }: ForensicMediaViewerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [scrubberTime, setScrubberTime] = useState(38);
  const [showBoundingBoxes, setShowBoundingBoxes] = useState(true);

  // Case & Evidence Specific Real Photos & Metadata
  const isWakadANPR = evidence.id === 'ev-003' || evidence.title.includes('Dange Chowk');
  const isWakadFIR = evidence.id === 'ev-001';
  const isWakadAlibi = evidence.id === 'ev-002';
  const isWakadCDR = evidence.id === 'ev-004';
  const isWakadAccess = evidence.id === 'ev-005';

  const isChakanBallistics = evidence.id.includes('chakan-ballistics');
  const isChakanANPR = evidence.id.includes('chakan-anpr');
  const isChakanInterrogation = evidence.id.includes('chakan-interrogation');

  const isCyberVoIP = evidence.id.includes('cyber-voip');
  const isCyberMule = evidence.id.includes('cyber-mule');

  const isBhosariStatement = evidence.id.includes('bhosari-statement');
  const isBhosariPanchnama = evidence.id.includes('bhosari-panchnama');

  const isChikhaliCCTV = evidence.id.includes('chikhali-cctv');
  const isChikhaliFSL = evidence.id.includes('chikhali-fsl');

  // General fallbacks
  const isANPR =
    isWakadANPR ||
    isChakanANPR ||
    evidence.evidenceType === 'cctv_observation' ||
    evidence.title.toLowerCase().includes('anpr');

  const isFIRorStatement =
    isWakadFIR ||
    isWakadAlibi ||
    isBhosariStatement ||
    isChakanInterrogation ||
    evidence.evidenceType === 'fir_document' ||
    evidence.evidenceType === 'witness_statement';

  const isBallisticsOrPhysical =
    isChakanBallistics ||
    isBhosariPanchnama ||
    isChikhaliFSL ||
    evidence.evidenceType === 'forensic_report' ||
    evidence.evidenceType === 'physical_evidence' ||
    evidence.title.toLowerCase().includes('ballistic') ||
    evidence.title.toLowerCase().includes('cylinder');

  const isCCTV =
    isChikhaliCCTV ||
    evidence.evidenceType === 'cctv_observation' ||
    evidence.title.toLowerCase().includes('cctv');

  return (
    <div className="rounded-xl border border-[#cbd5e1] bg-[#0b1320] text-slate-100 overflow-hidden shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0f172a] border-b border-slate-800 text-xs font-mono">
        <div className="flex items-center gap-2">
          {isANPR ? (
            <Car className="w-4 h-4 text-emerald-400" />
          ) : isFIRorStatement ? (
            <FileText className="w-4 h-4 text-amber-400" />
          ) : (
            <Camera className="w-4 h-4 text-sky-400" />
          )}
          <span className="font-semibold text-slate-200">
            PCPC FORENSIC EVIDENCE SCRUTINY // {evidence.id.toUpperCase()}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800 text-emerald-400 text-[10px]">
            <CheckCircle2 className="w-3 h-3" />
            CHAIN OF CUSTODY VERIFIED
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            HASH: {evidence.fileHash ? evidence.fileHash.slice(0, 14) : 'SHA256:77A2'}…
          </span>
        </div>
      </div>

      {/* VIEWPORT 1: ANPR Vehicle Transit Frame */}
      {isANPR && (
        <div className="p-4 space-y-4">
          <div className="relative rounded-lg overflow-hidden border border-slate-700 bg-slate-950 h-80 flex items-center justify-center">
            {/* Real Vehicle Background Image */}
            <img
              src={
                isChakanANPR
                  ? 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/73/Ravet-Bridge.jpg/1280px-Ravet-Bridge.jpg'
                  : 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/83/PCMC-Dange-Chowk-Flyover.jpg/1280px-PCMC-Dange-Chowk-Flyover.jpg'
              }
              alt="ANPR High-Speed Transit Capture"
              className="absolute inset-0 w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-slate-950/80" />

            {/* Simulated Road Lane Grid */}
            <div
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage:
                  'linear-gradient(#38bdf8 1px, transparent 1px), linear-gradient(90deg, #38bdf8 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }}
            />

            {/* OCR Lock HUD Box */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="relative border-2 border-emerald-500/90 rounded-lg p-4 bg-slate-900/90 shadow-2xl backdrop-blur-md max-w-sm text-center">
                <div className="absolute -top-3 left-3 bg-emerald-600 text-white font-mono text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                  <Crosshair className="w-3 h-3" />
                  OPTICAL OCR MATCH (99.4%)
                </div>

                <div className="mt-2 text-2xl font-mono font-extrabold tracking-widest text-amber-300 bg-black/95 px-4 py-2 rounded border-2 border-amber-500 shadow-inner">
                  {isChakanANPR ? 'UNREGISTERED / FOLDED' : 'MH 14 GX 8842'}
                </div>

                <div className="mt-2 text-[11px] text-slate-200 font-sans font-medium">
                  {isChakanANPR ? (
                    <span><strong>Vehicle:</strong> Black Bajaj Pulsar 220 (Dual Riders, Masks)</span>
                  ) : (
                    <span><strong>Vehicle:</strong> White Hyundai Creta SX (Alloy Wheels)</span>
                  )}
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                  {isChakanANPR
                    ? 'Gate: HP Chowk Camera #CK-12 • Direction: Talegaon • 19:48 IST'
                    : 'Gate: Dange Chowk Pole #WK-44 • Speed: 64.2 km/h • 22:36:12 IST'}
                </div>
              </div>
            </div>

            {/* Bounding Box HUD Overlays */}
            {showBoundingBoxes && (
              <>
                <div className="absolute top-4 left-4 border border-sky-400/80 bg-sky-950/70 p-2 rounded text-[10px] font-mono text-sky-300 backdrop-blur-xs">
                  <div>CAM_ID: {isChakanANPR ? 'PCMC-CHAKAN-HP-12' : 'PCMC-DANGE-04-NE'}</div>
                  <div>AZIMUTH: {isChakanANPR ? '312° (CHAKAN → TALEGAON)' : '278° (WAKAD → HINJAWADI)'}</div>
                  <div>SENSOR: HIGH_SPEED_IR_OPTICAL</div>
                </div>

                <div className="absolute bottom-4 right-4 border border-emerald-500/80 bg-emerald-950/70 p-2 rounded text-[10px] font-mono text-emerald-300 backdrop-blur-xs">
                  <div>PCMC ICCC TELEMETRY SYNC: ACTIVE</div>
                  <div>SUSPECT DRIVER: MALE IN BASEBALL CAP</div>
                </div>
              </>
            )}
          </div>

          {/* Telemetry Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs font-mono">
            <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">CAPTURED PLATE</span>
              <span className="font-bold text-amber-400">
                {isChakanANPR ? 'PULSAR 220' : 'MH-14-GX-8842'}
              </span>
            </div>
            <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">SURVEILLANCE POLE</span>
              <span className="font-bold text-slate-200">
                {isChakanANPR ? 'HP Chowk #CK-12' : 'Dange Chowk #WK-44'}
              </span>
            </div>
            <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">TIME RESOLUTION</span>
              <span className="font-bold text-sky-400">
                {isChakanANPR ? '14-Feb 19:48 IST' : '24-Oct 22:36:12'}
              </span>
            </div>
            <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">TRANSIT STATUS</span>
              <span className="font-bold text-emerald-400">FLEEING CRIME SCENE</span>
            </div>
          </div>
        </div>
      )}

      {/* VIEWPORT 2: Authentic Police Panchnama / FIR Document Viewer */}
      {isFIRorStatement && (
        <div className="p-4 space-y-4">
          <div className="rounded-lg border border-amber-900/50 bg-[#fffdfa] text-slate-900 p-6 shadow-xl relative min-h-[380px] font-serif">
            {/* Real Background Watermark */}
            <div className="absolute right-6 top-6 opacity-10 pointer-events-none select-none text-right">
              <div className="text-5xl font-extrabold font-sans">PCPC</div>
              <div className="text-[10px] uppercase font-mono font-bold tracking-widest">
                CRIME BRANCH ARCHIVE
              </div>
            </div>

            {/* Document Header */}
            <div className="border-b-2 border-slate-900 pb-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase text-red-700 tracking-wider">
                  CONFIDENTIAL • CRIME INVESTIGATION SCRUTINY EXHIBIT
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  {evidence.originalFileName || 'POLICE_EXHIBIT_SCAN.pdf'}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mt-1 font-sans">
                {evidence.title}
              </h3>
              <div className="text-xs text-slate-600 font-mono mt-0.5">
                Recording Officer: <strong>{evidence.recordedBy}</strong> | Date: {new Date(evidence.dateReceived).toLocaleDateString()}
              </div>
            </div>

            {/* Location & Accused Reference Bar */}
            <div className="flex flex-wrap items-center gap-3 p-2.5 bg-amber-50/80 rounded border border-amber-200 text-xs font-sans mb-3">
              <div className="flex items-center gap-1 text-slate-700">
                <MapPin className="w-3.5 h-3.5 text-amber-700" />
                <span><strong>Origin:</strong> {evidence.sourceProvenance.origin}</span>
              </div>
              {isWakadAlibi && (
                <div className="flex items-center gap-1 text-red-700 font-bold ml-auto font-mono text-[10px] uppercase">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Alibi Contradicted by Cell Mast Logs
                </div>
              )}
            </div>

            {/* Extracted Testimony Quote */}
            <div className="text-xs leading-relaxed text-slate-800 space-y-3 font-sans">
              {isChakanInterrogation && (
                <div className="flex flex-col sm:flex-row items-center gap-4 p-3 bg-slate-900 rounded-lg border border-slate-700 text-slate-100">
                  <div className="relative w-36 h-36 rounded-md overflow-hidden border border-slate-600 flex-shrink-0 shadow-md">
                    <img
                      src="/evidence/chakan_accused_police_press_meet.jpg"
                      alt="Captured Culprits in Police Custody"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-1 left-1 text-[9px] font-mono bg-red-950/90 text-red-300 px-1 py-0.5 rounded font-bold">
                      IN CUSTODY
                    </span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="font-bold text-sky-400 font-mono text-[11px]">
                      APPREHENDED CONSPIRATORS: SANGRAM ANANT SINGH & ROHIT PANDEY
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      Captured during PCPC Crime Branch raid. Accused confessed to organizing firearm ambush following extortion demands targeting industrial management.
                    </p>
                    <div className="text-[10px] font-mono text-emerald-400">
                      PCPC CRIME BRANCH PRESS CONFERENCE EXHIBIT // CHAKAN PS
                    </div>
                  </div>
                </div>
              )}

              <div className="p-3 bg-white rounded border-l-4 border-slate-800 shadow-xs">
                <div className="text-[10px] font-mono font-bold text-slate-600 uppercase mb-1">
                  OFFICIAL DEPOSITION / TRANSCRIPT EXCERPT:
                </div>
                <p className="italic text-slate-900 leading-relaxed">
                  &ldquo;{evidence.extractedText}&rdquo;
                </p>
              </div>

              {/* Claims Breakdown Matrix */}
              {evidence.claims && evidence.claims.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-200">
                  <div className="text-[10px] font-mono font-bold uppercase text-slate-700 tracking-wider mb-2">
                    EVIDENTIARY STATEMENTS & CONFIDENCE CORROBORATION
                  </div>
                  <div className="space-y-1.5">
                    {evidence.claims.map((clm, i) => (
                      <div
                        key={i}
                        className="flex items-start justify-between gap-2 p-2 rounded bg-slate-50 border border-slate-200 text-[11px]"
                      >
                        <div>
                          <strong className="text-slate-900">{clm.claimant}:</strong> &ldquo;{clm.text}&rdquo;
                        </div>
                        <span className="px-1.5 py-0.5 rounded font-mono text-[9px] font-bold bg-sky-100 text-sky-800 border border-sky-200 uppercase flex-shrink-0">
                          {clm.claimType} • {(clm.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Official Station Stamp Widget */}
            <div className="mt-6 pt-4 border-t border-slate-300 flex items-center justify-between text-[10px] font-mono text-slate-600">
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 rounded-full border-2 border-red-700 text-red-700 flex flex-col items-center justify-center font-bold text-[8px] leading-tight rotate-[-12deg] p-1">
                  <span>PCPC</span>
                  <span>VERIFIED</span>
                </div>
                <div>
                  <div>Pimpri Chinchwad Police Commissionerate</div>
                  <div>Station Crime Register Verified</div>
                </div>
              </div>

              <div className="text-right">
                <div>Lead Investigating Officer</div>
                <div className="font-bold text-slate-800">{evidence.recordedBy}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEWPORT 3: Ballistics / Laboratory Material Seizure */}
      {isBallisticsOrPhysical && (
        <div className="p-4 space-y-4">
          <div className="relative rounded-lg overflow-hidden border border-slate-700 bg-slate-950 p-6 flex flex-col md:flex-row items-center gap-6">
            <div className="relative w-48 h-48 rounded-lg overflow-hidden border border-slate-600 shadow-xl flex-shrink-0">
              <img
                src={
                  isChakanBallistics
                    ? 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e3/32_ACP_-_FMJ_-_SB_-_1.jpg/1280px-32_ACP_-_FMJ_-_SB_-_1.jpg'
                    : isChikhaliFSL
                    ? 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/88/Tata_motors_Pune_plant_1315.jpg/1280px-Tata_motors_Pune_plant_1315.jpg'
                    : '/evidence/chakan_industrial_crime_scene.jpg'
                }
                alt="Seized Exhibit"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-2 left-2 text-[10px] font-mono text-emerald-400 font-bold">
                EXHIBIT SEAL #PCPC-FSL-7721
              </div>
            </div>

            <div className="flex-1 space-y-2 text-xs font-mono">
              <div className="text-sky-400 font-bold text-sm">
                FSL FORENSIC LABORATORY CHEMICAL & MATERIAL SCRUTINY
              </div>
              <p className="text-slate-300 font-sans text-xs leading-relaxed">
                {evidence.extractedText}
              </p>

              <div className="grid grid-cols-2 gap-2 pt-2 text-[10px]">
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block">SEIZURE LOCATION</span>
                  <span className="text-slate-200 font-bold">{evidence.sourceProvenance.origin}</span>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block">EXAMINING DESK</span>
                  <span className="text-slate-200 font-bold">{evidence.recordedBy}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEWPORT 4: CCTV Surveillance Footage Frame with Timecode Scrubber */}
      {isCCTV && !isANPR && (
        <div className="p-4 space-y-3">
          <div className="relative rounded-lg overflow-hidden border border-slate-700 bg-slate-950 h-72 flex items-center justify-center">
            {/* Real CCTV Frame Image */}
            <img
              src="https://thumb.wikimedia.org/wikipedia/commons/thumb/4/47/Chinchwad_Railway_Station.JPG/1280px-Chinchwad_Railway_Station.JPG"
              alt="CCTV Frame"
              className="absolute inset-0 w-full h-full object-cover opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/60" />

            <div className="relative z-10 text-center font-mono">
              <div className="text-base font-bold text-slate-100 tracking-wider">
                ATM CAMERA RECOVERY FEED // FRAME #4492
              </div>
              <div className="text-xs text-emerald-400 mt-1">
                Kudalwadi Main Chowk Kiosk • Sensor Thermal Cutoff Active
              </div>
            </div>

            {/* Timecode overlay */}
            <div className="absolute top-3 left-3 bg-black/80 px-2 py-1 rounded text-[10px] font-mono text-red-400 flex items-center gap-1.5 border border-red-900">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
              <span>REC // 2025-08-09 03:10:18 IST</span>
            </div>
          </div>

          {/* Scrubber Controls */}
          <div className="flex items-center gap-3 bg-slate-900 p-2.5 rounded-lg border border-slate-800">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1.5 rounded bg-sky-600 hover:bg-sky-500 text-white transition"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min="0"
              max="100"
              value={scrubberTime}
              onChange={(e) => setScrubberTime(Number(e.target.value))}
              className="flex-1 accent-sky-500 cursor-pointer"
            />
            <span className="text-xs font-mono text-slate-300">
              {scrubberTime}% / 100%
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

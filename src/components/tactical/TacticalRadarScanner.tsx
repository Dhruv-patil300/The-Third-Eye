'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Radio, Crosshair, MapPin, Eye, ShieldAlert, Cpu } from 'lucide-react';

interface RadarBlip {
  id: string;
  name: string;
  code: string;
  type: 'crime_scene' | 'anpr_hit' | 'tower_ping' | 'alibi_disputed' | 'toll_plaza';
  x: number; // percentage from center (-100 to 100)
  y: number; // percentage from center (-100 to 100)
  details: string;
  status: 'active' | 'flagged' | 'verified';
}

const PCMC_BLIPS: RadarBlip[] = [
  {
    id: 'blip-1',
    name: 'Kothari Jewellers Vault',
    code: 'SEC-WAKAD-01',
    type: 'crime_scene',
    x: 0,
    y: 0,
    details: 'Scene of Crime. Rear Door 2B breached at 22:18 via PIN 7291.',
    status: 'flagged',
  },
  {
    id: 'blip-2',
    name: 'Jio Datta Mandir Tower',
    code: 'TOWER-404-869-38291',
    type: 'tower_ping',
    x: 8,
    y: -12,
    details: 'Handset 98224-09182 connected at 22:19 (-72dBm). 38s call to accomplice.',
    status: 'flagged',
  },
  {
    id: 'blip-3',
    name: 'Dange Chowk ANPR Pole WK-44',
    code: 'ANPR-DANGE-WK44',
    type: 'anpr_hit',
    x: -32,
    y: -24,
    details: 'White Creta MH-14-GX-8842 captured heading west at 22:36:12.',
    status: 'active',
  },
  {
    id: 'blip-4',
    name: 'Govind Garden (Disproven Alibi)',
    code: 'LOC-PIMPLE-SAUDAGAR',
    type: 'alibi_disputed',
    x: 65,
    y: 42,
    details: 'Claimed dinner location (6.8km away). Disproven by Wakad tower pings.',
    status: 'flagged',
  },
  {
    id: 'blip-5',
    name: 'Bhumkar Chowk Bypass',
    code: 'JUNCTION-BHUMKAR-02',
    type: 'anpr_hit',
    x: -58,
    y: 18,
    details: 'Creta MH-14-GX-8842 turned onto NH-48 bypass at 22:58:40.',
    status: 'active',
  },
  {
    id: 'blip-6',
    name: 'Somatane Toll Plaza',
    code: 'NHAI-FASTAG-L04',
    type: 'toll_plaza',
    x: -82,
    y: -65,
    details: 'Outbound expressway passage confirmed via FASTag at 23:14:22.',
    status: 'verified',
  },
];

export function TacticalRadarScanner() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedBlip, setSelectedBlip] = useState<RadarBlip | null>(PCMC_BLIPS[0]);
  const [activeFrequency, setActiveFrequency] = useState('868.45 MHz (PCPC Grid)');
  const [scanSpeed] = useState(0.025);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let angle = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;
      const maxRadius = Math.min(centerX, centerY) - 16;

      ctx.clearRect(0, 0, width, height);

      // Radar Background Grid
      ctx.fillStyle = '#f7f3eb';
      ctx.fillRect(0, 0, width, height);

      // Concentric Distance Rings
      const rings = [0.25, 0.5, 0.75, 1.0];
      rings.forEach((r, idx) => {
        ctx.beginPath();
        ctx.arc(centerX, centerY, maxRadius * r, 0, Math.PI * 2);
        ctx.strokeStyle = idx === 3 ? 'rgba(104, 116, 95, 0.48)' : 'rgba(104, 116, 95, 0.2)';
        ctx.lineWidth = idx === 3 ? 1.5 : 1;
        ctx.stroke();

        // Ring Labels (Km radius)
        ctx.fillStyle = 'rgba(98, 95, 86, 0.72)';
        ctx.font = '9px monospace';
        ctx.fillText(`${(r * 8).toFixed(1)} km`, centerX + 4, centerY - maxRadius * r + 11);
      });

      // Axis crosshairs
      ctx.beginPath();
      ctx.moveTo(centerX - maxRadius, centerY);
      ctx.lineTo(centerX + maxRadius, centerY);
      ctx.moveTo(centerX, centerY - maxRadius);
      ctx.lineTo(centerX, centerY + maxRadius);
      ctx.strokeStyle = 'rgba(104, 116, 95, 0.22)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Radar Sweep Cone
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle);

      const sweepGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, maxRadius);
      sweepGradient.addColorStop(0, 'rgba(133, 145, 110, 0.22)');
      sweepGradient.addColorStop(1, 'rgba(133, 145, 110, 0.0)');

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, maxRadius, -Math.PI / 4, 0, false);
      ctx.closePath();
      ctx.fillStyle = sweepGradient;
      ctx.fill();

      // Sweep Leading Line
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(maxRadius, 0);
      ctx.strokeStyle = '#85916e';
      ctx.lineWidth = 1.8;
      ctx.shadowColor = '#85916e';
      ctx.shadowBlur = 2;
      ctx.stroke();
      ctx.restore();

      // Draw Blips
      PCMC_BLIPS.forEach((blip) => {
        const blipX = centerX + (blip.x / 100) * maxRadius;
        const blipY = centerY + (blip.y / 100) * maxRadius;

        // Blip color by status & type
        let blipColor = '#829078';
        if (blip.type === 'crime_scene') blipColor = '#a45f56';
        if (blip.type === 'alibi_disputed') blipColor = '#b18c5e';
        if (blip.type === 'anpr_hit') blipColor = '#758b8d';
        if (blip.type === 'toll_plaza') blipColor = '#71866e';

        // Outer glow circle
        ctx.beginPath();
        ctx.arc(blipX, blipY, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = blipColor;
        ctx.shadowColor = blipColor;
        ctx.shadowBlur = 2;
        ctx.fill();

        // Target Reticle if selected
        if (selectedBlip?.id === blip.id) {
          ctx.beginPath();
          ctx.arc(blipX, blipY, 9, 0, Math.PI * 2);
          ctx.strokeStyle = '#514d44';
          ctx.lineWidth = 1.2;
          ctx.setLineDash([2, 2]);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // Blip code label
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#625f56';
        ctx.font = '8px monospace';
        ctx.fillText(blip.code, blipX + 7, blipY - 4);
      });

      angle += scanSpeed;
      if (angle >= Math.PI * 2) angle = 0;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [scanSpeed, selectedBlip]);

  return (
    <div
      ref={containerRef}
      className="bg-[#0A131C] border border-[#1E2E3F] rounded-xl overflow-hidden shadow-2xl relative"
    >
      {/* Tactical Header */}
      <div className="px-4 py-2.5 bg-[#0D1824] border-b border-[#1E2E3F] flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute" />
          <span className="font-mono font-bold tracking-wider text-sky-400 uppercase text-[11px] ml-1">
            PCPC SMART CITY SURVEILLANCE RADAR
          </span>
          <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
            // WAKAD-HINJAWADI GRID
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
          <span className="flex items-center gap-1 text-emerald-400">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            LIVE TELEMETRY
          </span>
          <span className="text-[10px] bg-sky-950/80 text-sky-300 px-2 py-0.5 rounded border border-sky-800/60 hidden md:inline">
            {activeFrequency}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Radar View Canvas */}
        <div className="lg:col-span-7 p-4 flex flex-col items-center justify-center relative bg-gradient-to-b from-[#081018] to-[#0A131C]">
          <div className="relative w-full max-w-[340px] aspect-square flex items-center justify-center">
            <canvas
              ref={canvasRef}
              width={340}
              height={340}
              className="w-full h-full rounded-full border border-sky-900/50 shadow-inner"
            />

            {/* Cardinal direction labels */}
            <span className="absolute top-2 text-[9px] font-mono font-bold text-sky-400 bg-[#0A131C]/90 px-1 rounded">
              N (NIGDI / CHAKAN)
            </span>
            <span className="absolute bottom-2 text-[9px] font-mono font-bold text-sky-400 bg-[#0A131C]/90 px-1 rounded">
              S (PUNE CITY / MULA RIVER)
            </span>
            <span className="absolute left-2 text-[9px] font-mono font-bold text-sky-400 bg-[#0A131C]/90 px-1 rounded">
              W (HINJAWADI / EXPRESSWAY)
            </span>
            <span className="absolute right-2 text-[9px] font-mono font-bold text-sky-400 bg-[#0A131C]/90 px-1 rounded">
              E (PIMPLE SAUDAGAR)
            </span>
          </div>

          <div className="w-full flex items-center justify-between text-[10px] font-mono text-slate-400 mt-2 px-2">
            <span>GRID COORD: 18.5987° N, 73.7682° E</span>
            <span className="text-sky-400">RANGE: 8.0 KM APERTURE</span>
          </div>
        </div>

        {/* Tactical Intel Feed & Active Node Inspector */}
        <div className="lg:col-span-5 p-4 border-t lg:border-t-0 lg:border-l border-[#1E2E3F] bg-[#0C1622] flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-[#1E2E3F]">
              <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-300 font-mono flex items-center gap-1.5">
                <Crosshair className="w-3.5 h-3.5 text-sky-400" />
                Tracked Incident Blips
              </span>
              <span className="text-[10px] font-mono text-sky-400">
                {PCMC_BLIPS.length} NODES PINNED
              </span>
            </div>

            {/* Blip Selector Pills */}
            <div className="space-y-1.5 mt-3 max-h-48 overflow-y-auto pr-1">
              {PCMC_BLIPS.map((bl) => {
                const isSelected = selectedBlip?.id === bl.id;
                return (
                  <button
                    key={bl.id}
                    onClick={() => setSelectedBlip(bl)}
                    className={`w-full text-left p-2 rounded-lg text-xs transition-all flex items-start justify-between gap-2 border ${
                      isSelected
                        ? 'bg-sky-950/60 border-sky-500/80 shadow-md'
                        : 'bg-[#101C2A]/70 border-[#1E2E3F] hover:bg-[#142334]'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-slate-200 text-[11px] flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            bl.type === 'crime_scene'
                              ? 'bg-rose-500'
                              : bl.type === 'alibi_disputed'
                              ? 'bg-amber-400'
                              : bl.type === 'toll_plaza'
                              ? 'bg-emerald-400'
                              : 'bg-sky-400'
                          }`}
                        />
                        {bl.name}
                      </div>
                      <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                        {bl.code}
                      </div>
                    </div>

                    <span
                      className={`text-[9px] uppercase font-mono px-1.5 py-0.5 rounded border ${
                        bl.status === 'flagged'
                          ? 'bg-rose-950/60 text-rose-300 border-rose-800'
                          : bl.status === 'verified'
                          ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
                          : 'bg-sky-950/60 text-sky-300 border-sky-800'
                      }`}
                    >
                      {bl.status}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detailed Inspector Card */}
          {selectedBlip && (
            <div className="p-3 bg-[#111F2E] border border-sky-900/60 rounded-lg text-xs">
              <div className="flex items-center justify-between text-[10px] font-mono text-sky-400 mb-1">
                <span>INSPECTION TARGET: {selectedBlip.code}</span>
                <span className="uppercase text-amber-400 font-semibold">{selectedBlip.type.replace('_', ' ')}</span>
              </div>
              <h4 className="font-bold text-slate-100 text-xs mb-1">
                {selectedBlip.name}
              </h4>
              <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                {selectedBlip.details}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

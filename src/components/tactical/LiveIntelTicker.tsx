'use client';

import React, { useEffect, useState } from 'react';
import { Activity, Bell, AlertTriangle, ShieldCheck, Zap, Radio } from 'lucide-react';

interface IntelItem {
  id: string;
  source: string;
  category: 'critical' | 'alert' | 'telemetry' | 'forensic';
  text: string;
  timestamp: string;
}

const LIVE_INTEL_FEEDS: IntelItem[] = [
  {
    id: 'intel-1',
    source: 'PCMC SMART CITY ANPR',
    category: 'critical',
    text: 'Creta MH-14-GX-8842 captured crossing Dange Chowk Pole #WK-44 (22:36:12) heading Hinjawadi.',
    timestamp: 'JUST NOW',
  },
  {
    id: 'intel-2',
    source: 'JIO TELECOM CDR CORRELATION',
    category: 'critical',
    text: 'Subscriber 98224-09182 pinged Wakad Datta Mandir Tower (-72dBm). Alibi in Pimple Saudagar disproven.',
    timestamp: '2 MIN AGO',
  },
  {
    id: 'intel-3',
    source: 'FSL PUNE REGIONAL LAB',
    category: 'forensic',
    text: 'Latent print Q-4 on Safe Box #4 matched 14 ridge points with ex-guard Nilesh Baban Shinde.',
    timestamp: '5 MIN AGO',
  },
  {
    id: 'intel-4',
    source: 'NHAI FASTAG GATEWAY',
    category: 'telemetry',
    text: 'Somatane Toll Plaza Lane 04 cleared by vehicle MH-14-GX-8842 outbound onto Mumbai Expressway.',
    timestamp: '8 MIN AGO',
  },
  {
    id: 'intel-5',
    source: 'WAKAD PS FIELD SQUAD',
    category: 'alert',
    text: 'Govind Garden Restaurant cashier confirms second patron departed abruptly at 21:35.',
    timestamp: '12 MIN AGO',
  },
];

export function LiveIntelTicker() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % LIVE_INTEL_FEEDS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const current = LIVE_INTEL_FEEDS[currentIndex];

  return (
    <div className="bg-[#0B1520] border border-[#1E2E3F] rounded-lg px-3.5 py-2 flex items-center justify-between text-xs overflow-hidden shadow-md">
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        {/* Animated Beacon */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
          </span>
          <span className="font-mono font-bold text-[11px] uppercase tracking-wider text-rose-400 flex items-center gap-1">
            <Radio className="w-3 h-3 text-rose-400 animate-pulse" />
            SNITCH INTEL WIRE:
          </span>
        </div>

        {/* Dynamic Content */}
        <div className="flex items-center gap-2 truncate">
          <span
            className={`text-[9px] font-mono font-semibold uppercase px-1.5 py-0.5 rounded border flex-shrink-0 ${
              current.category === 'critical'
                ? 'bg-rose-950/80 text-rose-300 border-rose-800'
                : current.category === 'forensic'
                ? 'bg-purple-950/80 text-purple-300 border-purple-800'
                : current.category === 'telemetry'
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                : 'bg-amber-950/80 text-amber-300 border-amber-800'
            }`}
          >
            {current.source}
          </span>
          <p className="text-slate-200 truncate font-sans text-xs">
            {current.text}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0 pl-3">
        <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
          {current.timestamp}
        </span>
        <div className="flex gap-1">
          {LIVE_INTEL_FEEDS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                idx === currentIndex ? 'bg-sky-400 w-3' : 'bg-slate-600'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

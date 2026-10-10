'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Clock,
  Network,
  AlertTriangle,
  Search,
  Sparkles,
  FileBarChart,
  Settings,
  ShieldAlert,
  Radio,
  Eye,
  Crosshair,
} from 'lucide-react';

interface NavSection {
  title: string;
  items: {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
    badgeColor?: string;
  }[];
}

const navSections: NavSection[] = [
  {
    title: 'COMMAND & TRIAGE',
    items: [
      { name: 'Command Center', href: '/', icon: LayoutDashboard },
      { name: 'FIR & Case Register', href: '/cases', icon: Briefcase },
    ],
  },
  {
    title: 'FORENSIC & FIELD ANALYSIS',
    items: [
      { name: 'Evidence Vault', href: '/evidence', icon: FileText },
      { name: 'Chronological Timeline', href: '/timeline', icon: Clock },
      { name: 'Entity & Network Graph', href: '/graph', icon: Network },
      {
        name: 'Inconsistency Matrix',
        href: '/contradictions',
        icon: AlertTriangle,
        badge: '4 CLASH',
        badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      },
      { name: 'Investigation Gaps', href: '/gaps', icon: Search },
    ],
  },
  {
    title: 'INTELLIGENCE & PROSECUTION',
    items: [
      { name: 'AI Co-Investigator', href: '/assistant', icon: Sparkles },
      { name: 'Prosecution Dossier', href: '/reports', icon: FileBarChart },
      { name: 'Audit & Chain of Custody', href: '/settings', icon: Settings },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#08111A] text-slate-100 flex flex-col flex-shrink-0 h-screen sticky top-0 border-r border-[#192736] select-none shadow-2xl z-20">
      {/* Brand & Commissionerate Header */}
      <div className="p-4 border-b border-[#192736] bg-gradient-to-b from-[#0B1522] to-[#08111A]">
        <div className="flex items-center gap-2.5">
          {/* Third Eye Tactical Emblem */}
          <div className="w-10 h-10 rounded-lg bg-sky-950/80 border border-sky-500/40 flex items-center justify-center text-sky-400 shadow-lg shadow-sky-950/60 relative flex-shrink-0">
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
              <circle cx="12" cy="12" r="3.2" strokeWidth="2.2" />
              <line x1="12" y1="2" x2="12" y2="4.5" />
              <line x1="12" y1="19.5" x2="12" y2="22" />
            </svg>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#08111A]" />
          </div>

          <div>
            <div className="text-[10px] font-mono font-bold tracking-wider text-sky-400 uppercase leading-none">
              पिंपरी चिंचवड पोलीस
            </div>
            <h1 className="font-bold text-sm tracking-tight text-white uppercase font-sans mt-0.5">
              THE THIRD EYE
            </h1>
            <p className="text-[9px] text-slate-400 font-mono tracking-tight leading-none mt-0.5">
              PCPC INVESTIGATION INTELLIGENCE
            </p>
          </div>
        </div>

        {/* Tactical Sub-banner */}
        <div className="mt-3 px-2 py-1.5 rounded bg-[#0D1B2A] border border-[#1E3347] flex items-center justify-between text-[10px] font-mono">
          <span className="text-slate-400 flex items-center gap-1">
            <Crosshair className="w-3 h-3 text-sky-400" />
            UNIT: CRIME BRANCH
          </span>
          <span className="text-emerald-400 font-semibold">ICCC ACTIVE</span>
        </div>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-4 text-xs font-medium">
        {navSections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            <div className="px-2 pb-1 text-[9px] font-mono font-bold tracking-widest text-slate-400 uppercase">
              {section.title}
            </div>

            {section.items.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg transition-all ${
                    isActive
                      ? 'bg-sky-950/80 text-white font-semibold border border-sky-500/60 shadow-md shadow-sky-950/50'
                      : 'text-slate-300 hover:bg-[#101D2B] hover:text-white border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={`w-4 h-4 flex-shrink-0 ${
                        isActive ? 'text-sky-400' : 'text-slate-400'
                      }`}
                    />
                    <span className="truncate">{item.name}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                        item.badgeColor || 'bg-sky-900/50 text-sky-300 border-sky-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Police Station & Authority Status Footer */}
      <div className="p-3 border-t border-[#192736] bg-[#0A141F] text-[10px] font-mono space-y-1">
        <div className="flex items-center justify-between text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            WAKAD PS GRID
          </span>
          <span className="text-slate-400">SEC-BNS 309(4)</span>
        </div>
        <div className="text-[9px] text-slate-400 leading-tight">
          Pimpri Chinchwad Police Commissionerate • Law Enforcement Sensitive
        </div>
      </div>
    </aside>
  );
}

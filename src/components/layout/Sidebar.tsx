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
  Database,
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const navItems: NavItem[] = [
  { name: 'Overview', href: '/', icon: LayoutDashboard },
  { name: 'Cases', href: '/cases', icon: Briefcase },
  { name: 'Evidence Vault', href: '/evidence', icon: FileText },
  { name: 'Timeline Analysis', href: '/timeline', icon: Clock },
  { name: 'Relationship Graph', href: '/graph', icon: Network },
  { name: 'Contradiction Analysis', href: '/contradictions', icon: AlertTriangle, badge: 'Active' },
  { name: 'Investigation Gaps', href: '/gaps', icon: Search },
  { name: 'AI Assistant', href: '/assistant', icon: Sparkles },
  { name: 'Reports & Export', href: '/reports', icon: FileBarChart },
  { name: 'Settings & Audit', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-brand-darkSidebar text-white flex flex-col flex-shrink-0 h-screen sticky top-0 border-r border-[#13323E] select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-[#1E4B5E]">
        <div className="flex items-center gap-2.5">
          {/* Geometric Eye Emblem Logo */}
          <div className="w-9 h-9 rounded bg-brand-mutedBlueTeal/20 border border-brand-mutedBlueTeal/40 flex items-center justify-center text-brand-softBlue">
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Outer almond eye contour */}
              <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
              {/* Concentric analysis aperture */}
              <circle cx="12" cy="12" r="3.2" strokeWidth="2.2" />
              <line x1="12" y1="2" x2="12" y2="4.5" />
              <line x1="12" y1="19.5" x2="12" y2="22" />
            </svg>
          </div>
          <div>
            <h1 className="font-semibold text-sm tracking-wide text-white uppercase font-sans">
              The Third Eye
            </h1>
            <p className="text-[10px] text-brand-softBlue font-medium tracking-tight">
              Investigation Intelligence
            </p>
          </div>
        </div>

        <div className="mt-2.5 text-[10px] text-[#8CB1C0] leading-snug font-sans">
          “Turning scattered evidence into actionable intelligence.”
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5 text-xs font-medium">
        <div className="px-2 pb-1 text-[10px] font-semibold tracking-wider text-[#7A9EAF] uppercase">
          Workspace Modules
        </div>

        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-2.5 py-2 rounded transition-colors ${
                isActive
                  ? 'bg-brand-deepTeal text-white shadow-sm font-semibold'
                  : 'text-[#C3D7E0] hover:bg-brand-darkSidebarHover hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-brand-softBlue' : 'text-[#8AA8B6]'
                  }`}
                />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-brand-mutedBlueTeal/30 text-brand-softBlue border border-brand-mutedBlueTeal/40 font-mono">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* System Status & Philosophy Footer */}
      <div className="p-3 border-t border-[#1E4B5E] bg-[#122F3B] text-[11px] space-y-2">
        <div className="flex items-center justify-between text-[#8CB1C0]">
          <div className="flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-brand-softBlue" />
            <span className="text-[10px] font-medium">Philosophy</span>
          </div>
          <span className="text-[9px] text-[#6E93A3] font-mono">v1.4.0</span>
        </div>
        <p className="text-[10px] text-[#A6C5D4] italic leading-tight">
          AI recommends. Humans investigate. Humans decide.
        </p>

        <div className="pt-1 border-t border-[#1A3E4D] flex items-center justify-between text-[10px] text-[#7E9FA0]">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse"></span>
            Storage: Persistent File DB
          </span>
          <span className="text-[9px] text-brand-softBlue bg-[#184455] px-1.5 py-0.5 rounded">
            Audit Active
          </span>
        </div>
      </div>
    </aside>
  );
}

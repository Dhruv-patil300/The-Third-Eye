'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
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
    title: 'nav.command',
    items: [
      { name: 'nav.dashboard', href: '/', icon: LayoutDashboard },
      { name: 'nav.cases', href: '/cases', icon: Briefcase },
    ],
  },
  {
    title: 'nav.forensic',
    items: [
      { name: 'nav.evidence', href: '/evidence', icon: FileText },
      { name: 'nav.timeline', href: '/timeline', icon: Clock },
      { name: 'nav.graph', href: '/graph', icon: Network },
      {
        name: 'nav.contradictions',
        href: '/contradictions',
        icon: AlertTriangle,
        badge: '4 CLASH',
        badgeColor: 'bg-stone-100 text-stone-700 border-stone-200',
      },
      { name: 'nav.gaps', href: '/gaps', icon: Search },
    ],
  },
  {
    title: 'nav.intelligence',
    items: [
      { name: 'nav.assistant', href: '/assistant', icon: Sparkles },
      { name: 'nav.reports', href: '/reports', icon: FileBarChart },
      { name: 'nav.settings', href: '/settings', icon: Settings },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <aside className="w-64 bg-[#eaf0f6]/95 backdrop-blur-md text-[#172b38] flex flex-col flex-shrink-0 h-screen sticky top-0 border-r border-[#c8d8e6] select-none shadow-[4px_0_24px_rgba(15,35,55,0.06)] z-20">
      <div className="p-4 border-b border-[#c8d8e6] bg-[#f1f6fa]/90">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-white border border-[#c8d8e6] shadow-md flex items-center justify-center relative flex-shrink-0 p-0.5 overflow-hidden">
            <img
              src="/logo.png"
              alt="The Third Eye Logo"
              className="w-full h-full object-cover rounded-lg"
            />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#22c55e] rounded-full border-2 border-white shadow-xs" />
          </div>

          <div>
            <div className="text-[10px] font-mono font-bold tracking-wider text-[#0284c7] uppercase leading-none">
              पिंपरी चिंचवड पोलीस
            </div>
            <h1 className="font-extrabold text-sm tracking-tight text-[#0f2333] uppercase mt-0.5">
              THE THIRD EYE
            </h1>
            <p className="text-[9px] text-[#526f84] font-mono tracking-tight leading-none mt-0.5">
              INVESTIGATION INTELLIGENCE
            </p>
          </div>
        </div>

        <div className="mt-3 px-2.5 py-1.5 rounded-lg bg-[#ffffff] border border-[#c8d8e6] shadow-xs flex items-center justify-between text-[10px] font-mono">
          <span className="text-[#3b5569] flex items-center gap-1.5 font-medium">
            <Crosshair className="w-3 h-3 text-[#0284c7]" />
            {t('sidebar.unit')}
          </span>
          <span className="text-[#0369a1] bg-[#e0f2fe] px-1.5 py-0.5 rounded font-semibold">{t('sidebar.active')}</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-4 text-xs font-medium">
        {navSections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            <div className="px-2 pb-1 text-[9px] font-mono font-bold tracking-widest text-[#668399] uppercase">
              {t(section.title)}
            </div>

            {section.items.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-150 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#0284c7] to-[#0369a1] text-white font-semibold shadow-sm'
                      : 'text-[#334e63] hover:bg-[#d8e6f2] hover:text-[#0b1e2e]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-[#506d82]'}`} />
                    <span className="truncate">{t(item.name)}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : item.badgeColor || 'bg-[#fed7aa] text-[#9a3412]'
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

      <div className="p-3 border-t border-[#c8d8e6] bg-[#f1f6fa]/90 text-[10px] font-mono space-y-1">
        <div className="flex items-center justify-between text-[#334e63]">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-[#16a34a] animate-pulse" />
            {t('sidebar.grid')}
          </span>
          <span className="text-[#0369a1] font-semibold">SEC-BNS 309(4)</span>
        </div>
        <div className="text-[9px] text-[#648096] leading-tight">
          {t('sidebar.notice')}
        </div>
      </div>
    </aside>
  );
}

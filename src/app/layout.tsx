import type { Metadata } from 'next';
import './globals.css';
import { CaseProvider } from '@/context/CaseContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { NewCaseModal } from '@/components/modals/NewCaseModal';
import { NewEvidenceModal } from '@/components/modals/NewEvidenceModal';

export const metadata: Metadata = {
  title: 'The Third Eye — Pimpri Chinchwad Police Investigation Intelligence',
  description:
    'Forensic Cross-Examination & Crime Intelligence System for Pimpri Chinchwad Police Commissionerate. AI Recommends. Police Investigate. Law Decides.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased text-[#1d2430]">
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover grayscale-0 contrast-[1.12] brightness-[1.0] opacity-50"
            style={{ filter: 'saturate(1.25)' }}
          >
            <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260815_034306_165449ef-7d2e-4e81-850f-1939c5cb442d.mp4" type="video/mp4" />
          </video>
          {/* Subtle gradient vignette to blend with light theme without washing out into flat white */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0c2340]/15 via-transparent to-[#102d44]/20 mix-blend-multiply" />
        </div>

        <LanguageProvider>
          <CaseProvider>
            <div className="site-shell relative z-10 flex min-h-screen">
              <Sidebar />
              <div className="flex-1 flex flex-col min-w-0">
                <Header />
                <main className="flex-1 p-6 overflow-y-auto bg-transparent">{children}</main>
              </div>
            </div>
            <NewCaseModal />
            <NewEvidenceModal />
          </CaseProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

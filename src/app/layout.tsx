import type { Metadata } from 'next';
import './globals.css';
import { CaseProvider } from '@/context/CaseContext';
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
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#070E17] text-slate-100 antialiased selection:bg-sky-500 selection:text-white">
        <CaseProvider>
          <div className="flex min-h-screen bg-[#070E17]">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
              <Header />
              <main className="flex-1 p-6 overflow-y-auto bg-[#070E17]">{children}</main>
            </div>
          </div>
          <NewCaseModal />
          <NewEvidenceModal />
        </CaseProvider>
      </body>
    </html>
  );
}

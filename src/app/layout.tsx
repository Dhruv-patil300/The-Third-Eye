import type { Metadata } from 'next';
import './globals.css';
import { CaseProvider } from '@/context/CaseContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { NewCaseModal } from '@/components/modals/NewCaseModal';
import { NewEvidenceModal } from '@/components/modals/NewEvidenceModal';

export const metadata: Metadata = {
  title: 'The Third Eye — AI-Powered Investigation Intelligence System',
  description:
    'Turning scattered evidence into actionable intelligence. AI recommends. Humans investigate. Humans decide.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-bg-main text-text-primary antialiased">
        <CaseProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
              <Header />
              <main className="flex-1 p-6 overflow-y-auto">{children}</main>
            </div>
          </div>
          <NewCaseModal />
          <NewEvidenceModal />
        </CaseProvider>
      </body>
    </html>
  );
}

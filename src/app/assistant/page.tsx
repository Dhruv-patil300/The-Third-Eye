'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useCase } from '@/context/CaseContext';
import { useLanguage } from '@/context/LanguageContext';
import { AIMessage, Citation } from '@/types';
import { DEMO_CASE_ID } from '@/lib/demoData';
import {
  Sparkles,
  Send,
  Loader2,
  FileText,
  ShieldAlert,
  Bot,
  User,
  ArrowRight,
  X,
} from 'lucide-react';

function renderInlineContent(text: string): React.ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index} className="font-semibold text-[#302f2a]">{part.slice(2, -2).replace(/#/g, '')}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={index}>{part.slice(1, -1).replace(/#/g, '')}</em>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={index} className="rounded bg-[#f0ece4] px-1 py-0.5 font-mono text-[0.95em]">{part.slice(1, -1).replace(/#/g, '')}</code>;
    }
    return part.replace(/#/g, '');
  });
}

function renderAssistantContent(content: string) {
  return content.split('\n').map((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) return <div key={index} className="h-1" />;

    const heading = trimmed.match(/^#{1,6}\s+(.+)$/);
    if (heading) {
      return <h3 key={index} className="pt-2 text-sm font-semibold text-[#302f2a]">{renderInlineContent(heading[1])}</h3>;
    }

    const listItem = trimmed.match(/^(?:[-*]\s+|(\d+)\.\s+)(.+)$/);
    if (listItem) {
      return (
        <div key={index} className="flex gap-2 pl-1">
          <span className="mt-0.5 shrink-0 font-mono text-[#68745f]">{listItem[1] || '•'}</span>
          <span>{renderInlineContent(listItem[2])}</span>
        </div>
      );
    }

    return <p key={index}>{renderInlineContent(trimmed)}</p>;
  });
}

export default function AssistantPage() {
  const { activeCaseId, activeCase } = useCase();
  const { t, locale } = useLanguage();

  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedCitation, setSelectedCitation] = useState<Citation | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    if (!activeCaseId) return;
    try {
      const res = await fetch(`/api/cases/${activeCaseId}/assistant`);
      const json = await res.json();
      if (json.success) {
        setMessages(json.data || []);
      }
    } catch (err) {
      console.error('Failed to load messages:', err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [activeCaseId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (!selectedCitation) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedCitation(null);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [selectedCitation]);

  const handleSend = async (queryToSend?: string) => {
    const text = queryToSend || inputQuery;
    if (!text.trim() || loading) return;

    setInputQuery('');
    // Optimistic user message
    const tempUserMsg: AIMessage = {
      id: `temp-${Date.now()}`,
      caseId: activeCaseId,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);
    setLoading(true);

    try {
      const res = await fetch(`/api/cases/${activeCaseId}/assistant`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: text, locale }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setMessages((prev) => [...prev.filter((m) => m.id !== tempUserMsg.id), tempUserMsg, json.data]);
      }
    } catch (err) {
      console.error('Failed to query assistant:', err);
    } finally {
      setLoading(false);
    }
  };

  const promptKeys = activeCaseId === DEMO_CASE_ID
    ? ['assistant.prompt.alibi', 'assistant.prompt.link', 'assistant.prompt.vehicle', 'assistant.prompt.access']
    : ['assistant.prompt.summary', 'assistant.prompt.evidence', 'assistant.prompt.missing', 'assistant.prompt.verify'];
  const defaultSuggestions = promptKeys.map(t);

  return (
    <div className="relative mx-auto flex h-[calc(100vh-6.5rem)] max-w-5xl flex-col gap-4 overflow-hidden text-[#1d2430]">
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[2rem] opacity-80">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover grayscale-[0.15] contrast-[1.08] brightness-[1.08] opacity-30"
          style={{ filter: 'saturate(0.35) blur(0.5px)' }}
        >
          <source src="/Person.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="relative z-10 flex flex-shrink-0 flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <span className="rounded-full border border-[#d9d1c8] bg-white/85 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[#475669] shadow-sm">
              {t('assistant.title')}
            </span>
            <span className="font-mono text-[10px] text-[#667085]">PCMC CASE REVIEW // RECORD-GROUNDED</span>
          </div>
          <h1 className="flex items-center gap-2 text-xl font-bold tracking-tight text-[#1d2430]">
            <Sparkles className="h-5 w-5 text-[#4b5867]" />
            <span>{t('assistant.title')}</span>
          </h1>
          <p className="mt-0.5 text-xs font-sans text-[#586370]">
            {t('assistant.description')}{' '}
            <span className="font-semibold font-mono text-[#1d2430]">{activeCase?.referenceNumber}</span>.
            {activeCase?.tags.includes('Illustrative Demo') && ' Fictional presentation data only; linked records are simulated and unverified.'}
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-[#d9d1c8] bg-white/85 px-3 py-1.5 text-[11px] shadow-sm">
          <ShieldAlert className="h-3.5 w-3.5 text-[#475669]" />
          <span className="font-medium italic text-[#475669] font-sans">
            AI recommends. Police investigate. Law decides.
          </span>
        </div>
      </div>

      <div className="relative z-10 flex-1 overflow-y-auto rounded-2xl border border-[#e6dfd5] bg-white/75 p-4 shadow-[0_18px_35px_rgba(31,41,55,0.05)] backdrop-blur-sm space-y-5 text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex max-w-3xl gap-3 ${
              msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
            }`}
          >
            <div
              className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-white shadow-md ${
                msg.role === 'user' ? 'bg-[#1f2937]' : 'border border-[#d9d1c8] bg-white text-[#475669]'
              }`}
            >
              {msg.role === 'user' ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
            </div>

            <div
              className={`space-y-3 rounded-2xl p-4 ${
                msg.role === 'user'
                  ? 'bg-[#1f2937] text-white shadow-lg'
                  : 'border border-[#e6dfd5] bg-white/85 text-[#1d2430] shadow-md'
              }`}
            >
              <div className="whitespace-pre-wrap text-xs font-sans leading-relaxed">
                {renderAssistantContent(msg.content)}
              </div>

              {msg.citations && msg.citations.length > 0 && (
                <div className="space-y-1.5 border-t border-[#e6dfd5] pt-3">
                  <div className="flex items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-wider text-[#475669]">
                    <FileText className="h-3 w-3" />
                    <span>{t('assistant.citationsTitle')}</span>
                  </div>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {msg.citations.map((cite, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedCitation(cite)}
                        className="w-full cursor-pointer rounded-xl border border-[#d9d1c8] bg-[#faf8f5] p-2.5 text-left shadow-sm transition hover:border-[#9aa6b2]"
                      >
                        <div className="truncate font-mono text-[11px] font-bold text-[#475669]">
                          {cite.evidenceTitle}
                        </div>
                        <div className="mt-0.5 line-clamp-2 text-[10px] italic text-[#586370] font-sans">
                          "{cite.excerpt.replace(/[#*`]/g, '')}"
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                <div className="flex flex-wrap gap-1.5 border-t border-[#e6dfd5] pt-2">
                  {msg.suggestedFollowUps.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(prompt)}
                      className="flex items-center gap-1 rounded-lg border border-[#d9d1c8] bg-white px-2.5 py-1 text-[10px] font-mono text-[#475669] transition hover:border-[#9aa6b2] hover:text-[#1d2430]"
                    >
                      <span>{prompt}</span>
                      <ArrowRight className="h-2.5 w-2.5" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="mr-auto flex max-w-xl items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#d9d1c8] bg-white text-[#475669]">
              <Bot className="h-3.5 w-3.5 animate-pulse" />
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-[#d9d1c8] bg-white/85 p-3 font-mono text-xs text-[#475669]">
              <Loader2 className="h-4 w-4 animate-spin text-[#475669]" />
              <span>{t('assistant.analyzing')}</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {messages.length <= 1 && (
        <div className="relative z-10 flex flex-wrap gap-2 text-xs">
          {defaultSuggestions.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(s)}
              className="flex items-center gap-1.5 rounded-lg border border-[#d9d1c8] bg-white/85 px-3 py-1.5 font-mono text-[11px] text-[#475669] transition hover:border-[#9aa6b2] hover:text-[#1d2430]"
            >
              <span>{s}</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          ))}
        </div>
      )}

      <div className="relative z-10 flex flex-shrink-0 items-center gap-2 rounded-2xl border border-[#e6dfd5] bg-[#0f1723]/80 p-2 shadow-2xl backdrop-blur-sm">
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
          placeholder={t('assistant.placeholder')}
          className="flex-1 bg-transparent px-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none font-sans"
        />
        <button
          onClick={() => handleSend()}
          disabled={!inputQuery.trim() || loading}
          className="flex items-center justify-center rounded-lg bg-[#1f2937] p-2 text-white transition hover:bg-[#283548] disabled:opacity-40"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>

      {selectedCitation && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#302f2a]/35 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedCitation(null);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="citation-title"
            className="w-full max-w-lg rounded-2xl border border-[#d9d1c8] bg-[#fffdf8] p-5 text-[#302f2a] shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4 border-b border-[#e6dfd5] pb-3">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-[#777267]">Source citation</div>
                <h2 id="citation-title" className="mt-1 text-base font-semibold">{selectedCitation.evidenceTitle}</h2>
              </div>
              <button
                type="button"
                aria-label="Close citation details"
                onClick={() => setSelectedCitation(null)}
                className="rounded-lg p-1.5 text-[#625f56] transition hover:bg-[#f0ece4]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <blockquote className="mt-4 whitespace-pre-wrap rounded-xl border border-[#e6dfd5] bg-[#faf8f5] p-4 text-sm leading-6 text-[#514d44]">
              {selectedCitation.excerpt.replace(/[#*`]/g, '')}
            </blockquote>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-[11px] text-[#777267]">
              <span>{t('assistant.record')}: <span className="font-mono text-[#475669]">{selectedCitation.evidenceId}</span></span>
              {selectedCitation.pageOrSection && <span>{selectedCitation.pageOrSection}</span>}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useCase } from '@/context/CaseContext';
import { AIMessage, Citation, EvidenceItem } from '@/types';
import {
  Sparkles,
  Send,
  Loader2,
  FileText,
  AlertTriangle,
  HelpCircle,
  ExternalLink,
  ShieldAlert,
  RotateCcw,
  Bot,
  User,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

export default function AssistantPage() {
  const { activeCaseId, activeCase } = useCase();

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
        body: JSON.stringify({ query: text }),
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

  const defaultSuggestions = [
    'What evidence directly contradicts Rahul Sharma’s alibi?',
    'Who had authorized access to Keypad PIN 4819?',
    'What vehicles are connected to this case and why?',
    'What are the most critical investigative gaps remaining?',
  ];

  return (
    <div className="space-y-4 max-w-5xl mx-auto h-[calc(100vh-6.5rem)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-shrink-0">
        <div>
          <h1 className="text-xl font-bold text-text-primary tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-steelBlue" />
            <span>AI Investigation Assistant</span>
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Strictly grounded in ingested evidence, event timelines, and witness depositions for Case{' '}
            <span className="font-semibold text-text-primary font-mono">{activeCase?.referenceNumber}</span>.
          </p>
        </div>

        {/* Operating Doctrine Badge */}
        <div className="text-[11px] bg-bg-highlight/40 border border-brand-mutedBlueTeal/30 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-brand-steelBlue" />
          <span className="italic text-text-primary font-medium">
            AI recommends. Humans investigate. Humans decide.
          </span>
        </div>
      </div>

      {/* Chat Messages Workspace */}
      <div className="flex-1 bg-white border border-border-light rounded-lg shadow-card p-4 overflow-y-auto space-y-5 text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-3xl ${
              msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-white ${
                msg.role === 'user' ? 'bg-brand-steelBlue' : 'bg-brand-deepTeal'
              }`}
            >
              {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>

            {/* Bubble */}
            <div
              className={`p-4 rounded-lg space-y-3 ${
                msg.role === 'user'
                  ? 'bg-brand-deepTeal text-white shadow-subtle'
                  : 'bg-bg-main/60 border border-border-subtle text-text-primary shadow-subtle'
              }`}
            >
              <div className="whitespace-pre-wrap leading-relaxed text-xs font-sans">
                {msg.content}
              </div>

              {/* Verified Source Citations */}
              {msg.citations && msg.citations.length > 0 && (
                <div className="pt-3 border-t border-border-subtle/80 space-y-1.5">
                  <div className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider flex items-center gap-1">
                    <FileText className="w-3 h-3 text-brand-steelBlue" />
                    <span>Verified Source Citations</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {msg.citations.map((cite, idx) => (
                      <div
                        key={idx}
                        onClick={() => setSelectedCitation(cite)}
                        className="bg-white p-2 rounded border border-border-light hover:border-brand-steelBlue cursor-pointer transition-colors shadow-subtle"
                      >
                        <div className="font-semibold text-[11px] text-brand-steelBlue truncate">
                          {cite.evidenceTitle}
                        </div>
                        <div className="text-[10px] text-text-secondary italic line-clamp-2 mt-0.5">
                          "{cite.excerpt}"
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggested Follow-Ups */}
              {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                <div className="pt-2 border-t border-border-subtle/60 flex flex-wrap gap-1.5">
                  {msg.suggestedFollowUps.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(prompt)}
                      className="text-[10px] px-2 py-1 bg-white hover:bg-bg-highlight border border-border-light text-brand-deepTeal rounded font-medium transition-colors flex items-center gap-1"
                    >
                      <span>{prompt}</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </button>
                  ))}
                </div>
              )}

              <div className="text-[9px] text-text-muted text-right font-mono">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 max-w-lg mr-auto">
            <div className="w-7 h-7 rounded-full bg-brand-deepTeal flex items-center justify-center text-white flex-shrink-0">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="p-3.5 bg-bg-main/60 border border-border-subtle rounded-lg flex items-center gap-2 text-xs text-text-secondary">
              <Loader2 className="w-4 h-4 animate-spin text-brand-steelBlue" />
              <span>Cross-referencing evidence vault and factual claims...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Queries Ribbon */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-[11px]">
        <span className="font-semibold text-text-secondary whitespace-nowrap">Suggested Inquiries:</span>
        {defaultSuggestions.map((sug, i) => (
          <button
            key={i}
            onClick={() => handleSend(sug)}
            className="px-2.5 py-1 bg-white border border-border-light hover:border-brand-steelBlue rounded text-text-secondary hover:text-brand-deepTeal whitespace-nowrap font-medium transition-colors"
          >
            {sug}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
        <input
          type="text"
          placeholder="Ask analytical questions about this case's evidence, timeline, or suspect alibis..."
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          disabled={loading}
          className="flex-1 px-3.5 py-2.5 text-xs bg-white border border-border-light rounded-lg focus:outline-none focus:border-brand-steelBlue shadow-subtle text-text-primary"
        />
        <button
          type="submit"
          disabled={loading || !inputQuery.trim()}
          className="px-5 py-2.5 bg-brand-deepTeal hover:bg-brand-darkSteelTeal text-white font-medium text-xs rounded-lg shadow-subtle flex items-center gap-1.5 disabled:opacity-50 transition-colors"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Ask Assistant</span>
        </button>
      </form>

      {/* Citation Detail Modal */}
      {selectedCitation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 select-none">
          <div className="bg-white rounded-lg border border-border-light shadow-modal w-full max-w-lg overflow-hidden text-xs">
            <div className="p-4 bg-bg-main border-b border-border-light flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-steelBlue" />
                <h3 className="font-semibold text-text-primary">Grounded Evidence Verification</h3>
              </div>
              <button
                onClick={() => setSelectedCitation(null)}
                className="text-text-muted hover:text-text-primary p-1"
              >
                ✕
              </button>
            </div>
            <div className="p-5 space-y-3">
              <div>
                <span className="font-semibold text-text-secondary text-[11px] block">Evidence Title:</span>
                <span className="font-bold text-text-primary text-sm">{selectedCitation.evidenceTitle}</span>
              </div>
              <div>
                <span className="font-semibold text-text-secondary text-[11px] block">Verified Excerpt:</span>
                <div className="bg-bg-main p-3 rounded border border-border-subtle font-mono text-[11px] text-text-primary whitespace-pre-wrap leading-relaxed mt-1">
                  "{selectedCitation.excerpt}"
                </div>
              </div>
              <div className="pt-2 flex justify-between items-center border-t border-border-subtle">
                <Link
                  href="/evidence"
                  onClick={() => setSelectedCitation(null)}
                  className="text-brand-steelBlue hover:underline flex items-center gap-1 font-medium"
                >
                  <span>Open Full Record in Evidence Vault</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
                <button
                  onClick={() => setSelectedCitation(null)}
                  className="px-3 py-1 bg-brand-deepTeal text-white rounded font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

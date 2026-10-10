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
  Crosshair,
  Radio,
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
    'Show evidence directly disproving Sachin Gaikwad’s alibi.',
    'What connects ex-guard Nilesh Shinde to the crime scene?',
    'Track movement of Hyundai Creta MH-14-GX-8842 from Wakad to Somatane.',
    'Who had authorized access to Door 2B Keypad PIN 7291?',
  ];

  return (
    <div className="space-y-4 max-w-5xl mx-auto h-[calc(100vh-6.5rem)] flex flex-col text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950/80 text-sky-300 font-bold border border-sky-800">
              POLICE INTELLIGENCE CO-PILOT
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              WAKAD PS // PCPC REASONING ENGINE
            </span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-sky-400" />
            <span>AI Forensic Investigation Assistant</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5 font-sans">
            Strictly grounded in certified case evidence, CDR mast logs, ANPR cameras, and FSL reports for{' '}
            <span className="font-semibold text-slate-200 font-mono">{activeCase?.referenceNumber}</span>.
          </p>
        </div>

        {/* Operating Doctrine Badge */}
        <div className="text-[11px] bg-[#0C1724] border border-[#1E2E3F] px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-md">
          <ShieldAlert className="w-3.5 h-3.5 text-sky-400" />
          <span className="italic text-slate-300 font-medium font-sans">
            AI recommends. Police investigate. Law decides.
          </span>
        </div>
      </div>

      {/* Chat Messages Workspace */}
      <div className="flex-1 bg-[#070E17] border border-[#1E2E3F] rounded-xl shadow-2xl p-4 overflow-y-auto space-y-5 text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-3xl ${
              msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-white shadow-md ${
                msg.role === 'user' ? 'bg-sky-600' : 'bg-sky-950 border border-sky-700/80 text-sky-300'
              }`}
            >
              {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>

            {/* Bubble */}
            <div
              className={`p-4 rounded-xl space-y-3 ${
                msg.role === 'user'
                  ? 'bg-sky-600 text-white shadow-lg'
                  : 'bg-[#0C1724] border border-[#1E2E3F] text-slate-100 shadow-xl'
              }`}
            >
              <div className="whitespace-pre-wrap leading-relaxed text-xs font-sans">
                {msg.content}
              </div>

              {/* Verified Source Citations */}
              {msg.citations && msg.citations.length > 0 && (
                <div className="pt-3 border-t border-[#1E2E3F] space-y-1.5">
                  <div className="text-[10px] font-mono font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1">
                    <FileText className="w-3 h-3 text-sky-400" />
                    <span>Certified Source Citations</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {msg.citations.map((cite, idx) => (
                      <div
                        key={idx}
                        onClick={() => setSelectedCitation(cite)}
                        className="bg-[#08121B] p-2.5 rounded-lg border border-[#1E2E3F] hover:border-sky-500 cursor-pointer transition-colors shadow-sm"
                      >
                        <div className="font-mono font-bold text-[11px] text-sky-300 truncate">
                          {cite.evidenceTitle}
                        </div>
                        <div className="text-[10px] text-slate-400 italic line-clamp-2 mt-0.5 font-sans">
                          "{cite.excerpt}"
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggested Follow-Ups */}
              {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                <div className="pt-2 border-t border-[#1E2E3F] flex flex-wrap gap-1.5">
                  {msg.suggestedFollowUps.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(prompt)}
                      className="text-[10px] px-2.5 py-1 bg-[#08121B] hover:bg-sky-950/80 border border-[#1E2E3F] hover:border-sky-500 text-sky-300 rounded-lg font-mono transition-colors flex items-center gap-1"
                    >
                      <span>{prompt}</span>
                      <ArrowRight className="w-2.5 h-2.5 text-sky-400" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 max-w-xl mr-auto items-center">
            <div className="w-7 h-7 rounded-lg bg-sky-950 border border-sky-700/80 flex items-center justify-center text-sky-400">
              <Bot className="w-3.5 h-3.5 animate-pulse" />
            </div>
            <div className="p-3 rounded-xl bg-[#0C1724] border border-[#1E2E3F] text-xs text-sky-400 flex items-center gap-2 font-mono">
              <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
              <span>Analyzing telecommunications and optical records...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Starting Prompts (If fresh) */}
      {messages.length <= 1 && (
        <div className="flex flex-wrap gap-2 text-xs">
          {defaultSuggestions.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(s)}
              className="text-[11px] px-3 py-1.5 rounded-lg bg-[#0C1724] hover:bg-sky-950/80 border border-[#1E2E3F] hover:border-sky-500 text-sky-300 font-mono transition-all flex items-center gap-1.5"
            >
              <span>{s}</span>
              <ArrowRight className="w-3 h-3 text-sky-400" />
            </button>
          ))}
        </div>
      )}

      {/* Query Input Box */}
      <div className="bg-[#0C1724] border border-[#1E2E3F] rounded-xl p-2 shadow-2xl flex items-center gap-2 flex-shrink-0">
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
          placeholder="Ask analytical question regarding suspect alibi, CDR mast, ANPR cameras, or FSL reports..."
          className="flex-1 bg-transparent px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none font-sans"
        />
        <button
          onClick={() => handleSend()}
          disabled={!inputQuery.trim() || loading}
          className="p-2 bg-sky-600 hover:bg-sky-500 disabled:opacity-40 text-white rounded-lg transition-all shadow-md flex items-center justify-center"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Case } from '@/types';
import { DEMO_CASE_ID } from '@/lib/demoData';

interface CaseContextType {
  cases: Case[];
  activeCaseId: string;
  activeCase: Case | null;
  loading: boolean;
  setActiveCaseId: (id: string) => void;
  refreshCases: () => Promise<void>;
  createCase: (data: Partial<Case>) => Promise<Case | null>;
  resetToDemo: () => Promise<void>;
  globalSearch: string;
  setGlobalSearch: (q: string) => void;
  showNewCaseModal: boolean;
  setShowNewCaseModal: (show: boolean) => void;
  showNewEvidenceModal: boolean;
  setShowNewEvidenceModal: (show: boolean) => void;
}

const CaseContext = createContext<CaseContextType | undefined>(undefined);

export function CaseProvider({ children }: { children: React.ReactNode }) {
  const [cases, setCases] = useState<Case[]>([]);
  const [activeCaseId, setActiveCaseIdState] = useState<string>(DEMO_CASE_ID);
  const [loading, setLoading] = useState<boolean>(true);
  const [globalSearch, setGlobalSearch] = useState<string>('');
  const [showNewCaseModal, setShowNewCaseModal] = useState<boolean>(false);
  const [showNewEvidenceModal, setShowNewEvidenceModal] = useState<boolean>(false);

  const fetchCases = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/cases');
      const json = await res.json();
      if (json.success && json.data) {
        setCases(json.data);
        if (json.data.length > 0) {
          // If activeCaseId doesn't exist in fetched cases, fallback to first
          const exists = json.data.some((c: Case) => c.id === activeCaseId);
          if (!exists) {
            setActiveCaseIdState(json.data[0].id);
          }
        }
      }
    } catch (err) {
      console.error('Failed to load cases:', err);
    } finally {
      setLoading(false);
    }
  }, [activeCaseId]);

  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  const setActiveCaseId = (id: string) => {
    setActiveCaseIdState(id);
    if (typeof window !== 'undefined') {
      localStorage.setItem('the_third_eye_active_case', id);
    }
  };

  const createCase = async (data: Partial<Case>): Promise<Case | null> => {
    try {
      const res = await fetch('/api/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success && json.data) {
        await fetchCases();
        setActiveCaseId(json.data.id);
        return json.data;
      }
      return null;
    } catch (err) {
      console.error('Create case failed:', err);
      return null;
    }
  };

  const resetToDemo = async () => {
    try {
      setLoading(true);
      await fetch('/api/reset', { method: 'POST' });
      await fetchCases();
      setActiveCaseIdState(DEMO_CASE_ID);
    } catch (err) {
      console.error('Reset failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const activeCase = cases.find((c) => c.id === activeCaseId) || cases[0] || null;

  return (
    <CaseContext.Provider
      value={{
        cases,
        activeCaseId,
        activeCase,
        loading,
        setActiveCaseId,
        refreshCases: fetchCases,
        createCase,
        resetToDemo,
        globalSearch,
        setGlobalSearch,
        showNewCaseModal,
        setShowNewCaseModal,
        showNewEvidenceModal,
        setShowNewEvidenceModal,
      }}
    >
      {children}
    </CaseContext.Provider>
  );
}

export function useCase() {
  const context = useContext(CaseContext);
  if (!context) {
    throw new Error('useCase must be used within a CaseProvider');
  }
  return context;
}

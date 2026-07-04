import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Debt, DebtPayment } from '../types';
import { initialDebts, debtIdCounter, debtPaymentIdCounter } from '../data';

interface DebtContextType {
  debts: Debt[];
  addDebt: (debt: Omit<Debt, 'id' | 'createdAt' | 'payments'>) => void;
  updateDebt: (id: string, updates: Partial<Debt>) => void;
  deleteDebt: (id: string) => void;
  makePayment: (debtId: string, amount: number) => void;
  getDebt: (id: string) => Debt | undefined;
}

const DebtContext = createContext<DebtContextType | null>(null);

const STORAGE_KEY = 'wgf-debts';
const STORAGE_VERSION_KEY = 'wgf-debts-version';
const CURRENT_VERSION = 2;
let idCounter = debtIdCounter;
let paymentIdCounter = debtPaymentIdCounter;

function loadDebts(): Debt[] {
  try {
    const version = parseInt(localStorage.getItem(STORAGE_VERSION_KEY) || '0', 10);
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw && version >= CURRENT_VERSION) {
      const parsed = JSON.parse(raw) as Debt[];
      if (parsed.length > 0) return parsed;
    }
    // Reset to new initial data if version mismatch or empty
    localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_VERSION.toString());
  } catch {}
  return initialDebts;
}

function saveDebts(debts: Debt[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(debts));
  } catch {}
}

export function DebtProvider({ children }: { children: ReactNode }) {
  const [debts, setDebts] = useState<Debt[]>(loadDebts);

  useEffect(() => { saveDebts(debts); }, [debts]);

  const addDebt = useCallback((data: Omit<Debt, 'id' | 'createdAt' | 'payments'>) => {
    setDebts(prev => {
      const newDebt: Debt = {
        ...data,
        id: `d-${idCounter++}`,
        createdAt: new Date().toISOString().split('T')[0],
        payments: [],
      };
      return [newDebt, ...prev];
    });
  }, []);

  const updateDebt = useCallback((id: string, updates: Partial<Debt>) => {
    setDebts(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
  }, []);

  const deleteDebt = useCallback((id: string) => {
    setDebts(prev => prev.filter(d => d.id !== id));
  }, []);

  const makePayment = useCallback((debtId: string, amount: number) => {
    setDebts(prev => prev.map(d => {
      if (d.id !== debtId) return d;
      const newBalance = Math.max(0, d.currentBalance - amount);
      const payment: DebtPayment = {
        id: `dp-${paymentIdCounter++}`,
        date: new Date().toISOString().split('T')[0],
        amount,
        remainingBalance: newBalance,
      };
      const newStatus = newBalance <= 0 ? 'paid' as const : d.status;
      return {
        ...d,
        currentBalance: newBalance,
        status: newStatus,
        payments: [payment, ...d.payments],
      };
    }));
  }, []);

  const getDebt = useCallback((id: string) => debts.find(d => d.id === id), [debts]);

  return (
    <DebtContext.Provider value={{ debts, addDebt, updateDebt, deleteDebt, makePayment, getDebt }}>
      {children}
    </DebtContext.Provider>
  );
}

export function useDebts() {
  const ctx = useContext(DebtContext);
  if (!ctx) throw new Error('useDebts must be used within a DebtProvider');
  return ctx;
}
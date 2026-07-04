import React from 'react';
import { Wallet, Calendar, DollarSign, AlertTriangle } from 'lucide-react';
import { useDebts } from '../lib/DebtContext';

export default function DebtsSummary({ onViewAll }: { onViewAll: () => void }) {
  const { debts } = useDebts();

  const activeDebts = debts.filter(d => d.status === 'active');
  const totalOutstanding = activeDebts.reduce((sum, d) => sum + d.currentBalance, 0);
  const totalMonthly = activeDebts.reduce((sum, d) => sum + d.minimumPayment, 0);
  const nextDue = activeDebts.length > 0
    ? activeDebts.sort((a, b) => a.dueDate.localeCompare(b.dueDate))[0]
    : null;

  return (
    <div className="p-[1px] rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.01] overflow-hidden">
      <div className="rounded-[calc(1.4rem-1px)] p-5 bg-[#0A1628] relative overflow-hidden group spring-transition">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 spring-transition" />
        <div className="flex justify-between items-start mb-3 relative z-10">
          <span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">Outstanding Debts</span>
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 float-icon">
            <Wallet className="w-4 h-4" />
          </div>
        </div>
        <p className="text-2xl font-mono font-bold text-white tracking-tight relative z-10 spring-transition group-hover:text-amber-400">
          ${totalOutstanding.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </p>
        <div className="grid grid-cols-3 gap-2 mt-3 relative z-10">
          <div className="text-[10px] text-gray-500 font-mono">
            <span className="text-[9px] text-gray-500 block uppercase tracking-wider font-semibold mb-0.5">Active</span>
            <span className="text-white font-bold">{activeDebts.length}</span>
          </div>
          <div className="text-[10px] text-gray-500 font-mono">
            <span className="text-[9px] text-gray-500 block uppercase tracking-wider font-semibold mb-0.5">Monthly</span>
            <span className="text-white font-bold">${totalMonthly.toLocaleString()}</span>
          </div>
          <div className="text-[10px] text-gray-500 font-mono">
            <span className="text-[9px] text-gray-500 block uppercase tracking-wider font-semibold mb-0.5">Next Due</span>
            <span className="text-amber-400 font-bold">{nextDue ? new Date(nextDue.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}</span>
          </div>
        </div>
        {nextDue && new Date(nextDue.dueDate) <= new Date(Date.now() + 7 * 86400000) && new Date(nextDue.dueDate) > new Date() && (
          <div className="mt-2 flex items-center gap-1 text-[9px] text-amber-400/80 font-semibold relative z-10">
            <Calendar className="w-3 h-3" /> Due soon
          </div>
        )}
        {nextDue && new Date(nextDue.dueDate) <= new Date() && (
          <div className="mt-2 flex items-center gap-1 text-[9px] text-red-400/80 font-semibold relative z-10">
            <AlertTriangle className="w-3 h-3" /> Overdue
          </div>
        )}
        <button
          onClick={onViewAll}
          className="mt-3 w-full py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 text-[10px] font-bold rounded-lg transition-all duration-300 relative z-10"
        >
          Manage Debts
        </button>
      </div>
    </div>
  );
}
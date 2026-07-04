import React, { useState, useMemo } from 'react';
import { Plus, Search, X, ChevronDown, ChevronUp, CreditCard, Landmark, Home, FileText, Calendar, DollarSign, TrendingDown, ArrowLeft, PieChart } from 'lucide-react';
import { useDebts } from '../lib/DebtContext';
import { Debt, DebtType, DebtStatus } from '../types';

const DEBT_TYPE_LABELS: Record<DebtType, string> = {
  'credit-card': 'Credit Card',
  'loan': 'Loan',
  'mortgage': 'Mortgage',
  'other': 'Other',
};

const DEBT_TYPE_ICONS: Record<DebtType, React.ReactNode> = {
  'credit-card': <CreditCard className="w-3.5 h-3.5" />,
  'loan': <Landmark className="w-3.5 h-3.5" />,
  'mortgage': <Home className="w-3.5 h-3.5" />,
  'other': <FileText className="w-3.5 h-3.5" />,
};

type SortField = 'creditorName' | 'currentBalance' | 'dueDate' | 'status' | 'debtType';
type SortDir = 'asc' | 'desc';

function getDueStatus(dueDate: string): 'overdue' | 'due-soon' | 'on-track' {
  const now = new Date();
  const due = new Date(dueDate);
  const diffDays = Math.ceil((due.getTime() - now.getTime()) / 86400000);
  if (diffDays < 0) return 'overdue';
  if (diffDays <= 7) return 'due-soon';
  return 'on-track';
}

function formatCurrency(n: number) { return n.toLocaleString('en-US', { minimumFractionDigits: 2 }); }

export default function DebtsPage() {
  const { debts, addDebt, updateDebt, makePayment } = useDebts();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<DebtType | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<DebtStatus | 'all'>('all');
  const [sortField, setSortField] = useState<SortField>('dueDate');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [selectedDebtId, setSelectedDebtId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingDebt, setEditingDebt] = useState<Debt | null>(null);
  const [showPayModal, setShowPayModal] = useState<string | null>(null);
  const [payAmount, setPayAmount] = useState('');

  const sorted = useMemo(() => {
    let filtered = debts.filter(d => {
      if (filterType !== 'all' && d.debtType !== filterType) return false;
      if (filterStatus !== 'all' && d.status !== filterStatus) return false;
      if (search && !d.creditorName.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
    filtered.sort((a, b) => {
      let cmp = 0;
      if (sortField === 'creditorName') cmp = a.creditorName.localeCompare(b.creditorName);
      else if (sortField === 'currentBalance') cmp = a.currentBalance - b.currentBalance;
      else if (sortField === 'dueDate') cmp = a.dueDate.localeCompare(b.dueDate);
      else if (sortField === 'status') cmp = a.status.localeCompare(b.status);
      else if (sortField === 'debtType') cmp = a.debtType.localeCompare(b.debtType);
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return filtered;
  }, [debts, search, filterType, filterStatus, sortField, sortDir]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronDown className="w-3 h-3 opacity-30" />;
    return sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />;
  };

  const selectedDebt = selectedDebtId ? debts.find(d => d.id === selectedDebtId) : null;

  const totalDebt = useMemo(() => debts.reduce((sum, d) => sum + d.currentBalance, 0), [debts]);
  const totalMinimum = useMemo(() => debts.reduce((sum, d) => sum + d.minimumPayment, 0), [debts]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-[1px] rounded-2xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] overflow-hidden">
        <div className="rounded-[calc(1.4rem-1px)] p-6 bg-[#0A1628]">
          {selectedDebt ? (
            <div className="flex items-center gap-3 mb-4">
              <button onClick={() => setSelectedDebtId(null)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition">
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <h3 className="text-base font-bold text-white uppercase tracking-wider">{selectedDebt.creditorName}</h3>
                <p className="text-xs text-gray-400">Debt detail & payment history</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
              <div>
                <h3 className="text-base font-bold text-white uppercase tracking-wider">Debt Management</h3>
                <p className="text-xs text-gray-400">Track, manage, and pay down your debts.</p>
              </div>
              <button onClick={() => { setEditingDebt(null); setShowForm(true); }} className="flex items-center gap-1.5 px-4 py-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold rounded-xl hover:bg-amber-500/20 transition">
                <Plus className="w-3.5 h-3.5" /> Add Debt
              </button>
            </div>
          )}

          {!selectedDebt && (
            <div className="grid grid-cols-3 gap-3">
              <div className="p-[1px] rounded-xl bg-gradient-to-br from-amber-500/30 via-amber-600/10 to-transparent overflow-hidden">
                <div className="rounded-[calc(0.75rem-1px)] p-4 bg-gradient-to-br from-[#0A1628] to-[#1a1508] h-full flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20"><DollarSign className="w-3.5 h-3.5 text-amber-400" /></div>
                    <span className="text-[10px] uppercase tracking-wider text-amber-400/60 font-semibold">Total Debt</span>
                  </div>
                  <div className="border-t border-amber-500/10 pt-3">
                    <p className="text-2xl font-bold text-amber-400 font-mono leading-none">${formatCurrency(totalDebt)}</p>
                  </div>
                  <div className="flex items-center justify-between border-t border-amber-500/10 pt-2 mt-auto">
                    <span className="text-[10px] text-gray-500">{debts.length} total accounts</span>
                    <span className="text-[10px] text-amber-400/50 font-mono">{formatCurrency(totalMinimum)}/mo</span>
                  </div>
                </div>
              </div>
              <div className="p-[1px] rounded-xl bg-gradient-to-br from-violet-500/30 via-violet-600/10 to-transparent overflow-hidden">
                <div className="rounded-[calc(0.75rem-1px)] p-4 bg-gradient-to-br from-[#0A1628] to-[#12081a] h-full flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-violet-500/10 border border-violet-500/20"><TrendingDown className="w-3.5 h-3.5 text-violet-400" /></div>
                    <span className="text-[10px] uppercase tracking-wider text-violet-400/60 font-semibold">Min. Payment</span>
                  </div>
                  <div className="border-t border-violet-500/10 pt-3">
                    <p className="text-2xl font-bold text-violet-400 font-mono leading-none">${formatCurrency(totalMinimum)}</p>
                  </div>
                  <div className="flex items-center justify-between border-t border-violet-500/10 pt-2 mt-auto">
                    <span className="text-[10px] text-gray-500">required monthly</span>
                    <span className="text-[10px] text-violet-400/50 font-mono">{((totalMinimum / totalDebt) * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
              <div className="p-[1px] rounded-xl bg-gradient-to-br from-emerald-500/30 via-emerald-600/10 to-transparent overflow-hidden">
                <div className="rounded-[calc(0.75rem-1px)] p-4 bg-gradient-to-br from-[#0A1628] to-[#081a10] h-full flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20"><PieChart className="w-3.5 h-3.5 text-emerald-400" /></div>
                    <span className="text-[10px] uppercase tracking-wider text-emerald-400/60 font-semibold">Active</span>
                  </div>
                  <div className="border-t border-emerald-500/10 pt-3">
                    <p className="text-2xl font-bold text-emerald-400 font-mono leading-none">{debts.filter(d => d.status === 'active').length}</p>
                  </div>
                  <div className="flex items-center justify-between border-t border-emerald-500/10 pt-2 mt-auto">
                    <span className="text-[10px] text-gray-500">{debts.filter(d => d.status === 'paid').length} paid off</span>
                    <span className="text-[10px] text-emerald-400/50 font-mono">{debts.filter(d => d.status === 'defaulted').length} defaulted</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedDebt ? (
        <DebtDetailView debt={selectedDebt} onBack={() => setSelectedDebtId(null)} onPay={() => setShowPayModal(selectedDebt.id)} onEdit={() => { setEditingDebt(selectedDebt); setShowForm(true); }} />
      ) : (
        <>
          {/* Filters */}
          <div className="p-[1px] rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.01] overflow-hidden">
            <div className="rounded-[calc(1.4rem-1px)] p-4 bg-[#0A1628]">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                  <input
                    type="text" value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Search by creditor..."
                    className="w-full py-2 pl-9 pr-3 bg-[#0A1628]/60 border border-white/[0.08] rounded-lg text-xs text-[#F0F0F0] outline-none focus:border-amber-500/40 transition placeholder:text-[#8B92A8]/30"
                  />
                  {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"><X className="w-3 h-3" /></button>}
                </div>
                <select value={filterType} onChange={e => setFilterType(e.target.value as DebtType | 'all')} className="py-2 px-3 bg-[#0A1628]/60 border border-white/[0.08] rounded-lg text-xs text-[#F0F0F0] outline-none focus:border-amber-500/40">
                  <option value="all">All Types</option>
                  <option value="credit-card">Credit Card</option>
                  <option value="loan">Loan</option>
                  <option value="mortgage">Mortgage</option>
                  <option value="other">Other</option>
                </select>
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as DebtStatus | 'all')} className="py-2 px-3 bg-[#0A1628]/60 border border-white/[0.08] rounded-lg text-xs text-[#F0F0F0] outline-none focus:border-amber-500/40">
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="paid">Paid</option>
                  <option value="defaulted">Defaulted</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="p-[1px] rounded-2xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] overflow-hidden">
            <div className="rounded-[calc(1.4rem-1px)] p-6 bg-[#0A1628]">
              {sorted.length === 0 ? (
                <div className="py-16 text-center">
                  <PieChart className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-sm text-gray-400 font-medium mb-1">No debts found</p>
                  <p className="text-xs text-gray-500">{search || filterType !== 'all' ? 'Try adjusting your filters.' : 'Click "Add Debt" to get started.'}</p>
                </div>
              ) : (
                <div className="overflow-x-auto no-scrollbar">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 text-[10px] uppercase tracking-wider text-gray-400">
                        <th className="py-2.5 pr-2 font-semibold cursor-pointer hover:text-white select-none" onClick={() => toggleSort('creditorName')}>
                          <span className="flex items-center gap-1">Creditor <SortIcon field="creditorName" /></span>
                        </th>
                        <th className="py-2.5 pr-2 font-semibold">Type</th>
                        <th className="py-2.5 pr-2 font-semibold cursor-pointer hover:text-white select-none text-right" onClick={() => toggleSort('currentBalance')}>
                          <span className="flex items-center justify-end gap-1">Balance <SortIcon field="currentBalance" /></span>
                        </th>
                        <th className="py-2.5 pr-2 font-semibold text-right">APR</th>
                        <th className="py-2.5 pr-2 font-semibold text-right">Min. Payment</th>
                        <th className="py-2.5 pr-2 font-semibold cursor-pointer hover:text-white select-none" onClick={() => toggleSort('dueDate')}>
                          <span className="flex items-center gap-1">Due Date <SortIcon field="dueDate" /></span>
                        </th>
                        <th className="py-2.5 pr-2 font-semibold cursor-pointer hover:text-white select-none" onClick={() => toggleSort('status')}>
                          <span className="flex items-center gap-1">Status <SortIcon field="status" /></span>
                        </th>
                        <th className="py-2.5 font-semibold text-right"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-xs">
                      {sorted.map(d => {
                        const dueStatus = getDueStatus(d.dueDate);
                        const paidPct = d.originalAmount > 0 ? ((d.originalAmount - d.currentBalance) / d.originalAmount) * 100 : 0;
                        return (
                          <tr key={d.id} className="spring-transition hover:bg-amber-500/[0.04] group/row cursor-pointer" onClick={() => setSelectedDebtId(d.id)}>
                            <td className="py-3.5 pr-2">
                              <p className="font-bold text-white group-hover/row:text-amber-400 spring-transition">{d.creditorName}</p>
                              <p className="text-[10px] text-gray-500 font-mono">ID: {d.id}</p>
                            </td>
                            <td className="py-3.5 pr-2">
                              <span className="flex items-center gap-1.5 text-gray-400">
                                {DEBT_TYPE_ICONS[d.debtType]} {DEBT_TYPE_LABELS[d.debtType]}
                              </span>
                            </td>
                            <td className="py-3.5 pr-2 text-right font-mono font-bold text-white">${formatCurrency(d.currentBalance)}</td>
                            <td className="py-3.5 pr-2 text-right font-mono text-gray-400">{d.interestRate}%</td>
                            <td className="py-3.5 pr-2 text-right font-mono text-gray-400">${formatCurrency(d.minimumPayment)}</td>
                            <td className="py-3.5 pr-2">
                              <span className={`inline-flex items-center gap-1 font-mono ${
                                dueStatus === 'overdue' ? 'text-red-400' : dueStatus === 'due-soon' ? 'text-amber-400' : 'text-gray-400'
                              }`}>
                                <Calendar className="w-3 h-3" />
                                {new Date(d.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </span>
                            </td>
                            <td className="py-3.5 pr-2">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider inline-flex items-center gap-1 ${
                                d.status === 'active' ? 'bg-amber-500/10 text-amber-400' :
                                d.status === 'paid' ? 'bg-emerald-500/10 text-emerald-400' :
                                'bg-red-500/10 text-red-400'
                              }`}>
                                <span className={`w-1 h-1 rounded-full ${
                                  d.status === 'active' ? 'bg-amber-400' : d.status === 'paid' ? 'bg-emerald-400' : 'bg-red-400'
                                }`} />
                                {d.status}
                              </span>
                            </td>
                            <td className="py-3.5 text-right"></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Add/Edit Modal */}
      {showForm && <DebtFormModal debt={editingDebt} onClose={() => { setShowForm(false); setEditingDebt(null); }} onSave={(data) => { if (editingDebt) { updateDebt(editingDebt.id, data); } else { addDebt(data as any); } setShowForm(false); setEditingDebt(null); }} />}

      {/* Make Payment Modal */}
      {showPayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm" onClick={() => { setShowPayModal(null); setPayAmount(''); }}>
          <div className="w-full max-w-sm p-[1px] rounded-2xl bg-gradient-to-b from-emerald-500/20 to-white/[0.03] overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="rounded-[calc(1.4rem-1px)] p-6 bg-[#0A1628]/95 backdrop-blur-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400"><DollarSign className="w-5 h-5" /></div>
                <div>
                  <h3 className="text-sm font-bold text-white">Make a Payment</h3>
                  <p className="text-xs text-gray-400">Current balance: ${formatCurrency(debts.find(d => d.id === showPayModal)?.currentBalance || 0)}</p>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1.5">Payment Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                  <input type="number" step="0.01" min="0" required value={payAmount} onChange={e => setPayAmount(e.target.value)} placeholder="0.00" className="w-full py-2.5 pl-8 pr-3 bg-[#0A1628]/60 border border-white/[0.08] rounded-lg text-sm text-[#F0F0F0] font-mono outline-none focus:border-emerald-500/40 transition placeholder:text-[#8B92A8]/30" />
                </div>
              </div>
              <div className="flex gap-2 mb-2">
                {[100, 250, 500, 1000].map(amt => (
                  <button key={amt} type="button" onClick={() => setPayAmount(String(amt))} className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg border transition ${payAmount === String(amt) ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}>${amt}</button>
                ))}
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={() => { setShowPayModal(null); setPayAmount(''); }} className="flex-1 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs text-white transition">Cancel</button>
                <button onClick={() => { const amt = parseFloat(payAmount); if (amt > 0) { makePayment(showPayModal, amt); setShowPayModal(null); setPayAmount(''); } }} className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-xl text-xs text-white font-bold transition">Pay ${payAmount ? formatCurrency(parseFloat(payAmount)) : '0'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────── Debt Detail View ─────────────── */
function DebtDetailView({ debt, onBack, onPay, onEdit }: { debt: Debt; onBack: () => void; onPay: () => void; onEdit: () => void }) {
  const paidPct = debt.originalAmount > 0 ? ((debt.originalAmount - debt.currentBalance) / debt.originalAmount) * 100 : 0;
  const dueStatus = getDueStatus(debt.dueDate);

  // Payoff projection: simple amortization estimate
  const monthlyRate = debt.interestRate / 100 / 12;
  let remaining = debt.currentBalance;
  let months = 0;
  const maxMonths = 600;
  const projectionData: { month: number; balance: number }[] = [];
  if (monthlyRate > 0 && debt.minimumPayment > 0 && remaining > 0) {
    while (remaining > 0 && months < maxMonths) {
      const interest = remaining * monthlyRate;
      const principal = Math.min(debt.minimumPayment - interest, remaining);
      if (principal <= 0) { months = maxMonths; break; }
      remaining -= principal;
      months++;
      if (months % 12 === 0 || months === 1 || remaining <= 0) {
        projectionData.push({ month: months, balance: Math.max(0, remaining) });
      }
    }
  }
  const payoffMonths = months >= maxMonths ? null : months;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Info card */}
      <div className="lg:col-span-5 space-y-6">
        <div className="p-[1px] rounded-2xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] overflow-hidden">
          <div className="rounded-[calc(1.4rem-1px)] p-5 bg-[#0A1628]">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <span className="text-amber-400">{DEBT_TYPE_ICONS[debt.debtType]}</span>
                <span className="text-xs text-gray-400 font-medium">{DEBT_TYPE_LABELS[debt.debtType]}</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider inline-flex items-center gap-1 ${
                debt.status === 'active' ? 'bg-amber-500/10 text-amber-400' :
                debt.status === 'paid' ? 'bg-emerald-500/10 text-emerald-400' :
                'bg-red-500/10 text-red-400'
              }`}>
                <span className={`w-1 h-1 rounded-full ${debt.status === 'active' ? 'bg-amber-400' : debt.status === 'paid' ? 'bg-emerald-400' : 'bg-red-400'}`} />
                {debt.status}
              </span>
            </div>
            <h4 className="text-lg font-bold text-white mb-1">{debt.creditorName}</h4>
            <p className="text-xs text-gray-400 mb-4">{debt.notes}</p>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-gray-400">Original Amount</span>
                <span className="text-white font-mono font-bold">${formatCurrency(debt.originalAmount)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-gray-400">Current Balance</span>
                <span className="text-white font-mono font-bold">${formatCurrency(debt.currentBalance)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-gray-400">Interest Rate (APR)</span>
                <span className="text-amber-400 font-mono font-bold">{debt.interestRate}%</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-gray-400">Min. Monthly Payment</span>
                <span className="text-white font-mono font-bold">${formatCurrency(debt.minimumPayment)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-gray-400">Due Date</span>
                <span className={`font-mono font-bold ${dueStatus === 'overdue' ? 'text-red-400' : dueStatus === 'due-soon' ? 'text-amber-400' : 'text-white'}`}>
                  {new Date(debt.dueDate).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-gray-400">Created</span>
                <span className="text-gray-400 font-mono">{new Date(debt.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={onPay} className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition">Make Payment</button>
              <button onClick={onEdit} className="flex-1 py-2.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 text-xs font-bold rounded-xl transition">Edit</button>
            </div>
          </div>
        </div>

        {/* Payoff Projection */}
        <div className="p-[1px] rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.01] overflow-hidden">
          <div className="rounded-[calc(1.4rem-1px)] p-5 bg-[#0A1628]">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Payoff Projection</h4>
            {payoffMonths ? (
              <div className="text-center p-4 bg-black/30 rounded-xl border border-white/5">
                <TrendingDown className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                <p className="text-lg font-bold text-emerald-400 font-mono">{payoffMonths} months</p>
                <p className="text-[10px] text-gray-400 mt-1">Estimated payoff at minimum payments</p>
                <p className="text-[10px] text-gray-500 mt-2">
                  Target date: {new Date(Date.now() + payoffMonths * 30 * 86400000).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                </p>
              </div>
            ) : (
              <div className="text-center p-4 bg-red-500/5 rounded-xl border border-red-500/10">
                <p className="text-xs text-red-400 font-medium">Minimum payment doesn't cover interest</p>
                <p className="text-[10px] text-gray-500 mt-1">Consider increasing your payment amount.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right column: Progress bar + Payment history + Amortization chart */}
      <div className="lg:col-span-7 space-y-6">
        {/* Payoff Progress */}
        <div className="p-[1px] rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.01] overflow-hidden">
          <div className="rounded-[calc(1.4rem-1px)] p-5 bg-[#0A1628]">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Payoff Progress</h4>
              <span className="text-xs font-mono font-bold text-amber-400">{paidPct.toFixed(1)}%</span>
            </div>
            <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500 ease-out" style={{ width: `${Math.min(paidPct, 100)}%`, background: paidPct >= 100 ? 'linear-gradient(90deg, #10b981, #34d399)' : 'linear-gradient(90deg, #C9A84C, #f59e0b)' }} />
            </div>
            <div className="flex justify-between text-[10px] text-gray-500 mt-1">
              <span>$0</span>
              <span>${formatCurrency(debt.originalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Payment History */}
        <div className="p-[1px] rounded-2xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] overflow-hidden">
          <div className="rounded-[calc(1.4rem-1px)] p-5 bg-[#0A1628]">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Payment History</h4>
            {debt.payments.length === 0 ? (
              <div className="py-8 text-center text-xs text-gray-500">No payments recorded yet.</div>
            ) : (
              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 text-[10px] uppercase tracking-wider text-gray-400">
                      <th className="py-2 font-semibold">Date</th>
                      <th className="py-2 font-semibold text-right">Amount Paid</th>
                      <th className="py-2 font-semibold text-right">Remaining Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-xs">
                    {debt.payments.map(p => (
                      <tr key={p.id} className="spring-transition hover:bg-amber-500/[0.04]">
                        <td className="py-2.5 text-gray-400 font-mono">{new Date(p.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                        <td className="py-2.5 text-right font-mono font-bold text-emerald-400">-${formatCurrency(p.amount)}</td>
                        <td className="py-2.5 text-right font-mono text-white">${formatCurrency(p.remainingBalance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Amortization Mini Chart */}
        {projectionData.length > 1 && (
          <div className="p-[1px] rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.01] overflow-hidden">
            <div className="rounded-[calc(1.4rem-1px)] p-5 bg-[#0A1628]">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Balance Over Time</h4>
              <div className="h-36">
                <svg viewBox={`0 0 ${projectionData.length - 1} 100`} className="w-full h-full" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="debtChartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <path
                    d={`M0,${100 - (projectionData[0].balance / debt.originalAmount) * 90} ${projectionData.map((p, i) => `L${i},${100 - (p.balance / debt.originalAmount) * 90}`).join(' ')}`}
                    fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  />
                  <path
                    d={`M0,${100 - (projectionData[0].balance / debt.originalAmount) * 90} ${projectionData.map((p, i) => `L${i},${100 - (p.balance / debt.originalAmount) * 90}`).join(' ')} L${projectionData.length - 1},100 L0,100 Z`}
                    fill="url(#debtChartGrad)"
                  />
                </svg>
              </div>
              <div className="flex justify-between text-[9px] text-gray-500 mt-1">
                <span>Now</span>
                <span>{payoffMonths ? `${payoffMonths}mo` : ''}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────── Add / Edit Form Modal ─────────────── */
function DebtFormModal({ debt, onClose, onSave }: { debt: Debt | null; onClose: () => void; onSave: (data: Partial<Debt>) => void }) {
  const [creditorName, setCreditorName] = useState(debt?.creditorName || '');
  const [debtType, setDebtType] = useState<DebtType>(debt?.debtType || 'credit-card');
  const [originalAmount, setOriginalAmount] = useState(String(debt?.originalAmount || ''));
  const [currentBalance, setCurrentBalance] = useState(String(debt?.currentBalance || ''));
  const [interestRate, setInterestRate] = useState(String(debt?.interestRate || ''));
  const [minimumPayment, setMinimumPayment] = useState(String(debt?.minimumPayment || ''));
  const [dueDate, setDueDate] = useState(debt?.dueDate || '');
  const [status, setStatus] = useState<DebtStatus>(debt?.status || 'active');
  const [notes, setNotes] = useState(debt?.notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!creditorName.trim() || !originalAmount || !currentBalance || !interestRate || !minimumPayment || !dueDate) return;
    onSave({
      creditorName: creditorName.trim(),
      debtType,
      originalAmount: parseFloat(originalAmount),
      currentBalance: parseFloat(currentBalance),
      interestRate: parseFloat(interestRate),
      minimumPayment: parseFloat(minimumPayment),
      dueDate,
      status,
      notes: notes.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto" onClick={onClose}>
      <div className="w-full max-w-lg my-8 p-[1px] rounded-2xl bg-gradient-to-b from-amber-500/20 to-white/[0.03] overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="rounded-[calc(1.4rem-1px)] p-6 bg-[#0A1628]/95 backdrop-blur-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">{debt ? 'Edit Debt' : 'Add New Debt'}</h3>
            <button onClick={onClose} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition"><X className="w-4 h-4" /></button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1">Creditor Name</label>
                <input type="text" required value={creditorName} onChange={e => setCreditorName(e.target.value)} placeholder="e.g. Chase, Wells Fargo" className="w-full py-2 px-3 bg-[#0A1628]/60 border border-white/[0.08] rounded-lg text-xs text-[#F0F0F0] outline-none focus:border-amber-500/40 transition placeholder:text-[#8B92A8]/30" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1">Debt Type</label>
                <select value={debtType} onChange={e => setDebtType(e.target.value as DebtType)} className="w-full py-2 px-3 bg-[#0A1628]/60 border border-white/[0.08] rounded-lg text-xs text-[#F0F0F0] outline-none focus:border-amber-500/40">
                  <option value="credit-card">Credit Card</option>
                  <option value="loan">Loan</option>
                  <option value="mortgage">Mortgage</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1">Status</label>
                <select value={status} onChange={e => setStatus(e.target.value as DebtStatus)} className="w-full py-2 px-3 bg-[#0A1628]/60 border border-white/[0.08] rounded-lg text-xs text-[#F0F0F0] outline-none focus:border-amber-500/40">
                  <option value="active">Active</option>
                  <option value="paid">Paid</option>
                  <option value="defaulted">Defaulted</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1">Original Amount ($)</label>
                <input type="number" step="0.01" min="0" required value={originalAmount} onChange={e => setOriginalAmount(e.target.value)} placeholder="0.00" className="w-full py-2 px-3 bg-[#0A1628]/60 border border-white/[0.08] rounded-lg text-xs text-[#F0F0F0] font-mono outline-none focus:border-amber-500/40 transition placeholder:text-[#8B92A8]/30" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1">Current Balance ($)</label>
                <input type="number" step="0.01" min="0" required value={currentBalance} onChange={e => setCurrentBalance(e.target.value)} placeholder="0.00" className="w-full py-2 px-3 bg-[#0A1628]/60 border border-white/[0.08] rounded-lg text-xs text-[#F0F0F0] font-mono outline-none focus:border-amber-500/40 transition placeholder:text-[#8B92A8]/30" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1">Interest Rate % (APR)</label>
                <input type="number" step="0.01" min="0" required value={interestRate} onChange={e => setInterestRate(e.target.value)} placeholder="e.g. 22.99" className="w-full py-2 px-3 bg-[#0A1628]/60 border border-white/[0.08] rounded-lg text-xs text-[#F0F0F0] font-mono outline-none focus:border-amber-500/40 transition placeholder:text-[#8B92A8]/30" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1">Min. Monthly Payment ($)</label>
                <input type="number" step="0.01" min="0" required value={minimumPayment} onChange={e => setMinimumPayment(e.target.value)} placeholder="0.00" className="w-full py-2 px-3 bg-[#0A1628]/60 border border-white/[0.08] rounded-lg text-xs text-[#F0F0F0] font-mono outline-none focus:border-amber-500/40 transition placeholder:text-[#8B92A8]/30" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1">Due Date</label>
                <input type="date" required value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full py-2 px-3 bg-[#0A1628]/60 border border-white/[0.08] rounded-lg text-xs text-[#F0F0F0] outline-none focus:border-amber-500/40 transition" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1">Notes</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="Optional notes..." className="w-full py-2 px-3 bg-[#0A1628]/60 border border-white/[0.08] rounded-lg text-xs text-[#F0F0F0] outline-none focus:border-amber-500/40 transition resize-none placeholder:text-[#8B92A8]/30" />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs text-white transition">Cancel</button>
              <button type="submit" className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 rounded-xl text-xs text-white font-bold transition">{debt ? 'Save Changes' : 'Add Debt'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
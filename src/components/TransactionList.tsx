import React, { useMemo } from 'react';
import { ArrowUpRight, ArrowDownRight, MoreHorizontal } from 'lucide-react';
import { Transfer } from '../types';

interface TransactionListProps {
  transfers: Transfer[];
  activePeriod: string;
  onViewAll?: () => void;
}

export default function TransactionList({ transfers, activePeriod, onViewAll }: TransactionListProps) {
  const filteredTransfers = useMemo(() => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    let cutoffDate: Date;

    switch (activePeriod) {
      case 'Day':
        cutoffDate = startOfDay;
        break;
      case 'Week':
        cutoffDate = new Date(startOfDay);
        cutoffDate.setDate(cutoffDate.getDate() - 7);
        break;
      case 'Month':
        cutoffDate = new Date(startOfDay);
        cutoffDate.setMonth(cutoffDate.getMonth() - 1);
        break;
      case 'Year':
        cutoffDate = new Date(startOfDay);
        cutoffDate.setFullYear(cutoffDate.getFullYear() - 1);
        break;
      default:
        cutoffDate = new Date(0);
    }

    return transfers
      .filter((t) => {
        const dateStr = t.date.split(' ')[0];
        const tDate = new Date(dateStr);
        return tDate >= cutoffDate;
      })
      .slice(0, 5);
  }, [transfers, activePeriod]);

  return (
    <div className="p-[1px] rounded-2xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] overflow-hidden h-full">
      <div className="rounded-[calc(1.4rem-1px)] p-5 bg-[#0A1628] h-full flex flex-col">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-sm font-bold text-white">Recent transaction</h3>
          <button className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition cursor-pointer">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-1 flex-1">
          {filteredTransfers.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-xs text-gray-500">No transactions in this period</p>
            </div>
          ) : (
            filteredTransfers.map((t) => {
              const isIncoming = t.status === 'Completed' && t.amount < 500;
              return (
                <div key={t.id} className="flex items-center justify-between py-3 px-1 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center bg-white/5">
                      {isIncoming ? (
                        <ArrowDownRight className="w-4 h-4 text-white" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-white">{t.accName}</p>
                      <p className="text-[11px] text-gray-500">Current account</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[13px] font-mono font-semibold text-white">
                      {isIncoming ? '+' : '-'} ${t.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-[10px] text-gray-500 font-mono">
                      {t.date.split(' ')[0]}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

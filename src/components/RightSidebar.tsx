import React from 'react';

interface RightSidebarProps {
  availableBalance: number;
  spentBalance: number;
  totalBalance: number;
  categories: { name: string; amount: number; color: string; icon: string }[];
}

export default function RightSidebar({ availableBalance, spentBalance, totalBalance, categories }: RightSidebarProps) {
  const percentage = totalBalance > 0 ? Math.round((spentBalance / totalBalance) * 100) : 0;
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <aside className="w-80 bg-[#111827]/80 backdrop-blur-xl border-l border-white/5 p-6 hidden lg:flex flex-col items-center gap-6">
      {/* Progress Ring Card */}
      <div className="p-[1px] rounded-2xl bg-gradient-to-b from-[#a855f7]/20 to-[#a855f7]/5 overflow-hidden border border-[#a855f7]/20 w-full">
        <div className="rounded-[calc(1.4rem-1px)] p-6 bg-[#0A1628] flex flex-col items-center">
          <div className="relative w-36 h-36 mb-3">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
              <circle
                cx="60" cy="60" r="54" fill="none"
                stroke="url(#progressGradient)"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-white">{percentage}%</span>
              <span className="text-[10px] text-gray-400 mt-0.5">Spent balance</span>
            </div>
          </div>
          <p className="text-[11px] text-gray-500 mb-2">${spentBalance.toLocaleString('en-US', { minimumFractionDigits: 0 })}/${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 0 })}</p>
          <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full rounded-full" style={{ 
              width: '100%',
              background: 'linear-gradient(90deg, #f97316, #a855f7, #6366f1)' 
            }} />
          </div>
        </div>
      </div>

      {/* Available Balance */}
      <div className="text-center">
        <p className="text-4xl font-bold text-white font-mono">${availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
        <p className="text-xs text-gray-400 mt-2">Available balance</p>
      </div>

      {/* Categories */}
      <div className="space-y-3 w-full">
        {categories.map((cat) => (
          <div key={cat.name} className="flex items-center justify-between py-2 px-1">
            <div className="flex items-center gap-3">
              <span className="text-base">{cat.icon}</span>
              <span className="text-[13px] font-medium text-gray-300">{cat.name}</span>
            </div>
            <span className="text-[13px] font-mono text-gray-400">- {cat.amount.toFixed(2)}$</span>
          </div>
        ))}
      </div>
    </aside>
  );
}

import React from 'react';
import { Search, Bell, ChevronDown, Menu } from 'lucide-react';
import Logo from './Logo';

interface TopNavProps {
  activePeriod: string;
  onPeriodChange: (period: string) => void;
  notificationCount: number;
  onLogout: () => void;
  onToggleMobileMenu?: () => void;
}

export default function TopNav({ activePeriod, onPeriodChange, notificationCount, onLogout, onToggleMobileMenu }: TopNavProps) {
  const periods = ['Day', 'Week', 'Month', 'Year'];

  return (
    <header className="flex items-center justify-between px-4 md:px-6 py-3 bg-transparent">
      <div className="flex items-center gap-3 md:gap-8">
        {onToggleMobileMenu && (
          <button 
            onClick={onToggleMobileMenu}
            className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/5 transition cursor-pointer md:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div className="flex items-center gap-2">
          <Logo size={28} />
          <h1 className="text-base md:text-lg font-bold text-white tracking-tight">WealthGlobalFinance</h1>
        </div>
        <div className="flex bg-white/[0.06] rounded-full p-1 border border-white/5 overflow-x-auto no-scrollbar">
          {periods.map((p) => (
            <button
              key={p}
              onClick={() => onPeriodChange(p)}
              className={`px-3 md:px-5 py-1.5 md:py-2 text-[10px] md:text-xs font-semibold rounded-full transition-all cursor-pointer whitespace-nowrap ${
                p === activePeriod
                  ? 'bg-[#C9A84C] text-[#0A1628] shadow-lg shadow-[#C9A84C]/30'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-5">
        <button className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/5 transition cursor-pointer">
          <Search className="w-[18px] h-[18px]" />
        </button>
        <button className="relative p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/5 transition cursor-pointer">
          <Bell className="w-[18px] h-[18px]" />
          {notificationCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#C9A84C] rounded-full" />
          )}
        </button>
        <div className="flex items-center gap-2 md:gap-3 cursor-pointer group pl-2 border-l border-white/10" onClick={onLogout}>
          <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-[#C9A84C] to-[#A08530] flex items-center justify-center text-[#0A1628] text-[10px] md:text-xs font-bold overflow-hidden">
            EB
          </div>
          <div className="hidden lg:block">
            <p className="text-xs font-semibold text-white">EDMUND BECKER</p>
          </div>
          <ChevronDown className="w-3 h-3 text-gray-500 group-hover:text-white transition hidden lg:block" />
        </div>
      </div>
    </header>
  );
}

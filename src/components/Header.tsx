import React, { useState } from 'react';
import { Bell, LogOut, ChevronDown, CheckSquare, ShieldCheck, Sun, Moon } from 'lucide-react';
import { NotificationItem } from '../types';
import { useSettings } from '../lib/SettingsContext';

interface HeaderProps {
  activeSection: string;
  notifications: NotificationItem[];
  notificationCount: number;
  onMarkAllRead: () => void;
  onLogout: () => void;
  onToggleMobileMenu: () => void;
}

export default function Header({
  activeSection,
  notifications,
  notificationCount,
  onMarkAllRead,
  onLogout,
  onToggleMobileMenu,
}: HeaderProps) {
  const { settings, updateSetting } = useSettings();
  const [showBellDropdown, setShowBellDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  return (
    <header className="h-16 border-b border-white/10 bg-[#0A1628]/80 backdrop-blur-xl sticky top-0 z-40 px-4 md:px-8 flex items-center justify-between text-white">
      
      <div className="flex items-center gap-3">
        <div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider md:block hidden">
            {activeSection === 'home' && 'Dashboard Overview'}
            {activeSection === 'reports' && 'Transfers & Activity Report'}
            {activeSection === 'crypto' && 'Crypto Portfolio Vault'}
            {activeSection === 'cards' && 'Premium Card Center'}
            {activeSection === 'statements' && 'Electronic Account Statement'}
            {activeSection === 'debts' && 'Debt Management'}
            {activeSection === 'notifications' && 'System Alerts & Notices'}
            {activeSection === 'settings' && 'Account Settings'}
          </h2>
          <h2 className="text-xs font-bold text-white uppercase tracking-wider md:hidden block">
            WealthGlobalFinance
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => updateSetting('theme', settings.theme === 'light' ? 'dark' : 'light')}
          className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/5 transition border border-white/10 bg-white/5 flex items-center justify-center cursor-pointer"
          title={`Switch to ${settings.theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {settings.theme === 'light' ? (
            <Moon className="w-4 h-4 text-[var(--primary)]" />
          ) : (
            <Sun className="w-4 h-4 text-[var(--primary)]" />
          )}
        </button>

        <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] text-emerald-500 font-semibold font-mono">
          <ShieldCheck className="w-3.5 h-3.5" />
          Secure SSL
        </div>

        <div className="relative">
          <button
            onClick={() => {
              setShowBellDropdown(!showBellDropdown);
              setShowProfileDropdown(false);
            }}
            className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/5 transition relative"
          >
            <Bell className="w-5 h-5" />
            {notificationCount > 0 && settings.emailAlerts && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#EF4444] border-2 border-[#0A1628] rounded-full flex items-center justify-center text-[8px] font-bold text-white animate-pulse">
                {notificationCount}
              </span>
            )}
          </button>

          {showBellDropdown && (
            <div className="absolute right-0 mt-2 w-80 bg-[#0A1628]/95 backdrop-blur-2xl border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 text-white">
              <div className="p-3 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
                <span className="text-xs font-bold text-white">Notifications ({notificationCount})</span>
                {notificationCount > 0 && (
                  <button 
                    onClick={() => {
                      onMarkAllRead();
                      setShowBellDropdown(false);
                    }}
                    className="text-[9px] text-[var(--primary)] hover:underline font-bold flex items-center gap-1"
                  >
                    <CheckSquare className="w-3 h-3" /> Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto no-scrollbar divide-y divide-white/5">
                {notifications.map((n) => (
                  <div key={n.id} className="p-3 hover:bg-white/[0.02] transition">
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <h4 className="text-[11px] font-bold text-[var(--primary)] truncate">{n.title}</h4>
                      <span className="text-[8px] text-gray-500 shrink-0 font-mono">{n.date.split(' - ')[0]}</span>
                    </div>
                    <p className="text-[10px] text-gray-400 line-clamp-2 leading-relaxed">
                      {n.message}
                    </p>
                  </div>
                ))}
                {notifications.length === 0 && (
                  <div className="p-6 text-center text-xs text-gray-400">
                    No new alerts or messages.
                  </div>
                )}
              </div>
              <div className="p-2 border-t border-white/5 bg-white/[0.02] text-center">
                <span className="text-[10px] text-gray-500 font-mono">WealthGlobalFinance Security Center</span>
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => {
              setShowProfileDropdown(!showProfileDropdown);
              setShowBellDropdown(false);
            }}
            className="flex items-center gap-2.5 pl-2 py-1 pr-3 rounded-full hover:bg-white/5 transition border border-white/10"
          >
            <div className="w-8 h-8 rounded-full gold-gradient flex items-center justify-center font-bold text-[#0A1628] text-sm shadow-lg shadow-[var(--primary)]/20">
              E
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-bold leading-none text-white">EDMUND</p>
              <span className="text-[9px] text-gray-400">Beneficiary Account</span>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400 hidden sm:block" />
          </button>

          {showProfileDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-[#0A1628]/95 backdrop-blur-2xl border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 text-white">
              <div className="p-3 border-b border-white/10">
                <p className="text-xs font-bold text-white">EDMUND BECKER</p>
                <p className="text-[9px] text-gray-400 font-mono">ID: WGF-1768472</p>
              </div>
              <div className="p-1">
                <button
                  onClick={onLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[#EF4444] hover:text-[#EF4444]/80 hover:bg-white/5 rounded-lg transition text-left cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out Securely</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

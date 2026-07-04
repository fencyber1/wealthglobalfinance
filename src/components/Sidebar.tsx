import React from 'react';
import { Home, BarChart2, DollarSign, CreditCard, FileText, Bell, Send, Settings, Wallet } from 'lucide-react';
import Logo from './Logo';
import { useSettings } from '../lib/SettingsContext';

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  onOpenTransfer: () => void;
  notificationCount: number;
}

export default function Sidebar({
  activeSection,
  setActiveSection,
  onOpenTransfer,
  notificationCount
}: SidebarProps) {
  const { settings } = useSettings();

  const menuItems = [
    { id: 'home', icon: Home },
    { id: 'cards', icon: CreditCard },
    { id: 'reports', icon: BarChart2 },
    { id: 'crypto', icon: DollarSign },
    { id: 'debts', icon: Wallet },
    { id: 'statements', icon: FileText },
    { id: 'notifications', icon: Bell, badge: notificationCount > 0 ? notificationCount : undefined },
  ];

  return (
    <aside className={`w-14 bg-[#0A1628]/95 backdrop-blur-xl border-white/5 hidden md:flex flex-col items-center h-screen sticky top-0 shrink-0 transition-all duration-300 text-white py-4 ${
      settings.sidebarPosition === 'right'
        ? 'border-l border-r-0 order-last'
        : 'border-r border-l-0'
    }`}>
      <nav className="flex-1 flex flex-col items-center gap-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                isActive
                  ? 'bg-white/10 text-white'
                  : 'text-gray-500 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-[18px] h-[18px]" />
              {item.badge !== undefined && (
                <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-[#EF4444] text-white text-[7px] font-bold rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="flex flex-col items-center gap-1 mt-auto">
        <button
          onClick={onOpenTransfer}
          className="w-10 h-10 gold-gradient rounded-xl flex items-center justify-center text-[#0A1628] hover:shadow-lg hover:shadow-[var(--primary)]/20 transition active:scale-95 cursor-pointer"
        >
          <Send className="w-[18px] h-[18px]" />
        </button>
        <button
          onClick={() => setActiveSection('settings')}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition cursor-pointer ${
            activeSection === 'settings'
              ? 'bg-white/10 text-white'
              : 'text-gray-500 hover:text-white hover:bg-white/5'
          }`}
        >
          <Settings className="w-[18px] h-[18px]" />
        </button>
      </div>
    </aside>
  );
}

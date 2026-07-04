import React from 'react';
import { 
  User, Shield, Bell, Palette, Settings, 
  LogOut, ChevronRight, X, Globe, Smartphone
} from 'lucide-react';
import Logo from './Logo';
import { useSettings, AccentColor } from '../lib/SettingsContext';

interface SettingsPageProps {
  onLogout: () => void;
}

const settingsNav = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'notifications', label: 'Notifications', icon: Bell, badge: 3 },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'sessions', label: 'Sessions', icon: Settings, badge: 10 },
];

const accentOptions: { color: AccentColor; label: string }[] = [
  { color: '#C9A84C', label: 'Gold' },
  { color: '#7c5bf5', label: 'Violet' },
  { color: '#3b82f6', label: 'Blue' },
  { color: '#10b981', label: 'Emerald' },
  { color: '#ef4444', label: 'Red' },
  { color: '#f97316', label: 'Orange' },
];

function detectDevice() {
  const ua = navigator.userAgent;
  let os = 'Unknown OS';
  let device = 'Desktop';
  let browser = 'Unknown Browser';

  if (ua.includes('Win')) {
    os = 'Windows';
    if (ua.includes('Windows NT 10.0')) os = 'Windows 11';
    else if (ua.includes('Windows NT 6.3')) os = 'Windows 8.1';
    else if (ua.includes('Windows NT 6.2')) os = 'Windows 8';
    else if (ua.includes('Windows NT 6.1')) os = 'Windows 7';
  } else if (ua.includes('Mac')) {
    os = 'macOS';
    const match = ua.match(/Mac OS X (\d+[._]\d+)/);
    if (match) os = `macOS ${match[1].replace('_', '.')}`;
  } else if (ua.includes('Linux')) {
    os = 'Linux';
    if (ua.includes('Ubuntu')) os = 'Ubuntu Linux';
    else if (ua.includes('Fedora')) os = 'Fedora Linux';
    else if (ua.includes('Debian')) os = 'Debian Linux';
    else if (ua.includes('Android')) os = 'Android';
  } else if (ua.includes('Android')) {
    os = 'Android';
    const match = ua.match(/Android (\d+[\.\d]*)/);
    if (match) os = `Android ${match[1]}`;
  } else if (ua.includes('iPhone') || ua.includes('iPad')) {
    os = 'iOS';
    const match = ua.match(/OS (\d+_\d+)/);
    if (match) os = `iOS ${match[1].replace('_', '.')}`;
  }

  if (ua.includes('Mobile') || ua.includes('Android') || ua.includes('iPhone')) {
    device = 'Mobile';
  } else if (ua.includes('iPad') || ua.includes('Tablet')) {
    device = 'Tablet';
  }

  if (ua.includes('Edg/')) browser = 'Edge';
  else if (ua.includes('Chrome/') && !ua.includes('Edg/')) browser = 'Chrome';
  else if (ua.includes('Firefox/')) browser = 'Firefox';
  else if (ua.includes('Safari/') && !ua.includes('Chrome')) browser = 'Safari';

  return { os, device, browser };
}

export default function SettingsPage({ onLogout }: SettingsPageProps) {
  const { settings, updateSetting } = useSettings();
  const [activeTab, setActiveTab] = React.useState('profile');
  const currentSession = React.useMemo(() => detectDevice(), []);

  return (
    <div className="flex gap-6 h-[calc(100vh-8rem)]">
      {/* Left sidebar navigation */}
      <div className="w-64 shrink-0">
        <div className="rounded-2xl bg-[#111318] border border-white/[0.06] overflow-hidden h-full flex flex-col">
          <div className="px-5 pt-6 pb-4 flex items-center justify-between">
            <Logo size={28} />
            <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/[0.06] flex items-center justify-center cursor-pointer hover:bg-white/10 transition">
              <X className="w-3.5 h-3.5 text-gray-500" />
            </div>
          </div>

          <nav className="flex-1 px-3 py-2 space-y-0.5">
            {settingsNav.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white/[0.07] text-white'
                      : 'text-gray-500 hover:text-gray-300 hover:bg-white/[0.03]'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge !== undefined && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                      isActive ? 'bg-white/10 text-white' : 'bg-white/5 text-gray-500'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-gray-500" />}
                </button>
              );
            })}
          </nav>

          <div className="px-3 py-3 border-t border-white/[0.04]">
            <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:text-red-400 hover:bg-red-500/5 transition-all cursor-pointer">
              <LogOut className="w-4 h-4" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Right content panel */}
      <div className="flex-1 min-w-0">
        <div className="rounded-2xl bg-[#111318] border border-white/[0.06] h-full overflow-y-auto no-scrollbar">

          {/* Profile */}
          {activeTab === 'profile' && (
            <div className="p-8 max-w-lg">
              <h2 className="text-lg font-bold text-white mb-1">Profile</h2>
              <p className="text-xs text-gray-500 mb-8">Manage your personal information and account details.</p>
              <div className="space-y-6">
                  <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#C9A84C]/30 to-[#C9A84C]/5 border border-[#C9A84C]/20 flex items-center justify-center">
                    <span className="text-xl font-bold text-[#C9A84C]">E</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Edmund Becker</p>
                    <p className="text-[11px] text-gray-500">edmund.becker88@gmail.com</p>
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-gray-400 mb-2">Full Name</label>
                  <input type="text" defaultValue="Edmund Becker" className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white outline-none focus:border-[#C9A84C]/50 transition" />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-gray-400 mb-2">Email Address</label>
                  <input type="email" defaultValue="edmund.becker88@gmail.com" className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white outline-none focus:border-[#C9A84C]/50 transition" />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-gray-400 mb-2">Phone Number</label>
                  <input type="tel" defaultValue="+1 (800) 555-0199" className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white outline-none focus:border-[#C9A84C]/50 transition" />
                </div>
                <button className="w-full py-2.5 bg-[var(--primary)] hover:opacity-90 rounded-xl text-[var(--primary-foreground)] text-sm font-bold transition-all cursor-pointer">
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* Security */}
          {activeTab === 'security' && (
            <div className="p-8 max-w-lg">
              <h2 className="text-lg font-bold text-white mb-1">Security</h2>
              <p className="text-xs text-gray-500 mb-8">Protect your account with enhanced security settings.</p>
              <div className="space-y-5">
                {[
                  { key: 'twoFactor' as const, title: 'Two-Factor Authentication', desc: 'Add an extra layer of security to your account' },
                  { key: 'loginAlerts' as const, title: 'Login Notifications', desc: 'Get notified of new sign-ins to your account' },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <div>
                      <p className="text-sm font-bold text-white">{item.title}</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => updateSetting(item.key, !settings[item.key])}
                      className={`w-11 h-6 rounded-full relative transition-all cursor-pointer ${settings[item.key] ? 'bg-[var(--primary)]' : 'bg-white/10'}`}
                    >
                      <div className={`absolute top-0.5 w-5 h-5 rounded-full shadow transition-all ${settings[item.key] ? 'right-0.5 bg-[#0A1628]' : 'left-0.5 bg-gray-400'}`} />
                    </button>
                  </div>
                ))}
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-white">Change Password</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">Update your account password regularly</p>
                    </div>
                    <button className="px-4 py-1.5 text-[11px] font-bold text-[var(--primary)] bg-[var(--primary)]/10 border border-[var(--primary)]/20 rounded-lg hover:bg-[var(--primary)]/20 transition cursor-pointer">
                      Update
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeTab === 'notifications' && (
            <div className="p-8 max-w-lg">
              <h2 className="text-lg font-bold text-white mb-1">Notifications</h2>
              <p className="text-xs text-gray-500 mb-8">Choose how and when you want to be notified.</p>
              <div className="space-y-5">
                {[
                  { key: 'emailAlerts' as const, title: 'Email Alerts', desc: 'Transaction and account alerts via email' },
                  { key: 'pushAlerts' as const, title: 'Push Notifications', desc: 'Real-time alerts on your mobile device' },
                  { key: 'transferAlerts' as const, title: 'Transfer Alerts', desc: 'Notify on every incoming and outgoing transfer' },
                  { key: 'cryptoAlerts' as const, title: 'Crypto Price Alerts', desc: 'Major price movement notifications' },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <div>
                      <p className="text-sm font-bold text-white">{item.title}</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => updateSetting(item.key, !settings[item.key])}
                      className={`w-11 h-6 rounded-full relative transition-all cursor-pointer ${settings[item.key] ? 'bg-[var(--primary)]' : 'bg-white/10'}`}
                    >
                      <div className={`absolute top-0.5 w-5 h-5 rounded-full shadow transition-all ${settings[item.key] ? 'right-0.5 bg-[#0A1628]' : 'left-0.5 bg-gray-400'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Appearance */}
          {activeTab === 'appearance' && (
            <div className="p-8 max-w-lg">
              <h2 className="text-lg font-bold text-white mb-1">Appearance</h2>
              <p className="text-xs text-gray-500 mb-8">Customize the look and feel of your dashboard.</p>
              <div className="space-y-6">
                <div>
                  <label className="block text-[11px] font-medium text-gray-400 mb-3">Theme</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => updateSetting('theme', 'dark')}
                      className={`p-4 rounded-xl text-center cursor-pointer transition-all ${
                        settings.theme === 'dark'
                          ? 'bg-[#0A1628] border-2 border-[var(--primary)]'
                          : 'bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05]'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#0A1628] border border-white/10 mx-auto mb-2" />
                      <span className={`text-xs font-bold ${settings.theme === 'dark' ? 'text-[var(--primary)]' : 'text-gray-500'}`}>Dark</span>
                    </button>
                    <button
                      onClick={() => updateSetting('theme', 'light')}
                      className={`p-4 rounded-xl text-center cursor-pointer transition-all ${
                        settings.theme === 'light'
                          ? 'bg-gray-100 border-2 border-[var(--primary)]'
                          : 'bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05]'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-gray-100 mx-auto mb-2" />
                      <span className={`text-xs font-bold ${settings.theme === 'light' ? 'text-[var(--primary)]' : 'text-gray-500'}`}>Light</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-gray-400 mb-3">Accent Color</label>
                  <div className="flex gap-2">
                    {accentOptions.map(opt => (
                      <button
                        key={opt.color}
                        onClick={() => updateSetting('accentColor', opt.color)}
                        className={`w-9 h-9 rounded-full cursor-pointer transition-all ${
                          settings.accentColor === opt.color ? 'ring-2 ring-offset-2 ring-offset-[#111318] scale-110' : 'hover:scale-105'
                        }`}
                        style={{ backgroundColor: opt.color, ringColor: opt.color }}
                        title={opt.label}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-gray-400 mb-3">Sidebar Position</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => updateSetting('sidebarPosition', 'left')}
                      className={`p-3 rounded-xl text-center cursor-pointer transition-all ${
                        settings.sidebarPosition === 'left'
                          ? 'bg-[var(--primary)]/10 border border-[var(--primary)]/30'
                          : 'bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05]'
                      }`}
                    >
                      <span className={`text-xs font-bold ${settings.sidebarPosition === 'left' ? 'text-[var(--primary)]' : 'text-gray-500'}`}>Left</span>
                    </button>
                    <button
                      onClick={() => updateSetting('sidebarPosition', 'right')}
                      className={`p-3 rounded-xl text-center cursor-pointer transition-all ${
                        settings.sidebarPosition === 'right'
                          ? 'bg-[var(--primary)]/10 border border-[var(--primary)]/30'
                          : 'bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05]'
                      }`}
                    >
                      <span className={`text-xs font-bold ${settings.sidebarPosition === 'right' ? 'text-[var(--primary)]' : 'text-gray-500'}`}>Right</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-gray-400 mb-3">Currency</label>
                  <select
                    value={settings.currency}
                    onChange={(e) => updateSetting('currency', e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white outline-none focus:border-[var(--primary)]/50 transition cursor-pointer"
                  >
                    <option value="USD" className="bg-[#0A1628] text-white">USD - US Dollar</option>
                    <option value="EUR" className="bg-[#0A1628] text-white">EUR - Euro</option>
                    <option value="GBP" className="bg-[#0A1628] text-white">GBP - British Pound</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-gray-400 mb-3">Timezone</label>
                  <select
                    value={settings.timezone}
                    onChange={(e) => updateSetting('timezone', e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white outline-none focus:border-[var(--primary)]/50 transition cursor-pointer"
                  >
                    <option value="EST" className="bg-[#0A1628] text-white">Eastern Time (ET)</option>
                    <option value="CST" className="bg-[#0A1628] text-white">Central Time (CT)</option>
                    <option value="MST" className="bg-[#0A1628] text-white">Mountain Time (MT)</option>
                    <option value="PST" className="bg-[#0A1628] text-white">Pacific Time (PT)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Sessions */}
          {activeTab === 'sessions' && (
            <div className="p-8 max-w-lg">
              <h2 className="text-lg font-bold text-white mb-1">Sessions</h2>
              <p className="text-xs text-gray-500 mb-8">View and manage active sessions across your devices.</p>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[var(--primary)]/10 border border-[var(--primary)]/20">
                      <Smartphone className="w-4 h-4 text-[var(--primary)]" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{currentSession.os} · {currentSession.device}</p>
                      <p className="text-[11px] text-gray-500">{currentSession.browser} · Current session</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] font-bold text-emerald-400">Active now</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

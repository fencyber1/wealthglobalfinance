import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type AccentColor = '#C9A84C' | '#7c5bf5' | '#3b82f6' | '#10b981' | '#ef4444' | '#f97316';
export type ThemeMode = 'dark' | 'light';
export type SidebarPosition = 'left' | 'right';

export interface SettingsState {
  theme: ThemeMode;
  accentColor: AccentColor;
  sidebarPosition: SidebarPosition;
  twoFactor: boolean;
  loginAlerts: boolean;
  emailAlerts: boolean;
  pushAlerts: boolean;
  transferAlerts: boolean;
  cryptoAlerts: boolean;
  currency: string;
  timezone: string;
}

interface SettingsContextType {
  settings: SettingsState;
  updateSetting: <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => void;
}

const defaultSettings: SettingsState = {
  theme: 'dark',
  accentColor: '#C9A84C',
  sidebarPosition: 'left',
  twoFactor: true,
  loginAlerts: true,
  emailAlerts: true,
  pushAlerts: false,
  transferAlerts: true,
  cryptoAlerts: true,
  currency: 'USD',
  timezone: 'EST',
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
    : { r: 201, g: 168, b: 76 };
}

function applyAccentColor(color: AccentColor) {
  const root = document.documentElement;
  const { r, g, b } = hexToRgb(color);
  const alpha = (a: number) => `rgba(${r}, ${g}, ${b}, ${a})`;

  root.style.setProperty('--primary', color);
  root.style.setProperty('--ring', color);
  root.style.setProperty('--accent-foreground', color);
  root.style.setProperty('--sidebar-primary', color);
  root.style.setProperty('--sidebar-ring', color);
  root.style.setProperty('--sidebar-accent-foreground', color);
  root.style.setProperty('--chart-1', color);
  root.style.setProperty('--border', alpha(0.15));

  // Update gold-gradient CSS class dynamically
  let styleEl = document.getElementById('dynamic-accent') as HTMLStyleElement;
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = 'dynamic-accent';
    document.head.appendChild(styleEl);
  }
  styleEl.textContent = `
    .gold-gradient {
      background: linear-gradient(135deg, ${color}, ${alpha(0.8)});
    }
    .gold-focus:focus {
      border-color: ${alpha(0.5)};
      box-shadow: 0 0 0 2px ${alpha(0.1)};
    }
  `;
}

function applyTheme(theme: ThemeMode) {
  const root = document.documentElement;
  if (theme === 'light') {
    root.classList.remove('dark');
    root.style.setProperty('--background', '#f5f5f5');
    root.style.setProperty('--foreground', '#171717');
    root.style.setProperty('--card', '#ffffff');
    root.style.setProperty('--card-foreground', '#171717');
    root.style.setProperty('--popover', '#ffffff');
    root.style.setProperty('--popover-foreground', '#171717');
    root.style.setProperty('--sidebar', '#f9f9f9');
    root.style.setProperty('--sidebar-foreground', '#171717');
    root.style.setProperty('--secondary', '#f0f0f0');
    root.style.setProperty('--secondary-foreground', '#171717');
    root.style.setProperty('--muted', '#f0f0f0');
    root.style.setProperty('--muted-foreground', 'rgba(0, 0, 0, 0.5)');
    root.style.setProperty('--input', '#e5e5e5');
    root.style.setProperty('--glass-bg', 'rgba(0, 0, 0, 0.03)');
    root.style.setProperty('--glass-bg-heavy', 'rgba(0, 0, 0, 0.06)');
    root.style.setProperty('--glass-border', 'rgba(0, 0, 0, 0.08)');
  } else {
    root.classList.add('dark');
    root.style.setProperty('--background', '#0A1628');
    root.style.setProperty('--foreground', '#FFFFFF');
    root.style.setProperty('--card', '#0D1B2A');
    root.style.setProperty('--card-foreground', '#FFFFFF');
    root.style.setProperty('--popover', '#0D1B2A');
    root.style.setProperty('--popover-foreground', '#FFFFFF');
    root.style.setProperty('--sidebar', '#0A1628');
    root.style.setProperty('--sidebar-foreground', '#FFFFFF');
    root.style.setProperty('--secondary', '#1E2A3A');
    root.style.setProperty('--secondary-foreground', '#FFFFFF');
    root.style.setProperty('--muted', '#0F1D2E');
    root.style.setProperty('--muted-foreground', 'rgba(255, 255, 255, 0.5)');
    root.style.setProperty('--input', '#1E2A3A');
    root.style.setProperty('--glass-bg', 'rgba(255, 255, 255, 0.04)');
    root.style.setProperty('--glass-bg-heavy', 'rgba(255, 255, 255, 0.08)');
    root.style.setProperty('--glass-border', 'rgba(255, 255, 255, 0.08)');
  }
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SettingsState>(() => {
    try {
      const stored = localStorage.getItem('wgf-settings');
      return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  // Apply settings to DOM on change
  useEffect(() => {
    applyAccentColor(settings.accentColor);
    applyTheme(settings.theme);
    document.documentElement.setAttribute('data-sidebar', settings.sidebarPosition);
  }, [settings.theme, settings.accentColor, settings.sidebarPosition]);

  // Apply on mount
  useEffect(() => {
    applyAccentColor(settings.accentColor);
    applyTheme(settings.theme);
  }, []);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('wgf-settings', JSON.stringify(settings));
  }, [settings]);

  const updateSetting = useCallback(<K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, updateSetting }}>
      {children}
    </SettingsContext.Provider>
  );
}

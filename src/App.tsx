import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Landmark, 
  Wallet, 
  Coins, 
  CreditCard as CreditCardIcon, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  ChevronRight, 
  Bell, 
  Download, 
  Printer, 
  Check, 
  ShieldAlert, 
  Lock, 
  FileText,
  AlertCircle,
  X,
  Search,
  Menu,
  Plus,
  ArrowUpDown,
  PieChart,
  BarChart3,
  Activity
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart as RePieChart, Pie, Cell } from 'recharts';

import { Transfer, CreditCard, NotificationItem, CryptoAsset } from './types';
import { initialTransfers, initialNotifications, initialCryptos } from './data';

import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav';
import RightSidebar from './components/RightSidebar';
import CardStack from './components/CardStack';
import TransactionList from './components/TransactionList';
import ActivityChart from './components/ActivityChart';
import PaymentsChart from './components/PaymentsChart';
import CardVisual from './components/CardVisual';
import TransferModal from './components/TransferModal';
import CryptoModal from './components/CryptoModal';
import RestrictionModal from './components/RestrictionModal';
import CryptoIcon from './components/CryptoIcon';
import LandingPage from './components/LandingPage';
import { DebtProvider } from './lib/DebtContext';
import DebtsSummary from './components/DebtsSummary';
import DebtsPage from './components/DebtsPage';
import SettingsPage from './components/SettingsPage';
import Logo from './components/Logo';
import { ExpandableTabs } from './components/ui/expandable-tabs';
import { Home, BarChart2, DollarSign } from 'lucide-react';

export default function App() {
  // Router hooks
  const navigate = useNavigate();
  const location = useLocation();

  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Theme is now managed by SettingsContext

  // Financial State
  const [checkingBalance, setCheckingBalance] = useState(5248150.00);
  const [savingsBalance, setSavingsBalance] = useState(0.00);
  
  // Lists
  const [transfers, setTransfers] = useState<Transfer[]>(initialTransfers);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [cryptos, setCryptos] = useState<CryptoAsset[]>(initialCryptos);
  const [notificationCount, setNotificationCount] = useState(5);

  // Cards state
  const [debitCard, setDebitCard] = useState<CreditCard>({
    id: 'c-debit',
    type: 'debit',
    nameOnCard: 'EDMUND BECKER',
    cardNumber: '5453200010001000',
    expiryDate: '11/26',
    cvv: '847',
    status: 'active'
  });

  const [creditCard, setCreditCard] = useState<CreditCard | null>(null);

  // Layout active views - initialize from URL
  const getInitialSection = () => {
    const path = window.location.pathname.replace('/', '');
    const validSections = ['home', 'reports', 'crypto', 'cards', 'debts', 'statements', 'notifications', 'settings'];
    if (path && validSections.includes(path)) return path;
    return 'home';
  };
  const [activeSection, setActiveSectionState] = useState(getInitialSection);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState('bitcoin');

  // Sync URL with activeSection
  const setActiveSection = (sec: string) => {
    setActiveSectionState(sec);
    const path = sec === 'home' ? '/' : `/${sec}`;
    if (location.pathname !== path) {
      navigate(path, { replace: true });
    }
  };

  // Sync activeSection from URL on popstate (back/forward)
  useEffect(() => {
    const handlePopState = () => {
      const path = location.pathname.replace('/', '');
      const validSections = ['home', 'reports', 'crypto', 'cards', 'debts', 'statements', 'notifications', 'settings'];
      if (path && validSections.includes(path)) {
        setActiveSectionState(path);
      } else if (!path) {
        setActiveSectionState('home');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [location.pathname]);

  // Sync on pathname change
  useEffect(() => {
    const path = location.pathname.replace('/', '');
    const validSections = ['home', 'reports', 'crypto', 'cards', 'debts', 'statements', 'notifications', 'settings'];
    if (path && validSections.includes(path)) {
      setActiveSectionState(path);
    } else if (!path) {
      setActiveSectionState('home');
    }
  }, [location.pathname]);

  // Restriction flag (true = transfers blocked at send)
  const [isRestricted, setIsRestricted] = useState(true);

  // Login timestamps
  const [currentLoginTime, setCurrentLoginTime] = useState<Date | null>(null);
  const [lastLoginTime, setLastLoginTime] = useState<Date | null>(() => {
    const stored = localStorage.getItem('wgf-last-login');
    return stored ? new Date(stored) : null;
  });

  // Modals triggers
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [cryptoModalOpen, setCryptoModalOpen] = useState(false);
  const [cryptoModalMode, setCryptoModalMode] = useState<'buy' | 'receive'>('buy');
  const [showRestriction, setShowRestriction] = useState(false);
  const [applyCardType, setApplyCardType] = useState<'debit' | 'credit' | null>(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [newCardName, setNewCardName] = useState('EDMUND BECKER');

  const [cryptoPrices, setCryptoPrices] = useState<Record<string, { currentPrice: number; buyPrice: number; sellPrice: number; spreadPct: number; percentageChange: number; sparkline: { price: number }[] }>>({
    bitcoin: { currentPrice: 63420, buyPrice: 63737, sellPrice: 63103, spreadPct: 0.50, percentageChange: 1.45, sparkline: Array.from({ length: 15 }, () => 61000 + Math.random() * 3000) },
    ethereum: { currentPrice: 3450, buyPrice: 3467, sellPrice: 3433, spreadPct: 0.50, percentageChange: -0.82, sparkline: Array.from({ length: 15 }, () => 3300 + Math.random() * 200) },
    tether: { currentPrice: 1.00, buyPrice: 1.005, sellPrice: 0.995, spreadPct: 0.50, percentageChange: 0.01, sparkline: Array.from({ length: 15 }, () => 0.999 + Math.random() * 0.002) },
    'bitcoin-cash': { currentPrice: 388, buyPrice: 390, sellPrice: 386, spreadPct: 0.52, percentageChange: 2.11, sparkline: Array.from({ length: 15 }, () => 370 + Math.random() * 25) },
  });

  // Calculate Crypto total USD holdings
  const totalCryptoUSD = cryptos.reduce((total, asset) => {
    const priceInfo = cryptoPrices[asset.id];
    return total + (asset.holdings * (priceInfo?.currentPrice || 0));
  }, 0);

  // Fetch prices dynamically from CoinGecko or fallback gracefully
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const ids = 'bitcoin,ethereum,tether,bitcoin-cash';
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&sparkline=true`);
        if (!response.ok) throw new Error('Gecko limit exceeded');
        const data = await response.json();

        const updatedPrices: typeof cryptoPrices = {};
        data.forEach((coin: any) => {
          const pricesArr = coin.sparkline_in_7d?.price || [coin.current_price];
          const slicedPrices = pricesArr.slice(-15).map((p: number) => ({ price: p }));
          const firstPrice = slicedPrices[0]?.price || coin.current_price;
          const cp = coin.current_price;
          const spread = 0.003 + Math.random() * 0.004;
          const percentageChange = ((cp - firstPrice) / (firstPrice || 1)) * 100;

          updatedPrices[coin.id] = {
            currentPrice: cp,
            buyPrice: Number((cp * (1 + spread)).toFixed(2)),
            sellPrice: Number((cp * (1 - spread)).toFixed(2)),
            spreadPct: Number((spread * 100).toFixed(2)),
            percentageChange,
            sparkline: slicedPrices
          };
        });

        setCryptoPrices(prev => ({ ...prev, ...updatedPrices }));
      } catch (err) {
        setCryptoPrices(prev => {
          const simulated = { ...prev };
          Object.keys(simulated).forEach(key => {
            const coin = simulated[key];
            const changePct = (Math.random() - 0.48) * 0.5;
            const newPrice = coin.currentPrice * (1 + changePct / 100);
            const spread = 0.003 + Math.random() * 0.004;
            const newSparkline = [...coin.sparkline.slice(1), { price: newPrice }];
            
            simulated[key] = {
              currentPrice: Number(newPrice.toFixed(2)),
              buyPrice: Number((newPrice * (1 + spread)).toFixed(2)),
              sellPrice: Number((newPrice * (1 - spread)).toFixed(2)),
              spreadPct: Number((spread * 100).toFixed(2)),
              percentageChange: coin.percentageChange + changePct,
              sparkline: newSparkline
            };
          });
          return simulated;
        });
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 15000);
    return () => clearInterval(interval);
  }, []);

  // Handlers
  const handleNewTransfer = (transferData: Omit<Transfer, 'id' | 'status' | 'date'>) => {
    const today = new Date().toISOString().split('T')[0];
    const newTransfer: Transfer = {
      ...transferData,
      id: `t-${transfers.length + 1}`,
      status: 'Pending',
      date: today
    };

    setTransfers(prev => [newTransfer, ...prev]);
    setCheckingBalance(prev => prev - transferData.amount);

    // Create an automated security notification response
    const newAlert: NotificationItem = {
      id: `n-${notifications.length + 1}`,
      title: 'Transfer Received - Pending Approval',
      message: `Dear Client,\n\nWe have received your request to transfer $${transferData.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })} to ${transferData.accName}.\n\nThis transaction is currently under standard administrative hold while we verify compliance coordinates. Please ensure you have paid any necessary transaction taxes and configured an active holding certificate if requested.`,
      date: `${today} - ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}`
    };

    setNotifications(prev => [newAlert, ...prev]);
    setNotificationCount(prev => prev + 1);
  };

  const handleCryptoAction = (coinId: string, amountUSD: number, action: 'buy' | 'receive') => {
    if (action === 'buy') {
      const coinPrice = cryptoPrices[coinId]?.currentPrice || 1;
      const boughtUnits = amountUSD / coinPrice;

      setCryptos(prev => prev.map(c => {
        if (c.id === coinId) {
          return { ...c, holdings: c.holdings + boughtUnits };
        }
        return c;
      }));

      setCheckingBalance(prev => prev - amountUSD);

      // Log a transaction event in transfers list
      const today = new Date().toISOString().split('T')[0];
      const newTransfer: Transfer = {
        id: `t-${transfers.length + 1}`,
        type: 'local',
        status: 'Completed',
        accountNumber: 'A-Fin Crypto Vault',
        accName: `${cryptos.find(c => c.id === coinId)?.name} Instant Buy`,
        amount: amountUSD,
        date: today,
        description: `Purchased ${boughtUnits.toFixed(6)} ${coinId.toUpperCase()}`
      };
      setTransfers(prev => [newTransfer, ...prev]);
    }
  };

  const handleMarkAllRead = () => {
    setNotificationCount(0);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleApplyCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCardName.trim()) return;

    const randomCardNum = Array.from({ length: 4 }, () => Math.floor(1000 + Math.random() * 9000)).join('');
    const randomCVV = Math.floor(100 + Math.random() * 900).toString();

    const newCreatedCard: CreditCard = {
      id: `c-${applyCardType}`,
      type: applyCardType!,
      nameOnCard: newCardName,
      cardNumber: randomCardNum,
      expiryDate: '12/30',
      cvv: randomCVV,
      status: 'active'
    };

    if (applyCardType === 'debit') {
      setDebitCard(newCreatedCard);
    } else {
      setCreditCard(newCreatedCard);
    }

    setShowApplyModal(false);
  };

  const [activeTransferTab, setActiveTransferTab] = useState<'local' | 'international'>('local');
  const [balancePeriod, setBalancePeriod] = useState<'1M' | '3M' | '6M' | '1Y'>('1Y');
  const [topNavPeriod, setTopNavPeriod] = useState('Week');

  if (!isLoggedIn) {
    return (
      <LandingPage 
        onLoginSuccess={() => { 
          const now = new Date();
          setCurrentLoginTime(now);
          localStorage.setItem('wgf-last-login', now.toISOString());
          setIsLoggedIn(true); 
        }} 
      />
    );
  }

  return (
    <DebtProvider>
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300 font-sans">
      
      {/* Sidebar for desktop */}
      <Sidebar 
        activeSection={activeSection} 
        setActiveSection={(sec) => { setActiveSection(sec); setMobileMenuOpen(false); }}
        onOpenTransfer={() => setTransferModalOpen(true)}
        notificationCount={notificationCount}
      />

      {/* Mobile Drawer menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative w-[85vw] max-w-72 bg-[#0e1619] h-full flex flex-col p-4 sm:p-6 border-r border-white/10 z-50 animate-slide-in">
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-4 right-4 p-2 text-white/50 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-8">
              <Logo size={40} />
              <div>
                <h1 className="text-sm font-black text-white tracking-widest uppercase">
                  WealthGlobalFinance
                </h1>
                <p className="text-[9px] text-[#beae4f] font-mono font-semibold">
                  FINANCE SYSTEM
                </p>
              </div>
            </div>
            
            <nav className="space-y-2 flex-1">
              {['home', 'reports', 'crypto', 'cards', 'debts', 'statements', 'notifications', 'settings'].map((sec) => (
                <button
                  key={sec}
                  onClick={() => { setActiveSection(sec); setMobileMenuOpen(false); }}
                  className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold capitalize ${
                    activeSection === sec 
                      ? 'bg-[#beae4f] text-black' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {sec === 'reports' ? 'Transfers & Reports' : sec}
                </button>
              ))}
            </nav>

            <button
              onClick={() => { setTransferModalOpen(true); setMobileMenuOpen(false); }}
              className="w-full bg-[#beae4f] text-black py-3 rounded-xl text-xs font-bold"
            >
              New Transfer Request
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Navigation */}
        <TopNav 
          activePeriod={topNavPeriod}
          onPeriodChange={setTopNavPeriod}
          notificationCount={notificationCount}
          onLogout={handleLogout}
          onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        />

        {/* Dynamic Section Renderer */}
        <main className="flex-1 p-3 sm:p-4 md:p-6 overflow-y-auto no-scrollbar safe-area-bottom">
          
          {activeSection === 'home' && (
            <div className="flex flex-col xl:flex-row gap-4 md:gap-6 h-full">
              {/* Main Dashboard Content */}
              <div className="flex-1 space-y-4 md:space-y-6">
                {/* Welcome Banner */}
                {currentLoginTime && (
                  <div className="p-[1px] rounded-2xl bg-gradient-to-b from-[#C9A84C]/15 to-[#C9A84C]/5 overflow-hidden">
                    <div className="rounded-[calc(1.4rem-1px)] p-4 bg-[#0A1628]/80 backdrop-blur-xl">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          <h2 className="text-sm font-bold text-white">
                            Welcome back, <span className="text-[#C9A84C]">EDMUND BECKER</span>!
                          </h2>
                          <p className="text-[11px] text-gray-400 mt-0.5">
                            You logged in on{' '}
                            <span className="text-gray-300 font-mono">
                              {currentLoginTime.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                            </span>
                            {' at '}
                            <span className="text-gray-300 font-mono">
                              {currentLoginTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                            </span>
                            {' UTC'}
                          </p>
                          {lastLoginTime && (
                            <p className="text-[10px] text-gray-500 mt-0.5">
                              Last login:{' '}
                              <span className="text-gray-400 font-mono">
                                {lastLoginTime.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                              </span>
                              {' at '}
                              <span className="text-gray-400 font-mono">
                                {lastLoginTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                              </span>
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="text-[10px] text-emerald-400 font-semibold font-mono uppercase tracking-wider">Session Active</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Cards + Transactions Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="p-[1px] rounded-2xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] overflow-hidden">
                    <div className="rounded-[calc(1.4rem-1px)] p-5 bg-[#0A1628]">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm font-bold text-white">My cards</h3>
                        <button className="text-xs text-gray-400 hover:text-white transition">View All</button>
                      </div>
                      <CardStack 
                        debitCard={debitCard} 
                        creditCard={creditCard}
                        onFlip={() => {}}
                      />
                    </div>
                  </div>
                  <TransactionList 
                    transfers={transfers}
                    activePeriod={topNavPeriod}
                    onViewAll={() => setActiveSection('reports')}
                  />
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <ActivityChart data={[
                    { day: 'Mo', amount: 1200 },
                    { day: 'Tu', amount: 2800 },
                    { day: 'We', amount: 1600 },
                    { day: 'Th', amount: 3200 },
                    { day: 'Fr', amount: 2400 },
                    { day: 'Sa', amount: 1800 },
                    { day: 'Su', amount: 900 },
                  ]} />
                  <PaymentsChart data={[
                    { day: 'Mo', amount: 1500 },
                    { day: 'Tu', amount: 2200 },
                    { day: 'We', amount: 1800 },
                    { day: 'Th', amount: 3500 },
                    { day: 'Fr', amount: 2800 },
                    { day: 'Sa', amount: 1200 },
                    { day: 'Su', amount: 800 },
                  ]} />
                </div>
              </div>

              {/* Right Sidebar - Desktop */}
              <div className="hidden xl:block shrink-0 w-72 2xl:w-80">
                <RightSidebar 
                  availableBalance={5248150}
                  spentBalance={3568742}
                  totalBalance={8816892}
                  categories={[
                    { name: 'Grocery', amount: 324.30, color: '#f97316', icon: '🛒' },
                    { name: 'Shopping', amount: 216.80, color: '#a855f7', icon: '🛍️' },
                    { name: 'Education', amount: 118.00, color: '#6366f1', icon: '🎓' },
                    { name: 'Transport', amount: 98.00, color: '#f97316', icon: '🚗' },
                    { name: 'Entertainment', amount: 85.60, color: '#a855f7', icon: '🎬' },
                  ]}
                />
              </div>

              {/* Mobile Balance Summary */}
              <div className="xl:hidden p-[1px] rounded-2xl bg-gradient-to-b from-[#a855f7]/20 to-[#a855f7]/5 overflow-hidden border border-[#a855f7]/20">
                <div className="rounded-[calc(1.4rem-1px)] p-3 sm:p-4 bg-[#0A1628]">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="min-w-0">
                      <p className="text-xl sm:text-2xl font-bold text-white font-mono truncate">$5,248,150.00</p>
                      <p className="text-[11px] text-gray-400">Available balance</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold text-[#C9A84C]">40%</p>
                      <p className="text-[10px] text-gray-500">Spent</p>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-[#f97316] via-[#a855f7] to-[#6366f1]" style={{ width: '40%' }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'reports' && (
            <div className="space-y-8 stagger-1">
              
              <div className="p-[1px] rounded-2xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] overflow-hidden">
                <div className="rounded-[calc(1.4rem-1px)] p-6 bg-[#0A1628]">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                    <div>
                      <h3 className="text-base font-bold text-white uppercase tracking-wider">Transfer Ledger</h3>
                      <p className="text-xs text-gray-400">Historical record of wire and local transfers.</p>
                    </div>

                    <div className="flex bg-black/40 rounded-lg p-1 border border-white/5 self-start">
                      <button
                        onClick={() => setActiveTransferTab('local')}
                        className={`px-4 py-1.5 text-xs font-bold rounded-md tactile-btn ${
                          activeTransferTab === 'local' ? 'gold-gradient text-[#0A1628]' : 'text-gray-400'
                        }`}
                      >
                        Local
                      </button>
                      <button
                        onClick={() => setActiveTransferTab('international')}
                        className={`px-4 py-1.5 text-xs font-bold rounded-md tactile-btn ${
                          activeTransferTab === 'international' ? 'gold-gradient text-[#0A1628]' : 'text-gray-400'
                        }`}
                      >
                        International
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {transfers
                      .filter(t => t.type === activeTransferTab)
                      .map((t, idx) => {
                        const staggerClass = `stagger-${Math.min(idx + 1, 6)}`;
                        const statusColors = {
                          Completed: { gradient: 'from-emerald-500/20 via-emerald-500/5 to-transparent', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', icon: 'M4.5 12.75l6 6 9-13.5' },
                          Pending: { gradient: 'from-yellow-500/20 via-yellow-500/5 to-transparent', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400', icon: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z' },
                          Onhold: { gradient: 'from-amber-500/20 via-amber-500/5 to-transparent', bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400', icon: 'M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z' },
                          Cancelled: { gradient: 'from-red-500/20 via-red-500/5 to-transparent', bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400', icon: 'M6 18L18 6M6 6l12 12' }
                        };
                        const sc = statusColors[t.status] || statusColors.Pending;

                        return (
                          <div key={t.id} className={`${staggerClass} relative rounded-2xl overflow-hidden`}>
                            <div className={`absolute inset-0 bg-gradient-to-r ${sc.gradient}`} />
                            <div className="relative p-[1px] rounded-2xl overflow-hidden">
                              <div className="rounded-[calc(1.4rem-1px)] p-4 bg-[#0A1628]/90 backdrop-blur-xl border border-white/5">
                                <div className="flex items-center gap-4">
                                  {/* Status Icon */}
                                  <div className={`w-10 h-10 rounded-full ${sc.bg} border ${sc.border} flex items-center justify-center shrink-0`}>
                                    <svg className={`w-5 h-5 ${sc.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d={sc.icon} />
                                    </svg>
                                  </div>

                                  {/* Content */}
                                  <div className="flex-1 min-w-0">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2 sm:gap-3 items-start sm:items-center">
                                      <div>
                                        <p className="text-sm font-bold text-white">{t.accName}</p>
                                        <p className="text-[10px] text-gray-500">{t.description}</p>
                                      </div>
                                      <div className="font-mono text-gray-400 text-xs">
                                        {t.accountNumber}
                                        {activeTransferTab === 'local' && <span className="block text-[10px]">Rt: {t.routingNumber || 'N/A'}</span>}
                                        {activeTransferTab === 'international' && <span className="block text-[10px] text-[#C9A84C]">SWIFT: {t.bankSwiftCode || 'N/A'}</span>}
                                      </div>
                                      <div className="text-xs text-gray-400 font-mono">{t.date}</div>
                                      <div className="text-sm font-mono font-bold text-white sm:text-right">
                                        ${t.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                      </div>
                                      <div className="sm:text-right">
                                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 ${sc.bg} ${sc.text} border ${sc.border} shrink-0`}>
                                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d={sc.icon} />
                                          </svg>
                                          {t.status}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
              

            </div>
          )}

          {activeSection === 'crypto' && (
            <div className="space-y-8">
              
              <div className="p-[1px] rounded-2xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] overflow-hidden">
                <div className="rounded-[calc(1.4rem-1px)] p-6 bg-[#0A1628]">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-8">
                    <div>
                      <h3 className="text-base font-bold text-white uppercase tracking-wider">Assets Balance</h3>
                      <p className="text-xs text-gray-400">Conversion rates, balances, and purchase capability.</p>
                    </div>
                    <div className="bg-black/30 border border-white/5 p-3 sm:p-4 rounded-xl font-mono text-right shrink-0 min-w-0">
                      <span className="text-[10px] text-gray-500 uppercase block mb-1">Total Portfolio</span>
                      <span className="text-base sm:text-lg md:text-xl font-bold text-[#C9A84C] whitespace-nowrap">
                        ${totalCryptoUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {cryptos.map((coin, idx) => {
                      const priceInfo = cryptoPrices[coin.id] || { currentPrice: 0, percentageChange: 0 };
                      const coinValueUSD = coin.holdings * priceInfo.currentPrice;
                      const staggerClass = `stagger-${idx + 1}`;

                      return (
                        <div key={coin.id} className={`${staggerClass} p-[1px] rounded-2xl bg-gradient-to-b from-white/[0.06] to-transparent overflow-hidden`}>
                          <div className="rounded-[calc(1.4rem-1px)] p-5 bg-[#0A1628] spring-transition hover:bg-black/30">
                            <div className="flex justify-between items-start">
                              <div className="flex items-center gap-3">
                                <CryptoIcon id={coin.id} size={40} />
                                <div>
                                  <h4 className="text-sm font-bold text-white">{coin.name}</h4>
                                  <p className="text-xs text-[#C9A84C] font-mono">${priceInfo.currentPrice.toLocaleString()} USD</p>
                                </div>
                              </div>
                              <span className={`text-xs font-mono font-bold ${priceInfo.percentageChange >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                {priceInfo.percentageChange >= 0 ? '+' : ''}{priceInfo.percentageChange.toFixed(2)}%
                              </span>
                            </div>

                            <div className="grid grid-cols-3 gap-2 sm:gap-3 my-4 py-4 border-t border-b border-white/5">
                              <div>
                                <span className="text-[8px] sm:text-[9px] text-gray-500 uppercase font-medium">Buy Price</span>
                                <p className="text-[10px] sm:text-xs font-mono font-bold text-emerald-400">${priceInfo.buyPrice?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '—'}</p>
                              </div>
                              <div className="text-center">
                                <span className="text-[8px] sm:text-[9px] text-gray-500 uppercase font-medium">Spread</span>
                                <p className="text-[10px] sm:text-xs font-mono font-bold text-[#C9A84C]">{priceInfo.spreadPct?.toFixed(2) || '—'}%</p>
                              </div>
                              <div className="text-right">
                                <span className="text-[8px] sm:text-[9px] text-gray-500 uppercase font-medium">Sell Price</span>
                                <p className="text-[10px] sm:text-xs font-mono font-bold text-red-400">${priceInfo.sellPrice?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '—'}</p>
                              </div>
                            </div>

                            <div className="flex justify-between items-center mb-4">
                              <div>
                                <span className="text-[10px] text-gray-500 uppercase font-medium">Holdings</span>
                                <p className="text-sm font-mono font-bold text-white">{coin.holdings.toFixed(8)} {coin.symbol}</p>
                              </div>
                              <div className="text-right">
                                <span className="text-[10px] text-gray-500 uppercase font-medium">USD Value</span>
                                <p className="text-sm font-mono font-bold text-[#C9A84C]">${coinValueUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                              </div>
                            </div>

                            <div className="flex gap-3">
                              <button
                                onClick={() => { setSelectedCoin(coin.id); setCryptoModalMode('buy'); setCryptoModalOpen(true); }}
                                className="flex-1 py-2.5 min-h-[44px] gold-gradient text-[#0A1628] text-xs font-bold rounded-xl tactile-btn shadow-lg shadow-[#C9A84C]/20"
                              >
                                Buy {coin.symbol}
                              </button>
                              <button
                                onClick={() => { setSelectedCoin(coin.id); setCryptoModalMode('receive'); setCryptoModalOpen(true); }}
                                className="flex-1 py-2.5 min-h-[44px] bg-white/5 border border-white/10 text-white text-xs font-semibold rounded-xl tactile-btn hover:bg-white/10"
                              >
                                Receive
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>
          )}

          {activeSection === 'cards' && (
            <div className="space-y-8">
              
              <div className="p-[1px] rounded-2xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] overflow-hidden">
                <div className="rounded-[calc(1.4rem-1px)] p-4 sm:p-5 md:p-6 bg-[#0A1628]">
                  <div className="mb-6 md:mb-8">
                    <h3 className="text-base font-bold text-white uppercase tracking-wider">Card Management</h3>
                    <p className="text-xs text-gray-400">Manage debit and credit cards.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 justify-items-center">
                    
                    <div className="w-full max-w-[360px] stagger-1">
                      <div className="p-[1px] rounded-2xl bg-gradient-to-b from-white/[0.06] to-transparent overflow-hidden">
                        <div className="rounded-[calc(1.4rem-1px)] p-4 bg-[#0A1628] spring-transition hover:bg-black/30 flex flex-col justify-between gap-6">
                          <div>
                            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">Checking Debit</h4>
                            <p className="text-[11px] text-gray-400">Linked to checking account •• 5959.</p>
                          </div>

                          <CardStack debitCard={debitCard} creditCard={null} />

                          <div className="space-y-2 mt-2">
                            <div className="flex justify-between text-xs py-1.5 border-b border-white/5">
                              <span className="text-gray-400">Status</span>
                              <span className="text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> ACTIVE
                              </span>
                            </div>
                            <div className="flex justify-between text-xs py-1.5 border-b border-white/5">
                              <span className="text-gray-400">Issued to</span>
                              <span className="text-white font-mono">{debitCard.nameOnCard}</span>
                            </div>
                          </div>

                          <button
                            onClick={() => { setApplyCardType('debit'); setNewCardName(debitCard.nameOnCard); setShowApplyModal(true); }}
                            className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-semibold rounded-xl tactile-btn"
                          >
                            Re-issue
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="w-full max-w-[360px] stagger-2">
                      <div className="p-[1px] rounded-2xl bg-gradient-to-b from-white/[0.06] to-transparent overflow-hidden">
                        <div className="rounded-[calc(1.4rem-1px)] p-4 bg-[#0A1628] spring-transition hover:bg-black/30 flex flex-col justify-between gap-6">
                          <div>
                            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">Premium Credit</h4>
                            <p className="text-[11px] text-gray-400">Separate line of credit with premium access.</p>
                          </div>

                           {creditCard ? (
                            <>
                              <CardStack debitCard={debitCard} creditCard={creditCard} />
                              
                              <div className="space-y-2 mt-2">
                                <div className="flex justify-between text-xs py-1.5 border-b border-white/5">
                                  <span className="text-gray-400">Status</span>
                                  <span className="text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> ACTIVE
                                  </span>
                                </div>
                                <div className="flex justify-between text-xs py-1.5 border-b border-white/5">
                                  <span className="text-gray-400">Limit</span>
                                  <span className="text-white font-mono">$50,000.00</span>
                                </div>
                              </div>

                              <button
                                onClick={() => { setApplyCardType('credit'); setNewCardName(creditCard.nameOnCard); setShowApplyModal(true); }}
                                className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-semibold rounded-xl tactile-btn"
                              >
                                Modify
                              </button>
                            </>
                          ) : (
                            <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
                              <Lock className="w-12 h-12 text-[#C9A84C] mb-3 animate-pulse" />
                              <h5 className="text-sm font-bold text-white mb-1">No Credit Card</h5>
                              <p className="text-xs text-gray-500 max-w-[200px] mb-6">
                                Apply for a premium credit line.
                              </p>
                              <button
                                onClick={() => { 
                                  if (isRestricted) {
                                    setShowRestriction(true);
                                  } else {
                                    setApplyCardType('credit'); 
                                    setNewCardName('EDMUND BECKER'); 
                                    setShowApplyModal(true); 
                                  }
                                }}
                                className="px-6 py-2 gold-gradient text-[#0A1628] text-xs font-bold rounded-xl tactile-btn shadow-lg shadow-[#C9A84C]/20"
                              >
                                Apply Now
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

            </div>
          )}

          {activeSection === 'debts' && (
            <DebtsPage />
          )}

          {activeSection === 'statements' && (
            <div className="space-y-8">
              
              <div className="p-[1px] rounded-2xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] overflow-hidden">
                  <div className="rounded-[calc(1.4rem-1px)] p-4 sm:p-6 md:p-8 bg-[#0A1628] max-w-4xl mx-auto space-y-6 md:space-y-8">
                    
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 border-b border-white/10 pb-6">
                    <div>
                      <h2 className="text-lg font-black text-white uppercase tracking-wider">WealthGlobalFinance Group</h2>
                      <p className="text-xs text-gray-500 font-mono">Statement Period: Jul 01, 2025 — Jun 27, 2026</p>
                      <p className="text-xs text-gray-500">Issued: 2026-06-27</p>
                    </div>
                    <div className="sm:text-right">
                      <span className="text-xs font-bold text-[#C9A84C] uppercase tracking-widest block mb-1">Official Document</span>
                      <p className="text-xs text-gray-400">Beneficiary: EDMUND BECKER</p>
                      <p className="text-xs text-gray-400">Account: AFG-1768472-5959</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 font-mono">
                    {/* Starting Balance - Blue theme */}
                    <div className="relative rounded-2xl overflow-hidden stagger-1">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-blue-500/5 to-transparent" />
                      <div className="relative p-[1px] rounded-2xl overflow-hidden">
                        <div className="rounded-[calc(1.4rem-1px)] p-4 bg-[#0A1628]/90 backdrop-blur-xl border border-white/5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center shrink-0">
                              <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div>
                              <span className="text-[9px] text-gray-500 block mb-1 uppercase">Starting Balance</span>
                              <span className="text-sm font-bold text-white">$1,632,400.00</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Withdrawals - Red theme */}
                    <div className="relative rounded-2xl overflow-hidden stagger-2">
                      <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-red-500/5 to-transparent" />
                      <div className="relative p-[1px] rounded-2xl overflow-hidden">
                        <div className="rounded-[calc(1.4rem-1px)] p-4 bg-[#0A1628]/90 backdrop-blur-xl border border-white/5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center shrink-0">
                              <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15m0 0l6.75 6.75M19.5 12l-6.75-6.75" />
                              </svg>
                            </div>
                            <div>
                              <span className="text-[9px] text-gray-500 block mb-1 uppercase">Withdrawals</span>
                              <span className="text-sm font-bold text-red-400">-$32,400.00</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Ending Balance - Gold theme */}
                    <div className="relative rounded-2xl overflow-hidden stagger-3">
                      <div className="absolute inset-0 bg-gradient-to-r from-[#C9A84C]/20 via-[#C9A84C]/5 to-transparent" />
                      <div className="relative p-[1px] rounded-2xl overflow-hidden">
                        <div className="rounded-[calc(1.4rem-1px)] p-4 bg-[#0A1628]/90 backdrop-blur-xl border border-white/5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/30 flex items-center justify-center shrink-0">
                              <svg className="w-5 h-5 text-[#C9A84C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                              </svg>
                            </div>
                            <div>
                              <span className="text-[9px] text-gray-500 block mb-1 uppercase">Ending Balance</span>
                              <span className="text-sm font-bold text-[#C9A84C]">${checkingBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Transaction Summary</h4>
                    <div className="space-y-3">
                      {transfers.slice(0, 8).map((t, idx) => {
                        const staggerClass = `stagger-${Math.min(idx + 1, 6)}`;
                        const isOutgoing = t.type === 'outgoing' || t.type === 'transfer';
                        
                        return (
                          <div key={idx} className={`${staggerClass} relative rounded-2xl overflow-hidden`}>
                            {/* Glass card with gradient accent */}
                            <div className={`absolute inset-0 bg-gradient-to-r ${isOutgoing ? 'from-red-500/20 via-red-500/5 to-transparent' : 'from-emerald-500/20 via-emerald-500/5 to-transparent'}`} />
                            <div className="relative p-[1px] rounded-2xl overflow-hidden">
                              <div className="rounded-[calc(1.4rem-1px)] p-4 bg-[#0A1628]/90 backdrop-blur-xl border border-white/5">
                                <div className="flex gap-4">
                                  {/* Icon */}
                                  <div className={`w-10 h-10 rounded-full ${isOutgoing ? 'bg-red-500/10 border-red-500/30' : 'bg-emerald-500/10 border-emerald-500/30'} border flex items-center justify-center shrink-0`}>
                                    {isOutgoing ? (
                                      <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                                      </svg>
                                    ) : (
                                      <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15m0 0l6.75 6.75M19.5 12l-6.75-6.75" />
                                      </svg>
                                    )}
                                  </div>

                                  {/* Content */}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-1 gap-2">
                                      <h4 className="text-sm font-bold text-white">{t.accName}</h4>
                                      <span className={`text-sm font-mono font-bold ${isOutgoing ? 'text-red-400' : 'text-emerald-400'}`}>
                                        {isOutgoing ? '-' : '+'}${t.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                      </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                      <span className="text-[10px] text-gray-500 uppercase">{t.type} wire · {t.status}</span>
                                      <span className="text-[10px] font-mono text-gray-500 bg-black/30 px-2 py-0.5 rounded-md border border-white/5">
                                        {t.date}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/10 flex justify-end gap-3">
                    <button 
                      onClick={() => window.print()}
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 border border-white/10 tactile-btn"
                    >
                      <Printer className="w-4 h-4 text-[#C9A84C]" /> Print
                    </button>
                    <button 
                      onClick={() => alert('Transaction logs compiled in PDF/CSV format.')}
                      className="px-4 py-2 gold-gradient text-[#0A1628] rounded-lg text-xs font-extrabold flex items-center gap-1.5 tactile-btn shadow-lg shadow-[#C9A84C]/20"
                    >
                      <Download className="w-4 h-4" /> Export
                    </button>
                  </div>

                </div>
              </div>

            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="max-w-3xl mx-auto space-y-6">
              
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-base font-bold text-white uppercase tracking-wider">Alerts & Notices</h3>
                  <p className="text-xs text-gray-400">Notifications, compliance directives, and payment vouchers.</p>
                </div>
                {notificationCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs text-[#C9A84C] hover:underline font-bold tactile-btn"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {notifications.map((n, idx) => {
                  const staggerClass = `stagger-${Math.min(idx + 1, 6)}`;
                  const type = n.type || 'info';
                  
                  const gradientMap = {
                    info: 'from-blue-500/30 via-blue-500/10 to-transparent',
                    success: 'from-emerald-500/30 via-emerald-500/10 to-transparent',
                    error: 'from-red-500/30 via-red-500/10 to-transparent'
                  };
                  
                  const iconBgMap = {
                    info: 'bg-blue-500/10 border-blue-500/30',
                    success: 'bg-emerald-500/10 border-emerald-500/30',
                    error: 'bg-red-500/10 border-red-500/30'
                  };
                  
                  const iconColorMap = {
                    info: 'text-blue-400',
                    success: 'text-emerald-400',
                    error: 'text-red-400'
                  };

                  return (
                    <div key={n.id} className={`${staggerClass} relative rounded-2xl overflow-hidden`}>
                      {/* Glass card with gradient accent */}
                      <div className={`absolute inset-0 bg-gradient-to-r ${gradientMap[type]}`} />
                      <div className="relative p-[1px] rounded-2xl overflow-hidden">
                        <div className="rounded-[calc(1.4rem-1px)] p-5 bg-[#0A1628]/90 backdrop-blur-xl border border-white/5">
                          <div className="flex gap-4">
                            {/* Icon */}
                            <div className={`w-10 h-10 rounded-full ${iconBgMap[type]} border flex items-center justify-center shrink-0`}>
                              {type === 'success' && (
                                <svg className={`w-5 h-5 ${iconColorMap[type]}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                              )}
                              {type === 'error' && (
                                <svg className={`w-5 h-5 ${iconColorMap[type]}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              )}
                              {type === 'info' && (
                                <svg className={`w-5 h-5 ${iconColorMap[type]}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                                </svg>
                              )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start mb-2 gap-2">
                                <h4 className="text-sm font-bold text-white">{n.title}</h4>
                                <span className="text-[10px] font-mono text-gray-500 shrink-0 bg-black/30 px-2 py-0.5 rounded-md border border-white/5">
                                  {n.date}
                                </span>
                              </div>
                              <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-line break-words">
                                {n.message}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {activeSection === 'settings' && (
            <SettingsPage onLogout={handleLogout} />
          )}

        </main>
      </div>

      {/* Modals overlays */}
      <TransferModal 
        isOpen={transferModalOpen}
        onClose={() => setTransferModalOpen(false)}
        availableBalance={checkingBalance}
        onNewTransfer={handleNewTransfer}
        isRestricted={isRestricted}
      />

      <CryptoModal 
        isOpen={cryptoModalOpen}
        onClose={() => setCryptoModalOpen(false)}
        mode={cryptoModalMode}
        cryptos={cryptos}
        availableBalance={checkingBalance}
        onCryptoAction={handleCryptoAction}
        selectedCoin={selectedCoin}
        setSelectedCoin={setSelectedCoin}
        isRestricted={isRestricted}
      />

      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="w-full max-w-sm p-[1px] rounded-2xl bg-gradient-to-b from-white/[0.10] to-white/[0.03] overflow-hidden shadow-2xl">
            <div className="rounded-[calc(1.4rem-1px)] p-6 bg-[#0A1628]/95 backdrop-blur-2xl">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
                Apply for {applyCardType === 'debit' ? 'Debit' : 'Credit'} Card
              </h3>
              <p className="text-xs text-gray-400 mb-6">
                Enter the name to appear embossed on the card.
              </p>

              <form onSubmit={handleApplyCardSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newCardName}
                    onChange={(e) => setNewCardName(e.target.value)}
                    className="w-full bg-[#0A1628] border border-white/10 rounded-lg px-3 py-2 text-sm text-white gold-focus"
                    placeholder="EDMUND BECKER"
                  />
                </div>

                <div className="p-3 bg-[#C9A84C]/5 rounded-lg border border-[#C9A84C]/10 flex gap-2">
                  <AlertCircle className="w-4 h-4 text-[#C9A84C] shrink-0 mt-0.5" />
                  <p className="text-[10px] text-gray-400 leading-normal">
                    No additional fees. Cards are authorized and loaded for digital NFC.
                  </p>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowApplyModal(false)}
                    className="flex-1 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs text-white tactile-btn"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 gold-gradient text-[#0A1628] font-bold rounded-xl text-xs tactile-btn shadow-lg shadow-[#C9A84C]/20"
                  >
                    Generate Key
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <RestrictionModal 
        isOpen={showRestriction} 
        onClose={() => setShowRestriction(false)} 
      />

    </div>
    </DebtProvider>
  );
}

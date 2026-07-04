import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Landmark, 
  ChevronDown, 
  Mail, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Smartphone, 
  CreditCard, 
  DollarSign, 
  CheckCircle2, 
  X,
  Lock,
  ArrowRightLeft,
  Briefcase,
  GraduationCap,
  Sun,
  Moon,
  Star,
  Globe,
  TrendingUp,
  Users,
  Phone,
  ChevronRight,
  Calculator,
  Quote,
  MapPin,
  Send,
  Menu,
  Award,
  BarChart3,
  Wallet,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import CardNav, { CardNavItem } from './CardNav';
import Logo from './Logo';
import { useSettings } from '../lib/SettingsContext';

import heroGoldVault from '../assets/images/hero_gold_vault_1782591901728.jpg';
import heroSkyscraper from '../assets/images/hero_skyscraper_1782591915317.jpg';
import tradingAnalytics from '../assets/images/trading_analytics_1782591930265.jpg';
import secureServerRoom from '../assets/images/secure_server_room_1782591944236.jpg';
import { SpiralAnimation } from './ui/spiral-animation';
import { SpiralDemo } from './ui/demo';

interface LandingPageProps {
  onLoginSuccess: () => void;
}

function RevealSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const [revealed, setRevealed] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setRevealed(true); obs.disconnect(); } },
      { threshold: 0.05 }
    );
    obs.observe(el);
    const fallback = setTimeout(() => setRevealed(true), 2000);
    return () => { obs.disconnect(); clearTimeout(fallback); };
  }, []);
  return (
    <div
      ref={ref}
      className={`${className} transition-all duration-700 ease-out ${revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
      {children}
    </div>
  );
}


export default function LandingPage({ 
  onLoginSuccess,
}: LandingPageProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { settings, updateSetting } = useSettings();
  const [activeTab, setActiveTab] = useState<'business' | 'individual'>('business');
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showImmersiveDemo, setShowImmersiveDemo] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [loginError, setLoginError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirm, setSignUpConfirm] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [signUpError, setSignUpError] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpExpiry, setOtpExpiry] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Sync sign-in modal with URL
  useEffect(() => {
    if (location.pathname === '/signin') {
      setShowSignInModal(true);
    }
  }, [location.pathname]);

  // Update URL when modal opens/closes
  const openSignIn = () => {
    setShowSignInModal(true);
    navigate('/signin', { replace: true });
  };

  const closeSignIn = () => {
    setShowSignInModal(false);
    setOtpSent(false);
    setOtpCode('');
    setLoginError('');
    setShowSignUp(false);
    setSignUpError('');
    setSignUpName('');
    setSignUpEmail('');
    setSignUpPassword('');
    setSignUpConfirm('');
    setAgreeToTerms(false);
    navigate('/', { replace: true });
  };

  // Login page image slideshow
  const [loginSlideIndex, setLoginSlideIndex] = useState(0);
  const loginSlides = [
    { image: heroGoldVault, text: 'Capturing Moments, Creating Memories' },
    { image: heroSkyscraper, text: 'Building Wealth, Securing Futures' },
    { image: tradingAnalytics, text: 'Smart Investments, Real Returns' },
    { image: secureServerRoom, text: 'Your Security, Our Priority' },
  ];

  useEffect(() => {
    if (!showSignInModal) return;
    const interval = setInterval(() => {
      setLoginSlideIndex(prev => (prev + 1) % loginSlides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [showSignInModal, loginSlides.length]);

  const generateOtp = () => {
    const buffer = new Uint32Array(1);
    crypto.getRandomValues(buffer);
    const code = String(buffer[0] % 1000000).padStart(6, '0');
    setGeneratedOtp(code);
    setOtpExpiry(Date.now() + 10 * 60 * 1000);
    return code;
  };
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      title: "Enjoy zero fee banking on your savings account",
      subtitle: "Flexi Savings • Earn up to 4.5% APY",
      desc: "Maximize returns without hidden charges or minimum balance penalties.",
      bg: "bg-[#090e10]",
      accent: "#beae4f",
      image: heroGoldVault
    },
    {
      title: "Fuel your business growth with low-collateral loans",
      subtitle: "Business Financing • From 8.5% APR",
      desc: "Fast-tracked operational capital to expand your commercial horizon.",
      bg: "bg-[#0e1214]",
      accent: "#ffd700",
      image: heroSkyscraper
    },
    {
      title: "Maximize transaction benefits with premium cards",
      subtitle: "Elite Credit Cards • 0% Annual Fee",
      desc: "Gain up to 5% instant cashback on high-value corporate expenditures.",
      bg: "bg-[#070b0c]",
      accent: "#beae4f",
      image: tradingAnalytics
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const [loanType, setLoanType] = useState<'home' | 'auto' | 'personal' | 'education' | 'mortgage'>('home');
  const [loanAmount, setLoanAmount] = useState(500000);
  const [loanTerm, setLoanTerm] = useState(30);
  const [interestRate, setInterestRate] = useState(6.75);

  useEffect(() => {
    if (loanType === 'home') { setLoanAmount(500000); setLoanTerm(30); setInterestRate(6.75); }
    else if (loanType === 'auto') { setLoanAmount(45000); setLoanTerm(5); setInterestRate(5.25); }
    else if (loanType === 'personal') { setLoanAmount(25000); setLoanTerm(3); setInterestRate(8.5); }
    else if (loanType === 'education') { setLoanAmount(60000); setLoanTerm(10); setInterestRate(4.25); }
    else if (loanType === 'mortgage') { setLoanAmount(350000); setLoanTerm(30); setInterestRate(6.25); }
  }, [loanType]);

  const monthlyRate = (interestRate / 100) / 12;
  const numberOfPayments = loanTerm * 12;
  const monthlyPayment = 
    monthlyRate === 0 
      ? loanAmount / numberOfPayments 
      : (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  const totalRepayment = monthlyPayment * numberOfPayments;
  const totalInterest = totalRepayment - loanAmount;

  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const faqs = [
    {
      q: "How do I open a new high-yield vault account?",
      a: "To request a new checking or high-yield savings vault, click the 'New Account' CTA button in our header and provide valid state credentials. Once processed, our automated compliance system initiates secure login details."
    },
    {
      q: "Are wire transfers subject to administrative compliance reviews?",
      a: "Yes. All high-value domestic and international wire transfers are verified for compliance coordinates and anti-money laundering regulations. Pending status resolves within standard administrative review cycles."
    },
    {
      q: "What measures protect my digital crypto portfolio vault?",
      a: "All assets are secured within cold-storage vaults protected by multi-signature validation and military-grade SSL transport encryption layers. Deposited digital funds are immutable and instantly credited."
    },
    {
      q: "How can I activate my premium physical debit or credit cards?",
      a: "Once you submit a card name request inside the WealthGlobalFinance Dashboard, your activation code is instantly prepared. Simply enter this administrative transit code to activate real-time card services."
    }
  ];

  const [cardTab, setCardTab] = useState<'rewards' | 'cashback' | 'travel'>('rewards');

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { setLoginError('Please enter a valid account email.'); return; }
    if (!password) { setLoginError('Please enter your password.'); return; }
    if (email !== 'edmund.becker88@gmail.com' || password !== 'B3cker!20#Rise') {
      setLoginError('Invalid email or password. Please try again.');
      return;
    }
    setLoginError('');
    setOtpCode('');
    setShowSignUp(false);
    generateOtp();
    setOtpSent(true);
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUpName.trim()) { setSignUpError('Full name is required.'); return; }
    if (!signUpEmail.trim()) { setSignUpError('Email address is required.'); return; }
    if (!signUpPassword) { setSignUpError('Password is required.'); return; }
    if (signUpPassword.length < 8) { setSignUpError('Password must be at least 8 characters.'); return; }
    if (signUpPassword !== signUpConfirm) { setSignUpError('Passwords do not match.'); return; }
    if (!agreeToTerms) { setSignUpError('You must agree to the terms and conditions.'); return; }
    setSignUpError('');
    setOtpCode('');
    setEmail(signUpEmail);
    setPassword(signUpPassword);
    setShowSignUp(false);
    generateOtp();
    setOtpSent(true);
  };

  const handleOtpVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode) {
      setLoginError('Please provide verification OTP pin.');
      return;
    }
    if (Date.now() > otpExpiry) {
      setLoginError('OTP has expired. Please request a new one.');
      return;
    }
    if (otpCode !== generatedOtp) {
      setLoginError('Invalid OTP. Please try again.');
      return;
    }
    onLoginSuccess();
    setShowSignInModal(false);
  };

  // Canvas particle animation for sign-in modal
  useEffect(() => {
    if (!showSignInModal) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    const particles: { x: number; y: number; vx: number; vy: number; size: number; opacity: number; gold: boolean }[] = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5, opacity: Math.random() * 0.4 + 0.1,
        gold: Math.random() > 0.7
      });
    }
    const resize = () => { w = canvas!.width = window.innerWidth; h = canvas!.height = window.innerHeight; };
    window.addEventListener('resize', resize);
    let animId: number;
    const animate = () => {
      ctx!.clearRect(0, 0, w, h);
      const grad = ctx!.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w);
      grad.addColorStop(0, 'rgba(26, 35, 66, 0.3)');
      grad.addColorStop(1, 'rgba(10, 14, 26, 0)');
      ctx!.fillStyle = grad;
      ctx!.fillRect(0, 0, w, h);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx!.fillStyle = p.gold ? `rgba(201,162,39,${p.opacity})` : `rgba(139,146,168,${p.opacity * 0.5})`;
        ctx!.fill();
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx!.beginPath();
            ctx!.moveTo(particles[i].x, particles[i].y);
            ctx!.lineTo(particles[j].x, particles[j].y);
            ctx!.strokeStyle = `rgba(139,146,168,${0.08 * (1 - dist / 150)})`;
            ctx!.lineWidth = 0.5;
            ctx!.stroke();
          }
        }
      }
      animId = requestAnimationFrame(animate);
    };
    animate();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, [showSignInModal]);

  function useCountUp(target: number, duration = 2, start = false) {
    const [count, setCount] = useState(0);
    useEffect(() => {
      if (!start) return;
      let startTime: number;
      const step = (ts: number) => {
        if (!startTime) startTime = ts;
        const progress = Math.min((ts - startTime) / (duration * 1000), 1);
        setCount(Math.floor(progress * target));
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, [target, duration, start]);
    return count;
  }

  function CounterSection() {
    const [revealed, setRevealed] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
      const el = ref.current;
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) { setRevealed(true); obs.disconnect(); } },
        { threshold: 0.2 }
      );
      obs.observe(el);
      return () => obs.disconnect();
    }, []);
    const clients = useCountUp(12000, 2.5, revealed);
    const transactions = useCountUp(450000, 2.5, revealed);
    const countries = useCountUp(85, 2.5, revealed);
    const assets = useCountUp(28, 2.5, revealed);

    return (
      <div
        ref={ref}
        className={`max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/5 transition-all duration-700 ease-out ${revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        {[
          { value: clients, suffix: '+', label: 'Active Clients', icon: Users },
          { value: transactions, suffix: '+', label: 'Transactions Completed', icon: ArrowRightLeft },
          { value: countries, suffix: '+', label: 'Countries Served', icon: Globe },
          { value: assets, suffix: 'B+', label: 'Assets Under Management', icon: TrendingUp },
        ].map((stat, i) => (
          <div key={i} className="bg-[#0A1628]/80 p-6 md:p-8 text-center">
            <stat.icon className="w-5 h-5 text-[#C9A84C] mx-auto mb-3" />
            <div className="text-3xl md:text-4xl font-bold text-white font-heading">
              {stat.value.toLocaleString()}{stat.suffix}
            </div>
            <p className="text-xs text-gray-400 mt-1 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>
    );
  }
  

  return (
    <div className="relative bg-[#0A1628] text-white min-h-screen flex flex-col font-sans selection:bg-[#C9A84C]/30 selection:text-[#C9A84C] overflow-x-hidden">
      
      {/* Cinematic ambient background */}
      <div className="fixed inset-0 z-0 pointer-events-none select-none overflow-hidden">
        <div className="absolute inset-0 bg-[#0A1628]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(201,168,76,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(201,168,76,0.02)_1px,transparent_1px)] bg-[size:60px_60px]"
          style={{
            maskImage: 'radial-gradient(ellipse 60% 50% at 50% 10%, #000 30%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 60% 50% at 50% 10%, #000 30%, transparent 100%)'
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_60%_at_50%_0%,rgba(201,168,76,0.08)_0%,transparent_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_80%,rgba(201,168,76,0.03)_0%,transparent_50%)]" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0A1628] to-transparent" />
      </div>

      <div className="fixed inset-0 z-0 pointer-events-none select-none opacity-[0.15]">
        <SpiralAnimation />
      </div>

      <div className="relative z-10 bg-gradient-to-r from-[#C9A84C]/10 via-[#C9A84C]/5 to-transparent border-b border-[#C9A84C]/10 text-[11px] text-gray-400 py-2 px-4 md:px-12 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 sm:gap-0">
        <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
          <button 
            onClick={openSignIn}
            className="flex items-center gap-1.5 text-[#C9A84C] hover:text-white font-bold transition uppercase tracking-wider"
          >
            <Lock className="w-3.5 h-3.5" /> Online Access
          </button>
          <span className="text-white/5 hidden sm:inline">|</span>
          <a href="mailto:support@wealthglobalfinance.com" className="flex items-center gap-1.5 hover:text-white transition truncate">
            <Mail className="w-3.5 h-3.5 text-[#C9A84C] shrink-0" /> <span className="truncate hidden sm:inline">support@wealthglobalfinance.com</span><span className="sm:hidden">Support</span>
          </a>
        </div>
        <div className="hidden md:flex items-center gap-6 font-semibold">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> SECURE SSL ENCRYPTED
          </span>
          <button onClick={() => alert('Support chat is active. Please login to speak to an agent.')} className="hover:text-white transition text-[#C9A84C]">
            Get Help & Support
          </button>
        </div>
      </div>
      

      {/* Sticky navbar */}
      <div className="sticky top-0 z-40 bg-[#0A1628]/80 backdrop-blur-xl border-b border-white/5 py-3">
        <CardNav
          logo={
            <div className="flex items-center gap-2 md:gap-3">
              <Logo size={32} variant="compact" />
              <div className="text-left">
                <h1 className="text-[10px] md:text-xs font-black text-white tracking-widest uppercase leading-none font-heading">WealthGlobalFinance</h1>
                <p className="text-[7px] text-[#C9A84C] font-mono tracking-widest font-bold leading-none mt-0.5">FINANCE SYSTEM</p>
              </div>
            </div>
          }
          items={[
            {
              label: "Vault Services",
              bgColor: 'rgba(201, 168, 76, 0.1)',
              textColor: '#FFFFFF',
              links: [
                { label: "High-yield Checking Vault", onClick: () => setShowSignInModal(true) },
                { label: "Multi-Currency Savings", onClick: () => setShowSignInModal(true) },
                { label: "Corporate Business Account", onClick: () => setShowSignInModal(true) }
              ]
            },
            {
              label: "Investments",
              bgColor: 'rgba(201, 168, 76, 0.1)',
              textColor: '#FFFFFF',
              links: [
                { label: "Crypto Portfolio", onClick: () => setShowSignInModal(true) },
                { label: "Tax-Deferred Investment", onClick: () => setShowSignInModal(true) },
                { label: "Advisory Vouchers", onClick: () => setShowSignInModal(true) }
              ]
            },
            {
              label: "Resources",
              bgColor: 'rgba(201, 168, 76, 0.1)',
              textColor: '#FFFFFF',
              links: [
                { label: "Loan Pricing", href: "#calculators" },
                { label: "Premium Cards", href: "#cards" },
                { label: "Frequently Asked Questions", href: "#faq" }
              ]
            }
          ]}
          rightActions={
            <>
              <button 
                onClick={() => updateSetting('theme', settings.theme === 'light' ? 'dark' : 'light')}
                className="card-nav-icon-btn"
                title={`Switch to ${settings.theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {settings.theme === 'light' ? (
                  <Moon className="w-3.5 h-3.5 text-[var(--primary)]" />
                ) : (
                  <Sun className="w-3.5 h-3.5 text-[var(--primary)]" />
                )}
              </button>
              <button 
                onClick={openSignIn}
                className="card-nav-signin-btn"
              >
                <span>Sign In</span>
                <ArrowRight className="w-3 h-3 text-[#C9A84C]" />
              </button>
            </>
          }
          ctaText="New Account"
          onCtaClick={openSignIn}
          buttonBgColor="#C9A84C"
          buttonTextColor="#0A1628"
        />
      </div>


      <section className="relative overflow-hidden min-h-[90vh] flex items-center py-24 px-6 md:px-12 border-b border-white/5">
        <div className="absolute inset-0 z-0 overflow-hidden select-none pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentSlide}
              src={slides[currentSlide].image}
              alt=""
              referrerPolicy="no-referrer"
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 0.15, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="w-full h-full object-cover"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A1628] via-[#0A1628]/90 to-[#0A1628]/80" />
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-7 space-y-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#C9A84C]/10 border border-[#C9A84C]/20 rounded-full text-xs text-[#C9A84C] font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  {slides[currentSlide].subtitle}
                </div>
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-tight font-heading">
                  {slides[currentSlide].title}
                </h2>
                <p className="text-base md:text-lg text-gray-400 max-w-xl leading-relaxed">
                  {slides[currentSlide].desc}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="flex flex-wrap gap-4 pt-4">
              <button 
                onClick={() => setShowSignInModal(true)}
                className="px-8 py-3.5 gold-gradient text-[#0A1628] font-extrabold text-sm rounded-xl shadow-xl shadow-[#C9A84C]/20 transition active:scale-95 flex items-center gap-2 hover:shadow-[#C9A84C]/30"
              >
                Get Started Instantly <ArrowRight className="w-4 h-4" />
              </button>
              <button 
                onClick={() => alert('Consultation vouchers are scheduled inside the secure client profile.')}
                className="px-8 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-sm rounded-xl transition backdrop-blur-sm"
              >
                Book a Consultation
              </button>
              <button 
                onClick={() => setShowImmersiveDemo(true)}
                className="px-8 py-3.5 bg-[#C9A84C]/5 hover:bg-[#C9A84C]/10 border border-[#C9A84C]/30 text-[#C9A84C] font-bold text-sm rounded-xl transition flex items-center gap-2 shadow-lg shadow-[#C9A84C]/5 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" /> Immersive Portal
              </button>
            </div>

            <div className="flex gap-2.5 pt-4">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    currentSlide === idx ? 'w-10 bg-[#C9A84C] gold-glow' : 'w-2 bg-white/15 hover:bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col items-center justify-center relative min-h-[350px]">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,168,76,0.08)_0%,transparent_70%)] blur-3xl" />
            <div className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden opacity-20 border border-white/5 bg-black">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentSlide}
                  src={slides[currentSlide].image}
                  alt=""
                  referrerPolicy="no-referrer"
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 0.3, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.6 }}
                  className="w-full h-full object-cover mix-blend-lighten"
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] via-transparent to-[#0A1628]/80" />
            </div>


            <motion.div 
              className="relative w-full max-w-[340px] h-[210px] rounded-2xl p-6 text-white overflow-hidden shadow-2xl border border-white/10 bg-gradient-to-br from-[#1a2a3a] via-[#0F1D2E] to-[#0A1628] z-10 gold-glow"
              animate={{ rotateY: [0, 5, 0], y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            >
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#C9A84C]/10 rounded-full blur-3xl" />
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] tracking-wider uppercase text-gray-400">WealthGlobalFinance</p>
                  <p className="text-xs font-bold text-[#C9A84C] tracking-widest mt-1">DEBIT VAULT KEY</p>
                </div>
                <span className="text-sm font-semibold tracking-tighter text-white/80">A-Fin</span>
              </div>
              <div className="w-10 h-8 rounded bg-gradient-to-br from-yellow-200 to-amber-600 mt-5 shadow-inner" />
              <p className="font-mono text-lg tracking-[0.18em] text-center text-white mt-4">
                5453 2000 1000 1000
              </p>
              <div className="flex justify-between items-end mt-2">
                <div>
                  <p className="text-[7px] uppercase tracking-wider text-gray-500">Card Holder</p>
                  <p className="font-mono text-xs font-semibold text-white uppercase">Alexander Wright</p>
                </div>
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full bg-red-500/80 mix-blend-screen" />
                  <div className="w-6 h-6 rounded-full bg-yellow-500/80 mix-blend-screen" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Animated counters stats bar */}
      <section className="py-16 px-6 md:px-12 border-b border-white/5">
        <CounterSection />
      </section>
      

      {/* Glassmorphism services cards */}
      <RevealSection className="py-16 px-6 md:px-12 border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-3 mb-12">
            <span className="text-[10px] uppercase tracking-widest text-[#C9A84C] font-bold font-mono">Our Services</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight font-heading">Premium Banking Services</h2>
            <p className="text-sm text-gray-400 max-w-xl mx-auto">
              Comprehensive financial solutions tailored for the modern high-net-worth individual.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Landmark, title: 'Instant Online Access', desc: 'Connect and log inside your encrypted account portfolio instantly without visiting branches.', color: '#C9A84C' },
              { icon: ArrowRightLeft, title: 'Automated Wire Processing', desc: 'Send checking and savings assets domestic and global through safe encrypted routing coordinates.', color: '#C9A84C' },
              { icon: Smartphone, title: 'Mobile Ledger Vouchers', desc: 'Track assets fluctuations, tax receipt, and notification certificates inside a unified mobile workspace.', color: '#C9A84C' },
            ].map((service, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -4 }}
                className="relative group p-8 rounded-2xl border border-white/10 bg-[#0A1628]/80 hover:border-[#C9A84C]/30 transition-all duration-300"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#C9A84C]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 space-y-4">
                  <div className="p-3 bg-[#C9A84C]/10 rounded-xl text-[#C9A84C] w-fit">
                    <service.icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-white">{service.title}</h4>
                  <p className="text-sm text-gray-400 leading-relaxed">{service.desc}</p>
                  <button onClick={() => setShowSignInModal(true)} className="text-[#C9A84C] text-xs font-bold hover:underline flex items-center gap-1">
                    Learn More <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </RevealSection>
      

      {/* Why Choose Us */}
      <RevealSection className="py-20 px-6 md:px-12 border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-3 mb-12">
            <span className="text-[10px] uppercase tracking-widest text-[#C9A84C] font-bold font-mono">Why Choose Us</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight font-heading">Built for Excellence</h2>
            <p className="text-sm text-gray-400 max-w-xl mx-auto">
              We combine cutting-edge technology with white-glove service to deliver an unparalleled banking experience.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: ShieldCheck, title: 'Bank-Grade Security', desc: '256-bit encryption, multi-factor authentication, and real-time fraud monitoring.' },
              { icon: TrendingUp, title: 'Smart Investing', desc: 'AI-powered portfolio insights and automated wealth management strategies.' },
              { icon: Globe, title: 'Global Reach', desc: 'Operate in 85+ countries with zero-fee international transfers and multi-currency accounts.' },
              { icon: Award, title: 'Premium Support', desc: 'Dedicated relationship managers available 24/7 via priority phone and chat.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -4 }}
                className="text-center p-6 rounded-2xl border border-white/5 bg-[#0A1628]/80 hover:border-[#C9A84C]/30 transition-all duration-300"
              >
                <div className="p-3 bg-[#C9A84C]/10 rounded-xl text-[#C9A84C] w-fit mx-auto mb-4">
                  <item.icon className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-white mb-2">{item.title}</h4>
                <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </RevealSection>
      

      {/* Testimonials carousel */}
      <RevealSection className="py-20 px-6 md:px-12 border-b border-white/5">
        <div className="max-w-5xl mx-auto text-center space-y-12">
          <div className="space-y-3">
            <span className="text-[10px] uppercase tracking-widest text-[#C9A84C] font-bold font-mono">Testimonials</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight font-heading">What Our Clients Say</h2>
          </div>
          <div className="relative p-8 md:p-10 rounded-2xl border border-white/5 bg-[#0A1628]/80">
            <Quote className="w-12 h-12 text-[#C9A84C]/20 mx-auto mb-6" />
            <p className="text-xl md:text-2xl text-gray-200 leading-relaxed italic max-w-3xl mx-auto font-heading">
              "WealthGlobalFinance transformed the way we manage our corporate treasury. The real-time vault system and dedicated relationship team have been instrumental in our expansion across three continents."
            </p>
            <div className="mt-8 flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center text-[#0A1628] font-bold text-sm">
                SB
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-white">Sarah Bennett</p>
                <p className="text-xs text-gray-400">CFO, Meridian Global Corp</p>
              </div>
            </div>
            <div className="flex justify-center gap-2 mt-8">
              {[0, 1, 2].map((i) => (
                <div key={i} className={`w-2 h-2 rounded-full ${i === 1 ? 'bg-[#C9A84C] w-6' : 'bg-white/20'}`} />
              ))}
            </div>
          </div>
        </div>
      </RevealSection>
      

      {/* Pricing plans */}
      <RevealSection className="py-20 px-6 md:px-12 border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-3 mb-12">
            <span className="text-[10px] uppercase tracking-widest text-[#C9A84C] font-bold font-mono">Pricing</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight font-heading">Choose Your Plan</h2>
            <p className="text-sm text-gray-400 max-w-xl mx-auto">
              Flexible tiers designed for individuals, professionals, and institutions.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Basic', price: 'Free', desc: 'Essential banking for everyday needs',
                features: ['Free checking account', 'Virtual debit card', 'Mobile app access', 'Basic transaction alerts'],
                cta: 'Get Started', popular: false
              },
              {
                name: 'Premium', price: '$29/mo', desc: 'Enhanced banking with premium benefits',
                features: ['Everything in Basic', 'Premium physical card', 'Priority customer support', 'International wire transfers', 'Cashback rewards (up to 3%)'],
                cta: 'Upgrade to Premium', popular: true
              },
              {
                name: 'Private Banking', price: 'Custom', desc: 'White-glove wealth management',
                features: ['Everything in Premium', 'Dedicated relationship manager', 'Portfolio advisory', 'Private airport lounge access', 'Custom credit lines', 'Exclusive investment opportunities'],
                cta: 'Contact Advisor', popular: false
              },
            ].map((plan, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -6 }}
                className={`relative rounded-2xl p-8 border transition-all duration-300 ${
                  plan.popular
                    ? 'border-[#C9A84C]/40 bg-[#0A1628]/80 shadow-xl shadow-[#C9A84C]/10'
                    : 'border-white/10 bg-[#0A1628]/80 hover:border-[#C9A84C]/30'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#C9A84C] text-[#0A1628] text-[10px] font-bold rounded-full uppercase tracking-wider">
                    Most Popular
                  </div>
                )}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-white font-heading">{plan.name}</h3>
                    <div className="mt-2">
                      <span className="text-3xl font-bold text-white">{plan.price}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{plan.desc}</p>
                  </div>
                  <ul className="space-y-3">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-2 text-xs text-gray-300">
                        <CheckCircle2 className="w-4 h-4 text-[#C9A84C] shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => setShowSignInModal(true)}
                    className={`w-full py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider transition ${
                      plan.popular
                        ? 'gold-gradient text-[#0A1628] shadow-lg shadow-[#C9A84C]/20'
                        : 'bg-white/5 hover:bg-white/10 border border-white/10 text-white'
                    }`}
                  >
                    {plan.cta}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </RevealSection>
      

      {/* Interactive Loan Calculator Section */}
      <section id="calculators" className="py-20 px-6 md:px-12 border-b border-white/5 relative bg-gradient-to-b from-[#0A1628] to-[#0A1628]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-[10px] uppercase tracking-widest text-[#C9A84C] font-bold font-mono">Dynamic Loan Calculator</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight font-heading">Smart Calculations, Immediate Pre-approvals</h2>
            <p className="text-sm text-gray-400 max-w-xl mx-auto">
              Simulate interest rates, terms, and loan costs live using our real-time estimation engine.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0A1628]/80 overflow-hidden">
            <div className="flex overflow-x-auto border-b border-white/5 bg-[#0A1628]/80 p-1 divide-x divide-white/5 no-scrollbar">
              {[
                { id: 'home', label: 'Home Loans', icon: Landmark },
                { id: 'auto', label: 'Auto Financing', icon: Smartphone },
                { id: 'personal', label: 'Personal Loans', icon: DollarSign },
                { id: 'education', label: 'Education Loans', icon: GraduationCap },
                { id: 'mortgage', label: 'Mortgage Solutions', icon: Briefcase }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setLoanType(tab.id as any)}
                    className={`flex-1 min-w-[130px] py-3.5 px-4 text-xs font-bold transition flex items-center justify-center gap-2 ${
                      loanType === tab.id 
                        ? 'bg-[#C9A84C]/10 text-[#C9A84C]' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-[#C9A84C]" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-white/5 bg-[#0A1628]/60">
              <div className="lg:col-span-8 p-6 md:p-8 space-y-8">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-300">Loan Amount (USD)</span>
                    <span className="text-sm font-mono font-bold text-white bg-[#0A1628] px-3 py-1 rounded-lg border border-white/10">
                      ${loanAmount.toLocaleString()}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={loanType === 'auto' ? 5000 : loanType === 'personal' ? 1000 : 50000}
                    max={loanType === 'home' || loanType === 'mortgage' ? 2500000 : 150000}
                    step={loanType === 'auto' || loanType === 'personal' ? 500 : 5000}
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full accent-[#C9A84C] h-1.5 bg-white/5 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                    <span>{loanType === 'personal' ? '$1,000' : '$10,000'}</span>
                    <span>{loanType === 'home' || loanType === 'mortgage' ? '$2,500,000 Limit' : '$150,000 Limit'}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-300">Repayment Period</span>
                    <span className="text-sm font-mono font-bold text-white bg-[#0A1628] px-3 py-1 rounded-lg border border-white/10">
                      {loanTerm} Years
                    </span>
                  </div>
                  <input
                    type="range"
                    min={loanType === 'personal' ? 1 : 2}
                    max={loanType === 'home' || loanType === 'mortgage' ? 30 : 15}
                    step={1}
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(Number(e.target.value))}
                    className="w-full accent-[#C9A84C] h-1.5 bg-white/5 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                    <span>{loanType === 'personal' ? '1 Year' : '2 Years'}</span>
                    <span>{loanType === 'home' || loanType === 'mortgage' ? '30 Years Limit' : '15 Years Limit'}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-300">Interest rate (Fixed APR)</span>
                    <span className="text-sm font-mono font-bold text-[#C9A84C] bg-[#0A1628] px-3 py-1 rounded-lg border border-white/10">
                      {interestRate.toFixed(2)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={2.5}
                    max={15.0}
                    step={0.05}
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full accent-[#C9A84C] h-1.5 bg-white/5 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                    <span>2.50% Min</span>
                    <span>15.00% Max</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 p-6 md:p-8 bg-[#0A1628]/60 flex flex-col justify-between space-y-6">
                <div className="space-y-4 text-center pb-6 border-b border-white/5">
                  <div className="inline-flex p-3 rounded-full bg-[#C9A84C]/10 text-[#C9A84C] mb-2">
                    <Calculator className="w-6 h-6" />
                  </div>
                  <h4 className="text-xs uppercase tracking-wider text-gray-400">Estimated Monthly Payment</h4>
                  <p className="text-3xl font-mono font-extrabold text-[#C9A84C] tracking-tight">
                    ${monthlyPayment.toLocaleString('en-US', { maximumFractionDigits: 2 })}<span className="text-xs font-bold text-gray-500">/mo</span>
                  </p>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div className="flex justify-between text-gray-400">
                    <span>Principal Amount:</span>
                    <span className="text-white font-bold">${loanAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Total Interest Paid:</span>
                    <span className="text-red-400 font-bold">${totalInterest.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
                  </div>
                  <div className="flex justify-between text-gray-400 pt-2 border-t border-white/5">
                    <span>Total Payment Cost:</span>
                    <span className="text-[#C9A84C] font-bold">${totalRepayment.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
                  </div>
                </div>

                <button 
                  onClick={() => setShowSignInModal(true)}
                  className="w-full gold-gradient text-[#0A1628] py-3 rounded-xl font-extrabold text-xs transition uppercase tracking-wider shadow-lg shadow-[#C9A84C]/20"
                >
                  Apply For Pre-Approval
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Credit Card Finder Section */}
      <RevealSection className="py-20 px-6 md:px-12 border-b border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-3">
              <span className="text-[10px] uppercase tracking-widest text-[#C9A84C] font-bold font-mono">WealthGlobalFinance Premium Cards</span>
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight font-heading">Find the Perfect Card for Your Spending Lifestyle</h2>
              <p className="text-xs text-gray-400 leading-relaxed">
                Configure your credit coordinates with zero annual costs, customized cashback limits, and worldwide premium airport lounge passes.
              </p>
            </div>

            <div className="flex bg-[#0A1628]/80 rounded-xl p-1 border border-white/5">
              {[
                { id: 'rewards', label: 'Rewards Cards' },
                { id: 'cashback', label: 'Cashback Cards' },
                { id: 'travel', label: 'Travel Cards' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setCardTab(tab.id as any)}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                    cardTab === tab.id 
                      ? 'gold-gradient text-[#0A1628] shadow' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {cardTab === 'rewards' && (
                <div className="space-y-3 text-xs">
                  <h4 className="font-bold text-white text-sm">Maximize Every Capital Expense</h4>
                  <p className="text-gray-400 leading-relaxed">
                    Earn high-value points on essential business transactions, utility settlement, and hardware procurement. Redeem for flight coordinates, luxury gifts, or liquid account balance.
                  </p>
                  <ul className="space-y-2 text-gray-300 font-medium">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#C9A84C]" /> 2.5x Points on essential spending</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#C9A84C]" /> Guaranteed 0% APR intro for 12 months</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#C9A84C]" /> Automated zero-fee international clearing</li>
                  </ul>
                </div>
              )}
              {cardTab === 'cashback' && (
                <div className="space-y-3 text-xs">
                  <h4 className="font-bold text-white text-sm">Instant Liquid Cash Repayment</h4>
                  <p className="text-gray-400 leading-relaxed">
                    Receive up to 5% instant cashback settlement credited directly to your checking vault. No rotating calendars or administrative expenditure limits.
                  </p>
                  <ul className="space-y-2 text-gray-300 font-medium">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#C9A84C]" /> 5.00% Instant Cashback on office supplies</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#C9A84C]" /> 3.00% Cashback on gas, transport and shipping</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#C9A84C]" /> No annual credit facility maintenance fees</li>
                  </ul>
                </div>
              )}
              {cardTab === 'travel' && (
                <div className="space-y-3 text-xs">
                  <h4 className="font-bold text-white text-sm">Uncapped Worldwide Travel Passes</h4>
                  <p className="text-gray-400 leading-relaxed">
                    Unlock premium, non-restrictive flight points, hotel coordination bonuses, and secure international transport emergency coverage.
                  </p>
                  <ul className="space-y-2 text-gray-300 font-medium">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#C9A84C]" /> 3x Flight Miles on airfares and hotel coordination</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#C9A84C]" /> Complimentary Global Lounge entry vouchers</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#C9A84C]" /> Premium multi-currency conversion coordinates</li>
                  </ul>
                </div>
              )}
            </div>

            <button 
              onClick={() => { setShowSignInModal(true); }}
              className="px-6 py-3 gold-gradient text-[#0A1628] font-extrabold text-xs rounded-xl uppercase tracking-wider transition shadow-lg shadow-[#C9A84C]/20"
            >
              Compare Premium Credit Cards
            </button>
          </div>

          <div className="lg:col-span-6 relative flex justify-center">
            <div className="absolute w-72 h-72 bg-[#C9A84C]/5 blur-3xl rounded-full" />
            <div className="relative w-full max-w-[340px] h-[210px] rounded-2xl p-6 text-white overflow-hidden shadow-2xl border border-white/10 bg-gradient-to-br from-[#2c2616] via-[#1d190e] to-[#0d0a05] gold-glow">
              <div className="absolute -right-20 -top-20 w-48 h-48 rounded-full blur-3xl opacity-20 bg-[#C9A84C]" />
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[9px] tracking-wider uppercase text-gray-400">WealthGlobalFinance</p>
                  <p className="text-xs font-bold text-[#C9A84C] tracking-widest">PREMIUM ELITE CREDIT</p>
                </div>
                <span className="text-xs font-bold text-white/40 tracking-wider">PREMIUM</span>
              </div>
              <div className="w-10 h-8 rounded bg-gradient-to-br from-yellow-200 to-amber-600 mt-5 shadow-inner" />
              <p className="font-mono text-lg tracking-[0.18em] text-center text-white mt-4">
                5453 2000 1000 1000
              </p>
              <div className="flex justify-between items-end mt-2">
                <div>
                  <p className="text-[7px] uppercase tracking-wider text-gray-500">Card Holder</p>
                  <p className="font-mono text-xs font-semibold text-white uppercase">Sarah Jenkins</p>
                </div>
                <div className="text-right">
                  <p className="text-[7px] uppercase tracking-wider text-gray-500">EXP END</p>
                  <p className="font-mono text-[10px] font-bold text-white">12/30</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </RevealSection>

      {/* Lock Facility Feature Block */}
      <RevealSection className="py-20 px-6 md:px-12 border-b border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#C9A84C] font-bold font-mono">Vault Infrastructure</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mt-2 mb-4 font-heading">Ultimate Protection Coordinates for Your Assets</h2>
            <p className="text-xs text-gray-400 leading-relaxed mb-6">
              All financial data is sealed behind quantum-grade encryption. WealthGlobalFinance leverages high-fidelity transaction telemetry tracking to defend balances.
            </p>
            <div className="space-y-4">
              <div className="flex gap-3 items-start">
                <div className="p-1 rounded-full bg-[#C9A84C]/10 text-[#C9A84C]">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-white">Cold Storage Integration</h5>
                  <p className="text-xs text-gray-400">98% of digital currencies are permanently separated inside non-networked servers.</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <div className="p-1 rounded-full bg-[#C9A84C]/10 text-[#C9A84C]">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-white">256-Bit SSL Transport Layers</h5>
                  <p className="text-xs text-gray-400">Real-time ledger updates and API calls are filtered through secure firewall routers.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden p-8 rounded-2xl border border-white/10 flex flex-col justify-center text-center bg-[#0A1628]/80 min-h-[300px]">
            <img 
              src={secureServerRoom} 
              alt="Secure Server Infrastructure" 
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-luminosity" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
            <div className="relative z-10 space-y-4">
              <Lock className="w-12 h-12 text-[#C9A84C] mx-auto mb-2 animate-bounce" />
              <h3 className="text-lg font-bold text-white">Sealed Vault Protocol</h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                Only authorized client keys possess the capability to declare holdings and trigger wire distributions.
              </p>
              <button 
                onClick={() => setShowSignInModal(true)}
                className="px-6 py-2.5 gold-gradient text-[#0A1628] font-extrabold text-xs rounded-xl transition shadow-lg shadow-[#C9A84C]/20 mx-auto max-w-xs"
              >
                Initialize Security Session
              </button>
            </div>
          </div>
        </div>
      </RevealSection>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-6 md:px-12 bg-[#0A1628] border-b border-white/5">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-[10px] uppercase tracking-widest text-[#C9A84C] font-bold font-mono">Customer FAQs</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight font-heading">Got Questions? We Have Answers</h2>
            <p className="text-xs text-gray-400 max-w-lg mx-auto">
              Find solutions to common administrative, compliance, and asset management queries.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div 
                  key={index} 
                  className="border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 bg-[#0A1628]/80"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full text-left p-5 flex justify-between items-center text-xs font-bold text-white hover:bg-white/5 transition"
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-[#C9A84C] font-mono">0{index + 1}</span>
                      <span>{faq.q}</span>
                    </span>
                    <span className={`text-[#C9A84C] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="p-5 pt-0 text-xs text-gray-400 leading-relaxed border-t border-white/5 bg-black/10">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Financial News section */}
      <RevealSection className="py-20 px-6 md:px-12 border-b border-white/5">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#C9A84C] font-bold font-mono">Platform News</span>
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mt-1 font-heading">Platform Updates & Market Intel</h2>
            </div>
            <button onClick={() => alert('Client intelligence logs require sign in.')} className="text-xs text-[#C9A84C] hover:underline font-bold flex items-center gap-1">
              All News Logs <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Capital Expansion Strategies for Emerging Corporates",
                author: "Z. Benjamin",
                read: "6 Mins Read",
                date: "24 Feb 2026",
                category: "Business Banking",
                image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80"
              },
              {
                title: "Sealed Cryptographic Vouchers: The Future of Ledger Settlement",
                author: "L. Nathaniel",
                read: "4 Mins Read",
                date: "26 Feb 2026",
                category: "Technology",
                image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=600&q=80"
              },
              {
                title: "Compliance Coordination: Accelerating Large-value Wire Approvals",
                author: "D. Beckham",
                read: "5 Mins Read",
                date: "29 Feb 2026",
                category: "Financial Planning",
                image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=80"
              }
            ].map((news, idx) => (
              <div key={idx} className="border border-white/10 hover:border-[#C9A84C]/30 rounded-2xl overflow-hidden transition flex flex-col justify-between group bg-[#0A1628]/80">
                <div className="relative h-48 overflow-hidden bg-black/40">
                  <img 
                    src={news.image} 
                    alt={news.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] via-[#0A1628]/20 to-transparent" />
                </div>
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex justify-between text-[10px] font-mono text-gray-500 font-bold uppercase">
                      <span className="text-[#C9A84C]">{news.category}</span>
                      <span>{news.date}</span>
                    </div>
                    <h4 className="text-sm font-bold text-white leading-snug group-hover:text-[#C9A84C] transition">
                      {news.title}
                    </h4>
                  </div>
                  <p className="text-xs text-gray-400 font-medium">By {news.author}</p>
                </div>
                <div className="p-6 pt-0 flex justify-between items-center text-[10px] text-gray-500 font-mono border-t border-white/5 mt-2">
                  <span>{news.read}</span>
                  <button onClick={() => setShowSignInModal(true)} className="p-1.5 bg-white/5 hover:bg-[#C9A84C]/10 text-[#C9A84C] rounded-lg transition">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* Premium footer */}
      <footer className="mt-auto py-8 px-4 md:px-8 pb-12" style={{ background: 'linear-gradient(180deg, transparent 0%, #e8e8e8 100%)' }}>
        <div className="max-w-[1100px] mx-auto rounded-[24px] overflow-hidden relative" style={{ boxShadow: '0 20px 60px -15px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)' }}>
          {/* Footer Card */}
          <div className="relative bg-[#09090b] p-6 sm:p-8 md:p-10 lg:p-14 overflow-hidden">
            {/* Subtle gradient overlays matching reference */}
            <div className="absolute top-0 left-1/4 w-96 h-48 bg-blue-600/8 blur-[80px] pointer-events-none" />
            <div className="absolute top-0 right-1/4 w-64 h-32 bg-purple-600/8 blur-[60px] pointer-events-none" />
            <div className="absolute bottom-0 left-1/3 w-80 h-40 bg-cyan-500/5 blur-[70px] pointer-events-none" />
            
            {/* Content */}
            <div className="relative z-10">
              {/* Top Section */}
              <div className="flex flex-col lg:flex-row justify-between gap-12 mb-10">
                {/* Left - Brand */}
                <div className="max-w-[280px]">
                  <div className="flex items-center gap-2.5 mb-5">
                    {/* Bank Logo */}
                    <Logo size={28} />
                    <span className="text-white font-bold text-[15px]">WealthGlobalFinance</span>
                  </div>
                  <p className="text-[13px] text-[#888] leading-[1.7] mb-6">
                    Skip the search, land dream freelance gigs with verified clients, secure payments, and seamless workflows.
                  </p>
                  {/* Social Icons */}
                  <div className="flex gap-3">
                    <a href="#" className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] flex items-center justify-center text-[#666] hover:text-white transition-all duration-300">
                      <svg className="w-[15px] h-[15px]" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    </a>
                    <a href="#" className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] flex items-center justify-center text-[#666] hover:text-white transition-all duration-300">
                      <svg className="w-[15px] h-[15px]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                    </a>
                    <a href="#" className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] flex items-center justify-center text-[#666] hover:text-white transition-all duration-300">
                      <svg className="w-[15px] h-[15px]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                    </a>
                    <a href="#" className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] flex items-center justify-center text-[#666] hover:text-white transition-all duration-300">
                      <svg className="w-[15px] h-[15px]" fill="currentColor" viewBox="0 0 24 24"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12.017 24c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641 0 12.017 0z"/></svg>
                    </a>
                  </div>
                </div>

                {/* Right - Link Columns */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-14">
                  {/* Products */}
                  <div>
                    <h4 className="text-white font-semibold text-[13px] mb-4">Products</h4>
                    <ul className="space-y-2.5">
                      <li><a href="#" className="text-[#888] hover:text-white text-[13px] transition-colors duration-200">For Individual</a></li>
                      <li><a href="#" className="text-[#888] hover:text-white text-[13px] transition-colors duration-200">For Teams</a></li>
                    </ul>
                  </div>

                  {/* About */}
                  <div>
                    <h4 className="text-white font-semibold text-[13px] mb-4">About</h4>
                    <ul className="space-y-2.5">
                      <li><a href="#" className="text-[#888] hover:text-white text-[13px] transition-colors duration-200">Careers</a></li>
                      <li><a href="#" className="text-[#888] hover:text-white text-[13px] transition-colors duration-200">Terms of Service</a></li>
                      <li><a href="#" className="text-[#888] hover:text-white text-[13px] transition-colors duration-200">Privacy policy</a></li>
                      <li><a href="#" className="text-[#888] hover:text-white text-[13px] transition-colors duration-200">Partners</a></li>
                      <li><a href="#" className="text-[#888] hover:text-white text-[13px] transition-colors duration-200">FAQs</a></li>
                    </ul>
                  </div>

                  {/* Community */}
                  <div>
                    <h4 className="text-white font-semibold text-[13px] mb-4">Community</h4>
                    <ul className="space-y-2.5">
                      <li><a href="#" className="text-[#888] hover:text-white text-[13px] transition-colors duration-200">Blog</a></li>
                      <li><a href="#" className="text-[#888] hover:text-white text-[13px] transition-colors duration-200">Events</a></li>
                      <li><a href="#" className="text-[#888] hover:text-white text-[13px] transition-colors duration-200">Press</a></li>
                      <li><a href="#" className="text-[#888] hover:text-white text-[13px] transition-colors duration-200">Forum</a></li>
                      <li><a href="#" className="text-[#888] hover:text-white text-[13px] transition-colors duration-200">Merch store</a></li>
                    </ul>
                  </div>

                  {/* Solutions */}
                  <div>
                    <h4 className="text-white font-semibold text-[13px] mb-4">Solutions</h4>
                    <ul className="space-y-2.5">
                      <li><a href="#" className="text-[#888] hover:text-white text-[13px] transition-colors duration-200">Pricing</a></li>
                      <li><a href="#" className="text-[#888] hover:text-white text-[13px] transition-colors duration-200">Contact sales</a></li>
                      <li><a href="#" className="text-[#888] hover:text-white text-[13px] transition-colors duration-200">Help & Support</a></li>
                      <li><a href="#" className="text-[#888] hover:text-white text-[13px] transition-colors duration-200">Invest</a></li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Bottom - Copyright */}
              <div className="pt-8 border-t border-white/[0.06] text-center">
                <p className="text-[12px] text-[#555]">© 2010 WealthGlobalFinance, Inc. All rights reserved.</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
      

      {showImmersiveDemo && (
        <SpiralDemo onClose={() => setShowImmersiveDemo(false)} />
      )}

      {/* SIGN IN MODAL */}
      <AnimatePresence>
        {showSignInModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed inset-0 z-[100] flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #1a1028 0%, #0d1117 50%, #161b22 100%)' }}
          >
            {/* Main Card - Full screen */}
            <div className="w-full h-full flex flex-col lg:flex-row rounded-none overflow-hidden" style={{ boxShadow: '0 25px 80px -15px rgba(0,0,0,0.8)' }}>
              
              {/* Left Panel - Image & Branding */}
              <div className="hidden md:flex md:w-1/2 lg:flex-1 relative overflow-hidden">
                {/* Background Images with transition */}
                {loginSlides.map((slide, idx) => (
                  <div 
                    key={idx}
                    className={`absolute inset-0 transition-opacity duration-1000 ${idx === loginSlideIndex ? 'opacity-100' : 'opacity-0'}`}
                  >
                    <img 
                      src={slide.image} 
                      alt="Wealth" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0f14]/95 via-[#0d0f14]/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#1a1028]/60 to-transparent" />

                {/* Close button */}
                <button 
                  onClick={closeSignIn}
                  className="absolute top-4 right-4 z-50 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white/80 hover:text-white text-xs font-medium transition-all duration-300 flex items-center gap-1.5 border border-white/10"
                >
                  Back to website <ArrowRight className="w-3 h-3" />
                </button>

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-between h-full p-8">
                  {/* Logo */}
                  <div className="flex items-center gap-2.5">
                    <Logo size={32} />
                    <span className="text-white font-bold text-lg tracking-tight">WGF</span>
                  </div>

                  {/* Bottom Text */}
                  <div>
                    <AnimatePresence mode="wait">
                      <motion.h2 
                        key={loginSlideIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.5 }}
                        className="text-2xl xl:text-3xl font-bold text-white leading-tight mb-2"
                      >
                        {loginSlides[loginSlideIndex].text.split(',').map((part, i) => (
                          <React.Fragment key={i}>
                            {i > 0 ? ',' : ''}<br />
                            {i === 0 ? part : part.trim()}
                          </React.Fragment>
                        ))}
                      </motion.h2>
                    </AnimatePresence>
                    {/* Pagination Dots */}
                    <div className="flex gap-2 mt-4">
                      {loginSlides.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setLoginSlideIndex(idx)}
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            idx === loginSlideIndex ? 'w-8 bg-white' : 'w-6 bg-white/20 hover:bg-white/40'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Panel - Form */}
              <div className="w-full lg:w-1/2 flex-1 bg-[#1c1f2e] flex flex-col p-6 sm:p-8 md:p-10 lg:p-12 relative overflow-y-auto min-h-0">
                {/* Mobile Back button */}
                <button 
                  onClick={closeSignIn}
                  className="absolute top-4 left-4 z-50 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white text-xs font-medium transition-all flex items-center gap-1.5 lg:hidden"
                >
                  <ArrowRight className="w-3 h-3 rotate-180" /> Back
                </button>

                {/* Mobile Close */}
                <button 
                  onClick={closeSignIn}
                  className="absolute top-4 right-4 z-50 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="flex-1 flex items-center justify-center">
                <div className="w-full max-w-[400px]">
                  {/* Header */}
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-white mb-1.5">Create an account</h2>
                    <p className="text-sm text-gray-400">
                      Already have an account?{' '}
                      <button type="button" onClick={() => { setShowSignUp(false); setLoginError(''); }} className="text-white font-medium hover:underline transition-colors">
                        Log in
                      </button>
                    </p>
                  </div>

                  {(loginError || signUpError) && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400">
                      {loginError || signUpError}
                    </div>
                  )}

                  <AnimatePresence mode="wait">
                  {otpSent ? (
                    <motion.form key="otp" onSubmit={handleOtpVerify} className="space-y-4"
                      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                      <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                        <p className="text-xs text-gray-400 mb-2">Use your security code:</p>
                        <p className="text-lg font-mono font-bold text-white tracking-[0.2em]">{generatedOtp}</p>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1.5">Verification Code</label>
                        <input
                          type="text" required maxLength={6} value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value)}
                          placeholder="000000"
                          className="w-full py-3 px-4 bg-[#252838] border border-white/10 rounded-xl text-white text-center text-lg font-mono tracking-[0.3em] outline-none transition-all focus:border-[#7c5bf5]/50 placeholder:text-gray-600"
                        />
                      </div>
                      <button type="submit" className="w-full py-3.5 bg-[#7c5bf5] hover:bg-[#6b4ae0] rounded-xl text-white text-sm font-semibold transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#7c5bf5]/20">
                        Verify & Access
                      </button>
                      <div className="flex justify-center gap-4 text-xs">
                        <button type="button" onClick={() => { generateOtp(); setOtpCode(''); setLoginError(''); }} className="text-[#7c5bf5] hover:underline">
                          Resend code
                        </button>
                        <button type="button" onClick={() => setOtpSent(false)} className="text-gray-500 hover:text-white/70">
                          ← Back to sign in
                        </button>
                      </div>
                    </motion.form>
                  ) : showSignUp ? (
                    <motion.form key="signup" onSubmit={handleSignUpSubmit} className="space-y-3.5"
                      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                      {/* Name Row */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <input type="text" required value={signUpName}
                            onChange={(e) => setSignUpName(e.target.value)}
                            placeholder="First name"
                            className="w-full py-3 px-4 bg-[#252838] border border-white/10 rounded-xl text-white text-sm outline-none transition-all focus:border-[#7c5bf5]/50 placeholder:text-gray-500"
                          />
                        </div>
                        <div>
                          <input type="text" placeholder="Last name"
                            className="w-full py-3 px-4 bg-[#252838] border border-white/10 rounded-xl text-white text-sm outline-none transition-all focus:border-[#7c5bf5]/50 placeholder:text-gray-500"
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div>
                        <input type="email" required value={signUpEmail}
                          onChange={(e) => setSignUpEmail(e.target.value)}
                          placeholder="Email"
                          className="w-full py-3 px-4 bg-[#252838] border border-white/10 rounded-xl text-white text-sm outline-none transition-all focus:border-[#7c5bf5]/50 placeholder:text-gray-500"
                        />
                      </div>

                      {/* Password */}
                      <div className="relative">
                        <input type={passwordVisible ? 'text' : 'password'} required value={signUpPassword}
                          onChange={(e) => setSignUpPassword(e.target.value)}
                          placeholder="Enter your password"
                          className="w-full py-3 px-4 pr-10 bg-[#252838] border border-white/10 rounded-xl text-white text-sm outline-none transition-all focus:border-[#7c5bf5]/50 placeholder:text-gray-500"
                        />
                        <button type="button" onClick={() => setPasswordVisible(!passwordVisible)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                          {passwordVisible ? (
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22" /></svg>
                          ) : (
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                          )}
                        </button>
                      </div>

                      {/* Terms */}
                      <label className="flex items-start gap-2.5 text-xs text-gray-400 cursor-pointer group">
                        <input type="checkbox" checked={agreeToTerms}
                          onChange={(e) => setAgreeToTerms(e.target.checked)}
                          className="sr-only peer mt-0.5" />
                        <span className="w-4 h-4 mt-0.5 border border-white/20 rounded bg-[#252838] peer-checked:bg-[#7c5bf5] peer-checked:border-[#7c5bf5] transition-all flex items-center justify-center shrink-0 overflow-hidden">
                          <span className={`text-white transition-opacity ${agreeToTerms ? 'opacity-100' : 'opacity-0'}`}>
                            <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                          </span>
                        </span>
                        <span className="group-hover:text-white/70 transition-colors">
                          I agree to the <span className="text-[#7c5bf5] hover:underline">Terms & Conditions</span>
                        </span>
                      </label>

                      {/* Submit */}
                      <button type="submit" className="w-full py-3.5 bg-[#7c5bf5] hover:bg-[#6b4ae0] rounded-xl text-white text-sm font-semibold transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#7c5bf5]/20">
                        Create account
                      </button>

                      {/* Divider */}
                      <div className="relative py-1">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-white/10" />
                        </div>
                        <div className="relative flex justify-center">
                          <span className="px-3 text-xs text-gray-500 bg-[#1c1f2e]">Or register with</span>
                        </div>
                      </div>

                      {/* Social Buttons */}
                      <div className="flex gap-3">
                        <button type="button" className="flex-1 py-3 rounded-xl bg-[#252838] border border-white/10 hover:border-white/20 text-white text-sm font-medium flex items-center justify-center gap-2 transition-all hover:bg-[#2a2d3e]">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                          Google
                        </button>
                        <button type="button" className="flex-1 py-3 rounded-xl bg-[#252838] border border-white/10 hover:border-white/20 text-white text-sm font-medium flex items-center justify-center gap-2 transition-all hover:bg-[#2a2d3e]">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.21-1.33 3.8-1.33 1.17 0 2.89.48 3.84 2.15-3.54 1.93-2.95 6.27.08 7.41-.57 1.62-1.31 3.25-2.8 4zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
                          Apple
                        </button>
                      </div>

                      {/* Back to sign in */}
                      <p className="text-center text-xs text-gray-500 pt-1">
                        Already have an account?{' '}
                        <button type="button" onClick={() => { setShowSignUp(false); setSignUpError(''); }} className="text-[#7c5bf5] font-medium hover:underline">
                          Log in
                        </button>
                      </p>
                    </motion.form>
                  ) : (
                    <motion.form key="signin" onSubmit={handleSignInSubmit} className="space-y-3.5"
                      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                      {/* Email */}
                      <div>
                        <input
                          type="text" required value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Email"
                          className="w-full py-3 px-4 bg-[#252838] border border-white/10 rounded-xl text-white text-sm outline-none transition-all focus:border-[#7c5bf5]/50 placeholder:text-gray-500"
                        />
                      </div>

                      {/* Password */}
                      <div className="relative">
                        <input
                          type={passwordVisible ? 'text' : 'password'} required value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password"
                          className="w-full py-3 px-4 pr-10 bg-[#252838] border border-white/10 rounded-xl text-white text-sm outline-none transition-all focus:border-[#7c5bf5]/50 placeholder:text-gray-500"
                        />
                        <button type="button" onClick={() => setPasswordVisible(!passwordVisible)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                          {passwordVisible ? (
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22" /></svg>
                          ) : (
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                          )}
                        </button>
                      </div>

                      {/* Submit */}
                      <button type="submit" className="w-full py-3.5 bg-[#7c5bf5] hover:bg-[#6b4ae0] rounded-xl text-white text-sm font-semibold transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#7c5bf5]/20">
                        Log in
                      </button>

                      {/* Divider */}
                      <div className="relative py-1">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-white/10" />
                        </div>
                        <div className="relative flex justify-center">
                          <span className="px-3 text-xs text-gray-500 bg-[#1c1f2e]">Or continue with</span>
                        </div>
                      </div>

                      {/* Social Buttons */}
                      <div className="flex gap-3">
                        <button type="button" className="flex-1 py-3 rounded-xl bg-[#252838] border border-white/10 hover:border-white/20 text-white text-sm font-medium flex items-center justify-center gap-2 transition-all hover:bg-[#2a2d3e]">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                          Google
                        </button>
                        <button type="button" className="flex-1 py-3 rounded-xl bg-[#252838] border border-white/10 hover:border-white/20 text-white text-sm font-medium flex items-center justify-center gap-2 transition-all hover:bg-[#2a2d3e]">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.21-1.33 3.8-1.33 1.17 0 2.89.48 3.84 2.15-3.54 1.93-2.95 6.27.08 7.41-.57 1.62-1.31 3.25-2.8 4zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
                          Apple
                        </button>
                      </div>

                      {/* New client */}
                      <p className="text-center text-xs text-gray-500 pt-1">
                        Don't have an account?{' '}
                        <button type="button" onClick={() => { setShowSignUp(true); setLoginError(''); }} className="text-[#7c5bf5] font-medium hover:underline">
                          Create an account
                        </button>
                      </p>
                    </motion.form>
                  )}
                  </AnimatePresence>
                </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


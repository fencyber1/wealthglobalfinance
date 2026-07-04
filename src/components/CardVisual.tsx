import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { CreditCard } from '../types';
import debitCardImg from '../assets/images/card-debit.jpg';
import creditCardImg from '../assets/images/card-credit.jpg';

interface CardVisualProps {
  card: CreditCard;
}

export default function CardVisual({ card }: CardVisualProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const isDebit = card.type === 'debit';

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isFlipped) return;
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setRotateX((y - centerY) / centerY * -10);
    setRotateY((x - centerX) / centerX * 10);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div
      className="relative w-full max-w-[340px] h-[210px] mx-auto cursor-pointer perspective"
      onClick={() => setIsFlipped(!isFlipped)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        ref={cardRef}
        className="w-full h-full relative preserve-3d"
        animate={{
          rotateY: isFlipped ? 180 : rotateY,
          rotateX: isFlipped ? 0 : rotateX,
          y: [0, -4, 0],
        }}
        transition={{
          rotateY: { duration: 0.6, ease: 'easeInOut' },
          rotateX: { duration: 0.2 },
          y: { repeat: Infinity, duration: 4, ease: 'easeInOut' },
        }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front Face */}
        <div
          className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden shadow-2xl select-none border border-white/10"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <img
            src={isDebit ? debitCardImg : creditCardImg}
            alt={isDebit ? 'Debit Card' : 'Credit Card'}
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          <div className="relative z-10 h-full flex flex-col justify-between p-5 text-white">
            {/* Top */}
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[9px] tracking-wider font-medium text-white/60">
                  {isDebit ? 'DEBIT' : 'CREDIT'}
                </p>
                <p className="text-[10px] font-bold tracking-widest text-white/90">
                  WealthGlobalFinance
                </p>
              </div>
              <span className="text-[7px] text-white/40 tracking-wider">PREMIUM</span>
            </div>

            {/* Middle */}
            <div className="flex items-center gap-3">
              <svg width="36" height="28" viewBox="0 0 40 32" className="drop-shadow-lg">
                <rect x="1" y="1" width="38" height="30" rx="4" fill="url(#chipGrad)" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" />
                <rect x="4" y="4" width="32" height="24" rx="2" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.3" />
                <line x1="8" y1="16" x2="32" y2="16" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
                <line x1="20" y1="8" x2="20" y2="24" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
                <defs>
                  <linearGradient id="chipGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#F5E6A3" />
                    <stop offset="50%" stopColor="#D4AF37" />
                    <stop offset="100%" stopColor="#A68A2E" />
                  </linearGradient>
                </defs>
              </svg>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" strokeLinecap="round" className="rotate-90">
                <path d="M6 8a6 6 0 0 1 12 0" />
                <path d="M8 11a3 3 0 0 1 8 0" />
                <circle cx="12" cy="14" r="1" fill="rgba(255,255,255,0.5)" />
              </svg>
            </div>

            {/* Card Number */}
            <div>
              <p className="font-mono text-lg tracking-[0.18em] text-white font-medium drop-shadow-md">
                {card.cardNumber.replace(/(\d{4})/g, '$1 ').trim()}
              </p>
            </div>

            {/* Bottom */}
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[7px] uppercase tracking-wider text-white/50">Card Holder</p>
                <p className="font-mono text-xs font-semibold tracking-wider text-white uppercase max-w-[180px] truncate">
                  {card.nameOnCard}
                </p>
              </div>
              <div className="flex gap-4 items-end">
                <div className="text-right">
                  <p className="text-[7px] uppercase tracking-wider text-white/50">Expires</p>
                  <p className="font-mono text-xs font-semibold text-white">{card.expiryDate}</p>
                </div>
                <div className="flex -space-x-2">
                  <div className="w-7 h-7 rounded-full bg-red-500/80 mix-blend-screen" />
                  <div className="w-7 h-7 rounded-full bg-yellow-500/80 mix-blend-screen" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back Face */}
        <div
          className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden shadow-2xl select-none border border-white/10"
          style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}
        >
          <img
            src={isDebit ? debitCardImg : creditCardImg}
            alt="Card Back"
            className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
          />
          <div className="absolute inset-0 bg-black/50" />

          <div className="relative z-10 h-full flex flex-col justify-between py-6 px-6">
            <div className="w-full h-10 bg-gradient-to-b from-black/60 via-black/40 to-black/60 mt-2 rounded border border-white/10" />
            <div className="flex items-center gap-3">
              <div className="flex-1 h-10 bg-white/10 rounded flex items-center justify-end px-3 border border-white/10">
                <span className="text-white/30 font-serif text-[9px] italic tracking-wider select-none">Authorized Signature</span>
              </div>
              <div className="text-right">
                <p className="text-[8px] uppercase tracking-wider text-white/50 mb-0.5">CVV</p>
                <div className="bg-white/10 text-[#C9A84C] font-mono text-xs font-bold px-3 py-1 rounded border border-white/20">
                  {card.cvv}
                </div>
              </div>
            </div>
            <div className="h-5 rounded bg-white/5" />
            <p className="text-[7px] leading-tight text-white/40">
              This card is the property of WealthGlobalFinance. Misuse is a criminal offence.
            </p>
            <div className="flex justify-between items-center pt-2 border-t border-white/10">
              <span className="text-[7px] text-[#C9A84C] font-mono">SUPPORT: +1 (800) WELTH-FIN</span>
              <span className="text-[8px] font-bold text-white/30">AFG SYSTEM</span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] text-gray-500 font-mono opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        Click to {isFlipped ? 'view front' : 'view back'}
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { CreditCard } from '../types';
import Logo from './Logo';

interface CardStackProps {
  debitCard: CreditCard;
  creditCard: CreditCard | null;
  onFlip?: () => void;
}

export default function CardStack({ debitCard, creditCard, onFlip }: CardStackProps) {
  const [flipped, setFlipped] = useState(false);

  const formatNumber = (num: string) => {
    return num.replace(/(.{4})/g, '$1 ').trim();
  };

  const maskCardNumber = (num: string) => {
    const lastFour = num.slice(-4);
    return `**** **** **** ${lastFour}`;
  };

  const getFirstFour = (num: string) => num.slice(0, 4);

  // Split expiry date for MONTH/YEAR and EXPIRES END
  const expiryParts = debitCard.expiryDate.split('/');
  const month = expiryParts[0] || '11';
  const year = expiryParts[1] ? '20' + expiryParts[1] : '2026';

  return (
    <div className="relative h-52 w-full max-w-sm mx-auto" style={{ perspective: '1200px' }}>
      {/* Back card (black premium - partially visible behind) */}
      <div
        className="absolute top-2 left-6 right-0 bottom-0 rounded-2xl overflow-hidden shadow-2xl"
        style={{ zIndex: 1 }}
      >
        <div className="w-full h-full p-5 flex flex-col justify-between relative overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, #1a1a1a 0%, #0d0d0d 50%, #1a1a1a 100%)',
          }}
        >
          {/* World map silhouette */}
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 50'%3E%3Cpath d='M10 25 Q25 20 40 25 T70 25 T100 25' fill='none' stroke='white' stroke-width='0.5'/%3E%3C/svg%3E")`,
              backgroundSize: 'cover',
            }}
          />
          
          <div className="flex justify-between items-start relative z-10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C9A84C] to-[#8B7332] flex items-center justify-center">
                <span className="text-[10px] font-black text-[#0A1628]">WGF</span>
              </div>
              <div className="flex flex-col">
                <p className="text-[10px] text-white/80 font-bold tracking-wide leading-none">WealthGlobalFinance</p>
                <p className="text-[6px] text-[#C9A84C]/70 tracking-[0.15em] uppercase leading-none mt-0.5">Credit Card</p>
              </div>
            </div>
            <p className="text-[11px] text-[#C9A84C]/80 italic" style={{ fontFamily: 'Georgia, serif' }}>Platinum</p>
          </div>

          <div className="relative z-10">
            <p className="text-[11px] font-mono text-white/70 tracking-[0.15em]">{formatNumber(creditCard?.cardNumber || '4821482148214821')}</p>
            <div className="flex justify-between items-end mt-1">
              <p className="text-[9px] text-white/50 uppercase tracking-wide">{creditCard?.nameOnCard || 'EDMUND BECKER'}</p>
              <p className="text-[9px] text-white/50 font-mono">{creditCard?.expiryDate || '12/28'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Front card (debit - Premium Black) */}
      <div
        className="absolute inset-0 rounded-2xl overflow-hidden cursor-pointer shadow-2xl"
        style={{ zIndex: 2, transformStyle: 'preserve-3d' }}
        onClick={() => { setFlipped(!flipped); onFlip?.(); }}
      >
        <div
          className="absolute inset-0 [backface-visibility:hidden] transition-transform duration-700"
          style={{ transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
        >
          <div className="w-full h-full p-5 flex flex-col justify-between relative overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, #1a1a1a 0%, #0d0d0d 40%, #1a1a1a 100%)',
            }}
          >
            {/* World map silhouette overlay */}
            <div className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 200'%3E%3Cellipse cx='120' cy='90' rx='80' ry='60' fill='white' fillOpacity='0.15'/%3E%3Cellipse cx='280' cy='100' rx='70' ry='55' fill='white' fillOpacity='0.12'/%3E%3Cellipse cx='200' cy='140' rx='60' ry='40' fill='white' fillOpacity='0.1'/%3E%3Cellipse cx='60' cy='60' rx='40' ry='30' fill='white' fillOpacity='0.08'/%3E%3Cellipse cx='340' cy='60' rx='35' ry='25' fill='white' fillOpacity='0.08'/%3E%3C/svg%3E")`,
                backgroundSize: 'cover',
              }}
            />
            
            {/* Subtle gold accent line at top */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C9A84C]/20 to-transparent" />

            {/* Top row: Bank Logo + Premium label */}
            <div className="flex justify-between items-start relative z-10">
              <div className="flex items-center gap-2.5">
                {/* Bank Logo */}
                <div className="relative">
                  <Logo size={32} />
                </div>
                <div className="flex flex-col">
                  <p className="text-[12px] text-white font-bold tracking-wide leading-none" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>WealthGlobalFinance</p>
                  <p className="text-[7px] text-[#C9A84C]/50 tracking-[0.25em] uppercase leading-none mt-0.5">International Market</p>
                </div>
              </div>
              <p className="text-[14px] text-[#C9A84C] italic tracking-wide" style={{ fontFamily: 'Georgia, serif', textShadow: '1px 1px 3px rgba(0,0,0,0.4)' }}>Premium</p>
            </div>

            {/* EMV Chip - Realistic Contact Pad */}
            <div className="relative z-10 mt-1">
              <div className="w-12 h-10 relative" style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.4))' }}>
                <svg viewBox="0 0 48 40" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="chipBase" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#E8D48B"/>
                      <stop offset="30%" stopColor="#D4AF61"/>
                      <stop offset="60%" stopColor="#C9A84C"/>
                      <stop offset="100%" stopColor="#9A7B2E"/>
                    </linearGradient>
                    <linearGradient id="chipPad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#F0E0A0"/>
                      <stop offset="50%" stopColor="#D4B860"/>
                      <stop offset="100%" stopColor="#A08030"/>
                    </linearGradient>
                    <linearGradient id="chipShine" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="white" stopOpacity="0.3"/>
                      <stop offset="50%" stopColor="white" stopOpacity="0.05"/>
                      <stop offset="100%" stopColor="black" stopOpacity="0.1"/>
                    </linearGradient>
                  </defs>

                  {/* Base shape */}
                  <rect x="0" y="0" width="48" height="40" rx="4" fill="url(#chipBase)" stroke="#8B7332" strokeWidth="0.5"/>

                  {/* Central vertical column */}
                  <rect x="18" y="0" width="12" height="40" fill="url(#chipPad)" stroke="#8B7332" strokeWidth="0.3"/>

                  {/* Top-left pad with curved inner edge */}
                  <path d="M2,2 L17,2 L17,18 C17,18 14,18 12,15 C10,12 2,12 2,12 Z" fill="url(#chipPad)" stroke="#8B7332" strokeWidth="0.3"/>

                  {/* Top-right pad with curved inner edge */}
                  <path d="M46,2 L31,2 L31,18 C31,18 34,18 36,15 C38,12 46,12 46,12 Z" fill="url(#chipPad)" stroke="#8B7332" strokeWidth="0.3"/>

                  {/* Bottom-left pad with curved inner edge */}
                  <path d="M2,38 L17,38 L17,22 C17,22 14,22 12,25 C10,28 2,28 2,28 Z" fill="url(#chipPad)" stroke="#8B7332" strokeWidth="0.3"/>

                  {/* Bottom-right pad with curved inner edge */}
                  <path d="M46,38 L31,38 L31,22 C31,22 34,22 36,25 C38,28 46,28 46,28 Z" fill="url(#chipPad)" stroke="#8B7332" strokeWidth="0.3"/>

                  {/* Horizontal divider lines */}
                  <line x1="2" y1="14" x2="17" y2="14" stroke="#8B7332" strokeWidth="0.4"/>
                  <line x1="31" y1="14" x2="46" y2="14" stroke="#8B7332" strokeWidth="0.4"/>
                  <line x1="2" y1="26" x2="17" y2="26" stroke="#8B7332" strokeWidth="0.4"/>
                  <line x1="31" y1="26" x2="46" y2="26" stroke="#8B7332" strokeWidth="0.4"/>

                  {/* Shine overlay */}
                  <rect x="0" y="0" width="48" height="40" rx="4" fill="url(#chipShine)"/>
                </svg>
              </div>
            </div>

            {/* Card number + details row */}
            <div className="relative z-10 mt-auto">
              <p className="text-[17px] font-mono text-white tracking-[0.22em] mb-2" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                {maskCardNumber(debitCard.cardNumber)}
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-[7px] text-white/40 uppercase tracking-wider leading-none">Month / Year</p>
                    <p className="text-[11px] text-white font-mono font-semibold mt-0.5">{month}/{year}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[7px] text-white/40 uppercase tracking-wider leading-none">Expires End</p>
                    <p className="text-[11px] text-white font-mono font-semibold mt-0.5">12/28</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom row: Cardholder + Payment Network */}
            <div className="relative z-10 flex items-end justify-between mt-3">
              <div>
                <p className="text-[12px] text-white font-bold uppercase tracking-[0.15em]" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                  {debitCard.nameOnCard}
                </p>
              </div>
              {/* Payment Network Logo (Mastercard-style) */}
              <div className="flex items-center">
                <div className="relative w-10 h-6">
                  <div className="absolute left-0 w-6 h-6 rounded-full bg-[#EB001B] opacity-90" />
                  <div className="absolute right-0 w-6 h-6 rounded-full bg-[#F79E1B] opacity-90" />
                </div>
              </div>
            </div>

            {/* Bottom gold accent line */}
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C9A84C]/15 to-transparent" />
          </div>
        </div>

        {/* Back of card */}
        <div
          className="absolute inset-0 [backface-visibility:hidden] transition-transform duration-700"
          style={{ transform: flipped ? 'rotateY(0deg)' : 'rotateY(-180deg)' }}
        >
          <div className="w-full h-full flex flex-col relative overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, #1a1a1a 0%, #0d0d0d 40%, #1a1a1a 100%)',
            }}
          >
            {/* World map silhouette overlay */}
            <div className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 200'%3E%3Cellipse cx='120' cy='90' rx='80' ry='60' fill='white' fillOpacity='0.15'/%3E%3Cellipse cx='280' cy='100' rx='70' ry='55' fill='white' fillOpacity='0.12'/%3E%3Cellipse cx='200' cy='140' rx='60' ry='40' fill='white' fillOpacity='0.1'/%3E%3C/svg%3E")`,
                backgroundSize: 'cover',
              }}
            />

            {/* Gold accent lines */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C9A84C]/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C9A84C]/15 to-transparent" />

            {/* Magnetic stripe */}
            <div className="w-full h-11 mt-6 relative"
              style={{
                background: 'linear-gradient(180deg, #1a1a1a 0%, #0d0d0d 50%, #1a1a1a 100%)',
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.5), 0 1px 1px rgba(201,168,76,0.1)',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#C9A84C]/5 via-[#C9A84C]/10 to-[#C9A84C]/5" />
            </div>

            {/* Signature strip */}
            <div className="px-5 mt-4">
              <div className="relative">
                <div className="w-full h-10 rounded-md overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 50%, #f5f5f5 100%)',
                  }}
                >
                  {/* Microprint pattern */}
                  <div className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: `repeating-linear-gradient(90deg, #ccc 0px, #ccc 1px, transparent 1px, transparent 3px)`,
                    }}
                  />
                  {/* CVV */}
                  <div className="absolute inset-0 flex items-center justify-end px-4">
                    <p className="text-sm font-mono text-gray-800 font-bold tracking-[0.2em]">{debitCard.cvv}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card details */}
            <div className="flex-1 px-5 pt-4 flex flex-col justify-between relative z-10">
              <div>
                <p className="text-[7px] text-[#C9A84C]/40 uppercase tracking-[0.2em] mb-1">Authorized Signature</p>
                <div className="w-full h-[1px] bg-gradient-to-r from-[#C9A84C]/20 to-transparent mb-3" />
                <p className="text-[9px] text-white/40 uppercase tracking-wider mb-0.5">Cardholder</p>
                <p className="text-[11px] text-white font-semibold uppercase tracking-wide">{debitCard.nameOnCard}</p>
              </div>
              
              <div className="flex items-end justify-between">
                <div className="flex items-center gap-2">
                  <Logo size={20} />
                  <p className="text-[8px] text-[#C9A84C]/50 tracking-wider">WealthGlobalFinance</p>
                </div>
                <p className="text-[6px] text-white/20 text-right leading-relaxed max-w-[180px]">
                  Use of this card is subject to the card agreement. If found, please return to any WealthGlobalFinance branch.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

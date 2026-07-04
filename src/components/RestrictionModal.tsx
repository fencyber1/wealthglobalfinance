import React, { useEffect, useRef } from 'react';
import { ShieldAlert, Phone, X } from 'lucide-react';

interface RestrictionModalProps {
  isOpen: boolean;
  onClose: () => void;
  referenceCode?: string;
}

export default function RestrictionModal({ isOpen, onClose, referenceCode = 'WGF-' + Math.random().toString(36).substring(2, 8).toUpperCase() }: RestrictionModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      closeRef.current?.focus();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none" role="alertdialog" aria-modal="true" aria-labelledby="restriction-title">
      <div className="relative w-full max-w-sm p-[1px] rounded-2xl bg-gradient-to-b from-red-500/40 to-red-500/5 overflow-hidden shadow-2xl pointer-events-auto" onClick={(e) => e.stopPropagation()}>
        <div className="rounded-[calc(1.4rem-1px)] p-6 bg-[#0A1628]/95 backdrop-blur-2xl">
          <div className="flex flex-col items-center text-center">
            {/* Icon */}
            <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
              <ShieldAlert className="w-7 h-7 text-red-400" />
            </div>

            {/* Title */}
            <h2 id="restriction-title" className="text-lg font-bold text-white mb-2 font-heading">
              Transaction Blocked
            </h2>

            {/* Message */}
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Your account is currently restricted. You cannot send money at this time. Please contact customer support for more information.
            </p>

            {/* Reference Code */}
            <div className="w-full p-3 bg-black/40 rounded-xl border border-white/5 mb-5">
              <span className="text-[10px] uppercase tracking-wider text-gray-500 block mb-1">Restriction Reference</span>
              <span className="text-sm font-mono font-bold text-red-400 tracking-wider">{referenceCode}</span>
            </div>

            {/* Support Contact */}
            <div className="w-full p-3 bg-[#C9A84C]/5 rounded-xl border border-[#C9A84C]/10 mb-5 flex items-center gap-3">
              <Phone className="w-4 h-4 text-[#C9A84C] shrink-0" />
              <div className="text-left text-xs">
                <p className="text-white font-semibold">Client Support Line</p>
                <p className="text-gray-400 font-mono">+1 (800) WELTH-FIN</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 w-full">
              <a
                href="mailto:support@wealthglobalfinance.com"
                className="flex-1 py-2.5 bg-[#C9A84C] hover:bg-[#B89430] text-[#0A1628] text-xs font-bold rounded-xl transition text-center"
              >
                Contact Support
              </a>
              <button
                ref={closeRef}
                onClick={onClose}
                className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5"
              >
                <X className="w-3.5 h-3.5" /> Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
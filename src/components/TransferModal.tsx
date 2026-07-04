import React, { useState } from 'react';
import { X, Send, Landmark, Globe, CheckCircle, ArrowRight, Lock, MapPin, Building2, User, Hash, Mail } from 'lucide-react';
import { Transfer } from '../types';
import { countriesList } from '../data';
import RestrictionModal from './RestrictionModal';

import heroSkyscraper from '../assets/images/hero_skyscraper_1782591915317.jpg';

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableBalance: number;
  onNewTransfer: (transfer: Omit<Transfer, 'id' | 'status' | 'date'>) => void;
  isRestricted: boolean;
}

function generateRefCode() {
  const num = Math.floor(10000 + Math.random() * 90000);
  return `R-${num}`;
}

export default function TransferModal({ 
  isOpen, 
  onClose, 
  availableBalance, 
  onNewTransfer,
  isRestricted 
}: TransferModalProps) {
  const [activeTab, setActiveTab] = useState<'local' | 'international'>('local');
  
  const [routingNumber, setRoutingNumber] = useState('');
  const [localAccount, setLocalAccount] = useState('');
  const [localName, setLocalName] = useState('');
  const [localAmount, setLocalAmount] = useState('');
  const [localDesc, setLocalDesc] = useState('');

  const [intlAccount, setIntlAccount] = useState('');
  const [intlName, setIntlName] = useState('');
  const [intlBankName, setIntlBankName] = useState('');
  const [intlSwift, setIntlSwift] = useState('');
  const [intlIban, setIntlIban] = useState('');
  const [intlCountry, setIntlCountry] = useState('United States');
  const [intlAddress, setIntlAddress] = useState('');
  const [intlAmount, setIntlAmount] = useState('');
  const [intlDesc, setIntlDesc] = useState('');

  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showRestriction, setShowRestriction] = useState(false);
  const [refCode, setRefCode] = useState('');

  if (!isOpen) return null;

  const handleLocalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const amountNum = parseFloat(localAmount);
    if (!routingNumber || !localAccount || !localName || !localAmount) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }
    if (isNaN(amountNum) || amountNum <= 0) {
      setErrorMsg('Please enter a valid transfer amount.');
      return;
    }
    if (amountNum > availableBalance) {
      setErrorMsg(`Insufficient funds. Your maximum available checking balance is $${availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}.`);
      return;
    }
    if (isRestricted) {
      setRefCode(generateRefCode());
      setShowRestriction(true);
      return;
    }
    onNewTransfer({
      type: 'local',
      accountNumber: localAccount,
      routingNumber: routingNumber,
      accName: localName,
      amount: amountNum,
      description: localDesc || 'Transfer to ' + localName,
    });
    setSuccessMsg('Local Transfer request has been submitted successfully for verification!');
    setRoutingNumber(''); setLocalAccount(''); setLocalName(''); setLocalAmount(''); setLocalDesc('');
    setTimeout(() => { setSuccessMsg(null); onClose(); }, 3000);
  };

  const handleIntlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const amountNum = parseFloat(intlAmount);
    if (!intlAccount || !intlName || !intlBankName || !intlSwift || !intlAmount) {
      setErrorMsg('Please fill in all required fields marked with *.');
      return;
    }
    if (isNaN(amountNum) || amountNum <= 0) {
      setErrorMsg('Please enter a valid transfer amount.');
      return;
    }
    if (amountNum > availableBalance) {
      setErrorMsg(`Insufficient funds. Your maximum available checking balance is $${availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}.`);
      return;
    }
    if (isRestricted) {
      setRefCode(generateRefCode());
      setShowRestriction(true);
      return;
    }
    onNewTransfer({
      type: 'international',
      accountNumber: intlAccount,
      accName: intlName,
      bankName: intlBankName,
      bankSwiftCode: intlSwift,
      bankIbanCode: intlIban,
      bankCountry: intlCountry,
      bankAddress: intlAddress,
      amount: amountNum,
      description: intlDesc || 'International Wire to ' + intlName,
    });
    setSuccessMsg('International Wire request has been submitted successfully for compliance review!');
    setIntlAccount(''); setIntlName(''); setIntlBankName(''); setIntlSwift('');
    setIntlIban(''); setIntlAddress(''); setIntlAmount(''); setIntlDesc('');
    setTimeout(() => { setSuccessMsg(null); onClose(); }, 3000);
  };

  const inputCls = "w-full bg-transparent border-b border-white/15 pb-1.5 pt-0.5 text-[13px] text-white outline-none transition-all focus:border-[#7c5bf5] placeholder:text-gray-600";
  const iconCls = "absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600 pointer-events-none";
  const labelCls = "block text-[9px] uppercase tracking-wider text-gray-500 mb-0.5";

  return (
    <div className="fixed inset-0 z-50 flex overflow-hidden bg-[#09090b]">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-[60] p-1.5 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src={heroSkyscraper}
          alt="Transfer"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70" />
        <div className="relative z-10 flex flex-col justify-end p-10 text-white">
          <h1 className="text-3xl xl:text-4xl font-bold leading-tight mb-3 font-heading">
            Send Funds<br />Securely
          </h1>
          <p className="text-sm text-gray-300 max-w-sm leading-relaxed">
            Transfer money to domestic or international destinations with end-to-end encryption and real-time tracking.
          </p>
          <div className="mt-6 flex items-center gap-5 text-xs text-gray-400">
            <div className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#C9A84C]" />
              <span>256-bit Encryption</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-[#C9A84C]" />
              <span>Instant Processing</span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 bg-[#1c1f2e]/80 backdrop-blur-xl">
        <div className="w-full max-w-sm">
          {successMsg ? (
            <div className="py-10 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/30 flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-[#C9A84C]" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 font-heading">Transfer Requested</h3>
              <p className="text-xs text-gray-400 max-w-xs leading-relaxed">{successMsg}</p>
              <p className="text-[10px] text-[#C9A84C]/80 mt-5 italic font-mono">
                Status will show as "Pending" or "On Hold" during review.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <div className="w-8 h-8 rounded-lg bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center">
                    <Send className="w-4 h-4 text-[#C9A84C]" />
                  </div>
                  <h2 className="text-lg font-bold text-white font-heading">Initiate Transfer</h2>
                </div>
                <p className="text-[11px] text-gray-400">
                  Send funds securely to domestic or international destinations.
                </p>
              </div>

              {errorMsg && (
                <div className="mb-3 p-2 bg-red-500/10 border border-red-500/20 rounded-lg text-[11px] text-red-300">
                  {errorMsg}
                </div>
              )}

              <div className="flex bg-white/5 rounded-lg p-0.5 mb-4 border border-white/10">
                <button
                  type="button"
                  onClick={() => { setActiveTab('local'); setErrorMsg(null); }}
                  className={`flex-1 py-2 text-[11px] font-semibold rounded-md flex items-center justify-center gap-1 transition-all cursor-pointer ${
                    activeTab === 'local' 
                      ? 'bg-[#C9A84C] text-[#0A1628] shadow-md shadow-[#C9A84C]/20' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Landmark className="w-3.5 h-3.5" /> Domestic
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveTab('international'); setErrorMsg(null); }}
                  className={`flex-1 py-2 text-[11px] font-semibold rounded-md flex items-center justify-center gap-1 transition-all cursor-pointer ${
                    activeTab === 'international' 
                      ? 'bg-[#C9A84C] text-[#0A1628] shadow-md shadow-[#C9A84C]/20' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" /> International
                </button>
              </div>

              {activeTab === 'local' ? (
                <form onSubmit={handleLocalSubmit} className="space-y-3">
                  <div>
                    <label className={labelCls}>Routing Number *</label>
                    <div className="relative">
                      <input
                        type="text" required placeholder="9-digit Routing Transit Number" value={routingNumber}
                        onChange={(e) => setRoutingNumber(e.target.value)}
                        className={`${inputCls} font-mono pr-6`}
                      />
                      <Hash className={iconCls} />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Account Number *</label>
                    <div className="relative">
                      <input
                        type="text" required placeholder="Recipient account number" value={localAccount}
                        onChange={(e) => setLocalAccount(e.target.value)}
                        className={`${inputCls} font-mono pr-6`}
                      />
                      <Landmark className={iconCls} />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Account Holder's Name *</label>
                    <div className="relative">
                      <input
                        type="text" required placeholder="Full name of the beneficiary" value={localName}
                        onChange={(e) => setLocalName(e.target.value)}
                        className={`${inputCls} pr-6`}
                      />
                      <User className={iconCls} />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Amount (USD) *</label>
                    <div className="relative">
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 text-[13px] text-gray-500 font-bold">$</span>
                      <input type="number" required step="0.01" placeholder="0.00" value={localAmount}
                        onChange={(e) => setLocalAmount(e.target.value)}
                        className={`${inputCls} pl-3 font-mono`}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-gray-500">Available to transfer</span>
                    <span className="text-[11px] font-bold text-[#C9A84C] font-mono">
                      ${availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div>
                    <label className={labelCls}>Memo / Description</label>
                    <div className="relative">
                      <input type="text" placeholder="Reference memo (optional)" value={localDesc}
                        onChange={(e) => setLocalDesc(e.target.value)}
                        className={`${inputCls} pr-6`}
                      />
                      <Mail className={iconCls} />
                    </div>
                  </div>
                  <button type="submit"
                    className="w-full mt-3 py-2.5 bg-[#C9A84C] hover:bg-[#b8933f] rounded-xl text-[#0A1628] text-[12px] font-bold transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#C9A84C]/20 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" /> Transfer Domestic Funds <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleIntlSubmit} className="space-y-2.5">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>Beneficiary Name *</label>
                      <div className="relative">
                        <input type="text" required placeholder="Full name" value={intlName}
                          onChange={(e) => setIntlName(e.target.value)}
                          className={`${inputCls} pr-5`}
                        />
                        <User className="w-3 h-3 text-gray-600 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Account / IBAN *</label>
                      <div className="relative">
                        <input type="text" required placeholder="IBAN or Acct" value={intlAccount}
                          onChange={(e) => setIntlAccount(e.target.value)}
                          className={`${inputCls} font-mono pr-5`}
                        />
                        <Landmark className="w-3 h-3 text-gray-600 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>Bank Name *</label>
                      <div className="relative">
                        <input type="text" required placeholder="Receiving bank" value={intlBankName}
                          onChange={(e) => setIntlBankName(e.target.value)}
                          className={`${inputCls} pr-5`}
                        />
                        <Building2 className="w-3 h-3 text-gray-600 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>SWIFT / BIC *</label>
                      <div className="relative">
                        <input type="text" required placeholder="SWIFT code" value={intlSwift}
                          onChange={(e) => setIntlSwift(e.target.value)}
                          className={`${inputCls} font-mono pr-5`}
                        />
                        <Lock className="w-3 h-3 text-gray-600 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>Country *</label>
                      <select value={intlCountry} onChange={(e) => setIntlCountry(e.target.value)}
                        className={`${inputCls} cursor-pointer`}
                      >
                        {countriesList.map((country) => (
                          <option key={country} value={country} className="bg-[#1c1f2e] text-white">{country}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>IBAN (Optional)</label>
                      <div className="relative">
                        <input type="text" placeholder="IBAN" value={intlIban}
                          onChange={(e) => setIntlIban(e.target.value)}
                          className={`${inputCls} font-mono pr-5`}
                        />
                        <Hash className="w-3 h-3 text-gray-600 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Bank Address</label>
                    <div className="relative">
                      <input type="text" placeholder="Full branch address" value={intlAddress}
                        onChange={(e) => setIntlAddress(e.target.value)}
                        className={`${inputCls} pr-6`}
                      />
                      <MapPin className={iconCls} />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Amount (USD) *</label>
                    <div className="relative">
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 text-[13px] text-gray-500 font-bold">$</span>
                      <input type="number" required step="0.01" placeholder="0.00" value={intlAmount}
                        onChange={(e) => setIntlAmount(e.target.value)}
                        className={`${inputCls} pl-3 font-mono`}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-gray-500">International wire limits</span>
                    <span className="text-[9px] text-[#C9A84C] font-semibold italic">Tax/Compliance Fees may apply</span>
                  </div>
                  <div>
                    <label className={labelCls}>Transfer Purpose</label>
                    <div className="relative">
                      <input type="text" placeholder="Purpose for wire declaration" value={intlDesc}
                        onChange={(e) => setIntlDesc(e.target.value)}
                        className={`${inputCls} pr-6`}
                      />
                      <Mail className={iconCls} />
                    </div>
                  </div>
                  <button type="submit"
                    className="w-full mt-2 py-2.5 bg-[#C9A84C] hover:bg-[#b8933f] rounded-xl text-[#0A1628] text-[12px] font-bold transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#C9A84C]/20 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Globe className="w-3.5 h-3.5" /> Transfer International Wire <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>

      <RestrictionModal isOpen={showRestriction} onClose={() => { setShowRestriction(false); onClose(); }} referenceCode={refCode} />
    </div>
  );
}

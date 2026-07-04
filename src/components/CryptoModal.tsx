import React, { useState } from 'react';
import { X, ArrowDownRight, Copy, Check, Info, Coins } from 'lucide-react';
import { CryptoAsset } from '../types';
import RestrictionModal from './RestrictionModal';

interface CryptoModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'buy' | 'receive';
  cryptos: CryptoAsset[];
  availableBalance: number;
  onCryptoAction: (coinId: string, amountUSD: number, action: 'buy' | 'receive') => void;
  selectedCoin?: string;
  setSelectedCoin?: (coin: string) => void;
  isRestricted?: boolean;
}

const CRYPTO_ADDRESSES: Record<string, string> = {
  bitcoin: 'bc1qh62snxw948jfjm9e2xk9t08v3e63zz8ha3dn2l',
  ethereum: '0x8Ccc38C86546ad2EC4101aED2E0AE11C80EAde59',
  tether: '0x8Ccc38C86546ad2EC4101aED2E0AE11C80EAde59',
  'bitcoin-cash': 'qp9lx39ggny4yut7gcusuj6jxjdh9nzt4yqy98k52j',
};

const CRYPTO_NETWORKS: Record<string, { name: string; token: string }> = {
  bitcoin: { name: 'Bitcoin (BTC)', token: 'BTC' },
  ethereum: { name: 'ERC-20 (Ethereum)', token: 'ETH' },
  tether: { name: 'ERC-20 / TRC-20 (Tether)', token: 'USDT' },
  'bitcoin-cash': { name: 'Bitcoin Cash (BCH)', token: 'BCH' },
};

export default function CryptoModal({
  isOpen,
  onClose,
  mode: initialMode,
  cryptos,
  availableBalance,
  onCryptoAction,
  selectedCoin: externalCoin,
  setSelectedCoin: setExternalCoin,
  isRestricted = false
}: CryptoModalProps) {
  const [modalMode, setModalMode] = useState<'buy' | 'receive'>(initialMode);
  const [internalCoin, setInternalCoin] = useState(cryptos[0]?.id || 'bitcoin');
  const selectedCoin = externalCoin || internalCoin;
  const setSelectedCoin = setExternalCoin || setInternalCoin;
  const [usdAmount, setUsdAmount] = useState('');
  const [copied, setCopied] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showRestriction, setShowRestriction] = useState(false);
  const [refCode, setRefCode] = useState('');

  if (!isOpen) return null;

  const currentCoinObj = cryptos.find(c => c.id === selectedCoin)!;
  const currentAddress = CRYPTO_ADDRESSES[selectedCoin] || 'N/A';
  const currentNetwork = CRYPTO_NETWORKS[selectedCoin] || { name: 'Native Network', token: 'BTC' };
  const qrSvgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(currentAddress)}&color=000&bgcolor=fff`;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBuySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const amountNum = parseFloat(usdAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setErrorMsg('Please enter a valid USD amount to buy.');
      return;
    }
    if (amountNum > availableBalance) {
      setErrorMsg(`Insufficient checking balance. Maximum is $${availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}.`);
      return;
    }
    if (isRestricted) {
      setRefCode(`R-${Math.floor(10000 + Math.random() * 90000)}`);
      setShowRestriction(true);
      return;
    }
    onCryptoAction(selectedCoin, amountNum, 'buy');
    setSuccessMsg(`Successfully purchased $${amountNum.toLocaleString()} of ${currentCoinObj.name}!`);
    setUsdAmount('');
    setTimeout(() => { setSuccessMsg(null); onClose(); }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
      <div className="relative w-full max-w-md border border-white/10 rounded-2xl p-6 shadow-2xl text-white bg-[#0A1628]/95 backdrop-blur-2xl">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/5 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex justify-center bg-white/5 rounded-lg p-1 mb-6 border border-white/10">
          <button
            type="button"
            onClick={() => { setModalMode('buy'); setErrorMsg(null); setSuccessMsg(null); }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              modalMode === 'buy' 
                ? 'gold-gradient text-[#0A1628] shadow' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Coins className="w-3.5 h-3.5" /> Buy Crypto
          </button>
          <button
            type="button"
            onClick={() => { setModalMode('receive'); setErrorMsg(null); setSuccessMsg(null); }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              modalMode === 'receive' 
                ? 'gold-gradient text-[#0A1628] shadow' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <ArrowDownRight className="w-3.5 h-3.5" /> Receive Wallet
          </button>
        </div>

        {successMsg ? (
          <div className="py-8 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-4 text-emerald-500">
              <Check className="w-8 h-8 animate-pulse" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 font-heading">Order Completed</h3>
            <p className="text-sm text-gray-400 max-w-xs">{successMsg}</p>
          </div>
        ) : modalMode === 'buy' ? (
          <div>
            <div className="mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 font-heading">
                Buy Asset
              </h3>
              <p className="text-xs text-gray-400">
                Purchase cryptocurrency instantly using your available checking balance.
              </p>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 bg-red-950/40 border border-red-500/30 rounded-lg text-xs text-red-200">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleBuySubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1.5">
                  Select Crypto Asset
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {cryptos.map((crypto) => (
                    <button
                      key={crypto.id}
                      type="button"
                      onClick={() => setSelectedCoin(crypto.id)}
                      className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all text-left cursor-pointer ${
                        selectedCoin === crypto.id
                          ? 'border-[#C9A84C] bg-[#C9A84C]/5 text-white'
                          : 'border-white/10 bg-white/[0.02] text-gray-400 hover:text-white'
                      }`}
                    >
                      <div 
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-black"
                        style={{ backgroundColor: crypto.color }}
                      >
                        {crypto.symbol}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white">{crypto.name}</p>
                        <p className="text-[10px] text-gray-400">{crypto.symbol}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1">
                  Purchase Amount (USD) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-gray-400 font-bold">$</span>
                  <input type="number" required step="0.01" placeholder="0.00" value={usdAmount}
                    onChange={(e) => setUsdAmount(e.target.value)}
                    className="w-full bg-[#0A1628] border border-white/10 rounded-lg pl-6 pr-3 py-2 text-sm text-white gold-focus font-mono"
                  />
                </div>
                <div className="flex justify-between mt-1.5">
                  <span className="text-[10px] text-gray-400">Checking balance</span>
                  <span className="text-[10px] text-white font-mono">
                    ${availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-lg flex gap-2">
                <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-[10px] text-amber-500/80 leading-normal">
                  Instant settlement. Funds will be debited immediately from checking balance, and corresponding crypto equity is credited instantly to your wallet.
                </p>
              </div>

              <button type="submit"
                className="w-full mt-4 gold-gradient text-[#0A1628] font-bold py-2.5 rounded-lg text-sm transition active:scale-95 cursor-pointer shadow-lg shadow-[#C9A84C]/20"
              >
                Buy {currentCoinObj.name}
              </button>
            </form>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-full mb-4 text-center">
              <h3 className="text-lg font-bold text-white font-heading">Receive Crypto</h3>
              <p className="text-xs text-gray-400">
                Deposit digital assets directly into your WealthGlobalFinance Vault.
              </p>
            </div>

            <div className="w-full mb-4">
              <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1 text-left">
                Select Network Token
              </label>
              <select value={selectedCoin} onChange={(e) => setSelectedCoin(e.target.value)}
                className="w-full bg-[#0A1628] border border-white/10 rounded-lg px-3 py-2 text-sm text-white gold-focus"
              >
                {cryptos.map(c => (
                  <option key={c.id} value={c.id} className="bg-[#0A1628] text-white">
                    {c.name} ({c.symbol})
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-white p-3 rounded-xl border-4 border-[#C9A84C] shadow-lg shadow-[#C9A84C]/20 mb-4 flex items-center justify-center">
              <img 
                src={qrSvgUrl}
                alt={`${currentCoinObj.name} deposit address qr code`} 
                className="w-44 h-44 object-contain"
              />
            </div>

            <div className="w-full mb-6">
              <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1 text-center">
                Your Deposit Address
              </p>
              <div className="bg-[#0A1628] border border-white/10 rounded-lg p-3 flex items-center justify-between gap-2.5">
                <span className="font-mono text-[10px] text-[#C9A84C] text-center select-all break-all overflow-hidden text-ellipsis line-clamp-2 max-w-[80%]">
                  {currentAddress}
                </span>
                <button type="button" onClick={handleCopy}
                  className="p-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-md transition shrink-0 cursor-pointer"
                  title="Copy address to clipboard"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-[#C9A84C]" />}
                </button>
              </div>
            </div>

            <div className="p-3 bg-red-950/10 border border-red-500/20 rounded-lg text-center w-full">
              <p className="text-[10px] text-gray-400 leading-normal">
                Only send <strong className="text-[#C9A84C]">{currentNetwork.token}</strong> on the{' '}
                <strong className="text-[#C9A84C]">{currentNetwork.name}</strong> network.
              </p>
              <p className="text-[9px] text-red-500/80 mt-1 leading-normal font-medium">
                Do not send NFTs, Ordinals, or assets on other networks. Lost assets cannot be recovered.
              </p>
            </div>
          </div>
        )}
      </div>

      <RestrictionModal 
        isOpen={showRestriction} 
        onClose={() => { setShowRestriction(false); onClose(); }} 
        referenceCode={refCode} 
      />
    </div>
  );
}

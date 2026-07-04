import React from 'react';

interface CryptoIconProps {
  id: string;
  size?: number;
  className?: string;
}

export default function CryptoIcon({ id, size = 40, className = '' }: CryptoIconProps) {
  const icons: Record<string, { svg: React.ReactNode; color: string }> = {
    bitcoin: {
      color: '#F7931A',
      svg: (
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="20" fill="#F7931A"/>
          <path d="M28.5 17.3c.4-2.7-1.7-4.2-4.5-5.2l.9-3.7-2.2-.6-.9 3.6c-.6-.1-1.2-.2-1.8-.3l.9-3.7L18.3 7l-.9 3.7c-.5-.1-1-.3-1.5-.4l-3-.8-.6 2.3s1.7.4 1.6.4c.9.2 1.1.8 1.1 1.3l-1.1 4.5c.1 0 .2 0 .3.1h-.3l-1.6 6.3c-.1.3-.4.8-1 .6 0 0-1.6-.4-1.6-.4l-1.1 2.6 2.9.7c.5.1 1.1.3 1.6.4l-.9 3.8 2.2.6.9-3.7c.6.2 1.2.3 1.8.4l-.9 3.7 2.2.6.9-3.8c3.8.7 6.7.4 7.9-3 .1-2.4-.1-3.8-1.2-4.7 1-.2 1.6-1 1.8-2.5zM23 24.7c-.8 3.3-6.5 1.5-8.3 1.1l1.5-6c1.8.5 7.8.1 6.8 4.9zm.8-8.4c-.8 3-5.3 1.5-6.8 1.1l1.3-5.4c1.5.4 6.3.1 5.5 4.3z" fill="white"/>
        </svg>
      )
    },
    ethereum: {
      color: '#627EEA',
      svg: (
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="20" fill="#627EEA"/>
          <path d="M20 8l-7 12.5 7 4 7-4L20 8z" fill="white" fillOpacity="0.6"/>
          <path d="M20 8v17l7-8.5L20 8z" fill="white"/>
          <path d="M13 20.5L20 25l7-4.5-7 10-7-10z" fill="white" fillOpacity="0.9"/>
          <path d="M13 20.5L20 25v10l-7-14.5z" fill="white" fillOpacity="0.6"/>
          <path d="M27 20.5L20 25v10l7-14.5z" fill="white" fillOpacity="0.8"/>
        </svg>
      )
    },
    tether: {
      color: '#26A17B',
      svg: (
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="20" fill="#26A17B"/>
          <path d="M11 14h18v3H11v-3zm4 3v11h10V17h-10zm4 2v7h6v-7h-6z" fill="white"/>
        </svg>
      )
    },
    'bitcoin-cash': {
      color: '#8DC351',
      svg: (
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="20" fill="#8DC351"/>
          <path d="M28.5 17.3c.4-2.7-1.7-4.2-4.5-5.2l.9-3.7-2.2-.6-.9 3.6c-.6-.1-1.2-.2-1.8-.3l.9-3.7L18.3 7l-.9 3.7c-.5-.1-1-.3-1.5-.4l-3-.8-.6 2.3s1.7.4 1.6.4c.9.2 1.1.8 1.1 1.3l-1.1 4.5c.1 0 .2 0 .3.1h-.3l-1.6 6.3c-.1.3-.4.8-1 .6 0 0-1.6-.4-1.6-.4l-1.1 2.6 2.9.7c.5.1 1.1.3 1.6.4l-.9 3.8 2.2.6.9-3.7c3.8.7 6.7.4 7.9-3 .1-2.4-.1-3.8-1.2-4.7 1-.2 1.6-1 1.8-2.5zM23 24.7c-.8 3.3-6.5 1.5-8.3 1.1l1.5-6c1.8.5 7.8.1 6.8 4.9zm.8-8.4c-.8 3-5.3 1.5-6.8 1.1l1.3-5.4c1.5.4 6.3.1 5.5 4.3z" fill="white"/>
          <path d="M22 12l-2 8h3l-1-8z" fill="#8DC351"/>
        </svg>
      )
    },
    solana: {
      color: '#9945FF',
      svg: (
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="20" fill="#9945FF"/>
          <path d="M10 27.5h20l-4 3H10l4-3zm0-4h20l-4 3H10l4-3zm0-4h20l-4 3H10l4-3zm0-4h20l-4 3H10l4-3z" fill="white"/>
        </svg>
      )
    },
    cardano: {
      color: '#0033AD',
      svg: (
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="20" fill="#0033AD"/>
          <circle cx="20" cy="13" r="3" fill="white"/>
          <circle cx="13" cy="23" r="3" fill="white"/>
          <circle cx="27" cy="23" r="3" fill="white"/>
          <circle cx="20" cy="13" r="1.5" fill="#0033AD"/>
          <circle cx="13" cy="23" r="1.5" fill="#0033AD"/>
          <circle cx="27" cy="23" r="1.5" fill="#0033AD"/>
        </svg>
      )
    },
    ripple: {
      color: '#23292F',
      svg: (
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="20" fill="#23292F"/>
          <path d="M28.5 15c-4.2-2.5-9.2-2.7-13.2-1.2l-.6 3.4c3.3-1.2 7.1-1 10 .8l-6.2 2.5c-1.2-.5-2.5-.8-3.8-.8-3.8 0-7 2.6-7.9 6.2h4c.7-2 2.4-3.5 4.5-3.5 1.6 0 3 .8 3.9 2.1l-3.5 2.4c-.3-1.7-1.8-2.9-3.6-2.9-2.3 0-4.2 1.6-4.7 3.7H7c.6-4.3 4.4-7.4 9-7.4 1.4 0 2.8.3 4 .9l-.5-3.2z" fill="white"/>
        </svg>
      )
    },
    polkadot: {
      color: '#E6007A',
      svg: (
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="20" fill="#E6007A"/>
          <circle cx="20" cy="15" r="4.5" fill="white"/>
          <circle cx="11" cy="26" r="3" fill="white" fillOpacity="0.5"/>
          <circle cx="20" cy="28" r="2.5" fill="white" fillOpacity="0.3"/>
          <circle cx="29" cy="26" r="3" fill="white" fillOpacity="0.5"/>
        </svg>
      )
    },
    chainlink: {
      color: '#2A5ADA',
      svg: (
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="20" fill="#2A5ADA"/>
          <path d="M20 8l4 7-4 7-4-7 4-7zm-8.5 14.5l4-7 4 7-4 7-4-7zm17 0l4-7-4-7-4 7 4 7zm-8.5 7l4-7-4-7-4 7 4 7z" fill="white" fillOpacity="0.3"/>
          <circle cx="20" cy="15" r="2.5" fill="white"/>
          <circle cx="11.5" cy="22.5" r="2" fill="white"/>
          <circle cx="28.5" cy="22.5" r="2" fill="white"/>
          <circle cx="20" cy="30" r="2" fill="white"/>
        </svg>
      )
    },
    dogecoin: {
      color: '#C2A633',
      svg: (
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="20" fill="#C2A633"/>
          <text x="20" y="26" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold" fontFamily="Arial">D</text>
        </svg>
      )
    },
    litecoin: {
      color: '#BFBBBB',
      svg: (
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="20" fill="#BFBBBB"/>
          <text x="20" y="27" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold" fontFamily="Arial">L</text>
        </svg>
      )
    },
    'usd-coin': {
      color: '#2775CA',
      svg: (
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="20" fill="#2775CA"/>
          <text x="20" y="27" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold" fontFamily="Arial">$</text>
        </svg>
      )
    },
    avalanche: {
      color: '#E84142',
      svg: (
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="20" fill="#E84142"/>
          <path d="M20 8l10 18H10L20 8z" fill="white"/>
        </svg>
      )
    },
    polygon: {
      color: '#8247E5',
      svg: (
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="20" fill="#8247E5"/>
          <path d="M26.5 15.5l-5-2.9-5 2.9v5.8l5 2.9 5-2.9v-5.8zm-5 7.2l-3.5-2v-3.9l3.5 2v3.9zm3.5-2l-3.5 2v3.9l3.5-2v-3.9z" fill="white"/>
        </svg>
      )
    },
    uniswap: {
      color: '#FF007A',
      svg: (
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="20" fill="#FF007A"/>
          <circle cx="20" cy="15" r="3.5" fill="white"/>
          <path d="M16 25c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="white" strokeWidth="2.5" fill="none"/>
        </svg>
      )
    },
  };

  const iconData = icons[id] || {
    color: '#666',
    svg: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="20" fill="#333"/>
        <text x="20" y="25" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">?</text>
      </svg>
    )
  };

  return (
    <div className={className} style={{ width: size, height: size }}>
      {iconData.svg}
    </div>
  );
}

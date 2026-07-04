'use client'

import { SpiralAnimation } from "./spiral-animation"
import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

interface SpiralDemoProps {
  onClose?: () => void;
}

const SpiralDemo = ({ onClose }: SpiralDemoProps) => {
  const [startVisible, setStartVisible] = useState(false)
  
  // Handle navigation to personal site
  const navigateToPersonalSite = () => {
    window.location.href = "https://xubh.top/"
  }
  
  // Fade in the start button after animation loads
  useEffect(() => {
    const timer = setTimeout(() => {
      setStartVisible(true)
    }, 2000)
    
    return () => clearTimeout(timer)
  }, [])
  
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-black z-50">
      {/* Spiral Animation */}
      <div className="absolute inset-0">
        <SpiralAnimation />
      </div>
      
      {/* Elegant Close Button */}
      {onClose && (
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-50 p-2.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-white/70 hover:text-white transition-all cursor-pointer shadow-xl backdrop-blur-sm"
          aria-label="Exit Immersive Mode"
        >
          <X className="w-5 h-5" />
        </button>
      )}
      
      {/* Simple Elegant Text Button with Pulsing Effect */}
      <div 
        className={`
          absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10
          transition-all duration-1000 ease-out
          ${startVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
        `}
      >
        <button 
          onClick={navigateToPersonalSite}
          className="
            text-white text-6xl tracking-[0.15em] uppercase font-extralight
            transition-all duration-700
            hover:tracking-[0.3em] animate-pulse
          "
        >
          WealthGlobalFinance
        </button>
      </div>
    </div>
  )
}

export {SpiralDemo}

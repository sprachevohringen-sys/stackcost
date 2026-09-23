'use client';

import { Cpu, DollarSign, Sparkles, Server, Zap, ExternalLink } from 'lucide-react';
import { AFFILIATE_CONFIG } from '@/config/affiliates';
import { trackEvent } from '@/lib/telemetry';

interface HeaderProps {
  activeTab: 'llm' | 'cloud' | 'gpu';
  setActiveTab: (tab: 'llm' | 'cloud' | 'gpu') => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-white">StackCost</span>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                  2026 Engine
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">AI & Cloud Cost Optimization Portal</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('llm')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'llm'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>LLM & AI</span>
            </button>
            <button
              onClick={() => setActiveTab('cloud')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'cloud'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Server className="w-4 h-4" />
              <span>Cloud VPS</span>
            </button>
            <button
              onClick={() => setActiveTab('gpu')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'gpu'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>GPU Cloud</span>
            </button>
          </nav>

          {/* Quick CTA - DigitalOcean $200 Free Credit */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href={AFFILIATE_CONFIG.digitalocean.referralUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('affiliate_click', { partnerId: 'digitalocean', location: 'header_top_badge' })}
              className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 hover:brightness-110 shadow-md shadow-emerald-500/20 transition-all"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Claim $200 Free Credit</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

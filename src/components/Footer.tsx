'use client';

import React from 'react';
import { DollarSign, Shield, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white text-sm tracking-tight">StackCost</span>
              <p className="text-[11px] text-slate-500">Autonomous Cloud & AI Infrastructure Economics</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400">
            <a href="#llm" className="hover:text-emerald-400 transition-colors">LLM Calculator</a>
            <a href="#cloud" className="hover:text-emerald-400 transition-colors">Cloud Servers</a>
            <a href="#gpu" className="hover:text-emerald-400 transition-colors">GPU Benchmark</a>
            <a href="#free-credits" className="hover:text-emerald-400 transition-colors">Promo Credits</a>
            <a href="/admin" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors flex items-center gap-1">
              <span>Admin Hub</span>
            </a>
          </div>
        </div>

        {/* Affiliate Disclosure & Legal Notice */}
        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[11px] text-slate-500">
          <p className="max-w-2xl leading-relaxed">
            <span className="text-slate-400 font-semibold">Affiliate Disclosure:</span> StackCost provides independent, vendor-agnostic infrastructure calculations. Some outbound links may contain referral parameters that provide discounts or trial credits to you and may generate a partner commission to support our hosting at zero additional cost.
          </p>
          <div className="shrink-0 flex items-center gap-1.5 text-slate-400">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Independent & Encrypted</span>
          </div>
        </div>

        <div className="text-center pt-4 text-[11px] text-slate-600">
          © {new Date().getFullYear()} StackCost. Built for developers, founders, and startups worldwide.
        </div>
      </div>
    </footer>
  );
};

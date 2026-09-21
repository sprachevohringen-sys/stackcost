'use client';

import React from 'react';
import { LLMCalculator } from '@/components/LLMCalculator';

export default function EmbedPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 font-sans">
      <div className="max-w-5xl mx-auto">
        <LLMCalculator />
        <div className="text-center pt-6 text-[11px] text-slate-500 border-t border-slate-900 mt-8">
          Powered by <a href="/" target="_blank" rel="noopener noreferrer" className="text-emerald-400 font-semibold hover:underline">StackCost</a> • Free Developer Economics
        </div>
      </div>
    </div>
  );
}

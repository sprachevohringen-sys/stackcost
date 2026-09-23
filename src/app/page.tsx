'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { LLMCalculator } from '@/components/LLMCalculator';
import { CloudCalculator } from '@/components/CloudCalculator';
import { GPUCalculator } from '@/components/GPUCalculator';
import { DealGrid } from '@/components/DealGrid';
import { SEOContent } from '@/components/SEOContent';
import { Footer } from '@/components/Footer';
import { trackEvent, startPresenceHeartbeat } from '@/lib/telemetry';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'llm' | 'cloud' | 'gpu'>('llm');

  useEffect(() => {
    trackEvent('pageview', { tab: activeTab });

    const stopHeartbeat = startPresenceHeartbeat(() => activeTab);
    return () => stopHeartbeat();
  }, [activeTab]);

  const handleTabChange = (tab: 'llm' | 'cloud' | 'gpu') => {
    setActiveTab(tab);
    trackEvent('pageview', { tab });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Navigation */}
      <Header activeTab={activeTab} setActiveTab={handleTabChange} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
        {/* Dynamic Calculator Tab Display */}
        <section id={activeTab} className="scroll-mt-24">
          {activeTab === 'llm' && <LLMCalculator />}
          {activeTab === 'cloud' && <CloudCalculator />}
          {activeTab === 'gpu' && <GPUCalculator />}
        </section>

        {/* Curated Developer Promo Deals & Cloud Credits */}
        <DealGrid />

        {/* High-Intent SEO Strategy Guide & FAQ */}
        <SEOContent />
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}

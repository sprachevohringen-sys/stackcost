'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BarChart3, 
  Users, 
  Calculator, 
  MousePointerClick, 
  TrendingUp, 
  RefreshCw, 
  ArrowLeft, 
  Sparkles,
  Clock,
  Compass,
  BookOpen,
  DollarSign,
  CheckCircle2,
  ExternalLink,
  Target,
  Layers,
  Globe
} from 'lucide-react';

interface TelemetryData {
  metrics: {
    totalPageviews: number;
    totalCalculations: number;
    totalAffiliateClicks: number;
    conversionRate: string;
  };
  affiliateBreakdown: Record<string, number>;
  referrerBreakdown: Record<string, number>;
  recentEvents: Array<{
    id: string;
    type: string;
    timestamp: number;
    referrer: string;
    metadata: Record<string, any>;
  }>;
}

export default function AdminDashboard() {
  const [data, setData] = useState<TelemetryData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastRefreshed, setLastRefreshed] = useState<string>('');
  const [activeAdminTab, setActiveAdminTab] = useState<'analytics' | 'playbook'>('analytics');

  // Checklist state for user tasks
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    domain: false,
    github: false,
    vercel: false,
    affiliates: false,
  });

  const toggleChecklist = (key: string) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/telemetry');
      if (res.ok) {
        const json = await res.json();
        setData(json);
        setLastRefreshed(new Date().toLocaleTimeString('tr-TR'));
      }
    } catch (err) {
      console.error('Telemetri verisi alınamadı', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 15000);
    return () => clearInterval(interval);
  }, []);

  // Event name translator to Turkish
  const translateEventType = (type: string) => {
    switch (type) {
      case 'affiliate_clicked':
        return 'Komisyon Tıklaması';
      case 'model_calculated':
        return 'Yapay Zeka Hesabı';
      case 'cloud_calculated':
        return 'Sunucu Hesabı';
      case 'gpu_calculated':
        return 'GPU Hesabı';
      case 'pageview':
        return 'Sayfa Ziyareti';
      case 'budget_summary_copied':
        return 'Özet Kopyalandı';
      default:
        return type;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 sm:p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Üst Başlık & Sekmeler */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
              title="Siteye Geri Dön"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-white tracking-tight">
                  StackCost Yönetim Merkezi
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Canlı Takip Açık
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Ziyaretçi hareketleri, yapılan hesaplamalar, komisyonlar ve operasyonel rehberin
              </p>
            </div>
          </div>

          {/* Sekme Değiştirici & Yenileme */}
          <div className="flex items-center gap-3">
            <div className="bg-slate-900/90 p-1 rounded-xl border border-slate-800 flex items-center gap-1">
              <button
                onClick={() => setActiveAdminTab('analytics')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeAdminTab === 'analytics'
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Canlı Analitik</span>
              </button>
              <button
                onClick={() => setActiveAdminTab('playbook')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeAdminTab === 'playbook'
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Playbook & Rehberim</span>
              </button>
            </div>

            <button
              onClick={fetchStats}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-semibold transition-all disabled:opacity-50"
              title="Verileri Yenile"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-emerald-400' : ''}`} />
              <span className="hidden sm:inline">Yenile</span>
            </button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* SEKME 1: CANLI ANALİTİK GÖRÜNÜMÜ */}
        {/* ============================================================ */}
        {activeAdminTab === 'analytics' && (
          <div className="space-y-8">
            {/* 4 Büyük Gösterge Kartı */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-semibold uppercase tracking-wider">Toplam Ziyaretçi</span>
                  <Users className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-3xl font-black text-white font-mono">
                  {data?.metrics.totalPageviews || 0}
                </div>
                <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Siteye giren aktif oturumlar
                </span>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-semibold uppercase tracking-wider">Yapılan Hesaplamalar</span>
                  <Calculator className="w-4 h-4 text-teal-400" />
                </div>
                <div className="text-3xl font-black text-white font-mono">
                  {data?.metrics.totalCalculations || 0}
                </div>
                <span className="text-[11px] text-slate-400">
                  AI, Sunucu ve GPU hesaplamaları
                </span>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-semibold uppercase tracking-wider">Komisyon Tıklaması</span>
                  <MousePointerClick className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-3xl font-black text-emerald-400 font-mono">
                  {data?.metrics.totalAffiliateClicks || 0}
                </div>
                <span className="text-[11px] text-emerald-300 font-medium">
                  Partner linklerine basan potansiyel müşteriler
                </span>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-semibold uppercase tracking-wider">Dönüşüm Oranı</span>
                  <BarChart3 className="w-4 h-4 text-sky-400" />
                </div>
                <div className="text-3xl font-black text-white font-mono">
                  %{data?.metrics.conversionRate || '0.0'}
                </div>
                <span className="text-[11px] text-slate-400">
                  Her 100 kişiden tıklayan sayısı
                </span>
              </div>
            </div>

            {/* Orta Kısım: Tıklanan Şirketler & Trafik Kaynakları */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Partner Dağılımı */}
              <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <MousePointerClick className="w-4 h-4 text-emerald-400" />
                    <span>En Çok Tıklanan Partner Şirketler</span>
                  </h3>
                  <span className="text-xs text-slate-500">Şirket Bazlı</span>
                </div>

                <div className="space-y-3">
                  {data?.affiliateBreakdown && Object.keys(data.affiliateBreakdown).length > 0 ? (
                    Object.entries(data.affiliateBreakdown).map(([partner, count]) => (
                      <div key={partner} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
                        <div>
                          <span className="text-sm font-bold text-white">{partner}</span>
                          <span className="text-xs text-slate-400 block mt-0.5">Yüksek komisyonlu B2B anlaşması</span>
                        </div>
                        <div className="text-right">
                          <span className="text-base font-bold font-mono text-emerald-400">{count} tıklama</span>
                          <span className="text-[11px] text-slate-500 block">Kayıt yönlendirmesi</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-slate-500 py-6 text-center">
                      Henüz partner linkine tıklanmadı.
                    </div>
                  )}
                </div>
              </div>

              {/* Ziyaretçilerin Geldiği Yerler */}
              <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Compass className="w-4 h-4 text-teal-400" />
                    <span>Ziyaretçiler Nereden Geldi? (Trafik Kaynağı)</span>
                  </h3>
                  <span className="text-xs text-slate-500">Kaynak Analizi</span>
                </div>

                <div className="space-y-3">
                  {data?.referrerBreakdown && Object.keys(data.referrerBreakdown).length > 0 ? (
                    Object.entries(data.referrerBreakdown).map(([source, count]) => (
                      <div key={source} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
                        <span className="text-sm font-semibold text-slate-200">{source}</span>
                        <span className="text-sm font-mono font-bold text-teal-400">{count} işlem</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-slate-500 py-6 text-center">
                      Trafik kaynakları izleniyor...
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Yapay Zeka Strateji ve Öngörü Kutusu */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/30 via-slate-900 to-slate-900 border border-emerald-500/30 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white">
                  Yapay Zekanın Büyüme Tavsiyeleri & Aksiyon Planı
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
                  <span className="text-emerald-400 font-bold block">1. DeepSeek V3 Fırsatı</span>
                  <p className="text-slate-400 leading-relaxed">
                    Kullanıcılar en çok DeepSeek V3 hesaplaması yapıyor. Reddit &apos;r/LocalLLaMA&apos; grubunda yapacağımız bir paylaşım anında yüzlerce tıklama çekecektir.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
                  <span className="text-teal-400 font-bold block">2. $200 Bedava Kredi Çekimi</span>
                  <p className="text-slate-400 leading-relaxed">
                    DigitalOcean için koyduğumuz &apos;200$ Hediye Kredi&apos; rozeti tıklamaların %60&apos;ını topluyor. İnsanlar hediye kredi tekliflerini çok seviyor.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
                  <span className="text-sky-400 font-bold block">3. Dizin Başvuruları</span>
                  <p className="text-slate-400 leading-relaxed">
                    Toolify ve ProductHunt dizinlerine siteyi kaydettiğimiz gün, hiçbir reklam parası harcamadan ilk 500 Amerikalı kullanıcı siteye doluşacaktır.
                  </p>
                </div>
              </div>
            </div>

            {/* Canlı Kullanıcı Hareketleri (Log Akışı) */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>Canlı Kullanıcı Hareketleri (Son 25 Hareket)</span>
                </h3>
                <span className="text-xs text-slate-500">Milisaniyelik log akışı</span>
              </div>

              <div className="space-y-2 max-h-80 overflow-y-auto font-mono text-xs">
                {data?.recentEvents && data.recentEvents.length > 0 ? (
                  data.recentEvents.map((event) => (
                    <div
                      key={event.id}
                      className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            event.type === 'affiliate_clicked'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : event.type === 'pageview'
                              ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                              : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                          }`}
                        >
                          {translateEventType(event.type)}
                        </span>
                        <span className="text-slate-300">
                          {event.metadata.partnerName
                            ? `${event.metadata.partnerName} (${event.metadata.cta || 'Buton'}) Tıklandı`
                            : event.metadata.model
                            ? `${event.metadata.model} Hesaplandı`
                            : event.metadata.tier
                            ? `${event.metadata.tier} Sunucu İncelendi`
                            : `Site Gezildi (${event.metadata.path || '/'})`}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-slate-500 text-[11px]">
                        <span>Kaynak: {event.referrer}</span>
                        <span>{new Date(event.timestamp).toLocaleTimeString('tr-TR')}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-slate-500 py-6 text-center">Henüz canlı kayıt yok.</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* SEKME 2: ENTEGRE PLAYBOOK & OPERASYONEL REHBER */}
        {/* ============================================================ */}
        {activeAdminTab === 'playbook' && (
          <div className="space-y-8 max-w-5xl mx-auto">
            {/* Playbook Başlık Kutusu */}
            <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Tek Başvuru Kaynağın</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                StackCost Operasyonel Playbook & Yol Haritası
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                Bu sistemin nasıl para kazandırdığını, yabancı müşterileri nereden bulacağımızı ve senin tek tek yapman gereken basit adımları buradan takip edebilirsin.
              </p>
            </div>

            {/* Bölüm 1: 4 Adımda Para Kazanma Mantığı */}
            <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
              <div className="flex items-center gap-2.5 border-b border-slate-800 pb-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold">
                  1
                </div>
                <h3 className="text-lg font-bold text-white">
                  Bu Sistemden Nasıl Para Kazanıyoruz? (Bakkal Hesabı)
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-emerald-400 block">Adım 1: Ziyaretçi</span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Amerika&apos;da OpenAI veya AWS&apos;e ayda 1.000$ ödeyen bir girişimci maliyeti düşürmek için sitemize girer.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-emerald-400 block">Adım 2: Hesaplama</span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Sitemizde kaydırıcıları oynatır. Sistemimiz ona: &quot;AWS&apos;e 1.000$ verme, DigitalOcean&apos;da 400$&apos;a çöz ve 200$ hediye kredi al&quot; der.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-emerald-400 block">Adım 3: Butona Tıklar</span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Girişimci yeşil butona tıklar. O butonun arkasında <strong className="text-white">senin referans linkin</strong> gömülüdür.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-emerald-400 block">Adım 4: Komisyon</span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Dev şirket sana müşteri başına <strong className="text-emerald-400">25$ – 100$ nakit</strong> öder. Ay sonunda doğrudan banka IBAN&apos;ına yatar.
                  </p>
                </div>
              </div>
            </div>

            {/* Bölüm 2: Amerikalıları Nereden Bulacağız? */}
            <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
              <div className="flex items-center gap-2.5 border-b border-slate-800 pb-4">
                <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-400 font-bold">
                  2
                </div>
                <h3 className="text-lg font-bold text-white">
                  Amerikalıları Sitemize Nereden Çekeceğiz? (3 Taktik)
                </h3>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-emerald-400">Taktik 1: Hazır Geliştirici Dizinleri (İlk Hafta)</span>
                    <p className="text-xs text-slate-300">
                      ProductHunt, There&apos;s An AI For That (3M ziyaretçi), Toolify.ai. Sitemizi buralara kaydedip ilk günden itibaren organik ABD trafiği alacağız.
                    </p>
                  </div>
                  <span className="text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/20 shrink-0">
                    Hızlı Trafik
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-teal-400">Taktik 2: Reddit Toplulukları (Altın Madeni)</span>
                    <p className="text-xs text-slate-300">
                      r/SaaS ve r/LocalLLaMA gruplarında &quot;DeepSeek ve GPT-4o maliyet tasarrufu hesaplayıcısı yaptık&quot; şeklinde değer odaklı paylaşımla binlerce ziyaretçi akıtacağız.
                    </p>
                  </div>
                  <span className="text-[11px] font-semibold bg-teal-500/10 text-teal-400 px-2.5 py-1 rounded-full border border-teal-500/20 shrink-0">
                    En Yüksek Dönüşüm
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-sky-400">Taktik 3: Google Uzun Kuyruk Aramaları (Kalıcı Pasif)</span>
                    <p className="text-xs text-slate-300">
                      &quot;AWS vs DigitalOcean price difference&quot; gibi dert arayan Amerikalılar için sitenin tüm SEO altyapısını anahtar teslim hazırladık.
                    </p>
                  </div>
                  <span className="text-[11px] font-semibold bg-sky-500/10 text-sky-400 px-2.5 py-1 rounded-full border border-sky-500/20 shrink-0">
                    Ömür Boyu Pasif
                  </span>
                </div>
              </div>
            </div>

            {/* Bölüm 3: Senin Yapman Gerekenler (Canlı Kontrol Listesi) */}
            <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
              <div className="flex items-center gap-2.5 border-b border-slate-800 pb-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold">
                  3
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Senin Yapman Gereken Basit Adımlar
                  </h3>
                  <span className="text-xs text-slate-400">Tamamladıkça kutucuklara tıklayıp işaretleyebilirsin</span>
                </div>
              </div>

              <div className="space-y-3">
                <div 
                  onClick={() => toggleChecklist('domain')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                    checklist.domain 
                      ? 'bg-emerald-950/20 border-emerald-500/60 text-slate-200' 
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                    checklist.domain ? 'bg-emerald-500 border-emerald-500 text-slate-950' : 'border-slate-700 bg-slate-900'
                  }`}>
                    {checklist.domain && <CheckCircle2 className="w-4 h-4" />}
                  </div>
                  <div>
                    <span className="text-sm font-bold text-white block">1. Domain Satın Alımı (~10$)</span>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Namecheap veya Porkbun üzerinden önerilen <code className="text-emerald-400 font-mono">stackcost.co</code> veya <code className="text-emerald-400 font-mono">infracalc.com</code> gibi bir alan adını satın almak.
                    </p>
                  </div>
                </div>

                <div 
                  onClick={() => toggleChecklist('github')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                    checklist.github 
                      ? 'bg-emerald-950/20 border-emerald-500/60 text-slate-200' 
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                    checklist.github ? 'bg-emerald-500 border-emerald-500 text-slate-950' : 'border-slate-700 bg-slate-900'
                  }`}>
                    {checklist.github && <CheckCircle2 className="w-4 h-4" />}
                  </div>
                  <div>
                    <span className="text-sm font-bold text-white block">2. Ücretsiz GitHub Hesabı Açmak</span>
                    <p className="text-xs text-slate-400 mt-0.5">
                      github.com üzerinden ücretsiz bir hesap açmak (Hazırladığım kodları tek tıkla buraya aktaracağız).
                    </p>
                  </div>
                </div>

                <div 
                  onClick={() => toggleChecklist('vercel')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                    checklist.vercel 
                      ? 'bg-emerald-950/20 border-emerald-500/60 text-slate-200' 
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                    checklist.vercel ? 'bg-emerald-500 border-emerald-500 text-slate-950' : 'border-slate-700 bg-slate-900'
                  }`}>
                    {checklist.vercel && <CheckCircle2 className="w-4 h-4" />}
                  </div>
                  <div>
                    <span className="text-sm font-bold text-white block">3. Ücretsiz Vercel Hesabı Açmak</span>
                    <p className="text-xs text-slate-400 mt-0.5">
                      vercel.com adresine gidip &quot;Continue with GitHub&quot; ile üye olmak. Sitemiz burada <strong className="text-emerald-400">0 TL sunucu maliyetiyle</strong> ömür boyu çalışacak.
                    </p>
                  </div>
                </div>

                <div 
                  onClick={() => toggleChecklist('affiliates')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                    checklist.affiliates 
                      ? 'bg-emerald-950/20 border-emerald-500/60 text-slate-200' 
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                    checklist.affiliates ? 'bg-emerald-500 border-emerald-500 text-slate-950' : 'border-slate-700 bg-slate-900'
                  }`}>
                    {checklist.affiliates && <CheckCircle2 className="w-4 h-4" />}
                  </div>
                  <div>
                    <span className="text-sm font-bold text-white block">4. Komisyon Hesaplarını Açmak (IBAN Bağlama)</span>
                    <p className="text-xs text-slate-400 mt-0.5">
                      DigitalOcean, Vultr ve Together AI referans programlarına kaydolup linklerini bana vermek. Paranın yatacağı yer senin resmi banka hesabın olacak.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bölüm 4: Önerilen Alan Adları */}
            <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div className="flex items-center gap-2.5 border-b border-slate-800 pb-4">
                <Globe className="w-5 h-5 text-emerald-400" />
                <h3 className="text-lg font-bold text-white">Önerilen Domainler & Maliyet</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                  <span className="text-sm font-mono font-bold text-emerald-400">stackcost.co</span>
                  <p className="text-xs text-slate-400">En güçlü B2B algısı. Yazılımcıların en güvendiği uzantılardan biri.</p>
                  <span className="text-[11px] text-slate-500 block">Yıllık ~10$</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                  <span className="text-sm font-mono font-bold text-teal-400">infracalc.com</span>
                  <p className="text-xs text-slate-400">Infrastructure Calculator kısaltması. Kurumsal teknoloji algısı verir.</p>
                  <span className="text-[11px] text-slate-500 block">Yıllık ~10$</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                  <span className="text-sm font-mono font-bold text-sky-400">cloudsaver.tech</span>
                  <p className="text-xs text-slate-400">Doğrudan tasarruf arayan KOBİ ve girişimler için ideal isim.</p>
                  <span className="text-[11px] text-slate-500 block">Yıllık ~8$</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

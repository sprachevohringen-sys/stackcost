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
  Globe,
  Download,
  Copy,
  Check,
  Zap,
  ArrowRight,
  ClipboardList,
  ShieldAlert,
  UserCheck,
  Bot,
  PlusCircle,
  Calendar
} from 'lucide-react';

interface TelemetryData {
  metrics: {
    totalPageviews: number;
    totalCalculations: number;
    totalAffiliateClicks: number;
    conversionRate: string;
    totalSimulatedAnnualSavings: number;
  };
  funnel: {
    step1_visitors: number;
    step2_calculations: number;
    step3_copies: number;
    step4_clicks: number;
    calculationRate: string;
    conversionRate: string;
  };
  migrationFlows: Record<string, number>;
  affiliateBreakdown: Record<string, { clicks: number; deals: string[] }>;
  referrerBreakdown: Record<string, number>;
  countryBreakdown: Record<string, number>;
  strategicInsights: Array<{
    title: string;
    desc: string;
    priority: 'Yüksek' | 'Orta' | 'Kritik';
  }>;
  recentEvents: Array<{
    id: string;
    type: string;
    timestamp: number;
    referrer: string;
    country?: string;
    metadata: Record<string, any>;
  }>;
}

interface AuditTask {
  id: string;
  title: string;
  category: string;
  owner: 'AI' | 'USER' | 'ORTAK';
  ownerLabel: string;
  frequency: string;
  status: 'done' | 'todo';
  completedAt?: string | null;
  description: string;
  auditNotes: string;
}

export default function AdminDashboard() {
  const [data, setData] = useState<TelemetryData | null>(null);
  const [tasks, setTasks] = useState<AuditTask[]>([]);
  const [tasksMetrics, setTasksMetrics] = useState({ total: 0, completed: 0, pending: 0, completionRate: '0' });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastRefreshed, setLastRefreshed] = useState<string>('');
  const [activeAdminTab, setActiveAdminTab] = useState<'analytics' | 'audit' | 'ai-data' | 'playbook'>('analytics');
  const [copiedJson, setCopiedJson] = useState<boolean>(false);
  const [taskFilter, setTaskFilter] = useState<'all' | 'user' | 'ai' | 'todo' | 'done'>('all');
  const [showAddTask, setShowAddTask] = useState<boolean>(false);
  const [newTaskTitle, setNewTaskTitle] = useState<string>('');
  const [newTaskOwner, setNewTaskOwner] = useState<'AI' | 'USER'>('USER');
  const [newTaskFreq, setNewTaskFreq] = useState<string>('Tek Seferlik');

  // Checklist state for simple playbook list
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
      const [telemetryRes, tasksRes] = await Promise.all([
        fetch('/api/telemetry'),
        fetch('/api/tasks'),
      ]);

      if (telemetryRes.ok) {
        const json = await telemetryRes.json();
        setData(json);
      }
      if (tasksRes.ok) {
        const tJson = await tasksRes.json();
        setTasks(tJson.tasks || []);
        setTasksMetrics(tJson.metrics || { total: 0, completed: 0, pending: 0, completionRate: '0' });
      }
      setLastRefreshed(new Date().toLocaleTimeString('tr-TR'));
    } catch (err) {
      console.error('Veri çekme hatası:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleTask = async (taskId: string) => {
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle', taskId }),
      });
      if (res.ok) {
        setTasks((prev) =>
          prev.map((t) => (t.id === taskId ? { ...t, status: t.status === 'done' ? 'todo' : 'done' } : t))
        );
        fetchStats();
      }
    } catch (err) {
      console.error('Görev güncelleme hatası:', err);
    }
  };

  const handleAddNewTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add',
          newTask: {
            title: newTaskTitle,
            owner: newTaskOwner,
            frequency: newTaskFreq,
            category: 'Operasyon',
          },
        }),
      });
      if (res.ok) {
        setNewTaskTitle('');
        setShowAddTask(false);
        fetchStats();
      }
    } catch (err) {
      console.error('Görev ekleme hatası:', err);
    }
  };

  const handleCopyAIExport = () => {
    if (!data) return;
    const aiPayload = {
      timestamp: new Date().toISOString(),
      platform: 'StackCost Intelligence',
      metrics: data.metrics,
      funnel: data.funnel,
      migrationFlows: data.migrationFlows,
      affiliates: data.affiliateBreakdown,
      trafficSources: data.referrerBreakdown,
      countries: data.countryBreakdown,
      systemRecommendations: data.strategicInsights,
      tasksOverview: tasksMetrics,
    };

    navigator.clipboard.writeText(JSON.stringify(aiPayload, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2500);
  };

  // Event name translator to Turkish
  const translateEventType = (type: string) => {
    switch (type) {
      case 'affiliate_click':
      case 'affiliate_clicked':
        return 'Komisyon Tıklaması';
      case 'calculation':
      case 'model_calculated':
        return 'Hesaplama Yapıldı';
      case 'pageview':
        return 'Sayfa Ziyareti';
      case 'budget_summary_copied':
        return 'Bütçe Kopyalandı';
      default:
        return type;
    }
  };

  const filteredTasks = tasks.filter((t) => {
    if (taskFilter === 'user') return t.owner === 'USER' || t.owner === 'ORTAK';
    if (taskFilter === 'ai') return t.owner === 'AI' || t.owner === 'ORTAK';
    if (taskFilter === 'todo') return t.status === 'todo';
    if (taskFilter === 'done') return t.status === 'done';
    return true;
  });

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
                  StackCost Yönetim & İstihbarat Merkezi
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  İç Denetim & Takip Aktif
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Canlı analitik, iç denetim matrisi, yapay zeka istihbaratı ve operasyonel rehber
              </p>
            </div>
          </div>

          {/* 4 Sekme Değiştirici */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="bg-slate-900/90 p-1 rounded-xl border border-slate-800 flex items-center gap-1">
              <button
                onClick={() => setActiveAdminTab('analytics')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeAdminTab === 'analytics'
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Canlı Analitik</span>
              </button>

              <button
                onClick={() => setActiveAdminTab('audit')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeAdminTab === 'audit'
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ClipboardList className="w-3.5 h-3.5" />
                <span>İç Denetim & Görevler</span>
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px] text-emerald-400 font-mono">
                  {tasksMetrics.completed}/{tasksMetrics.total}
                </span>
              </button>

              <button
                onClick={() => setActiveAdminTab('ai-data')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeAdminTab === 'ai-data'
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Yapay Zeka İstihbaratı</span>
              </button>

              <button
                onClick={() => setActiveAdminTab('playbook')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeAdminTab === 'playbook'
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Playbook</span>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[11px] font-semibold uppercase tracking-wider">Toplam Ziyaretçi</span>
                  <Users className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-3xl font-black text-white font-mono">
                  {data?.metrics.totalPageviews || 0}
                </div>
                <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Aktif oturumlar
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[11px] font-semibold uppercase tracking-wider">Hesaplamalar</span>
                  <Calculator className="w-4 h-4 text-teal-400" />
                </div>
                <div className="text-3xl font-black text-white font-mono">
                  {data?.metrics.totalCalculations || 0}
                </div>
                <span className="text-[11px] text-slate-400">
                  Simüle edilen senaryolar
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[11px] font-semibold uppercase tracking-wider">Komisyon Tıklaması</span>
                  <MousePointerClick className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-3xl font-black text-emerald-400 font-mono">
                  {data?.metrics.totalAffiliateClicks || 0}
                </div>
                <span className="text-[11px] text-emerald-300 font-medium">
                  Yönlendirilen müşteri
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[11px] font-semibold uppercase tracking-wider">Dönüşüm Oranı</span>
                  <BarChart3 className="w-4 h-4 text-sky-400" />
                </div>
                <div className="text-3xl font-black text-white font-mono">
                  %{data?.metrics.conversionRate || '0.0'}
                </div>
                <span className="text-[11px] text-slate-400">
                  Ziyaretçi başına tık
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/40 to-slate-900 border border-emerald-500/30 space-y-2">
                <div className="flex items-center justify-between text-emerald-400">
                  <span className="text-[11px] font-semibold uppercase tracking-wider">Tasarruf Hacmi</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
                  ${(data?.metrics.totalSimulatedAnnualSavings || 0).toLocaleString('en-US')}
                </div>
                <span className="text-[11px] text-slate-400">
                  Aranan yıllık tasarruf
                </span>
              </div>
            </div>

            {/* Orta Kısım */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <MousePointerClick className="w-4 h-4 text-emerald-400" />
                    <span>En Çok Tıklanan Partner Şirketler</span>
                  </h3>
                  <span className="text-xs text-slate-500">Komisyon Kaynakları</span>
                </div>

                <div className="space-y-3">
                  {data?.affiliateBreakdown && Object.keys(data.affiliateBreakdown).length > 0 ? (
                    Object.entries(data.affiliateBreakdown).map(([partner, info]) => (
                      <div key={partner} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
                        <div>
                          <span className="text-sm font-bold text-white">{partner}</span>
                          <span className="text-xs text-slate-400 block mt-0.5">
                            {info.deals?.[0] || 'Yüksek komisyonlu anlaşma'}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-base font-bold font-mono text-emerald-400">{info.clicks} tıklama</span>
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
          </div>
        )}

        {/* ============================================================ */}
        {/* SEKME 2: İÇ DENETİM & GÖREV MATRİSİ (YENİ) */}
        {/* ============================================================ */}
        {activeAdminTab === 'audit' && (
          <div className="space-y-8">
            {/* Üst Denetim Kartı & İlerleme Çubuğu */}
            <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 space-y-5 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
                    <ClipboardList className="w-3.5 h-3.5" />
                    <span>İç Denetim ve Operasyonel Görev Matrisi (Audit Log)</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
                    Kim Ne Yaptı? Ne Yapacak? Hiçbir Şeyi Es Geçmiyoruz
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
                    Bu sistem, projemizin iç denetim kayıt defteridir (<code className="text-emerald-400 font-mono">src/data/audit_tasks.json</code>). Yapay zekanın tamamladığı işler, senin adımların ve gelecekteki rutinler burada kalıcı olarak takip edilir.
                  </p>
                </div>

                <div className="shrink-0 flex items-center gap-3">
                  <button
                    onClick={() => setShowAddTask(!showAddTask)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-emerald-500/20"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Yeni Görev Ekle</span>
                  </button>
                </div>
              </div>

              {/* İlerleme Çubuğu */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">
                    Genel Proje İlerlemesi (%{tasksMetrics.completionRate} Tamamlandı)
                  </span>
                  <span className="font-mono text-emerald-400 font-bold">
                    {tasksMetrics.completed} Tamamlandı • {tasksMetrics.pending} Bekliyor
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                    style={{ width: `${tasksMetrics.completionRate}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Yeni Görev Ekleme Formu (Açılır/Kapanır) */}
            {showAddTask && (
              <form onSubmit={handleAddNewTask} className="p-5 rounded-2xl bg-slate-900 border border-emerald-500/40 space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <PlusCircle className="w-4 h-4 text-emerald-400" />
                  <span>Denetim Tablosuna Yeni İş / Kontrol Maddesi Ekle</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      placeholder="Görev veya kontrol başlığı..."
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={newTaskOwner}
                      onChange={(e) => setNewTaskOwner(e.target.value as any)}
                      className="w-1/2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="USER">Yönetici (Sen)</option>
                      <option value="AI">Yapay Zeka</option>
                    </select>

                    <select
                      value={newTaskFreq}
                      onChange={(e) => setNewTaskFreq(e.target.value)}
                      className="w-1/2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Tek Seferlik">Tek Seferlik</option>
                      <option value="Günlük">Günlük</option>
                      <option value="Haftalık">Haftalık</option>
                      <option value="Aylık">Aylık</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddTask(false)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-400 hover:text-white"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-emerald-500 text-slate-950 text-xs font-bold hover:bg-emerald-400"
                  >
                    Kaydet
                  </button>
                </div>
              </form>
            )}

            {/* Filtreleme Butonları */}
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-4">
              <button
                onClick={() => setTaskFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  taskFilter === 'all' ? 'bg-slate-800 text-white border border-slate-700' : 'text-slate-400 hover:text-white'
                }`}
              >
                Tümü ({tasks.length})
              </button>
              <button
                onClick={() => setTaskFilter('user')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  taskFilter === 'user' ? 'bg-slate-800 text-white border border-slate-700' : 'text-slate-400 hover:text-white'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Senin Görevlerin</span>
              </button>
              <button
                onClick={() => setTaskFilter('ai')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  taskFilter === 'ai' ? 'bg-slate-800 text-white border border-slate-700' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Bot className="w-3.5 h-3.5 text-teal-400" />
                <span>Yapay Zeka Görevleri</span>
              </button>
              <button
                onClick={() => setTaskFilter('todo')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  taskFilter === 'todo' ? 'bg-slate-800 text-white border border-slate-700' : 'text-slate-400 hover:text-white'
                }`}
              >
                Bekleyenler ({tasksMetrics.pending})
              </button>
              <button
                onClick={() => setTaskFilter('done')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  taskFilter === 'done' ? 'bg-slate-800 text-white border border-slate-700' : 'text-slate-400 hover:text-white'
                }`}
              >
                Tamamlananlar ({tasksMetrics.completed})
              </button>
            </div>

            {/* Görev Kartları Listesi */}
            <div className="space-y-3">
              {filteredTasks.map((task) => {
                const isDone = task.status === 'done';
                return (
                  <div
                    key={task.id}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                      isDone
                        ? 'bg-slate-900/40 border-slate-800/80 opacity-80'
                        : 'bg-slate-900/90 border-slate-700 shadow-md'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3.5">
                        {/* Tıklanabilir Checkbox */}
                        <button
                          onClick={() => handleToggleTask(task.id)}
                          className={`mt-0.5 w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
                            isDone
                              ? 'bg-emerald-500 border-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/30'
                              : 'border-slate-700 hover:border-emerald-500 bg-slate-950 text-transparent'
                          }`}
                          title={isDone ? 'Bekliyor durumuna al' : 'Tamamlandı olarak işaretle'}
                        >
                          <Check className="w-4 h-4 font-black stroke-[3]" />
                        </button>

                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`text-sm font-bold ${isDone ? 'line-through text-slate-400' : 'text-white'}`}>
                              {task.title}
                            </span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                              {task.category}
                            </span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800 flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-slate-500" />
                              {task.frequency}
                            </span>
                          </div>

                          <p className="text-xs text-slate-400 leading-relaxed">
                            {task.description}
                          </p>

                          {task.auditNotes && (
                            <div className="pt-1 text-[11px] text-slate-500 font-mono flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                              <span>Denetim Notu: {task.auditNotes}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Görev Sahibi & Durum Rozeti */}
                      <div className="shrink-0 text-right space-y-1">
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg border ${
                            task.owner === 'AI'
                              ? 'bg-teal-500/10 text-teal-400 border-teal-500/20'
                              : task.owner === 'USER'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                          }`}
                        >
                          {task.owner === 'AI' ? <Bot className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />}
                          <span>{task.ownerLabel}</span>
                        </span>

                        <div className="text-[11px] font-mono text-slate-500 block">
                          {isDone ? '✅ Tamamlandı' : '⏳ Bekliyor'}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* SEKME 3: YAPAY ZEKA DERİN İSTİHBARATI */}
        {/* ============================================================ */}
        {activeAdminTab === 'ai-data' && (
          <div className="space-y-8">
            <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/40 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Yapay Zeka İçin Yapılandırılmış Veri Katmanı</span>
                </div>
                <h2 className="text-2xl font-extrabold text-white">
                  Derin Telemetri ve Otonom Karar Matrisi
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
                  Bu veriler sistemimizin dosya tabanında (<code className="text-emerald-400 font-mono">src/data/telemetry_db.json</code>) saklanır. Bana &quot;Verileri kontrol et ve bize yeni bir büyüme planı hazırla&quot; dediğinde ben doğrudan bu veri havuzunu analiz ederek nokta atışı stratejiler sunarım.
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-3">
                <button
                  onClick={handleCopyAIExport}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-emerald-500/20"
                >
                  {copiedJson ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Rapor Kopyalandı!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Yapay Zeka Raporunu Kopyala</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-emerald-400" />
                    <span>Kullanıcı Niyeti: Hangi Modellerden Kaçıyorlar?</span>
                  </h3>
                  <span className="text-xs text-slate-500">Göç Analizi</span>
                </div>

                <div className="space-y-3">
                  {data?.migrationFlows && Object.keys(data.migrationFlows).length > 0 ? (
                    Object.entries(data.migrationFlows).map(([flow, count]) => (
                      <div key={flow} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm font-semibold text-white">
                          <span>{flow.split('→')[0]}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">{flow.split('→')[1]}</span>
                        </div>
                        <span className="text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
                          {count} istek
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-slate-500 py-6 text-center">
                      Model göç hareketleri kaydediliyor...
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Target className="w-4 h-4 text-sky-400" />
                    <span>Kullanıcı Dönüşüm Hunisi (Funnel Drop-off)</span>
                  </h3>
                  <span className="text-xs text-slate-500">Aşama Verimi</span>
                </div>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-200 block">1. Aşama: Sayfa Ziyareti</span>
                      <span className="text-[11px] text-slate-500">Siteye iniş yapan toplam kişi</span>
                    </div>
                    <span className="text-sm font-mono font-bold text-white">{data?.funnel.step1_visitors || 0}</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-teal-300 block">2. Aşama: Aktif Hesaplama</span>
                      <span className="text-[11px] text-slate-500">Simüle edenler</span>
                    </div>
                    <span className="text-sm font-mono font-bold text-teal-400">{data?.funnel.step2_calculations || 0}</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-emerald-300 block">3. Aşama: Bütçe Özeti Kopyalama</span>
                      <span className="text-[11px] text-slate-500">Ekibine götürmek için rapor alanlar</span>
                    </div>
                    <span className="text-sm font-mono font-bold text-emerald-400">{data?.funnel.step3_copies || 0}</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950/70 border border-emerald-500/30 flex items-center justify-between bg-emerald-950/10">
                    <div>
                      <span className="text-xs font-bold text-emerald-400 block">4. Aşama: Komisyon Butonu Tıklaması</span>
                      <span className="text-[11px] text-emerald-300">Partner şirketlere giden nakit potansiyeli</span>
                    </div>
                    <span className="text-base font-mono font-black text-emerald-400">{data?.funnel.step4_clicks || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* SEKME 4: PLAYBOOK & REHBERİM */}
        {/* ============================================================ */}
        {activeAdminTab === 'playbook' && (
          <div className="space-y-8 max-w-5xl mx-auto">
            <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Sade & Düzenli Yönetici Rehberi</span>
                </div>
                <span className="text-xs text-slate-500 font-mono">Versiyon 2.0 (Hap Bilgiler)</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                StackCost Operasyonel Playbook
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed max-w-3xl">
                Karmaşık teknik detaylar kaldırıldı. Projenin nasıl para kazandırdığı, senin 4 basit görevin ve hızlandırma motorumuz aşağıda net tablolar halinde özetlenmiştir.
              </p>
            </div>

            {/* 1. Kutu: 3 Cümlede Sistem Özeti */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>1. Sistemin Mantığı (3 Cümlede)</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                  <span className="font-bold text-emerald-400 block">Ne Kurduk?</span>
                  <p className="text-slate-300 leading-relaxed">
                    Amerikalıların yapay zeka (OpenAI) ve sunucu (AWS) masraflarını hesaplayıp tasarruf ettiği ücretsiz bir B2B aracı kurduk.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                  <span className="font-bold text-teal-400 block">Nasıl Para Kazanıyoruz?</span>
                  <p className="text-slate-300 leading-relaxed">
                    Ziyaretçi &quot;AWS yerine DigitalOcean kullan, 200$ hediye al&quot; butonuna basar. Butonda senin referans linkin vardır.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                  <span className="font-bold text-sky-400 block">Sen Ne Alırsın?</span>
                  <p className="text-slate-300 leading-relaxed">
                    Şirketler sana müşteri başına 25$ – 100$ nakit komisyon öder. Ay sonunda doğrudan banka IBAN&apos;ına yatar.
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Kutu: Hızlandırma Motoru */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/30 via-slate-900 to-slate-900 border border-emerald-500/30 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>2. Hızlandırma Motoru: 90 Günü 15 Güne Nasıl İndiriyoruz?</span>
                </h3>
                <span className="text-xs text-emerald-400 font-semibold">Sandbox Kırıcılar</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                  <span className="font-bold text-emerald-400 block">1. Google Indexing API</span>
                  <p className="text-slate-300">Botu zorla çağırarak sayfaları 24 saatte Google&apos;a işletiriz.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                  <span className="font-bold text-teal-400 block">2. GitHub Parazit Otoritesi</span>
                  <p className="text-slate-300">DA 96 açık kaynak repo ile 48 saatte ilk sayfaya çıkarız.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                  <span className="font-bold text-sky-400 block">3. HackerNews &quot;Show HN&quot;</span>
                  <p className="text-slate-300">Tek günde 5.000–15.000 üst düzey Amerikalı yazılımcı çekeriz.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                  <span className="font-bold text-purple-400 block">4. Gömülebilir Widget (/embed)</span>
                  <p className="text-slate-300">Başka teknoloji bloglarının okuyucuları bizim linkimizden komisyon üretir.</p>
                </div>
              </div>
            </div>

            {/* 3. Kutu: Senin Yapacağın 4 Basit Adım */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>3. Senin Yapacağın 4 Basit Adım (Sırayla)</span>
                </h3>
                <span className="text-xs text-slate-500">Tamamladıkça tıkla</span>
              </div>

              <div className="space-y-3">
                <div 
                  onClick={() => toggleChecklist('domain')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    checklist.domain 
                      ? 'bg-emerald-950/20 border-emerald-500/60 text-slate-200' 
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                      checklist.domain ? 'bg-emerald-500 border-emerald-500 text-slate-950' : 'border-slate-700 bg-slate-900'
                    }`}>
                      {checklist.domain && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                    <div>
                      <span className="text-sm font-bold text-white">Adım 1: Alan Adı (Domain) Satın Alımı</span>
                      <span className="text-xs text-slate-400 block">Namecheap veya Porkbun üzerinden ~10$&apos;a alan adı al. (Örn: stackcost.co)</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 shrink-0">
                    Süre: 3 dk
                  </span>
                </div>

                <div 
                  onClick={() => toggleChecklist('github')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    checklist.github 
                      ? 'bg-emerald-950/20 border-emerald-500/60 text-slate-200' 
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                      checklist.github ? 'bg-emerald-500 border-emerald-500 text-slate-950' : 'border-slate-700 bg-slate-900'
                    }`}>
                      {checklist.github && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                    <div>
                      <span className="text-sm font-bold text-white">Adım 2: Ücretsiz GitHub & Vercel Açılışı</span>
                      <span className="text-xs text-slate-400 block">github.com ve vercel.com üyeliklerini aç. Kodları 1 tıkla yayına alacağız.</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded-lg border border-teal-500/20 shrink-0">
                    Süre: 2 dk
                  </span>
                </div>

                <div 
                  onClick={() => toggleChecklist('affiliates')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    checklist.affiliates 
                      ? 'bg-emerald-950/20 border-emerald-500/60 text-slate-200' 
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                      checklist.affiliates ? 'bg-emerald-500 border-emerald-500 text-slate-950' : 'border-slate-700 bg-slate-900'
                    }`}>
                      {checklist.affiliates && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                    <div>
                      <span className="text-sm font-bold text-white">Adım 3: Komisyon Hesaplarını Açmak (IBAN Bağlama)</span>
                      <span className="text-xs text-slate-400 block">DigitalOcean, Vultr ve Together AI referans linklerini alıp bana ver.</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded-lg border border-sky-500/20 shrink-0">
                    Süre: 10 dk
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="w-5 h-5 rounded-md flex items-center justify-center border border-slate-700 bg-slate-900 text-emerald-400">
                      <Clock className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-white">Adım 4: Haftalık 5 Dk Gelir Kontrolü</span>
                      <span className="text-xs text-slate-400 block">Bu panele ve banka hesabına girip biriken Dolar komisyonunu kontrol et.</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-lg border border-purple-500/20 shrink-0">
                    5 dk / hf
                  </span>
                </div>
              </div>
            </div>

            {/* 4. Kutu: Sıkıştırılmış Gelir Takvimi */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>4. Sıkıştırılmış Hızlandırılmış Gelir Takvimi</span>
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono border-b border-slate-800">
                    <tr>
                      <th className="p-3">Dönem</th>
                      <th className="p-3 text-slate-500">Eski Bekleme Modeli</th>
                      <th className="p-3 text-emerald-400">Yeni Hızlandırılmış Model (Bizimki)</th>
                      <th className="p-3">Açıklama</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-medium">
                    <tr className="hover:bg-slate-950/40">
                      <td className="p-3 text-white font-bold">1. – 7. Gün</td>
                      <td className="p-3 text-slate-500">0$ (Kimse bilmez)</td>
                      <td className="p-3 font-mono font-bold text-emerald-400">100$ – 300$</td>
                      <td className="p-3 text-slate-300">HackerNews Show HN & GitHub parazit lansmanı ile ilk satışlar</td>
                    </tr>
                    <tr className="hover:bg-slate-950/40">
                      <td className="p-3 text-white font-bold">2. – 3. Hafta</td>
                      <td className="p-3 text-slate-500">0$ – 50$ (Bekleme)</td>
                      <td className="p-3 font-mono font-bold text-emerald-400">500$ – 1.000$</td>
                      <td className="p-3 text-slate-300">Google Indexing API ve hazır dizinlerden gelen düzenli akış</td>
                    </tr>
                    <tr className="hover:bg-slate-950/40">
                      <td className="p-3 text-white font-bold">1. Ay Sonu</td>
                      <td className="p-3 text-slate-500">150$ – 500$</td>
                      <td className="p-3 font-mono font-bold text-emerald-400">1.500$ – 3.000$</td>
                      <td className="p-3 text-slate-300">Normalde 3 ay sürecek pasif gelir seviyesine 30 günde ulaşma</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 5. Kutu: Önerilen Alan Adları */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-400" />
                <span>5. Önerilen Alan Adları & Maliyetleri</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="font-mono font-bold text-emerald-400 text-sm">stackcost.co</span>
                  <span className="text-slate-400 block mt-0.5">En çok önerilen, modern B2B yazılım algısı</span>
                  <span className="text-[11px] text-slate-500 font-mono mt-1 block">Yıllık ~10$</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="font-mono font-bold text-teal-400 text-sm">infracalc.com</span>
                  <span className="text-slate-400 block mt-0.5">Altyapı hesaplayıcısı kurumsal algı</span>
                  <span className="text-[11px] text-slate-500 font-mono mt-1 block">Yıllık ~10$</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="font-mono font-bold text-sky-400 text-sm">cloudsaver.tech</span>
                  <span className="text-slate-400 block mt-0.5">Doğrudan tasarruf odaklı alternatif</span>
                  <span className="text-[11px] text-slate-500 font-mono mt-1 block">Yıllık ~8$</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

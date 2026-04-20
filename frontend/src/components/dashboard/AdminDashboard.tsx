"use client";
import { useState } from 'react';
import { useRouter } from 'next/router';
import {
  Activity, AlertTriangle, Train, Cpu, MapPin,
  ShieldCheck, ShieldX, ArrowRight, RefreshCw
} from 'lucide-react';
import { useAdminDashboard } from '@/hooks/useAdminDashboard';

function StatCard({ label, value, icon, color }: {
  label: string; value: string | number; icon: React.ReactNode; color: string;
}) {
  return (
    <div className="bg-[#0a0f18] border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
      <div>
        <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">{label}</p>
        <h2 className="text-2xl font-black text-white mt-1">{value}</h2>
      </div>
      <div className={`p-3 rounded-xl ${color}`}>{icon}</div>
    </div>
  );
}

function formatTime(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleTimeString('id-ID', {
    timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit'
  });
}

export default function AdminDashboard() {
  const { crossingStatuses, stats, recentAlerts, loading } = useAdminDashboard();
  const router  = useRouter();
  const [search, setSearch] = useState('');

  const filtered = crossingStatuses.filter(cs =>
    cs.crossing.name.toLowerCase().includes(search.toLowerCase()) ||
    cs.crossing.location?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#05070a] text-slate-200 p-10 space-y-10">

      {/* Header */}
      <header className="flex flex-col gap-1 border-b border-slate-800/50 pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
            <h1 className="text-3xl font-black tracking-tight text-white italic">
              ADMIN <span className="text-cyan-400">OVERVIEW</span>
            </h1>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>
        <p className="text-slate-500 text-sm flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-500" />
          Monitoring seluruh perlintasan — update otomatis setiap 30 detik
        </p>
      </header>

      {/* Summary stats */}
      {stats && (
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Perlintasan Aktif"
            value={stats.totalCrossings}
            icon={<MapPin className="w-5 h-5 text-cyan-400" />}
            color="bg-cyan-500/10"
          />
          <StatCard
            label="Kereta Hari Ini"
            value={stats.totalTrainToday}
            icon={<Train className="w-5 h-5 text-emerald-400" />}
            color="bg-emerald-500/10"
          />
          <StatCard
            label="Alert Aktif"
            value={stats.totalAlertOpen}
            icon={<AlertTriangle className="w-5 h-5 text-amber-400" />}
            color={stats.totalAlertOpen > 0 ? "bg-amber-500/10" : "bg-slate-900"}
          />
          <StatCard
            label="Device Online"
            value={`${stats.totalDeviceOnline}/${stats.totalDeviceAll}`}
            icon={<Cpu className="w-5 h-5 text-purple-400" />}
            color="bg-purple-500/10"
          />
        </section>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

        {/* Tabel status semua perlintasan */}
        <div className="xl:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">
              Status Semua Perlintasan
            </h2>
            <input
              type="text"
              placeholder="Cari perlintasan..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 w-48 transition-all"
            />
          </div>

          <div className="bg-[#0a0f18] border border-slate-800 rounded-3xl overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-900/50 border-b border-slate-800">
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Perlintasan</th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Palang</th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Kereta</th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Device</th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Alert</th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i}>
                      {[1,2,3,4,5,6].map(j => (
                        <td key={j} className="px-5 py-4">
                          <div className="h-3 bg-slate-800 rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-10 text-center text-slate-600 text-sm">
                      Tidak ada perlintasan ditemukan
                    </td>
                  </tr>
                ) : (
                  filtered.map(({ crossing, gateState, lastEventTime, devicesOnline, devicesTotal, trainToday, alertCount }) => (
                    <tr key={crossing.cross_id} className="hover:bg-slate-900/30 transition-colors group">
                      <td className="px-5 py-4">
                        <p className="text-sm font-bold text-white">{crossing.name}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{crossing.location || '—'}</p>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          {gateState === 'CLOSED' ? (
                            <ShieldX className="w-4 h-4 text-red-400" />
                          ) : (
                            <ShieldCheck className="w-4 h-4 text-emerald-400" />
                          )}
                          <div>
                            <span className={`text-xs font-bold ${gateState === 'CLOSED' ? 'text-red-400' : 'text-emerald-400'}`}>
                              {gateState ?? 'UNKNOWN'}
                            </span>
                            <p className="text-[9px] text-slate-600">{formatTime(lastEventTime)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm font-bold text-white">{trainToday}</span>
                        <span className="text-[10px] text-slate-500 ml-1">hari ini</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-sm font-bold ${devicesOnline === devicesTotal ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {devicesOnline}/{devicesTotal}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {alertCount > 0 ? (
                          <span className="px-2 py-1 rounded-full bg-red-500/10 text-red-400 text-[10px] font-bold border border-red-500/20">
                            {alertCount} aktif
                          </span>
                        ) : (
                          <span className="text-slate-600 text-[10px]">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => router.push(`/admin/crossing/${crossing.cross_id}`)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-cyan-400 text-xs font-bold"
                        >
                          Detail <ArrowRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Alert terbaru */}
        <div className="space-y-4">
          <h2 className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Alert Aktif</h2>
          <div className="bg-[#0a0f18] border border-slate-800 rounded-3xl overflow-hidden">
            {recentAlerts.length === 0 ? (
              <div className="p-8 text-center">
                <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <p className="text-slate-600 text-sm">Tidak ada alert aktif</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-800/50">
                {recentAlerts.map(alert => (
                  <div key={alert.alert_id} className="p-4 hover:bg-slate-900/30 transition-colors">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        alert.severity === 'critical'
                          ? 'bg-red-500/10 text-red-400 border-red-500/20'
                          : alert.severity === 'warning'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                      }`}>
                        {alert.severity.toUpperCase()}
                      </span>
                      <span className="text-[9px] text-slate-600 whitespace-nowrap">
                        {formatTime(alert.triggered_at)}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-white">{alert.alert_type}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{(alert as any).crossings?.name || '—'}</p>
                    <p className="text-[10px] text-slate-600 mt-1">{alert.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

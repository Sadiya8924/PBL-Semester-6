"use client";
import { Train, ShieldCheck, ShieldX, Activity, Cpu, Radio, AlertTriangle, Clock } from 'lucide-react';
import { useGateStatus } from '../../hooks/useGateStatus';
import { useSensorData } from '../../hooks/useSensorData';
import { useStaffDashboard } from '../../hooks/useStaffDashboard';
import { useCrossings } from '../../hooks/useCrossings';
import type { Profile } from '../../lib/types';

function formatSeconds(s: number): string {
  if (!s || s <= 0) return '0d';
  if (s < 60) return `${s}d`;
  return `${Math.floor(s / 60)}m ${s % 60}d`;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('id-ID', {
    timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit', second: '2-digit'
  });
}

interface Props { profile: Profile | null; }

// Komponen dalam — hanya dirender setelah crossId tersedia
function StaffDashboardContent({ crossId, crossName, profile }: {
  crossId: string; crossName: string; profile: Profile | null;
}) {
  const { gateState, lastEvent, loading: gateLoad }     = useGateStatus(crossId);
  const { ultrasonik, ir, loading: sensorLoad }          = useSensorData(crossId);
  const { stats, hourlyData, alerts, loading: statLoad } = useStaffDashboard(crossId);

  const trainPresent = gateState === 'CLOSED';
  const systemOnline = !sensorLoad && (ultrasonik !== null || ir !== null);
  const maxHourly    = hourlyData.length > 0 ? Math.max(...hourlyData.map(h => h.count), 1) : 1;

  return (
    <div className="min-h-screen bg-[#05070a] text-slate-200 p-10 space-y-10">

      {/* Header */}
      <header className="flex flex-col gap-1 border-b border-slate-800/50 pb-6">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full animate-pulse ${trainPresent ? 'bg-red-500' : 'bg-cyan-500'}`} />
          <h1 className="text-3xl font-black tracking-tight text-white italic">
            MONITORING <span className="text-cyan-400">PALANG</span>
          </h1>
        </div>
        <p className="text-slate-500 text-sm flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-500" />
          {crossName} — Selamat datang, <span className="text-slate-300">{profile?.name || 'Staff'}</span>
        </p>
      </header>

      {/* STATUS UTAMA */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Status palang */}
        <div className={`relative overflow-hidden p-8 rounded-3xl border transition-all ${
          trainPresent ? 'border-red-500/30 bg-red-500/5' : 'border-emerald-500/20 bg-emerald-500/5'
        }`}>
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest opacity-70 mb-1">Status Palang</p>
              <h3 className={`text-5xl font-black ${trainPresent ? 'text-red-400' : 'text-emerald-400'}`}>
                {gateLoad ? (
                  <span className="text-2xl text-slate-500 animate-pulse">Memuat...</span>
                ) : (gateState ?? 'UNKNOWN')}
              </h3>
            </div>
            <div className={`p-4 rounded-2xl ${trainPresent ? 'bg-red-500/20' : 'bg-emerald-500/20'}`}>
              {trainPresent
                ? <ShieldX className="w-8 h-8 text-red-400" />
                : <ShieldCheck className="w-8 h-8 text-emerald-400" />
              }
            </div>
          </div>
          {lastEvent ? (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Clock className="w-3.5 h-3.5" />
              Update terakhir: {formatTime(lastEvent.occurred_at)}
            </div>
          ) : !gateLoad && (
            <p className="text-xs text-slate-600">Belum ada event tercatat</p>
          )}
          <div className={`absolute -bottom-6 -right-6 w-32 h-32 blur-3xl opacity-20 rounded-full ${
            trainPresent ? 'bg-red-500' : 'bg-emerald-500'
          }`} />
        </div>

        {/* Deteksi kereta */}
        <div className={`relative overflow-hidden p-8 rounded-3xl border transition-all ${
          trainPresent ? 'border-red-500/30 bg-red-500/5' : 'border-slate-800 bg-[#0a0f18]'
        }`}>
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest opacity-70 mb-1 text-slate-400">Deteksi Kereta</p>
              <h3 className={`text-3xl font-black ${trainPresent ? 'text-red-400' : 'text-slate-300'}`}>
                {gateLoad ? (
                  <span className="text-xl text-slate-500 animate-pulse">Memuat...</span>
                ) : trainPresent ? 'KERETA LEWAT' : 'TIDAK ADA'}
              </h3>
              <p className="text-slate-500 text-sm mt-2">
                {trainPresent ? 'Palang tertutup — jalan ditutup' : 'Area perlintasan aman'}
              </p>
            </div>
            <div className={`p-4 rounded-2xl ${trainPresent ? 'bg-red-500/20' : 'bg-slate-900'}`}>
              <Train className={`w-8 h-8 ${trainPresent ? 'text-red-400' : 'text-slate-500'}`} />
            </div>
          </div>
          {lastEvent?.trigger_distance_cm && (
            <p className="text-xs text-slate-500">
              Jarak terdeteksi: <span className="text-white font-bold">{lastEvent.trigger_distance_cm.toFixed(1)} cm</span>
            </p>
          )}
        </div>

      </section>

      {/* Sensor */}
      <section>
        <h2 className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] mb-4">Sensor Hardware</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div className={`p-5 rounded-2xl border flex items-center gap-4 ${
            ultrasonik?.object_detected
              ? 'border-red-500/20 bg-red-500/5 text-red-400'
              : 'border-slate-800 bg-[#0a0f18] text-emerald-400'
          }`}>
            <div className="p-3 rounded-xl bg-black/20"><Radio className="w-5 h-5" /></div>
            <div>
              <p className="text-[10px] uppercase font-bold opacity-60 tracking-wider mb-1">HC-SR05 Ultrasonik</p>
              <p className="text-lg font-bold text-slate-100">
                {sensorLoad ? (
                  <span className="text-sm text-slate-500 animate-pulse">Memuat...</span>
                ) : ultrasonik?.distance_cm != null
                  ? `${ultrasonik.distance_cm.toFixed(1)} cm`
                  : 'Tidak ada data'
                }
              </p>
              <p className="text-[10px] opacity-60 mt-0.5">
                {ultrasonik?.object_detected ? 'Objek terdeteksi' : 'Area bebas'}
              </p>
            </div>
          </div>

          <div className={`p-5 rounded-2xl border flex items-center gap-4 ${
            ir?.object_detected
              ? 'border-red-500/20 bg-red-500/5 text-red-400'
              : 'border-slate-800 bg-[#0a0f18] text-emerald-400'
          }`}>
            <div className="p-3 rounded-xl bg-black/20"><Cpu className="w-5 h-5" /></div>
            <div>
              <p className="text-[10px] uppercase font-bold opacity-60 tracking-wider mb-1">IR FC-51</p>
              <p className="text-lg font-bold text-slate-100">
                {sensorLoad ? (
                  <span className="text-sm text-slate-500 animate-pulse">Memuat...</span>
                ) : ir?.object_detected ? 'TERDETEKSI' : 'KOSONG'}
              </p>
              <p className="text-[10px] opacity-60 mt-0.5">
                {ir?.object_detected ? 'Objek di jalur' : 'Jalur bebas'}
              </p>
            </div>
          </div>

          <div className={`p-5 rounded-2xl border flex items-center gap-4 ${
            systemOnline
              ? 'border-cyan-500/20 bg-cyan-500/5 text-cyan-400'
              : 'border-slate-800 bg-[#0a0f18] text-slate-500'
          }`}>
            <div className="p-3 rounded-xl bg-black/20"><Activity className="w-5 h-5" /></div>
            <div>
              <p className="text-[10px] uppercase font-bold opacity-60 tracking-wider mb-1">Sistem ESP32</p>
              <p className="text-lg font-bold text-slate-100">
                {sensorLoad ? (
                  <span className="text-sm text-slate-500 animate-pulse">Memuat...</span>
                ) : systemOnline ? 'ONLINE' : 'STANDBY'}
              </p>
              <p className="text-[10px] opacity-60 mt-0.5">
                {systemOnline ? 'Semua modul aktif' : 'Menunggu data sensor'}
              </p>
            </div>
          </div>

        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Statistik hari ini */}
        <div className="space-y-4">
          <h2 className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em]">Statistik Hari Ini</h2>
          <div className="bg-[#0a0f18] border border-slate-800 rounded-3xl p-6 space-y-5">
            {statLoad ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="h-3 w-32 bg-slate-800 rounded animate-pulse" />
                  <div className="h-3 w-16 bg-slate-800 rounded animate-pulse" />
                </div>
              ))
            ) : (
              [
                { label: 'Total kereta lewat',           value: stats?.trainToday ?? 0,             unit: 'kereta' },
                { label: 'Rata-rata durasi palang tutup', value: formatSeconds(stats?.avgDuration ?? 0),     unit: '' },
                { label: 'Durasi terlama',               value: formatSeconds(stats?.longestDuration ?? 0), unit: '' },
                { label: 'Alert aktif',                  value: stats?.alertOpen ?? 0,              unit: 'alert', danger: (stats?.alertOpen ?? 0) > 0 },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center">
                  <p className="text-slate-500 text-sm">{item.label}</p>
                  <p className={`font-bold text-sm ${item.danger ? 'text-red-400' : 'text-white'}`}>
                    {item.value} <span className="text-slate-500 font-normal text-xs">{item.unit}</span>
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chart kereta per jam */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em]">Kereta per Jam (Hari Ini)</h2>
          <div className="bg-[#0a0f18] border border-slate-800 rounded-3xl p-6">
            {statLoad ? (
              <div className="h-40 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : hourlyData.length === 0 ? (
              <div className="h-40 flex items-center justify-center text-slate-600 text-sm">
                Belum ada data kereta hari ini
              </div>
            ) : (
              <div className="flex items-end gap-2 h-40">
                {hourlyData.map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[9px] text-slate-500 font-bold">{h.count > 0 ? h.count : ''}</span>
                    <div
                      className="w-full rounded-t bg-cyan-500/40 hover:bg-cyan-500/70 transition-all"
                      style={{ height: `${Math.max((h.count / maxHourly) * 120, h.count > 0 ? 4 : 0)}px` }}
                    />
                    <span className="text-[8px] text-slate-600 rotate-45 origin-left translate-y-2">{h.jam}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Alert aktif */}
      {!statLoad && alerts.length > 0 && (
        <section>
          <h2 className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] mb-4">Alert Aktif</h2>
          <div className="space-y-3">
            {alerts.map(alert => (
              <div key={alert.alert_id} className={`flex items-start gap-4 p-4 rounded-2xl border ${
                alert.severity === 'critical' ? 'bg-red-500/5 border-red-500/20'
                : alert.severity === 'warning' ? 'bg-amber-500/5 border-amber-500/20'
                : 'bg-cyan-500/5 border-cyan-500/20'
              }`}>
                <AlertTriangle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                  alert.severity === 'critical' ? 'text-red-400'
                  : alert.severity === 'warning' ? 'text-amber-400'
                  : 'text-cyan-400'
                }`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-bold text-white">{alert.alert_type}</p>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      alert.severity === 'critical' ? 'bg-red-500/20 text-red-400'
                      : alert.severity === 'warning' ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-cyan-500/20 text-cyan-400'
                    }`}>{alert.severity.toUpperCase()}</span>
                  </div>
                  <p className="text-xs text-slate-400">{alert.message}</p>
                </div>
                <p className="text-[10px] text-slate-600 whitespace-nowrap">{formatTime(alert.triggered_at)}</p>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}

// Wrapper — tunggu crossId tersedia sebelum render konten
export default function StaffDashboard({ profile }: Props) {
  const { crossings, selected, loading: crossLoading } = useCrossings();
  const crossName = crossings.find(c => c.cross_id === selected)?.name || '—';

  // Tunggu sampai crossing selesai di-load DAN selected tersedia
  if (crossLoading || !selected) {
    return (
      <div className="min-h-screen bg-[#05070a] flex flex-col items-center justify-center gap-4">
        <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 text-sm animate-pulse">
          {crossLoading ? 'Memuat data perlintasan...' : 'Tidak ada perlintasan yang ditugaskan'}
        </p>
        {!crossLoading && !selected && (
          <p className="text-slate-600 text-xs max-w-xs text-center">
            Hubungi Super Admin untuk mendapatkan akses ke perlintasan
          </p>
        )}
      </div>
    );
  }

  return <StaffDashboardContent crossId={selected} crossName={crossName} profile={profile} />;
}

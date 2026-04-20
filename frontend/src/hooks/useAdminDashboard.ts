import { useEffect, useState } from 'react';
import supabase from '@/lib/supabase';
import type { Crossing, Alert, GateEvent } from '@/lib/types';

export interface CrossingStatus {
  crossing:       Crossing;
  gateState:      'OPEN' | 'CLOSED' | null;
  lastEventTime:  string | null;
  devicesOnline:  number;
  devicesTotal:   number;
  trainToday:     number;
  alertCount:     number;
}

export interface AdminStats {
  totalCrossings:   number;
  totalTrainToday:  number;
  totalAlertOpen:   number;
  totalDeviceOnline: number;
  totalDeviceAll:   number;
}

export function useAdminDashboard() {
  const [crossingStatuses, setCrossingStatuses] = useState<CrossingStatus[]>([]);
  const [stats, setStats]                       = useState<AdminStats | null>(null);
  const [recentAlerts, setRecentAlerts]         = useState<(Alert & { crossings: { name: string } })[]>([]);
  const [loading, setLoading]                   = useState(true);

  useEffect(() => {
    async function fetchAll() {
      // Ambil semua crossing (RLS: super_admin lihat semua)
      const { data: crossings } = await supabase
        .from('crossings')
        .select('*')
        .eq('status', 'active')
        .order('name');

      if (!crossings) { setLoading(false); return; }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Ambil semua data sekaligus
      const [
        { data: allDevices },
        { data: allGateEvents },
        { data: allTrains },
        { data: allAlerts },
      ] = await Promise.all([
        supabase.from('devices').select('device_id, cross_id, status'),
        supabase.from('gate_events')
          .select('cross_id, new_state, occurred_at')
          .order('occurred_at', { ascending: false }),
        supabase.from('train')
          .select('cross_id, detected_at')
          .gte('detected_at', today.toISOString()),
        supabase.from('alerts')
          .select('*, crossings(name)')
          .eq('resolved', false)
          .order('triggered_at', { ascending: false })
          .limit(10),
      ]);

      // Build per-crossing status
      const statuses: CrossingStatus[] = crossings.map(crossing => {
        const devices    = (allDevices  || []).filter(d => d.cross_id === crossing.cross_id);
        const events     = (allGateEvents || []).filter(e => e.cross_id === crossing.cross_id);
        const trains     = (allTrains   || []).filter(t => t.cross_id === crossing.cross_id);
        const alertCount = (allAlerts   || []).filter(a => a.cross_id === crossing.cross_id).length;
        const lastEvent  = events[0];

        return {
          crossing,
          gateState:     lastEvent?.new_state as 'OPEN' | 'CLOSED' | null ?? null,
          lastEventTime: lastEvent?.occurred_at ?? null,
          devicesOnline: devices.filter(d => d.status === 'online').length,
          devicesTotal:  devices.length,
          trainToday:    trains.length,
          alertCount,
        };
      });

      setCrossingStatuses(statuses);
      setRecentAlerts((allAlerts || []) as any);

      setStats({
        totalCrossings:    crossings.length,
        totalTrainToday:   (allTrains || []).length,
        totalAlertOpen:    (allAlerts || []).length,
        totalDeviceOnline: (allDevices || []).filter(d => d.status === 'online').length,
        totalDeviceAll:    (allDevices || []).length,
      });

      setLoading(false);
    }

    fetchAll();
    const interval = setInterval(fetchAll, 30000); // refresh tiap 30 detik
    return () => clearInterval(interval);
  }, []);

  return { crossingStatuses, stats, recentAlerts, loading };
}

import { useEffect, useState } from 'react';
import supabase from '@/lib/supabase';
import type { Alert, Train } from '@/lib/types';

export interface StaffStats {
  trainToday:      number;
  avgDuration:     number;
  longestDuration: number;
  alertOpen:       number;
}

export interface HourlyTrain {
  jam:   string;
  count: number;
}

export function useStaffDashboard(crossId: string | null) {
  const [stats, setStats]           = useState<StaffStats | null>(null);
  const [hourlyData, setHourlyData] = useState<HourlyTrain[]>([]);
  const [alerts, setAlerts]         = useState<Alert[]>([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    if (!crossId) return;

    async function fetchData() {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const [
        { data: trains },
        { data: activeAlerts },
      ] = await Promise.all([
        supabase.from('train')
          .select('detected_at, duration_seconds')
          .eq('cross_id', crossId)
          .gte('detected_at', today.toISOString())
          .order('detected_at', { ascending: true }),
        supabase.from('alerts')
          .select('*')
          .eq('cross_id', crossId)
          .eq('resolved', false)
          .order('triggered_at', { ascending: false }),
      ]);

      if (trains) {
        const durations  = trains.map(t => t.duration_seconds || 0).filter(d => d > 0);
        const avgDur     = durations.length ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length) : 0;
        const maxDur     = durations.length ? Math.max(...durations) : 0;

        setStats({
          trainToday:      trains.length,
          avgDuration:     avgDur,
          longestDuration: maxDur,
          alertOpen:       activeAlerts?.length || 0,
        });

        // Agregasi per jam
        const hourMap: Record<number, number> = {};
        for (let i = 0; i < 24; i++) hourMap[i] = 0;
        trains.forEach(t => {
          const jam = new Date(t.detected_at).getHours();
          hourMap[jam]++;
        });
        // Ambil jam 6 pagi sampai sekarang
        const currentHour = new Date().getHours();
        const hourly: HourlyTrain[] = [];
        for (let i = 6; i <= currentHour; i++) {
          hourly.push({ jam: `${i.toString().padStart(2, '0')}:00`, count: hourMap[i] });
        }
        setHourlyData(hourly);
      }

      setAlerts(activeAlerts || []);
      setLoading(false);
    }

    fetchData();

    // Realtime subscription untuk train baru
    const channel = supabase
      .channel(`staff_dashboard:${crossId}`)
      .on('postgres_changes', {
        event:  'INSERT',
        schema: 'public',
        table:  'train',
        filter: `cross_id=eq.${crossId}`,
      }, () => fetchData())
      .on('postgres_changes', {
        event:  'INSERT',
        schema: 'public',
        table:  'alerts',
        filter: `cross_id=eq.${crossId}`,
      }, () => fetchData())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [crossId]);

  return { stats, hourlyData, alerts, loading };
}

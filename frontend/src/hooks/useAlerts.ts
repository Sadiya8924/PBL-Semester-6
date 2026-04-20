import { useEffect, useState } from 'react';
import supabase from '../lib/supabase';
import type { Alert } from '../lib/types';

const CROSSING_ID = process.env.NEXT_PUBLIC_CROSSING_ID || '';

export function useAlerts() {
  const [alerts, setAlerts]   = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  async function fetchAlerts() {
    const { data, error } = await supabase
      .from('alerts')
      .select('*')
      .eq('cross_id', CROSSING_ID)
      .order('triggered_at', { ascending: false })
      .limit(50);
    if (error) setError(error.message);
    else setAlerts(data || []);
    setLoading(false);
  }

  async function resolveAlert(alertId: string) {
    const { error } = await supabase
      .from('alerts')
      .update({ resolved: true, resolved_at: new Date().toISOString() })
      .eq('alert_id', alertId);
    if (!error) {
      setAlerts(prev =>
        prev.map(a => a.alert_id === alertId
          ? { ...a, resolved: true, resolved_at: new Date().toISOString() }
          : a
        )
      );
    }
    return { error };
  }

  useEffect(() => {
    fetchAlerts();

    // Supabase Realtime untuk alert baru
    const channel = supabase
      .channel('alerts-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'alerts', filter: `cross_id=eq.${CROSSING_ID}` },
        (payload) => {
          setAlerts(prev => [payload.new as Alert, ...prev]);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return { alerts, loading, error, resolveAlert, refetch: fetchAlerts };
}
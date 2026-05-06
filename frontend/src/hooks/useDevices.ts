import { useEffect, useState } from 'react';
import supabase from '../lib/supabase';
import type { Device } from '../lib/types';

const CROSSING_ID = process.env.NEXT_PUBLIC_CROSSING_ID || '';

export function useDevices(crossId?: string) {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  const targetId = crossId || CROSSING_ID;

  async function fetchDevices() {
    setLoading(true);
    const query = supabase.from('devices').select('*').order('registered_at', { ascending: true });
    if (targetId) query.eq('cross_id', targetId);
    const { data, error } = await query;
    if (error) setError(error.message);
    else setDevices(data || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchDevices();
    const interval = setInterval(fetchDevices, 30000);
    return () => clearInterval(interval);
  }, [targetId]);

  return { devices, loading, error, refetch: fetchDevices };
}
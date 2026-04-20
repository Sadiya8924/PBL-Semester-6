import { useEffect, useState } from 'react';
import supabase from '../lib/supabase';
import type { Train } from '../lib/types';

const CROSSING_ID = process.env.NEXT_PUBLIC_CROSSING_ID || '';

export function useTrains(limit = 20) {
  const [trains, setTrains]   = useState<Train[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    async function fetchTrains() {
      const { data, error } = await supabase
        .from('train')
        .select('*')
        .eq('cross_id', CROSSING_ID)
        .order('detected_at', { ascending: false })
        .limit(limit);
      if (error) setError(error.message);
      else setTrains(data || []);
      setLoading(false);
    }
    fetchTrains();

    // Realtime: kereta baru selesai melintas
    const channel = supabase
      .channel('train-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'train', filter: `cross_id=eq.${CROSSING_ID}` },
        (payload) => {
          setTrains(prev => [payload.new as Train, ...prev.slice(0, limit - 1)]);
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'train', filter: `cross_id=eq.${CROSSING_ID}` },
        (payload) => {
          setTrains(prev => prev.map(t => t.train_id === payload.new.train_id ? payload.new as Train : t));
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [limit]);

  return { trains, loading, error };
}
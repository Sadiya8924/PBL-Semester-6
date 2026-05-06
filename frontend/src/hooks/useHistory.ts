import { useEffect, useState } from 'react';
import supabase from '../lib/supabase';
import type { GateEvent } from '../lib/types';

const CROSSING_ID = process.env.NEXT_PUBLIC_CROSSING_ID || '';

export function useHistory(limit = 50) {
  const [events, setEvents] = useState<GateEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    async function fetchHistory() {
      const { data, error } = await supabase
        .from('gate_events')
        .select('*')
        .eq('cross_id', CROSSING_ID)
        .order('occurred_at', { ascending: false })
        .limit(limit);
      if (error) setError(error.message);
      else setEvents(data || []);
      setLoading(false);
    }
    fetchHistory();
  }, [limit]);

  return { events, loading, error };
}
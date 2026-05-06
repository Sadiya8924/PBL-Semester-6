import { useEffect, useState } from 'react';
import supabase from '@/lib/supabase';
import type { GateEvent } from '@/lib/types';

export function useGateStatus(crossId: string | null) {
  const [gateState, setGateState]   = useState<'OPEN' | 'CLOSED' | null>(null);
  const [lastEvent, setLastEvent]   = useState<GateEvent | null>(null);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    if (!crossId) return;

    async function fetchLatest() {
      const { data } = await supabase
        .from('gate_events')
        .select('*')
        .eq('cross_id', crossId)
        .order('occurred_at', { ascending: false })
        .limit(1)
        .single();

      if (data) {
        setLastEvent(data);
        setGateState(data.new_state as 'OPEN' | 'CLOSED');
      }
      setLoading(false);
    }

    fetchLatest();

    // Realtime subscription
    const channel = supabase
      .channel(`gate_status:${crossId}`)
      .on('postgres_changes', {
        event:  'INSERT',
        schema: 'public',
        table:  'gate_events',
        filter: `cross_id=eq.${crossId}`,
      }, (payload) => {
        const ev = payload.new as GateEvent;
        setLastEvent(ev);
        setGateState(ev.new_state as 'OPEN' | 'CLOSED');
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [crossId]);

  return { gateState, lastEvent, loading };
}

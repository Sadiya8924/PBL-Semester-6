import { useEffect, useState } from 'react';
import supabase from '@/lib/supabase';
import type { SensorReading } from '@/lib/types';

export function useSensorData(crossId: string | null) {
  const [ultrasonik, setUltrasonik] = useState<SensorReading | null>(null);
  const [ir, setIr]                 = useState<SensorReading | null>(null);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    if (!crossId) return;

    async function fetchLatest() {
      const [{ data: us }, { data: irData }] = await Promise.all([
        supabase
          .from('sensor_readings')
          .select('*')
          .eq('cross_id', crossId)
          .eq('sensor_type', 'ULTRASONIC')
          .order('recorded_at', { ascending: false })
          .limit(1)
          .single(),
        supabase
          .from('sensor_readings')
          .select('*')
          .eq('cross_id', crossId)
          .eq('sensor_type', 'IR')
          .order('recorded_at', { ascending: false })
          .limit(1)
          .single(),
      ]);
      if (us)     setUltrasonik(us);
      if (irData) setIr(irData);
      setLoading(false);
    }

    fetchLatest();

    // Realtime subscription
    const channel = supabase
      .channel(`sensor_data:${crossId}`)
      .on('postgres_changes', {
        event:  'INSERT',
        schema: 'public',
        table:  'sensor_readings',
        filter: `cross_id=eq.${crossId}`,
      }, (payload) => {
        const reading = payload.new as SensorReading;
        if (reading.sensor_type === 'ULTRASONIC') setUltrasonik(reading);
        if (reading.sensor_type === 'IR')          setIr(reading);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [crossId]);

  return { ultrasonik, ir, loading };
}

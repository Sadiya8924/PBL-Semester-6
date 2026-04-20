import { useEffect, useState } from 'react';
import type { AnalyticsRow } from '../lib/types';

const BACKEND_URL  = process.env.NEXT_PUBLIC_BACKEND_URL  || 'http://localhost:3001';
const CROSSING_ID  = process.env.NEXT_PUBLIC_CROSSING_ID  || '';

export function useAnalytics(period: 'daily' | 'monthly' | 'yearly' = 'daily') {
  const [data, setData]       = useState<AnalyticsRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    if (!CROSSING_ID) return;
    setLoading(true);
    async function fetch_() {
      try {
        const res = await fetch(
          `${BACKEND_URL}/api/crossings/${CROSSING_ID}/analytics?period=${period}`
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetch_();
  }, [period]);

  return { data, loading, error };
}
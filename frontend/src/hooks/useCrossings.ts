import { useEffect, useState } from 'react';
import supabase from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import type { Crossing } from '@/lib/types';

export function useCrossings() {
  const { profile, isAdmin } = useAuth();
  const [crossings, setCrossings] = useState<Crossing[]>([]);
  const [selected, setSelected]   = useState<string | null>(null);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    async function fetchCrossings() {
      let query = supabase.from('crossings').select('*').eq('status', 'active').order('name');

      // Staff hanya lihat crossing yang ditugaskan
      if (!isAdmin && profile?.cross_id) {
        query = query.eq('cross_id', profile.cross_id);
      }

      const { data } = await query;
      const list = data || [];
      setCrossings(list);

      // Auto-select: staff langsung ke crossing mereka, admin ke pertama
      if (!isAdmin && profile?.cross_id) {
        setSelected(profile.cross_id);
      } else if (list.length > 0) {
        setSelected(list[0].cross_id);
      }

      setLoading(false);
    }

    if (profile !== undefined) fetchCrossings();
  }, [profile, isAdmin]);

  return { crossings, selected, setSelected, loading };
}

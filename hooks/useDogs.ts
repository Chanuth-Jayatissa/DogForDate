import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';

type Dog = Database['public']['Tables']['dogs']['Row'];

export function useDogs() {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDogs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('dogs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDogs(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDogs();
  }, []);

  const createDog = async (dogData: Database['public']['Tables']['dogs']['Insert']) => {
    try {
      const { data, error } = await supabase
        .from('dogs')
        .insert(dogData)
        .select()
        .single();

      if (error) throw error;
      setDogs(prev => [data, ...prev]);
      return data;
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  const updateDog = async (id: string, updates: Database['public']['Tables']['dogs']['Update']) => {
    try {
      const { data, error } = await supabase
        .from('dogs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setDogs(prev => prev.map(dog => dog.id === id ? data : dog));
      return data;
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  const deleteDog = async (id: string) => {
    try {
      const { error } = await supabase
        .from('dogs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setDogs(prev => prev.filter(dog => dog.id !== id));
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  return {
    dogs,
    loading,
    error,
    fetchDogs,
    createDog,
    updateDog,
    deleteDog,
  };
}
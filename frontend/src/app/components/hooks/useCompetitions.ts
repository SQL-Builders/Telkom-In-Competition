import { useState, useEffect } from 'react';
import { competitionsApi } from '../api/competitionsApi';
import type { Competition } from '../data/competitions';
import { competitions as mockCompetitions } from '../data/competitions';

// We provide fallback to mock data in case backend is down or empty during development
export function useCompetitions(params?: any) {
  const [data, setData] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchCompetitions() {
      try {
        setLoading(true);
        const res = await competitionsApi.getAll(params) as any;
        if (res) {
          // Robustly extract array regardless of response shape
          let finalData = [];
          if (Array.isArray(res)) finalData = res;
          else if (Array.isArray(res.data)) finalData = res.data;
          else if (res.data && Array.isArray(res.data.data)) finalData = res.data.data;
          else if (res.competitions && Array.isArray(res.competitions)) finalData = res.competitions;
          
          setData(finalData);
        } else {
          setData([]);
        }
      } catch (err) {
        console.error('Failed to fetch competitions', err);
        setData([]);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    }
    fetchCompetitions();
  }, [JSON.stringify(params)]);

  return { data, loading, error };
}

export function useCompetition(id?: string | number) {
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCompetition() {
      if (!id) return;
      try {
        setLoading(true);
        const data = await competitionsApi.getById(id);
        setCompetition(data || null);
      } catch (err) {
        console.error('Failed to fetch competition', err);
        setCompetition(null);
      } finally {
        setLoading(false);
      }
    }
    fetchCompetition();
  }, [id]);

  return { competition, loading };
}

export function useFeaturedCompetitions() {
  const { data, loading } = useCompetitions();
  // If no competition is flagged as featured, show the 6 most recent ones
  const featured = data.filter(c => c.featured);
  return { 
    data: featured.length > 0 ? featured : data.slice(0, 6),
    loading 
  };
}

export function useRecommendedCompetitions() {
  const { data, loading } = useCompetitions();
  return { 
    data: data.filter(c => c.recommended),
    loading 
  };
}

export function useMyCompetitions() {
  // In a real app, this would fetch from /competitions/registrations/me
  // For now we will mock it with the fallback since the backend mapping might be slightly different.
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMy() {
      try {
        setLoading(true);
        const res = await competitionsApi.getMyRegistrations();
        if (res) {
          setData(res);
        } else {
          setData([]);
        }
      } catch (err) {
        console.error('Failed to fetch my competitions', err);
        setData([]);
      } finally {
        setLoading(false);
      }
    }
    fetchMy();
  }, []);

  return { data, loading };
}

export function useBookmarkedCompetitions() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBookmarked() {
      try {
        setLoading(true);

        // Try backend API first (requires auth token)
        const token = localStorage.getItem('telkom-in-competition:token') || sessionStorage.getItem('telkom-in-competition:token');
        if (token) {
          const { bookmarksApi } = await import('../api/bookmarksApi');
          const bookmarks = await bookmarksApi.getMyBookmarks();
          // bookmarks shape from backend: { id_lomba_favorit, id_lomba, favorit, created_at, data_lomba: {...} }
          const mapped = bookmarks
            .filter((b: any) => b.favorit === 1 || b.favorit === true)
            .map((b: any) => {
              const comp = b.data_lomba || b;
              return {
                ...comp,
                id: comp.id_lomba || comp.id,
                title: comp.nama_lomba || comp.title,
                description: comp.deskripsi || comp.description,
                category: comp.kategori_lomba?.nama_kategori || comp.category || 'Uncategorized',
                level: comp.tingkat || comp.level || 'Nasional',
                participants: comp.jumlah_peserta || comp.participants || 0,
                image: (Array.isArray(comp.gambar_poster) ? comp.gambar_poster[0]?.image_path : comp.gambar_poster?.image_path) || comp.image || '',
                deadline: comp.deadline || new Date().toISOString(),
                bookmarkId: b.id_lomba_favorit,
                bookmarkedDate: b.created_at,
              };
            });
          setData(mapped);
          return;
        }

        // Fallback: localStorage IDs + fetch all competitions
        const saved: number[] = JSON.parse(localStorage.getItem('telkom-in:bookmarks') || '[]');
        const dates: Record<string, string> = JSON.parse(localStorage.getItem('telkom-in:bookmark-dates') || '{}');
        if (saved.length === 0) { setData([]); return; }

        const res = await competitionsApi.getAll() as any;
        const allComps: any[] = res?.competitions || res?.data || [];
        const bookmarked = allComps
          .filter(c => saved.includes(c.id))
          .map(c => ({ ...c, bookmarkedDate: dates[String(c.id)] || null }));
        setData(bookmarked);
      } catch (err) {
        console.error('Failed to fetch bookmarked competitions', err);
        setData([]);
      } finally {
        setLoading(false);
      }
    }
    fetchBookmarked();
  }, []);

  const removeItem = async (competitionId: number, bookmarkId?: number) => {
    setData(prev => prev.filter(c => (c.id_lomba || c.id) !== competitionId));
    // Remove from localStorage
    try {
      const saved: number[] = JSON.parse(localStorage.getItem('telkom-in:bookmarks') || '[]');
      localStorage.setItem('telkom-in:bookmarks', JSON.stringify(saved.filter(id => id !== competitionId)));
      const dates: Record<string, string> = JSON.parse(localStorage.getItem('telkom-in:bookmark-dates') || '{}');
      delete dates[String(competitionId)];
      localStorage.setItem('telkom-in:bookmark-dates', JSON.stringify(dates));
    } catch {}
    // Remove from backend
    if (bookmarkId) {
      try {
        const { bookmarksApi } = await import('../api/bookmarksApi');
        await bookmarksApi.removeBookmark(bookmarkId);
      } catch {}
    }
  };

  const clearAll = async () => {
    const ids = data.map(c => c.bookmarkId).filter(Boolean);
    setData([]);
    localStorage.removeItem('telkom-in:bookmarks');
    localStorage.removeItem('telkom-in:bookmark-dates');
    for (const id of ids) {
      try {
        const { bookmarksApi } = await import('../api/bookmarksApi');
        await bookmarksApi.removeBookmark(id);
      } catch {}
    }
  };

  return { data, loading, removeItem, clearAll };
}
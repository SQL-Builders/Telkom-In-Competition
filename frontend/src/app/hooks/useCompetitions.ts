import { useState, useEffect } from 'react';
import { competitionsApi } from '../api/competitionsApi';
import type { Competition } from '../data/competitions';
import { competitions as mockCompetitions, competitionHighlights as mockHighlights } from '../data/competitions';

// Colour palette cycling for backend competitions that lack highlightColor
const HIGHLIGHT_COLORS = [
  'from-purple-500 to-pink-500',
  'from-blue-500 to-cyan-500',
  'from-orange-500 to-red-500',
  'from-green-500 to-emerald-500',
  'from-indigo-500 to-purple-500',
  'from-pink-500 to-rose-500',
  'from-red-600 to-pink-600',
  'from-yellow-500 to-orange-500',
];

/**
 * Normalize a raw competition object coming from the backend.
 * The backend's mapCompetitionToFrontend already maps most fields,
 * but shortTitle and highlightColor are frontend-only fields that may be missing.
 */
function normalizeCompetition(comp: any, index = 0): Competition {
  return {
    ...comp,
    shortTitle: comp.shortTitle || comp.title || '',
    highlightColor: comp.highlightColor || HIGHLIGHT_COLORS[index % HIGHLIGHT_COLORS.length],
    heroGradient: comp.heroGradient || 'from-[#C8102E] via-[#E91E3A] to-[#FF4757]',
    fullDescription: comp.fullDescription || comp.description || '',
    registrationDeadline: comp.registrationDeadline || comp.deadline || '',
    prizes: Array.isArray(comp.prizes)
      ? comp.prizes
      : comp.hadiah
        ? [comp.hadiah]
        : [],
    whatsappGroup: comp.whatsappGroup || '',
    location: comp.location || 'Online',
    organizer: comp.organizer || '',
    requirements: Array.isArray(comp.requirements) ? comp.requirements : [],
    timeline: Array.isArray(comp.timeline) ? comp.timeline : [],
    featured: comp.featured ?? false,
    recommended: comp.recommended ?? false,
  };
}

/**
 * Deduplicate competitions by ID and normalized title (case-insensitive)
 * to ensure that similar or duplicate event entries are combined/filtered out.
 */
function deduplicateCompetitions(comps: Competition[]): Competition[] {
  const seenIds = new Set<number | string>();
  const seenTitles = new Set<string>();
  
  return comps.filter(comp => {
    if (!comp) return false;
    const titleKey = comp.title.toLowerCase().replace(/\s+/g, ' ').trim();
    if (seenIds.has(comp.id) || seenTitles.has(titleKey)) {
      return false;
    }
    seenIds.add(comp.id);
    seenTitles.add(titleKey);
    return true;
  });
}

// We provide fallback to mock data in case backend is down or empty during development
export function useCompetitions(params?: any) {
  const [data, setData] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchCompetitions() {
      try {
        setLoading(true);
        // competitionsApi.getAll now returns PaginatedResponse<Competition> directly
        const res = await competitionsApi.getAll(params);
        const finalData: Competition[] = Array.isArray(res.data)
          ? res.data.map((c, i) => normalizeCompetition(c, i))
          : [];
        setData(deduplicateCompetitions(finalData));
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
        setCompetition(data ? normalizeCompetition(data) : null);
      } catch (err) {
        console.error('Failed to fetch competition from API, trying mock data…', err);
        // Fallback: find in static mock data (useful for demo IDs 1–9)
        const mock = mockCompetitions.find(c => c.id === Number(id));
        setCompetition(mock ?? null);
      } finally {
        setLoading(false);
      }
    }
    fetchCompetition();
  }, [id]);

  return { competition, loading };
}

/**
 * Helper to get card background styling (gradient color, placeholder image, and filter value)
 * tailored to each competition category name.
 */
function getCategoryStyle(categoryName: string, index = 0) {
  const norm = categoryName.toLowerCase().trim();
  
  // Default values
  let color = HIGHLIGHT_COLORS[index % HIGHLIGHT_COLORS.length];
  let image = '/competitions/web.jpg';
  let filterValue = 'all';

  if (norm.includes('ui/ux') || norm.includes('uiux')) {
    color = 'from-purple-500 to-pink-500';
    image = '/competitions/uiux.jpg';
    filterValue = 'uiux';
  } else if (norm.includes('cyber') || norm.includes('security')) {
    color = 'from-red-600 to-pink-600';
    image = '/competitions/ctf.jpg';
    filterValue = 'it';
  } else if (norm.includes('data') || norm.includes('science') || norm.includes('ai')) {
    color = 'from-green-500 to-emerald-500';
    image = '/competitions/data.jpg';
    filterValue = 'datascience';
  } else if (norm.includes('mobile')) {
    color = 'from-indigo-500 to-purple-500';
    image = '/competitions/mobile.jpg';
    filterValue = 'it';
  } else if (norm.includes('design') || norm.includes('graphic')) {
    color = 'from-pink-500 to-rose-500';
    image = '/competitions/graphic.jpg';
    filterValue = 'design';
  } else if (norm.includes('business') || norm.includes('plan')) {
    color = 'from-orange-500 to-red-500';
    image = '/competitions/business.jpg';
    filterValue = 'business';
  } else if (norm.includes('marketing')) {
    color = 'from-yellow-500 to-orange-500';
    image = '/competitions/marketing.jpg';
    filterValue = 'business';
  } else if (norm.includes('programming') || norm.includes('code') || norm.includes('hackathon') || norm.includes('it')) {
    color = 'from-blue-500 to-cyan-500';
    image = '/competitions/hackathon.jpg';
    filterValue = 'it';
  }

  return { color, image, filterValue };
}

/**
 * Hook for the Competition Highlights section.
 * Group competitions by category, so instead of showing duplicate cards,
 * we show category cards that navigate to Explore filtered by category.
 */
export function useCompetitionHighlights(limit = 8) {
  const [highlights, setHighlights] = useState<{
    id: string;
    title: string;
    color: string;
    image: string;
    categoryValue: string;
    competitionCount: number;
    competitions: Competition[];
  }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHighlights() {
      try {
        setLoading(true);
        // Fetch up to 100 to group everything properly
        const res = await competitionsApi.getAll({ limit: 100 });
        const apiComps: Competition[] = Array.isArray(res.data)
          ? res.data.map((c, i) => normalizeCompetition(c, i))
          : [];

        if (apiComps.length > 0) {
          const categoryGroups: Record<string, {
            title: string;
            competitions: Competition[];
          }> = {};

          for (const comp of apiComps) {
            const cat = comp.category || 'Uncategorized';
            const normCat = cat.toLowerCase().trim();
            if (!categoryGroups[normCat]) {
              categoryGroups[normCat] = {
                title: cat,
                competitions: []
              };
            }
            categoryGroups[normCat].competitions.push(comp);
          }

          const groupedHighlights = Object.entries(categoryGroups).map(([normCat, group], i) => {
            const style = getCategoryStyle(group.title, i);
            return {
              id: `cat-${normCat}`,
              title: group.title,
              color: style.color,
              image: style.image,
              categoryValue: style.filterValue,
              competitionCount: group.competitions.length,
              competitions: group.competitions,
            };
          });

          setHighlights(groupedHighlights.slice(0, limit));
          return;
        }
      } catch (err) {
        console.warn('Highlights API failed, using mock data:', err);
      }

      // Fallback to static mock highlights grouped by category
      const categoryGroups: Record<string, {
        title: string;
        competitions: Competition[];
      }> = {};

      for (const comp of mockCompetitions) {
        const cat = comp.category || 'Uncategorized';
        const normCat = cat.toLowerCase().trim();
        if (!categoryGroups[normCat]) {
          categoryGroups[normCat] = {
            title: cat,
            competitions: []
          };
        }
        categoryGroups[normCat].competitions.push(comp);
      }

      const groupedMocks = Object.entries(categoryGroups).map(([normCat, group], i) => {
        const style = getCategoryStyle(group.title, i);
        return {
          id: `cat-${normCat}`,
          title: group.title,
          color: style.color,
          image: style.image,
          categoryValue: style.filterValue,
          competitionCount: group.competitions.length,
          competitions: group.competitions,
        };
      });

      setHighlights(groupedMocks.slice(0, limit));
    }

    fetchHighlights().finally(() => setLoading(false));
  }, [limit]);

  return { highlights, loading };
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
  const recommended = data.filter(c => c.recommended);
  return { 
    // If none are flagged as recommended, show first 3
    data: recommended.length > 0 ? recommended : data.slice(0, 3),
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
          const mapped = Array.isArray(res) ? res.map((reg: any) => {
            const dbStatus = reg.status || reg.registrationData?.status_pendaftaran || 'pending';
            const stage = reg.stage || reg.registrationData?.stage || 'University';
            
            let status = dbStatus;
            if (stage === 'University') {
              if (dbStatus === 'accepted' || dbStatus === 'approved') status = 'university-approved';
              else if (dbStatus === 'rejected') status = 'university-rejected';
              else status = 'university-pending';
            } else if (stage === 'National') {
              if (dbStatus === 'accepted' || dbStatus === 'approved') status = 'national-reviewed';
              else status = 'national-submitted';
            } else if (stage === 'International') {
              status = 'national-reviewed';
            }
            
            return {
              ...reg,
              status
            };
          }) : [];
          setData(mapped);
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

import { apiClient } from './client';
import type { Competition } from '../data/competitions';

export interface BookmarkedCompetition extends Competition {
  bookmarkedAt?: string;
}

export interface BookmarkToggleResult {
  bookmarked: boolean;
  bookmarkId?: number;
}

/** Bookmarks API — wraps semua endpoint /api/bookmarks */
export const bookmarksApi = {
  /** Ambil semua kompetisi yang di-bookmark oleh user yang login */
  getMyBookmarks: async (): Promise<BookmarkedCompetition[]> => {
    const response = await apiClient.get<{ data: BookmarkedCompetition[] }>(
      '/bookmarks'
    );
    return response.data.data ?? [];
  },

  /** Toggle bookmark suatu kompetisi (tambah jika belum ada, hapus jika sudah ada) */
  toggleBookmark: async (
    competitionId: number | string
  ): Promise<BookmarkToggleResult> => {
    const response = await apiClient.post<{ data: BookmarkToggleResult }>(
      `/bookmarks/toggle/${competitionId}`
    );
    return response.data.data;
  },

  /** Cek apakah kompetisi sudah di-bookmark */
  checkBookmark: async (competitionId: number | string): Promise<boolean> => {
    const response = await apiClient.get<{
      data: { isBookmarked: boolean };
    }>(`/bookmarks/check/${competitionId}`);
    return response.data.data?.isBookmarked ?? false;
  },

  /** Hapus bookmark berdasarkan bookmark record ID */
  removeBookmark: async (bookmarkId: number | string): Promise<void> => {
    await apiClient.delete(`/bookmarks/${bookmarkId}`);
  },
};

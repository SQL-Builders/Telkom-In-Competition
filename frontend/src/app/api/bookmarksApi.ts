import { apiClient } from './client';

export const bookmarksApi = {
  /** Get all bookmarked competitions for logged-in user */
  getMyBookmarks: async () => {
    const response = await apiClient.get('/bookmarks');
    return response.data.data || [];
  },

  /** Toggle bookmark for a competition (add if not exists, remove if exists) */
  toggleBookmark: async (competitionId: number | string) => {
    const response = await apiClient.post(`/bookmarks/toggle/${competitionId}`);
    return response.data.data;
  },

  /** Check if a competition is bookmarked */
  checkBookmark: async (competitionId: number | string): Promise<boolean> => {
    const response = await apiClient.get(`/bookmarks/check/${competitionId}`);
    return response.data.data?.isBookmarked ?? false;
  },

  /** Remove a bookmark by its bookmark record ID */
  removeBookmark: async (bookmarkId: number | string) => {
    const response = await apiClient.delete(`/bookmarks/${bookmarkId}`);
    return response.data.data;
  },
};

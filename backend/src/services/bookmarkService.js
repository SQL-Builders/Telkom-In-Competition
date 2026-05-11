import supabase from '../config/supabase.js';
import logger from '../utils/logger.js';
import { AppError } from '../middleware/errorMiddleware.js';

const bookmarkService = {
  /**
   * Get all bookmarked competitions for a user.
   * @param {number} userId
   * @returns {Array} Bookmarked competitions with details.
   */
  async getUserBookmarks(userId) {
    const { data: bookmarks, error } = await supabase
      .from('lomba_favorit')
      .select(`
        id_lomba_favorit,
        favorit,
        data_lomba:id_lomba (
          id_lomba,
          nama_lomba,
          deskripsi,
          penyelenggara,
          biaya,
          tgl_mulai,
          tgl_selesai,
          deadline,
          status,
          kategori_lomba ( id_kategori, nama_kategori ),
          gambar_poster ( id_gambar_poster, image_path )
        )
      `)
      .eq('id_user', userId)
      .eq('favorit', 1)
      .order('id_lomba_favorit', { ascending: false });

    if (error) {
      logger.error('Get bookmarks error:', error);
      throw new AppError('Failed to fetch bookmarks.', 500);
    }

    return bookmarks;
  },

  /**
   * Toggle bookmark (add / remove) for a competition.
   * @param {number} userId
   * @param {number} competitionId
   * @returns {object} { bookmarked, bookmark? }
   */
  async toggleBookmark(userId, competitionId) {
    // Check if bookmark already exists
    const { data: existing, error: findError } = await supabase
      .from('lomba_favorit')
      .select('id_lomba_favorit, favorit')
      .eq('id_user', userId)
      .eq('id_lomba', competitionId)
      .single();

    if (findError && findError.code !== 'PGRST116') {
      // PGRST116 = "no rows returned" — that's fine, means no existing bookmark
      logger.error('Find bookmark error:', findError);
      throw new AppError('Failed to process bookmark.', 500);
    }

    if (existing) {
      // Toggle: flip favorit between 1 and 0
      const newFavorit = existing.favorit === 1 ? 0 : 1;

      const { data: updated, error: updateError } = await supabase
        .from('lomba_favorit')
        .update({ favorit: newFavorit })
        .eq('id_lomba_favorit', existing.id_lomba_favorit)
        .select('*')
        .single();

      if (updateError) {
        logger.error('Toggle bookmark error:', updateError);
        throw new AppError('Failed to update bookmark.', 500);
      }

      return {
        bookmarked: newFavorit === 1,
        bookmark: updated,
      };
    }

    // Create new bookmark
    const { data: newBookmark, error: createError } = await supabase
      .from('lomba_favorit')
      .insert({
        id_user: userId,
        id_lomba: competitionId,
        favorit: 1,
      })
      .select('*')
      .single();

    if (createError) {
      logger.error('Create bookmark error:', createError);
      throw new AppError('Failed to create bookmark.', 500);
    }

    return {
      bookmarked: true,
      bookmark: newBookmark,
    };
  },

  /**
   * Remove a bookmark.
   * @param {number} userId
   * @param {number} bookmarkId
   */
  async removeBookmark(userId, bookmarkId) {
    const { data: bookmark, error: findError } = await supabase
      .from('lomba_favorit')
      .select('id_lomba_favorit')
      .eq('id_lomba_favorit', bookmarkId)
      .eq('id_user', userId)
      .single();

    if (findError || !bookmark) {
      throw new AppError('Bookmark not found.', 404);
    }

    const { error } = await supabase
      .from('lomba_favorit')
      .delete()
      .eq('id_lomba_favorit', bookmarkId);

    if (error) {
      logger.error('Remove bookmark error:', error);
      throw new AppError('Failed to remove bookmark.', 500);
    }

    return true;
  },

  /**
   * Check if a competition is bookmarked by a user.
   * @param {number} userId
   * @param {number} competitionId
   * @returns {boolean}
   */
  async isBookmarked(userId, competitionId) {
    const { data, error } = await supabase
      .from('lomba_favorit')
      .select('id_lomba_favorit, favorit')
      .eq('id_user', userId)
      .eq('id_lomba', competitionId)
      .eq('favorit', 1)
      .single();

    if (error && error.code !== 'PGRST116') {
      logger.error('Check bookmark error:', error);
      throw new AppError('Failed to check bookmark status.', 500);
    }

    return !!data;
  },
};

export default bookmarkService;

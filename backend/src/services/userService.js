import supabase from '../config/supabase.js';
import logger from '../utils/logger.js';
import { AppError } from '../middleware/errorMiddleware.js';

const userService = {
  /**
   * Get all users with pagination.
   * @param {number} page
   * @param {number} limit
   * @returns {object} { users, pagination }
   */
  async getAllUsers(page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    // Get total count
    const { count, error: countError } = await supabase
      .from('user_pengguna')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      logger.error('Get users count error:', countError);
      throw new AppError('Failed to fetch users.', 500);
    }

    // Get paginated users
    const { data: users, error } = await supabase
      .from('user_pengguna')
      .select('id_user, name, email, role, nama_lengkap, no_telepon, tgl_daftar')
      .order('id_user', { ascending: true })
      .range(offset, offset + limit - 1);

    if (error) {
      logger.error('Get users error:', error);
      throw new AppError('Failed to fetch users.', 500);
    }

    return {
      users,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    };
  },

  /**
   * Get a single user by ID.
   * @param {number} userId
   * @returns {object} User data (without password).
   */
  async getUserById(userId) {
    const { data: user, error } = await supabase
      .from('user_pengguna')
      .select('id_user, name, email, role, nama_lengkap, no_telepon, tgl_daftar')
      .eq('id_user', userId)
      .single();

    if (error || !user) {
      throw new AppError('User not found.', 404);
    }

    return user;
  },

  /**
   * Update user profile.
   * @param {number} userId
   * @param {object} updateData
   * @returns {object} Updated user data.
   */
  async updateUser(userId, updateData) {
    // Only allow updating specific fields
    const allowedFields = ['name', 'nama_lengkap', 'no_telepon'];
    const filteredData = {};
    for (const key of allowedFields) {
      if (updateData[key] !== undefined) {
        filteredData[key] = updateData[key];
      }
    }

    if (Object.keys(filteredData).length === 0) {
      throw new AppError('No valid fields to update.', 400);
    }

    const { data: updatedUser, error } = await supabase
      .from('user_pengguna')
      .update(filteredData)
      .eq('id_user', userId)
      .select('id_user, name, email, role, nama_lengkap, no_telepon, tgl_daftar')
      .single();

    if (error) {
      logger.error('Update user error:', error);
      throw new AppError('Failed to update user.', 500);
    }

    if (!updatedUser) {
      throw new AppError('User not found.', 404);
    }

    return updatedUser;
  },

  /**
   * Delete a user by ID.
   * @param {number} userId
   */
  async deleteUser(userId) {
    // Check if user exists first
    const { data: user, error: findError } = await supabase
      .from('user_pengguna')
      .select('id_user')
      .eq('id_user', userId)
      .single();

    if (findError || !user) {
      throw new AppError('User not found.', 404);
    }

    const { error } = await supabase
      .from('user_pengguna')
      .delete()
      .eq('id_user', userId);

    if (error) {
      logger.error('Delete user error:', error);
      throw new AppError('Failed to delete user.', 500);
    }

    return true;
  },

  /**
   * Toggle user status (active/banned)
   * @param {number} userId 
   * @returns {object} Updated user data
   */
  async toggleUserStatus(userId) {
    const { data: user, error: findError } = await supabase
      .from('user_pengguna')
      .select('id_user, status')
      .eq('id_user', userId)
      .single();

    if (findError || !user) {
      throw new AppError('User not found.', 404);
    }

    const newStatus = user.status === 'banned' ? 'active' : 'banned';

    const { data: updatedUser, error: updateError } = await supabase
      .from('user_pengguna')
      .update({ status: newStatus })
      .eq('id_user', userId)
      .select('id_user, name, email, role, status')
      .single();

    if (updateError) {
      logger.error('Toggle user status error:', updateError);
      throw new AppError('Failed to update user status.', 500);
    }

    return updatedUser;
  },
};

export default userService;

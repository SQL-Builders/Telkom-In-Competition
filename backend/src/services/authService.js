import bcrypt from 'bcryptjs';
import supabase from '../config/supabase.js';
import tokenManager from '../utils/tokenManager.js';
import logger from '../utils/logger.js';
import { AppError } from '../middleware/errorMiddleware.js';

const SALT_ROUNDS = 12;

const authService = {
  /**
   * Register a new user.
   * @param {object} userData - { name, email, password, nama_lengkap?, no_telepon?, role? }
   * @returns {object} { user, accessToken, refreshToken }
   */
  async register(userData) {
    const { name, email, password, nama_lengkap, no_telepon, role } = userData;

    // Check if email already exists
    const { data: existingUser } = await supabase
      .from('user_pengguna')
      .select('id_user')
      .eq('email', email)
      .single();

    if (existingUser) {
      throw new AppError('Email is already registered.', 409);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Insert user
    const { data: newUser, error } = await supabase
      .from('user_pengguna')
      .insert({
        name,
        email,
        password: hashedPassword,
        nama_lengkap: nama_lengkap || null,
        no_telepon: no_telepon || null,
        role: role || 'user',
        tgl_daftar: new Date().toISOString(),
      })
      .select('id_user, name, email, role, nama_lengkap, no_telepon, tgl_daftar')
      .single();

    if (error) {
      logger.error('Registration DB error:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
      throw new AppError(`Failed to register user: ${error.message}`, 500);
    }

    // Generate tokens
    const tokenPayload = {
      id_user: newUser.id_user,
      email: newUser.email,
      role: newUser.role,
    };

    const accessToken = tokenManager.generateAccessToken(tokenPayload);
    const refreshToken = tokenManager.generateRefreshToken(tokenPayload);

    return { user: newUser, accessToken, refreshToken };
  },

  /**
   * Login with email and password.
   * @param {string} email
   * @param {string} password
   * @returns {object} { user, accessToken, refreshToken }
   */
  async login(email, password) {
    // Fetch user by email
    const { data: user, error } = await supabase
      .from('user_pengguna')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      throw new AppError('Invalid email or password.', 401);
    }

    if (user.status === 'banned') {
      throw new AppError('Your account has been banned.', 403);
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AppError('Invalid email or password.', 401);
    }

    // Generate tokens
    const tokenPayload = {
      id_user: user.id_user,
      email: user.email,
      role: user.role,
    };

    const accessToken = tokenManager.generateAccessToken(tokenPayload);
    const refreshToken = tokenManager.generateRefreshToken(tokenPayload);

    // Exclude password from response
    const { password: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, accessToken, refreshToken };
  },

  /**
   * Refresh access token using a valid refresh token.
   * @param {string} refreshToken
   * @returns {object} { accessToken, refreshToken }
   */
  async refreshToken(refreshToken) {
    const decoded = tokenManager.verifyToken(refreshToken);

    // Verify user still exists
    const { data: user, error } = await supabase
      .from('user_pengguna')
      .select('id_user, email, role, status')
      .eq('id_user', decoded.id_user)
      .single();

    if (error || !user) {
      throw new AppError('User no longer exists.', 401);
    }

    if (user.status === 'banned') {
      throw new AppError('Your account has been banned.', 403);
    }

    const tokenPayload = {
      id_user: user.id_user,
      email: user.email,
      role: user.role,
    };

    const newAccessToken = tokenManager.generateAccessToken(tokenPayload);
    const newRefreshToken = tokenManager.generateRefreshToken(tokenPayload);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  },

  /**
   * Change user password.
   * @param {number} userId
   * @param {string} currentPassword
   * @param {string} newPassword
   */
  async changePassword(userId, currentPassword, newPassword) {
    const { data: user, error } = await supabase
      .from('user_pengguna')
      .select('id_user, password')
      .eq('id_user', userId)
      .single();

    if (error || !user) {
      throw new AppError('User not found.', 404);
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new AppError('Current password is incorrect.', 400);
    }

    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

    const { error: updateError } = await supabase
      .from('user_pengguna')
      .update({ password: hashedPassword })
      .eq('id_user', userId);

    if (updateError) {
      logger.error('Change password DB error:', updateError);
      throw new AppError('Failed to change password.', 500);
    }

    return true;
  },
};

export default authService;

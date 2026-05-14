import supabase from '../config/supabase.js';
import logger from '../utils/logger.js';
import { AppError } from '../middleware/errorMiddleware.js';

const competitionService = {
  /**
   * Get all competitions with pagination, filtering, and search.
   */
  async getAllCompetitions({ page = 1, limit = 10, status, search, kategori }) {
    const offset = (page - 1) * limit;

    // Build base query for count
    let countQuery = supabase
      .from('data_lomba')
      .select('*', { count: 'exact', head: true });

    // Build data query
    let dataQuery = supabase
      .from('data_lomba')
      .select(`
        *,
        gambar_poster ( id_gambar_poster, image_path, uploaded )
      `)
      .order('id_lomba', { ascending: false });

    // Apply filters
    if (status) {
      countQuery = countQuery.eq('status', status);
      dataQuery = dataQuery.eq('status', status);
    }
    if (kategori) {
      countQuery = countQuery.eq('id_kategori', kategori);
      dataQuery = dataQuery.eq('id_kategori', kategori);
    }
    if (search) {
      const searchFilter = `nama_lomba.ilike.%${search}%,penyelenggara.ilike.%${search}%`;
      countQuery = countQuery.or(searchFilter);
      dataQuery = dataQuery.or(searchFilter);
    }

    // Get count
    const { count, error: countError } = await countQuery;
    if (countError) {
      logger.error('Competition count error:', countError);
      throw new AppError('Failed to fetch competitions.', 500);
    }

    // Get data
    const { data: competitions, error } = await dataQuery.range(
      offset,
      offset + limit - 1
    );

    if (error) {
      logger.error('Get competitions error:', error);
      throw new AppError('Failed to fetch competitions.', 500);
    }

    // Fetch all categories to map them manually
    const { data: allCategories } = await supabase.from('kategori_lomba').select('*');

    const mappedCompetitions = competitions.map(comp => {
      const cat = allCategories?.find(c => c.id_kategori === comp.id_kategori);
      return {
        ...comp,
        kategori_lomba: cat ? { id_kategori: cat.id_kategori, nama_kategori: cat.nama_kategori, deskripsi: cat.deskripsi } : null
      };
    });

    return {
      competitions: mappedCompetitions,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    };
  },

  /**
   * Get a single competition by ID.
   */
  async getCompetitionById(competitionId) {
    const { data: competition, error } = await supabase
      .from('data_lomba')
      .select(`
        *,
        gambar_poster ( id_gambar_poster, image_path, uploaded )
      `)
      .eq('id_lomba', competitionId)
      .single();

    if (error || !competition) {
      throw new AppError('Competition not found.', 404);
    }

    // Manually map category
    if (competition.id_kategori) {
      const { data: cat } = await supabase
        .from('kategori_lomba')
        .select('id_kategori, nama_kategori, deskripsi')
        .eq('id_kategori', competition.id_kategori)
        .single();
      
      competition.kategori_lomba = cat || null;
    } else {
      competition.kategori_lomba = null;
    }

    return competition;
  },

  /**
   * Create a new competition.
   */
  async createCompetition(data) {
    const { data: competition, error } = await supabase
      .from('data_lomba')
      .insert({
        nama_lomba: data.nama_lomba,
        id_kategori: data.id_kategori || null,
        deskripsi: data.deskripsi || null,
        hadiah: data.hadiah || null,
        penyelenggara: data.penyelenggara,
        biaya: data.biaya || 0,
        tgl_mulai: data.tgl_mulai || null,
        tgl_selesai: data.tgl_selesai || null,
        deadline: data.deadline || null,
        status: data.status || 'active',
        is_document_required: data.is_document_required || false,
        max_document_size_mb: data.max_document_size_mb || 10,
        allowed_document_formats: data.allowed_document_formats || '.pdf,.zip,.png,.jpg,.jpeg',
      })
      .select('*')
      .single();

    if (error) {
      logger.error('Create competition error:', error);
      throw new AppError('Failed to create competition.', 500);
    }

    if (data.poster_url) {
      // Create poster record
      const { data: posterData, error: posterError } = await supabase
        .from('gambar_poster')
        .insert({
          id_lomba: competition.id_lomba,
          image_path: data.poster_url,
          uploaded: new Date().toISOString()
        })
        .select('*')
        .single();
      
      if (!posterError && posterData) {
        // Update competition with the poster ID
        await supabase
          .from('data_lomba')
          .update({ gambar_poster_id: posterData.id_gambar_poster })
          .eq('id_lomba', competition.id_lomba);
      } else {
        logger.error('Insert poster error:', JSON.stringify(posterError));
      }
    }

    return competition;
  },

  /**
   * Update an existing competition.
   */
  async updateCompetition(competitionId, data) {
    // Check existence
    await this.getCompetitionById(competitionId);

    const { data: updated, error } = await supabase
      .from('data_lomba')
      .update(data)
      .eq('id_lomba', competitionId)
      .select('*')
      .single();

    if (error) {
      logger.error('Update competition error:', error);
      throw new AppError('Failed to update competition.', 500);
    }

    return updated;
  },

  /**
   * Delete a competition by ID.
   */
  async deleteCompetition(competitionId) {
    await this.getCompetitionById(competitionId);

    const { error } = await supabase
      .from('data_lomba')
      .delete()
      .eq('id_lomba', competitionId);

    if (error) {
      logger.error('Delete competition error:', error);
      throw new AppError('Failed to delete competition.', 500);
    }

    return true;
  },

  /**
   * Register a user for a competition.
   */
  async registerForCompetition(userId, competitionData) {
    const { id_lomba, data_berkas_id_data_berkas } = competitionData;

    // Check competition exists
    await this.getCompetitionById(id_lomba);

    // Check if already registered
    const { data: existing } = await supabase
      .from('data_pendaftaran_lomba')
      .select('id_pendaftaran')
      .eq('id_user', userId)
      .eq('id_lomba', id_lomba)
      .single();

    if (existing) {
      throw new AppError('You are already registered for this competition.', 409);
    }

    // Generate registration number
    const nomorPendaftaran = `REG-${Date.now()}-${userId}`;

    // Insert registration
    const { data: registration, error } = await supabase
      .from('data_pendaftaran_lomba')
      .insert({
        id_user: userId,
        id_lomba,
        tgl_daftar: new Date().toISOString(),
        status_pendaftaran: 'pending',
        nomor_pendaftaran: nomorPendaftaran,
        data_berkas_id_data_berkas: data_berkas_id_data_berkas || null, // Make it optional
      })
      .select('*')
      .single();

    if (error) {
      logger.error('Register for competition error:', error);
      throw new AppError('Failed to register for competition.', 500);
    }

    return registration;
  },

  /**
   * Get registrations for a user.
   */
  async getUserRegistrations(userId) {
    const { data: registrations, error } = await supabase
      .from('data_pendaftaran_lomba')
      .select(`
        *,
        data_lomba (
          id_lomba,
          nama_lomba,
          status,
          penyelenggara,
          tgl_mulai,
          tgl_selesai,
          deadline,
          kategori_lomba ( id_kategori, nama_kategori )
        )
      `)
      .eq('id_user', userId)
      .order('tgl_daftar', { ascending: false });

    if (error) {
      logger.error('Get user registrations error:', error);
      throw new AppError('Failed to fetch registrations.', 500);
    }

    return registrations;
  },

  // ── Admin Registrants Management ──────────────────────────────────────

  /**
   * Get all registrations for a specific competition.
   */
  async getCompetitionRegistrants(competitionId) {
    // Check if competition exists
    await this.getCompetitionById(competitionId);

    const { data: registrations, error } = await supabase
      .from('data_pendaftaran_lomba')
      .select(`
        *,
        user_pengguna ( id_user, name, email, no_telepon ),
        data_berkas ( id_data_berkas, nama_berkas, file_path, tipe_berkas )
      `)
      .eq('id_lomba', competitionId)
      .order('tgl_daftar', { ascending: false });

    if (error) {
      logger.error('Get competition registrants error:', error);
      throw new AppError('Failed to fetch registrants.', 500);
    }

    return registrations;
  },

  /**
   * Update the status of a registration.
   */
  async updateRegistrantStatus(registrationId, status) {
    const validStatuses = ['pending', 'accepted', 'rejected', 'under_review'];
    if (!validStatuses.includes(status)) {
      throw new AppError('Invalid status.', 400);
    }

    const { data: registration, error } = await supabase
      .from('data_pendaftaran_lomba')
      .update({ status_pendaftaran: status })
      .eq('id_pendaftaran', registrationId)
      .select('*')
      .single();

    if (error || !registration) {
      logger.error('Update registrant status error:', error);
      throw new AppError('Failed to update status.', 500);
    }

    return registration;
  },

  /**
   * Mark a registration as winner.
   */
  async markWinner(registrationId, isWinner) {
    const { data: registration, error } = await supabase
      .from('data_pendaftaran_lomba')
      .update({ is_winner: isWinner })
      .eq('id_pendaftaran', registrationId)
      .select('*')
      .single();

    if (error || !registration) {
      logger.error('Mark winner error:', error);
      throw new AppError('Failed to mark winner.', 500);
    }

    return registration;
  },

  /**
   * Delete a registration.
   */
  async deleteRegistration(registrationId) {
    const { error } = await supabase
      .from('data_pendaftaran_lomba')
      .delete()
      .eq('id_pendaftaran', registrationId);

    if (error) {
      logger.error('Delete registration error:', error);
      throw new AppError('Failed to delete registration.', 500);
    }

    return true;
  },

  // ── Categories ──────────────────────────────────────────────

  /**
   * Get all competition categories.
   */
  async getAllCategories() {
    const { data: categories, error } = await supabase
      .from('kategori_lomba')
      .select('id_kategori, nama_kategori, deskripsi')
      .order('nama_kategori', { ascending: true });

    if (error) {
      logger.error('Get categories error:', error);
      throw new AppError('Failed to fetch categories.', 500);
    }

    return categories;
  },

  /**
   * Create a new category.
   */
  async createCategory(data) {
    const { data: category, error } = await supabase
      .from('kategori_lomba')
      .insert({
        nama_kategori: data.nama_kategori,
        deskripsi: data.deskripsi || null,
      })
      .select('*')
      .single();

    if (error) {
      logger.error('Create category error:', error);
      throw new AppError('Failed to create category.', 500);
    }

    return category;
  },
};

export default competitionService;

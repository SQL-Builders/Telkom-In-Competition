import supabase from '../config/supabase.js';
import logger from '../utils/logger.js';
import { AppError } from '../middleware/errorMiddleware.js';

const mapCompetitionToFrontend = (comp, categoryObj) => {
  return {
    id: comp.id_lomba,
    id_kategori: comp.id_kategori || null,
    title: comp.nama_lomba,
    description: comp.deskripsi || '',
    category: categoryObj ? categoryObj.nama_kategori : (comp.kategori_lomba?.nama_kategori || 'Uncategorized'),
    deadline: comp.deadline,
    level: comp.level || 'University',
    participants: comp.data_pendaftaran_lomba?.[0]?.count || comp.jumlah_peserta || 0,
    image: comp.gambar_poster?.[0]?.image_path || comp.gambar_poster?.image_path || '',
    organizer: comp.penyelenggara || '',
    location: comp.location || 'Online',
    whatsappGroup: comp.whatsapp_group || '',
    prizes: comp.hadiah ? [comp.hadiah] : [],
    hadiah: comp.hadiah || '',
    biaya: comp.biaya || 0,
    status: comp.status,
    featured: comp.featured || false,
    recommended: comp.recommended || false,
    timeline: comp.timeline || [],
    requirements: comp.requirements || [],
    proposalFields: comp.proposal_fields || [],
  };
};

const competitionService = {
  /**
   * Get all competitions with pagination, filtering, and search.
   */
  async getAllCompetitions({ page = 1, limit = 10, status, search, kategori }) {
    const offset = (page - 1) * limit;

    // Auto-update expired competitions (status active but deadline passed)
    try {
      await supabase
        .from('data_lomba')
        .update({ status: 'inactive' })
        .eq('status', 'active')
        .lt('deadline', new Date().toISOString());
    } catch (e) {
      logger.warn('Auto-expire update failed (non-critical):', e);
    }

    // Build base query for count
    let countQuery = supabase
      .from('data_lomba')
      .select('*', { count: 'exact', head: true });

    // Build data query
    let dataQuery = supabase
      .from('data_lomba')
      .select(`
        *,
        gambar_poster ( id_gambar_poster, image_path, uploaded ),
        data_pendaftaran_lomba(count)
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
      return mapCompetitionToFrontend(comp, cat);
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
        gambar_poster ( id_gambar_poster, image_path, uploaded ),
        data_pendaftaran_lomba(count)
      `)
      .eq('id_lomba', competitionId)
      .single();

    if (error || !competition) {
      throw new AppError('Competition not found.', 404);
    }

    // Manually map category
    let cat = null;
    if (competition.id_kategori) {
      const { data } = await supabase
        .from('kategori_lomba')
        .select('id_kategori, nama_kategori, deskripsi')
        .eq('id_kategori', competition.id_kategori)
        .single();
      cat = data;
    }

    return mapCompetitionToFrontend(competition, cat);
  },

  /**
   * Create a new competition.
   */
  async createCompetition(data) {
    const { data: competition, error } = await supabase
      .from('data_lomba')
      .insert({
        nama_lomba: data.title || data.nama_lomba,
        id_kategori: data.id_kategori || null,
        deskripsi: data.description || data.deskripsi || null,
        hadiah: data.hadiah || (Array.isArray(data.prizes) ? data.prizes.join(', ') : data.prizes) || null,
        penyelenggara: data.organizer || data.penyelenggara || null,
        biaya: data.biaya || 0,
        tgl_mulai: data.tgl_mulai || null,
        tgl_selesai: data.tgl_selesai || null,
        deadline: data.deadline || null,
        level: data.level || 'University',
        location: data.location || 'Online',
        whatsapp_group: data.whatsappGroup || data.whatsapp_group || null,
        featured: data.featured || false,
        recommended: data.recommended || false,
        requirements: Array.isArray(data.requirements) ? data.requirements : [],
        timeline: Array.isArray(data.timeline) ? data.timeline : [],
        proposal_fields: Array.isArray(data.proposalFields || data.proposal_fields) ? (data.proposalFields || data.proposal_fields) : [],
        status: data.status || 'active',
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

    // Build a clean update object using ONLY valid DB columns (whitelist approach)
    const updateData = {};

    // Basic fields
    if (data.nama_lomba !== undefined) updateData.nama_lomba = data.nama_lomba;
    if (data.title !== undefined) updateData.nama_lomba = data.title;
    if (data.deskripsi !== undefined) updateData.deskripsi = data.deskripsi;
    if (data.description !== undefined) updateData.deskripsi = data.description;

    // Organizer / penyelenggara
    if (data.penyelenggara !== undefined) updateData.penyelenggara = data.penyelenggara;
    if (data.organizer !== undefined) updateData.penyelenggara = data.organizer;

    // Prize
    if (data.hadiah !== undefined) updateData.hadiah = data.hadiah;
    if (data.prizes !== undefined) {
      updateData.hadiah = Array.isArray(data.prizes) ? data.prizes.join(', ') : data.prizes;
    }

    // Numeric / booleans
    if (data.biaya !== undefined) updateData.biaya = data.biaya;
    if (data.featured !== undefined) updateData.featured = data.featured;
    if (data.recommended !== undefined) updateData.recommended = data.recommended;

    // Category
    if (data.id_kategori !== undefined) updateData.id_kategori = data.id_kategori;

    // Dates
    if (data.deadline !== undefined) updateData.deadline = data.deadline;
    if (data.tgl_mulai !== undefined) updateData.tgl_mulai = data.tgl_mulai;
    if (data.tgl_selesai !== undefined) updateData.tgl_selesai = data.tgl_selesai;

    // Text fields
    if (data.level !== undefined) updateData.level = data.level;
    if (data.location !== undefined) updateData.location = data.location;
    if (data.status !== undefined) updateData.status = data.status;

    // WhatsApp — accept both camelCase and snake_case
    if (data.whatsapp_group !== undefined) updateData.whatsapp_group = data.whatsapp_group;
    if (data.whatsappGroup !== undefined) updateData.whatsapp_group = data.whatsappGroup;

    // JSONB arrays
    if (data.requirements !== undefined) updateData.requirements = Array.isArray(data.requirements) ? data.requirements : [];
    if (data.timeline !== undefined) updateData.timeline = Array.isArray(data.timeline) ? data.timeline : [];
    if (data.proposal_fields !== undefined) updateData.proposal_fields = Array.isArray(data.proposal_fields) ? data.proposal_fields : [];
    if (data.proposalFields !== undefined) updateData.proposal_fields = Array.isArray(data.proposalFields) ? data.proposalFields : [];

    // Handle poster_url — create record in gambar_poster, then link via gambar_poster_id
    if (data.poster_url) {
      const { data: posterData, error: posterError } = await supabase
        .from('gambar_poster')
        .insert({
          id_lomba: competitionId,
          image_path: data.poster_url,
          uploaded: new Date().toISOString()
        })
        .select('*')
        .single();

      if (!posterError && posterData) {
        updateData.gambar_poster_id = posterData.id_gambar_poster;
      } else {
        logger.error('Update poster insert error:', JSON.stringify(posterError));
      }
    }

    logger.info('Updating competition', { competitionId, fields: Object.keys(updateData) });

    const { data: updated, error } = await supabase
      .from('data_lomba')
      .update(updateData)
      .eq('id_lomba', competitionId)
      .select('*')
      .single();

    if (error) {
      logger.error('Update competition error:', error);
      throw new AppError(`Failed to update competition: ${error.message}`, 500);
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
    const { id_lomba, id_berkas } = competitionData;

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
        id_berkas: competitionData.id_berkas || null,
        form_data: competitionData.form_data || {},
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
        ),
        data_berkas:id_berkas ( id_data_berkas, file_path, nama_berkas )
      `)
      .eq('id_user', userId)
      .order('tgl_daftar', { ascending: false });

    if (error) {
      logger.error('Get user registrations error:', error);
      throw new AppError('Failed to fetch registrations.', 500);
    }

    const mappedRegistrations = registrations.map(reg => {
      const comp = reg.data_lomba;
      return {
        id: reg.id_pendaftaran, // using id for UserCompetition id mapping
        status: reg.status_pendaftaran, // You may want to map to UserCompetitionStatus here
        stage: reg.stage || 'University',
        submittedDate: reg.tgl_daftar,
        // include original registration data and nested mapped competition
        registrationData: reg,
        competition: comp ? mapCompetitionToFrontend(comp, comp.kategori_lomba) : null
      };
    });

    return mappedRegistrations;
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
   * Get all registrations across all competitions (for admin dashboard).
   */
  async getAllRegistrations() {
    const { data: registrations, error } = await supabase
      .from('data_pendaftaran_lomba')
      .select(`
        *,
        user_pengguna ( id_user, name, email, no_telepon ),
        data_lomba ( id_lomba, nama_lomba, kategori_lomba ( id_kategori, nama_kategori ) ),
        data_berkas:id_berkas ( id_data_berkas, file_path, nama_berkas )
      `)
      .order('tgl_daftar', { ascending: false });

    if (error) {
      logger.error('Get all registrations error:', error);
      throw new AppError('Failed to fetch all registrations.', 500);
    }

    return registrations.map(reg => ({
      id: reg.id_pendaftaran,
      nomor_pendaftaran: reg.nomor_pendaftaran || null,
      id_lomba: reg.id_lomba,
      id_user: reg.id_user,
      team: reg.user_pengguna?.name || 'Unknown',
      email: reg.user_pengguna?.email || '',
      no_telepon: reg.user_pengguna?.no_telepon || '',
      competition: reg.data_lomba?.nama_lomba || 'Unknown',
      competition_id: reg.data_lomba?.id_lomba || null,
      competition_category: reg.data_lomba?.kategori_lomba?.nama_kategori || 'Uncategorized',
      submittedDate: reg.tgl_daftar,
      status: reg.status_pendaftaran,
      stage: reg.stage || 'University',
      proposal: reg.id_berkas ? 'Proposal Submitted' : 'No Proposal',
      registrationData: reg
    }));
  },

  /**
   * Admin: Create a registration manually.
   */
  async createRegistrationAdmin(data) {
    const { id_lomba, id_user, stage, status_pendaftaran, nomor_pendaftaran } = data;

    const noPendaftaran = nomor_pendaftaran || `REG-${Date.now()}`;

    const { data: registration, error } = await supabase
      .from('data_pendaftaran_lomba')
      .insert({
        id_lomba,
        id_user,
        stage: stage || 'University',
        status_pendaftaran: status_pendaftaran || 'pending',
        nomor_pendaftaran: noPendaftaran,
        tgl_daftar: new Date().toISOString(),
      })
      .select('*')
      .single();

    if (error) {
      logger.error('Create registration admin error:', error);
      throw new AppError('Failed to create registration.', 500);
    }

    return registration;
  },

  /**
   * Update the status of a registration.
   */
  async updateRegistrantStatus(registrationId, status) {
    const validStatuses = [
      'pending', 'under_review', 'accepted', 'rejected'
    ];
    if (!validStatuses.includes(status)) {
      throw new AppError(`Invalid status: '${status}'.`, 400);
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
   * Update the stage of a registration.
   */
  async updateRegistrantStage(registrationId, stage) {
    const validStages = ['University', 'National', 'International'];
    if (!validStages.includes(stage)) {
      throw new AppError(`Invalid stage: '${stage}'.`, 400);
    }

    const { data: registration, error } = await supabase
      .from('data_pendaftaran_lomba')
      .update({ stage })
      .eq('id_pendaftaran', registrationId)
      .select('*')
      .single();

    if (error || !registration) {
      logger.error('Update registrant stage error:', error);
      throw new AppError('Failed to update stage.', 500);
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

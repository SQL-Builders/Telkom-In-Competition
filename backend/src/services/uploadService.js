import supabase from '../config/supabase.js';
import logger from '../utils/logger.js';
import { AppError } from '../middleware/errorMiddleware.js';
import crypto from 'crypto';

const uploadService = {
  /**
   * Upload a file to Supabase Storage and create a record in data_berkas.
   * @param {Object} file - The file object from multer
   * @param {number} userId - The ID of the user uploading the file
   * @param {string} [prefix] - Optional prefix for the filename (e.g. CompetitionName_ParticipantName)
   * @returns {Object} The created data_berkas record
   */
  async uploadFile(file, userId, prefix = '') {
    try {
      // 1. Generate unique file name
      const fileExt = file.originalname.split('.').pop();
      const uniqueSuffix = crypto.randomBytes(4).toString('hex');
      
      // Clean up prefix (remove spaces and special chars, replace with dash)
      const cleanPrefix = prefix ? prefix.replace(/[^a-zA-Z0-9]/g, '-') + '-' : '';
      const fileName = `${cleanPrefix}${userId}-${Date.now()}-${uniqueSuffix}.${fileExt}`;

      // 2. Upload to Supabase Storage (Bucket: 'competition-files')
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('competition-files')
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          upsert: false,
        });

      if (uploadError) {
        logger.error('Supabase Storage Upload Error:', uploadError);
        throw new AppError('Failed to upload file to storage.', 500);
      }

      // 3. Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('competition-files')
        .getPublicUrl(fileName);

      const publicUrl = publicUrlData.publicUrl;

      // 4. Create record in data_berkas (only columns that exist in clean schema)
      const { data: berkasRecord, error: dbError } = await supabase
        .from('data_berkas')
        .insert({
          id_user: userId,
          nama_berkas: file.originalname,
          file_path: publicUrl,
          tipe_berkas: file.mimetype,
          ukuran_berkas: file.size,
        })
        .select('*')
        .single();

      if (dbError) {
        logger.error('Database insert data_berkas error:', dbError);
        // Include the actual DB error message for easier debugging
        throw new AppError(`Failed to save file record: ${dbError.message}`, 500);
      }

      return berkasRecord;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Upload Service Error:', error);
      throw new AppError('An unexpected error occurred during upload.', 500);
    }
  },
};

export default uploadService;

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { logger } from '../utils/logger';

export const StorageService = {
  async uploadCompanyAsset(
    companyId: string, // UUID
    file: File,
    folder: 'logos' | 'products' | 'documents' | 'quotations' = 'documents'
  ): Promise<string> {
    logger.info('Uploading company asset', { companyId, folder, fileName: file.name });
    if (!isSupabaseConfigured()) {
      return URL.createObjectURL(file);
    }

    const filePath = `company-assets/${companyId}/${folder}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;

    const { data, error } = await supabase.storage
      .from('company-assets')
      .upload(filePath, file, { upsert: true });

    if (error) {
      logger.error('Storage upload failed', { error });
      throw error;
    }

    const { data: urlData } = supabase.storage.from('company-assets').getPublicUrl(data.path);
    return urlData.publicUrl;
  },
};

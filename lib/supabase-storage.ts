import { supabase } from './supabase-client';

/**
 * Frontend Storage Service - Handles file operations with Supabase Storage
 * Use this for direct file uploads/downloads from frontend
 * (though it's recommended to use the backend API endpoints for most operations)
 */
export class FrontendStorageService {
  /**
   * Upload file to Supabase Storage
   * @param bucket - Storage bucket name
   * @param path - File path inside bucket
   * @param file - File to upload
   */
  async uploadFile(bucket: string, path: string, file: File) {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file, { upsert: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  }

  /**
   * Get public URL for a file
   */
  getPublicUrl(bucket: string, path: string) {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data?.publicUrl;
  }

  /**
   * Download file
   */
  async downloadFile(bucket: string, path: string) {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .download(path);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Download error:', error);
      throw error;
    }
  }

  /**
   * Delete file
   */
  async deleteFile(bucket: string, path: string) {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .remove([path]);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Delete error:', error);
      throw error;
    }
  }

  /**
   * List files in a bucket
   */
  async listFiles(bucket: string, path: string = '') {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .list(path);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('List files error:', error);
      throw error;
    }
  }

  /**
   * Get signed URL for private file access
   */
  async getSignedUrl(bucket: string, path: string, expiresIn: number = 3600) {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(path, expiresIn);

      if (error) throw error;
      return data?.signedUrl;
    } catch (error) {
      console.error('Signed URL error:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const frontendStorage = new FrontendStorageService();
export default frontendStorage;

import { supabase, Media } from './supabase'

export const mediaService = {
  // Upload image to Supabase Storage
  async uploadImage(file: File, projectId: string, options?: {
    altText?: string
    title?: string
    description?: string
  }): Promise<Media> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No user logged in')

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}/${projectId}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    
    // Upload to storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('project-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })
    
    if (uploadError) throw uploadError
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('project-images')
      .getPublicUrl(fileName)
    
    // Save media record to database
    const { data: mediaRecord, error: dbError } = await supabase
      .from('media')
      .insert({
        filename: fileName,
        original_filename: file.name,
        file_path: publicUrl,
        file_size: file.size,
        mime_type: file.type,
        alt_text: options?.altText || '',
        project_id: projectId,
        user_id: user.id
      })
      .select()
      .single()
    
    if (dbError) throw dbError
    return mediaRecord
  },

  // Get media by project ID
  async getByProjectId(projectId: string): Promise<Media[]> {
    const { data, error } = await supabase
      .from('media')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  // Get media by user ID
  async getByUserId(userId: string): Promise<Media[]> {
    const { data, error } = await supabase
      .from('media')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  // Delete media
  async delete(id: string): Promise<void> {
    // Get media record first
    const { data: media, error: fetchError } = await supabase
      .from('media')
      .select('*')
      .eq('id', id)
      .single()
    
    if (fetchError) throw fetchError
    
    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('project-images')
      .remove([media.filename])
    
    if (storageError) throw storageError
    
    // Delete from database
    const { error: dbError } = await supabase
      .from('media')
      .delete()
      .eq('id', id)
    
    if (dbError) throw dbError
  },

  // Update media metadata
  async updateMetadata(id: string, updates: {
    alt_text?: string
    title?: string
    description?: string
  }): Promise<Media> {
    const { data, error } = await supabase
      .from('media')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}

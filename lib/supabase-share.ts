import { supabase, ShareLink } from './supabase'

export const shareService = {
  // Create share link
  async createShareLink(projectId: string, options: {
    name: string
    password?: string
    expiresAt?: Date
  }): Promise<ShareLink> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No user logged in')

    // Generate unique slug
    const { data: slugData, error: slugError } = await supabase
      .rpc('generate_unique_slug', { base_text: options.name })
    
    if (slugError) throw slugError
    
    const slug = slugData as string

    // Hash password if provided (simplified for now)
    let passwordHash: string | undefined
    if (options.password) {
      passwordHash = options.password // In production, use proper hashing
    }

    const { data, error } = await supabase
      .from('share_links')
      .insert({
        project_id: projectId,
        slug,
        name: options.name,
        password_hash: passwordHash,
        expires_at: options.expiresAt?.toISOString(),
        created_by: user.id
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Get share links for project
  async getByProjectId(projectId: string): Promise<ShareLink[]> {
    const { data, error } = await supabase
      .from('share_links')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  // Get share link by slug
  async getBySlug(slug: string): Promise<ShareLink | null> {
    const { data, error } = await supabase
      .from('share_links')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single()
    
    if (error) return null
    
    // Check if expired
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      return null
    }
    
    return data
  },

  // Verify share link password
  async verifyPassword(slug: string, password: string): Promise<boolean> {
    const shareLink = await this.getBySlug(slug)
    if (!shareLink || !shareLink.password_hash) return true
    
    return password === shareLink.password_hash // In production, use proper comparison
  },

  // Increment view count
  async incrementViewCount(slug: string): Promise<void> {
    const shareLink = await this.getBySlug(slug)
    if (!shareLink) return
    
    const { error } = await supabase
      .from('share_links')
      .update({ view_count: shareLink.view_count + 1 })
      .eq('slug', slug)
    
    if (error) throw error
  },

  // Update share link
  async update(id: string, updates: Partial<ShareLink>): Promise<ShareLink> {
    const { data, error } = await supabase
      .from('share_links')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Delete share link
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('share_links')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // Get project by share link slug (for public viewing)
  async getProjectBySlug(slug: string): Promise<{ project: any, shareLink: ShareLink } | null> {
    const shareLink = await this.getBySlug(slug)
    if (!shareLink) return null

    const { data: project, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', shareLink.project_id)
      .single()
    
    if (error) return null
    
    return { project, shareLink }
  }
}

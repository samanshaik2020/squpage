import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Regular client for authenticated and anonymous users
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client with service role to bypass RLS
// This should only be used server-side
export const supabaseAdmin = (() => {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) {
    // Return a dummy client that will throw errors if used on client-side
    return null as any
  }
  return createClient(supabaseUrl, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
})()

// Database types
export interface Profile {
  id: string
  username?: string
  full_name?: string
  avatar_url?: string
  bio?: string
  website?: string
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  name: string
  type: 'Elementor' | 'Template' | 'AI Generated' | 'Landing Page'
  status: 'draft' | 'published' | 'archived'
  thumbnail: string
  settings: any
  seo_settings: any
  analytics: any
  custom_domain?: string
  is_public: boolean
  view_count: number
  created_at: string
  updated_at: string
  published_at?: string
  user_id: string
}

export interface Element {
  id: string
  project_id: string
  type: string
  parent_id?: string
  content?: string
  styles: any
  settings: any
  form_fields: any[]
  pricing_features: any[]
  testimonials: any[]
  slides: any[]
  position: number
  created_at: string
  updated_at: string
}

export interface Media {
  id: string
  filename: string
  original_filename: string
  file_path: string
  file_size?: number
  mime_type?: string
  width?: number
  height?: number
  alt_text?: string
  project_id: string
  user_id: string
  created_at: string
}

export interface ShareLink {
  id: string
  project_id: string
  slug: string
  name: string
  password_hash?: string
  expires_at?: string
  is_active: boolean
  view_count: number
  created_at: string
  created_by: string
}

export interface FormSubmission {
  id: string
  project_id: string
  form_data: any
  ip_address?: string
  user_agent?: string
  source: string
  created_at: string
}

export interface AnalyticsEvent {
  id: string
  project_id: string
  share_link_id?: string
  event_type: 'view' | 'click' | 'form_submit' | 'download'
  event_data: any
  ip_address?: string
  user_agent?: string
  referrer?: string
  created_at: string
}

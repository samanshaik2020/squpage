-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table with enhanced features
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Elementor', 'Template', 'AI Generated', 'Landing Page')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  thumbnail TEXT DEFAULT '',
  settings JSONB DEFAULT '{}',
  seo_settings JSONB DEFAULT '{}',
  analytics JSONB DEFAULT '{}',
  custom_domain TEXT,
  is_public BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  share_token TEXT,
  share_name TEXT,
  share_slug TEXT,
  is_publicly_shared BOOLEAN DEFAULT false,
  share_expiry_date TIMESTAMP WITH TIME ZONE,
  template_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE
);

-- Elements table with all your element types
CREATE TABLE IF NOT EXISTS public.elements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN (
    'section', 'row', 'column', 'text', 'heading', 'image', 'button', 'video', 'spacer',
    'form', 'pricing-table', 'testimonial-carousel', 'lead-magnet-form', 'newsletter-signup',
    'multi-step-form', 'slides', 'countdown', 'call-to-action', 'share-buttons',
    'blockquote', 'popup-form'
  )),
  parent_id UUID REFERENCES public.elements(id) ON DELETE CASCADE,
  content TEXT,
  styles JSONB DEFAULT '{}',
  settings JSONB DEFAULT '{}',
  form_fields JSONB DEFAULT '[]',
  pricing_features JSONB DEFAULT '[]',
  testimonials JSONB DEFAULT '[]',
  slides JSONB DEFAULT '[]',
  position INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Media storage tracking
CREATE TABLE IF NOT EXISTS public.media (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  width INTEGER,
  height INTEGER,
  alt_text TEXT,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Share links for public pages
CREATE TABLE IF NOT EXISTS public.share_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password_hash TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE
);

-- Analytics tracking
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  share_link_id UUID REFERENCES public.share_links(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('view', 'click', 'form_submit', 'download')),
  event_data JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Form submissions
CREATE TABLE IF NOT EXISTS public.form_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  form_data JSONB NOT NULL,
  ip_address INET,
  user_agent TEXT,
  source TEXT DEFAULT 'Contact Form',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Templates library
CREATE TABLE IF NOT EXISTS public.templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  thumbnail TEXT,
  elements JSONB NOT NULL,
  settings JSONB DEFAULT '{}',
  is_public BOOLEAN DEFAULT false,
  usage_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_is_public ON public.projects(is_public);
CREATE INDEX IF NOT EXISTS idx_elements_project_id ON public.elements(project_id);
CREATE INDEX IF NOT EXISTS idx_elements_parent_id ON public.elements(parent_id);
CREATE INDEX IF NOT EXISTS idx_media_user_id ON public.media(user_id);
CREATE INDEX IF NOT EXISTS idx_share_links_slug ON public.share_links(slug);
CREATE INDEX IF NOT EXISTS idx_analytics_project_id ON public.analytics_events(project_id);
CREATE INDEX IF NOT EXISTS idx_form_submissions_project_id ON public.form_submissions(project_id);

-- Updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_elements_updated_at BEFORE UPDATE ON public.elements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.elements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.share_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Projects
CREATE POLICY "Users can view own projects" ON public.projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create projects" ON public.projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own projects" ON public.projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own projects" ON public.projects FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Public projects are viewable" ON public.projects FOR SELECT USING (is_public = true);

-- Elements
CREATE POLICY "Elements are visible for user's projects" ON public.elements FOR SELECT USING (
  project_id IN (SELECT id FROM public.projects WHERE user_id = auth.uid())
);
CREATE POLICY "Users can manage elements in own projects" ON public.elements FOR ALL USING (
  project_id IN (SELECT id FROM public.projects WHERE user_id = auth.uid())
);

-- Media
CREATE POLICY "Users can view own media" ON public.media FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can upload media" ON public.media FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own media" ON public.media FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own media" ON public.media FOR DELETE USING (auth.uid() = user_id);

-- Share links
CREATE POLICY "Users can manage share links for own projects" ON public.share_links FOR ALL USING (
  project_id IN (SELECT id FROM public.projects WHERE user_id = auth.uid())
);

-- Analytics (insert only for security)
CREATE POLICY "Anyone can insert analytics" ON public.analytics_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view analytics for own projects" ON public.analytics_events FOR SELECT USING (
  project_id IN (SELECT id FROM public.projects WHERE user_id = auth.uid())
);

-- Form submissions
CREATE POLICY "Anyone can submit forms" ON public.form_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view submissions for own projects" ON public.form_submissions FOR SELECT USING (
  project_id IN (SELECT id FROM public.projects WHERE user_id = auth.uid())
);

-- Templates
CREATE POLICY "Public templates are viewable" ON public.templates FOR SELECT USING (is_public = true);
CREATE POLICY "Users can manage own templates" ON public.templates FOR ALL USING (auth.uid() = created_by);

-- Functions
CREATE OR REPLACE FUNCTION generate_unique_slug(base_text TEXT)
RETURNS TEXT AS $$
DECLARE
  base_slug TEXT;
  unique_slug TEXT;
  counter INTEGER := 1;
BEGIN
  base_slug := lower(regexp_replace(base_text, '[^a-zA-Z0-9]+', '-', 'g'));
  base_slug := trim('-' FROM base_slug);
  IF base_slug = '' THEN base_slug := 'untitled'; END IF;
  unique_slug := base_slug;
  WHILE EXISTS (SELECT 1 FROM public.share_links WHERE slug = unique_slug) LOOP
    unique_slug := base_slug || '-' || counter;
    counter := counter + 1;
  END LOOP;
  RETURN unique_slug;
END;
$$ LANGUAGE plpgsql;
// Shared projects store for API routes with Supabase integration
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Only create supabase client if environment variables are set
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null

export interface ProjectAnalytics {
    views: number
    uniqueVisitors: number
    clicks: number
    conversions: number
    bounceRate: number
    avgSessionDuration: number
    topPages: { page: string; views: number }[]
    trafficSources: { source: string; visitors: number }[]
    dailyStats: { date: string; views: number; visitors: number }[]
}

export interface ProjectLead {
    id: string
    projectId: string
    name: string
    email: string
    message?: string
    phone?: string
    source: string
    createdAt: string
    status: 'new' | 'contacted' | 'converted' | 'closed'
}

export interface PageVisit {
    id: string
    pageId: string
    timestamp: string
    ipAddress?: string
    userAgent?: string
    referrer?: string
    sessionId?: string
}

export interface FormSubmission {
    id: string
    pageId: string
    formData: { [key: string]: any }
    timestamp: string
    ipAddress?: string
    userAgent?: string
    source?: string
}

export interface ProjectData {
    id: string
    name: string
    type: 'Elementor' | 'Template' | 'AI Generated'
    status: 'draft' | 'published'
    createdAt: string
    updatedAt: string
    thumbnail: string
    elements: any[]
    templateId?: string // For template-based projects
    analytics?: ProjectAnalytics
    shareToken?: string // Token for public sharing
    shareName?: string // Custom name for the shareable link
    shareSlug?: string // URL-friendly version of the custom name
    isPubliclyShared?: boolean // Whether the project is publicly shared
    shareExpiryDate?: string // Optional expiry date for the share token
    settings: {
        title: string
        description: string
        favicon: string
        customCSS: string
        customJS: string
        seoTitle?: string
        seoDescription?: string
        seoKeywords?: string
        socialImage?: string
    }
}

// Supabase client is already imported above

// Load projects from Supabase database
const loadProjectsFromDatabase = async (): Promise<ProjectData[]> => {
    try {
        if (!supabase) {
            console.log('Supabase not configured, returning default projects');
            return defaultProjects;
        }

        // Get current user first
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            console.log('No user logged in, returning default projects');
            return defaultProjects;
        }

        // Get projects for current user
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('user_id', user.id)
            .order('updated_at', { ascending: false });

        if (error) {
            console.error('Error loading projects from database:', error);
            return defaultProjects;
        }

        // Transform database projects to ProjectData format
        return data.map((dbProject: any) => ({
            id: dbProject.id,
            name: dbProject.name,
            type: dbProject.type,
            status: dbProject.status,
            createdAt: dbProject.created_at,
            updatedAt: dbProject.updated_at,
            thumbnail: dbProject.thumbnail || '/placeholder.svg?height=120&width=200&text=' + encodeURIComponent(dbProject.name),
            elements: [], // Elements are loaded separately
            templateId: dbProject.template_id,
            shareToken: dbProject.share_token,
            shareName: dbProject.share_name,
            shareSlug: dbProject.share_slug,
            isPubliclyShared: dbProject.is_publicly_shared,
            shareExpiryDate: dbProject.share_expiry_date,
            settings: dbProject.settings || {
                title: dbProject.name,
                description: '',
                favicon: '',
                customCSS: '',
                customJS: ''
            }
        }));
    } catch (error) {
        console.error('Error in loadProjectsFromDatabase:', error);
        return defaultProjects;
    }
};

// Save project to Supabase database
const saveProjectToDatabase = async (project: ProjectData): Promise<ProjectData | null> => {
    try {
        if (!supabase) {
            console.log('Supabase not configured, cannot save to database');
            return null;
        }

        // Get current user first
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            console.error('No user logged in, cannot save project');
            return null;
        }

        // Transform ProjectData to database format
        const dbProject = {
            id: project.id,
            name: project.name,
            type: project.type,
            status: project.status,
            thumbnail: project.thumbnail,
            settings: project.settings,
            template_id: project.templateId,
            share_token: project.shareToken,
            share_name: project.shareName,
            share_slug: project.shareSlug,
            is_publicly_shared: project.isPubliclyShared,
            share_expiry_date: project.shareExpiryDate,
            user_id: user.id,
            updated_at: new Date().toISOString()
        };

        // Update or insert project
        const { data, error } = await supabase
            .from('projects')
            .upsert(dbProject)
            .select()
            .single();

        if (error) {
            console.error('Error saving project to database:', error);
            return null;
        }

        return {
            ...project,
            updatedAt: data.updated_at
        };
    } catch (error) {
        console.error('Error in saveProjectToDatabase:', error);
        return null;
    }
};

// Delete project from Supabase database
const deleteProjectFromDatabase = async (id: string): Promise<boolean> => {
    try {
        if (!supabase) {
            console.log('Supabase not configured, cannot delete from database');
            return false;
        }

        // Delete project
        const { error } = await supabase
            .from('projects')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting project from database:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error in deleteProjectFromDatabase:', error);
        return false;
    }
};

// Default projects for initial state
const defaultProjects: ProjectData[] = [
    {
        id: '1',
        name: 'My First Website',
        type: 'Elementor',
        status: 'published',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        thumbnail: '/placeholder.svg?height=120&width=200&text=Website',
        elements: [],
        analytics: {
            views: 1247,
            uniqueVisitors: 892,
            clicks: 156,
            conversions: 23,
            bounceRate: 45.2,
            avgSessionDuration: 185,
            topPages: [
                { page: '/', views: 847 },
                { page: '/about', views: 234 },
                { page: '/contact', views: 166 }
            ],
            trafficSources: [
                { source: 'Direct', visitors: 456 },
                { source: 'Google', visitors: 312 },
                { source: 'Social Media', visitors: 124 }
            ],
            dailyStats: [
                { date: '2024-03-01', views: 45, visitors: 32 },
                { date: '2024-03-02', views: 67, visitors: 48 },
                { date: '2024-03-03', views: 89, visitors: 61 },
                { date: '2024-03-04', views: 123, visitors: 87 },
                { date: '2024-03-05', views: 156, visitors: 112 }
            ]
        },
        settings: {
            title: 'My First Website',
            description: 'A website built with Elementor',
            favicon: '',
            customCSS: '',
            customJS: ''
        }
    }
]

// Initialize projects with default values until loaded from database
let projects: ProjectData[] = defaultProjects;

export const projectsStore = {
    // Load all projects for current user
    getAll: async () => {
        try {
            if (!supabase) {
                console.log('Supabase not configured, returning in-memory projects');
                return projects;
            }

            const loadedProjects = await loadProjectsFromDatabase();
            projects = loadedProjects; // Update in-memory cache
            return loadedProjects;
        } catch (error) {
            console.error('Error loading projects, returning in-memory projects:', error);
            return projects;
        }
    },

    // Get project by ID
    getById: async (id: string) => {
        try {
            // Try to get from in-memory cache first
            const cachedProject = projects.find(p => p.id === id);
            if (cachedProject) return cachedProject;

            // If Supabase not configured, return null
            if (!supabase) {
                console.log('Supabase not configured, project not found in cache');
                return null;
            }

            // If not in cache, get from database
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error(`Error fetching project ${id}:`, error);
                return null;
            }

            // Transform to ProjectData format
            const project: ProjectData = {
                id: data.id,
                name: data.name,
                type: data.type,
                status: data.status,
                createdAt: data.created_at,
                updatedAt: data.updated_at,
                thumbnail: data.thumbnail || '/placeholder.svg?height=120&width=200&text=' + encodeURIComponent(data.name),
                elements: [], // Elements are loaded separately
                templateId: data.template_id,
                shareToken: data.share_token,
                shareName: data.share_name,
                shareSlug: data.share_slug,
                isPubliclyShared: data.is_publicly_shared,
                shareExpiryDate: data.share_expiry_date,
                settings: data.settings || {
                    title: data.name,
                    description: '',
                    favicon: '',
                    customCSS: '',
                    customJS: ''
                }
            };

            // Update cache
            const index = projects.findIndex(p => p.id === id);
            if (index >= 0) {
                projects[index] = project;
            } else {
                projects.push(project);
            }

            return project;
        } catch (error) {
            console.error(`Error in getById for project ${id}:`, error);
            return null;
        }
    },

    // Create new project
    create: async (project: ProjectData) => {
        try {
            // If Supabase is not configured, use in-memory storage
            if (!supabase) {
                console.log('Supabase not configured, using in-memory storage');
                projects.push(project);
                return project;
            }

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                console.log('No user logged in, using in-memory storage');
                projects.push(project);
                return project;
            }

            // Prepare project for database
            const dbProject = {
                id: project.id,
                name: project.name,
                type: project.type,
                status: project.status,
                thumbnail: project.thumbnail,
                settings: project.settings,
                template_id: project.templateId || null,
                user_id: user.id,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            console.log('Creating project with templateId:', project.templateId);

            // Insert into database
            const { data, error } = await supabase
                .from('projects')
                .insert(dbProject)
                .select()
                .single();

            if (error) {
                console.error('Error creating project in database:', error);
                // Fallback to in-memory storage
                projects.push(project);
                return project;
            }

            if (!data) {
                console.error('No data returned from database insert');
                // Fallback to in-memory storage
                projects.push(project);
                return project;
            }

            // Update the project with database values
            const createdProject: ProjectData = {
                ...project,
                id: data.id,
                createdAt: data.created_at,
                updatedAt: data.updated_at
            };

            // Update in-memory cache
            projects.push(createdProject);

            return createdProject;
        } catch (error) {
            console.error('Error creating project:', error);
            // Fallback to in-memory storage
            projects.push(project);
            return project;
        }
    },

    // Update project
    update: async (id: string, updates: Partial<ProjectData>) => {
        try {
            // Get current project
            const currentProject = projects.find(p => p.id === id);
            if (!currentProject) {
                console.error(`Project ${id} not found for update`);
                return null;
            }

            // If Supabase not configured, update in-memory only
            if (!supabase) {
                console.log('Supabase not configured, updating in-memory only');
                const updatedProject = {
                    ...currentProject,
                    ...updates,
                    updatedAt: new Date().toISOString()
                };

                const index = projects.findIndex(p => p.id === id);
                if (index >= 0) {
                    projects[index] = updatedProject;
                }

                return updatedProject;
            }

            // Prepare updates for database
            const dbUpdates: any = {};
            if (updates.name) dbUpdates.name = updates.name;
            if (updates.status) dbUpdates.status = updates.status;
            if (updates.thumbnail) dbUpdates.thumbnail = updates.thumbnail;
            if (updates.settings) dbUpdates.settings = { ...currentProject.settings, ...updates.settings };
            if (updates.templateId) dbUpdates.template_id = updates.templateId;
            if (updates.shareToken !== undefined) dbUpdates.share_token = updates.shareToken;
            if (updates.shareName !== undefined) dbUpdates.share_name = updates.shareName;
            if (updates.shareSlug !== undefined) dbUpdates.share_slug = updates.shareSlug;
            if (updates.isPubliclyShared !== undefined) dbUpdates.is_publicly_shared = updates.isPubliclyShared;
            if (updates.shareExpiryDate !== undefined) dbUpdates.share_expiry_date = updates.shareExpiryDate;

            // Always update timestamp
            dbUpdates.updated_at = new Date().toISOString();

            // Update in database
            const { data, error } = await supabase
                .from('projects')
                .update(dbUpdates)
                .eq('id', id)
                .select()
                .single();

            if (error) {
                console.error(`Error updating project ${id} in database:`, error);
                // Fallback to in-memory update
                const updatedProject = {
                    ...currentProject,
                    ...updates,
                    updatedAt: new Date().toISOString()
                };

                const index = projects.findIndex(p => p.id === id);
                if (index >= 0) {
                    projects[index] = updatedProject;
                }

                return updatedProject;
            }

            // Update in-memory project
            const updatedProject = {
                ...currentProject,
                ...updates,
                updatedAt: data.updated_at
            };

            // Update cache
            const index = projects.findIndex(p => p.id === id);
            if (index >= 0) {
                projects[index] = updatedProject;
            }

            return updatedProject;
        } catch (error) {
            console.error(`Error in update project ${id}:`, error);
            // Fallback to in-memory update
            const currentProject = projects.find(p => p.id === id);
            if (currentProject) {
                const updatedProject = {
                    ...currentProject,
                    ...updates,
                    updatedAt: new Date().toISOString()
                };

                const index = projects.findIndex(p => p.id === id);
                if (index >= 0) {
                    projects[index] = updatedProject;
                }

                return updatedProject;
            }
            return null;
        }
    },

    // Delete project
    delete: async (id: string) => {
        try {
            // If Supabase not configured, delete from in-memory only
            if (!supabase) {
                console.log('Supabase not configured, deleting from in-memory only');
                projects = projects.filter(p => p.id !== id);
                return true;
            }

            // Delete from database
            const success = await deleteProjectFromDatabase(id);

            if (success) {
                // Update in-memory cache
                projects = projects.filter(p => p.id !== id);
                return true;
            }

            // Even if database delete failed, remove from memory
            projects = projects.filter(p => p.id !== id);
            return true;
        } catch (error) {
            console.error(`Error in delete project ${id}:`, error);
            // Fallback: remove from memory anyway
            projects = projects.filter(p => p.id !== id);
            return true;
        }
    },

    // Get project by share token
    getByShareToken: async (token: string) => {
        try {
            console.log(`[Database] Searching for project with shareToken: "${token}"`);
            
            if (!supabase) {
                console.log('Supabase not configured, cannot get project by share token');
                throw new Error('Supabase client not configured');
            }

            // Get project by share token
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .eq('share_token', token)
                .single();

            console.log('[Database] Share token query result:', { data: data ? 'found' : 'null', error: error ? error.message : 'none' });

            if (error) {
                console.error(`Error fetching project by share token ${token}:`, error);
                // Don't throw here, let the caller handle it
                return null;
            }

            if (!data) {
                console.log(`No project found with share token ${token}`);
                return null;
            }

            // Check if share token has expired
            if (data.share_expiry_date && new Date(data.share_expiry_date) < new Date()) {
                console.log(`Share token ${token} has expired`);
                return null;
            }

            // Transform to ProjectData format
            const project: ProjectData = {
                id: data.id,
                name: data.name,
                type: data.type,
                status: data.status,
                createdAt: data.created_at,
                updatedAt: data.updated_at,
                thumbnail: data.thumbnail || '/placeholder.svg?height=120&width=200&text=' + encodeURIComponent(data.name),
                elements: [], // Elements are loaded separately
                templateId: data.template_id,
                shareToken: data.share_token,
                shareName: data.share_name,
                shareSlug: data.share_slug,
                isPubliclyShared: data.is_publicly_shared,
                shareExpiryDate: data.share_expiry_date,
                settings: data.settings || {
                    title: data.name,
                    description: '',
                    favicon: '',
                    customCSS: '',
                    customJS: ''
                }
            };

            console.log('[Database] Found project by share token:', { id: data.id, name: data.name });
            
            return project;
        } catch (error) {
            console.error(`Error in getByShareToken for token ${token}:`, error);
            return null; // Return null instead of throwing
        }
    },

    // Get project by share slug (custom name)
    getByShareSlug: async (slug: string) => {
        try {
            console.log(`[Database] Searching for project with shareSlug: "${slug}"`);
            
            if (!supabase) {
                console.log('Supabase not configured, cannot get project by share slug');
                throw new Error('Supabase client not configured');
            }

            // Get project by share slug
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .eq('share_slug', slug)
                .eq('is_publicly_shared', true)
                .single();

            console.log('[Database] Share slug query result:', { data: data ? 'found' : 'null', error: error ? error.message : 'none' });

            if (error) {
                console.error(`Error fetching project by share slug ${slug}:`, error);
                // Don't throw here, let the caller handle it
                return null;
            }

            if (!data) {
                console.log(`No project found with share slug ${slug}`);
                return null;
            }

            // Check if share token has expired
            if (data.share_expiry_date && new Date(data.share_expiry_date) < new Date()) {
                console.log(`Share slug ${slug} has expired`);
                return null;
            }

            console.log('[Database] Found project by share slug:', { id: data.id, name: data.name });

            // Transform to ProjectData format
            const project: ProjectData = {
                id: data.id,
                name: data.name,
                type: data.type,
                status: data.status,
                createdAt: data.created_at,
                updatedAt: data.updated_at,
                thumbnail: data.thumbnail || '/placeholder.svg?height=120&width=200&text=' + encodeURIComponent(data.name),
                elements: [], // Elements are loaded separately
                templateId: data.template_id,
                shareToken: data.share_token,
                shareName: data.share_name,
                shareSlug: data.share_slug,
                isPubliclyShared: data.is_publicly_shared,
                shareExpiryDate: data.share_expiry_date,
                settings: data.settings || {
                    title: data.name,
                    description: '',
                    favicon: '',
                    customCSS: '',
                    customJS: ''
                }
            };

            return project;
        } catch (error) {
            console.error(`Error in getByShareSlug for slug ${slug}:`, error);
            return null; // Return null instead of throwing
        }
    },

    // Generate URL-friendly slug from custom name
    generateSlug: (name: string): string => {
        return name
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '') // Remove special characters
            .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
            .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
    },

    // Check if share slug is unique
    isSlugUnique: async (slug: string, excludeProjectId?: string) => {
        try {
            if (!supabase) {
                console.log('Supabase not configured, cannot check slug uniqueness');
                return true; // Assume unique if can't check
            }

            let query = supabase
                .from('projects')
                .select('id')
                .eq('share_slug', slug);

            if (excludeProjectId) {
                query = query.neq('id', excludeProjectId);
            }

            const { data, error } = await query;

            if (error) {
                console.error(`Error checking slug uniqueness for ${slug}:`, error);
                return true; // Return true to break infinite loop on error
            }

            return !data || data.length === 0;
        } catch (error) {
            console.error(`Error in isSlugUnique for slug ${slug}:`, error);
            return true; // Return true to break infinite loop on error
        }
    },

    // Generate share token for a project with custom name
    generateShareToken: async (id: string, customName: string, expiryDays?: number) => {
        try {
            // Get current project
            const currentProject = await projectsStore.getById(id);
            if (!currentProject) {
                console.error(`Project ${id} not found for generating share token`);
                return null;
            }

            // Generate a random token
            const token = `${id}-${Math.random().toString(36).substring(2, 15)}-${Date.now().toString(36)}`;

            // Generate slug from custom name
            const baseSlug = projectsStore.generateSlug(customName);
            let slug = baseSlug;
            let counter = 1;

            // Ensure slug is unique with safety limit
            while (!(await projectsStore.isSlugUnique(slug, id)) && counter <= 100) {
                slug = `${baseSlug}-${counter}`;
                counter++;
            }

            // If we hit the limit, use a timestamp-based slug
            if (counter > 100) {
                slug = `${baseSlug}-${Date.now()}`;
            }

            // Calculate expiry date if provided
            let expiryDate = null;
            if (expiryDays) {
                expiryDate = new Date();
                expiryDate.setDate(expiryDate.getDate() + expiryDays);
            }

            // Update project with share token and custom name
            const updates: Partial<ProjectData> = {
                shareToken: token,
                shareName: customName,
                shareSlug: slug,
                isPubliclyShared: true,
                shareExpiryDate: expiryDate ? expiryDate.toISOString() : undefined
            };

            // Save updates
            const updatedProject = await projectsStore.update(id, updates);
            if (!updatedProject) {
                console.error(`Failed to update project ${id} with share token`);
                return null;
            }

            return {
                token,
                slug,
                customName,
                expiryDate: expiryDate ? expiryDate.toISOString() : null
            };
        } catch (error) {
            console.error(`Error generating share token for project ${id}:`, error);
            return null;
        }
    },

    // Revoke share token for a project
    revokeShareToken: async (id: string) => {
        try {
            // Update project to remove share token
            const updates: Partial<ProjectData> = {
                shareToken: undefined,
                shareName: undefined,
                shareSlug: undefined,
                isPubliclyShared: false,
                shareExpiryDate: undefined
            };

            // Save updates
            const updatedProject = await projectsStore.update(id, updates);
            if (!updatedProject) {
                console.error(`Failed to revoke share token for project ${id}`);
                return false;
            }

            return true;
        } catch (error) {
            console.error(`Error revoking share token for project ${id}:`, error);
            return false;
        }
    },

    // Load elements for a project
    getProjectElements: async (projectId: string) => {
        try {
            if (!supabase) {
                console.log('Supabase not configured, returning empty elements array');
                return [];
            }

            const { data, error } = await supabase
                .from('elements')
                .select('*')
                .eq('project_id', projectId)
                .order('position', { ascending: true });

            if (error) {
                console.error(`Error fetching elements for project ${projectId}:`, error);
                return [];
            }

            // Transform to element format
            return data.map((el: any) => ({
                id: el.id,
                type: el.type,
                parentId: el.parent_id,
                content: el.content,
                styles: el.styles || {},
                settings: el.settings || {},
                formFields: el.form_fields || [],
                pricingFeatures: el.pricing_features || [],
                testimonials: el.testimonials || [],
                slides: el.slides || []
            }));
        } catch (error) {
            console.error(`Error in getProjectElements for project ${projectId}:`, error);
            return [];
        }
    },

    // Save elements for a project
    saveProjectElements: async (projectId: string, elements: any[]) => {
        try {
            // For now, just return true since elements are handled differently
            // In a full implementation, you would save elements to the database
            console.log(`Saving ${elements.length} elements for project ${projectId}`);
            return true;
        } catch (error) {
            console.error(`Error in saveProjectElements for project ${projectId}:`, error);
            return false;
        }
    },

    // Update share settings for a project
    updateShareSettings: async (projectId: string, customName: string, expiryDays?: number) => {
        try {
            // Get current project
            const currentProject = await projectsStore.getById(projectId);
            if (!currentProject) {
                console.error(`Project ${projectId} not found for updating share settings`);
                return null;
            }

            // Ensure project has a share token
            if (!currentProject.shareToken) {
                console.error(`Project ${projectId} does not have a share token`);
                return null;
            }

            // Generate slug from custom name
            const baseSlug = projectsStore.generateSlug(customName);
            let slug = baseSlug;
            let counter = 1;

            // Ensure slug is unique with safety limit
            while (!(await projectsStore.isSlugUnique(slug, projectId)) && counter <= 100) {
                slug = `${baseSlug}-${counter}`;
                counter++;
            }

            // If we hit the limit, use a timestamp-based slug
            if (counter > 100) {
                slug = `${baseSlug}-${Date.now()}`;
            }

            // Calculate expiry date if provided
            let expiryDate = null;
            if (expiryDays) {
                expiryDate = new Date();
                expiryDate.setDate(expiryDate.getDate() + expiryDays);
            }

            // Update project with new share settings
            const updates: Partial<ProjectData> = {
                shareName: customName,
                shareSlug: slug,
                shareExpiryDate: expiryDate ? expiryDate.toISOString() : undefined
            };

            // Save updates
            const updatedProject = await projectsStore.update(projectId, updates);
            if (!updatedProject) {
                console.error(`Failed to update share settings for project ${projectId}`);
                return null;
            }

            return {
                token: currentProject.shareToken,
                slug,
                customName,
                expiryDate: expiryDate ? expiryDate.toISOString() : null
            };
        } catch (error) {
            console.error(`Error updating share settings for project ${projectId}:`, error);
            return null;
        }
    }
}

// Simulated page visits database
let pageVisits: PageVisit[] = [
    // Sample visits for project '1' over the last 5 days
    ...Array.from({ length: 45 }, (_, i) => ({
        id: `visit-${i + 1}`,
        pageId: '1',
        timestamp: new Date(Date.now() - (4 - Math.floor(i / 9)) * 24 * 60 * 60 * 1000 - (i % 9) * 2 * 60 * 60 * 1000).toISOString(),
        ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        referrer: ['https://google.com', 'https://facebook.com', 'direct', 'https://twitter.com'][Math.floor(Math.random() * 4)],
        sessionId: `session-${Math.floor(Math.random() * 1000)}`
    }))
]

// Simulated form submissions database
let formSubmissions: FormSubmission[] = [
    {
        id: 'form-1',
        pageId: '1',
        formData: {
            name: 'John Smith',
            email: 'john.smith@example.com',
            phone: '+1 (555) 123-4567',
            message: 'I am interested in your services. Please contact me.',
            company: 'Tech Corp'
        },
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        source: 'Contact Form'
    },
    {
        id: 'form-2',
        pageId: '1',
        formData: {
            name: 'Sarah Johnson',
            email: 'sarah.j@example.com',
            message: 'Looking for a quote on web development services.',
            budget: '$5,000 - $10,000'
        },
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        ipAddress: '192.168.1.101',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        source: 'Newsletter Signup'
    },
    {
        id: 'form-3',
        pageId: '1',
        formData: {
            name: 'Mike Davis',
            email: 'mike.davis@company.com',
            phone: '+1 (555) 987-6543',
            subject: 'Partnership Inquiry',
            message: 'We would like to discuss a potential partnership opportunity.'
        },
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        ipAddress: '192.168.1.102',
        userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
        source: 'Contact Form'
    }
]

// Simulated leads database
let leads: ProjectLead[] = [
    {
        id: '1',
        projectId: '1',
        name: 'John Smith',
        email: 'john.smith@example.com',
        message: 'I am interested in your services. Please contact me.',
        phone: '+1 (555) 123-4567',
        source: 'Contact Form',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'new'
    },
    {
        id: '2',
        projectId: '1',
        name: 'Sarah Johnson',
        email: 'sarah.j@example.com',
        message: 'Looking for a quote on web development services.',
        source: 'Newsletter Signup',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'contacted'
    },
    {
        id: '3',
        projectId: '1',
        name: 'Mike Davis',
        email: 'mike.davis@company.com',
        phone: '+1 (555) 987-6543',
        source: 'Contact Form',
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        status: 'new'
    }
]

export const leadsStore = {
    getAll: () => leads,
    getByProjectId: (projectId: string) => leads.filter(l => l.projectId === projectId),
    getById: (id: string) => leads.find(l => l.id === id),
    create: (lead: Omit<ProjectLead, 'id'>) => {
        const newLead: ProjectLead = {
            ...lead,
            id: Date.now().toString(),
        }
        leads.push(newLead)
        return newLead
    },
    update: (id: string, updates: Partial<ProjectLead>) => {
        const index = leads.findIndex(l => l.id === id)
        if (index === -1) return null

        leads[index] = { ...leads[index], ...updates }
        return leads[index]
    },
    delete: (id: string) => {
        const index = leads.findIndex(l => l.id === id)
        if (index === -1) return false

        leads.splice(index, 1)
        return true
    }
}

export const pageVisitsStore = {
    getAll: () => pageVisits,
    getByPageId: (pageId: string) => pageVisits.filter(v => v.pageId === pageId),
    getById: (id: string) => pageVisits.find(v => v.id === id),
    create: (visit: Omit<PageVisit, 'id'>) => {
        const newVisit: PageVisit = {
            ...visit,
            id: `visit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        }
        pageVisits.push(newVisit)
        return newVisit
    },
    getAnalytics: (pageId: string, days: number = 30) => {
        const visits = pageVisits.filter(v => v.pageId === pageId)
        const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
        const recentVisits = visits.filter(v => new Date(v.timestamp) >= cutoffDate)

        // Calculate unique visitors based on IP address
        const uniqueIPs = new Set(recentVisits.map(v => v.ipAddress).filter(Boolean))

        // Group visits by day
        const dailyStats: { [key: string]: { views: number; visitors: Set<string> } } = {}

        recentVisits.forEach(visit => {
            const date = new Date(visit.timestamp).toISOString().split('T')[0]
            if (!dailyStats[date]) {
                dailyStats[date] = { views: 0, visitors: new Set() }
            }
            dailyStats[date].views++
            if (visit.ipAddress) {
                dailyStats[date].visitors.add(visit.ipAddress)
            }
        })

        // Convert to array format
        const dailyStatsArray = Object.entries(dailyStats).map(([date, stats]) => ({
            date,
            views: stats.views,
            visitors: stats.visitors.size
        })).sort((a, b) => a.date.localeCompare(b.date))

        // Calculate traffic sources
        const sources: { [key: string]: number } = {}
        recentVisits.forEach(visit => {
            const source = visit.referrer === 'direct' ? 'Direct' :
                visit.referrer?.includes('google') ? 'Google' :
                    visit.referrer?.includes('facebook') ? 'Facebook' :
                        visit.referrer?.includes('twitter') ? 'Twitter' :
                            'Other'
            sources[source] = (sources[source] || 0) + 1
        })

        const trafficSources = Object.entries(sources).map(([source, visitors]) => ({
            source,
            visitors
        }))

        return {
            views: recentVisits.length,
            uniqueVisitors: uniqueIPs.size,
            dailyStats: dailyStatsArray,
            trafficSources
        }
    }
}

export const formSubmissionsStore = {
    getAll: () => formSubmissions,
    getByPageId: (pageId: string) => formSubmissions.filter(s => s.pageId === pageId),
    getById: (id: string) => formSubmissions.find(s => s.id === id),
    create: (submission: Omit<FormSubmission, 'id'>) => {
        const newSubmission: FormSubmission = {
            ...submission,
            id: `form-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        }
        formSubmissions.push(newSubmission)

        // Also create a lead entry for compatibility with existing leads system
        const leadData: Omit<ProjectLead, 'id'> = {
            projectId: submission.pageId,
            name: submission.formData.name || 'Unknown',
            email: submission.formData.email || '',
            message: submission.formData.message || '',
            phone: submission.formData.phone || '',
            source: submission.source || 'Form Submission',
            createdAt: submission.timestamp,
            status: 'new'
        }

        leadsStore.create(leadData)

        return newSubmission
    },
    delete: (id: string) => {
        const index = formSubmissions.findIndex(s => s.id === id)
        if (index === -1) return false

        formSubmissions.splice(index, 1)
        return true
    }
}
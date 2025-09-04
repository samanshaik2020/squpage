// Shared projects store for API routes with localStorage integration
// No database dependencies - localStorage only implementation

// Helper function to safely access localStorage (works in both client and server contexts)
const getLocalStorage = () => {
  if (typeof window !== 'undefined') {
    return window.localStorage;
  }
  return null;
};

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
];

// Load projects from localStorage
const loadProjectsFromLocalStorage = (): ProjectData[] => {
    try {
        const localStorage = getLocalStorage();
        if (!localStorage) return defaultProjects;
        
        const stored = localStorage.getItem('squpage_projects');
        if (!stored) return defaultProjects;
        
        const parsed = JSON.parse(stored);
        return Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultProjects;
    } catch (error) {
        console.error('Error loading projects from localStorage:', error);
        return defaultProjects;
    }
};

// Save projects to localStorage
const saveProjectsToLocalStorage = (projects: ProjectData[]) => {
    try {
        const localStorage = getLocalStorage();
        if (!localStorage) return;
        
        localStorage.setItem('squpage_projects', JSON.stringify(projects));
    } catch (error) {
        console.error('Error saving projects to localStorage:', error);
    }
};

// Load elements from localStorage
const loadElementsFromLocalStorage = (projectId: string): any[] => {
    try {
        const localStorage = getLocalStorage();
        if (!localStorage) return [];
        
        const stored = localStorage.getItem(`squpage_elements_${projectId}`);
        if (!stored) return [];
        
        const parsed = JSON.parse(stored);
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.error(`Error loading elements for project ${projectId} from localStorage:`, error);
        return [];
    }
};

// Save elements to localStorage
const saveElementsToLocalStorage = (projectId: string, elements: any[]) => {
    try {
        const localStorage = getLocalStorage();
        if (!localStorage) return;
        
        localStorage.setItem(`squpage_elements_${projectId}`, JSON.stringify(elements));
    } catch (error) {
        console.error(`Error saving elements for project ${projectId} to localStorage:`, error);
    }
};

// Initialize projects with localStorage data if available, otherwise use defaults
let projects: ProjectData[] = loadProjectsFromLocalStorage();

// Generate a URL-friendly slug from a string
const generateSlug = (name: string): string => {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

// Check if a slug is unique among existing projects
const isSlugUnique = (slug: string, excludeProjectId?: string): boolean => {
    return !projects.some(p => 
        p.shareSlug === slug && (!excludeProjectId || p.id !== excludeProjectId)
    );
};

export const projectsStore = {
    // Get all projects
    getAll: async (): Promise<ProjectData[]> => {
        try {
            // Refresh from localStorage in case it was updated elsewhere
            projects = loadProjectsFromLocalStorage();
            return projects;
        } catch (error) {
            console.error('Error loading projects:', error);
            return projects;
        }
    },

    // Get project by ID
    getById: async (id: string): Promise<ProjectData | null> => {
        try {
            // Refresh from localStorage in case it was updated elsewhere
            projects = loadProjectsFromLocalStorage();
            
            const project = projects.find(p => String(p.id) === String(id));
            if (!project) {
                console.log(`Project ${id} not found`);
                return null;
            }
            
            // Load elements for this project
            const elements = loadElementsFromLocalStorage(id);
            return {
                ...project,
                elements
            };
        } catch (error) {
            console.error(`Error getting project ${id}:`, error);
            return null;
        }
    },

    // Create new project
    create: async (project: ProjectData): Promise<ProjectData> => {
        try {
            // Ensure project has required fields
            const newProject: ProjectData = {
                ...project,
                id: project.id || Date.now().toString(),
                createdAt: project.createdAt || new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                elements: project.elements || [],
                settings: project.settings || {
                    title: project.name,
                    description: '',
                    favicon: '',
                    customCSS: '',
                    customJS: ''
                }
            };
            
            // Add to projects array
            projects.push(newProject);
            
            // Save to localStorage
            saveProjectsToLocalStorage(projects);
            
            // Save elements separately if any
            if (newProject.elements && newProject.elements.length > 0) {
                saveElementsToLocalStorage(newProject.id, newProject.elements);
            }
            
            return newProject;
        } catch (error) {
            console.error('Error creating project:', error);
            throw error;
        }
    },

    // Update project
    update: async (id: string, updates: Partial<ProjectData>): Promise<ProjectData | null> => {
        try {
            const index = projects.findIndex(p => String(p.id) === String(id));
            if (index === -1) {
                console.error(`Project ${id} not found for update`);
                return null;
            }
            
            // Get current project
            const currentProject = projects[index];
            
            // Create updated project
            const updatedProject: ProjectData = {
                ...currentProject,
                ...updates,
                updatedAt: new Date().toISOString()
            };
            
            // Update in array
            projects[index] = updatedProject;
            
            // Save to localStorage
            saveProjectsToLocalStorage(projects);
            
            // If elements were updated, save them separately
            if (updates.elements) {
                saveElementsToLocalStorage(id, updatedProject.elements);
            }
            
            return updatedProject;
        } catch (error) {
            console.error(`Error updating project ${id}:`, error);
            return null;
        }
    },

    // Delete project
    delete: async (id: string): Promise<boolean> => {
        try {
            const initialLength = projects.length;
            projects = projects.filter(p => String(p.id) !== String(id));
            
            if (projects.length === initialLength) {
                console.error(`Project ${id} not found for deletion`);
                return false;
            }
            
            // Save updated projects to localStorage
            saveProjectsToLocalStorage(projects);
            
            // Remove elements for this project
            const localStorage = getLocalStorage();
            if (localStorage) {
                localStorage.removeItem(`squpage_elements_${id}`);
            }
            
            return true;
        } catch (error) {
            console.error(`Error deleting project ${id}:`, error);
            return false;
        }
    },

    // Get project by share token
    getByShareToken: async (token: string): Promise<ProjectData | null> => {
        try {
            // Refresh from localStorage in case it was updated elsewhere
            projects = loadProjectsFromLocalStorage();
            
            const project = projects.find(p => p.shareToken === token && p.isPubliclyShared);
            if (!project) {
                console.log(`No project found with share token ${token}`);
                return null;
            }
            
            // Check if share token has expired
            if (project.shareExpiryDate && new Date(project.shareExpiryDate) < new Date()) {
                console.log(`Share token ${token} has expired`);
                return null;
            }
            
            // Load elements for this project
            const elements = loadElementsFromLocalStorage(project.id);
            return {
                ...project,
                elements
            };
        } catch (error) {
            console.error(`Error getting project by share token ${token}:`, error);
            return null;
        }
    },

    // Get project by share slug
    getByShareSlug: async (slug: string): Promise<ProjectData | null> => {
        try {
            // Refresh from localStorage in case it was updated elsewhere
            projects = loadProjectsFromLocalStorage();
            
            const project = projects.find(p => p.shareSlug === slug && p.isPubliclyShared);
            if (!project) {
                console.log(`No project found with share slug ${slug}`);
                return null;
            }
            
            // Check if share has expired
            if (project.shareExpiryDate && new Date(project.shareExpiryDate) < new Date()) {
                console.log(`Share slug ${slug} has expired`);
                return null;
            }
            
            // Load elements for this project
            const elements = loadElementsFromLocalStorage(project.id);
            return {
                ...project,
                elements
            };
        } catch (error) {
            console.error(`Error getting project by share slug ${slug}:`, error);
            return null;
        }
    },

    // Generate share token for a project with custom name
    generateShareToken: async (id: string, customName: string, expiryDays?: number): Promise<{ token: string; slug: string; customName: string; expiryDate: string | null } | null> => {
        try {
            // Verify project exists
            const project = projects.find(p => String(p.id) === String(id));
            if (!project) {
                console.error(`Project ${id} not found when generating share token`);
                return null;
            }
            
            // Generate a random token
            const token = `${id}-${Math.random().toString(36).substring(2, 15)}-${Date.now().toString(36)}`;
            
            // Generate slug from custom name
            const baseSlug = generateSlug(customName);
            let slug = baseSlug;
            let counter = 1;
            
            // Ensure slug is unique
            while (!isSlugUnique(slug, id) && counter <= 100) {
                slug = `${baseSlug}-${counter}`;
                counter++;
            }
            
            // If we hit the limit, use a timestamp-based slug
            if (counter > 100) {
                slug = `${baseSlug}-${Date.now()}`;
            }
            
            // Calculate expiry date if provided
            let expiryDate: string | null = null;
            if (expiryDays) {
                const date = new Date();
                date.setDate(date.getDate() + expiryDays);
                expiryDate = date.toISOString();
            }
            
            // Update project with share token and custom name
            const updates: Partial<ProjectData> = {
                shareToken: token,
                shareName: customName,
                shareSlug: slug,
                isPubliclyShared: true,
                shareExpiryDate: expiryDate || undefined
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
                expiryDate
            };
        } catch (error) {
            console.error(`Error generating share token for project ${id}:`, error);
            return null;
        }
    },

    // Revoke share token for a project
    revokeShareToken: async (id: string): Promise<boolean> => {
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

    // Get elements for a project
    getProjectElements: async (projectId: string): Promise<any[]> => {
        try {
            return loadElementsFromLocalStorage(projectId);
        } catch (error) {
            console.error(`Error getting elements for project ${projectId}:`, error);
            return [];
        }
    },

    // Save elements for a project
    saveProjectElements: async (projectId: string, elements: any[]): Promise<boolean> => {
        try {
            saveElementsToLocalStorage(projectId, elements);
            
            // Update the project's updatedAt timestamp
            const project = projects.find(p => String(p.id) === String(projectId));
            if (project) {
                project.updatedAt = new Date().toISOString();
                saveProjectsToLocalStorage(projects);
            }
            
            return true;
        } catch (error) {
            console.error(`Error saving elements for project ${projectId}:`, error);
            return false;
        }
    },

    // Update share settings for a project
    updateShareSettings: async (id: string, settings: { 
        customName?: string; 
        isPubliclyShared?: boolean; 
        expiryDays?: number 
    }): Promise<{ token: string; slug: string; customName: string; expiryDate: string | null } | null> => {
        try {
            // Verify project exists
            const project = projects.find(p => String(p.id) === String(id));
            if (!project) {
                console.error(`Project ${id} not found when updating share settings`);
                return null;
            }
            
            // If project doesn't have a share token yet, generate one
            if (!project.shareToken && settings.isPubliclyShared) {
                return projectsStore.generateShareToken(
                    id, 
                    settings.customName || project.name, 
                    settings.expiryDays
                );
            }
            
            // Otherwise update existing share settings
            const updates: Partial<ProjectData> = {};
            
            if (settings.customName) {
                updates.shareName = settings.customName;
                
                // Generate new slug from custom name
                const baseSlug = generateSlug(settings.customName);
                let slug = baseSlug;
                let counter = 1;
                
                // Ensure slug is unique
                while (!isSlugUnique(slug, id) && counter <= 100) {
                    slug = `${baseSlug}-${counter}`;
                    counter++;
                }
                
                // If we hit the limit, use a timestamp-based slug
                if (counter > 100) {
                    slug = `${baseSlug}-${Date.now()}`;
                }
                
                updates.shareSlug = slug;
            }
            
            if (settings.isPubliclyShared !== undefined) {
                updates.isPubliclyShared = settings.isPubliclyShared;
            }
            
            if (settings.expiryDays !== undefined) {
                if (settings.expiryDays > 0) {
                    const date = new Date();
                    date.setDate(date.getDate() + settings.expiryDays);
                    updates.shareExpiryDate = date.toISOString();
                } else {
                    updates.shareExpiryDate = undefined;
                }
            }
            
            // Save updates
            const updatedProject = await projectsStore.update(id, updates);
            if (!updatedProject) {
                console.error(`Failed to update share settings for project ${id}`);
                return null;
            }
            
            return {
                token: updatedProject.shareToken || '',
                slug: updatedProject.shareSlug || '',
                customName: updatedProject.shareName || '',
                expiryDate: updatedProject.shareExpiryDate || null
            };
        } catch (error) {
            console.error(`Error updating share settings for project ${id}:`, error);
            return null;
        }
    }
};

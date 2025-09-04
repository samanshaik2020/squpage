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

// Project store using localStorage only

// Load projects from localStorage
const loadProjectsFromLocalStorage = (): ProjectData[] => {
    try {
        if (typeof window === 'undefined') return [];
        const stored = localStorage.getItem('squpage_projects');
        if (!stored) return [];
        const parsed = JSON.parse(stored);
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.error('Error loading projects from localStorage:', error);
        return [];
    }
};

// Save projects to localStorage
const saveProjectsToLocalStorage = (projects: ProjectData[]) => {
    try {
        if (typeof window === 'undefined') return;
        localStorage.setItem('squpage_projects', JSON.stringify(projects));
    } catch (error) {
        console.error('Error saving projects to localStorage:', error);
    }
};

// Load projects from localStorage or return defaults
const loadProjectsFromDatabase = async (): Promise<ProjectData[]> => {
    try {
        // Load from localStorage
        const localProjects = loadProjectsFromLocalStorage();
        return localProjects.length > 0 ? localProjects : defaultProjects;
    } catch (error) {
        console.error('Error in loadProjectsFromDatabase:', error);
        return defaultProjects;
    }
};

// Save project (localStorage only implementation)
const saveProjectToDatabase = async (project: ProjectData): Promise<ProjectData | null> => {
    try {
        // Update in-memory cache and localStorage
        const index = projects.findIndex(p => p.id === project.id);
        if (index >= 0) {
            projects[index] = {
                ...project,
                updatedAt: new Date().toISOString()
            };
        } else {
            projects.push({
                ...project,
                updatedAt: new Date().toISOString()
            });
        }
        
        // Save to localStorage
        saveProjectsToLocalStorage(projects);
        
        return {
            ...project,
            updatedAt: new Date().toISOString()
        };
    } catch (error) {
        console.error('Error in saveProjectToDatabase:', error);
        return null;
    }
};

// Delete project (localStorage only implementation)
const deleteProjectFromDatabase = async (id: string): Promise<boolean> => {
    try {
        // Remove from in-memory cache
        const index = projects.findIndex(p => p.id === id);
        if (index >= 0) {
            projects.splice(index, 1);
            // Save to localStorage
            saveProjectsToLocalStorage(projects);
            return true;
        }
        return false;
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

// Initialize projects with localStorage data if available, otherwise use defaults
let projects: ProjectData[] = (() => {
    try {
        if (typeof window !== 'undefined') {
            const localProjects = loadProjectsFromLocalStorage();
            return localProjects.length > 0 ? localProjects : defaultProjects;
        }
        return defaultProjects;
    } catch {
        return defaultProjects;
    }
})();

export const projectsStore = {
    // Create a new project
    create: async (project: Omit<ProjectData, 'id' | 'createdAt' | 'updatedAt'>) => {
        try {
            // Generate a new unique ID
            const id = `project-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
            
            // Create new project with timestamps
            const now = new Date().toISOString();
            const newProject: ProjectData = {
                ...project,
                id,
                createdAt: now,
                updatedAt: now,
                elements: project.elements || [],
                settings: project.settings || {
                    title: project.name,
                    description: '',
                    favicon: '',
                    customCSS: '',
                    customJS: ''
                }
            };
            
            // Add to in-memory cache
            projects.push(newProject);
            
            // Save to localStorage
            saveProjectsToLocalStorage(projects);
            
            return newProject;
        } catch (error) {
            console.error('Error in create project:', error);
            return null;
        }
    },
    
    // Load all projects for current user
    getAll: async () => {
        try {
            // If we already have projects in memory, return them
            if (projects.length > 0) {
                return projects;
            }

            // Load from localStorage
            const loadedProjects = await loadProjectsFromDatabase();
            projects = loadedProjects; // Update in-memory cache
            
            // Also save to localStorage as backup
            saveProjectsToLocalStorage(projects);
            
            return projects;
        } catch (error) {
            console.error('Error in getAll:', error);
            return [];
        }
    },

    // Get project by ID
    getById: async (id: string) => {
        try {
            // First check in-memory cache
            const cachedProject = projects.find(p => String(p.id) === String(id));
            if (cachedProject) {
                return cachedProject;
            }
            
            // If not in memory, check localStorage
            const localProjects = loadProjectsFromLocalStorage();
            const localProject = localProjects.find(p => String(p.id) === String(id));
            return localProject || null;
        } catch (error) {
            console.error('Error in getById:', error);
            return null;
        }
    },

    // Update project
    update: async (id: string, updates: Partial<ProjectData>) => {
        try {
            // Get current project
            const currentProject = projects.find(p => p.id === id);
            if (!currentProject) {
                // Try to find in localStorage if not in memory
                const localProjects = loadProjectsFromLocalStorage();
                const localProject = localProjects.find(p => p.id === id);
                if (!localProject) {
                    return null;
                }
                // Add to memory cache
                projects.push(localProject);
            }

            // Get the index again after potentially adding from localStorage
            const index = projects.findIndex(p => p.id === id);
            if (index < 0) {
                return null;
            }

            // Create updated project
            const updatedProject = {
                ...projects[index],
                ...updates,
                updatedAt: new Date().toISOString()
            };

            // Update in-memory cache
            projects[index] = updatedProject;

            // Save to localStorage
            saveProjectsToLocalStorage(projects);
            
            return updatedProject;
        } catch (error) {
            console.error(`Error in update project ${id}:`, error);
            return null;
        }
    },

    // Delete project
    delete: async (id: string) => {
        try {
            // Delete from in-memory cache
            projects = projects.filter(p => p.id !== id);
            
            // Save updated projects to localStorage
            saveProjectsToLocalStorage(projects);
            
            return true;
        } catch (error) {
            console.error(`Error in delete project ${id}:`, error);
            // Fallback: remove from memory anyway
            projects = projects.filter(p => p.id !== id);
            saveProjectsToLocalStorage(projects);
            return true;
        }
    },

    // Get project by share token
    getByShareToken: async (token: string) => {
        try {
            // Load all projects from localStorage
            const allProjects = loadProjectsFromLocalStorage();
            
            // Find project with matching share token
            const project = allProjects.find(p => p.shareToken === token);
            
            if (!project) {
                console.log(`No project found with share token ${token}`);
                return null;
            }
            
            // Check if share token has expired
            if (project.shareExpiryDate && new Date(project.shareExpiryDate) < new Date()) {
                console.log(`Share token ${token} has expired`);
                return null;
            }
            
            return project;
        } catch (error) {
            console.error(`Error in getByShareToken for token ${token}:`, error);
            return null;
        }
    },

    // Get project by share slug (custom name)
    getByShareSlug: async (slug: string) => {
        try {
            // Load all projects from localStorage
            const allProjects = loadProjectsFromLocalStorage();
            
            // Find project with matching share slug and is publicly shared
            const project = allProjects.find(p => 
                p.shareSlug === slug && p.isPubliclyShared === true
            );
            
            if (!project) {
                console.log(`No project found with share slug ${slug}`);
                return null;
            }
            
            // Check if share token has expired
            if (project.shareExpiryDate && new Date(project.shareExpiryDate) < new Date()) {
                console.log(`Share slug ${slug} has expired`);
                return null;
            }
            
            return project;
        } catch (error) {
            console.error(`Error in getByShareSlug for slug ${slug}:`, error);
            return null;
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
            // Load all projects from localStorage
            const allProjects = loadProjectsFromLocalStorage();
            
            // Check if any project has the same slug (excluding the specified project)
            const projectWithSameSlug = allProjects.find(p => 
                p.shareSlug === slug && 
                (!excludeProjectId || p.id !== excludeProjectId)
            );
            
            // Return true if no project with the same slug was found
            return !projectWithSameSlug;
        } catch (error) {
            console.error(`Error in isSlugUnique for slug ${slug}:`, error);
            return true; // Return true to break infinite loop on error
        }
    },

    // Generate share token for a project with custom name
    generateShareToken: async (id: string, customName: string, expiryDays?: number) => {
        try {
            console.log(`generateShareToken called for project ID: ${id}, customName: ${customName}`);
            
            // Verify project exists first
            const project = projects.find(p => String(p.id) === String(id));
            if (!project) {
                console.error(`Project ${id} not found in memory cache when generating share token`);
                // Try to load from localStorage as fallback
                const localProjects = loadProjectsFromLocalStorage();
                const localProject = localProjects.find(p => String(p.id) === String(id));
                if (!localProject) {
                    console.error(`Project ${id} not found in localStorage either`);
                    throw new Error('Project not found');
                }
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
            // Find project in memory cache or localStorage
            const project = await projectsStore.getById(projectId);
            
            if (!project) {
                console.error(`Project ${projectId} not found when loading elements`);
                return [];
            }
            
            // Return elements from the project
            return project.elements || [];
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
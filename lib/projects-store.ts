// Shared projects store using localStorage
// Removed Supabase integration for now

const STORAGE_KEY = 'squpage_projects'

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
    type: 'Template' | 'AI Generated'
    status: 'draft' | 'published'
    createdAt: string
    updatedAt: string
    thumbnail: string
    elements: any[]
    templateId?: string // For template-based projects
    themeId?: string // For themed templates
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

// Load projects from localStorage
const loadProjectsFromLocalStorage = (): ProjectData[] => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
            console.log('No projects found in localStorage, using defaults');
            return [...defaultProjects];
        }

        const parsedProjects = JSON.parse(stored);
        console.log(`Loaded ${parsedProjects.length} projects from localStorage`);
        return parsedProjects;
    } catch (error) {
        console.error('Error loading projects from localStorage:', error);
        return [...defaultProjects];
    }
};

// Save projects to localStorage
const saveProjectsToLocalStorage = (projects: ProjectData[]): void => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
        console.log(`Saved ${projects.length} projects to localStorage`);
    } catch (error) {
        console.error('Error saving projects to localStorage:', error);
    }
};

// Save project to localStorage
const saveProjectToLocalStorage = (project: ProjectData): ProjectData => {
    try {
        const projects = loadProjectsFromLocalStorage();
        const existingIndex = projects.findIndex(p => p.id === project.id);

        const projectToSave = {
            ...project,
            updatedAt: new Date().toISOString()
        };

        if (existingIndex >= 0) {
            projects[existingIndex] = projectToSave;
        } else {
            projects.push(projectToSave);
        }

        saveProjectsToLocalStorage(projects);
        return projectToSave;
    } catch (error) {
        console.error('Error saving project to localStorage:', error);
        return project;
    }
};

// Delete project from localStorage
const deleteProjectFromLocalStorage = (id: string): boolean => {
    try {
        const projects = loadProjectsFromLocalStorage();
        const filteredProjects = projects.filter(p => p.id !== id);

        if (filteredProjects.length === projects.length) {
            console.warn(`Project ${id} not found in localStorage`);
            return false;
        }

        saveProjectsToLocalStorage(filteredProjects);
        console.log(`Deleted project ${id} from localStorage`);
        return true;
    } catch (error) {
        console.error('Error deleting project from localStorage:', error);
        return false;
    }
};

// Default projects for initial state
const defaultProjects: ProjectData[] = [
    {
        id: '1',
        name: 'My First Website',
        type: 'Template',
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
            description: 'A website built with templates',
            favicon: '',
            customCSS: '',
            customJS: ''
        }
    }
]

// Initialize projects with default values until loaded from localStorage
let projects: ProjectData[] = loadProjectsFromLocalStorage();

export const projectsStore = {
    // Load all projects from localStorage
    getAll: async () => {
        try {
            projects = loadProjectsFromLocalStorage();
            return projects;
        } catch (error) {
            console.error('Error loading projects, returning current projects:', error);
            return projects;
        }
    },

    // Get project by ID
    getById: async (id: string) => {
        try {
            // Try to get from in-memory cache first
            const cachedProject = projects.find(p => p.id === id);
            if (cachedProject) return cachedProject;

            // If not in cache, reload from localStorage
            projects = loadProjectsFromLocalStorage();
            return projects.find(p => p.id === id) || null;
        } catch (error) {
            console.error(`Error in getById for project ${id}:`, error);
            return null;
        }
    },

    // Create new project
    create: async (project: ProjectData) => {
        try {
            const createdProject = saveProjectToLocalStorage(project);
            projects.push(createdProject);
            return createdProject;
        } catch (error) {
            console.error('Error creating project:', error);
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

            // Create updated project
            const updatedProject = {
                ...currentProject,
                ...updates,
                updatedAt: new Date().toISOString()
            };

            // Save to localStorage
            const savedProject = saveProjectToLocalStorage(updatedProject);

            // Update cache
            const index = projects.findIndex(p => p.id === id);
            if (index >= 0) {
                projects[index] = savedProject;
            }

            return savedProject;
        } catch (error) {
            console.error(`Error in update project ${id}:`, error);
            return null;
        }
    },

    // Delete project
    delete: async (id: string) => {
        try {
            const success = deleteProjectFromLocalStorage(id);

            if (success) {
                // Update in-memory cache
                projects = projects.filter(p => p.id !== id);
            }

            return success;
        } catch (error) {
            console.error(`Error in delete project ${id}:`, error);
            return false;
        }
    },

    // Get project by share token (not supported in localStorage)
    getByShareToken: async (token: string) => {
        console.log(`Share token lookup not supported in localStorage mode: ${token}`);
        return null;
    },

    // Get project by share slug (not supported in localStorage)
    getByShareSlug: async (slug: string) => {
        console.log(`Share slug lookup not supported in localStorage mode: ${slug}`);
        return null;
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

    // Check if share slug is unique (always true in localStorage)
    isSlugUnique: async (slug: string, excludeProjectId?: string) => {
        console.log('Slug uniqueness check not supported in localStorage mode, assuming unique');
        return true;
    },

    // Generate share token for a project (not supported in localStorage)
    generateShareToken: async (id: string, customName: string, expiryDays?: number) => {
        console.log('Share token generation not supported in localStorage mode');
        return null;
    },

    // Revoke share token for a project (not supported in localStorage)
    revokeShareToken: async (id: string) => {
        console.log('Share token revocation not supported in localStorage mode');
        return false;
    },

    // Load elements for a project (not supported in localStorage)
    getProjectElements: async (projectId: string) => {
        console.log(`Element loading not supported in localStorage mode for project ${projectId}`);
        return [];
    },

    // Save elements for a project (not supported in localStorage)
    saveProjectElements: async (projectId: string, elements: any[]) => {
        console.log(`Element saving not supported in localStorage mode for project ${projectId}`);
        return false;
    },

    // Update share settings for a project (not supported in localStorage)
    updateShareSettings: async (projectId: string, customName: string, expiryDays?: number) => {
        console.log('Share settings update not supported in localStorage mode');
        return null;
    },
};

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
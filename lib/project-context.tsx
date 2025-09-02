"use client"

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { ElementorElement } from './elementor-context'
import { projectsService, elementsService, transformFromSupabase } from './supabase-projects'
import { authService } from './supabase-auth'

export interface Project {
  id: string
  name: string
  type: 'Elementor' | 'Template' | 'AI Generated' | 'Landing Page'
  status: 'draft' | 'published' | 'archived'
  createdAt: string
  updatedAt: string
  thumbnail: string
  elements: ElementorElement[]
  shareToken?: string
  shareName?: string
  shareSlug?: string
  isPubliclyShared?: boolean
  shareExpiryDate?: string
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
  analytics?: any
  isPublic?: boolean
  viewCount?: number
}

interface ProjectContextType {
  currentProject: Project | null
  projects: Project[]
  isLoading: boolean
  isSaving: boolean
  
  // Project management
  createProject: (name: string, type?: Project['type']) => Promise<Project>
  loadProject: (id: string) => Promise<void>
  saveProject: (elements: ElementorElement[], settings?: Partial<Project['settings']>) => Promise<Project>
  publishProject: () => Promise<void>
  deleteProject: (id: string) => Promise<void>
  duplicateProject: (id: string) => Promise<Project>
  
  // Project list management
  fetchProjects: () => Promise<void>
  updateProjectThumbnail: (thumbnail: string) => Promise<void>
  
  // Auto-save functionality
  enableAutoSave: (elements: ElementorElement[]) => void
  disableAutoSave: () => void
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined)

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [currentProject, setCurrentProject] = useState<Project | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [autoSaveInterval, setAutoSaveInterval] = useState<NodeJS.Timeout | null>(null)

  // Create a new project
  const createProject = useCallback(async (name: string, type: Project['type'] = 'Elementor'): Promise<Project> => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          type,
          settings: {
            title: name,
            description: '',
            favicon: '',
            customCSS: '',
            customJS: ''
          }
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create project')
      }

      const { project: dbProject } = await response.json()

      const project: Project = {
        id: dbProject.id,
        name: dbProject.name,
        type: dbProject.type,
        status: dbProject.status,
        thumbnail: dbProject.thumbnail,
        elements: dbProject.elements || [],
        settings: dbProject.settings || {},
        analytics: dbProject.analytics,
        isPublic: dbProject.isPublic,
        viewCount: dbProject.viewCount,
        createdAt: dbProject.createdAt,
        updatedAt: dbProject.updatedAt
      }

      setCurrentProject(project)
      setProjects(prev => [project, ...prev])
      
      return project
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      console.error('Error creating project:', errorMessage, error)
      throw new Error(`Failed to create project: ${errorMessage}`)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Load a project by ID
  const loadProject = useCallback(async (id: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/projects/${id}`)
      
      if (!response.ok) {
        throw new Error('Failed to load project')
      }

      const { project } = await response.json()
      setCurrentProject(project)
    } catch (error) {
      console.error('Error loading project:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Save project
  const saveProject = useCallback(async (elements: ElementorElement[], settings?: Partial<Project['settings']>): Promise<Project> => {
    setIsSaving(true)
    try {
      // Always save to localStorage first as backup
      const projectData = {
        elements,
        settings: settings || {},
        lastModified: new Date().toISOString()
      }
      
      const projectId = currentProject?.id || 'default-project'
      localStorage.setItem(`elementor-project-${projectId}`, JSON.stringify(projectData))
      
      // Try to save to API if available
      if (currentProject) {
        try {
          const response = await fetch(`/api/projects/${currentProject.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              elements,
              settings,
            }),
          })

          if (response.ok) {
            const { project } = await response.json()
            setCurrentProject(project)
            
            // Update in projects list
            setProjects(prev => prev.map(p => p.id === project.id ? project : p))
            
            return project
          }
        } catch (apiError) {
          console.warn('API save failed, using localStorage:', apiError)
        }
      }
      
      // Fallback: create/update project in localStorage
      const fallbackProject: Project = {
        id: projectId,
        name: currentProject?.name || 'Untitled Project',
        type: currentProject?.type || 'Elementor',
        status: currentProject?.status || 'draft',
        thumbnail: currentProject?.thumbnail || '',
        elements,
        settings: {
          title: currentProject?.settings?.title || 'Untitled',
          description: currentProject?.settings?.description || '',
          favicon: currentProject?.settings?.favicon || '',
          customCSS: currentProject?.settings?.customCSS || '',
          customJS: currentProject?.settings?.customJS || '',
          ...settings
        },
        createdAt: currentProject?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      setCurrentProject(fallbackProject)
      return fallbackProject
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      console.error('Error saving project:', errorMessage, error)
      throw new Error(`Failed to save project: ${errorMessage}`)
    } finally {
      setIsSaving(false)
    }
  }, [currentProject])

  // Publish project
  const publishProject = useCallback(async () => {
    if (!currentProject) {
      throw new Error('No current project to publish')
    }

    setIsSaving(true)
    try {
      const response = await fetch(`/api/projects/${currentProject.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'published',
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to publish project')
      }

      const { project } = await response.json()
      setCurrentProject(project)
      
      // Update in projects list
      setProjects(prev => prev.map(p => p.id === project.id ? project : p))
    } catch (error) {
      console.error('Error publishing project:', error)
      throw error
    } finally {
      setIsSaving(false)
    }
  }, [currentProject])

  // Delete project
  const deleteProject = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete project')
      }

      setProjects(prev => prev.filter(p => p.id !== id))
      
      if (currentProject?.id === id) {
        setCurrentProject(null)
      }
    } catch (error) {
      console.error('Error deleting project:', error)
      throw error
    }
  }, [currentProject])

  // Duplicate project
  const duplicateProject = useCallback(async (id: string): Promise<Project> => {
    const projectToDuplicate = projects.find(p => p.id === id)
    if (!projectToDuplicate) {
      throw new Error('Project not found')
    }

    return createProject(`${projectToDuplicate.name} (Copy)`, projectToDuplicate.type)
  }, [projects, createProject])

  // Fetch all projects
  const fetchProjects = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/projects')
      
      if (!response.ok) {
        throw new Error('Failed to fetch projects')
      }

      const { projects } = await response.json()
      setProjects(projects)
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Update project thumbnail
  const updateProjectThumbnail = useCallback(async (thumbnail: string) => {
    if (!currentProject) return

    try {
      const response = await fetch(`/api/projects/${currentProject.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ thumbnail }),
      })

      if (!response.ok) {
        throw new Error('Failed to update thumbnail')
      }

      const { project } = await response.json()
      setCurrentProject(project)
      setProjects(prev => prev.map(p => p.id === project.id ? project : p))
    } catch (error) {
      console.error('Error updating thumbnail:', error)
    }
  }, [currentProject])

  // Auto-save functionality
  const enableAutoSave = useCallback((elements: ElementorElement[]) => {
    if (autoSaveInterval) {
      clearInterval(autoSaveInterval)
    }

    const interval = setInterval(() => {
      if (currentProject) {
        saveProject(elements).catch(console.error)
      }
    }, 30000) // Auto-save every 30 seconds

    setAutoSaveInterval(interval)
  }, [currentProject, saveProject, autoSaveInterval])

  const disableAutoSave = useCallback(() => {
    if (autoSaveInterval) {
      clearInterval(autoSaveInterval)
      setAutoSaveInterval(null)
    }
  }, [autoSaveInterval])

  // Cleanup auto-save on unmount
  useEffect(() => {
    return () => {
      if (autoSaveInterval) {
        clearInterval(autoSaveInterval)
      }
    }
  }, [autoSaveInterval])

  const value: ProjectContextType = {
    currentProject,
    projects,
    isLoading,
    isSaving,
    createProject,
    loadProject,
    saveProject,
    publishProject,
    deleteProject,
    duplicateProject,
    fetchProjects,
    updateProjectThumbnail,
    enableAutoSave,
    disableAutoSave,
  }

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  )
}

export function useProject() {
  const context = useContext(ProjectContext)
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider')
  }
  return context
}
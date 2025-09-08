"use client"

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
// ElementorElement type removed - Elementor system has been removed
import { projectsStore, ProjectData } from './projects-store'

export interface Project {
  id: string
  name: string
  type: 'Template'
  status: 'draft' | 'published' | 'archived'
  createdAt: string
  updatedAt: string
  thumbnail: string
  elements: any[] // Generic elements array - Elementor system removed
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
  createProject: (name: string) => Promise<Project>
  loadProject: (id: string) => Promise<void>
  saveProject: (elements: any[], settings?: Partial<Project['settings']>) => Promise<Project>
  publishProject: () => Promise<void>
  deleteProject: (id: string) => Promise<void>
  duplicateProject: (id: string) => Promise<Project>
  
  // Project list management
  fetchProjects: () => Promise<void>
  updateProjectThumbnail: (thumbnail: string) => Promise<void>
  
  // Auto-save functionality
  enableAutoSave: (elements: any[]) => void
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
  const createProject = useCallback(async (name: string): Promise<Project> => {
    setIsLoading(true)
    try {
      const newProject: ProjectData = {
        id: Date.now().toString(),
        name,
        type: 'Template',
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        thumbnail: '/placeholder.svg?height=120&width=200&text=Website',
        elements: [],
        settings: {
          title: name,
          description: '',
          favicon: '',
          customCSS: '',
          customJS: ''
        }
      }

      const createdProject = await projectsStore.create(newProject)
      
      if (!createdProject) {
        throw new Error('Failed to create project')
      }

      const project: Project = {
        id: createdProject.id,
        name: createdProject.name || '',
        type: createdProject.type || 'Template',
        status: createdProject.status || 'draft',
        createdAt: createdProject.createdAt || new Date().toISOString(),
        updatedAt: createdProject.updatedAt || new Date().toISOString(),
        thumbnail: createdProject.thumbnail || '',
        elements: createdProject.elements || [],
        settings: createdProject.settings || {
          title: createdProject.name || '',
          description: '',
          favicon: '',
          customCSS: '',
          customJS: ''
        }
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
      const project = await projectsStore.getById(id)
      
      if (!project) {
        throw new Error('Failed to load project')
      }

      setCurrentProject(project as Project)
    } catch (error) {
      console.error('Error loading project:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Save project
  const saveProject = useCallback(async (elements: any[], settings?: Partial<Project['settings']>): Promise<Project> => {
    setIsSaving(true)
    try {
      if (!currentProject) {
        throw new Error('No current project to save')
      }
      
      // Save elements to localStorage
      await projectsStore.saveProjectElements(currentProject.id, elements)
      
      // Update project settings if provided
      let updatedProject = currentProject
      if (settings) {
        const projectUpdates = {
          settings: {
            ...currentProject.settings,
            ...settings
          }
        }
        
        const result = await projectsStore.update(currentProject.id, projectUpdates)
        if (result) {
          updatedProject = {
            ...result,
            elements
          } as Project
        }
      } else {
        // Just update the timestamp
        const result = await projectsStore.update(currentProject.id, { updatedAt: new Date().toISOString() })
        if (result) {
          updatedProject = {
            ...result,
            elements
          } as Project
        }
      }
      
      setCurrentProject(updatedProject)
      
      // Update in projects list
      setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p))
      
      return updatedProject
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
      const result = await projectsStore.update(currentProject.id, { status: 'published' })
      
      if (!result) {
        throw new Error('Failed to publish project')
      }

      const updatedProject = {
        ...result,
        elements: currentProject.elements
      } as Project
      
      setCurrentProject(updatedProject)
      
      // Update in projects list
      setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p))
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
      const success = await projectsStore.delete(id)

      if (!success) {
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

    return createProject(`${projectToDuplicate.name} (Copy)`)
  }, [projects, createProject])

  // Fetch all projects
  const fetchProjects = useCallback(async () => {
    setIsLoading(true)
    try {
      const allProjects = await projectsStore.getAll()
      setProjects(allProjects as Project[])
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
      const result = await projectsStore.update(currentProject.id, { thumbnail })
      
      if (!result) {
        throw new Error('Failed to update thumbnail')
      }

      const updatedProject = {
        ...result,
        elements: currentProject.elements
      } as Project
      
      setCurrentProject(updatedProject)
      setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p))
    } catch (error) {
      console.error('Error updating thumbnail:', error)
    }
  }, [currentProject])

  // Auto-save functionality
  const enableAutoSave = useCallback((elements: any[]) => {
    if (autoSaveInterval) {
      clearInterval(autoSaveInterval)
    }

    const interval = setInterval(() => {
      if (currentProject) {
        saveProject(elements).catch(console.error)
      }
    }, 30000) // Auto-save every 30 seconds

    setAutoSaveInterval(interval)
  }, [currentProject, saveProject])

  const disableAutoSave = useCallback(() => {
    if (autoSaveInterval) {
      clearInterval(autoSaveInterval)
      setAutoSaveInterval(null)
    }
  }, [])

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
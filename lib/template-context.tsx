"use client"

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { templateStore, TemplateElement, TemplateProject } from './template-store'

// Template-specific context (completely separate from Elementor)
interface TemplateContextType {
  currentTemplate: TemplateProject | null
  templates: TemplateProject[]
  elements: TemplateElement[]
  selectedElement: string | null
  isLoading: boolean
  isSaving: boolean
  
  // Template management
  createTemplate: (name: string, type?: TemplateProject['type']) => Promise<TemplateProject>
  loadTemplate: (id: string) => Promise<void>
  saveTemplate: (elements: TemplateElement[], settings?: Partial<TemplateProject['settings']>) => Promise<TemplateProject>
  deleteTemplate: (id: string) => Promise<void>
  duplicateTemplate: (id: string) => Promise<TemplateProject>
  
  // Template list management
  fetchTemplates: () => Promise<void>
  updateTemplateThumbnail: (thumbnail: string) => Promise<void>
  
  // Element management (template-specific)
  addElement: (element: TemplateElement) => void
  updateElement: (id: string, updates: Partial<TemplateElement>) => void
  deleteElement: (id: string) => void
  selectElement: (id: string | null) => void
  
  // History management
  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean
}

const TemplateContext = createContext<TemplateContextType | undefined>(undefined)

export function TemplateProvider({ children }: { children: React.ReactNode }) {
  const [currentTemplate, setCurrentTemplate] = useState<TemplateProject | null>(null)
  const [templates, setTemplates] = useState<TemplateProject[]>([])
  const [elements, setElements] = useState<TemplateElement[]>([])
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  // History management
  const [history, setHistory] = useState<TemplateElement[][]>([[]])
  const [historyIndex, setHistoryIndex] = useState(0)
  
  const canUndo = historyIndex > 0
  const canRedo = historyIndex < history.length - 1

  // Save to history
  const saveToHistory = useCallback((currentElements: TemplateElement[]) => {
    setHistory((prevHistory) => {
      const newHistory = prevHistory.slice(0, historyIndex + 1)
      newHistory.push([...currentElements])
      const newIndex = newHistory.length - 1
      setHistoryIndex(newIndex)
      return newHistory
    })
  }, [historyIndex])

  // Create a new template
  const createTemplate = useCallback(async (name: string, type: TemplateProject['type'] = 'Template'): Promise<TemplateProject> => {
    setIsLoading(true)
    try {
      const newTemplate = await templateStore.create({
        name,
        type,
        status: 'draft',
        thumbnail: '/placeholder.svg?height=120&width=200&text=Template',
        elements: [],
        settings: {
          title: name,
          description: '',
          favicon: '',
          customCSS: '',
          customJS: ''
        }
      })

      if (!newTemplate) {
        throw new Error('Failed to create template')
      }

      setCurrentTemplate(newTemplate)
      setElements([])
      setTemplates(prev => [newTemplate, ...prev])
      
      return newTemplate
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      console.error('Error creating template:', errorMessage, error)
      throw new Error(`Failed to create template: ${errorMessage}`)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Load a template by ID
  const loadTemplate = useCallback(async (id: string) => {
    setIsLoading(true)
    try {
      const template = await templateStore.getById(id)
      
      if (!template) {
        throw new Error('Template not found')
      }

      // Load template elements
      const templateElements = await templateStore.getTemplateElements(id)
      
      setCurrentTemplate(template)
      setElements(templateElements)
      setSelectedElement(null)
      
      // Reset history
      setHistory([templateElements])
      setHistoryIndex(0)
    } catch (error) {
      console.error('Error loading template:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Save template
  const saveTemplate = useCallback(async (elements: TemplateElement[], settings?: Partial<TemplateProject['settings']>): Promise<TemplateProject> => {
    setIsSaving(true)
    try {
      if (!currentTemplate) {
        throw new Error('No current template to save')
      }
      
      // Save elements to localStorage
      await templateStore.saveTemplateElements(currentTemplate.id, elements)
      
      // Update template settings if provided
      let updatedTemplate = currentTemplate
      if (settings) {
        const templateUpdates = {
          settings: {
            ...currentTemplate.settings,
            ...settings
          }
        }
        
        const result = await templateStore.update(currentTemplate.id, templateUpdates)
        if (result) {
          updatedTemplate = {
            ...result,
            elements
          }
        }
      } else {
        // Just update the timestamp
        const result = await templateStore.update(currentTemplate.id, { updatedAt: new Date().toISOString() })
        if (result) {
          updatedTemplate = {
            ...result,
            elements
          }
        }
      }
      
      setCurrentTemplate(updatedTemplate)
      setElements(elements)
      
      // Update in templates list
      setTemplates(prev => prev.map(t => t.id === updatedTemplate.id ? updatedTemplate : t))
      
      return updatedTemplate
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      console.error('Error saving template:', errorMessage, error)
      throw new Error(`Failed to save template: ${errorMessage}`)
    } finally {
      setIsSaving(false)
    }
  }, [currentTemplate])

  // Delete template
  const deleteTemplate = useCallback(async (id: string) => {
    try {
      const success = await templateStore.delete(id)

      if (!success) {
        throw new Error('Failed to delete template')
      }

      setTemplates(prev => prev.filter(t => t.id !== id))
      
      if (currentTemplate?.id === id) {
        setCurrentTemplate(null)
        setElements([])
        setSelectedElement(null)
      }
    } catch (error) {
      console.error('Error deleting template:', error)
      throw error
    }
  }, [currentTemplate])

  // Duplicate template
  const duplicateTemplate = useCallback(async (id: string): Promise<TemplateProject> => {
    const templateToDuplicate = templates.find(t => t.id === id)
    if (!templateToDuplicate) {
      throw new Error('Template not found')
    }

    return createTemplate(`${templateToDuplicate.name} (Copy)`, templateToDuplicate.type)
  }, [templates, createTemplate])

  // Fetch all templates
  const fetchTemplates = useCallback(async () => {
    setIsLoading(true)
    try {
      const allTemplates = await templateStore.getAll()
      setTemplates(allTemplates)
    } catch (error) {
      console.error('Error fetching templates:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Update template thumbnail
  const updateTemplateThumbnail = useCallback(async (thumbnail: string) => {
    if (!currentTemplate) return

    try {
      const result = await templateStore.update(currentTemplate.id, { thumbnail })
      
      if (!result) {
        throw new Error('Failed to update thumbnail')
      }

      const updatedTemplate = {
        ...result,
        elements: currentTemplate.elements
      }
      
      setCurrentTemplate(updatedTemplate)
      setTemplates(prev => prev.map(t => t.id === updatedTemplate.id ? updatedTemplate : t))
    } catch (error) {
      console.error('Error updating thumbnail:', error)
    }
  }, [currentTemplate])

  // Element management functions
  const addElement = useCallback((element: TemplateElement) => {
    setElements(prevElements => {
      const newElements = [...prevElements, element]
      saveToHistory(newElements)
      return newElements
    })
    setSelectedElement(element.id)
  }, [saveToHistory])

  const updateElement = useCallback((id: string, updates: Partial<TemplateElement>) => {
    console.log(`Template context: Updating element with id: ${id}`, updates)
    
    setElements(prevElements => {
      const elementExists = prevElements.some(el => el.id === id)
      
      let updatedElements
      
      if (elementExists) {
        console.log(`Template element ${id} exists, updating it`)
        updatedElements = prevElements.map(el => el.id === id ? { ...el, ...updates } : el)
      } else {
        console.log(`Template element ${id} doesn't exist, creating it`)
        const newElement: TemplateElement = {
          id,
          type: updates.type || 'text',
          content: updates.content || '',
          styles: updates.styles || {},
          position: updates.position || { x: 0, y: 0 },
          url: updates.url
        }
        
        updatedElements = [...prevElements, newElement]
      }
      
      console.log('Updated template elements:', updatedElements)
      saveToHistory(updatedElements)
      return updatedElements
    })
  }, [saveToHistory])

  const deleteElement = useCallback((id: string) => {
    console.log(`Template context: Attempting to delete element with id: ${id}`)
    
    setElements(prevElements => {
      const elementExists = prevElements.some(el => el.id === id)
      if (!elementExists) {
        console.warn(`Template element with id ${id} not found in elements array`)
        return prevElements
      }
      
      console.log(`Deleting template element with id: ${id}`)
      const newElements = prevElements.filter(el => el.id !== id)
      console.log(`Template elements after deletion:`, newElements)
      saveToHistory(newElements)
      return newElements
    })
    
    // Clear selection if the deleted element was selected
    setSelectedElement(prevSelected => {
      if (prevSelected === id) {
        console.log(`Clearing selection as selected template element ${id} was deleted`)
        return null
      }
      return prevSelected
    })
  }, [saveToHistory])

  const selectElement = useCallback((id: string | null) => {
    setSelectedElement(id)
  }, [])

  // History functions
  const undo = useCallback(() => {
    setHistoryIndex(prevIndex => {
      if (prevIndex > 0) {
        const newIndex = prevIndex - 1
        setElements(history[newIndex])
        return newIndex
      }
      return prevIndex
    })
  }, [history])

  const redo = useCallback(() => {
    setHistoryIndex(prevIndex => {
      if (prevIndex < history.length - 1) {
        const newIndex = prevIndex + 1
        setElements(history[newIndex])
        return newIndex
      }
      return prevIndex
    })
  }, [history])

  const value: TemplateContextType = {
    currentTemplate,
    templates,
    elements,
    selectedElement,
    isLoading,
    isSaving,
    createTemplate,
    loadTemplate,
    saveTemplate,
    deleteTemplate,
    duplicateTemplate,
    fetchTemplates,
    updateTemplateThumbnail,
    addElement,
    updateElement,
    deleteElement,
    selectElement,
    undo,
    redo,
    canUndo,
    canRedo,
  }

  return (
    <TemplateContext.Provider value={value}>
      {children}
    </TemplateContext.Provider>
  )
}

export function useTemplate() {
  const context = useContext(TemplateContext)
  if (context === undefined) {
    throw new Error('useTemplate must be used within a TemplateProvider')
  }
  return context
}

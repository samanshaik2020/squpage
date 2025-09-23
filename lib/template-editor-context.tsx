"use client"

import type React from "react"
import { createContext, useState, useCallback, useContext, useMemo, useEffect, useRef } from "react"

interface TemplateElement {
  id: string
  type: string
  content: any
  styles: any
  url?: string
  position: { x: number; y: number }
  animation?: {
    type: 'none' | 'pulse' | 'bounce' | 'shake' | 'glow' | 'slide' | 'scale' | 'rotate' | 'flip'
    duration: number // in milliseconds
    timing: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear'
    trigger: 'hover' | 'click' | 'load' | 'scroll'
    infinite: boolean
    delay: number // in milliseconds
  }
  transition?: {
    property: 'all' | 'background' | 'transform' | 'color' | 'border' | 'shadow'
    duration: number // in milliseconds
    timing: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear'
    delay: number // in milliseconds
  }
}

interface TemplateEditorState {
  elements: TemplateElement[]
  selectedElement: string | null
  history: TemplateElement[][]
  historyIndex: number
  canUndo: boolean
  canRedo: boolean
  templateId: string | null
}

interface TemplateEditorActions {
  addElement: (element: TemplateElement) => void
  updateElement: (id: string, updates: Partial<TemplateElement>) => void
  deleteElement: (id: string) => void
  selectElement: (id: string | null) => void
  undo: () => void
  redo: () => void
  saveToHistory: (currentElements: TemplateElement[]) => void
  setTemplateId: (templateId: string) => void
  clearElements: () => void
  hasElementsForTemplate: (templateId: string) => boolean
  switchTemplate: (newTemplateId: string) => void
  resetAllTemplates: () => void
}

export const TemplateEditorContext = createContext<(TemplateEditorState & TemplateEditorActions) | undefined>(undefined)

export function TemplateEditorProvider({ children }: { children: React.ReactNode }) {
  // Initialize with empty elements array
  const [elements, setElements] = useState<TemplateElement[]>([])
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [history, setHistory] = useState<TemplateElement[][]>([[]])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [templateId, setTemplateId] = useState<string | null>(null)
  
  // Load current templateId from localStorage on mount and clean up old storage
  useEffect(() => {
    // Clean up old non-template-specific storage that was causing the bug
    const oldElements = localStorage.getItem('template-editor-elements')
    const oldTemplateId = localStorage.getItem('template-editor-templateId')
    
    if (oldElements || oldTemplateId) {
      console.log("Cleaning up old template storage that was causing cross-template contamination")
      localStorage.removeItem('template-editor-elements')
      localStorage.removeItem('template-editor-templateId')
    }
    
    const savedTemplateId = localStorage.getItem('template-editor-current-templateId')
    if (savedTemplateId && !templateId) {
      setTemplateId(savedTemplateId)
    }
  }, [templateId])

  // Track previous templateId to detect changes
  const [previousTemplateId, setPreviousTemplateId] = useState<string | null>(null)
  // Use ref to track current elements without causing re-renders
  const elementsRef = useRef<TemplateElement[]>(elements)

  // Load elements from localStorage when templateId changes
  useEffect(() => {
    if (templateId && templateId !== previousTemplateId) {
      console.log(`Context: Template ID changed from ${previousTemplateId} to ${templateId}`);
      
      // Save current elements for the previous template if it exists
      if (previousTemplateId && elementsRef.current.length > 0) {
        console.log(`Context: Saving ${elementsRef.current.length} elements for previous template ${previousTemplateId}`);
        localStorage.setItem(`template-editor-elements_${previousTemplateId}`, JSON.stringify(elementsRef.current));
      }
      
      // Clear current elements to prevent contamination
      console.log(`Context: Clearing current state for template switch`);
      setElements([])
      setSelectedElement(null)
      setHistory([[]])
      setHistoryIndex(0)
      
      // Load elements for the new template
      const savedElements = localStorage.getItem(`template-editor-elements_${templateId}`)
      
      if (savedElements) {
        try {
          const parsedElements = JSON.parse(savedElements)
          console.log(`Context: Loading ${parsedElements.length} saved elements for template ${templateId}`);
          setElements(parsedElements)
          setHistory([parsedElements])
          setHistoryIndex(0)
        } catch (error) {
          console.error("Error parsing saved elements:", error)
          // If parsing fails, keep elements empty (already cleared above)
        }
      } else {
        // No saved elements for this template, elements are already cleared above
        console.log(`Context: No saved elements found for template ${templateId}, starting with empty state`);
      }
      
      // Update previous template ID
      setPreviousTemplateId(templateId)
    } else if (!templateId) {
      // If no templateId, clear everything
      console.log(`Context: No template ID, clearing all elements`);
      setElements([])
      setSelectedElement(null)
      setHistory([[]])
      setHistoryIndex(0)
      setPreviousTemplateId(null)
    }
  }, [templateId, previousTemplateId])
  
  // Update elements ref whenever elements change
  useEffect(() => {
    elementsRef.current = elements
  }, [elements])

  // Save elements to localStorage whenever they change (with debounce to prevent excessive saves)
  useEffect(() => {
    if (elements.length > 0 && templateId) {
      const saveTimeout = setTimeout(() => {
        console.log(`Context: Auto-saving ${elements.length} elements for template ${templateId}`);
        console.log('Elements being saved:', elements.map(el => ({ id: el.id, content: el.content })));
        localStorage.setItem(`template-editor-elements_${templateId}`, JSON.stringify(elements))
      }, 500); // Debounce saves by 500ms
      
      return () => clearTimeout(saveTimeout);
    }
  }, [elements, templateId])
  
  // Save current templateId to localStorage whenever it changes
  useEffect(() => {
    if (templateId) {
      localStorage.setItem('template-editor-current-templateId', templateId)
    }
  }, [templateId])
  
  // Debug log when elements change
  useEffect(() => {
    console.log("Template editor elements updated:", elements);
  }, [elements])

  const canUndo = historyIndex > 0
  const canRedo = historyIndex < history.length - 1

  const saveToHistory = useCallback(
    (currentElements: TemplateElement[]) => {
      setHistory((prevHistory) => {
        const newHistory = prevHistory.slice(0, historyIndex + 1)
        newHistory.push([...currentElements])
        const newIndex = newHistory.length - 1
        setHistoryIndex(newIndex)
        return newHistory
      })
    },
    [historyIndex],
  )

  const addElement = useCallback(
    (element: TemplateElement) => {
      setElements((prevElements) => {
        const newElements = [...prevElements, element]
        saveToHistory(newElements)
        return newElements
      })
      setSelectedElement(element.id)
    },
    [saveToHistory],
  )

  const updateElement = useCallback(
    (id: string, updates: Partial<TemplateElement>) => {
      console.log(`Template editor context: Updating element with id: ${id}`, updates);
      
      setElements((prevElements) => {
        console.log(`Template editor context: Current elements before update:`, prevElements);
        
        // Check if the element exists
        const elementExists = prevElements.some(el => el.id === id);
        
        let updatedElements;
        
        if (elementExists) {
          // Update existing element
          console.log(`Template editor context: Element ${id} exists, updating it`);
          updatedElements = prevElements.map((el) => (el.id === id ? { ...el, ...updates } : el));
        } else {
          // Create new element with default values
          console.log(`Template editor context: Element ${id} doesn't exist, creating it`);
          const newElement: TemplateElement = {
            id,
            type: updates.type || 'text',
            content: updates.content || '',
            styles: updates.styles || {},
            position: updates.position || { x: 0, y: 0 },
            url: updates.url
          };
          
          updatedElements = [...prevElements, newElement];
        }
        
        console.log('Template editor context: Updated elements after change:', updatedElements);
        saveToHistory(updatedElements);
        return updatedElements;
      });
    },
    [saveToHistory],
  )

  const deleteElement = useCallback(
    (id: string) => {
      console.log(`Template editor: Attempting to delete element with id: ${id}`)
      
      setElements((prevElements) => {
        // Check if the element exists before attempting to delete
        const elementExists = prevElements.some(el => el.id === id);
        if (!elementExists) {
          console.warn(`Template editor: Element with id ${id} not found in elements array`)
          return prevElements // Return unchanged if element doesn't exist
        }
        
        console.log(`Template editor: Deleting element with id: ${id}`)
        const newElements = prevElements.filter((el) => el.id !== id)
        console.log(`Template editor: Elements after deletion:`, newElements)
        saveToHistory(newElements)
        return newElements
      })
      
      // Clear selection if the deleted element was selected
      setSelectedElement((prevSelected) => {
        if (prevSelected === id) {
          console.log(`Template editor: Clearing selection as selected element ${id} was deleted`)
          return null
        }
        return prevSelected
      })
    },
    [saveToHistory],
  )

  const selectElement = useCallback((id: string | null) => {
    setSelectedElement(id)
  }, [])

  const undo = useCallback(() => {
    setHistoryIndex((prevIndex) => {
      if (prevIndex > 0) {
        const newIndex = prevIndex - 1
        setElements(history[newIndex])
        return newIndex
      }
      return prevIndex
    })
  }, [history])

  const redo = useCallback(() => {
    setHistoryIndex((prevIndex) => {
      if (prevIndex < history.length - 1) {
        const newIndex = prevIndex + 1
        setElements(history[newIndex])
        return newIndex
      }
      return prevIndex
    })
  }, [history])

  const clearElements = useCallback(() => {
    setElements([])
    setSelectedElement(null)
    setHistory([[]])
    setHistoryIndex(0)
    // Clear localStorage for current template
    if (templateId) {
      localStorage.removeItem(`template-editor-elements_${templateId}`)
    }
    localStorage.removeItem('template-editor-current-templateId')
  }, [templateId])

  const hasElementsForTemplate = useCallback((templateId: string) => {
    const savedElements = localStorage.getItem(`template-editor-elements_${templateId}`)
    return savedElements !== null && savedElements !== undefined
  }, [])

  const switchTemplate = useCallback((newTemplateId: string) => {
    console.log(`Context: switchTemplate called for ${newTemplateId}`);
    // Simply set the template ID - the useEffect will handle the rest
    setTemplateId(newTemplateId);
  }, [])

  const resetAllTemplates = useCallback(() => {
    console.log('Context: Resetting all template data');
    
    // Clear all template-related localStorage
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('template-editor-elements_') || key.includes('template')) {
        console.log(`Context: Removing localStorage key: ${key}`);
        localStorage.removeItem(key);
      }
    });
    
    // Clear current state
    setElements([]);
    setSelectedElement(null);
    setHistory([[]]);
    setHistoryIndex(0);
    setTemplateId(null);
  }, [])

  const value = useMemo(
    () => ({
      elements,
      selectedElement,
      history,
      historyIndex,
      canUndo,
      canRedo,
      templateId,
      addElement,
      updateElement,
      deleteElement,
      selectElement,
      undo,
      redo,
      saveToHistory,
      setTemplateId,
      clearElements,
      hasElementsForTemplate,
      switchTemplate,
      resetAllTemplates,
    }),
    [
      elements,
      selectedElement,
      history,
      historyIndex,
      canUndo,
      canRedo,
      templateId,
      addElement,
      updateElement,
      deleteElement,
      selectElement,
      undo,
      redo,
      saveToHistory,
      clearElements,
      hasElementsForTemplate,
      switchTemplate,
      resetAllTemplates,
    ],
  )

  return <TemplateEditorContext.Provider value={value}>{children}</TemplateEditorContext.Provider>
}

export function useTemplateEditor() {
  const context = useContext(TemplateEditorContext)
  if (context === undefined) {
    throw new Error("useTemplateEditor must be used within a TemplateEditorProvider")
  }
  return context
}

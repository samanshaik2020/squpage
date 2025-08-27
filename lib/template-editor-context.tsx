"use client"

import type React from "react"
import { createContext, useState, useCallback, useContext, useMemo, useEffect } from "react"

interface TemplateElement {
  id: string
  type: string
  content: any
  styles: any
  url?: string
  position: { x: number; y: number }
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
}

export const TemplateEditorContext = createContext<(TemplateEditorState & TemplateEditorActions) | undefined>(undefined)

export function TemplateEditorProvider({ children }: { children: React.ReactNode }) {
  // Initialize with empty elements array
  const [elements, setElements] = useState<TemplateElement[]>([])
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [history, setHistory] = useState<TemplateElement[][]>([[]])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [templateId, setTemplateId] = useState<string | null>(null)
  
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
      console.log(`Template editor: Updating element with id: ${id}`, updates);
      
      setElements((prevElements) => {
        // Check if the element exists
        const elementExists = prevElements.some(el => el.id === id);
        
        let updatedElements;
        
        if (elementExists) {
          // Update existing element
          console.log(`Template editor: Element ${id} exists, updating it`);
          updatedElements = prevElements.map((el) => (el.id === id ? { ...el, ...updates } : el));
        } else {
          // Create new element with default values
          console.log(`Template editor: Element ${id} doesn't exist, creating it`);
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
        
        console.log('Template editor: Updated elements:', updatedElements);
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

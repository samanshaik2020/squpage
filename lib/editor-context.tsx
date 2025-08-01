"use client"

import type React from "react"
import { createContext, useState, useCallback, useContext, useMemo } from "react"

interface Element {
  id: string
  type: string
  content: any
  styles: any
  url?: string
  position: { x: number; y: number }
}

interface EditorState {
  elements: Element[]
  selectedElement: string | null
  history: Element[][]
  historyIndex: number
  canUndo: boolean
  canRedo: boolean
}

interface EditorActions {
  addElement: (element: Element) => void
  updateElement: (id: string, updates: Partial<Element>) => void
  deleteElement: (id: string) => void
  selectElement: (id: string | null) => void
  undo: () => void
  redo: () => void
  saveToHistory: (currentElements: Element[]) => void // Explicitly pass elements to save
}

export const EditorContext = createContext<(EditorState & EditorActions) | undefined>(undefined) // Added export keyword

export function EditorProvider({ children }: { children: React.ReactNode }) {
  const [elements, setElements] = useState<Element[]>([])
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [history, setHistory] = useState<Element[][]>([[]])
  const [historyIndex, setHistoryIndex] = useState(0)

  const canUndo = historyIndex > 0
  const canRedo = historyIndex < history.length - 1

  const saveToHistory = useCallback(
    (currentElements: Element[]) => {
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
    (element: Element) => {
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
    (id: string, updates: Partial<Element>) => {
      setElements((prevElements) => {
        const updatedElements = prevElements.map((el) => (el.id === id ? { ...el, ...updates } : el))
        saveToHistory(updatedElements)
        return updatedElements
      })
    },
    [saveToHistory],
  )

  const deleteElement = useCallback(
    (id: string) => {
      setElements((prevElements) => {
        const newElements = prevElements.filter((el) => el.id !== id)
        saveToHistory(newElements)
        return newElements
      })
      setSelectedElement((prevSelected) => (prevSelected === id ? null : prevSelected))
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

  const value = useMemo(
    () => ({
      elements,
      selectedElement,
      history,
      historyIndex,
      canUndo,
      canRedo,
      addElement,
      updateElement,
      deleteElement,
      selectElement,
      undo,
      redo,
      saveToHistory,
    }),
    [
      elements,
      selectedElement,
      history,
      historyIndex,
      canUndo,
      canRedo,
      addElement,
      updateElement,
      deleteElement,
      selectElement,
      undo,
      redo,
      saveToHistory,
    ],
  )

  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
}

export function useEditor() {
  const context = useContext(EditorContext)
  if (context === undefined) {
    throw new Error("useEditor must be used within an EditorProvider")
  }
  return context
}

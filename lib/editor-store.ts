"use client"

import { create } from "zustand"

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

  // Actions
  addElement: (element: Element) => void
  updateElement: (id: string, updates: Partial<Element>) => void
  deleteElement: (id: string) => void
  selectElement: (id: string | null) => void
  undo: () => void
  redo: () => void
  saveToHistory: () => void
}

export const useEditorStore = create<EditorState>((set, get) => ({
  elements: [],
  selectedElement: null,
  history: [[]],
  historyIndex: 0,
  canUndo: false,
  canRedo: false,

  addElement: (element) => {
    set((state) => {
      const newElements = [...state.elements, element]
      return {
        elements: newElements,
        selectedElement: element.id,
      }
    })
    get().saveToHistory()
  },

  updateElement: (id, updates) => {
    set((state) => {
      const elementExists = state.elements.some((el) => el.id === id)

      if (elementExists) {
        return {
          elements: state.elements.map((el) => (el.id === id ? { ...el, ...updates } : el)),
        }
      } else {
        // Create new element if it doesn't exist
        const newElement = {
          id,
          type: "text",
          content: "",
          styles: {},
          url: "",
          position: { x: 0, y: 0 },
          ...updates,
        }
        return {
          elements: [...state.elements, newElement],
        }
      }
    })
    // Don't save to history for every update to avoid too many history entries
    // get().saveToHistory()
  },

  deleteElement: (id) => {
    set((state) => ({
      elements: state.elements.filter((el) => el.id !== id),
      selectedElement: state.selectedElement === id ? null : state.selectedElement,
    }))
    get().saveToHistory()
  },

  selectElement: (id) => {
    set({ selectedElement: id })
  },

  saveToHistory: () => {
    set((state) => {
      const newHistory = state.history.slice(0, state.historyIndex + 1)
      newHistory.push([...state.elements])
      const newIndex = newHistory.length - 1
      return {
        history: newHistory,
        historyIndex: newIndex,
        canUndo: newIndex > 0,
        canRedo: false,
      }
    })
  },

  undo: () => {
    set((state) => {
      if (state.historyIndex > 0) {
        const newIndex = state.historyIndex - 1
        return {
          elements: [...state.history[newIndex]],
          historyIndex: newIndex,
          canUndo: newIndex > 0,
          canRedo: true,
        }
      }
      return state
    })
  },

  redo: () => {
    set((state) => {
      if (state.historyIndex < state.history.length - 1) {
        const newIndex = state.historyIndex + 1
        return {
          elements: [...state.history[newIndex]],
          historyIndex: newIndex,
          canUndo: true,
          canRedo: newIndex < state.history.length - 1,
        }
      }
      return state
    })
  },
}))

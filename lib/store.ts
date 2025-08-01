import { create } from "zustand"

interface Element {
  id: string
  type: string
  content: any
  styles: any
  position: { x: number; y: number }
}

interface EditorState {
  elements: Element[]
  selectedElement: string | null
  history: Element[][]
  historyIndex: number

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
    set((state) => ({
      elements: state.elements.map((el) => (el.id === id ? { ...el, ...updates } : el)),
    }))
    get().saveToHistory()
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
      return {
        history: newHistory,
        historyIndex: newHistory.length - 1,
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
        }
      }
      return state
    })
  },
}))

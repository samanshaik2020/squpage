"use client"

import React, { createContext, useContext, useState, useCallback } from "react"

export interface ElementorElement {
  id: string
  type: 'section' | 'row' | 'column' | 'text' | 'heading' | 'image' | 'button' | 'video' | 'spacer' | 'form' | 'pricing-table' | 'testimonial-carousel'
  parentId?: string
  children?: string[]
  content?: string
  formFields?: FormField[]
  pricingFeatures?: PricingFeature[]
  testimonials?: Testimonial[]
  styles?: {
    width?: string
    height?: string
    padding?: string
    margin?: string
    backgroundColor?: string
    color?: string
    fontSize?: string
    fontWeight?: string
    textAlign?: 'left' | 'center' | 'right'
    borderRadius?: string
    border?: string
    boxShadow?: string
    backgroundImage?: string
    backgroundSize?: string
    backgroundPosition?: string
    backgroundRepeat?: string
    backgroundAttachment?: string
    [key: string]: any
  }
  hoverStyles?: {
    backgroundColor?: string
    color?: string
    borderColor?: string
    transform?: string
    [key: string]: any
  }
  settings?: {
    contentWidth?: 'boxed' | 'full-width'
    columnCount?: number
    columnGap?: string
    alignment?: 'left' | 'center' | 'right'
    imageUrl?: string
    linkUrl?: string
    linkTarget?: '_blank' | '_self'
    alt?: string
    backgroundType?: 'color' | 'image' | 'video' | 'slideshow'
    backgroundVideoUrl?: string
    backgroundOverlay?: boolean
    overlayColor?: string
    overlayOpacity?: number
    motionEffects?: {
      scrolling?: boolean
      entrance?: string
      duration?: number
    }
    responsive?: {
      hideOnDesktop?: boolean
      hideOnTablet?: boolean
      hideOnMobile?: boolean
    }
    // Form settings
    submitAction?: 'email' | 'webhook' | 'redirect'
    submitEmail?: string
    webhookUrl?: string
    redirectUrl?: string
    successMessage?: string
    // Pricing Table settings
    currency?: string
    period?: string
    featured?: boolean
    ribbonText?: string
    // Carousel settings
    autoplay?: boolean
    autoplaySpeed?: number
    showDots?: boolean
    showArrows?: boolean
    slidesToShow?: number
    [key: string]: any
  }
}

export interface FormField {
  id: string
  type: 'text' | 'email' | 'textarea' | 'select' | 'checkbox' | 'radio'
  label: string
  placeholder?: string
  required?: boolean
  width?: string
  options?: string[] // for select, radio, checkbox
}

export interface PricingFeature {
  id: string
  text: string
  included: boolean
}

export interface Testimonial {
  id: string
  name: string
  position?: string
  company?: string
  content: string
  image?: string
  rating?: number
}

interface ElementorContextType {
  elements: ElementorElement[]
  selectedElement: string | null
  isPreview: boolean
  setIsPreview: (isPreview: boolean) => void
  addElement: (element: ElementorElement) => void
  updateElement: (id: string, updates: Partial<ElementorElement>) => void
  deleteElement: (id: string) => void
  selectElement: (id: string | null) => void
  moveElement: (elementId: string, newParentId: string | null, index?: number) => void
  getElementChildren: (parentId: string) => ElementorElement[]
  getElementById: (id: string) => ElementorElement | undefined
}

const ElementorContext = createContext<ElementorContextType | undefined>(undefined)

export function ElementorProvider({ children }: { children: React.ReactNode }) {
  const [elements, setElements] = useState<ElementorElement[]>([])
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [isPreview, setIsPreview] = useState<boolean>(false)

  const addElement = useCallback((element: ElementorElement) => {
    setElements(prev => [...prev, element])
  }, [])

  const updateElement = useCallback((id: string, updates: Partial<ElementorElement>) => {
    setElements(prev => prev.map(el => 
      el.id === id ? { ...el, ...updates } : el
    ))
  }, [])

  const deleteElement = useCallback((id: string) => {
    setElements(prev => {
      // Remove the element and update parent's children array
      const elementToDelete = prev.find(el => el.id === id)
      if (elementToDelete?.parentId) {
        const parent = prev.find(el => el.id === elementToDelete.parentId)
        if (parent?.children) {
          parent.children = parent.children.filter(childId => childId !== id)
        }
      }
      return prev.filter(el => el.id !== id)
    })
  }, [])

  const selectElement = useCallback((id: string | null) => {
    setSelectedElement(id)
  }, [])

  const moveElement = useCallback((elementId: string, newParentId: string | null, index?: number) => {
    setElements(prev => {
      const element = prev.find(el => el.id === elementId)
      if (!element) return prev

      // Remove from old parent
      if (element.parentId) {
        const oldParent = prev.find(el => el.id === element.parentId)
        if (oldParent?.children) {
          oldParent.children = oldParent.children.filter(id => id !== elementId)
        }
      }

      // Add to new parent
      if (newParentId) {
        const newParent = prev.find(el => el.id === newParentId)
        if (newParent) {
          if (!newParent.children) newParent.children = []
          if (index !== undefined) {
            newParent.children.splice(index, 0, elementId)
          } else {
            newParent.children.push(elementId)
          }
        }
      }

      // Update element's parentId
      element.parentId = newParentId || undefined

      return [...prev]
    })
  }, [])

  const getElementChildren = useCallback((parentId: string) => {
    const parent = elements.find(el => el.id === parentId)
    if (!parent?.children) return []
    
    return parent.children
      .map(childId => elements.find(el => el.id === childId))
      .filter(Boolean) as ElementorElement[]
  }, [elements])

  const getElementById = useCallback((id: string) => {
    return elements.find(el => el.id === id)
  }, [elements])

  return (
    <ElementorContext.Provider value={{
      elements,
      selectedElement,
      isPreview,
      setIsPreview,
      addElement,
      updateElement,
      deleteElement,
      selectElement,
      moveElement,
      getElementChildren,
      getElementById
    }}>
      {children}
    </ElementorContext.Provider>
  )
}

export function useElementor() {
  const context = useContext(ElementorContext)
  if (context === undefined) {
    throw new Error('useElementor must be used within an ElementorProvider')
  }
  return context
}

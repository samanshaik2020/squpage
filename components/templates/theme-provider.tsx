"use client"

import { useEffect } from 'react'
import { Theme, applyThemeToDocument } from '@/lib/theme-system'

interface ThemeProviderProps {
  theme: Theme
  children: React.ReactNode
}

export function ThemeProvider({ theme, children }: ThemeProviderProps) {
  useEffect(() => {
    // Apply theme to document
    applyThemeToDocument(theme)
    
    // Clean up when component unmounts
    return () => {
      // Reset to default theme if needed
      const root = document.documentElement
      root.classList.remove(
        'theme-modern-minimal',
        'theme-bold-vibrant',
        'theme-elegant-serif',
        'theme-dark-mode',
        'theme-creative-playful'
      )
      root.classList.remove(
        'button-rounded',
        'button-pill',
        'button-square',
        'button-minimal',
        'button-gradient'
      )
      root.classList.remove(
        'card-flat',
        'card-raised',
        'card-bordered',
        'card-floating'
      )
    }
  }, [theme])

  return <>{children}</>
}

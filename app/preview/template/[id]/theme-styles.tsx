"use client"

import { useEffect } from 'react'
import { getThemeById } from '@/lib/theme-system'

interface ThemeStylesProps {
  themeId?: string
}

export function ThemeStyles({ themeId = 'modern-minimal' }: ThemeStylesProps) {
  useEffect(() => {
    // Get the theme
    const theme = getThemeById(themeId)
    
    // Apply theme to document
    const root = document.documentElement
    
    // Apply colors
    root.style.setProperty('--color-primary', theme.colors.primary)
    root.style.setProperty('--color-secondary', theme.colors.secondary)
    root.style.setProperty('--color-accent', theme.colors.accent)
    root.style.setProperty('--color-background', theme.colors.background)
    root.style.setProperty('--color-text', theme.colors.text)
    root.style.setProperty('--color-heading', theme.colors.heading)
    root.style.setProperty('--color-button-bg', theme.colors.button.background)
    root.style.setProperty('--color-button-text', theme.colors.button.text)
    root.style.setProperty('--color-button-hover', theme.colors.button.hover)
    root.style.setProperty('--color-card-bg', theme.colors.card.background)
    root.style.setProperty('--color-card-border', theme.colors.card.border)
    root.style.setProperty('--color-footer-bg', theme.colors.footer.background)
    root.style.setProperty('--color-footer-text', theme.colors.footer.text)
    
    // Apply typography
    root.style.setProperty('--font-heading', theme.typography.headingFont)
    root.style.setProperty('--font-body', theme.typography.bodyFont)
    root.style.setProperty('--font-size-base', theme.typography.fontSize.base)
    root.style.setProperty('--font-size-h1', theme.typography.fontSize.heading1)
    root.style.setProperty('--font-size-h2', theme.typography.fontSize.heading2)
    root.style.setProperty('--font-size-h3', theme.typography.fontSize.heading3)
    
    // Apply styles
    root.style.setProperty('--border-radius', theme.styles.borderRadius)
    root.style.setProperty('--box-shadow', theme.styles.boxShadow)
    root.style.setProperty('--spacing-section', theme.styles.spacing.section)
    root.style.setProperty('--spacing-element', theme.styles.spacing.element)
    
    // Add theme-specific classes
    root.classList.remove(
      'theme-modern-minimal',
      'theme-bold-vibrant',
      'theme-elegant-serif',
      'theme-dark-mode',
      'theme-creative-playful'
    )
    root.classList.add(`theme-${theme.id}`)
    
    // Add button style class
    root.classList.remove(
      'button-rounded',
      'button-pill',
      'button-square',
      'button-minimal',
      'button-gradient'
    )
    root.classList.add(`button-${theme.styles.buttonStyle}`)
    
    // Add card style class
    root.classList.remove(
      'card-flat',
      'card-raised',
      'card-bordered',
      'card-floating'
    )
    root.classList.add(`card-${theme.styles.cardStyle}`)
    
    // Clean up when component unmounts
    return () => {
      // Reset to default theme if needed
      root.classList.remove(
        'theme-modern-minimal',
        'theme-bold-vibrant',
        'theme-elegant-serif',
        'theme-dark-mode',
        'theme-creative-playful',
        'button-rounded',
        'button-pill',
        'button-square',
        'button-minimal',
        'button-gradient',
        'card-flat',
        'card-raised',
        'card-bordered',
        'card-floating'
      )
    }
  }, [themeId])

  return null
}

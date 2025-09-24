"use client"

import { useState } from 'react'
import { Theme } from '@/lib/theme-system'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

interface ThemePreviewProps {
  theme: Theme
  isSelected: boolean
  onClick: () => void
}

export function ThemePreview({ theme, isSelected, onClick }: ThemePreviewProps) {
  const [isHovered, setIsHovered] = useState(false)
  
  // Generate inline styles based on theme
  const previewStyles = {
    container: {
      borderColor: isSelected ? theme.colors.primary : theme.colors.card.border,
      borderWidth: isSelected ? '2px' : '1px',
      borderRadius: theme.styles.borderRadius,
      boxShadow: isHovered || isSelected ? theme.styles.boxShadow : 'none',
      transition: 'all 0.2s ease',
    },
    header: {
      backgroundColor: theme.colors.primary,
      color: theme.colors.button.text,
      borderTopLeftRadius: theme.styles.borderRadius,
      borderTopRightRadius: theme.styles.borderRadius,
      fontFamily: theme.typography.headingFont,
    },
    body: {
      backgroundColor: theme.colors.background,
      color: theme.colors.text,
      fontFamily: theme.typography.bodyFont,
    },
    heading: {
      color: theme.colors.heading,
      fontFamily: theme.typography.headingFont,
    },
    button: {
      backgroundColor: theme.colors.button.background,
      color: theme.colors.button.text,
      borderRadius: theme.styles.buttonStyle === 'pill' ? '9999px' : 
                   theme.styles.buttonStyle === 'square' ? '0' : 
                   theme.styles.borderRadius,
    },
    card: {
      backgroundColor: theme.colors.card.background,
      borderColor: theme.colors.card.border,
      borderRadius: theme.styles.borderRadius,
      boxShadow: theme.styles.cardStyle === 'flat' ? 'none' : theme.styles.boxShadow,
    },
    footer: {
      backgroundColor: theme.colors.footer.background,
      color: theme.colors.footer.text,
      borderBottomLeftRadius: theme.styles.borderRadius,
      borderBottomRightRadius: theme.styles.borderRadius,
    },
    checkmark: {
      backgroundColor: theme.colors.primary,
      color: theme.colors.button.text,
    }
  }

  return (
    <div 
      className={cn(
        "relative cursor-pointer overflow-hidden transition-all duration-200",
        isSelected ? "ring-2 ring-offset-2" : "hover:scale-105"
      )}
      style={previewStyles.container}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Theme preview miniature */}
      <div className="w-full h-32 flex flex-col">
        {/* Header */}
        <div 
          className="h-6 px-2 flex items-center text-xs"
          style={previewStyles.header}
        >
          {theme.name}
        </div>
        
        {/* Body */}
        <div 
          className="flex-1 p-2 flex flex-col gap-1"
          style={previewStyles.body}
        >
          {/* Heading */}
          <div 
            className="text-xs font-bold"
            style={previewStyles.heading}
          >
            Sample Heading
          </div>
          
          {/* Text */}
          <div className="text-[8px] mb-1">
            Lorem ipsum dolor sit amet consectetur.
          </div>
          
          {/* Button */}
          <div 
            className="text-[8px] py-1 px-2 w-fit text-center"
            style={previewStyles.button}
          >
            Button
          </div>
          
          {/* Card */}
          <div 
            className="text-[8px] p-1 mt-1 border"
            style={previewStyles.card}
          >
            Card element
          </div>
        </div>
        
        {/* Footer */}
        <div 
          className="h-4 px-2 flex items-center text-[8px]"
          style={previewStyles.footer}
        >
          Footer
        </div>
      </div>
      
      {/* Theme name */}
      <div className="text-xs font-medium text-center py-1 bg-white dark:bg-gray-800">
        {theme.name}
      </div>
      
      {/* Selected indicator */}
      {isSelected && (
        <div 
          className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
          style={previewStyles.checkmark}
        >
          <Check className="w-3 h-3" />
        </div>
      )}
    </div>
  )
}

interface ThemeSelectionProps {
  themes: Theme[]
  selectedThemeId: string
  onSelectTheme: (themeId: string) => void
}

export function ThemeSelection({ themes, selectedThemeId, onSelectTheme }: ThemeSelectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Select a Theme
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {themes.map((theme) => (
          <ThemePreview
            key={theme.id}
            theme={theme}
            isSelected={selectedThemeId === theme.id}
            onClick={() => onSelectTheme(theme.id)}
          />
        ))}
      </div>
    </div>
  )
}

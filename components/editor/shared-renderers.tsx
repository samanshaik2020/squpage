"use client"

import React from "react"
import { ElementorElement } from "@/lib/elementor-context"
import { EditableText } from "./editable-text"
import { EditableTestimonial } from "./editable-testimonial"

interface SharedRendererProps {
  element: ElementorElement
  children?: ElementorElement[]
  isEditable?: boolean
  isSelected?: boolean
  onElementClick?: (e: React.MouseEvent, elementId: string) => void
  renderElement?: (element: ElementorElement) => React.ReactNode
}

export function SectionRenderer({ 
  element, 
  children = [], 
  isEditable = false, 
  isSelected = false, 
  onElementClick,
  renderElement 
}: SharedRendererProps) {
  const sectionStyle: React.CSSProperties = {
    backgroundColor: element.settings?.backgroundType === 'color' ? element.styles?.backgroundColor || '#ffffff' : 'transparent',
    padding: element.styles?.padding || '40px',
    margin: element.styles?.margin || '0px',
    minHeight: element.styles?.height || '400px',
    position: 'relative',
    overflow: 'hidden'
  }

  if (element.settings?.backgroundType === 'image' && element.styles?.backgroundImage) {
    sectionStyle.backgroundImage = element.styles.backgroundImage
    sectionStyle.backgroundSize = element.styles?.backgroundSize || 'cover'
    sectionStyle.backgroundPosition = element.styles?.backgroundPosition || 'center'
    sectionStyle.backgroundRepeat = element.styles?.backgroundRepeat || 'no-repeat'
    sectionStyle.backgroundAttachment = element.styles?.backgroundAttachment || 'scroll'
  }

  const handleClick = (e: React.MouseEvent) => {
    if (isEditable && onElementClick) {
      e.stopPropagation()
      onElementClick(e, element.id)
    }
  }

  return (
    <div
      className={`relative ${isEditable ? 'border-2 transition-all duration-200' : ''} ${
        isSelected ? 'border-blue-500 bg-blue-50/20' : 'border-transparent hover:border-blue-300'
      }`}
      style={sectionStyle}
      onClick={handleClick}
    >
      {/* Background Video */}
      {element.settings?.backgroundType === 'video' && element.settings?.backgroundVideoUrl && (
        <video
          autoPlay
          muted
          loop
          className="absolute inset-0 w-full h-full object-cover z-0"
          style={{ pointerEvents: 'none' }}
        >
          <source src={element.settings.backgroundVideoUrl} type="video/mp4" />
        </video>
      )}

      {/* Background Overlay */}
      {element.settings?.backgroundOverlay && (
        <div
          className="absolute inset-0 z-10"
          style={{
            backgroundColor: element.settings?.overlayColor || '#000000',
            opacity: (element.settings?.overlayOpacity || 50) / 100
          }}
        />
      )}

      <div className="relative z-20">
        {children.length === 0 && isEditable ? (
          <div className="flex items-center justify-center h-full border-2 border-dashed border-gray-300 rounded-lg min-h-[200px]">
            <div className="text-center text-gray-500">
              <p className="text-sm">Drop a Row here</p>
              <p className="text-xs mt-1 opacity-75">Choose 1, 2, 3, or 4 columns</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {children.map(child => (
              <React.Fragment key={child.id}>
                {renderElement ? renderElement(child) : null}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export function RowRenderer({ 
  element, 
  children = [], 
  isEditable = false, 
  isSelected = false, 
  onElementClick,
  renderElement 
}: SharedRendererProps) {
  const handleClick = (e: React.MouseEvent) => {
    if (isEditable && onElementClick) {
      e.stopPropagation()
      onElementClick(e, element.id)
    }
  }

  // Get column count from settings or calculate from children length
  const columnCount = element.settings?.columnCount || children.length || 2

  return (
    <div
      className={`relative ${isEditable ? 'border-2 transition-all duration-200' : ''} ${
        isSelected ? 'border-green-500 bg-green-50/20' : 'border-transparent hover:border-green-300'
      }`}
      style={{
        padding: element.styles?.padding || '10px'
      }}
      onClick={handleClick}
    >
      {isEditable && isSelected && (
        <div className="absolute -top-6 left-0 bg-green-500 text-white px-2 py-1 text-xs rounded z-10">
          Row ({columnCount} columns)
        </div>
      )}
      <div 
        className="flex flex-wrap"
        style={{
          gap: element.settings?.columnGap || '20px'
        }}
      >
        {children.map(child => (
          <React.Fragment key={child.id}>
            {renderElement ? renderElement(child) : null}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

export function ColumnRenderer({ 
  element, 
  children = [], 
  isEditable = false, 
  isSelected = false, 
  onElementClick,
  renderElement 
}: SharedRendererProps) {
  const handleClick = (e: React.MouseEvent) => {
    if (isEditable && onElementClick) {
      e.stopPropagation()
      onElementClick(e, element.id)
    }
  }

  // Get alignment setting or default to left
  const alignment = element.settings?.alignment || 'left'
  
  // Create alignment style
  const getAlignmentStyle = () => {
    switch (alignment) {
      case 'center': return { textAlign: 'center' as const }
      case 'right': return { textAlign: 'right' as const }
      default: return { textAlign: 'left' as const }
    }
  }

  return (
    <div
      className={`relative ${isEditable ? 'border-2 transition-all duration-200' : ''} ${
        isSelected ? 'border-purple-500 bg-purple-50/20' : 'border-transparent hover:border-purple-300'
      }`}
      style={{
        width: element.styles?.width || '50%',
        padding: element.styles?.padding || '15px',
        ...getAlignmentStyle(),
        ...element.styles
      }}
      onClick={handleClick}
    >
      {isEditable && isSelected && (
        <div className="absolute -top-6 left-0 bg-purple-500 text-white px-2 py-1 text-xs rounded z-10">
          Column ({element.styles?.width || '50%'})
        </div>
      )}
      {children.length === 0 && isEditable ? (
        <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg min-h-[100px]">
          <div className="text-center text-gray-500">
            <p className="text-sm">Drop elements here</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {children.map(child => (
            <React.Fragment key={child.id}>
              {renderElement ? renderElement(child) : null}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  )
}

export function HeadlineRenderer({ 
  element, 
  isEditable = false, 
  isSelected = false, 
  onElementClick 
}: SharedRendererProps) {
  const handleClick = (e: React.MouseEvent) => {
    if (isEditable && onElementClick) {
      e.stopPropagation()
      onElementClick(e, element.id)
    }
  }

  if (isEditable) {
    return (
      <div
        className={`relative ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
        onClick={handleClick}
        style={{
          ...element.styles,
          cursor: isEditable ? 'pointer' : 'default'
        }}
      >
        <EditableText 
          element={element} 
          isSelected={isSelected}
          elementType="headline"
          placeholder="Your Heading Here"
        />
      </div>
    )
  }

  return (
    <div
      style={{
        ...element.styles,
        fontSize: element.styles?.fontSize || '32px',
        fontWeight: element.styles?.fontWeight || 'bold',
        color: element.styles?.color || '#000000',
        textAlign: element.styles?.textAlign || 'left',
        margin: element.styles?.margin || '0 0 16px 0'
      }}
    >
      {element.content || 'Your Heading Here'}
    </div>
  )
}

export function TextRenderer({ 
  element, 
  isEditable = false, 
  isSelected = false, 
  onElementClick 
}: SharedRendererProps) {
  const handleClick = (e: React.MouseEvent) => {
    if (isEditable && onElementClick) {
      e.stopPropagation()
      onElementClick(e, element.id)
    }
  }

  if (isEditable) {
    return (
      <div
        className={`relative ${isSelected ? 'ring-2 ring-indigo-500' : ''}`}
        onClick={handleClick}
        style={{
          ...element.styles,
          cursor: isEditable ? 'pointer' : 'default'
        }}
      >
        <EditableText 
          element={element} 
          isSelected={isSelected}
          elementType="text"
          placeholder="Your text content here. Click to edit this text and add your own content."
        />
      </div>
    )
  }

  return (
    <div
      style={{
        ...element.styles,
        fontSize: element.styles?.fontSize || '16px',
        fontWeight: element.styles?.fontWeight || 'normal',
        color: element.styles?.color || '#000000',
        textAlign: element.styles?.textAlign || 'left',
        lineHeight: element.styles?.lineHeight || '1.6',
        margin: element.styles?.margin || '0 0 16px 0'
      }}
    >
      {element.content || 'Your text content here. Click to edit this text and add your own content.'}
    </div>
  )
}

export function ImageRenderer({ 
  element, 
  isEditable = false, 
  isSelected = false, 
  onElementClick 
}: SharedRendererProps) {
  const handleClick = (e: React.MouseEvent) => {
    if (isEditable && onElementClick) {
      e.stopPropagation()
      onElementClick(e, element.id)
    }
  }

  return (
    <div
      className={`relative ${isSelected ? 'ring-2 ring-orange-500' : ''}`}
      onClick={handleClick}
      style={{
        textAlign: element.styles?.textAlign || 'left',
        cursor: isEditable ? 'pointer' : 'default'
      }}
    >
      <img
        src={element.settings?.imageUrl || 'https://via.placeholder.com/400x200/e2e8f0/64748b?text=Image+Placeholder'}
        alt={element.settings?.alt || 'Image'}
        style={{
          width: element.styles?.width || '100%',
          borderRadius: element.styles?.borderRadius || '0px',
          ...element.styles
        }}
      />
    </div>
  )
}

export function ButtonRenderer({ 
  element, 
  isEditable = false, 
  isSelected = false, 
  onElementClick 
}: SharedRendererProps) {
  const handleClick = (e: React.MouseEvent) => {
    if (isEditable && onElementClick) {
      e.stopPropagation()
      onElementClick(e, element.id)
    }
  }

  const buttonStyle = {
    fontSize: element.styles?.fontSize || '16px',
    fontWeight: element.styles?.fontWeight || 'normal',
    color: element.styles?.color || '#ffffff',
    backgroundColor: element.styles?.backgroundColor || '#007bff',
    borderRadius: element.styles?.borderRadius || '4px',
    padding: element.styles?.padding || '12px 24px',
    textAlign: element.styles?.textAlign || 'center',
    display: 'inline-block',
    cursor: 'pointer',
    border: 'none',
    textDecoration: 'none',
    ...element.styles
  } as React.CSSProperties

  if (isEditable) {
    return (
      <div
        className={`relative ${isSelected ? 'ring-2 ring-red-500' : ''}`}
        onClick={handleClick}
      >
        <button style={buttonStyle}>
          {element.content || 'Click Me'}
        </button>
      </div>
    )
  }

  if (element.settings?.linkUrl) {
    return (
      <a
        href={element.settings.linkUrl}
        target={element.settings?.linkTarget || '_self'}
        style={buttonStyle}
      >
        {element.content || 'Click Me'}
      </a>
    )
  }

  return (
    <button style={buttonStyle}>
      {element.content || 'Click Me'}
    </button>
  )
}

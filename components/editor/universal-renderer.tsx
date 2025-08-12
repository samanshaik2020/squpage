"use client"

import React from "react"
import { ElementorElement } from "@/lib/elementor-context"
import { 
  SectionRenderer, 
  RowRenderer, 
  ColumnRenderer, 
  HeadlineRenderer, 
  TextRenderer, 
  ImageRenderer, 
  ButtonRenderer 
} from "./shared-renderers"

interface UniversalRendererProps {
  elements: ElementorElement[]
  isEditable?: boolean
  selectedElement?: string | null
  onElementClick?: (e: React.MouseEvent, elementId: string) => void
  getElementChildren?: (parentId: string) => ElementorElement[]
}

export function UniversalRenderer({ 
  elements, 
  isEditable = false, 
  selectedElement = null, 
  onElementClick,
  getElementChildren 
}: UniversalRendererProps) {
  
  const renderElement = (element: ElementorElement): React.ReactNode => {
    const isSelected = selectedElement === element.id
    const children = getElementChildren ? getElementChildren(element.id) : []

    // Check responsive visibility
    const shouldHide = () => {
      // For preview mode, we don't have viewMode, so we assume desktop
      if (!isEditable && element.settings?.responsive?.hideOnDesktop) return true
      return false
    }

    if (shouldHide()) {
      return null
    }

    switch (element.type) {
      case 'section':
        return (
          <SectionRenderer
            key={element.id}
            element={element}
            children={children}
            isEditable={isEditable}
            isSelected={isSelected}
            onElementClick={onElementClick}
            renderElement={renderElement}
          />
        )

      case 'row':
        return (
          <RowRenderer
            key={element.id}
            element={element}
            children={children}
            isEditable={isEditable}
            isSelected={isSelected}
            onElementClick={onElementClick}
            renderElement={renderElement}
          />
        )

      case 'column':
        return (
          <ColumnRenderer
            key={element.id}
            element={element}
            children={children}
            isEditable={isEditable}
            isSelected={isSelected}
            onElementClick={onElementClick}
            renderElement={renderElement}
          />
        )

      case 'heading':
      case 'headline':
        return (
          <HeadlineRenderer
            key={element.id}
            element={element}
            isEditable={isEditable}
            isSelected={isSelected}
            onElementClick={onElementClick}
          />
        )

      case 'text':
        return (
          <TextRenderer
            key={element.id}
            element={element}
            isEditable={isEditable}
            isSelected={isSelected}
            onElementClick={onElementClick}
          />
        )

      case 'image':
        return (
          <ImageRenderer
            key={element.id}
            element={element}
            isEditable={isEditable}
            isSelected={isSelected}
            onElementClick={onElementClick}
          />
        )

      case 'button':
        return (
          <ButtonRenderer
            key={element.id}
            element={element}
            isEditable={isEditable}
            isSelected={isSelected}
            onElementClick={onElementClick}
          />
        )

      case 'video':
        return (
          <div
            key={element.id}
            className={`relative ${isSelected ? 'ring-2 ring-pink-500' : ''}`}
            onClick={(e) => isEditable && onElementClick && onElementClick(e, element.id)}
            style={{
              width: element.styles?.width || '100%',
              aspectRatio: element.styles?.aspectRatio || '16/9',
              borderRadius: element.styles?.borderRadius || '0px',
              cursor: isEditable ? 'pointer' : 'default'
            }}
          >
            {element.settings?.videoUrl ? (
              <iframe
                src={element.settings.videoUrl}
                className="w-full h-full"
                style={{ borderRadius: element.styles?.borderRadius || '0px' }}
                allowFullScreen
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <p className="text-gray-500">Video Placeholder</p>
              </div>
            )}
          </div>
        )

      case 'spacer':
        return (
          <div
            key={element.id}
            className={`relative ${isSelected ? 'ring-2 ring-gray-500' : ''}`}
            onClick={(e) => isEditable && onElementClick && onElementClick(e, element.id)}
            style={{
              height: element.styles?.height || '50px',
              width: element.styles?.width || '100%',
              cursor: isEditable ? 'pointer' : 'default'
            }}
          >
            {isSelected && isEditable && (
              <div className="text-center text-gray-400">
                <p className="text-xs">Spacer: {element.styles?.height || '50px'}</p>
              </div>
            )}
          </div>
        )

      case 'form':
        return (
          <div
            key={element.id}
            className={`relative ${isSelected ? 'ring-2 ring-yellow-500' : ''}`}
            style={element.styles}
            onClick={(e) => isEditable && onElementClick && onElementClick(e, element.id)}
          >
            <form onSubmit={(e) => e.preventDefault()}>
              {element.formFields?.map((field: any) => (
                <div key={field.id} className="mb-4" style={{ width: field.width }}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea
                      placeholder={field.placeholder}
                      required={field.required}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={4}
                    />
                  ) : field.type === 'select' ? (
                    <select
                      required={field.required}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">{field.placeholder}</option>
                      {field.options?.map((option: string, index: number) => (
                        <option key={index} value={option}>{option}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      required={field.required}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                </div>
              ))}
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Submit
              </button>
            </form>
          </div>
        )

      case 'pricing-table':
        return (
          <div
            key={element.id}
            className={`relative ${isSelected ? 'ring-2 ring-green-500' : ''}`}
            style={element.styles}
            onClick={(e) => isEditable && onElementClick && onElementClick(e, element.id)}
          >
            {element.settings?.featured && element.settings?.ribbonText && (
              <div className="absolute -top-3 -right-3 bg-red-500 text-white px-3 py-1 text-xs font-bold rounded-full transform rotate-12 z-10">
                {element.settings.ribbonText}
              </div>
            )}
            
            <div className="text-center">
              <h3 className="text-xl font-bold mb-2">{element.content || 'Basic Plan'}</h3>
              <div className="text-3xl font-bold mb-4">
                {element.settings?.currency || '$'}99
                <span className="text-lg font-normal text-gray-600">
                  {element.settings?.period || '/month'}
                </span>
              </div>
              
              <ul className="space-y-2 mb-6">
                {element.pricingFeatures?.map((feature: any) => (
                  <li key={feature.id} className="flex items-center justify-center">
                    <span className={`mr-2 ${feature.included ? 'text-green-500' : 'text-red-500'}`}>
                      {feature.included ? '✓' : '✗'}
                    </span>
                    <span className={feature.included ? '' : 'line-through text-gray-400'}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
              
              <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
                Choose Plan
              </button>
            </div>
          </div>
        )

      case 'testimonial-carousel':
        return (
          <div
            key={element.id}
            className={`relative ${isSelected ? 'ring-2 ring-purple-500' : ''}`}
            style={element.styles}
            onClick={(e) => isEditable && onElementClick && onElementClick(e, element.id)}
          >
            {element.testimonials && element.testimonials.length > 0 && (
              <div className="text-center">
                {/* For simplicity, just show the first testimonial in preview */}
                {element.testimonials.slice(0, 1).map((testimonial: any) => (
                  <div key={testimonial.id} className="max-w-2xl mx-auto">
                    <div className="flex justify-center mb-4">
                      {[...Array(testimonial.rating || 5)].map((_, i) => (
                        <span key={i} className="text-yellow-400 text-xl">★</span>
                      ))}
                    </div>
                    <blockquote className="text-lg italic mb-6">
                      "{testimonial.content}"
                    </blockquote>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-gray-600">
                      {testimonial.position}
                      {testimonial.company && `, ${testimonial.company}`}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )

      default:
        return (
          <div key={element.id} className="p-4 bg-gray-100 border border-gray-300 rounded">
            <p className="text-gray-600">Unknown element type: {element.type}</p>
          </div>
        )
    }
  }

  // Get root elements (elements without parentId)
  const rootElements = elements.filter(element => !element.parentId)

  return (
    <div className="space-y-4">
      {rootElements.map(element => (
        <React.Fragment key={element.id}>
          {renderElement(element)}
        </React.Fragment>
      ))}
    </div>
  )
}

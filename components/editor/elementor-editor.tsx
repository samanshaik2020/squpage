"use client"

import React, { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import ColumnElement from './column-element'
import { 
  Type, 
  Square, 
  Image, 
  Layout, 
  Video, 
  MousePointer,
  Plus,
  Eye,
  Save,
  Undo,
  Redo,
  Monitor,
  Tablet,
  Smartphone,
  Columns,
  Rows,
  FileText,
  DollarSign,
  MessageSquare,
  Check,
  Edit,
  Trash
} from "lucide-react"
import Link from "next/link"
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { ElementorProvider, useElementor, ElementorElement } from "@/lib/elementor-context"
import { ElementorPropertiesPanel } from "./elementor-properties-panel"
import { SidePanelStructureSelector } from "./side-panel-structure-selector"
import { EditableText } from "./editable-text"
import { EditableTestimonial, TestimonialElement, TestimonialItem } from "./editable-testimonial"
import { ColumnStructureSelector } from "./column-structure-selector"
import { AddStructureButton } from "./add-structure-button"
import { StructureOption } from "./structure-option"

interface ElementorEditorProps {
  // Removed templateId - Elementor editor is independent
}

// Define the available elements for the side panel
const AVAILABLE_ELEMENTS = [
  {
    id: 'headline',
    name: 'Headline',
    icon: Type,
    description: 'Add a heading text'
  },
  {
    id: 'text',
    name: 'Text',
    icon: Type,
    description: 'Add paragraph text'
  },
  {
    id: 'image',
    name: 'Image',
    icon: Image,
    description: 'Add an image'
  },
  {
    id: 'button',
    name: 'Button',
    icon: MousePointer,
    description: 'Add a clickable button'
  },
  {
    id: 'video',
    name: 'Video',
    icon: Video,
    description: 'Add a video player'
  },
  {
    id: 'spacer',
    name: 'Spacer',
    icon: Square,
    description: 'Add spacing between elements'
  },
  {
    id: 'form',
    name: 'Form',
    icon: FileText,
    description: 'Add a contact or lead form'
  },
  {
    id: 'pricing-table',
    name: 'Pricing Table',
    icon: DollarSign,
    description: 'Add a pricing table with features'
  },
  {
    id: 'testimonial-carousel',
    name: 'Testimonials',
    icon: MessageSquare,
    description: 'Add a testimonial carousel'
  }
]

export function ElementorEditor(): React.ReactElement {
  return (
    <ElementorProvider>
      <ElementorEditorContent />
    </ElementorProvider>
  )
}

const ElementorEditorContent = (): React.ReactElement => {
  // Destructure context
  const {
    elements,
    selectedElement,
    isPreview,
    setIsPreview,
    selectElement,
    addElement,
    updateElement,
    deleteElement,
    moveElement,
    getElementChildren
  } = useElementor()

  // State for showing structure selector
  const [showStructureSelector, setShowStructureSelector] = useState(false)
  const [showProperties, setShowProperties] = useState(false)
  const [viewMode, setViewMode] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const [activeId, setActiveId] = useState<string | null>(null)
  
  // Helper function to generate unique IDs
  const generateId = () => {
    return `element_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  }
  
  // Filter root elements (columns)
  const rootElements = elements.filter((el: ElementorElement) => el.type === 'column')
  
  // Sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  // Function to get viewport width based on selected view mode
  const getViewportWidth = (): string => {
    switch (viewMode) {
      case "desktop":
        return "100%"
      case "tablet":
        return "768px"
      case "mobile":
        return "375px"
      default:
        return "100%"
    }
  }

  // Handle structure selection
  const handleStructureSelect = useCallback((structure: any) => {
    setShowStructureSelector(false)
    structure.columns.forEach((width: number) => {
      const columnId = generateId()
      addElement({
        id: columnId,
        type: 'column',
        children: [],
        styles: {
          width: `${width}%`,
          padding: '10px',
          float: 'left',
          boxSizing: 'border-box'
        },
        settings: {
          alignment: 'left'
        }
      })
    })
  }, [addElement])

  function handleDragStart(event: DragStartEvent) {
    const id = event.active.id as string
    setActiveId(id)
    
    // Show structure selector if the Add Structure element is dragged
    if (id === 'add-structure') {
      // We'll show the structure selector on drag end instead
      // This allows the drag operation to complete normally
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const activeId = event.active.id as string
    const overId = event.over?.id as string
    setActiveId(null)
    
    // We don't need to handle add-structure drag anymore since we're using the SidePanelStructureSelector
    // instead of draggable column elements
    
    if (overId && AVAILABLE_ELEMENTS.some(el => el.id === activeId)) {
      // Handle dropping an element from the side panel
      handleElementDrop(activeId, overId)
    }
  }
  
  // Function to create a new element based on element type
  const createNewElement = useCallback((elementType: string) => {
    const id = generateId()
    const newElement = {
      id,
      type: elementType,
      children: [],
      styles: {},
      settings: {}
    }
    
    return newElement
  }, [])

  // Handle element drop
  function handleElementDrop(elementType: string, overId: string) {
    if (['heading', 'text', 'image', 'button', 'form', 'pricing-table', 'testimonial-carousel'].includes(elementType)) {
      // Content elements can be dropped inside columns or directly in the editor
      const targetElement = elements.find((el: ElementorElement) => el.id === overId)
      if (targetElement?.type === 'column' || overId === 'editor-canvas') {
        const id = generateId()
        let newElement: ElementorElement = {
          id,
          type: elementType as any,
          parentId: overId === 'editor-canvas' ? undefined : overId,
          children: [],
          styles: {},
          settings: {}
        }
          
          switch (elementType) {
            case 'heading':
              newElement = {
                ...newElement,
                content: 'Your Heading Here',
                styles: {
                  fontSize: '32px',
                  fontWeight: 'bold',
                  color: '#000000',
                  textAlign: 'left',
                  margin: '0'
                }
              }
              break
              
            case 'text':
              newElement = {
                ...newElement,
                content: 'Your text content here. Click to edit this text and add your own content.',
                styles: {
                  fontSize: '16px',
                  fontWeight: 'normal',
                  color: '#000000',
                  textAlign: 'left',
                  lineHeight: '1.6',
                  margin: '0'
                }
              }
              break
              
            case 'image':
              newElement = {
                ...newElement,
                styles: {
                  width: '100%',
                  textAlign: 'left',
                  borderRadius: '0px'
                },
                settings: {
                  imageUrl: 'https://via.placeholder.com/400x200/e2e8f0/64748b?text=Image+Placeholder',
                  alt: 'Placeholder image'
                }
              }
              break
              
            case 'button':
              newElement = {
                ...newElement,
                content: 'Click Me',
                styles: {
                  fontSize: '16px',
                  fontWeight: 'normal',
                  color: '#ffffff',
                  backgroundColor: '#007bff',
                  borderRadius: '4px',
                  padding: '12px 24px',
                  textAlign: 'center',
                  display: 'inline-block',
                  cursor: 'pointer'
                },
                settings: {
                  linkUrl: '',
                  linkTarget: '_self'
                }
              }
              break
              
            case 'video':
              newElement = {
                ...newElement,
                styles: {
                  width: '100%',
                  aspectRatio: '16/9',
                  borderRadius: '0px'
                },
                settings: {
                  videoUrl: ''
                }
              }
              break
              
            case 'spacer':
              newElement = {
                ...newElement,
                styles: {
                  height: '50px',
                  width: '100%'
                }
              }
              break
              
            case 'form':
              newElement = {
                ...newElement,
                formFields: [
                  {
                    id: generateId(),
                    type: 'text',
                    label: 'Name',
                    placeholder: 'Enter your name',
                    required: true,
                    width: '100%'
                  },
                  {
                    id: generateId(),
                    type: 'email',
                    label: 'Email',
                    placeholder: 'Enter your email',
                    required: true,
                    width: '100%'
                  },
                  {
                    id: generateId(),
                    type: 'textarea',
                    label: 'Message',
                    placeholder: 'Enter your message',
                    required: false,
                    width: '100%'
                  }
                ],
                styles: {
                  padding: '20px',
                  backgroundColor: '#ffffff',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0'
                },
                settings: {
                  submitAction: 'email',
                  submitEmail: '',
                  successMessage: 'Thank you for your message!'
                }
              }
              break
              
            case 'pricing-table':
              newElement = {
                ...newElement,
                content: 'Basic Plan',
                pricingFeatures: [
                  { id: generateId(), text: 'Feature 1', included: true },
                  { id: generateId(), text: 'Feature 2', included: true },
                  { id: generateId(), text: 'Feature 3', included: false }
                ],
                styles: {
                  padding: '30px',
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  textAlign: 'center'
                },
                settings: {
                  currency: '$',
                  period: '/month',
                  featured: false,
                  ribbonText: 'Popular'
                }
              }
              break
              
            case 'testimonial-carousel':
              newElement = {
                ...newElement,
                testimonials: [
                  {
                    id: generateId(),
                    name: 'John Doe',
                    position: 'CEO',
                    company: 'Company Inc.',
                    content: 'This is an amazing product that has transformed our business.',
                    rating: 5
                  },
                  {
                    id: generateId(),
                    name: 'Jane Smith',
                    position: 'Marketing Director',
                    company: 'Business Corp.',
                    content: 'Highly recommend this service to anyone looking for quality.',
                    rating: 5
                  }
                ],
                styles: {
                  padding: '40px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '12px'
                },
                settings: {
                  autoplay: true,
                  autoplaySpeed: 3000
                }
              }
              break
          }
        
        // Add the new element to the editor
        addElement(newElement)
      }
    }
  }
  
  const DeleteButton = ({ elementId, elementType }: { elementId: string, elementType: string }) => {
    const handleDelete = (e: React.MouseEvent) => {
      e.stopPropagation()
      if (confirm(`Are you sure you want to delete this ${elementType} element?`)) {
        deleteElement(elementId)
      }
    }
    
    return (
      <Button 
        variant="destructive" 
        size="icon" 
        className="absolute -top-6 right-0 h-6 w-6 rounded-full" 
        onClick={handleDelete}
      >
        <Trash className="h-3 w-3" />
      </Button>
    )
  }

  const renderElement = (element: ElementorElement): React.ReactNode => {
    const isSelected = !isPreview && selectedElement === element.id
    const isParentOfSelected = !isPreview && !isSelected && selectedElement && elements.find(el => el.id === selectedElement)?.parentId === element.id
    const children = getElementChildren(element.id)
    
    const handleElementClick = (e: React.MouseEvent) => {
      if (isPreview) return // Disable element selection in preview mode
      e.stopPropagation()
      selectElement(element.id)
      setShowProperties(true)
    }

    // Check responsive visibility
    const shouldHide = () => {
      if (viewMode === 'desktop' && element.settings?.responsive?.hideOnDesktop) return true
      if (viewMode === 'tablet' && element.settings?.responsive?.hideOnTablet) return true
      if (viewMode === 'mobile' && element.settings?.responsive?.hideOnMobile) return true
      return false
    }

    if (shouldHide()) {
      return null
    }

    switch (element.type) {
      case 'column':
        return (
          <ColumnElement 
            element={element} 
            isSelected={isSelected} 
            isPreview={isPreview}
            children={children} 
            handleElementClick={handleElementClick} 
            renderElement={renderElement}
            addElement={addElement}
            updateElement={updateElement}
            elements={elements}
            generateId={generateId}
          />
        )

      case 'heading':
        return (
          <div
            key={element.id}
            className={`relative ${!isPreview ? 'border-2 transition-all duration-200' : ''} ${
              isSelected ? 'border-orange-500 bg-orange-50/20' : isPreview ? '' : 'border-transparent hover:border-orange-300'
            }`}
            onClick={(e) => {
              if (isPreview) return; // Disable element selection in preview mode
              // Only open properties panel if clicking on the container, not the text content
              if (e.target === e.currentTarget) {
                handleElementClick(e);
              } else {
                // Just select the element without showing properties panel
                e.stopPropagation();
                selectElement(element.id);
              }
            }}
          >
            {isSelected && !isPreview && (
              <>
                <div className="absolute -top-6 left-0 bg-orange-500 text-white px-2 py-1 text-xs rounded z-10">
                  Headline
                </div>
                <DeleteButton elementId={element.id} elementType="headline" />
              </>
            )}
            
            <EditableText 
              element={element} 
              isSelected={isSelected}
              elementType="headline"
              placeholder="Your Heading Here"
            />
          </div>
        )
        
      case 'text':
        return (
          <div
            key={element.id}
            className={`relative ${!isPreview ? 'border-2 transition-all duration-200' : ''} ${
              isSelected ? 'border-indigo-500 bg-indigo-50/20' : isPreview ? '' : 'border-transparent hover:border-indigo-300'
            }`}
            onClick={(e) => {
              if (isPreview) return; // Disable element selection in preview mode
              // Only open properties panel if clicking on the container, not the text content
              if (e.target === e.currentTarget) {
                handleElementClick(e);
              } else {
                // Just select the element without showing properties panel
                e.stopPropagation();
                selectElement(element.id);
              }
            }}
          >
            {isSelected && !isPreview && (
              <>
                <div className="absolute -top-6 left-0 bg-indigo-500 text-white px-2 py-1 text-xs rounded z-10">
                  Text
                </div>
                <DeleteButton elementId={element.id} elementType="text" />
              </>
            )}
            <EditableText 
              element={element} 
              isSelected={isSelected}
              elementType="text"
              placeholder="Your text content here. Click to edit this text and add your own content."
            />
          </div>
        )
        
      case 'image':
        return (
          <div
            key={element.id}
            className={`relative ${!isPreview ? 'border-2 transition-all duration-200' : ''} ${
              isSelected ? 'border-pink-500 bg-pink-50/20' : isPreview ? '' : 'border-transparent hover:border-pink-300'
            }`}
            style={{
              textAlign: element.styles?.textAlign || 'left'
            }}
            onClick={(e) => {
              if (isPreview) return; // Disable element selection in preview mode
              handleElementClick(e);
            }}
          >
            {isSelected && !isPreview && (
              <>
                <div className="absolute -top-6 left-0 bg-pink-500 text-white px-2 py-1 text-xs rounded z-10">
                  Image
                </div>
                <DeleteButton elementId={element.id} elementType="image" />
              </>
            )}
            <img
              src={element.settings?.imageUrl || 'https://via.placeholder.com/400x200/e2e8f0/64748b?text=Image+Placeholder'}
              alt={element.settings?.alt || 'Image'}
              style={{
                width: element.styles?.width || '100%',
                height: 'auto',
                borderRadius: element.styles?.borderRadius || '0px',
                display: 'block',
                maxWidth: '100%'
              }}
            />
          </div>
        )
        
      case 'button':
        const buttonId = `button-${element.id}`
        const hoverStyles = element.hoverStyles || {}
        
        return (
          <div
            key={element.id}
            className={`relative ${!isPreview ? 'border-2 transition-all duration-200' : ''} ${
              isSelected ? 'border-emerald-500 bg-emerald-50/20' : isPreview ? '' : 'border-transparent hover:border-emerald-300'
            }`}
            onClick={(e) => {
              if (isPreview) return; // Disable element selection in preview mode
              handleElementClick(e);
            }}
          >
            {/* Dynamic hover styles */}
            <style>{`
              #${buttonId}:hover {
                ${hoverStyles.backgroundColor ? `background-color: ${hoverStyles.backgroundColor} !important;` : ''}
                ${hoverStyles.color ? `color: ${hoverStyles.color} !important;` : ''}
                ${hoverStyles.transform ? `transform: ${hoverStyles.transform} !important;` : ''}
                transition: all 0.3s ease !important;
              }
            `}</style>
            
            {isSelected && !isPreview && (
              <>
                <div className="absolute -top-6 left-0 bg-emerald-500 text-white px-2 py-1 text-xs rounded z-10">
                  Button
                </div>
                <DeleteButton elementId={element.id} elementType="button" />
              </>
            )}
            <div 
              style={{
                display: 'flex',
                justifyContent: element.styles?.justifyContent || 'flex-start',
                width: '100%'
              }}
            >
              <button
              id={buttonId}
              style={{
                fontSize: element.styles?.fontSize || '16px',
                fontWeight: element.styles?.fontWeight || 'normal',
                color: element.styles?.color || '#ffffff',
                backgroundColor: element.styles?.backgroundColor || '#007bff',
                borderRadius: element.styles?.borderRadius || '4px',
                padding: element.styles?.padding || '12px 24px',
                border: 'none',
                cursor: 'pointer',
                display: 'inline-block',
                transition: 'all 0.3s ease'
              }}
              onClick={(e) => {
                e.stopPropagation()
                if (element.settings?.linkUrl) {
                  window.open(
                    element.settings.linkUrl, 
                    element.settings.linkTarget || '_self'
                  )
                }
              }}
            >
              {element.content || 'Click Me'}
            </button>
            </div>
          </div>
        )
        
      case 'video':
        return (
          <div
            key={element.id}
            className={`relative ${!isPreview ? 'border-2 transition-all duration-200' : ''} ${
              isSelected ? 'border-purple-500 bg-purple-50/20' : isPreview ? '' : 'border-transparent hover:border-purple-300'
            }`}
            onClick={(e) => {
              if (isPreview) return; // Disable element selection in preview mode
              handleElementClick(e);
            }}
          >
            {isSelected && !isPreview && (
              <>
                <div className="absolute -top-6 left-0 bg-purple-500 text-white px-2 py-1 text-xs rounded z-10">
                  Video
                </div>
                <DeleteButton elementId={element.id} elementType="video" />
              </>
            )}
            <div style={{ width: '100%', aspectRatio: element.styles?.aspectRatio || '16/9' }}>
              {element.settings?.videoUrl ? (
                <iframe
                  src={element.settings.videoUrl}
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    borderRadius: element.styles?.borderRadius || '0px'
                  }}
                  allowFullScreen
                  title="Video Player"
                />
              ) : (
                <div 
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#f3f4f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: element.styles?.borderRadius || '0px',
                    border: '2px dashed #d1d5db'
                  }}
                >
                  <div className="text-center text-gray-500">
                    <Video className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No video URL set</p>
                    <p className="text-xs">Configure in properties panel</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )
        
      case 'spacer':
        return (
          <div
            key={element.id}
            className={`relative ${!isPreview ? 'border-2 transition-all duration-200' : ''} ${
              isSelected ? 'border-gray-500 bg-gray-50/20' : isPreview ? '' : 'border-transparent hover:border-gray-300'
            }`}
            onClick={(e) => {
              if (isPreview) return; // Disable element selection in preview mode
              handleElementClick(e);
            }}
          >
            {isSelected && !isPreview && (
              <>
                <div className="absolute -top-6 left-0 bg-gray-500 text-white px-2 py-1 text-xs rounded z-10">
                  Spacer
                </div>
                <DeleteButton elementId={element.id} elementType="spacer" />
              </>
            )}
            <div 
              style={{
                height: element.styles?.height || '50px',
                width: '100%',
                backgroundColor: isSelected ? '#f9fafb' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: element.styles?.borderRadius || '0px'
              }}
            >
              {isSelected && !isPreview && (
                <div className="text-center text-gray-400">
                  <Square className="w-6 h-6 mx-auto mb-1 opacity-50" />
                  <p className="text-xs">Spacer: {element.styles?.height || '50px'}</p>
                </div>
              )}
            </div>
          </div>
        )
        
      case 'form':
        return (
          <div
            key={element.id}
            className={`relative ${isSelected && !isPreview ? 'ring-2 ring-yellow-500' : ''}`}
            style={element.styles}
            onClick={(e) => {
              if (isPreview) return; // Disable element selection in preview mode
              handleElementClick(e);
            }}
          >
            {isSelected && !isPreview && (
              <>
                <div className="absolute -top-6 left-0 bg-yellow-500 text-white px-2 py-1 text-xs rounded z-10">
                  Form
                </div>
                <DeleteButton elementId={element.id} elementType="form" />
              </>
            )}
            <form onSubmit={(e) => e.preventDefault()}>
              {element.formFields?.map((field: any) => (
                <div key={field.id} className="mb-4" style={{ width: field.width }}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea
                      placeholder={field.placeholder}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={4}
                      required={field.required}
                    />
                  ) : field.type === 'select' ? (
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required={field.required}
                    >
                      <option value="">Choose an option</option>
                      {field.options?.map((option: string, idx: number) => (
                        <option key={idx} value={option}>{option}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required={field.required}
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
            className={`relative ${isSelected && !isPreview ? 'ring-2 ring-green-500' : ''}`}
            style={element.styles}
            onClick={(e) => {
              if (isPreview) return; // Disable element selection in preview mode
              handleElementClick(e);
            }}
          >
            {isSelected && !isPreview && (
              <>
                <div className="absolute -top-6 left-0 bg-green-500 text-white px-2 py-1 text-xs rounded z-10">
                  Pricing Table
                </div>
                <DeleteButton elementId={element.id} elementType="pricing-table" />
              </>
            )}
            {element.settings?.featured && element.settings?.ribbonText && (
              <div className="absolute -top-3 -right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold transform rotate-12">
                {element.settings.ribbonText}
              </div>
            )}
            <div className="text-center">
              <h3 className="text-xl font-bold mb-4">{element.content || 'Plan Name'}</h3>
              <div className="text-3xl font-bold mb-6">
                {element.settings?.currency || '$'}99
                <span className="text-lg font-normal text-gray-600">
                  {element.settings?.period || '/month'}
                </span>
              </div>
              <ul className="space-y-3 mb-6">
                {element.pricingFeatures?.map((feature: any) => (
                  <li key={feature.id} className={`flex items-center ${
                    feature.included ? 'text-gray-700' : 'text-gray-400 line-through'
                  }`}>
                    <span className={`mr-2 ${
                      feature.included ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {feature.included ? '✓' : '✗'}
                    </span>
                    {feature.text}
                  </li>
                ))}
              </ul>
              <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors">
                Choose Plan
              </button>
            </div>
          </div>
        )
        
      case 'testimonial-carousel':
        return (
          <div
            key={element.id}
            className={`relative ${!isPreview ? 'border-2 transition-all duration-200' : ''} ${isSelected ? 'border-purple-500 bg-purple-50/20' : isPreview ? '' : 'border-transparent hover:border-purple-300'}`}
            onClick={(e) => {
              if (isPreview) return; // Disable element selection in preview mode
              
              // Only open properties panel if clicking on the container, not the testimonial content
              if (e.target === e.currentTarget) {
                handleElementClick(e);
              } else {
                // Just select the element without showing properties panel
                e.stopPropagation();
                selectElement(element.id);
              }
            }}
          >
            {isSelected && !isPreview && (
              <>
                <div className="absolute -top-6 left-0 bg-purple-500 text-white px-2 py-1 text-xs rounded z-10">
                  Testimonial
                </div>
                <DeleteButton elementId={element.id} elementType="testimonial-carousel" />
              </>
            )}
            <EditableTestimonial
              element={{
                ...element,
                testimonials: element.testimonials || [{
                  id: `testimonial_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
                  name: 'Sample Name',
                  position: 'Sample Position',
                  company: 'Sample Company',
                  content: 'Sample testimonial content goes here.',
                  rating: 5
                }]
              } as TestimonialElement}
              isSelected={isSelected}
              updateElement={updateElement}
              isPreview={isPreview}
            />
          </div>
        )
        
      default:
        return (
          <div
            key={element.id}
            className={`p-4 ${!isPreview ? 'border border-gray-300 rounded bg-gray-50' : ''}`}
            onClick={(e) => {
              if (isPreview) return; // Disable element selection in preview mode
              handleElementClick(e);
            }}
          >
            {isPreview ? '' : `${element.type} element (coming soon)`}
          </div>
        )
    }
  }

  // Get root elements - now these are columns directly
  const topLevelElements = elements.filter((el: ElementorElement) => !el.parentId)

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="h-screen flex bg-gray-50">
        {/* Side Panel - Hidden in Preview Mode */}
        {!isPreview && (
          <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
            {/* Side Panel Header */}
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Elements</h2>
              <p className="text-sm text-gray-500 mt-1">Drag elements to the canvas</p>
            </div>
            
            {/* Structure Selector */}
            <div className="p-4 border-b border-gray-200">
              <SidePanelStructureSelector onStructureSelect={handleStructureSelect} />
            </div>
            
            {/* Elements List */}
            <div className="flex-1 overflow-auto p-4">
              <div className="space-y-4">
                {AVAILABLE_ELEMENTS.map((element) => (
                  <Card key={element.id} className="cursor-move hover:shadow-md transition-shadow">
                    <CardContent className="p-3 flex items-center space-x-3">
                      <div className="bg-blue-100 text-blue-700 p-2 rounded">
                        <element.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{element.name}</h3>
                        <p className="text-xs text-gray-500">{element.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Top Navigation Bar */}
          <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
            {/* Left Section */}
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Back to Home</span>
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-lg font-semibold text-gray-900">Page Builder</h1>
            </div>

            {/* Center Section - Viewport Controls */}
            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              <Button
                variant={viewMode === "desktop" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("desktop")}
                className="h-8"
              >
                <Monitor className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "tablet" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("tablet")}
                className="h-8"
              >
                <Tablet className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "mobile" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("mobile")}
                className="h-8"
              >
                <Smartphone className="w-4 h-4" />
              </Button>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Undo className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Redo className="w-4 h-4" />
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <Button 
                variant={isPreview ? "default" : "outline"} 
                size="sm"
                onClick={() => {
                  // Toggle preview mode
                  setIsPreview(!isPreview)
                }}
              >
                <Eye className="w-4 h-4 mr-2" />
                {isPreview ? "Edit" : "Preview"}
              </Button>
              <Button size="sm">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </div>

          {/* Main Editor Canvas */}
          <div className="flex-1 p-8 overflow-auto bg-gray-100">
            <div 
              className="editor-canvas min-h-[500px] bg-white rounded-lg shadow-sm border border-gray-200"
              style={{ width: getViewportWidth(), margin: '0 auto' }}
            >
              {topLevelElements.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-8">
                  <h3 className="text-2xl font-semibold text-gray-700 mb-2 text-center">
                    Start Building Your Page
                  </h3>
                  <p className="text-gray-500 mb-6 text-center">
                    Select a column structure below to begin
                  </p>
                  
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-xl font-semibold mb-4 text-center">Select your structure</h2>
                    
                    <div className="grid grid-cols-6 gap-4 mb-4">
                      {/* First row - single columns and simple splits */}
                      <StructureOption columns={[100]} onClick={() => handleStructureSelect({ id: 'col-100', columns: [100] })} />
                      <StructureOption columns={[50, 50]} onClick={() => handleStructureSelect({ id: 'col-50-50', columns: [50, 50] })} />
                      <StructureOption columns={[33.33, 33.33, 33.33]} onClick={() => handleStructureSelect({ id: 'col-33-33-33', columns: [33.33, 33.33, 33.33] })} />
                      <StructureOption columns={[25, 25, 25, 25]} onClick={() => handleStructureSelect({ id: 'col-25-25-25-25', columns: [25, 25, 25, 25] })} />
                      <StructureOption columns={[20, 20, 20, 20, 20]} onClick={() => handleStructureSelect({ id: 'col-20-20-20-20-20', columns: [20, 20, 20, 20, 20] })} />
                      <StructureOption columns={[16.66, 16.66, 16.66, 16.66, 16.66, 16.66]} onClick={() => handleStructureSelect({ id: 'col-16-16-16-16-16-16', columns: [16.66, 16.66, 16.66, 16.66, 16.66, 16.66] })} />
                    </div>
                    
                    <div className="grid grid-cols-6 gap-4">
                      {/* Second row - asymmetric layouts */}
                      <StructureOption columns={[33.33, 66.66]} onClick={() => handleStructureSelect({ id: 'col-33-66', columns: [33.33, 66.66] })} />
                      <StructureOption columns={[66.66, 33.33]} onClick={() => handleStructureSelect({ id: 'col-66-33', columns: [66.66, 33.33] })} />
                      <StructureOption columns={[25, 75]} onClick={() => handleStructureSelect({ id: 'col-25-75', columns: [25, 75] })} />
                      <StructureOption columns={[75, 25]} onClick={() => handleStructureSelect({ id: 'col-75-25', columns: [75, 25] })} />
                      <StructureOption columns={[25, 50, 25]} onClick={() => handleStructureSelect({ id: 'col-25-50-25', columns: [25, 50, 25] })} />
                      <StructureOption columns={[20, 60, 20]} onClick={() => handleStructureSelect({ id: 'col-20-60-20', columns: [20, 60, 20] })} />
                    </div>
                  </div>
                </div>
              ) : (
                /* Render Elements */
                <div className="editor-row clearfix">
                  {/* Render all columns directly */}
                  {topLevelElements.map(element => (
                    <React.Fragment key={element.id}>
                      {renderElement(element)}
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Properties Panel */}
        {showProperties && selectedElement && (
          <ElementorPropertiesPanel onClose={() => setShowProperties(false)} />
        )}
      </div>

      <DragOverlay>
        {activeId ? (
          <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-lg">
            <div className="flex items-center space-x-2">
              <Layout className="w-5 h-5 text-blue-600" />
              <span className="font-medium">
                {AVAILABLE_ELEMENTS.find(el => el.id === activeId)?.name}
              </span>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

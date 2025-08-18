"use client"

import React, { useState } from 'react'
import { Type, Image, MousePointer, Video, Square, FileText, DollarSign, MessageSquare, Plus, Trash2, Columns, Grip } from 'lucide-react'
import { useElementor } from '@/lib/elementor-context'
import { ElementPropertiesPanel } from './element-properties-panel'
import { EditableText } from './editable-text'
import { StructureOption } from './structure-option'
import { SidePanelStructureSelector } from './side-panel-structure-selector'
import { AddStructureButton } from './add-structure-button'

interface ColumnStructureOption {
  id: string
  columns: number[]
  label?: string
}

export function SimplifiedElementorEditor() {
  const { elements, addElement, updateElement, moveElement } = useElementor()
  const [selectedElement, setSelectedElement] = useState<any>(null)
  
  // Helper function to render elements based on type
  const renderElement = (element: any) => {
    switch (element.type) {
      case 'heading':
        return (
          <div 
            key={element.id} 
            className="p-2 border border-transparent hover:border-blue-300 rounded cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedElement(element);
            }}
          >
            <EditableText 
              element={element}
              isSelected={selectedElement?.id === element.id}
              elementType="headline"
              defaultTag="h2"
              placeholder="Enter heading text"
            />
          </div>
        )
      case 'text':
        return (
          <div 
            key={element.id} 
            className="p-2 border border-transparent hover:border-blue-300 rounded cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedElement(element);
            }}
          >
            <EditableText 
              element={element}
              isSelected={selectedElement?.id === element.id}
              elementType="text"
              defaultTag="p"
              placeholder="Enter paragraph text"
            />
          </div>
        )
      case 'button':
        return (
          <div 
            key={element.id} 
            className="p-2 border border-transparent hover:border-blue-300 rounded cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedElement(element);
            }}
          >
            <EditableText 
              element={element}
              isSelected={selectedElement?.id === element.id}
              elementType="button"
              defaultTag="button"
              placeholder="Button Text"
            />
          </div>
        )
      case 'image':
        return (
          <div 
            key={element.id} 
            className="p-2 border border-transparent hover:border-blue-300 rounded cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedElement(element);
            }}
          >
            <img 
              src={element.settings?.imageUrl || '/placeholder-image.jpg'} 
              alt={element.settings?.alt || 'Image'} 
              className="max-w-full h-auto"
              style={element.styles || {}}
            />
          </div>
        )
      case 'form':
        return (
          <div 
            key={element.id} 
            className="p-2 border border-transparent hover:border-blue-300 rounded cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedElement(element);
            }}
          >
            <div className="p-4 border rounded-md">
              <h3 className="text-lg font-medium mb-4">{element.content || 'Contact Form'}</h3>
              <div className="space-y-4">
                {element.formFields?.map((field: any) => (
                  <div key={field.id} className="space-y-1">
                    <label className="text-sm font-medium">
                      {field.label}
                      {field.required && <span className="text-red-500">*</span>}
                    </label>
                    {field.type === 'textarea' ? (
                      <textarea 
                        className="w-full p-2 border rounded-md" 
                        placeholder={field.placeholder || ''}
                        disabled
                      />
                    ) : field.type === 'select' ? (
                      <select className="w-full p-2 border rounded-md" disabled>
                        <option>Select an option</option>
                      </select>
                    ) : (
                      <input 
                        type={field.type} 
                        className="w-full p-2 border rounded-md" 
                        placeholder={field.placeholder || ''}
                        disabled
                      />
                    )}
                  </div>
                ))}
                <button 
                  className="px-4 py-2 bg-blue-600 text-white rounded-md"
                  disabled
                >
                  {element.settings?.submitButtonText || 'Submit'}
                </button>
              </div>
            </div>
          </div>
        )
      case 'pricing-table':
        return (
          <div 
            key={element.id} 
            className="p-2 border border-transparent hover:border-blue-300 rounded cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedElement(element);
            }}
          >
            <div className="p-4 border rounded-md relative">
              {element.settings?.hasRibbon && (
                <div className="absolute top-0 right-0 bg-red-500 text-white px-4 py-1 text-sm">
                  {element.settings?.ribbonText || 'Popular'}
                </div>
              )}
              <h3 className="text-xl font-bold text-center">{element.content || 'Basic Plan'}</h3>
              <div className="text-center my-4">
                <span className="text-3xl font-bold">{element.settings?.price || '$9.99'}</span>
                <span className="text-gray-500">{element.settings?.period || '/month'}</span>
              </div>
              <ul className="space-y-2 mb-4">
                {element.pricingFeatures?.map((feature: any) => (
                  <li 
                    key={feature.id} 
                    className={`flex items-center ${!feature.included ? 'text-gray-400 line-through' : ''}`}
                  >
                    <span className={`mr-2 ${feature.included ? 'text-green-500' : 'text-red-500'}`}>
                      {feature.included ? '✓' : '✕'}
                    </span>
                    {feature.text}
                  </li>
                ))}
              </ul>
              <button className="w-full py-2 bg-blue-600 text-white rounded-md">
                Get Started
              </button>
            </div>
          </div>
        )
      case 'testimonial-carousel':
        return (
          <div 
            key={element.id} 
            className="p-2 border border-transparent hover:border-blue-300 rounded cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedElement(element);
            }}
          >
            <div className="p-4 border rounded-md">
              {element.testimonials && element.testimonials.length > 0 ? (
                <div className="relative">
                  <div className="p-4 border rounded-md bg-gray-50">
                    <div className="mb-4">
                      {Array(element.testimonials[0].rating || 5).fill(0).map((_, i) => (
                        <span key={i} className="text-yellow-400">★</span>
                      ))}
                    </div>
                    <p className="italic mb-4">"{element.testimonials[0].content}"</p>
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gray-300 mr-3"></div>
                      <div>
                        <p className="font-medium">{element.testimonials[0].name}</p>
                        <p className="text-sm text-gray-600">
                          {element.testimonials[0].position}, {element.testimonials[0].company}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center mt-4">
                    {element.testimonials.map((_: any, i: number) => (
                      <span 
                        key={i} 
                        className={`w-2 h-2 rounded-full mx-1 ${i === 0 ? 'bg-blue-600' : 'bg-gray-300'}`}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No testimonials added yet</p>
              )}
            </div>
          </div>
        )
      default:
        return (
          <div key={element.id} className="p-2 border border-gray-300 rounded">
            Unknown element type: {element.type}
          </div>
        )
    }
  }

  // Filter root elements (columns)
  const rootElements = elements.filter(el => el.type === 'column')
  
  // Handle structure selection
  const handleStructureSelect = (structure: ColumnStructureOption) => {
    // Create columns based on the selected structure
    structure.columns.forEach((width) => {
      const columnId = `element_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
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

  return (
    <div className="flex h-screen bg-white">
      {/* Side Panel */}
      <div className="w-64 border-r border-gray-200 overflow-y-auto p-4">
        <h2 className="font-semibold mb-4 text-sm uppercase tracking-wider text-gray-500">Elements</h2>
        <div className="grid grid-cols-2 gap-2">
          {/* Structure Selector */}
          <SidePanelStructureSelector />
          
          {/* Other Elements */}
          {AVAILABLE_ELEMENTS.map((element) => (
            <div 
              key={element.id}
              className="flex flex-col items-center p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('text/plain', element.id)
              }}
            >
              <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center mb-1">
                {React.createElement(element.icon, { className: "w-4 h-4 text-blue-600" })}
              </div>
              <span className="text-xs font-medium">{element.name}</span>
            </div>
          ))}

        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="h-14 border-b border-gray-200 flex items-center px-4">
          <h1 className="text-lg font-semibold">Elementor Editor</h1>
        </div>

        {/* Editor Canvas */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
          <div 
            className="min-h-[calc(100vh-8rem)] bg-white rounded-lg shadow-sm border border-gray-200 relative"
            id="editor-canvas"
            onDragOver={(e) => e.preventDefault()}
          >
            {rootElements.length === 0 ? (
              /* Empty Canvas with Add Structure Button */
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="max-w-md w-full p-8 text-center">
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                      <Plus className="w-8 h-8 text-blue-600" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Start Building Your Page
                  </h3>
                  <p className="text-gray-500 mb-8">
                    Drag widget here
                  </p>
                  
                  <div className="flex justify-center">
                    <AddStructureButton />
                  </div>
                </div>
              </div>
            ) : (
              <div className="editor-row clearfix">
                {/* Render Elements */}
                {/* Render all columns directly */}
                {rootElements.map(element => {
                  // Get children of this column
                  const columnChildren = elements.filter(el => el.parentId === element.id);
                  
                  return (
                    <div
                      key={element.id}
                      className="relative border-2 border-transparent hover:border-purple-300 transition-all duration-200 min-h-[100px]"
                      style={{
                        width: element.styles?.width || '100%',
                        padding: element.styles?.padding || '10px',
                        float: element.styles?.float || 'left',
                        boxSizing: 'border-box',
                        minHeight: '100px',
                        marginBottom: '20px'
                      }}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const elementType = e.dataTransfer.getData('text/plain');
                        
                        // Generate a unique ID for the new element
                        const newElementId = `element_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                        
                        // Create the element based on type
                        switch (elementType) {
                          case 'headline':
                            const headingElement = {
                              id: newElementId,
                              type: 'heading' as const,
                              parentId: element.id,
                              content: 'New Headline',
                              styles: {
                                fontSize: '24px',
                                fontWeight: 'bold',
                                margin: '10px 0'
                              }
                            };
                            addElement(headingElement);
                            
                            // Update the column's children array
                            if (!element.children) element.children = [];
                            element.children.push(newElementId);
                            break;
                          case 'text':
                            addElement({
                              id: newElementId,
                              type: 'text' as const,
                              parentId: element.id,
                              content: 'New paragraph text. Click to edit.',
                              styles: {
                                margin: '10px 0'
                              }
                            });
                            
                            // Update the column's children array
                            if (!element.children) element.children = [];
                            element.children.push(newElementId);
                            break;
                          case 'image':
                            addElement({
                              id: newElementId,
                              type: 'image' as const,
                              parentId: element.id,
                              content: '',
                              settings: {
                                imageUrl: '/placeholder-logo.png',
                                alt: 'Placeholder image'
                              },
                              styles: {
                                width: '100%',
                                maxWidth: '300px',
                                margin: '10px 0'
                              }
                            });
                            
                            // Update the column's children array
                            if (!element.children) element.children = [];
                            element.children.push(newElementId);
                            break;
                          case 'button':
                            addElement({
                              id: newElementId,
                              type: 'button' as const,
                              parentId: element.id,
                              content: 'Click Me',
                              styles: {
                                backgroundColor: '#4F46E5',
                                color: 'white',
                                padding: '10px 20px',
                                borderRadius: '4px',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'inline-block',
                                margin: '10px 0'
                              },
                              settings: {
                                linkUrl: '#',
                                linkTarget: '_self'
                              }
                            });
                            
                            // Update the column's children array
                            if (!element.children) element.children = [];
                            element.children.push(newElementId);
                            break;
                          case 'form':
                            addElement({
                              id: newElementId,
                              type: 'form' as const,
                              parentId: element.id,
                              formFields: [
                                {
                                  id: `field_${Date.now()}_1`,
                                  type: 'text',
                                  label: 'Name',
                                  placeholder: 'Enter your name',
                                  required: true,
                                  width: '100%'
                                },
                                {
                                  id: `field_${Date.now()}_2`,
                                  type: 'email',
                                  label: 'Email',
                                  placeholder: 'Enter your email',
                                  required: true,
                                  width: '100%'
                                }
                              ],
                              styles: {
                                padding: '20px',
                                backgroundColor: '#ffffff',
                                borderRadius: '8px',
                                border: '1px solid #e2e8f0'
                              }
                            });
                            
                            // Update the column's children array
                            if (!element.children) element.children = [];
                            element.children.push(newElementId);
                            break;
                          case 'pricing-table':
                            addElement({
                              id: newElementId,
                              type: 'pricing-table' as const,
                              parentId: element.id,
                              content: 'Basic Plan',
                              pricingFeatures: [
                                { id: `feature_${Date.now()}_1`, text: 'Feature 1', included: true },
                                { id: `feature_${Date.now()}_2`, text: 'Feature 2', included: true },
                                { id: `feature_${Date.now()}_3`, text: 'Feature 3', included: false }
                              ],
                              settings: {
                                price: '$99',
                                period: '/month',
                                hasRibbon: true,
                                ribbonText: 'Popular'
                              },
                              styles: {
                                padding: '20px',
                                backgroundColor: '#ffffff',
                                borderRadius: '8px',
                                border: '1px solid #e2e8f0'
                              }
                            });
                            
                            // Update the column's children array
                            if (!element.children) element.children = [];
                            element.children.push(newElementId);
                            break;
                          case 'testimonial-carousel':
                            addElement({
                              id: newElementId,
                              type: 'testimonial-carousel' as const,
                              parentId: element.id,
                              content: 'Testimonials',
                              testimonials: [
                                {
                                  id: `testimonial_${Date.now()}_1`,
                                  name: 'John Doe',
                                  position: 'CEO',
                                  company: 'Company Inc',
                                  content: 'This product is amazing! It has completely transformed how we work.',
                                  rating: 5
                                },
                                {
                                  id: `testimonial_${Date.now()}_2`,
                                  name: 'Jane Smith',
                                  position: 'Marketing Director',
                                  company: 'Agency Co',
                                  content: 'The customer support is outstanding. Highly recommended!',
                                  rating: 4
                                }
                              ],
                              styles: {
                                padding: '20px',
                                backgroundColor: '#ffffff',
                                borderRadius: '8px',
                                border: '1px solid #e2e8f0'
                              }
                            });
                            
                            // Update the column's children array
                            if (!element.children) element.children = [];
                            element.children.push(newElementId);
                            break;
                        }
                      }}
                      onClick={() => setSelectedElement(element)}
                    >
                      {/* Render column children */}
                      {columnChildren.length === 0 ? (
                        <div className="flex items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg">
                          <p className="text-gray-500 text-sm">Drop elements here</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {columnChildren.map(child => {
                            // Render each child element based on its type
                            return renderElement(child);
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Properties Panel */}
      <div className="w-72 border-l border-gray-200 overflow-y-auto p-4">
        {selectedElement && (
          <ElementPropertiesPanel 
            element={selectedElement} 
          />
        )}
      </div>
    </div>
  )
}

"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { 
  Type, 
  Image, 
  MousePointer, 
  Square, 
  FileText, 
  DollarSign, 
  MessageSquare, 
  Video,
  ArrowUp,
  ArrowDown,
  Trash2,
  Star,
  Plus,
  Columns,
  Grip,
  X 
} from 'lucide-react'
import { useElementor } from '@/lib/elementor-context'
import { ElementPropertiesPanel } from './element-properties-panel'
import { EditableText } from './editable-text'
import { AddStructureButton } from './add-structure-button'


interface SimplifiedElementorEditorProps {
  isPremium?: boolean;
}

export function SimplifiedElementorEditor({ isPremium = false }: SimplifiedElementorEditorProps) {
  const { elements, addElement, updateElement, moveElement, deleteElement } = useElementor()
  const [selectedElement, setSelectedElement] = useState<any>(null)
  
  // Helper function to render elements based on type
  const renderElement = (element: any) => {
    switch (element.type) {
      case 'heading':
        return (
          <div 
            key={element.id} 
            className="p-2 border border-transparent hover:border-blue-300 rounded cursor-pointer w-full"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedElement(element);
            }}
            style={{
              maxWidth: '100%', // Ensure it doesn't exceed column width
              overflow: 'hidden', // Prevent content from overflowing
              wordWrap: 'break-word' // Break long words to prevent overflow
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
            className="p-2 border border-transparent hover:border-blue-300 rounded cursor-pointer w-full"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedElement(element);
            }}
            style={{
              maxWidth: '100%', // Ensure it doesn't exceed column width
              overflow: 'hidden', // Prevent content from overflowing
              wordWrap: 'break-word' // Break long words to prevent overflow
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
            className="p-2 border border-transparent hover:border-blue-300 rounded cursor-pointer w-full"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedElement(element);
            }}
            style={{
              maxWidth: '100%', // Ensure it doesn't exceed column width
              overflow: 'hidden', // Prevent content from overflowing
              textAlign: 'center' // Center the button in the column
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
            className={`${selectedElement?.id === element.id ? 'outline outline-2 outline-blue-500' : ''} w-full`}
            onClick={() => setSelectedElement(element)}
            style={{
              ...element.styles,
              maxWidth: '100%', // Ensure it doesn't exceed column width
              width: '100%' // Always fill the column width
            }}
          >
            {element.settings?.linkUrl ? (
              <a 
                href={element.settings.linkUrl} 
                target={element.settings.linkTarget || '_self'}
                style={{ display: 'block', width: '100%' }}
              >
                <img 
                  src={element.settings?.imageUrl || '/placeholder-image.jpg'} 
                  alt={element.settings?.alt || 'Image'} 
                  className="max-w-full"
                  style={{ 
                    display: 'block',
                    margin: '0 auto',
                    objectFit: 'contain',
                    height: element.styles?.height || 'auto',
                    width: element.styles?.width || '100%'
                  }}
                />
              </a>
            ) : (
              <img 
                src={element.settings?.imageUrl || '/placeholder-image.jpg'} 
                alt={element.settings?.alt || 'Image'} 
                className="max-w-full"
                style={{ 
                  display: 'block',
                  margin: '0 auto',
                  objectFit: 'contain',
                  height: element.styles?.height || 'auto',
                  width: element.styles?.width || '100%'
                }}
              />
            )}
          </div>
        )
      case 'form':
        return (
          <div 
            key={element.id} 
            className="p-2 border border-transparent hover:border-blue-300 rounded cursor-pointer w-full"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedElement(element);
            }}
            style={{
              maxWidth: '100%', // Ensure it doesn't exceed column width
              overflow: 'hidden' // Prevent content from overflowing
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
            className="p-2 border border-transparent hover:border-blue-300 rounded cursor-pointer w-full"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedElement(element);
            }}
            style={{
              maxWidth: '100%', // Ensure it doesn't exceed column width
              overflow: 'hidden' // Prevent content from overflowing
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
            className={`p-4 w-full ${selectedElement?.id === element.id ? 'outline outline-2 outline-blue-500' : ''}`}
            onClick={() => setSelectedElement(element)}
            style={{
              ...element.styles,
              maxWidth: '100%', // Ensure it doesn't exceed column width
              overflow: 'hidden' // Prevent content from overflowing
            }}
          >
            <div className="text-center">
              <h3 className="text-xl font-bold mb-4">{element.content || 'Testimonial Carousel'}</h3>
              {element.testimonials && element.testimonials.length > 0 ? (
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="mb-4">
                    <div className="flex justify-center mb-2">
                      {Array.from({ length: element.testimonials[0].rating || 5 }).map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
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
      case 'button':
        return (
          <div 
            key={element.id} 
            className={`${selectedElement?.id === element.id ? 'outline outline-2 outline-blue-500' : ''} w-full`}
            onClick={() => setSelectedElement(element)}
            style={{
              ...element.styles,
              maxWidth: '100%', // Ensure it doesn't exceed column width
              overflow: 'hidden', // Prevent content from overflowing
              textAlign: 'center' // Center the button in the column
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
      case 'video':
        return (
          <div 
            key={element.id} 
            className={`${selectedElement?.id === element.id ? 'outline outline-2 outline-blue-500' : ''} w-full`}
            onClick={() => setSelectedElement(element)}
            style={{
              ...element.styles,
              maxWidth: '100%', // Ensure it doesn't exceed column width
              width: '100%' // Always fill the column width
            }}
          >
            {element.settings?.videoId ? (
              <div className="w-full" style={{ 
                aspectRatio: element.styles?.aspectRatio || '16/9',
                height: element.styles?.height || 'auto',
                width: element.styles?.width || '100%'
              }}>
                <iframe 
                  width="100%" 
                  height="100%" 
                  src={`https://www.youtube.com/embed/${element.settings.videoId}${element.settings?.autoplay ? '?autoplay=1&mute=1' : ''}`}
                  title={element.settings?.videoTitle || 'YouTube video'}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ maxWidth: '100%' }}
                ></iframe>
              </div>
            ) : (
              <div className="bg-gray-100 w-full flex items-center justify-center text-gray-500" style={{ aspectRatio: '16/9' }}>
                <div className="text-center">
                  <Video className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Add a YouTube video URL in the properties panel</p>
                </div>
              </div>
            )}
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

  // Get root elements (columns) and sort by order
  const rootElements = elements
    .filter(el => el.type === 'column')
    .sort((a, b) => {
      const orderA = a.styles?.order !== undefined ? Number(a.styles.order) : 999;
      const orderB = b.styles?.order !== undefined ? Number(b.styles.order) : 999;
      return orderA - orderB;
    });
  
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
        <div className="h-14 border-b border-gray-200 flex items-center justify-between px-4">
          <h1 className="text-lg font-semibold">Elementor Editor {isPremium && <span className="ml-2 text-sm bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">Pro</span>}</h1>
          <Link href="/templates" className="text-sm text-gray-500 hover:text-gray-700">
            Back to Templates
          </Link>
        </div>

        {/* Editor Canvas */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
          <div 
            className="min-h-[calc(100vh-8rem)] bg-white rounded-lg shadow-sm border border-gray-200 relative"
            style={{ 
              minHeight: rootElements.length > 0 ? `${Math.max(600, rootElements.length * 100)}px` : 'calc(100vh - 8rem)'
            }}
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
                      className="relative border-2 border-transparent hover:border-purple-300 transition-all duration-200 min-h-[100px] group"
                      style={{
                        width: element.styles?.width || '100%',
                        padding: element.styles?.padding || '20px',
                        float: element.styles?.float || 'left',
                        boxSizing: 'border-box',
                        minHeight: columnChildren.length > 0 ? 'auto' : '200px',
                        // No margin between columns
                        backgroundColor: element.styles?.backgroundColor || 'transparent',
                        borderRadius: element.styles?.borderRadius || '0px',
                        borderWidth: columnChildren.length === 0 ? '2px' : (element.styles?.borderWidth || '1px'),
                        borderStyle: columnChildren.length === 0 ? 'dashed' : (element.styles?.borderStyle || 'solid'),
                        borderColor: columnChildren.length === 0 ? '#e2e8f0' : (element.styles?.borderColor || '#e2e8f0'),
                        overflow: 'hidden' // Ensure content doesn't overflow column
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
                                width: '100%', // Always use 100% width to fit column
                                maxWidth: '100%', // Limit to column width
                                margin: '10px 0',
                                objectFit: 'contain' // Maintain aspect ratio
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
                          case 'video':
                            addElement({
                              id: newElementId,
                              type: 'video' as const,
                              parentId: element.id,
                              settings: {
                                videoUrl: '',
                                videoId: '',
                                videoTitle: 'YouTube Video',
                                autoplay: false
                              },
                              styles: {
                                width: '100%', // Always use 100% width to fit column
                                height: 'auto', // Auto height based on aspect ratio
                                margin: '10px 0',
                                aspectRatio: '16/9' // Maintain video aspect ratio
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
                      {/* Column Controls */}
                      <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity bg-white shadow-md rounded-bl-md border border-gray-200 z-10 flex">
                        <button 
                          className="p-1 hover:bg-gray-100" 
                          title="Move Up"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Find index of current column
                            const currentIndex = rootElements.findIndex(col => col.id === element.id);
                            if (currentIndex > 0) {
                              // Swap with previous column
                              const prevElement = rootElements[currentIndex - 1];
                              const currentElement = rootElements[currentIndex];
                              
                              // Update the DOM order by updating styles
                              const currentOrder = currentElement.styles?.order || currentIndex;
                              const prevOrder = prevElement.styles?.order || (currentIndex - 1);
                              
                              updateElement(currentElement.id, {
                                styles: { ...currentElement.styles, order: prevOrder }
                              });
                              updateElement(prevElement.id, {
                                styles: { ...prevElement.styles, order: currentOrder }
                              });
                            }
                          }}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </button>
                        <button 
                          className="p-1 hover:bg-gray-100" 
                          title="Move Down"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Find index of current column
                            const currentIndex = rootElements.findIndex(col => col.id === element.id);
                            if (currentIndex < rootElements.length - 1) {
                              // Swap with next column
                              const nextElement = rootElements[currentIndex + 1];
                              const currentElement = rootElements[currentIndex];
                              
                              // Update the DOM order by updating styles
                              const currentOrder = currentElement.styles?.order || currentIndex;
                              const nextOrder = nextElement.styles?.order || (currentIndex + 1);
                              
                              updateElement(currentElement.id, {
                                styles: { ...currentElement.styles, order: nextOrder }
                              });
                              updateElement(nextElement.id, {
                                styles: { ...nextElement.styles, order: currentOrder }
                              });
                            }
                          }}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </button>
                        <button 
                          className="p-1 hover:bg-red-100 text-red-600" 
                          title="Delete Column"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm('Are you sure you want to delete this column and all its contents?')) {
                              // First delete all children
                              columnChildren.forEach(child => {
                                deleteElement(child.id);
                              });
                              // Then delete the column itself
                              deleteElement(element.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      {/* Render column children */}
                      {columnChildren.length === 0 ? (
                        <div className="flex items-center justify-center h-32">
                          <p className="text-gray-500 text-sm">Drop elements here</p>
                        </div>
                      ) : (
                        <div className="space-y-0 -my-1">
                          {columnChildren.map(child => {
                            // Render each child element based on its type
                            return renderElement(child);
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
                
                {/* Add Structure Button in Editor Panel */}
                <div className="clear-both mt-8 flex justify-center">
                  <div className="w-64">
                    <AddStructureButton />
                  </div>
                </div>
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

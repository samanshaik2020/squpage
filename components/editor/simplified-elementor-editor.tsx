"use client"

import React, { useState } from 'react'
import { Type, Image, MousePointer, Video, Square, FileText, DollarSign, MessageSquare, Plus, Columns } from 'lucide-react'
import { useElementor } from '@/lib/elementor-context'
import { StructureOption } from './structure-option'
import { SidePanelStructureSelector } from './side-panel-structure-selector'

interface ColumnStructureOption {
  id: string
  columns: number[]
  label?: string
}

export function SimplifiedElementorEditor() {
  const { elements, addElement } = useElementor()
  
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
            onDrop={(e) => {
              e.preventDefault()
              const elementType = e.dataTransfer.getData('text/plain')
              
              // We need at least one column to drop elements into
              if (rootElements.length === 0) {
                alert('Please add a column structure first')
                return
              }
              
              // Generate a unique ID for the new element
              const newElementId = `element_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
              
              // Get the first column to drop into (in a real implementation, we'd determine the target column)
              const targetColumnId = rootElements[0].id
              
              // Create the element based on type
              switch (elementType) {
                case 'headline':
                  addElement({
                    id: newElementId,
                    type: 'heading',
                    parentId: targetColumnId,
                    content: 'New Headline',
                    styles: {
                      fontSize: '24px',
                      fontWeight: 'bold',
                      margin: '10px 0'
                    }
                  })
                  break
                case 'text':
                  addElement({
                    id: newElementId,
                    type: 'text',
                    parentId: targetColumnId,
                    content: 'New paragraph text. Click to edit.',
                    styles: {
                      margin: '10px 0'
                    }
                  })
                  break
                case 'image':
                  addElement({
                    id: newElementId,
                    type: 'image',
                    parentId: targetColumnId,
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
                  })
                  break
                case 'button':
                  addElement({
                    id: newElementId,
                    type: 'button',
                    parentId: targetColumnId,
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
                  })
                  break
                default:
                  console.log('Element type not implemented:', elementType)
              }
            }}
          >
            {rootElements.length === 0 ? (
              /* Empty Canvas with Structure Selector */
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="max-w-4xl w-full p-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
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
              </div>
            ) : (
              /* Render Elements */
              <div className="editor-row clearfix">
                {/* Render all columns directly */}
                {rootElements.map(element => (
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
                  >
                    <div className="flex items-center justify-center h-full border-2 border-dashed border-gray-300 rounded-lg min-h-[100px]">
                      <div className="text-center text-gray-500">
                        <Plus className="w-6 h-6 mx-auto mb-2 opacity-50" />
                        <p className="text-xs">Drop content here</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

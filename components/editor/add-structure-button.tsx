"use client"

import React, { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useElementor } from '@/lib/elementor-context'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface ColumnStructure {
  id: string
  columns: number[]
  label: string
}

export function AddStructureButton() {
  const { addElement, elements } = useElementor()
  const [isOpen, setIsOpen] = useState(false)
  
  // Define column structure presets matching the image
  const columnStructures: ColumnStructure[] = [
    // First row
    { id: 'col-100', columns: [100], label: '1 Column' },
    { id: 'col-50-50', columns: [50, 50], label: '2 Columns' },
    { id: 'col-33-33-33', columns: [33.33, 33.33, 33.33], label: '3 Columns' },
    { id: 'col-25-25-25-25', columns: [25, 25, 25, 25], label: '4 Columns' },
    { id: 'col-20-20-20-20-20', columns: [20, 20, 20, 20, 20], label: '5 Columns' },
    { id: 'col-16-16-16-16-16-16', columns: [16.66, 16.66, 16.66, 16.66, 16.66, 16.66], label: '6 Columns' },
    
    // Second row
    { id: 'col-33-66', columns: [33.33, 66.66], label: '1/3 + 2/3' },
    { id: 'col-66-33', columns: [66.66, 33.33], label: '2/3 + 1/3' },
    { id: 'col-25-50-25', columns: [25, 50, 25], label: '1/4 + 2/4 + 1/4' },
    { id: 'col-25-75', columns: [25, 75], label: '1/4 + 3/4' },
    { id: 'col-75-25', columns: [75, 25], label: '3/4 + 1/4' },
    { id: 'col-20-60-20', columns: [20, 60, 20], label: '1/5 + 3/5 + 1/5' }
  ]
  
  const createStructure = (structure: ColumnStructure) => {
    // Clear existing columns first
    const existingColumns = elements.filter(el => el.type === 'column')
    
    // Create new columns based on the selected structure
    structure.columns.forEach((width, index) => {
      const columnId = `column_${Date.now()}_${index}_${Math.random().toString(36).substring(2, 9)}`
      
      addElement({
        id: columnId,
        type: 'column',
        children: [],
        styles: {
          width: `${width}%`,
          padding: '20px',
          float: 'left',
          boxSizing: 'border-box',
          minHeight: '200px',
          border: '1px dashed #e2e8f0'
        },
        settings: {
          alignment: 'left'
        }
      })
    })
    
    setIsOpen(false)
  }
  
  const renderStructurePreview = (structure: ColumnStructure) => {
    return (
      <div 
        key={structure.id}
        className="cursor-pointer hover:opacity-80 transition-all duration-200 hover:scale-105"
        onClick={() => createStructure(structure)}
      >
        <div className="relative w-20 h-16 border border-gray-300 rounded overflow-hidden bg-white">
          {/* Bottom orange bar */}
          <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-red-500 to-orange-500"></div>
          
          {/* Column divisions */}
          <div className="flex h-[calc(100%-4px)]">
            {structure.columns.map((width, index) => (
              <div 
                key={index} 
                className="h-full bg-gray-100 relative"
                style={{ width: `${width}%` }}
              >
                {/* Red divider lines between columns */}
                {index > 0 && (
                  <div className="absolute inset-y-0 left-0 w-[1px] bg-red-500"></div>
                )}
                {/* Download arrow for single column */}
                {structure.columns.length === 1 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-gray-400 text-xs">↓</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors w-full justify-center"
        variant="default"
      >
        <Plus className="w-4 h-4" />
        <span>Add Structure</span>
      </Button>
      
      {/* Structure Selection Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[700px] p-0">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <DialogTitle className="text-lg font-medium">Select your structure</DialogTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsOpen(false)}
              className="h-6 w-6 p-0 rounded-full hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Structure Grid */}
          <div className="p-6">
            {/* First Row */}
            <div className="grid grid-cols-6 gap-4 mb-6">
              {columnStructures.slice(0, 6).map((structure) => (
                <div key={structure.id} className="flex justify-center">
                  {renderStructurePreview(structure)}
                </div>
              ))}
            </div>
            
            {/* Second Row */}
            <div className="grid grid-cols-6 gap-4">
              {columnStructures.slice(6, 12).map((structure) => (
                <div key={structure.id} className="flex justify-center">
                  {renderStructurePreview(structure)}
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

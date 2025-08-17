"use client"

import React, { useState } from 'react'
import { Columns } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ColumnStructureSelector } from './column-structure-selector'
import { useElementor } from '@/lib/elementor-context'

interface ColumnStructureOption {
  id: string
  columns: number[]
  label?: string
}

export function AddStructureButton() {
  const [showSelector, setShowSelector] = useState(false)
  const { addElement } = useElementor()

  const handleStructureSelect = (structure: ColumnStructureOption) => {
    // Close the modal
    setShowSelector(false)
    
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

  return (
    <>
      <div 
        className="flex flex-col items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setShowSelector(true)}
      >
        <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mb-2">
          <Columns className="w-5 h-5 text-blue-600" />
        </div>
        <span className="text-sm font-medium">Add Structure</span>
        <span className="text-xs text-gray-500 text-center mt-1">
          Select column layout
        </span>
      </div>

      <ColumnStructureSelector 
        isOpen={showSelector}
        onClose={() => setShowSelector(false)}
        onSelect={handleStructureSelect}
      />
    </>
  )
}

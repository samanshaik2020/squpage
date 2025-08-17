"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ColumnStructureSelector } from './column-structure-selector'
import { useElementor } from '@/lib/elementor-context'

interface ColumnStructureOption {
  id: string
  columns: number[]
  label?: string
}

export function StructureSelectorPanel() {
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
    <div className="w-full">
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

      <ColumnStructureSelector 
        isOpen={showSelector}
        onClose={() => setShowSelector(false)}
        onSelect={handleStructureSelect}
      />
    </div>
  )
}

interface StructureOptionProps {
  columns: number[]
  onClick: () => void
}

function StructureOption({ columns, onClick }: StructureOptionProps) {
  return (
    <div 
      className="cursor-pointer hover:opacity-80 transition-opacity"
      onClick={onClick}
    >
      <div className="relative h-16 border rounded overflow-hidden">
        <div className="absolute inset-x-0 bottom-0 h-2 bg-orange-500"></div>
        <div className="flex h-[calc(100%-8px)]">
          {columns.map((width, index) => (
            <div 
              key={index} 
              className="h-full bg-gray-200 relative"
              style={{ width: `${width}%` }}
            >
              {index > 0 && (
                <div className="absolute inset-y-0 left-0 w-[1px] bg-red-500"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

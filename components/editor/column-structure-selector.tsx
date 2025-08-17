"use client"

import React from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ColumnStructureOption {
  id: string
  columns: number[]
  label?: string
}

interface ColumnStructureSelectorProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (structure: ColumnStructureOption) => void
}

// Define all available column structure options
const COLUMN_STRUCTURES: ColumnStructureOption[] = [
  // First row - single columns and simple splits
  { id: 'col-100', columns: [100] },
  { id: 'col-50-50', columns: [50, 50] },
  { id: 'col-33-33-33', columns: [33.33, 33.33, 33.33] },
  { id: 'col-25-25-25-25', columns: [25, 25, 25, 25] },
  { id: 'col-20-20-20-20-20', columns: [20, 20, 20, 20, 20] },
  { id: 'col-16-16-16-16-16-16', columns: [16.66, 16.66, 16.66, 16.66, 16.66, 16.66] },
  
  // Second row - asymmetric layouts
  { id: 'col-33-66', columns: [33.33, 66.66] },
  { id: 'col-66-33', columns: [66.66, 33.33] },
  { id: 'col-25-75', columns: [25, 75] },
  { id: 'col-75-25', columns: [75, 25] },
  { id: 'col-25-50-25', columns: [25, 50, 25] },
  { id: 'col-20-60-20', columns: [20, 60, 20] }
]

export function ColumnStructureSelector({ isOpen, onClose, onSelect }: ColumnStructureSelectorProps) {
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-[800px] max-w-[90vw] p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Select your structure</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="grid grid-cols-6 gap-4 mb-4">
          {COLUMN_STRUCTURES.slice(0, 6).map((option) => (
            <StructureOption 
              key={option.id} 
              option={option} 
              onSelect={() => onSelect(option)} 
            />
          ))}
        </div>
        
        <div className="grid grid-cols-6 gap-4">
          {COLUMN_STRUCTURES.slice(6).map((option) => (
            <StructureOption 
              key={option.id} 
              option={option} 
              onSelect={() => onSelect(option)} 
            />
          ))}
        </div>
      </div>
    </div>
  )
}

interface StructureOptionProps {
  option: ColumnStructureOption
  onSelect: () => void
}

function StructureOption({ option, onSelect }: StructureOptionProps) {
  return (
    <div 
      className="cursor-pointer hover:opacity-80 transition-opacity"
      onClick={onSelect}
    >
      <div className="relative h-16 border rounded overflow-hidden">
        <div className="absolute inset-x-0 bottom-0 h-2 bg-orange-500"></div>
        <div className="flex h-[calc(100%-8px)]">
          {option.columns.map((width, index) => (
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

"use client"

import React, { useState } from 'react'
import { Columns, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useElementor } from '@/lib/elementor-context'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

interface ColumnStructure {
  id: string
  columns: number[]
  label: string
}

interface SidePanelStructureSelectorProps {
  onStructureSelect?: (structure: ColumnStructure) => void
}

export function SidePanelStructureSelector({ onStructureSelect }: SidePanelStructureSelectorProps) {
  const { addElement, elements } = useElementor()
  const [open, setOpen] = useState(false)
  const [showWarning, setShowWarning] = useState(false)
  const [selectedStructure, setSelectedStructure] = useState<ColumnStructure | null>(null)
  
  // Check if canvas already has columns
  const hasExistingColumns = elements.some(el => el.type === 'column')
  
  // Define column structure presets
  const columnStructures: ColumnStructure[] = [
    { id: 'col-100', columns: [100], label: '1 Column' },
    { id: 'col-50-50', columns: [50, 50], label: '2 Columns' },
    { id: 'col-33-33-33', columns: [33.33, 33.33, 33.33], label: '3 Columns' },
    { id: 'col-25-25-25-25', columns: [25, 25, 25, 25], label: '4 Columns' },
    { id: 'col-20-20-20-20-20', columns: [20, 20, 20, 20, 20], label: '5 Columns' },
    { id: 'col-16-16-16-16-16-16', columns: [16.66, 16.66, 16.66, 16.66, 16.66, 16.66], label: '6 Columns' },
    { id: 'col-33-66', columns: [33.33, 66.66], label: '1/3 + 2/3' },
    { id: 'col-66-33', columns: [66.66, 33.33], label: '2/3 + 1/3' },
    { id: 'col-25-75', columns: [25, 75], label: '1/4 + 3/4' },
    { id: 'col-75-25', columns: [75, 25], label: '3/4 + 1/4' },
    { id: 'col-25-50-25', columns: [25, 50, 25], label: '1/4 + 2/4 + 1/4' },
    { id: 'col-20-60-20', columns: [20, 60, 20], label: '1/5 + 3/5 + 1/5' }
  ]
  
  // Pre-select structure and check if warning is needed
  const handlePreSelectStructure = (structure: ColumnStructure) => {
    setSelectedStructure(structure)
    
    // Always allow adding new columns, but show a warning if columns already exist
    if (hasExistingColumns) {
      setShowWarning(true)
    } else {
      createStructure(structure)
    }
  }
  
  // Create the actual structure
  const createStructure = (structure: ColumnStructure) => {
    // If onStructureSelect prop is provided, call it instead of creating columns directly
    if (onStructureSelect) {
      onStructureSelect(structure);
      // Close dialogs
      setShowWarning(false);
      setOpen(false);
      return;
    }
    
    // Create columns based on the selected structure
    structure.columns.forEach((width) => {
      const columnId = `element_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
      
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
    
    // Close dialogs
    setShowWarning(false)
    setOpen(false)
  }
  
  // Cancel structure creation
  const cancelStructureCreation = () => {
    setShowWarning(false)
    setSelectedStructure(null)
  }
  
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div className="flex flex-col items-center p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center mb-1">
              <Columns className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-xs font-medium">Add Structure</span>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Select Column Structure</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-6 gap-4 mb-4">
            {/* First row - single columns and simple splits */}
            {columnStructures.slice(0, 6).map((structure) => (
              <div key={structure.id} className="flex flex-col items-center gap-2">
                <div 
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => handlePreSelectStructure(structure)}
                >
                  <div className="relative h-16 border rounded overflow-hidden">
                    <div className="absolute inset-x-0 bottom-0 h-2 bg-orange-500"></div>
                    <div className="flex h-[calc(100%-8px)]">
                      {structure.columns.map((width, index) => (
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
                <span className="text-xs text-gray-600">{structure.label}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-6 gap-4">
            {/* Second row - asymmetric layouts */}
            {columnStructures.slice(6).map((structure) => (
              <div key={structure.id} className="flex flex-col items-center gap-2">
                <div 
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => handlePreSelectStructure(structure)}
                >
                  <div className="relative h-16 border rounded overflow-hidden">
                    <div className="absolute inset-x-0 bottom-0 h-2 bg-orange-500"></div>
                    <div className="flex h-[calc(100%-8px)]">
                      {structure.columns.map((width, index) => (
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
                <span className="text-xs text-gray-600">{structure.label}</span>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Warning Dialog */}
      <Dialog open={showWarning} onOpenChange={setShowWarning}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Structure</DialogTitle>
            <DialogDescription>
              <Alert className="mt-4">
                <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                <AlertTitle>Warning</AlertTitle>
                <AlertDescription>
                  Your page already has columns. Adding a new structure will append additional columns.
                </AlertDescription>
              </Alert>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={cancelStructureCreation}>Cancel</Button>
            <Button onClick={() => { if (selectedStructure) createStructure(selectedStructure); }}>Add Anyway</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

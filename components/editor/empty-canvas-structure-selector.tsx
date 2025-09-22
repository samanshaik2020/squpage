"use client"

import React from 'react'
import { Button } from '@/components/ui/button'

export function EmptyCanvasStructureSelector() {
  const structures = [
    { name: "Single Column", columns: 1, icon: "▌" },
    { name: "Two Columns", columns: 2, icon: "▌▌" },
    { name: "Three Columns", columns: 3, icon: "▌▌▌" },
    { name: "Four Columns", columns: 4, icon: "▌▌▌▌" },
  ]

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="max-w-4xl w-full p-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
          Start Building Your Page
        </h3>
        <p className="text-gray-500 mb-6 text-center">
          Select a column structure below to begin
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {structures.map((structure) => (
            <Button
              key={structure.columns}
              variant="outline"
              className="h-24 flex flex-col items-center justify-center hover:bg-blue-50 hover:border-blue-300"
              onClick={() => {
                // Handle structure selection
                console.log(`Selected ${structure.columns} column structure`)
              }}
            >
              <div className="text-2xl mb-2">{structure.icon}</div>
              <div className="text-sm">{structure.name}</div>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}

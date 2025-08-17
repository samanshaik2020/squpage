"use client"

import React from 'react'
import { StructureSelectorPanel } from './structure-selector-panel'

export function EmptyCanvasStructureSelector() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="max-w-4xl w-full p-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
          Start Building Your Page
        </h3>
        <p className="text-gray-500 mb-6 text-center">
          Select a column structure below to begin
        </p>
        
        <StructureSelectorPanel />
      </div>
    </div>
  )
}

"use client"

import React from 'react'

interface StructureOptionProps {
  columns: number[]
  onClick: () => void
}

export function StructureOption({ columns, onClick }: StructureOptionProps) {
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

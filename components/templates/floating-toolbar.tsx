"use client"

import React, { useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { 
  Bold, 
  Italic, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Link, 
  Palette, 
  Type 
} from 'lucide-react'
import { Range as SlateRange } from 'slate'
import { Button } from '@/components/ui/button'
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Slider } from '@/components/ui/slider'

interface FloatingToolbarProps {
  selection: SlateRange | null
  isVisible: boolean
  onBold: () => void
  onItalic: () => void
  onAlign: (align: 'left' | 'center' | 'right') => void
  onLink: (url: string) => void
  onColor: (color: string) => void
  onSize: (size: number) => void
  position: { top: number; left: number } | null
}

export function FloatingToolbar({
  selection,
  isVisible,
  onBold,
  onItalic,
  onAlign,
  onLink,
  onColor,
  onSize,
  position
}: FloatingToolbarProps) {
  const toolbarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!toolbarRef.current || !position) return

    const toolbar = toolbarRef.current
    const padding = 8
    const width = toolbar.offsetWidth || 320
    const height = toolbar.offsetHeight || 40

    let left = position.left
    let top = position.top

    // Clamp within viewport
    const maxLeft = window.innerWidth - width - padding
    const maxTop = window.innerHeight - height - padding
    left = Math.max(padding, Math.min(left, maxLeft))
    top = Math.max(padding, Math.min(top, maxTop))

    toolbar.style.top = `${top}px`
    toolbar.style.left = `${left}px`
  }, [position])

  if (!isVisible || !position) return null

  const colors = [
    '#000000', // Black
    '#ffffff', // White
    '#ff0000', // Red
    '#00ff00', // Green
    '#0000ff', // Blue
    '#ffff00', // Yellow
    '#ff00ff', // Magenta
    '#00ffff', // Cyan
    '#808080', // Gray
    '#800000', // Maroon
    '#808000', // Olive
    '#008000', // Dark Green
    '#800080', // Purple
    '#008080', // Teal
    '#000080', // Navy
  ]

  const fontSizes = [12, 14, 16, 18, 20, 24, 28, 32, 36, 42, 48, 56, 64, 72]

  const toolbar = (
    <div
      ref={toolbarRef}
      className="fixed z-[10000] bg-white rounded-md shadow-lg border border-gray-200 p-1 flex items-center gap-1 flex-wrap"
      style={{ maxWidth: '320px' }}
    >
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-8 w-8 p-0" 
        onClick={onBold}
      >
        <Bold className="h-4 w-4" />
      </Button>
      
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-8 w-8 p-0" 
        onClick={onItalic}
      >
        <Italic className="h-4 w-4" />
      </Button>
      
      <div className="h-4 w-px bg-gray-200 mx-1" />
      
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-8 w-8 p-0" 
        onClick={() => onAlign('left')}
      >
        <AlignLeft className="h-4 w-4" />
      </Button>
      
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-8 w-8 p-0" 
        onClick={() => onAlign('center')}
      >
        <AlignCenter className="h-4 w-4" />
      </Button>
      
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-8 w-8 p-0" 
        onClick={() => onAlign('right')}
      >
        <AlignRight className="h-4 w-4" />
      </Button>
      
      <div className="h-4 w-px bg-gray-200 mx-1" />
      
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0"
          >
            <Link className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-2">
          <div className="space-y-2">
            <p className="text-sm font-medium">Insert Link</p>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="https://example.com" 
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                id="link-url-input"
              />
              <Button 
                size="sm" 
                onClick={() => {
                  const url = (document.getElementById('link-url-input') as HTMLInputElement).value;
                  if (url) onLink(url);
                }}
              >
                Add
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0"
          >
            <Palette className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-2">
          <div className="space-y-3">
            <div className="grid grid-cols-5 gap-1">
              {colors.map((color) => (
                <button
                  key={color}
                  className="w-6 h-6 rounded-full border border-gray-200 cursor-pointer"
                  style={{ backgroundColor: color }}
                  onClick={() => onColor(color)}
                  aria-label={`Color ${color}`}
                />
              ))}
            </div>
            
            <div className="space-y-2">
              <p className="text-xs font-medium">Custom Color</p>
              <div className="flex gap-2">
                <input 
                  type="color" 
                  className="w-8 h-8 p-0 cursor-pointer"
                  id="custom-color-picker"
                  onChange={(e) => onColor(e.target.value)}
                />
                <input 
                  type="text" 
                  placeholder="#RRGGBB or rgb(r,g,b)" 
                  className="flex h-8 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  id="custom-color-input"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      onColor((e.target as HTMLInputElement).value);
                    }
                  }}
                />
                <Button 
                  size="sm" 
                  className="h-8 px-2 py-0 text-xs"
                  onClick={() => {
                    const colorValue = (document.getElementById('custom-color-input') as HTMLInputElement).value;
                    if (colorValue) onColor(colorValue);
                  }}
                >
                  Apply
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0"
          >
            <Type className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-4">
          <div className="space-y-4">
            <p className="text-sm font-medium">Font Size</p>
            <Slider
              defaultValue={[32]}
              max={72}
              min={12}
              step={1}
              onValueChange={(value) => onSize(value[0])}
            />
            <div className="flex justify-between">
              <span className="text-xs text-gray-500">12px</span>
              <span className="text-xs text-gray-500">72px</span>
            </div>
            <div className="grid grid-cols-4 gap-1 mt-2">
              {fontSizes.map((size) => (
                <button
                  key={size}
                  className="px-2 py-1 text-xs border rounded hover:bg-gray-100"
                  onClick={() => onSize(size)}
                >
                  {size}px
                </button>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )

  // Render into body to avoid clipping by transformed/overflow-hidden ancestors
  if (typeof document !== 'undefined') {
    return createPortal(toolbar, document.body)
  }
  return toolbar
}
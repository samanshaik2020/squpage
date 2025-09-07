"use client"

import React, { useEffect, useRef, useState } from 'react'
import { useElementor } from '@/lib/elementor-context'

interface PreviewIframeProps {
  projectId?: string
  viewMode: 'desktop' | 'tablet' | 'mobile'
}

export function PreviewIframe({ projectId, viewMode }: PreviewIframeProps) {
  const { elements } = useElementor()
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Get viewport dimensions based on view mode
  const getViewportDimensions = () => {
    switch (viewMode) {
      case 'desktop': return { width: '100%', height: '100%' }
      case 'tablet': return { width: '768px', height: '1024px' }
      case 'mobile': return { width: '375px', height: '667px' }
      default: return { width: '100%', height: '100%' }
    }
  }

  // Send updated elements to iframe when they change
  useEffect(() => {
    if (isLoaded && iframeRef.current?.contentWindow) {
      const message = {
        type: 'UPDATE_ELEMENTS',
        payload: {
          elements,
          projectId,
          timestamp: Date.now()
        }
      }
      
      iframeRef.current.contentWindow.postMessage(message, '*')
    }
  }, [elements, projectId, isLoaded])

  // Handle iframe load
  const handleIframeLoad = () => {
    setIsLoaded(true)
    
    // Send initial data
    if (iframeRef.current?.contentWindow) {
      const message = {
        type: 'INIT_PREVIEW',
        payload: {
          elements,
          projectId,
          viewMode,
          timestamp: Date.now()
        }
      }
      
      iframeRef.current.contentWindow.postMessage(message, '*')
    }
  }

  const dimensions = getViewportDimensions()

  return (
    <div className="flex-1 bg-gray-100 flex items-center justify-center p-4">
      <div 
        className="bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-300"
        style={{
          width: dimensions.width,
          height: dimensions.height,
          maxWidth: '100%',
          maxHeight: '100%'
        }}
      >
        <iframe
          ref={iframeRef}
          src={`/preview/iframe${projectId ? `?projectId=${projectId}` : ''}`}
          className="w-full h-full border-none"
          onLoad={handleIframeLoad}
          title="Preview"
        />
      </div>
    </div>
  )
}

"use client"

import React, { useEffect, useRef, useState } from 'react'
import { useElementor } from '@/lib/elementor-context'
import { useProject } from '@/lib/project-context'

interface ElementorPreviewSystemProps {
  viewMode: 'desktop' | 'tablet' | 'mobile'
}

export function ElementorPreviewSystem({ viewMode }: ElementorPreviewSystemProps) {
  const { elements } = useElementor()
  const { currentProject } = useProject()
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isIframeReady, setIsIframeReady] = useState(false)

  // Get viewport dimensions based on view mode
  const getViewportDimensions = () => {
    switch (viewMode) {
      case 'desktop': return { width: '100%', height: '100%' }
      case 'tablet': return { width: '768px', height: '1024px' }
      case 'mobile': return { width: '375px', height: '667px' }
      default: return { width: '100%', height: '100%' }
    }
  }

  // Send elements to iframe when they change
  useEffect(() => {
    if (isIframeReady && iframeRef.current?.contentWindow) {
      const message = {
        type: 'UPDATE_ELEMENTS',
        payload: {
          elements,
          projectId: currentProject?.id,
          viewMode,
          timestamp: Date.now()
        }
      }
      
      iframeRef.current.contentWindow.postMessage(message, '*')
    }
  }, [elements, currentProject?.id, viewMode, isIframeReady])

  // Listen for iframe ready message
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'PREVIEW_READY') {
        setIsIframeReady(true)
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

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
          src="/preview/iframe"
          className="w-full h-full border-none"
          title="Elementor Preview"
        />
      </div>
    </div>
  )
}

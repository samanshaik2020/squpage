"use client"

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

interface ElementData {
  id: string
  type: string
  content: string
  styles?: Record<string, any>
  settings?: Record<string, any>
  parentId?: string | null
}

interface PreviewMessage {
  type: 'UPDATE_ELEMENTS' | 'INIT_PREVIEW'
  payload: {
    elements: ElementData[]
    projectId?: string
    viewMode?: string
    timestamp: number
  }
}

// JSON-to-Component Renderer
function ElementRenderer({ element, allElements }: { element: ElementData, allElements: ElementData[] }) {
  const styles = {
    ...element.styles,
    ...(element.settings?.responsive?.hideOnDesktop && { display: 'none' })
  }

  // Get direct children of this element
  const childElements = allElements.filter(el => el.parentId === element.id)

  // Render child elements
  const renderChildren = () => {
    if (childElements.length === 0) return null
    
    return childElements.map(child => (
      <ElementRenderer 
        key={child.id} 
        element={child} 
        allElements={allElements}
      />
    ))
  }

  switch (element.type) {
    case 'section':
      return (
        <section 
          key={element.id} 
          style={styles} 
          className="elementor-section w-full"
        >
          <div className="elementor-container mx-auto max-w-7xl px-4">
            <div className="flex flex-wrap -mx-4">
              {renderChildren()}
            </div>
          </div>
        </section>
      )

    case 'column':
      return (
        <div 
          key={element.id} 
          style={styles} 
          className="elementor-column flex-1 px-4"
        >
          {renderChildren()}
        </div>
      )

    case 'heading':
      const headingTag = element.settings?.htmlTag || 'h2'
      const HeadingComponent = headingTag as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
      return React.createElement(
        HeadingComponent,
        {
          key: element.id,
          style: styles,
          className: `elementor-heading-title ${element.settings?.size || 'text-2xl'} font-bold mb-4`
        },
        element.content || 'Heading'
      )
    
    case 'text':
      return (
        <div 
          key={element.id} 
          style={styles} 
          className="elementor-text-editor mb-4"
          dangerouslySetInnerHTML={{ __html: element.content || 'Text content' }}
        />
      )
    
    case 'button':
      return (
        <div key={element.id} className="mb-4">
          <button 
            style={styles} 
            className="elementor-button px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {element.content || 'Button'}
          </button>
        </div>
      )
    
    case 'image':
      return (
        <div key={element.id} style={styles} className="elementor-image mb-4">
          {element.settings?.imageUrl ? (
            <img 
              src={element.settings.imageUrl} 
              alt={element.settings?.alt || 'Image'} 
              className="max-w-full h-auto rounded-lg"
              style={{ 
                width: element.styles?.width || '100%',
                height: element.styles?.height || 'auto'
              }}
            />
          ) : (
            <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>
      )
    
    case 'video':
      return (
        <div key={element.id} style={styles} className="elementor-video mb-4">
          {element.settings?.videoId ? (
            <div className="w-full" style={{ 
              aspectRatio: element.styles?.aspectRatio || '16/9',
              height: element.styles?.height || 'auto',
              width: element.styles?.width || '100%'
            }}>
              <iframe 
                width="100%" 
                height="100%" 
                src={`https://www.youtube.com/embed/${element.settings.videoId}${element.settings?.autoplay ? '?autoplay=1&mute=1' : ''}`}
                title={element.settings?.videoTitle || 'YouTube video'}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ maxWidth: '100%' }}
              ></iframe>
            </div>
          ) : (
            <div className="bg-gray-100 w-full flex items-center justify-center text-gray-500" style={{ aspectRatio: '16/9' }}>
              <div className="text-center">
                <svg className="h-12 w-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>Add a YouTube video URL in the properties panel</p>
              </div>
            </div>
          )}
        </div>
      )
    
    case 'form':
      return (
        <div key={element.id} style={styles} className="elementor-form p-6 border rounded-lg bg-white mb-4">
          <h3 className="text-lg font-medium mb-4">{element.content || 'Contact Form'}</h3>
          <div className="space-y-4">
            {element.settings?.formFields?.map((field: any) => (
              <div key={field.id} className="space-y-1">
                <label className="text-sm font-medium">
                  {field.label}
                  {field.required && <span className="text-red-500">*</span>}
                </label>
                {field.type === 'textarea' ? (
                  <textarea 
                    className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500" 
                    placeholder={field.placeholder || ''}
                    rows={4}
                  />
                ) : field.type === 'select' ? (
                  <select className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500">
                    <option>Select an option</option>
                    {field.options?.map((option: string, index: number) => (
                      <option key={index} value={option}>{option}</option>
                    ))}
                  </select>
                ) : (
                  <input 
                    type={field.type} 
                    className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500" 
                    placeholder={field.placeholder || ''}
                  />
                )}
              </div>
            ))}
            <button 
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {element.settings?.submitButtonText || 'Submit'}
            </button>
          </div>
        </div>
      )
    
    case 'lead-magnet-form':
      return (
        <div key={element.id} style={styles} className="elementor-lead-magnet p-6 border-2 border-purple-200 rounded-lg bg-gradient-to-br from-purple-50 to-blue-50 mb-4">
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {element.settings?.leadMagnet?.title || 'Get Your Free Guide'}
            </h3>
            <p className="text-gray-600 text-sm">
              {element.settings?.leadMagnet?.description || 'Download our comprehensive guide and boost your results today!'}
            </p>
          </div>
          <div className="space-y-3">
            <input 
              type="text" 
              className="w-full p-3 border rounded-md" 
              placeholder="Your Name"
              readOnly
            />
            <input 
              type="email" 
              className="w-full p-3 border rounded-md" 
              placeholder="Your Email Address"
              readOnly
            />
            <button 
              className="w-full py-3 bg-purple-600 text-white rounded-md font-semibold hover:bg-purple-700 transition-colors"
            >
              Download Now - It's Free!
            </button>
          </div>
          <p className="text-xs text-gray-500 text-center mt-3">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      )
    
    case 'newsletter-signup':
      return (
        <div key={element.id} style={styles} className="elementor-newsletter p-4 border rounded-lg bg-blue-50 mb-4">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              {element.content || 'Stay Updated'}
            </h3>
            <p className="text-gray-600 text-sm">
              Get the latest news and updates delivered to your inbox.
            </p>
          </div>
          <div className="flex gap-2">
            <input 
              type="email" 
              className="flex-1 p-2 border rounded-md" 
              placeholder="Enter your email"
              readOnly
            />
            <button 
              className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium"
            >
              Subscribe
            </button>
          </div>
        </div>
      )
    
    case 'multi-step-form':
      return (
        <div key={element.id} style={styles} className="elementor-multi-step-form p-4 border rounded-lg mb-4">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">Multi-Step Form</h3>
              <span className="text-sm text-gray-500">
                Step {element.settings?.multiStep?.currentStep || 1} of {element.settings?.multiStep?.totalSteps || 3}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full" 
                style={{ 
                  width: `${((element.settings?.multiStep?.currentStep || 1) / (element.settings?.multiStep?.totalSteps || 3)) * 100}%` 
                }}
              ></div>
            </div>
          </div>
          <div className="space-y-3">
            {element.settings?.formFields?.map((field: any) => (
              <div key={field.id} className="space-y-1">
                <label className="text-sm font-medium">
                  {field.label}
                  {field.required && <span className="text-red-500">*</span>}
                </label>
                {field.type === 'select' ? (
                  <select className="w-full p-3 border rounded-md" disabled>
                    <option>Select an option</option>
                    {field.options?.map((option: string, index: number) => (
                      <option key={index} value={option}>{option}</option>
                    ))}
                  </select>
                ) : (
                  <input 
                    type={field.type} 
                    className="w-full p-3 border rounded-md" 
                    placeholder={field.placeholder || ''}
                    readOnly
                  />
                )}
              </div>
            ))}
            <div className="flex justify-between pt-4">
              <button className="px-4 py-2 border border-gray-300 rounded-md" disabled>
                Previous
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md">
                Next
              </button>
            </div>
          </div>
        </div>
      )

    default:
      return (
        <div key={element.id} style={styles} className="elementor-element p-4 mb-4">
          {element.content || `${element.type} element`}
          {renderChildren()}
        </div>
      )
  }
}

export default function PreviewIframePage() {
  const searchParams = useSearchParams()
  const projectId = searchParams.get('projectId')
  const [elements, setElements] = useState<ElementData[]>([])
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Listen for messages from parent window (editor)
    const handleMessage = (event: MessageEvent<PreviewMessage>) => {
      if (event.data.type === 'INIT_PREVIEW' || event.data.type === 'UPDATE_ELEMENTS') {
        setElements(event.data.payload.elements || [])
        setIsReady(true)
      }
    }

    window.addEventListener('message', handleMessage)
    
    // Send ready signal to parent
    window.parent.postMessage({ type: 'PREVIEW_READY' }, '*')

    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [])

  // Get root elements (no parent or sections)
  const rootElements = elements.filter(el => !el.parentId || el.type === 'section')

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading preview...</p>
        </div>
      </div>
    )
  }

  if (elements.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Empty Canvas</h2>
          <p className="text-gray-600">Start adding elements to see your preview</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="elementor-preview">
        {rootElements.map(element => (
          <ElementRenderer 
            key={element.id} 
            element={element} 
            allElements={elements}
          />
        ))}
      </div>
    </div>
  )
}

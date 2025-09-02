"use client"

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { ElementorElement } from '@/lib/elementor-context'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Edit, Share2, Download } from 'lucide-react'
import Link from 'next/link'
import { useAnalyticsTracking } from '@/hooks/use-analytics-tracking'

interface Project {
  id: string
  name: string
  elements: ElementorElement[]
  settings: {
    title: string
    description: string
    customCSS: string
    customJS: string
  }
}

export default function ElementorPreviewPage() {
  const params = useParams()
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Track page visits for published projects
  const { trackVisit } = useAnalyticsTracking({
    pageId: params.id as string,
    enabled: project?.status === 'published',
    trackOnMount: true
  })

  useEffect(() => {
    const loadProject = async () => {
      try {
        const response = await fetch(`/api/projects/${params.id}`)
        
        if (!response.ok) {
          throw new Error('Failed to load project')
        }

        const { project } = await response.json()
        setProject(project)
      } catch (error) {
        console.error('Error loading project:', error)
        setError('Failed to load project')
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      loadProject()
    }
  }, [params.id])

  // Render element based on type
  const renderElement = (element: ElementorElement) => {
    const styles = {
      ...element.styles,
      ...(element.settings?.responsive?.hideOnDesktop && { display: 'none' })
    }

    switch (element.type) {
      case 'heading':
        return (
          <h2 key={element.id} style={styles} className="text-2xl font-bold">
            {element.content || 'Heading'}
          </h2>
        )
      
      case 'text':
        return (
          <p key={element.id} style={styles} className="text-gray-700">
            {element.content || 'Text content'}
          </p>
        )
      
      case 'button':
        return (
          <button 
            key={element.id} 
            style={styles} 
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {element.content || 'Button'}
          </button>
        )
      
      case 'image':
        return (
          <div key={element.id} style={styles}>
            {element.settings?.imageUrl ? (
              <img 
                src={element.settings.imageUrl} 
                alt={element.settings?.alt || 'Image'} 
                className="max-w-full h-auto"
                style={{ 
                  width: element.styles?.width || 'auto',
                  height: element.styles?.height || 'auto'
                }}
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                Image placeholder
              </div>
            )}
          </div>
        )
      
      case 'form':
        return (
          <div key={element.id} style={styles} className="p-6 border rounded-lg">
            <h3 className="text-lg font-medium mb-4">{element.content || 'Contact Form'}</h3>
            <div className="space-y-4">
              {element.formFields?.map((field) => (
                <div key={field.id} className="space-y-1">
                  <label className="text-sm font-medium">
                    {field.label}
                    {field.required && <span className="text-red-500">*</span>}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea 
                      className="w-full p-3 border rounded-md" 
                      placeholder={field.placeholder || ''}
                      rows={4}
                    />
                  ) : field.type === 'select' ? (
                    <select className="w-full p-3 border rounded-md">
                      <option>Select an option</option>
                      {field.options?.map((option, index) => (
                        <option key={index} value={option}>{option}</option>
                      ))}
                    </select>
                  ) : (
                    <input 
                      type={field.type} 
                      className="w-full p-3 border rounded-md" 
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
      
      case 'video':
        return (
          <div key={element.id} style={styles}>
            {element.settings?.videoId ? (
              <div className="w-full" style={{ aspectRatio: '16/9' }}>
                <iframe 
                  width="100%" 
                  height="100%" 
                  src={`https://www.youtube.com/embed/${element.settings.videoId}`}
                  title="YouTube video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="w-full bg-gray-200 flex items-center justify-center text-gray-500" style={{ aspectRatio: '16/9' }}>
                Video placeholder
              </div>
            )}
          </div>
        )
      
      default:
        return (
          <div key={element.id} style={styles} className="p-4 border border-gray-300 rounded">
            {element.content || `${element.type} element`}
          </div>
        )
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading preview...</p>
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Preview Not Available</h1>
          <p className="text-gray-600 mb-4">{error || 'Project not found'}</p>
          <Link href="/dashboard">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Preview Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <div>
                <h1 className="text-lg font-semibold text-gray-900">{project.name}</h1>
                <p className="text-sm text-gray-500">Preview Mode</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Link href={`/elementor?projectId=${project.id}`}>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </Link>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS */}
      {project.settings.customCSS && (
        <style dangerouslySetInnerHTML={{ __html: project.settings.customCSS }} />
      )}

      {/* Page Content */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white min-h-screen">
          {project.elements.length === 0 ? (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Empty Project</h2>
                <p className="text-gray-600 mb-4">This project doesn't have any content yet.</p>
                <Link href={`/elementor?projectId=${project.id}`}>
                  <Button>
                    <Edit className="w-4 h-4 mr-2" />
                    Start Editing
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4 p-6">
              {project.elements
                .filter(element => !element.parentId) // Only render root elements
                .map(renderElement)}
            </div>
          )}
        </div>
      </div>

      {/* Custom JavaScript */}
      {project.settings.customJS && (
        <script dangerouslySetInnerHTML={{ __html: project.settings.customJS }} />
      )}
    </div>
  )
}
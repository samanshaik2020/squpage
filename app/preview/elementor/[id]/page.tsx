"use client"

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { ElementorElement } from '@/lib/elementor-context'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Edit, Share2, Download } from 'lucide-react'
import Link from 'next/link'

interface Project {
  id: string
  name: string
  status?: string
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


  useEffect(() => {
    const loadProject = async () => {
      try {
        console.log('Loading draft for project with ID:', params.id)
        
        // First try to load draft data from API
        try {
          const response = await fetch(`/api/projects/${params.id}/draft`)
          if (response.ok) {
            const draftData = await response.json()
            
            // Also get project metadata
            const projectResponse = await fetch(`/api/projects/${params.id}`)
            if (projectResponse.ok) {
              const projectData = await projectResponse.json()
              
              setProject({
                ...projectData,
                elements: draftData.elements,
                settings: draftData.settings
              })
              return
            }
          }
        } catch (error) {
          console.log('Failed to load draft from API, falling back to localStorage:', error)
        }
        
        // Fallback: Load project directly from localStorage
        const storedProjects = localStorage.getItem('squpage_elementor_projects')
        console.log('Stored projects:', storedProjects)
        
        if (!storedProjects) {
          console.log('No projects found in localStorage, creating sample project')
          // Create a sample project if none exists
          const sampleProject = {
            id: String(params.id),
            name: `Untitled Project ${params.id}`,
            type: 'Elementor',
            status: 'draft',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            thumbnail: '',
            elements: [
              {
                id: 'section-1',
                type: 'section' as const,
                parentId: null,
                content: '',
                styles: { backgroundColor: '#ffffff', padding: '60px 0' },
                settings: {}
              },
              {
                id: 'column-1',
                type: 'column' as const,
                parentId: 'section-1',
                content: '',
                styles: { width: '100%' },
                settings: {}
              },
              {
                id: 'heading-1',
                type: 'heading' as const,
                parentId: 'column-1',
                content: 'Welcome to My Website',
                styles: { fontSize: '48px', color: '#333333', textAlign: 'center', marginBottom: '20px' },
                settings: { htmlTag: 'h1', size: 'text-5xl' }
              },
              {
                id: 'text-1',
                type: 'text' as const,
                parentId: 'column-1',
                content: 'This is a sample text element to demonstrate the preview functionality.',
                styles: { fontSize: '18px', color: '#666666', textAlign: 'center', marginBottom: '30px' },
                settings: {}
              },
              {
                id: 'button-1',
                type: 'button' as const,
                parentId: 'column-1',
                content: 'Get Started',
                styles: { backgroundColor: '#007cba', color: '#ffffff', padding: '12px 24px', borderRadius: '6px', border: 'none', cursor: 'pointer', display: 'block', margin: '0 auto' },
                settings: {}
              }
            ] as ElementorElement[],
            settings: {
              title: `Untitled Project ${params.id}`,
              description: 'A website built with Elementor',
              favicon: '',
              customCSS: '',
              customJS: ''
            }
          }
          
          // Save the sample project to localStorage
          localStorage.setItem('squpage_elementor_projects', JSON.stringify([sampleProject]))
          setProject(sampleProject)
          return
        }

        const projects = JSON.parse(storedProjects)
        console.log('Parsed projects:', projects)
        
        let project = projects.find((p: any) => p.id === params.id)
        console.log('Found project:', project)
        
        if (!project) {
          console.log('Project not found, checking if any projects exist')
          // If no project with exact ID found, but projects exist, use the first one for demo
          if (projects.length > 0) {
            project = projects[0]
            console.log('Using first available project:', project)
          } else {
            throw new Error('Project not found')
          }
        }

        // Ensure project has elements array
        if (!project.elements) {
          project.elements = []
        }

        console.log('Final project data:', project)
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

  // Enhanced renderElement function with nested children support
  const renderElement = (element: ElementorElement, children?: ElementorElement[]) => {
    const styles = {
      ...element.styles,
      ...(element.settings?.responsive?.hideOnDesktop && { display: 'none' })
    }

    // Get children for this element
    const childElements = children || project?.elements.filter(e => e.parentId === element.id) || []

    const renderChildren = () => {
      if (childElements.length === 0) return null
      
      return (
        <div className="children-container">
          {childElements.map(child => renderElement(child))}
        </div>
      )
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
        const HeadingTag = element.settings?.htmlTag || 'h2'
        return (
          <HeadingTag 
            key={element.id} 
            style={styles} 
            className={`elementor-heading-title ${element.settings?.size || 'text-2xl'} font-bold`}
          >
            {element.content || 'Heading'}
            {renderChildren()}
          </HeadingTag>
        )
      
      case 'text':
        return (
          <div 
            key={element.id} 
            style={styles} 
            className="elementor-text-editor"
            dangerouslySetInnerHTML={{ __html: element.content || 'Text content' }}
          />
        )
      
      case 'button':
        return (
          <button 
            key={element.id} 
            style={styles} 
            className="elementor-button px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {element.content || 'Button'}
          </button>
        )
      
      case 'image':
        return (
          <div key={element.id} style={styles} className="elementor-image">
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
      
      case 'form':
        return (
          <div key={element.id} style={styles} className="elementor-form p-6 border rounded-lg bg-white">
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
                      className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500" 
                      placeholder={field.placeholder || ''}
                      rows={4}
                    />
                  ) : field.type === 'select' ? (
                    <select className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500">
                      <option>Select an option</option>
                      {field.options?.map((option, index) => (
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
      
      case 'video':
        return (
          <div key={element.id} style={styles} className="elementor-video">
            {element.settings?.videoId ? (
              <div className="w-full rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
                <iframe 
                  width="100%" 
                  height="100%" 
                  src={`https://www.youtube.com/embed/${element.settings.videoId}`}
                  title="YouTube video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-lg"
                />
              </div>
            ) : (
              <div className="w-full bg-gray-200 rounded-lg flex items-center justify-center text-gray-500" style={{ aspectRatio: '16/9' }}>
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0zM12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
            )}
          </div>
        )
      
      default:
        return (
          <div key={element.id} style={styles} className="elementor-element p-4">
            {element.content || `${element.type} element`}
            {renderChildren()}
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
      <div className="bg-white min-h-screen">
        {project.elements && project.elements.length === 0 ? (
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
          <div className="elementor-preview">
            {project.elements
              .filter(element => !element.parentId) // Only render root elements
              .map(element => renderElement(element))}
          </div>
        )}
      </div>

      {/* Custom JavaScript */}
      {project.settings.customJS && (
        <script dangerouslySetInnerHTML={{ __html: project.settings.customJS }} />
      )}
    </div>
  )
}
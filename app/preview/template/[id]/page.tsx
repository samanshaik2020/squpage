"use client"

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Edit, Share2, Download } from 'lucide-react'
import Link from 'next/link'
import { useAnalyticsTracking } from '@/hooks/use-analytics-tracking'

// Import template components
import { SaasLandingTemplate } from '@/components/templates/saas-landing'
import { PortfolioTemplate } from '@/components/templates/portfolio'
import { SeptiCleanTemplate } from '@/components/templates/septiclean'
import { EbookLandingTemplate } from '@/components/templates/ebook-landing'
import { AIGeneratedBlogPostTemplate } from '@/components/templates/ai-generated-blog-post'
import { ProductLandingPageTemplate } from '@/components/templates/product-landing-page'
import { AIPortfolioTemplate } from '@/components/templates/ai-portfolio'
import { AIBlogPageTemplate } from '@/components/templates/ai-blog-page'
import { DentalHealthLandingTemplate } from '@/components/templates/dental-health-landing'
import { AIDentalHealthLandingTemplate } from '@/components/templates/ai-dental-health-landing'

interface TemplateProject {
  id: string
  name: string
  type: string
  templateId: string
  elements: any[]
  settings: {
    title: string
    description: string
    customCSS: string
    customJS: string
  }
}

export default function TemplateProjectPreviewPage() {
  const params = useParams()
  const [project, setProject] = useState<TemplateProject | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Track page visits for published projects
  const { trackVisit } = useAnalyticsTracking({
    pageId: params.id as string,
    enabled: project?.type === 'Template',
    trackOnMount: true
  })

  useEffect(() => {
    const loadProject = async () => {
      try {
        console.log(`Preview: Attempting to load project with ID: ${params.id}`)
        const response = await fetch(`/api/projects/${params.id}`)
        
        if (!response.ok) {
          const errorData = await response.json()
          console.error(`Preview: API returned error status ${response.status}:`, errorData)
          throw new Error(`Failed to load project: ${errorData.error || response.statusText}`)
        }

        const data = await response.json()
        console.log('Preview: Project data received:', data)
        
        if (!data.project) {
          console.error('Preview: Project data is missing in API response')
          throw new Error('Invalid project data received from API')
        }
        
        const { project } = data
        
        // Ensure this is a template project
        if (project.type !== 'Template') {
          console.error(`Preview: Project type mismatch. Expected 'Template', got '${project.type}'`)
          throw new Error('This is not a template project')
        }
        
        // Check if elements are loaded
        if (!project.elements || !Array.isArray(project.elements)) {
          console.error('Preview: Project elements are missing or invalid', project.elements)
          project.elements = [] // Set default empty array to prevent errors
        }
        
        console.log(`Preview: Successfully loaded template project: ${project.id} - ${project.name} with ${project.elements.length} elements`)
        setProject(project)
      } catch (error: any) {
        console.error('Preview: Error loading project:', error)
        setError(error.message || 'Failed to load template project')
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      loadProject()
    } else {
      console.error('Preview: No project ID provided in URL parameters')
      setError('No project ID provided')
      setIsLoading(false)
    }
  }, [params.id])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading template preview...</p>
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Preview Not Available</h1>
          <p className="text-gray-600 mb-4">{error || 'Template project not found'}</p>
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

  const renderTemplateContent = () => {
    if (project.elements && project.elements.length > 0) {
      // Create props for template components with saved elements
      const templateProps = {
        elements: project.elements,  // Pass the saved elements from the project
        selectedElement: null,      // No element selection in preview mode
        onElementSelect: () => {}, // No-op for preview
        isEditable: false,         // Not editable in preview mode
        isPreview: true            // Flag to indicate preview mode
      };
      
      // Render the appropriate template based on templateId
      switch (project.templateId) {
        case 'saas-landing':
          return <SaasLandingTemplate {...templateProps} />;
        case 'portfolio':
          return <PortfolioTemplate {...templateProps} />;
        case 'septiclean':
          return <SeptiCleanTemplate {...templateProps} />;
        case 'ebook-landing':
          return <EbookLandingTemplate {...templateProps} />;
        case 'ai-generated-blog-post':
          return <AIGeneratedBlogPostTemplate {...templateProps} />;
        case 'product-landing-page':
          return <ProductLandingPageTemplate {...templateProps} />;
        case 'ai-portfolio':
          return <AIPortfolioTemplate {...templateProps} />;
        case 'ai-blog-page':
          return <AIBlogPageTemplate {...templateProps} />;
        case 'dental-health-landing':
          return <DentalHealthLandingTemplate {...templateProps} />;
        case 'ai-dental-health-landing':
          return <AIDentalHealthLandingTemplate {...templateProps} />;
        default:
          // If we don't have a specific template component, show a generic preview
          return (
            <div className="max-w-7xl mx-auto py-12 px-4">
              <div className="bg-white shadow-sm rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Template Preview</h2>
                <p className="text-gray-600 mb-6">
                  Viewing saved template: "{project.name}"
                </p>
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-sm text-gray-500">Template ID: {project.templateId}</p>
                  <p className="text-sm text-gray-500">Elements: {project.elements.length}</p>
                </div>
              </div>
            </div>
          );
      }
    }
    
    // Fallback if no elements are found
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Template Preview</h2>
          <p className="text-gray-600 mb-4">
            This template doesn't have any content to display.
          </p>
        </div>
      </div>
    );
  };

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
                <p className="text-sm text-gray-500">Template Preview</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Link href={`/editor/template/${project.id}`}>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Re-edit Template
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
        {renderTemplateContent()}
      </div>

      {/* Custom JavaScript */}
      {project.settings.customJS && (
        <script dangerouslySetInnerHTML={{ __html: project.settings.customJS }} />
      )}
    </div>
  )
}
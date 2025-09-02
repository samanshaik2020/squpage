"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { TemplateEditor } from "@/components/templates/template-editor"
import { useTemplateEditor } from "@/lib/template-editor-context"

export default function EditSavedTemplatePage() {
  const params = useParams()
  const router = useRouter()
  const { setTemplateId, updateElement, clearElements } = useTemplateEditor()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadSavedProject = async () => {
      try {
        console.log(`Editor: Attempting to load saved project with ID: ${params.id}`)
        const response = await fetch(`/api/projects/${params.id}`)
        
        if (!response.ok) {
          const errorData = await response.json()
          console.error(`Editor: API returned error status ${response.status}:`, errorData)
          throw new Error(`Failed to load project: ${errorData.error || response.statusText}`)
        }

        const data = await response.json()
        console.log('Editor: Project data received:', data)
        
        if (!data.project) {
          console.error('Editor: Project data is missing in API response')
          throw new Error('Invalid project data received from API')
        }
        
        const { project } = data
        
        // Ensure this is a template project
        if (project.type !== 'Template') {
          console.error(`Editor: Project type mismatch. Expected 'Template', got '${project.type}'`)
          throw new Error('This is not a template project')
        }
        
        // Ensure templateId exists
        if (!project.templateId) {
          console.error('Editor: Template ID is missing in project data')
          throw new Error('Template ID is missing in project data')
        }
        
        console.log('Editor: Setting template ID:', project.templateId)
        // Set the template ID in the context
        setTemplateId(project.templateId)
        
        // Set the elements from the saved project
        if (project.elements && Array.isArray(project.elements)) {
          console.log(`Editor: Loading ${project.elements.length} elements from saved project`)
          // First clear any existing elements
          clearElements()
          
          // Then add each element from the saved project
          project.elements.forEach((element: any) => {
            updateElement(element.id, element)
          })
          console.log('Editor: Successfully loaded all elements')
        } else {
          console.warn('Editor: No elements found in saved project or elements is not an array')
          // Initialize with empty array to prevent errors
          clearElements()
        }
        
      } catch (error: any) {
        console.error('Editor: Error loading saved template:', error)
        setError(error.message || 'Failed to load saved template')
        // Redirect to templates page after a delay if there's an error
        console.log('Editor: Redirecting to templates page due to error')
        setTimeout(() => {
          router.push('/templates')
        }, 3000)
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      loadSavedProject()
    } else {
      console.error('Editor: No project ID provided in URL parameters')
      setError('No project ID provided')
      setIsLoading(false)
    }
  }, [params.id, setTemplateId, clearElements, updateElement, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading saved template...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-gray-500">Redirecting to templates...</p>
        </div>
      </div>
    )
  }

  // Pass the templateId to the TemplateEditor component
  return <TemplateEditor templateId={params.id as string} initialSavedProjectId={params.id as string} />
}

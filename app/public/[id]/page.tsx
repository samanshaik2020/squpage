"use client"

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useAnalyticsTracking } from '@/hooks/use-analytics-tracking'
import { ContactForm } from '@/components/forms/contact-form'
import { NewsletterForm } from '@/components/forms/newsletter-form'

interface Project {
  id: string
  name: string
  type: string
  status: string
  settings: {
    title: string
    description: string
  }
}

export default function PublicProjectPage() {
  const params = useParams()
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Track page visits for this public page
  const { trackVisit, hasTracked } = useAnalyticsTracking({
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
          <p className="text-gray-600">{error || 'Project not found'}</p>
        </div>
      </div>
    )
  }

  if (project.status !== 'published') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Available</h1>
          <p className="text-gray-600">This project is not published yet.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Simple public page layout */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{project.settings.title}</h1>
          <p className="text-xl text-gray-600">{project.settings.description}</p>
        </header>

        <main className="prose prose-lg mx-auto">
          <div className="bg-gray-50 p-8 rounded-lg mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Welcome to {project.name}</h2>
            <p className="text-gray-700 mb-4">
              This is a public page for the project "{project.name}". Every visit to this page is being tracked 
              for analytics purposes.
            </p>
            <p className="text-sm text-gray-500">
              Analytics tracking: {hasTracked ? '✅ Tracked' : '⏳ Tracking...'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">About This Project</h3>
              <p className="text-blue-700">
                This project was created using our website builder platform. It demonstrates 
                the analytics tracking capabilities built into every published page.
              </p>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-green-900 mb-2">Analytics Features</h3>
              <ul className="text-green-700 space-y-1">
                <li>• Real-time visit tracking</li>
                <li>• Unique visitor identification</li>
                <li>• Traffic source analysis</li>
                <li>• Daily statistics</li>
              </ul>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="mb-8">
            <NewsletterForm 
              pageId={params.id as string}
              title="Subscribe to Updates"
              description="Get notified when we publish new content and features."
            />
          </div>

          {/* Contact Form */}
          <div className="mb-8">
            <ContactForm 
              pageId={params.id as string}
              title="Contact Us"
              description="Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible."
              fields={['name', 'email', 'phone', 'subject', 'message']}
              onSubmitSuccess={(data) => {
                console.log('Form submitted successfully:', data)
              }}
            />
          </div>

          <div className="text-center">
            <button 
              onClick={trackVisit}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Track Another Visit
            </button>
            <p className="text-sm text-gray-500 mt-2">
              Click to manually trigger another analytics event
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}
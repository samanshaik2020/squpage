"use client"

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ArrowLeft, Mail, Users, FileText, BarChart } from 'lucide-react'
import { ContactForm } from '@/components/forms/contact-form'
import { NewsletterForm } from '@/components/forms/newsletter-form'

interface Project {
  id: string
  name: string
  type: string
  status: string
}

export default function FormsTestPage() {
  const params = useParams()
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submissionCount, setSubmissionCount] = useState(0)

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

  const handleFormSubmission = (data: any) => {
    setSubmissionCount(prev => prev + 1)
    console.log('Form submitted:', data)
  }

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
          <Link href="/dashboard">
            <Button className="mt-4">
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
      {/* Header */}
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
                <p className="text-sm text-gray-500">Form Testing & Lead Capture</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge className={`${
                project.status === 'published' 
                  ? 'bg-green-100 text-green-800 border-green-200' 
                  : 'bg-yellow-100 text-yellow-800 border-yellow-200'
              }`}>
                {project.status}
              </Badge>
              <Link href={`/leads/${project.id}`}>
                <Button variant="outline" size="sm">
                  <Users className="w-4 h-4 mr-2" />
                  View Leads
                </Button>
              </Link>
              <Link href={`/analytics/${project.id}`}>
                <Button variant="outline" size="sm">
                  <BarChart className="w-4 h-4 mr-2" />
                  Analytics
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info Section */}
        <Card className="bg-blue-50 border-blue-200 mb-8">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-blue-900 mb-2">Lead Capture Testing</h2>
                <p className="text-blue-700 mb-4">
                  This page demonstrates the lead capture functionality. Fill out any of the forms below 
                  to test how form submissions are captured and stored. All submissions will appear in 
                  the leads management dashboard.
                </p>
                <div className="flex items-center space-x-4 text-sm text-blue-600">
                  <span className="flex items-center">
                    <Mail className="w-4 h-4 mr-1" />
                    Submissions this session: {submissionCount}
                  </span>
                  <span>•</span>
                  <span>All data is captured in real-time</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Forms Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Form</h3>
            <ContactForm 
              pageId={params.id as string}
              title="Get in Touch"
              description="Complete contact form with multiple fields for comprehensive lead capture."
              fields={['name', 'email', 'phone', 'company', 'subject', 'message']}
              source="Contact Form - Test Page"
              onSubmitSuccess={handleFormSubmission}
            />
          </div>

          {/* Newsletter Form */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Newsletter Signup</h3>
            <NewsletterForm 
              pageId={params.id as string}
              title="Subscribe to Updates"
              description="Simple email capture for newsletter subscriptions."
              source="Newsletter - Test Page"
              onSubmitSuccess={handleFormSubmission}
            />

            {/* Quick Contact Form */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Contact</h3>
              <ContactForm 
                pageId={params.id as string}
                title="Quick Message"
                description="Simplified contact form with essential fields only."
                fields={['name', 'email', 'message']}
                source="Quick Contact - Test Page"
                onSubmitSuccess={handleFormSubmission}
              />
            </div>
          </div>
        </div>

        {/* Instructions */}
        <Card className="mt-8 bg-gray-50 border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">How to Test Lead Capture</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">Fill Out Forms</h4>
                  <p className="text-sm text-gray-600">Complete any of the forms above with test data</p>
                </div>
                
                <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-green-600 font-bold">2</span>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">View Submissions</h4>
                  <p className="text-sm text-gray-600">Check the leads dashboard to see captured data</p>
                </div>
                
                <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-purple-600 font-bold">3</span>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">Manage Leads</h4>
                  <p className="text-sm text-gray-600">Update status and track lead progression</p>
                </div>
              </div>
              
              <div className="text-center pt-4">
                <Link href={`/leads/${project.id}`}>
                  <Button>
                    <Users className="w-4 h-4 mr-2" />
                    View Leads Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
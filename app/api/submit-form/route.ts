import { NextRequest, NextResponse } from 'next/server'
import { formSubmissionsStore, projectsStore } from '@/lib/projects-store'

export async function POST(request: NextRequest) {
  try {
    const { pageId, formData, source } = await request.json()

    if (!pageId || !formData) {
      return NextResponse.json({ error: 'pageId and formData are required' }, { status: 400 })
    }

    // Verify the project exists
    const project = await projectsStore.getById(pageId)
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Only accept submissions for published projects
    if (project.status !== 'published') {
      return NextResponse.json({ error: 'Project is not published' }, { status: 400 })
    }

    // Validate required form fields
    if (!formData.email && !formData.name) {
      return NextResponse.json({ error: 'At least name or email is required' }, { status: 400 })
    }

    // Get visitor information from headers
    const ipAddress = request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // Create the form submission record
    const submission = formSubmissionsStore.create({
      pageId,
      formData: {
        ...formData,
        // Sanitize and validate common fields
        name: formData.name?.toString().trim() || '',
        email: formData.email?.toString().trim().toLowerCase() || '',
        phone: formData.phone?.toString().trim() || '',
        message: formData.message?.toString().trim() || '',
        subject: formData.subject?.toString().trim() || '',
        company: formData.company?.toString().trim() || '',
        // Include any additional custom fields
        ...Object.fromEntries(
          Object.entries(formData).filter(([key]) =>
            !['name', 'email', 'phone', 'message', 'subject', 'company'].includes(key)
          )
        )
      },
      timestamp: new Date().toISOString(),
      ipAddress: ipAddress.split(',')[0].trim(), // Take first IP if multiple
      userAgent,
      source: source || 'Contact Form'
    })

    // Update project analytics - increment conversions
    if (project.analytics) {
      const updatedAnalytics = {
        ...project.analytics,
        conversions: project.analytics.conversions + 1
      }
      await projectsStore.update(pageId, { analytics: updatedAnalytics })
    }

    return NextResponse.json({
      success: true,
      submissionId: submission.id,
      message: 'Form submitted successfully'
    })
  } catch (error) {
    console.error('Error submitting form:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { projectsStore } from '@/lib/projects-store'
import { analyticsService } from '@/lib/supabase-analytics'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const pageId = searchParams.get('pageId')
    const includeFormData = searchParams.get('includeFormData') === 'true'
    
    if (!pageId) {
      return NextResponse.json({ error: 'pageId is required' }, { status: 400 })
    }

    // Get user data for authorization
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify the project exists
    const project = await projectsStore.getById(pageId)
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Get form submissions for this page from Supabase
    const submissions = await analyticsService.getFormSubmissions(pageId)
    
    // Transform form submissions to lead format for consistency
    const submissionLeads = submissions.map(submission => ({
      id: submission.id,
      projectId: submission.project_id,
      name: submission.form_data?.name || 'Unknown',
      email: submission.form_data?.email || '',
      message: submission.form_data?.message || '',
      phone: submission.form_data?.phone || '',
      source: submission.source || 'Form Submission',
      createdAt: submission.created_at,
      status: 'new' as const,
      // Include full form data if requested
      ...(includeFormData && { formData: submission.form_data }),
      // Include additional metadata
      ipAddress: submission.ip_address,
      userAgent: submission.user_agent
    }))

    // Sort by creation date (newest first)
    const allLeads = submissionLeads
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    // Remove duplicates based on email (keep the newest)
    const uniqueLeads = allLeads.filter((lead, index, array) => 
      lead.email === '' || array.findIndex(l => l.email === lead.email) === index
    )

    // Calculate statistics
    const stats = {
      total: uniqueLeads.length,
      new: uniqueLeads.filter(l => l.status === 'new').length,
      contacted: uniqueLeads.filter(l => l.status as string === 'contacted').length,
      converted: uniqueLeads.filter(l => l.status as string === 'converted').length,
      closed: uniqueLeads.filter(l => l.status as string === 'closed').length,
      // Recent activity (last 7 days)
      recentSubmissions: uniqueLeads.filter(l => 
        new Date(l.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      ).length
    }

    return NextResponse.json({ 
      leads: uniqueLeads,
      stats,
      totalSubmissions: submissions.length,
      project: {
        id: project.id,
        name: project.name,
        status: project.status
      }
    })
  } catch (error) {
    console.error('Error getting leads:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
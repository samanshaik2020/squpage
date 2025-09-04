import { NextRequest, NextResponse } from 'next/server'
import { projectsStore, FormSubmission } from '@/lib/projects-store'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const pageId = searchParams.get('pageId')
    const includeFormData = searchParams.get('includeFormData') === 'true'
    
    if (!pageId) {
      return NextResponse.json({ error: 'pageId is required' }, { status: 400 })
    }

    // No authentication required for localStorage implementation
    // In a real app, you would implement authentication here

    // Verify the project exists
    const project = await projectsStore.getById(pageId)
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Get form submissions from localStorage
    const formSubmissionsStore = {
      getAll: () => {
        try {
          if (typeof window !== 'undefined') {
            const stored = localStorage.getItem(`squpage_form_submissions_${pageId}`);
            if (!stored) return [];
            return JSON.parse(stored);
          }
          return [];
        } catch (error) {
          console.error('Error loading form submissions:', error);
          return [];
        }
      }
    };
    
    const submissions = formSubmissionsStore.getAll()
    
    // Transform form submissions to lead format for consistency
    const submissionLeads = submissions.map((submission: FormSubmission) => ({
      id: submission.id,
      projectId: submission.pageId,
      name: submission.formData?.name || 'Unknown',
      email: submission.formData?.email || '',
      message: submission.formData?.message || '',
      phone: submission.formData?.phone || '',
      source: submission.source || 'Form Submission',
      createdAt: submission.timestamp,
      status: 'new' as const,
      // Include full form data if requested
      ...(includeFormData && { formData: submission.formData }),
      // Include additional metadata
      ipAddress: submission.ipAddress,
      userAgent: submission.userAgent
    }))

    // Define lead type
    interface Lead {
      id: string;
      projectId: string;
      name: string;
      email: string;
      message: string;
      phone: string;
      source: string;
      createdAt: string;
      status: 'new' | 'contacted' | 'converted' | 'closed';
      formData?: any;
      ipAddress?: string;
      userAgent?: string;
    }
    
    // Sort by creation date (newest first)
    const allLeads = submissionLeads
      .sort((a: Lead, b: Lead) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    // Remove duplicates based on email (keep the newest)
    const uniqueLeads = allLeads.filter((lead: Lead, index: number, array: Lead[]) => 
      lead.email === '' || array.findIndex((l: Lead) => l.email === lead.email) === index
    )

    // Calculate statistics
    const stats = {
      total: uniqueLeads.length,
      new: uniqueLeads.filter((l: Lead) => l.status === 'new').length,
      contacted: uniqueLeads.filter((l: Lead) => l.status === 'contacted').length,
      converted: uniqueLeads.filter((l: Lead) => l.status === 'converted').length,
      closed: uniqueLeads.filter((l: Lead) => l.status === 'closed').length,
      // Recent activity (last 7 days)
      recentSubmissions: uniqueLeads.filter((l: Lead) => 
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
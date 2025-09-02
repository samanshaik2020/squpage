import { NextRequest, NextResponse } from 'next/server'
import { pageVisitsStore, projectsStore } from '@/lib/projects-store'

export async function POST(request: NextRequest) {
  try {
    const { pageId } = await request.json()
    
    if (!pageId) {
      return NextResponse.json({ error: 'pageId is required' }, { status: 400 })
    }

    // Verify the project exists
    const project = projectsStore.getById(pageId)
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Only track visits for published projects
    if (project.status !== 'published') {
      return NextResponse.json({ error: 'Project is not published' }, { status: 400 })
    }

    // Get visitor information from headers
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'
    const referrer = request.headers.get('referer') || 'direct'

    // Create the visit record
    const visit = pageVisitsStore.create({
      pageId,
      timestamp: new Date().toISOString(),
      ipAddress: ipAddress.split(',')[0].trim(), // Take first IP if multiple
      userAgent,
      referrer,
      sessionId: `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    })

    // Update project analytics in real-time
    const analytics = pageVisitsStore.getAnalytics(pageId)
    
    // Calculate additional metrics
    const bounceRate = Math.random() * 20 + 35 // Simulated bounce rate between 35-55%
    const avgSessionDuration = Math.floor(Math.random() * 120 + 60) // 1-3 minutes
    const clicks = Math.floor(analytics.views * 0.12) // ~12% click rate
    const conversions = Math.floor(analytics.uniqueVisitors * 0.025) // ~2.5% conversion rate
    
    const topPages = [
      { page: '/', views: Math.floor(analytics.views * 0.68) },
      { page: '/about', views: Math.floor(analytics.views * 0.19) },
      { page: '/contact', views: Math.floor(analytics.views * 0.13) }
    ]

    const updatedAnalytics = {
      views: analytics.views,
      uniqueVisitors: analytics.uniqueVisitors,
      clicks,
      conversions,
      bounceRate,
      avgSessionDuration,
      topPages,
      trafficSources: analytics.trafficSources,
      dailyStats: analytics.dailyStats
    }

    // Update the project with new analytics
    projectsStore.update(pageId, { analytics: updatedAnalytics })

    return NextResponse.json({ 
      success: true, 
      visitId: visit.id,
      analytics: updatedAnalytics
    })
  } catch (error) {
    console.error('Error tracking visit:', error)
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
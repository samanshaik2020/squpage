import { NextRequest, NextResponse } from 'next/server'
import { pageVisitsStore, projectsStore } from '@/lib/projects-store'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const pageId = searchParams.get('pageId')
    const days = parseInt(searchParams.get('days') || '30')
    
    if (!pageId) {
      return NextResponse.json({ error: 'pageId is required' }, { status: 400 })
    }

    // Verify the project exists
    const project = projectsStore.getById(pageId)
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Get analytics from page visits
    const visitAnalytics = pageVisitsStore.getAnalytics(pageId, days)
    
    // Calculate additional metrics
    const bounceRate = Math.random() * 20 + 35 // Simulated bounce rate between 35-55%
    const avgSessionDuration = Math.floor(Math.random() * 120 + 60) // 1-3 minutes
    const clicks = Math.floor(visitAnalytics.views * 0.12) // ~12% click rate
    const conversions = Math.floor(visitAnalytics.uniqueVisitors * 0.025) // ~2.5% conversion rate
    
    const topPages = [
      { page: '/', views: Math.floor(visitAnalytics.views * 0.68) },
      { page: '/about', views: Math.floor(visitAnalytics.views * 0.19) },
      { page: '/contact', views: Math.floor(visitAnalytics.views * 0.13) }
    ]

    const analytics = {
      views: visitAnalytics.views,
      uniqueVisitors: visitAnalytics.uniqueVisitors,
      clicks,
      conversions,
      bounceRate,
      avgSessionDuration,
      topPages,
      trafficSources: visitAnalytics.trafficSources,
      dailyStats: visitAnalytics.dailyStats
    }

    // Update the project with latest analytics
    projectsStore.update(pageId, { analytics })

    return NextResponse.json({ 
      analytics,
      totalVisits: visitAnalytics.views,
      dateRange: {
        from: new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString(),
        to: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Error getting analytics:', error)
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
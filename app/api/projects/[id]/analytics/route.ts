import { NextRequest, NextResponse } from 'next/server'
import { projectsStore } from '@/lib/projects-store'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const project = await projectsStore.getById(params.id)
    
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    return NextResponse.json({ 
      analytics: project.analytics || {
        views: 0,
        uniqueVisitors: 0,
        clicks: 0,
        conversions: 0,
        bounceRate: 0,
        avgSessionDuration: 0,
        topPages: [],
        trafficSources: [],
        dailyStats: []
      }
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const analytics = await request.json()
    
    const updatedProject = await projectsStore.update(params.id, { analytics })
    
    if (!updatedProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    return NextResponse.json({ analytics: updatedProject.analytics })
  } catch (error) {
    console.error('Error updating analytics:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
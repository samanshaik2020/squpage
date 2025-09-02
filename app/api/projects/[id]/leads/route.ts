import { NextRequest, NextResponse } from 'next/server'
import { leadsStore, projectsStore } from '@/lib/projects-store'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify project exists
    const project = projectsStore.getById(params.id)
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const leads = leadsStore.getByProjectId(params.id)
    return NextResponse.json({ leads })
  } catch (error) {
    console.error('Error fetching leads:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const leadData = await request.json()
    
    // Verify project exists
    const project = projectsStore.getById(params.id)
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const newLead = leadsStore.create({
      ...leadData,
      projectId: params.id,
      createdAt: new Date().toISOString(),
      status: 'new'
    })

    return NextResponse.json({ lead: newLead })
  } catch (error) {
    console.error('Error creating lead:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
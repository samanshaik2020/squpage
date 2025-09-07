import { NextRequest, NextResponse } from 'next/server'
import { projectsStore } from '@/lib/projects-store'

// In-memory draft storage (in production, use Redis or database)
const drafts = new Map<string, any>()

// Save draft version of project
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { elements, settings } = await request.json()

    const draftData = {
      elements,
      settings,
      lastModified: new Date().toISOString()
    }

    // Store draft in memory (in production, use Redis or database)
    drafts.set(id, draftData)

    return NextResponse.json({ 
      success: true,
      lastModified: draftData.lastModified
    })
  } catch (error) {
    console.error('Error saving draft:', error)
    return NextResponse.json(
      { error: 'Failed to save draft' },
      { status: 500 }
    )
  }
}

// Get draft version of project
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Try to get draft data from memory
    let draftData = drafts.get(id)

    // If no draft exists, fall back to published version
    if (!draftData) {
      const project = await projectsStore.getById(id)
      if (!project) {
        return NextResponse.json(
          { error: 'Project not found' },
          { status: 404 }
        )
      }

      const elements = await projectsStore.getProjectElements(id)
      draftData = {
        elements,
        settings: project.settings,
        lastModified: project.updatedAt
      }
    }

    return NextResponse.json(draftData)
  } catch (error) {
    console.error('Error getting draft:', error)
    return NextResponse.json(
      { error: 'Failed to get draft' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { projectsStore } from '@/lib/projects-store'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`API: Fetching project with ID: ${params.id}`)
    
    // Get project from database
    const project = await projectsStore.getById(params.id)
    
    if (!project) {
      console.log(`API: Project with ID ${params.id} not found`)
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }
    
    // Get project elements
    const elements = await projectsStore.getProjectElements(params.id)
    
    // Add elements to project
    const projectWithElements = {
      ...project,
      elements
    }
    
    console.log(`API: Successfully found project:`, project.id, project.name, `with ${elements.length} elements`)
    return NextResponse.json({ project: projectWithElements })
  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, elements, settings, status, thumbnail } = body
    
    // Get current project
    const currentProject = await projectsStore.getById(params.id)
    if (!currentProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }
    
    // Prepare updates
    const updates: any = {}
    if (name) updates.name = name
    if (settings) updates.settings = { ...currentProject.settings, ...settings }
    if (status) updates.status = status
    if (thumbnail) updates.thumbnail = thumbnail
    
    // Update project in database
    const updatedProject = await projectsStore.update(params.id, updates)
    
    if (!updatedProject) {
      return NextResponse.json({ error: 'Failed to update project' }, { status: 500 })
    }
    
    // Handle elements separately if provided
    if (elements) {
      const savedElements = await projectsStore.saveProjectElements(params.id, elements)
      if (!savedElements) {
        console.error(`Failed to save elements for project ${params.id}`)
      }
    }
    
    // Get updated project with elements
    const projectElements = await projectsStore.getProjectElements(params.id)
    
    return NextResponse.json({ 
      project: {
        ...updatedProject,
        elements: projectElements
      }
    })
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Delete project from database
    const deleted = await projectsStore.delete(params.id)
    
    if (!deleted) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }
    
    return NextResponse.json({ message: 'Project deleted successfully' })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 })
  }
}
import { NextRequest, NextResponse } from 'next/server'
import { projectsStore } from '@/lib/projects-store-new'

// GET - Access a shared project by token
export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const token = params.token
    
    if (!token) {
      return NextResponse.json({ error: 'Share token is required' }, { status: 400 })
    }
    
    // Get project by share token
    const project = await projectsStore.getByShareToken(token)
    
    if (!project) {
      return NextResponse.json({ error: 'Shared project not found or link has expired' }, { status: 404 })
    }
    
    // Check if the share has expired
    if (project.shareExpiryDate && new Date(project.shareExpiryDate) < new Date()) {
      return NextResponse.json({ error: 'This share link has expired' }, { status: 403 })
    }
    
    // Get project elements
    const elements = await projectsStore.getProjectElements(project.id)
    
    // Add elements to project
    const projectWithElements = {
      ...project,
      elements
    }
    
    // Track the view (optional, can be implemented later)
    // await projectsStore.trackShareView(token)
    
    return NextResponse.json({ project: projectWithElements })
  } catch (error) {
    console.error('Error accessing shared project by token:', error)
    return NextResponse.json({ error: 'Failed to access shared project' }, { status: 500 })
  }
}

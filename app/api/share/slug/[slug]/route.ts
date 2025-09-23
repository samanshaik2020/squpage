import { NextRequest, NextResponse } from 'next/server'
import { projectsStore } from '@/lib/projects-store-new'

// GET - Access a shared project by custom slug
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug
    
    if (!slug) {
      return NextResponse.json({ error: 'Share slug is required' }, { status: 400 })
    }
    
    // Get project by share slug
    const project = await projectsStore.getByShareSlug(slug)
    
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
    // await projectsStore.trackShareView(null, slug)
    
    return NextResponse.json({ project: projectWithElements })
  } catch (error) {
    console.error('Error accessing shared project by slug:', error)
    return NextResponse.json({ error: 'Failed to access shared project' }, { status: 500 })
  }
}

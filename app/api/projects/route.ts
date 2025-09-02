import { NextRequest, NextResponse } from 'next/server'
import { projectsStore, ProjectData } from '@/lib/projects-store'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || 'default-user'
    
    // Get projects from database
    const projects = await projectsStore.getAll()
    
    console.log(`API: Successfully fetched ${projects.length} projects`)
    return NextResponse.json({ projects })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, type = 'Elementor', elements = [], settings = {}, templateId } = body
    
    if (!name) {
      return NextResponse.json({ error: 'Project name is required' }, { status: 400 })
    }
    
    // Create project structure
    const newProject: ProjectData = {
      id: Date.now().toString(),
      name,
      type,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      thumbnail: '/placeholder.svg?height=120&width=200&text=' + encodeURIComponent(name),
      elements: [],
      templateId, // Add templateId to the project data
      settings: {
        title: name,
        description: '',
        favicon: '',
        customCSS: '',
        customJS: '',
        ...settings
      }
    }
    
    // Create project in database
    console.log('API: Creating project with data:', {
      id: newProject.id,
      name: newProject.name,
      type: newProject.type,
      templateId: newProject.templateId
    })
    
    const createdProject = await projectsStore.create(newProject)
    
    if (!createdProject) {
      console.error('API: Project creation failed - projectsStore.create returned null')
      return NextResponse.json({ error: 'Failed to create project in database' }, { status: 500 })
    }
    
    // Save elements if provided
    if (elements && elements.length > 0) {
      await projectsStore.saveProjectElements(createdProject.id, elements)
    }
    
    console.log(`API: Successfully created project ${createdProject.id} - ${createdProject.name}`)
    return NextResponse.json({ project: createdProject }, { status: 201 })
  } catch (error) {
    console.error('Error creating project:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error details:', errorMessage);
    return NextResponse.json({ error: `Failed to create project: ${errorMessage}` }, { status: 500 })
  }
}
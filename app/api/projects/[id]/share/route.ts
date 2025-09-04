import { NextRequest, NextResponse } from 'next/server'
import { projectsStore } from '@/lib/projects-store'

// POST - Generate a new share token with custom name
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('POST /api/projects/[id]/share - Project ID:', params.id)
    const { customName, expiryDays } = await request.json()
    
    if (!customName || customName.trim() === '') {
      return NextResponse.json({ error: 'Custom name is required' }, { status: 400 })
    }
    
    // Get current project to verify it exists
    const currentProject = await projectsStore.getById(params.id)
    console.log('POST /api/projects/[id]/share - Project found:', currentProject ? 'Yes' : 'No')
    
    if (!currentProject) {
      // Get all projects to see what IDs are available
      const allProjects = await projectsStore.getAll()
      console.log('POST /api/projects/[id]/share - Available project IDs:', allProjects.map(p => p.id))
      
      // Try to find project by string comparison (in case of type mismatch)
      const projectByString = allProjects.find(p => String(p.id) === String(params.id))
      if (projectByString) {
        console.log('POST /api/projects/[id]/share - Found project by string comparison')
        // Use the found project
        const shareData = await projectsStore.generateShareToken(
          projectByString.id, 
          customName, 
          expiryDays
        )
        
        if (!shareData) {
          return NextResponse.json({ error: 'Failed to generate share token' }, { status: 500 })
        }
        
        return NextResponse.json({
          message: 'Share token generated successfully',
          shareData
        })
      }
      
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }
    
    // Generate share token with custom name
    const shareData = await projectsStore.generateShareToken(
      params.id, 
      customName, 
      expiryDays
    )
    
    if (!shareData) {
      return NextResponse.json({ error: 'Failed to generate share token' }, { status: 500 })
    }
    
    return NextResponse.json({
      message: 'Share token generated successfully',
      shareData
    })
  } catch (error) {
    console.error('Error generating share token:', error)
    return NextResponse.json({ error: 'Failed to generate share token' }, { status: 500 })
  }
}

// DELETE - Revoke an existing share token
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get current project to verify it exists
    const currentProject = await projectsStore.getById(params.id)
    if (!currentProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }
    
    // Revoke share token
    const revoked = await projectsStore.revokeShareToken(params.id)
    
    if (!revoked) {
      return NextResponse.json({ error: 'Failed to revoke share token' }, { status: 500 })
    }
    
    return NextResponse.json({
      message: 'Share token revoked successfully'
    })
  } catch (error) {
    console.error('Error revoking share token:', error)
    return NextResponse.json({ error: 'Failed to revoke share token' }, { status: 500 })
  }
}

// GET - Get current share status
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('GET /api/projects/[id]/share - Project ID:', params.id)
    
    // Get current project
    const project = await projectsStore.getById(params.id)
    console.log('GET /api/projects/[id]/share - Project found:', project ? 'Yes' : 'No')
    
    if (!project) {
      // Get all projects to see what IDs are available
      const allProjects = await projectsStore.getAll()
      console.log('GET /api/projects/[id]/share - Available project IDs:', allProjects.map(p => p.id))
      
      // Try to find project by string comparison (in case of type mismatch)
      const projectByString = allProjects.find(p => String(p.id) === String(params.id))
      if (projectByString) {
        console.log('GET /api/projects/[id]/share - Found project by string comparison')
        // Return share information for the found project
        return NextResponse.json({
          shareStatus: {
            isPubliclyShared: projectByString.isPubliclyShared || false,
            shareToken: projectByString.shareToken,
            shareName: projectByString.shareName,
            shareSlug: projectByString.shareSlug,
            shareExpiryDate: projectByString.shareExpiryDate,
            shareUrl: projectByString.shareSlug 
              ? `${process.env.NEXT_PUBLIC_SITE_URL}/share/${projectByString.shareSlug}`
              : projectByString.shareToken 
                ? `${process.env.NEXT_PUBLIC_SITE_URL}/share/token/${projectByString.shareToken}`
                : null
          }
        })
      }
      
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }
    
    // Return share information
    return NextResponse.json({
      shareStatus: {
        isPubliclyShared: project.isPubliclyShared || false,
        shareToken: project.shareToken,
        shareName: project.shareName,
        shareSlug: project.shareSlug,
        shareExpiryDate: project.shareExpiryDate,
        shareUrl: project.shareSlug 
          ? `${process.env.NEXT_PUBLIC_SITE_URL}/share/${project.shareSlug}`
          : project.shareToken 
            ? `${process.env.NEXT_PUBLIC_SITE_URL}/share/token/${project.shareToken}`
            : null
      }
    })
  } catch (error) {
    console.error('Error getting share status:', error)
    return NextResponse.json({ error: 'Failed to get share status' }, { status: 500 })
  }
}

// PATCH - Update share settings (name, expiry)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { customName, expiryDays } = await request.json()
    
    // Get current project
    const currentProject = await projectsStore.getById(params.id)
    if (!currentProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }
    
    // Ensure project is already shared
    if (!currentProject.shareToken || !currentProject.isPubliclyShared) {
      return NextResponse.json({ 
        error: 'Project is not currently shared. Generate a share token first.' 
      }, { status: 400 })
    }
    
    // Update share settings
    const shareData = await projectsStore.updateShareSettings(
      params.id,
      customName,
      expiryDays
    )
    
    if (!shareData) {
      return NextResponse.json({ error: 'Failed to update share settings' }, { status: 500 })
    }
    
    return NextResponse.json({
      message: 'Share settings updated successfully',
      shareData
    })
  } catch (error) {
    console.error('Error updating share settings:', error)
    return NextResponse.json({ error: 'Failed to update share settings' }, { status: 500 })
  }
}

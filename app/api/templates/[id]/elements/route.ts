import { NextRequest, NextResponse } from 'next/server'
import { templateStore } from '@/lib/template-store'

// GET /api/templates/[id]/elements - Get template elements
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const elements = await templateStore.getTemplateElements(params.id)
    return NextResponse.json(elements)
  } catch (error) {
    console.error('Error fetching template elements:', error)
    return NextResponse.json(
      { error: 'Failed to fetch template elements' },
      { status: 500 }
    )
  }
}

// PUT /api/templates/[id]/elements - Save template elements
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { elements } = await request.json()

    if (!Array.isArray(elements)) {
      return NextResponse.json(
        { error: 'Elements must be an array' },
        { status: 400 }
      )
    }

    const success = await templateStore.saveTemplateElements(params.id, elements)
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to save template elements' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving template elements:', error)
    return NextResponse.json(
      { error: 'Failed to save template elements' },
      { status: 500 }
    )
  }
}

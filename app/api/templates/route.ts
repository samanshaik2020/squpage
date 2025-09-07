import { NextRequest, NextResponse } from 'next/server'
import { templateStore } from '@/lib/template-store'

// GET /api/templates - Get all templates
export async function GET() {
  try {
    const templates = await templateStore.getAll()
    return NextResponse.json(templates)
  } catch (error) {
    console.error('Error fetching templates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    )
  }
}

// POST /api/templates - Create new template
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, type = 'Template', elements = [], settings } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Template name is required' },
        { status: 400 }
      )
    }

    const template = await templateStore.create({
      name,
      type,
      status: 'draft',
      thumbnail: '/placeholder.svg?height=120&width=200&text=Template',
      elements,
      settings: settings || {
        title: name,
        description: '',
        favicon: '',
        customCSS: '',
        customJS: ''
      }
    })

    if (!template) {
      return NextResponse.json(
        { error: 'Failed to create template' },
        { status: 500 }
      )
    }

    return NextResponse.json(template, { status: 201 })
  } catch (error) {
    console.error('Error creating template:', error)
    return NextResponse.json(
      { error: 'Failed to create template' },
      { status: 500 }
    )
  }
}

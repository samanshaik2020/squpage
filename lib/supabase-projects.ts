import { supabase, Project, Element } from './supabase'
import { ElementorElement } from './elementor-context'

export const projectsService = {
  // Get all projects for current user
  async getAll(): Promise<Project[]> {
    try {
      // Get current user first
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        console.log('No user logged in, returning empty projects array')
        return []
      }
      
      // Get projects for current user only
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error getting projects:', error)
      return []
    }
  },

  // Get project by ID
  async getById(id: string): Promise<Project | null> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) return null
    return data
  },

  // Create new project
  async create(project: {
    name: string
    type: Project['type']
    settings?: any
    seo_settings?: any
  }): Promise<Project> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No user logged in')

    const { data, error } = await supabase
      .from('projects')
      .insert({
        ...project,
        user_id: user.id,
        settings: project.settings || {},
        seo_settings: project.seo_settings || {},
        analytics: {}
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Update project
  async update(id: string, updates: Partial<Project>): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Delete project
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // Publish project
  async publish(id: string): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .update({
        status: 'published',
        published_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Duplicate project
  async duplicate(id: string, newName: string): Promise<Project> {
    const original = await this.getById(id)
    if (!original) throw new Error('Project not found')

    // Get elements
    const elements = await elementsService.getByProjectId(id)

    // Create new project
    const newProject = await this.create({
      name: newName,
      type: original.type,
      settings: original.settings,
      seo_settings: original.seo_settings
    })

    // Duplicate elements
    if (elements.length > 0) {
      const duplicatedElements = elements.map(el => transformFromSupabase.element({
        ...el,
        id: crypto.randomUUID(),
        project_id: newProject.id
      }))
      await elementsService.saveProjectWithElements(newProject.id, duplicatedElements)
    }

    return newProject
  }
}

export const elementsService = {
  // Get elements by project ID
  async getByProjectId(projectId: string): Promise<Element[]> {
    const { data, error } = await supabase
      .from('elements')
      .select('*')
      .eq('project_id', projectId)
      .order('position', { ascending: true })
    
    if (error) throw error
    return data || []
  },

  // Save project with elements (batch operation)
  async saveProjectWithElements(projectId: string, elements: ElementorElement[]): Promise<void> {
    // Delete existing elements
    await supabase
      .from('elements')
      .delete()
      .eq('project_id', projectId)

    // Insert new elements
    if (elements.length > 0) {
      const elementsToInsert = elements.map((el, index) => ({
        id: el.id,
        project_id: projectId,
        type: el.type as string,
        parent_id: el.parentId || null,
        content: el.content || '',
        styles: el.styles || {},
        settings: el.settings || {},
        form_fields: el.formFields || [],
        pricing_features: el.pricingFeatures || [],
        testimonials: el.testimonials || [],
        slides: el.slides || [],
        position: index
      }))

      const { error } = await supabase
        .from('elements')
        .insert(elementsToInsert)
      
      if (error) throw error
    }
  },

  // Create single element
  async create(element: Partial<Element>): Promise<Element> {
    const { data, error } = await supabase
      .from('elements')
      .insert(element)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Update element
  async update(id: string, updates: Partial<Element>): Promise<Element> {
    const { data, error } = await supabase
      .from('elements')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Delete element
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('elements')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// Transform functions to convert between database and app formats
export const transformFromSupabase = {
  project: (dbProject: any): Project => ({
    ...dbProject,
    elements: [] // Elements loaded separately
  }),

  element: (dbElement: any): ElementorElement => ({
    id: dbElement.id,
    type: dbElement.type,
    parentId: dbElement.parent_id,
    content: dbElement.content,
    styles: dbElement.styles || {},
    settings: dbElement.settings || {},
    formFields: dbElement.form_fields || [],
    pricingFeatures: dbElement.pricing_features || [],
    testimonials: dbElement.testimonials || [],
    slides: dbElement.slides || []
  })
}

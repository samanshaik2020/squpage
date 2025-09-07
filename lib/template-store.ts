// Dedicated template storage system - completely separate from Elementor projects
// Uses different localStorage keys to prevent cross-contamination

// Helper function to safely access localStorage
const getLocalStorage = () => {
  if (typeof window !== 'undefined') {
    return window.localStorage;
  }
  return null;
};

// Template-specific interfaces (different from Elementor)
export interface TemplateElement {
  id: string
  type: string
  content: any
  styles: any
  url?: string
  position: { x: number; y: number }
}

export interface TemplateProject {
  id: string
  name: string
  type: 'Template' | 'AI Generated' | 'Landing Page' // Excludes 'Elementor'
  status: 'draft' | 'published'
  createdAt: string
  updatedAt: string
  thumbnail: string
  elements: TemplateElement[]
  templateId?: string
  settings: {
    title: string
    description: string
    favicon: string
    customCSS: string
    customJS: string
    seoTitle?: string
    seoDescription?: string
    seoKeywords?: string
    socialImage?: string
  }
}

// Template-specific localStorage keys (completely separate from Elementor)
const TEMPLATE_STORAGE_KEY = 'squpage_templates';
const TEMPLATE_ELEMENTS_KEY = 'squpage_template_elements';

// Load templates from localStorage
const loadTemplatesFromLocalStorage = (): TemplateProject[] => {
  try {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(TEMPLATE_STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Error loading templates from localStorage:', error);
    return [];
  }
};

// Save templates to localStorage
const saveTemplatesToLocalStorage = (templates: TemplateProject[]) => {
  try {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(templates));
  } catch (error) {
    console.error('Error saving templates to localStorage:', error);
  }
};

// Load template elements from localStorage
const loadTemplateElementsFromLocalStorage = (templateId: string): TemplateElement[] => {
  try {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(`${TEMPLATE_ELEMENTS_KEY}_${templateId}`);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Error loading template elements from localStorage:', error);
    return [];
  }
};

// Save template elements to localStorage
const saveTemplateElementsToLocalStorage = (templateId: string, elements: TemplateElement[]) => {
  try {
    if (typeof window === 'undefined') return;
    localStorage.setItem(`${TEMPLATE_ELEMENTS_KEY}_${templateId}`, JSON.stringify(elements));
  } catch (error) {
    console.error('Error saving template elements to localStorage:', error);
  }
};

// Default templates for initial state
const defaultTemplates: TemplateProject[] = [
  {
    id: 'template-1',
    name: 'My First Template',
    type: 'Template',
    status: 'published',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    thumbnail: '/placeholder.svg?height=120&width=200&text=Template',
    elements: [],
    settings: {
      title: 'My First Template',
      description: 'A template built with the template editor',
      favicon: '',
      customCSS: '',
      customJS: ''
    }
  }
];

// Initialize templates with localStorage data if available, otherwise use defaults
let templates: TemplateProject[] = (() => {
  try {
    if (typeof window !== 'undefined') {
      const localTemplates = loadTemplatesFromLocalStorage();
      return localTemplates.length > 0 ? localTemplates : defaultTemplates;
    }
    return defaultTemplates;
  } catch {
    return defaultTemplates;
  }
})();

export const templateStore = {
  // Create a new template
  create: async (template: Omit<TemplateProject, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      // Generate a new unique ID with template prefix
      const id = `template-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      
      // Create new template with timestamps
      const now = new Date().toISOString();
      const newTemplate: TemplateProject = {
        ...template,
        id,
        createdAt: now,
        updatedAt: now,
        elements: template.elements || [],
        settings: template.settings || {
          title: template.name,
          description: '',
          favicon: '',
          customCSS: '',
          customJS: ''
        }
      };
      
      // Add to in-memory cache
      templates.push(newTemplate);
      
      // Save to localStorage
      saveTemplatesToLocalStorage(templates);
      
      return newTemplate;
    } catch (error) {
      console.error('Error in create template:', error);
      return null;
    }
  },
  
  // Load all templates
  getAll: async () => {
    try {
      // If we already have templates in memory, return them
      if (templates.length > 0) {
        return templates;
      }

      // Load from localStorage
      const loadedTemplates = loadTemplatesFromLocalStorage();
      templates = loadedTemplates.length > 0 ? loadedTemplates : defaultTemplates;
      
      // Also save to localStorage as backup
      saveTemplatesToLocalStorage(templates);
      
      return templates;
    } catch (error) {
      console.error('Error in getAll templates:', error);
      return [];
    }
  },

  // Get template by ID
  getById: async (id: string) => {
    try {
      // First check in-memory cache
      const cachedTemplate = templates.find(t => String(t.id) === String(id));
      if (cachedTemplate) {
        return cachedTemplate;
      }
      
      // If not in memory, check localStorage
      const localTemplates = loadTemplatesFromLocalStorage();
      const localTemplate = localTemplates.find(t => String(t.id) === String(id));
      return localTemplate || null;
    } catch (error) {
      console.error('Error in getById template:', error);
      return null;
    }
  },

  // Update template
  update: async (id: string, updates: Partial<TemplateProject>) => {
    try {
      // Get current template
      const currentTemplate = templates.find(t => t.id === id);
      if (!currentTemplate) {
        // Try to find in localStorage if not in memory
        const localTemplates = loadTemplatesFromLocalStorage();
        const localTemplate = localTemplates.find(t => t.id === id);
        if (!localTemplate) {
          return null;
        }
        // Add to memory cache
        templates.push(localTemplate);
      }

      // Get the index again after potentially adding from localStorage
      const index = templates.findIndex(t => t.id === id);
      if (index < 0) {
        return null;
      }

      // Create updated template
      const updatedTemplate = {
        ...templates[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };

      // Update in-memory cache
      templates[index] = updatedTemplate;

      // Save to localStorage
      saveTemplatesToLocalStorage(templates);
      
      return updatedTemplate;
    } catch (error) {
      console.error(`Error in update template ${id}:`, error);
      return null;
    }
  },

  // Delete template
  delete: async (id: string) => {
    try {
      // Delete from in-memory cache
      templates = templates.filter(t => t.id !== id);
      
      // Save updated templates to localStorage
      saveTemplatesToLocalStorage(templates);
      
      // Also delete template elements
      if (typeof window !== 'undefined') {
        localStorage.removeItem(`${TEMPLATE_ELEMENTS_KEY}_${id}`);
      }
      
      return true;
    } catch (error) {
      console.error(`Error in delete template ${id}:`, error);
      // Fallback: remove from memory anyway
      templates = templates.filter(t => t.id !== id);
      saveTemplatesToLocalStorage(templates);
      return true;
    }
  },

  // Load elements for a template
  getTemplateElements: async (templateId: string) => {
    try {
      return loadTemplateElementsFromLocalStorage(templateId);
    } catch (error) {
      console.error(`Error in getTemplateElements for template ${templateId}:`, error);
      return [];
    }
  },

  // Save elements for a template
  saveTemplateElements: async (templateId: string, elements: TemplateElement[]) => {
    try {
      saveTemplateElementsToLocalStorage(templateId, elements);
      
      // Also update the template's elements property
      const template = await templateStore.getById(templateId);
      if (template) {
        await templateStore.update(templateId, { elements });
      }
      
      return true;
    } catch (error) {
      console.error(`Error in saveTemplateElements for template ${templateId}:`, error);
      return false;
    }
  }
};

// Clear all template data (for debugging/reset purposes)
export const clearTemplateData = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TEMPLATE_STORAGE_KEY);
    // Clear all template elements
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(TEMPLATE_ELEMENTS_KEY)) {
        localStorage.removeItem(key);
      }
    });
  }
  templates = defaultTemplates;
};

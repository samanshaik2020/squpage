import { notFound } from 'next/navigation'
import { projectsStore, ProjectData } from '@/lib/projects-store'
import { templateStore, TemplateProject } from '@/lib/template-store'

// This page handles both token and slug-based shares
export default async function SharedProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  
  try {
    // Try to get project by slug first
    let project = null;
    try {
      project = await projectsStore.getByShareSlug(slug);
    } catch (slugError) {
      console.error(`Error fetching project by share slug ${slug}:`, slugError);
      // Continue to try token method
    }
    
    // If not found by slug, try as token
    if (!project) {
      try {
        project = await projectsStore.getByShareToken(slug);
      } catch (tokenError) {
        console.error(`Error fetching project by share token ${slug}:`, tokenError);
        // Both methods failed with errors
        throw new Error(`Failed to fetch project with identifier ${slug}`);
      }
    }
    
    // If still not found, return 404
    if (!project) {
      notFound();
    }
    
    // Check if the share has expired
    if (project.shareExpiryDate && new Date(project.shareExpiryDate) < new Date()) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Share Link Expired</h1>
            <p className="text-gray-600 mb-6">
              This shared link has expired and is no longer available.
            </p>
          </div>
        </div>
      )
    }
    
    // Get project elements based on project type
    let elements = [];
    
    // Check if this is an Elementor project or a Template project
    const isElementorProject = project.type === 'Elementor';
    
    if (isElementorProject) {
      elements = await projectsStore.getProjectElements(project.id);
    } else {
      // Assume it's a Template project
      elements = await templateStore.getTemplateElements(project.id);
    }
    
    // Determine which preview component to render based on project type
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 bg-blue-600 text-white flex justify-between items-center">
              <h1 className="text-xl font-semibold">
                {project.shareName || project.name}
              </h1>
              <div className="text-sm opacity-75">
                Shared via Squpage
              </div>
            </div>
            
            <div className="p-6">
              {!isElementorProject && (
                <TemplatePreview project={project} elements={elements} />
              )}
              
              {isElementorProject && (
                <ElementorPreview project={project} elements={elements} />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error in SharedProjectPage:', error);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Project</h1>
          <p className="text-gray-600 mb-6">
            There was an error loading this project. Please check your connection and try again.
          </p>
          <p className="text-sm text-gray-500">
            Error details: {error instanceof Error ? error.message : 'Unknown error'}
          </p>
        </div>
      </div>
    );
  }
}

// Template Preview Component
function TemplatePreview({ project, elements }: { project: ProjectData | TemplateProject, elements: any[] }) {
  return (
    <div className="template-preview">
      <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden relative">
        {project.thumbnail && (
          <img 
            src={project.thumbnail} 
            alt={project.name} 
            className="w-full h-full object-cover"
          />
        )}
        
        <div className="absolute inset-0 flex flex-col p-8">
          {elements.map((element) => (
            <div key={element.id} className="mb-4">
              {element.type === 'heading' && (
                <h2 className="text-2xl font-bold" style={element.styles}>
                  {element.content}
                </h2>
              )}
              
              {element.type === 'text' && (
                <p style={element.styles}>{element.content}</p>
              )}
              
              {element.type === 'image' && element.content && (
                <img 
                  src={element.content} 
                  alt="Content" 
                  className="max-w-full rounded"
                  style={element.styles}
                />
              )}
              
              {element.type === 'button' && (
                <button 
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                  style={element.styles}
                >
                  {element.content || 'Button'}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">{project.name}</h2>
        <p className="text-gray-600">
          {project.settings?.description || 'No description available'}
        </p>
      </div>
    </div>
  )
}

// Elementor Preview Component
function ElementorPreview({ project, elements }: { project: ProjectData | TemplateProject, elements: any[] }) {
  // Group elements by their parent-child relationship
  const rootElements = elements.filter(el => !el.parentId)
  
  const getChildElements = (parentId: string) => {
    return elements.filter(el => el.parentId === parentId)
  }
  
  return (
    <div className="elementor-preview">
      <div className="bg-gray-100 rounded-lg overflow-hidden">
        {rootElements.map((element) => (
          <RenderElement 
            key={element.id} 
            element={element} 
            getChildElements={getChildElements}
          />
        ))}
      </div>
      
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">{project.name}</h2>
        <p className="text-gray-600">
          {project.settings?.description || 'No description available'}
        </p>
      </div>
    </div>
  )
}


// Helper component to recursively render Elementor elements
function RenderElement({ 
  element, 
  getChildElements 
}: { 
  element: any, 
  getChildElements: (parentId: string) => any[]
}) {
  const childElements = getChildElements(element.id)
  
  switch (element.type) {
    case 'section':
      return (
        <div className="section w-full py-8" style={element.styles}>
          {childElements.map(child => (
            <RenderElement key={child.id} element={child} getChildElements={getChildElements} />
          ))}
        </div>
      )
      
    case 'row':
      return (
        <div className="row flex flex-wrap mx-auto max-w-6xl px-4" style={element.styles}>
          {childElements.map(child => (
            <RenderElement key={child.id} element={child} getChildElements={getChildElements} />
          ))}
        </div>
      )
      
    case 'column':
      return (
        <div className="column flex-1 px-4" style={element.styles}>
          {childElements.map(child => (
            <RenderElement key={child.id} element={child} getChildElements={getChildElements} />
          ))}
        </div>
      )
      
    case 'heading':
      return (
        <h2 className="text-2xl font-bold mb-4" style={element.styles}>
          {element.content}
        </h2>
      )
      
    case 'text':
      return (
        <div className="mb-4" style={element.styles} 
          dangerouslySetInnerHTML={{ __html: element.content }} 
        />
      )
      
    case 'image':
      return (
        <div className="mb-4">
          <img 
            src={element.content} 
            alt="Content" 
            className="max-w-full rounded"
            style={element.styles}
          />
        </div>
      )
      
    case 'button':
      return (
        <div className="mb-4">
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded"
            style={element.styles}
          >
            {element.content || 'Button'}
          </button>
        </div>
      )
      
    default:
      return (
        <div className="mb-4 p-4 border border-dashed border-gray-300 rounded">
          {element.content || `${element.type} element`}
        </div>
      )
  }
}

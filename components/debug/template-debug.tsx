"use client"

import { Button } from "@/components/ui/button"
import { useTemplateEditor } from "@/lib/template-editor-context"

// Define the element type for better type safety
interface TemplateElement {
  id: string
  content: any
  type: string
}

export function TemplateDebug() {
  const { elements, templateId, resetAllTemplates } = useTemplateEditor()

  const showCurrentState = () => {
    console.log("=== CURRENT TEMPLATE STATE ===")
    console.log("Template ID:", templateId)
    console.log("Elements count:", elements.length)
    console.log("Elements:", elements.map(el => ({ id: el.id, content: el.content })))
    
    // Show localStorage contents
    console.log("=== LOCALSTORAGE CONTENTS ===")
    const allKeys = Object.keys(localStorage)
    const templateKeys = allKeys.filter(key => key.includes('template') || key.includes('editor'))
    
    console.log("All template keys:", templateKeys)
    
    templateKeys.forEach(key => {
      try {
        const value = localStorage.getItem(key)
        if (value && (value.startsWith('[') || value.startsWith('{'))) {
          const parsed = JSON.parse(value)
          console.log(`${key}:`, parsed)
        } else {
          console.log(`${key}:`, value)
        }
      } catch (e) {
        console.log(`${key}:`, localStorage.getItem(key))
      }
    })
    
    // Check specific templates
    console.log("=== SPECIFIC TEMPLATE CHECK ===")
    const templates = ['saas-landing', 'portfolio', 'ebook-landing', 'septiclean']
    templates.forEach(template => {
      const key = `template-editor-elements_${template}`
      const value = localStorage.getItem(key)
      if (value) {
        try {
          const parsed = JSON.parse(value)
          console.log(`${template}: ${parsed.length} elements`, parsed.map((el: TemplateElement) => ({ id: el.id, content: el.content })))
        } catch (e) {
          console.log(`${template}: Invalid data`, value)
        }
      } else {
        console.log(`${template}: No data`)
      }
    })
  }

  const resetAll = () => {
    if (confirm('This will reset ALL template data. Are you sure?')) {
      resetAllTemplates()
      
      // Also clear any other template-related storage
      const allKeys = Object.keys(localStorage)
      const templateKeys = allKeys.filter(key => 
        key.includes('template') || 
        key.includes('editor') ||
        key.includes('squpage_template') ||
        key.includes('squpage_elements')
      )
      
      templateKeys.forEach(key => {
        localStorage.removeItem(key)
        console.log(`Removed: ${key}`)
      })
      
      alert('All template data has been reset. Please refresh the page.')
    }
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 border rounded shadow-lg z-50">
      <h3 className="font-bold mb-2">Template Debug</h3>
      <div className="space-y-2">
        <Button onClick={showCurrentState} size="sm" variant="outline">
          Log Current State
        </Button>
        <Button onClick={resetAll} size="sm" variant="destructive">
          Reset All Templates
        </Button>
      </div>
      <div className="text-xs mt-2 text-gray-500">
        Template: {templateId}<br/>
        Elements: {elements.length}
      </div>
    </div>
  )
}
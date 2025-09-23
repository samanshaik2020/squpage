"use client"

import { Button } from "@/components/ui/button"
import { useTemplateEditor } from "@/lib/template-editor-context"
import { useState } from "react"
import { toast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

// Define the element type for better type safety
interface TemplateElement {
  id: string
  content: any
  type: string
}

export function TemplateDebug() {
  const { elements, templateId, resetAllTemplates } = useTemplateEditor()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false)

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
    
    // Show success toast
    toast({
      title: "Template Data Reset",
      description: "All template data has been reset. Please refresh the page.",
      variant: "default"
    })

    // Close the dialog
    setIsResetDialogOpen(false)
  }

  return (
    <div
      className={`fixed bottom-4 right-4 bg-white border rounded-full shadow-lg z-50 cursor-pointer transition-all duration-300 ease-in-out ${
        isExpanded
          ? 'w-80 p-4 rounded-lg'
          : 'w-12 h-12 p-0 rounded-full'
      }`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {isExpanded ? (
        <>
          <h3 className="font-bold mb-2">Template Debug</h3>
          <div className="space-y-2">
            <Button onClick={showCurrentState} size="sm" variant="outline">
              Log Current State
            </Button>
            <AlertDialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button size="sm" variant="destructive">
                  Reset All Templates
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will reset ALL template data. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={resetAll} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Reset All Templates
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          <div className="text-xs mt-2 text-gray-500">
            Template: {templateId}<br/>
            Elements: {elements.length}
          </div>
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-sm font-bold text-gray-700">🐛</span>
        </div>
      )}
    </div>
  )
}
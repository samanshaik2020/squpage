"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { ElementorPreviewRenderer } from "@/components/editor/elementor-preview-renderer"

export default function ElementorPreviewPage() {
  const [content, setContent] = useState<any[]>([])
  
  // Load content from localStorage on component mount
  useEffect(() => {
    const savedContent = localStorage.getItem('elementorPreviewData')
    if (savedContent) {
      try {
        const parsedContent = JSON.parse(savedContent)
        console.log('Preview data loaded:', parsedContent)
        setContent(parsedContent)
      } catch (error) {
        console.error('Failed to parse preview data:', error)
      }
    } else {
      console.warn('No elementorPreviewData found in localStorage')
    }
  }, [])
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Preview Header */}
      <header className="bg-white border-b border-gray-200 py-4 px-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/elementor">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Editor
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">Page Preview</h1>
        </div>
        
        <div>
          <Button size="sm">Publish</Button>
        </div>
      </header>
      
      {/* Preview Content */}
      <main className="flex-1 bg-gray-50 p-8 flex justify-center">
        <div className="bg-white shadow-lg rounded-lg w-full max-w-5xl min-h-[600px] p-8">
          {content && content.length > 0 ? (
            <ElementorPreviewRenderer elements={content} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">No Content Yet</h2>
              <p className="text-gray-500 max-w-md mb-6">
                Your page doesn't have any content yet. Go back to the editor and add some elements to see them in the preview.
              </p>
              <Link href="/elementor">
                <Button>
                  Return to Editor
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

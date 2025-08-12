"use client"

import { use, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Share2 } from "lucide-react"
import Link from "next/link"
import { ElementorStorage, ElementorPage, createSamplePage } from "@/lib/elementor-storage"
import { UniversalRenderer } from "@/components/editor/universal-renderer"

interface ElementorPreviewPageProps {
  params: Promise<{
    id: string
  }>
}

export default function ElementorPreviewPage({ params }: ElementorPreviewPageProps) {
  const resolvedParams = use(params)
  const [page, setPage] = useState<ElementorPage | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPage = () => {
      let pageData = ElementorStorage.getPage(resolvedParams.id)
      
      // If no page found and it's "sample", create a sample page
      if (!pageData && resolvedParams.id === "sample") {
        pageData = createSamplePage()
        ElementorStorage.savePage(pageData)
      }
      
      setPage(pageData)
      setLoading(false)
    }

    loadPage()
  }, [resolvedParams.id])

  const getElementChildren = (parentId: string) => {
    if (!page) return []
    return page.elements.filter(element => element.parentId === parentId)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading page...</p>
        </div>
      </div>
    )
  }

  if (!page) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h1>
          <p className="text-gray-600 mb-6">The requested page could not be found.</p>
          <Link href="/elementor">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Editor
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <Link href="/elementor">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Editor
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{page.title}</h1>
              <p className="text-sm text-gray-500">Preview Mode</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </header>

      {/* Preview Content */}
      <main className="max-w-7xl mx-auto">
        {page.elements.length === 0 ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Empty Page</h2>
              <p className="text-gray-600 mb-4">This page doesn't have any content yet.</p>
              <Link href="/elementor">
                <Button>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Go to Editor
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <UniversalRenderer
            elements={page.elements}
            isEditable={false}
            selectedElement={null}
            getElementChildren={getElementChildren}
          />
        )}
      </main>
    </div>
  )
}

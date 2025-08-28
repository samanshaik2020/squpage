"use client"

import { use } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Share2 } from "lucide-react"
import Link from "next/link"
import { SaasLandingTemplate } from "@/components/templates/saas-landing"
import { PortfolioTemplate } from "@/components/templates/portfolio"
import { SeptiCleanTemplate } from "@/components/templates/septiclean"
import { EbookLandingTemplate } from "@/components/templates/ebook-landing"
import { AIGeneratedBlogPostTemplate } from "@/components/templates/ai-generated-blog-post"
import { ProductLandingPageTemplate } from "@/components/templates/product-landing-page"
import { AIPortfolioTemplate } from "@/components/templates/ai-portfolio"
import { AIBlogPageTemplate } from "@/components/templates/ai-blog-page"
import { DentalHealthLandingTemplate } from "@/components/templates/dental-health-landing"
import { AIDentalHealthLandingTemplate } from "@/components/templates/ai-dental-health-landing"
import { TemplateEditorProvider } from "@/lib/template-editor-context"

interface PreviewPageProps {
  params: Promise<{
    id: string
  }>
}

export default function PreviewPage({ params }: PreviewPageProps) {
  const resolvedParams = use(params)
  
  const getTemplateName = () => {
    switch (resolvedParams.id) {
      case "saas-landing":
        return "SaaS Landing"
      case "portfolio":
        return "Portfolio"
      case "septiclean":
        return "SeptiClean"
      case "ebook-landing":
        return "Ebook Landing Page"
      case "ai-generated-blog-post":
        return "AI Blog Post"
      case "product-landing-page":
        return "Product Landing Page"
      case "ai-portfolio":
        return "AI Portfolio"
      case "ai-blog-page":
        return "AI Blog Page"
      case "dental-health-landing":
        return "Dental Health Landing"
      case "ai-dental-health-landing":
        return "AI Dental Health Landing"
      default:
        return "Template"
    }
  }

  const renderTemplate = () => {
    const commonProps = {
      selectedElement: null,
      onElementSelect: () => {}, // No-op for preview
      isEditable: false, // Pass isEditable as false for preview
    }

    switch (resolvedParams.id) {
      case "saas-landing":
        return <SaasLandingTemplate {...commonProps} />
      case "portfolio":
        return <PortfolioTemplate {...commonProps} />
      case "septiclean":
        return <SeptiCleanTemplate {...commonProps} />
      case "ebook-landing":
        return <EbookLandingTemplate {...commonProps} />
      case "ai-generated-blog-post":
        return <AIGeneratedBlogPostTemplate {...commonProps} />
      case "product-landing-page":
        return <ProductLandingPageTemplate {...commonProps} />
      case "ai-portfolio":
        return <AIPortfolioTemplate {...commonProps} />
      case "ai-blog-page":
        return <AIBlogPageTemplate {...commonProps} />
      case "dental-health-landing":
        return <DentalHealthLandingTemplate {...commonProps} />
      case "ai-dental-health-landing":
        return <AIDentalHealthLandingTemplate {...commonProps} />
      default:
        return <SaasLandingTemplate {...commonProps} />
    }
  }

  return (
    <TemplateEditorProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Preview Header */}
        <div className="bg-white border-b sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link
                href={`/editor/${resolvedParams.id}`}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Editor</span>
              </Link>

              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Preview: {getTemplateName()}</span>
                <Button size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Content */}
        <div className="bg-white">{renderTemplate()}</div>
      </div>
    </TemplateEditorProvider>
  )
}

import { Button } from "@/components/ui/button"
import { ArrowLeft, Share2 } from "lucide-react"
import Link from "next/link"
import { SaasLandingTemplate } from "@/components/editor/templates/saas-landing"
import { PortfolioTemplate } from "@/components/editor/templates/portfolio"
import { SeptiCleanTemplate } from "@/components/editor/templates/septiclean"

interface PreviewPageProps {
  params: {
    id: string
  }
}

export default function PreviewPage({ params }: PreviewPageProps) {
  const getTemplateName = () => {
    switch (params.id) {
      case "saas-landing":
        return "SaaS Landing"
      case "portfolio":
        return "Portfolio"
      case "septiclean":
        return "SeptiClean"
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

    switch (params.id) {
      case "saas-landing":
        return <SaasLandingTemplate {...commonProps} />
      case "portfolio":
        return <PortfolioTemplate {...commonProps} />
      case "septiclean":
        return <SeptiCleanTemplate {...commonProps} />
      default:
        return <SaasLandingTemplate {...commonProps} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Preview Header */}
      <div className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              href={`/editor/${params.id}`}
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
  )
}

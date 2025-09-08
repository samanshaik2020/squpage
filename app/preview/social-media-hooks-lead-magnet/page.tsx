"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Eye } from "lucide-react"
import Link from "next/link"
import SocialMediaHooksLeadMagnet from "@/components/templates/social-media-hooks-lead-magnet"

export default function SocialMediaHooksPreview() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b px-4 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <Link href="/templates">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Templates
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Social Media Hooks Lead Magnet
              </h1>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                  AI-Powered
                </Badge>
                <Badge variant="outline">Lead Magnet</Badge>
                <Badge variant="outline">Premium</Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              Preview Mode
            </Button>
            <Link href="/editor/social-media-hooks-lead-magnet">
              <Button>
                <Edit className="w-4 h-4 mr-2" />
                Edit Template
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Template Preview */}
      <div className="bg-white">
        <SocialMediaHooksLeadMagnet 
          onSubmit={(data) => {
            console.log('Form submitted:', data)
            // Handle form submission
          }}
        />
      </div>

      {/* Template Info */}
      <div className="bg-gray-50 border-t px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                About This Template
              </h2>
              <p className="text-gray-600 mb-4">
                This professional lead magnet template is designed to capture high-quality leads 
                by offering valuable social media hooks and templates. Perfect for marketers, 
                content creators, and businesses looking to grow their email list.
              </p>
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">Features:</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• High-converting lead capture form</li>
                  <li>• Professional design with social proof</li>
                  <li>• Mobile-responsive layout</li>
                  <li>• AI-powered content generation</li>
                  <li>• Customizable colors and content</li>
                  <li>• Email integration ready</li>
                </ul>
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                AI Editing Features
              </h2>
              <p className="text-gray-600 mb-4">
                This template includes advanced AI features to help you create 
                compelling content that converts visitors into subscribers.
              </p>
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">AI Capabilities:</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Generate attention-grabbing headlines</li>
                  <li>• Create compelling benefit lists</li>
                  <li>• Optimize descriptions for conversions</li>
                  <li>• Generate social media hooks</li>
                  <li>• A/B test different variations</li>
                  <li>• Personalize content for your audience</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
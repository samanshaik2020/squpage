"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { X, Sparkles } from 'lucide-react'

interface AIGenerationModalProps {
  isOpen: boolean
  onClose: () => void
  onGenerate: (input: string) => void
  templateId: string
  isGenerating: boolean
}

export function AIGenerationModal({ 
  isOpen, 
  onClose, 
  onGenerate, 
  templateId, 
  isGenerating 
}: AIGenerationModalProps) {
  const [userInput, setUserInput] = useState('')

  if (!isOpen) return null

  const getPromptConfig = () => {
    switch (templateId) {
      case "ai-generated-blog-post":
        return {
          title: "Generate AI Blog Post",
          description: "Enter a topic and we'll create a complete blog post with engaging content, proper structure, and SEO-friendly formatting.",
          placeholder: "e.g., The Future of Artificial Intelligence in Healthcare",
          label: "Blog Topic",
          inputType: "input"
        }
      case "product-landing-page":
        return {
          title: "Generate Product Landing Page",
          description: "Enter your product name and we'll create a complete landing page with compelling copy, features, testimonials, and call-to-actions.",
          placeholder: "e.g., EcoClean Pro - Eco-Friendly Cleaning Solution",
          label: "Product Name & Brief Description",
          inputType: "textarea"
        }
      case "ai-portfolio":
        return {
          title: "Generate AI Portfolio",
          description: "Enter your name, profession, and key skills. We'll create a professional portfolio showcasing your expertise and experience.",
          placeholder: "e.g., John Smith, Full Stack Developer, React, Node.js, Python",
          label: "Name, Profession & Skills",
          inputType: "textarea"
        }
      case "ai-blog-page":
        return {
          title: "Generate Blog Website",
          description: "Enter your blog name and niche. We'll create a complete blog website with multiple posts, categories, and professional layout.",
          placeholder: "e.g., TechInsights - Technology and Innovation Blog",
          label: "Blog Name & Niche",
          inputType: "input"
        }
      case "ai-dental-health-landing":
        return {
          title: "Generate Health Product Landing",
          description: "Enter your health product name and we'll create a landing page with health benefits, testimonials, and compelling copy.",
          placeholder: "e.g., DentalCare Pro - Advanced Teeth Whitening System",
          label: "Health Product Name & Description",
          inputType: "textarea"
        }
      case "social-media-hooks-lead-magnet":
        return {
          title: "Generate Lead Magnet Content",
          description: "Enter your lead magnet topic and target audience. We'll create compelling headlines, benefits, and social media hooks.",
          placeholder: "e.g., Social Media Marketing Tips for Small Business Owners",
          label: "Lead Magnet Topic & Target Audience",
          inputType: "textarea"
        }
      default:
        return {
          title: "Generate AI Content",
          description: "Enter your requirements and we'll generate content for your template.",
          placeholder: "Describe what you want to create...",
          label: "Content Requirements",
          inputType: "textarea"
        }
    }
  }

  const config = getPromptConfig()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (userInput.trim()) {
      onGenerate(userInput.trim())
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">{config.title}</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              disabled={isGenerating}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Description */}
          <p className="text-gray-600 mb-6 text-sm leading-relaxed">
            {config.description}
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="user-input" className="text-sm font-medium text-gray-700">
                {config.label}
              </Label>
              {config.inputType === "textarea" ? (
                <Textarea
                  id="user-input"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder={config.placeholder}
                  className="mt-1 min-h-[100px]"
                  disabled={isGenerating}
                  required
                />
              ) : (
                <Input
                  id="user-input"
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder={config.placeholder}
                  className="mt-1"
                  disabled={isGenerating}
                  required
                />
              )}
            </div>

            {/* Actions */}
            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isGenerating}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isGenerating || !userInput.trim()}
                className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Content
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Pro tip */}
          <div className="mt-6 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-700">
              💡 <strong>Pro tip:</strong> Be specific about your requirements for better AI-generated content. 
              Include target audience, tone, and key features you want to highlight.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
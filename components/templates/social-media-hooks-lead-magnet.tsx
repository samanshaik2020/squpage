"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TemplateEditableElement } from "./template-editable-element"
import { CheckCircle, Users, Star, TrendingUp } from "lucide-react"

interface SocialMediaHooksLeadMagnetProps {
  selectedElement: string | null
  onElementSelect: (elementId: string) => void
  isEditable: boolean
}

export default function SocialMediaHooksLeadMagnet({ 
  selectedElement, 
  onElementSelect, 
  isEditable 
}: SocialMediaHooksLeadMagnetProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-200">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Left Column - Main Content */}
          <div className="space-y-6">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
                <TemplateEditableElement
                  id="logo-text"
                  type="text"
                  className="text-white font-bold text-lg"
                  isSelected={selectedElement === "logo-text"}
                  onSelect={onElementSelect}
                  defaultContent="CP"
                  isEditable={isEditable}
                />
              </div>
              <div className="text-sm font-semibold text-gray-800">
                <TemplateEditableElement
                  id="company-name"
                  type="text"
                  className="text-sm font-semibold text-gray-800"
                  isSelected={selectedElement === "company-name"}
                  onSelect={onElementSelect}
                  defaultContent="COPY POSSE"
                  isEditable={isEditable}
                />
              </div>
            </div>

            {/* Hook Count */}
            <TemplateEditableElement
              id="subheadline"
              type="text"
              className="text-lg text-gray-800 font-medium"
              isSelected={selectedElement === "subheadline"}
              onSelect={onElementSelect}
              defaultContent="99 Social Media Hooks That Capture Attention"
              isEditable={isEditable}
            />

            {/* Main Headline */}
            <div className="space-y-4">
              <TemplateEditableElement
                id="main-headline"
                type="heading"
                className="text-4xl lg:text-5xl font-black text-gray-900 leading-tight"
                isSelected={selectedElement === "main-headline"}
                onSelect={onElementSelect}
                defaultContent="GET MORE CLICKS, ENGAGEMENT, & CONVERSIONS"
                isEditable={isEditable}
              />
              
              <TemplateEditableElement
                id="description"
                type="text"
                className="text-lg text-gray-800 leading-relaxed"
                isSelected={selectedElement === "description"}
                onSelect={onElementSelect}
                defaultContent="Use these fill-in-the-blank hook templates to write attention-grabbing hooks for your captions, Reel cover photos, headlines, subject lines, ads, YouTube video titles, and sales page openers."
                isEditable={isEditable}
              />
            </div>

            {/* Lead Capture Form */}
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardContent className="p-6">
                <form className="space-y-4">
                  <Input
                    type="text"
                    placeholder="First Name"
                    className="text-lg py-3"
                  />
                  <Input
                    type="email"
                    placeholder="Email"
                    className="text-lg py-3"
                  />
                  <Button className="w-full bg-black hover:bg-gray-800 text-white text-lg py-3 font-bold">
                    <TemplateEditableElement
                      id="cta-button"
                      type="text"
                      className="text-white"
                      isSelected={selectedElement === "cta-button"}
                      onSelect={onElementSelect}
                      defaultContent="GET INSTANT ACCESS"
                      isEditable={isEditable}
                    />
                  </Button>
                </form>
                
                <div className="text-xs text-gray-600 mt-4 leading-relaxed">
                  <TemplateEditableElement
                    id="privacy-text"
                    type="text"
                    className="text-xs text-gray-600"
                    isSelected={selectedElement === "privacy-text"}
                    onSelect={onElementSelect}
                    defaultContent="When you sign up for this free guide, I'll also send you weekly email updates to my latest YouTube episodes, VIP content and the occasional product recommendation. I'll always respect your privacy and data."
                    isEditable={isEditable}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Benefits & About */}
          <div className="bg-yellow-400 p-8 rounded-lg space-y-8">
            {/* Book Preview */}
            <div className="text-center">
              <div className="inline-block bg-gradient-to-br from-purple-600 to-pink-600 p-6 rounded-lg shadow-lg">
                <div className="bg-white rounded p-4 text-center">
                  <TemplateEditableElement
                    id="book-title"
                    type="text"
                    className="text-sm font-bold text-gray-900 leading-tight"
                    isSelected={selectedElement === "book-title"}
                    onSelect={onElementSelect}
                    defaultContent="99 HOT HOOK TEMPLATES"
                    isEditable={isEditable}
                  />
                  <div className="mt-2">
                    <TemplateEditableElement
                      id="book-author"
                      type="text"
                      className="text-xs text-gray-600"
                      isSelected={selectedElement === "book-author"}
                      onSelect={onElementSelect}
                      defaultContent="COPY POSSE"
                      isEditable={isEditable}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* What You'll Learn */}
            <div>
              <TemplateEditableElement
                id="benefits-title"
                type="heading"
                className="text-xl font-bold text-gray-900 mb-4"
                isSelected={selectedElement === "benefits-title"}
                onSelect={onElementSelect}
                defaultContent="WHAT YOU'LL LEARN IN THIS FREE SWIPE FILE:"
                isEditable={isEditable}
              />
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <TemplateEditableElement
                    id="benefit-1"
                    type="text"
                    className="text-gray-800"
                    isSelected={selectedElement === "benefit-1"}
                    onSelect={onElementSelect}
                    defaultContent="Discover the #1 goal your marketing must accomplish."
                    isEditable={isEditable}
                  />
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <TemplateEditableElement
                    id="benefit-2"
                    type="text"
                    className="text-gray-800"
                    isSelected={selectedElement === "benefit-2"}
                    onSelect={onElementSelect}
                    defaultContent="Learn when and where a good hook is absolutely critical."
                    isEditable={isEditable}
                  />
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <TemplateEditableElement
                    id="benefit-3"
                    type="text"
                    className="text-gray-800"
                    isSelected={selectedElement === "benefit-3"}
                    onSelect={onElementSelect}
                    defaultContent="Get 99 Posse-approved hook ideas & templates."
                    isEditable={isEditable}
                  />
                </div>
              </div>
            </div>

            {/* About Section */}
            <div>
              <TemplateEditableElement
                id="about-title"
                type="heading"
                className="text-xl font-bold text-gray-900 mb-4"
                isSelected={selectedElement === "about-title"}
                onSelect={onElementSelect}
                defaultContent="ABOUT ALEX & THE COPY POSSE"
                isEditable={isEditable}
              />
              
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
                  <TemplateEditableElement
                    id="author-initial"
                    type="text"
                    className="text-white font-bold text-2xl"
                    isSelected={selectedElement === "author-initial"}
                    onSelect={onElementSelect}
                    defaultContent="A"
                    isEditable={isEditable}
                  />
                </div>
                <div>
                  <TemplateEditableElement
                    id="author-name"
                    type="text"
                    className="font-bold text-gray-900"
                    isSelected={selectedElement === "author-name"}
                    onSelect={onElementSelect}
                    defaultContent="Alex Cattoni"
                    isEditable={isEditable}
                  />
                  <TemplateEditableElement
                    id="author-title"
                    type="text"
                    className="text-sm text-gray-700"
                    isSelected={selectedElement === "author-title"}
                    onSelect={onElementSelect}
                    defaultContent="Founder, Copy Posse"
                    isEditable={isEditable}
                  />
                </div>
              </div>
              
              <TemplateEditableElement
                id="author-bio"
                type="text"
                className="text-sm text-gray-800 leading-relaxed"
                isSelected={selectedElement === "author-bio"}
                onSelect={onElementSelect}
                defaultContent="Alex is the founder of the Copy Posse, where she is on a mission to de-douchify the Internet. Modern marketing & build an empathy empire. Through her online programs and communities, Alex has helped over 500,000 marketers & business owners ignite their income with her fun and empathetic approach to branding, marketing and copywriting."
                isEditable={isEditable}
              />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <Users className="w-8 h-8 text-gray-700 mx-auto mb-2" />
                <div className="font-bold text-gray-900">
                  <TemplateEditableElement
                    id="stat-1-number"
                    type="text"
                    className="font-bold text-gray-900"
                    isSelected={selectedElement === "stat-1-number"}
                    onSelect={onElementSelect}
                    defaultContent="500K+"
                    isEditable={isEditable}
                  />
                </div>
                <div className="text-xs text-gray-700">
                  <TemplateEditableElement
                    id="stat-1-label"
                    type="text"
                    className="text-xs text-gray-700"
                    isSelected={selectedElement === "stat-1-label"}
                    onSelect={onElementSelect}
                    defaultContent="Students"
                    isEditable={isEditable}
                  />
                </div>
              </div>
              
              <div>
                <Star className="w-8 h-8 text-gray-700 mx-auto mb-2" />
                <div className="font-bold text-gray-900">
                  <TemplateEditableElement
                    id="stat-2-number"
                    type="text"
                    className="font-bold text-gray-900"
                    isSelected={selectedElement === "stat-2-number"}
                    onSelect={onElementSelect}
                    defaultContent="Featured"
                    isEditable={isEditable}
                  />
                </div>
                <div className="text-xs text-gray-700">
                  <TemplateEditableElement
                    id="stat-2-label"
                    type="text"
                    className="text-xs text-gray-700"
                    isSelected={selectedElement === "stat-2-label"}
                    onSelect={onElementSelect}
                    defaultContent="Expert"
                    isEditable={isEditable}
                  />
                </div>
              </div>
              
              <div>
                <TrendingUp className="w-8 h-8 text-gray-700 mx-auto mb-2" />
                <div className="font-bold text-gray-900">
                  <TemplateEditableElement
                    id="stat-3-number"
                    type="text"
                    className="font-bold text-gray-900"
                    isSelected={selectedElement === "stat-3-number"}
                    onSelect={onElementSelect}
                    defaultContent="Proven"
                    isEditable={isEditable}
                  />
                </div>
                <div className="text-xs text-gray-700">
                  <TemplateEditableElement
                    id="stat-3-label"
                    type="text"
                    className="text-xs text-gray-700"
                    isSelected={selectedElement === "stat-3-label"}
                    onSelect={onElementSelect}
                    defaultContent="Results"
                    isEditable={isEditable}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
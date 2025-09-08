"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Save, 
  Eye, 
  Wand2, 
  Download, 
  Settings, 
  Palette,
  Type,
  Layout,
  Zap
} from "lucide-react"
import SocialMediaHooksLeadMagnet from "@/components/templates/social-media-hooks-lead-magnet"

export default function SocialMediaHooksEditor() {
  const [activeTab, setActiveTab] = useState("design")
  const [isPreview, setIsPreview] = useState(false)
  const [isSaving, setSaving] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  // Template content state
  const [templateData, setTemplateData] = useState({
    headline: "GET MORE CLICKS, ENGAGEMENT, & CONVERSIONS",
    subheadline: "99 Social Media Hooks That Capture Attention", 
    description: "Use these fill-in-the-blank hook templates to write attention-grabbing hooks for your captions, Reel cover photos, headlines, subject lines, ads, YouTube video titles, and sales page openers.",
    benefitTitle: "WHAT YOU'LL LEARN IN THIS FREE SWIPE FILE:",
    benefits: [
      "Discover the #1 goal your marketing must accomplish.",
      "Learn when and where a good hook is absolutely critical.", 
      "Get 99 Posse-approved hook ideas & templates."
    ],
    aboutTitle: "ABOUT ALEX & THE COPY POSSE",
    aboutText: "Alex is the founder of the Copy Posse, where she is on a mission to de-douchify the Internet, redefine modern marketing & build an empathy empire. Through her online programs and communities, Alex has helped over 500,000 marketers & business owners ignite their income with her fun and empathetic approach to branding, marketing and copywriting.",
    ctaText: "GET INSTANT ACCESS",
    privacyText: "When you sign up for this free guide, I'll also send you weekly email updates to my latest YouTube episodes, VIP content and the occasional product recommendation. I'll always respect your privacy and data.",
    colors: {
      primary: "#FDE047", // yellow-300
      secondary: "#FACC15", // yellow-400  
      accent: "#EAB308", // yellow-500
      text: "#111827", // gray-900
      background: "#FFFBEB" // yellow-50
    }
  })

  const handleContentChange = (field: string, value: string) => {
    setTemplateData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleBenefitChange = (index: number, value: string) => {
    setTemplateData(prev => ({
      ...prev,
      benefits: prev.benefits.map((benefit, i) => i === index ? value : benefit)
    }))
  }

  const addBenefit = () => {
    setTemplateData(prev => ({
      ...prev,
      benefits: [...prev.benefits, "New benefit point"]
    }))
  }

  const removeBenefit = (index: number) => {
    setTemplateData(prev => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index)
    }))
  }

  const generateContent = async (type: string) => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'lead-magnet-content',
          contentType: type,
          currentContent: templateData
        })
      })
      const data = await response.json()
      
      if (type === 'headline') {
        handleContentChange('headline', data.content)
      } else if (type === 'benefits') {
        setTemplateData(prev => ({
          ...prev,
          benefits: data.content.split('\n').filter((b: string) => b.trim())
        }))
      } else if (type === 'description') {
        handleContentChange('description', data.content)
      }
    } catch (error) {
      console.error('Error generating content:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const saveTemplate = async () => {
    setSaving(true)
    try {
      // Save template logic here
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate save
    } catch (error) {
      console.error('Error saving template:', error)
    } finally {
      setSaving(false)
    }
  }

  if (isPreview) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="sticky top-0 z-50 bg-white border-b px-4 py-3">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => setIsPreview(false)}
              >
                ← Back to Editor
              </Button>
              <Badge variant="secondary">Preview Mode</Badge>
            </div>
            <Button onClick={saveTemplate} disabled={isSaving}>
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
        <SocialMediaHooksLeadMagnet />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b px-4 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-gray-900">
              Social Media Hooks Lead Magnet
            </h1>
            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
              AI-Powered
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsPreview(true)}
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button onClick={saveTemplate} disabled={isSaving}>
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Editor Panel */}
          <div className="lg:col-span-1 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="content" className="flex items-center space-x-1">
                  <Type className="w-4 h-4" />
                  <span>Content</span>
                </TabsTrigger>
                <TabsTrigger value="design" className="flex items-center space-x-1">
                  <Palette className="w-4 h-4" />
                  <span>Design</span>
                </TabsTrigger>
                <TabsTrigger value="ai" className="flex items-center space-x-1">
                  <Wand2 className="w-4 h-4" />
                  <span>AI</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Main Content</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="headline">Headline</Label>
                      <Textarea
                        id="headline"
                        value={templateData.headline}
                        onChange={(e) => handleContentChange('headline', e.target.value)}
                        className="mt-1"
                        rows={2}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={templateData.description}
                        onChange={(e) => handleContentChange('description', e.target.value)}
                        className="mt-1"
                        rows={4}
                      />
                    </div>

                    <div>
                      <Label htmlFor="cta">Call-to-Action Text</Label>
                      <Input
                        id="cta"
                        value={templateData.ctaText}
                        onChange={(e) => handleContentChange('ctaText', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Benefits</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="benefit-title">Benefits Title</Label>
                      <Input
                        id="benefit-title"
                        value={templateData.benefitTitle}
                        onChange={(e) => handleContentChange('benefitTitle', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    
                    {templateData.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          value={benefit}
                          onChange={(e) => handleBenefitChange(index, e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeBenefit(index)}
                          disabled={templateData.benefits.length <= 1}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                    
                    <Button
                      variant="outline"
                      onClick={addBenefit}
                      className="w-full"
                    >
                      + Add Benefit
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">About Section</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="about-title">About Title</Label>
                      <Input
                        id="about-title"
                        value={templateData.aboutTitle}
                        onChange={(e) => handleContentChange('aboutTitle', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="about-text">About Text</Label>
                      <Textarea
                        id="about-text"
                        value={templateData.aboutText}
                        onChange={(e) => handleContentChange('aboutText', e.target.value)}
                        className="mt-1"
                        rows={4}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="design" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Color Scheme</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Primary Color</Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <input
                            type="color"
                            value={templateData.colors.primary}
                            onChange={(e) => setTemplateData(prev => ({
                              ...prev,
                              colors: { ...prev.colors, primary: e.target.value }
                            }))}
                            className="w-8 h-8 rounded border"
                          />
                          <Input
                            value={templateData.colors.primary}
                            onChange={(e) => setTemplateData(prev => ({
                              ...prev,
                              colors: { ...prev.colors, primary: e.target.value }
                            }))}
                            className="flex-1"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label>Secondary Color</Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <input
                            type="color"
                            value={templateData.colors.secondary}
                            onChange={(e) => setTemplateData(prev => ({
                              ...prev,
                              colors: { ...prev.colors, secondary: e.target.value }
                            }))}
                            className="w-8 h-8 rounded border"
                          />
                          <Input
                            value={templateData.colors.secondary}
                            onChange={(e) => setTemplateData(prev => ({
                              ...prev,
                              colors: { ...prev.colors, secondary: e.target.value }
                            }))}
                            className="flex-1"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="ai" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Zap className="w-5 h-5 mr-2 text-purple-600" />
                      AI Content Generation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Button
                        onClick={() => generateContent('headline')}
                        disabled={isGenerating}
                        className="w-full justify-start"
                        variant="outline"
                      >
                        <Wand2 className="w-4 h-4 mr-2" />
                        {isGenerating ? "Generating..." : "Generate New Headline"}
                      </Button>
                      
                      <Button
                        onClick={() => generateContent('description')}
                        disabled={isGenerating}
                        className="w-full justify-start"
                        variant="outline"
                      >
                        <Wand2 className="w-4 h-4 mr-2" />
                        {isGenerating ? "Generating..." : "Generate Description"}
                      </Button>
                      
                      <Button
                        onClick={() => generateContent('benefits')}
                        disabled={isGenerating}
                        className="w-full justify-start"
                        variant="outline"
                      >
                        <Wand2 className="w-4 h-4 mr-2" />
                        {isGenerating ? "Generating..." : "Generate Benefits"}
                      </Button>
                    </div>
                    
                    <Separator />
                    
                    <div className="text-sm text-gray-600">
                      <p className="font-medium mb-2">AI Features:</p>
                      <ul className="space-y-1 text-xs">
                        <li>• Generate compelling headlines</li>
                        <li>• Create benefit lists</li>
                        <li>• Optimize for conversions</li>
                        <li>• A/B test variations</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Live Preview</CardTitle>
                  <Badge variant="outline">Responsive</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="border rounded-lg overflow-hidden bg-white">
                  <div className="transform scale-75 origin-top-left w-[133.33%] h-[133.33%]">
                    <SocialMediaHooksLeadMagnet 
                      isEditable={false}
                      onEdit={handleContentChange}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
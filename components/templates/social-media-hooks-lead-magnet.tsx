"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { 
  Wand2, Download, CheckCircle, Star, Users, TrendingUp, 
  Settings, Palette, Type, Layout, Plus, Trash2, Edit3,
  Sparkles, RefreshCw, Save, Eye, EyeOff, Upload, Image as ImageIcon
} from "lucide-react"
import Image from "next/image"

interface SocialMediaHooksLeadMagnetProps {
  onSubmit?: (data: { firstName: string; email: string }) => void
  isEditable?: boolean
  onEdit?: (field: string, value: string) => void
  onSave?: (content: any) => void
}

interface ColorScheme {
  name: string
  primary: string
  secondary: string
  accent: string
  background: string
  text: string
}

interface SocialProofItem {
  icon: string
  value: string
  label: string
}

export default function SocialMediaHooksLeadMagnet({ 
  onSubmit, 
  isEditable = false, 
  onEdit,
  onSave
}: SocialMediaHooksLeadMagnetProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    email: ""
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState("")
  
  // Edit panel state
  const [showEditPanel, setShowEditPanel] = useState(false)
  const [activeTab, setActiveTab] = useState('content')
  const [isGeneratingAI, setIsGeneratingAI] = useState(false)
  
  // Color schemes
  const colorSchemes: ColorScheme[] = [
    {
      name: "Yellow Energy",
      primary: "from-yellow-400 via-yellow-300 to-yellow-200",
      secondary: "bg-yellow-400",
      accent: "from-purple-600 to-pink-600",
      background: "bg-white/90",
      text: "text-gray-900"
    },
    {
      name: "Ocean Blue",
      primary: "from-blue-400 via-blue-300 to-blue-200",
      secondary: "bg-blue-400",
      accent: "from-indigo-600 to-purple-600",
      background: "bg-white/90",
      text: "text-gray-900"
    },
    {
      name: "Sunset Orange",
      primary: "from-orange-400 via-orange-300 to-orange-200",
      secondary: "bg-orange-400",
      accent: "from-red-600 to-pink-600",
      background: "bg-white/90",
      text: "text-gray-900"
    },
    {
      name: "Forest Green",
      primary: "from-green-400 via-green-300 to-green-200",
      secondary: "bg-green-400",
      accent: "from-emerald-600 to-teal-600",
      background: "bg-white/90",
      text: "text-gray-900"
    }
  ]
  
  const [selectedColorScheme, setSelectedColorScheme] = useState(colorSchemes[0])

  // Editable content state
  const [content, setContent] = useState({
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
    logoText: "CP",
    companyName: "COPY\nPOSSE",
    bookTitle: "99 HOT\nHOOK\nTEMPLATES",
    socialProof: [
      { icon: "Users", value: "500K+", label: "Students" },
      { icon: "Star", value: "Featured", label: "Expert" },
      { icon: "TrendingUp", value: "Proven", label: "Results" }
    ]
  })

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleContentEdit = (field: string, value: string) => {
    setContent(prev => ({ ...prev, [field]: value }))
    onEdit?.(field, value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.firstName || !formData.email) return

    setIsSubmitted(true)
    onSubmit?.(formData)
  }

  const generateHooks = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'social-media-hooks',
          topic: 'engagement and conversions',
          count: 10
        })
      })
      const data = await response.json()
      setGeneratedContent(data.content)
    } catch (error) {
      console.error('Error generating hooks:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  // AI Generation Functions
  const generateWithAI = async (type: string, context?: string) => {
    setIsGeneratingAI(true)
    try {
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          context: context || content.headline,
          industry: 'marketing',
          tone: 'energetic'
        })
      })
      const data = await response.json()
      return data.content
    } catch (error) {
      console.error('Error generating content:', error)
      return null
    } finally {
      setIsGeneratingAI(false)
    }
  }

  const generateHeadline = async () => {
    const newHeadline = await generateWithAI('headline', 'lead magnet for social media hooks')
    if (newHeadline) {
      handleContentEdit('headline', newHeadline)
    }
  }

  const generateDescription = async () => {
    const newDescription = await generateWithAI('description', content.headline)
    if (newDescription) {
      handleContentEdit('description', newDescription)
    }
  }

  const generateBenefits = async () => {
    const newBenefits = await generateWithAI('benefits', content.headline)
    if (newBenefits) {
      try {
        const benefitsArray = JSON.parse(newBenefits)
        setContent(prev => ({ ...prev, benefits: benefitsArray }))
        onEdit?.('benefits', JSON.stringify(benefitsArray))
      } catch {
        // If not JSON, split by lines
        const benefitsArray = newBenefits.split('\n').filter((b: string) => b.trim())
        setContent(prev => ({ ...prev, benefits: benefitsArray }))
        onEdit?.('benefits', JSON.stringify(benefitsArray))
      }
    }
  }

  const generateAboutText = async () => {
    const newAbout = await generateWithAI('about', 'expert in social media marketing')
    if (newAbout) {
      handleContentEdit('aboutText', newAbout)
    }
  }

  // Edit functions
  const addBenefit = () => {
    const newBenefits = [...content.benefits, "New benefit point"]
    setContent(prev => ({ ...prev, benefits: newBenefits }))
    onEdit?.('benefits', JSON.stringify(newBenefits))
  }

  const removeBenefit = (index: number) => {
    const newBenefits = content.benefits.filter((_, i) => i !== index)
    setContent(prev => ({ ...prev, benefits: newBenefits }))
    onEdit?.('benefits', JSON.stringify(newBenefits))
  }

  const updateBenefit = (index: number, value: string) => {
    const newBenefits = [...content.benefits]
    newBenefits[index] = value
    setContent(prev => ({ ...prev, benefits: newBenefits }))
    onEdit?.('benefits', JSON.stringify(newBenefits))
  }

  const addSocialProof = () => {
    const newProof = [...content.socialProof, { icon: "Star", value: "New", label: "Metric" }]
    setContent(prev => ({ ...prev, socialProof: newProof }))
    onEdit?.('socialProof', JSON.stringify(newProof))
  }

  const removeSocialProof = (index: number) => {
    const newProof = content.socialProof.filter((_, i) => i !== index)
    setContent(prev => ({ ...prev, socialProof: newProof }))
    onEdit?.('socialProof', JSON.stringify(newProof))
  }

  const updateSocialProof = (index: number, field: string, value: string) => {
    const newProof = [...content.socialProof]
    newProof[index] = { ...newProof[index], [field]: value }
    setContent(prev => ({ ...prev, socialProof: newProof }))
    onEdit?.('socialProof', JSON.stringify(newProof))
  }

  const saveTemplate = () => {
    const templateData = {
      content,
      colorScheme: selectedColorScheme
    }
    onSave?.(templateData)
  }

  const EditableText = ({ 
    children, 
    field, 
    className = "", 
    multiline = false 
  }: { 
    children: string
    field: string
    className?: string
    multiline?: boolean
  }) => {
    if (!isEditable) {
      return multiline ? (
        <div className={className}>{children}</div>
      ) : (
        <span className={className}>{children}</span>
      )
    }

    return multiline ? (
      <Textarea
        value={children}
        onChange={(e) => handleContentEdit(field, e.target.value)}
        className={`${className} min-h-[100px] resize-none border-dashed border-blue-300 focus:border-blue-500`}
      />
    ) : (
      <Input
        value={children}
        onChange={(e) => handleContentEdit(field, e.target.value)}
        className={`${className} border-dashed border-blue-300 focus:border-blue-500`}
      />
    )
  }

  // Edit Panel Component
  const EditPanel = () => (
    <div className={`fixed right-0 top-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 z-50 ${showEditPanel ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Edit Template</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowEditPanel(false)}
          >
            <EyeOff className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex mt-3 space-x-1">
          {[
            { id: 'content', label: 'Content', icon: Edit3 },
            { id: 'style', label: 'Style', icon: Palette },
            { id: 'ai', label: 'AI Tools', icon: Sparkles }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                activeTab === tab.id 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="w-3 h-3" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 overflow-y-auto h-full pb-20">
        {/* Content Tab */}
        {activeTab === 'content' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Headline</label>
              <Textarea
                value={content.headline}
                onChange={(e) => handleContentEdit('headline', e.target.value)}
                className="w-full"
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subheadline</label>
              <Input
                value={content.subheadline}
                onChange={(e) => handleContentEdit('subheadline', e.target.value)}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <Textarea
                value={content.description}
                onChange={(e) => handleContentEdit('description', e.target.value)}
                className="w-full"
                rows={4}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Benefits</label>
                <Button size="sm" variant="outline" onClick={addBenefit}>
                  <Plus className="w-3 h-3 mr-1" />
                  Add
                </Button>
              </div>
              <div className="space-y-2">
                {content.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={benefit}
                      onChange={(e) => updateBenefit(index, e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeBenefit(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">About Text</label>
              <Textarea
                value={content.aboutText}
                onChange={(e) => handleContentEdit('aboutText', e.target.value)}
                className="w-full"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">CTA Button Text</label>
              <Input
                value={content.ctaText}
                onChange={(e) => handleContentEdit('ctaText', e.target.value)}
                className="w-full"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Social Proof</label>
                <Button size="sm" variant="outline" onClick={addSocialProof}>
                  <Plus className="w-3 h-3 mr-1" />
                  Add
                </Button>
              </div>
              <div className="space-y-3">
                {content.socialProof.map((proof, index) => (
                  <div key={index} className="border rounded p-3 space-y-2">
                    <div className="flex items-center space-x-2">
                      <Input
                        placeholder="Value"
                        value={proof.value}
                        onChange={(e) => updateSocialProof(index, 'value', e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeSocialProof(index)}
                        className="text-red-500"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                    <Input
                      placeholder="Label"
                      value={proof.label}
                      onChange={(e) => updateSocialProof(index, 'label', e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Style Tab */}
        {activeTab === 'style' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Color Scheme</label>
              <div className="grid grid-cols-1 gap-3">
                {colorSchemes.map((scheme, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedColorScheme(scheme)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedColorScheme.name === scheme.name
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded bg-gradient-to-r ${scheme.primary}`}></div>
                      <div>
                        <div className="font-medium text-left">{scheme.name}</div>
                        <div className="text-xs text-gray-500">Click to apply</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Logo Text</label>
              <Input
                value={content.logoText}
                onChange={(e) => handleContentEdit('logoText', e.target.value)}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
              <Textarea
                value={content.companyName}
                onChange={(e) => handleContentEdit('companyName', e.target.value)}
                className="w-full"
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Book Title</label>
              <Textarea
                value={content.bookTitle}
                onChange={(e) => handleContentEdit('bookTitle', e.target.value)}
                className="w-full"
                rows={3}
              />
            </div>
          </div>
        )}

        {/* AI Tools Tab */}
        {activeTab === 'ai' && (
          <div className="space-y-4">
            <div className="text-sm text-gray-600 mb-4">
              Use AI to generate compelling content for your lead magnet
            </div>

            <Button
              onClick={generateHeadline}
              disabled={isGeneratingAI}
              className="w-full justify-start"
              variant="outline"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {isGeneratingAI ? 'Generating...' : 'Generate New Headline'}
            </Button>

            <Button
              onClick={generateDescription}
              disabled={isGeneratingAI}
              className="w-full justify-start"
              variant="outline"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {isGeneratingAI ? 'Generating...' : 'Generate Description'}
            </Button>

            <Button
              onClick={generateBenefits}
              disabled={isGeneratingAI}
              className="w-full justify-start"
              variant="outline"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {isGeneratingAI ? 'Generating...' : 'Generate Benefits List'}
            </Button>

            <Button
              onClick={generateAboutText}
              disabled={isGeneratingAI}
              className="w-full justify-start"
              variant="outline"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {isGeneratingAI ? 'Generating...' : 'Generate About Text'}
            </Button>

            <div className="border-t pt-4 mt-6">
              <h4 className="font-medium text-gray-900 mb-3">Quick Actions</h4>
              
              <Button
                onClick={() => {
                  setContent({
                    ...content,
                    headline: "UNLOCK THE SECRETS TO VIRAL CONTENT",
                    description: "Get the exact templates and strategies used by top creators to generate millions of views and engagement."
                  })
                }}
                className="w-full justify-start mb-2"
                variant="outline"
                size="sm"
              >
                <RefreshCw className="w-3 h-3 mr-2" />
                Apply Viral Template
              </Button>

              <Button
                onClick={() => {
                  setContent({
                    ...content,
                    headline: "MASTER THE ART OF PERSUASIVE COPY",
                    description: "Learn the psychology-backed techniques that convert browsers into buyers with proven copywriting frameworks."
                  })
                }}
                className="w-full justify-start"
                variant="outline"
                size="sm"
              >
                <RefreshCw className="w-3 h-3 mr-2" />
                Apply Sales Template
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t">
        <Button onClick={saveTemplate} className="w-full">
          <Save className="w-4 h-4 mr-2" />
          Save Template
        </Button>
      </div>
    </div>
  )

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-200 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="p-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
            <p className="text-gray-600 mb-6">
              Check your email for the download link to your free Social Media Hooks guide.
            </p>
            <Button onClick={generateHooks} disabled={isGenerating} className="w-full">
              <Wand2 className="w-4 h-4 mr-2" />
              {isGenerating ? "Generating..." : "Generate Bonus Hooks with AI"}
            </Button>
            {generatedContent && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg text-left">
                <h3 className="font-semibold mb-2">AI-Generated Hooks:</h3>
                <div className="text-sm text-gray-700 whitespace-pre-line">
                  {generatedContent}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <>
      {/* Edit Panel */}
      {isEditable && <EditPanel />}
      
      {/* Edit Button */}
      {isEditable && (
        <Button
          onClick={() => setShowEditPanel(!showEditPanel)}
          className="fixed top-4 right-4 z-40 shadow-lg"
          size="sm"
        >
          {showEditPanel ? <EyeOff className="w-4 h-4 mr-2" /> : <Settings className="w-4 h-4 mr-2" />}
          {showEditPanel ? 'Hide' : 'Edit'}
        </Button>
      )}

      <div className={`min-h-screen bg-gradient-to-br ${selectedColorScheme.primary}`}>
        <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Left Column - Main Content */}
          <div className="space-y-6">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
                <EditableText field="logoText" className="text-white font-bold text-lg">
                  {content.logoText}
                </EditableText>
              </div>
              <div className="text-sm font-semibold text-gray-800 whitespace-pre-line">
                <EditableText field="companyName" className="text-sm font-semibold text-gray-800">
                  {content.companyName}
                </EditableText>
              </div>
            </div>

            {/* Hook Count */}
            <div className="text-lg text-gray-800 font-medium">
              <EditableText field="subheadline" className="text-lg text-gray-800 font-medium">
                {content.subheadline}
              </EditableText>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <EditableText 
                field="headline"
                className="text-4xl lg:text-5xl font-black text-gray-900 leading-tight"
              >
                {content.headline}
              </EditableText>
              
              <EditableText 
                field="description"
                className="text-lg text-gray-800 leading-relaxed"
                multiline
              >
                {content.description}
              </EditableText>
            </div>

            {/* Lead Capture Form */}
            <Card className={`${selectedColorScheme.background} backdrop-blur-sm`}>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    type="text"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    className="text-lg py-3"
                    required
                  />
                  <Input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="text-lg py-3"
                    required
                  />
                  <Button 
                    type="submit" 
                    className="w-full bg-black hover:bg-gray-800 text-white text-lg py-3 font-bold"
                  >
                    <EditableText field="ctaText" className="text-white">
                      {content.ctaText}
                    </EditableText>
                  </Button>
                </form>
                
                <div className="text-xs text-gray-600 mt-4 leading-relaxed">
                  <EditableText field="privacyText" className="text-xs text-gray-600" multiline>
                    {content.privacyText}
                  </EditableText>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Benefits & About */}
          <div className={`${selectedColorScheme.secondary} p-8 rounded-lg space-y-8`}>
            {/* Book Preview */}
            <div className="text-center">
              <div className={`inline-block bg-gradient-to-br ${selectedColorScheme.accent} p-6 rounded-lg shadow-lg`}>
                <div className="bg-white rounded p-4 text-center">
                  <div className="text-sm font-bold text-gray-900 whitespace-pre-line leading-tight">
                    <EditableText field="bookTitle" className="text-sm font-bold text-gray-900" multiline>
                      {content.bookTitle}
                    </EditableText>
                  </div>
                  <div className="text-xs text-gray-600 mt-2">
                    <EditableText field="companyName" className="text-xs text-gray-600">
                      {content.companyName.replace('\n', ' ')}
                    </EditableText>
                  </div>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                <EditableText field="benefitTitle">
                  {content.benefitTitle}
                </EditableText>
              </h3>
              <div className="space-y-3">
                {content.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <EditableText 
                      field={`benefit-${index}`}
                      className="text-gray-800"
                    >
                      {benefit}
                    </EditableText>
                  </div>
                ))}
              </div>
            </div>

            {/* About Section */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                <EditableText field="aboutTitle">
                  {content.aboutTitle}
                </EditableText>
              </h3>
              
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex-shrink-0"></div>
                <EditableText 
                  field="aboutText"
                  className="text-sm text-gray-800 leading-relaxed"
                  multiline
                >
                  {content.aboutText}
                </EditableText>
              </div>

              {/* Social Proof */}
              <div className="flex items-center justify-center space-x-6 pt-4 border-t border-gray-300">
                {content.socialProof.map((proof, index) => {
                  const IconComponent = proof.icon === 'Users' ? Users : 
                                       proof.icon === 'Star' ? Star : 
                                       proof.icon === 'TrendingUp' ? TrendingUp : Star
                  return (
                    <div key={index} className="flex items-center space-x-2">
                      <IconComponent className="w-5 h-5 text-gray-600" />
                      <div className="text-center">
                        <div className="text-sm font-semibold text-gray-800">{proof.value}</div>
                        <div className="text-xs text-gray-600">{proof.label}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
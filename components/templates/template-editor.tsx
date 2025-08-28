"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { SaasLandingTemplate } from "./saas-landing"
import { PortfolioTemplate } from "./portfolio"
import { SeptiCleanTemplate } from "./septiclean"
import { EbookLandingTemplate } from "./ebook-landing"
import { AIGeneratedBlogPostTemplate } from "./ai-generated-blog-post"
import { ProductLandingPageTemplate } from "./product-landing-page"
import { AIPortfolioTemplate } from "./ai-portfolio"
import { AIBlogPageTemplate } from "./ai-blog-page"
import { DentalHealthLandingTemplate } from "./dental-health-landing"
import { AIDentalHealthLandingTemplate } from "./ai-dental-health-landing"
import { TemplateEditingPanel } from "@/components/templates/template-editing-panel"
import { TemplateEditorProvider, useTemplateEditor } from "@/lib/template-editor-context"
import { AIGenerationModal } from "@/components/editor/ai-generation-modal"
import { AIGenerationLoading } from "@/components/editor/ai-generation-loading"
import { Sparkles } from "lucide-react"

interface TemplateEditorProps {
  templateId: string
}

export function TemplateEditor({ templateId }: TemplateEditorProps) {
  const [viewMode, setViewMode] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const editorRef = useRef<HTMLDivElement>(null)

  return (
    <TemplateEditorProvider>
      <TemplateEditorContent templateId={templateId} viewMode={viewMode} setViewMode={setViewMode} editorRef={editorRef} />
    </TemplateEditorProvider>
  )
}

function TemplateEditorContent({
  templateId,
  viewMode,
  setViewMode,
  editorRef,
}: {
  templateId: string
  viewMode: "desktop" | "tablet" | "mobile"
  setViewMode: React.Dispatch<React.SetStateAction<"desktop" | "tablet" | "mobile">>
  editorRef: React.RefObject<HTMLDivElement | null>
}) {
  const { selectedElement, selectElement, canUndo, canRedo, undo, redo, updateElement, setTemplateId } = useTemplateEditor()
  const [isGenerating, setIsGenerating] = useState(false)
  const [showAIModal, setShowAIModal] = useState(false)
  const [showLoadingScreen, setShowLoadingScreen] = useState(false)
  const [templateGenerated, setTemplateGenerated] = useState(false)

  // State to track if elements have been initialized
  const [elementsInitialized, setElementsInitialized] = useState(false)

  // Check if this is a paid AI template
  const isPaidAITemplate = [
    "ai-generated-blog-post",
    "product-landing-page", 
    "ai-portfolio",
    "ai-blog-page",
    "ai-dental-health-landing"
  ].includes(templateId)

  // Show AI modal on mount for paid templates
  useEffect(() => {
    if (isPaidAITemplate && !templateGenerated) {
      setShowAIModal(true)
    }
  }, [isPaidAITemplate, templateGenerated])
  
  // Initialize template context with templateId
  useEffect(() => {
    setTemplateId(templateId);
  }, [templateId, setTemplateId]);

  // Initialize template elements when component mounts (only once)
  useEffect(() => {
    // Only initialize if not already done and not a paid AI template that hasn't been generated
    if (!elementsInitialized && !(isPaidAITemplate && !templateGenerated)) {
      console.log("Template editor: Initializing template elements for:", templateId);
      
      // Clear existing elements first to avoid conflicts
      // Initialize elements based on template type
      if (templateId === "ai-blog-page") {
        // Initialize AI blog page elements
        const blogElements = [
          { id: "blog-logo", type: "text", content: "TechBlog" },
          { id: "blog-title", type: "heading", content: "Welcome to TechBlog" },
          { id: "blog-subtitle", type: "text", content: "Discover the latest insights, tutorials, and trends in technology and development" },
          { id: "featured-post-image", type: "image", content: "Featured Article", url: "/placeholder.svg?height=400&width=600&text=Featured+Article" },
          { id: "featured-post-category", type: "text", content: "Technology" },
          { id: "featured-post-date", type: "text", content: "March 15, 2024" },
          { id: "featured-post-title", type: "heading", content: "The Future of Web Development: Trends to Watch in 2024" },
          { id: "featured-post-excerpt", type: "text", content: "Explore the cutting-edge technologies and methodologies that are shaping the future of web development. From AI integration to new frameworks, discover what's coming next." },
          { id: "featured-post-author-avatar", type: "image", content: "Author", url: "/placeholder.svg?height=40&width=40&text=Author" },
          { id: "featured-post-author", type: "text", content: "Sarah Johnson" },
          { id: "newsletter-title", type: "heading", content: "Stay Updated" },
          { id: "newsletter-description", type: "text", content: "Get the latest articles and insights delivered directly to your inbox" },
          { id: "footer-logo", type: "text", content: "TechBlog" },
          { id: "footer-description", type: "text", content: "Your go-to source for technology insights and development tutorials." },
          { id: "footer-copyright", type: "text", content: "© 2024 TechBlog. All rights reserved." }
        ];
        
        // Initialize blog post elements (1-6)
        for (let i = 1; i <= 6; i++) {
          blogElements.push(
            { id: `post-${i}-image`, type: "image", content: `Article ${i}`, url: `/placeholder.svg?height=200&width=400&text=Article+${i}` },
            { id: `post-${i}-category`, type: "text", content: "Development" },
            { id: `post-${i}-date`, type: "text", content: "Mar 10, 2024" },
            { id: `post-${i}-title`, type: "heading", content: `Article Title ${i}: Exploring Modern Development Practices` },
            { id: `post-${i}-excerpt`, type: "text", content: `Brief excerpt of article ${i} that gives readers a preview of the content and encourages them to read more.` },
            { id: `post-${i}-author-avatar`, type: "image", content: "A", url: "/placeholder.svg?height=32&width=32&text=A" },
            { id: `post-${i}-author`, type: "text", content: `Author ${i}` }
          );
        }
        
        // Initialize category elements (1-8)
        for (let i = 1; i <= 8; i++) {
          blogElements.push(
            { id: `category-${i}-icon`, type: "text", content: "📱" },
            { id: `category-${i}-name`, type: "text", content: `Category ${i}` },
            { id: `category-${i}-count`, type: "text", content: `${i * 5} articles` }
          );
        }
        
        // Initialize all elements
        blogElements.forEach(element => {
          updateElement(element.id, {
            type: element.type,
            content: element.content,
            url: element.url,
            styles: {},
            position: { x: 0, y: 0 }
          });
        });
      } else if (templateId === "product-landing-page") {
        // Initialize product landing page elements with default content
        updateElement("product-title", { 
          type: "heading", 
          content: "Your Amazing Product",
          styles: {},
          position: { x: 0, y: 0 }
        });
        
        updateElement("product-tagline", { 
          type: "text", 
          content: "A short, memorable tagline that highlights the main value proposition",
          styles: {},
          position: { x: 0, y: 0 }
        });
        
        updateElement("product-description", { 
          type: "text", 
          content: "A compelling 2-3 sentence description that explains what the product is and its main benefits.",
          styles: {},
          position: { x: 0, y: 0 }
        });
      } else {
        // Initialize common elements for free templates (saas-landing, portfolio, etc.)
        const commonElements = [
          { id: "hero-title", type: "heading", content: "Welcome to Our Platform" },
          { id: "hero-subtitle", type: "text", content: "Transform your business with our innovative solutions" },
          { id: "hero-cta", type: "button", content: "Get Started" },
          { id: "company-logo", type: "text", content: "YourBrand" },
          { id: "nav-logo", type: "text", content: "YourBrand" },
          { id: "footer-logo", type: "text", content: "YourBrand" },
          { id: "about-title", type: "heading", content: "About Us" },
          { id: "about-description", type: "text", content: "We are passionate about delivering exceptional solutions that drive results." },
          { id: "contact-title", type: "heading", content: "Get in Touch" },
          { id: "contact-description", type: "text", content: "Ready to get started? Contact us today!" }
        ];
        
        // Add feature elements
        for (let i = 1; i <= 6; i++) {
          commonElements.push(
            { id: `feature-${i}-title`, type: "heading", content: `Feature ${i}` },
            { id: `feature-${i}-description`, type: "text", content: `Description for feature ${i} that explains its benefits.` }
          );
        }
        
        // Initialize all common elements
        commonElements.forEach(element => {
          updateElement(element.id, {
            type: element.type,
            content: element.content,
            styles: {},
            position: { x: 0, y: 0 }
          });
        });
      }
      
      // Mark as initialized
      setElementsInitialized(true);
    }
  }, [templateId, updateElement, elementsInitialized, isPaidAITemplate, templateGenerated]);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement

      if (target.closest(".editing-panel")) {
        return
      }

      if (target.closest("[data-editable]")) {
        return
      }

      selectElement(null)
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [selectElement])

  const getViewportWidth = () => {
    switch (viewMode) {
      case "desktop":
        return "100%"
      case "tablet":
        return "768px"
      case "mobile":
        return "375px"
      default:
        return "100%"
    }
  }

  const getTemplateName = () => {
    switch (templateId) {
      case "saas-landing":
        return "SaaS Landing"
      case "portfolio":
        return "Portfolio"
      case "septiclean":
        return "SeptiClean"
      case "ebook-landing":
        return "Ebook Landing"
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

  const handleGenerateAIContent = async (userInput: string) => {
    let requestParam = "topic"
    
    if (templateId === "product-landing-page") {
      requestParam = "productName"
    } else if (templateId === "ai-portfolio") {
      requestParam = "portfolioInfo"
    } else if (templateId === "ai-blog-page") {
      requestParam = "blogInfo"
    } else if (templateId === "ai-dental-health-landing") {
      requestParam = "healthProductName"
    } else {
      requestParam = "topic"
    }

    setShowAIModal(false)
    setShowLoadingScreen(true)
    setIsGenerating(true)
    
    // Clear existing elements before AI generation to ensure clean state
    console.log("Template editor: Clearing elements before AI generation");
    try {
      const response = await fetch("/api/generate-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ [requestParam]: userInput }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("AI Generated Content:", data)
      
      // Ensure we have valid data before proceeding
      if (!data || typeof data !== 'object') {
        throw new Error("Invalid response data from AI generation");
      }
      
      console.log("Template editor: Starting to update elements with AI content");
      
      // Update elements with AI-generated content based on template
      if (templateId === "product-landing-page") {
        console.log("Template editor: Updating product landing page elements with:", data);
        
        // Force element initialization and update with complete element objects
        const updateElementWithForce = (id: string, content: string, type: string = "text", url?: string) => {
          console.log(`Force updating element ${id} with content:`, content);
          
          // Create a complete element object
          const elementData = {
            type: type,
            content: content,
            styles: {},
            position: { x: 0, y: 0 },
            ...(url && { url: url })
          };
          
          console.log(`Element data for ${id}:`, elementData);
          updateElement(id, elementData);
          
          // Force a re-render by triggering a small delay
          setTimeout(() => {
            console.log(`Re-updating element ${id} to ensure it's applied`);
            updateElement(id, elementData);
          }, 100);
        };
        
        // Update navigation and branding
        if (data["product-name"]) {
          updateElementWithForce("nav-logo", data["product-name"], "text");
          updateElementWithForce("footer-logo", data["product-name"], "text");
        }
        
        // Update hero section
        if (data["product-title"]) {
          updateElementWithForce("product-title", data["product-title"], "heading");
        }
        
        if (data["product-tagline"]) {
          updateElementWithForce("product-tagline", data["product-tagline"], "text");
        }
        
        // Update about section
        if (data["product-description"]) {
          updateElementWithForce("about-description", data["product-description"], "text");
        }
        
        if (data["about-title"]) {
          updateElementWithForce("about-title", data["about-title"], "heading");
        }
        
        // Handle features - parse and distribute to 6 feature elements
        if (data["product-features"]) {
          const features = data["product-features"].split('\n').filter((f: string) => f.trim() !== '').slice(0, 6)
          
          features.forEach((feature: string, index: number) => {
            const featureNumber = index + 1
            const featureParts = feature.split(': ')
            
            if (featureParts.length > 1) {
              // If feature is in "Feature: Description" format
              updateElementWithForce(`feature-${featureNumber}-title`, featureParts[0].trim(), "heading");
              updateElementWithForce(`feature-${featureNumber}-description`, featureParts[1].trim(), "text");
            } else {
              // If feature is just text, use generic title
              updateElementWithForce(`feature-${featureNumber}-title`, `Feature ${featureNumber}`, "heading");
              updateElementWithForce(`feature-${featureNumber}-description`, feature.trim(), "text");
            }
          })
        }
        
        // Update CTAs
        if (data["product-cta"]) {
          updateElementWithForce("product-cta-primary", data["product-cta"], "button");
          updateElementWithForce("final-cta-primary", data["product-cta"], "button");
        }
      } else if (templateId === "ai-blog-page") {
        console.log("Template editor: Updating AI blog page elements with:", data);
        
        // Force element initialization and update for blog template
        const updateElementWithForce = (id: string, content: string, type: string = "text", url?: string) => {
          console.log(`Force updating blog element ${id} with content:`, content);
          updateElement(id, {
            type: type,
            content: content,
            url: url,
            styles: {},
            position: { x: 0, y: 0 }
          });
        };
        
        // Update blog elements based on AI response
        if (data["blog-title"]) {
          updateElementWithForce("blog-title", data["blog-title"], "heading");
          updateElementWithForce("blog-logo", data["blog-title"], "text");
          updateElementWithForce("footer-logo", data["blog-title"], "text");
        }
        
        if (data["blog-subtitle"]) {
          updateElementWithForce("blog-subtitle", data["blog-subtitle"], "text");
        }
        
        if (data["featured-post-title"]) {
          updateElementWithForce("featured-post-title", data["featured-post-title"], "heading");
        }
        
        if (data["featured-post-excerpt"]) {
          updateElementWithForce("featured-post-excerpt", data["featured-post-excerpt"], "text");
        }
        
        if (data["featured-post-author"]) {
          updateElementWithForce("featured-post-author", data["featured-post-author"], "text");
        }
      } else if (templateId === "ai-portfolio") {
        console.log("Template editor: Updating AI portfolio elements with:", data);
        
        const updateElementWithForce = (id: string, content: string, type: string = "text") => {
          console.log(`Force updating portfolio element ${id} with content:`, content);
          updateElement(id, {
            type: type,
            content: content,
            styles: {},
            position: { x: 0, y: 0 }
          });
        };
        
        // Update portfolio elements
        if (data["portfolio-name"]) {
          updateElementWithForce("portfolio-name", data["portfolio-name"], "text");
          updateElementWithForce("hero-name", data["portfolio-name"], "heading");
        }
        
        if (data["hero-title"]) {
          updateElementWithForce("hero-title", data["hero-title"], "text");
        }
        
        if (data["hero-description"]) {
          updateElementWithForce("hero-description", data["hero-description"], "text");
        }
        
        if (data["about-description"]) {
          updateElementWithForce("about-description", data["about-description"], "text");
        }
        
      } else if (templateId === "ai-dental-health-landing") {
        console.log("Template editor: Updating AI dental health landing elements with:", data);
        
        const updateElementWithForce = (id: string, content: string, type: string = "text") => {
          console.log(`Force updating dental element ${id} with content:`, content);
          updateElement(id, {
            type: type,
            content: content,
            styles: {},
            position: { x: 0, y: 0 }
          });
        };
        
        // Update dental health elements
        if (data["hero-title"]) {
          updateElementWithForce("hero-title", data["hero-title"], "heading");
        }
        
        if (data["hero-subtitle"]) {
          updateElementWithForce("hero-subtitle", data["hero-subtitle"], "text");
        }
        
        if (data["problem-title"]) {
          updateElementWithForce("problem-title", data["problem-title"], "heading");
        }
        
        if (data["problem-subtitle"]) {
          updateElementWithForce("problem-subtitle", data["problem-subtitle"], "text");
        }
        
      } else if (templateId === "ai-generated-blog-post") {
        console.log("Template editor: Updating AI generated blog post elements with:", data);
        
        const updateElementWithForce = (id: string, content: string, type: string = "text") => {
          console.log(`Force updating blog post element ${id} with content:`, content);
          updateElement(id, {
            type: type,
            content: content,
            styles: {},
            position: { x: 0, y: 0 }
          });
        };
        
        // Update blog post elements
        if (data["blog-title"]) {
          updateElementWithForce("blog-title", data["blog-title"], "heading");
        }
        
        if (data["blog-intro"]) {
          updateElementWithForce("blog-intro", data["blog-intro"], "text");
        }
        
        if (data["blog-paragraph-1"]) {
          updateElementWithForce("blog-paragraph-1", data["blog-paragraph-1"], "text");
        }
        
        if (data["blog-paragraph-2"]) {
          updateElementWithForce("blog-paragraph-2", data["blog-paragraph-2"], "text");
        }
        
        if (data["blog-paragraph-3"]) {
          updateElementWithForce("blog-paragraph-3", data["blog-paragraph-3"], "text");
        }
        
        if (data["blog-conclusion"]) {
          updateElementWithForce("blog-conclusion", data["blog-conclusion"], "text");
        }
      }
      // Add other template handling here...
      
      console.log("Template editor: AI content generation completed successfully");
      
      // Mark template as generated and force a re-render
      setTemplateGenerated(true);
      
      // Force a final update to ensure all elements are properly rendered
      setTimeout(() => {
        console.log("Template editor: Final element check after AI generation");
        setElementsInitialized(true);
      }, 500);
      
    } catch (error) {
      console.error("Failed to generate AI content:", error)
      alert("Failed to generate AI content. Check console for details.")
      setShowLoadingScreen(false)
      setShowAIModal(true) // Show modal again on error
    } finally {
      setIsGenerating(false)
      setShowLoadingScreen(false)
    }
  }

  const handleCloseAIModal = () => {
    setShowAIModal(false)
    // If user closes modal without generating, redirect back to templates
    if (!templateGenerated) {
      window.history.back()
    }
  }

  const renderTemplate = () => {
    const commonProps = {
      selectedElement,
      onElementSelect: selectElement,
      isEditable: true,
    }

    switch (templateId) {
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

  // Show loading screen during AI generation
  if (showLoadingScreen) {
    return <AIGenerationLoading templateId={templateId} />
  }

  // Show blank page with modal for paid templates that haven't been generated yet
  if (isPaidAITemplate && !templateGenerated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">AI-Powered Template</h2>
          <p className="text-gray-600">This template will be generated with AI based on your requirements.</p>
        </div>
        
        <AIGenerationModal
          isOpen={showAIModal}
          onClose={handleCloseAIModal}
          onGenerate={handleGenerateAIContent}
          templateId={templateId}
          isGenerating={isGenerating}
        />
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Top Bar */}
      <div className="h-16 bg-white border-b flex items-center justify-between px-4 relative z-50">
        <div className="flex items-center space-x-4">
          <Link href="/templates" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Templates</span>
          </Link>
          <div className="h-6 w-px bg-gray-300" />
          <h1 className="text-lg font-semibold text-gray-900">Editing: {getTemplateName()}</h1>
        </div>

        <div className="flex items-center space-x-2">
          {/* Viewport Controls */}
          <div className="flex items-center space-x-1 mr-4">
            <Button
              variant={viewMode === "desktop" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("desktop")}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
            </Button>
            <Button
              variant={viewMode === "tablet" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("tablet")}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
                <line x1="12" y1="18" x2="12.01" y2="18" />
              </svg>
            </Button>
            <Button
              variant={viewMode === "mobile" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("mobile")}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                <line x1="12" y1="18" x2="12.01" y2="18" />
              </svg>
            </Button>
          </div>

          {isPaidAITemplate && templateGenerated && (
            <Button size="sm" onClick={() => setShowAIModal(true)} disabled={isGenerating}>
              <Sparkles className="w-4 h-4 mr-2" />
              Regenerate with AI
            </Button>
          )}

          <Button variant="ghost" size="sm" disabled={!canUndo} onClick={undo}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
              />
            </svg>
          </Button>
          <Button variant="ghost" size="sm" disabled={!canRedo} onClick={redo}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 10h-10a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6"
              />
            </svg>
          </Button>
          <div className="h-6 w-px bg-gray-300" />
          <Link href={`/preview/${templateId}`}>
            <Button variant="outline" size="sm">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              Preview
            </Button>
          </Link>
          <Button size="sm">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            Save
          </Button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 relative overflow-auto" ref={editorRef}>
        <div className="min-h-full flex justify-center p-8">
          <div
            className="bg-white shadow-2xl transition-all duration-300 min-h-full"
            style={{ width: getViewportWidth(), maxWidth: "100%" }}
          >
            {renderTemplate()}
          </div>
        </div>

        {selectedElement && <TemplateEditingPanel elementId={selectedElement} onClose={() => selectElement(null)} />}
      </div>

      {/* AI Generation Modal */}
      <AIGenerationModal
        isOpen={showAIModal}
        onClose={handleCloseAIModal}
        onGenerate={handleGenerateAIContent}
        templateId={templateId}
        isGenerating={isGenerating}
      />
    </div>
  )
}

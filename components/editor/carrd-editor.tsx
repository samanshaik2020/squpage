"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { SaasLandingTemplate } from "./templates/saas-landing"
import { PortfolioTemplate } from "./templates/portfolio"
import { SeptiCleanTemplate } from "./templates/septiclean"
import { EbookLandingTemplate } from "./templates/ebook-landing"
import { AIGeneratedBlogPostTemplate } from "./templates/ai-generated-blog-post"
import { ProductLandingPageTemplate } from "./templates/product-landing-page" // Import product landing page template
import { AIPortfolioTemplate } from "./templates/ai-portfolio"
import { AIBlogPageTemplate } from "./templates/ai-blog-page"
import { DentalHealthLandingTemplate } from "./templates/dental-health-landing"
import { AIDentalHealthLandingTemplate } from "./templates/ai-dental-health-landing"
import { EditingPanel } from "./editing-panel"
import { EditorProvider, useEditor } from "@/lib/editor-context"
import { AIGenerationModal } from "./ai-generation-modal"
import { AIGenerationLoading } from "./ai-generation-loading"
import { Sparkles } from "lucide-react" // Import Sparkles icon

interface CarrdEditorProps {
  templateId: string
}

export function CarrdEditor({ templateId }: CarrdEditorProps) {
  const [viewMode, setViewMode] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const editorRef = useRef<HTMLDivElement>(null)

  return (
    <EditorProvider>
      <CarrdEditorContent templateId={templateId} viewMode={viewMode} setViewMode={setViewMode} editorRef={editorRef} />
    </EditorProvider>
  )
}

function CarrdEditorContent({
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
  const { selectedElement, selectElement, canUndo, canRedo, undo, redo, updateElement } = useEditor()
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
  
  // Initialize template elements when component mounts (only once)
  useEffect(() => {
    // Only initialize if not already done
    if (!elementsInitialized && (templateId === "product-landing-page" || templateId === "ai-portfolio" || templateId === "ai-blog-page")) {
      console.log("Initializing template elements for:", templateId);
      
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
      
      // Mark as initialized
      setElementsInitialized(true);
    }
  }, [templateId, updateElement, elementsInitialized]);
  
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
      
      // Debug: Check if we received the expected data structure
      console.log("Keys in response:", Object.keys(data))
      console.log("Product title:", data["product-title"])
      console.log("Product tagline:", data["product-tagline"])
      console.log("Product description:", data["product-description"])
      console.log("Product features:", data["product-features"])
      console.log("Product CTA:", data["product-cta"])

      // Update elements with AI-generated content based on template
      if (templateId === "product-landing-page") {
        console.log("Attempting to update product landing page elements with:", data);
        
        // Update navigation and branding
        if (data["product-name"]) {
          updateElement("nav-logo", { content: data["product-name"] });
          updateElement("footer-logo", { content: data["product-name"] });
        }
        
        // Update hero section
        if (data["product-title"]) {
          console.log("Updating product-title with:", data["product-title"]);
          updateElement("product-title", { content: data["product-title"] });
        }
        
        if (data["product-tagline"]) {
          console.log("Updating product-tagline with:", data["product-tagline"]);
          updateElement("product-tagline", { content: data["product-tagline"] });
        }
        
        // Update about section
        if (data["product-description"]) {
          console.log("Updating about-description with:", data["product-description"]);
          updateElement("about-description", { content: data["product-description"] });
        }
        
        if (data["about-title"]) {
          updateElement("about-title", { content: data["about-title"] });
        }
        
        // Handle features - parse and distribute to 6 feature elements
        if (data["product-features"]) {
          const features = data["product-features"].split('\n').filter((f: string) => f.trim() !== '').slice(0, 6)
          
          features.forEach((feature: string, index: number) => {
            const featureNumber = index + 1
            const featureParts = feature.split(': ')
            
            if (featureParts.length > 1) {
              // If feature is in "Feature: Description" format
              updateElement(`feature-${featureNumber}-title`, { content: featureParts[0].trim() })
              updateElement(`feature-${featureNumber}-description`, { content: featureParts[1].trim() })
            } else {
              // If feature is just text, use generic title
              updateElement(`feature-${featureNumber}-title`, { content: `Feature ${featureNumber}` })
              updateElement(`feature-${featureNumber}-description`, { content: feature.trim() })
            }
          })
        }
        
        // Update how it works section
        if (data["how-it-works"]) {
          const steps = data["how-it-works"].split('\n').filter((s: string) => s.trim() !== '').slice(0, 3)
          steps.forEach((step: string, index: number) => {
            const stepNumber = index + 1
            const stepParts = step.split(': ')
            
            if (stepParts.length > 1) {
              updateElement(`step-${stepNumber}-title`, { content: stepParts[0].trim() })
              updateElement(`step-${stepNumber}-description`, { content: stepParts[1].trim() })
            } else {
              updateElement(`step-${stepNumber}-title`, { content: `Step ${stepNumber}` })
              updateElement(`step-${stepNumber}-description`, { content: step.trim() })
            }
          })
        }
        
        // Update testimonials
        if (data["testimonials"]) {
          const testimonials = data["testimonials"].split('\n').filter((t: string) => t.trim() !== '').slice(0, 3)
          testimonials.forEach((testimonial: string, index: number) => {
            const testimonialNumber = index + 1
            updateElement(`testimonial-${testimonialNumber}-quote`, { content: testimonial.trim() })
          })
        }
        
        // Update FAQ section
        if (data["faqs"]) {
          const faqs = data["faqs"].split('\n').filter((f: string) => f.trim() !== '').slice(0, 5)
          faqs.forEach((faq: string, index: number) => {
            const faqNumber = index + 1
            const faqParts = faq.split('?')
            
            if (faqParts.length > 1) {
              updateElement(`faq-${faqNumber}-question`, { content: faqParts[0].trim() + '?' })
              updateElement(`faq-${faqNumber}-answer`, { content: faqParts[1].trim() })
            } else {
              updateElement(`faq-${faqNumber}-question`, { content: faq.trim() })
            }
          })
        }
        
        // Update CTAs
        if (data["product-cta"]) {
          updateElement("product-cta-primary", { content: data["product-cta"] })
          updateElement("final-cta-primary", { content: data["product-cta"] })
        }
        
        // Update final CTA section
        if (data["final-cta-title"]) {
          updateElement("final-cta-title", { content: data["final-cta-title"] })
        }
        
        if (data["final-cta-description"]) {
          updateElement("final-cta-description", { content: data["final-cta-description"] })
        }
      } else if (templateId === "ai-portfolio") {
        console.log("Attempting to update portfolio elements with:", data);
        
        // Update portfolio branding
        if (data["portfolio-name"]) {
          updateElement("portfolio-name", { content: data["portfolio-name"] });
          updateElement("hero-name", { content: data["portfolio-name"] });
        }
        
        // Update hero section
        if (data["hero-title"]) {
          updateElement("hero-title", { content: data["hero-title"] });
        }
        
        if (data["hero-description"]) {
          updateElement("hero-description", { content: data["hero-description"] });
        }
        
        // Update about section
        if (data["about-description"]) {
          updateElement("about-description", { content: data["about-description"] });
        }
        
        // Update skills
        if (data["skills"]) {
          const skills = data["skills"].split('\n').filter((s: string) => s.trim() !== '').slice(0, 8)
          skills.forEach((skill: string, index: number) => {
            const skillNumber = index + 1
            updateElement(`skill-${skillNumber}-name`, { content: skill.trim() })
          })
        }
        
        // Update projects
        if (data["projects"]) {
          const projects = data["projects"].split('\n').filter((p: string) => p.trim() !== '').slice(0, 6)
          projects.forEach((project: string, index: number) => {
            const projectNumber = index + 1
            const projectParts = project.split(': ')
            
            if (projectParts.length > 1) {
              updateElement(`project-${projectNumber}-title`, { content: projectParts[0].trim() })
              updateElement(`project-${projectNumber}-description`, { content: projectParts[1].trim() })
            } else {
              updateElement(`project-${projectNumber}-title`, { content: project.trim() })
            }
          })
        }
        
        // Update experience
        if (data["experience"]) {
          const experiences = data["experience"].split('\n').filter((e: string) => e.trim() !== '').slice(0, 3)
          experiences.forEach((experience: string, index: number) => {
            const expNumber = index + 1
            const expParts = experience.split(' at ')
            
            if (expParts.length > 1) {
              updateElement(`experience-${expNumber}-title`, { content: expParts[0].trim() })
              updateElement(`experience-${expNumber}-company`, { content: expParts[1].trim() })
            } else {
              updateElement(`experience-${expNumber}-title`, { content: experience.trim() })
            }
          })
        }
        
        // Update contact info
        if (data["contact-email"]) {
          updateElement("contact-email", { content: data["contact-email"] });
        }
        
      } else if (templateId === "ai-blog-page") {
        console.log("Attempting to update blog page elements with:", data);
        
        // Update blog branding
        if (data["blog-name"]) {
          updateElement("blog-logo", { content: data["blog-name"] });
          updateElement("footer-logo", { content: data["blog-name"] });
        }
        
        // Update hero section
        if (data["blog-title"]) {
          updateElement("blog-title", { content: data["blog-title"] });
        }
        
        if (data["blog-subtitle"]) {
          updateElement("blog-subtitle", { content: data["blog-subtitle"] });
        }
        
        // Update featured post
        if (data["featured-post-title"]) {
          updateElement("featured-post-title", { content: data["featured-post-title"] });
        }
        
        if (data["featured-post-excerpt"]) {
          updateElement("featured-post-excerpt", { content: data["featured-post-excerpt"] });
        }
        
        if (data["featured-post-author"]) {
          updateElement("featured-post-author", { content: data["featured-post-author"] });
        }
        
        // Update recent posts
        if (data["recent-posts"]) {
          const posts = data["recent-posts"].split('\n').filter((p: string) => p.trim() !== '').slice(0, 6)
          posts.forEach((post: string, index: number) => {
            const postNumber = index + 1
            const postParts = post.split(': ')
            
            if (postParts.length > 1) {
              updateElement(`post-${postNumber}-title`, { content: postParts[0].trim() })
              updateElement(`post-${postNumber}-excerpt`, { content: postParts[1].trim() })
            } else {
              updateElement(`post-${postNumber}-title`, { content: post.trim() })
            }
          })
        }
        
        // Update categories
        if (data["categories"]) {
          const categories = data["categories"].split('\n').filter((c: string) => c.trim() !== '').slice(0, 8)
          categories.forEach((category: string, index: number) => {
            const categoryNumber = index + 1
            updateElement(`category-${categoryNumber}-name`, { content: category.trim() })
          })
        }
      } else if (templateId === "ai-dental-health-landing") {
        console.log("Attempting to update dental health landing elements with:", data);
        
        // Update hero section
        if (data["hero-title"]) {
          updateElement("hero-title", { content: data["hero-title"] });
        }
        
        if (data["hero-subtitle"]) {
          updateElement("hero-subtitle", { content: data["hero-subtitle"] });
        }
        
        // Update problem section
        if (data["problem-title"]) {
          updateElement("problem-title", { content: data["problem-title"] });
        }
        
        if (data["problem-subtitle"]) {
          updateElement("problem-subtitle", { content: data["problem-subtitle"] });
        }
        
        // Update benefits
        if (data["benefits"]) {
          const benefits = data["benefits"].split('\n').filter((b: string) => b.trim() !== '').slice(0, 4)
          benefits.forEach((benefit: string, index: number) => {
            const benefitNumber = index + 1
            updateElement(`benefit-${benefitNumber}`, { content: benefit.trim() })
          })
        }
        
        // Update testimonials
        if (data["testimonials"]) {
          const testimonials = data["testimonials"].split('\n').filter((t: string) => t.trim() !== '').slice(0, 3)
          testimonials.forEach((testimonial: string, index: number) => {
            const testimonialNumber = index + 1
            const testimonialParts = testimonial.split(' - ')
            
            if (testimonialParts.length > 1) {
              updateElement(`testimonial-${testimonialNumber}-text`, { content: `"${testimonialParts[0].trim()}" ${testimonialParts[1].trim()}` })
            } else {
              updateElement(`testimonial-${testimonialNumber}-text`, { content: `"${testimonial.trim()}"` })
            }
          })
        }
        
        // Update final CTA
        if (data["final-cta-title"]) {
          updateElement("final-cta-title", { content: data["final-cta-title"] });
        }
        
        if (data["final-cta-subtitle"]) {
          updateElement("final-cta-subtitle", { content: data["final-cta-subtitle"] });
        }
        
        if (data["health-fact"]) {
          updateElement("bacteria-fact", { content: data["health-fact"] });
        }
      } else {
        // Update blog post elements
        if (data["blog-title"]) updateElement("blog-title", { content: data["blog-title"] })
        if (data["blog-intro"]) updateElement("blog-intro", { content: data["blog-intro"] })
        if (data["blog-paragraph-1"]) updateElement("blog-paragraph-1", { content: data["blog-paragraph-1"] })
        if (data["blog-paragraph-2"]) updateElement("blog-paragraph-2", { content: data["blog-paragraph-2"] })
        if (data["blog-paragraph-3"]) updateElement("blog-paragraph-3", { content: data["blog-paragraph-3"] })
        if (data["blog-conclusion"]) updateElement("blog-conclusion", { content: data["blog-conclusion"] })
      }
    } catch (error) {
      console.error("Failed to generate AI content:", error)
      alert("Failed to generate AI content. Check console for details.")
      setShowLoadingScreen(false)
      setShowAIModal(true) // Show modal again on error
    } finally {
      setIsGenerating(false)
      setShowLoadingScreen(false)
      setTemplateGenerated(true)
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
      isEditable: true, // Pass isEditable as true for the editor
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

        {selectedElement && <EditingPanel elementId={selectedElement} onClose={() => selectElement(null)} />}
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

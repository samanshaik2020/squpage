"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"
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
import SocialMediaHooksLeadMagnet from "./social-media-hooks-lead-magnet"
import { TemplateEditingPanel } from "@/components/templates/template-editing-panel"
import { TemplateEditorProvider, useTemplateEditor } from "@/lib/template-editor-context"
import { AIGenerationModal } from "@/components/templates/ai-generation-modal"
import { AIGenerationLoading } from "@/components/templates/ai-generation-loading"
import { Sparkles } from "lucide-react"
import { TemplateDebug } from "@/components/debug/template-debug"

interface TemplateEditorProps {
  templateId: string
  initialSavedProjectId?: string
  editorRef?: React.RefObject<HTMLDivElement | null>
}

export function TemplateEditor({ templateId, initialSavedProjectId, editorRef: propEditorRef }: TemplateEditorProps) {
  const [viewMode, setViewMode] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const defaultEditorRef = useRef<HTMLDivElement>(null)
  const editorRef = propEditorRef || defaultEditorRef

  return (
    <TemplateEditorProvider>
      <TemplateEditorContent templateId={templateId} viewMode={viewMode} setViewMode={setViewMode} editorRef={editorRef} savedProjectId={initialSavedProjectId} />
    </TemplateEditorProvider>
  )
}

function TemplateEditorContent({
  templateId,
  viewMode,
  setViewMode,
  editorRef,
  savedProjectId: initialSavedProjectId
}: {
  templateId: string
  viewMode: "desktop" | "tablet" | "mobile"
  setViewMode: React.Dispatch<React.SetStateAction<"desktop" | "tablet" | "mobile">>
  editorRef?: React.RefObject<HTMLDivElement | null>
  savedProjectId?: string
}) {
  const { selectedElement, selectElement, canUndo, canRedo, undo, redo, updateElement, setTemplateId, elements, hasElementsForTemplate } = useTemplateEditor()
  const [isGenerating, setIsGenerating] = useState(false)
  const [showAIModal, setShowAIModal] = useState(false)
  const [showLoadingScreen, setShowLoadingScreen] = useState(false)
  const [templateGenerated, setTemplateGenerated] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [savedProjectId, setSavedProjectId] = useState<string | null>(initialSavedProjectId || null)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [showViewPreviewButton, setShowViewPreviewButton] = useState(false)
  const router = useRouter()

  // State to track if elements have been initialized
  const [elementsInitialized, setElementsInitialized] = useState(false)

  // Check if this is a paid AI template
  const isPaidAITemplate = [
    "ai-generated-blog-post",
    "product-landing-page", 
    "ai-portfolio",
    "ai-blog-page",
    "ai-dental-health-landing",
    "social-media-hooks-lead-magnet"
  ].includes(templateId)

  // All templates can now use AI generation
  const canUseAI = true

  // Show AI modal on mount for paid templates
  useEffect(() => {
    if (isPaidAITemplate && !templateGenerated) {
      setShowAIModal(true)
    }
  }, [isPaidAITemplate, templateGenerated])
  
  // Initialize template context with templateId and reset state when template changes
  useEffect(() => {
    console.log(`Template editor: Setting template ID to ${templateId}`);
    setTemplateId(templateId);
    // Reset initialization state when template changes
    setElementsInitialized(false);
  }, [templateId, setTemplateId]);

  // Initialize template elements when component mounts (only once)
  useEffect(() => {
    // Only initialize if not already done and not a paid AI template that hasn't been generated
    if (!elementsInitialized && !(isPaidAITemplate && !templateGenerated) && templateId) {
      // Wait a bit for the context to load elements from localStorage
      const initTimeout = setTimeout(() => {
        // Check if elements were loaded from localStorage
        if (elements.length > 0) {
          console.log(`Template editor: Elements already loaded from localStorage for ${templateId}, skipping initialization`);
          setElementsInitialized(true);
          return;
        }
        
        // Check if there are saved elements in localStorage
        if (hasElementsForTemplate(templateId)) {
          console.log(`Template editor: Found saved elements for ${templateId}, skipping initialization`);
          setElementsInitialized(true);
          return;
        }
        
        console.log("Template editor: No saved elements found, initializing default template elements for:", templateId);
      
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
        // Initialize comprehensive elements for all other templates
        const getTemplateSpecificElements = () => {
          const baseElements = [
            // Core branding elements
            { id: "company-logo", type: "text", content: "YourBrand" },
            { id: "nav-logo", type: "text", content: "YourBrand" },
            { id: "footer-logo", type: "text", content: "YourBrand" },
            { id: "brand-name", type: "text", content: "YourBrand" },
            
            // Hero section elements
            { id: "hero-title", type: "heading", content: "Welcome to Our Platform" },
            { id: "main-title", type: "heading", content: "Welcome to Our Platform" },
            { id: "hero-subtitle", type: "text", content: "Transform your business with our innovative solutions" },
            { id: "hero-description", type: "text", content: "Transform your business with our innovative solutions" },
            { id: "tagline", type: "text", content: "Transform your business with our innovative solutions" },
            { id: "hero-cta", type: "button", content: "Get Started" },
            { id: "main-cta", type: "button", content: "Get Started" },
            { id: "primary-cta", type: "button", content: "Get Started" },
            
            // About section elements
            { id: "about-title", type: "heading", content: "About Us" },
            { id: "about-description", type: "text", content: "We are passionate about delivering exceptional solutions that drive results." },
            { id: "company-description", type: "text", content: "We are passionate about delivering exceptional solutions that drive results." },
            
            // Contact section elements
            { id: "contact-title", type: "heading", content: "Get in Touch" },
            { id: "contact-description", type: "text", content: "Ready to get started? Contact us today!" },
            { id: "contact-cta", type: "button", content: "Contact Us" },
            
            // Footer elements
            { id: "footer-description", type: "text", content: "Your trusted partner for innovative solutions." }
          ];

          // Add feature elements (1-6)
          for (let i = 1; i <= 6; i++) {
            baseElements.push(
              { id: `feature-${i}-title`, type: "heading", content: `Feature ${i}` },
              { id: `feature-${i}-description`, type: "text", content: `Description for feature ${i} that explains its benefits.` }
            );
          }

          // Add service elements (1-6) for service-based templates
          for (let i = 1; i <= 6; i++) {
            baseElements.push(
              { id: `service-${i}-title`, type: "heading", content: `Service ${i}` },
              { id: `service-${i}-description`, type: "text", content: `Description for service ${i} and how it helps clients.` }
            );
          }

          // Add testimonial elements (1-3)
          for (let i = 1; i <= 3; i++) {
            baseElements.push(
              { id: `testimonial-${i}-text`, type: "text", content: `"This service exceeded our expectations and delivered amazing results."` },
              { id: `testimonial-${i}-author`, type: "text", content: `Client ${i}` },
              { id: `testimonial-${i}-company`, type: "text", content: `Company ${i}` }
            );
          }

          // Template-specific elements
          if (templateId === "saas-landing") {
            baseElements.push(
              { id: "saas-title", type: "heading", content: "Revolutionary SaaS Platform" },
              { id: "saas-subtitle", type: "text", content: "Streamline your workflow with our cutting-edge software solution" },
              { id: "benefit-1-title", type: "heading", content: "Increased Productivity" },
              { id: "benefit-2-title", type: "heading", content: "Cost Effective" },
              { id: "benefit-3-title", type: "heading", content: "Easy Integration" },
              { id: "pricing-title", type: "heading", content: "Simple Pricing" }
            );
          }

          if (templateId === "portfolio") {
            baseElements.push(
              { id: "portfolio-name", type: "text", content: "John Doe" },
              { id: "hero-name", type: "heading", content: "John Doe" },
              { id: "portfolio-role", type: "text", content: "Creative Designer & Developer" },
              { id: "portfolio-bio", type: "text", content: "Passionate about creating beautiful and functional digital experiences." },
              { id: "skills-title", type: "heading", content: "Skills & Expertise" },
              { id: "projects-title", type: "heading", content: "Featured Projects" }
            );
          }

          if (templateId === "septiclean") {
            baseElements.push(
              { id: "service-area", type: "text", content: "Serving Your Local Area" },
              { id: "phone-number", type: "text", content: "(555) 123-4567" },
              { id: "emergency-title", type: "heading", content: "24/7 Emergency Service" },
              { id: "licensed-title", type: "heading", content: "Licensed & Insured" }
            );
          }

          if (templateId === "ebook-landing") {
            baseElements.push(
              { id: "ebook-title", type: "heading", content: "The Ultimate Guide to Success" },
              { id: "ebook-description", type: "text", content: "Discover the secrets to achieving your goals with this comprehensive guide." },
              { id: "download-cta", type: "button", content: "Download Free eBook" },
              { id: "author-name", type: "text", content: "Expert Author" }
            );
          }

          if (templateId === "dental-health-landing") {
            baseElements.push(
              { id: "product-name", type: "heading", content: "Advanced Dental Care Solution" },
              { id: "health-benefit", type: "text", content: "Improve your oral health with our scientifically proven formula." },
              { id: "problem-title", type: "heading", content: "Common Dental Problems" },
              { id: "solution-title", type: "heading", content: "Our Solution" }
            );
          }

          return baseElements;
        };

        const templateElements = getTemplateSpecificElements();
        
        // Initialize all elements
        templateElements.forEach(element => {
          const elementData: any = {
            type: element.type,
            content: element.content,
            styles: {},
            position: { x: 0, y: 0 }
          };
          
          // Add default animations for button elements
          if (element.type === "button") {
            elementData.animation = {
              type: 'scale',
              duration: 200,
              timing: 'ease-out',
              trigger: 'hover',
              infinite: false,
              delay: 0
            };
            elementData.transition = {
              property: 'all',
              duration: 300,
              timing: 'ease',
              delay: 0
            };
          }
          
          updateElement(element.id, elementData);
        });
      }
      
        // Mark as initialized
        setElementsInitialized(true);
      }, 100); // Wait 100ms for context to load elements
      
      return () => clearTimeout(initTimeout);
    }
  }, [templateId, updateElement, elementsInitialized, isPaidAITemplate, templateGenerated, hasElementsForTemplate, elements]);
  
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
      case "social-media-hooks-lead-magnet":
        return "Social Media Hooks Lead Magnet"
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
    } else if (templateId === "social-media-hooks-lead-magnet") {
      requestParam = "leadMagnetTopic"
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
        
      } else if (templateId === "social-media-hooks-lead-magnet") {
        console.log("Template editor: Updating social media hooks lead magnet elements with:", data);
        
        const updateElementWithForce = (id: string, content: string, type: string = "text") => {
          console.log(`Force updating social media element ${id} with content:`, content);
          updateElement(id, {
            type: type,
            content: content,
            styles: {},
            position: { x: 0, y: 0 }
          });
        };
        
        // Update branding elements
        if (data["company-name"]) {
          updateElementWithForce("company-name", data["company-name"], "text");
        }
        
        if (data["logo-text"]) {
          updateElementWithForce("logo-text", data["logo-text"], "text");
        }
        
        // Update main content
        if (data["main-headline"]) {
          updateElementWithForce("main-headline", data["main-headline"], "heading");
        }
        
        if (data["subheadline"]) {
          updateElementWithForce("subheadline", data["subheadline"], "text");
        }
        
        if (data["description"]) {
          updateElementWithForce("description", data["description"], "text");
        }
        
        // Update benefits
        if (data["benefit-1"]) {
          updateElementWithForce("benefit-1", data["benefit-1"], "text");
        }
        
        if (data["benefit-2"]) {
          updateElementWithForce("benefit-2", data["benefit-2"], "text");
        }
        
        if (data["benefit-3"]) {
          updateElementWithForce("benefit-3", data["benefit-3"], "text");
        }
        
        // Update author info
        if (data["author-name"]) {
          updateElementWithForce("author-name", data["author-name"], "text");
        }
        
        if (data["author-bio"]) {
          updateElementWithForce("author-bio", data["author-bio"], "text");
        }
        
        if (data["cta-button"]) {
          updateElementWithForce("cta-button", data["cta-button"], "text");
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
      } else {
        // Handle ALL other templates with comprehensive AI content application
        console.log(`Template editor: Updating ${templateId} template elements with AI content:`, data);
        
        const updateElementWithForce = (id: string, content: string, type: string = "text", url?: string) => {
          console.log(`Force updating element ${id} with content:`, content);
          updateElement(id, {
            type: type,
            content: content,
            url: url,
            styles: {},
            position: { x: 0, y: 0 }
          });
        };

        // Apply AI content to common template elements based on available data
        
        // Update branding/logos
        if (data["company-name"] || data["brand-name"] || data["site-name"]) {
          const brandName = data["company-name"] || data["brand-name"] || data["site-name"];
          updateElementWithForce("company-logo", brandName, "text");
          updateElementWithForce("nav-logo", brandName, "text");
          updateElementWithForce("footer-logo", brandName, "text");
          updateElementWithForce("brand-name", brandName, "text");
        }

        // Update hero section
        if (data["hero-title"] || data["main-title"]) {
          const heroTitle = data["hero-title"] || data["main-title"];
          updateElementWithForce("hero-title", heroTitle, "heading");
          updateElementWithForce("main-title", heroTitle, "heading");
        }

        if (data["hero-subtitle"] || data["tagline"]) {
          const heroSubtitle = data["hero-subtitle"] || data["tagline"];
          updateElementWithForce("hero-subtitle", heroSubtitle, "text");
          updateElementWithForce("hero-description", heroSubtitle, "text");
          updateElementWithForce("tagline", heroSubtitle, "text");
        }

        if (data["hero-cta"] || data["main-cta"]) {
          const heroCTA = data["hero-cta"] || data["main-cta"];
          updateElementWithForce("hero-cta", heroCTA, "button");
          updateElementWithForce("main-cta", heroCTA, "button");
          updateElementWithForce("primary-cta", heroCTA, "button");
        }

        // Update about section
        if (data["about-title"]) {
          updateElementWithForce("about-title", data["about-title"], "heading");
        }

        if (data["about-description"] || data["company-description"]) {
          const aboutDesc = data["about-description"] || data["company-description"];
          updateElementWithForce("about-description", aboutDesc, "text");
          updateElementWithForce("company-description", aboutDesc, "text");
        }

        // Update features (handle up to 6 features)
        if (data["features"]) {
          const features = data["features"].split('\n').filter((f: string) => f.trim() !== '').slice(0, 6);
          
          features.forEach((feature: string, index: number) => {
            const featureNumber = index + 1;
            const featureParts = feature.split(': ');
            
            if (featureParts.length > 1) {
              updateElementWithForce(`feature-${featureNumber}-title`, featureParts[0].trim(), "heading");
              updateElementWithForce(`feature-${featureNumber}-description`, featureParts[1].trim(), "text");
            } else {
              updateElementWithForce(`feature-${featureNumber}-title`, `Feature ${featureNumber}`, "heading");
              updateElementWithForce(`feature-${featureNumber}-description`, feature.trim(), "text");
            }
          });
        }

        // Update services (for service-based templates)
        if (data["services"]) {
          const services = data["services"].split('\n').filter((s: string) => s.trim() !== '').slice(0, 6);
          
          services.forEach((service: string, index: number) => {
            const serviceNumber = index + 1;
            const serviceParts = service.split(': ');
            
            if (serviceParts.length > 1) {
              updateElementWithForce(`service-${serviceNumber}-title`, serviceParts[0].trim(), "heading");
              updateElementWithForce(`service-${serviceNumber}-description`, serviceParts[1].trim(), "text");
            } else {
              updateElementWithForce(`service-${serviceNumber}-title`, `Service ${serviceNumber}`, "heading");
              updateElementWithForce(`service-${serviceNumber}-description`, service.trim(), "text");
            }
          });
        }

        // Update contact section
        if (data["contact-title"]) {
          updateElementWithForce("contact-title", data["contact-title"], "heading");
        }

        if (data["contact-description"]) {
          updateElementWithForce("contact-description", data["contact-description"], "text");
        }

        if (data["contact-cta"]) {
          updateElementWithForce("contact-cta", data["contact-cta"], "button");
        }

        // Update testimonials
        if (data["testimonial-1"]) {
          updateElementWithForce("testimonial-1-text", data["testimonial-1"], "text");
        }
        if (data["testimonial-2"]) {
          updateElementWithForce("testimonial-2-text", data["testimonial-2"], "text");
        }
        if (data["testimonial-3"]) {
          updateElementWithForce("testimonial-3-text", data["testimonial-3"], "text");
        }

        // Update pricing (if applicable)
        if (data["pricing-title"]) {
          updateElementWithForce("pricing-title", data["pricing-title"], "heading");
        }

        // Update footer content
        if (data["footer-description"]) {
          updateElementWithForce("footer-description", data["footer-description"], "text");
        }

        // Template-specific updates
        if (templateId === "saas-landing") {
          if (data["saas-benefit-1"]) updateElementWithForce("benefit-1-title", data["saas-benefit-1"], "heading");
          if (data["saas-benefit-2"]) updateElementWithForce("benefit-2-title", data["saas-benefit-2"], "heading");
          if (data["saas-benefit-3"]) updateElementWithForce("benefit-3-title", data["saas-benefit-3"], "heading");
        }

        if (templateId === "portfolio") {
          if (data["portfolio-name"]) {
            updateElementWithForce("portfolio-name", data["portfolio-name"], "text");
            updateElementWithForce("hero-name", data["portfolio-name"], "heading");
          }
          if (data["portfolio-role"]) updateElementWithForce("portfolio-role", data["portfolio-role"], "text");
          if (data["portfolio-bio"]) updateElementWithForce("portfolio-bio", data["portfolio-bio"], "text");
        }

        if (templateId === "septiclean") {
          if (data["service-area"]) updateElementWithForce("service-area", data["service-area"], "text");
          if (data["phone-number"]) updateElementWithForce("phone-number", data["phone-number"], "text");
        }

        if (templateId === "ebook-landing") {
          if (data["ebook-title"]) updateElementWithForce("ebook-title", data["ebook-title"], "heading");
          if (data["ebook-description"]) updateElementWithForce("ebook-description", data["ebook-description"], "text");
          if (data["download-cta"]) updateElementWithForce("download-cta", data["download-cta"], "button");
        }

        if (templateId === "dental-health-landing") {
          if (data["product-name"]) updateElementWithForce("product-name", data["product-name"], "heading");
          if (data["health-benefit"]) updateElementWithForce("health-benefit", data["health-benefit"], "text");
        }
      }
      
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

  const handleSaveTemplate = async () => {
    setIsSaving(true)
    setSaveError(null)
    
    try {
      console.log('Saving template with templateId:', templateId)
      
      const projectData = {
        name: `${getTemplateName()} - ${new Date().toLocaleDateString()}`,
        type: 'Template',
        status: 'draft',
        thumbnail: '/placeholder.svg?height=120&width=200&text=Template',
        elements: elements,
        templateId: templateId, // Ensure templateId is passed correctly
        settings: {
          title: getTemplateName(),
          description: `Template based on ${getTemplateName()}`,
          favicon: '',
          customCSS: '',
          customJS: ''
        }
      }
      
      console.log('Project data being sent:', JSON.stringify(projectData))
      
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData),
      })
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'Failed to save template';
        
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch (e) {
          console.error('Error parsing error response:', e);
          // Use the raw text if it's not valid JSON
          if (errorText) errorMessage = errorText;
        }
        
        console.error(`API error (${response.status}):`, errorMessage);
        throw new Error(errorMessage);
      }
      
      const { project } = await response.json()
      setSavedProjectId(project.id)
      setShowSuccessMessage(true)
      setShowViewPreviewButton(true)
      
      console.log(`Template saved successfully with ID: ${project.id}`)
      console.log('Project saved to dashboard and can be accessed at /dashboard')
      
      // Show success message for 7 seconds to give users time to see the buttons
      setTimeout(() => {
        setShowSuccessMessage(false)
        setShowViewPreviewButton(false)
      }, 7000)
    } catch (error) {
      console.error('Error saving template:', error)
      setSaveError(error instanceof Error ? error.message : 'Failed to save template. Please try again.')
      setTimeout(() => {
        setSaveError(null)
      }, 5000)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCloseAIModal = () => {
    setShowAIModal(false)
    // If user closes modal without generating, redirect back to templates
    if (isPaidAITemplate && !templateGenerated) {
      router.push('/templates')
    }
  }
  
  const renderTemplate = () => {
    const commonProps = {
      elements: elements,
      isEditable: true,
      selectedElement: selectedElement,
      onElementSelect: selectElement
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
      case "social-media-hooks-lead-magnet":
        return <SocialMediaHooksLeadMagnet {...commonProps} />
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

          {canUseAI && (
            <Button size="sm" onClick={() => setShowAIModal(true)} disabled={isGenerating}>
              <Sparkles className="w-4 h-4 mr-2" />
              {isPaidAITemplate && !templateGenerated ? 'Generate with AI' : 'Enhance with AI'}
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
          <Link href={savedProjectId ? `/preview/template/${savedProjectId}` : `/preview/${templateId}`}>
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
          <Button 
            size="sm" 
            onClick={handleSaveTemplate} 
            disabled={isSaving}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            title="Save template to dashboard"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-gray-300 border-t-white"></div>
                Saving...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                Save to Dashboard
              </>
            )}
          </Button>
          {savedProjectId && (
            <Button size="sm" variant="outline" onClick={() => router.push(`/dashboard`)}>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              Go to Dashboard
            </Button>
          )}
        </div>
      </div>

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>Template saved successfully!</span>
          {showViewPreviewButton && (
            <>
              <button 
                onClick={() => router.push(`/preview/template/${savedProjectId}`)}
                className="ml-4 bg-white text-green-500 px-3 py-1 rounded-md text-sm font-medium hover:bg-green-50"
              >
                View Preview
              </button>
              <button 
                onClick={() => router.push('/dashboard')}
                className="ml-2 bg-white text-green-500 px-3 py-1 rounded-md text-sm font-medium hover:bg-green-50"
              >
                View Dashboard
              </button>
            </>
          )}
        </div>
      )}
      
      {/* Error Message */}
      {saveError && (
        <div className="fixed top-20 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span>{saveError}</span>
        </div>
      )}

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
      
      {/* Debug Component - Temporary for debugging */}
      <TemplateDebug />
    </div>
  )
}

"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Type, 
  Image, 
  MousePointer, 
  Square, 
  FileText, 
  DollarSign, 
  MessageSquare, 
  Video,
  ArrowUp,
  ArrowDown,
  Trash2,
  Star,
  Plus,
  Columns,
  Grip,
  X,
  Save,
  Eye,
  Settings,
  Smartphone,
  Tablet,
  Monitor,
  Undo,
  Redo,
  Download,
  Upload,
  ChevronDown,
  ChevronUp,
  Share2,
  Copy,
  Trash,
  Globe,
  Loader2
} from 'lucide-react'
import { useElementor } from '@/lib/elementor-context'
import { useProject } from '@/lib/project-context'
import { useToast } from '@/hooks/use-toast'
import { ElementPropertiesPanel } from './element-properties-panel'
import { EditableText } from './editable-text'
import { AddStructureButton } from './add-structure-button'
import { PreviewIframe } from './preview-iframe'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useRouter } from 'next/navigation'

interface SimplifiedElementorEditorProps {
  isPremium?: boolean;
  projectId?: string;
}

export function SimplifiedElementorEditor({ isPremium = false, projectId }: SimplifiedElementorEditorProps) {
  const { elements, addElement, updateElement, moveElement, deleteElement, selectedElement, selectElement, getElementById } = useElementor()
  const projectContext = useProject()
  
  // Destructure with fallbacks to prevent errors
  const {
    currentProject = null,
    saveProject = async () => {},
    publishProject = async () => {},
    createProject = async () => ({ id: '', name: '', type: 'Elementor' as const, status: 'draft' as const, createdAt: '', updatedAt: '', thumbnail: '', elements: [], settings: { title: '', description: '', favicon: '', customCSS: '', customJS: '' } }),
    loadProject = async () => {},
    isSaving = false,
    enableAutoSave = () => {},
    disableAutoSave = () => {},
    updateProjectThumbnail = async () => {}
  } = projectContext || {}
  
  const router = useRouter()
  
  // Get the selected element object from the ID
  const selectedElementObj = selectedElement ? getElementById(selectedElement) : null
  
  // Editor state
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [showSettingsDialog, setShowSettingsDialog] = useState(false)
  const [showPublishDialog, setShowPublishDialog] = useState(false)
  const [projectName, setProjectName] = useState('')
  const [projectSettings, setProjectSettings] = useState({
    title: '',
    description: '',
    seoTitle: '',
    seoDescription: '',
    customCSS: '',
    customJS: ''
  })
  
  // Share management state
  const [shareData, setShareData] = useState<any>(null)
  const [customShareName, setCustomShareName] = useState('')
  const [shareExpiry, setShareExpiry] = useState<string>('')
  const [isGeneratingShare, setIsGeneratingShare] = useState(false)
  const [isUpdatingShare, setIsUpdatingShare] = useState(false)
  const { toast } = useToast()
  
  // Auto-save state
  const [isAutoSaving, setIsAutoSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  
  // Auto-save functionality with debouncing
  useEffect(() => {
    if (!currentProject?.id || elements.length === 0) return
    
    const autoSaveTimeout = setTimeout(async () => {
      await autoSaveDraft()
    }, 2000) // Auto-save after 2 seconds of inactivity
    
    return () => clearTimeout(autoSaveTimeout)
  }, [elements, projectSettings, currentProject?.id])
  
  // Auto-save draft function
  const autoSaveDraft = async () => {
    if (!currentProject?.id || isAutoSaving) return
    
    setIsAutoSaving(true)
    try {
      const response = await fetch(`/api/projects/${currentProject.id}/draft`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          elements,
          settings: projectSettings,
        }),
      })
      
      if (response.ok) {
        setLastSaved(new Date())
      }
    } catch (error) {
      console.error('Auto-save failed:', error)
    } finally {
      setIsAutoSaving(false)
    }
  }
  
  // Load share data when project changes
  useEffect(() => {
    if (currentProject?.shareToken) {
      setShareData({
        token: currentProject.shareToken,
        slug: currentProject.shareSlug,
        customName: currentProject.shareName,
        expiryDate: currentProject.shareExpiryDate
      })
      setCustomShareName(currentProject.shareName || '')
    } else {
      setShareData(null)
      setCustomShareName('')
    }
  }, [currentProject])
  
  // Generate share token
  const generateShareToken = async () => {
    if (!currentProject || !customShareName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a custom name for the share link",
        variant: "destructive"
      })
      return
    }
    
    setIsGeneratingShare(true)
    
    try {
      const response = await fetch(`/api/projects/${currentProject.id}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customName: customShareName,
          expiryDays: shareExpiry ? parseInt(shareExpiry) : undefined
        })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setShareData(data.shareData)
        toast({
          title: "Success",
          description: "Share link generated successfully"
        })
      } else {
        throw new Error(data.error || 'Failed to generate share link')
      }
    } catch (error) {
      console.error('Error generating share token:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate share link",
        variant: "destructive"
      })
    } finally {
      setIsGeneratingShare(false)
    }
  }
  
  // Update share settings
  const updateShareSettings = async () => {
    if (!currentProject || !customShareName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a custom name for the share link",
        variant: "destructive"
      })
      return
    }
    
    setIsUpdatingShare(true)
    
    try {
      const response = await fetch(`/api/projects/${currentProject.id}/share`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customName: customShareName,
          expiryDays: shareExpiry ? parseInt(shareExpiry) : undefined
        })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setShareData(data.shareData)
        toast({
          title: "Success",
          description: "Share settings updated successfully"
        })
      } else {
        throw new Error(data.error || 'Failed to update share settings')
      }
    } catch (error) {
      console.error('Error updating share settings:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update share settings",
        variant: "destructive"
      })
    } finally {
      setIsUpdatingShare(false)
    }
  }
  
  // Revoke share token
  const revokeShareToken = async () => {
    if (!currentProject) return
    
    try {
      const response = await fetch(`/api/projects/${currentProject.id}/share`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setShareData(null)
        setCustomShareName('')
        setShareExpiry('')
        toast({
          title: "Success",
          description: "Share link revoked successfully"
        })
      } else {
        const data = await response.json()
        throw new Error(data.error || 'Failed to revoke share link')
      }
    } catch (error) {
      console.error('Error revoking share token:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to revoke share link",
        variant: "destructive"
      })
    }
  }
  
  // Copy share URL to clipboard
  const copyShareUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      toast({
        title: "Success",
        description: "Share URL copied to clipboard"
      })
    } catch (error) {
      console.error('Error copying to clipboard:', error)
      toast({
        title: "Error",
        description: "Failed to copy URL to clipboard",
        variant: "destructive"
      })
    }
  }
  
  // Load project on mount if projectId is provided
  useEffect(() => {
    if (projectId && !currentProject && projectContext) {
      loadProject(projectId).catch(console.error)
    }
  }, [projectId, currentProject, loadProject, projectContext])
  
  // Update project settings when current project changes
  useEffect(() => {
    if (currentProject && projectContext) {
      setProjectName(currentProject.name)
      setProjectSettings({
        title: currentProject.settings?.title || '',
        description: currentProject.settings?.description || '',
        seoTitle: currentProject.settings?.seoTitle || '',
        seoDescription: currentProject.settings?.seoDescription || '',
        customCSS: currentProject.settings?.customCSS || '',
        customJS: currentProject.settings?.customJS || ''
      })
      
      // Enable auto-save
      if (enableAutoSave && elements) {
        enableAutoSave(elements)
      }
    }
    
    return () => {
      if (disableAutoSave) {
        disableAutoSave()
      }
    }
  }, [currentProject, elements, enableAutoSave, disableAutoSave, projectContext])
  
  // Handle save project
  const handleSave = async () => {
    if (!projectContext) {
      toast({
        title: "Error",
        description: "Project context not available",
        variant: "destructive"
      })
      return
    }
    
    try {
      if (!currentProject) {
        // Create new project
        const nameToUse = projectName.trim() || `Untitled Project ${Date.now()}`
        
        const newProject = await createProject(nameToUse)
        if (newProject && newProject.id) {
          // Update the project name state if we used a default name
          if (!projectName.trim()) {
            setProjectName(nameToUse)
          }
          
          // Save the project with elements and settings using the newly created project
          const response = await fetch(`/api/projects/${newProject.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              elements,
              settings: projectSettings,
            }),
          })

          if (!response.ok) {
            throw new Error('Failed to save project elements')
          }

          toast({
            title: "Success",
            description: "Project created and saved successfully!"
          })
          setShowSaveDialog(false)
          
          // Update URL to include project ID without navigation
          window.history.replaceState(null, '', `/elementor?projectId=${newProject.id}`)
        }
      } else {
        // Save existing project
        await saveProject(elements, projectSettings)
        toast({
          title: "Success",
          description: "Project saved successfully!"
        })
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      console.error('Error saving project:', errorMessage, error)
      toast({
        title: "Error",
        description: `Failed to save project: ${errorMessage}`,
        variant: "destructive"
      })
    }
  }
  
  // Handle publish project
  const handlePublish = async () => {
    if (!projectContext) {
      toast({
        title: "Error",
        description: "Project context not available",
        variant: "destructive"
      })
      return
    }
    
    try {
      if (!currentProject) {
        toast({
          title: "Error",
          description: "Please save the project first",
          variant: "destructive"
        })
        return
      }
      
      await publishProject()
      toast({
        title: "Success",
        description: "Project published successfully!"
      })
      setShowPublishDialog(false)
    } catch (error) {
      console.error('Error publishing project:', error)
      toast({
        title: "Error",
        description: "Failed to publish project",
        variant: "destructive"
      })
    }
  }
  
  // Handle preview
  const handlePreview = async () => {
    if (currentProject) {
      // Auto-save draft before opening preview to ensure latest changes are visible
      await autoSaveDraft()
      
      // Open preview in new tab
      window.open(`/preview/elementor/${currentProject.id}`, '_blank')
    } else {
      // No project exists, use a temporary ID for preview
      const tempId = `temp-${Date.now()}`
      window.open(`/preview/elementor/${tempId}`, '_blank')
    }
  }
  
  // Get viewport width for responsive design
  const getViewportWidth = () => {
    switch (viewMode) {
      case 'desktop': return '100%'
      case 'tablet': return '768px'
      case 'mobile': return '375px'
      default: return '100%'
    }
  }
  
  // Helper function to render elements based on type
  const renderElement = (element: any) => {
    switch (element.type) {
      case 'headline':
        return (
          <div 
            key={element.id} 
            className="p-2 border border-transparent hover:border-blue-300 rounded cursor-pointer w-full"
            onClick={(e) => {
              e.stopPropagation();
              selectElement(element.id);
            }}
            style={{
              maxWidth: '100%', // Ensure it doesn't exceed column width
              overflow: 'hidden', // Prevent content from overflowing
              wordWrap: 'break-word' // Break long words to prevent overflow
            }}
          >
            <EditableText 
              element={element}
              isSelected={selectedElement === element.id}
              elementType="headline"
              defaultTag="h2"
              placeholder="Enter heading text"
            />
          </div>
        )
      case 'text':
        return (
          <div 
            key={element.id} 
            className="p-2 border border-transparent hover:border-blue-300 rounded cursor-pointer w-full"
            onClick={(e) => {
              e.stopPropagation();
              selectElement(element.id);
            }}
            style={{
              maxWidth: '100%', // Ensure it doesn't exceed column width
              overflow: 'hidden', // Prevent content from overflowing
              wordWrap: 'break-word' // Break long words to prevent overflow
            }}
          >
            <EditableText 
              element={element}
              isSelected={selectedElement === element.id}
              elementType="text"
              defaultTag="p"
              placeholder="Enter paragraph text"
            />
          </div>
        )
      case 'button':
        return (
          <div 
            key={element.id} 
            className="p-2 border border-transparent hover:border-blue-300 rounded cursor-pointer w-full"
            onClick={(e) => {
              e.stopPropagation();
              selectElement(element.id);
            }}
            style={{
              maxWidth: '100%', // Ensure it doesn't exceed column width
              overflow: 'hidden', // Prevent content from overflowing
              textAlign: 'center' // Center the button in the column
            }}
          >
            <EditableText 
              element={element}
              isSelected={selectedElement === element.id}
              elementType="button"
              defaultTag="button"
              placeholder="Button Text"
            />
          </div>
        )
      case 'image':
        return (
          <div 
            key={element.id} 
            className={`${selectedElement === element.id ? 'outline outline-2 outline-blue-500' : ''} w-full`}
            onClick={(e) => {
              e.stopPropagation();
              selectElement(element.id);
            }}
            style={{
              ...element.styles,
              maxWidth: '100%', // Ensure it doesn't exceed column width
              width: '100%' // Always fill the column width
            }}
          >
            {element.settings?.linkUrl ? (
              <a 
                href={element.settings.linkUrl} 
                target={element.settings.linkTarget || '_self'}
                style={{ display: 'block', width: '100%' }}
              >
                <img 
                  src={element.settings?.imageUrl || '/placeholder-image.jpg'} 
                  alt={element.settings?.alt || 'Image'} 
                  className="max-w-full"
                  style={{ 
                    display: 'block',
                    margin: '0 auto',
                    objectFit: 'contain',
                    height: element.styles?.height || 'auto',
                    width: element.styles?.width || '100%'
                  }}
                />
              </a>
            ) : (
              <img 
                src={element.settings?.imageUrl || '/placeholder-image.jpg'} 
                alt={element.settings?.alt || 'Image'} 
                className="max-w-full"
                style={{ 
                  display: 'block',
                  margin: '0 auto',
                  objectFit: 'contain',
                  height: element.styles?.height || 'auto',
                  width: element.styles?.width || '100%'
                }}
              />
            )}
          </div>
        )
      case 'form':
        return (
          <div 
            key={element.id} 
            className="p-2 border border-transparent hover:border-blue-300 rounded cursor-pointer w-full"
            onClick={(e) => {
              e.stopPropagation();
              selectElement(element.id);
            }}
            style={{
              maxWidth: '100%', // Ensure it doesn't exceed column width
              overflow: 'hidden' // Prevent content from overflowing
            }}
          >
            <div className="p-4 border rounded-md">
              <h3 className="text-lg font-medium mb-4">{element.content || 'Contact Form'}</h3>
              <div className="space-y-4">
                {element.formFields?.map((field: any) => (
                  <div key={field.id} className="space-y-1">
                    <label className="text-sm font-medium">
                      {field.label}
                      {field.required && <span className="text-red-500">*</span>}
                    </label>
                    {field.type === 'textarea' ? (
                      <textarea 
                        className="w-full p-2 border rounded-md" 
                        placeholder={field.placeholder || ''}
                        disabled
                      />
                    ) : field.type === 'select' ? (
                      <select className="w-full p-2 border rounded-md" disabled>
                        <option>Select an option</option>
                      </select>
                    ) : (
                      <input 
                        type={field.type} 
                        className="w-full p-2 border rounded-md" 
                        placeholder={field.placeholder || ''}
                        disabled
                      />
                    )}
                  </div>
                ))}
                <button 
                  className="px-4 py-2 bg-blue-600 text-white rounded-md"
                  disabled
                >
                  {element.settings?.submitButtonText || 'Submit'}
                </button>
              </div>
            </div>
          </div>
        )
      case 'pricing-table':
        return (
          <div 
            key={element.id} 
            className="p-2 border border-transparent hover:border-blue-300 rounded cursor-pointer w-full"
            onClick={(e) => {
              e.stopPropagation();
              selectElement(element.id);
            }}
            style={{
              maxWidth: '100%', // Ensure it doesn't exceed column width
              overflow: 'hidden' // Prevent content from overflowing
            }}
          >
            <div className="p-4 border rounded-md relative">
              {element.settings?.hasRibbon && (
                <div className="absolute top-0 right-0 bg-red-500 text-white px-4 py-1 text-sm">
                  {element.settings?.ribbonText || 'Popular'}
                </div>
              )}
              <h3 className="text-xl font-bold text-center">{element.content || 'Basic Plan'}</h3>
              <div className="text-center my-4">
                <span className="text-3xl font-bold">{element.settings?.price || '$9.99'}</span>
                <span className="text-gray-500">{element.settings?.period || '/month'}</span>
              </div>
              <ul className="space-y-2 mb-4">
                {element.pricingFeatures?.map((feature: any) => (
                  <li 
                    key={feature.id} 
                    className={`flex items-center ${!feature.included ? 'text-gray-400 line-through' : ''}`}
                  >
                    <span className={`mr-2 ${feature.included ? 'text-green-500' : 'text-red-500'}`}>
                      {feature.included ? '✓' : '✕'}
                    </span>
                    {feature.text}
                  </li>
                ))}
              </ul>
              <button className="w-full py-2 bg-blue-600 text-white rounded-md">
                Get Started
              </button>
            </div>
          </div>
        )
      case 'testimonial-carousel':
        return (
          <div 
            key={element.id} 
            className={`p-4 w-full ${selectedElement === element.id ? 'outline outline-2 outline-blue-500' : ''}`}
            onClick={() => selectElement(element.id)}
            style={{
              ...element.styles,
              maxWidth: '100%', // Ensure it doesn't exceed column width
              overflow: 'hidden' // Prevent content from overflowing
            }}
          >
            <div className="text-center">
              <h3 className="text-xl font-bold mb-4">{element.content || 'Testimonial Carousel'}</h3>
              {element.testimonials && element.testimonials.length > 0 ? (
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="mb-4">
                    <div className="flex justify-center mb-2">
                      {Array.from({ length: element.testimonials[0].rating || 5 }).map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <p className="italic mb-4">"{element.testimonials[0].content}"</p>
                    <div className="flex items-center">
                      {element.testimonials[0].avatar ? (
                        <img 
                          src={element.testimonials[0].avatar} 
                          alt={element.testimonials[0].name}
                          className="w-10 h-10 rounded-full mr-3 object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-300 mr-3 flex items-center justify-center">
                          <span className="text-gray-600 text-sm font-medium">
                            {element.testimonials[0].name?.charAt(0) || 'U'}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{element.testimonials[0].name}</p>
                        <p className="text-sm text-gray-600">
                          {element.testimonials[0].position}{element.testimonials[0].company ? `, ${element.testimonials[0].company}` : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center mt-4">
                    {element.testimonials.map((_: any, i: number) => (
                      <span 
                        key={i} 
                        className={`w-2 h-2 rounded-full mx-1 ${i === 0 ? 'bg-blue-600' : 'bg-gray-300'}`}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No testimonials added yet</p>
              )}
            </div>
          </div>
        )
      case 'video':
        return (
          <div 
            key={element.id} 
            className={`${selectedElement === element.id ? 'outline outline-2 outline-blue-500' : ''} w-full`}
            onClick={(e) => {
              e.stopPropagation();
              selectElement(element.id);
            }}
            style={{
              ...element.styles,
              maxWidth: '100%', // Ensure it doesn't exceed column width
              width: '100%' // Always fill the column width
            }}
          >
            {element.settings?.videoId ? (
              <div className="w-full" style={{ 
                aspectRatio: element.styles?.aspectRatio || '16/9',
                height: element.styles?.height || 'auto',
                width: element.styles?.width || '100%'
              }}>
                <iframe 
                  width="100%" 
                  height="100%" 
                  src={`https://www.youtube.com/embed/${element.settings.videoId}${element.settings?.autoplay ? '?autoplay=1&mute=1' : ''}`}
                  title={element.settings?.videoTitle || 'YouTube video'}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ maxWidth: '100%' }}
                ></iframe>
              </div>
            ) : (
              <div className="bg-gray-100 w-full flex items-center justify-center text-gray-500" style={{ aspectRatio: '16/9' }}>
                <div className="text-center">
                  <Video className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Add a YouTube video URL in the properties panel</p>
                </div>
              </div>
            )}
          </div>
        )
      case 'lead-magnet-form':
        return (
          <div 
            key={element.id} 
            className="p-2 border border-transparent hover:border-purple-300 rounded cursor-pointer w-full"
            onClick={(e) => {
              e.stopPropagation();
              selectElement(element.id);
            }}
            style={{
              maxWidth: '100%',
              overflow: 'hidden'
            }}
          >
            <div className="p-6 border-2 border-purple-200 rounded-lg bg-gradient-to-br from-purple-50 to-blue-50">
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {element.settings?.leadMagnet?.title || 'Get Your Free Guide'}
                </h3>
                <p className="text-gray-600 text-sm">
                  {element.settings?.leadMagnet?.description || 'Download our comprehensive guide and boost your results today!'}
                </p>
              </div>
              <div className="space-y-3">
                <input 
                  type="text" 
                  className="w-full p-3 border rounded-md" 
                  placeholder="Your Name"
                  disabled
                />
                <input 
                  type="email" 
                  className="w-full p-3 border rounded-md" 
                  placeholder="Your Email Address"
                  disabled
                />
                <button 
                  className="w-full py-3 bg-purple-600 text-white rounded-md font-semibold hover:bg-purple-700 transition-colors"
                  disabled
                >
                  Download Now - It's Free!
                </button>
              </div>
              <p className="text-xs text-gray-500 text-center mt-3">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>
        )
      case 'newsletter-signup':
        return (
          <div 
            key={element.id} 
            className="p-2 border border-transparent hover:border-blue-300 rounded cursor-pointer w-full"
            onClick={(e) => {
              e.stopPropagation();
              selectElement(element.id);
            }}
            style={{
              maxWidth: '100%',
              overflow: 'hidden'
            }}
          >
            <div className="p-4 border rounded-lg bg-blue-50">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  {element.content || 'Stay Updated'}
                </h3>
                <p className="text-gray-600 text-sm">
                  Get the latest news and updates delivered to your inbox.
                </p>
              </div>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  className="flex-1 p-2 border rounded-md" 
                  placeholder="Enter your email"
                  disabled
                />
                <button 
                  className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium"
                  disabled
                >
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        )
      case 'multi-step-form':
        return (
          <div 
            key={element.id} 
            className="p-2 border border-transparent hover:border-green-300 rounded cursor-pointer w-full"
            onClick={(e) => {
              e.stopPropagation();
              selectElement(element.id);
            }}
            style={{
              maxWidth: '100%',
              overflow: 'hidden'
            }}
          >
            <div className="p-4 border rounded-lg">
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">Multi-Step Form</h3>
                  <span className="text-sm text-gray-500">Step 1 of 3</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '33%' }}></div>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">What's your main goal?</label>
                  <select className="w-full p-2 border rounded-md" disabled>
                    <option>Select your goal</option>
                    <option>Increase sales</option>
                    <option>Generate leads</option>
                    <option>Build brand awareness</option>
                  </select>
                </div>
                <button 
                  className="w-full py-2 bg-green-600 text-white rounded-md"
                  disabled
                >
                  Next Step →
                </button>
              </div>
            </div>
          </div>
        )
      case 'slides':
        return (
          <div 
            key={element.id} 
            className="p-2 border border-transparent hover:border-indigo-300 rounded cursor-pointer w-full"
            onClick={(e) => {
              e.stopPropagation();
              selectElement(element.id);
            }}
            style={{
              maxWidth: '100%',
              overflow: 'hidden'
            }}
          >
            <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg overflow-hidden">
              {/* Current Slide */}
              <div 
                className="relative h-64 flex items-center justify-center text-white"
                style={{
                  backgroundImage: element.slides?.[0]?.backgroundImage ? `url(${element.slides[0].backgroundImage})` : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                <div className="relative z-10 text-center px-6">
                  <h3 className="text-2xl font-bold mb-2">
                    {element.slides?.[0]?.title || 'Slide Title'}
                  </h3>
                  <p className="text-lg mb-4 opacity-90">
                    {element.slides?.[0]?.subtitle || 'Compelling subtitle that captures attention'}
                  </p>
                  <p className="mb-6 opacity-80">
                    {element.slides?.[0]?.content || 'Your slide content goes here. Make it engaging and actionable.'}
                  </p>
                  <button className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
                    {element.slides?.[0]?.buttonText || 'Get Started'}
                  </button>
                </div>
              </div>
              
              {/* Navigation Arrows */}
              <button className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all">
                <ArrowUp className="w-4 h-4 rotate-[-90deg]" />
              </button>
              <button className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all">
                <ArrowUp className="w-4 h-4 rotate-90" />
              </button>
              
              {/* Dots Indicator */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {(element.slides || [{ id: '1' }, { id: '2' }, { id: '3' }]).map((_: any, index: number) => (
                  <div 
                    key={index}
                    className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-white' : 'bg-white bg-opacity-50'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        )
      case 'countdown':
        return (
          <div 
            key={element.id} 
            className="p-2 border border-transparent hover:border-red-300 rounded cursor-pointer w-full"
            onClick={(e) => {
              e.stopPropagation();
              selectElement(element.id);
            }}
            style={{
              maxWidth: '100%',
              overflow: 'hidden'
            }}
          >
            <div className="p-6 border-2 border-red-200 rounded-lg bg-gradient-to-br from-red-50 to-orange-50">
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {element.content || 'Limited Time Offer!'}
                </h3>
                <p className="text-gray-600 text-sm">
                  Don't miss out - offer expires soon!
                </p>
              </div>
              
              {/* Countdown Display */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                <div className="text-center">
                  <div className="bg-red-600 text-white text-xl font-bold py-3 px-2 rounded-lg">
                    05
                  </div>
                  <div className="text-xs text-gray-600 mt-1">Days</div>
                </div>
                <div className="text-center">
                  <div className="bg-red-600 text-white text-xl font-bold py-3 px-2 rounded-lg">
                    14
                  </div>
                  <div className="text-xs text-gray-600 mt-1">Hours</div>
                </div>
                <div className="text-center">
                  <div className="bg-red-600 text-white text-xl font-bold py-3 px-2 rounded-lg">
                    32
                  </div>
                  <div className="text-xs text-gray-600 mt-1">Minutes</div>
                </div>
                <div className="text-center">
                  <div className="bg-red-600 text-white text-xl font-bold py-3 px-2 rounded-lg">
                    18
                  </div>
                  <div className="text-xs text-gray-600 mt-1">Seconds</div>
                </div>
              </div>
              
              <button className="w-full py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors">
                Claim Offer Now!
              </button>
            </div>
          </div>
        )
      case 'call-to-action':
        return (
          <div 
            key={element.id} 
            className="p-2 border border-transparent hover:border-blue-300 rounded cursor-pointer w-full"
            onClick={(e) => {
              e.stopPropagation();
              selectElement(element.id);
            }}
            style={{
              maxWidth: '100%',
              overflow: 'hidden'
            }}
          >
            <div className="p-6 border rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className={`flex ${element.settings?.callToAction?.layout === 'vertical' ? 'flex-col' : 'items-center'} gap-4`}>
                {element.settings?.callToAction?.showImage !== false && (
                  <div className="flex-shrink-0">
                    <img 
                      src={element.settings?.callToAction?.imageUrl || '/placeholder-image.jpg'} 
                      alt="CTA Image" 
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {element.settings?.callToAction?.title || 'Ready to Get Started?'}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {element.settings?.callToAction?.description || 'Join thousands of satisfied customers and transform your business today.'}
                  </p>
                  <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                    {element.settings?.callToAction?.buttonText || 'Get Started Now'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      case 'share-buttons':
        return (
          <div 
            key={element.id} 
            className="p-2 border border-transparent hover:border-green-300 rounded cursor-pointer w-full"
            onClick={(e) => {
              e.stopPropagation();
              selectElement(element.id);
            }}
            style={{
              maxWidth: '100%',
              overflow: 'hidden'
            }}
          >
            <div className="p-4 border rounded-lg bg-gray-50">
              <div className="text-center mb-3">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Share this page</h4>
              </div>
              <div className={`flex ${element.settings?.shareButtons?.layout === 'vertical' ? 'flex-col' : 'flex-row'} gap-2 justify-center`}>
                {['Facebook', 'Twitter', 'LinkedIn', 'WhatsApp'].map((platform) => (
                  <button
                    key={platform}
                    className={`flex items-center justify-center px-3 py-2 rounded text-white text-sm font-medium transition-colors ${
                      platform === 'Facebook' ? 'bg-blue-600 hover:bg-blue-700' :
                      platform === 'Twitter' ? 'bg-sky-500 hover:bg-sky-600' :
                      platform === 'LinkedIn' ? 'bg-blue-700 hover:bg-blue-800' :
                      'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    {element.settings?.shareButtons?.showLabels !== false && platform}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )
      case 'blockquote':
        return (
          <div 
            key={element.id} 
            className="p-2 border border-transparent hover:border-gray-300 rounded cursor-pointer w-full"
            onClick={(e) => {
              e.stopPropagation();
              selectElement(element.id);
            }}
            style={{
              maxWidth: '100%',
              overflow: 'hidden'
            }}
          >
            <div className="p-6 border-l-4 border-gray-400 bg-gray-50 rounded-r-lg">
              <div className="relative">
                {element.settings?.blockquote?.quoteIcon !== false && (
                  <div className="absolute -top-2 -left-2 text-4xl text-gray-300 font-serif">"</div>
                )}
                <blockquote className="text-lg italic text-gray-700 mb-4 pl-6">
                  {element.content || 'This is a sample quote that demonstrates the blockquote widget. You can customize the styling and add author information.'}
                </blockquote>
                {element.settings?.blockquote?.showAuthor !== false && (
                  <div className="flex items-center">
                    {element.settings?.blockquote?.authorImage && (
                      <img 
                        src={element.settings.blockquote.authorImage} 
                        alt="Author" 
                        className="w-10 h-10 rounded-full mr-3 object-cover"
                      />
                    )}
                    <div>
                      <cite className="text-sm font-semibold text-gray-800 not-italic">
                        {element.settings?.blockquote?.authorName || 'John Doe'}
                      </cite>
                      {element.settings?.blockquote?.authorTitle && (
                        <p className="text-xs text-gray-600">
                          {element.settings.blockquote.authorTitle}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      case 'posts':
        return (
          <div 
            key={element.id} 
            className="p-2 border border-transparent hover:border-blue-300 rounded cursor-pointer w-full"
            onClick={(e) => {
              e.stopPropagation();
              selectElement(element.id);
            }}
            style={{
              maxWidth: '100%',
              overflow: 'hidden'
            }}
          >
            <div className="p-4 border rounded-lg bg-white">
              <h3 className="text-lg font-semibold mb-4">Latest Posts</h3>
              <div className={`grid ${element.settings?.posts?.layout === 'list' ? 'grid-cols-1' : `grid-cols-${element.settings?.posts?.columns || 2}`} gap-4`}>
                {[1, 2, 3, 4].slice(0, element.settings?.posts?.postsPerPage || 4).map((post) => (
                  <div key={post} className="border rounded-lg overflow-hidden">
                    {element.settings?.posts?.showFeaturedImage !== false && (
                      <div className="h-32 bg-gray-200 flex items-center justify-center">
                        <Image className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    <div className="p-3">
                      <h4 className="font-semibold text-sm mb-2">Sample Blog Post {post}</h4>
                      {element.settings?.posts?.showExcerpt !== false && (
                        <p className="text-xs text-gray-600 mb-2">This is a sample excerpt for the blog post...</p>
                      )}
                      <div className="flex justify-between text-xs text-gray-500">
                        {element.settings?.posts?.showAuthor !== false && <span>By Author</span>}
                        {element.settings?.posts?.showDate !== false && <span>Jan 1, 2024</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      case 'animated-headline':
        return (
          <div 
            key={element.id} 
            className="p-2 border border-transparent hover:border-purple-300 rounded cursor-pointer w-full"
            onClick={(e) => {
              e.stopPropagation();
              selectElement(element.id);
            }}
            style={{
              maxWidth: '100%',
              overflow: 'hidden'
            }}
          >
            <div className="p-4 text-center">
              <h2 className="text-2xl font-bold">
                <span>{element.settings?.animatedHeadline?.beforeText || 'We are '}</span>
                <span className="text-purple-600 border-r-2 border-purple-600 animate-pulse">
                  {element.settings?.animatedHeadline?.animatedText?.[0] || 'Creative'}
                </span>
                <span>{element.settings?.animatedHeadline?.afterText || ' Designers'}</span>
              </h2>
              <p className="text-sm text-gray-500 mt-2">Animated text will cycle through: {element.settings?.animatedHeadline?.animatedText?.join(', ') || 'Creative, Innovative, Professional'}</p>
            </div>
          </div>
        )
      case 'product-price':
        return (
          <div 
            key={element.id} 
            className="p-2 border border-transparent hover:border-green-300 rounded cursor-pointer w-full"
            onClick={(e) => {
              e.stopPropagation();
              selectElement(element.id);
            }}
            style={{
              maxWidth: '100%',
              overflow: 'hidden'
            }}
          >
            <div className="p-4 text-center">
              <div className="flex items-center justify-center space-x-2">
                {element.settings?.product?.showSalePrice && (
                  <span className="text-lg line-through text-gray-500">$99.99</span>
                )}
                <span className="text-2xl font-bold text-green-600">$79.99</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">Product Price Display</p>
            </div>
          </div>
        )
      case 'product-images':
        return (
          <div 
            key={element.id} 
            className="p-2 border border-transparent hover:border-blue-300 rounded cursor-pointer w-full"
            onClick={(e) => {
              e.stopPropagation();
              selectElement(element.id);
            }}
            style={{
              maxWidth: '100%',
              overflow: 'hidden'
            }}
          >
            <div className="p-4">
              <div className="aspect-square bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
                <Image className="w-12 h-12 text-gray-400" />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((thumb) => (
                  <div key={thumb} className="aspect-square bg-gray-100 rounded border-2 border-transparent hover:border-blue-500 cursor-pointer flex items-center justify-center">
                    <Image className="w-4 h-4 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      case 'product-title':
        return (
          <div 
            key={element.id} 
            className="p-2 border border-transparent hover:border-gray-300 rounded cursor-pointer w-full"
            onClick={(e) => {
              e.stopPropagation();
              selectElement(element.id);
            }}
            style={{
              maxWidth: '100%',
              overflow: 'hidden'
            }}
          >
            <div className="p-4">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                {element.content || 'Premium Product Name'}
              </h1>
              <p className="text-sm text-gray-600">SKU: PRD-001</p>
            </div>
          </div>
        )
      case 'product-rating':
        return (
          <div 
            key={element.id} 
            className="p-2 border border-transparent hover:border-yellow-300 rounded cursor-pointer w-full"
            onClick={(e) => {
              e.stopPropagation();
              selectElement(element.id);
            }}
            style={{
              maxWidth: '100%',
              overflow: 'hidden'
            }}
          >
            <div className="p-4">
              <div className="flex items-center space-x-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className={`w-5 h-5 ${star <= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                  ))}
                </div>
                <span className="text-sm font-medium">4.0</span>
                <span className="text-sm text-gray-500">(128 reviews)</span>
              </div>
            </div>
          </div>
        )
      default:
        return (
          <div key={element.id} className="p-2 border border-gray-300 rounded">
            Unknown element type: {element.type}
          </div>
        )
    }
  }

  // Get root elements (columns) and sort by order
  const rootElements = elements
    .filter(el => el.type === 'column')
    .sort((a, b) => {
      const orderA = a.styles?.order !== undefined ? Number(a.styles.order) : 999;
      const orderB = b.styles?.order !== undefined ? Number(b.styles.order) : 999;
      return orderA - orderB;
    });
  
  // Define the available elements for the side panel
  const AVAILABLE_ELEMENTS = [
    {
      id: 'headline',
      name: 'Headline',
      icon: Type,
      description: 'Add a heading text'
    },
    {
      id: 'text',
      name: 'Text',
      icon: Type,
      description: 'Add paragraph text'
    },
    {
      id: 'image',
      name: 'Image',
      icon: Image,
      description: 'Add an image'
    },
    {
      id: 'button',
      name: 'Button',
      icon: MousePointer,
      description: 'Add a clickable button'
    },
    {
      id: 'video',
      name: 'Video',
      icon: Video,
      description: 'Add a video player'
    },
    {
      id: 'spacer',
      name: 'Spacer',
      icon: Square,
      description: 'Add spacing between elements'
    },
    {
      id: 'form',
      name: 'Form',
      icon: FileText,
      description: 'Add a contact or lead form'
    },
    {
      id: 'pricing-table',
      name: 'Pricing Table',
      icon: DollarSign,
      description: 'Add a pricing table with features'
    },
    {
      id: 'testimonial-carousel',
      name: 'Testimonials',
      icon: MessageSquare,
      description: 'Add a testimonial carousel'
    }
  ]

  // Pro Marketing & Lead Generation Elements (only show if isPremium)
  const PRO_MARKETING_ELEMENTS = [
    {
      id: 'lead-magnet-form',
      name: 'Lead Magnet',
      icon: FileText,
      description: 'Capture leads with downloadable content'
    },
    {
      id: 'call-to-action',
      name: 'Call to Action',
      icon: MousePointer,
      description: 'Pre-styled box with image, text, and button'
    },
    {
      id: 'newsletter-signup',
      name: 'Newsletter',
      icon: MessageSquare,
      description: 'Newsletter subscription form'
    },
    {
      id: 'slides',
      name: 'Slides',
      icon: Image,
      description: 'Beautiful full-width sliders with content'
    },
    {
      id: 'countdown',
      name: 'Countdown',
      icon: ArrowDown,
      description: 'Add urgency with countdown timers'
    },
    {
      id: 'share-buttons',
      name: 'Share Buttons',
      icon: MessageSquare,
      description: 'Social media sharing buttons'
    },
    {
      id: 'blockquote',
      name: 'Blockquote',
      icon: MessageSquare,
      description: 'Stylized quotes and testimonials'
    },
    {
      id: 'multi-step-form',
      name: 'Multi-Step Form',
      icon: ArrowUp,
      description: 'Multi-step lead capture form'
    }
  ]

  // Pro Content & E-commerce Elements
  const PRO_CONTENT_ELEMENTS = [
    {
      id: 'posts',
      name: 'Posts',
      icon: FileText,
      description: 'Display blog posts with advanced options'
    },
    {
      id: 'animated-headline',
      name: 'Animated Headline',
      icon: Type,
      description: 'Eye-catching headlines with animations'
    },
    {
      id: 'product-price',
      name: 'Product Price',
      icon: DollarSign,
      description: 'Display product pricing information'
    },
    {
      id: 'product-images',
      name: 'Product Images',
      icon: Image,
      description: 'Product image gallery and thumbnails'
    },
    {
      id: 'product-title',
      name: 'Product Title',
      icon: Type,
      description: 'Product name and title display'
    },
    {
      id: 'product-rating',
      name: 'Product Rating',
      icon: Star,
      description: 'Product ratings and reviews'
    }
  ]

  // Show loading if project context is not available
  if (!projectContext) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading editor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
            <ArrowUp className="w-4 h-4 rotate-[-90deg]" />
            <span>Back to Dashboard</span>
          </Link>
          <div className="h-6 w-px bg-gray-300" />
          <div className="flex items-center space-x-2">
            <h1 className="text-lg font-semibold text-gray-900">
              {currentProject ? currentProject.name : 'New Project'}
            </h1>
            {currentProject && (
              <Badge variant={currentProject.status === 'published' ? 'default' : 'secondary'}>
                {currentProject.status}
              </Badge>
            )}
            {isSaving && (
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>Saving...</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Responsive Controls */}
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            <Button
              variant={viewMode === 'desktop' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('desktop')}
              className="px-3"
            >
              <Monitor className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'tablet' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('tablet')}
              className="px-3"
            >
              <Tablet className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'mobile' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('mobile')}
              className="px-3"
            >
              <Smartphone className="w-4 h-4" />
            </Button>
          </div>

          <div className="h-6 w-px bg-gray-300" />

          {/* Action Buttons */}
          <Button variant="ghost" size="sm" disabled>
            <Undo className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" disabled>
            <Redo className="w-4 h-4" />
          </Button>

          <div className="h-6 w-px bg-gray-300" />

          <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Project Settings</DialogTitle>
                <DialogDescription>
                  Configure your project settings, SEO options, and share settings.
                </DialogDescription>
              </DialogHeader>
              
              <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="sharing">Sharing</TabsTrigger>
                </TabsList>
                
                <TabsContent value="general" className="space-y-4">
                  <div>
                    <Label htmlFor="project-title">Project Title</Label>
                    <Input
                      id="project-title"
                      value={projectSettings.title}
                      onChange={(e) => setProjectSettings(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter project title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="project-description">Description</Label>
                    <Textarea
                      id="project-description"
                      value={projectSettings.description}
                      onChange={(e) => setProjectSettings(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Enter project description"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="seo-title">SEO Title</Label>
                    <Input
                      id="seo-title"
                      value={projectSettings.seoTitle}
                      onChange={(e) => setProjectSettings(prev => ({ ...prev, seoTitle: e.target.value }))}
                      placeholder="Enter SEO title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="seo-description">SEO Description</Label>
                    <Textarea
                      id="seo-description"
                      value={projectSettings.seoDescription}
                      onChange={(e) => setProjectSettings(prev => ({ ...prev, seoDescription: e.target.value }))}
                      placeholder="Enter SEO description"
                      rows={2}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="sharing" className="space-y-4">
                  {!currentProject ? (
                    <div className="text-center py-8 text-gray-500">
                      <Globe className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Save your project first to enable sharing</p>
                    </div>
                  ) : !shareData ? (
                    <div className="space-y-4">
                      <div className="text-center py-4">
                        <Globe className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <h3 className="text-lg font-semibold mb-2">Share Your Project</h3>
                        <p className="text-gray-600 mb-4">Create a shareable link for your project</p>
                      </div>
                      
                      <div>
                        <Label htmlFor="share-name">Custom Share Name</Label>
                        <Input
                          id="share-name"
                          value={customShareName}
                          onChange={(e) => setCustomShareName(e.target.value)}
                          placeholder="Enter a custom name for your share link"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                          This will be used in the URL: squpage.com/share/{customShareName.toLowerCase().replace(/\s+/g, '-')}
                        </p>
                      </div>
                      
                      <div>
                        <Label htmlFor="share-expiry">Link Expiry (Optional)</Label>
                        <Select value={shareExpiry} onValueChange={setShareExpiry}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select expiry period" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">Never expires</SelectItem>
                            <SelectItem value="7">7 days</SelectItem>
                            <SelectItem value="30">30 days</SelectItem>
                            <SelectItem value="90">90 days</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <Button 
                        onClick={generateShareToken}
                        disabled={isGeneratingShare || !customShareName.trim()}
                        className="w-full"
                      >
                        {isGeneratingShare ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Share2 className="w-4 h-4 mr-2" />
                            Generate Share Link
                          </>
                        )}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="text-center py-4">
                        <Globe className="w-12 h-12 mx-auto mb-4 text-green-500" />
                        <h3 className="text-lg font-semibold mb-2">Project is Shared</h3>
                        <p className="text-gray-600">Your project is publicly accessible</p>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <Label>Share URL</Label>
                          <div className="flex gap-2">
                            <Input
                              value={`${window.location.origin}/share/${shareData.slug}`}
                              readOnly
                              className="flex-1"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyShareUrl(`${window.location.origin}/share/${shareData.slug}`)}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="update-share-name">Custom Share Name</Label>
                          <Input
                            id="update-share-name"
                            value={customShareName}
                            onChange={(e) => setCustomShareName(e.target.value)}
                            placeholder="Enter a custom name for your share link"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="update-share-expiry">Link Expiry</Label>
                          <Select value={shareExpiry} onValueChange={setShareExpiry}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select expiry period" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">Never expires</SelectItem>
                              <SelectItem value="7">7 days</SelectItem>
                              <SelectItem value="30">30 days</SelectItem>
                              <SelectItem value="90">90 days</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {shareData.expiryDate && (
                          <div className="text-sm text-gray-600">
                            Expires: {new Date(shareData.expiryDate).toLocaleDateString()}
                          </div>
                        )}
                        
                        <div className="flex gap-2">
                          <Button 
                            onClick={updateShareSettings}
                            disabled={isUpdatingShare || !customShareName.trim()}
                            className="flex-1"
                          >
                            {isUpdatingShare ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Updating...
                              </>
                            ) : (
                              'Update Settings'
                            )}
                          </Button>
                          <Button 
                            variant="destructive"
                            onClick={revokeShareToken}
                          >
                            <Trash className="w-4 h-4 mr-2" />
                            Revoke
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowSettingsDialog(false)}>
                  Close
                </Button>
                <Button onClick={() => {
                  handleSave()
                  setShowSettingsDialog(false)
                }}>
                  Save Settings
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Auto-save status indicator */}
          <div className="flex items-center text-xs text-gray-500 mr-4">
            {isAutoSaving ? (
              <>
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                Saving draft...
              </>
            ) : lastSaved ? (
              <>
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1" />
                Draft saved {new Date(lastSaved).toLocaleTimeString()}
              </>
            ) : null}
          </div>

          <Button variant="outline" size="sm" onClick={handlePreview}>
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>

          {!currentProject ? (
            <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Save Project</DialogTitle>
                  <DialogDescription>
                    Give your project a name to save it.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="project-name">Project Name</Label>
                    <Input
                      id="project-name"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      placeholder="Enter project name"
                      autoFocus
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={!projectName.trim() || isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Project
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          ) : (
            <Button size="sm" onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </>
              )}
            </Button>
          )}

          {currentProject && currentProject.status === 'draft' && (
            <Dialog open={showPublishDialog} onOpenChange={setShowPublishDialog}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  <Globe className="w-4 h-4 mr-2" />
                  Publish
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Publish Project</DialogTitle>
                  <DialogDescription>
                    Make your project live and accessible to visitors.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">Ready to publish?</h4>
                    <p className="text-sm text-green-700">
                      Your project will be made live and accessible at a public URL. You can unpublish it at any time.
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowPublishDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handlePublish} disabled={isSaving} className="bg-green-600 hover:bg-green-700">
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Publishing...
                      </>
                    ) : (
                      <>
                        <Globe className="w-4 h-4 mr-2" />
                        Publish Now
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Side Panel */}
      <div className="w-64 border-r border-gray-200 overflow-y-auto p-4">
        <h2 className="font-semibold mb-4 text-sm uppercase tracking-wider text-gray-500">Elements</h2>
        <div className="space-y-4">
          {/* Basic Elements */}
          <div className="grid grid-cols-2 gap-2">
            {AVAILABLE_ELEMENTS.map((element) => (
              <div 
                key={element.id}
                className="flex flex-col items-center p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', element.id)
                }}
              >
                <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center mb-1">
                  {React.createElement(element.icon, { className: "w-4 h-4 text-blue-600" })}
                </div>
                <span className="text-xs font-medium">{element.name}</span>
              </div>
            ))}
          </div>

          {/* Pro Marketing & Lead Generation Elements */}
          {isPremium && (
            <>
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2 text-xs uppercase tracking-wider text-purple-600">Marketing & Lead Generation</h3>
                <div className="grid grid-cols-2 gap-2">
                  {PRO_MARKETING_ELEMENTS.map((element) => (
                    <div 
                      key={element.id}
                      className="flex flex-col items-center p-2 border border-purple-200 rounded-lg cursor-pointer hover:bg-purple-50 transition-colors relative"
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('text/plain', element.id)
                      }}
                    >
                      <div className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs px-1 rounded-full">PRO</div>
                      <div className="w-8 h-8 bg-purple-50 rounded-full flex items-center justify-center mb-1">
                        {React.createElement(element.icon, { className: "w-4 h-4 text-purple-600" })}
                      </div>
                      <span className="text-xs font-medium text-center">{element.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2 text-xs uppercase tracking-wider text-indigo-600">Content & E-commerce</h3>
                <div className="grid grid-cols-2 gap-2">
                  {PRO_CONTENT_ELEMENTS.map((element) => (
                    <div 
                      key={element.id}
                      className="flex flex-col items-center p-2 border border-indigo-200 rounded-lg cursor-pointer hover:bg-indigo-50 transition-colors relative"
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('text/plain', element.id)
                      }}
                    >
                      <div className="absolute -top-1 -right-1 bg-indigo-500 text-white text-xs px-1 rounded-full">PRO</div>
                      <div className="w-8 h-8 bg-indigo-50 rounded-full flex items-center justify-center mb-1">
                        {React.createElement(element.icon, { className: "w-4 h-4 text-indigo-600" })}
                      </div>
                      <span className="text-xs font-medium text-center">{element.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="h-14 border-b border-gray-200 flex items-center justify-between px-4">
          <h1 className="text-lg font-semibold">Elementor Editor {isPremium && <span className="ml-2 text-sm bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">Pro</span>}</h1>
          <Link href="/templates" className="text-sm text-gray-500 hover:text-gray-700">
            Back to Templates
          </Link>
        </div>

        {/* Editor Canvas - Iframe Preview */}
        <PreviewIframe 
          projectId={currentProject?.id}
          viewMode={viewMode}
        />
      </div>

      {/* Properties Panel */}
      <div className="w-72 border-l border-gray-200 overflow-y-auto p-4">
        {selectedElementObj && (
          <ElementPropertiesPanel 
            element={selectedElementObj} 
          />
        )}
      </div>
    </div>
    </div>
  )
}

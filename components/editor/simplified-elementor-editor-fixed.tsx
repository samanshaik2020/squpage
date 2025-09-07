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
import { ElementorPreviewSystem } from './elementor-preview-system'
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

          <Button variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>

          <Button size="sm">
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
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
              <div className="flex flex-col items-center p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center mb-1">
                  <Type className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-xs font-medium">Heading</span>
              </div>
              <div className="flex flex-col items-center p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center mb-1">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-xs font-medium">Text</span>
              </div>
              <div className="flex flex-col items-center p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center mb-1">
                  <Image className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-xs font-medium">Image</span>
              </div>
              <div className="flex flex-col items-center p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center mb-1">
                  <MousePointer className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-xs font-medium">Button</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Elementor Preview */}
        <div className="flex-1 flex flex-col">
          <div className="h-14 border-b border-gray-200 flex items-center justify-between px-4">
            <h1 className="text-lg font-semibold">Elementor Editor {isPremium && <span className="ml-2 text-sm bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">Pro</span>}</h1>
            <Link href="/templates" className="text-sm text-gray-500 hover:text-gray-700">
              Back to Templates
            </Link>
          </div>

          {/* Elementor Preview System */}
          <ElementorPreviewSystem viewMode={viewMode} />
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

"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useTemplateEditor } from "@/lib/template-editor-context"
import { defaultAnimations, defaultTransitions, animationPresets } from "@/lib/button-animations"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface TemplateEditingPanelProps {
  elementId: string
  onClose: () => void
}

export function TemplateEditingPanel({ elementId, onClose }: TemplateEditingPanelProps) {
  const { elements, updateElement, addElement, deleteElement } = useTemplateEditor()
  const element = elements.find((el) => el.id === elementId)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  // Initialize with default values, will be updated when element is found
  const [content, setContent] = useState("")
  const [url, setUrl] = useState("")
  const [elementType, setElementType] = useState("text")
  const [styles, setStyles] = useState({
    color: "#000000",
    backgroundColor: "#ffffff",
    fontSize: 16,
    fontWeight: "normal",
    textAlign: "left",
    xPosition: 0,
    yPosition: 0,
    width: 'auto',
    height: 'auto',
  })

  // Animation and transition states
  const [animation, setAnimation] = useState<{
    type: 'none' | 'pulse' | 'bounce' | 'shake' | 'glow' | 'slide' | 'scale' | 'rotate' | 'flip'
    duration: number
    timing: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear'
    trigger: 'hover' | 'click' | 'load' | 'scroll'
    infinite: boolean
    delay: number
  }>({
    type: 'none',
    duration: 300,
    timing: 'ease',
    trigger: 'hover',
    infinite: false,
    delay: 0
  })

  const [transition, setTransition] = useState<{
    property: 'all' | 'background' | 'transform' | 'color' | 'border' | 'shadow'
    duration: number
    timing: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear'
    delay: number
  }>({
    property: 'all',
    duration: 300,
    timing: 'ease',
    delay: 0
  })

  // Update local state when element changes or when elementId changes
  useEffect(() => {
    if (element) {
      setContent(element.content || "")
      setUrl(element.url || "")
      setElementType(element.type || "text")
      
      // Get styles with defaults
      const elementStyles = element.styles || {
        color: "#000000",
        backgroundColor: "#ffffff",
        fontSize: 16,
        fontWeight: "normal",
        textAlign: "left",
        xPosition: 0,
        yPosition: 0,
        width: 'auto',
        height: 'auto',
      }
      
      // Set basic styles
      setStyles({
        color: elementStyles.color || "#000000",
        backgroundColor: elementStyles.backgroundColor || "#ffffff",
        fontSize: typeof elementStyles.fontSize === 'string' ? parseInt(elementStyles.fontSize as string, 10) : (elementStyles.fontSize || 16),
        fontWeight: elementStyles.fontWeight || "normal",
        textAlign: elementStyles.textAlign || "left",
        xPosition: elementStyles.xPosition || 0,
        yPosition: elementStyles.yPosition || 0,
        width: typeof elementStyles.width === 'number' ? `${elementStyles.width}px` : (elementStyles.width || 'auto'),
        height: typeof elementStyles.height === 'number' ? `${elementStyles.height}px` : (elementStyles.height || 'auto'),
      })
      
      // Load animation settings - check both places (for backward compatibility)
      const animationData = elementStyles.animation || element.animation || {
        type: 'none',
        duration: 300,
        timing: 'ease',
        trigger: 'hover',
        infinite: false,
        delay: 0
      }
      
      setAnimation(animationData)
      
      // Load transition settings - check both places (for backward compatibility)
      const transitionData = elementStyles.transition || element.transition || {
        property: 'all',
        duration: 300,
        timing: 'ease',
        delay: 0
      }
      
      setTransition(transitionData)
    } else {
      // If element doesn't exist in context, get the original content from the DOM element
      console.log(`TemplateEditingPanel: Element ${elementId} not found in context, getting original content from DOM`);
      
      // Try to find the DOM element to get its original content
      const domElement = document.querySelector(`[data-editable="true"][onClick*="${elementId}"]`) || 
                        document.getElementById(elementId) ||
                        document.querySelector(`[id="${elementId}"]`);
      
      let originalContent = "";
      let originalUrl = "";
      
      if (domElement) {
        // Get text content for text elements
        if (domElement.tagName === 'P' || domElement.tagName === 'H1' || domElement.tagName === 'H2' || 
            domElement.tagName === 'H3' || domElement.tagName === 'BUTTON' || domElement.tagName === 'SPAN') {
          originalContent = domElement.textContent || "";
        }
        
        // Get src for images
        const imgElement = domElement.querySelector('img') || (domElement.tagName === 'IMG' ? domElement : null);
        if (imgElement) {
          originalUrl = (imgElement as HTMLImageElement).src || "";
        }
        
        // Get background image for sections
        const computedStyle = window.getComputedStyle(domElement);
        if (computedStyle.backgroundImage && computedStyle.backgroundImage !== 'none') {
          originalUrl = computedStyle.backgroundImage.replace(/url\(['"']?(.*?)['"']?\)/, '$1');
        }
      }
      
      // Try to determine element type from ID patterns
      let inferredType = "text";
      if (elementId.includes("image") || elementId.includes("avatar") || elementId.includes("logo")) {
        inferredType = "image";
      } else if (elementId.includes("title") || elementId.includes("heading")) {
        inferredType = "heading";
      } else if (elementId.includes("button") || elementId.includes("cta")) {
        inferredType = "button";
      }
      
      setElementType(inferredType);
      setContent(originalContent);
      setUrl(originalUrl);
      
      // Don't create the element immediately - let it be created when user actually makes changes
    }
  }, [element, elementId])

  // Always show the panel, even if element doesn't exist yet
  const currentElement = element || {
    id: elementId,
    type: elementType,
    content: content,
    url: url,
    styles: styles,
    position: { x: 0, y: 0 }
  }

  const handleContentChange = (newContent: string) => {
    setContent(newContent)
    
    // Ensure element exists
    if (!element) {
      const newElement = {
        id: elementId,
        type: elementType,
        content: newContent,
        url: url,
        styles: styles,
        position: { x: 0, y: 0 }
      }
      addElement(newElement)
    } else {
      updateElement(elementId, { content: newContent })
    }
  }

  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl)
    
    // Ensure element exists
    if (!element) {
      const newElement = {
        id: elementId,
        type: elementType,
        content: content,
        url: newUrl,
        styles: styles,
        position: { x: 0, y: 0 }
      }
      addElement(newElement)
    } else {
      updateElement(elementId, { url: newUrl })
    }
  }

  const handleStyleChange = (styleKey: string, value: any) => {
    const newStyles = { ...styles, [styleKey]: value }
    setStyles(newStyles)
    
    // Debounce the update to prevent infinite loops
    setTimeout(() => {
      // Ensure element exists
      if (!element) {
        const newElement = {
          id: elementId,
          type: elementType,
          content: content,
          url: url,
          styles: newStyles,
          position: { x: 0, y: 0 }
        }
        addElement(newElement)
      } else {
        updateElement(elementId, { styles: newStyles })
      }
    }, 0)
  }

  const handleAnimationChange = (animationKey: string, value: any) => {
    // Update local state
    const newAnimation = { ...animation, [animationKey]: value }
    setAnimation(newAnimation)
    
    // Debounce the update to prevent infinite loops
    setTimeout(() => {
      // Update element with animation in styles property
      updateElement(elementId, { 
        styles: { 
          ...element?.styles,
          animation: newAnimation 
        },
        // Keep legacy property for backward compatibility
        animation: newAnimation
      })
    }, 0)
  }

  const handleTransitionChange = (transitionKey: string, value: any) => {
    // Update local state
    const newTransition = { ...transition, [transitionKey]: value }
    setTransition(newTransition)
    
    // Debounce the update to prevent infinite loops
    setTimeout(() => {
      // Update element with transition in styles property
      updateElement(elementId, { 
        styles: { 
          ...element?.styles,
          transition: newTransition 
        },
        // Keep legacy property for backward compatibility
        transition: newTransition
      })
    }, 0)
  }

  const handlePresetChange = (presetName: string) => {
    const preset = animationPresets[presetName as keyof typeof animationPresets]
    if (preset) {
      // Update local state
      setAnimation(preset.animation)
      setTransition(preset.transition)
      
      setTimeout(() => {
        // Update element with animation and transition in styles property
        updateElement(elementId, { 
          styles: {
            ...element?.styles,
            animation: preset.animation,
            transition: preset.transition
          },
          // Keep legacy properties for backward compatibility
          animation: preset.animation, 
          transition: preset.transition 
        })
      }, 0)
    }
  }

  const handlePositionChange = (axis: 'x' | 'y', value: number) => {
    // Ensure element exists first
    if (!element) {
      // Create the element if it doesn't exist
      const newElement = {
        id: elementId,
        type: elementType,
        content: content,
        url: url,
        styles: styles,
        position: { x: axis === 'x' ? value : 0, y: axis === 'y' ? value : 0 }
      }
      addElement(newElement)
    } else {
      // Update existing element
      const currentPosition = element.position || { x: 0, y: 0 }
      const newPosition = { ...currentPosition, [axis]: value }
      updateElement(elementId, { position: newPosition })
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string
        handleUrlChange(imageUrl)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDelete = () => {
    if (element) {
      deleteElement(elementId)
      onClose()
    } else {
      // If element doesn't exist in context, just close the panel
      onClose()
    }
  }

  const handleDuplicate = () => {
    // Ensure element exists in context first
    if (!element) {
      // Create the original element first
      const originalElement = {
        id: elementId,
        type: elementType,
        content: content,
        url: url,
        styles: styles,
        position: { x: 0, y: 0 }
      }
      addElement(originalElement)
    }
    
    // Create duplicate
    const sourceElement = element || {
      id: elementId,
      type: elementType,
      content: content,
      url: url,
      styles: styles,
      position: { x: 0, y: 0 }
    }
    
    const newElement = {
      ...sourceElement,
      id: `${sourceElement.id}_copy_${Date.now()}`,
      position: {
        x: (sourceElement.position?.x || 0) + 20,
        y: (sourceElement.position?.y || 0) + 20,
      },
    }
    addElement(newElement)
  }

  return (
    <div className="fixed right-4 top-20 bottom-4 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden editing-panel">
      <Card className="h-full border-0">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Edit Element</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ×
            </Button>
          </div>
          <p className="text-sm text-gray-500 capitalize">{currentElement.type} Element</p>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto">
          <Tabs defaultValue="content" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="style">Style</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-4">
              {/* Content editing based on element type */}
              {(currentElement.type === "text" || currentElement.type === "heading" || currentElement.type === "button") && (
                <div>
                  <Label htmlFor="content">Content</Label>
                  {currentElement.type === "text" ? (
                    <Textarea
                      id="content"
                      value={content}
                      onChange={(e) => handleContentChange(e.target.value)}
                      placeholder="Enter your text content..."
                      className="mt-1"
                    />
                  ) : (
                    <Input
                      id="content"
                      value={content}
                      onChange={(e) => handleContentChange(e.target.value)}
                      placeholder={currentElement.type === "heading" ? "Enter heading..." : "Button text..."}
                      className="mt-1"
                    />
                  )}
                </div>
              )}

              {(currentElement.type === "image" || currentElement.type === "video" || currentElement.type === "section" || currentElement.type === "button") && (
                <div>
                  <Label htmlFor="url">
                    {currentElement.type === "image" ? "Image URL" : 
                     currentElement.type === "video" ? "Video URL" :
                     currentElement.type === "section" ? "Background Image URL" : "Link URL"}
                  </Label>
                  <div className="space-y-2">
                    <Input
                      id="url"
                      value={url}
                      onChange={(e) => handleUrlChange(e.target.value)}
                      placeholder={
                        currentElement.type === "image" ? "https://example.com/image.jpg" :
                        currentElement.type === "video" ? "https://example.com/video.mp4" :
                        currentElement.type === "section" ? "https://example.com/background.jpg" :
                        "https://example.com"
                      }
                      className="mt-1"
                    />
                    {(currentElement.type === "image" || currentElement.type === "section") && (
                      <>
                        <div className="text-center text-sm text-gray-500">or</div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full"
                        >
                          Upload {currentElement.type === "image" ? "Image" : "Background Image"}
                        </Button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </>
                    )}
                  </div>
                </div>
              )}
            </TabsContent>


            <TabsContent value="style" className="space-y-4">
              {/* Typography */}
              {(currentElement.type === "text" || currentElement.type === "heading" || currentElement.type === "button") && (
                <>
                  <div>
                    <Label>Font Size: {styles.fontSize}px</Label>
                    <Slider
                      value={[Number(styles.fontSize) || 16]}
                      onValueChange={([value]) => {
                        // Update local state immediately for smooth UI
                        setStyles(prev => ({ ...prev, fontSize: value }))
                        // Debounce context update
                        setTimeout(() => {
                          updateElement(elementId, { styles: { ...styles, fontSize: value } })
                        }, 100)
                      }}
                      max={72}
                      min={8}
                      step={1}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="fontWeight">Font Weight</Label>
                    <select
                      id="fontWeight"
                      value={styles.fontWeight || "normal"}
                      onChange={(e) => handleStyleChange("fontWeight", e.target.value)}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="normal">Normal</option>
                      <option value="bold">Bold</option>
                      <option value="lighter">Light</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="textAlign">Text Align</Label>
                    <select
                      id="textAlign"
                      value={styles.textAlign || "left"}
                      onChange={(e) => handleStyleChange("textAlign", e.target.value)}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="color">Text Color</Label>
                    <Input
                      id="color"
                      type="color"
                      value={styles.color || "#000000"}
                      onChange={(e) => handleStyleChange("color", e.target.value)}
                      className="mt-1 h-10"
                    />
                  </div>
                </>
              )}

              {/* Background Color */}
              <div>
                <Label htmlFor="backgroundColor">Background Color</Label>
                <Input
                  id="backgroundColor"
                  type="color"
                  value={styles.backgroundColor || "#ffffff"}
                  onChange={(e) => handleStyleChange("backgroundColor", e.target.value)}
                  className="mt-1 h-10"
                />
              </div>

              {/* Dimensions */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="width">Width</Label>
                  <Input
                    id="width"
                    value={styles.width || "auto"}
                    onChange={(e) => handleStyleChange("width", e.target.value)}
                    placeholder="auto, 100px, 50%"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="height">Height</Label>
                  <Input
                    id="height"
                    value={styles.height || "auto"}
                    onChange={(e) => handleStyleChange("height", e.target.value)}
                    placeholder="auto, 100px, 50%"
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Animation Section - Only for buttons */}
              {currentElement.type === "button" && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-medium mb-4">Animation & Effects</h3>
                  
                  {/* Animation Presets */}
                  <div className="mb-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <Label className="text-xs font-medium mb-2 block">Quick Presets</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(animationPresets).map(([key, preset]) => (
                        <Button 
                          key={key}
                          variant={animation.type === preset.animation.type ? "default" : "outline"}
                          size="sm"
                          className="text-xs h-auto py-1.5"
                          onClick={() => handlePresetChange(key)}
                        >
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Animation Controls */}
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">Animation</Label>
                        <Select value={animation.type} onValueChange={(value) => handleAnimationChange('type', value)}>
                          <SelectTrigger className="mt-1 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="pulse">Pulse</SelectItem>
                            <SelectItem value="bounce">Bounce</SelectItem>
                            <SelectItem value="shake">Shake</SelectItem>
                            <SelectItem value="glow">Glow</SelectItem>
                            <SelectItem value="slide">Slide</SelectItem>
                            <SelectItem value="scale">Scale</SelectItem>
                            <SelectItem value="rotate">Rotate</SelectItem>
                            <SelectItem value="flip">Flip</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs">Trigger</Label>
                        <Select value={animation.trigger} onValueChange={(value) => handleAnimationChange('trigger', value)}>
                          <SelectTrigger className="mt-1 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hover">Hover</SelectItem>
                            <SelectItem value="click">Click</SelectItem>
                            <SelectItem value="load">Load</SelectItem>
                            <SelectItem value="scroll">Scroll</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Duration Slider */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs">Duration</Label>
                        <span className="text-xs text-gray-500">{animation.duration}ms</span>
                      </div>
                      <Slider
                        value={[animation.duration]}
                        onValueChange={([value]) => handleAnimationChange('duration', value)}
                        max={2000}
                        min={100}
                        step={50}
                        className="h-1"
                      />
                    </div>

                    {/* Infinite Toggle */}
                    <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <Label className="text-xs">Infinite</Label>
                      <Switch
                        checked={animation.infinite}
                        onCheckedChange={(checked) => handleAnimationChange('infinite', checked)}
                      />
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>


            <TabsContent value="advanced" className="space-y-4">
              {/* Position */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>X Position: {element?.position?.x || 0}px</Label>
                  <Slider
                    value={[element?.position?.x || 0]}
                    onValueChange={([value]) => handlePositionChange("x", value)}
                    max={1000}
                    min={0}
                    step={1}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Y Position: {element?.position?.y || 0}px</Label>
                  <Slider
                    value={[element?.position?.y || 0]}
                    onValueChange={([value]) => handlePositionChange("y", value)}
                    max={1000}
                    min={0}
                    step={1}
                    className="mt-2"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-4 border-t">
                <Button variant="outline" onClick={handleDuplicate} className="w-full">
                  Duplicate Element
                </Button>
                
                <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      Delete Element
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Element</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this element? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

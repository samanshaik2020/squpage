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
      setStyles(
        element.styles || {
          color: "#000000",
          backgroundColor: "#ffffff",
          fontSize: 16,
          fontWeight: "normal",
          textAlign: "left",
          xPosition: 0,
          yPosition: 0,
          width: 'auto',
          height: 'auto',
        },
      )
      
      // Load animation and transition settings
      setAnimation(element.animation || {
        type: 'none',
        duration: 300,
        timing: 'ease',
        trigger: 'hover',
        infinite: false,
        delay: 0
      })
      
      setTransition(element.transition || {
        property: 'all',
        duration: 300,
        timing: 'ease',
        delay: 0
      })
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
    updateElement(elementId, { content: newContent })
  }

  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl)
    updateElement(elementId, { url: newUrl })
  }

  const handleStyleChange = (styleKey: string, value: any) => {
    const newStyles = { ...styles, [styleKey]: value }
    setStyles(newStyles)
    // Debounce the update to prevent infinite loops
    setTimeout(() => {
      updateElement(elementId, { styles: newStyles })
    }, 0)
  }

  const handleAnimationChange = (animationKey: string, value: any) => {
    const newAnimation = { ...animation, [animationKey]: value }
    setAnimation(newAnimation)
    // Debounce the update to prevent infinite loops
    setTimeout(() => {
      updateElement(elementId, { animation: newAnimation })
    }, 0)
  }

  const handleTransitionChange = (transitionKey: string, value: any) => {
    const newTransition = { ...transition, [transitionKey]: value }
    setTransition(newTransition)
    // Debounce the update to prevent infinite loops
    setTimeout(() => {
      updateElement(elementId, { transition: newTransition })
    }, 0)
  }

  const handlePresetChange = (presetName: string) => {
    const preset = animationPresets[presetName as keyof typeof animationPresets]
    if (preset) {
      setAnimation(preset.animation)
      setTransition(preset.transition)
      setTimeout(() => {
        updateElement(elementId, { 
          animation: preset.animation, 
          transition: preset.transition 
        })
      }, 0)
    }
  }

  const handlePositionChange = (axis: 'x' | 'y', value: number) => {
    const newPosition = { ...currentElement.position }
    newPosition[axis] = value
    updateElement(elementId, { position: newPosition })
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
    deleteElement(elementId)
    onClose()
  }

  const handleDuplicate = () => {
    const newElement = {
      ...currentElement,
      id: `${currentElement.id}_copy_${Date.now()}`,
      position: {
        x: currentElement.position.x + 20,
        y: currentElement.position.y + 20,
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
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="style">Style</TabsTrigger>
              <TabsTrigger value="animation">Animation</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
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

            <TabsContent value="preview" className="space-y-4">
              {/* Live Preview */}
              <div className="border rounded-lg p-4 bg-white min-h-[200px]">
                <Label className="text-sm font-medium mb-2 block">Live Preview</Label>
                <div className="preview-container" style={{ 
                  fontFamily: 'inherit',
                  lineHeight: '1.5'
                }}>
                  {currentElement.type === 'text' && (
                    <p style={{
                      color: styles.color,
                      backgroundColor: styles.backgroundColor,
                      fontSize: `${styles.fontSize}px`,
                      fontWeight: styles.fontWeight,
                      textAlign: styles.textAlign as any,
                      width: styles.width,
                      height: styles.height,
                      padding: '8px',
                      margin: '0',
                      borderRadius: '4px'
                    }}>
                      {content || 'Enter your text content...'}
                    </p>
                  )}
                  {currentElement.type === 'heading' && (
                    <h2 style={{
                      color: styles.color,
                      backgroundColor: styles.backgroundColor,
                      fontSize: `${styles.fontSize}px`,
                      fontWeight: styles.fontWeight,
                      textAlign: styles.textAlign as any,
                      width: styles.width,
                      height: styles.height,
                      padding: '8px',
                      margin: '0',
                      borderRadius: '4px'
                    }}>
                      {content || 'Enter heading...'}
                    </h2>
                  )}
                  {currentElement.type === 'button' && (
                    <button style={{
                      color: styles.color,
                      backgroundColor: styles.backgroundColor,
                      fontSize: `${styles.fontSize}px`,
                      fontWeight: styles.fontWeight,
                      textAlign: styles.textAlign as any,
                      width: styles.width,
                      height: styles.height,
                      padding: '12px 24px',
                      margin: '0',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}>
                      {content || 'Button text...'}
                    </button>
                  )}
                  {currentElement.type === 'image' && (
                    <div style={{
                      backgroundColor: styles.backgroundColor,
                      width: styles.width,
                      height: styles.height,
                      borderRadius: '4px',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {url ? (
                        <img 
                          src={url} 
                          alt="Preview" 
                          style={{
                            maxWidth: '100%',
                            maxHeight: '100%',
                            objectFit: 'cover'
                          }}
                        />
                      ) : (
                        <div style={{
                          color: '#666',
                          textAlign: 'center',
                          padding: '20px'
                        }}>
                          No image selected
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Share Options */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Share Preview</Label>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      const previewData = {
                        element: currentElement,
                        styles,
                        content,
                        url
                      }
                      navigator.clipboard.writeText(JSON.stringify(previewData, null, 2))
                    }}
                  >
                    Copy Data
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      const shareUrl = `${window.location.origin}/preview?element=${encodeURIComponent(JSON.stringify({ element: currentElement, styles, content, url }))}`
                      navigator.clipboard.writeText(shareUrl)
                    }}
                  >
                    Copy Link
                  </Button>
                </div>
              </div>
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
            </TabsContent>

            <TabsContent value="animation" className="space-y-4">
              {/* Show animation controls only for buttons */}
              {currentElement.type === "button" && (
                <>
                  {/* Animation Presets */}
                  <div>
                    <Label>Animation Presets</Label>
                    <Select onValueChange={handlePresetChange}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Choose a preset" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="subtle">Subtle (Scale)</SelectItem>
                        <SelectItem value="energetic">Energetic (Bounce)</SelectItem>
                        <SelectItem value="elegant">Elegant (Glow)</SelectItem>
                        <SelectItem value="playful">Playful (Shake)</SelectItem>
                        <SelectItem value="modern">Modern (Slide)</SelectItem>
                        <SelectItem value="classic">Classic (Pulse)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Animation Type */}
                  <div>
                    <Label>Animation Type</Label>
                    <Select value={animation.type} onValueChange={(value) => handleAnimationChange('type', value)}>
                      <SelectTrigger className="mt-1">
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

                  {/* Animation Trigger */}
                  <div>
                    <Label>Animation Trigger</Label>
                    <Select value={animation.trigger} onValueChange={(value) => handleAnimationChange('trigger', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hover">On Hover</SelectItem>
                        <SelectItem value="click">On Click</SelectItem>
                        <SelectItem value="load">On Load</SelectItem>
                        <SelectItem value="scroll">On Scroll</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Animation Duration */}
                  <div>
                    <Label>Animation Duration: {animation.duration}ms</Label>
                    <Slider
                      value={[animation.duration]}
                      onValueChange={([value]) => handleAnimationChange('duration', value)}
                      max={2000}
                      min={100}
                      step={50}
                      className="mt-2"
                    />
                  </div>

                  {/* Animation Timing */}
                  <div>
                    <Label>Animation Timing</Label>
                    <Select value={animation.timing} onValueChange={(value) => handleAnimationChange('timing', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ease">Ease</SelectItem>
                        <SelectItem value="ease-in">Ease In</SelectItem>
                        <SelectItem value="ease-out">Ease Out</SelectItem>
                        <SelectItem value="ease-in-out">Ease In Out</SelectItem>
                        <SelectItem value="linear">Linear</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Animation Delay */}
                  <div>
                    <Label>Animation Delay: {animation.delay}ms</Label>
                    <Slider
                      value={[animation.delay]}
                      onValueChange={([value]) => handleAnimationChange('delay', value)}
                      max={1000}
                      min={0}
                      step={50}
                      className="mt-2"
                    />
                  </div>

                  {/* Infinite Animation */}
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={animation.infinite}
                      onCheckedChange={(checked) => handleAnimationChange('infinite', checked)}
                    />
                    <Label>Infinite Animation</Label>
                  </div>

                  <hr className="my-4" />

                  {/* Transition Property */}
                  <div>
                    <Label>Transition Property</Label>
                    <Select value={transition.property} onValueChange={(value) => handleTransitionChange('property', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Properties</SelectItem>
                        <SelectItem value="background">Background</SelectItem>
                        <SelectItem value="transform">Transform</SelectItem>
                        <SelectItem value="color">Color</SelectItem>
                        <SelectItem value="border">Border</SelectItem>
                        <SelectItem value="shadow">Shadow</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Transition Duration */}
                  <div>
                    <Label>Transition Duration: {transition.duration}ms</Label>
                    <Slider
                      value={[transition.duration]}
                      onValueChange={([value]) => handleTransitionChange('duration', value)}
                      max={1000}
                      min={50}
                      step={25}
                      className="mt-2"
                    />
                  </div>

                  {/* Transition Timing */}
                  <div>
                    <Label>Transition Timing</Label>
                    <Select value={transition.timing} onValueChange={(value) => handleTransitionChange('timing', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ease">Ease</SelectItem>
                        <SelectItem value="ease-in">Ease In</SelectItem>
                        <SelectItem value="ease-out">Ease Out</SelectItem>
                        <SelectItem value="ease-in-out">Ease In Out</SelectItem>
                        <SelectItem value="linear">Linear</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Transition Delay */}
                  <div>
                    <Label>Transition Delay: {transition.delay}ms</Label>
                    <Slider
                      value={[transition.delay]}
                      onValueChange={([value]) => handleTransitionChange('delay', value)}
                      max={500}
                      min={0}
                      step={25}
                      className="mt-2"
                    />
                  </div>
                </>
              )}

              {/* Show message for non-button elements */}
              {currentElement.type !== "button" && (
                <div className="text-center text-gray-500 py-8">
                  <p>Animation controls are only available for button elements.</p>
                  <p className="text-sm mt-2">Select a button to customize its animations and transitions.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4">
              {/* Position */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>X Position: {currentElement.position?.x || 0}px</Label>
                  <Slider
                    value={[currentElement.position?.x || 0]}
                    onValueChange={([value]) => handlePositionChange("x", value)}
                    max={1000}
                    min={0}
                    step={1}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Y Position: {currentElement.position?.y || 0}px</Label>
                  <Slider
                    value={[currentElement.position?.y || 0]}
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

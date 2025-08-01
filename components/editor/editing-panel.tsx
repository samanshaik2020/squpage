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
import { useEditor } from "@/lib/editor-context" // Updated import
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

interface EditingPanelProps {
  elementId: string
  onClose: () => void
}

export function EditingPanel({ elementId, onClose }: EditingPanelProps) {
  const { elements, updateElement, addElement, deleteElement } = useEditor() // Use useEditor hook
  const element = elements.find((el) => el.id === elementId)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const [content, setContent] = useState(element?.content || "")
  const [url, setUrl] = useState(element?.url || "") // State for URL, used for buttons/images/sections
  const [styles, setStyles] = useState(
    element?.styles || {
      color: "#000000",
      backgroundColor: "#ffffff",
      fontSize: 16,
      fontWeight: "normal",
      textAlign: "left",
      xPosition: 0,
      yPosition: 0,
    },
  )

  useEffect(() => {
    if (element) {
      setContent(element.content || "")
      setUrl(element.url || "") // Set URL from element state
      setStyles(
        element.styles || {
          color: "#000000",
          backgroundColor: "#ffffff",
          fontSize: 16,
          fontWeight: "normal",
          textAlign: "left",
          xPosition: 0,
          yPosition: 0,
        },
      )
    }
  }, [element])

  const handleContentChange = (newContent: string) => {
    setContent(newContent)
    updateElementData({ content: newContent })
  }

  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl)
    updateElementData({ url: newUrl })
  }

  const handleStyleChange = (newStyles: any) => {
    const updatedStyles = { ...styles, ...newStyles }
    setStyles(updatedStyles)
    updateElementData({ styles: updatedStyles })
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string
        if (elementType === "image") {
          handleContentChange(imageUrl) // For image elements, content is the URL
        } else if (elementType === "section") {
          handleUrlChange(imageUrl) // For sections, URL is the background image
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDeleteElement = () => {
    deleteElement(elementId)
    setShowDeleteDialog(false)
    onClose()
  }

  const updateElementData = (updates: any) => {
    if (element) {
      updateElement(elementId, updates)
    } else {
      // Create new element if it doesn't exist (this part might need more specific logic for adding new elements)
      addElement({
        id: elementId,
        type: "text", // Default type, should be more specific based on context
        content: content,
        styles: styles,
        url: url,
        position: { x: 0, y: 0 },
        ...updates,
      })
    }
  }

  const getElementType = () => {
    if (elementId.includes("image") || elementId.includes("avatar") || elementId.includes("logo")) return "image"
    if (elementId.includes("button") || elementId.includes("cta")) return "button"
    if (elementId.includes("title") || elementId.includes("heading")) return "heading"
    if (elementId.includes("section")) return "section" // Identify sections
    return "text"
  }

  const elementType = getElementType()

  return (
    <div className="editing-panel fixed right-4 top-20 w-80 bg-white border shadow-2xl rounded-lg z-50 max-h-[calc(100vh-6rem)] overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="text-lg font-semibold">Edit Element</h3>
        <div className="flex items-center space-x-2">
          <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
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
                <AlertDialogAction onClick={handleDeleteElement} className="bg-red-600 hover:bg-red-700">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>
      </div>

      <div className="overflow-y-auto max-h-[calc(100vh-12rem)]">
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mx-4 mt-4">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="style">Style</TabsTrigger>
            <TabsTrigger value="layout">Layout</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="p-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">
                  {elementType === "image"
                    ? "Image Content"
                    : elementType === "section"
                      ? "Section Properties"
                      : "Text Content"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {elementType === "image" ? (
                  <>
                    <div>
                      <Label htmlFor="image-url">Image URL</Label>
                      <Input
                        id="image-url"
                        value={content}
                        onChange={(e) => handleContentChange(e.target.value)}
                        className="mt-1"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    <div className="text-center">
                      <span className="text-sm text-gray-500">or</span>
                    </div>
                    <div>
                      <Label>Upload Image</Label>
                      <div className="mt-1">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="w-full">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                          </svg>
                          Upload Image
                        </Button>
                      </div>
                    </div>
                    {content && (
                      <div className="mt-4">
                        <Label>Preview</Label>
                        <div className="mt-2 border rounded-lg overflow-hidden">
                          <img
                            src={content || "/placeholder.svg"}
                            alt="Preview"
                            className="w-full h-32 object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.style.display = "none"
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </>
                ) : elementType === "section" ? (
                  <>
                    <div>
                      <Label htmlFor="background-image-url">Background Image URL</Label>
                      <Input
                        id="background-image-url"
                        value={url}
                        onChange={(e) => handleUrlChange(e.target.value)}
                        className="mt-1"
                        placeholder="https://example.com/background.jpg"
                      />
                    </div>
                    <div className="text-center">
                      <span className="text-sm text-gray-500">or</span>
                    </div>
                    <div>
                      <Label>Upload Background Image</Label>
                      <div className="mt-1">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="w-full">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                          </svg>
                          Upload Image
                        </Button>
                      </div>
                    </div>
                    {url && (
                      <div className="mt-4">
                        <Label>Preview</Label>
                        <div className="mt-2 border rounded-lg overflow-hidden">
                          <img
                            src={url || "/placeholder.svg"}
                            alt="Background Preview"
                            className="w-full h-32 object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.style.display = "none"
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div>
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      value={content}
                      onChange={(e) => handleContentChange(e.target.value)}
                      className="mt-1"
                      rows={3}
                      placeholder="Enter your content here..."
                    />
                  </div>
                )}

                {elementType === "button" && (
                  <div>
                    <Label htmlFor="button-url">Button URL</Label>
                    <div className="flex space-x-2 mt-1">
                      <svg className="w-4 h-4 mt-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                        />
                      </svg>
                      <Input
                        id="button-url"
                        value={url}
                        onChange={(e) => handleUrlChange(e.target.value)}
                        placeholder="https://example.com"
                        className="flex-1"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="style" className="p-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Typography</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Text Alignment</Label>
                  <div className="flex space-x-2 mt-1">
                    <Button
                      variant={styles.textAlign === "left" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleStyleChange({ textAlign: "left" })}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <line x1="17" y1="10" x2="3" y2="10" />
                        <line x1="21" y1="6" x2="3" y2="6" />
                        <line x1="21" y1="14" x2="3" y2="14" />
                        <line x1="17" y1="18" x2="3" y2="18" />
                      </svg>
                    </Button>
                    <Button
                      variant={styles.textAlign === "center" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleStyleChange({ textAlign: "center" })}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <line x1="18" y1="10" x2="6" y2="10" />
                        <line x1="21" y1="6" x2="3" y2="6" />
                        <line x1="21" y1="14" x2="3" y2="14" />
                        <line x1="18" y1="18" x2="6" y2="18" />
                      </svg>
                    </Button>
                    <Button
                      variant={styles.textAlign === "right" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleStyleChange({ textAlign: "right" })}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <line x1="21" y1="10" x2="7" y2="10" />
                        <line x1="21" y1="6" x2="3" y2="6" />
                        <line x1="21" y1="14" x2="3" y2="14" />
                        <line x1="21" y1="18" x2="7" y2="18" />
                      </svg>
                    </Button>
                    <Button
                      variant={styles.textAlign === "justify" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleStyleChange({ textAlign: "justify" })}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <line x1="21" y1="10" x2="3" y2="10" />
                        <line x1="21" y1="6" x2="3" y2="6" />
                        <line x1="21" y1="14" x2="3" y2="14" />
                        <line x1="21" y1="18" x2="3" y2="18" />
                      </svg>
                    </Button>
                  </div>
                </div>

                <div>
                  <Label>Font Size: {styles.fontSize}px</Label>
                  <Slider
                    value={[styles.fontSize || 16]}
                    onValueChange={([value]) => handleStyleChange({ fontSize: value })}
                    max={72}
                    min={12}
                    step={1}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Font Weight</Label>
                  <div className="flex space-x-2 mt-1">
                    <Button
                      variant={styles.fontWeight === "normal" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleStyleChange({ fontWeight: "normal" })}
                    >
                      Normal
                    </Button>
                    <Button
                      variant={styles.fontWeight === "bold" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleStyleChange({ fontWeight: "bold" })}
                    >
                      Bold
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Colors</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="text-color">Text Color</Label>
                  <div className="flex space-x-2 mt-1">
                    <Input
                      id="text-color"
                      type="color"
                      value={styles.color || "#000000"}
                      onChange={(e) => handleStyleChange({ color: e.target.value })}
                      className="w-12 h-8 p-0 border-0"
                    />
                    <Input
                      value={styles.color || "#000000"}
                      onChange={(e) => handleStyleChange({ color: e.target.value })}
                      className="flex-1"
                      placeholder="#000000"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="bg-color">Background Color</Label>
                  <div className="flex space-x-2 mt-1">
                    <Input
                      id="bg-color"
                      type="color"
                      value={styles.backgroundColor || "#ffffff"}
                      onChange={(e) => handleStyleChange({ backgroundColor: e.target.value })}
                      className="w-12 h-8 p-0 border-0"
                    />
                    <Input
                      value={styles.backgroundColor || "#ffffff"}
                      onChange={(e) => handleStyleChange({ backgroundColor: e.target.value })}
                      className="flex-1"
                      placeholder="#ffffff"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="layout" className="p-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Position</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>X Position: {styles.xPosition || 0}px</Label>
                  <Slider
                    value={[styles.xPosition || 0]}
                    onValueChange={([value]) => handleStyleChange({ xPosition: value })}
                    max={200}
                    min={-200}
                    step={1}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Y Position: {styles.yPosition || 0}px</Label>
                  <Slider
                    value={[styles.yPosition || 0]}
                    onValueChange={([value]) => handleStyleChange({ yPosition: value })}
                    max={200}
                    min={-200}
                    step={1}
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

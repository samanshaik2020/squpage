"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormField } from "@/lib/elementor-context"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Settings, X, Layout, Palette, AlignJustify, Type, FileText, Image as ImageIcon, MousePointer, Play, Layers, Zap, Eye, EyeOff } from "lucide-react"
import { useElementor, ElementorElement } from "@/lib/elementor-context"

interface ElementorPropertiesPanelProps {
  onClose: () => void
}

export function ElementorPropertiesPanel({ onClose }: ElementorPropertiesPanelProps) {
  const { selectedElement, getElementById, updateElement } = useElementor()
  
  const element = selectedElement ? getElementById(selectedElement) : null

  if (!element) {
    return (
      <div className="fixed right-0 top-16 bottom-0 w-80 bg-white border-l border-gray-200 shadow-lg z-40">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Properties</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center text-gray-500">
            <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No element selected</p>
            <p className="text-sm mt-2">Click on an element to edit its properties</p>
          </div>
        </div>
      </div>
    )
  }

  const handleStyleUpdate = (property: string, value: any) => {
    updateElement(element.id, {
      styles: {
        ...element.styles,
        [property]: value
      }
    })
  }

  const handleSettingUpdate = (property: string, value: any) => {
    updateElement(element.id, {
      settings: {
        ...element.settings,
        [property]: value
      }
    })
  }

  const renderSectionProperties = () => (
    <Tabs defaultValue="layout" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="layout">
          <Layout className="w-4 h-4 mr-1" />
          Layout
        </TabsTrigger>
        <TabsTrigger value="style">
          <Palette className="w-4 h-4 mr-1" />
          Style
        </TabsTrigger>
        <TabsTrigger value="advanced">
          <AlignJustify className="w-4 h-4 mr-1" />
          Advanced
        </TabsTrigger>
      </TabsList>

      <TabsContent value="layout" className="space-y-4">
        <div>
          <Label htmlFor="content-width">Content Width</Label>
          <Select 
            value={element.settings?.contentWidth || 'boxed'} 
            onValueChange={(value) => handleSettingUpdate('contentWidth', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="boxed">Boxed</SelectItem>
              <SelectItem value="full-width">Full Width</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="height">Minimum Height (px)</Label>
          <Input
            id="height"
            type="number"
            value={element.styles?.height?.replace('px', '') || '400'}
            onChange={(e) => handleStyleUpdate('height', `${e.target.value}px`)}
            placeholder="400"
          />
        </div>
      </TabsContent>

      <TabsContent value="style" className="space-y-4">
        <div>
          <Label htmlFor="bg-type">Background Type</Label>
          <Select 
            value={element.settings?.backgroundType || 'color'} 
            onValueChange={(value) => handleSettingUpdate('backgroundType', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="color">Color</SelectItem>
              <SelectItem value="image">Image</SelectItem>
              <SelectItem value="video">Video</SelectItem>
              <SelectItem value="slideshow">Slideshow</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {element.settings?.backgroundType === 'color' && (
          <div>
            <Label htmlFor="bg-color">Background Color</Label>
            <Input
              id="bg-color"
              type="color"
              value={element.styles?.backgroundColor || '#ffffff'}
              onChange={(e) => handleStyleUpdate('backgroundColor', e.target.value)}
            />
          </div>
        )}

        {element.settings?.backgroundType === 'image' && (
          <>
            <div>
              <Label htmlFor="bg-image">Background Image URL</Label>
              <Input
                id="bg-image"
                type="url"
                value={element.styles?.backgroundImage || ''}
                onChange={(e) => handleStyleUpdate('backgroundImage', `url(${e.target.value})`)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <Label htmlFor="bg-size">Background Size</Label>
              <Select 
                value={element.styles?.backgroundSize || 'cover'} 
                onValueChange={(value) => handleStyleUpdate('backgroundSize', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cover">Cover</SelectItem>
                  <SelectItem value="contain">Contain</SelectItem>
                  <SelectItem value="auto">Auto</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="bg-position">Background Position</Label>
              <Select 
                value={element.styles?.backgroundPosition || 'center center'} 
                onValueChange={(value) => handleStyleUpdate('backgroundPosition', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="center center">Center Center</SelectItem>
                  <SelectItem value="top center">Top Center</SelectItem>
                  <SelectItem value="bottom center">Bottom Center</SelectItem>
                  <SelectItem value="left center">Left Center</SelectItem>
                  <SelectItem value="right center">Right Center</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {element.settings?.backgroundType === 'video' && (
          <div>
            <Label htmlFor="bg-video">Background Video URL</Label>
            <Input
              id="bg-video"
              type="url"
              value={element.settings?.backgroundVideoUrl || ''}
              onChange={(e) => handleSettingUpdate('backgroundVideoUrl', e.target.value)}
              placeholder="https://example.com/video.mp4"
            />
          </div>
        )}

        <div className="border-t pt-4">
          <div className="flex items-center space-x-2 mb-2">
            <input
              type="checkbox"
              id="bg-overlay"
              checked={element.settings?.backgroundOverlay || false}
              onChange={(e) => handleSettingUpdate('backgroundOverlay', e.target.checked)}
            />
            <Label htmlFor="bg-overlay">Background Overlay</Label>
          </div>
          
          {element.settings?.backgroundOverlay && (
            <>
              <div className="mb-2">
                <Label htmlFor="overlay-color">Overlay Color</Label>
                <Input
                  id="overlay-color"
                  type="color"
                  value={element.settings?.overlayColor || '#000000'}
                  onChange={(e) => handleSettingUpdate('overlayColor', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="overlay-opacity">Overlay Opacity (%)</Label>
                <Input
                  id="overlay-opacity"
                  type="number"
                  min="0"
                  max="100"
                  value={element.settings?.overlayOpacity || 50}
                  onChange={(e) => handleSettingUpdate('overlayOpacity', parseInt(e.target.value))}
                />
              </div>
            </>
          )}
        </div>

        <div className="border-t pt-4">
          <div>
            <Label htmlFor="border">Border</Label>
            <Input
              id="border"
              value={element.styles?.border || ''}
              onChange={(e) => handleStyleUpdate('border', e.target.value)}
              placeholder="1px solid #000000"
            />
          </div>
          
          <div className="mt-2">
            <Label htmlFor="box-shadow">Box Shadow</Label>
            <Input
              id="box-shadow"
              value={element.styles?.boxShadow || ''}
              onChange={(e) => handleStyleUpdate('boxShadow', e.target.value)}
              placeholder="0 4px 6px rgba(0, 0, 0, 0.1)"
            />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="advanced" className="space-y-4">
        <div>
          <Label>Padding (px)</Label>
          <Input
            type="number"
            value={element.styles?.padding?.replace('px', '') || '20'}
            onChange={(e) => handleStyleUpdate('padding', `${e.target.value}px`)}
            placeholder="20"
          />
        </div>

        <div>
          <Label>Margin (px)</Label>
          <Input
            type="number"
            value={element.styles?.margin?.replace('px', '') || '0'}
            onChange={(e) => handleStyleUpdate('margin', `${e.target.value}px`)}
            placeholder="0"
          />
        </div>

        <div className="border-t pt-4">
          <h4 className="font-medium mb-2 flex items-center">
            <Zap className="w-4 h-4 mr-1" />
            Motion Effects
          </h4>
          <div className="flex items-center space-x-2 mb-2">
            <input
              type="checkbox"
              id="scrolling-effects"
              checked={element.settings?.motionEffects?.scrolling || false}
              onChange={(e) => handleSettingUpdate('motionEffects', {
                ...element.settings?.motionEffects,
                scrolling: e.target.checked
              })}
            />
            <Label htmlFor="scrolling-effects">Enable Scrolling Effects</Label>
          </div>
          
          {element.settings?.motionEffects?.scrolling && (
            <>
              <div className="mb-2">
                <Label htmlFor="entrance-animation">Entrance Animation</Label>
                <Select 
                  value={element.settings?.motionEffects?.entrance || 'fadeIn'} 
                  onValueChange={(value) => handleSettingUpdate('motionEffects', {
                    ...element.settings?.motionEffects,
                    entrance: value
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fadeIn">Fade In</SelectItem>
                    <SelectItem value="slideUp">Slide Up</SelectItem>
                    <SelectItem value="slideDown">Slide Down</SelectItem>
                    <SelectItem value="slideLeft">Slide Left</SelectItem>
                    <SelectItem value="slideRight">Slide Right</SelectItem>
                    <SelectItem value="zoomIn">Zoom In</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="animation-duration">Duration (ms)</Label>
                <Input
                  id="animation-duration"
                  type="number"
                  value={element.settings?.motionEffects?.duration || 600}
                  onChange={(e) => handleSettingUpdate('motionEffects', {
                    ...element.settings?.motionEffects,
                    duration: parseInt(e.target.value)
                  })}
                />
              </div>
            </>
          )}
        </div>

        <div className="border-t pt-4">
          <h4 className="font-medium mb-2 flex items-center">
            <Eye className="w-4 h-4 mr-1" />
            Responsive
          </h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="hide-desktop"
                checked={element.settings?.responsive?.hideOnDesktop || false}
                onChange={(e) => handleSettingUpdate('responsive', {
                  ...element.settings?.responsive,
                  hideOnDesktop: e.target.checked
                })}
              />
              <Label htmlFor="hide-desktop">Hide on Desktop</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="hide-tablet"
                checked={element.settings?.responsive?.hideOnTablet || false}
                onChange={(e) => handleSettingUpdate('responsive', {
                  ...element.settings?.responsive,
                  hideOnTablet: e.target.checked
                })}
              />
              <Label htmlFor="hide-tablet">Hide on Tablet</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="hide-mobile"
                checked={element.settings?.responsive?.hideOnMobile || false}
                onChange={(e) => handleSettingUpdate('responsive', {
                  ...element.settings?.responsive,
                  hideOnMobile: e.target.checked
                })}
              />
              <Label htmlFor="hide-mobile">Hide on Mobile</Label>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )

  const renderRowProperties = () => (
    <Tabs defaultValue="layout" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="layout">Layout</TabsTrigger>
        <TabsTrigger value="advanced">Advanced</TabsTrigger>
      </TabsList>

      <TabsContent value="layout" className="space-y-4">
        <div>
          <Label>Column Gap (px)</Label>
          <Input
            type="number"
            value={element.settings?.columnGap?.replace('px', '') || '20'}
            onChange={(e) => handleSettingUpdate('columnGap', `${e.target.value}px`)}
            placeholder="20"
          />
        </div>
      </TabsContent>

      <TabsContent value="advanced" className="space-y-4">
        <div>
          <Label>Padding (px)</Label>
          <Input
            type="number"
            value={element.styles?.padding?.replace('px', '') || '10'}
            onChange={(e) => handleStyleUpdate('padding', `${e.target.value}px`)}
            placeholder="10"
          />
        </div>
      </TabsContent>
    </Tabs>
  )

  const renderColumnProperties = () => (
    <Tabs defaultValue="layout" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="layout">Layout</TabsTrigger>
        <TabsTrigger value="advanced">Advanced</TabsTrigger>
      </TabsList>

      <TabsContent value="layout" className="space-y-4">
        <div>
          <Label>Width (%)</Label>
          <Input
            type="number"
            min="1"
            max="100"
            value={element.styles?.width?.replace('%', '') || '50'}
            onChange={(e) => handleStyleUpdate('width', `${e.target.value}%`)}
            placeholder="50"
          />
        </div>

        <div>
          <Label>Alignment</Label>
          <Select 
            value={element.settings?.alignment || 'left'} 
            onValueChange={(value) => handleSettingUpdate('alignment', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="left">Left</SelectItem>
              <SelectItem value="center">Center</SelectItem>
              <SelectItem value="right">Right</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </TabsContent>

      <TabsContent value="advanced" className="space-y-4">
        <div>
          <Label>Padding (px)</Label>
          <Input
            type="number"
            value={element.styles?.padding?.replace('px', '') || '15'}
            onChange={(e) => handleStyleUpdate('padding', `${e.target.value}px`)}
            placeholder="15"
          />
        </div>
      </TabsContent>
    </Tabs>
  )

  const renderHeadingProperties = () => (
    <Tabs defaultValue="content" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="content">
          <FileText className="w-4 h-4 mr-1" />
          Content
        </TabsTrigger>
        <TabsTrigger value="style">
          <Type className="w-4 h-4 mr-1" />
          Style
        </TabsTrigger>
      </TabsList>

      <TabsContent value="content" className="space-y-4">
        <div>
          <Label htmlFor="heading-text">Heading Text</Label>
          <Textarea
            id="heading-text"
            value={element.content || 'Your Heading Here'}
            onChange={(e) => updateElement(element.id, { content: e.target.value })}
            placeholder="Enter your heading text"
            rows={2}
          />
        </div>
      </TabsContent>

      <TabsContent value="style" className="space-y-4">
        <div>
          <Label htmlFor="font-size">Font Size (px)</Label>
          <Input
            id="font-size"
            type="number"
            value={element.styles?.fontSize?.replace('px', '') || '32'}
            onChange={(e) => handleStyleUpdate('fontSize', `${e.target.value}px`)}
            placeholder="32"
          />
        </div>

        <div>
          <Label htmlFor="font-weight">Font Weight</Label>
          <Select 
            value={element.styles?.fontWeight || 'bold'} 
            onValueChange={(value) => handleStyleUpdate('fontWeight', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="bold">Bold</SelectItem>
              <SelectItem value="600">Semi Bold</SelectItem>
              <SelectItem value="300">Light</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="text-color">Text Color</Label>
          <Input
            id="text-color"
            type="color"
            value={element.styles?.color || '#000000'}
            onChange={(e) => handleStyleUpdate('color', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="text-align">Text Alignment</Label>
          <Select 
            value={element.styles?.textAlign || 'left'} 
            onValueChange={(value) => handleStyleUpdate('textAlign', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="left">Left</SelectItem>
              <SelectItem value="center">Center</SelectItem>
              <SelectItem value="right">Right</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </TabsContent>
    </Tabs>
  )

  const renderTextProperties = () => (
    <Tabs defaultValue="content" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="content">
          <FileText className="w-4 h-4 mr-1" />
          Content
        </TabsTrigger>
        <TabsTrigger value="style">
          <Type className="w-4 h-4 mr-1" />
          Style
        </TabsTrigger>
      </TabsList>

      <TabsContent value="content" className="space-y-4">
        <div>
          <Label htmlFor="text-content">Text Content</Label>
          <Textarea
            id="text-content"
            value={element.content || 'Your text content here...'}
            onChange={(e) => updateElement(element.id, { content: e.target.value })}
            placeholder="Enter your text content"
            rows={4}
          />
        </div>
      </TabsContent>

      <TabsContent value="style" className="space-y-4">
        <div>
          <Label htmlFor="font-size">Font Size (px)</Label>
          <Input
            id="font-size"
            type="number"
            value={element.styles?.fontSize?.replace('px', '') || '16'}
            onChange={(e) => handleStyleUpdate('fontSize', `${e.target.value}px`)}
            placeholder="16"
          />
        </div>

        <div>
          <Label htmlFor="font-weight">Font Weight</Label>
          <Select 
            value={element.styles?.fontWeight || 'normal'} 
            onValueChange={(value) => handleStyleUpdate('fontWeight', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="bold">Bold</SelectItem>
              <SelectItem value="600">Semi Bold</SelectItem>
              <SelectItem value="300">Light</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="text-color">Text Color</Label>
          <Input
            id="text-color"
            type="color"
            value={element.styles?.color || '#000000'}
            onChange={(e) => handleStyleUpdate('color', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="text-align">Text Alignment</Label>
          <Select 
            value={element.styles?.textAlign || 'left'} 
            onValueChange={(value) => handleStyleUpdate('textAlign', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="left">Left</SelectItem>
              <SelectItem value="center">Center</SelectItem>
              <SelectItem value="right">Right</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </TabsContent>
    </Tabs>
  )

  const renderImageProperties = () => (
    <Tabs defaultValue="content" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="content">
          <ImageIcon className="w-4 h-4 mr-1" />
          Content
        </TabsTrigger>
        <TabsTrigger value="style">
          <Palette className="w-4 h-4 mr-1" />
          Style
        </TabsTrigger>
      </TabsList>

      <TabsContent value="content" className="space-y-4">
        <div>
          <Label htmlFor="image-url">Image URL</Label>
          <Input
            id="image-url"
            type="url"
            value={element.settings?.imageUrl || ''}
            onChange={(e) => handleSettingUpdate('imageUrl', e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div>
          <Label htmlFor="alt-text">Alt Text</Label>
          <Input
            id="alt-text"
            value={element.settings?.alt || ''}
            onChange={(e) => handleSettingUpdate('alt', e.target.value)}
            placeholder="Describe the image"
          />
        </div>
      </TabsContent>

      <TabsContent value="style" className="space-y-4">
        <div>
          <Label htmlFor="image-width">Width</Label>
          <Select 
            value={element.styles?.width || '100%'} 
            onValueChange={(value) => handleStyleUpdate('width', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">Auto</SelectItem>
              <SelectItem value="100%">Full Width</SelectItem>
              <SelectItem value="50%">Half Width</SelectItem>
              <SelectItem value="300px">300px</SelectItem>
              <SelectItem value="200px">200px</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="image-align">Alignment</Label>
          <Select 
            value={element.styles?.textAlign || 'left'} 
            onValueChange={(value) => handleStyleUpdate('textAlign', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="left">Left</SelectItem>
              <SelectItem value="center">Center</SelectItem>
              <SelectItem value="right">Right</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="border-radius">Border Radius (px)</Label>
          <Input
            id="border-radius"
            type="number"
            value={element.styles?.borderRadius?.replace('px', '') || '0'}
            onChange={(e) => handleStyleUpdate('borderRadius', `${e.target.value}px`)}
            placeholder="0"
          />
        </div>
      </TabsContent>
    </Tabs>
  )

  const renderButtonProperties = () => (
    <Tabs defaultValue="content" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="content">
          <MousePointer className="w-4 h-4 mr-1" />
          Content
        </TabsTrigger>
        <TabsTrigger value="style">
          <Palette className="w-4 h-4 mr-1" />
          Style
        </TabsTrigger>
        <TabsTrigger value="advanced">
          <AlignJustify className="w-4 h-4 mr-1" />
          Advanced
        </TabsTrigger>
      </TabsList>

      <TabsContent value="content" className="space-y-4">
        <div>
          <Label htmlFor="button-text">Button Text</Label>
          <Input
            id="button-text"
            value={element.content || 'Click Me'}
            onChange={(e) => updateElement(element.id, { content: e.target.value })}
            placeholder="Enter button text"
          />
        </div>

        <div>
          <Label htmlFor="button-link">Link URL</Label>
          <Input
            id="button-link"
            type="url"
            value={element.settings?.linkUrl || ''}
            onChange={(e) => handleSettingUpdate('linkUrl', e.target.value)}
            placeholder="https://example.com"
          />
        </div>

        <div>
          <Label htmlFor="link-target">Link Target</Label>
          <Select 
            value={element.settings?.linkTarget || '_self'} 
            onValueChange={(value) => handleSettingUpdate('linkTarget', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="_self">Same Window</SelectItem>
              <SelectItem value="_blank">New Window</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </TabsContent>

      <TabsContent value="style" className="space-y-4">
        <Tabs defaultValue="normal" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="normal">Normal</TabsTrigger>
            <TabsTrigger value="hover">Hover</TabsTrigger>
          </TabsList>

          <TabsContent value="normal" className="space-y-4 mt-4">
            <div>
              <Label htmlFor="font-size">Font Size (px)</Label>
              <Input
                id="font-size"
                type="number"
                value={element.styles?.fontSize?.replace('px', '') || '16'}
                onChange={(e) => handleStyleUpdate('fontSize', `${e.target.value}px`)}
                placeholder="16"
              />
            </div>

            <div>
              <Label htmlFor="font-weight">Font Weight</Label>
              <Select 
                value={element.styles?.fontWeight || 'normal'} 
                onValueChange={(value) => handleStyleUpdate('fontWeight', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="bold">Bold</SelectItem>
                  <SelectItem value="600">Semi Bold</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="text-color">Text Color</Label>
              <Input
                id="text-color"
                type="color"
                value={element.styles?.color || '#ffffff'}
                onChange={(e) => handleStyleUpdate('color', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="bg-color">Background Color</Label>
              <Input
                id="bg-color"
                type="color"
                value={element.styles?.backgroundColor || '#007bff'}
                onChange={(e) => handleStyleUpdate('backgroundColor', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="border-radius">Border Radius (px)</Label>
              <Input
                id="border-radius"
                type="number"
                value={element.styles?.borderRadius?.replace('px', '') || '4'}
                onChange={(e) => handleStyleUpdate('borderRadius', `${e.target.value}px`)}
                placeholder="4"
              />
            </div>

            <div>
              <Label htmlFor="button-padding">Padding (px)</Label>
              <Input
                id="button-padding"
                value={element.styles?.padding || '12px 24px'}
                onChange={(e) => handleStyleUpdate('padding', e.target.value)}
                placeholder="12px 24px"
              />
            </div>

            <div>
              <Label htmlFor="button-alignment">Button Alignment</Label>
              <Select 
                value={element.styles?.justifyContent || 'flex-start'} 
                onValueChange={(value) => handleStyleUpdate('justifyContent', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flex-start">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="flex-end">Right</SelectItem>
                  <SelectItem value="space-between">Space Between</SelectItem>
                  <SelectItem value="space-around">Space Around</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="hover" className="space-y-4 mt-4">
            <div>
              <Label htmlFor="hover-text-color">Hover Text Color</Label>
              <Input
                id="hover-text-color"
                type="color"
                value={element.hoverStyles?.color || '#ffffff'}
                onChange={(e) => updateElement(element.id, {
                  hoverStyles: {
                    ...element.hoverStyles,
                    color: e.target.value
                  }
                })}
              />
            </div>

            <div>
              <Label htmlFor="hover-bg-color">Hover Background Color</Label>
              <Input
                id="hover-bg-color"
                type="color"
                value={element.hoverStyles?.backgroundColor || '#0056b3'}
                onChange={(e) => updateElement(element.id, {
                  hoverStyles: {
                    ...element.hoverStyles,
                    backgroundColor: e.target.value
                  }
                })}
              />
            </div>

            <div>
              <Label htmlFor="hover-transform">Hover Transform</Label>
              <Select 
                value={element.hoverStyles?.transform || 'none'} 
                onValueChange={(value) => updateElement(element.id, {
                  hoverStyles: {
                    ...element.hoverStyles,
                    transform: value === 'none' ? undefined : value
                  }
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="scale(1.05)">Scale Up</SelectItem>
                  <SelectItem value="scale(0.95)">Scale Down</SelectItem>
                  <SelectItem value="translateY(-2px)">Move Up</SelectItem>
                  <SelectItem value="translateY(2px)">Move Down</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
        </Tabs>
      </TabsContent>

      <TabsContent value="advanced" className="space-y-4">
        <div className="border-t pt-4">
          <h4 className="font-medium mb-2 flex items-center">
            <Zap className="w-4 h-4 mr-1" />
            Motion Effects
          </h4>
          <div className="flex items-center space-x-2 mb-2">
            <input
              type="checkbox"
              id="button-scrolling-effects"
              checked={element.settings?.motionEffects?.scrolling || false}
              onChange={(e) => handleSettingUpdate('motionEffects', {
                ...element.settings?.motionEffects,
                scrolling: e.target.checked
              })}
            />
            <Label htmlFor="button-scrolling-effects">Enable Scrolling Effects</Label>
          </div>
          
          {element.settings?.motionEffects?.scrolling && (
            <>
              <div className="mb-2">
                <Label htmlFor="button-entrance-animation">Entrance Animation</Label>
                <Select 
                  value={element.settings?.motionEffects?.entrance || 'fadeIn'} 
                  onValueChange={(value) => handleSettingUpdate('motionEffects', {
                    ...element.settings?.motionEffects,
                    entrance: value
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fadeIn">Fade In</SelectItem>
                    <SelectItem value="slideUp">Slide Up</SelectItem>
                    <SelectItem value="slideDown">Slide Down</SelectItem>
                    <SelectItem value="slideLeft">Slide Left</SelectItem>
                    <SelectItem value="slideRight">Slide Right</SelectItem>
                    <SelectItem value="zoomIn">Zoom In</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="button-animation-duration">Duration (ms)</Label>
                <Input
                  id="button-animation-duration"
                  type="number"
                  value={element.settings?.motionEffects?.duration || 600}
                  onChange={(e) => handleSettingUpdate('motionEffects', {
                    ...element.settings?.motionEffects,
                    duration: parseInt(e.target.value)
                  })}
                />
              </div>
            </>
          )}
        </div>

        <div className="border-t pt-4">
          <h4 className="font-medium mb-2 flex items-center">
            <Eye className="w-4 h-4 mr-1" />
            Responsive
          </h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="button-hide-desktop"
                checked={element.settings?.responsive?.hideOnDesktop || false}
                onChange={(e) => handleSettingUpdate('responsive', {
                  ...element.settings?.responsive,
                  hideOnDesktop: e.target.checked
                })}
              />
              <Label htmlFor="button-hide-desktop">Hide on Desktop</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="button-hide-tablet"
                checked={element.settings?.responsive?.hideOnTablet || false}
                onChange={(e) => handleSettingUpdate('responsive', {
                  ...element.settings?.responsive,
                  hideOnTablet: e.target.checked
                })}
              />
              <Label htmlFor="button-hide-tablet">Hide on Tablet</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="button-hide-mobile"
                checked={element.settings?.responsive?.hideOnMobile || false}
                onChange={(e) => handleSettingUpdate('responsive', {
                  ...element.settings?.responsive,
                  hideOnMobile: e.target.checked
                })}
              />
              <Label htmlFor="button-hide-mobile">Hide on Mobile</Label>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )

  const renderVideoProperties = () => (
    <Tabs defaultValue="content" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="content">
          <Play className="w-4 h-4 mr-1" />
          Content
        </TabsTrigger>
        <TabsTrigger value="style">
          <Palette className="w-4 h-4 mr-1" />
          Style
        </TabsTrigger>
      </TabsList>

      <TabsContent value="content" className="space-y-4">
        <div>
          <Label htmlFor="video-url">Video URL</Label>
          <Input
            id="video-url"
            type="url"
            value={element.settings?.videoUrl || ''}
            onChange={(e) => handleSettingUpdate('videoUrl', e.target.value)}
            placeholder="https://www.youtube.com/embed/VIDEO_ID or https://player.vimeo.com/video/VIDEO_ID"
          />
        </div>

        <div>
          <Label htmlFor="video-aspect-ratio">Aspect Ratio</Label>
          <Select 
            value={element.styles?.aspectRatio || '16/9'} 
            onValueChange={(value) => handleStyleUpdate('aspectRatio', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="16/9">16:9 (Widescreen)</SelectItem>
              <SelectItem value="4/3">4:3 (Standard)</SelectItem>
              <SelectItem value="1/1">1:1 (Square)</SelectItem>
              <SelectItem value="21/9">21:9 (Ultrawide)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </TabsContent>

      <TabsContent value="style" className="space-y-4">
        <div>
          <Label htmlFor="video-border-radius">Border Radius (px)</Label>
          <Input
            id="video-border-radius"
            type="number"
            value={element.styles?.borderRadius?.replace('px', '') || '0'}
            onChange={(e) => handleStyleUpdate('borderRadius', `${e.target.value}px`)}
            placeholder="0"
          />
        </div>

        <div>
          <Label htmlFor="video-width">Width</Label>
          <Input
            id="video-width"
            value={element.styles?.width || '100%'}
            onChange={(e) => handleStyleUpdate('width', e.target.value)}
            placeholder="100%"
          />
        </div>
      </TabsContent>
    </Tabs>
  )

  const renderSpacerProperties = () => (
    <Tabs defaultValue="layout" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="layout">
          <Layout className="w-4 h-4 mr-1" />
          Layout
        </TabsTrigger>
        <TabsTrigger value="advanced">
          <AlignJustify className="w-4 h-4 mr-1" />
          Advanced
        </TabsTrigger>
      </TabsList>

      <TabsContent value="layout" className="space-y-4">
        <div>
          <Label htmlFor="spacer-height">Height (px)</Label>
          <Input
            id="spacer-height"
            type="number"
            value={element.styles?.height?.replace('px', '') || '50'}
            onChange={(e) => handleStyleUpdate('height', `${e.target.value}px`)}
            placeholder="50"
          />
        </div>

        <div>
          <Label htmlFor="spacer-width">Width</Label>
          <Input
            id="spacer-width"
            value={element.styles?.width || '100%'}
            onChange={(e) => handleStyleUpdate('width', e.target.value)}
            placeholder="100%"
          />
        </div>
      </TabsContent>

      <TabsContent value="advanced" className="space-y-4">
        <div className="space-y-2">
          <Label>Responsive Visibility</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="spacer-hide-desktop"
                checked={element.settings?.responsive?.hideOnDesktop || false}
                onChange={(e) => handleSettingUpdate('responsive', {
                  ...element.settings?.responsive,
                  hideOnDesktop: e.target.checked
                })}
              />
              <Label htmlFor="spacer-hide-desktop">Hide on Desktop</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="spacer-hide-tablet"
                checked={element.settings?.responsive?.hideOnTablet || false}
                onChange={(e) => handleSettingUpdate('responsive', {
                  ...element.settings?.responsive,
                  hideOnTablet: e.target.checked
                })}
              />
              <Label htmlFor="spacer-hide-tablet">Hide on Tablet</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="spacer-hide-mobile"
                checked={element.settings?.responsive?.hideOnMobile || false}
                onChange={(e) => handleSettingUpdate('responsive', {
                  ...element.settings?.responsive,
                  hideOnMobile: e.target.checked
                })}
              />
              <Label htmlFor="spacer-hide-mobile">Hide on Mobile</Label>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )

  const renderProperties = () => {
    switch (element.type) {
      case 'section':
        return renderSectionProperties()
      case 'row':
        return renderRowProperties()
      case 'column':
        return renderColumnProperties()
      case 'heading':
        return renderHeadingProperties()
      case 'text':
        return renderTextProperties()
      case 'image':
        return renderImageProperties()
      case 'button':
        return renderButtonProperties()
      case 'video':
        return renderVideoProperties()
      case 'spacer':
        return renderSpacerProperties()
      case 'form':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">Form Fields</h3>
              <button
                onClick={() => {
                  const newField: FormField = {
                    id: Math.random().toString(36).substr(2, 9),
                    type: 'text',
                    label: 'New Field',
                    placeholder: 'Enter value',
                    required: false,
                    width: '100%'
                  }
                  updateElement(element.id, {
                    formFields: [...(element.formFields || []), newField]
                  })
                }}
                className="px-2 py-1 text-xs bg-blue-500 text-white rounded"
              >
                Add Field
              </button>
            </div>
            {element.formFields?.map((field: any, idx: number) => (
              <div key={field.id} className="border p-2 rounded">
                <div className="flex justify-between mb-2">
                  <span className="text-xs font-medium">Field {idx + 1}</span>
                  <button
                    onClick={() => {
                      const updatedFields = element.formFields?.filter((f: any) => f.id !== field.id)
                      updateElement(element.id, { formFields: updatedFields })
                    }}
                    className="text-red-500 text-xs"
                  >
                    Remove
                  </button>
                </div>
                <input
                  type="text"
                  value={field.label}
                  onChange={(e) => {
                    const updatedFields = element.formFields?.map((f: any) => 
                      f.id === field.id ? { ...f, label: e.target.value } : f
                    )
                    updateElement(element.id, { formFields: updatedFields })
                  }}
                  className="w-full px-2 py-1 text-xs border rounded mb-1"
                  placeholder="Field Label"
                />
                <select
                  value={field.type}
                  onChange={(e) => {
                    const updatedFields = element.formFields?.map((f: any) => 
                      f.id === field.id ? { ...f, type: e.target.value as 'text' | 'email' | 'textarea' | 'select' | 'checkbox' | 'radio' } : f
                    )
                    updateElement(element.id, { formFields: updatedFields })
                  }}
                  className="w-full px-2 py-1 text-xs border rounded"
                >
                  <option value="text">Text</option>
                  <option value="email">Email</option>
                  <option value="textarea">Textarea</option>
                  <option value="select">Select</option>
                  <option value="checkbox">Checkbox</option>
                  <option value="radio">Radio</option>
                </select>
              </div>
            ))}
          </div>
        )
      case 'pricing-table':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Plan Name</label>
              <input
                type="text"
                value={element.content || ''}
                onChange={(e) => updateElement(element.id, { content: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">Features</h3>
              <button
                onClick={() => {
                  const newFeature = {
                    id: Math.random().toString(36).substr(2, 9),
                    text: 'New Feature',
                    included: true
                  }
                  updateElement(element.id, {
                    pricingFeatures: [...(element.pricingFeatures || []), newFeature]
                  })
                }}
                className="px-2 py-1 text-xs bg-blue-500 text-white rounded"
              >
                Add Feature
              </button>
            </div>
            {element.pricingFeatures?.map((feature: any, idx: number) => (
              <div key={feature.id} className="border p-2 rounded">
                <div className="flex justify-between mb-2">
                  <span className="text-xs font-medium">Feature {idx + 1}</span>
                  <button
                    onClick={() => {
                      const updatedFeatures = element.pricingFeatures?.filter((f: any) => f.id !== feature.id)
                      updateElement(element.id, { pricingFeatures: updatedFeatures })
                    }}
                    className="text-red-500 text-xs"
                  >
                    Remove
                  </button>
                </div>
                <input
                  type="text"
                  value={feature.text}
                  onChange={(e) => {
                    const updatedFeatures = element.pricingFeatures?.map((f: any) => 
                      f.id === feature.id ? { ...f, text: e.target.value } : f
                    )
                    updateElement(element.id, { pricingFeatures: updatedFeatures })
                  }}
                  className="w-full px-2 py-1 text-xs border rounded mb-1"
                  placeholder="Feature text"
                />
                <label className="flex items-center text-xs">
                  <input
                    type="checkbox"
                    checked={feature.included}
                    onChange={(e) => {
                      const updatedFeatures = element.pricingFeatures?.map((f: any) => 
                        f.id === feature.id ? { ...f, included: e.target.checked } : f
                      )
                      updateElement(element.id, { pricingFeatures: updatedFeatures })
                    }}
                    className="mr-2"
                  />
                  Included
                </label>
              </div>
            ))}
          </div>
        )
      case 'testimonial-carousel':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">Testimonials</h3>
              <button
                onClick={() => {
                  const newTestimonial = {
                    id: Math.random().toString(36).substr(2, 9),
                    name: 'New Customer',
                    content: 'Great service!',
                    rating: 5
                  }
                  updateElement(element.id, {
                    testimonials: [...(element.testimonials || []), newTestimonial]
                  })
                }}
                className="px-2 py-1 text-xs bg-blue-500 text-white rounded"
              >
                Add Testimonial
              </button>
            </div>
            {element.testimonials?.map((testimonial: any, idx: number) => (
              <div key={testimonial.id} className="border p-2 rounded">
                <div className="flex justify-between mb-2">
                  <span className="text-xs font-medium">Testimonial {idx + 1}</span>
                  <button
                    onClick={() => {
                      const updatedTestimonials = element.testimonials?.filter((t: any) => t.id !== testimonial.id)
                      updateElement(element.id, { testimonials: updatedTestimonials })
                    }}
                    className="text-red-500 text-xs"
                  >
                    Remove
                  </button>
                </div>
                <textarea
                  value={testimonial.content}
                  onChange={(e) => {
                    const updatedTestimonials = element.testimonials?.map((t: any) => 
                      t.id === testimonial.id ? { ...t, content: e.target.value } : t
                    )
                    updateElement(element.id, { testimonials: updatedTestimonials })
                  }}
                  className="w-full px-2 py-1 text-xs border rounded mb-1"
                  rows={2}
                  placeholder="Testimonial content"
                />
                <input
                  type="text"
                  value={testimonial.name}
                  onChange={(e) => {
                    const updatedTestimonials = element.testimonials?.map((t: any) => 
                      t.id === testimonial.id ? { ...t, name: e.target.value } : t
                    )
                    updateElement(element.id, { testimonials: updatedTestimonials })
                  }}
                  className="w-full px-2 py-1 text-xs border rounded"
                  placeholder="Customer name"
                />
              </div>
            ))}
          </div>
        )

      default:
        return (
          <div className="text-center text-gray-500 py-8">
            <p>No properties available for this element type.</p>
          </div>
        )
    }
  }

  return (
    <div className="fixed right-0 top-16 bottom-0 w-80 bg-white border-l border-gray-200 shadow-lg z-40 flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Properties</h2>
          <p className="text-sm text-gray-500 capitalize">{element.type} Element</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {renderProperties()}
      </div>
    </div>
  )
}

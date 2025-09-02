"use client"

import React, { useState, useCallback, useMemo } from 'react'
import { useElementor } from '@/lib/elementor-context'
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Palette,
  Trash2,
  Plus
} from 'lucide-react'

interface ElementPropertiesPanelProps {
  element: any
}

export function ElementPropertiesPanel({ element }: ElementPropertiesPanelProps) {
  const { updateElement, deleteElement } = useElementor()
  
  if (!element) return null

  const updateStyle = (property: string, value: string | number) => {
    const updatedStyles = {
      ...element.styles,
      [property]: value
    }
    updateElement(element.id, { styles: updatedStyles })
  }

  // Helper function to safely parse CSS numeric values
  const parseNumericValue = useCallback((value: string | number | undefined, defaultValue: number): number => {
    if (typeof value === 'number') return value
    if (!value) return defaultValue
    const numericString = value.toString().replace(/[^\d.-]/g, '')
    const parsed = parseFloat(numericString)
    return isNaN(parsed) ? defaultValue : parsed
  }, [])

  const updateContent = (content: string) => {
    updateElement(element.id, { content })
  }

  const renderCommonStyleOptions = (isTextElement = false) => (
    <div className="space-y-4">
      {/* Only show these options for non-text elements (since text elements use the floating toolbar) */}
      {!isTextElement && (
        <>
          {/* Text alignment */}
          <div className="space-y-2">
            <Label>Text Alignment</Label>
            <div className="flex space-x-2">
              <Button 
                variant={element.styles?.textAlign === 'left' ? 'default' : 'outline'} 
                size="icon" 
                onClick={() => updateStyle('textAlign', 'left')}
              >
                <AlignLeft className="h-4 w-4" />
              </Button>
              <Button 
                variant={element.styles?.textAlign === 'center' ? 'default' : 'outline'} 
                size="icon" 
                onClick={() => updateStyle('textAlign', 'center')}
              >
                <AlignCenter className="h-4 w-4" />
              </Button>
              <Button 
                variant={element.styles?.textAlign === 'right' ? 'default' : 'outline'} 
                size="icon" 
                onClick={() => updateStyle('textAlign', 'right')}
              >
                <AlignRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Text formatting */}
          <div className="space-y-2">
            <Label>Text Style</Label>
            <div className="flex space-x-2">
              <Button 
                variant={element.styles?.fontWeight === 'bold' ? 'default' : 'outline'} 
                size="icon" 
                onClick={() => updateStyle('fontWeight', element.styles?.fontWeight === 'bold' ? 'normal' : 'bold')}
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button 
                variant={element.styles?.fontStyle === 'italic' ? 'default' : 'outline'} 
                size="icon" 
                onClick={() => updateStyle('fontStyle', element.styles?.fontStyle === 'italic' ? 'normal' : 'italic')}
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button 
                variant={element.styles?.textDecoration === 'underline' ? 'default' : 'outline'} 
                size="icon" 
                onClick={() => updateStyle('textDecoration', element.styles?.textDecoration === 'underline' ? 'none' : 'underline')}
              >
                <Underline className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Color picker */}
          <div className="space-y-2">
            <Label>Text Color</Label>
            <div className="flex items-center space-x-2">
              <div 
                className="w-8 h-8 rounded-full border"
                style={{ backgroundColor: element.styles?.color || '#000000' }}
              />
              <Input 
                type="color" 
                value={(element.styles?.color) || '#000000'} 
                onChange={(e) => updateStyle('color', e.target.value)}
                className="w-12 h-8 p-0"
              />
              <Input 
                type="text" 
                value={(element.styles?.color) || '#000000'} 
                onChange={(e) => updateStyle('color', e.target.value)}
                className="flex-1"
              />
            </div>
          </div>
          
          {/* Font size */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Font Size</Label>
              <span className="text-sm">{element.styles?.fontSize || '16px'}</span>
            </div>
            <Slider
              value={useMemo(() => [parseNumericValue(element.styles?.fontSize, 16)], [element.styles?.fontSize, parseNumericValue])}
              max={72}
              min={8}
              step={1}
              onValueChange={(value) => updateStyle('fontSize', `${value[0]}px`)}
            />
          </div>
        </>
      )}
      
      {/* Margin and padding */}
      <div className="space-y-2">
        <Label>Margin</Label>
        <Input 
          type="text" 
          value={(element.styles?.margin) || '0'} 
          onChange={(e) => updateStyle('margin', e.target.value)}
          placeholder="e.g. 10px or 10px 20px"
        />
      </div>
      
      <div className="space-y-2">
        <Label>Padding</Label>
        <Input 
          type="text" 
          value={(element.styles?.padding) || '0'} 
          onChange={(e) => updateStyle('padding', e.target.value)}
          placeholder="e.g. 10px or 10px 20px"
        />
      </div>
    </div>
  )
  
  const renderHeadingOptions = () => {
    const lineHeightValue = useMemo(() => 
      [parseNumericValue(element.styles?.lineHeight, 1.2)], 
      [element.styles?.lineHeight, parseNumericValue]
    )
    
    return (
      <div className="space-y-4">
        {renderCommonStyleOptions(true)}
        
        {/* Line height */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Line Height</Label>
            <span className="text-sm">{element.styles?.lineHeight || '1.2'}</span>
          </div>
          <Slider
            value={lineHeightValue}
            max={3}
            min={1}
            step={0.1}
            onValueChange={(value) => updateStyle('lineHeight', value[0].toString())}
          />
        </div>
      </div>
    )
  }
  
  const renderTextOptions = () => {
    const lineHeightValue = useMemo(() => 
      [parseNumericValue(element.styles?.lineHeight, 1.5)], 
      [element.styles?.lineHeight, parseNumericValue]
    )
    
    return (
      <div className="space-y-4">
        {renderCommonStyleOptions(true)}
        
        {/* Line height */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Line Height</Label>
            <span className="text-sm">{element.styles?.lineHeight || '1.5'}</span>
          </div>
          <Slider
            value={lineHeightValue}
            max={3}
            min={1}
            step={0.1}
            onValueChange={(value) => updateStyle('lineHeight', value[0].toString())}
          />
        </div>
      </div>
    )
  }
  
  const renderImageOptions = () => (
    <div className="space-y-6">
      {/* Image Upload */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Upload Image</Label>
        <Input 
          type="file" 
          accept="image/*"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              const file = e.target.files[0];
              const reader = new FileReader();
              reader.onload = (event) => {
                if (event.target?.result) {
                  updateElement(element.id, { 
                    settings: { ...element.settings, imageUrl: event.target.result as string } 
                  });
                }
              };
              reader.readAsDataURL(file);
            }
          }}
          className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      {/* Image URL */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Image URL</Label>
        <Input 
          type="text" 
          value={(element.settings?.imageUrl) || ''} 
          onChange={(e) => updateElement(element.id, { 
            settings: { ...(element.settings || {}), imageUrl: e.target.value } 
          })}
          placeholder="https://example.com/image.jpg"
          className="w-full"
        />
      </div>
      
      {/* Width */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Width</Label>
        <Input 
          type="text" 
          value={(element.styles?.width) || '100%'} 
          onChange={(e) => updateStyle('width', e.target.value)}
          placeholder="e.g. 100%, 300px, auto"
          className="w-full"
        />
      </div>
      
      {/* Height */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Height</Label>
        <Input 
          type="text" 
          value={(element.styles?.height) || 'auto'} 
          onChange={(e) => updateStyle('height', e.target.value)}
          placeholder="e.g. auto, 300px, 50vh"
          className="w-full"
        />
      </div>
    </div>
  )
  
  const renderButtonOptions = () => (
    <div className="space-y-4">
      {renderCommonStyleOptions()}
      
      <div className="space-y-2">
        <Label>Button Text</Label>
        <Input 
          type="text" 
          value={(element.content) || ''} 
          onChange={(e) => updateContent(e.target.value)}
          placeholder="Button Text"
        />
      </div>
      
      <div className="space-y-2">
        <Label>Background Color</Label>
        <div className="flex items-center space-x-2">
          <div 
            className="w-8 h-8 rounded-full border"
            style={{ backgroundColor: element.styles?.backgroundColor || '#4F46E5' }}
          />
          <Input 
            type="color" 
            value={(element.styles?.backgroundColor) || '#4F46E5'} 
            onChange={(e) => updateStyle('backgroundColor', e.target.value)}
            className="w-12 h-8 p-0"
          />
          <Input 
            type="text" 
            value={(element.styles?.backgroundColor) || '#4F46E5'} 
            onChange={(e) => updateStyle('backgroundColor', e.target.value)}
            className="flex-1"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Border Radius</Label>
        <Input 
          type="text" 
          value={(element.styles?.borderRadius) || '4px'} 
          onChange={(e) => updateStyle('borderRadius', e.target.value)}
          placeholder="e.g. 4px or 50%"
        />
      </div>
      
      <div className="space-y-2">
        <Label>URL (optional)</Label>
        <Input 
          type="text" 
          value={(element.settings?.url) || ''} 
          onChange={(e) => updateElement(element.id, { 
            settings: { ...(element.settings || {}), url: e.target.value } 
          })}
          placeholder="https://example.com"
        />
      </div>
    </div>
  )
  
  const renderFormOptions = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Form Title</Label>
        <Input 
          type="text" 
          value={element.content || ''} 
          onChange={(e) => updateContent(e.target.value)}
          placeholder="Contact Us"
        />
      </div>
      
      <div className="space-y-2">
        <Label>Submit Button Text</Label>
        <Input 
          type="text" 
          value={(element.settings?.submitButtonText) || 'Submit'} 
          onChange={(e) => updateElement(element.id, { 
            settings: { ...(element.settings || {}), submitButtonText: e.target.value } 
          })}
          placeholder="Submit"
        />
      </div>

      {/* Enhanced Form Settings for Pro */}
      <div className="space-y-2">
        <Label>Submit Action</Label>
        <Select 
          value={element.settings?.submitAction || 'email'} 
          onValueChange={(value) => updateElement(element.id, { 
            settings: { ...(element.settings || {}), submitAction: value } 
          })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="email">Send Email</SelectItem>
            <SelectItem value="webhook">Webhook</SelectItem>
            <SelectItem value="mailchimp">Mailchimp</SelectItem>
            <SelectItem value="hubspot">HubSpot</SelectItem>
            <SelectItem value="salesforce">Salesforce</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {element.settings?.submitAction === 'email' && (
        <div className="space-y-2">
          <Label>Email Address</Label>
          <Input 
            type="email" 
            value={element.settings?.submitEmail || ''} 
            onChange={(e) => updateElement(element.id, { 
              settings: { ...(element.settings || {}), submitEmail: e.target.value } 
            })}
            placeholder="admin@example.com"
          />
        </div>
      )}

      {element.settings?.submitAction === 'webhook' && (
        <div className="space-y-2">
          <Label>Webhook URL</Label>
          <Input 
            type="url" 
            value={element.settings?.webhookUrl || ''} 
            onChange={(e) => updateElement(element.id, { 
              settings: { ...(element.settings || {}), webhookUrl: e.target.value } 
            })}
            placeholder="https://api.example.com/webhook"
          />
        </div>
      )}
      
      <div className="space-y-2">
        <Label>Form Fields</Label>
        <div className="border rounded-md p-4 space-y-4 max-h-64 overflow-y-auto">
          {element.formFields?.map((field: any, index: number) => (
            <div key={field.id} className="space-y-2 border-b pb-2">
              <div className="flex justify-between">
                <span className="font-medium">{field.label || field.type}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    const updatedFields = [...element.formFields]
                    updatedFields.splice(index, 1)
                    updateElement(element.id, { formFields: updatedFields })
                  }}
                >
                  Remove
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input 
                  type="text" 
                  value={field.label || ''} 
                  onChange={(e) => {
                    const updatedFields = [...element.formFields]
                    updatedFields[index] = { ...field, label: e.target.value }
                    updateElement(element.id, { formFields: updatedFields })
                  }}
                  placeholder="Label"
                />
                <Select 
                  value={field.type} 
                  onValueChange={(value) => {
                    const updatedFields = [...element.formFields]
                    updatedFields[index] = { ...field, type: value }
                    updateElement(element.id, { formFields: updatedFields })
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Field Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="phone">Phone</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="url">URL</SelectItem>
                    <SelectItem value="textarea">Text Area</SelectItem>
                    <SelectItem value="checkbox">Checkbox</SelectItem>
                    <SelectItem value="radio">Radio</SelectItem>
                    <SelectItem value="select">Dropdown</SelectItem>
                    <SelectItem value="file">File Upload</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Input 
                type="text" 
                value={field.placeholder || ''} 
                onChange={(e) => {
                  const updatedFields = [...element.formFields]
                  updatedFields[index] = { ...field, placeholder: e.target.value }
                  updateElement(element.id, { formFields: updatedFields })
                }}
                placeholder="Placeholder text"
              />
              <div className="flex items-center space-x-2">
                <Switch 
                  checked={field.required || false} 
                  onCheckedChange={(checked) => {
                    const updatedFields = [...element.formFields]
                    updatedFields[index] = { ...field, required: checked }
                    updateElement(element.id, { formFields: updatedFields })
                  }}
                />
                <Label>Required</Label>
              </div>
            </div>
          ))}
          
          <Button 
            variant="outline" 
            onClick={() => {
              const newField = {
                id: `field_${Date.now()}`,
                type: 'text',
                label: 'New Field',
                required: false
              }
              updateElement(element.id, { 
                formFields: [...(element.formFields || []), newField] 
              })
            }}
          >
            Add Field
          </Button>
        </div>
      </div>

      {/* Anti-spam Settings */}
      <div className="space-y-2">
        <Label>Anti-spam Protection</Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Switch 
              checked={element.settings?.antiSpam?.recaptcha || false} 
              onCheckedChange={(checked) => updateElement(element.id, { 
                settings: { 
                  ...element.settings, 
                  antiSpam: { ...element.settings?.antiSpam, recaptcha: checked } 
                } 
              })}
            />
            <Label>Enable reCAPTCHA</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch 
              checked={element.settings?.antiSpam?.honeypot || false} 
              onCheckedChange={(checked) => updateElement(element.id, { 
                settings: { 
                  ...element.settings, 
                  antiSpam: { ...element.settings?.antiSpam, honeypot: checked } 
                } 
              })}
            />
            <Label>Enable Honeypot</Label>
          </div>
        </div>
      </div>
    </div>
  )
  
  const renderPricingTableOptions = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Plan Name</Label>
        <Input 
          type="text" 
          value={element.content || ''} 
          onChange={(e) => updateContent(e.target.value)}
          placeholder="Basic Plan"
        />
      </div>
      
      <div className="space-y-2">
        <Label>Price</Label>
        <Input 
          type="text" 
          value={(element.settings?.price) || '$0'} 
          onChange={(e) => updateElement(element.id, { 
            settings: { ...(element.settings || {}), price: e.target.value } 
          })}
          placeholder="$9.99"
        />
      </div>
      
      <div className="space-y-2">
        <Label>Price Period</Label>
        <Input 
          type="text" 
          value={(element.settings?.period) || '/month'} 
          onChange={(e) => updateElement(element.id, { 
            settings: { ...(element.settings || {}), period: e.target.value } 
          })}
          placeholder="/month"
        />
      </div>
      
      <div className="space-y-2">
        <Label>Features</Label>
        <div className="border rounded-md p-4 space-y-4">
          {element.pricingFeatures?.map((feature: any, index: number) => (
            <div key={feature.id} className="space-y-2 border-b pb-2">
              <div className="flex justify-between">
                <span className="font-medium">{feature.text}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    const updatedFeatures = [...element.pricingFeatures]
                    updatedFeatures.splice(index, 1)
                    updateElement(element.id, { pricingFeatures: updatedFeatures })
                  }}
                >
                  Remove
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Input 
                  type="text" 
                  value={feature.text || ''} 
                  onChange={(e) => {
                    const updatedFeatures = [...element.pricingFeatures]
                    updatedFeatures[index] = { ...feature, text: e.target.value }
                    updateElement(element.id, { pricingFeatures: updatedFeatures })
                  }}
                  placeholder="Feature description"
                />
                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={feature.included || false} 
                    onCheckedChange={(checked) => {
                      const updatedFeatures = [...element.pricingFeatures]
                      updatedFeatures[index] = { ...feature, included: checked }
                      updateElement(element.id, { pricingFeatures: updatedFeatures })
                    }}
                  />
                  <Label>Included</Label>
                </div>
              </div>
            </div>
          ))}
          
          <Button 
            variant="outline" 
            onClick={() => {
              const newFeature = {
                id: `feature_${Date.now()}`,
                text: 'New Feature',
                included: true
              }
              updateElement(element.id, { 
                pricingFeatures: [...(element.pricingFeatures || []), newFeature] 
              })
            }}
          >
            Add Feature
          </Button>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Switch 
            checked={element.settings?.hasRibbon || false} 
            onCheckedChange={(checked) => {
              updateElement(element.id, { 
                settings: { ...element.settings, hasRibbon: checked } 
              })
            }}
          />
          <Label>Show Ribbon</Label>
        </div>
        
        {element.settings?.hasRibbon && (
          <Input 
            type="text" 
            value={element.settings?.ribbonText || 'Popular'} 
            onChange={(e) => updateElement(element.id, { 
              settings: { ...element.settings, ribbonText: e.target.value } 
            })}
            placeholder="Popular"
          />
        )}
      </div>
    </div>
  )
  
  const renderTestimonialCarouselOptions = () => {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Carousel Title</Label>
          <Input 
            type="text" 
            value={element.content || ''} 
            onChange={(e) => updateContent(e.target.value)}
            placeholder="Testimonials"
          />
        </div>
        
        <div className="space-y-2">
          <Label>Testimonials</Label>
          <div className="border rounded-md p-4 space-y-4 max-h-96 overflow-y-auto">
            {element.testimonials?.map((testimonial: any, index: number) => (
              <div key={testimonial.id} className="space-y-3 border-b pb-4 last:border-b-0">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-sm">Testimonial {index + 1}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      const updatedTestimonials = [...element.testimonials]
                      updatedTestimonials.splice(index, 1)
                      updateElement(element.id, { testimonials: updatedTestimonials })
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Name</Label>
                    <Input 
                      type="text" 
                      value={testimonial.name || ''} 
                      onChange={(e) => {
                        const updatedTestimonials = [...element.testimonials]
                        updatedTestimonials[index] = { ...testimonial, name: e.target.value }
                        updateElement(element.id, { testimonials: updatedTestimonials })
                      }}
                      placeholder="John Doe"
                      className="text-sm"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label className="text-xs">Position</Label>
                    <Input 
                      type="text" 
                      value={testimonial.position || ''} 
                      onChange={(e) => {
                        const updatedTestimonials = [...element.testimonials]
                        updatedTestimonials[index] = { ...testimonial, position: e.target.value }
                        updateElement(element.id, { testimonials: updatedTestimonials })
                      }}
                      placeholder="CEO"
                      className="text-sm"
                    />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label className="text-xs">Company</Label>
                  <Input 
                    type="text" 
                    value={testimonial.company || ''} 
                    onChange={(e) => {
                      const updatedTestimonials = [...element.testimonials]
                      updatedTestimonials[index] = { ...testimonial, company: e.target.value }
                      updateElement(element.id, { testimonials: updatedTestimonials })
                    }}
                    placeholder="Company Name"
                    className="text-sm"
                  />
                </div>
                
                <div className="space-y-1">
                  <Label className="text-xs">Testimonial Content</Label>
                  <textarea 
                    value={testimonial.content || ''} 
                    onChange={(e) => {
                      const updatedTestimonials = [...element.testimonials]
                      updatedTestimonials[index] = { ...testimonial, content: e.target.value }
                      updateElement(element.id, { testimonials: updatedTestimonials })
                    }}
                    placeholder="This product changed my life..."
                    className="w-full p-2 border rounded-md text-sm resize-none"
                    rows={3}
                  />
                </div>
                
                <div className="space-y-1">
                  <Label className="text-xs">Rating (1-5 stars)</Label>
                  <div className="flex items-center space-x-2">
                    <Slider
                      value={[testimonial.rating || 5]}
                      max={5}
                      min={1}
                      step={1}
                      onValueChange={(value) => {
                        const updatedTestimonials = [...element.testimonials]
                        updatedTestimonials[index] = { ...testimonial, rating: value[0] }
                        updateElement(element.id, { testimonials: updatedTestimonials })
                      }}
                      className="flex-1"
                    />
                    <span className="text-sm font-medium w-8">{testimonial.rating || 5}</span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label className="text-xs">Avatar URL (optional)</Label>
                  <Input 
                    type="text" 
                    value={testimonial.avatar || ''} 
                    onChange={(e) => {
                      const updatedTestimonials = [...element.testimonials]
                      updatedTestimonials[index] = { ...testimonial, avatar: e.target.value }
                      updateElement(element.id, { testimonials: updatedTestimonials })
                    }}
                    placeholder="https://example.com/avatar.jpg"
                    className="text-sm"
                  />
                </div>
              </div>
            ))}
            
            <Button 
              variant="outline" 
              onClick={() => {
                const newTestimonial = {
                  id: `testimonial_${Date.now()}`,
                  name: 'New Customer',
                  position: 'Customer',
                  company: 'Company',
                  content: 'Great product! Highly recommend.',
                  rating: 5,
                  avatar: ''
                }
                updateElement(element.id, { 
                  testimonials: [...(element.testimonials || []), newTestimonial] 
                })
              }}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Testimonial
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Background Color</Label>
          <div className="flex items-center space-x-2">
            <div 
              className="w-8 h-8 rounded-full border"
              style={{ backgroundColor: element.styles?.backgroundColor || '#ffffff' }}
            />
            <Input 
              type="color" 
              value={(element.styles?.backgroundColor) || '#ffffff'} 
              onChange={(e) => updateStyle('backgroundColor', e.target.value)}
              className="w-12 h-8 p-0"
            />
            <Input 
              type="text" 
              value={(element.styles?.backgroundColor) || '#ffffff'} 
              onChange={(e) => updateStyle('backgroundColor', e.target.value)}
              className="flex-1"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Border Radius</Label>
          <Input 
            type="text" 
            value={(element.styles?.borderRadius) || '8px'} 
            onChange={(e) => updateStyle('borderRadius', e.target.value)}
            placeholder="e.g. 8px or 50%"
          />
        </div>
      </div>
    )
  }
  
  const renderLeadMagnetFormOptions = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Lead Magnet Title</Label>
        <Input 
          type="text" 
          value={element.settings?.leadMagnet?.title || ''} 
          onChange={(e) => updateElement(element.id, { 
            settings: { 
              ...element.settings, 
              leadMagnet: { ...element.settings?.leadMagnet, title: e.target.value } 
            } 
          })}
          placeholder="Get Your Free Guide"
        />
      </div>
      
      <div className="space-y-2">
        <Label>Description</Label>
        <textarea 
          value={element.settings?.leadMagnet?.description || ''} 
          onChange={(e) => updateElement(element.id, { 
            settings: { 
              ...element.settings, 
              leadMagnet: { ...element.settings?.leadMagnet, description: e.target.value } 
            } 
          })}
          placeholder="Download our comprehensive guide..."
          className="w-full p-2 border rounded-md resize-none"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label>Download File URL</Label>
        <Input 
          type="url" 
          value={element.settings?.leadMagnet?.downloadUrl || ''} 
          onChange={(e) => updateElement(element.id, { 
            settings: { 
              ...element.settings, 
              leadMagnet: { ...element.settings?.leadMagnet, downloadUrl: e.target.value } 
            } 
          })}
          placeholder="https://example.com/guide.pdf"
        />
      </div>

      <div className="space-y-2">
        <Label>File Type</Label>
        <Select 
          value={element.settings?.leadMagnet?.fileType || 'pdf'} 
          onValueChange={(value) => updateElement(element.id, { 
            settings: { 
              ...element.settings, 
              leadMagnet: { ...element.settings?.leadMagnet, fileType: value } 
            } 
          })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pdf">PDF</SelectItem>
            <SelectItem value="ebook">eBook</SelectItem>
            <SelectItem value="whitepaper">Whitepaper</SelectItem>
            <SelectItem value="template">Template</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Email Integration</Label>
        <Select 
          value={element.settings?.emailIntegration?.provider || 'mailchimp'} 
          onValueChange={(value) => updateElement(element.id, { 
            settings: { 
              ...element.settings, 
              emailIntegration: { ...element.settings?.emailIntegration, provider: value } 
            } 
          })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mailchimp">Mailchimp</SelectItem>
            <SelectItem value="hubspot">HubSpot</SelectItem>
            <SelectItem value="salesforce">Salesforce</SelectItem>
            <SelectItem value="activecampaign">ActiveCampaign</SelectItem>
            <SelectItem value="convertkit">ConvertKit</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Switch 
          checked={element.settings?.emailIntegration?.doubleOptIn || false} 
          onCheckedChange={(checked) => updateElement(element.id, { 
            settings: { 
              ...element.settings, 
              emailIntegration: { ...element.settings?.emailIntegration, doubleOptIn: checked } 
            } 
          })}
        />
        <Label>Double Opt-in</Label>
      </div>
    </div>
  )

  const renderNewsletterSignupOptions = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Newsletter Title</Label>
        <Input 
          type="text" 
          value={element.content || ''} 
          onChange={(e) => updateContent(e.target.value)}
          placeholder="Stay Updated"
        />
      </div>

      <div className="space-y-2">
        <Label>Email Provider</Label>
        <Select 
          value={element.settings?.emailIntegration?.provider || 'mailchimp'} 
          onValueChange={(value) => updateElement(element.id, { 
            settings: { 
              ...element.settings, 
              emailIntegration: { ...element.settings?.emailIntegration, provider: value } 
            } 
          })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mailchimp">Mailchimp</SelectItem>
            <SelectItem value="hubspot">HubSpot</SelectItem>
            <SelectItem value="salesforce">Salesforce</SelectItem>
            <SelectItem value="activecampaign">ActiveCampaign</SelectItem>
            <SelectItem value="convertkit">ConvertKit</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>List ID</Label>
        <Input 
          type="text" 
          value={element.settings?.emailIntegration?.listId || ''} 
          onChange={(e) => updateElement(element.id, { 
            settings: { 
              ...element.settings, 
              emailIntegration: { ...element.settings?.emailIntegration, listId: e.target.value } 
            } 
          })}
          placeholder="Enter your list ID"
        />
      </div>
    </div>
  )

  const renderMultiStepFormOptions = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Total Steps</Label>
        <Input 
          type="number" 
          min="2"
          max="10"
          value={element.settings?.multiStep?.totalSteps || 3} 
          onChange={(e) => updateElement(element.id, { 
            settings: { 
              ...element.settings, 
              multiStep: { ...element.settings?.multiStep, totalSteps: parseInt(e.target.value) } 
            } 
          })}
        />
      </div>

      <div className="space-y-2">
        <Label>Current Step</Label>
        <Input 
          type="number" 
          min="1"
          max={element.settings?.multiStep?.totalSteps || 3}
          value={element.settings?.multiStep?.currentStep || 1} 
          onChange={(e) => updateElement(element.id, { 
            settings: { 
              ...element.settings, 
              multiStep: { ...element.settings?.multiStep, currentStep: parseInt(e.target.value) } 
            } 
          })}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch 
          checked={element.settings?.multiStep?.showProgress || true} 
          onCheckedChange={(checked) => updateElement(element.id, { 
            settings: { 
              ...element.settings, 
              multiStep: { ...element.settings?.multiStep, showProgress: checked } 
            } 
          })}
        />
        <Label>Show Progress Bar</Label>
      </div>

      {renderFormOptions()}
    </div>
  )

  const renderSlidesOptions = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Slides</Label>
        <div className="border rounded-md p-4 space-y-4 max-h-64 overflow-y-auto">
          {element.slides?.map((slide: any, index: number) => (
            <div key={slide.id} className="space-y-3 border-b pb-4 last:border-b-0">
              <div className="flex justify-between items-center">
                <span className="font-medium text-sm">Slide {index + 1}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    const updatedSlides = [...element.slides]
                    updatedSlides.splice(index, 1)
                    updateElement(element.id, { slides: updatedSlides })
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-2">
                <Input 
                  type="text" 
                  value={slide.title || ''} 
                  onChange={(e) => {
                    const updatedSlides = [...element.slides]
                    updatedSlides[index] = { ...slide, title: e.target.value }
                    updateElement(element.id, { slides: updatedSlides })
                  }}
                  placeholder="Slide Title"
                />
                
                <Input 
                  type="text" 
                  value={slide.subtitle || ''} 
                  onChange={(e) => {
                    const updatedSlides = [...element.slides]
                    updatedSlides[index] = { ...slide, subtitle: e.target.value }
                    updateElement(element.id, { slides: updatedSlides })
                  }}
                  placeholder="Subtitle"
                />
                
                <textarea 
                  value={slide.content || ''} 
                  onChange={(e) => {
                    const updatedSlides = [...element.slides]
                    updatedSlides[index] = { ...slide, content: e.target.value }
                    updateElement(element.id, { slides: updatedSlides })
                  }}
                  placeholder="Slide content..."
                  className="w-full p-2 border rounded-md resize-none"
                  rows={2}
                />
                
                <div className="grid grid-cols-2 gap-2">
                  <Input 
                    type="text" 
                    value={slide.buttonText || ''} 
                    onChange={(e) => {
                      const updatedSlides = [...element.slides]
                      updatedSlides[index] = { ...slide, buttonText: e.target.value }
                      updateElement(element.id, { slides: updatedSlides })
                    }}
                    placeholder="Button Text"
                  />
                  
                  <Input 
                    type="url" 
                    value={slide.buttonUrl || ''} 
                    onChange={(e) => {
                      const updatedSlides = [...element.slides]
                      updatedSlides[index] = { ...slide, buttonUrl: e.target.value }
                      updateElement(element.id, { slides: updatedSlides })
                    }}
                    placeholder="Button URL"
                  />
                </div>
                
                <Input 
                  type="url" 
                  value={slide.backgroundImage || ''} 
                  onChange={(e) => {
                    const updatedSlides = [...element.slides]
                    updatedSlides[index] = { ...slide, backgroundImage: e.target.value }
                    updateElement(element.id, { slides: updatedSlides })
                  }}
                  placeholder="Background Image URL"
                />
              </div>
            </div>
          ))}
          
          <Button 
            variant="outline" 
            onClick={() => {
              const newSlide = {
                id: `slide_${Date.now()}`,
                title: 'New Slide',
                subtitle: 'Subtitle',
                content: 'Slide content goes here.',
                buttonText: 'Learn More',
                buttonUrl: '#',
                textAlign: 'center',
                backgroundColor: '#4F46E5'
              }
              updateElement(element.id, { 
                slides: [...(element.slides || []), newSlide] 
              })
            }}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Slide
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Slider Settings</Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Switch 
              checked={element.settings?.slider?.autoplay || false} 
              onCheckedChange={(checked) => updateElement(element.id, { 
                settings: { 
                  ...element.settings, 
                  slider: { ...element.settings?.slider, autoplay: checked } 
                } 
              })}
            />
            <Label>Autoplay</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              checked={element.settings?.slider?.showDots || true} 
              onCheckedChange={(checked) => updateElement(element.id, { 
                settings: { 
                  ...element.settings, 
                  slider: { ...element.settings?.slider, showDots: checked } 
                } 
              })}
            />
            <Label>Show Dots</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              checked={element.settings?.slider?.showArrows || true} 
              onCheckedChange={(checked) => updateElement(element.id, { 
                settings: { 
                  ...element.settings, 
                  slider: { ...element.settings?.slider, showArrows: checked } 
                } 
              })}
            />
            <Label>Show Arrows</Label>
          </div>
        </div>
      </div>
    </div>
  )

  const renderCountdownOptions = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Countdown Title</Label>
        <Input 
          type="text" 
          value={element.content || ''} 
          onChange={(e) => updateContent(e.target.value)}
          placeholder="Limited Time Offer!"
        />
      </div>

      <div className="space-y-2">
        <Label>Target Date & Time</Label>
        <Input 
          type="datetime-local" 
          value={element.settings?.countdown?.targetDate ? new Date(element.settings.countdown.targetDate).toISOString().slice(0, 16) : ''} 
          onChange={(e) => updateElement(element.id, { 
            settings: { 
              ...element.settings, 
              countdown: { ...element.settings?.countdown, targetDate: new Date(e.target.value).toISOString() } 
            } 
          })}
        />
      </div>

      <div className="space-y-2">
        <Label>Display Format</Label>
        <Select 
          value={element.settings?.countdown?.format || 'dhms'} 
          onValueChange={(value) => updateElement(element.id, { 
            settings: { 
              ...element.settings, 
              countdown: { ...element.settings?.countdown, format: value } 
            } 
          })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dhms">Days, Hours, Minutes, Seconds</SelectItem>
            <SelectItem value="hms">Hours, Minutes, Seconds</SelectItem>
            <SelectItem value="ms">Minutes, Seconds</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Style</Label>
        <Select 
          value={element.settings?.countdown?.style || 'default'} 
          onValueChange={(value) => updateElement(element.id, { 
            settings: { 
              ...element.settings, 
              countdown: { ...element.settings?.countdown, style: value } 
            } 
          })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="circle">Circle</SelectItem>
            <SelectItem value="square">Square</SelectItem>
            <SelectItem value="minimal">Minimal</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Switch 
          checked={element.settings?.countdown?.showLabels || true} 
          onCheckedChange={(checked) => updateElement(element.id, { 
            settings: { 
              ...element.settings, 
              countdown: { ...element.settings?.countdown, showLabels: checked } 
            } 
          })}
        />
        <Label>Show Labels</Label>
      </div>

      <div className="space-y-2">
        <Label>Expired Message</Label>
        <Input 
          type="text" 
          value={element.settings?.countdown?.expiredMessage || ''} 
          onChange={(e) => updateElement(element.id, { 
            settings: { 
              ...element.settings, 
              countdown: { ...element.settings?.countdown, expiredMessage: e.target.value } 
            } 
          })}
          placeholder="Offer has expired!"
        />
      </div>

      <div className="space-y-2">
        <Label>When Expired</Label>
        <Select 
          value={element.settings?.countdown?.expiredAction || 'message'} 
          onValueChange={(value) => updateElement(element.id, { 
            settings: { 
              ...element.settings, 
              countdown: { ...element.settings?.countdown, expiredAction: value } 
            } 
          })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="message">Show Message</SelectItem>
            <SelectItem value="hide">Hide Element</SelectItem>
            <SelectItem value="redirect">Redirect to URL</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {element.settings?.countdown?.expiredAction === 'redirect' && (
        <div className="space-y-2">
          <Label>Redirect URL</Label>
          <Input 
            type="url" 
            value={element.settings?.countdown?.redirectUrl || ''} 
            onChange={(e) => updateElement(element.id, { 
              settings: { 
                ...element.settings, 
                countdown: { ...element.settings?.countdown, redirectUrl: e.target.value } 
              } 
            })}
            placeholder="https://example.com"
          />
        </div>
      )}
    </div>
  )

  const renderCallToActionOptions = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Title</Label>
        <Input 
          type="text" 
          value={element.settings?.callToAction?.title || ''} 
          onChange={(e) => updateElement(element.id, { 
            settings: { 
              ...element.settings, 
              callToAction: { ...element.settings?.callToAction, title: e.target.value } 
            } 
          })}
          placeholder="Ready to Get Started?"
        />
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <textarea 
          value={element.settings?.callToAction?.description || ''} 
          onChange={(e) => updateElement(element.id, { 
            settings: { 
              ...element.settings, 
              callToAction: { ...element.settings?.callToAction, description: e.target.value } 
            } 
          })}
          placeholder="Join thousands of satisfied customers..."
          className="w-full p-2 border rounded-md resize-none"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label>Button Text</Label>
        <Input 
          type="text" 
          value={element.settings?.callToAction?.buttonText || ''} 
          onChange={(e) => updateElement(element.id, { 
            settings: { 
              ...element.settings, 
              callToAction: { ...element.settings?.callToAction, buttonText: e.target.value } 
            } 
          })}
          placeholder="Get Started Now"
        />
      </div>

      <div className="space-y-2">
        <Label>Button URL</Label>
        <Input 
          type="url" 
          value={element.settings?.callToAction?.buttonUrl || ''} 
          onChange={(e) => updateElement(element.id, { 
            settings: { 
              ...element.settings, 
              callToAction: { ...element.settings?.callToAction, buttonUrl: e.target.value } 
            } 
          })}
          placeholder="https://example.com"
        />
      </div>

      <div className="space-y-2">
        <Label>Layout</Label>
        <Select 
          value={element.settings?.callToAction?.layout || 'horizontal'} 
          onValueChange={(value) => updateElement(element.id, { 
            settings: { 
              ...element.settings, 
              callToAction: { ...element.settings?.callToAction, layout: value } 
            } 
          })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="horizontal">Horizontal</SelectItem>
            <SelectItem value="vertical">Vertical</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Switch 
          checked={element.settings?.callToAction?.showImage !== false} 
          onCheckedChange={(checked) => updateElement(element.id, { 
            settings: { 
              ...element.settings, 
              callToAction: { ...element.settings?.callToAction, showImage: checked } 
            } 
          })}
        />
        <Label>Show Image</Label>
      </div>

      {element.settings?.callToAction?.showImage !== false && (
        <div className="space-y-2">
          <Label>Image URL</Label>
          <Input 
            type="url" 
            value={element.settings?.callToAction?.imageUrl || ''} 
            onChange={(e) => updateElement(element.id, { 
              settings: { 
                ...element.settings, 
                callToAction: { ...element.settings?.callToAction, imageUrl: e.target.value } 
              } 
            })}
            placeholder="https://example.com/image.jpg"
          />
        </div>
      )}
    </div>
  )

  const renderShareButtonsOptions = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Social Platforms</Label>
        <div className="space-y-2">
          {['facebook', 'twitter', 'linkedin', 'pinterest', 'whatsapp', 'email'].map((platform) => (
            <div key={platform} className="flex items-center space-x-2">
              <Checkbox 
                checked={element.settings?.shareButtons?.platforms?.includes(platform as any) || false}
                onCheckedChange={(checked) => {
                  const currentPlatforms = element.settings?.shareButtons?.platforms || []
                  const newPlatforms = checked 
                    ? [...currentPlatforms, platform]
                    : currentPlatforms.filter((p: string) => p !== platform)
                  
                  updateElement(element.id, { 
                    settings: { 
                      ...element.settings, 
                      shareButtons: { ...element.settings?.shareButtons, platforms: newPlatforms } 
                    } 
                  })
                }}
              />
              <Label className="capitalize">{platform}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Layout</Label>
        <Select 
          value={element.settings?.shareButtons?.layout || 'horizontal'} 
          onValueChange={(value) => updateElement(element.id, { 
            settings: { 
              ...element.settings, 
              shareButtons: { ...element.settings?.shareButtons, layout: value } 
            } 
          })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="horizontal">Horizontal</SelectItem>
            <SelectItem value="vertical">Vertical</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Button Size</Label>
        <Select 
          value={element.settings?.shareButtons?.size || 'medium'} 
          onValueChange={(value) => updateElement(element.id, { 
            settings: { 
              ...element.settings, 
              shareButtons: { ...element.settings?.shareButtons, size: value } 
            } 
          })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="small">Small</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="large">Large</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Switch 
          checked={element.settings?.shareButtons?.showLabels !== false} 
          onCheckedChange={(checked) => updateElement(element.id, { 
            settings: { 
              ...element.settings, 
              shareButtons: { ...element.settings?.shareButtons, showLabels: checked } 
            } 
          })}
        />
        <Label>Show Labels</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch 
          checked={element.settings?.shareButtons?.showCounts || false} 
          onCheckedChange={(checked) => updateElement(element.id, { 
            settings: { 
              ...element.settings, 
              shareButtons: { ...element.settings?.shareButtons, showCounts: checked } 
            } 
          })}
        />
        <Label>Show Share Counts</Label>
      </div>
    </div>
  )

  const renderBlockquoteOptions = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Quote Text</Label>
        <textarea 
          value={element.content || ''} 
          onChange={(e) => updateContent(e.target.value)}
          placeholder="Enter your quote text here..."
          className="w-full p-2 border rounded-md resize-none"
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label>Quote Style</Label>
        <Select 
          value={element.settings?.blockquote?.style || 'default'} 
          onValueChange={(value) => updateElement(element.id, { 
            settings: { 
              ...element.settings, 
              blockquote: { ...element.settings?.blockquote, style: value } 
            } 
          })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="modern">Modern</SelectItem>
            <SelectItem value="minimal">Minimal</SelectItem>
            <SelectItem value="bordered">Bordered</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Switch 
          checked={element.settings?.blockquote?.showAuthor !== false} 
          onCheckedChange={(checked) => updateElement(element.id, { 
            settings: { 
              ...element.settings, 
              blockquote: { ...element.settings?.blockquote, showAuthor: checked } 
            } 
          })}
        />
        <Label>Show Author</Label>
      </div>

      {element.settings?.blockquote?.showAuthor !== false && (
        <>
          <div className="space-y-2">
            <Label>Author Name</Label>
            <Input 
              type="text" 
              value={element.settings?.blockquote?.authorName || ''} 
              onChange={(e) => updateElement(element.id, { 
                settings: { 
                  ...element.settings, 
                  blockquote: { ...element.settings?.blockquote, authorName: e.target.value } 
                } 
              })}
              placeholder="John Doe"
            />
          </div>

          <div className="space-y-2">
            <Label>Author Title</Label>
            <Input 
              type="text" 
              value={element.settings?.blockquote?.authorTitle || ''} 
              onChange={(e) => updateElement(element.id, { 
                settings: { 
                  ...element.settings, 
                  blockquote: { ...element.settings?.blockquote, authorTitle: e.target.value } 
                } 
              })}
              placeholder="CEO, Company Inc"
            />
          </div>

          <div className="space-y-2">
            <Label>Author Image URL</Label>
            <Input 
              type="url" 
              value={element.settings?.blockquote?.authorImage || ''} 
              onChange={(e) => updateElement(element.id, { 
                settings: { 
                  ...element.settings, 
                  blockquote: { ...element.settings?.blockquote, authorImage: e.target.value } 
                } 
              })}
              placeholder="https://example.com/avatar.jpg"
            />
          </div>
        </>
      )}

      <div className="flex items-center space-x-2">
        <Switch 
          checked={element.settings?.blockquote?.quoteIcon !== false} 
          onCheckedChange={(checked) => updateElement(element.id, { 
            settings: { 
              ...element.settings, 
              blockquote: { ...element.settings?.blockquote, quoteIcon: checked } 
            } 
          })}
        />
        <Label>Show Quote Icon</Label>
      </div>

      <div className="space-y-2">
        <Label>Text Alignment</Label>
        <Select 
          value={element.settings?.blockquote?.alignment || 'left'} 
          onValueChange={(value) => updateElement(element.id, { 
            settings: { 
              ...element.settings, 
              blockquote: { ...element.settings?.blockquote, alignment: value } 
            } 
          })}
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
    </div>
  )

  const renderPostsOptions = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Layout</Label>
        <Select 
          value={element.settings?.posts?.layout || 'grid'} 
          onValueChange={(value) => updateElement(element.id, { 
            settings: { 
              ...element.settings, 
              posts: { ...element.settings?.posts, layout: value } 
            } 
          })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="grid">Grid</SelectItem>
            <SelectItem value="list">List</SelectItem>
            <SelectItem value="masonry">Masonry</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Columns</Label>
        <Input 
          type="number" 
          min="1"
          max="6"
          value={element.settings?.posts?.columns || 2} 
          onChange={(e) => updateElement(element.id, { 
            settings: { 
              ...element.settings, 
              posts: { ...element.settings?.posts, columns: parseInt(e.target.value) } 
            } 
          })}
        />
      </div>

      <div className="space-y-2">
        <Label>Posts Per Page</Label>
        <Input 
          type="number" 
          min="1"
          max="20"
          value={element.settings?.posts?.postsPerPage || 4} 
          onChange={(e) => updateElement(element.id, { 
            settings: { 
              ...element.settings, 
              posts: { ...element.settings?.posts, postsPerPage: parseInt(e.target.value) } 
            } 
          })}
        />
      </div>

      <div className="space-y-2">
        <Label>Display Options</Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Switch 
              checked={element.settings?.posts?.showFeaturedImage !== false} 
              onCheckedChange={(checked) => updateElement(element.id, { 
                settings: { 
                  ...element.settings, 
                  posts: { ...element.settings?.posts, showFeaturedImage: checked } 
                } 
              })}
            />
            <Label>Show Featured Image</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              checked={element.settings?.posts?.showExcerpt !== false} 
              onCheckedChange={(checked) => updateElement(element.id, { 
                settings: { 
                  ...element.settings, 
                  posts: { ...element.settings?.posts, showExcerpt: checked } 
                } 
              })}
            />
            <Label>Show Excerpt</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              checked={element.settings?.posts?.showAuthor !== false} 
              onCheckedChange={(checked) => updateElement(element.id, { 
                settings: { 
                  ...element.settings, 
                  posts: { ...element.settings?.posts, showAuthor: checked } 
                } 
              })}
            />
            <Label>Show Author</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              checked={element.settings?.posts?.showDate !== false} 
              onCheckedChange={(checked) => updateElement(element.id, { 
                settings: { 
                  ...element.settings, 
                  posts: { ...element.settings?.posts, showDate: checked } 
                } 
              })}
            />
            <Label>Show Date</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              checked={element.settings?.posts?.showCategory !== false} 
              onCheckedChange={(checked) => updateElement(element.id, { 
                settings: { 
                  ...element.settings, 
                  posts: { ...element.settings?.posts, showCategory: checked } 
                } 
              })}
            />
            <Label>Show Category</Label>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Order By</Label>
        <Select 
          value={element.settings?.posts?.orderBy || 'date'} 
          onValueChange={(value) => updateElement(element.id, { 
            settings: { 
              ...element.settings, 
              posts: { ...element.settings?.posts, orderBy: value } 
            } 
          })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="title">Title</SelectItem>
            <SelectItem value="author">Author</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )

  const renderAnimatedHeadlineOptions = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Before Text</Label>
        <Input 
          type="text" 
          value={element.settings?.animatedHeadline?.beforeText || ''} 
          onChange={(e) => updateElement(element.id, { 
            settings: { 
              ...element.settings, 
              animatedHeadline: { ...element.settings?.animatedHeadline, beforeText: e.target.value } 
            } 
          })}
          placeholder="We are "
        />
      </div>

      <div className="space-y-2">
        <Label>Animated Words (one per line)</Label>
        <textarea 
          value={element.settings?.animatedHeadline?.animatedText?.join('\n') || ''} 
          onChange={(e) => updateElement(element.id, { 
            settings: { 
              ...element.settings, 
              animatedHeadline: { 
                ...element.settings?.animatedHeadline, 
                animatedText: e.target.value.split('\n').filter(line => line.trim()) 
              } 
            } 
          })}
          placeholder="Creative&#10;Innovative&#10;Professional"
          className="w-full p-2 border rounded-md resize-none"
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label>After Text</Label>
        <Input 
          type="text" 
          value={element.settings?.animatedHeadline?.afterText || ''} 
          onChange={(e) => updateElement(element.id, { 
            settings: { 
              ...element.settings, 
              animatedHeadline: { ...element.settings?.animatedHeadline, afterText: e.target.value } 
            } 
          })}
          placeholder=" Designers"
        />
      </div>

      <div className="space-y-2">
        <Label>Animation Type</Label>
        <Select 
          value={element.settings?.animatedHeadline?.animationType || 'typing'} 
          onValueChange={(value) => updateElement(element.id, { 
            settings: { 
              ...element.settings, 
              animatedHeadline: { ...element.settings?.animatedHeadline, animationType: value } 
            } 
          })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="typing">Typing</SelectItem>
            <SelectItem value="fade">Fade</SelectItem>
            <SelectItem value="slide">Slide</SelectItem>
            <SelectItem value="rotate">Rotate</SelectItem>
            <SelectItem value="clip">Clip</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Animation Speed (ms)</Label>
        <Input 
          type="number" 
          min="500"
          max="5000"
          step="100"
          value={element.settings?.animatedHeadline?.speed || 2000} 
          onChange={(e) => updateElement(element.id, { 
            settings: { 
              ...element.settings, 
              animatedHeadline: { ...element.settings?.animatedHeadline, speed: parseInt(e.target.value) } 
            } 
          })}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch 
          checked={element.settings?.animatedHeadline?.loop !== false} 
          onCheckedChange={(checked) => updateElement(element.id, { 
            settings: { 
              ...element.settings, 
              animatedHeadline: { ...element.settings?.animatedHeadline, loop: checked } 
            } 
          })}
        />
        <Label>Loop Animation</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch 
          checked={element.settings?.animatedHeadline?.cursor !== false} 
          onCheckedChange={(checked) => updateElement(element.id, { 
            settings: { 
              ...element.settings, 
              animatedHeadline: { ...element.settings?.animatedHeadline, cursor: checked } 
            } 
          })}
        />
        <Label>Show Cursor</Label>
      </div>
    </div>
  )

  const renderProductOptions = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Product Content</Label>
        {element.type === 'product-title' && (
          <Input 
            type="text" 
            value={element.content || ''} 
            onChange={(e) => updateContent(e.target.value)}
            placeholder="Product Name"
          />
        )}
      </div>

      {(element.type === 'product-price' || element.type === 'product-rating') && (
        <div className="space-y-2">
          <Label>Display Options</Label>
          <div className="space-y-2">
            {element.type === 'product-price' && (
              <>
                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={element.settings?.product?.showPrice !== false} 
                    onCheckedChange={(checked) => updateElement(element.id, { 
                      settings: { 
                        ...element.settings, 
                        product: { ...element.settings?.product, showPrice: checked } 
                      } 
                    })}
                  />
                  <Label>Show Price</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={element.settings?.product?.showSalePrice || false} 
                    onCheckedChange={(checked) => updateElement(element.id, { 
                      settings: { 
                        ...element.settings, 
                        product: { ...element.settings?.product, showSalePrice: checked } 
                      } 
                    })}
                  />
                  <Label>Show Sale Price</Label>
                </div>
              </>
            )}
            
            {element.type === 'product-rating' && (
              <>
                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={element.settings?.product?.showRating !== false} 
                    onCheckedChange={(checked) => updateElement(element.id, { 
                      settings: { 
                        ...element.settings, 
                        product: { ...element.settings?.product, showRating: checked } 
                      } 
                    })}
                  />
                  <Label>Show Rating</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={element.settings?.product?.showReviewCount !== false} 
                    onCheckedChange={(checked) => updateElement(element.id, { 
                      settings: { 
                        ...element.settings, 
                        product: { ...element.settings?.product, showReviewCount: checked } 
                      } 
                    })}
                  />
                  <Label>Show Review Count</Label>
                </div>
              </>
            )}
            
            <div className="flex items-center space-x-2">
              <Switch 
                checked={element.settings?.product?.showSku || false} 
                onCheckedChange={(checked) => updateElement(element.id, { 
                  settings: { 
                    ...element.settings, 
                    product: { ...element.settings?.product, showSku: checked } 
                  } 
                })}
              />
              <Label>Show SKU</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                checked={element.settings?.product?.showStock || false} 
                onCheckedChange={(checked) => updateElement(element.id, { 
                  settings: { 
                    ...element.settings, 
                    product: { ...element.settings?.product, showStock: checked } 
                  } 
                })}
              />
              <Label>Show Stock Status</Label>
            </div>
          </div>
        </div>
      )}

      {element.type === 'product-price' && (
        <>
          <div className="space-y-2">
            <Label>Price Color</Label>
            <div className="flex items-center space-x-2">
              <Input 
                type="color" 
                value={element.settings?.product?.priceColor || '#16a34a'} 
                onChange={(e) => updateElement(element.id, { 
                  settings: { 
                    ...element.settings, 
                    product: { ...element.settings?.product, priceColor: e.target.value } 
                  } 
                })}
                className="w-12 h-8 p-1"
              />
              <Input 
                type="text" 
                value={element.settings?.product?.priceColor || '#16a34a'} 
                onChange={(e) => updateElement(element.id, { 
                  settings: { 
                    ...element.settings, 
                    product: { ...element.settings?.product, priceColor: e.target.value } 
                  } 
                })}
                className="flex-1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Sale Price Color</Label>
            <div className="flex items-center space-x-2">
              <Input 
                type="color" 
                value={element.settings?.product?.salePriceColor || '#dc2626'} 
                onChange={(e) => updateElement(element.id, { 
                  settings: { 
                    ...element.settings, 
                    product: { ...element.settings?.product, salePriceColor: e.target.value } 
                  } 
                })}
                className="w-12 h-8 p-1"
              />
              <Input 
                type="text" 
                value={element.settings?.product?.salePriceColor || '#dc2626'} 
                onChange={(e) => updateElement(element.id, { 
                  settings: { 
                    ...element.settings, 
                    product: { ...element.settings?.product, salePriceColor: e.target.value } 
                  } 
                })}
                className="flex-1"
              />
            </div>
          </div>
        </>
      )}
    </div>
  )

  const renderColumnOptions = () => {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Background Color</Label>
          <div className="flex items-center gap-2">
            <Input 
              type="color" 
              value={element.styles?.backgroundColor || '#ffffff'} 
              onChange={(e) => updateStyle('backgroundColor', e.target.value)}
              className="w-12 h-8 p-1"
            />
            <Input 
              type="text" 
              value={element.styles?.backgroundColor || '#ffffff'} 
              onChange={(e) => updateStyle('backgroundColor', e.target.value)}
              className="flex-1"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Width</Label>
          <div className="flex items-center gap-2">
            <Input 
              type="text" 
              value={element.styles?.width || '100%'} 
              onChange={(e) => updateStyle('width', e.target.value)}
              placeholder="e.g. 50%, 300px"
              className="flex-1"
            />
            <Select 
              value={element.styles?.width?.toString().includes('%') ? 'percent' : 'pixel'}
              onValueChange={(value) => {
                const numValue = parseFloat(element.styles?.width) || 100;
                if (value === 'percent') {
                  updateStyle('width', `${numValue}%`);
                } else {
                  updateStyle('width', `${numValue}px`);
                }
              }}
            >
              <SelectTrigger className="w-24">
                <SelectValue placeholder="Unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percent">%</SelectItem>
                <SelectItem value="pixel">px</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Padding</Label>
          <Input 
            type="text" 
            value={element.styles?.padding || '20px'} 
            onChange={(e) => updateStyle('padding', e.target.value)}
            placeholder="e.g. 20px or 10px 20px"
          />
        </div>

        <div className="space-y-2">
          <Label>Border Radius</Label>
          <Input 
            type="text" 
            value={element.styles?.borderRadius || '0px'} 
            onChange={(e) => updateStyle('borderRadius', e.target.value)}
            placeholder="e.g. 8px or 50%"
          />
        </div>

        <div className="space-y-2">
          <Label>Border</Label>
          <div className="grid grid-cols-3 gap-2">
            <Input 
              type="text" 
              value={element.styles?.borderWidth || '1px'} 
              onChange={(e) => updateStyle('borderWidth', e.target.value)}
              placeholder="Width"
            />
            <Select 
              value={element.styles?.borderStyle || 'solid'}
              onValueChange={(value) => updateStyle('borderStyle', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="solid">Solid</SelectItem>
                <SelectItem value="dashed">Dashed</SelectItem>
                <SelectItem value="dotted">Dotted</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-1">
              <Input 
                type="color" 
                value={element.styles?.borderColor || '#e2e8f0'} 
                onChange={(e) => updateStyle('borderColor', e.target.value)}
                className="w-8 h-8 p-1"
              />
              <Input 
                type="text" 
                value={element.styles?.borderColor || '#e2e8f0'} 
                onChange={(e) => updateStyle('borderColor', e.target.value)}
                className="flex-1"
                placeholder="Color"
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  const renderVideoOptions = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>YouTube Video URL</Label>
        <Input 
          type="text" 
          value={(element.settings?.videoUrl) || ''} 
          onChange={(e) => {
            const url = e.target.value;
            // Extract video ID if it's a YouTube URL
            let videoId = url;
            if (url.includes('youtube.com/watch?v=')) {
              const urlParams = new URLSearchParams(url.split('?')[1]);
              videoId = urlParams.get('v') || '';
            } else if (url.includes('youtu.be/')) {
              videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
            }
            
            updateElement(element.id, { 
              settings: { 
                ...element.settings, 
                videoUrl: url,
                videoId: videoId
              } 
            });
          }}
          placeholder="https://www.youtube.com/watch?v=VIDEO_ID"
        />
      </div>

      <div className="space-y-2">
        <Label>Video Title</Label>
        <Input 
          type="text" 
          value={(element.settings?.videoTitle) || ''} 
          onChange={(e) => updateElement(element.id, { 
            settings: { ...(element.settings || {}), videoTitle: e.target.value } 
          })}
          placeholder="Video title"
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>Width</Label>
          <span className="text-sm">{element.styles?.width || '100%'}</span>
        </div>
        <Input 
          type="text" 
          value={element.styles?.width || '100%'} 
          onChange={(e) => updateStyle('width', e.target.value)}
          placeholder="e.g. 100% or 560px"
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>Height</Label>
          <span className="text-sm">{element.styles?.height || '315px'}</span>
        </div>
        <Input 
          type="text" 
          value={element.styles?.height || '315px'} 
          onChange={(e) => updateStyle('height', e.target.value)}
          placeholder="e.g. 315px"
        />
      </div>

      <div className="space-y-2">
        <Label>Autoplay</Label>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="autoplay" 
            checked={element.settings?.autoplay || false}
            onCheckedChange={(checked: boolean | 'indeterminate') => updateElement(element.id, { 
              settings: { ...element.settings, autoplay: checked === true } 
            })}
          />
          <label htmlFor="autoplay" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Enable autoplay
          </label>
        </div>
      </div>

      {element.settings?.videoId && (
        <div className="mt-4 border rounded p-2">
          <p className="text-sm font-medium mb-2">Video Preview:</p>
          <div className="aspect-video">
            <iframe 
              width="100%" 
              height="100%" 
              src={`https://www.youtube.com/embed/${element.settings.videoId}${element.settings?.autoplay ? '?autoplay=1&mute=1' : ''}`}
              title={element.settings?.videoTitle || 'YouTube video'}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  )

  const renderElementOptions = () => {
    switch (element.type) {
      case 'heading':
        return renderHeadingOptions()
      case 'text':
        return renderTextOptions()
      case 'image':
        return renderImageOptions()
      case 'button':
        return renderButtonOptions()
      case 'form':
        return renderFormOptions()
      case 'lead-magnet-form':
        return renderLeadMagnetFormOptions()
      case 'newsletter-signup':
        return renderNewsletterSignupOptions()
      case 'multi-step-form':
        return renderMultiStepFormOptions()
      case 'slides':
        return renderSlidesOptions()
      case 'countdown':
        return renderCountdownOptions()
      case 'call-to-action':
        return renderCallToActionOptions()
      case 'share-buttons':
        return renderShareButtonsOptions()
      case 'blockquote':
        return renderBlockquoteOptions()
      case 'posts':
        return renderPostsOptions()
      case 'animated-headline':
        return renderAnimatedHeadlineOptions()
      case 'product-price':
      case 'product-images':
      case 'product-title':
      case 'product-rating':
        return renderProductOptions()
      case 'pricing-table':
        return renderPricingTableOptions()
      case 'testimonial-carousel':
        return renderTestimonialCarouselOptions()
      case 'column':
        return renderColumnOptions()
      case 'video':
        return renderVideoOptions()
      default:
        return <p className="text-sm text-gray-500">No properties available for this element type.</p>
    }
  }
  
  const handleDeleteElement = () => {
    if (confirm('Are you sure you want to delete this element?')) {
      deleteElement(element.id)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Element Properties</CardTitle>
            <CardDescription>
              Edit properties for {element.type} element
            </CardDescription>
          </div>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={handleDeleteElement}
            className="flex items-center gap-1"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="style">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="style">Style</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          <TabsContent value="style" className="pt-4">
            {renderElementOptions()}
          </TabsContent>
          <TabsContent value="advanced" className="pt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Element ID</Label>
                <Input value={element.id} disabled />
              </div>
              
              <div className="space-y-2">
                <Label>CSS Classes</Label>
                <Input 
                  type="text" 
                  value={(element.settings?.cssClasses) || ''} 
                  onChange={(e) => updateElement(element.id, { 
                    settings: { ...(element.settings || {}), cssClasses: e.target.value } 
                  })}
                  placeholder="e.g. my-custom-class another-class"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

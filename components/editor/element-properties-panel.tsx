"use client"

import React from 'react'
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
              value={[parseInt(element.styles?.fontSize) || 16]}
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
  
  const renderHeadingOptions = () => (
    <div className="space-y-4">
      {renderCommonStyleOptions(true)}
      
      {/* Line height */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>Line Height</Label>
          <span className="text-sm">{element.styles?.lineHeight || '1.2'}</span>
        </div>
        <Slider
          value={[parseFloat(element.styles?.lineHeight) || 1.2]}
          max={3}
          min={1}
          step={0.1}
          onValueChange={(value) => updateStyle('lineHeight', value[0].toString())}
        />
      </div>
    </div>
  )
  
  const renderTextOptions = () => (
    <div className="space-y-4">
      {renderCommonStyleOptions(true)}
      
      {/* Line height */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>Line Height</Label>
          <span className="text-sm">{element.styles?.lineHeight || '1.5'}</span>
        </div>
        <Slider
          value={[parseFloat(element.styles?.lineHeight) || 1.5]}
          max={3}
          min={1}
          step={0.1}
          onValueChange={(value) => updateStyle('lineHeight', value[0].toString())}
        />
      </div>
    </div>
  )
  
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
      
      <div className="space-y-2">
        <Label>Form Fields</Label>
        <div className="border rounded-md p-4 space-y-4">
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
                    <SelectItem value="textarea">Text Area</SelectItem>
                    <SelectItem value="checkbox">Checkbox</SelectItem>
                    <SelectItem value="select">Dropdown</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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

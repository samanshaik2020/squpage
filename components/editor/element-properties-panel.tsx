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
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Palette
} from 'lucide-react'

interface ElementPropertiesPanelProps {
  element: any
}

export function ElementPropertiesPanel({ element }: ElementPropertiesPanelProps) {
  const { updateElement } = useElementor()
  
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
                value={element.styles?.color || '#000000'} 
                onChange={(e) => updateStyle('color', e.target.value)}
                className="w-12 h-8 p-0"
              />
              <Input 
                type="text" 
                value={element.styles?.color || '#000000'} 
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
              defaultValue={[parseInt(element.styles?.fontSize) || 16]}
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
          value={element.styles?.margin || '0'} 
          onChange={(e) => updateStyle('margin', e.target.value)}
          placeholder="e.g. 10px or 10px 20px"
        />
      </div>
      
      <div className="space-y-2">
        <Label>Padding</Label>
        <Input 
          type="text" 
          value={element.styles?.padding || '0'} 
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
          defaultValue={[parseFloat(element.styles?.lineHeight) || 1.2]}
          max={3}
          min={1}
          step={0.1}
          onValueChange={(value) => updateStyle('lineHeight', value[0])}
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
          defaultValue={[parseFloat(element.styles?.lineHeight) || 1.5]}
          max={3}
          min={1}
          step={0.1}
          onValueChange={(value) => updateStyle('lineHeight', value[0])}
        />
      </div>
    </div>
  )
  
  const renderImageOptions = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Image URL</Label>
        <Input 
          type="text" 
          value={element.settings?.imageUrl || ''} 
          onChange={(e) => updateElement(element.id, { 
            settings: { ...element.settings, imageUrl: e.target.value } 
          })}
          placeholder="https://example.com/image.jpg"
        />
      </div>
      
      <div className="space-y-2">
        <Label>Alt Text</Label>
        <Input 
          type="text" 
          value={element.settings?.alt || ''} 
          onChange={(e) => updateElement(element.id, { 
            settings: { ...element.settings, alt: e.target.value } 
          })}
          placeholder="Image description"
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>Width</Label>
          <span className="text-sm">{element.styles?.width || 'auto'}</span>
        </div>
        <Input 
          type="text" 
          value={element.styles?.width || 'auto'} 
          onChange={(e) => updateStyle('width', e.target.value)}
          placeholder="e.g. 100% or 300px"
        />
      </div>
      
      <div className="space-y-2">
        <Label>Border Radius</Label>
        <Input 
          type="text" 
          value={element.styles?.borderRadius || '0'} 
          onChange={(e) => updateStyle('borderRadius', e.target.value)}
          placeholder="e.g. 8px or 50%"
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
          value={element.content || ''} 
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
            value={element.styles?.backgroundColor || '#4F46E5'} 
            onChange={(e) => updateStyle('backgroundColor', e.target.value)}
            className="w-12 h-8 p-0"
          />
          <Input 
            type="text" 
            value={element.styles?.backgroundColor || '#4F46E5'} 
            onChange={(e) => updateStyle('backgroundColor', e.target.value)}
            className="flex-1"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Border Radius</Label>
        <Input 
          type="text" 
          value={element.styles?.borderRadius || '4px'} 
          onChange={(e) => updateStyle('borderRadius', e.target.value)}
          placeholder="e.g. 4px or 50%"
        />
      </div>
      
      <div className="space-y-2">
        <Label>URL (optional)</Label>
        <Input 
          type="text" 
          value={element.settings?.url || ''} 
          onChange={(e) => updateElement(element.id, { 
            settings: { ...element.settings, url: e.target.value } 
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
          value={element.settings?.submitButtonText || 'Submit'} 
          onChange={(e) => updateElement(element.id, { 
            settings: { ...element.settings, submitButtonText: e.target.value } 
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
          value={element.settings?.price || '$0'} 
          onChange={(e) => updateElement(element.id, { 
            settings: { ...element.settings, price: e.target.value } 
          })}
          placeholder="$9.99"
        />
      </div>
      
      <div className="space-y-2">
        <Label>Price Period</Label>
        <Input 
          type="text" 
          value={element.settings?.period || '/month'} 
          onChange={(e) => updateElement(element.id, { 
            settings: { ...element.settings, period: e.target.value } 
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
  
  const renderTestimonialCarouselOptions = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Testimonials</Label>
        <div className="border rounded-md p-4 space-y-4">
          {element.testimonials?.map((testimonial: any, index: number) => (
            <div key={testimonial.id} className="space-y-2 border-b pb-2">
              <div className="flex justify-between">
                <span className="font-medium">{testimonial.name}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    const updatedTestimonials = [...element.testimonials]
                    updatedTestimonials.splice(index, 1)
                    updateElement(element.id, { testimonials: updatedTestimonials })
                  }}
                >
                  Remove
                </Button>
              </div>
              
              <div className="space-y-2">
                <Label>Name</Label>
                <Input 
                  type="text" 
                  value={testimonial.name || ''} 
                  onChange={(e) => {
                    const updatedTestimonials = [...element.testimonials]
                    updatedTestimonials[index] = { ...testimonial, name: e.target.value }
                    updateElement(element.id, { testimonials: updatedTestimonials })
                  }}
                  placeholder="John Doe"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Position</Label>
                <Input 
                  type="text" 
                  value={testimonial.position || ''} 
                  onChange={(e) => {
                    const updatedTestimonials = [...element.testimonials]
                    updatedTestimonials[index] = { ...testimonial, position: e.target.value }
                    updateElement(element.id, { testimonials: updatedTestimonials })
                  }}
                  placeholder="CEO"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Company</Label>
                <Input 
                  type="text" 
                  value={testimonial.company || ''} 
                  onChange={(e) => {
                    const updatedTestimonials = [...element.testimonials]
                    updatedTestimonials[index] = { ...testimonial, company: e.target.value }
                    updateElement(element.id, { testimonials: updatedTestimonials })
                  }}
                  placeholder="Company Inc."
                />
              </div>
              
              <div className="space-y-2">
                <Label>Content</Label>
                <Input 
                  type="text" 
                  value={testimonial.content || ''} 
                  onChange={(e) => {
                    const updatedTestimonials = [...element.testimonials]
                    updatedTestimonials[index] = { ...testimonial, content: e.target.value }
                    updateElement(element.id, { testimonials: updatedTestimonials })
                  }}
                  placeholder="Testimonial content"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Rating</Label>
                  <span className="text-sm">{testimonial.rating || 5}/5</span>
                </div>
                <Slider
                  defaultValue={[testimonial.rating || 5]}
                  max={5}
                  min={1}
                  step={1}
                  onValueChange={(value) => {
                    const updatedTestimonials = [...element.testimonials]
                    updatedTestimonials[index] = { ...testimonial, rating: value[0] }
                    updateElement(element.id, { testimonials: updatedTestimonials })
                  }}
                />
              </div>
            </div>
          ))}
          
          <Button 
            variant="outline" 
            onClick={() => {
              const newTestimonial = {
                id: `testimonial_${Date.now()}`,
                name: 'New Testimonial',
                position: 'Position',
                company: 'Company',
                content: 'Testimonial content goes here.',
                rating: 5
              }
              updateElement(element.id, { 
                testimonials: [...(element.testimonials || []), newTestimonial] 
              })
            }}
          >
            Add Testimonial
          </Button>
        </div>
      </div>
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
      default:
        return <p className="text-sm text-gray-500">No properties available for this element type.</p>
    }
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Element Properties</CardTitle>
        <CardDescription>
          Edit properties for {element.type} element
        </CardDescription>
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
                  value={element.settings?.cssClasses || ''} 
                  onChange={(e) => updateElement(element.id, { 
                    settings: { ...element.settings, cssClasses: e.target.value } 
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

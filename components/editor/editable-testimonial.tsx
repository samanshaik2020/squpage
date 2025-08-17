"use client"

import React, { useState } from 'react'
import { Star, StarHalf } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

export interface TestimonialItem {
  id: string
  name: string
  position: string
  company: string
  content: string
  rating: number
  image?: string
}

export interface TestimonialElement {
  id: string
  type: string
  testimonials: TestimonialItem[]
  settings?: {
    showDots?: boolean
    showArrows?: boolean
  }
}

interface EditableTestimonialProps {
  element: TestimonialElement
  isSelected: boolean
  updateElement: (id: string, updates: any) => void
  isPreview?: boolean
}

export function EditableTestimonial({ 
  element, 
  isSelected,
  updateElement,
  isPreview = false
}: EditableTestimonialProps) {
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  
  if (!element.testimonials || !Array.isArray(element.testimonials) || element.testimonials.length === 0) {
    return <div>Invalid testimonial data</div>
  }
  
  // Ensure all testimonial fields have default values
  const normalizedTestimonials = element.testimonials.map(testimonial => ({
    id: testimonial.id || `testimonial_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: testimonial.name || '',
    position: testimonial.position || '',
    company: testimonial.company || '',
    content: testimonial.content || '',
    rating: testimonial.rating || 5,
    image: testimonial.image || ''
  }))
  
  const testimonials = normalizedTestimonials
  const currentTestimonial = testimonials[activeTestimonial]
  
  const handleRatingChange = (newRating: number) => {
    const updatedTestimonials = [...testimonials]
    updatedTestimonials[activeTestimonial] = {
      ...currentTestimonial,
      rating: newRating
    }
    
    updateElement(element.id, {
      testimonials: updatedTestimonials
    })
  }
  
  const handleInputChange = (field: string, value: string) => {
    const updatedTestimonials = [...testimonials]
    updatedTestimonials[activeTestimonial] = {
      ...currentTestimonial,
      [field]: value
    }
    
    updateElement(element.id, {
      testimonials: updatedTestimonials
    })
  }
  
  const addNewTestimonial = () => {
    const newId = `testimonial_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const newTestimonial = {
      id: newId,
      name: 'New Testimonial',
      position: 'Position',
      company: 'Company',
      content: 'Add your testimonial content here.',
      rating: 5
    }
    
    const updatedTestimonials = [...testimonials, newTestimonial]
    updateElement(element.id, {
      testimonials: updatedTestimonials
    })
    
    // Set the new testimonial as active
    setActiveTestimonial(updatedTestimonials.length - 1)
  }
  
  const deleteTestimonial = () => {
    if (testimonials.length <= 1) {
      return // Don't delete the last testimonial
    }
    
    const updatedTestimonials = testimonials.filter((_: TestimonialItem, index: number) => index !== activeTestimonial)
    updateElement(element.id, {
      testimonials: updatedTestimonials
    })
    
    // Adjust active testimonial index if needed
    if (activeTestimonial >= updatedTestimonials.length) {
      setActiveTestimonial(updatedTestimonials.length - 1)
    }
  }
  
  // Display the testimonial in view mode if not selected or in preview mode
  if (!isSelected || isPreview) {
    return (
      <div className="testimonial-card p-6 bg-white rounded-lg shadow-md">
        <div className="flex mb-2">
          {[1, 2, 3, 4, 5].map((star: number) => (
            <Star 
              key={star}
              className={`w-5 h-5 ${star <= currentTestimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
            />
          ))}
        </div>
        <blockquote className="text-gray-700 italic mb-4">"{currentTestimonial.content}"</blockquote>
        <div className="font-semibold">{currentTestimonial.name}</div>
        <div className="text-sm text-gray-500">{currentTestimonial.position}, {currentTestimonial.company}</div>
        
        {testimonials.length > 1 && (
          <div className="flex justify-center mt-4">
            {testimonials.map((_: TestimonialItem, index: number) => (
              <div 
                key={index}
                className={`w-2 h-2 mx-1 rounded-full ${index === activeTestimonial ? 'bg-blue-500' : 'bg-gray-300'}`}
              />
            ))}
          </div>
        )}
      </div>
    )
  }
  
  // Display the editable version when selected
  return (
    <div className="testimonial-editor p-4 bg-white rounded-lg border-2 border-blue-500">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium">Edit Testimonial {activeTestimonial + 1} of {testimonials.length}</h3>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={addNewTestimonial}
            >
              Add New
            </Button>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={deleteTestimonial}
              disabled={testimonials.length <= 1}
            >
              Delete
            </Button>
          </div>
        </div>
        
        {testimonials.length > 1 && (
          <div className="flex justify-center mb-4">
            {testimonials.map((_: TestimonialItem, index: number) => (
              <Button
                key={index}
                variant={index === activeTestimonial ? "default" : "outline"}
                size="sm"
                className="w-8 h-8 p-0 mx-1"
                onClick={() => setActiveTestimonial(index)}
              >
                {index + 1}
              </Button>
            ))}
          </div>
        )}
      </div>
      
      <div className="space-y-4">
        {/* Rating Stars */}
        <div>
          <Label>Rating</Label>
          <div className="flex mt-1">
            {[1, 2, 3, 4, 5].map((star: number) => (
              <Button
                key={star}
                variant="ghost"
                size="sm"
                className="p-0 w-8 h-8"
                onClick={() => handleRatingChange(star)}
              >
                <Star 
                  className={`w-6 h-6 ${star <= currentTestimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                />
              </Button>
            ))}
          </div>
        </div>
        
        {/* Content */}
        <div>
          <Label htmlFor="testimonial-content">Testimonial Content</Label>
          <Textarea
            id="testimonial-content"
            value={currentTestimonial.content}
            onChange={(e) => handleInputChange('content', e.target.value)}
            className="mt-1"
            rows={3}
          />
        </div>
        
        {/* Name */}
        <div>
          <Label htmlFor="testimonial-name">Name</Label>
          <Input
            id="testimonial-name"
            value={currentTestimonial.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="mt-1"
          />
        </div>
        
        {/* Position */}
        <div>
          <Label htmlFor="testimonial-position">Position</Label>
          <Input
            id="testimonial-position"
            value={currentTestimonial.position}
            onChange={(e) => handleInputChange('position', e.target.value)}
            className="mt-1"
          />
        </div>
        
        {/* Company */}
        <div>
          <Label htmlFor="testimonial-company">Company</Label>
          <Input
            id="testimonial-company"
            value={currentTestimonial.company}
            onChange={(e) => handleInputChange('company', e.target.value)}
            className="mt-1"
          />
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, Phone, User, MessageSquare, Building, Send, CheckCircle, AlertCircle } from 'lucide-react'

interface ContactFormProps {
  pageId: string
  title?: string
  description?: string
  fields?: string[]
  source?: string
  className?: string
  onSubmitSuccess?: (data: any) => void
  onSubmitError?: (error: string) => void
}

interface FormData {
  name: string
  email: string
  phone: string
  company: string
  subject: string
  message: string
  [key: string]: string
}

export function ContactForm({
  pageId,
  title = "Get in Touch",
  description = "Send us a message and we'll get back to you as soon as possible.",
  fields = ['name', 'email', 'phone', 'company', 'subject', 'message'],
  source = "Contact Form",
  className = "",
  onSubmitSuccess,
  onSubmitError
}: ContactFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: ''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
      // Validate required fields
      if (!formData.name.trim() && !formData.email.trim()) {
        throw new Error('Please provide at least your name or email address')
      }

      if (formData.email && !isValidEmail(formData.email)) {
        throw new Error('Please provide a valid email address')
      }

      // Filter form data to only include fields that are actually displayed
      const filteredData = Object.fromEntries(
        Object.entries(formData).filter(([key, value]) => 
          fields.includes(key) && value.trim() !== ''
        )
      )

      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pageId,
          formData: filteredData,
          source
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit form')
      }

      setSubmitStatus('success')
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        subject: '',
        message: ''
      })

      // Call success callback
      onSubmitSuccess?.(result)

    } catch (error) {
      console.error('Form submission error:', error)
      const errorMsg = error instanceof Error ? error.message : 'Failed to submit form'
      setErrorMessage(errorMsg)
      setSubmitStatus('error')
      onSubmitError?.(errorMsg)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const getFieldIcon = (fieldName: string) => {
    switch (fieldName) {
      case 'name': return <User className="w-4 h-4" />
      case 'email': return <Mail className="w-4 h-4" />
      case 'phone': return <Phone className="w-4 h-4" />
      case 'company': return <Building className="w-4 h-4" />
      case 'subject': return <MessageSquare className="w-4 h-4" />
      case 'message': return <MessageSquare className="w-4 h-4" />
      default: return null
    }
  }

  const getFieldLabel = (fieldName: string) => {
    switch (fieldName) {
      case 'name': return 'Full Name'
      case 'email': return 'Email Address'
      case 'phone': return 'Phone Number'
      case 'company': return 'Company'
      case 'subject': return 'Subject'
      case 'message': return 'Message'
      default: return fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
    }
  }

  const getFieldPlaceholder = (fieldName: string) => {
    switch (fieldName) {
      case 'name': return 'Enter your full name'
      case 'email': return 'Enter your email address'
      case 'phone': return 'Enter your phone number'
      case 'company': return 'Enter your company name'
      case 'subject': return 'What is this regarding?'
      case 'message': return 'Tell us more about your inquiry...'
      default: return `Enter ${fieldName}`
    }
  }

  if (submitStatus === 'success') {
    return (
      <Card className={`bg-white border border-gray-200 shadow-sm ${className}`}>
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Thank You!</h3>
          <p className="text-gray-600 mb-4">
            Your message has been sent successfully. We'll get back to you as soon as possible.
          </p>
          <Button 
            variant="outline" 
            onClick={() => setSubmitStatus('idle')}
            className="mt-2"
          >
            Send Another Message
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`bg-white border border-gray-200 shadow-sm ${className}`}>
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900">{title}</CardTitle>
        {description && (
          <p className="text-gray-600">{description}</p>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((fieldName) => (
            <div key={fieldName}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <div className="flex items-center space-x-2">
                  {getFieldIcon(fieldName)}
                  <span>{getFieldLabel(fieldName)}</span>
                  {(fieldName === 'name' || fieldName === 'email') && (
                    <span className="text-red-500">*</span>
                  )}
                </div>
              </label>
              
              {fieldName === 'message' ? (
                <textarea
                  name={fieldName}
                  value={formData[fieldName]}
                  onChange={handleInputChange}
                  placeholder={getFieldPlaceholder(fieldName)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              ) : (
                <input
                  type={fieldName === 'email' ? 'email' : fieldName === 'phone' ? 'tel' : 'text'}
                  name={fieldName}
                  value={formData[fieldName]}
                  onChange={handleInputChange}
                  placeholder={getFieldPlaceholder(fieldName)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              )}
            </div>
          ))}

          {submitStatus === 'error' && (
            <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-md">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span className="text-sm text-red-700">{errorMessage}</span>
            </div>
          )}

          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
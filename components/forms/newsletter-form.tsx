"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Mail, CheckCircle, AlertCircle } from 'lucide-react'

interface NewsletterFormProps {
  pageId: string
  title?: string
  description?: string
  placeholder?: string
  buttonText?: string
  source?: string
  className?: string
  onSubmitSuccess?: (data: any) => void
  onSubmitError?: (error: string) => void
}

export function NewsletterForm({
  pageId,
  title = "Stay Updated",
  description = "Get the latest news and updates delivered to your inbox.",
  placeholder = "Enter your email address",
  buttonText = "Subscribe",
  source = "Newsletter Signup",
  className = "",
  onSubmitSuccess,
  onSubmitError
}: NewsletterFormProps) {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
      // Validate email
      if (!email.trim()) {
        throw new Error('Please enter your email address')
      }

      if (!isValidEmail(email)) {
        throw new Error('Please enter a valid email address')
      }

      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pageId,
          formData: {
            email: email.trim().toLowerCase(),
            source: 'Newsletter'
          },
          source
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to subscribe')
      }

      setSubmitStatus('success')
      setEmail('')
      onSubmitSuccess?.(result)

    } catch (error) {
      console.error('Newsletter subscription error:', error)
      const errorMsg = error instanceof Error ? error.message : 'Failed to subscribe'
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

  if (submitStatus === 'success') {
    return (
      <div className={`bg-green-50 border border-green-200 rounded-lg p-6 text-center ${className}`}>
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <CheckCircle className="w-6 h-6 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-green-900 mb-1">Successfully Subscribed!</h3>
        <p className="text-green-700 text-sm">
          Thank you for subscribing. You'll receive our latest updates in your inbox.
        </p>
      </div>
    )
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-6 ${className}`}>
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={placeholder}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              disabled={isSubmitting}
            />
          </div>
          <Button 
            type="submit" 
            disabled={isSubmitting || !email.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            ) : (
              buttonText
            )}
          </Button>
        </div>

        {submitStatus === 'error' && (
          <div className="flex items-center space-x-2 p-2 bg-red-50 border border-red-200 rounded-md">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span className="text-sm text-red-700">{errorMessage}</span>
          </div>
        )}
      </form>
    </div>
  )
}
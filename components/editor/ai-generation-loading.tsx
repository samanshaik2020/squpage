"use client"

import React from 'react'
import { Sparkles, Zap, Cpu, Wand2 } from 'lucide-react'

interface AIGenerationLoadingProps {
  templateId: string
}

export function AIGenerationLoading({ templateId }: AIGenerationLoadingProps) {
  const getLoadingConfig = () => {
    switch (templateId) {
      case "ai-generated-blog-post":
        return {
          title: "Crafting Your Blog Post",
          steps: [
            "Analyzing your topic...",
            "Researching relevant content...",
            "Writing engaging introduction...",
            "Creating main content sections...",
            "Adding compelling conclusion...",
            "Optimizing for SEO..."
          ]
        }
      case "product-landing-page":
        return {
          title: "Building Your Landing Page",
          steps: [
            "Understanding your product...",
            "Creating compelling headlines...",
            "Writing product descriptions...",
            "Generating feature highlights...",
            "Crafting testimonials...",
            "Designing call-to-actions..."
          ]
        }
      case "ai-portfolio":
        return {
          title: "Creating Your Portfolio",
          steps: [
            "Analyzing your skills...",
            "Writing professional bio...",
            "Generating project descriptions...",
            "Creating experience timeline...",
            "Adding skill highlights...",
            "Finalizing contact section..."
          ]
        }
      case "ai-blog-page":
        return {
          title: "Generating Your Blog Website",
          steps: [
            "Setting up blog structure...",
            "Creating featured posts...",
            "Generating blog categories...",
            "Writing post excerpts...",
            "Adding author information...",
            "Optimizing layout..."
          ]
        }
      case "ai-dental-health-landing":
        return {
          title: "Creating Health Product Page",
          steps: [
            "Researching health benefits...",
            "Writing product descriptions...",
            "Creating testimonials...",
            "Adding health facts...",
            "Generating FAQ section...",
            "Optimizing for conversions..."
          ]
        }
      default:
        return {
          title: "Generating AI Content",
          steps: [
            "Processing your input...",
            "Analyzing requirements...",
            "Creating content structure...",
            "Writing engaging copy...",
            "Optimizing layout...",
            "Finalizing design..."
          ]
        }
    }
  }

  const config = getLoadingConfig()
  const [currentStep, setCurrentStep] = React.useState(0)

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % config.steps.length)
    }, 2000)

    return () => clearInterval(interval)
  }, [config.steps.length])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Main Loading Animation */}
        <div className="text-center mb-8">
          <div className="relative mb-6">
            {/* Animated Background Circle */}
            <div className="w-24 h-24 mx-auto relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-pulse"></div>
              <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-purple-500 animate-bounce" />
              </div>
            </div>
            
            {/* Floating Icons */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4">
              <Zap className="w-4 h-4 text-yellow-500 animate-ping" />
            </div>
            <div className="absolute top-4 right-4">
              <Cpu className="w-4 h-4 text-blue-500 animate-pulse" />
            </div>
            <div className="absolute top-4 left-4">
              <Wand2 className="w-4 h-4 text-purple-500 animate-bounce" style={{ animationDelay: '0.5s' }} />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">{config.title}</h2>
          <p className="text-gray-600 mb-8">
            Our AI is working its magic to create your perfect template...
          </p>
        </div>

        {/* Progress Steps */}
        <div className="space-y-3">
          {config.steps.map((step, index) => (
            <div
              key={index}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-500 ${
                index === currentStep
                  ? 'bg-white shadow-md border-l-4 border-purple-500'
                  : index < currentStep
                  ? 'bg-green-50 border-l-4 border-green-500'
                  : 'bg-gray-50 border-l-4 border-gray-200'
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                index === currentStep
                  ? 'bg-purple-500 text-white'
                  : index < currentStep
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-300 text-gray-500'
              }`}>
                {index < currentStep ? (
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : index === currentStep ? (
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                ) : (
                  <span className="text-xs font-medium">{index + 1}</span>
                )}
              </div>
              <span className={`text-sm ${
                index === currentStep
                  ? 'text-gray-900 font-medium'
                  : index < currentStep
                  ? 'text-green-700'
                  : 'text-gray-500'
              }`}>
                {step}
              </span>
              {index === currentStep && (
                <div className="ml-auto">
                  <div className="flex space-x-1">
                    <div className="w-1 h-1 bg-purple-500 rounded-full animate-bounce" />
                    <div className="w-1 h-1 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-1 h-1 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>Progress</span>
            <span>{Math.round(((currentStep + 1) / config.steps.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((currentStep + 1) / config.steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Fun Fact */}
        <div className="mt-8 p-4 bg-white/70 backdrop-blur-sm rounded-lg border border-white/20">
          <p className="text-xs text-gray-600 text-center">
            ✨ <strong>Did you know?</strong> Our AI processes thousands of design patterns and content structures to create the perfect template for your needs.
          </p>
        </div>
      </div>
    </div>
  )
}
"use client"

import React, { useState } from 'react'
import { 
  FileText, 
  MessageSquare, 
  Users, 
  TrendingUp, 
  Mail, 
  Download,
  CheckCircle,
  ArrowRight,
  Star,
  Shield
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface MarketingLeadGenerationProps {
  isPremium?: boolean
}

export function MarketingLeadGeneration({ isPremium = false }: MarketingLeadGenerationProps) {
  const [activeDemo, setActiveDemo] = useState<string>('lead-magnet')

  const demos = [
    {
      id: 'lead-magnet',
      title: 'Lead Magnet Form',
      description: 'Capture leads with valuable downloadable content',
      icon: Download,
      component: <LeadMagnetDemo />
    },
    {
      id: 'newsletter',
      title: 'Newsletter Signup',
      description: 'Build your email list with engaging newsletter forms',
      icon: Mail,
      component: <NewsletterDemo />
    },
    {
      id: 'multi-step',
      title: 'Multi-Step Form',
      description: 'Increase conversions with progressive form completion',
      icon: ArrowRight,
      component: <MultiStepDemo />
    },
    {
      id: 'slides',
      title: 'Slides & Carousels',
      description: 'Beautiful full-width sliders with content and CTAs',
      icon: ArrowRight,
      component: <SlidesDemo />
    },
    {
      id: 'countdown',
      title: 'Countdown Timers',
      description: 'Create urgency with countdown timers for sales and events',
      icon: TrendingUp,
      component: <CountdownDemo />
    },
    {
      id: 'analytics',
      title: 'Analytics & Tracking',
      description: 'Track form performance and conversion rates',
      icon: TrendingUp,
      component: <AnalyticsDemo />
    }
  ]

  if (!isPremium) {
    return (
      <div className="p-8 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Marketing & Lead Generation</h3>
          <p className="text-gray-600 mb-6">
            Unlock powerful lead generation tools and marketing widgets with Elementor Pro.
          </p>
          <Button className="bg-purple-600 hover:bg-purple-700">
            Upgrade to Pro
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Marketing & Lead Generation</h2>
        <p className="text-gray-600">
          Convert visitors into customers with powerful marketing widgets and lead capture forms.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {demos.map((demo) => (
          <Card 
            key={demo.id}
            className={`cursor-pointer transition-all ${
              activeDemo === demo.id ? 'ring-2 ring-purple-500 bg-purple-50' : 'hover:shadow-md'
            }`}
            onClick={() => setActiveDemo(demo.id)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-2">
                <demo.icon className="w-5 h-5 text-purple-600" />
                <CardTitle className="text-sm">{demo.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-xs">{demo.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-white rounded-lg border p-6">
        {demos.find(demo => demo.id === activeDemo)?.component}
      </div>
    </div>
  )
}

function LeadMagnetDemo() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold mb-2">Lead Magnet Form</h3>
        <p className="text-gray-600">
          Capture high-quality leads by offering valuable downloadable content in exchange for contact information.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Demo Form */}
        <div className="p-6 border-2 border-purple-200 rounded-lg bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="text-center mb-4">
            <h4 className="text-xl font-bold text-gray-800 mb-2">
              Get Your Free Marketing Guide
            </h4>
            <p className="text-gray-600 text-sm">
              Download our comprehensive 50-page guide and boost your marketing results by 300%!
            </p>
          </div>
          <div className="space-y-3">
            <Input placeholder="Your Name" />
            <Input type="email" placeholder="Your Email Address" />
            <Button className="w-full bg-purple-600 hover:bg-purple-700">
              Download Now - It's Free!
            </Button>
          </div>
          <div className="flex items-center justify-center mt-3 text-xs text-gray-500">
            <Shield className="w-3 h-3 mr-1" />
            We respect your privacy. Unsubscribe at any time.
          </div>
        </div>

        {/* Features */}
        <div className="space-y-4">
          <h4 className="font-semibold">Key Features:</h4>
          <div className="space-y-3">
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium">Email Integration</p>
                <p className="text-sm text-gray-600">Connect with Mailchimp, HubSpot, Salesforce, and more</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium">Automatic File Delivery</p>
                <p className="text-sm text-gray-600">Instantly send download links after form submission</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium">Conversion Tracking</p>
                <p className="text-sm text-gray-600">Track downloads and measure ROI with Google Analytics</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium">Anti-Spam Protection</p>
                <p className="text-sm text-gray-600">Built-in reCAPTCHA and honeypot protection</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function NewsletterDemo() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold mb-2">Newsletter Signup</h3>
        <p className="text-gray-600">
          Build your email list with beautiful, conversion-optimized newsletter signup forms.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Style 1: Inline */}
        <div className="p-4 border rounded-lg bg-blue-50">
          <div className="text-center mb-3">
            <h4 className="font-semibold text-gray-800">Stay Updated</h4>
            <p className="text-sm text-gray-600">Get weekly tips and insights</p>
          </div>
          <div className="flex gap-2">
            <Input type="email" placeholder="Enter email" className="flex-1" />
            <Button size="sm" className="bg-blue-600">Subscribe</Button>
          </div>
        </div>

        {/* Style 2: Stacked */}
        <div className="p-4 border rounded-lg bg-green-50">
          <div className="text-center mb-3">
            <Mail className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h4 className="font-semibold text-gray-800">Join 10,000+ Subscribers</h4>
          </div>
          <div className="space-y-2">
            <Input type="email" placeholder="Your email address" />
            <Button className="w-full bg-green-600">Get Weekly Updates</Button>
          </div>
        </div>

        {/* Style 3: Minimal */}
        <div className="p-4 border rounded-lg">
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-800">Newsletter</h4>
            <Input type="email" placeholder="Email address" />
            <Button variant="outline" className="w-full">Subscribe</Button>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold mb-2">Newsletter Features:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Double opt-in support</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Custom success messages</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Email provider integration</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Responsive design</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function MultiStepDemo() {
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 3

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold mb-2">Multi-Step Form</h3>
        <p className="text-gray-600">
          Increase form completion rates by breaking long forms into manageable steps.
        </p>
      </div>

      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Step {currentStep} of {totalSteps}</span>
            <span className="text-sm text-gray-500">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="p-6 border rounded-lg bg-white">
          {currentStep === 1 && (
            <div className="space-y-4">
              <h4 className="font-semibold">Tell us about yourself</h4>
              <Input placeholder="Full Name" />
              <Input type="email" placeholder="Email Address" />
              <Input placeholder="Company Name" />
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <h4 className="font-semibold">What's your main goal?</h4>
              <div className="space-y-2">
                {['Increase Sales', 'Generate Leads', 'Build Brand Awareness', 'Improve Customer Service'].map((goal) => (
                  <label key={goal} className="flex items-center space-x-2 p-2 border rounded cursor-pointer hover:bg-gray-50">
                    <input type="radio" name="goal" />
                    <span>{goal}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4 text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
              <h4 className="font-semibold">Almost Done!</h4>
              <p className="text-sm text-gray-600">
                We'll send you a personalized strategy guide based on your answers.
              </p>
              <Input placeholder="Phone Number (Optional)" />
            </div>
          )}

          <div className="flex justify-between mt-6">
            <Button 
              variant="outline" 
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            <Button 
              onClick={() => setCurrentStep(Math.min(totalSteps, currentStep + 1))}
              disabled={currentStep === totalSteps}
              className="bg-green-600"
            >
              {currentStep === totalSteps ? 'Submit' : 'Next Step'}
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold mb-2">Multi-Step Benefits:</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <div className="text-center">
            <TrendingUp className="w-8 h-8 text-blue-500 mx-auto mb-1" />
            <p className="font-medium">Higher Completion</p>
            <p className="text-gray-600">Up to 300% better completion rates</p>
          </div>
          <div className="text-center">
            <Users className="w-8 h-8 text-green-500 mx-auto mb-1" />
            <p className="font-medium">Better UX</p>
            <p className="text-gray-600">Less overwhelming for users</p>
          </div>
          <div className="text-center">
            <Star className="w-8 h-8 text-yellow-500 mx-auto mb-1" />
            <p className="font-medium">Quality Leads</p>
            <p className="text-gray-600">More engaged prospects</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function SlidesDemo() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const slides = [
    {
      title: "Transform Your Business",
      subtitle: "Innovative Solutions for Modern Challenges",
      content: "Discover how our cutting-edge platform can revolutionize your workflow and boost productivity by 300%.",
      buttonText: "Get Started Today",
      background: "bg-gradient-to-r from-blue-600 to-purple-600"
    },
    {
      title: "Trusted by 10,000+ Companies",
      subtitle: "Join the Success Stories",
      content: "See why industry leaders choose our platform for their digital transformation journey.",
      buttonText: "View Case Studies",
      background: "bg-gradient-to-r from-green-600 to-blue-600"
    },
    {
      title: "Ready to Scale?",
      subtitle: "Start Your Growth Journey",
      content: "Take the first step towards unlimited growth with our comprehensive business solutions.",
      buttonText: "Contact Sales",
      background: "bg-gradient-to-r from-purple-600 to-pink-600"
    }
  ]

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold mb-2">Slides & Carousels</h3>
        <p className="text-gray-600">
          Create beautiful, full-width sliders with compelling content and strong calls to action.
        </p>
      </div>

      <div className="relative">
        <div className={`relative h-80 rounded-lg overflow-hidden ${slides[currentSlide].background}`}>
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
          <div className="relative z-10 h-full flex items-center justify-center text-white text-center px-8">
            <div>
              <h4 className="text-3xl font-bold mb-3">{slides[currentSlide].title}</h4>
              <p className="text-xl mb-4 opacity-90">{slides[currentSlide].subtitle}</p>
              <p className="mb-6 opacity-80 max-w-2xl">{slides[currentSlide].content}</p>
              <Button className="bg-white text-gray-800 hover:bg-gray-100">
                {slides[currentSlide].buttonText}
              </Button>
            </div>
          </div>
          
          {/* Navigation */}
          <button 
            onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full"
          >
            <ArrowRight className="w-5 h-5 rotate-180" />
          </button>
          <button 
            onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          
          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full ${index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold mb-2">Slider Features:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Autoplay with customizable speed</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Touch/swipe navigation</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Fade and slide transitions</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Background images and videos</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Custom call-to-action buttons</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Responsive design</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function CountdownDemo() {
  const [timeLeft, setTimeLeft] = useState({
    days: 5,
    hours: 14,
    minutes: 32,
    seconds: 18
  })

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 }
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 }
        }
        return prev
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold mb-2">Countdown Timers</h3>
        <p className="text-gray-600">
          Create urgency and drive immediate action with customizable countdown timers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Default Style */}
        <div className="p-6 border-2 border-red-200 rounded-lg bg-gradient-to-br from-red-50 to-orange-50">
          <div className="text-center mb-4">
            <h4 className="text-xl font-bold text-gray-800 mb-2">Flash Sale Ends Soon!</h4>
            <p className="text-gray-600 text-sm">Don't miss out on 50% off everything</p>
          </div>
          
          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className="text-center">
              <div className="bg-red-600 text-white text-xl font-bold py-3 px-2 rounded-lg">
                {String(timeLeft.days).padStart(2, '0')}
              </div>
              <div className="text-xs text-gray-600 mt-1">Days</div>
            </div>
            <div className="text-center">
              <div className="bg-red-600 text-white text-xl font-bold py-3 px-2 rounded-lg">
                {String(timeLeft.hours).padStart(2, '0')}
              </div>
              <div className="text-xs text-gray-600 mt-1">Hours</div>
            </div>
            <div className="text-center">
              <div className="bg-red-600 text-white text-xl font-bold py-3 px-2 rounded-lg">
                {String(timeLeft.minutes).padStart(2, '0')}
              </div>
              <div className="text-xs text-gray-600 mt-1">Minutes</div>
            </div>
            <div className="text-center">
              <div className="bg-red-600 text-white text-xl font-bold py-3 px-2 rounded-lg">
                {String(timeLeft.seconds).padStart(2, '0')}
              </div>
              <div className="text-xs text-gray-600 mt-1">Seconds</div>
            </div>
          </div>
          
          <Button className="w-full bg-red-600 hover:bg-red-700">
            Claim Your Discount Now!
          </Button>
        </div>

        {/* Circle Style */}
        <div className="p-6 border rounded-lg bg-white">
          <div className="text-center mb-4">
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Webinar Starts In:</h4>
          </div>
          
          <div className="grid grid-cols-4 gap-4 mb-4">
            {[
              { value: timeLeft.days, label: 'Days' },
              { value: timeLeft.hours, label: 'Hours' },
              { value: timeLeft.minutes, label: 'Mins' },
              { value: timeLeft.seconds, label: 'Secs' }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 mx-auto bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold">
                  {String(item.value).padStart(2, '0')}
                </div>
                <div className="text-xs text-gray-600 mt-2">{item.label}</div>
              </div>
            ))}
          </div>
          
          <Button variant="outline" className="w-full">
            Reserve My Spot
          </Button>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold mb-2">Countdown Features:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Multiple display styles</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Timezone support</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Custom expiration actions</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Recurring countdowns</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Evergreen campaigns</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Mobile optimized</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function AnalyticsDemo() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold mb-2">Analytics & Tracking</h3>
        <p className="text-gray-600">
          Track form performance, conversion rates, and optimize your lead generation strategy.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Form Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">2,847</div>
            <p className="text-sm text-gray-600">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Conversions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">342</div>
            <p className="text-sm text-gray-600">12.01% conversion rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">$8,420</div>
            <p className="text-sm text-gray-600">$24.62 per lead</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold mb-3">Tracking Features:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm">Google Analytics integration</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm">Facebook Pixel tracking</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm">Custom conversion goals</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm">A/B testing support</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm">Real-time notifications</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm">Detailed reporting</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
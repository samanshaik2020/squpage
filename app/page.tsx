"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { 
  ArrowRight, 
  Sparkles, 
  Zap, 
  Layout, 
  Palette, 
  Code, 
  Users, 
  Star,
  CheckCircle,
  Play,
  MousePointer,
  Smartphone,
  Monitor,
  Tablet,
  Globe,
  TrendingUp,
  Shield,
  Clock,
  Lightbulb,
  Target,
  Rocket,
  Award,
  BarChart3,
  Layers,
  Settings,
  Download,
  Eye,
  Heart,
  MessageSquare,
  Share2,
  ChevronRight,
  Quote,
  Menu,
  X
} from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "Drag & Drop Builder",
    description: "Intuitive visual editor with real-time preview and professional components",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: Sparkles,
    title: "AI-Powered Content",
    description: "Generate complete pages, copy, and designs with advanced AI technology",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: Layout,
    title: "Professional Templates",
    description: "100+ premium templates for every industry and use case",
    color: "from-emerald-500 to-teal-500"
  },
  {
    icon: Smartphone,
    title: "Mobile Responsive",
    description: "Every design automatically adapts to all screen sizes perfectly",
    color: "from-orange-500 to-red-500"
  },
  {
    icon: Code,
    title: "Clean Code Export",
    description: "Export production-ready HTML, CSS, and JavaScript code",
    color: "from-indigo-500 to-purple-500"
  },
  {
    icon: Globe,
    title: "One-Click Deploy",
    description: "Publish your website instantly to our global CDN network",
    color: "from-green-500 to-emerald-500"
  }
]

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Marketing Director",
    company: "TechFlow",
    avatar: "/placeholder.svg?height=60&width=60&text=SC",
    content: "This page builder revolutionized our marketing workflow. We can create professional landing pages in minutes, not hours.",
    rating: 5
  },
  {
    name: "Marcus Rodriguez",
    role: "Freelance Designer",
    company: "Independent",
    avatar: "/placeholder.svg?height=60&width=60&text=MR",
    content: "The AI content generation is incredible. It understands context and creates copy that actually converts.",
    rating: 5
  },
  {
    name: "Emily Watson",
    role: "Startup Founder",
    company: "GrowthLab",
    avatar: "/placeholder.svg?height=60&width=60&text=EW",
    content: "From idea to live website in under 30 minutes. The templates are gorgeous and the customization is endless.",
    rating: 5
  },
  {
    name: "David Kim",
    role: "E-commerce Owner",
    company: "ShopSmart",
    avatar: "/placeholder.svg?height=60&width=60&text=DK",
    content: "The drag-and-drop editor is intuitive and powerful. I built my entire online store without touching a single line of code.",
    rating: 5
  },
  {
    name: "Lisa Thompson",
    role: "Agency Owner",
    company: "Creative Studio",
    avatar: "/placeholder.svg?height=60&width=60&text=LT",
    content: "Our client delivery time has decreased by 70%. The AI features help us create unique designs for every project.",
    rating: 5
  },
  {
    name: "Alex Johnson",
    role: "Content Creator",
    company: "Digital Nomad",
    avatar: "/placeholder.svg?height=60&width=60&text=AJ",
    content: "Perfect for someone like me who needs to create multiple landing pages quickly. The templates are modern and convert well.",
    rating: 5
  }
]

const integrations = [
  { name: "Stripe", logo: "/placeholder.svg?height=40&width=120&text=Stripe" },
  { name: "PayPal", logo: "/placeholder.svg?height=40&width=120&text=PayPal" },
  { name: "Mailchimp", logo: "/placeholder.svg?height=40&width=120&text=Mailchimp" },
  { name: "Google Analytics", logo: "/placeholder.svg?height=40&width=120&text=Analytics" },
  { name: "Zapier", logo: "/placeholder.svg?height=40&width=120&text=Zapier" },
  { name: "Slack", logo: "/placeholder.svg?height=40&width=120&text=Slack" }
]

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started",
    features: [
      "3 websites",
      "Basic templates",
      "Community support",
      "SSL certificate",
      "Mobile responsive"
    ],
    popular: false
  },
  {
    name: "Pro",
    price: "$19",
    period: "per month",
    description: "Best for professionals",
    features: [
      "Unlimited websites",
      "All templates + AI",
      "Priority support",
      "Custom domain",
      "Advanced analytics",
      "White-label option"
    ],
    popular: true
  },
  {
    name: "Agency",
    price: "$49",
    period: "per month",
    description: "For teams and agencies",
    features: [
      "Everything in Pro",
      "Team collaboration",
      "Client management",
      "API access",
      "Custom integrations",
      "Dedicated support"
    ],
    popular: false
  }
]

const stats = [
  { number: "50K+", label: "Websites Created" },
  { number: "99.9%", label: "Uptime" },
  { number: "4.9/5", label: "User Rating" },
  { number: "24/7", label: "Support" }
]

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)
  const [scrollY, setScrollY] = useState(0)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const templatesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsVisible(true)
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length)
    }, 3000)

    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)

    return () => {
      clearInterval(interval)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up')
          }
        })
      },
      { threshold: 0.1 }
    )

    const elements = document.querySelectorAll('.scroll-animate')
    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                SiteBuilder
              </span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">Features</a>
              <a href="#templates" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">Templates</a>
              <Link href="/pricing" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">Pricing</Link>
              <Link href="/login" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
                Sign In
              </Link>
              <Link href="/signup">
                <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  Sign Up Free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 text-gray-600" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-600" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
              <div className="flex flex-col space-y-4 pt-4">
                <a 
                  href="#features" 
                  className="text-gray-600 hover:text-gray-900 transition-colors font-medium py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Features
                </a>
                <a 
                  href="#templates" 
                  className="text-gray-600 hover:text-gray-900 transition-colors font-medium py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Templates
                </a>
                <Link 
                  href="/pricing" 
                  className="text-gray-600 hover:text-gray-900 transition-colors font-medium py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Pricing
                </Link>
                <Link 
                  href="/login" 
                  className="text-gray-600 hover:text-gray-900 transition-colors font-medium py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                    Sign Up Free
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="pt-32 pb-24 px-6 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full opacity-10 animate-float"
            style={{ transform: `translateY(${scrollY * 0.1}px)` }}
          ></div>
          <div 
            className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-pink-400 to-red-400 rounded-full opacity-10 animate-float"
            style={{ transform: `translateY(${scrollY * -0.1}px)`, animationDelay: '1s' }}
          ></div>
          <div 
            className="absolute top-1/2 left-1/4 w-4 h-4 bg-indigo-500 rounded-full opacity-30 animate-pulse-slow"
          ></div>
          <div 
            className="absolute top-1/3 right-1/4 w-6 h-6 bg-purple-500 rounded-full opacity-30 animate-pulse-slow"
            style={{ animationDelay: '2s' }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Badge className="mb-8 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border border-indigo-200 px-6 py-3 rounded-full text-sm font-medium shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer">
              <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
              AI-Powered Website Builder
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight text-gray-900">
              Build Stunning Websites
              <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mt-2 animate-gradient">
                In Minutes, Not Hours
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
              Create professional websites with our AI-powered drag-and-drop builder. 
              Choose from premium templates or start from scratch with our visual editor.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20">
              <Link href="/signup">
                <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-10 py-4 text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 group relative overflow-hidden">
                  <span className="relative z-10 flex items-center">
                    Start Building Free
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-2 border-gray-300 text-gray-700 hover:text-gray-900 hover:border-gray-400 hover:bg-gray-50 px-10 py-4 text-lg rounded-xl transition-all duration-300 group">
                <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Hero Visual with Parallax */}
          <div 
            className={`relative transition-all duration-1500 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
            style={{ transform: `translateY(${scrollY * 0.05}px)` }}
          >
            <div className="relative max-w-6xl mx-auto">
              {/* Interactive Floating Elements */}
              <div className="absolute -top-10 -left-10 w-20 h-20 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-3xl opacity-20 animate-float cursor-pointer hover:opacity-40 transition-opacity"></div>
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-r from-pink-400 to-red-400 rounded-full opacity-20 animate-float cursor-pointer hover:opacity-40 transition-opacity" style={{ animationDelay: '1s' }}></div>
              
              <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-200 shadow-2xl p-8 hover:shadow-3xl transition-all duration-500">
                <div className="grid md:grid-cols-3 gap-8">
                  <Card className="bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-500 group hover:-translate-y-2 rounded-2xl overflow-hidden cursor-pointer">
                    <CardContent className="p-8">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-xl">
                        <Layout className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">Premium Templates</h3>
                      <p className="text-gray-600 leading-relaxed">Professional designs ready to customize for any industry</p>
                      <div className="mt-4 flex items-center text-blue-600 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <span className="text-sm font-medium">Explore Templates</span>
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-500 group hover:-translate-y-2 rounded-2xl overflow-hidden cursor-pointer">
                    <CardContent className="p-8">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-xl">
                        <Sparkles className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">AI Content Generator</h3>
                      <p className="text-gray-600 leading-relaxed">Generate professional content with advanced AI technology</p>
                      <div className="mt-4 flex items-center text-purple-600 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <span className="text-sm font-medium">Try AI Builder</span>
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-500 group hover:-translate-y-2 rounded-2xl overflow-hidden cursor-pointer">
                    <CardContent className="p-8">
                      <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-xl">
                        <Zap className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors">Visual Editor</h3>
                      <p className="text-gray-600 leading-relaxed">Drag & drop builder with pixel-perfect precision</p>
                      <div className="mt-4 flex items-center text-emerald-600 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <span className="text-sm font-medium">Start Building</span>
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4 group-hover:scale-110 transition-transform duration-300">
                  {stat.number}
                </div>
                <div className="text-gray-600 text-lg font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Everything You Need to Build
              <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mt-2">
                Professional Websites
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              Powerful tools and features designed to help you create stunning websites without any coding knowledge
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className={`bg-white border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500 group hover:-translate-y-3 rounded-2xl overflow-hidden ${
                  activeFeature === index ? 'ring-2 ring-indigo-500/20 shadow-xl' : ''
                }`}
              >
                <CardContent className="p-10">
                  <div className={`w-20 h-20 bg-gradient-to-r ${feature.color} rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 shadow-xl`}>
                    <feature.icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-lg">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Showcase */}
      <section id="templates" className="py-24 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Choose Your Starting Point
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 font-light leading-relaxed">
              Start with professional templates, use AI to generate content, or build from scratch with our visual editor
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-10 mb-16">
            {/* Free Templates */}
            <Card className="bg-white border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-500 group hover:-translate-y-4 rounded-3xl overflow-hidden">
              <div className="h-64 bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                <Layout className="w-20 h-20 text-white relative z-10 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <CardContent className="p-8">
                <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-200 mb-4 px-3 py-1 rounded-full font-medium">FREE</Badge>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Professional Templates</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">50+ premium templates designed for every industry and use case</p>
                <Link href="/templates">
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                    Browse Templates
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* AI Builder */}
            <Card className="bg-white border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-500 group hover:-translate-y-4 rounded-3xl overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 opacity-50"></div>
              <div className="h-64 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                <Sparkles className="w-20 h-20 text-white relative z-10 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <CardContent className="p-8 relative">
                <Badge className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border border-purple-200 mb-4 px-3 py-1 rounded-full font-medium">AI PRO</Badge>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">AI-Powered Builder</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">Generate complete websites with advanced AI technology</p>
                <Link href="/templates">
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                    Try AI Builder
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Elementor */}
            <Card className="bg-white border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-500 group hover:-translate-y-4 rounded-3xl overflow-hidden">
              <div className="h-64 bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                <Zap className="w-20 h-20 text-white relative z-10 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <CardContent className="p-8">
                <Badge className="bg-blue-100 text-blue-700 border border-blue-200 mb-4 px-3 py-1 rounded-full font-medium">BUILDER</Badge>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Visual Editor</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">Drag & drop builder with pixel-perfect precision</p>
                <Link href="/elementor">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                    Start Building
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 scroll-animate">
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              Get from idea to live website in just three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: "01",
                title: "Choose Your Starting Point",
                description: "Pick from premium templates, use AI generation, or start with a blank canvas",
                icon: Target,
                color: "from-blue-500 to-cyan-500"
              },
              {
                step: "02", 
                title: "Customize & Design",
                description: "Use our drag-and-drop editor to customize every element to match your vision",
                icon: Palette,
                color: "from-purple-500 to-pink-500"
              },
              {
                step: "03",
                title: "Launch & Grow",
                description: "Publish instantly to our global CDN and watch your website perform",
                icon: Rocket,
                color: "from-emerald-500 to-teal-500"
              }
            ].map((item, index) => (
              <div key={index} className="text-center scroll-animate" style={{ animationDelay: `${index * 200}ms` }}>
                <div className="relative mb-8">
                  <div className="w-24 h-24 mx-auto bg-white rounded-3xl shadow-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <div className={`w-16 h-16 bg-gradient-to-r ${item.color} rounded-2xl flex items-center justify-center`}>
                      <item.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed text-lg">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 scroll-animate">
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Loved by Creators Worldwide
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              Join thousands of satisfied users who have transformed their web presence
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500 group hover:-translate-y-2 rounded-2xl scroll-animate" style={{ animationDelay: `${index * 100}ms` }}>
                <CardContent className="p-8">
                  <Quote className="w-8 h-8 text-indigo-600 mb-4" />
                  <div className="flex items-center mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-8 leading-relaxed italic">"{testimonial.content}"</p>
                  <div className="flex items-center">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      width={48}
                      height={48}
                      className="rounded-full mr-4 shadow-lg"
                    />
                    <div>
                      <div className="font-bold text-gray-900">{testimonial.name}</div>
                      <div className="text-gray-600 text-sm">{testimonial.role} at {testimonial.company}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 scroll-animate">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Seamless Integrations
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
              Connect with your favorite tools and services
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
            {integrations.map((integration, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 scroll-animate" style={{ animationDelay: `${index * 100}ms` }}>
                <Image
                  src={integration.logo}
                  alt={integration.name}
                  width={120}
                  height={40}
                  className="mx-auto opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 scroll-animate">
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              Choose the perfect plan for your needs. Upgrade or downgrade at any time.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`relative bg-white border-2 shadow-lg hover:shadow-2xl transition-all duration-500 rounded-3xl overflow-hidden scroll-animate ${
                plan.popular ? 'border-indigo-600 scale-105' : 'border-gray-200 hover:border-indigo-300'
              }`} style={{ animationDelay: `${index * 200}ms` }}>
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center py-2 text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <CardContent className={`p-8 ${plan.popular ? 'pt-12' : ''}`}>
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 mb-6">{plan.description}</p>
                    <div className="mb-6">
                      <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                      <span className="text-gray-600 ml-2">/{plan.period}</span>
                    </div>
                  </div>
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className={`w-full py-3 rounded-xl transition-all duration-300 ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl' 
                      : 'bg-gray-900 hover:bg-gray-800 text-white'
                  }`}>
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-20 scroll-animate">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 font-light">
              Everything you need to know about our platform
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                question: "Do I need coding knowledge to use SiteBuilder?",
                answer: "Not at all! SiteBuilder is designed for everyone. Our drag-and-drop interface and AI-powered tools make it easy to create professional websites without any coding experience."
              },
              {
                question: "Can I use my own domain name?",
                answer: "Yes! With our Pro and Agency plans, you can connect your custom domain. We also provide free SSL certificates for all custom domains."
              },
              {
                question: "How does the AI content generation work?",
                answer: "Our AI analyzes your input and generates relevant, high-quality content including headlines, copy, and even complete page layouts. You can always edit and customize the generated content."
              },
              {
                question: "Can I export my website code?",
                answer: "Absolutely! You can export clean, production-ready HTML, CSS, and JavaScript code at any time. Your website will work perfectly on any hosting platform."
              },
              {
                question: "Is there a limit to how many websites I can create?",
                answer: "The Free plan allows 3 websites. Pro and Agency plans include unlimited websites. You can upgrade at any time as your needs grow."
              }
            ].map((faq, index) => (
              <Card key={index} className="bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl scroll-animate" style={{ animationDelay: `${index * 100}ms` }}>
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{faq.question}</h3>
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight">
            Ready to Build Your Dream Website?
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
            Join thousands of creators who are already building stunning websites with our platform. Start your journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/signup">
              <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-12 py-4 text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 group">
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="border-2 border-gray-300 text-gray-700 hover:text-gray-900 hover:border-gray-400 hover:bg-white px-12 py-4 text-lg rounded-xl transition-all duration-300">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">
                  SiteBuilder
                </span>
              </div>
              <p className="text-gray-400 leading-relaxed text-lg">
                Build professional websites with AI-powered tools and drag-and-drop simplicity.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-6 text-lg">Product</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors text-lg">Templates</a></li>
                <li><a href="#" className="hover:text-white transition-colors text-lg">AI Builder</a></li>
                <li><a href="#" className="hover:text-white transition-colors text-lg">Elementor</a></li>
                <li><a href="#" className="hover:text-white transition-colors text-lg">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-6 text-lg">Resources</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors text-lg">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors text-lg">Tutorials</a></li>
                <li><a href="#" className="hover:text-white transition-colors text-lg">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors text-lg">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-6 text-lg">Company</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors text-lg">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors text-lg">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors text-lg">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors text-lg">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
            <p className="text-lg">&copy; 2024 SiteBuilder. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
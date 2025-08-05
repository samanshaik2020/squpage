import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { Lock } from "lucide-react" // Import Lock icon

const templates = [
  {
    id: "saas-landing",
    name: "SaaS Landing Page",
    category: "Business",
    description: "Complete SaaS product landing page with pricing, features, and testimonials",
    image: "/placeholder.svg?height=300&width=400&text=SaaS+Landing+Page",
    tags: ["SaaS", "Business", "Conversion"],
    isPremium: false,
    isLocked: false,
  },
  {
    id: "portfolio",
    name: "Portfolio Website",
    category: "Portfolio",
    description: "Professional portfolio showcasing projects, skills, and experience",
    image: "/placeholder.svg?height=300&width=400&text=Portfolio+Website",
    tags: ["Portfolio", "Creative", "Professional"],
    isPremium: false,
    isLocked: false,
  },
  {
    id: "septiclean",
    name: "SeptiClean Landing",
    category: "Business",
    description: "Service-based landing page with video, testimonials, and strong CTAs",
    image: "/placeholder.svg?height=300&width=400&text=SeptiClean+Landing",
    tags: ["Service", "Local Business", "Conversion"],
    isPremium: false,
    isLocked: false,
  },
  {
    id: "startup-landing",
    name: "Startup Landing",
    category: "Business",
    description: "Convert visitors into customers with this landing page",
    image: "/placeholder.svg?height=300&width=400&text=Startup+Landing",
    tags: ["Conversion", "Modern", "CTA"],
    isPremium: false,
    isLocked: false,
  },
  {
    id: "ebook-landing",
    name: "Ebook Landing Page",
    category: "Marketing",
    description: "Capture leads with a high-converting ebook landing page",
    image: "/placeholder.svg?height=300&width=400&text=Ebook+Landing+Page",
    tags: ["Ebook", "Lead Gen", "Marketing"],
    isPremium: false,
    isLocked: false,
  },
  {
    id: "ai-generated-blog-post",
    name: "AI Blog Post",
    category: "Content",
    description: "Generate a full blog post with AI based on your topic.",
    image: "/placeholder.svg?height=300&width=400&text=AI+Blog+Post",
    tags: ["AI", "Content", "Premium"],
    isPremium: true,
    isLocked: false, // Set to false to unlock it
  },
  {
    id: "product-landing-page",
    name: "Product Landing Page",
    category: "Marketing",
    description: "Generate a customized landing page for any product with AI.",
    image: "/placeholder.svg?height=300&width=400&text=Product+Landing+Page",
    tags: ["AI", "Marketing", "Product", "Premium"],
    isPremium: true,
    isLocked: false,
  },
]

const categories = ["All", "Business", "Portfolio", "Agency", "Blog", "Service", "Marketing", "Content", "Pro"]

export default function TemplatesPage() {
  const normalTemplates = templates.filter((t) => !t.isPremium)
  const proTemplates = templates.filter((t) => t.isPremium)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="border-b bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back to Home</span>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-bold text-gray-900">SiteBuilder</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Template</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start with a professionally designed template and customize every element to match your vision
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={category === "All" ? "default" : "outline"}
              size="sm"
              className="rounded-full"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Normal Templates Section */}
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Standard Templates</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {normalTemplates.map((template) => (
            <Card
              key={template.id}
              className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden"
            >
              <div className="relative">
                <Image
                  src={template.image || "/placeholder.svg"}
                  alt={template.name}
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-4">
                  <Link href={`/preview/${template.id}`}>
                    <Button size="sm" variant="secondary">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      Preview
                    </Button>
                  </Link>
                  <Link href={`/editor/${template.id}`}>
                    <Button size="sm">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Edit
                    </Button>
                  </Link>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {template.category}
                  </Badge>
                </div>

                <p className="text-gray-600 mb-4 text-sm">{template.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {template.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <Link href={`/editor/${template.id}`} className="w-full">
                  <Button className="w-full">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Start Editing
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pro Templates Section */}
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Pro Templates</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {proTemplates.map((template) => (
            <Card
              key={template.id}
              className={`group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden relative ${
                template.isLocked ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {template.isLocked && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-30">
                  <Lock className="w-12 h-12 text-white opacity-80" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 opacity-20 rounded-lg z-10 pointer-events-none"></div>
              <div className="relative z-20">
                <Image
                  src={template.image || "/placeholder.svg"}
                  alt={template.name}
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-4">
                  <Link href={`/preview/${template.id}`}>
                    <Button size="sm" variant="secondary">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      Preview
                    </Button>
                  </Link>
                  {template.isLocked ? (
                    <Button size="sm" disabled>
                      <Lock className="w-4 h-4 mr-2" />
                      Locked
                    </Button>
                  ) : (
                    <Link href={`/editor/${template.id}`}>
                      <Button size="sm">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        Edit
                      </Button>
                    </Link>
                  )}
                </div>
              </div>

              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                  <Badge variant="secondary" className="text-xs bg-purple-200 text-purple-800">
                    Pro
                  </Badge>
                </div>

                <p className="text-gray-600 mb-4 text-sm">{template.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {template.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {template.isLocked ? (
                  <Button className="w-full" disabled>
                    <Lock className="w-4 h-4 mr-2" />
                    Locked
                  </Button>
                ) : (
                  <Link href={`/editor/${template.id}`} className="w-full">
                    <Button className="w-full">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Start Editing
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

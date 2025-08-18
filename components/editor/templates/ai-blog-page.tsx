"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { EditableElement } from "../editable-element"
import { Calendar, User, Tag, Search, ArrowRight, Heart, MessageCircle, Share2 } from "lucide-react"

interface AIBlogPageTemplateProps {
  selectedElement: string | null
  onElementSelect: (elementId: string) => void
  isEditable: boolean
}

export function AIBlogPageTemplate({
  selectedElement,
  onElementSelect,
  isEditable,
}: AIBlogPageTemplateProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <EditableElement
                id="blog-logo"
                type="text"
                className="text-2xl font-bold text-gray-900"
                isSelected={selectedElement === "blog-logo"}
                onSelect={onElementSelect}
                defaultContent="TechBlog"
                isEditable={isEditable}
              />
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-600 hover:text-gray-900">Home</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Categories</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">About</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Contact</a>
              <Button size="sm">Subscribe</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <EditableElement
            id="blog-title"
            type="heading"
            className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
            isSelected={selectedElement === "blog-title"}
            onSelect={onElementSelect}
            defaultContent="Welcome to TechBlog"
            isEditable={isEditable}
          />
          <EditableElement
            id="blog-subtitle"
            type="text"
            className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto"
            isSelected={selectedElement === "blog-subtitle"}
            onSelect={onElementSelect}
            defaultContent="Discover the latest insights, tutorials, and trends in technology and development"
            isEditable={isEditable}
          />
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search articles..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Featured Article</h2>
        </div>
        <Card className="overflow-hidden shadow-xl">
          <div className="grid lg:grid-cols-2 gap-0">
            <EditableElement
              id="featured-post-image"
              type="image"
              className="w-full h-64 lg:h-full object-cover"
              isSelected={selectedElement === "featured-post-image"}
              onSelect={onElementSelect}
              defaultContent="/placeholder.svg?height=400&width=600&text=Featured+Article"
              isEditable={isEditable}
            />
            <CardContent className="p-8 lg:p-12">
              <div className="flex items-center space-x-4 mb-4">
                <Badge className="bg-blue-100 text-blue-800">
                  <EditableElement
                    id="featured-post-category"
                    type="text"
                    className="text-sm"
                    isSelected={selectedElement === "featured-post-category"}
                    onSelect={onElementSelect}
                    defaultContent="Technology"
                    isEditable={isEditable}
                  />
                </Badge>
                <div className="flex items-center text-gray-500 text-sm">
                  <Calendar className="w-4 h-4 mr-1" />
                  <EditableElement
                    id="featured-post-date"
                    type="text"
                    className="text-sm"
                    isSelected={selectedElement === "featured-post-date"}
                    onSelect={onElementSelect}
                    defaultContent="March 15, 2024"
                    isEditable={isEditable}
                  />
                </div>
              </div>
              <EditableElement
                id="featured-post-title"
                type="heading"
                className="text-2xl md:text-3xl font-bold text-gray-900 mb-4"
                isSelected={selectedElement === "featured-post-title"}
                onSelect={onElementSelect}
                defaultContent="The Future of Web Development: Trends to Watch in 2024"
                isEditable={isEditable}
              />
              <EditableElement
                id="featured-post-excerpt"
                type="text"
                className="text-gray-600 mb-6 leading-relaxed"
                isSelected={selectedElement === "featured-post-excerpt"}
                onSelect={onElementSelect}
                defaultContent="Explore the cutting-edge technologies and methodologies that are shaping the future of web development. From AI integration to new frameworks, discover what's coming next."
                isEditable={isEditable}
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <EditableElement
                    id="featured-post-author-avatar"
                    type="image"
                    className="w-10 h-10 rounded-full mr-3"
                    isSelected={selectedElement === "featured-post-author-avatar"}
                    onSelect={onElementSelect}
                    defaultContent="/placeholder.svg?height=40&width=40&text=Author"
                    isEditable={isEditable}
                  />
                  <div>
                    <EditableElement
                      id="featured-post-author"
                      type="text"
                      className="font-medium text-gray-900"
                      isSelected={selectedElement === "featured-post-author"}
                      onSelect={onElementSelect}
                      defaultContent="Sarah Johnson"
                      isEditable={isEditable}
                    />
                    <p className="text-sm text-gray-500">Senior Developer</p>
                  </div>
                </div>
                <Button>
                  Read More
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </div>
        </Card>
      </section>

      {/* Recent Posts */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Recent Articles</h2>
          <Button variant="outline">View All</Button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden hover:shadow-lg transition-shadow">
              <EditableElement
                id={`post-${i}-image`}
                type="image"
                className="w-full h-48 object-cover"
                isSelected={selectedElement === `post-${i}-image`}
                onSelect={onElementSelect}
                defaultContent={`/placeholder.svg?height=200&width=400&text=Article+${i}`}
                isEditable={isEditable}
              />
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-3">
                  <Badge variant="outline" className="text-xs">
                    <EditableElement
                      id={`post-${i}-category`}
                      type="text"
                      className="text-xs"
                      isSelected={selectedElement === `post-${i}-category`}
                      onSelect={onElementSelect}
                      defaultContent="Development"
                      isEditable={isEditable}
                    />
                  </Badge>
                  <div className="flex items-center text-gray-500 text-xs">
                    <Calendar className="w-3 h-3 mr-1" />
                    <EditableElement
                      id={`post-${i}-date`}
                      type="text"
                      className="text-xs"
                      isSelected={selectedElement === `post-${i}-date`}
                      onSelect={onElementSelect}
                      defaultContent="Mar 10, 2024"
                      isEditable={isEditable}
                    />
                  </div>
                </div>
                <EditableElement
                  id={`post-${i}-title`}
                  type="heading"
                  className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2"
                  isSelected={selectedElement === `post-${i}-title`}
                  onSelect={onElementSelect}
                  defaultContent={`Article Title ${i}: Exploring Modern Development Practices`}
                  isEditable={isEditable}
                />
                <EditableElement
                  id={`post-${i}-excerpt`}
                  type="text"
                  className="text-gray-600 text-sm mb-4 line-clamp-3"
                  isSelected={selectedElement === `post-${i}-excerpt`}
                  onSelect={onElementSelect}
                  defaultContent={`Brief excerpt of article ${i} that gives readers a preview of the content and encourages them to read more.`}
                  isEditable={isEditable}
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <EditableElement
                      id={`post-${i}-author-avatar`}
                      type="image"
                      className="w-8 h-8 rounded-full mr-2"
                      isSelected={selectedElement === `post-${i}-author-avatar`}
                      onSelect={onElementSelect}
                      defaultContent="/placeholder.svg?height=32&width=32&text=A"
                      isEditable={isEditable}
                    />
                    <EditableElement
                      id={`post-${i}-author`}
                      type="text"
                      className="text-sm font-medium text-gray-900"
                      isSelected={selectedElement === `post-${i}-author`}
                      onSelect={onElementSelect}
                      defaultContent={`Author ${i}`}
                      isEditable={isEditable}
                    />
                  </div>
                  <div className="flex items-center space-x-2 text-gray-500">
                    <Heart className="w-4 h-4" />
                    <span className="text-sm">24</span>
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-sm">8</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Browse by Category</h2>
          <p className="text-gray-600">Explore articles by topic</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Card key={i} className="text-center p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <EditableElement
                    id={`category-${i}-icon`}
                    type="text"
                    className="text-2xl"
                    isSelected={selectedElement === `category-${i}-icon`}
                    onSelect={onElementSelect}
                    defaultContent="📱"
                    isEditable={isEditable}
                  />
                </div>
                <EditableElement
                  id={`category-${i}-name`}
                  type="text"
                  className="font-semibold text-gray-900 mb-2"
                  isSelected={selectedElement === `category-${i}-name`}
                  onSelect={onElementSelect}
                  defaultContent={`Category ${i}`}
                  isEditable={isEditable}
                />
                <EditableElement
                  id={`category-${i}-count`}
                  type="text"
                  className="text-sm text-gray-600"
                  isSelected={selectedElement === `category-${i}-count`}
                  onSelect={onElementSelect}
                  defaultContent={`${i * 5} articles`}
                  isEditable={isEditable}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="p-12 text-center">
            <EditableElement
              id="newsletter-title"
              type="heading"
              className="text-3xl font-bold mb-4"
              isSelected={selectedElement === "newsletter-title"}
              onSelect={onElementSelect}
              defaultContent="Stay Updated"
              isEditable={isEditable}
            />
            <EditableElement
              id="newsletter-description"
              type="text"
              className="text-xl mb-8 opacity-90"
              isSelected={selectedElement === "newsletter-description"}
              onSelect={onElementSelect}
              defaultContent="Get the latest articles and insights delivered directly to your inbox"
              isEditable={isEditable}
            />
            <div className="max-w-md mx-auto flex gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900"
              />
              <Button className="bg-white text-blue-600 hover:bg-gray-100">
                Subscribe
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-gray-200">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <EditableElement
              id="footer-logo"
              type="text"
              className="text-2xl font-bold text-gray-900 mb-4"
              isSelected={selectedElement === "footer-logo"}
              onSelect={onElementSelect}
              defaultContent="TechBlog"
              isEditable={isEditable}
            />
            <EditableElement
              id="footer-description"
              type="text"
              className="text-gray-600"
              isSelected={selectedElement === "footer-description"}
              onSelect={onElementSelect}
              defaultContent="Your go-to source for technology insights and development tutorials."
              isEditable={isEditable}
            />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Categories</h4>
            <ul className="space-y-2 text-gray-600">
              <li><a href="#" className="hover:text-gray-900">Web Development</a></li>
              <li><a href="#" className="hover:text-gray-900">Mobile Apps</a></li>
              <li><a href="#" className="hover:text-gray-900">AI & ML</a></li>
              <li><a href="#" className="hover:text-gray-900">DevOps</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Resources</h4>
            <ul className="space-y-2 text-gray-600">
              <li><a href="#" className="hover:text-gray-900">Tutorials</a></li>
              <li><a href="#" className="hover:text-gray-900">Guides</a></li>
              <li><a href="#" className="hover:text-gray-900">Tools</a></li>
              <li><a href="#" className="hover:text-gray-900">Books</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Connect</h4>
            <ul className="space-y-2 text-gray-600">
              <li><a href="#" className="hover:text-gray-900">Twitter</a></li>
              <li><a href="#" className="hover:text-gray-900">LinkedIn</a></li>
              <li><a href="#" className="hover:text-gray-900">GitHub</a></li>
              <li><a href="#" className="hover:text-gray-900">RSS Feed</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-12 pt-8 text-center text-gray-600">
          <EditableElement
            id="footer-copyright"
            type="text"
            className="text-sm"
            isSelected={selectedElement === "footer-copyright"}
            onSelect={onElementSelect}
            defaultContent="© 2024 TechBlog. All rights reserved."
            isEditable={isEditable}
          />
        </div>
      </footer>
    </div>
  )
}
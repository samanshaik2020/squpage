"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { EditableElement } from "../editable-element"
import { Star, Check, Users, Award, Zap } from "lucide-react"

interface ProductLandingPageTemplateProps {
  selectedElement: string | null
  onElementSelect: (elementId: string) => void
  isEditable: boolean
}

export function ProductLandingPageTemplate({
  selectedElement,
  onElementSelect,
  isEditable,
}: ProductLandingPageTemplateProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <EditableElement
                id="nav-logo"
                type="text"
                className="text-2xl font-bold text-gray-900"
                isSelected={selectedElement === "nav-logo"}
                onSelect={onElementSelect}
                defaultContent="ProductName"
                isEditable={isEditable}
              />
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
              <a href="#testimonials" className="text-gray-600 hover:text-gray-900">Reviews</a>
              <a href="#contact" className="text-gray-600 hover:text-gray-900">Contact</a>
              <Button size="sm">Get Started</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="flex-1 text-center lg:text-left">
            <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-100">
              <EditableElement
                id="hero-badge"
                type="text"
                className="text-sm"
                isSelected={selectedElement === "hero-badge"}
                onSelect={onElementSelect}
                defaultContent="🚀 New Release Available"
                isEditable={isEditable}
              />
            </Badge>
            <EditableElement
              id="product-title"
              type="heading"
              className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight"
              isSelected={selectedElement === "product-title"}
              onSelect={onElementSelect}
              defaultContent="Revolutionary Product That Changes Everything"
              isEditable={isEditable}
            />
            <EditableElement
              id="product-tagline"
              type="text"
              className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed"
              isSelected={selectedElement === "product-tagline"}
              onSelect={onElementSelect}
              defaultContent="Transform your workflow with our cutting-edge solution. Increase productivity by 300% and save hours every day with intelligent automation."
              isEditable={isEditable}
            />
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <EditableElement
                id="product-cta-primary"
                type="button"
                className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-lg"
                isSelected={selectedElement === "product-cta-primary"}
                onSelect={onElementSelect}
                defaultContent="Start Free Trial"
                isEditable={isEditable}
              />
              <EditableElement
                id="product-cta-secondary"
                type="button"
                className="inline-flex items-center justify-center px-8 py-4 border border-gray-300 text-lg font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
                isSelected={selectedElement === "product-cta-secondary"}
                onSelect={onElementSelect}
                defaultContent="Watch Demo"
                isEditable={isEditable}
              />
            </div>
            <div className="flex items-center justify-center lg:justify-start space-x-6 text-sm text-gray-500">
              <div className="flex items-center">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                <span>14-day free trial</span>
              </div>
            </div>
          </div>
          <div className="flex-1 max-w-lg">
            <EditableElement
              id="product-hero-image"
              type="image"
              className="w-full h-80 md:h-96 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl object-cover shadow-2xl"
              isSelected={selectedElement === "product-hero-image"}
              onSelect={onElementSelect}
              defaultContent="/placeholder.svg?height=400&width=600&text=Product+Hero+Image"
              isEditable={isEditable}
            />
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <EditableElement
            id="social-proof-text"
            type="text"
            className="text-gray-600 mb-6"
            isSelected={selectedElement === "social-proof-text"}
            onSelect={onElementSelect}
            defaultContent="Trusted by over 10,000+ companies worldwide"
            isEditable={isEditable}
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center opacity-60">
          {[1, 2, 3, 4, 5].map((i) => (
            <EditableElement
              key={i}
              id={`company-logo-${i}`}
              type="image"
              className="h-12 w-auto mx-auto grayscale hover:grayscale-0 transition-all"
              isSelected={selectedElement === `company-logo-${i}`}
              onSelect={onElementSelect}
              defaultContent={`/placeholder.svg?height=48&width=120&text=Company+${i}`}
              isEditable={isEditable}
            />
          ))}
        </div>
      </section>

      {/* Enhanced About Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <EditableElement
              id="about-badge"
              type="text"
              className="text-blue-600 font-semibold text-sm uppercase tracking-wide mb-4"
              isSelected={selectedElement === "about-badge"}
              onSelect={onElementSelect}
              defaultContent="About Our Product"
              isEditable={isEditable}
            />
            <EditableElement
              id="about-title"
              type="heading"
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
              isSelected={selectedElement === "about-title"}
              onSelect={onElementSelect}
              defaultContent="Built for Modern Teams Who Demand Excellence"
              isEditable={isEditable}
            />
            <EditableElement
              id="about-description"
              type="text"
              className="text-lg text-gray-600 mb-8 leading-relaxed"
              isSelected={selectedElement === "about-description"}
              onSelect={onElementSelect}
              defaultContent="Our product combines cutting-edge technology with intuitive design to deliver an unparalleled user experience. We've spent years perfecting every detail to ensure maximum efficiency and user satisfaction. From small startups to Fortune 500 companies, our solution scales with your needs."
              isEditable={isEditable}
            />
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <EditableElement
                    id="stat-1-number"
                    type="text"
                    className="text-2xl font-bold text-gray-900"
                    isSelected={selectedElement === "stat-1-number"}
                    onSelect={onElementSelect}
                    defaultContent="50K+"
                    isEditable={isEditable}
                  />
                  <EditableElement
                    id="stat-1-label"
                    type="text"
                    className="text-gray-600"
                    isSelected={selectedElement === "stat-1-label"}
                    onSelect={onElementSelect}
                    defaultContent="Active Users"
                    isEditable={isEditable}
                  />
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <EditableElement
                    id="stat-2-number"
                    type="text"
                    className="text-2xl font-bold text-gray-900"
                    isSelected={selectedElement === "stat-2-number"}
                    onSelect={onElementSelect}
                    defaultContent="99.9%"
                    isEditable={isEditable}
                  />
                  <EditableElement
                    id="stat-2-label"
                    type="text"
                    className="text-gray-600"
                    isSelected={selectedElement === "stat-2-label"}
                    onSelect={onElementSelect}
                    defaultContent="Uptime"
                    isEditable={isEditable}
                  />
                </div>
              </div>
            </div>
          </div>
          <div>
            <EditableElement
              id="about-image"
              type="image"
              className="w-full h-96 bg-gray-100 rounded-2xl object-cover shadow-xl"
              isSelected={selectedElement === "about-image"}
              onSelect={onElementSelect}
              defaultContent="/placeholder.svg?height=400&width=600&text=About+Product+Image"
              isEditable={isEditable}
            />
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-gray-50">
        <div className="text-center mb-16">
          <EditableElement
            id="features-badge"
            type="text"
            className="text-blue-600 font-semibold text-sm uppercase tracking-wide mb-4"
            isSelected={selectedElement === "features-badge"}
            onSelect={onElementSelect}
            defaultContent="Powerful Features"
            isEditable={isEditable}
          />
          <EditableElement
            id="features-title"
            type="heading"
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            isSelected={selectedElement === "features-title"}
            onSelect={onElementSelect}
            defaultContent="Everything You Need to Succeed"
            isEditable={isEditable}
          />
          <EditableElement
            id="features-subtitle"
            type="text"
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            isSelected={selectedElement === "features-subtitle"}
            onSelect={onElementSelect}
            defaultContent="Discover the comprehensive suite of tools designed to streamline your workflow and boost productivity"
            isEditable={isEditable}
          />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-0">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <EditableElement
                  id={`feature-${i}-title`}
                  type="heading"
                  className="text-xl font-semibold text-gray-900 mb-3"
                  isSelected={selectedElement === `feature-${i}-title`}
                  onSelect={onElementSelect}
                  defaultContent={`Advanced Feature ${i}`}
                  isEditable={isEditable}
                />
                <EditableElement
                  id={`feature-${i}-description`}
                  type="text"
                  className="text-gray-600 leading-relaxed"
                  isSelected={selectedElement === `feature-${i}-description`}
                  onSelect={onElementSelect}
                  defaultContent={`Comprehensive description of feature ${i} and how it provides value to users. This feature enhances productivity and streamlines workflows.`}
                  isEditable={isEditable}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <EditableElement
            id="how-it-works-title"
            type="heading"
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            isSelected={selectedElement === "how-it-works-title"}
            onSelect={onElementSelect}
            defaultContent="How It Works"
            isEditable={isEditable}
          />
          <EditableElement
            id="how-it-works-subtitle"
            type="text"
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            isSelected={selectedElement === "how-it-works-subtitle"}
            onSelect={onElementSelect}
            defaultContent="Get started in just three simple steps"
            isEditable={isEditable}
          />
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map((step) => (
            <div key={step} className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                {step}
              </div>
              <EditableElement
                id={`step-${step}-title`}
                type="heading"
                className="text-xl font-semibold text-gray-900 mb-4"
                isSelected={selectedElement === `step-${step}-title`}
                onSelect={onElementSelect}
                defaultContent={`Step ${step} Title`}
                isEditable={isEditable}
              />
              <EditableElement
                id={`step-${step}-description`}
                type="text"
                className="text-gray-600"
                isSelected={selectedElement === `step-${step}-description`}
                onSelect={onElementSelect}
                defaultContent={`Description of step ${step} in the process. Explain what users need to do and what they can expect.`}
                isEditable={isEditable}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <EditableElement
            id="testimonials-title"
            type="heading"
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            isSelected={selectedElement === "testimonials-title"}
            onSelect={onElementSelect}
            defaultContent="What Our Customers Say"
            isEditable={isEditable}
          />
          <EditableElement
            id="testimonials-subtitle"
            type="text"
            className="text-xl text-gray-600"
            isSelected={selectedElement === "testimonials-subtitle"}
            onSelect={onElementSelect}
            defaultContent="Don't just take our word for it"
            isEditable={isEditable}
          />
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map((testimonial) => (
            <Card key={testimonial} className="bg-white shadow-lg">
              <CardContent className="p-8">
                <div className="flex mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <EditableElement
                  id={`testimonial-${testimonial}-quote`}
                  type="text"
                  className="text-gray-600 mb-6 italic"
                  isSelected={selectedElement === `testimonial-${testimonial}-quote`}
                  onSelect={onElementSelect}
                  defaultContent={`"This product has completely transformed how we work. The results speak for themselves - we've seen a ${testimonial * 50}% increase in productivity."`}
                  isEditable={isEditable}
                />
                <div className="flex items-center">
                  <EditableElement
                    id={`testimonial-${testimonial}-avatar`}
                    type="image"
                    className="w-12 h-12 rounded-full mr-4"
                    isSelected={selectedElement === `testimonial-${testimonial}-avatar`}
                    onSelect={onElementSelect}
                    defaultContent={`/placeholder.svg?height=48&width=48&text=User+${testimonial}`}
                    isEditable={isEditable}
                  />
                  <div>
                    <EditableElement
                      id={`testimonial-${testimonial}-name`}
                      type="text"
                      className="font-semibold text-gray-900"
                      isSelected={selectedElement === `testimonial-${testimonial}-name`}
                      onSelect={onElementSelect}
                      defaultContent={`Customer Name ${testimonial}`}
                      isEditable={isEditable}
                    />
                    <EditableElement
                      id={`testimonial-${testimonial}-title`}
                      type="text"
                      className="text-gray-600 text-sm"
                      isSelected={selectedElement === `testimonial-${testimonial}-title`}
                      onSelect={onElementSelect}
                      defaultContent={`CEO, Company ${testimonial}`}
                      isEditable={isEditable}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <EditableElement
            id="faq-title"
            type="heading"
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            isSelected={selectedElement === "faq-title"}
            onSelect={onElementSelect}
            defaultContent="Frequently Asked Questions"
            isEditable={isEditable}
          />
        </div>

        <div className="space-y-6">
          {[1, 2, 3, 4, 5].map((faq) => (
            <Card key={faq} className="bg-white shadow-md">
              <CardContent className="p-6">
                <EditableElement
                  id={`faq-${faq}-question`}
                  type="heading"
                  className="text-lg font-semibold text-gray-900 mb-3"
                  isSelected={selectedElement === `faq-${faq}-question`}
                  onSelect={onElementSelect}
                  defaultContent={`Frequently asked question ${faq}?`}
                  isEditable={isEditable}
                />
                <EditableElement
                  id={`faq-${faq}-answer`}
                  type="text"
                  className="text-gray-600"
                  isSelected={selectedElement === `faq-${faq}-answer`}
                  onSelect={onElementSelect}
                  defaultContent={`Detailed answer to question ${faq}. This provides comprehensive information to help users understand the product better.`}
                  isEditable={isEditable}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white">
        <EditableElement
          id="final-cta-title"
          type="heading"
          className="text-3xl md:text-4xl font-bold mb-6"
          isSelected={selectedElement === "final-cta-title"}
          onSelect={onElementSelect}
          defaultContent="Ready to Transform Your Business?"
          isEditable={isEditable}
        />
        <EditableElement
          id="final-cta-description"
          type="text"
          className="text-xl mb-8 max-w-3xl mx-auto opacity-90"
          isSelected={selectedElement === "final-cta-description"}
          onSelect={onElementSelect}
          defaultContent="Join thousands of satisfied customers who have already revolutionized their workflow. Start your free trial today and see the difference."
          isEditable={isEditable}
        />
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <EditableElement
            id="final-cta-primary"
            type="button"
            className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-blue-600 bg-white hover:bg-gray-50 shadow-lg"
            isSelected={selectedElement === "final-cta-primary"}
            onSelect={onElementSelect}
            defaultContent="Start Free Trial"
            isEditable={isEditable}
          />
          <EditableElement
            id="final-cta-secondary"
            type="button"
            className="inline-flex items-center justify-center px-8 py-4 border border-white text-lg font-medium rounded-lg text-white hover:bg-white hover:text-blue-600 transition-colors"
            isSelected={selectedElement === "final-cta-secondary"}
            onSelect={onElementSelect}
            defaultContent="Contact Sales"
            isEditable={isEditable}
          />
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-gray-200 mt-20">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <EditableElement
              id="footer-logo"
              type="text"
              className="text-2xl font-bold text-gray-900 mb-4"
              isSelected={selectedElement === "footer-logo"}
              onSelect={onElementSelect}
              defaultContent="ProductName"
              isEditable={isEditable}
            />
            <EditableElement
              id="footer-description"
              type="text"
              className="text-gray-600 mb-4"
              isSelected={selectedElement === "footer-description"}
              onSelect={onElementSelect}
              defaultContent="Transforming businesses with innovative solutions."
              isEditable={isEditable}
            />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Product</h4>
            <ul className="space-y-2 text-gray-600">
              <li><a href="#" className="hover:text-gray-900">Features</a></li>
              <li><a href="#" className="hover:text-gray-900">Security</a></li>
              <li><a href="#" className="hover:text-gray-900">Updates</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
            <ul className="space-y-2 text-gray-600">
              <li><a href="#" className="hover:text-gray-900">About</a></li>
              <li><a href="#" className="hover:text-gray-900">Blog</a></li>
              <li><a href="#" className="hover:text-gray-900">Careers</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
            <ul className="space-y-2 text-gray-600">
              <li><a href="#" className="hover:text-gray-900">Help Center</a></li>
              <li><a href="#" className="hover:text-gray-900">Contact</a></li>
              <li><a href="#" className="hover:text-gray-900">Status</a></li>
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
            defaultContent="© 2024 ProductName. All rights reserved."
            isEditable={isEditable}
          />
        </div>
      </footer>
    </div>
  )
}
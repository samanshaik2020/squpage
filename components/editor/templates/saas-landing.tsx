"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { EditableElement } from "../editable-element"

interface SaasLandingTemplateProps {
  selectedElement: string | null
  onElementSelect: (elementId: string) => void
}

export function SaasLandingTemplate({ selectedElement, onElementSelect }: SaasLandingTemplateProps) {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="border-b bg-white/95 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <EditableElement
              id="nav-logo"
              type="text"
              className="text-xl font-bold text-gray-900"
              isSelected={selectedElement === "nav-logo"}
              onSelect={onElementSelect}
              defaultContent="SaaSify"
            />
            <div className="hidden md:flex items-center space-x-8">
              <EditableElement
                id="nav-features"
                type="text"
                className="text-gray-600 hover:text-gray-900 cursor-pointer"
                isSelected={selectedElement === "nav-features"}
                onSelect={onElementSelect}
                defaultContent="Features"
              />
              <EditableElement
                id="nav-pricing"
                type="text"
                className="text-gray-600 hover:text-gray-900 cursor-pointer"
                isSelected={selectedElement === "nav-pricing"}
                onSelect={onElementSelect}
                defaultContent="Pricing"
              />
              <EditableElement
                id="nav-about"
                type="text"
                className="text-gray-600 hover:text-gray-900 cursor-pointer"
                isSelected={selectedElement === "nav-about"}
                onSelect={onElementSelect}
                defaultContent="About"
              />
            </div>
            <div className="flex items-center space-x-4">
              <EditableElement
                id="nav-signin"
                type="button"
                variant="ghost"
                isSelected={selectedElement === "nav-signin"}
                onSelect={onElementSelect}
                defaultContent="Sign In"
              />
              <EditableElement
                id="nav-signup"
                type="button"
                isSelected={selectedElement === "nav-signup"}
                onSelect={onElementSelect}
                defaultContent="Get Started"
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <EditableElement
                id="hero-badge"
                type="badge"
                className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-8"
                isSelected={selectedElement === "hero-badge"}
                onSelect={onElementSelect}
                defaultContent="🚀 New: AI-Powered Analytics"
              />

              <EditableElement
                id="hero-title"
                type="heading"
                className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight"
                isSelected={selectedElement === "hero-title"}
                onSelect={onElementSelect}
                defaultContent="Scale Your Business with Smart SaaS Solutions"
              />

              <EditableElement
                id="hero-subtitle"
                type="text"
                className="text-xl text-gray-600 mb-10 leading-relaxed"
                isSelected={selectedElement === "hero-subtitle"}
                onSelect={onElementSelect}
                defaultContent="Streamline operations, boost productivity, and grow faster with our all-in-one platform trusted by 10,000+ businesses worldwide."
              />

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <EditableElement
                  id="hero-cta-primary"
                  type="button"
                  size="lg"
                  className="px-8 py-3 text-lg"
                  isSelected={selectedElement === "hero-cta-primary"}
                  onSelect={onElementSelect}
                  defaultContent="Start Free Trial"
                />
                <EditableElement
                  id="hero-cta-secondary"
                  type="button"
                  variant="outline"
                  size="lg"
                  className="px-8 py-3 text-lg"
                  isSelected={selectedElement === "hero-cta-secondary"}
                  onSelect={onElementSelect}
                  defaultContent="Watch Demo"
                />
              </div>

              <EditableElement
                id="hero-trust"
                type="text"
                className="text-sm text-gray-500"
                isSelected={selectedElement === "hero-trust"}
                onSelect={onElementSelect}
                defaultContent="Trusted by teams at Google, Microsoft, and 10,000+ growing companies"
              />
            </div>

            <div className="relative">
              <EditableElement
                id="hero-image"
                type="image"
                className="w-full h-96 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg shadow-2xl"
                isSelected={selectedElement === "hero-image"}
                onSelect={onElementSelect}
                defaultContent="/placeholder.svg?height=400&width=600&text=SaaS+Dashboard+Preview"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Logo Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white border-b">
        <div className="max-w-6xl mx-auto">
          <EditableElement
            id="logos-title"
            type="text"
            className="text-center text-sm text-gray-500 mb-8"
            isSelected={selectedElement === "logos-title"}
            onSelect={onElementSelect}
            defaultContent="Trusted by leading companies worldwide"
          />
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center opacity-60">
            {[1, 2, 3, 4, 5].map((index) => (
              <EditableElement
                key={index}
                id={`logo-${index}`}
                type="image"
                className="h-12 bg-gray-200 rounded flex items-center justify-center"
                isSelected={selectedElement === `logo-${index}`}
                onSelect={onElementSelect}
                defaultContent={`/placeholder.svg?height=48&width=120&text=Logo+${index}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <EditableElement
              id="features-title"
              type="heading"
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
              isSelected={selectedElement === "features-title"}
              onSelect={onElementSelect}
              defaultContent="Everything you need to succeed"
            />
            <EditableElement
              id="features-subtitle"
              type="text"
              className="text-xl text-gray-600 max-w-2xl mx-auto"
              isSelected={selectedElement === "features-subtitle"}
              onSelect={onElementSelect}
              defaultContent="Powerful features designed to help your business grow faster and more efficiently"
            />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Lightning Fast", desc: "Blazing fast performance with 99.9% uptime guarantee", icon: "zap" },
              { title: "Enterprise Security", desc: "Bank-level security with SOC 2 compliance", icon: "shield" },
              {
                title: "Team Collaboration",
                desc: "Real-time collaboration tools for your entire team",
                icon: "users",
              },
              { title: "Advanced Analytics", desc: "Deep insights with AI-powered analytics", icon: "chart" },
            ].map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    {feature.icon === "zap" && (
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    )}
                    {feature.icon === "shield" && (
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                    )}
                    {feature.icon === "users" && (
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                        />
                      </svg>
                    )}
                    {feature.icon === "chart" && (
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                    )}
                  </div>
                  <EditableElement
                    id={`feature-${index}-title`}
                    type="text"
                    className="text-lg font-semibold text-gray-900 mb-2"
                    isSelected={selectedElement === `feature-${index}-title`}
                    onSelect={onElementSelect}
                    defaultContent={feature.title}
                  />
                  <EditableElement
                    id={`feature-${index}-desc`}
                    type="text"
                    className="text-gray-600"
                    isSelected={selectedElement === `feature-${index}-desc`}
                    onSelect={onElementSelect}
                    defaultContent={feature.desc}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Product Demo Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <EditableElement
                id="demo-title"
                type="heading"
                className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
                isSelected={selectedElement === "demo-title"}
                onSelect={onElementSelect}
                defaultContent="See SaaSify in Action"
              />
              <EditableElement
                id="demo-description"
                type="text"
                className="text-lg text-gray-600 mb-8 leading-relaxed"
                isSelected={selectedElement === "demo-description"}
                onSelect={onElementSelect}
                defaultContent="Watch how our platform transforms the way teams collaborate, manage projects, and drive results. From onboarding to advanced analytics, see every feature in action."
              />
              <EditableElement
                id="demo-cta"
                type="button"
                size="lg"
                className="px-8 py-3"
                isSelected={selectedElement === "demo-cta"}
                onSelect={onElementSelect}
                defaultContent="Schedule Demo"
              />
            </div>
            <div className="relative">
              <EditableElement
                id="demo-image"
                type="image"
                className="w-full h-80 bg-gray-300 rounded-lg shadow-xl"
                isSelected={selectedElement === "demo-image"}
                onSelect={onElementSelect}
                defaultContent="/placeholder.svg?height=320&width=500&text=Product+Demo+Video"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <div className="w-0 h-0 border-l-[12px] border-l-blue-600 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <EditableElement
              id="pricing-title"
              type="heading"
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
              isSelected={selectedElement === "pricing-title"}
              onSelect={onElementSelect}
              defaultContent="Simple, transparent pricing"
            />
            <EditableElement
              id="pricing-subtitle"
              type="text"
              className="text-xl text-gray-600"
              isSelected={selectedElement === "pricing-subtitle"}
              onSelect={onElementSelect}
              defaultContent="Choose the perfect plan for your business needs"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Starter", price: "$29", features: ["Up to 5 users", "10GB storage", "Basic support"] },
              {
                name: "Professional",
                price: "$79",
                features: ["Up to 25 users", "100GB storage", "Priority support", "Advanced analytics"],
                popular: true,
              },
              {
                name: "Enterprise",
                price: "$199",
                features: ["Unlimited users", "1TB storage", "24/7 support", "Custom integrations"],
              },
            ].map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? "ring-2 ring-blue-500" : ""}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500">
                    Most Popular
                  </Badge>
                )}
                <CardContent className="p-8 text-center">
                  <EditableElement
                    id={`plan-${index}-name`}
                    type="text"
                    className="text-xl font-semibold text-gray-900 mb-4"
                    isSelected={selectedElement === `plan-${index}-name`}
                    onSelect={onElementSelect}
                    defaultContent={plan.name}
                  />
                  <div className="mb-6">
                    <EditableElement
                      id={`plan-${index}-price`}
                      type="text"
                      className="text-4xl font-bold text-gray-900"
                      isSelected={selectedElement === `plan-${index}-price`}
                      onSelect={onElementSelect}
                      defaultContent={plan.price}
                    />
                    <span className="text-gray-600">/month</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <svg
                          className="w-5 h-5 text-green-500 mr-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <EditableElement
                          id={`plan-${index}-feature-${featureIndex}`}
                          type="text"
                          className="text-gray-600"
                          isSelected={selectedElement === `plan-${index}-feature-${featureIndex}`}
                          onSelect={onElementSelect}
                          defaultContent={feature}
                        />
                      </li>
                    ))}
                  </ul>
                  <EditableElement
                    id={`plan-${index}-cta`}
                    type="button"
                    className="w-full"
                    variant={plan.popular ? "default" : "outline"}
                    isSelected={selectedElement === `plan-${index}-cta`}
                    onSelect={onElementSelect}
                    defaultContent="Get Started"
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <EditableElement
              id="testimonials-title"
              type="heading"
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
              isSelected={selectedElement === "testimonials-title"}
              onSelect={onElementSelect}
              defaultContent="Loved by thousands of customers"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "CEO, TechCorp",
                content: "SaaSify transformed our workflow completely. We've seen 300% productivity increase!",
                avatar: "/placeholder.svg?height=60&width=60&text=SJ",
              },
              {
                name: "Mike Chen",
                role: "CTO, StartupXYZ",
                content: "The best investment we've made. ROI was visible within the first month.",
                avatar: "/placeholder.svg?height=60&width=60&text=MC",
              },
              {
                name: "Emily Davis",
                role: "Operations Manager",
                content: "Incredible support team and features that actually work as advertised.",
                avatar: "/placeholder.svg?height=60&width=60&text=ED",
              },
            ].map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>
                  <EditableElement
                    id={`testimonial-${index}-content`}
                    type="text"
                    className="text-gray-600 mb-4"
                    isSelected={selectedElement === `testimonial-${index}-content`}
                    onSelect={onElementSelect}
                    defaultContent={`"${testimonial.content}"`}
                  />
                  <div className="flex items-center">
                    <EditableElement
                      id={`testimonial-${index}-avatar`}
                      type="image"
                      className="w-12 h-12 rounded-full mr-4"
                      isSelected={selectedElement === `testimonial-${index}-avatar`}
                      onSelect={onElementSelect}
                      defaultContent={testimonial.avatar}
                    />
                    <div>
                      <EditableElement
                        id={`testimonial-${index}-name`}
                        type="text"
                        className="font-semibold text-gray-900"
                        isSelected={selectedElement === `testimonial-${index}-name`}
                        onSelect={onElementSelect}
                        defaultContent={testimonial.name}
                      />
                      <EditableElement
                        id={`testimonial-${index}-role`}
                        type="text"
                        className="text-sm text-gray-500"
                        isSelected={selectedElement === `testimonial-${index}-role`}
                        onSelect={onElementSelect}
                        defaultContent={testimonial.role}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <EditableElement
            id="cta-title"
            type="heading"
            className="text-3xl md:text-4xl font-bold text-white mb-6"
            isSelected={selectedElement === "cta-title"}
            onSelect={onElementSelect}
            defaultContent="Ready to transform your business?"
          />
          <EditableElement
            id="cta-subtitle"
            type="text"
            className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto"
            isSelected={selectedElement === "cta-subtitle"}
            onSelect={onElementSelect}
            defaultContent="Join thousands of companies already using SaaSify to scale their operations"
          />
          <EditableElement
            id="cta-button"
            type="button"
            size="lg"
            variant="secondary"
            className="px-8 py-3 text-lg"
            isSelected={selectedElement === "cta-button"}
            onSelect={onElementSelect}
            defaultContent="Start Your Free Trial"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <EditableElement
                id="footer-logo"
                type="text"
                className="text-xl font-bold mb-4"
                isSelected={selectedElement === "footer-logo"}
                onSelect={onElementSelect}
                defaultContent="SaaSify"
              />
              <EditableElement
                id="footer-description"
                type="text"
                className="text-gray-400"
                isSelected={selectedElement === "footer-description"}
                onSelect={onElementSelect}
                defaultContent="Empowering businesses with smart SaaS solutions since 2020."
              />
            </div>
            <div>
              <EditableElement
                id="footer-product-title"
                type="text"
                className="font-semibold mb-4"
                isSelected={selectedElement === "footer-product-title"}
                onSelect={onElementSelect}
                defaultContent="Product"
              />
              <div className="space-y-2">
                <EditableElement
                  id="footer-features"
                  type="text"
                  className="text-gray-400 hover:text-white cursor-pointer"
                  isSelected={selectedElement === "footer-features"}
                  onSelect={onElementSelect}
                  defaultContent="Features"
                />
                <EditableElement
                  id="footer-pricing-link"
                  type="text"
                  className="text-gray-400 hover:text-white cursor-pointer"
                  isSelected={selectedElement === "footer-pricing-link"}
                  onSelect={onElementSelect}
                  defaultContent="Pricing"
                />
              </div>
            </div>
            <div>
              <EditableElement
                id="footer-company-title"
                type="text"
                className="font-semibold mb-4"
                isSelected={selectedElement === "footer-company-title"}
                onSelect={onElementSelect}
                defaultContent="Company"
              />
              <div className="space-y-2">
                <EditableElement
                  id="footer-about-link"
                  type="text"
                  className="text-gray-400 hover:text-white cursor-pointer"
                  isSelected={selectedElement === "footer-about-link"}
                  onSelect={onElementSelect}
                  defaultContent="About"
                />
                <EditableElement
                  id="footer-contact"
                  type="text"
                  className="text-gray-400 hover:text-white cursor-pointer"
                  isSelected={selectedElement === "footer-contact"}
                  onSelect={onElementSelect}
                  defaultContent="Contact"
                />
              </div>
            </div>
            <div>
              <EditableElement
                id="footer-support-title"
                type="text"
                className="font-semibold mb-4"
                isSelected={selectedElement === "footer-support-title"}
                onSelect={onElementSelect}
                defaultContent="Support"
              />
              <div className="space-y-2">
                <EditableElement
                  id="footer-help"
                  type="text"
                  className="text-gray-400 hover:text-white cursor-pointer"
                  isSelected={selectedElement === "footer-help"}
                  onSelect={onElementSelect}
                  defaultContent="Help Center"
                />
                <EditableElement
                  id="footer-docs"
                  type="text"
                  className="text-gray-400 hover:text-white cursor-pointer"
                  isSelected={selectedElement === "footer-docs"}
                  onSelect={onElementSelect}
                  defaultContent="Documentation"
                />
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <EditableElement
              id="footer-copyright"
              type="text"
              className="text-gray-400"
              isSelected={selectedElement === "footer-copyright"}
              onSelect={onElementSelect}
              defaultContent="© 2024 SaaSify. All rights reserved."
            />
          </div>
        </div>
      </footer>
    </div>
  )
}

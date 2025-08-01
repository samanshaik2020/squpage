"use client"
import { Card } from "@/components/ui/card"
import { EditableElement } from "../editable-element"

interface SeptiCleanTemplateProps {
  selectedElement: string | null
  onElementSelect: (elementId: string) => void
}

export function SeptiCleanTemplate({ selectedElement, onElementSelect }: SeptiCleanTemplateProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <EditableElement
              id="nav-logo"
              type="text"
              className="text-xl font-bold text-blue-600"
              isSelected={selectedElement === "nav-logo"}
              onSelect={onElementSelect}
              defaultContent="SeptiClean"
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
                id="nav-testimonials"
                type="text"
                className="text-gray-600 hover:text-gray-900 cursor-pointer"
                isSelected={selectedElement === "nav-testimonials"}
                onSelect={onElementSelect}
                defaultContent="Testimonials"
              />
              <EditableElement
                id="nav-cta"
                type="button"
                className="bg-blue-600 text-white px-4 py-2 rounded"
                isSelected={selectedElement === "nav-cta"}
                onSelect={onElementSelect}
                defaultContent="Get Started"
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gray-500 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <EditableElement
                id="hero-title"
                type="heading"
                className="text-4xl md:text-5xl font-bold mb-6"
                isSelected={selectedElement === "hero-title"}
                onSelect={onElementSelect}
                defaultContent="The Hidden Danger In Your Septic Tank!"
              />

              <EditableElement
                id="hero-subtitle"
                type="text"
                className="text-xl mb-8"
                isSelected={selectedElement === "hero-subtitle"}
                onSelect={onElementSelect}
                defaultContent="Protect Your Family and Home from Harmful Contaminants."
              />

              <EditableElement
                id="hero-cta"
                type="button"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors mb-4"
                isSelected={selectedElement === "hero-cta"}
                onSelect={onElementSelect}
                defaultContent="Get Your Tiny Tab Now! →"
              />

              <EditableElement
                id="hero-disclaimer"
                type="text"
                className="text-sm text-gray-300"
                isSelected={selectedElement === "hero-disclaimer"}
                onSelect={onElementSelect}
                defaultContent="(No sign-up required. Limited time access only!)"
              />
            </div>
            <div className="relative">
              <EditableElement
                id="hero-product-image"
                type="image"
                className="w-full h-80 bg-gray-300 rounded-lg shadow-xl"
                isSelected={selectedElement === "hero-product-image"}
                onSelect={onElementSelect}
                defaultContent="/placeholder.svg?height=320&width=400&text=SeptiClean+Product"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Breakthrough Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <EditableElement
              id="breakthrough-title"
              type="heading"
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
              isSelected={selectedElement === "breakthrough-title"}
              onSelect={onElementSelect}
              defaultContent="A Breakthrough in Septic System Maintenance"
            />

            <EditableElement
              id="breakthrough-description"
              type="text"
              className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed"
              isSelected={selectedElement === "breakthrough-description"}
              onSelect={onElementSelect}
              defaultContent="A team of 14 scientists from a leading U.S. university has developed a tiny but powerful flushable tab that helps break down waste, reduce sludge buildup, and neutralize odors—keeping your septic system clean and efficient!"
            />
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <EditableElement
                id="breakthrough-image"
                type="image"
                className="w-full h-80 bg-gray-300 rounded-lg flex items-center justify-center"
                isSelected={selectedElement === "breakthrough-image"}
                onSelect={onElementSelect}
                defaultContent="/placeholder.svg?height=320&width=480&text=Septic+Tank+Image"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <svg className="w-6 h-6 text-blue-600 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <EditableElement
                id="breakthrough-feature-image"
                type="image"
                className="w-full h-40 bg-gray-200 rounded-lg"
                isSelected={selectedElement === "breakthrough-feature-image"}
                onSelect={onElementSelect}
                defaultContent="/placeholder.svg?height=160&width=400&text=Before+After+Comparison"
              />
              <EditableElement
                id="breakthrough-scientist-image"
                type="image"
                className="w-full h-40 bg-gray-200 rounded-lg"
                isSelected={selectedElement === "breakthrough-scientist-image"}
                onSelect={onElementSelect}
                defaultContent="/placeholder.svg?height=160&width=400&text=Scientists+Team"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Switch Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <EditableElement
              id="switch-title"
              type="heading"
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
              isSelected={selectedElement === "switch-title"}
              onSelect={onElementSelect}
              defaultContent="Why Homeowners Are Making the Switch"
            />

            <EditableElement
              id="switch-subtitle"
              type="text"
              className="text-lg text-gray-600 max-w-2xl mx-auto"
              isSelected={selectedElement === "switch-subtitle"}
              onSelect={onElementSelect}
              defaultContent="Over 21,374 homeowners have already switched to this simple monthly trick to help maintain their septic system and avoid costly pump-outs!"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-8 border-0 shadow-lg">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <EditableElement
                id="feature-1-title"
                type="text"
                className="text-xl font-semibold text-gray-900 mb-4"
                isSelected={selectedElement === "feature-1-title"}
                onSelect={onElementSelect}
                defaultContent="Easy to Use"
              />
              <EditableElement
                id="feature-1-description"
                type="text"
                className="text-gray-600"
                isSelected={selectedElement === "feature-1-description"}
                onSelect={onElementSelect}
                defaultContent="Just flush it! It's that simple to start protecting your system."
              />
            </Card>

            <Card className="text-center p-8 border-0 shadow-lg">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <EditableElement
                id="feature-2-title"
                type="text"
                className="text-xl font-semibold text-gray-900 mb-4"
                isSelected={selectedElement === "feature-2-title"}
                onSelect={onElementSelect}
                defaultContent="Prevents Problems"
              />
              <EditableElement
                id="feature-2-description"
                type="text"
                className="text-gray-600"
                isSelected={selectedElement === "feature-2-description"}
                onSelect={onElementSelect}
                defaultContent="Helps prevent odors, clogs, and nasty backups effectively."
              />
            </Card>

            <Card className="text-center p-8 border-0 shadow-lg">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
              </div>
              <EditableElement
                id="feature-3-title"
                type="text"
                className="text-xl font-semibold text-gray-900 mb-4"
                isSelected={selectedElement === "feature-3-title"}
                onSelect={onElementSelect}
                defaultContent="Join Happy Customers"
              />
              <EditableElement
                id="feature-3-description"
                type="text"
                className="text-gray-600"
                isSelected={selectedElement === "feature-3-description"}
                onSelect={onElementSelect}
                defaultContent="Become one of the thousands enjoying a worry-free septic system."
              />
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <EditableElement
              id="testimonials-title"
              type="heading"
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
              isSelected={selectedElement === "testimonials-title"}
              onSelect={onElementSelect}
              defaultContent="What People Are Experiencing"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 border-0 shadow-lg">
              <div className="flex items-center mb-4">
                <EditableElement
                  id="testimonial-1-avatar"
                  type="image"
                  className="w-16 h-16 rounded-full mr-4"
                  isSelected={selectedElement === "testimonial-1-avatar"}
                  onSelect={onElementSelect}
                  defaultContent="/placeholder.svg?height=64&width=64&text=Sarah+J"
                />
                <div>
                  <EditableElement
                    id="testimonial-1-name"
                    type="text"
                    className="font-semibold text-gray-900"
                    isSelected={selectedElement === "testimonial-1-name"}
                    onSelect={onElementSelect}
                    defaultContent="Sarah J."
                  />
                  <EditableElement
                    id="testimonial-1-location"
                    type="text"
                    className="text-sm text-gray-500"
                    isSelected={selectedElement === "testimonial-1-location"}
                    onSelect={onElementSelect}
                    defaultContent="Texas"
                  />
                </div>
              </div>
              <EditableElement
                id="testimonial-1-content"
                type="text"
                className="text-gray-600 italic text-lg"
                isSelected={selectedElement === "testimonial-1-content"}
                onSelect={onElementSelect}
                defaultContent="I was skeptical at first, but after just a month, the foul odor from my drain field is completely gone. I'm a believer!"
              />
            </Card>

            <Card className="p-8 border-0 shadow-lg">
              <div className="flex items-center mb-4">
                <EditableElement
                  id="testimonial-2-avatar"
                  type="image"
                  className="w-16 h-16 rounded-full mr-4"
                  isSelected={selectedElement === "testimonial-2-avatar"}
                  onSelect={onElementSelect}
                  defaultContent="/placeholder.svg?height=64&width=64&text=Mike+R"
                />
                <div>
                  <EditableElement
                    id="testimonial-2-name"
                    type="text"
                    className="font-semibold text-gray-900"
                    isSelected={selectedElement === "testimonial-2-name"}
                    onSelect={onElementSelect}
                    defaultContent="Mike R."
                  />
                  <EditableElement
                    id="testimonial-2-location"
                    type="text"
                    className="text-sm text-gray-500"
                    isSelected={selectedElement === "testimonial-2-location"}
                    onSelect={onElementSelect}
                    defaultContent="Florida"
                  />
                </div>
              </div>
              <EditableElement
                id="testimonial-2-content"
                type="text"
                className="text-gray-600 italic text-lg"
                isSelected={selectedElement === "testimonial-2-content"}
                onSelect={onElementSelect}
                defaultContent="We used to get backups every few years. Since we started using these tabs, we haven't had a single issue. Saved us thousands in plumbing bills!"
              />
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <EditableElement
            id="final-cta-title"
            type="heading"
            className="text-3xl md:text-4xl font-bold mb-6"
            isSelected={selectedElement === "final-cta-title"}
            onSelect={onElementSelect}
            defaultContent="Don't Wait Until It's Too Late!"
          />

          <EditableElement
            id="final-cta-subtitle"
            type="text"
            className="text-xl mb-8"
            isSelected={selectedElement === "final-cta-subtitle"}
            onSelect={onElementSelect}
            defaultContent="Protect your property, your family, and your wallet. Secure your septic system's health today."
          />

          <EditableElement
            id="final-cta-button"
            type="button"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
            isSelected={selectedElement === "final-cta-button"}
            onSelect={onElementSelect}
            defaultContent="Get Your Tiny Tab Now! →"
          />

          <EditableElement
            id="final-cta-disclaimer"
            type="text"
            className="text-sm mt-4 text-blue-200"
            isSelected={selectedElement === "final-cta-disclaimer"}
            onSelect={onElementSelect}
            defaultContent="*Limited time offer. Act now!"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center space-x-6 mb-4">
            <EditableElement
              id="footer-terms"
              type="text"
              className="text-gray-400 hover:text-white cursor-pointer text-sm"
              isSelected={selectedElement === "footer-terms"}
              onSelect={onElementSelect}
              defaultContent="Terms of Service"
            />
            <EditableElement
              id="footer-privacy"
              type="text"
              className="text-gray-400 hover:text-white cursor-pointer text-sm"
              isSelected={selectedElement === "footer-privacy"}
              onSelect={onElementSelect}
              defaultContent="Privacy Policy"
            />
          </div>

          <EditableElement
            id="footer-copyright"
            type="text"
            className="text-gray-400 text-sm mb-4"
            isSelected={selectedElement === "footer-copyright"}
            onSelect={onElementSelect}
            defaultContent="© 2025. All Rights Reserved."
          />

          <EditableElement
            id="footer-disclaimer"
            type="text"
            className="text-gray-500 text-xs leading-relaxed max-w-4xl mx-auto"
            isSelected={selectedElement === "footer-disclaimer"}
            onSelect={onElementSelect}
            defaultContent="This site is not affiliated with, sponsored by, or endorsed by Google Inc. or Google.com. YouTube is a trademark of Google Inc. All trademarks & logos are properties of their respective owners. This website is provided by a qualified professional before implementing any strategies discussed on this website."
          />
        </div>
      </footer>
    </div>
  )
}

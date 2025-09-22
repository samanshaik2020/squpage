"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { TemplateEditableElement } from "./template-editable-element"
import { useTemplateEditor } from "@/lib/template-editor-context" // Import useTemplateEditor

interface EbookLandingTemplateProps {
  selectedElement: string | null
  onElementSelect: (elementId: string) => void
  isEditable: boolean
}

export function EbookLandingTemplate({ selectedElement, onElementSelect, isEditable }: EbookLandingTemplateProps) {
  const { elements } = useTemplateEditor() // Get elements from template editor context

  // Find the hero section element to get its background URL
  const heroSectionElement = elements.find((el) => el.id === "hero-section")
  const heroBackgroundUrl = heroSectionElement?.url || "/images/ebook-bg.png" // Use URL from state or default

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl rounded-xl shadow-lg overflow-hidden bg-white">
        <CardContent className="p-0">
          {/* Hero Section */}
          <TemplateEditableElement
            id="hero-section" // ID for the entire hero section
            type="section" // New type for sections
            className="relative p-8 md:p-12 text-center text-white rounded-t-xl"
            isSelected={selectedElement === "hero-section"}
            onSelect={onElementSelect}
            defaultContent="" // Not used for sections, but required by prop
            isEditable={isEditable}
            url={heroBackgroundUrl} // Pass the background URL to TemplateEditableElement
            style={{
              backgroundImage: `url('${heroBackgroundUrl}')`, // Use dynamic URL
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Overlay */}
            <div className="absolute inset-0 bg-[#6A3E8C] opacity-90 rounded-t-xl"></div>
            <div className="relative z-10 flex flex-col items-center">
              <TemplateEditableElement
                id="hero-title"
                type="heading"
                className="text-3xl md:text-4xl font-bold mb-4 leading-tight"
                isSelected={selectedElement === "hero-title"}
                onSelect={onElementSelect}
                defaultContent="Unlock Your Dreams with This Free Manifestation eBook!"
                isEditable={isEditable}
              />
              <TemplateEditableElement
                id="hero-subtitle"
                type="text"
                className="text-base md:text-lg mb-8 max-w-md"
                isSelected={selectedElement === "hero-subtitle"}
                onSelect={onElementSelect}
                defaultContent="Learn the 3 secrets to manifesting wealth and happiness. Get your free copy now!"
                isEditable={isEditable}
              />
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md">
                <div className="relative flex-1 w-full">
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <Input
                    id="email-input"
                    type="email"
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    readOnly={!isEditable} // Make input read-only in preview
                  />
                </div>
                <TemplateEditableElement
                  id="hero-cta-button"
                  type="button"
                  className="bg-[#8A5BBF] hover:bg-[#7A4BAA] text-white px-6 py-3 rounded-lg font-semibold transition-colors w-full sm:w-auto"
                  isSelected={selectedElement === "hero-cta-button"}
                  onSelect={onElementSelect}
                  defaultContent="Get My Free eBook!"
                  isEditable={isEditable}
                />
              </div>
            </div>
          </TemplateEditableElement>

          {/* What's Inside Section */}
          <div className="p-8 md:p-12">
            <TemplateEditableElement
              id="whats-inside-title"
              type="text"
              className="text-lg font-semibold text-gray-900 mb-6"
              isSelected={selectedElement === "whats-inside-title"}
              onSelect={onElementSelect}
              defaultContent="What's Inside"
              isEditable={isEditable}
            />
            <div className="grid md:grid-cols-3 gap-4">
              {[
                {
                  id: "feature-1",
                  icon: (
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5s3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18s-3.332.477-4.5 1.253"
                      />
                    </svg>
                  ),
                  content: "Manifestation Mindset Secrets",
                },
                {
                  id: "feature-2",
                  icon: (
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  ),
                  content: "Visualization Techniques",
                },
                {
                  id: "feature-3",
                  icon: (
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  ),
                  content: "Daily Affirmations",
                },
              ].map((feature) => (
                <Card
                  key={feature.id}
                  className="p-4 flex items-center space-x-3 border border-gray-200 rounded-lg shadow-sm"
                >
                  {feature.icon}
                  <TemplateEditableElement
                    id={feature.id}
                    type="text"
                    className="text-sm font-medium text-gray-800"
                    isSelected={selectedElement === feature.id}
                    onSelect={onElementSelect}
                    defaultContent={feature.content}
                    isEditable={isEditable}
                  />
                </Card>
              ))}
            </div>
          </div>

          {/* Testimonial and Footer */}
          <div className="p-8 md:p-12 pt-0 text-center">
            <TemplateEditableElement
              id="testimonial-title"
              type="text"
              className="text-lg font-semibold text-gray-900 mb-4"
              isSelected={selectedElement === "testimonial-title"}
              onSelect={onElementSelect}
              defaultContent="Testimonial"
              isEditable={isEditable}
            />
            <TemplateEditableElement
              id="testimonial-quote"
              type="text"
              className="text-gray-600 italic mb-2"
              isSelected={selectedElement === "testimonial-quote"}
              onSelect={onElementSelect}
              defaultContent={'"Changed my life in 30 days!" - Sarah M.'}
              isEditable={isEditable}
            />
            <TemplateEditableElement
              id="copies-left"
              type="text"
              className="text-sm text-gray-500 mb-6"
              isSelected={selectedElement === "copies-left"}
              onSelect={onElementSelect}
              defaultContent="Only 100 copies left today!"
              isEditable={isEditable}
            />
            <div className="flex flex-col space-y-2 text-sm">
              <TemplateEditableElement
                id="affiliate-disclosure"
                type="text"
                className="text-blue-600 hover:underline cursor-pointer"
                isSelected={selectedElement === "affiliate-disclosure"}
                onSelect={onElementSelect}
                defaultContent="Affiliate Disclosure"
                isEditable={isEditable}
              />
              <TemplateEditableElement
                id="privacy-policy"
                type="text"
                className="text-blue-600 hover:underline cursor-pointer"
                isSelected={selectedElement === "privacy-policy"}
                onSelect={onElementSelect}
                defaultContent="Privacy Policy"
                isEditable={isEditable}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

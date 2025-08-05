"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { EditableElement } from "../editable-element"

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
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex-1 text-center md:text-left">
            <EditableElement
              id="product-title"
              type="heading"
              className="text-4xl md:text-6xl font-bold text-gray-900 mb-4 leading-tight"
              isSelected={selectedElement === "product-title"}
              onSelect={onElementSelect}
              defaultContent="Your Amazing Product"
              isEditable={isEditable}
            />
            <EditableElement
              id="product-tagline"
              type="text"
              className="text-xl md:text-2xl text-gray-600 mb-8"
              isSelected={selectedElement === "product-tagline"}
              onSelect={onElementSelect}
              defaultContent="A short, memorable tagline that highlights the main value proposition"
              isEditable={isEditable}
            />
            <EditableElement
              id="product-cta"
              type="button"
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:text-lg"
              isSelected={selectedElement === "product-cta"}
              onSelect={onElementSelect}
              defaultContent="Get Started"
              isEditable={isEditable}
            />
          </div>
          <div className="flex-1">
            <EditableElement
              id="product-image"
              type="image"
              className="w-full h-64 md:h-96 bg-gray-200 rounded-lg object-cover shadow-xl"
              isSelected={selectedElement === "product-image"}
              onSelect={onElementSelect}
              defaultContent="/placeholder.svg?height=400&width=600&text=Product+Image"
              isEditable={isEditable}
            />
          </div>
        </div>
      </section>

      {/* Description Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white rounded-lg shadow-md">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">About the Product</h2>
          <EditableElement
            id="product-description"
            type="text"
            className="text-lg text-gray-600 mb-8"
            isSelected={selectedElement === "product-description"}
            onSelect={onElementSelect}
            defaultContent="A compelling 2-3 sentence description that explains what the product is and its main benefits. This should be concise yet informative, highlighting the unique selling points."
            isEditable={isEditable}
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Key Features</h2>
          <p className="text-lg text-gray-600">Discover what makes our product stand out</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <EditableElement
                id="product-feature-1"
                type="heading"
                className="text-xl font-semibold text-gray-900 mb-2"
                isSelected={selectedElement === "product-feature-1"}
                onSelect={onElementSelect}
                defaultContent="Feature One"
                isEditable={isEditable}
              />
              <EditableElement
                id="product-feature-1-desc"
                type="text"
                className="text-gray-600"
                isSelected={selectedElement === "product-feature-1-desc"}
                onSelect={onElementSelect}
                defaultContent="Description of the first key feature and how it benefits the user."
                isEditable={isEditable}
              />
            </CardContent>
          </Card>

          <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <EditableElement
                id="product-feature-2"
                type="heading"
                className="text-xl font-semibold text-gray-900 mb-2"
                isSelected={selectedElement === "product-feature-2"}
                onSelect={onElementSelect}
                defaultContent="Feature Two"
                isEditable={isEditable}
              />
              <EditableElement
                id="product-feature-2-desc"
                type="text"
                className="text-gray-600"
                isSelected={selectedElement === "product-feature-2-desc"}
                onSelect={onElementSelect}
                defaultContent="Description of the second key feature and how it benefits the user."
                isEditable={isEditable}
              />
            </CardContent>
          </Card>

          <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <EditableElement
                id="product-feature-3"
                type="heading"
                className="text-xl font-semibold text-gray-900 mb-2"
                isSelected={selectedElement === "product-feature-3"}
                onSelect={onElementSelect}
                defaultContent="Feature Three"
                isEditable={isEditable}
              />
              <EditableElement
                id="product-feature-3-desc"
                type="text"
                className="text-gray-600"
                isSelected={selectedElement === "product-feature-3-desc"}
                onSelect={onElementSelect}
                defaultContent="Description of the third key feature and how it benefits the user."
                isEditable={isEditable}
              />
            </CardContent>
          </Card>

          <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <EditableElement
                id="product-feature-4"
                type="heading"
                className="text-xl font-semibold text-gray-900 mb-2"
                isSelected={selectedElement === "product-feature-4"}
                onSelect={onElementSelect}
                defaultContent="Feature Four"
                isEditable={isEditable}
              />
              <EditableElement
                id="product-feature-4-desc"
                type="text"
                className="text-gray-600"
                isSelected={selectedElement === "product-feature-4-desc"}
                onSelect={onElementSelect}
                defaultContent="Description of the fourth key feature and how it benefits the user."
                isEditable={isEditable}
              />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center bg-blue-50 rounded-lg">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Get Started?</h2>
        <EditableElement
          id="product-cta-description"
          type="text"
          className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto"
          isSelected={selectedElement === "product-cta-description"}
          onSelect={onElementSelect}
          defaultContent="Experience the benefits of our product today. Click below to begin your journey."
          isEditable={isEditable}
        />
        <EditableElement
          id="product-cta-button"
          type="button"
          className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:text-lg"
          isSelected={selectedElement === "product-cta-button"}
          onSelect={onElementSelect}
          defaultContent="Get Started Now"
          isEditable={isEditable}
        />
      </section>
    </div>
  )
}

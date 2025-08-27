"use client"
import { Card, CardContent } from "@/components/ui/card"
import { TemplateEditableElement } from "./template-editable-element"

interface AIGeneratedBlogPostTemplateProps {
  selectedElement: string | null
  onElementSelect: (elementId: string) => void
  isEditable: boolean
}

export function AIGeneratedBlogPostTemplate({
  selectedElement,
  onElementSelect,
  isEditable,
}: AIGeneratedBlogPostTemplateProps) {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <CardContent className="p-8 md:p-12">
          {/* Blog Post Header */}
          <div className="text-center mb-10">
            <TemplateEditableElement
              id="blog-title"
              type="heading"
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight"
              isSelected={selectedElement === "blog-title"}
              onSelect={onElementSelect}
              defaultContent="AI-Generated Blog Post Title"
              isEditable={isEditable}
            />
            <TemplateEditableElement
              id="blog-intro"
              type="text"
              className="text-lg text-gray-600 max-w-2xl mx-auto"
              isSelected={selectedElement === "blog-intro"}
              onSelect={onElementSelect}
              defaultContent="This is an introductory paragraph for your AI-generated blog post. It sets the stage for the topic and hooks the reader."
              isEditable={isEditable}
            />
          </div>

          {/* Featured Image */}
          <div className="mb-10">
            <TemplateEditableElement
              id="blog-image"
              type="image"
              className="w-full h-64 md:h-80 bg-gray-200 rounded-lg object-cover"
              isSelected={selectedElement === "blog-image"}
              onSelect={onElementSelect}
              defaultContent="/placeholder.svg?height=320&width=640&text=Blog+Featured+Image"
              isEditable={isEditable}
            />
          </div>

          {/* Blog Content */}
          <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
            <TemplateEditableElement
              id="blog-paragraph-1"
              type="text"
              className="text-base leading-relaxed"
              isSelected={selectedElement === "blog-paragraph-1"}
              onSelect={onElementSelect}
              defaultContent="The first main paragraph of your blog post. This section will delve into the core aspects of your topic, providing initial insights and details. The AI will fill this with relevant information."
              isEditable={isEditable}
            />
            <TemplateEditableElement
              id="blog-paragraph-2"
              type="text"
              className="text-base leading-relaxed"
              isSelected={selectedElement === "blog-paragraph-2"}
              onSelect={onElementSelect}
              defaultContent="Moving on to the second paragraph, here we can expand on a specific point or introduce a new sub-topic related to the main theme. This helps in building a comprehensive narrative."
              isEditable={isEditable}
            />
            <TemplateEditableElement
              id="blog-paragraph-3"
              type="text"
              className="text-base leading-relaxed"
              isSelected={selectedElement === "blog-paragraph-3"}
              onSelect={onElementSelect}
              defaultContent="Finally, the third paragraph can offer further examples, data, or a different perspective to enrich the content. It aims to provide a well-rounded discussion before the conclusion."
              isEditable={isEditable}
            />
          </div>

          {/* Conclusion */}
          <div className="mt-10 text-center">
            <TemplateEditableElement
              id="blog-conclusion"
              type="text"
              className="text-lg text-gray-600 max-w-2xl mx-auto"
              isSelected={selectedElement === "blog-conclusion"}
              onSelect={onElementSelect}
              defaultContent="In conclusion, this AI-generated content aims to provide a quick and effective way to populate your blog posts with relevant and engaging text, saving you time and effort."
              isEditable={isEditable}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

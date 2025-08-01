"use client"

import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Type, ImageIcon, Square, MousePointer, Layout, Star, Users, Mail } from "lucide-react"

const elementCategories = [
  {
    name: "Basic",
    elements: [
      { id: "text", name: "Text", icon: Type, description: "Add headings and paragraphs" },
      { id: "image", name: "Image", icon: ImageIcon, description: "Add images and photos" },
      { id: "button", name: "Button", icon: Square, description: "Call-to-action buttons" },
      { id: "divider", name: "Divider", icon: MousePointer, description: "Section separators" },
    ],
  },
  {
    name: "Sections",
    elements: [
      { id: "hero", name: "Hero", icon: Layout, description: "Hero section with title and CTA" },
      { id: "features", name: "Features", icon: Star, description: "Feature grid or list" },
      { id: "testimonials", name: "Testimonials", icon: Users, description: "Customer testimonials" },
      { id: "contact", name: "Contact", icon: Mail, description: "Contact form and info" },
    ],
  },
]

export function ElementsPanel() {
  const handleDragStart = (e: React.DragEvent, elementType: string) => {
    e.dataTransfer.setData("text/plain", elementType)
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-900">Elements</h2>
        <p className="text-sm text-gray-600">Drag elements to add them to your page</p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {elementCategories.map((category) => (
            <div key={category.name}>
              <h3 className="text-sm font-medium text-gray-700 mb-3 uppercase tracking-wide">{category.name}</h3>
              <div className="grid grid-cols-2 gap-2">
                {category.elements.map((element) => (
                  <Card
                    key={element.id}
                    className="cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow border-dashed border-2 border-gray-200 hover:border-blue-300"
                    draggable
                    onDragStart={(e) => handleDragStart(e, element.id)}
                  >
                    <CardContent className="p-3 text-center">
                      <element.icon className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                      <div className="text-xs font-medium text-gray-900 mb-1">{element.name}</div>
                      <div className="text-xs text-gray-500 leading-tight">{element.description}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

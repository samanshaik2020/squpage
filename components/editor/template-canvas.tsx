"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Monitor, Tablet, Smartphone } from "lucide-react"

interface TemplateCanvasProps {
  templateId: string
  selectedElement: string | null
  onElementSelect: (elementId: string | null) => void
}

export function TemplateCanvas({ templateId, selectedElement, onElementSelect }: TemplateCanvasProps) {
  const [viewMode, setViewMode] = useState<"desktop" | "tablet" | "mobile">("desktop")

  const getCanvasWidth = () => {
    switch (viewMode) {
      case "desktop":
        return "100%"
      case "tablet":
        return "768px"
      case "mobile":
        return "375px"
      default:
        return "100%"
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const elementType = e.dataTransfer.getData("text/plain")
    console.log("Dropped element:", elementType)
    // Here you would add the element to your template
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  return (
    <div className="h-full flex flex-col">
      {/* Canvas Controls */}
      <div className="h-12 bg-gray-100 border-b flex items-center justify-center space-x-2">
        <Button variant={viewMode === "desktop" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("desktop")}>
          <Monitor className="w-4 h-4" />
        </Button>
        <Button variant={viewMode === "tablet" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("tablet")}>
          <Tablet className="w-4 h-4" />
        </Button>
        <Button variant={viewMode === "mobile" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("mobile")}>
          <Smartphone className="w-4 h-4" />
        </Button>
      </div>

      {/* Canvas */}
      <div className="flex-1 bg-gray-100 p-8 overflow-auto">
        <div
          className="mx-auto bg-white shadow-lg min-h-full transition-all duration-300"
          style={{ width: getCanvasWidth(), maxWidth: "100%" }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {/* Sample Template Content */}
          <div className="p-8">
            <div
              className={`border-2 border-dashed border-transparent hover:border-blue-300 p-4 rounded cursor-pointer transition-colors ${
                selectedElement === "hero" ? "border-blue-500 bg-blue-50" : ""
              }`}
              onClick={() => onElementSelect("hero")}
            >
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to My Website</h1>
              <p className="text-xl text-gray-600 mb-6">This is a sample hero section that you can customize</p>
              <Button>Get Started</Button>
            </div>

            <div
              className={`border-2 border-dashed border-transparent hover:border-blue-300 p-4 rounded cursor-pointer transition-colors mt-8 ${
                selectedElement === "features" ? "border-blue-500 bg-blue-50" : ""
              }`}
              onClick={() => onElementSelect("features")}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Features</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="p-6 text-center">
                  <h3 className="text-lg font-semibold mb-2">Feature 1</h3>
                  <p className="text-gray-600">Description of feature 1</p>
                </Card>
                <Card className="p-6 text-center">
                  <h3 className="text-lg font-semibold mb-2">Feature 2</h3>
                  <p className="text-gray-600">Description of feature 2</p>
                </Card>
                <Card className="p-6 text-center">
                  <h3 className="text-lg font-semibold mb-2">Feature 3</h3>
                  <p className="text-gray-600">Description of feature 3</p>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

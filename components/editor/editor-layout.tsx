"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Eye, Save, Undo, Redo } from "lucide-react"
import Link from "next/link"
import { TemplateCanvas } from "./template-canvas"
import { ElementsPanel } from "./elements-panel"
import { PropertiesPanel } from "./properties-panel"

interface EditorLayoutProps {
  templateId: string
}

export function EditorLayout({ templateId }: EditorLayoutProps) {
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Top Bar */}
      <div className="h-16 bg-white border-b flex items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <Link href="/templates" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5" />
            <span>Templates</span>
          </Link>
          <div className="h-6 w-px bg-gray-300" />
          <h1 className="text-lg font-semibold text-gray-900">Editing Template #{templateId}</h1>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" disabled={!canUndo}>
            <Undo className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" disabled={!canRedo}>
            <Redo className="w-4 h-4" />
          </Button>
          <div className="h-6 w-px bg-gray-300" />
          <Button variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button size="sm">
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      {/* Main Editor */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Elements */}
        <div className="w-80 bg-white border-r flex flex-col">
          <ElementsPanel />
        </div>

        {/* Center Canvas */}
        <div className="flex-1 flex flex-col">
          <TemplateCanvas
            templateId={templateId}
            selectedElement={selectedElement}
            onElementSelect={setSelectedElement}
          />
        </div>

        {/* Right Panel - Properties */}
        <div className="w-80 bg-white border-l flex flex-col">
          <PropertiesPanel selectedElement={selectedElement} />
        </div>
      </div>
    </div>
  )
}

"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { SaasLandingTemplate } from "./templates/saas-landing"
import { PortfolioTemplate } from "./templates/portfolio"
import { SeptiCleanTemplate } from "./templates/septiclean"
import { EditingPanel } from "./editing-panel"
import { EditorProvider, useEditor } from "@/lib/editor-context"

interface CarrdEditorProps {
  templateId: string
}

export function CarrdEditor({ templateId }: CarrdEditorProps) {
  const [viewMode, setViewMode] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const editorRef = useRef<HTMLDivElement>(null)

  return (
    <EditorProvider>
      <CarrdEditorContent templateId={templateId} viewMode={viewMode} setViewMode={setViewMode} editorRef={editorRef} />
    </EditorProvider>
  )
}

function CarrdEditorContent({
  templateId,
  viewMode,
  setViewMode,
  editorRef,
}: {
  templateId: string
  viewMode: "desktop" | "tablet" | "mobile"
  setViewMode: React.Dispatch<React.SetStateAction<"desktop" | "tablet" | "mobile">>
  editorRef: React.RefObject<HTMLDivElement>
}) {
  const { selectedElement, selectElement, canUndo, canRedo, undo, redo } = useEditor()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement

      if (target.closest(".editing-panel")) {
        return
      }

      if (target.closest("[data-editable]")) {
        return
      }

      selectElement(null)
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [selectElement])

  const getViewportWidth = () => {
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

  const getTemplateName = () => {
    switch (templateId) {
      case "saas-landing":
        return "SaaS Landing"
      case "portfolio":
        return "Portfolio"
      case "septiclean":
        return "SeptiClean"
      default:
        return "Template"
    }
  }

  const renderTemplate = () => {
    const commonProps = {
      selectedElement,
      onElementSelect: selectElement,
      isEditable: true, // Pass isEditable as true for the editor
    }

    switch (templateId) {
      case "saas-landing":
        return <SaasLandingTemplate {...commonProps} />
      case "portfolio":
        return <PortfolioTemplate {...commonProps} />
      case "septiclean":
        return <SeptiCleanTemplate {...commonProps} />
      default:
        return <SaasLandingTemplate {...commonProps} />
    }
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Top Bar */}
      <div className="h-16 bg-white border-b flex items-center justify-between px-4 relative z-50">
        <div className="flex items-center space-x-4">
          <Link href="/templates" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Templates</span>
          </Link>
          <div className="h-6 w-px bg-gray-300" />
          <h1 className="text-lg font-semibold text-gray-900">Editing: {getTemplateName()}</h1>
        </div>

        <div className="flex items-center space-x-2">
          {/* Viewport Controls */}
          <div className="flex items-center space-x-1 mr-4">
            <Button
              variant={viewMode === "desktop" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("desktop")}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
            </Button>
            <Button
              variant={viewMode === "tablet" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("tablet")}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
                <line x1="12" y1="18" x2="12.01" y2="18" />
              </svg>
            </Button>
            <Button
              variant={viewMode === "mobile" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("mobile")}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                <line x1="12" y1="18" x2="12.01" y2="18" />
              </svg>
            </Button>
          </div>

          <Button variant="ghost" size="sm" disabled={!canUndo} onClick={undo}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
              />
            </svg>
          </Button>
          <Button variant="ghost" size="sm" disabled={!canRedo} onClick={redo}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 10h-10a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6"
              />
            </svg>
          </Button>
          <div className="h-6 w-px bg-gray-300" />
          <Link href={`/preview/${templateId}`}>
            <Button variant="outline" size="sm">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              Preview
            </Button>
          </Link>
          <Button size="sm">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            Save
          </Button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 relative overflow-auto" ref={editorRef}>
        <div className="min-h-full flex justify-center p-8">
          <div
            className="bg-white shadow-2xl transition-all duration-300 min-h-full"
            style={{ width: getViewportWidth(), maxWidth: "100%" }}
          >
            {renderTemplate()}
          </div>
        </div>

        {/* Editing Panel */}
        {selectedElement && <EditingPanel elementId={selectedElement} onClose={() => selectElement(null)} />}
      </div>
    </div>
  )
}

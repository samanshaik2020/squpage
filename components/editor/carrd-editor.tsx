"use client"

import type React from "react"
import { TemplateEditor } from "@/components/templates/template-editor"

interface CarrdEditorProps {
  templateId: string
}

export function CarrdEditor({ templateId }: CarrdEditorProps) {
  return <TemplateEditor templateId={templateId} />
}

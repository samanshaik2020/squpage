"use client"

import { use } from "react"
import { CarrdEditor } from "@/components/editor/carrd-editor"

interface EditorPageProps {
  params: Promise<{
    id: string
  }>
}

export default function EditorPage({ params }: EditorPageProps) {
  const resolvedParams = use(params)
  return <CarrdEditor templateId={resolvedParams.id} />
}

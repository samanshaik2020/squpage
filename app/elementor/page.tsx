"use client"

import { ElementorProvider } from "@/lib/elementor-context"
import { ProjectProvider } from "@/lib/project-context"
import { SimplifiedElementorEditor } from "@/components/editor/simplified-elementor-editor"
import { useSearchParams } from 'next/navigation'

export default function ElementorPage() {
  const searchParams = useSearchParams()
  const projectId = searchParams.get('projectId')

  return (
    <ProjectProvider>
      <ElementorProvider>
        <SimplifiedElementorEditor projectId={projectId || undefined} />
      </ElementorProvider>
    </ProjectProvider>
  )
}

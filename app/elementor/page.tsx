"use client"

import { ElementorProvider } from "@/lib/elementor-context"
import { SimplifiedElementorEditor } from "@/components/editor/simplified-elementor-editor"

export default function ElementorPage() {
  return (
    <ElementorProvider>
      <SimplifiedElementorEditor />
    </ElementorProvider>
  )
}

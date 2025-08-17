"use client"

import React from 'react'
import { SimplifiedElementorEditor } from '@/components/editor/simplified-elementor-editor'
import { ElementorProvider } from '@/lib/elementor-context'

export default function SimplifiedElementorPage() {
  return (
    <ElementorProvider>
      <SimplifiedElementorEditor />
    </ElementorProvider>
  )
}

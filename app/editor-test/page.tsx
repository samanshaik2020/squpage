"use client"

import React from 'react'
import { EditorTest } from '@/components/editor/editor-test'
import { ElementorProvider } from '@/lib/elementor-context'

export default function EditorTestPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">Squpage Editor Test</h1>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <ElementorProvider>
          <EditorTest />
        </ElementorProvider>
      </main>
    </div>
  )
}

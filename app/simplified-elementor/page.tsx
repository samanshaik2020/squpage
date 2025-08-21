"use client"

import React from 'react'
import { SimplifiedElementorEditor } from '@/components/editor/simplified-elementor-editor'
import { ElementorProvider } from '@/lib/elementor-context'
import { useSearchParams } from 'next/navigation'

export default function SimplifiedElementorPage() {
  const searchParams = useSearchParams();
  const isPremium = searchParams.get('premium') === 'true';
  
  return (
    <ElementorProvider>
      <SimplifiedElementorEditor isPremium={isPremium} />
    </ElementorProvider>
  )
}

"use client"

import React from 'react'
import { SimplifiedElementorEditor } from '@/components/editor/simplified-elementor-editor'
import { ElementorProvider } from '@/lib/elementor-context'
import { ProjectProvider } from '@/lib/project-context'
import { MarketingLeadGeneration } from '@/components/editor/marketing-lead-generation'
import { useSearchParams } from 'next/navigation'

export default function SimplifiedElementorPage() {
  const searchParams = useSearchParams();
  const isPremium = searchParams.get('premium') === 'true';
  const isMarketing = searchParams.get('marketing') === 'true';
  const projectId = searchParams.get('projectId');
  
  if (isMarketing) {
    return <MarketingLeadGeneration isPremium={isPremium} />
  }
  
  return (
    <ProjectProvider>
      <ElementorProvider>
        <SimplifiedElementorEditor isPremium={isPremium} projectId={projectId || undefined} />
      </ElementorProvider>
    </ProjectProvider>
  )
}

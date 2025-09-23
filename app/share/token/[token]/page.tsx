import { redirect } from 'next/navigation'
import { projectsStore } from '@/lib/projects-store-new'

// This page handles token-based shares and redirects to the slug-based route if available
export default async function SharedProjectTokenPage({ params }: { params: { token: string } }) {
  const token = params.token
  
  // Get project by token
  const project = await projectsStore.getByShareToken(token)
  
  // If not found, redirect to 404
  if (!project) {
    redirect('/404')
  }
  
  // If project has a slug, redirect to the slug-based URL for better UX
  if (project.shareSlug) {
    redirect(`/share/${project.shareSlug}`)
  }
  
  // Otherwise, redirect to the generic slug route with the token as the slug
  redirect(`/share/${token}`)
}

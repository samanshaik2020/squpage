"use client"

import { useEffect, useRef } from 'react'

interface UseAnalyticsTrackingOptions {
  pageId: string
  enabled?: boolean
  trackOnMount?: boolean
}

export function useAnalyticsTracking({ 
  pageId, 
  enabled = true, 
  trackOnMount = true 
}: UseAnalyticsTrackingOptions) {
  const hasTracked = useRef(false)

  const trackVisit = async () => {
    if (!enabled || !pageId || hasTracked.current) {
      return
    }

    try {
      const response = await fetch('/api/track-visit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pageId }),
      })

      if (response.ok) {
        hasTracked.current = true
        console.log('Visit tracked successfully')
      } else {
        console.warn('Failed to track visit:', response.statusText)
      }
    } catch (error) {
      console.error('Error tracking visit:', error)
    }
  }

  useEffect(() => {
    if (trackOnMount && enabled && pageId) {
      // Small delay to ensure page is fully loaded
      const timer = setTimeout(() => {
        trackVisit()
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [pageId, enabled, trackOnMount])

  return {
    trackVisit,
    hasTracked: hasTracked.current
  }
}
import { supabase, AnalyticsEvent, FormSubmission } from './supabase'

export const analyticsService = {
  // Track analytics event
  async trackEvent(data: {
    projectId: string
    shareLinkId?: string
    eventType: 'view' | 'click' | 'form_submit' | 'download'
    eventData?: any
    ipAddress?: string
    userAgent?: string
    referrer?: string
  }): Promise<void> {
    const { error } = await supabase
      .from('analytics_events')
      .insert({
        project_id: data.projectId,
        share_link_id: data.shareLinkId,
        event_type: data.eventType,
        event_data: data.eventData || {},
        ip_address: data.ipAddress,
        user_agent: data.userAgent,
        referrer: data.referrer
      })
    
    if (error) throw error
  },

  // Get analytics for project
  async getProjectAnalytics(projectId: string, days: number = 30): Promise<{
    views: number
    uniqueVisitors: number
    clicks: number
    conversions: number
    dailyStats: Array<{ date: string; views: number; clicks: number }>
    trafficSources: Array<{ source: string; count: number }>
  }> {
    const fromDate = new Date()
    fromDate.setDate(fromDate.getDate() - days)

    // Get all events for the period
    const { data: events, error } = await supabase
      .from('analytics_events')
      .select('*')
      .eq('project_id', projectId)
      .gte('created_at', fromDate.toISOString())
    
    if (error) throw error

    const views = events?.filter(e => e.event_type === 'view').length || 0
    const clicks = events?.filter(e => e.event_type === 'click').length || 0
    const conversions = events?.filter(e => e.event_type === 'form_submit').length || 0
    
    // Calculate unique visitors by IP
    const uniqueIPs = new Set(events?.map(e => e.ip_address).filter(Boolean))
    const uniqueVisitors = uniqueIPs.size

    // Daily stats
    const dailyStats = this.calculateDailyStats(events || [], days)
    
    // Traffic sources
    const trafficSources = this.calculateTrafficSources(events || [])

    return {
      views,
      uniqueVisitors,
      clicks,
      conversions,
      dailyStats,
      trafficSources
    }
  },

  // Submit form data
  async submitForm(data: {
    projectId: string
    formData: any
    ipAddress?: string
    userAgent?: string
    source?: string
  }): Promise<FormSubmission> {
    const { data: submission, error } = await supabase
      .from('form_submissions')
      .insert({
        project_id: data.projectId,
        form_data: data.formData,
        ip_address: data.ipAddress,
        user_agent: data.userAgent,
        source: data.source || 'Contact Form'
      })
      .select()
      .single()
    
    if (error) throw error

    // Track form submission event
    await this.trackEvent({
      projectId: data.projectId,
      eventType: 'form_submit',
      eventData: { source: data.source },
      ipAddress: data.ipAddress,
      userAgent: data.userAgent
    })

    return submission
  },

  // Get form submissions for project
  async getFormSubmissions(projectId: string): Promise<FormSubmission[]> {
    const { data, error } = await supabase
      .from('form_submissions')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  // Helper: Calculate daily stats
  calculateDailyStats(events: AnalyticsEvent[], days: number) {
    const stats: { [date: string]: { views: number; clicks: number } } = {}
    
    // Initialize all days
    for (let i = 0; i < days; i++) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      stats[dateStr] = { views: 0, clicks: 0 }
    }
    
    // Count events by day
    events.forEach(event => {
      const dateStr = event.created_at.split('T')[0]
      if (stats[dateStr]) {
        if (event.event_type === 'view') stats[dateStr].views++
        if (event.event_type === 'click') stats[dateStr].clicks++
      }
    })
    
    return Object.entries(stats)
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => a.date.localeCompare(b.date))
  },

  // Helper: Calculate traffic sources
  calculateTrafficSources(events: AnalyticsEvent[]) {
    const sources: { [source: string]: number } = {}
    
    events.filter(e => e.event_type === 'view').forEach(event => {
      const referrer = event.referrer || 'Direct'
      let source = 'Direct'
      
      if (referrer.includes('google')) source = 'Google'
      else if (referrer.includes('facebook')) source = 'Facebook'
      else if (referrer.includes('twitter')) source = 'Twitter'
      else if (referrer.includes('linkedin')) source = 'LinkedIn'
      else if (referrer !== 'Direct') source = 'Other'
      
      sources[source] = (sources[source] || 0) + 1
    })
    
    return Object.entries(sources)
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count)
  }
}

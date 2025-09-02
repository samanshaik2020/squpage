"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Eye, 
  Users, 
  MousePointer, 
  Target, 
  TrendingUp, 
  Clock,
  Globe,
  BarChart3,
  Calendar,
  ExternalLink
} from 'lucide-react'
import { RealTimeStats } from '@/components/analytics/real-time-stats'

interface ProjectAnalytics {
  views: number
  uniqueVisitors: number
  clicks: number
  conversions: number
  bounceRate: number
  avgSessionDuration: number
  topPages: { page: string; views: number }[]
  trafficSources: { source: string; visitors: number }[]
  dailyStats: { date: string; views: number; visitors: number }[]
}

interface Project {
  id: string
  name: string
  type: string
  status: string
  analytics?: ProjectAnalytics
}

export default function AnalyticsPage() {
  const params = useParams()
  const [project, setProject] = useState<Project | null>(null)
  const [analytics, setAnalytics] = useState<ProjectAnalytics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load project data
        const projectResponse = await fetch(`/api/projects/${params.id}`)
        if (!projectResponse.ok) {
          throw new Error('Failed to load project')
        }
        const { project } = await projectResponse.json()
        setProject(project)

        // Load analytics data from the new real-time endpoint
        const analyticsResponse = await fetch(`/api/get-analytics?pageId=${params.id}&days=30`)
        if (!analyticsResponse.ok) {
          throw new Error('Failed to load analytics')
        }
        const { analytics } = await analyticsResponse.json()
        setAnalytics(analytics)

      } catch (error) {
        console.error('Error loading data:', error)
        setError('Failed to load analytics data')
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      loadData()
    }
  }, [params.id])

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (error || !project || !analytics) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Analytics Not Available</h1>
          <p className="text-gray-600 mb-4">{error || 'Project not found'}</p>
          <Link href="/dashboard">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const conversionRate = analytics.uniqueVisitors > 0 ? (analytics.conversions / analytics.uniqueVisitors) * 100 : 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <div>
                <h1 className="text-lg font-semibold text-gray-900">{project.name}</h1>
                <p className="text-sm text-gray-500">Analytics Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge className={`${
                project.status === 'published' 
                  ? 'bg-green-100 text-green-800 border-green-200' 
                  : 'bg-yellow-100 text-yellow-800 border-yellow-200'
              }`}>
                {project.status}
              </Badge>
              <Button variant="outline" size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                View Site
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Views</p>
                  <p className="text-3xl font-bold text-gray-900">{analytics.views.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Eye className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Unique Visitors</p>
                  <p className="text-3xl font-bold text-gray-900">{analytics.uniqueVisitors.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Clicks</p>
                  <p className="text-3xl font-bold text-gray-900">{analytics.clicks.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                  <MousePointer className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Conversions</p>
                  <p className="text-3xl font-bold text-gray-900">{analytics.conversions}</p>
                  <p className="text-sm text-green-600 font-medium">{formatPercentage(conversionRate)} rate</p>
                </div>
                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Real-Time Stats */}
        <div className="mb-8">
          <RealTimeStats projectId={params.id as string} />
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-red-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Bounce Rate</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">{formatPercentage(analytics.bounceRate)}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Clock className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Avg. Session Duration</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">{formatDuration(analytics.avgSessionDuration)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Traffic Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.trafficSources.map((source, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{source.source}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-gray-900">{source.visitors}</span>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ 
                            width: `${(source.visitors / Math.max(...analytics.trafficSources.map(s => s.visitors))) * 100}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Pages */}
        <Card className="bg-white border border-gray-200 shadow-sm mb-8">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Top Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.topPages.map((page, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Globe className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{page.page}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{page.views} views</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Daily Stats Chart */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Daily Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.dailyStats.map((day, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">
                      {new Date(day.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Views</p>
                      <p className="text-sm font-bold text-gray-900">{day.views}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Visitors</p>
                      <p className="text-sm font-bold text-gray-900">{day.visitors}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
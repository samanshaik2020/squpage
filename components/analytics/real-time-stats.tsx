"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Eye, Users, Activity } from 'lucide-react'

interface RealTimeStatsProps {
  projectId: string
}

interface RealTimeData {
  currentVisitors: number
  todayVisits: number
  recentVisits: {
    timestamp: string
    location?: string
  }[]
}

export function RealTimeStats({ projectId }: RealTimeStatsProps) {
  const [realTimeData, setRealTimeData] = useState<RealTimeData>({
    currentVisitors: 0,
    todayVisits: 0,
    recentVisits: []
  })
  const [isLive, setIsLive] = useState(true)

  useEffect(() => {
    const fetchRealTimeData = async () => {
      try {
        const response = await fetch(`/api/get-analytics?pageId=${projectId}&days=1`)
        if (response.ok) {
          const { analytics } = await response.json()
          
          // Simulate real-time data
          const now = new Date()
          const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
          
          const todayStats = analytics.dailyStats.find((stat: any) => 
            stat.date === todayStart.toISOString().split('T')[0]
          )
          
          setRealTimeData({
            currentVisitors: Math.floor(Math.random() * 5) + 1, // 1-5 current visitors
            todayVisits: todayStats?.views || 0,
            recentVisits: [
              { timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(), location: 'New York, US' },
              { timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), location: 'London, UK' },
              { timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(), location: 'Tokyo, JP' },
            ]
          })
        }
      } catch (error) {
        console.error('Error fetching real-time data:', error)
      }
    }

    // Initial fetch
    fetchRealTimeData()

    // Update every 30 seconds
    const interval = setInterval(fetchRealTimeData, 30000)

    return () => clearInterval(interval)
  }, [projectId])

  const formatTimeAgo = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime()
    const minutes = Math.floor(diff / 60000)
    
    if (minutes < 1) return 'Just now'
    if (minutes === 1) return '1 minute ago'
    return `${minutes} minutes ago`
  }

  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">Real-Time Activity</CardTitle>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            <span className="text-xs text-gray-500">Live</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <Users className="w-4 h-4 text-blue-600 mr-1" />
              <span className="text-xs text-blue-600 font-medium">Active Now</span>
            </div>
            <div className="text-2xl font-bold text-blue-900">{realTimeData.currentVisitors}</div>
          </div>
          
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <Eye className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-xs text-green-600 font-medium">Today</span>
            </div>
            <div className="text-2xl font-bold text-green-900">{realTimeData.todayVisits}</div>
          </div>
        </div>

        {/* Recent Visits */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Activity className="w-4 h-4 mr-1" />
            Recent Visits
          </h4>
          <div className="space-y-2">
            {realTimeData.recentVisits.map((visit, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{visit.location || 'Unknown Location'}</span>
                <span className="text-gray-400">{formatTimeAgo(visit.timestamp)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Status Indicator */}
        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
            <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div>
            <span>Updates every 30 seconds</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
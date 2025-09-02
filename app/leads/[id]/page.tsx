"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Calendar, 
  User, 
  MessageSquare,
  ExternalLink,
  Filter,
  Search,
  Download,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  FileText,
  ChevronDown,
  ChevronRight
} from 'lucide-react'

interface ProjectLead {
  id: string
  projectId: string
  name: string
  email: string
  message?: string
  phone?: string
  source: string
  createdAt: string
  status: 'new' | 'contacted' | 'converted' | 'closed'
  formData?: { [key: string]: any }
  ipAddress?: string
  userAgent?: string
}

interface Project {
  id: string
  name: string
  type: string
  status: string
}

export default function LeadsPage() {
  const params = useParams()
  const [project, setProject] = useState<Project | null>(null)
  const [leads, setLeads] = useState<ProjectLead[]>([])
  const [filteredLeads, setFilteredLeads] = useState<ProjectLead[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [expandedLead, setExpandedLead] = useState<string | null>(null)

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

        // Load leads data from the new form submissions endpoint
        const leadsResponse = await fetch(`/api/get-leads?pageId=${params.id}&includeFormData=true`)
        if (!leadsResponse.ok) {
          throw new Error('Failed to load leads')
        }
        const { leads } = await leadsResponse.json()
        setLeads(leads)
        setFilteredLeads(leads)

      } catch (error) {
        console.error('Error loading data:', error)
        setError('Failed to load leads data')
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      loadData()
    }
  }, [params.id])

  // Filter leads based on search and status
  useEffect(() => {
    let filtered = leads

    if (searchQuery) {
      filtered = filtered.filter(lead => 
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (lead.message && lead.message.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(lead => lead.status === statusFilter)
    }

    setFilteredLeads(filtered)
  }, [leads, searchQuery, statusFilter])

  const handleUpdateLeadStatus = async (leadId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        const { lead } = await response.json()
        setLeads(prev => prev.map(l => l.id === leadId ? lead : l))
      }
    } catch (error) {
      console.error('Error updating lead status:', error)
    }
  }

  const handleDeleteLead = async (leadId: string) => {
    if (confirm('Are you sure you want to delete this lead?')) {
      try {
        const response = await fetch(`/api/leads/${leadId}`, {
          method: 'DELETE'
        })

        if (response.ok) {
          setLeads(prev => prev.filter(l => l.id !== leadId))
        }
      } catch (error) {
        console.error('Error deleting lead:', error)
      }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'contacted':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'converted':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'closed':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getLeadStats = () => {
    const total = leads.length
    const newLeads = leads.filter(l => l.status === 'new').length
    const contacted = leads.filter(l => l.status === 'contacted').length
    const converted = leads.filter(l => l.status === 'converted').length
    const conversionRate = total > 0 ? (converted / total) * 100 : 0

    return { total, newLeads, contacted, converted, conversionRate }
  }

  const stats = getLeadStats()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading leads...</p>
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Leads Not Available</h1>
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
                <p className="text-sm text-gray-500">Lead Management</p>
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
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Leads</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">New Leads</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.newLeads}</p>
                </div>
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Contacted</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.contacted}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Converted</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.converted}</p>
                  <p className="text-sm text-green-600 font-medium">{stats.conversionRate.toFixed(1)}% rate</p>
                </div>
                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                  <ExternalLink className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="bg-white border border-gray-200 shadow-sm mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search leads..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="converted">Converted</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              
              <p className="text-sm text-gray-600">
                Showing {filteredLeads.length} of {leads.length} leads
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Leads Table */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Leads</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {filteredLeads.length === 0 ? (
              <div className="p-12 text-center">
                <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No leads found</h3>
                <p className="text-gray-600">
                  {searchQuery || statusFilter !== 'all' 
                    ? "Try adjusting your search or filter criteria." 
                    : "Leads will appear here when visitors submit forms on your website."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Message
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Source
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredLeads.map((lead) => (
                      <>
                        <tr key={lead.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                              <div className="text-sm text-gray-500 flex items-center">
                                <Mail className="w-3 h-3 mr-1" />
                                {lead.email}
                              </div>
                              {lead.phone && (
                                <div className="text-sm text-gray-500 flex items-center">
                                  <Phone className="w-3 h-3 mr-1" />
                                  {lead.phone}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 max-w-xs">
                              {lead.message ? (
                                <div className="truncate">{lead.message}</div>
                              ) : lead.formData ? (
                                <div className="text-gray-500 italic">Form submission data available</div>
                              ) : (
                                <div className="text-gray-400">No message</div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{lead.source}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={lead.status}
                              onChange={(e) => handleUpdateLeadStatus(lead.id, e.target.value)}
                              className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(lead.status)} focus:ring-2 focus:ring-blue-500`}
                            >
                              <option value="new">New</option>
                              <option value="contacted">Contacted</option>
                              <option value="converted">Converted</option>
                              <option value="closed">Closed</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500 flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {new Date(lead.createdAt).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              {lead.formData && (
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => setExpandedLead(expandedLead === lead.id ? null : lead.id)}
                                  title="View Form Data"
                                >
                                  {expandedLead === lead.id ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                </Button>
                              )}
                              <Button variant="ghost" size="sm" onClick={() => window.open(`mailto:${lead.email}`)}>
                                <Mail className="w-4 h-4" />
                              </Button>
                              {lead.phone && (
                                <Button variant="ghost" size="sm" onClick={() => window.open(`tel:${lead.phone}`)}>
                                  <Phone className="w-4 h-4" />
                                </Button>
                              )}
                              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700" onClick={() => handleDeleteLead(lead.id)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                        {expandedLead === lead.id && lead.formData && (
                          <tr className="bg-gray-50">
                            <td colSpan={6} className="px-6 py-4">
                              <div className="bg-white p-4 rounded-lg border border-gray-200">
                                <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                                  <FileText className="w-4 h-4 mr-2" />
                                  Complete Form Submission
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {Object.entries(lead.formData).map(([key, value]) => (
                                    <div key={key} className="space-y-1">
                                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                      </label>
                                      <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded border">
                                        {typeof value === 'string' ? value : JSON.stringify(value)}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                {lead.ipAddress && (
                                  <div className="mt-4 pt-4 border-t border-gray-200">
                                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                                      <span>IP: {lead.ipAddress}</span>
                                      {lead.userAgent && (
                                        <span className="truncate max-w-md">User Agent: {lead.userAgent}</span>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

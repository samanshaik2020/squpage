"use client"

import { useState, useEffect } from "react"
import { ProjectProvider } from "@/lib/project-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import Image from "next/image"
import { ShareDialog } from "@/components/share-dialog"
import { 
  Plus, 
  Zap, 
  Layout, 
  Sparkles, 
  BarChart3, 
  Settings, 
  User, 
  Bell,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Globe,
  Calendar,
  TrendingUp,
  Download,
  Share2,
  Copy,
  ExternalLink,
  Clock,
  Users,
  MousePointer,
  Smartphone,
  Monitor,
  Activity,
  DollarSign,
  Target,
  Award,
  ChevronDown,
  ChevronRight,
  Folder,
  FileText,
  Image as ImageIcon,
  Video,
  Code,
  Palette,
  LogOut,
  HelpCircle,
  CreditCard,
  Mail,
  BarChart
} from "lucide-react"

// Projects will be loaded from API

// Stats will be loaded from API
const defaultStats = [
  { label: "Total Websites", value: "0", change: "0", trend: "up", icon: Globe, color: "text-blue-600", bgColor: "bg-blue-50" },
  { label: "Total Views", value: "0", change: "0", trend: "up", icon: Eye, color: "text-green-600", bgColor: "bg-green-50" },
  { label: "Total Clicks", value: "0", change: "0", trend: "up", icon: MousePointer, color: "text-purple-600", bgColor: "bg-purple-50" },
  { label: "Avg. Conversion", value: "0%", change: "0", trend: "up", icon: Target, color: "text-orange-600", bgColor: "bg-orange-50" }
]


const quickActions = [
  { name: "Use Template", description: "Start with a professional design", icon: Layout, color: "from-blue-500 to-cyan-500", href: "/templates" },
  { name: "AI Builder", description: "Generate with artificial intelligence", icon: Sparkles, color: "from-purple-500 to-pink-500", href: "/templates" },
  { name: "Blank Canvas", description: "Build with template editor", icon: Zap, color: "from-emerald-500 to-teal-500", href: "/templates" },
  { name: "Import Design", description: "Upload your existing design", icon: Download, color: "from-orange-500 to-red-500", href: "/import" }
]

function DashboardContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProject, setSelectedProject] = useState<number | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filterStatus, setFilterStatus] = useState<"all" | "published" | "draft">("all")
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [projects, setProjects] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isLoadingUser, setIsLoadingUser] = useState(true)
  const [dashboardStats, setDashboardStats] = useState<any>(null)
  const [isLoadingStats, setIsLoadingStats] = useState(true)
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [selectedShareProject, setSelectedShareProject] = useState<any>(null)
  const router = useRouter()

  // Load user data from localStorage on mount
  useEffect(() => {
    const loadUserData = () => {
      try {
        console.log('Fetching user data from localStorage...')
        const storedUser = typeof window !== 'undefined' ? localStorage.getItem('squpage_user') : null
        
        if (storedUser) {
          const userData = JSON.parse(storedUser)
          console.log('User data loaded from localStorage:', userData)
          setCurrentUser(userData)
        } else {
          console.log('No user data found in localStorage')
          // Create a default user since we're using localStorage only
          const defaultUser = {
            user: {
              email: 'user@example.com',
              id: 'local-user-id'
            },
            profile: {
              full_name: 'Local User',
              username: 'localuser'
            }
          }
          
          // Store the default user
          if (typeof window !== 'undefined') {
            localStorage.setItem('squpage_user', JSON.stringify(defaultUser))
          }
          
          setCurrentUser(defaultUser)
        }
      } catch (error) {
        console.error('Error loading user data:', error)
      } finally {
        setIsLoadingUser(false)
      }
    }

    loadUserData()
  }, [])

  // Load projects on mount
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const response = await fetch('/api/projects')
        if (response.ok) {
          const { projects } = await response.json()
          setProjects(projects)
        }
      } catch (error) {
        console.error('Error loading projects:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadProjects()
  }, [])
  
  // Load dashboard stats
  useEffect(() => {
    const loadDashboardStats = async () => {
      try {
        setIsLoadingStats(true)
        const response = await fetch('/api/dashboard-stats')
        if (response.ok) {
          const data = await response.json()
          setDashboardStats(data.stats)
        }
      } catch (error) {
        console.error('Error loading dashboard stats:', error)
      } finally {
        setIsLoadingStats(false)
      }
    }

    loadDashboardStats()
  }, [])

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === "all" || project.status.toLowerCase() === filterStatus
    return matchesSearch && matchesFilter
  })

  // Handle project actions
  const handleEditProject = (project: any) => {
    if (project.type === 'Template' && project.templateId) {
      // For template projects, go back to template editor
      window.location.href = `/editor/${project.templateId}`
    } else {
      // For other projects, go to template editor
      window.location.href = `/editor/${project.id}`
    }
  }

  const handlePreviewProject = (project: any) => {
    if (project.type === 'Template') {
      // For template projects, preview the saved template project
      window.open(`/preview/template/${project.id}`, '_blank')
    } else {
      // For other projects, preview the project
      window.open(`/preview/${project.id}`, '_blank')
    }
  }

  const handleDeleteProject = async (projectId: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        const response = await fetch(`/api/projects/${projectId}`, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          setProjects(prev => prev.filter(p => p.id !== projectId))
        }
      } catch (error) {
        console.error('Error deleting project:', error)
      }
    }
  }

  const handleViewAnalytics = (projectId: string) => {
    window.location.href = `/analytics/${projectId}`
  }

  const handleViewLeads = (projectId: string) => {
    window.location.href = `/leads/${projectId}`
  }

  const handleShareProject = (project: any) => {
    setSelectedShareProject(project)
    setShareDialogOpen(true)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isProfileMenuOpen) {
        setIsProfileMenuOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [isProfileMenuOpen])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-6">
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">SiteBuilder</span>
              </Link>
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2.5 w-80 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
              </Button>
              
              {/* Help */}
              <Button variant="ghost" size="sm">
                <HelpCircle className="w-5 h-5 text-gray-600" />
              </Button>

              {/* Profile Menu */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsProfileMenuOpen(!isProfileMenuOpen)
                  }}
                  className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="hidden md:block text-left">
                    {isLoadingUser ? (
                      <div className="animate-pulse">
                        <div className="h-3 w-20 bg-gray-200 rounded mb-1"></div>
                        <div className="h-2 w-24 bg-gray-200 rounded"></div>
                      </div>
                    ) : currentUser?.user ? (
                      <>
                        <p className="text-sm font-medium text-gray-900">
                          {currentUser.profile?.full_name || 
                           currentUser.profile?.username || 
                           currentUser.user.email?.split('@')[0] || 
                           'User'}
                        </p>
                        <p className="text-xs text-gray-500">{currentUser.user.email}</p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm font-medium text-gray-900">Guest User</p>
                        <p className="text-xs text-gray-500">Not signed in</p>
                      </>
                    )}
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                {/* Profile Dropdown */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      {isLoadingUser ? (
                        <div className="animate-pulse">
                          <div className="h-3 w-20 bg-gray-200 rounded mb-1"></div>
                          <div className="h-2 w-24 bg-gray-200 rounded"></div>
                        </div>
                      ) : currentUser?.user ? (
                        <>
                          <p className="text-sm font-medium text-gray-900">
                            {currentUser.profile?.full_name || 
                             currentUser.profile?.username || 
                             currentUser.user.email?.split('@')[0] || 
                             'User'}
                          </p>
                          <p className="text-xs text-gray-500">{currentUser.user.email}</p>
                        </>
                      ) : (
                        <>
                          <p className="text-sm font-medium text-gray-900">Guest User</p>
                          <p className="text-xs text-gray-500">Not signed in</p>
                        </>
                      )}
                    </div>
                    <Link href="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <User className="w-4 h-4 mr-3" />
                      Profile Settings
                    </Link>
                    <Link href="/billing" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <CreditCard className="w-4 h-4 mr-3" />
                      Billing
                    </Link>
                    <Link href="/settings" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <Settings className="w-4 h-4 mr-3" />
                      Settings
                    </Link>
                    <hr className="my-2" />
                    <button 
                      onClick={() => {
                        try {
                          // Remove user data from localStorage
                          if (typeof window !== 'undefined') {
                            localStorage.removeItem('squpage_user');
                          }
                          router.push('/login');
                        } catch (error) {
                          console.error('Error signing out:', error);
                        }
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-8 space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h1>
            <p className="text-gray-600">Here's what's happening with your websites today.</p>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <Link href="/templates">
              <Button variant="outline" className="w-full sm:w-auto border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-300">
                <Layout className="w-4 h-4 mr-2" />
                Browse Templates
              </Button>
            </Link>
            <Link href="/templates">
              <Button className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                <Plus className="w-4 h-4 mr-2" />
                New Website
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {isLoadingStats ? (
            // Loading skeleton for stats
            <>
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="bg-white border border-gray-200 shadow-sm">
                  <CardContent className="p-6">
                    <div className="animate-pulse flex items-center justify-between">
                      <div className="space-y-3 w-2/3">
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                      </div>
                      <div className="w-14 h-14 rounded-2xl bg-gray-200"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </>
          ) : (
            // Real stats data
            <>
              <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Total Websites</p>
                      <p className="text-3xl font-bold text-gray-900 mb-1">{dashboardStats?.totalWebsites || 0}</p>
                      <div className="flex items-center">
                        <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
                        <p className="text-sm font-medium text-green-600">
                          {dashboardStats?.websitesThisMonth || 0}
                        </p>
                        <span className="text-sm text-gray-500 ml-1">this month</span>
                      </div>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Globe className="w-7 h-7 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Total Views</p>
                      <p className="text-3xl font-bold text-gray-900 mb-1">{dashboardStats?.totalViews || 0}</p>
                      <div className="flex items-center">
                        <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
                        <p className="text-sm font-medium text-green-600">
                          {dashboardStats?.viewsChangePercent || 0}%
                        </p>
                        <span className="text-sm text-gray-500 ml-1">vs last month</span>
                      </div>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Eye className="w-7 h-7 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Total Clicks</p>
                      <p className="text-3xl font-bold text-gray-900 mb-1">{dashboardStats?.totalClicks || 0}</p>
                      <div className="flex items-center">
                        <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
                        <p className="text-sm font-medium text-green-600">
                          {dashboardStats?.clicksChangePercent || 0}%
                        </p>
                        <span className="text-sm text-gray-500 ml-1">vs last month</span>
                      </div>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <MousePointer className="w-7 h-7 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Avg. Conversion</p>
                      <p className="text-3xl font-bold text-gray-900 mb-1">{dashboardStats?.conversionRate || 0}%</p>
                      <div className="flex items-center">
                        <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
                        <p className="text-sm font-medium text-green-600">
                          {dashboardStats?.conversionChangePercent || 0}%
                        </p>
                        <span className="text-sm text-gray-500 ml-1">vs last month</span>
                      </div>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Target className="w-7 h-7 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Projects */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => (
                    <Link key={index} href={action.href}>
                      <Card className="border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer group">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-4">
                            <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                              <action.icon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 mb-1">{action.name}</h3>
                              <p className="text-sm text-gray-600">{action.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Projects */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader className="border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
                  <CardTitle className="text-xl font-bold text-gray-900">My Projects</CardTitle>
                  <div className="flex items-center space-x-3">
                    {/* Filter Buttons */}
                    <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                      <button
                        onClick={() => setFilterStatus("all")}
                        className={`px-3 py-1 text-sm rounded-md transition-colors ${
                          filterStatus === "all" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        All
                      </button>
                      <button
                        onClick={() => setFilterStatus("published")}
                        className={`px-3 py-1 text-sm rounded-md transition-colors ${
                          filterStatus === "published" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        Published
                      </button>
                      <button
                        onClick={() => setFilterStatus("draft")}
                        className={`px-3 py-1 text-sm rounded-md transition-colors ${
                          filterStatus === "draft" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        Drafts
                      </button>
                    </div>
                    
                    {/* View Toggle */}
                    <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                      <button
                        onClick={() => setViewMode("grid")}
                        className={`p-2 rounded-md transition-colors ${
                          viewMode === "grid" ? "bg-white shadow-sm" : "hover:bg-gray-200"
                        }`}
                      >
                        <Layout className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setViewMode("list")}
                        className={`p-2 rounded-md transition-colors ${
                          viewMode === "list" ? "bg-white shadow-sm" : "hover:bg-gray-200"
                        }`}
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="p-12 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading projects...</p>
                  </div>
                ) : filteredProjects.length === 0 ? (
                  <div className="p-12 text-center">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
                    <p className="text-gray-600 mb-4">
                      {searchQuery || filterStatus !== "all" 
                        ? "Try adjusting your search or filter criteria." 
                        : "Create your first project to get started."}
                    </p>
                    <Link href="/templates">
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Create New Project
                      </Button>
                    </Link>
                  </div>
                ) : viewMode === "grid" ? (
                  <div className="grid md:grid-cols-2 gap-6 p-6">
                    {filteredProjects.map((project) => (
                      <Card key={project.id} className="border border-gray-200 hover:shadow-lg transition-all duration-300 group cursor-pointer">
                        <div className="relative">
                          <Image
                            src={project.thumbnail}
                            alt={project.name}
                            width={300}
                            height={180}
                            className="w-full h-36 object-cover rounded-t-lg"
                          />
                          <div className="absolute top-3 right-3">
                            <Badge className={`${
                              project.status === 'Published' 
                                ? 'bg-green-100 text-green-800 border-green-200' 
                                : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                            }`}>
                              {project.status}
                            </Badge>
                          </div>
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-lg flex flex-col items-center justify-center space-y-2">
                            <div className="flex items-center space-x-2">
                              <Button size="sm" variant="secondary" onClick={() => handlePreviewProject(project)} className="text-xs px-2 py-1">
                                <Eye className="w-3 h-3 mr-1" />
                                Preview
                              </Button>
                              <Button size="sm" variant="secondary" onClick={() => handleEditProject(project)} className="text-xs px-2 py-1">
                                <Edit className="w-3 h-3 mr-1" />
                                Edit
                              </Button>
                              <Button size="sm" variant="secondary" onClick={(e) => {
                                e.stopPropagation();
                                handleShareProject(project);
                              }} className="text-xs px-2 py-1">
                                <Share2 className="w-3 h-3 mr-1" />
                                Share
                              </Button>
                            </div>
                            {project.status === 'published' && (
                              <div className="flex items-center space-x-2">
                                <Button size="sm" variant="secondary" onClick={() => handleViewAnalytics(project.id)} className="text-xs px-2 py-1">
                                  <BarChart className="w-3 h-3 mr-1" />
                                  Stats
                                </Button>
                                <Button size="sm" variant="secondary" onClick={() => handleViewLeads(project.id)} className="text-xs px-2 py-1">
                                  <Mail className="w-3 h-3 mr-1" />
                                  Leads
                                </Button>
                                <Button size="sm" variant="secondary" onClick={() => window.location.href = `/forms/${project.id}`} className="text-xs px-2 py-1">
                                  <FileText className="w-3 h-3 mr-1" />
                                  Forms
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-gray-900 truncate">{project.name}</h3>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteProject(project.id)}>
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                          <div className="flex items-center space-x-2 mb-3">
                            <p className="text-sm text-gray-600">{project.type}</p>
                            {project.type === 'Template' && (
                              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                Template
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center space-x-4">
                              <span className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {new Date(project.updatedAt).toLocaleDateString()}
                              </span>
                            </div>
                            <Badge variant={project.status === 'published' ? 'default' : 'secondary'}>
                              {project.status}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {filteredProjects.map((project) => (
                      <div key={project.id} className="p-6 hover:bg-gray-50 transition-colors group">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-10 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={project.thumbnail}
                              alt={project.name}
                              width={64}
                              height={40}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-3 mb-1">
                              <h3 className="font-semibold text-gray-900 truncate">{project.name}</h3>
                              <Badge className={`${
                                project.status === 'Published' 
                                  ? 'bg-green-100 text-green-800 border-green-200' 
                                  : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                              }`}>
                                {project.status}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-6 text-sm text-gray-500">
                              <div className="flex items-center space-x-2">
                                <span>{project.type}</span>
                                {project.type === 'Template' && (
                                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                    Template
                                  </Badge>
                                )}
                              </div>
                              <span className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {new Date(project.updatedAt).toLocaleDateString()}
                              </span>
                              <span className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {new Date(project.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="sm" onClick={() => handlePreviewProject(project)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleEditProject(project)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            {project.status === 'published' && (
                              <>
                                <Button variant="ghost" size="sm" onClick={() => handleViewAnalytics(project.id)} title="View Analytics">
                                  <BarChart className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleViewLeads(project.id)} title="View Leads">
                                  <Mail className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => window.location.href = `/forms/${project.id}`} title="Test Forms">
                                  <FileText className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                            <Button variant="ghost" size="sm" onClick={(e) => {
                              e.stopPropagation();
                              handleShareProject(project);
                            }}>
                              <Share2 className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700" onClick={() => handleDeleteProject(project.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="p-6 border-t border-gray-200 text-center">
                  <Link href="/projects">
                    <Button variant="outline" className="border-2 border-gray-300 hover:border-gray-400">
                      View All Projects
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Activity & Analytics */}
          <div className="space-y-8">

            {/* This Month */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900">This Month</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {isLoadingStats ? (
                  // Loading skeleton
                  <div className="grid grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="space-y-2 animate-pulse">
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-600">Websites Created</p>
                      <p className="text-2xl font-bold text-gray-900">{dashboardStats?.websitesThisMonth || 0}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-600">Total Visitors</p>
                      <p className="text-2xl font-bold text-gray-900">{dashboardStats?.totalVisitors || 0}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                      <p className="text-2xl font-bold text-gray-900">{dashboardStats?.conversionRate || 0}%</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-600">Leads Generated</p>
                      <p className="text-2xl font-bold text-gray-900">{dashboardStats?.submissionsThisMonth || 0}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Upgrade Card */}
            <Card className="bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Award className="w-8 h-8 text-white" />
                  <div>
                    <h3 className="font-bold text-lg">Upgrade to Pro</h3>
                    <p className="text-purple-100 text-sm">Unlock advanced features</p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-purple-100 mb-4">
                  <li>• Unlimited websites</li>
                  <li>• AI content generation</li>
                  <li>• Advanced analytics</li>
                  <li>• Priority support</li>
                </ul>
                <Button className="w-full bg-white text-purple-600 hover:bg-gray-100">
                  Upgrade Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Share Dialog */}
      {selectedShareProject && (
        <ShareDialog
          isOpen={shareDialogOpen}
          onClose={() => setShareDialogOpen(false)}
          projectId={selectedShareProject.id}
          projectName={selectedShareProject.name}
        />
      )}
    </div>
  )
}

export default function DashboardPage() {
  return (
    <ProjectProvider>
      <DashboardContent />
    </ProjectProvider>
  )
}
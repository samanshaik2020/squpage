"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import Image from "next/image"
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
  CreditCard
} from "lucide-react"

const recentProjects = [
  {
    id: 1,
    name: "E-commerce Store",
    type: "AI Generated",
    status: "Published",
    lastModified: "2 hours ago",
    views: "1.2k",
    clicks: "89",
    conversionRate: "3.2%",
    thumbnail: "/placeholder.svg?height=120&width=200&text=E-commerce",
    url: "https://mystore.com",
    category: "E-commerce"
  },
  {
    id: 2,
    name: "Portfolio Website",
    type: "Template",
    status: "Draft",
    lastModified: "1 day ago",
    views: "0",
    clicks: "0",
    conversionRate: "0%",
    thumbnail: "/placeholder.svg?height=120&width=200&text=Portfolio",
    url: "",
    category: "Portfolio"
  },
  {
    id: 3,
    name: "Landing Page",
    type: "From Scratch",
    status: "Published",
    lastModified: "3 days ago",
    views: "856",
    clicks: "42",
    conversionRate: "4.9%",
    thumbnail: "/placeholder.svg?height=120&width=200&text=Landing",
    url: "https://mylanding.com",
    category: "Marketing"
  },
  {
    id: 4,
    name: "Restaurant Menu",
    type: "Template",
    status: "Published",
    lastModified: "5 days ago",
    views: "234",
    clicks: "18",
    conversionRate: "7.7%",
    thumbnail: "/placeholder.svg?height=120&width=200&text=Restaurant",
    url: "https://restaurant.com",
    category: "Business"
  },
  {
    id: 5,
    name: "Blog Website",
    type: "AI Generated",
    status: "Draft",
    lastModified: "1 week ago",
    views: "0",
    clicks: "0",
    conversionRate: "0%",
    thumbnail: "/placeholder.svg?height=120&width=200&text=Blog",
    url: "",
    category: "Blog"
  }
]

const stats = [
  { label: "Total Websites", value: "12", change: "+2", trend: "up", icon: Globe, color: "text-blue-600", bgColor: "bg-blue-50" },
  { label: "Total Views", value: "24.5k", change: "+12%", trend: "up", icon: Eye, color: "text-green-600", bgColor: "bg-green-50" },
  { label: "Total Clicks", value: "1,847", change: "+8%", trend: "up", icon: MousePointer, color: "text-purple-600", bgColor: "bg-purple-50" },
  { label: "Avg. Conversion", value: "4.2%", change: "+0.3%", trend: "up", icon: Target, color: "text-orange-600", bgColor: "bg-orange-50" }
]

const recentActivity = [
  { action: "Published", item: "E-commerce Store", time: "2 hours ago", type: "publish" },
  { action: "Edited", item: "Portfolio Website", time: "1 day ago", type: "edit" },
  { action: "Created", item: "Landing Page Template", time: "3 days ago", type: "create" },
  { action: "Shared", item: "Restaurant Menu", time: "5 days ago", type: "share" },
  { action: "Deleted", item: "Old Blog Draft", time: "1 week ago", type: "delete" }
]

const quickActions = [
  { name: "Use Template", description: "Start with a professional design", icon: Layout, color: "from-blue-500 to-cyan-500", href: "/templates" },
  { name: "AI Builder", description: "Generate with artificial intelligence", icon: Sparkles, color: "from-purple-500 to-pink-500", href: "/templates" },
  { name: "Blank Canvas", description: "Build with drag & drop editor", icon: Zap, color: "from-emerald-500 to-teal-500", href: "/elementor" },
  { name: "Import Design", description: "Upload your existing design", icon: Download, color: "from-orange-500 to-red-500", href: "/import" }
]

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProject, setSelectedProject] = useState<number | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filterStatus, setFilterStatus] = useState<"all" | "published" | "draft">("all")
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)

  const filteredProjects = recentProjects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === "all" || project.status.toLowerCase() === filterStatus
    return matchesSearch && matchesFilter
  })

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
                    <p className="text-sm font-medium text-gray-900">John Doe</p>
                    <p className="text-xs text-gray-500">john@example.com</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                {/* Profile Dropdown */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">John Doe</p>
                      <p className="text-xs text-gray-500">john@example.com</p>
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
                    <button className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50">
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
            <Link href="/elementor">
              <Button className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                <Plus className="w-4 h-4 mr-2" />
                New Website
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                    <div className="flex items-center">
                      <TrendingUp className={`w-4 h-4 mr-1 ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`} />
                      <p className={`text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                        {stat.change}
                      </p>
                      <span className="text-sm text-gray-500 ml-1">vs last month</span>
                    </div>
                  </div>
                  <div className={`w-14 h-14 rounded-2xl ${stat.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className={`w-7 h-7 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
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
                {viewMode === "grid" ? (
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
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-lg flex items-center justify-center space-x-2">
                            <Button size="sm" variant="secondary">
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                            <Button size="sm" variant="secondary">
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-gray-900 truncate">{project.name}</h3>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{project.type} • {project.category}</p>
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center space-x-4">
                              <span className="flex items-center">
                                <Eye className="w-4 h-4 mr-1" />
                                {project.views}
                              </span>
                              <span className="flex items-center">
                                <MousePointer className="w-4 h-4 mr-1" />
                                {project.clicks}
                              </span>
                            </div>
                            <span>{project.lastModified}</span>
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
                              <span>{project.type}</span>
                              <span className="flex items-center">
                                <Eye className="w-4 h-4 mr-1" />
                                {project.views}
                              </span>
                              <span className="flex items-center">
                                <MousePointer className="w-4 h-4 mr-1" />
                                {project.clicks}
                              </span>
                              <span className="flex items-center">
                                <Target className="w-4 h-4 mr-1" />
                                {project.conversionRate}
                              </span>
                              <span>{project.lastModified}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {project.url && (
                              <Button variant="ghost" size="sm">
                                <ExternalLink className="w-4 h-4" />
                              </Button>
                            )}
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Share2 className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
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
            {/* Recent Activity */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-900">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        activity.type === 'publish' ? 'bg-green-100' :
                        activity.type === 'edit' ? 'bg-blue-100' :
                        activity.type === 'create' ? 'bg-purple-100' :
                        activity.type === 'share' ? 'bg-orange-100' : 'bg-red-100'
                      }`}>
                        {activity.type === 'publish' && <Globe className="w-4 h-4 text-green-600" />}
                        {activity.type === 'edit' && <Edit className="w-4 h-4 text-blue-600" />}
                        {activity.type === 'create' && <Plus className="w-4 h-4 text-purple-600" />}
                        {activity.type === 'share' && <Share2 className="w-4 h-4 text-orange-600" />}
                        {activity.type === 'delete' && <Trash2 className="w-4 h-4 text-red-600" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">
                          <span className="font-medium">{activity.action}</span> {activity.item}
                        </p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-900">This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Websites Created</span>
                    <span className="text-lg font-bold text-gray-900">3</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Visitors</span>
                    <span className="text-lg font-bold text-gray-900">2,847</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Conversion Rate</span>
                    <span className="text-lg font-bold text-green-600">4.2%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Revenue</span>
                    <span className="text-lg font-bold text-gray-900">$1,234</span>
                  </div>
                </div>
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
    </div>
  )
}
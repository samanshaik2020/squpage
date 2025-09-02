import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Copy, Check, Link, Clock, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ShareDialogProps {
  isOpen: boolean
  onClose: () => void
  projectId: string
  projectName: string
}

interface ShareData {
  token: string
  slug: string
  customName: string
  expiryDate: string | null
  shareUrl: string
}

export function ShareDialog({ isOpen, onClose, projectId, projectName }: ShareDialogProps) {
  const { toast } = useToast()
  const [customName, setCustomName] = useState('')
  const [expiryDays, setExpiryDays] = useState<string>('never')
  const [isLoading, setIsLoading] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [shareData, setShareData] = useState<ShareData | null>(null)
  const [activeTab, setActiveTab] = useState('create')
  
  // Fetch current share status when dialog opens
  useEffect(() => {
    if (isOpen && projectId) {
      fetchShareStatus()
    }
  }, [isOpen, projectId])
  
  // Set initial custom name based on project name
  useEffect(() => {
    if (projectName && !customName) {
      setCustomName(projectName)
    }
  }, [projectName])
  
  // Reset copied state after 2 seconds
  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => {
        setIsCopied(false)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [isCopied])
  
  // Fetch current share status
  const fetchShareStatus = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/projects/${projectId}/share`)
      const data = await response.json()
      
      if (data.shareStatus && data.shareStatus.isPubliclyShared) {
        setShareData({
          token: data.shareStatus.shareToken,
          slug: data.shareStatus.shareSlug,
          customName: data.shareStatus.shareName,
          expiryDate: data.shareStatus.shareExpiryDate,
          shareUrl: data.shareStatus.shareUrl
        })
        setCustomName(data.shareStatus.shareName || projectName)
        setActiveTab('manage')
      } else {
        setActiveTab('create')
      }
    } catch (error) {
      console.error('Error fetching share status:', error)
      toast({
        title: "Error",
        description: "Failed to fetch share status",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  // Generate share token
  const generateShareToken = async () => {
    if (!customName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a custom name for your share link",
        variant: "destructive"
      })
      return
    }
    
    try {
      setIsLoading(true)
      
      const days = expiryDays === 'never' ? undefined : parseInt(expiryDays)
      
      const response = await fetch(`/api/projects/${projectId}/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customName,
          expiryDays: days
        })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setShareData({
          token: data.shareData.token,
          slug: data.shareData.slug,
          customName: data.shareData.customName,
          expiryDate: data.shareData.expiryDate,
          shareUrl: `${window.location.origin}/share/${data.shareData.slug}`
        })
        
        toast({
          title: "Success",
          description: "Share link created successfully"
        })
        
        setActiveTab('manage')
      } else {
        throw new Error(data.error || 'Failed to generate share token')
      }
    } catch (error) {
      console.error('Error generating share token:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate share token",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  // Update share settings
  const updateShareSettings = async () => {
    if (!customName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a custom name for your share link",
        variant: "destructive"
      })
      return
    }
    
    try {
      setIsLoading(true)
      
      const days = expiryDays === 'never' ? undefined : parseInt(expiryDays)
      
      const response = await fetch(`/api/projects/${projectId}/share`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customName,
          expiryDays: days
        })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setShareData({
          token: data.shareData.token,
          slug: data.shareData.slug,
          customName: data.shareData.customName,
          expiryDate: data.shareData.expiryDate,
          shareUrl: `${window.location.origin}/share/${data.shareData.slug}`
        })
        
        toast({
          title: "Success",
          description: "Share settings updated successfully"
        })
      } else {
        throw new Error(data.error || 'Failed to update share settings')
      }
    } catch (error) {
      console.error('Error updating share settings:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update share settings",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  // Revoke share token
  const revokeShareToken = async () => {
    try {
      setIsLoading(true)
      
      const response = await fetch(`/api/projects/${projectId}/share`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setShareData(null)
        setActiveTab('create')
        
        toast({
          title: "Success",
          description: "Share link revoked successfully"
        })
      } else {
        const data = await response.json()
        throw new Error(data.error || 'Failed to revoke share token')
      }
    } catch (error) {
      console.error('Error revoking share token:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to revoke share token",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  // Copy share link to clipboard
  const copyShareLink = () => {
    if (shareData?.shareUrl) {
      navigator.clipboard.writeText(shareData.shareUrl)
      setIsCopied(true)
      toast({
        title: "Copied!",
        description: "Share link copied to clipboard"
      })
    }
  }
  
  // Format expiry date
  const formatExpiryDate = (dateString: string | null) => {
    if (!dateString) return 'Never expires'
    
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Project</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create" disabled={isLoading}>
              Create Link
            </TabsTrigger>
            <TabsTrigger value="manage" disabled={isLoading || !shareData}>
              Manage Link
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="create" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="custom-name">Custom Name</Label>
              <Input
                id="custom-name"
                placeholder="Enter a custom name for your share link"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500">
                This name will appear in the URL: {window.location.origin}/share/<span className="font-mono">{customName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}</span>
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="expiry">Expiration</Label>
              <Select
                value={expiryDays}
                onValueChange={setExpiryDays}
                disabled={isLoading}
              >
                <SelectTrigger id="expiry">
                  <SelectValue placeholder="Select expiration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="never">Never expires</SelectItem>
                  <SelectItem value="1">1 day</SelectItem>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button
              className="w-full"
              onClick={generateShareToken}
              disabled={isLoading || !customName.trim()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Link className="mr-2 h-4 w-4" />
                  Generate Share Link
                </>
              )}
            </Button>
          </TabsContent>
          
          <TabsContent value="manage" className="space-y-4 py-4">
            {shareData ? (
              <>
                <div className="space-y-2">
                  <Label>Share Link</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      value={shareData.shareUrl}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={copyShareLink}
                      disabled={isLoading}
                    >
                      {isCopied ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="update-name">Custom Name</Label>
                  <Input
                    id="update-name"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="update-expiry">Update Expiration</Label>
                  <Select
                    value={expiryDays}
                    onValueChange={setExpiryDays}
                    disabled={isLoading}
                  >
                    <SelectTrigger id="update-expiry">
                      <SelectValue placeholder="Select expiration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="never">Never expires</SelectItem>
                      <SelectItem value="1">1 day</SelectItem>
                      <SelectItem value="7">7 days</SelectItem>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="text-sm text-gray-500 flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  {shareData.expiryDate 
                    ? `Expires on ${formatExpiryDate(shareData.expiryDate)}`
                    : 'Never expires'}
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={updateShareSettings}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Update Settings'
                    )}
                  </Button>
                  
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={revokeShareToken}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <X className="mr-2 h-4 w-4" />
                        Revoke Link
                      </>
                    )}
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500">No active share link</p>
                <Button
                  variant="outline"
                  className="mt-2"
                  onClick={() => setActiveTab('create')}
                >
                  Create a share link
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="sm:justify-end">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

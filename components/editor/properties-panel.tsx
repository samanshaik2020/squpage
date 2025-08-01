"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Settings, AlignLeft, AlignCenter, AlignRight } from "lucide-react"

interface PropertiesPanelProps {
  selectedElement: string | null
}

export function PropertiesPanel({ selectedElement }: PropertiesPanelProps) {
  if (!selectedElement) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Properties</h2>
          <p className="text-sm text-gray-600">Select an element to edit its properties</p>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No element selected</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-900">Properties</h2>
        <p className="text-sm text-gray-600">Editing: {selectedElement}</p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          <Tabs defaultValue="content" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="style">Style</TabsTrigger>
              <TabsTrigger value="layout">Layout</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Text Content</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="heading">Heading</Label>
                    <Input id="heading" defaultValue="Welcome to My Website" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      defaultValue="This is a sample hero section that you can customize"
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="button-text">Button Text</Label>
                    <Input id="button-text" defaultValue="Get Started" className="mt-1" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="style" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Typography</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Text Alignment</Label>
                    <div className="flex space-x-2 mt-1">
                      <Button variant="outline" size="sm">
                        <AlignLeft className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <AlignCenter className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <AlignRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label>Font Size</Label>
                    <Slider defaultValue={[24]} max={72} min={12} step={1} className="mt-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Colors</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="text-color">Text Color</Label>
                    <div className="flex space-x-2 mt-1">
                      <Input id="text-color" type="color" defaultValue="#1f2937" className="w-12 h-8 p-0 border-0" />
                      <Input defaultValue="#1f2937" className="flex-1" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="bg-color">Background Color</Label>
                    <div className="flex space-x-2 mt-1">
                      <Input id="bg-color" type="color" defaultValue="#ffffff" className="w-12 h-8 p-0 border-0" />
                      <Input defaultValue="#ffffff" className="flex-1" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="layout" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Spacing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Padding</Label>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <Input placeholder="Top" defaultValue="32" />
                      <Input placeholder="Right" defaultValue="32" />
                      <Input placeholder="Bottom" defaultValue="32" />
                      <Input placeholder="Left" defaultValue="32" />
                    </div>
                  </div>
                  <div>
                    <Label>Margin</Label>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <Input placeholder="Top" defaultValue="0" />
                      <Input placeholder="Right" defaultValue="0" />
                      <Input placeholder="Bottom" defaultValue="32" />
                      <Input placeholder="Left" defaultValue="0" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  )
}

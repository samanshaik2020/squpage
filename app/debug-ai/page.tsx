"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DebugAIPage() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const testAIGeneration = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      console.log("Testing AI generation with input:", input)
      
      const response = await fetch("/api/generate-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          productName: input || "EcoClean Pro - Revolutionary eco-friendly cleaning solution" 
        }),
      })

      console.log("Response status:", response.status)
      console.log("Response headers:", response.headers)

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
      }

      const data = await response.json()
      console.log("AI Generated Content:", data)
      setResult(data)
      
    } catch (error) {
      console.error("Error testing AI generation:", error)
      setError(error instanceof Error ? error.message : 'Unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">AI Generation Debug Page</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Test AI Content Generation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Product Name & Description</label>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g., EcoClean Pro - Revolutionary eco-friendly cleaning solution"
                className="w-full"
              />
            </div>
            
            <Button 
              onClick={testAIGeneration} 
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Generating...' : 'Test AI Generation'}
            </Button>
          </CardContent>
        </Card>

        {error && (
          <Card className="mb-8 border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-red-600 whitespace-pre-wrap">{error}</pre>
            </CardContent>
          </Card>
        )}

        {result && (
          <Card>
            <CardHeader>
              <CardTitle className="text-green-600">Generated Content</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap text-sm bg-gray-100 p-4 rounded">
                {JSON.stringify(result, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
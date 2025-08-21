"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Mail, ArrowRight, Zap, CheckCircle, ArrowLeft } from "lucide-react"

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      setError("Email is required")
      return
    }
    
    if (!validateEmail(email)) {
      setError("Please enter a valid email address")
      return
    }
    
    setError("")
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setIsEmailSent(true)
    }, 2000)
  }

  const handleResendEmail = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-6">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-pink-400 to-red-400 rounded-full opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-3 group">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">SiteBuilder</span>
          </Link>
        </div>

        <Card className="bg-white/80 backdrop-blur-xl border border-gray-200 shadow-2xl rounded-3xl overflow-hidden">
          <CardHeader className="text-center pb-6">
            {!isEmailSent ? (
              <>
                <CardTitle className="text-3xl font-bold text-gray-900 mb-2">Forgot Password?</CardTitle>
                <p className="text-gray-600">No worries, we'll send you reset instructions</p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-3xl font-bold text-gray-900 mb-2">Check Your Email</CardTitle>
                <p className="text-gray-600">We sent a password reset link to {email}</p>
              </>
            )}
          </CardHeader>
          
          <CardContent className="px-8 pb-8">
            {!isEmailSent ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        if (error) setError("")
                      }}
                      className={`pl-10 py-3 border-2 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                        error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-200'
                      }`}
                    />
                  </div>
                  {error && (
                    <p className="text-red-500 text-sm mt-1 animate-fade-in-up">{error}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Sending...
                    </div>
                  ) : (
                    <span className="flex items-center justify-center">
                      Reset Password
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </Button>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="text-center space-y-4">
                  <p className="text-gray-600">
                    Didn't receive the email? Check your spam folder or try again.
                  </p>
                  <Button
                    onClick={handleResendEmail}
                    disabled={isLoading}
                    variant="outline"
                    className="border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                        Resending...
                      </div>
                    ) : (
                      "Resend Email"
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Back to Login */}
            <div className="text-center mt-6 pt-6 border-t border-gray-200">
              <Link 
                href="/login" 
                className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Sign In
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Help Text */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>
            Need help?{" "}
            <Link href="/support" className="text-indigo-600 hover:text-indigo-700 transition-colors">
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Zap, Github, Chrome, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import { TermsModal } from "@/components/ui/terms-modal"
import { PrivacyModal } from "@/components/ui/privacy-modal"

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    subscribeNewsletter: true
  })
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [showTermsModal, setShowTermsModal] = useState(false)
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)
  const router = useRouter()

  const validateStep1 = () => {
    const newErrors: {[key: string]: string} = {}
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required"
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required"
    }
    
    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors: {[key: string]: string} = {}
    
    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 3) {
      newErrors.password = "Password must be at least 3 characters"
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }
    
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2)
    }
  }

  const handleBack = () => {
    setCurrentStep(1)
    setErrors({})
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateStep2()) return
    
    setIsLoading(true)
    
    try {
      // Create username from first name and last name
      const username = `${formData.firstName.toLowerCase()}${formData.lastName.toLowerCase()}`
      const fullName = `${formData.firstName} ${formData.lastName}`
      
      // Create a user object for localStorage
      const user = {
        user: {
          email: formData.email,
          id: `local-${Date.now()}`
        },
        profile: {
          full_name: fullName,
          username: username
        }
      }
      
      // Store in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('squpage_user', JSON.stringify(user))
      }
      
      // Add a small delay to simulate network request
      setTimeout(() => {
        toast({
          title: "Account created successfully",
          description: "You can now sign in with your credentials",
          variant: "default"
        })
        
        // Redirect to login page
        router.push('/login')
      }, 800)
    } catch (error: any) {
      // Handle signup errors
      setErrors({
        ...errors,
        form: error.message || 'Failed to create account. Please try again.'
      })
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const handleSocialSignup = async (provider: string) => {
    setIsLoading(true)
    try {
      // Create a user object for social signup
      const user = {
        user: {
          email: `user@${provider}.com`,
          id: `${provider}-${Date.now()}`
        },
        profile: {
          full_name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
          username: `${provider}user${Math.floor(Math.random() * 1000)}`
        }
      }
      
      // Store in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('squpage_user', JSON.stringify(user))
      }
      
      // Add a small delay to simulate network request
      setTimeout(() => {
        // Redirect to dashboard directly
        router.push('/dashboard')
      }, 800)
    } catch (error: any) {
      toast({
        title: "Authentication Error",
        description: error.message || `Failed to sign up with ${provider}`,
        variant: "destructive"
      })
      setIsLoading(false)
    }
  }

  const getPasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    return strength
  }

  const passwordStrength = getPasswordStrength(formData.password)

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
            <CardTitle className="text-3xl font-bold text-gray-900 mb-2">Create Account</CardTitle>
            <p className="text-gray-600">Join thousands of creators building amazing websites</p>
            
            {/* Progress Indicator */}
            <div className="flex items-center justify-center mt-6 space-x-4">
              <div className={`flex items-center ${currentStep >= 1 ? 'text-indigo-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  currentStep >= 1 ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-gray-300'
                }`}>
                  {currentStep > 1 ? <CheckCircle className="w-5 h-5" /> : '1'}
                </div>
                <span className="ml-2 text-sm font-medium">Details</span>
              </div>
              <div className={`w-8 h-0.5 ${currentStep >= 2 ? 'bg-indigo-600' : 'bg-gray-300'} transition-all duration-300`}></div>
              <div className={`flex items-center ${currentStep >= 2 ? 'text-indigo-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  currentStep >= 2 ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-gray-300'
                }`}>
                  2
                </div>
                <span className="ml-2 text-sm font-medium">Security</span>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="px-8 pb-8">
            {currentStep === 1 ? (
              <>
                {/* Social Signup Buttons */}
                <div className="space-y-3 mb-6">
                  <Button
                    variant="outline"
                    className="w-full py-3 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 group"
                    onClick={() => handleSocialSignup('google')}
                  >
                    <Chrome className="w-5 h-5 mr-3 text-gray-600 group-hover:text-gray-700" />
                    Continue with Google
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full py-3 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 group"
                    onClick={() => handleSocialSignup('github')}
                  >
                    <Github className="w-5 h-5 mr-3 text-gray-600 group-hover:text-gray-700" />
                    Continue with GitHub
                  </Button>
                </div>

                {/* Divider */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">Or continue with email</span>
                  </div>
                </div>

                {/* Step 1: Personal Details */}
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                        First Name
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                          id="firstName"
                          type="text"
                          placeholder="John"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          className={`pl-10 py-3 border-2 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                            errors.firstName ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-200'
                          }`}
                        />
                      </div>
                      {errors.firstName && (
                        <p className="text-red-500 text-sm mt-1 animate-fade-in-up">{errors.firstName}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className={`py-3 border-2 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                          errors.lastName ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-200'
                        }`}
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-sm mt-1 animate-fade-in-up">{errors.lastName}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`pl-10 py-3 border-2 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                          errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-200'
                        }`}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1 animate-fade-in-up">{errors.email}</p>
                    )}
                  </div>

                  <Button
                    type="button"
                    onClick={handleNext}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                  >
                    <span className="flex items-center justify-center">
                      Continue
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Button>
                </div>
              </>
            ) : (
              <>
                {/* Step 2: Password & Terms */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {errors.form && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                      {errors.form}
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className={`pl-10 pr-10 py-3 border-2 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                          errors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-200'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    
                    {/* Password Strength Indicator */}
                    {formData.password && (
                      <div className="mt-2">
                        <div className="flex space-x-1 mb-2">
                          {[1, 2, 3, 4, 5].map((level) => (
                            <div
                              key={level}
                              className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                                level <= passwordStrength
                                  ? level <= 2
                                    ? 'bg-red-500'
                                    : level <= 3
                                    ? 'bg-yellow-500'
                                    : 'bg-green-500'
                                  : 'bg-gray-200'
                              }`}
                            ></div>
                          ))}
                        </div>
                        <p className="text-xs text-gray-600">
                          Password strength: {
                            passwordStrength <= 2 ? 'Weak' :
                            passwordStrength <= 3 ? 'Fair' :
                            passwordStrength <= 4 ? 'Good' : 'Strong'
                          }
                        </p>
                      </div>
                    )}
                    
                    {errors.password && (
                      <p className="text-red-500 text-sm mt-1 animate-fade-in-up">{errors.password}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        className={`pl-10 pr-10 py-3 border-2 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                          errors.confirmPassword ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-200'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-sm mt-1 animate-fade-in-up">{errors.confirmPassword}</p>
                    )}
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-start">
                      <input
                        type="checkbox"
                        checked={formData.agreeToTerms}
                        onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2 mt-0.5"
                      />
                      <span className="ml-3 text-sm text-gray-600">
                        I agree to the{" "}
                        <button 
                          type="button"
                          onClick={() => setShowTermsModal(true)}
                          className="text-indigo-600 hover:text-indigo-700 font-medium underline"
                        >
                          Terms of Service
                        </button>{" "}
                        and{" "}
                        <button 
                          type="button"
                          onClick={() => setShowPrivacyModal(true)}
                          className="text-indigo-600 hover:text-indigo-700 font-medium underline"
                        >
                          Privacy Policy
                        </button>
                      </span>
                    </label>
                    {errors.agreeToTerms && (
                      <p className="text-red-500 text-sm animate-fade-in-up">{errors.agreeToTerms}</p>
                    )}

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.subscribeNewsletter}
                        onChange={(e) => handleInputChange('subscribeNewsletter', e.target.checked)}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2"
                      />
                      <span className="ml-3 text-sm text-gray-600">
                        Send me updates about new features and tips
                      </span>
                    </label>
                  </div>

                  <div className="flex space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBack}
                      className="flex-1 py-3 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300"
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Creating...
                        </div>
                      ) : (
                        <span className="flex items-center justify-center">
                          Create Account
                          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </span>
                      )}
                    </Button>
                  </div>
                </form>
              </>
            )}

            {/* Sign In Link */}
            <div className="text-center mt-6 pt-6 border-t border-gray-200">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link href="/login" className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
        
        {/* Modals */}
        <TermsModal 
          isOpen={showTermsModal} 
          onClose={() => setShowTermsModal(false)} 
        />
        <PrivacyModal 
          isOpen={showPrivacyModal} 
          onClose={() => setShowPrivacyModal(false)} 
        />
      </div>
    </div>
  )
}
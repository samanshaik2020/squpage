"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { 
  CheckCircle, 
  X, 
  Zap, 
  ArrowRight, 
  Star,
  Users,
  Crown,
  Rocket,
  Shield,
  Headphones,
  Globe,
  Palette,
  Code,
  BarChart3,
  Settings
} from "lucide-react"

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started",
    popular: false,
    color: "from-gray-500 to-gray-600",
    icon: Zap,
    features: [
      { name: "3 websites", included: true },
      { name: "Basic templates", included: true },
      { name: "Community support", included: true },
      { name: "SSL certificate", included: true },
      { name: "Mobile responsive", included: true },
      { name: "Custom domain", included: false },
      { name: "AI content generation", included: false },
      { name: "Advanced analytics", included: false },
      { name: "Priority support", included: false },
      { name: "White-label option", included: false }
    ],
    cta: "Get Started Free",
    ctaLink: "/signup"
  },
  {
    name: "Pro",
    price: "$19",
    period: "per month",
    description: "Best for professionals",
    popular: true,
    color: "from-indigo-600 to-purple-600",
    icon: Crown,
    features: [
      { name: "Unlimited websites", included: true },
      { name: "All templates + AI", included: true },
      { name: "Priority support", included: true },
      { name: "Custom domain", included: true },
      { name: "Advanced analytics", included: true },
      { name: "White-label option", included: true },
      { name: "AI content generation", included: true },
      { name: "Custom CSS/JS", included: true },
      { name: "Export code", included: true },
      { name: "Team collaboration", included: false }
    ],
    cta: "Start Pro Trial",
    ctaLink: "/signup"
  },
  {
    name: "Agency",
    price: "$49",
    period: "per month",
    description: "For teams and agencies",
    popular: false,
    color: "from-emerald-600 to-teal-600",
    icon: Rocket,
    features: [
      { name: "Everything in Pro", included: true },
      { name: "Team collaboration", included: true },
      { name: "Client management", included: true },
      { name: "API access", included: true },
      { name: "Custom integrations", included: true },
      { name: "Dedicated support", included: true },
      { name: "Advanced permissions", included: true },
      { name: "Custom branding", included: true },
      { name: "Priority features", included: true },
      { name: "SLA guarantee", included: true }
    ],
    cta: "Contact Sales",
    ctaLink: "/contact"
  }
]

const faqs = [
  {
    question: "Can I change plans at any time?",
    answer: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately and we'll prorate any billing differences."
  },
  {
    question: "Is there a free trial for paid plans?",
    answer: "Yes, we offer a 14-day free trial for both Pro and Agency plans. No credit card required to start your trial."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, MasterCard, American Express) and PayPal. All payments are processed securely."
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer: "Absolutely! You can cancel your subscription at any time from your account settings. Your websites will remain active until the end of your billing period."
  },
  {
    question: "Do you offer refunds?",
    answer: "We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, contact us for a full refund."
  },
  {
    question: "Is there a setup fee?",
    answer: "No setup fees, ever! The price you see is the price you pay. No hidden costs or surprise charges."
  }
]

const features = [
  {
    icon: Globe,
    title: "Global CDN",
    description: "Lightning-fast loading times worldwide"
  },
  {
    icon: Shield,
    title: "SSL Security",
    description: "Free SSL certificates for all websites"
  },
  {
    icon: Palette,
    title: "Design Freedom",
    description: "Unlimited customization options"
  },
  {
    icon: Code,
    title: "Clean Code",
    description: "Export production-ready code"
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description: "Detailed performance insights"
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Expert help when you need it"
  }
]

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false)

  const getPrice = (monthlyPrice: string) => {
    if (monthlyPrice === "$0") return "$0"
    const price = parseInt(monthlyPrice.replace("$", ""))
    return isAnnual ? `$${Math.round(price * 12 * 0.8)}` : monthlyPrice
  }

  const getPeriod = (plan: any) => {
    if (plan.price === "$0") return "forever"
    return isAnnual ? "per year" : "per month"
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 sticky top-0 z-50 bg-white/95 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">SiteBuilder</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
                Sign In
              </Link>
              <Link href="/signup">
                <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  Start Free Trial
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed mb-8">
            Choose the perfect plan for your needs. Start free, upgrade when you're ready.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-12">
            <span className={`text-sm font-medium ${!isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                isAnnual ? 'bg-indigo-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isAnnual ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>
              Annual
            </span>
            {isAnnual && (
              <Badge className="bg-green-100 text-green-800 border border-green-200">
                Save 20%
              </Badge>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
          {pricingPlans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative bg-white border-2 shadow-lg hover:shadow-2xl transition-all duration-500 rounded-3xl overflow-hidden ${
                plan.popular 
                  ? 'border-indigo-600 scale-105 shadow-2xl' 
                  : 'border-gray-200 hover:border-indigo-300'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center py-3 text-sm font-medium">
                  <Star className="w-4 h-4 inline mr-2" />
                  Most Popular
                </div>
              )}
              
              <CardContent className={`p-8 ${plan.popular ? 'pt-16' : 'pt-8'}`}>
                {/* Plan Header */}
                <div className="text-center mb-8">
                  <div className={`w-16 h-16 bg-gradient-to-r ${plan.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                    <plan.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  <div className="mb-6">
                    <span className="text-5xl font-bold text-gray-900">{getPrice(plan.price)}</span>
                    <span className="text-gray-600 ml-2">/{getPeriod(plan)}</span>
                  </div>
                </div>

                {/* Features List */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      {feature.included ? (
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      ) : (
                        <X className="w-5 h-5 text-gray-300 mr-3 flex-shrink-0" />
                      )}
                      <span className={`${feature.included ? 'text-gray-700' : 'text-gray-400'}`}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Link href={plan.ctaLink}>
                  <Button className={`w-full py-3 rounded-xl transition-all duration-300 ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl' 
                      : plan.name === 'Free'
                      ? 'bg-gray-900 hover:bg-gray-800 text-white'
                      : `bg-gradient-to-r ${plan.color} hover:shadow-lg text-white`
                  }`}>
                    {plan.cta}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Grid */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need Included
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              All plans include these powerful features to help you build amazing websites
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about our pricing
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {faqs.map((faq, index) => (
                <Card key={index} className="bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 rounded-2xl">
                  <CardContent className="p-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{faq.question}</h3>
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Enterprise CTA */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-12 text-center text-white">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-4">Need Something Custom?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Looking for enterprise features, custom integrations, or volume discounts? 
              Let's talk about a plan that fits your specific needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-3 rounded-xl">
                  Contact Sales
                </Button>
              </Link>
              <Link href="/demo">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 rounded-xl">
                  Schedule Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center mt-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of creators building amazing websites with SiteBuilder
          </p>
          <Link href="/signup">
            <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-12 py-4 text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300">
              Start Building Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
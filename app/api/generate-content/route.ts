import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Extract the input parameter (could be topic, productName, portfolioInfo, etc.)
    const input = body.topic || body.productName || body.portfolioInfo || body.blogInfo || body.healthProductName || 'general business'

    // Simulate AI content generation with realistic, comprehensive content
    // In a real implementation, this would call an actual AI service like OpenAI, Claude, etc.

    const generateContent = (input: string, templateType?: string) => {
      // Base content that works for most templates
      const baseContent: Record<string, string> = {
        // Branding
        "company-name": extractCompanyName(input),
        "brand-name": extractCompanyName(input),
        "site-name": extractCompanyName(input),

        // Hero section
        "hero-title": `Transform Your Business with ${extractCompanyName(input)}`,
        "main-title": `Welcome to ${extractCompanyName(input)}`,
        "hero-subtitle": `Innovative solutions that drive real results for your business`,
        "tagline": `Your trusted partner for ${input.toLowerCase()} excellence`,
        "hero-cta": "Get Started Today",
        "main-cta": "Learn More",

        // About section
        "about-title": "About Our Company",
        "about-description": `We are a leading provider of ${input.toLowerCase()} solutions, dedicated to helping businesses achieve their goals through innovative technology and exceptional service. Our team of experts brings years of experience and a passion for excellence to every project.`,
        "company-description": `Specializing in ${input.toLowerCase()}, we deliver cutting-edge solutions that transform how businesses operate and grow.`,

        // Features
        "features": `Advanced Technology: Cutting-edge solutions built with the latest technology
Expert Support: 24/7 customer support from our experienced team  
Scalable Solutions: Grow your business with solutions that scale with you
Cost Effective: Maximize ROI with our efficient and affordable services
Easy Integration: Seamless integration with your existing systems
Proven Results: Track record of success with measurable outcomes`,

        // Services
        "services": `Consultation: Expert advice tailored to your specific needs
Implementation: Professional setup and configuration services
Training: Comprehensive training for your team
Support: Ongoing support and maintenance
Optimization: Continuous improvement and optimization
Analytics: Detailed reporting and performance analytics`,

        // Contact
        "contact-title": "Ready to Get Started?",
        "contact-description": `Contact us today to learn how we can help transform your ${input.toLowerCase()} operations.`,
        "contact-cta": "Contact Us Now",

        // Testimonials
        "testimonial-1": `"Working with ${extractCompanyName(input)} has been a game-changer for our business. Their expertise in ${input.toLowerCase()} is unmatched."`,
        "testimonial-2": `"The results speak for themselves. We've seen significant improvements since implementing their ${input.toLowerCase()} solutions."`,
        "testimonial-3": `"Professional, reliable, and results-driven. ${extractCompanyName(input)} exceeded our expectations in every way."`,

        // Footer
        "footer-description": `${extractCompanyName(input)} - Your trusted partner for ${input.toLowerCase()} solutions and business growth.`
      }

      // Add template-specific content based on the request parameters
      if (body.productName) {
        return {
          ...baseContent,
          "product-name": body.productName,
          "product-title": `Introducing ${body.productName}`,
          "product-tagline": `The ultimate solution for ${input.toLowerCase()} excellence`,
          "product-description": `${body.productName} is a revolutionary product designed to transform how you approach ${input.toLowerCase()}. Built with cutting-edge technology and user-centric design.`,
          "product-features": `Smart Technology: AI-powered features that adapt to your needs
User-Friendly: Intuitive interface designed for ease of use
Reliable Performance: Consistent results you can count on
Scalable Design: Grows with your business needs
Expert Support: Dedicated customer success team
Proven Results: Trusted by thousands of satisfied customers`,
          "product-cta": `Try ${body.productName} Now`
        }
      }

      if (body.portfolioInfo) {
        const name = extractPersonName(body.portfolioInfo)
        return {
          ...baseContent,
          "portfolio-name": name,
          "hero-name": name,
          "portfolio-role": `${input} Specialist & Creative Professional`,
          "portfolio-bio": `Passionate ${input.toLowerCase()} professional with expertise in creating innovative solutions that drive results. Dedicated to excellence and continuous learning.`,
          "hero-title": `${name} - ${input} Expert`,
          "hero-description": `Creating exceptional ${input.toLowerCase()} experiences through innovative design and strategic thinking.`,
          "about-description": `With years of experience in ${input.toLowerCase()}, I specialize in delivering high-quality solutions that exceed client expectations. My approach combines creativity with technical expertise to achieve outstanding results.`
        }
      }

      if (body.blogInfo) {
        return {
          ...baseContent,
          "blog-title": `${extractCompanyName(input)} Blog`,
          "blog-subtitle": `Insights, tips, and trends in ${input.toLowerCase()}`,
          "featured-post-title": `The Future of ${input}: Trends to Watch in 2024`,
          "featured-post-excerpt": `Explore the latest developments and emerging trends that are shaping the ${input.toLowerCase()} industry.`,
          "featured-post-author": "Industry Expert"
        }
      }

      if (body.healthProductName) {
        return {
          ...baseContent,
          "hero-title": `Revolutionary ${body.healthProductName}`,
          "hero-subtitle": `Advanced health solution for optimal wellness`,
          "problem-title": "Common Health Challenges",
          "problem-subtitle": `Many people struggle with health issues that could be addressed with the right solution.`,
          "product-name": body.healthProductName,
          "health-benefit": `${body.healthProductName} provides scientifically-proven benefits for improved health and wellness.`
        }
      }

      // Template-specific enhancements
      if (input.toLowerCase().includes('saas') || input.toLowerCase().includes('software')) {
        baseContent["saas-benefit-1"] = "Increase Productivity by 300%"
        baseContent["saas-benefit-2"] = "Reduce Costs by 50%"
        baseContent["saas-benefit-3"] = "Seamless Integration"
        baseContent["pricing-title"] = "Simple, Transparent Pricing"
      }

      return baseContent
    }

    const content = generateContent(input)

    return NextResponse.json(content)
  } catch (error) {
    console.error('Error generating AI content:', error)
    return NextResponse.json({ error: 'Failed to generate content' }, { status: 500 })
  }
}

// Helper function to extract company name from input
function extractCompanyName(input: string): string {
  // Simple extraction - in a real implementation, this could be more sophisticated
  const words = input.split(' ')
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase() + words[0].slice(1)
  }

  // Take first two words and capitalize
  return words.slice(0, 2)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Helper function to extract person name from input
function extractPersonName(input: string): string {
  const words = input.split(' ')

  // Look for name patterns
  const nameWords = words.filter(word =>
    word.length > 2 &&
    /^[A-Za-z]+$/.test(word) &&
    !['the', 'and', 'for', 'with', 'about'].includes(word.toLowerCase())
  )

  if (nameWords.length >= 2) {
    return `${nameWords[0]} ${nameWords[1]}`
  } else if (nameWords.length === 1) {
    return `${nameWords[0]} Smith`
  }

  return "John Doe"
}
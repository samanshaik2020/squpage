// API route for generating content using Gemini API
export async function POST(req: Request) {
  try {
    const { productName, topic, portfolioInfo, blogInfo } = await req.json()
    const inputContent = productName || topic || portfolioInfo || blogInfo

    if (!inputContent) {
      return new Response(JSON.stringify({ error: "Input content is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Check if API key exists
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY
    if (!apiKey) {
      console.error("API key is not defined in environment variables");
      return new Response(JSON.stringify({ error: "API key not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    let prompt = ""

    if (productName) {
      // Product landing page prompt
      prompt = `Generate a comprehensive product landing page for "${productName}".

You MUST format your response EXACTLY with the following sections, each starting with the exact label followed by a colon:

PRODUCT_NAME: The product name (use the provided name)
TITLE: A catchy title for the product
TAGLINE: A short, memorable tagline that highlights the main value proposition (2-3 sentences)
ABOUT_TITLE: A compelling title for the about section
DESCRIPTION: A compelling 3-4 sentence description that explains what the product is and its main benefits
FEATURES: List 6 key features with brief descriptions in the format "Feature Name: Feature Description" (one per line)
HOW_IT_WORKS: List 3 steps explaining how the product works in the format "Step Title: Step Description" (one per line)
TESTIMONIALS: 3 customer testimonials as quotes (one per line)
FAQS: 5 frequently asked questions with answers in the format "Question? Answer" (one per line)
CTA: A call-to-action phrase for the button
FINAL_CTA_TITLE: A compelling title for the final call-to-action section
FINAL_CTA_DESCRIPTION: A persuasive description for the final call-to-action

Do not add any additional text, commentary, or sections. Keep your response structured exactly as requested with these section headers.`
    } else if (portfolioInfo) {
      // Portfolio prompt
      prompt = `Generate a professional portfolio for "${portfolioInfo}".

You MUST format your response EXACTLY with the following sections, each starting with the exact label followed by a colon:

PORTFOLIO_NAME: The person's name
HERO_TITLE: Professional title/role (e.g., "Full Stack Developer")
HERO_DESCRIPTION: A compelling 2-3 sentence professional summary
ABOUT_DESCRIPTION: A detailed 4-5 sentence about section describing background and expertise
SKILLS: List 8 technical skills (one per line)
PROJECTS: List 6 projects with descriptions in the format "Project Name: Project Description" (one per line)
EXPERIENCE: List 3 work experiences in the format "Job Title at Company Name" (one per line)
CONTACT_EMAIL: Professional email address

Do not add any additional text, commentary, or sections. Keep your response structured exactly as requested with these section headers.`
    } else if (blogInfo) {
      // Blog page prompt
      prompt = `Generate a comprehensive blog page for "${blogInfo}".

You MUST format your response EXACTLY with the following sections, each starting with the exact label followed by a colon:

BLOG_NAME: The blog name
BLOG_TITLE: A catchy welcome title for the blog
BLOG_SUBTITLE: A subtitle describing what the blog is about
FEATURED_POST_TITLE: Title for the featured article
FEATURED_POST_EXCERPT: A compelling excerpt for the featured article
FEATURED_POST_AUTHOR: Author name for the featured post
RECENT_POSTS: List 6 recent blog post titles with brief descriptions in the format "Title: Description" (one per line)
CATEGORIES: List 8 blog categories (one per line)

Do not add any additional text, commentary, or sections. Keep your response structured exactly as requested with these section headers.`
    } else {
      // Blog post prompt
      prompt = `Generate content for a blog post about "${topic}". Provide a title, an introduction (1 paragraph), three main body paragraphs, and a conclusion (1 paragraph). Format it strictly as follows:

TITLE: [Create a compelling title for the blog post]

INTRODUCTION: [Write an engaging introduction paragraph that hooks the reader]

PARAGRAPH 1: [Write the first main paragraph of the blog post]

PARAGRAPH 2: [Write the second main paragraph of the blog post]

PARAGRAPH 3: [Write the third main paragraph of the blog post]

CONCLUSION: [Write a conclusion paragraph that summarizes the main points]`
    }

    // Generate content using AI
    let text;
    try {
      console.log("Using API key:", apiKey.substring(0, 5) + "...");
      console.log("Generating content with prompt:", prompt.substring(0, 50) + "...");

      // Call Gemini API directly using fetch based on the curl example
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-goog-api-key": apiKey
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt
                  }
                ]
              }
            ]
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Raw API response:", JSON.stringify(data).substring(0, 200) + "...");

      // Check if the response has the expected structure
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts[0]) {
        throw new Error("Unexpected API response structure");
      }

      text = data.candidates[0].content.parts[0].text;
      console.log("Generated text sample:", text.substring(0, 100) + "...");
      console.log("Generated text length:", text.length);
    } catch (genError) {
      console.error("Error with AI generation:", genError);
      return new Response(JSON.stringify({ error: "Failed to generate content with AI" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Parse the structured text response
    const parseContent = (fullText: string) => {
      const lines = fullText.split("\n").filter((line) => line.trim() !== "")
      const contentMap: { [key: string]: string } = {}
      let currentKey: string | null = null
      let currentContent: string[] = []

      for (const line of lines) {
        if (line.startsWith("PRODUCT_NAME:")) {
          if (currentKey) contentMap[currentKey] = currentContent.join("\n").trim()
          currentKey = "product-name"
          currentContent = [line.substring("PRODUCT_NAME:".length).trim()]
        } else if (line.startsWith("TITLE:")) {
          if (currentKey) contentMap[currentKey] = currentContent.join("\n").trim()
          currentKey = "product-title"
          currentContent = [line.substring("TITLE:".length).trim()]
        } else if (line.startsWith("TAGLINE:")) {
          if (currentKey) contentMap[currentKey] = currentContent.join("\n").trim()
          currentKey = "product-tagline"
          currentContent = [line.substring("TAGLINE:".length).trim()]
        } else if (line.startsWith("ABOUT_TITLE:")) {
          if (currentKey) contentMap[currentKey] = currentContent.join("\n").trim()
          currentKey = "about-title"
          currentContent = [line.substring("ABOUT_TITLE:".length).trim()]
        } else if (line.startsWith("DESCRIPTION:")) {
          if (currentKey) contentMap[currentKey] = currentContent.join("\n").trim()
          currentKey = "product-description"
          currentContent = [line.substring("DESCRIPTION:".length).trim()]
        } else if (line.startsWith("FEATURES:")) {
          if (currentKey) contentMap[currentKey] = currentContent.join("\n").trim()
          currentKey = "product-features"
          currentContent = [line.substring("FEATURES:".length).trim()]
        } else if (line.startsWith("HOW_IT_WORKS:")) {
          if (currentKey) contentMap[currentKey] = currentContent.join("\n").trim()
          currentKey = "how-it-works"
          currentContent = [line.substring("HOW_IT_WORKS:".length).trim()]
        } else if (line.startsWith("TESTIMONIALS:")) {
          if (currentKey) contentMap[currentKey] = currentContent.join("\n").trim()
          currentKey = "testimonials"
          currentContent = [line.substring("TESTIMONIALS:".length).trim()]
        } else if (line.startsWith("FAQS:")) {
          if (currentKey) contentMap[currentKey] = currentContent.join("\n").trim()
          currentKey = "faqs"
          currentContent = [line.substring("FAQS:".length).trim()]
        } else if (line.startsWith("CTA:")) {
          if (currentKey) contentMap[currentKey] = currentContent.join("\n").trim()
          currentKey = "product-cta"
          currentContent = [line.substring("CTA:".length).trim()]
        } else if (line.startsWith("FINAL_CTA_TITLE:")) {
          if (currentKey) contentMap[currentKey] = currentContent.join("\n").trim()
          currentKey = "final-cta-title"
          currentContent = [line.substring("FINAL_CTA_TITLE:".length).trim()]
        } else if (line.startsWith("FINAL_CTA_DESCRIPTION:")) {
          if (currentKey) contentMap[currentKey] = currentContent.join("\n").trim()
          currentKey = "final-cta-description"
          currentContent = [line.substring("FINAL_CTA_DESCRIPTION:".length).trim()]
        } else if (line.startsWith("PORTFOLIO_NAME:")) {
          if (currentKey) contentMap[currentKey] = currentContent.join("\n").trim()
          currentKey = "portfolio-name"
          currentContent = [line.substring("PORTFOLIO_NAME:".length).trim()]
        } else if (line.startsWith("HERO_TITLE:")) {
          if (currentKey) contentMap[currentKey] = currentContent.join("\n").trim()
          currentKey = "hero-title"
          currentContent = [line.substring("HERO_TITLE:".length).trim()]
        } else if (line.startsWith("HERO_DESCRIPTION:")) {
          if (currentKey) contentMap[currentKey] = currentContent.join("\n").trim()
          currentKey = "hero-description"
          currentContent = [line.substring("HERO_DESCRIPTION:".length).trim()]
        } else if (line.startsWith("ABOUT_DESCRIPTION:")) {
          if (currentKey) contentMap[currentKey] = currentContent.join("\n").trim()
          currentKey = "about-description"
          currentContent = [line.substring("ABOUT_DESCRIPTION:".length).trim()]
        } else if (line.startsWith("SKILLS:")) {
          if (currentKey) contentMap[currentKey] = currentContent.join("\n").trim()
          currentKey = "skills"
          currentContent = [line.substring("SKILLS:".length).trim()]
        } else if (line.startsWith("PROJECTS:")) {
          if (currentKey) contentMap[currentKey] = currentContent.join("\n").trim()
          currentKey = "projects"
          currentContent = [line.substring("PROJECTS:".length).trim()]
        } else if (line.startsWith("EXPERIENCE:")) {
          if (currentKey) contentMap[currentKey] = currentContent.join("\n").trim()
          currentKey = "experience"
          currentContent = [line.substring("EXPERIENCE:".length).trim()]
        } else if (line.startsWith("CONTACT_EMAIL:")) {
          if (currentKey) contentMap[currentKey] = currentContent.join("\n").trim()
          currentKey = "contact-email"
          currentContent = [line.substring("CONTACT_EMAIL:".length).trim()]
        } else if (line.startsWith("BLOG_NAME:")) {
          if (currentKey) contentMap[currentKey] = currentContent.join("\n").trim()
          currentKey = "blog-name"
          currentContent = [line.substring("BLOG_NAME:".length).trim()]
        } else if (line.startsWith("BLOG_TITLE:")) {
          if (currentKey) contentMap[currentKey] = currentContent.join("\n").trim()
          currentKey = "blog-title"
          currentContent = [line.substring("BLOG_TITLE:".length).trim()]
        } else if (line.startsWith("BLOG_SUBTITLE:")) {
          if (currentKey) contentMap[currentKey] = currentContent.join("\n").trim()
          currentKey = "blog-subtitle"
          currentContent = [line.substring("BLOG_SUBTITLE:".length).trim()]
        } else if (line.startsWith("FEATURED_POST_TITLE:")) {
          if (currentKey) contentMap[currentKey] = currentContent.join("\n").trim()
          currentKey = "featured-post-title"
          currentContent = [line.substring("FEATURED_POST_TITLE:".length).trim()]
        } else if (line.startsWith("FEATURED_POST_EXCERPT:")) {
          if (currentKey) contentMap[currentKey] = currentContent.join("\n").trim()
          currentKey = "featured-post-excerpt"
          currentContent = [line.substring("FEATURED_POST_EXCERPT:".length).trim()]
        } else if (line.startsWith("FEATURED_POST_AUTHOR:")) {
          if (currentKey) contentMap[currentKey] = currentContent.join("\n").trim()
          currentKey = "featured-post-author"
          currentContent = [line.substring("FEATURED_POST_AUTHOR:".length).trim()]
        } else if (line.startsWith("RECENT_POSTS:")) {
          if (currentKey) contentMap[currentKey] = currentContent.join("\n").trim()
          currentKey = "recent-posts"
          currentContent = [line.substring("RECENT_POSTS:".length).trim()]
        } else if (line.startsWith("CATEGORIES:")) {
          if (currentKey) contentMap[currentKey] = currentContent.join("\n").trim()
          currentKey = "categories"
          currentContent = [line.substring("CATEGORIES:".length).trim()]
        } else if (currentKey) {
          currentContent.push(line.trim())
        }
      }
      if (currentKey) contentMap[currentKey] = currentContent.join("\n").trim()
      return contentMap
    }

    const generatedContent = parseContent(text)

    return new Response(JSON.stringify(generatedContent), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Error generating content:", error)
    return new Response(JSON.stringify({ error: "Failed to generate content" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

// API route for generating content using Gemini API
export async function POST(req: Request) {
  try {
    const { productName, topic } = await req.json()
    const inputContent = productName || topic

    if (!inputContent) {
      return new Response(JSON.stringify({ error: "Product name or topic is required" }), {
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
      prompt = `Generate a product landing page for "${productName}".

You MUST format your response EXACTLY with the following sections, each starting with the exact label followed by a colon:

TITLE: A catchy title for the product
TAGLINE: A short, memorable tagline that highlights the main value proposition
DESCRIPTION: A compelling 2-3 sentence description that explains what the product is and its main benefits
FEATURES: List 4 key features with brief descriptions in the format "Feature Name: Feature Description"
CTA: A call-to-action phrase for the button
IMAGE_DESCRIPTION: A brief description of what the product image should show

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
        if (line.startsWith("TITLE:")) {
          if (currentKey) contentMap[currentKey] = currentContent.join("\n").trim()
          currentKey = "product-title"
          currentContent = [line.substring("TITLE:".length).trim()]
        } else if (line.startsWith("TAGLINE:")) {
          if (currentKey) contentMap[currentKey] = currentContent.join("\n").trim()
          currentKey = "product-tagline"
          currentContent = [line.substring("TAGLINE:".length).trim()]
        } else if (line.startsWith("DESCRIPTION:")) {
          if (currentKey) contentMap[currentKey] = currentContent.join("\n").trim()
          currentKey = "product-description"
          currentContent = [line.substring("DESCRIPTION:".length).trim()]
        } else if (line.startsWith("FEATURES:")) {
          if (currentKey) contentMap[currentKey] = currentContent.join("\n").trim()
          currentKey = "product-features"
          currentContent = [line.substring("FEATURES:".length).trim()]
        } else if (line.startsWith("CTA:")) {
          if (currentKey) contentMap[currentKey] = currentContent.join("\n").trim()
          currentKey = "product-cta"
          currentContent = [line.substring("CTA:".length).trim()]
        } else if (line.startsWith("IMAGE_DESCRIPTION:")) {
          if (currentKey) contentMap[currentKey] = currentContent.join("\n").trim()
          currentKey = "product-image-desc"
          currentContent = [line.substring("IMAGE_DESCRIPTION:".length).trim()]
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

import { generateText } from "ai"
import { google } from "@ai-sdk/google"

export async function POST(req: Request) {
  try {
    const { topic } = await req.json()

    if (!topic) {
      return new Response(JSON.stringify({ error: "Topic is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    const { text } = await generateText({
      model: google("models/gemini-1.5-flash-latest", { apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY }), // Using gemini-1.5-flash-latest as it's generally available and fast
      prompt: `Generate content for a blog post about "${topic}". Provide a title, an introduction (1 paragraph), three main body paragraphs, and a conclusion (1 paragraph). Format it strictly as follows:

TITLE: [Your generated title here]

INTRO: [Your generated introduction here]

PARAGRAPH1: [Your first main paragraph here]

PARAGRAPH2: [Your second main paragraph here]

PARAGRAPH3: [Your third main paragraph here]

CONCLUSION: [Your generated conclusion here]`,
    })

    // Parse the structured text response
    const parseContent = (fullText: string) => {
      const lines = fullText.split("\n").filter((line) => line.trim() !== "")
      const contentMap: { [key: string]: string } = {}
      let currentKey: string | null = null
      let currentContent: string[] = []

      for (const line of lines) {
        if (line.startsWith("TITLE:")) {
          if (currentKey) contentMap[currentKey] = currentContent.join("\n").trim()
          currentKey = "blog-title"
          currentContent = [line.substring("TITLE:".length).trim()]
        } else if (line.startsWith("INTRO:")) {
          if (currentKey) contentMap[currentKey] = currentContent.join("\n").trim()
          currentKey = "blog-intro"
          currentContent = [line.substring("INTRO:".length).trim()]
        } else if (line.startsWith("PARAGRAPH1:")) {
          if (currentKey) contentMap[currentKey] = currentContent.join("\n").trim()
          currentKey = "blog-paragraph-1"
          currentContent = [line.substring("PARAGRAPH1:".length).trim()]
        } else if (line.startsWith("PARAGRAPH2:")) {
          if (currentKey) contentMap[currentKey] = currentContent.join("\n").trim()
          currentKey = "blog-paragraph-2"
          currentContent = [line.substring("PARAGRAPH2:".length).trim()]
        } else if (line.startsWith("PARAGRAPH3:")) {
          if (currentKey) contentMap[currentKey] = currentContent.join("\n").trim()
          currentKey = "blog-paragraph-3"
          currentContent = [line.substring("PARAGRAPH3:".length).trim()]
        } else if (line.startsWith("CONCLUSION:")) {
          if (currentKey) contentMap[currentKey] = currentContent.join("\n").trim()
          currentKey = "blog-conclusion"
          currentContent = [line.substring("CONCLUSION:".length).trim()]
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

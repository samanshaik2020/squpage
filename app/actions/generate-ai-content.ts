"use server"

import { generateObject } from "ai"
import { google } from "@ai-sdk/google"
import { z } from "zod"

// Define the schema for the expected AI output
const contentSchema = z.object({
  title: z.string().describe("A compelling title for the content"),
  body: z.string().describe("A short paragraph (around 100 words) explaining the topic"),
})

export async function generateAIContent(formData: FormData) {
  const topic = formData.get("topic") as string

  if (!topic) {
    return { error: "Topic is required" }
  }

  try {
    const { object } = await generateObject({
      model: google("models/gemini-1.5-flash-latest"), // Using a suitable Gemini model
      schema: contentSchema,
      prompt: `Generate a compelling title and a short paragraph (around 100 words) about the following topic: "${topic}".`,
    })

    return { success: true, content: object }
  } catch (error) {
    console.error("Error generating AI content:", error)
    return { error: "Failed to generate content. Please try again." }
  }
}

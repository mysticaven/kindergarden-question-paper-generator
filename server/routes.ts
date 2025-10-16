import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateQuestionsSchema } from "@shared/schema";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  app.post("/api/generate-questions", async (req, res) => {
    try {
      const validatedData = generateQuestionsSchema.parse(req.body);
      
      const { curriculum, questionTypes, questionCount, examDetails } = validatedData;
      
      // Generate questions using OpenAI
      const questionsPrompt = `You are a kindergarten teacher creating an exam paper. 
Generate ${questionCount} questions based on this curriculum:
${curriculum}

Question types to include: ${questionTypes.join(", ")}

For each question:
1. Make it age-appropriate for kindergarten (ages 4-6)
2. Keep language simple and clear
3. Make it engaging and fun
4. Include a brief description of what image should accompany it

Return a JSON array of questions with this format:
[
  {
    "type": "counting|comparison|colors|shapes|numbers|patterns",
    "question": "The question text",
    "imagePrompt": "Detailed prompt for generating an image for this question (describe what should be in the image, e.g., '5 red apples arranged on a white background')"
  }
]

Important: Return ONLY the JSON array, no other text.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a helpful kindergarten teacher assistant that creates educational content. Always respond with valid JSON only."
          },
          {
            role: "user",
            content: questionsPrompt
          }
        ],
        temperature: 0.8,
      });

      const questionsText = completion.choices[0].message.content || "[]";
      let generatedQuestions = JSON.parse(questionsText);

      // Generate images for each question using DALL-E
      const questionsWithImages = await Promise.all(
        generatedQuestions.map(async (q: any, index: number) => {
          try {
            const imageResponse = await openai.images.generate({
              model: "dall-e-3",
              prompt: `Create a simple, colorful, child-friendly illustration for a kindergarten worksheet: ${q.imagePrompt}. Style: Clean, bright colors, simple shapes, educational, suitable for young children. No text in the image.`,
              size: "1024x1024",
              quality: "standard",
              n: 1,
            });

            return {
              id: `q-${index + 1}`,
              type: q.type,
              question: q.question,
              imageUrl: imageResponse.data?.[0]?.url,
            };
          } catch (error) {
            console.error(`Error generating image for question ${index + 1}:`, error);
            return {
              id: `q-${index + 1}`,
              type: q.type,
              question: q.question,
              imageUrl: undefined,
            };
          }
        })
      );

      const questionPaper = {
        examDetails,
        questions: questionsWithImages,
      };

      const saved = await storage.saveQuestionPaper(questionPaper);

      res.json(saved);
    } catch (error: any) {
      console.error("Error generating questions:", error);
      
      // Check for OpenAI quota/rate limit errors
      if (error?.status === 429 || error?.code === 'insufficient_quota' || error?.message?.includes('quota')) {
        return res.status(429).json({ 
          error: "OpenAI API quota exceeded",
          details: "Your OpenAI API key has insufficient quota or credits. Please check your OpenAI account billing at https://platform.openai.com/account/billing"
        });
      }

      // Check for authentication errors
      if (error?.status === 401 || error?.code === 'invalid_api_key') {
        return res.status(401).json({ 
          error: "Invalid OpenAI API key",
          details: "Please check your OPENAI_API_KEY environment variable"
        });
      }
      
      res.status(500).json({ 
        error: "Failed to generate questions",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.get("/api/question-paper/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const paper = await storage.getQuestionPaper(id);
      
      if (!paper) {
        return res.status(404).json({ error: "Question paper not found" });
      }

      res.json(paper);
    } catch (error) {
      console.error("Error fetching question paper:", error);
      res.status(500).json({ error: "Failed to fetch question paper" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

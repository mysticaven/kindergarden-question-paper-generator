import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateQuestionsSchema } from "@shared/schema";
import multer from "multer";
import { Document, Packer, Paragraph, TextRun, ImageRun, AlignmentType, HeadingLevel } from "docx";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for image uploads
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage_config = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage_config,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Free question templates for kindergarten
const questionTemplates = {
  counting: [
    { question: "Count the apples. How many apples are there?", imagePrompt: "apples", answer: "5" },
    { question: "How many flowers do you see?", imagePrompt: "flowers", answer: "3" },
    { question: "Count the stars. How many stars are there?", imagePrompt: "stars", answer: "4" },
    { question: "How many balloons are in the picture?", imagePrompt: "balloons", answer: "6" },
    { question: "Count the butterflies. How many do you see?", imagePrompt: "butterflies", answer: "7" },
  ],
  comparison: [
    { question: "Which group has more items - the cats or the dogs?", imagePrompt: "cats and dogs", answer: "cats" },
    { question: "Circle the bigger object.", imagePrompt: "big and small objects", answer: "varies" },
    { question: "Which tree is taller?", imagePrompt: "two trees", answer: "left tree" },
    { question: "Point to the smaller ball.", imagePrompt: "two balls", answer: "right ball" },
    { question: "Which box has fewer toys?", imagePrompt: "boxes with toys", answer: "left box" },
  ],
  colors: [
    { question: "What color is the sun?", imagePrompt: "sun", answer: "yellow" },
    { question: "Find and color all the red objects.", imagePrompt: "objects to color", answer: "red items" },
    { question: "What color is the sky?", imagePrompt: "sky", answer: "blue" },
    { question: "Circle all the green items.", imagePrompt: "various colored items", answer: "green items" },
    { question: "What color are the leaves?", imagePrompt: "tree with leaves", answer: "green" },
  ],
  shapes: [
    { question: "How many circles can you find?", imagePrompt: "circles", answer: "4" },
    { question: "Draw a square in the box below.", imagePrompt: "empty box", answer: "square drawn" },
    { question: "Which shape is a triangle?", imagePrompt: "various shapes", answer: "triangle" },
    { question: "Count the rectangles.", imagePrompt: "rectangles", answer: "3" },
    { question: "Circle all the star shapes.", imagePrompt: "mixed shapes", answer: "stars" },
  ],
  numbers: [
    { question: "Circle the number 5.", imagePrompt: "numbers 1-10", answer: "5" },
    { question: "Write the number that comes after 3.", imagePrompt: "number line", answer: "4" },
    { question: "What number is this? (showing 7)", imagePrompt: "number 7", answer: "7" },
    { question: "Count and write the number.", imagePrompt: "objects to count", answer: "varies" },
    { question: "Which number is bigger: 2 or 6?", imagePrompt: "numbers 2 and 6", answer: "6" },
  ],
  patterns: [
    { question: "What comes next in the pattern? (red, blue, red, blue, ___)", imagePrompt: "color pattern", answer: "red" },
    { question: "Complete the pattern: (circle, square, circle, square, ___)", imagePrompt: "shape pattern", answer: "circle" },
    { question: "What shape comes next? (triangle, circle, triangle, ___)", imagePrompt: "pattern sequence", answer: "circle" },
    { question: "Continue the number pattern: 1, 2, 3, ___", imagePrompt: "number pattern", answer: "4" },
    { question: "What's missing in the pattern? (star, moon, star, ___, star)", imagePrompt: "celestial pattern", answer: "moon" },
  ],
};

// Free placeholder images using placeholder services
function getPlaceholderImage(type: string, prompt: string): string {
  // Using a free placeholder image service with educational themes
  const seed = encodeURIComponent(prompt);
  const colors = {
    counting: "FFB6C1,87CEEB",
    comparison: "98FB98,DDA0DD", 
    colors: "FFD700,FF69B4",
    shapes: "87CEEB,FFB6C1",
    numbers: "F0E68C,DDA0DD",
    patterns: "E0BBE4,FFDAB9",
  };
  
  const colorScheme = colors[type as keyof typeof colors] || "FFB6C1,87CEEB";
  
  // Using Picsum Photos with a seed for consistent images
  return `https://picsum.photos/seed/${seed}/400/400`;
}

function generateQuestionsFromTemplates(
  questionTypes: string[],
  questionCount: number,
  curriculum: string
): Array<{ id: string; type: string; question: string; imageUrl: string }> {
  const questions: Array<{ id: string; type: string; question: string; imageUrl: string }> = [];
  const typesPool = questionTypes.length > 0 ? questionTypes : Object.keys(questionTemplates);
  
  for (let i = 0; i < questionCount; i++) {
    const type = typesPool[i % typesPool.length];
    const templates = questionTemplates[type as keyof typeof questionTemplates] || questionTemplates.counting;
    const template = templates[i % templates.length];
    
    questions.push({
      id: `q-${i + 1}`,
      type: type,
      question: template.question,
      imageUrl: getPlaceholderImage(type, template.imagePrompt + i),
    });
  }
  
  return questions;
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Serve uploaded images using express.static
  app.use('/uploads', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
  });
  
  const express = await import('express');
  app.use('/uploads', express.default.static(uploadDir, { 
    fallthrough: false,
    index: false 
  }));

  // Multer error handling middleware
  const multerErrorHandler = (error: any, req: any, res: any, next: any) => {
    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File size exceeds 5MB limit' });
      }
      return res.status(400).json({ error: `Upload error: ${error.message}` });
    } else if (error) {
      return res.status(400).json({ error: error.message || 'Invalid file upload' });
    }
    next();
  };

  // Image upload endpoint
  app.post("/api/upload-image", upload.single('image'), multerErrorHandler, async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image file uploaded" });
      }

      const imageUrl = `/uploads/${req.file.filename}`;
      res.json({ imageUrl });
    } catch (error: any) {
      console.error("Error uploading image:", error);
      res.status(500).json({ 
        error: "Failed to upload image",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  
  app.post("/api/generate-questions", async (req, res) => {
    try {
      const validatedData = generateQuestionsSchema.parse(req.body);
      
      const { curriculum, questionTypes, questionCount, examDetails } = validatedData;
      
      // Generate questions using free templates
      const questionsWithImages = generateQuestionsFromTemplates(
        questionTypes,
        questionCount,
        curriculum
      );

      const questionPaper = {
        examDetails,
        questions: questionsWithImages,
      };

      const saved = await storage.saveQuestionPaper(questionPaper);

      res.json(saved);
    } catch (error: any) {
      console.error("Error generating questions:", error);
      
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

  // Word document export endpoint
  app.post("/api/export-word", async (req, res) => {
    try {
      const { examDetails, questions } = req.body;

      if (!examDetails || !questions) {
        return res.status(400).json({ error: "Missing exam details or questions" });
      }

      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            // Header
            new Paragraph({
              text: examDetails.schoolName || "School Name",
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER,
            }),
            examDetails.schoolAddress ? new Paragraph({
              text: examDetails.schoolAddress,
              alignment: AlignmentType.CENTER,
            }) : new Paragraph({ text: "" }),
            new Paragraph({
              text: examDetails.examTitle || "Exam Title",
              heading: HeadingLevel.HEADING_2,
              alignment: AlignmentType.CENTER,
            }),
            examDetails.grade ? new Paragraph({
              text: examDetails.grade,
              alignment: AlignmentType.CENTER,
            }) : new Paragraph({ text: "" }),
            examDetails.subject ? new Paragraph({
              text: examDetails.subject,
              alignment: AlignmentType.CENTER,
            }) : new Paragraph({ text: "" }),
            new Paragraph({ text: "" }), // Empty line
            
            // Student info
            examDetails.includeStudentName ? new Paragraph({
              children: [
                new TextRun({ text: "Name: ", bold: true }),
                new TextRun({ text: "_".repeat(50) }),
              ],
            }) : new Paragraph({ text: "" }),
            examDetails.includeDate ? new Paragraph({
              children: [
                new TextRun({ text: "Date: ", bold: true }),
                new TextRun({ text: "_".repeat(30) }),
              ],
            }) : new Paragraph({ text: "" }),
            new Paragraph({ text: "" }), // Empty line
            
            // Questions
            ...questions.flatMap((q: any, index: number) => [
              new Paragraph({
                children: [
                  new TextRun({ text: `${index + 1}. `, bold: true }),
                  new TextRun({ text: q.question }),
                ],
              }),
              new Paragraph({ text: "" }), // Space for image
              new Paragraph({
                children: [
                  new TextRun({ text: "Answer: ", bold: true }),
                ],
              }),
              new Paragraph({
                text: "_".repeat(80),
              }),
              new Paragraph({ text: "" }), // Empty line between questions
            ]),
            
            // Footer
            new Paragraph({ text: "" }),
            new Paragraph({
              text: "PREPARED BY: _______________     CHECKED BY: _______________",
              alignment: AlignmentType.CENTER,
            }),
          ],
        }],
      });

      const buffer = await Packer.toBuffer(doc);
      
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      res.setHeader('Content-Disposition', `attachment; filename=exam-paper-${Date.now()}.docx`);
      res.send(buffer);
    } catch (error) {
      console.error("Error generating Word document:", error);
      res.status(500).json({ error: "Failed to generate Word document" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

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

// Free question templates for kindergarten (authentic patterns from real worksheets)
const questionTemplates = {
  counting: [
    { question: "Q. Count the apples and write the number.", imagePrompt: "5 apples", answer: "5" },
    { question: "Q. How many flowers do you see? Circle the correct number.", imagePrompt: "3 flowers with numbers", answer: "3" },
    { question: "Q. Count the stars. Write the number in the box.", imagePrompt: "4 stars with empty box", answer: "4" },
    { question: "Q. Circle the group that has 6 balloons.", imagePrompt: "groups of balloons", answer: "6" },
    { question: "Q. Count and match: How many butterflies?", imagePrompt: "butterflies to count", answer: "7" },
  ],
  comparison: [
    { question: "Q. Circle the bigger object.", imagePrompt: "big and small objects", answer: "bigger" },
    { question: "Q. Which tree is taller? Put a tick (✓) mark.", imagePrompt: "two trees", answer: "taller tree" },
    { question: "Q. Circle the group with more items.", imagePrompt: "two groups of items", answer: "more" },
    { question: "Q. Which is smaller? Color it.", imagePrompt: "two balls", answer: "smaller" },
    { question: "Q. Match the big items with big box and small items with small box.", imagePrompt: "items and boxes", answer: "matching" },
  ],
  colors: [
    { question: "Q. Identify and circle the vowels.", imagePrompt: "letters a e i o u with consonants", answer: "vowels" },
    { question: "Q. Color all the red objects.", imagePrompt: "objects to color", answer: "red items" },
    { question: "Q. What color is the sun? Circle the correct answer.", imagePrompt: "sun with color options", answer: "yellow" },
    { question: "Q. Match the objects with their colors.", imagePrompt: "objects and colors", answer: "matching" },
    { question: "Q. Circle all the green items in the picture.", imagePrompt: "various colored items", answer: "green" },
  ],
  shapes: [
    { question: "Q. Circle all the circles you can find.", imagePrompt: "mixed shapes", answer: "circles" },
    { question: "Q. Match the shapes: Circle with circle, square with square.", imagePrompt: "shapes to match", answer: "matching" },
    { question: "Q. Which shape is a triangle? Put a tick (✓) mark.", imagePrompt: "various shapes", answer: "triangle" },
    { question: "Q. Count the rectangles and write the number.", imagePrompt: "rectangles", answer: "count" },
    { question: "Q. Draw a square in the box below.", imagePrompt: "empty box", answer: "drawing" },
  ],
  numbers: [
    { question: "Q. Fill in the missing small letters and capital letters in the correct order.\nPp ____ ____ Ss ____ ____ Uu", imagePrompt: "alphabet sequence", answer: "Qq Rr Tt" },
    { question: "Q. Write the number that comes after 3.", imagePrompt: "number line", answer: "4" },
    { question: "Q. Circle the number 5 in the given numbers.", imagePrompt: "numbers 1-10", answer: "5" },
    { question: "Q. Match the following: Connect the dots to numbers.", imagePrompt: "dots and numbers", answer: "matching" },
    { question: "Q. Which number is bigger: 2 or 6? Circle it.", imagePrompt: "numbers 2 and 6", answer: "6" },
  ],
  patterns: [
    { question: "Q. What comes next in the pattern? (red, blue, red, blue, ____)", imagePrompt: "color pattern", answer: "red" },
    { question: "Q. Complete the pattern: (circle, square, circle, square, ____)", imagePrompt: "shape pattern", answer: "circle" },
    { question: "Q. Fill in the missing shape: (triangle, circle, triangle, ____, triangle)", imagePrompt: "pattern sequence", answer: "circle" },
    { question: "Q. Continue the number pattern: 1, 2, 3, ____", imagePrompt: "number pattern", answer: "4" },
    { question: "Q. Match the following: Connect body parts to faces.", imagePrompt: "body parts matching", answer: "matching" },
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
            examDetails.academicSession ? new Paragraph({
              text: `Academic Session: ${examDetails.academicSession}`,
              alignment: AlignmentType.CENTER,
            }) : new Paragraph({ text: "" }),
            examDetails.grade ? new Paragraph({
              text: examDetails.grade,
              alignment: AlignmentType.CENTER,
            }) : new Paragraph({ text: "" }),
            new Paragraph({
              text: examDetails.examTitle || "Exam Title",
              heading: HeadingLevel.HEADING_2,
              alignment: AlignmentType.CENTER,
            }),
            examDetails.subject ? new Paragraph({
              text: examDetails.subject,
              alignment: AlignmentType.CENTER,
            }) : new Paragraph({ text: "" }),
            new Paragraph({ text: "" }), // Empty line
            
            // Student info
            examDetails.includeStudentName ? new Paragraph({
              children: [
                new TextRun({ text: "NAME: ", bold: true }),
                new TextRun({ text: "_".repeat(50) }),
              ],
            }) : new Paragraph({ text: "" }),
            examDetails.classDiv ? new Paragraph({
              children: [
                new TextRun({ text: "CLASS: ", bold: true }),
                new TextRun({ text: examDetails.classDiv }),
              ],
            }) : new Paragraph({ text: "" }),
            examDetails.includeDate ? new Paragraph({
              children: [
                new TextRun({ text: "DATE: ", bold: true }),
                new TextRun({ text: "_".repeat(30) }),
              ],
            }) : new Paragraph({ text: "" }),
            examDetails.includeSchool ? new Paragraph({
              children: [
                new TextRun({ text: "SCHOOL: ", bold: true }),
                new TextRun({ text: "_".repeat(50) }),
              ],
            }) : new Paragraph({ text: "" }),
            examDetails.topic ? new Paragraph({
              children: [
                new TextRun({ text: "TOPIC: ", bold: true }),
                new TextRun({ text: examDetails.topic }),
              ],
            }) : new Paragraph({ text: "" }),
            examDetails.includeTeacher ? new Paragraph({
              children: [
                new TextRun({ text: "TEACHER: ", bold: true }),
                new TextRun({ text: "_".repeat(50) }),
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

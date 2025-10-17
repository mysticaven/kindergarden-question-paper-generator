import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Exam Paper Schema
export const examDetailsSchema = z.object({
  schoolName: z.string().min(1, "School name is required"),
  schoolAddress: z.string().optional(),
  academicSession: z.string().optional(),
  examTitle: z.string().min(1, "Exam title is required"),
  subject: z.string().optional(),
  topic: z.string().optional(),
  grade: z.string().optional(),
  classDiv: z.string().optional(),
  logoUrl: z.string().optional(),
  includeStudentName: z.boolean().default(true),
  includeDate: z.boolean().default(true),
  includeSchool: z.boolean().default(false),
  includeTeacher: z.boolean().default(false),
  customFields: z.array(z.string()).optional(),
});

export type ExamDetails = z.infer<typeof examDetailsSchema>;

// Question Generation Request
export const generateQuestionsSchema = z.object({
  curriculum: z.string().min(10, "Curriculum description is required"),
  questionTypes: z.array(z.string()).min(1, "Select at least one question type"),
  questionCount: z.number().min(1).max(30),
  examDetails: examDetailsSchema,
});

export type GenerateQuestionsRequest = z.infer<typeof generateQuestionsSchema>;

// Question Schema
export const questionSchema = z.object({
  id: z.string(),
  type: z.string(),
  question: z.string(),
  imageUrl: z.string().optional(),
  options: z.array(z.string()).optional(),
  correctAnswer: z.string().optional(),
});

export type Question = z.infer<typeof questionSchema>;

// Question Paper Response
export const questionPaperSchema = z.object({
  examDetails: examDetailsSchema,
  questions: z.array(questionSchema),
});

export type QuestionPaper = z.infer<typeof questionPaperSchema>;

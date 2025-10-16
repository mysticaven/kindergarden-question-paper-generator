import { type User, type InsertUser, type QuestionPaper } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  saveQuestionPaper(paper: QuestionPaper): Promise<{ id: string; paper: QuestionPaper }>;
  getQuestionPaper(id: string): Promise<QuestionPaper | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private questionPapers: Map<string, QuestionPaper>;

  constructor() {
    this.users = new Map();
    this.questionPapers = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async saveQuestionPaper(paper: QuestionPaper): Promise<{ id: string; paper: QuestionPaper }> {
    const id = randomUUID();
    this.questionPapers.set(id, paper);
    return { id, paper };
  }

  async getQuestionPaper(id: string): Promise<QuestionPaper | undefined> {
    return this.questionPapers.get(id);
  }
}

export const storage = new MemStorage();

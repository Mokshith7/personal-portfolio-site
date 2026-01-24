import { db } from "./db";
import { blogs, bookReviews, type InsertBlog, type Blog, type InsertBookReview, type BookReview } from "@shared/schema";
import { eq, ilike, and, or } from "drizzle-orm";

export interface IStorage {
  // Blogs
  getBlogs(search?: string, category?: string): Promise<Blog[]>;
  getBlogBySlug(slug: string): Promise<Blog | undefined>;
  createBlog(blog: InsertBlog): Promise<Blog>;
  
  // Book Reviews
  getBookReviews(search?: string): Promise<BookReview[]>;
  getBookReviewBySlug(slug: string): Promise<BookReview | undefined>;
  createBookReview(review: InsertBookReview): Promise<BookReview>;
}

export class DatabaseStorage implements IStorage {
  // Blogs
  async getBlogs(search?: string, category?: string): Promise<Blog[]> {
    const conditions = [];
    
    if (category) {
      conditions.push(eq(blogs.category, category));
    }
    
    if (search) {
      conditions.push(
        or(
          ilike(blogs.title, `%${search}%`),
          ilike(blogs.excerpt, `%${search}%`)
        )
      );
    }
    
    if (conditions.length > 0) {
      return await db.select().from(blogs).where(and(...conditions)).orderBy(blogs.publishedAt);
    }
    
    return await db.select().from(blogs).orderBy(blogs.publishedAt);
  }

  async getBlogBySlug(slug: string): Promise<Blog | undefined> {
    const [blog] = await db.select().from(blogs).where(eq(blogs.slug, slug));
    return blog;
  }

  async createBlog(blog: InsertBlog): Promise<Blog> {
    const [created] = await db.insert(blogs).values(blog).returning();
    return created;
  }

  // Book Reviews
  async getBookReviews(search?: string): Promise<BookReview[]> {
    if (search) {
      return await db.select().from(bookReviews).where(
        or(
          ilike(bookReviews.title, `%${search}%`),
          ilike(bookReviews.author, `%${search}%`),
          ilike(bookReviews.excerpt, `%${search}%`)
        )
      ).orderBy(bookReviews.publishedAt);
    }
    
    return await db.select().from(bookReviews).orderBy(bookReviews.publishedAt);
  }

  async getBookReviewBySlug(slug: string): Promise<BookReview | undefined> {
    const [review] = await db.select().from(bookReviews).where(eq(bookReviews.slug, slug));
    return review;
  }

  async createBookReview(review: InsertBookReview): Promise<BookReview> {
    const [created] = await db.insert(bookReviews).values(review).returning();
    return created;
  }
}

export const storage = new DatabaseStorage();

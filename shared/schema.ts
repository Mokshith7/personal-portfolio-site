import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Blog categories
export const BlogCategory = z.enum(["tech", "travel", "philosophy"]);
export type BlogCategory = z.infer<typeof BlogCategory>;

// Blogs table - stores blog posts from MD files
export const blogs = pgTable("blogs", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(), // tech, travel, philosophy
  coverImage: text("cover_image"),
  publishedAt: timestamp("published_at").defaultNow(),
});

// Book reviews table
export const bookReviews = pgTable("book_reviews", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  author: text("author").notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  rating: text("rating"), // e.g., "4/5"
  coverImage: text("cover_image"),
  publishedAt: timestamp("published_at").defaultNow(),
});

// Base schemas
export const insertBlogSchema = createInsertSchema(blogs).omit({ id: true, publishedAt: true });
export const insertBookReviewSchema = createInsertSchema(bookReviews).omit({ id: true, publishedAt: true });

// Types
export type Blog = typeof blogs.$inferSelect;
export type InsertBlog = z.infer<typeof insertBlogSchema>;
export type BookReview = typeof bookReviews.$inferSelect;
export type InsertBookReview = z.infer<typeof insertBookReviewSchema>;

// API Request/Response types
export type CreateBlogRequest = InsertBlog;
export type BlogResponse = Blog;
export type BlogsListResponse = Blog[];

export type CreateBookReviewRequest = InsertBookReview;
export type BookReviewResponse = BookReview;
export type BookReviewsListResponse = BookReview[];

// Query params
export interface BlogsQueryParams {
  search?: string;
  category?: BlogCategory;
}

export interface BookReviewsQueryParams {
  search?: string;
}

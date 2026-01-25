import { z } from "zod";

// Blog categories
export const BlogCategory = z.enum(["tech", "travel", "philosophy"]);
export type BlogCategory = z.infer<typeof BlogCategory>;

// Blog type for frontend/API
export interface Blog {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  coverImage?: string;
  publishedAt?: string;
}

// Book review type for frontend/API
export interface BookReview {
  slug: string;
  title: string;
  author: string;
  excerpt: string;
  content: string;
  rating?: string;
  category?: string;
  coverImage?: string;
  publishedAt?: string;
}

// Validation schemas for API contract
export const insertBlogSchema = z.object({
  title: z.string().min(1),
  excerpt: z.string().min(1),
  content: z.string().min(1),
  category: BlogCategory,
  coverImage: z.string().optional(),
});

export const insertBookReviewSchema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  excerpt: z.string().min(1),
  content: z.string().min(1),
  rating: z.string().optional(),
  coverImage: z.string().optional(),
});

// Request types - mainly for validation if needed
export type CreateBlogRequest = z.infer<typeof insertBlogSchema>;
export type CreateBookReviewRequest = z.infer<typeof insertBookReviewSchema>;

// Query params
export interface BlogsQueryParams {
  search?: string;
  category?: BlogCategory;
}

export interface BookReviewsQueryParams {
  search?: string;
  category?: string;
}

// Learning Journey - Skills and Journal Entries
export interface Skill {
  slug: string;
  title: string;
  excerpt: string;
  status: "in-progress" | "completed" | "paused";
  startedAt?: string;
  coverImage?: string;
}

export interface LearningEntry {
  slug: string;
  skillSlug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
}

export interface LearningEntriesQueryParams {
  search?: string;
}

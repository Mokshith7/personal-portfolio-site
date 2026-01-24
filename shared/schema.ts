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
  coverImage?: string;
  publishedAt?: string;
}

// Request types - mainly for validation if needed
export type CreateBlogRequest = Omit<Blog, 'slug' | 'publishedAt'>;
export type CreateBookReviewRequest = Omit<BookReview, 'slug' | 'publishedAt'>;

// Query params
export interface BlogsQueryParams {
  search?: string;
  category?: BlogCategory;
}

export interface BookReviewsQueryParams {
  search?: string;
}

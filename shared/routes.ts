import { z } from "zod";
import { insertBlogSchema, insertBookReviewSchema, blogs, bookReviews, BlogCategory } from "./schema";

// Error schemas
export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

// API Contract
export const api = {
  blogs: {
    list: {
      method: "GET" as const,
      path: "/api/blogs",
      input: z.object({
        search: z.string().optional(),
        category: BlogCategory.optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof blogs.$inferSelect>()),
      },
    },
    get: {
      method: "GET" as const,
      path: "/api/blogs/:slug",
      responses: {
        200: z.custom<typeof blogs.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: "POST" as const,
      path: "/api/blogs",
      input: insertBlogSchema,
      responses: {
        201: z.custom<typeof blogs.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  bookReviews: {
    list: {
      method: "GET" as const,
      path: "/api/book-reviews",
      input: z.object({
        search: z.string().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof bookReviews.$inferSelect>()),
      },
    },
    get: {
      method: "GET" as const,
      path: "/api/book-reviews/:slug",
      responses: {
        200: z.custom<typeof bookReviews.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: "POST" as const,
      path: "/api/book-reviews",
      input: insertBookReviewSchema,
      responses: {
        201: z.custom<typeof bookReviews.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
};

// URL builder helper
export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

// Type exports
export type BlogInput = z.infer<typeof api.blogs.create.input>;
export type BlogResponse = z.infer<typeof api.blogs.create.responses[201]>;
export type BlogsListResponse = z.infer<typeof api.blogs.list.responses[200]>;

export type BookReviewInput = z.infer<typeof api.bookReviews.create.input>;
export type BookReviewResponse = z.infer<typeof api.bookReviews.create.responses[201]>;
export type BookReviewsListResponse = z.infer<typeof api.bookReviews.list.responses[200]>;

export type ValidationError = z.infer<typeof errorSchemas.validation>;
export type NotFoundError = z.infer<typeof errorSchemas.notFound>;

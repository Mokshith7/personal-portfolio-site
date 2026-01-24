import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get(api.blogs.list.path, async (req, res) => {
    try {
      const search = req.query.search as string | undefined;
      const category = req.query.category as string | undefined;
      const blogs = await storage.getBlogs(search, category);
      res.json(blogs);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch blogs" });
    }
  });

  app.get(api.blogs.get.path, async (req, res) => {
    try {
      const slug = String(req.params.slug);
      const blog = await storage.getBlogBySlug(slug);
      if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
      }
      res.json(blog);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch blog" });
    }
  });

  app.get(api.bookReviews.list.path, async (req, res) => {
    try {
      const search = (req.query.search as string) || undefined;
      const reviews = await storage.getBookReviews(search);
      res.json(reviews);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch book reviews" });
    }
  });

  app.get(api.bookReviews.get.path, async (req, res) => {
    try {
      const slug = String(req.params.slug);
      const review = await storage.getBookReviewBySlug(slug);
      if (!review) {
        return res.status(404).json({ message: "Book review not found" });
      }
      res.json(review);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch book review" });
    }
  });

  return httpServer;
}

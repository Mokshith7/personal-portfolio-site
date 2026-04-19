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

  app.get("/api/blogs/categories", async (req, res) => {
    try {
      const categories = await storage.getBlogCategories();
      res.json(categories);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch blog categories" });
    }
  });

  app.get("/api/blogs/:seriesSlug/:entrySlug", async (req, res) => {
    try {
      const seriesSlug = String(req.params.seriesSlug);
      const entrySlug = String(req.params.entrySlug);
      const entry = await storage.getBlogSeriesEntry(seriesSlug, entrySlug);
      if (!entry) {
        return res.status(404).json({ message: "Entry not found" });
      }
      res.json(entry);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch blog entry" });
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
      const category = (req.query.category as string) || undefined;
      const reviews = await storage.getBookReviews(search, category);
      res.json(reviews);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch book reviews" });
    }
  });

  app.get("/api/book-reviews/categories", async (req, res) => {
    try {
      const categories = await storage.getBookReviewCategories();
      res.json(categories);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch book review categories" });
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

  // Learning Journey - Skills
  app.get("/api/learning/skills", async (req, res) => {
    try {
      const skills = await storage.getSkills();
      res.json(skills);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch skills" });
    }
  });

  app.get("/api/learning/skills/:slug", async (req, res) => {
    try {
      const slug = String(req.params.slug);
      const skill = await storage.getSkillBySlug(slug);
      if (!skill) {
        return res.status(404).json({ message: "Skill not found" });
      }
      res.json(skill);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch skill" });
    }
  });

  app.get("/api/learning/skills/:slug/entries", async (req, res) => {
    try {
      const slug = String(req.params.slug);
      const search = req.query.search as string | undefined;
      const entries = await storage.getLearningEntries(slug, search);
      res.json(entries);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch learning entries" });
    }
  });

  app.get("/api/learning/skills/:slug/entries/:entrySlug", async (req, res) => {
    try {
      const slug = String(req.params.slug);
      const entrySlug = String(req.params.entrySlug);
      const entry = await storage.getLearningEntryBySlug(slug, entrySlug);
      if (!entry) {
        return res.status(404).json({ message: "Learning entry not found" });
      }
      res.json(entry);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch learning entry" });
    }
  });

  return httpServer;
}

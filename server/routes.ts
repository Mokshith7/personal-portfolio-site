import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

async function seedDatabase() {
  const existingBlogs = await storage.getBlogs();
  
  if (existingBlogs.length === 0) {
    // Seed blogs
    await storage.createBlog({
      slug: "understanding-kintsugi",
      title: "Understanding Kintsugi: The Art of Embracing Imperfection",
      excerpt: "Exploring the Japanese philosophy of finding beauty in brokenness and how it applies to our lives.",
      content: `# Understanding Kintsugi

Kintsugi, the Japanese art of repairing broken pottery with gold, teaches us a profound lesson about embracing our imperfections. Rather than hiding the cracks, this practice highlights them, transforming damage into something beautiful.

## The Philosophy

The philosophy behind Kintsugi extends far beyond pottery. It reminds us that our experiences—especially the difficult ones—shape who we are. Instead of trying to hide our past struggles, we can view them as part of our unique story.

## Applying Kintsugi to Life

When we face setbacks, we have a choice. We can either try to pretend they never happened, or we can acknowledge them and grow stronger. Kintsugi teaches us to embrace the latter path.`,
      category: "philosophy",
    });

    await storage.createBlog({
      slug: "building-with-react",
      title: "Building Modern Web Apps with React and TypeScript",
      excerpt: "A comprehensive guide to creating scalable and maintainable web applications.",
      content: `# Building Modern Web Apps

React combined with TypeScript provides a powerful foundation for building modern web applications. Here's what I've learned from my experience.

## Why TypeScript?

TypeScript adds static typing to JavaScript, catching errors before they reach production. This makes refactoring safer and improves developer experience with better autocomplete.

## Best Practices

1. Use functional components with hooks
2. Keep components small and focused
3. Implement proper error boundaries
4. Write meaningful tests`,
      category: "tech",
    });

    await storage.createBlog({
      slug: "journey-through-japan",
      title: "A Journey Through Japan: Finding Peace in Ancient Temples",
      excerpt: "Reflections from my travels through Kyoto and the lessons learned from Japanese culture.",
      content: `# Journey Through Japan

Traveling through Japan taught me more about mindfulness than any book ever could. The ancient temples of Kyoto hold secrets that speak to the soul.

## Kyoto's Hidden Gems

Beyond the famous tourist spots lie quiet gardens and hidden temples where you can sit in contemplation for hours. These spaces invite introspection.

## Lessons Learned

The Japanese concept of "ichi-go ichi-e" (one time, one meeting) reminds us that each moment is unique and should be treasured.`,
      category: "travel",
    });
  }

  const existingReviews = await storage.getBookReviews();
  
  if (existingReviews.length === 0) {
    // Seed book reviews
    await storage.createBookReview({
      slug: "atomic-habits-review",
      title: "Atomic Habits",
      author: "James Clear",
      excerpt: "A practical guide to building good habits and breaking bad ones through small, incremental changes.",
      content: `# Atomic Habits by James Clear

This book transformed how I think about personal development. Clear's approach to habit formation is both scientific and practical.

## Key Takeaways

1. **Make it obvious** - Design your environment for success
2. **Make it attractive** - Bundle habits you need with habits you want
3. **Make it easy** - Reduce friction for good habits
4. **Make it satisfying** - Use immediate rewards

## My Rating

This is a must-read for anyone looking to improve their daily routines.`,
      rating: "5/5",
    });

    await storage.createBookReview({
      slug: "mans-search-for-meaning",
      title: "Man's Search for Meaning",
      author: "Viktor Frankl",
      excerpt: "A profound exploration of finding purpose and meaning even in the darkest circumstances.",
      content: `# Man's Search for Meaning

Frankl's account of surviving the Holocaust and his development of logotherapy is both heartbreaking and inspiring.

## Core Message

The central thesis is that our primary drive in life is not pleasure, but the pursuit of what we find meaningful. Even in suffering, we can find purpose.

## Impact

This book changed my perspective on adversity and resilience.`,
      rating: "5/5",
    });

    await storage.createBookReview({
      slug: "deep-work-review",
      title: "Deep Work",
      author: "Cal Newport",
      excerpt: "Rules for focused success in a distracted world.",
      content: `# Deep Work by Cal Newport

In an age of constant distraction, Newport makes a compelling case for the value of focused, uninterrupted work.

## Key Concepts

- **Deep Work** - Professional activities performed in a state of distraction-free concentration
- **Shallow Work** - Non-cognitively demanding, logistical-style tasks

## Practical Applications

The book provides strategies for creating deep work routines and minimizing shallow work.`,
      rating: "4/5",
    });
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Seed database on startup
  await seedDatabase();

  // Blog routes
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
      const blog = await storage.getBlogBySlug(req.params.slug);
      if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
      }
      res.json(blog);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch blog" });
    }
  });

  app.post(api.blogs.create.path, async (req, res) => {
    try {
      const input = api.blogs.create.input.parse(req.body);
      const blog = await storage.createBlog(input);
      res.status(201).json(blog);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Failed to create blog" });
    }
  });

  // Book review routes
  app.get(api.bookReviews.list.path, async (req, res) => {
    try {
      const search = req.query.search as string | undefined;
      const reviews = await storage.getBookReviews(search);
      res.json(reviews);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch book reviews" });
    }
  });

  app.get(api.bookReviews.get.path, async (req, res) => {
    try {
      const review = await storage.getBookReviewBySlug(req.params.slug);
      if (!review) {
        return res.status(404).json({ message: "Book review not found" });
      }
      res.json(review);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch book review" });
    }
  });

  app.post(api.bookReviews.create.path, async (req, res) => {
    try {
      const input = api.bookReviews.create.input.parse(req.body);
      const review = await storage.createBookReview(input);
      res.status(201).json(review);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Failed to create book review" });
    }
  });

  return httpServer;
}

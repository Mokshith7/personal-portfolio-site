import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { type Blog, type BookReview } from "@shared/schema";

export interface IStorage {
  // Blogs
  getBlogs(search?: string, category?: string): Promise<Blog[]>;
  getBlogBySlug(slug: string): Promise<Blog | undefined>;
  
  // Book Reviews
  getBookReviews(search?: string): Promise<BookReview[]>;
  getBookReviewBySlug(slug: string): Promise<BookReview | undefined>;
}

export class FileStorage implements IStorage {
  private blogsDir = path.join(process.cwd(), "content", "blogs");
  private reviewsDir = path.join(process.cwd(), "content", "book-reviews");

  private async ensureDirs() {
    await fs.mkdir(this.blogsDir, { recursive: true });
    await fs.mkdir(this.reviewsDir, { recursive: true });
  }

  // Blogs
  async getBlogs(search?: string, category?: string): Promise<Blog[]> {
    await this.ensureDirs();
    const files = await fs.readdir(this.blogsDir);
    const blogs: Blog[] = [];

    for (const file of files) {
      if (!file.endsWith(".md")) continue;
      const content = await fs.readFile(path.join(this.blogsDir, file), "utf-8");
      const { data, content: body } = matter(content);
      
      const blog: Blog = {
        slug: file.replace(".md", ""),
        title: data.title || "Untitled",
        excerpt: data.excerpt || "",
        content: body,
        category: data.category || "philosophy",
        coverImage: data.coverImage,
        publishedAt: data.date || new Date().toISOString(),
      };

      // Filter
      if (category && blog.category !== category) continue;
      if (search) {
        const searchLower = search.toLowerCase();
        if (!blog.title.toLowerCase().includes(searchLower) && 
            !blog.excerpt.toLowerCase().includes(searchLower)) {
          continue;
        }
      }
      
      blogs.push(blog);
    }

    return blogs.sort((a, b) => 
      new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime()
    );
  }

  async getBlogBySlug(slug: string): Promise<Blog | undefined> {
    try {
      const filePath = path.join(this.blogsDir, `${slug}.md`);
      const content = await fs.readFile(filePath, "utf-8");
      const { data, content: body } = matter(content);
      
      return {
        slug,
        title: data.title || "Untitled",
        excerpt: data.excerpt || "",
        content: body,
        category: data.category || "philosophy",
        coverImage: data.coverImage,
        publishedAt: data.date || new Date().toISOString(),
      };
    } catch (err) {
      return undefined;
    }
  }

  // Book Reviews
  async getBookReviews(search?: string): Promise<BookReview[]> {
    await this.ensureDirs();
    const files = await fs.readdir(this.reviewsDir);
    const reviews: BookReview[] = [];

    for (const file of files) {
      if (!file.endsWith(".md")) continue;
      const content = await fs.readFile(path.join(this.reviewsDir, file), "utf-8");
      const { data, content: body } = matter(content);
      
      const review: BookReview = {
        slug: file.replace(".md", ""),
        title: data.title || "Untitled",
        author: data.author || "Unknown",
        excerpt: data.excerpt || "",
        content: body,
        rating: data.rating,
        coverImage: data.coverImage,
        publishedAt: data.date || new Date().toISOString(),
      };

      if (search) {
        const searchLower = search.toLowerCase();
        if (!review.title.toLowerCase().includes(searchLower) && 
            !review.author.toLowerCase().includes(searchLower) &&
            !review.excerpt.toLowerCase().includes(searchLower)) {
          continue;
        }
      }
      
      reviews.push(review);
    }

    return reviews.sort((a, b) => 
      new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime()
    );
  }

  async getBookReviewBySlug(slug: string): Promise<BookReview | undefined> {
    try {
      const filePath = path.join(this.reviewsDir, `${slug}.md`);
      const content = await fs.readFile(filePath, "utf-8");
      const { data, content: body } = matter(content);
      
      return {
        slug,
        title: data.title || "Untitled",
        author: data.author || "Unknown",
        excerpt: data.excerpt || "",
        content: body,
        rating: data.rating,
        coverImage: data.coverImage,
        publishedAt: data.date || new Date().toISOString(),
      };
    } catch (err) {
      return undefined;
    }
  }
}

export const storage = new FileStorage();

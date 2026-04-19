import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { type Blog, type BookReview, type Skill, type LearningEntry } from "@shared/schema";

export interface IStorage {
  // Blogs
  getBlogs(search?: string, category?: string): Promise<Blog[]>;
  getBlogBySlug(slug: string): Promise<Blog | undefined>;
  getBlogCategories(): Promise<string[]>;
  
  // Book Reviews
  getBookReviews(search?: string, category?: string): Promise<BookReview[]>;
  getBookReviewBySlug(slug: string): Promise<BookReview | undefined>;
  getBookReviewCategories(): Promise<string[]>;
  
  // Learning Journey
  getSkills(): Promise<Skill[]>;
  getSkillBySlug(slug: string): Promise<Skill | undefined>;
  getLearningEntries(skillSlug: string, search?: string): Promise<LearningEntry[]>;
  getLearningEntryBySlug(skillSlug: string, entrySlug: string): Promise<LearningEntry | undefined>;
}

export class FileStorage implements IStorage {
  private blogsDir = path.join(process.cwd(), "content", "blogs");
  private reviewsDir = path.join(process.cwd(), "content", "book-reviews");
  private learningDir = path.join(process.cwd(), "content", "learning");

  private async ensureDirs() {
    await fs.mkdir(this.blogsDir, { recursive: true });
    await fs.mkdir(this.reviewsDir, { recursive: true });
  }

  // Blogs
  async getBlogs(search?: string, category?: string): Promise<Blog[]> {
    await this.ensureDirs();
    const entries = await fs.readdir(this.blogsDir, { withFileTypes: true });
    const blogs: Blog[] = [];

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const indexPath = path.join(this.blogsDir, entry.name, "_index.md");
        try {
          const content = await fs.readFile(indexPath, "utf-8");
          const { data } = matter(content);
          const blog: Blog = {
            slug: entry.name,
            title: data.title || entry.name,
            excerpt: data.excerpt || "",
            content: "",
            category: data.category || "series",
            coverImage: data.coverImage,
            publishedAt: data.date || new Date().toISOString(),
            isSeries: true,
          };
          if (search) {
            const s = search.toLowerCase();
            if (!blog.title.toLowerCase().includes(s) && !blog.excerpt.toLowerCase().includes(s)) continue;
          }
          blogs.push(blog);
        } catch {
          continue;
        }
      } else if (entry.name.endsWith(".md")) {
        const content = await fs.readFile(path.join(this.blogsDir, entry.name), "utf-8");
        const { data, content: body } = matter(content);
        const blog: Blog = {
          slug: entry.name.replace(".md", ""),
          title: data.title || "Untitled",
          excerpt: data.excerpt || "",
          content: body,
          category: data.category || "philosophy",
          coverImage: data.coverImage,
          publishedAt: data.date || new Date().toISOString(),
        };
        if (category && blog.category !== category) continue;
        if (search) {
          const s = search.toLowerCase();
          if (!blog.title.toLowerCase().includes(s) && !blog.excerpt.toLowerCase().includes(s)) continue;
        }
        blogs.push(blog);
      }
    }

    return blogs.sort((a, b) =>
      new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime()
    );
  }

  async getBlogBySlug(slug: string): Promise<Blog | undefined> {
    // Try flat file first
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
    } catch {
      // Fall through to series check
    }

    // Try as a series directory
    try {
      const indexPath = path.join(this.blogsDir, slug, "_index.md");
      const indexContent = await fs.readFile(indexPath, "utf-8");
      const { data } = matter(indexContent);

      const files = await fs.readdir(path.join(this.blogsDir, slug));
      const entries: Blog[] = [];
      for (const file of files) {
        if (!file.endsWith(".md") || file === "_index.md") continue;
        const ec = await fs.readFile(path.join(this.blogsDir, slug, file), "utf-8");
        const { data: ed, content: body } = matter(ec);
        entries.push({
          slug: file.replace(".md", ""),
          title: ed.title || "Untitled",
          excerpt: ed.excerpt || "",
          content: body,
          category: ed.category || "series",
          publishedAt: ed.date || new Date().toISOString(),
        });
      }
      entries.sort((a, b) =>
        new Date(a.publishedAt || 0).getTime() - new Date(b.publishedAt || 0).getTime()
      );

      return {
        slug,
        title: data.title || slug,
        excerpt: data.excerpt || "",
        content: "",
        category: data.category || "series",
        coverImage: data.coverImage,
        publishedAt: data.date || new Date().toISOString(),
        isSeries: true,
        entries,
      };
    } catch {
      return undefined;
    }
  }

  async getBlogSeriesEntry(seriesSlug: string, entrySlug: string): Promise<Blog | undefined> {
    try {
      const filePath = path.join(this.blogsDir, seriesSlug, `${entrySlug}.md`);
      const content = await fs.readFile(filePath, "utf-8");
      const { data, content: body } = matter(content);
      return {
        slug: entrySlug,
        title: data.title || "Untitled",
        excerpt: data.excerpt || "",
        content: body,
        category: data.category || "series",
        coverImage: data.coverImage,
        publishedAt: data.date || new Date().toISOString(),
      };
    } catch {
      return undefined;
    }
  }

  async getBlogCategories(): Promise<string[]> {
    await this.ensureDirs();
    const files = await fs.readdir(this.blogsDir);
    const categories = new Set<string>();

    for (const file of files) {
      if (!file.endsWith(".md")) continue;
      const content = await fs.readFile(path.join(this.blogsDir, file), "utf-8");
      const { data } = matter(content);
      if (data.category) {
        categories.add(data.category);
      }
    }

    return Array.from(categories).sort();
  }

  // Book Reviews
  async getBookReviews(search?: string, category?: string): Promise<BookReview[]> {
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
        category: data.category,
        coverImage: data.coverImage,
        publishedAt: data.date || new Date().toISOString(),
      };

      // Filter by category
      if (category && review.category !== category) continue;

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
        category: data.category,
        coverImage: data.coverImage,
        publishedAt: data.date || new Date().toISOString(),
      };
    } catch (err) {
      return undefined;
    }
  }

  async getBookReviewCategories(): Promise<string[]> {
    await this.ensureDirs();
    const files = await fs.readdir(this.reviewsDir);
    const categories = new Set<string>();

    for (const file of files) {
      if (!file.endsWith(".md")) continue;
      const content = await fs.readFile(path.join(this.reviewsDir, file), "utf-8");
      const { data } = matter(content);
      if (data.category) {
        categories.add(data.category);
      }
    }

    return Array.from(categories).sort();
  }

  // Learning Journey - Skills
  async getSkills(): Promise<Skill[]> {
    await fs.mkdir(this.learningDir, { recursive: true });
    const entries = await fs.readdir(this.learningDir, { withFileTypes: true });
    const skills: Skill[] = [];

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      
      const skillPath = path.join(this.learningDir, entry.name, "_skill.md");
      try {
        const content = await fs.readFile(skillPath, "utf-8");
        const { data } = matter(content);
        
        skills.push({
          slug: entry.name,
          title: data.title || entry.name,
          excerpt: data.excerpt || "",
          status: data.status || "in-progress",
          startedAt: data.startedAt,
          coverImage: data.coverImage,
        });
      } catch (err) {
        continue;
      }
    }

    return skills.sort((a, b) => 
      new Date(b.startedAt || 0).getTime() - new Date(a.startedAt || 0).getTime()
    );
  }

  async getSkillBySlug(slug: string): Promise<Skill | undefined> {
    try {
      const skillPath = path.join(this.learningDir, slug, "_skill.md");
      const content = await fs.readFile(skillPath, "utf-8");
      const { data } = matter(content);
      
      return {
        slug,
        title: data.title || slug,
        excerpt: data.excerpt || "",
        status: data.status || "in-progress",
        startedAt: data.startedAt,
        coverImage: data.coverImage,
      };
    } catch (err) {
      return undefined;
    }
  }

  async getLearningEntries(skillSlug: string, search?: string): Promise<LearningEntry[]> {
    const skillDir = path.join(this.learningDir, skillSlug);
    try {
      const files = await fs.readdir(skillDir);
      const entries: LearningEntry[] = [];

      for (const file of files) {
        if (!file.endsWith(".md") || file === "_skill.md") continue;
        
        const content = await fs.readFile(path.join(skillDir, file), "utf-8");
        const { data, content: body } = matter(content);
        
        const entry: LearningEntry = {
          slug: file.replace(".md", ""),
          skillSlug,
          title: data.title || "Untitled",
          excerpt: data.excerpt || "",
          content: body,
          date: data.date || new Date().toISOString(),
        };

        if (search) {
          const searchLower = search.toLowerCase();
          if (!entry.title.toLowerCase().includes(searchLower) && 
              !entry.excerpt.toLowerCase().includes(searchLower)) {
            continue;
          }
        }
        
        entries.push(entry);
      }

      return entries.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    } catch (err) {
      return [];
    }
  }

  async getLearningEntryBySlug(skillSlug: string, entrySlug: string): Promise<LearningEntry | undefined> {
    try {
      const filePath = path.join(this.learningDir, skillSlug, `${entrySlug}.md`);
      const content = await fs.readFile(filePath, "utf-8");
      const { data, content: body } = matter(content);
      
      return {
        slug: entrySlug,
        skillSlug,
        title: data.title || "Untitled",
        excerpt: data.excerpt || "",
        content: body,
        date: data.date || new Date().toISOString(),
      };
    } catch (err) {
      return undefined;
    }
  }
}

export const storage = new FileStorage();

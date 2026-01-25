# Kintsugi Portfolio Website

## Overview
A personal portfolio website with a Kintsugi theme - celebrating the beauty of imperfection. Built with React, Express, and markdown file-based content.

## Pages
- **Home**: Landing page with Kintsugi bowl image and philosophy explanation
- **Blogs**: Blog listing with search and category filters (Tech, Travel, Philosophy)
- **Book Reviews**: Book reviews section with search functionality
- **Projects**: Coming soon placeholder
- **About Me**: Profile section with bio and social media links (Instagram, YouTube, LinkedIn)

## Project Structure
```
client/
  src/
    components/
      navbar.tsx          - Main navigation component
      theme-toggle.tsx    - Dark/light mode toggle
      ui/                 - Shadcn UI components
    pages/
      home.tsx           - Landing page
      blogs.tsx          - Blog listing
      blog-detail.tsx    - Individual blog view
      book-reviews.tsx   - Book reviews listing
      book-review-detail.tsx - Individual review view
      learning.tsx       - Learning Journey skills list
      learning-detail.tsx - Skill detail with journal entries
      learning-entry.tsx - Individual journal entry view
      projects.tsx       - Projects page (coming soon)
      about.tsx          - About me page with social links
server/
  routes.ts             - API endpoints
  storage.ts            - File-based content operations
shared/
  schema.ts             - Type definitions
  routes.ts             - API contract definitions
content/
  blogs/                - Markdown blog files
  book-reviews/         - Markdown book review files
  learning/             - Learning journey content
    <skill-slug>/       - Folder per skill
      _skill.md         - Skill metadata (title, excerpt, status)
      day-1-xxx.md      - Journal entries
```

## API Endpoints
- `GET /api/blogs` - List blogs (supports search, category filter)
- `GET /api/blogs/:slug` - Get single blog
- `GET /api/book-reviews` - List book reviews (supports search)
- `GET /api/book-reviews/:slug` - Get single review
- `GET /api/learning/skills` - List all learning skills
- `GET /api/learning/skills/:slug` - Get single skill
- `GET /api/learning/skills/:slug/entries` - List journal entries (supports search)
- `GET /api/learning/skills/:slug/entries/:entrySlug` - Get single entry

## Theme
- Kintsugi-inspired warm earthy tones with gold accents
- Primary color: Gold (#D4A017)
- Dark mode supported

## Content Management
- Blogs and book reviews are stored as markdown files in the `content/` directory
- Uses gray-matter for parsing frontmatter metadata
- No database required for content

## Learning Journey
The Learning Journey feature lets you document skills you're learning with daily journal entries.

**Adding a new skill:**
1. Create a folder in `content/learning/<skill-name>/`
2. Add `_skill.md` with frontmatter:
   ```
   ---
   title: Skill Name
   excerpt: Brief description
   status: in-progress  # or completed, paused
   startedAt: 2025-12-01
   ---
   ```

**Adding journal entries:**
1. Add markdown files to the skill folder (e.g., `day-1-first-lesson.md`)
2. Include frontmatter:
   ```
   ---
   title: "Day 1: First Lesson"
   date: 2025-12-01
   excerpt: Summary of what you learned
   ---
   
   Journal content here...
   ```

## Social Links (About Page)
- Instagram: Update URL in about.tsx
- YouTube: Update URL in about.tsx
- LinkedIn: Update URL in about.tsx

## Future Features (TODO)
- **Profile Image**: Add profile image at client/public/images/profile.jpg
- **Train With Me**: Fitness coaching section (coming soon placeholder)

## User Preferences
- Uses React + TypeScript
- Prefers simple, clean design
- Markdown file-based content (no database for blogs/reviews)

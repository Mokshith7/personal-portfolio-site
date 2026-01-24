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
```

## API Endpoints
- `GET /api/blogs` - List blogs (supports search, category filter)
- `GET /api/blogs/:slug` - Get single blog
- `GET /api/book-reviews` - List book reviews (supports search)
- `GET /api/book-reviews/:slug` - Get single review

## Theme
- Kintsugi-inspired warm earthy tones with gold accents
- Primary color: Gold (#D4A017)
- Dark mode supported

## Content Management
- Blogs and book reviews are stored as markdown files in the `content/` directory
- Uses gray-matter for parsing frontmatter metadata
- No database required for content

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

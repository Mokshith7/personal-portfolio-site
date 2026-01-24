# Kintsugi Portfolio Website

## Overview
A personal portfolio website with a Kintsugi theme - celebrating the beauty of imperfection. Built with React, Express, and PostgreSQL.

## Pages
- **Home**: Landing page with Kintsugi bowl image and philosophy explanation
- **Blogs**: Blog listing with search and category filters (Tech, Travel, Philosophy)
- **Book Reviews**: Book reviews section with search functionality
- **Projects**: Coming soon placeholder
- **About Me**: Profile section with bio, resume download, and action buttons

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
      about.tsx          - About me page
server/
  routes.ts             - API endpoints
  storage.ts            - Database operations
  db.ts                 - Database connection
shared/
  schema.ts             - Database schema and types
  routes.ts             - API contract definitions
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

## Future Features (TODO)
- **Stripe Integration**: User dismissed the integration. When ready to enable:
  - Buy Me a Coffee button needs payment processing
  - Schedule Meeting button needs payment + calendar integration
- **Resume Download**: Add resume PDF to client/public/
- **Profile Image**: Add profile image at client/public/images/profile.jpg
- **MD File Support**: Currently blogs are stored in database. Can add file-system MD parsing later

## User Preferences
- Uses React + TypeScript (not Django)
- Prefers simple, clean design
- Wants MD file support for blogs (to be implemented)

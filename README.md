# Kintsugi Portfolio Website

A personal portfolio website with a Kintsugi theme - celebrating the beauty of imperfection. Built with React, Express, and markdown-based content management.

## Features

- **Home**: Landing page with Kintsugi philosophy
- **Blogs**: Blog posts with search and category filtering
- **Book Reviews**: Book reviews with ratings and categories
- **Learning Journey**: Document skills you're learning with daily journal entries
- **Memento Mori**: Interactive life-in-weeks visualization board
- **Projects**: Showcase your work (coming soon)
- **About Me**: Profile with social media links

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Shadcn UI
- **Backend**: Express.js, Node.js
- **Content**: Markdown files with gray-matter parsing
- **No database required** for content management

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/your-repo-name.git
   cd your-repo-name
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser to `http://localhost:5000`

## Content Management

All content is stored as markdown files in the `content/` directory. No database setup required!

### Adding a Blog Post

1. Create a new `.md` file in `content/blogs/`:
   ```
   content/blogs/my-new-post.md
   ```

2. Add frontmatter and content:
   ```markdown
   ---
   title: "My Blog Post Title"
   excerpt: "A short description of your post"
   category: "tech"
   date: "2025-01-25"
   ---

   # Your Blog Content

   Write your blog post content here using markdown...
   ```

3. The post will automatically appear on the Blogs page.

**Available categories**: Add any category you want! Categories are fetched dynamically from your markdown files.

### Adding a Book Review

1. Create a new `.md` file in `content/book-reviews/`:
   ```
   content/book-reviews/book-title.md
   ```

2. Add frontmatter and content:
   ```markdown
   ---
   title: "Book Title"
   author: "Author Name"
   excerpt: "Brief summary of the book"
   rating: "5/5"
   category: "fiction"
   date: "2025-01-25"
   ---

   # Book Title by Author Name

   Your review content here...
   ```

### Adding a Learning Journey Skill

1. Create a folder in `content/learning/`:
   ```
   content/learning/skill-name/
   ```

2. Add a `_skill.md` file with skill metadata:
   ```markdown
   ---
   title: "Skill Name"
   excerpt: "What you're learning"
   status: "in-progress"
   startedAt: "2025-01-01"
   ---
   ```

3. Add journal entries as separate markdown files:
   ```markdown
   ---
   title: "Day 1: Getting Started"
   date: "2025-01-01"
   excerpt: "Summary of what you learned"
   ---

   # Day 1: Getting Started

   Journal content here...
   ```

**Status options**: `in-progress`, `completed`, `paused`

### Adding Images

1. Place images in `client/public/images/`
2. Reference them in markdown:
   ```markdown
   ![Description](/images/your-image.jpg)
   ```

## Memento Mori Board

The Memento Mori page is an interactive visualization of life in weeks, inspired by the Stoic practice of remembering mortality.

**Features:**
- Visual grid showing all weeks of a 70-year life (3,640 weeks)
- Enter any age to generate a personalized board
- Shaded boxes represent weeks already lived
- Download the board as an image to keep as a reminder

**How it works:**
1. Navigate to the Memento Mori page
2. Enter your current age
3. Click "Generate" to see your life visualized in weeks
4. Click "Download as Image" to save your personal board

## Customization

### Social Links

Edit `client/src/pages/about.tsx` to update your social media URLs:
- Instagram
- YouTube
- LinkedIn

### Theme Colors

The Kintsugi theme uses warm earthy tones with gold accents. Modify colors in `client/src/index.css`.

### Profile Image

Add your profile image at `client/public/images/profile.jpg` and update the reference in `about.tsx`.

## Deployment

### Deploy on Replit

1. Click the "Publish" button in Replit
2. Your site will be live at `your-project.replit.app`

### Deploy on Vercel

1. Push your code to GitHub
2. Import the repository on [Vercel](https://vercel.com)
3. Set the build command: `npm run build`
4. Set the output directory: `dist`
5. Deploy!

### Deploy on Railway

1. Connect your GitHub repository to [Railway](https://railway.app)
2. Railway will auto-detect the Node.js project
3. Set the start command: `npm run start`
4. Deploy!

### Deploy on Render

1. Create a new Web Service on [Render](https://render.com)
2. Connect your GitHub repository
3. Set build command: `npm run build`
4. Set start command: `npm run start`
5. Deploy!

### Environment Variables

For production deployments, set these environment variables:
- `NODE_ENV=production`
- `SESSION_SECRET=your-secret-key`

## Project Structure

```
content/
  blogs/           # Blog markdown files
  book-reviews/    # Book review markdown files
  learning/        # Learning journey content
    skill-name/
      _skill.md    # Skill metadata
      day-1.md     # Journal entries

client/
  src/
    components/    # React components
    pages/         # Page components
    lib/           # Utilities

server/
  routes.ts        # API endpoints
  storage.ts       # File-based content operations
```

## License

MIT License - feel free to use this for your own portfolio!

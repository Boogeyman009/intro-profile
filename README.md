# Intro Profile Application

A personal profile website built from your resume, with a built-in editor to update your information anytime.

## Features

- **Profile page** — Clean, modern intro page with about, experience, skills, strengths, and education
- **Photo upload** — Upload a profile photo from the admin page
- **PDF export** — Download your profile as a PDF resume from the homepage
- **Admin editor** — Edit any section and save; changes appear on the profile immediately
- **JSON storage** — Profile data lives in `data/profile.json` for easy backup and version control

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for your profile.

Open [http://localhost:3000/admin](http://localhost:3000/admin) to edit your profile.

## How to Update Your Profile

1. Go to `/admin` (or click **Edit Profile** on the homepage)
2. Change any field — name, summary, experience, skills, etc.
3. Click **Save Changes**
4. Visit the homepage to see your updates

## Project Structure

```
├── app/
│   ├── page.tsx          # Public profile page
│   ├── admin/page.tsx    # Profile editor
│   ├── api/profile/      # GET/PUT API for profile data
│   └── globals.css       # Styles
├── components/
│   ├── ProfileView.tsx   # Profile display
│   └── AdminEditor.tsx   # Edit form
├── data/
│   └── profile.json      # Your profile data
└── lib/
    └── profile.ts        # Read/write helpers
```

## Deploy

Works on Vercel, Netlify, or any Node.js host:

```bash
npm run build
npm start
```

Note: On serverless platforms, file writes to `data/profile.json` may not persist between deploys. For production editing, consider connecting a database or using environment-based storage.

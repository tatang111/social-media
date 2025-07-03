# 🧠 Social Media Clone

A full-stack Reddit-style social media app built with **React**, **TypeScript**, **Supabase**, and **Shadcn UI**. Users can sign in with GitHub, create and join communities, post content, comment, and vote—just like Reddit.

---

### 🚀 Live Demo

> 🌐 [**View Live Project Here**](https://social-media-tau-silk.vercel.app/)

---

## 🚀 Tech Stack

### Frontend
- ⚛️ **React** + **TypeScript**
- 🎨 **Tailwind CSS** + **Shadcn UI**
- 🧠 **Zod** + **React Hook Form** for schema-based form validation
- 📦 **TanStack Query** for async data fetching
- 🔔 **Sonner** for toast notifications
- 🔗 **Lucide Icons** for modern iconography

### Backend
- 🐘 **Supabase**
  - Auth: GitHub OAuth (only logged-in users can post, vote, or comment)
  - Realtime DB: Store posts, comments, communities, votes
  - Storage: Handle image uploads for posts

---

## ✨ Features

- 🔐 **Authentication with GitHub**
- 📝 **Create Posts** (general or within a specific community)
- 🏘️ **Community Support**
  - View all communities
  - Create new ones
  - View posts from a specific community
- 👍 **Voting System**
  - Upvote / downvote posts
- 💬 **Comment System**
  - Nested comments (reply to comments like Reddit)
- 🧭 **Feed Sorting**
  - Posts ordered by most recent (home page)
- 📷 **Image Upload**
  - Upload post images to Supabase storage

---

🖼️ Screenshots
![Home Page](https://github.com/tatang111/social-media/issues/1#issue-3198323215)

---

## 📁 Project Structure (Simplified)

---

social-media/

├── app/ # Next.js App Router structure

├── components/ # Reusable UI components (forms, post cards, etc.)

├── lib/ # Client helpers (auth, upload, utils)

├── public/ # Static assets

├── styles/ # Tailwind and global CSS

├── supabase-client/ # Supabase client and helpers

├── .env.local # Environment variables

## 📁 Environment variable

VITE_SUPABASE_URL =https://irupgwcxlnkrmxxfstkf.supabase.co

VITE_SUPABASE_KEY
=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlydXBnd2N4bG5rcm14eGZzdGtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5Mjk0OTIsImV4cCI6MjA2NjUwNTQ5Mn0.CXnXHtqUm17sf9Md4-LWZ2KBMkhbNGPKBz1_QiZeTX4

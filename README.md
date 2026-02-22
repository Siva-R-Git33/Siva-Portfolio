# 🛡️ Siva R – Cybersecurity Portfolio

A premium frontend-only cybersecurity portfolio web application with a dark hacker theme, interactive terminal, admin panel, and blog system. Data is powered by **Supabase**.

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React (Vite) + TailwindCSS + Framer Motion |
| Backend | Supabase (PostgreSQL & Auth) |
| Hosting | Vercel |

## 📦 Setup

### Prerequisites
- **Node.js** 18+ installed
- A **Supabase** project

### 1. Clone & Install

```bash
cd client
npm install
```

### 2. Environment Variables

Create `.env` in the `client` folder:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GITHUB_USERNAME=your_github_username
```

### 3. Setup Database (Supabase)

1. Go to your Supabase Dashboard -> **SQL Editor**.
2. Copy and run the contents of `supabase.sql` located in the root directory.
3. This will create all `projects`, `blogs`, `skills`, and `contact_messages` tables, as well as the RLS policies and seed data.

### 4. Admin Auth Setup

1. Go to Supabase -> **Authentication** -> **Users**.
2. Add a new user with your email and a secure password. 
3. You will use these credentials to log into the Admin Dashboard (`/admin/login`).

### 5. Run Development

```bash
cd client
npm run dev
```

Visit **http://localhost:5173**

## 🌐 Deployment (Vercel)

1. Link your GitHub repository to Vercel.
2. Set the **Framework Preset** to `Vite`.
3. Set the **Root Directory** to `client`.
4. Add your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to the Vercel Environment Variables.
5. Deploy!

## 📂 Project Structure

```
Siva-portfolio/
├── client/                # React frontend
│   ├── src/
│   │   ├── components/    # Navbar, Footer, Terminal, etc.
│   │   ├── sections/      # Hero, About, Skills, Projects, etc.
│   │   ├── pages/         # Home, BlogPost, Admin
│   │   ├── admin/         # Admin CRUD pages
│   │   └── utils/         # Supabase client, API abstractions
│   └── ...config files
├── supabase.sql           # Database schema & setup script
└── README.md
```

## ✨ Features

- 🖥️ **Interactive Terminal** — Simulated CLI with typing animation
- 🎨 **Dark Hacker Theme** — Neon green/blue glassmorphism UI
- 📝 **Blog System** — Markdown support with syntax highlighting
- 🔐 **Admin Panel** — Full CRUD for projects, blogs, skills via Supabase RLS
- 🐙 **GitHub Integration** — Auto-fetch repos directly from the GitHub API
- 📱 **Fully Responsive** — Mobile-first design
- ⚡ **Framer Motion** — Smooth animations everywhere
- 🔍 **SEO Optimized** — Meta tags and semantic HTML

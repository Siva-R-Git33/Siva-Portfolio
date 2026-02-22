# 🛡️ Siva R – Cybersecurity Portfolio

A premium full-stack cybersecurity portfolio web application with dark hacker theme, interactive terminal, admin panel, and blog system.

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React (Vite) + TailwindCSS + Framer Motion |
| Backend | Node.js + Express |
| Database | MongoDB (Mongoose) |
| Auth | JWT |

## 📦 Setup

### Prerequisites
- **Node.js** 18+ installed
- **MongoDB** running locally (or a MongoDB Atlas URI)

### 1. Clone & Install

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Environment Variables

**Backend** (`server/.env`):
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/siva-portfolio
JWT_SECRET=your_super_secret_jwt_key_change_this
GITHUB_USERNAME=your_github_username
```

**Frontend** (`client/.env`) — optional, only needed for production:
```env
VITE_API_URL=https://your-backend-url.com
```

### 3. Seed Database

```bash
cd server
npm run seed
```
This creates:
- Admin user: `admin` / `admin123`
- Initial skills (Python, SQL, Bash, etc.)
- Featured project (Signature Verification System)

### 4. Run Development

```bash
# Terminal 1 – Backend
cd server
npm run dev

# Terminal 2 – Frontend
cd client
npm run dev
```

Visit **http://localhost:5173**

### 5. Admin Panel

Navigate to **http://localhost:5173/admin/login**
- Username: `admin`
- Password: `admin123`

## 🌐 Deployment

### Frontend (Vercel)
```bash
cd client
npm run build
# Deploy the dist/ folder to Vercel
```

Set `VITE_API_URL` environment variable to your backend URL.

### Backend (Render)
- Set environment variables in Render dashboard
- Use `npm start` as the start command
- Set the root directory to `server`

## 📂 Project Structure

```
Siva-portfolio/
├── client/                # React frontend
│   ├── src/
│   │   ├── components/    # Navbar, Footer, Terminal, etc.
│   │   ├── sections/      # Hero, About, Skills, Projects, etc.
│   │   ├── pages/         # Home, BlogPost, Admin
│   │   ├── admin/         # Admin CRUD pages
│   │   └── utils/         # API client, auth helpers
│   └── ...config files
├── server/                # Express backend
│   ├── config/            # DB connection
│   ├── middleware/         # JWT auth
│   ├── models/            # Mongoose schemas
│   ├── routes/            # API endpoints
│   └── seed.js            # Database seeder
└── README.md
```

## ✨ Features

- 🖥️ **Interactive Terminal** — Simulated CLI with typing animation
- 🎨 **Dark Hacker Theme** — Neon green/blue glassmorphism UI
- 📝 **Blog System** — Markdown support with syntax highlighting
- 🔐 **Admin Panel** — Full CRUD for projects, blogs, skills
- 🐙 **GitHub Integration** — Auto-fetch repos with caching
- 📱 **Fully Responsive** — Mobile-first design
- ⚡ **Framer Motion** — Smooth animations everywhere
- 🔍 **SEO Optimized** — Meta tags and semantic HTML

## ⚠️ Important Notes

- Change the default admin password after first login
- Set a strong `JWT_SECRET` in production
- The GitHub integration defaults to fetching public repos

# 🚀 Nova — The Modern Agile Operating System

[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Render](https://img.shields.io/badge/Deploy-Render_Ready-46E3B7?logo=render&logoColor=white)](https://render.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**Nova** is a modern, full-stack agile project management operating system designed for engineering teams, product managers, and fast-moving startups. Built with a focus on speed, clarity, and visual elegance, Nova pairs an interactive Kanban engine with real-time sprint analytics, role-based collaboration, and an automated deployment pipeline.

---

## ✨ Key Highlights

- **🎯 Dedicated Task Board with Instant Project Switching:** Access all tasks across any project instantly from `/board` without deep nesting or multi-step navigation.
- **⚡ 1-Click Task Access:** Direct "Task Board" action buttons directly on every project card.
- **📊 High-Contrast Velocity & Burndown Charts:** Custom-themed Recharts engine with crisp, high-visibility tooltips engineered specifically for dark and light modes.
- **🎨 Interactive Landing Page & Running Mockups:** Live interactive stage simulation showcasing the Kanban board, velocity metrics, team activity, and project portfolio.
- **🛡️ Enterprise-Grade Authentication & RBAC:** Secure JWT authentication with role-based permissions (`Admin`, `Member`, `Viewer`).
- **🌓 Adaptive Theme Engine:** Seamless switching between Dark Mode and Light Mode with zero layout shift and local storage persistence.
- **💾 Resilient Database Architecture:** Seamlessly connects to MongoDB Atlas or automatically falls back to an ultra-fast in-memory MongoDB instance with persistent binary caching for zero-config local development.
- **🌐 Production-Ready SPA Serving:** Express backend dynamically serves the compiled Vite frontend in production mode.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** [React 18](https://react.dev/) + [Vite 5](https://vitejs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) with custom dark/light theme variables
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Data Visualization:** [Recharts](https://recharts.org/) with custom high-contrast tooltip overlays
- **Icons:** [Lucide React](https://lucide.dev/)
- **Routing:** [React Router v6](https://reactrouter.com/)
- **HTTP Client:** [Axios](https://axios-http.com/) with token interceptors

### Backend
- **Runtime:** [Node.js](https://nodejs.org/) (v18+)
- **Framework:** [Express 4](https://expressjs.com/)
- **Database & ODM:** [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/)
- **In-Memory Fallback:** `mongodb-memory-server` with drive-cached binaries
- **Security:** `bcryptjs` password hashing, `jsonwebtoken` (JWT), `cors`, `dotenv`

---

## 📁 Project Structure

```
Nova/
├── backend/                  # Express REST API & Database engine
│   ├── config/               # Database connection & memory server fallback
│   ├── controllers/          # Business logic (auth, projects, tasks, teams)
│   ├── middleware/           # Auth verification & RBAC authorization
│   ├── models/               # Mongoose schemas (User, Project, Task, Team)
│   ├── routes/               # API endpoint definitions (/api/auth, /api/projects, etc.)
│   ├── services/             # Database seeding & initial state initialization
│   ├── app.js                # Express app setup & production SPA static serving
│   ├── server.js             # Server bootstrap & port listener
│   └── package.json
│
├── frontend/                 # React 18 + Vite SPA client
│   ├── public/               # Static assets & favicon
│   ├── src/
│   │   ├── api/              # Axios instance and API service methods
│   │   ├── components/
│   │   │   ├── common/       # Button, Input, Modal, Badge, ThemeToggle
│   │   │   ├── landing/      # LandingNavbar, RunningMockups
│   │   │   ├── layout/       # Sidebar, Header, AppLayout
│   │   │   ├── projects/     # ProjectCard, ProjectModal
│   │   │   ├── tasks/        # TaskBoard, TaskCard, TaskList, Task modals
│   │   │   └── team/         # TeamList, InviteMemberModal
│   │   ├── pages/            # LandingPage, DashboardPage, TaskBoardPage, etc.
│   │   ├── store/            # Zustand stores (authStore, themeStore)
│   │   ├── App.jsx           # Client router and route guards
│   │   ├── index.css         # Tailwind directives and design tokens
│   │   └── main.jsx          # React DOM entry point
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── render.yaml               # 1-Click Render blueprint configuration
├── package.json              # Monorepo root scripts
└── README.md                 # Project documentation
```

---

## 🚦 Getting Started

### Prerequisites
- **Node.js** >= 18.0.0
- **npm** >= 9.0.0

### 1. Clone the Repository
```bash
git clone https://github.com/kaifansariw/Nova.git
cd Nova
```

### 2. Install Dependencies
Install dependencies across both root, backend, and frontend with a single command:
```bash
npm run install-all
```

### 3. Environment Configuration
The backend comes pre-configured with a `.env` template. If no MongoDB Atlas URI is supplied or the remote cluster is unreachable, Nova automatically boots an in-memory database with realistic seed data:

```env
# backend/.env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key
# MONGO_URI=mongodb+srv://... (Optional: falls back to in-memory if omitted)
```

### 4. Start Development Servers
Run backend and frontend simultaneously:
```bash
npm run dev
```

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000

---

## 🔑 Demo Credentials

When running with default seed data, you can log in immediately:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `demo@nova.team` | `password123` |
| **Member** | `alex@nova.team` | `password123` |

You can also create a new account directly via the **Sign Up** page.

---

## 🚀 Deployment (Render)

Nova includes a `render.yaml` blueprint for seamless deployment to [Render](https://render.com):

1. Connect your GitHub repository to Render.
2. Create a new **Web Service**.
3. Set the following build and start commands:
   - **Build Command:** `npm install --include=dev && npm run build`
   - **Start Command:** `npm start`
4. Set environment variables:
   - `NODE_ENV=production`
   - `PORT=5000`
   - `JWT_SECRET=your_secure_secret_key`
   - `MONGO_URI=your_mongodb_connection_string`

The Express server automatically compiles the Vite bundle and serves static assets from `frontend/dist/`.

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

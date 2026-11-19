# Nova

Nova is a full-stack agile project management platform designed for engineering teams, product managers, and modern software organizations. It provides an intuitive interface for sprint planning, interactive task execution, team workload distribution, and velocity tracking.

---

## Architectural Overview

Nova is structured as a decoupled monorepo comprising a modern React single-page application (SPA) and a scalable Node.js/Express REST API.

```
Nova/
├── backend/
│   ├── config/             # Database connection handling and in-memory fallback
│   ├── controllers/        # Business logic for authentication, projects, tasks, and teams
│   ├── middleware/         # JWT verification, RBAC guards, and request validators
│   ├── models/             # Mongoose schemas (User, Project, Task, Team)
│   ├── routes/             # RESTful API routing endpoints
│   ├── services/           # Data seeding and initialization utilities
│   ├── app.js              # Express application assembly and static asset serving
│   ├── server.js           # Process initialization and socket listening
│   └── package.json
│
├── frontend/
│   ├── public/             # Static public assets
│   ├── src/
│   │   ├── api/            # HTTP client configuration and API abstraction layer
│   │   ├── components/
│   │   │   ├── common/     # Reusable design primitives (Button, Modal, Input, Badge)
│   │   │   ├── landing/    # Marketing interface and interactive product simulators
│   │   │   ├── layout/     # Navigation bars, sidebar hierarchy, and layout wrappers
│   │   │   ├── projects/   # Project management cards, creation dialogs, and metrics
│   │   │   ├── tasks/      # Kanban board, task cards, filters, and detail drawers
│   │   │   └── team/       # Team roster management and member invitation dialogs
│   │   ├── pages/          # Top-level view controllers and routing targets
│   │   ├── store/          # Client-side state containers (Zustand)
│   │   ├── App.jsx         # Application routing tree and authentication guards
│   │   ├── index.css       # Design tokens and Tailwind CSS directives
│   │   └── main.jsx        # Application bootstrap entry point
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── render.yaml             # Infrastructure-as-code blueprint for cloud deployment
├── package.json            # Root coordination scripts
└── README.md
```

---

## Key Capabilities

### Agile Task Management
- **Interactive Kanban Boards:** Real-time drag-and-drop state transitions across lifecycle columns (Backlog, Todo, In Progress, Done).
- **Dedicated Task Workspace:** Direct global access to all tasks via `/board`, featuring instantaneous project context switching.
- **Direct Navigation:** One-click task access directly from portfolio project cards.

### Engineering Analytics & Reporting
- **Velocity & Burndown Tracking:** Dynamic charts powered by Recharts, offering clear visibility into sprint progress, completion ratios, and team capacity.
- **High-Contrast Data Display:** Calibrated visual indicators ensuring readability across both dark and light display modes.

### Security and Access Governance
- **Role-Based Access Control (RBAC):** Granular permissions partitioning capabilities across `Admin`, `Member`, and `Viewer` roles.
- **Cryptographic Security:** Passwords hashed with `bcryptjs` and session continuity managed via JSON Web Tokens (JWT).

### Infrastructure Resilience
- **Database Failover Architecture:** Standard connection to MongoDB Atlas with an automated fallback to an embedded in-memory MongoDB engine (`mongodb-memory-server`) for zero-configuration local evaluation.
- **Drive Cache Optimization:** Engine binaries are isolated to designated persistent storage paths, mitigating environment constraint issues.
- **Automated Keep-Alive Monitor:** Built-in self-pinging background monitor targeting `/api/health` every 14 minutes to prevent idle sleep on free-tier cloud instances (e.g., Render).

---

## Technology Stack

| Domain | Technologies |
| :--- | :--- |
| **Frontend Framework** | React 18, Vite 5 |
| **State Architecture** | Zustand |
| **Styling & Design Tokens** | Tailwind CSS, Lucide Icons |
| **Visualization** | Recharts |
| **Routing** | React Router v6 |
| **Backend Runtime** | Node.js (>=18.x), Express 4 |
| **Persistence Layer** | MongoDB, Mongoose 8 |
| **Authentication** | JSON Web Tokens (jsonwebtoken), bcryptjs |
| **Deployment Target** | Render (Web Service Blueprint) |

---

## Getting Started

### Prerequisites
- Node.js (version 18.0.0 or higher)
- npm (version 9.0.0 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/kaifansariw/Nova.git
   cd Nova
   ```

2. Install all dependencies across the workspace:
   ```bash
   npm run install-all
   ```

### Configuration

Create a `.env` file within the `backend/` directory or adjust existing values:

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_signing_key_here
# Optional: Remote MongoDB URI (falls back to in-memory if unreachable or unspecified)
# MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/nova?retryWrites=true&w=majority
```

### Running Locally

To launch both the backend API server and the frontend development environment concurrently:

```bash
npm run dev
```

- **Frontend Client:** `http://localhost:5173`
- **Backend API:** `http://localhost:5000`

---

## Default Credentials

The platform seeds test accounts on initial execution when using default test storage:

| Account Type | Email | Password | Role |
| :--- | :--- | :--- | :--- |
| **Administrator** | `demo@nova.team` | `password123` | Admin |
| **Team Member** | `alex@nova.team` | `password123` | Member |

New accounts can also be registered directly through the authentication interface.

---

## Production Build and Deployment

### Building Locally

To generate production-ready static assets:

```bash
npm run build
```

This compiles the client application into `frontend/dist/`, which is automatically served by the Express backend when running with `NODE_ENV=production`.

### Deploying to Render

This repository includes a `render.yaml` specification for immediate deployment:

1. Link your repository in the Render Dashboard.
2. Select **Blueprint** deployment or configure a **Web Service** with:
   - **Build Command:** `npm install --include=dev && npm run build`
   - **Start Command:** `npm start`
3. Configure the following environment variables:
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `JWT_SECRET`: A secure random cryptographic string
   - `MONGO_URI`: Your production MongoDB Atlas connection string

---

## License

This project is licensed under the MIT License. Details are available in the [LICENSE](LICENSE) file.

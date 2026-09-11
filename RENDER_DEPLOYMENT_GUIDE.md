# Deploying Nova-Team to Render

This guide walks you through deploying the complete **Nova-Team** full-stack application (React frontend + Express backend + MongoDB Atlas) to [Render](https://render.com).

---

## 📋 Quick Pre-requisites
1. A free [Render.com](https://render.com) account.
2. A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (or an active MongoDB URI).
3. A [GitHub](https://github.com) account.

---

## Step 1: Initialize Git and Push to GitHub

If you haven't already pushed this project to GitHub:

1. Open PowerShell or Terminal in the root folder (`d:\Nova PRD`):
```bash
git init
git add .
git commit -m "Prepare Nova-Team for Render deployment"
```

2. Create a new repository on [GitHub](https://github.com/new) (e.g., `nova-team`).

3. Link and push your local repo to GitHub:
```bash
git branch -M main
git remote add origin https://github.com/<your-username>/nova-team.git
git push -u origin main
```

*(Note: `.gitignore` is already configured so sensitive `.env` files and `node_modules` will not be committed).*

---

## Step 2: Ensure MongoDB Atlas Allows Render Access

Render uses dynamic IP addresses, so your MongoDB Atlas cluster needs to allow external connections:

1. Log in to [MongoDB Atlas](https://cloud.mongodb.com).
2. In the left sidebar, click **Network Access** (under Security).
3. Click **Add IP Address**.
4. Click **Allow Access from Anywhere** (`0.0.0.0/0`).
5. Click **Confirm**.

---

## Step 3: Deploy on Render

### Recommended Approach: Single Web Service (Best for Free Tier)
Deploying frontend and backend together in a single Web Service stays 100% within Render's free tier (750 hours/month), avoids CORS complexities, and provides a unified domain.

1. Go to your [Render Dashboard](https://dashboard.render.com).
2. Click **New +** → **Web Service**.
3. Select **Build and deploy from a Git repository** and connect your `nova-team` repository.
4. Fill in the service configuration:
   - **Name:** `nova-team` (or any name you like)
   - **Region:** Choose the region closest to you (e.g., Oregon, Frankfurt)
   - **Branch:** `main`
   - **Root Directory:** *(Leave blank)*
   - **Runtime:** `Node`
   - **Build Command:**
     ```bash
     npm run build
     ```
   - **Start Command:**
     ```bash
     npm start
     ```
   - **Instance Type:** `Free`

5. Scroll down to **Environment Variables** and add:

| Key | Value | Description |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Enables production mode & SPA serving |
| `MONGODB_URI` | `mongodb+srv://<username>:<password>@nova.g2lh4ad.mongodb.net/nova_team_db?retryWrites=true&w=majority` | Your MongoDB connection string |
| `JWT_SECRET` | `nova_team_jwt_secret_render_production_key_2026` *(or click generate)* | Secret for auth tokens |

6. Click **Create Web Service**.

Render will now:
- Install all server and client dependencies.
- Compile the Vite frontend into optimized static production assets.
- Start the Express server on Render's assigned port.
- Serve both the REST API (`/api/*`) and the React SPA UI from the same URL!

---

### Alternative Approach: Blueprint (Render.yaml)
A `render.yaml` blueprint is already included in this repository.
1. In Render Dashboard, click **New +** → **Blueprint**.
2. Select your repository.
3. Render will read `render.yaml` automatically.
4. Provide your `MONGODB_URI` when prompted, and click **Apply**.

---

## 🔑 Default Login Credentials Once Deployed
After your Render URL goes live (e.g. `https://nova-team.onrender.com`), you can log in with:
- **Email:** `demo@nova.team`
- **Password:** `password123`
*(Or click the "Instant 1-Click Demo Login" button on the sign-in screen)*.

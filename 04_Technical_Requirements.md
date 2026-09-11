# Technical Requirements

Frontend: React with Tailwind CSS
Backend: Node.js with Express.js
Database: MongoDB with Mongoose
Styling: Tailwind CSS with both light and dark theme configurations

Recommended Libraries and Packages

Frontend (React):
- React Router DOM v6: Client-side routing for all application views.
- Zustand: Lightweight state management for global state (auth, theme, selected project).
- Axios: HTTP client for all API communication with interceptors for token injection and error handling.
- React Hook Form with Zod: Form handling and schema validation for registration, login, project creation, and task forms.
- date-fns: Date formatting, parsing, and relative time calculations for task deadlines and activity timestamps.
- Recharts: Chart components for analytics dashboard and progress visualizations.
- React Beautiful DnD or @dnd-kit/core: Drag-and-drop functionality for the Kanban task board.
- React Hot Toast or Sonner: Toast notifications for user feedback on actions (task created, project deleted, etc.).
- clsx or tailwind-merge: Conditional class name merging for dynamic Tailwind styling.
- React Icons: Icon library for UI elements.
- @headlessui/react: Unstyled, accessible UI components for dialogs, dropdowns, and tabs.

Backend (Node.js / Express.js):
- Express: Web application framework.
- Mongoose: MongoDB object modeling and schema definition.
- bcryptjs: Password hashing for user authentication.
- jsonwebtoken: JWT generation and verification for stateless authentication.
- cors: Cross-origin resource sharing middleware.
- dotenv: Environment variable management.
- express-rate-limit: API rate limiting to prevent abuse.
- express-validator or Joi: Request validation middleware.
- Multer: File upload handling for project cover images.
- morgan: HTTP request logging middleware.
- helmet: Security HTTP headers.
- connect-mongo or mongoose-session: Session store for token blacklist on logout.

Database Schema (MongoDB via Mongoose)

User Schema:
- name: String (required)
- email: String (required, unique, indexed)
- password: String (required, hashed with bcryptjs)
- organization: String (optional)
- avatarUrl: String (optional)
- role: String (enum: member, admin, owner, default: member)
- createdAt: Date (default: Date.now)
- updatedAt: Date (default: Date.now)

Project Schema:
- name: String (required)
- description: String (optional)
- owner: ObjectId (ref: User, required)
- members: [{ userId: ObjectId (ref: User), role: String (enum: owner, admin, member), joinedAt: Date }]
- coverImageUrl: String (optional)
- status: String (enum: active, archived, completed, default: active)
- startDate: Date (optional)
- deadline: Date (optional)
- createdAt: Date (default: Date.now)
- updatedAt: Date (default: Date.now)

Task Schema:
- title: String (required)
- description: String (optional)
- projectId: ObjectId (ref: Project, required, indexed)
- status: String (enum: todo, in-progress, review, done, default: todo)
- priority: String (enum: low, medium, high, critical, default: medium)
- assignees: [ObjectId (ref: User)]
- tags: [String]
- dueDate: Date (optional)
- createdBy: ObjectId (ref: User, required)
- attachments: [String] (file URLs)
- comments: [{ author: ObjectId (ref: User), text: String, createdAt: Date }]
- activityLog: [{ action: String, performedBy: ObjectId (ref: User), timestamp: Date }]
- createdAt: Date (default: Date.now)
- updatedAt: Date (default: Date.now)

Folder/Architecture Structure

Server/ (backend)
  config/
    db.js (MongoDB connection)
    auth.js (JWT configuration)
    storage.js (Multer configuration)
  middleware/
    auth.js (JWT verification middleware)
    rateLimiter.js (API rate limiting)
    errorHandler.js (Centralized error handling)
    validator.js (Request validation middleware)
  models/
    User.js
    Project.js
    Task.js
  routes/
    auth.routes.js
    project.routes.js
    task.routes.js
    team.routes.js
    upload.routes.js
  controllers/
    auth.controller.js
    project.controller.js
    task.controller.js
    team.controller.js
    upload.controller.js
  services/
    emailService.js (Invite email notifications)
    tokenService.js (JWT generation and blacklist)
  app.js (Express app setup)
  server.js (Entry point)

client/ (frontend)
  src/
    components/
      common/
        Button.jsx
        Input.jsx
        Modal.jsx
        Toast.jsx
        ThemeToggle.jsx
        LoadingSpinner.jsx
      layout/
        Header.jsx
        Sidebar.jsx
        Footer.jsx
      auth/
        LoginForm.jsx
        RegisterForm.jsx
      projects/
        ProjectCard.jsx
        ProjectList.jsx
        ProjectForm.jsx
        ProjectOverview.jsx
      tasks/
        TaskCard.jsx
        TaskBoard.jsx
        TaskList.jsx
        TaskDetail.jsx
        TaskForm.jsx
      team/
        MemberList.jsx
        InviteForm.jsx
        MemberCard.jsx
      dashboard/
        StatsCard.jsx
        ProgressChart.jsx
        ActivityFeed.jsx
    hooks/
      useAuth.js
      useProjects.js
      useTasks.js
      useTeam.js
      useTheme.js
    store/
      authStore.js
      themeStore.js
      projectStore.js
      taskStore.js
    pages/
      LoginPage.jsx
      RegisterPage.jsx
      DashboardPage.jsx
      ProjectListPage.jsx
      ProjectPage.jsx
      TaskBoardPage.jsx
      TeamPage.jsx
      SettingsPage.jsx
    utils/
      api.js (Axios instance with interceptors)
      constants.js
      helpers.js
    App.jsx
    main.jsx
    index.css (Tailwind imports)
    tailwind.config.js
    .env

Key API Endpoints

Authentication:
- POST /api/auth/register: Register a new user. Request body: { name, email, password, organization }. Response: { user, token }.
- POST /api/auth/login: Authenticate user. Request body: { email, password }. Response: { user, token }.
- POST /api/auth/logout: Invalidate session. Response: { message }.
- GET /api/auth/me: Get current user profile. Response: { user }.

Projects:
- GET /api/projects: List all projects for the authenticated user. Query params: page, limit, status, search. Response: { projects, total, page }.
- POST /api/projects: Create a new project. Request body: { name, description, deadline, coverImage }. Response: { project }.
- GET /api/projects/:id: Get a single project with populated members and tasks. Response: { project }.
- PUT /api/projects/:id: Update a project. Request body: { name, description, deadline }. Response: { project }.
- DELETE /api/projects/:id: Delete a project. Response: { message }.

Tasks:
- GET /api/projects/:id/tasks: List tasks for a project. Query params: status, priority, assignee, page, limit. Response: { tasks, total }.
- POST /api/projects/:id/tasks: Create a task. Request body: { title, description, status, priority, assignees, tags, dueDate }. Response: { task }.
- GET /api/tasks/:id: Get a single task with comments and activity log. Response: { task }.
- PUT /api/tasks/:id: Update a task. Response: { task }.
- DELETE /api/tasks/:id: Delete a task. Response: { message }.
- PATCH /api/tasks/:id/status: Update task status. Request body: { status }. Response: { task }.
- POST /api/tasks/:id/comments: Add a comment. Request body: { text }. Response: { comment }.
- POST /api/tasks/:id/attachments: Upload attachment. Multipart form data. Response: { fileUrl }.

Team:
- GET /api/projects/:id/members: List project members. Response: { members }.
- POST /api/projects/:id/members: Invite a member. Request body: { email, role }. Response: { invitation }.
- DELETE /api/projects/:id/members/:userId: Remove a member. Response: { message }.
- PATCH /api/projects/:id/members/:userId/role: Update member role. Request body: { role }. Response: { member }.

Data Flow
1. The React frontend sends HTTP requests to the Express backend via Axios, with the JWT token attached in the Authorization header as a Bearer token.
2. Express middleware validates the token on every protected route. Invalid or expired tokens return a 401 response.
3. Controllers process business logic, interact with Mongoose models to query or mutate MongoDB, and return JSON responses.
4. The frontend Zustand stores manage authentication state, theme preference, and selected project context. On initial load, the app checks for a stored token and validates it with the backend.
5. Theme preference is stored in localStorage and applied via Tailwind CSS class toggling on the root HTML element.
6. Real-time task status updates are reflected immediately in the UI via optimistic updates, with server reconciliation on response.
7. File uploads go through Multer middleware, which stores the file and returns a URL that is saved in the task or project document.

Deployment Considerations
- The Express server runs on a configured port (default 5000) with environment variables for NODE_ENV, PORT, MONGODB_URI, JWT_SECRET, and CLIENT_URL.
- The React frontend is built with `npm run build` and served as static assets from the Express server in production, or hosted separately on a CDN.
- MongoDB connection uses a connection string with retryWrites and useNewUrlParser enabled.
- Environment variables are never committed to version control; all secrets are managed via .env files excluded from Git.
- CORS is configured to allow requests only from the registered frontend origin in production.
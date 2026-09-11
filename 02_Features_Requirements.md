# Features & Requirements

Authentication Module
1. User Registration: Users can create an account using email and password. Passwords are hashed with bcryptjs before storage. On registration, users provide a display name and organization name.
2. User Login: Authenticated users log in with email and password. A JWT access token is issued upon successful authentication and stored in an HTTP-only cookie.
3. Session Management: Tokens are validated on every protected request. Users can log out, which invalidates the current session server-side.
4. Protected Routes: All project, task, and team routes require a valid JWT. Unauthenticated users are redirected to the login page.

Project Management Module
5. Create Project: Authenticated users can create a project with a name, description, start date, deadline, and optional cover image. Each project is associated with the creator as the project owner.
6. Edit Project: Project owners and admins can update project details, including renaming, updating descriptions, and changing deadlines.
7. Delete Project: Project owners can delete a project and all associated tasks and team memberships. A confirmation step is required.
8. Project List Dashboard: A paginated view of all projects the user belongs to, sorted by most recently active, with search and filter by status (active, archived, completed).
9. Project Overview Page: A dedicated page per project showing project details, progress percentage, task breakdown by status, and recent activity feed.

Task Management Module
10. Create Task: Within a project, users can create tasks with a title, description, priority (low, medium, high, critical), status (to-do, in-progress, review, done), assignee (one or more team members), due date, and tags.
11. Edit Task: Task creators and project admins can update any task field including status, priority, assignees, and due dates.
12. Delete Task: Task creators and project admins can delete tasks. A soft-delete mechanism marks tasks as archived rather than permanently removing them.
13. Task Board View: A Kanban-style board displaying tasks grouped by status columns (to-do, in-progress, review, done). Tasks are draggable between columns to update status.
14. Task List View: A table or card-based list view of all tasks within a project, sortable by priority, due date, assignee, or creation date.
15. Task Detail Modal: Clicking a task opens a detail panel showing full description, activity log, comments section, assignee list, and status history.

Team Collaboration Module
16. Invite Members: Project owners and admins can invite team members to a project via email. Invited users receive a notification and can join the project upon accepting.
17. Remove Members: Project owners and admins can remove members from a project. Removed members lose access to project data.
18. Role Management: Each project member has a role: owner, admin, or member. Owners have full control, admins can manage tasks and members, and members can view and update their assigned tasks.
19. Member List: A panel within each project showing all members, their roles, and their task load count.

Progress Tracking & Dashboard Module
20. Project Progress Bar: A visual progress indicator on each project showing the percentage of tasks marked as "done."
21. Team Workload Overview: A dashboard view showing each team member's current task count, overdue tasks, and completed tasks.
22. Activity Timeline: A chronological feed of all actions within a project (task created, status changed, member added, comment posted).
23. Analytics Summary: High-level charts showing project completion rates over time, task distribution by priority, and team productivity metrics.

Theme Support Module
24. Light Theme: Full light theme rendering using the specified color palette with Background set to a light neutral and Surface to a slightly darker shade.
25. Dark Theme: Default dark theme using the specified dark palette (#0F172A background, #1E293B surface).
26. Theme Toggle: A persistent toggle switch in the header allowing users to switch between light and dark themes. Theme preference is persisted in localStorage.

Data Storage Requirements
27. All user credentials are stored as bcrypt-hashed passwords. No plaintext passwords persist in MongoDB.
28. JWT tokens are issued with a configurable expiration (e.g., 24 hours) and stored server-side in a token blacklist for logout functionality.
29. File uploads (project cover images, attachments) are handled via Multer with a configurable file size limit and stored in a designated directory or cloud storage path.
30. All timestamps (createdAt, updatedAt) are automatically managed by Mongoose.
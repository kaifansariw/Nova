import { User } from '../models/User.js';
import { Project } from '../models/Project.js';
import { Task } from '../models/Task.js';

export const seedDatabase = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('Database already seeded. Skipping initial seeding.');
      return;
    }

    console.log('Seeding database with sample demo data...');

    // 1. Create Users
    const demoUser = await User.create({
      name: 'Alex Rivera',
      email: 'demo@nova.team',
      password: 'password123',
      organization: 'Nova Technologies',
      role: 'owner',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    });

    const elena = await User.create({
      name: 'Elena Rostova',
      email: 'elena@nova.team',
      password: 'password123',
      organization: 'Nova Technologies',
      role: 'admin',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
    });

    const marcus = await User.create({
      name: 'Marcus Chen',
      email: 'marcus@nova.team',
      password: 'password123',
      organization: 'Nova Technologies',
      role: 'member',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    });

    const sarah = await User.create({
      name: 'Sarah Connor',
      email: 'sarah@nova.team',
      password: 'password123',
      organization: 'Nova Technologies',
      role: 'member',
      avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80'
    });

    const david = await User.create({
      name: 'David Kim',
      email: 'david@nova.team',
      password: 'password123',
      organization: 'Nova Technologies',
      role: 'member',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
    });

    const membersList = [
      { userId: demoUser._id, role: 'owner' },
      { userId: elena._id, role: 'admin' },
      { userId: marcus._id, role: 'member' },
      { userId: sarah._id, role: 'member' },
      { userId: david._id, role: 'member' }
    ];

    // 2. Create Projects
    const project1 = await Project.create({
      name: 'Nova Platform 2.0',
      description: 'Next-generation project management and agile team collaboration suite with real-time Kanban and analytics.',
      owner: demoUser._id,
      members: membersList,
      status: 'active',
      startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
      coverImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'
    });

    const project2 = await Project.create({
      name: 'Mobile Companion App',
      description: 'Native iOS and Android lightweight companion app for notifications, quick triage, and task tracking.',
      owner: demoUser._id,
      members: [
        { userId: demoUser._id, role: 'owner' },
        { userId: marcus._id, role: 'member' },
        { userId: david._id, role: 'member' }
      ],
      status: 'active',
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      coverImageUrl: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&auto=format&fit=crop&q=80'
    });

    const project3 = await Project.create({
      name: 'Design System & Component Library',
      description: 'Unified tokens, accessible components, and icon sets adhering to WCAG 2.1 AA specifications.',
      owner: demoUser._id,
      members: [
        { userId: demoUser._id, role: 'owner' },
        { userId: elena._id, role: 'admin' },
        { userId: sarah._id, role: 'member' }
      ],
      status: 'completed',
      startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      deadline: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      coverImageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80'
    });

    // 3. Create Tasks for Project 1
    const tasksData = [
      {
        title: 'Implement Webhook integration for Github & Slack',
        description: 'Allow teams to trigger automated task movements and notifications when pull requests are merged.',
        projectId: project1._id,
        status: 'todo',
        priority: 'high',
        assignees: [marcus._id],
        tags: ['Backend', 'Integrations', 'API'],
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        createdBy: demoUser._id,
        order: 0,
        activityLog: [{ action: 'Task created', performedBy: demoUser._id, timestamp: new Date() }]
      },
      {
        title: 'Add keyboard shortcuts modal for fast power-user navigation',
        description: 'Pressing `?` or `Cmd+K` should open a command palette for searching tasks and jumping to boards.',
        projectId: project1._id,
        status: 'todo',
        priority: 'medium',
        assignees: [elena._id],
        tags: ['Accessibility', 'UX', 'Frontend'],
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        createdBy: demoUser._id,
        order: 1,
        activityLog: [{ action: 'Task created', performedBy: demoUser._id, timestamp: new Date() }]
      },
      {
        title: 'Setup automated end-to-end testing pipeline',
        description: 'Configure Cypress or Playwright test suites running on Github Actions for pull request verification.',
        projectId: project1._id,
        status: 'todo',
        priority: 'medium',
        assignees: [david._id],
        tags: ['DevOps', 'Testing'],
        dueDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
        createdBy: demoUser._id,
        order: 2,
        activityLog: [{ action: 'Task created', performedBy: demoUser._id, timestamp: new Date() }]
      },
      {
        title: 'Refactor Kanban drag-and-drop to optimistic state update',
        description: 'Provide instant UI feedback when tasks are dragged across status columns, updating server asynchronously.',
        projectId: project1._id,
        status: 'in-progress',
        priority: 'critical',
        assignees: [elena._id, demoUser._id],
        tags: ['Frontend', 'Kanban', 'Performance'],
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        createdBy: demoUser._id,
        order: 0,
        comments: [
          {
            author: elena._id,
            text: 'I have started integrating @hello-pangea/dnd. Smooth transitions are working nicely!',
            createdAt: new Date(Date.now() - 3 * 3600 * 1000)
          }
        ],
        activityLog: [{ action: 'Moved from To Do to In Progress', performedBy: elena._id, timestamp: new Date() }]
      },
      {
        title: 'Dark mode WCAG 2.1 AA contrast ratio audit',
        description: 'Ensure all text tokens (#F8FAFC on #0F172A and #1E293B) meet the 4.5:1 ratio requirement.',
        projectId: project1._id,
        status: 'in-progress',
        priority: 'high',
        assignees: [sarah._id],
        tags: ['Design', 'Accessibility', 'Tokens'],
        dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        createdBy: demoUser._id,
        order: 1,
        activityLog: [{ action: 'Task created', performedBy: demoUser._id, timestamp: new Date() }]
      },
      {
        title: 'Implement JWT token refresh and session blacklist',
        description: 'Token invalidation on logout with in-memory set and secure HTTP authorization handling.',
        projectId: project1._id,
        status: 'in-progress',
        priority: 'high',
        assignees: [marcus._id],
        tags: ['Security', 'Backend', 'Auth'],
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        createdBy: demoUser._id,
        order: 2,
        activityLog: [{ action: 'Task assigned to Marcus', performedBy: demoUser._id, timestamp: new Date() }]
      },
      {
        title: 'Design sprint review for multi-tenant organizations',
        description: 'Review Figma wireframes for organization settings and team member role permissions matrix.',
        projectId: project1._id,
        status: 'review',
        priority: 'medium',
        assignees: [sarah._id, demoUser._id],
        tags: ['Design', 'Specs', 'Review'],
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        createdBy: demoUser._id,
        order: 0,
        comments: [
          {
            author: sarah._id,
            text: 'Mockups have been uploaded for stakeholder review.',
            createdAt: new Date(Date.now() - 5 * 3600 * 1000)
          }
        ],
        activityLog: [{ action: 'Moved to Review column', performedBy: sarah._id, timestamp: new Date() }]
      },
      {
        title: 'Recharts analytics dashboard workload metrics',
        description: 'High-level charts showing completion rate, task distribution by priority, and team member workload.',
        projectId: project1._id,
        status: 'review',
        priority: 'high',
        assignees: [elena._id],
        tags: ['Analytics', 'Charts', 'Frontend'],
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        createdBy: demoUser._id,
        order: 1,
        activityLog: [{ action: 'Moved to Review column', performedBy: elena._id, timestamp: new Date() }]
      },
      {
        title: 'Setup Mongoose database schemas and migrations',
        description: 'Created User, Project, and Task schemas with timestamps and referential integrity.',
        projectId: project1._id,
        status: 'done',
        priority: 'high',
        assignees: [marcus._id],
        tags: ['Database', 'Architecture', 'Mongoose'],
        dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        createdBy: demoUser._id,
        order: 0,
        activityLog: [{ action: 'Task marked as Done', performedBy: marcus._id, timestamp: new Date() }]
      },
      {
        title: 'Configure Tailwind brand color tokens & dark theme',
        description: 'Setup primary #3B82F6, accent #06B6D4, dark #0F172A / #1E293B, and light #F8FAFC tokens.',
        projectId: project1._id,
        status: 'done',
        priority: 'low',
        assignees: [sarah._id, elena._id],
        tags: ['Styling', 'Design', 'Tokens'],
        dueDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        createdBy: demoUser._id,
        order: 1,
        activityLog: [{ action: 'Task completed', performedBy: sarah._id, timestamp: new Date() }]
      },
      {
        title: 'Initialize REST API endpoints for user authentication',
        description: 'Registration, login, logout, and me endpoints with bcryptjs and JWT tokens.',
        projectId: project1._id,
        status: 'done',
        priority: 'critical',
        assignees: [demoUser._id, marcus._id],
        tags: ['Auth', 'API', 'Security'],
        dueDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
        createdBy: demoUser._id,
        order: 2,
        activityLog: [{ action: 'Task completed and verified', performedBy: demoUser._id, timestamp: new Date() }]
      }
    ];

    await Task.insertMany(tasksData);

    // Tasks for Mobile App
    await Task.insertMany([
      {
        title: 'Push notification service worker setup',
        description: 'Deliver instant task assignment and comment notifications to device.',
        projectId: project2._id,
        status: 'todo',
        priority: 'high',
        assignees: [marcus._id],
        tags: ['Mobile', 'Notifications'],
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        createdBy: demoUser._id,
        order: 0
      },
      {
        title: 'Offline task caching with local storage',
        description: 'Allow browsing and queuing edits while offline.',
        projectId: project2._id,
        status: 'in-progress',
        priority: 'medium',
        assignees: [david._id],
        tags: ['Mobile', 'Offline'],
        dueDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
        createdBy: demoUser._id,
        order: 0
      }
    ]);

    console.log('Database seeding successfully completed! Demo user: demo@nova.team / password123');
  } catch (err) {
    console.error('Error during database seeding:', err);
  }
};

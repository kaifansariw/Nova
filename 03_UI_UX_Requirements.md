# UI/UX Requirements

### Brand Color Palette & Styling Tokens

| Token | Role | Hex Code | Usage |
|---|---|---|---|
| Primary | #3B82F6 | Blue | Buttons, active links, selected states, primary CTAs |
| Secondary | #64748B | Slate | Text on secondary elements, muted labels, borders |
| Accent | #06B6D4 | Cyan | Highlights, notifications, badges, interactive feedback |
| Background | #0F172A | Dark Navy | Dark mode page background |
| Surface | #1E293B | Slate Dark | Dark mode cards, panels, modals |
| Text | #F8FAFC | Off-White | Dark mode primary text color |
| Light Background | #F8FAFC | Off-White | Light mode page background |
| Light Surface | #E2E8F0 | Light Slate | Light mode cards, panels, modals |
| Light Text | #0F172A | Dark Navy | Light mode primary text color |
| Font Family | Inter | Inter | All typography across both themes |

Design Direction
Nova-Team follows a Minimal design philosophy. The interface prioritizes clarity and reduced cognitive load through generous whitespace, limited color accents, and a flat visual hierarchy. Every element serves a purpose; decorative elements are avoided. The Inter typeface provides clean, modern readability at all sizes.

Color application rules:
- Primary (#3B82F6) is used for all interactive elements: buttons, links, active navigation items, form focus rings, and selected tabs.
- Accent (#06B6D4) is reserved for status indicators, notification badges, and micro-interactions such as hover effects on task cards.
- Secondary (#64748B) handles secondary text, placeholder text, and subtle borders.
- In dark mode, Background (#0F172A) covers the viewport, Surface (#1E293B) is used for cards and panels, and Text (#F8FAFC) is used for primary content text.
- In light mode, Background (#F8FAFC) covers the viewport, Surface (#E2E8F0) is used for cards and panels, and Text (#0F172A) is used for primary content text.
- All text must maintain a contrast ratio of at least 4.5:1 against its background per WCAG 2.1 AA.

Core Screens List
1. Login Page: Email/password form with theme toggle, logo, and link to registration.
2. Registration Page: Name, email, password, organization fields with form validation and theme toggle.
3. Dashboard (Authenticated Home): Summary of recent projects, quick-create project button, upcoming deadlines, and overall task completion stats.
4. Project List Page: Grid or list of all projects with search, filter, and sort controls. Each project card shows name, progress bar, deadline, and task count.
5. Project Overview Page: Project details, progress ring, task breakdown by status (mini charts), team member avatars, and activity feed.
6. Task Board Page: Kanban board with columns for To-Do, In Progress, Review, and Done. Drag-and-drop or click-to-move functionality.
7. Task Detail Panel: Slide-out or modal panel with full task information, comment thread, activity log, and action buttons (edit, delete, change status).
8. Team Management Page: Member list with roles, invite button, and workload indicators.
9. Settings Page: Profile information, theme toggle, notification preferences, and organization details.

Responsive Breakpoints
- Mobile (< 640px): Single-column layout. Task board collapses into a scrollable list grouped by status. Navigation becomes a bottom tab bar. All modals fill the viewport.
- Tablet (640px - 1024px): Two-column layout for dashboard. Task board columns are horizontally scrollable. Side navigation converts to a collapsible drawer.
- Desktop (> 1024px): Full multi-column layout. Kanban board renders all columns side by side. Sidebar navigation is persistent.

Accessibility Expectations
- All interactive elements are keyboard-navigable with visible focus indicators using the Primary (#3B82F6) color.
- Form inputs have associated labels and real-time validation messages.
- Color is never the sole indicator of status; icons or text labels accompany all color-coded elements.
- ARIA attributes are applied to dynamic content regions (task board, activity feed, modals).
- Screen reader support is ensured for all state changes (task moved, project created, member invited).
- Reduced motion preferences are respected via the `prefers-reduced-motion` media query.
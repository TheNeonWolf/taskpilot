# TaskPilot

TaskPilot is a responsive project and task management dashboard built as part of the **Innovation Hacks Full Stack Development Internship**.

This repository currently contains the **Task 1 frontend implementation**, focusing on responsive UI design, reusable React components, task/project visualization, filtering, loading states, error handling, and dark mode.

---

## Features

### Dashboard
- Project and task overview
- Dynamic statistics:
  - Total Projects
  - Total Tasks
  - Completed Tasks
  - Tasks In Progress
- Active Projects section
- Recent Tasks section
- Project completion doughnut chart
- Task status bar chart
- Interactive chart hover effects

### Project Management UI
- View all projects
- Project status indicators
- Progress bars
- Project search
- Search result highlighting
- Update button UI
- Delete project confirmation modal
- Empty states

### Task Management UI
- View all tasks
- Search tasks
- Filter by task status
- Filter by priority
- Search result highlighting
- Interactive task status controls
- Interactive priority controls
- Completed task styling
- Delete task confirmation modal
- Empty states

### Responsive Design
TaskPilot is responsive across:

- Desktop
- Tablet
- Mobile

On smaller devices, the navigation automatically changes to a hamburger menu and dashboard layouts adapt to the available screen size.

### Dark Mode
- Light and dark themes
- Theme preference persistence
- Responsive theme toggle
- Dark-mode support across cards, charts, filters, modals, loading states, empty states, and error states

### UI States
TaskPilot includes reusable:

- Loading skeletons
- Empty states
- Error states
- Confirmation modals

---

## Tech Stack

- **Next.js**
- **React**
- **TypeScript**
- **Tailwind CSS**
- **Recharts**
- **Lucide React**
- **next-themes**

---

## Project Structure

```text
src/
├── app/
│   ├── page.tsx
│   ├── loading.tsx
│   ├── error.tsx
│   ├── projects/
│   │   ├── page.tsx
│   │   ├── loading.tsx
│   │   └── error.tsx
│   └── tasks/
│       ├── page.tsx
│       ├── loading.tsx
│       └── error.tsx
│
├── components/
│   ├── Navbar.tsx
│   ├── ThemeToggle.tsx
│   ├── ThemeProvider.tsx
│   ├── StatCard.tsx
│   ├── ProjectCard.tsx
│   ├── TaskCard.tsx
│   ├── ProgressBar.tsx
│   ├── SearchFilter.tsx
│   ├── ConfirmModal.tsx
│   ├── EmptyState.tsx
│   ├── ErrorState.tsx
│   ├── charts/
│   │   ├── TaskStatusChart.tsx
│   │   └── ProjectCompletionChart.tsx
│   └── skeletons/
│       ├── Skeleton.tsx
│       ├── StatCardSkeleton.tsx
│       ├── ProjectCardSkeleton.tsx
│       ├── TaskCardSkeleton.tsx
│       └── ChartSkeleton.tsx
│
├── data/
│   └── mockData.ts
│
└── types/
    └── index.ts

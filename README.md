# TaskPilot

TaskPilot is a responsive full-stack project and task management application built as part of the **Innovation Hacks Full Stack Development Internship**.

The project has progressed through three main stages:

- **Task 1:** Responsive frontend dashboard and reusable UI components
- **Task 2:** REST API development for projects and tasks
- **Task 3:** PostgreSQL database integration using Prisma ORM

TaskPilot now supports persistent project and task management with full CRUD operations, project-task relationships, task prioritization, progress tracking, form validation, responsive design, and dark mode.

---

## Current Features

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
- Live data loaded from the database

---

## Project Management

Users can:

- View all projects
- Create new projects
- Add initial tasks while creating a project
- Update existing projects
- Delete projects
- Search projects
- View project status
- View dynamically calculated project progress
- Store project data persistently in PostgreSQL

### Project Information

Each project contains:

- Name
- Description
- Status
- User association
- Related tasks
- Creation timestamp
- Last updated timestamp

Project descriptions are limited to **200 characters** to maintain consistent card layouts.

---

## Task Management

Users can:

- View all tasks
- Create standalone tasks
- Create tasks linked to projects
- Create tasks while creating a project
- Update existing tasks
- Move tasks between projects
- Remove a task from a project
- Delete tasks
- Search tasks
- Filter tasks by status
- Filter tasks by priority
- Change task status directly from task cards
- Change task priority directly from task cards

### Task Information

Each task contains:

- Title
- Status
- Priority
- Due date
- Optional estimated hours
- Optional project association
- User association
- Creation timestamp
- Last updated timestamp

Task cards display:

- Formatted due date
- Estimated hours, when available
- Associated project name, when available
- Status
- Priority

---

## Project Progress

Project progress is calculated dynamically from the tasks associated with the project.

For example:

```text
Completed Tasks / Total Project Tasks × 100

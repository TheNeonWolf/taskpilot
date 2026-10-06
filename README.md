# TaskPilot

TaskPilot is a responsive full-stack project and task management application built as part of the **Innovation Hacks Full Stack Development Internship**.

It started as a responsive frontend dashboard and evolved into a complete full-stack application with **authentication, persistent PostgreSQL storage, AI-assisted task management, and machine-learning-based task prioritisation**.

---

## ✨ Features

### 📊 Dashboard

The dashboard provides an overview of the user's projects and tasks with live data from the database.

* Total Projects
* Total Tasks
* Completed Tasks
* Tasks In Progress
* Active Projects
* Recent Tasks
* Project completion doughnut chart
* Task status bar chart
* Interactive chart hover effects
* Dynamically calculated project progress
* Responsive dashboard layout
* Loading and error states

---

### 📁 Project Management

Users can fully manage their projects through CRUD operations.

* View all projects
* Create projects
* Edit projects
* Delete projects
* Search projects
* Set project status
* Add tasks while creating a project
* View dynamically calculated project progress
* View associated tasks
* Generate AI project summaries
* Persistent storage using PostgreSQL

#### Project Information

Each project contains:

* Name
* Description
* Status
* Associated user
* Related tasks
* Creation timestamp
* Last updated timestamp

Project descriptions are limited to **200 characters** to maintain consistent layouts.

#### Project Progress

Project progress is calculated from the tasks associated with the project:

```text
Completed Tasks
─────────────── × 100
Total Tasks
```

For example, if a project has 4 tasks and 3 are completed:

```text
3 / 4 × 100 = 75%
```

Project status is also synchronised with task completion.

---

### ✅ Task Management

Users can manage tasks independently or associate them with projects.

* View all tasks
* Create standalone tasks
* Create project-linked tasks
* Create tasks while creating a project
* Edit tasks
* Delete tasks
* Move tasks between projects
* Remove tasks from projects
* Search tasks
* Filter by status
* Filter by priority
* Change task status directly from task cards
* Change task priority directly from task cards

#### Task Information

Each task contains:

* Title
* Status
* Priority
* Due date
* Estimated hours
* Optional project association
* Associated user
* Creation timestamp
* Last updated timestamp

Supported task statuses:

```text
TODO
IN_PROGRESS
DONE
```

Supported priorities:

```text
LOW
MEDIUM
HIGH
```

---

## 🔐 Authentication

TaskPilot includes user authentication so each user's projects and tasks remain isolated.

### Registration

Users can create an account using:

* Name
* Username
* Email
* Password

Registration includes validation for:

* Name length
* Username length
* Username characters
* Email format
* Password length
* Duplicate email addresses
* Duplicate usernames

Passwords are securely hashed using **bcrypt** before being stored.

### Login

Users can log in using their email and password.

Successful authentication creates a **JWT authentication token** stored in an HTTP-only cookie.

### Protected Routes

Authenticated users can access:

* Dashboard
* Projects
* Tasks
* Profile

Unauthenticated users are redirected to the login page.

Each API request also verifies the authenticated user before accessing project or task data.

---

## 🤖 AI Features

TaskPilot integrates Google's Gemini API to provide AI-assisted project management.

### AI Task Generation

Users can describe a task using natural language and TaskPilot generates structured task information.

For example:

```text
Finish my CS2030S assignment by Friday, around 4 hours
```

The AI can generate:

* Task title
* Priority
* Due date
* Estimated hours

The generated information is automatically inserted into the task form.

---

### AI Project Generation

Users can describe a project in natural language and TaskPilot can generate:

* Project name
* Project description
* Initial tasks
* Task priorities
* Task due dates
* Estimated hours

This allows users to quickly turn a high-level idea into a structured project.

---

### AI Project Summaries

Projects include an AI summary feature.

TaskPilot sends the project's current information to Gemini, including:

* Project name
* Description
* Project status
* Completion percentage
* Task counts
* Task statuses
* Task titles

Gemini then generates a concise **2–3 sentence project status summary**.

Users can regenerate the summary whenever they want.

---

## 🧠 Machine Learning Priority Prediction

TaskPilot also includes a separate Python machine-learning service for automatic task priority prediction.

The ML model predicts one of:

```text
LOW
MEDIUM
HIGH
```

### Prediction Features

The model uses:

* Days until due date
* Estimated hours
* Number of active tasks

These features are sent to the Python ML service whenever priority prediction is requested.

### Model

The project uses a **Decision Tree Classifier** implemented with `scikit-learn`.

The model is trained using:

```text
daysUntilDue
estimatedHours
activeTaskCount
```

and predicts:

```text
priority
```

The trained model is stored as:

```text
ml/priority_model.pkl
```

---

### 🔄 ML Feedback and Retraining

TaskPilot also supports a feedback loop.

When the user provides the actual priority of a task, the feedback can be sent to the ML service.

The service:

1. Adds the new training example to `data.csv`
2. Reloads the dataset
3. Retrains the Decision Tree model
4. Saves the updated model
5. Uses the updated model for future predictions

This allows the model to incorporate additional training data over time.

---

### ⚡ Batch Priority Prediction

TaskPilot supports predicting priorities for multiple tasks at once.

This is useful when creating projects containing several initial tasks, allowing priorities to be suggested automatically across the task list.

---

## 🗄️ Database

TaskPilot uses **PostgreSQL** for persistent data storage and **Prisma ORM** for database access.

### Database Models

The Prisma schema contains four main entities:

```text
User
 │
 ├── Projects
 │      └── Tasks
 │
 └── Tasks

Task
 │
 └── PriorityPrediction
```

### User

Stores:

* ID
* Name
* Username
* Email
* Password hash
* Creation timestamp
* Updated timestamp

### Project

Stores:

* ID
* Name
* Description
* Status
* User ID
* Creation timestamp
* Updated timestamp

### Task

Stores:

* ID
* Title
* Status
* Priority
* Due date
* Estimated hours
* User ID
* Optional project ID
* Creation timestamp
* Updated timestamp

### Priority Prediction

Stores ML prediction information including:

* Predicted priority
* Final priority
* Estimated hours
* Days until due
* Active task count
* Overridden status
* Creation timestamp

---

## 🛡️ Validation

TaskPilot uses **Zod** for server-side input validation.

Validation is applied to:

* Registration
* Login
* Projects
* Tasks
* AI generation requests
* AI-generated task data
* AI-generated project data

Examples of validation include:

* Required fields
* Valid email addresses
* Password length
* Username format
* Valid task statuses
* Valid priorities
* Valid dates
* Positive estimated hours
* Project description length
* Valid project IDs

---

## 🎨 UI & UX

TaskPilot is designed to be responsive and user-friendly across different screen sizes.

### UI Features

* Responsive layouts
* Dark mode
* Interactive cards
* Search and filtering
* Modal forms
* Confirmation dialogs
* Loading states
* Skeleton components
* Error states
* Empty states
* Responsive charts
* Hover interactions
* Password visibility toggles

The application uses reusable React components to keep the UI modular and maintainable.

---

## 🏗️ Tech Stack

### Frontend

* **Next.js 16**
* **React 19**
* **TypeScript**
* **Tailwind CSS**
* **Lucide React**
* **Recharts**
* **next-themes**

### Backend

* **Next.js API Routes**
* **Prisma ORM**
* **PostgreSQL**
* **Zod**

### Authentication

* **JWT**
* **jose**
* **bcryptjs**
* HTTP-only cookies

### AI

* **Google Gemini API**
* `@google/genai`

### Machine Learning

* **Python**
* **FastAPI**
* **scikit-learn**
* **pandas**
* **joblib**

---

## 📂 Project Structure

```text
TaskPilot/
│
├── ml/
│   ├── data.csv
│   ├── main.py
│   ├── priority_model.pkl
│   ├── requirements.txt
│   └── train.py
│
├── prisma/
│   ├── migrations/
│   └── schema.prisma
│
├── public/
│   └── application assets
│
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── ai/
│   │   │   ├── auth/
│   │   │   ├── ml/
│   │   │   ├── projects/
│   │   │   └── tasks/
│   │   │
│   │   ├── login/
│   │   ├── register/
│   │   ├── projects/
│   │   ├── tasks/
│   │   └── me/
│   │
│   ├── components/
│   │   ├── charts/
│   │   ├── skeletons/
│   │   └── reusable UI components
│   │
│   ├── lib/
│   │   ├── auth.ts
│   │   ├── auth-server.ts
│   │   ├── prisma.ts
│   │   ├── project-status.ts
│   │   └── validations.ts
│   │
│   ├── types/
│   └── proxy.ts
│
├── .env.example
├── next.config.ts
├── package.json
├── prisma7.config.ts
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

* Node.js
* npm
* PostgreSQL
* Python 3.11+
* Git

---

### 1. Clone the Repository

```bash
git clone https://github.com/TheNeonWolf/taskpilot.git
cd taskpilot
```

---

### 2. Install Dependencies

Install the Next.js dependencies:

```bash
npm install
```

Install the Python ML dependencies:

```bash
pip install -r ml/requirements.txt
```

---

### 3. Configure Environment Variables

Create a `.env` file based on `.env.example`.

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
JWT_SECRET="YOUR_SECRET_HERE"
GEMINI_API_KEY="YOUR_GEMINI_API_KEY_HERE"
```

If the ML service is hosted separately, configure:

```env
ML_SERVICE_URL="YOUR_ML_SERVICE_URL"
```

For local development, the application falls back to:

```text
http://127.0.0.1:8000
```

---

### 4. Set Up the Database

Run the Prisma migrations:

```bash
npx prisma migrate dev
```

Generate the Prisma client:

```bash
npx prisma generate
```

---

### 5. Start the ML Service

From the project root:

```bash
cd ml
uvicorn main:app --reload --port 8000
```

The ML service will be available at:

```text
http://127.0.0.1:8000
```

You can check that it is running by visiting:

```text
http://127.0.0.1:8000/
```

---

### 6. Start the Next.js Application

Open another terminal and run:

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

---

## 🧪 Machine Learning Model Training

The initial model can be trained using:

```bash
cd ml
python train.py
```

This trains a Decision Tree classifier using the dataset in:

```text
ml/data.csv
```

and saves the resulting model to:

```text
ml/priority_model.pkl
```

---

## 🔌 API Overview

TaskPilot exposes API routes for authentication, projects, tasks, AI functionality, and ML predictions.

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

### Projects

```text
GET    /api/projects
POST   /api/projects
GET    /api/projects/:id
PATCH  /api/projects/:id
DELETE /api/projects/:id
GET    /api/projects/:id/tasks
GET    /api/projects/:id/summary
```

### Tasks

```text
GET    /api/tasks
POST   /api/tasks
GET    /api/tasks/:id
PATCH  /api/tasks/:id
DELETE /api/tasks/:id
```

### AI

```text
POST /api/ai/generate
```

Supports:

```text
task
project
```

### Machine Learning

```text
POST /api/ml/predict
POST /api/ml/predict-batch
POST /api/ml/feedback
```

---

## 🔄 Application Architecture

The application follows a full-stack architecture:

```text
                 ┌─────────────────────┐
                 │      Next.js UI     │
                 │ React + TypeScript  │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │   Next.js API       │
                 │    Routes           │
                 └──────┬───────┬──────┘
                        │       │
              ┌─────────┘       └──────────┐
              ▼                            ▼
    ┌─────────────────┐          ┌─────────────────┐
    │ PostgreSQL +    │          │ AI / ML Services│
    │ Prisma          │          │                 │
    └─────────────────┘          └───────┬─────────┘
                                         │
                              ┌──────────┴──────────┐
                              ▼                     ▼
                       Google Gemini         Python FastAPI
                                                  │
                                                  ▼
                                         Decision Tree Model
```

---

## 🎯 Internship Development Stages

TaskPilot was developed progressively throughout the **Innovation Hacks Full Stack Development Internship**.

### Task 1 — Frontend Development

* Responsive dashboard
* Reusable React components
* Project and task interfaces
* Responsive styling
* Dark mode
* Interactive UI

### Task 2 — REST API Development

* Project CRUD APIs
* Task CRUD APIs
* API validation
* Project-task relationships
* Dynamic project progress

### Task 3 — Database Integration

* PostgreSQL integration
* Prisma ORM
* Persistent project and task storage
* Database relationships
* Prisma migrations

### Task 4 — Authentication

* User registration
* User login
* Password hashing
* JWT authentication
* HTTP-only authentication cookies
* Protected pages and API routes
* Per-user data isolation

### AI & Machine Learning

* Gemini-powered task generation
* Gemini-powered project generation
* AI project summaries
* ML task priority prediction
* Batch priority prediction
* ML feedback collection
* Automatic model retraining

---

## 📌 Future Improvements

Potential future improvements include:

* Automated testing
* More advanced ML models
* Larger training datasets
* Improved ML evaluation using separate validation/test data
* Real-time notifications
* Task reminders
* Calendar integration
* Team collaboration
* Role-based permissions
* Deployment automation
* More detailed analytics

---

## 👨‍💻 Author

**TheNeonWolf**

Built as part of the **Innovation Hacks Full Stack Development Internship**.

---

## 📄 License

This project was created for educational and internship purposes.

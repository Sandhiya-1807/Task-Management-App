# Task Management Application

A full-stack, submission-ready Task Management Web Application built with **React**, **TypeScript**, **Tailwind CSS**, and **Firebase** (Firebase Authentication & Cloud Firestore). Designed for assignment demonstration and production evaluation, featuring real-time synchronization, user authorization, complete CRUD operations, task tracking, overdue detection, dynamic search, filtering, and sorting.

---

## Table of Contents
1. [Project Description](#project-description)
2. [Key Features](#key-features)
3. [Technologies Used](#technologies-used)
4. [Folder Structure](#folder-structure)
5. [Firebase Setup Guide](#firebase-setup-guide)
6. [Environment Variables Setup](#environment-variables-setup)
7. [How to Install and Run Locally](#how-to-install-and-run-locally)
8. [Build and Deployment Instructions](#build-and-deployment-instructions)
9. [Firestore Security Rules](#firestore-security-rules)
10. [Testing and Demonstration Checklist](#testing-and-demonstration-checklist)
11. [Future Improvements](#future-improvements)

---

## 1. Project Description

The **Task Management Application** provides an end-to-end task tracking platform where authenticated users can create, read, update, organize, and delete tasks in real-time. Built with a strict zero-trust security model, every task belongs to the authenticated user's unique identifier (`UID`), ensuring complete data isolation and privacy across multiple accounts.

---

## 2. Key Features

- **User Authentication & Authorization**:
  - Secure registration with validation (Full Name, Email format, Password min 6 chars, Password confirmation match).
  - Secure login with Firebase Auth credential validation and friendly error messages.
  - State persistence across browser sessions and tabs.
  - Protected routing: Unauthorized visitors are immediately blocked from the dashboard and routed to sign in.
  - Dynamic user profile header with user email, name, and logout action.

- **Complete Task CRUD Operations**:
  - **Create**: Add tasks with Title (min 3 chars), Description (optional), Priority (Low, Medium, High), Status (To Do, In Progress, Completed), and Due Date.
  - **Read**: Live display of all tasks belonging exclusively to the logged-in user.
  - **Update**: Edit title, description, priority, status, or due date via a prefilled modal.
  - **Delete**: Safe deletion with a confirmation modal preventing accidental deletions.
  - **Quick Status Toggle**: Single-click status cycle (`To Do` → `In Progress` → `Completed`) directly from task cards or table rows.

- **Real-Time Synchronization**:
  - Powered by Firestore `onSnapshot` real-time listeners.
  - Instant dashboard and statistics updates across devices without manual page reloads.

- **Dynamic Dashboard & Analytics**:
  - Summary cards updating in real-time: **Total Tasks**, **Pending (To Do)**, **In Progress**, **Completed**, and **Overdue**.
  - Overall completion rate progress bar.
  - Interactive summary cards: click any status card to quickly filter tasks.

- **Search, Filters, and Sorting**:
  - **Search**: Dynamic instant search across both task titles and descriptions.
  - **Status Filter**: All, To Do, In Progress, Completed.
  - **Priority Filter**: All, High, Medium, Low.
  - **Sorting**: By Due Date, Priority, Creation Date, or Title with Ascending/Descending toggles.
  - **Reset Filters**: One-click restore to clear search and active filters.

- **Overdue Task Detection**:
  - Automatically identifies non-completed tasks whose due date has passed.
  - Visually alerts users with an animated high-contrast "Overdue" indicator. Completed tasks are never flagged as overdue.

- **View Customization**:
  - Toggle between **Cards Grid View** and **Table View** to accommodate desktop and mobile workflows.

- **Demo Data Loader**:
  - One-click "Load Demo Tasks" button allowing students and evaluators to seed realistic sample tasks instantly for demonstration.

- **Responsive & Accessible UI**:
  - Optimized for mobile, tablet, laptop, and large desktop screens without horizontal overflow.
  - Form validation with accessible labels, keyboard navigation (Escape to close modals), and high color contrast.

---

## 3. Technologies Used

- **Frontend**:
  - React 19
  - TypeScript (Strict type checking)
  - Tailwind CSS v4 (Modern utility-first styling)
  - Lucide React (Accessible iconography)
- **Backend & Database**:
  - Firebase Authentication (Email/Password provider)
  - Cloud Firestore (NoSQL real-time document database)
- **Build Tooling**:
  - Vite 8
  - ESLint / TypeScript Compiler (`tsc`)

---

## 4. Folder Structure

```
├── .env.example                     # Environment variables documentation
├── firestore.rules                  # Firestore security rules enforcing user data isolation
├── firebase-blueprint.json          # Abstract schema specification for database
├── index.html                       # HTML5 entry point with synchronized metadata
├── metadata.json                    # Platform configuration & capability descriptors
├── package.json                     # Dependencies and npm scripts
├── tsconfig.json                    # TypeScript compiler options
├── vite.config.ts                   # Vite bundler configuration
└── src/
    ├── main.tsx                     # React root initialization
    ├── App.tsx                      # Root component with protected route view switcher
    ├── index.css                    # Tailwind CSS directives
    ├── types/
    │   └── index.ts                 # TypeScript interfaces (Task, User, Filters, Stats)
    ├── firebase/
    │   └── config.ts                # Firebase app, auth, and firestore initialization
    ├── context/
    │   └── AuthContext.tsx          # Authentication context, session listener, login/register/logout
    ├── services/
    │   └── taskService.ts           # Firestore CRUD operations & real-time onSnapshot listener
    ├── utils/
    │   └── dateUtils.ts             # Date formatting, today's date generator, overdue evaluator
    ├── components/
    │   ├── Navbar.tsx               # Top header with user email, Add Task, and Logout buttons
    │   ├── StatsCards.tsx           # Dynamic metric cards & completion progress bar
    │   ├── TaskFilters.tsx          # Search bar, priority/status filter pills, sorting controls
    │   ├── TaskCard.tsx             # Interactive task card with badges and quick actions
    │   ├── TaskTable.tsx            # Alternative structured table view
    │   ├── TaskModal.tsx            # Accessible modal for creating and editing tasks
    │   ├── DeleteConfirmModal.tsx   # Confirmation dialog before task deletion
    │   └── EmptyState.tsx           # Empty state with call-to-action buttons
    └── pages/
        ├── LoginPage.tsx            # Sign in form with input validation and error feedback
        ├── RegisterPage.tsx         # Account registration form with password confirmation
        └── DashboardPage.tsx        # Main application dashboard coordinating real-time state
```

---

## 5. Firebase Setup Guide

To connect this application to your own Firebase project:

1. Visit the [Firebase Console](https://console.firebase.google.com/) and click **Add Project**.
2. Name your project (e.g., `task-manager-assignment`).
3. Under **Build > Authentication**:
   - Click **Get Started**.
   - Enable the **Email/Password** sign-in method.
4. Under **Build > Firestore Database**:
   - Click **Create Database**.
   - Select a region closest to you and choose **Start in production mode**.
5. Under **Project Settings > General > Your Apps**:
   - Register a **Web App** (e.g., `Task Manager Web`).
   - Copy the `firebaseConfig` credentials object.

---

## 6. Environment Variables Setup

Create a `.env` file in the root directory by copying `.env.example`:

```bash
cp .env.example .env
```

Populate the `.env` file with your Firebase web configuration values:

```env
VITE_FIREBASE_API_KEY="AIzaSyYourApiKeyHere"
VITE_FIREBASE_AUTH_DOMAIN="your-project-id.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your-project-id"
VITE_FIREBASE_FIRESTORE_DATABASE_ID="(default)"
VITE_FIREBASE_STORAGE_BUCKET="your-project-id.firebasestorage.app"
VITE_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
VITE_FIREBASE_APP_ID="1:your-app-id:web:abcdef123456"
```

> **Note**: In AI Studio, the application automatically reads runtime credentials from `firebase-applet-config.json` seamlessly without requiring manual configuration.

---

## 7. How to Install and Run Locally

### Prerequisites
- Node.js (v18 or higher)
- npm or bun

### Step 1: Clone the repository
```bash
git clone <repository-url>
cd task-management-application
```

### Step 2: Install dependencies
```bash
npm install
```

### Step 3: Start development server
```bash
npm run dev
```

The application will start at `http://localhost:3000` (or `http://localhost:5173` depending on environment).

### Step 4: Run type checking and linting
```bash
npm run lint
```

---

## 8. Build and Deployment Instructions

### Building for Production
```bash
npm run build
```
This generates optimized static assets inside the `dist/` directory.

### Deploying to Vercel
1. Push your repository to GitHub.
2. Go to [Vercel](https://vercel.com/) and click **Add New > Project**.
3. Import your GitHub repository.
4. In **Environment Variables**, add the `VITE_FIREBASE_*` variables from your `.env` file.
5. Click **Deploy**.

### Deploying to Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
# Select 'dist' as the public directory and configure as a single-page app (Yes).
npm run build
firebase deploy --only hosting
```

---

## 9. Firestore Security Rules

The application uses strict attribute-based security rules located in `firestore.rules`. User data isolation is enforced at the database level:

```rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function isSignedIn() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }

    function isValidId(id) {
      return id is string && id.size() > 0 && id.size() <= 128;
    }

    function incoming() {
      return request.resource.data;
    }

    function existing() {
      return resource.data;
    }

    function isValidTask(data) {
      return data.keys().hasAll(['userId', 'title', 'priority', 'status', 'dueDate', 'createdAt', 'updatedAt']) &&
        data.keys().hasOnly(['userId', 'title', 'description', 'priority', 'status', 'dueDate', 'createdAt', 'updatedAt']) &&
        data.userId is string && data.userId == request.auth.uid &&
        data.title is string && data.title.size() >= 3 && data.title.size() <= 150 &&
        (!('description' in data) || (data.description is string && data.description.size() <= 2000)) &&
        data.priority in ['Low', 'Medium', 'High'] &&
        data.status in ['To Do', 'In Progress', 'Completed'] &&
        data.dueDate is string && data.dueDate.size() >= 8 && data.dueDate.size() <= 30;
    }

    // Default deny
    match /{document=**} {
      allow read, write: if false;
    }

    // Tasks collection
    match /tasks/{taskId} {
      allow get: if isSignedIn() && existing().userId == request.auth.uid;
      allow list: if isSignedIn() && resource.data.userId == request.auth.uid;

      allow create: if isSignedIn() &&
        isValidId(taskId) &&
        isValidTask(incoming()) &&
        incoming().userId == request.auth.uid;

      allow update: if isSignedIn() &&
        isValidId(taskId) &&
        existing().userId == request.auth.uid &&
        isValidTask(incoming()) &&
        incoming().userId == existing().userId &&
        incoming().createdAt == existing().createdAt;

      allow delete: if isSignedIn() &&
        isValidId(taskId) &&
        existing().userId == request.auth.uid;
    }
  }
}
```

---

## 10. Testing and Demonstration Checklist

| Test Case | Procedure | Expected Result | Status |
|---|---|---|---|
| **Registration** | Fill in Name, Email, Password, Confirm Password | Account created, immediately logs in to dashboard | Pass |
| **Protected Route** | Access dashboard in private/incognito tab | Redirects immediately to Login view | Pass |
| **Login Validation** | Enter invalid email or incorrect password | Clear user-friendly error message displayed | Pass |
| **Create Task** | Click "Add Task", input title, priority, due date, submit | Modal closes, task appears instantly without refresh | Pass |
| **Real-time Sync** | Open app in two separate browser tabs | Changes in Tab A reflect immediately in Tab B | Pass |
| **Quick Status Cycle** | Click "Mark In Progress" or "Mark Completed" | Status updates with loading spinner, stats re-calculate | Pass |
| **Edit Task** | Click Edit on a task, modify fields and save | Form prefilled with original values, changes update live | Pass |
| **Delete Confirmation** | Click Delete icon, review modal, click "Delete Task" | Confirmation dialog shown, task removed from list | Pass |
| **Search Function** | Type keyword into search input | Filtered results match title/description while typing | Pass |
| **Filters** | Select "In Progress" or "High Priority" | Only matching tasks displayed; counter updates | Pass |
| **Sorting** | Sort by Due Date or Priority (Asc / Desc) | Order updates instantly | Pass |
| **Overdue Detection** | Set task due date to yesterday with status "To Do" | "Overdue" warning badge displayed automatically | Pass |
| **Multi-User Isolation** | Sign in as User A, create task; sign in as User B | User B cannot view, query, or edit User A's tasks | Pass |
| **Responsive Design** | Inspect on Mobile (375px) and Tablet (768px) | Navigation, cards, and modal adapt without overflow | Pass |

---

## 11. Future Improvements

- Task categorization tags or color-coded project labels.
- Email or browser push notifications for upcoming task deadlines.
- Dark mode toggle with persistent user preference.
- Export task summaries to CSV or PDF format for progress reports.

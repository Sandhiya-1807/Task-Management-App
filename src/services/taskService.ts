import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { Task, TaskFormData, TaskPriority, TaskStatus } from '../types';
import { DEMO_AUTH_MODE } from '../types/auth';
import {
  getDemoUserTasks,
  createDemoTask,
  updateDemoTask,
  updateDemoTaskStatus,
  deleteDemoTask,
  seedDemoUserTasks,
} from './demoTaskStorage';

const TASKS_COLLECTION = 'tasks';

/**
 * Subscribes to updates for all tasks belonging to the current user.
 * In DEMO_AUTH_MODE: uses local storage events for live synchronization.
 * In Firebase mode: uses Firestore onSnapshot listener.
 */
export function subscribeToUserTasks(
  userId: string,
  onTasksUpdate: (tasks: Task[]) => void,
  onError: (error: Error) => void
): Unsubscribe {
  if (!userId) {
    onTasksUpdate([]);
    return () => {};
  }

  if (DEMO_AUTH_MODE) {
    // Deliver initial tasks immediately
    const initialTasks = getDemoUserTasks(userId);
    onTasksUpdate(initialTasks);

    const handleStorageChange = (e: StorageEvent | CustomEvent) => {
      try {
        const updatedTasks = getDemoUserTasks(userId);
        onTasksUpdate(updatedTasks);
      } catch (err) {
        onError(err instanceof Error ? err : new Error(String(err)));
      }
    };

    window.addEventListener('storage', handleStorageChange as EventListener);
    window.addEventListener('demo_tasks_changed', handleStorageChange as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange as EventListener);
      window.removeEventListener('demo_tasks_changed', handleStorageChange as EventListener);
    };
  }

  // Live Firestore listener
  const tasksQuery = query(
    collection(db, TASKS_COLLECTION),
    where('userId', '==', userId)
  );

  return onSnapshot(
    tasksQuery,
    (snapshot) => {
      const tasks: Task[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          userId: data.userId,
          title: data.title || '',
          description: data.description || '',
          priority: (data.priority as TaskPriority) || 'Medium',
          status: (data.status as TaskStatus) || 'To Do',
          dueDate: data.dueDate || '',
          createdAt: data.createdAt || new Date().toISOString(),
          updatedAt: data.updatedAt || new Date().toISOString(),
        };
      });
      onTasksUpdate(tasks);
    },
    (err) => {
      console.error('Firestore onSnapshot error:', err);
      onError(err);
    }
  );
}

/**
 * Creates a new task for the authenticated user.
 */
export async function createTask(
  userId: string,
  formData: TaskFormData
): Promise<string> {
  if (!userId) {
    throw new Error('User must be authenticated to create a task.');
  }

  if (DEMO_AUTH_MODE) {
    return createDemoTask(userId, formData);
  }

  const now = new Date().toISOString();
  const taskPayload = {
    userId,
    title: formData.title.trim(),
    description: formData.description ? formData.description.trim() : '',
    priority: formData.priority,
    status: formData.status,
    dueDate: formData.dueDate,
    createdAt: now,
    updatedAt: now,
  };

  const docRef = await addDoc(collection(db, TASKS_COLLECTION), taskPayload);
  return docRef.id;
}

/**
 * Updates an existing task. Preserves original createdAt and userId.
 */
export async function updateTask(
  taskId: string,
  currentTask: Task,
  formData: TaskFormData
): Promise<void> {
  if (DEMO_AUTH_MODE) {
    updateDemoTask(currentTask.userId, taskId, currentTask, formData);
    return;
  }

  const taskRef = doc(db, TASKS_COLLECTION, taskId);
  const now = new Date().toISOString();

  const updatedPayload = {
    userId: currentTask.userId,
    title: formData.title.trim(),
    description: formData.description ? formData.description.trim() : '',
    priority: formData.priority,
    status: formData.status,
    dueDate: formData.dueDate,
    createdAt: currentTask.createdAt,
    updatedAt: now,
  };

  await updateDoc(taskRef, updatedPayload);
}

/**
 * Updates just the status of a task (e.g. quick toggle: To Do -> In Progress -> Completed)
 */
export async function updateTaskStatus(
  currentTask: Task,
  newStatus: TaskStatus
): Promise<void> {
  if (DEMO_AUTH_MODE) {
    updateDemoTaskStatus(currentTask.userId, currentTask, newStatus);
    return;
  }

  const taskRef = doc(db, TASKS_COLLECTION, currentTask.id);
  const now = new Date().toISOString();

  await updateDoc(taskRef, {
    userId: currentTask.userId,
    title: currentTask.title,
    description: currentTask.description || '',
    priority: currentTask.priority,
    status: newStatus,
    dueDate: currentTask.dueDate,
    createdAt: currentTask.createdAt,
    updatedAt: now,
  });
}

/**
 * Deletes a task by ID.
 */
export async function deleteTask(taskId: string, userId?: string): Promise<void> {
  if (DEMO_AUTH_MODE) {
    if (userId) {
      deleteDemoTask(userId, taskId);
    } else {
      // Fallback: search demo storages
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('task_app_demo_tasks_')) {
          const ownerId = key.replace('task_app_demo_tasks_', '');
          deleteDemoTask(ownerId, taskId);
        }
      }
    }
    return;
  }

  const taskRef = doc(db, TASKS_COLLECTION, taskId);
  await deleteDoc(taskRef);
}

/**
 * Seeds demo tasks for a new user if requested for student demonstration.
 */
export async function loadDemoTasks(userId: string): Promise<void> {
  if (DEMO_AUTH_MODE) {
    seedDemoUserTasks(userId);
    return;
  }

  const today = new Date();
  const getOffsetDate = (days: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  };

  const demoTasks: TaskFormData[] = [
    {
      title: 'Complete Web Development Project Submission',
      description: 'Review code structure, test real-time Firestore synchronization, and package documentation for submission.',
      priority: 'High',
      status: 'In Progress',
      dueDate: getOffsetDate(1),
    },
    {
      title: 'Prepare Presentation Slides for Evaluation',
      description: 'Highlight Firebase Authentication, CRUD architecture, security rules, and responsive design.',
      priority: 'High',
      status: 'To Do',
      dueDate: getOffsetDate(3),
    },
    {
      title: 'Review Firestore Security Rules & Access Control',
      description: 'Ensure user-level document isolation and prevent unauthorized read/write access.',
      priority: 'Medium',
      status: 'Completed',
      dueDate: getOffsetDate(-2), // Past date to test Completed behavior (not marked overdue)
    },
    {
      title: 'Submit College Assignment Report',
      description: 'Upload system architecture diagram and screenshots of mobile and desktop dashboard layouts.',
      priority: 'Low',
      status: 'To Do',
      dueDate: getOffsetDate(-1), // Past date and To Do: will test Overdue detection!
    },
  ];

  for (const task of demoTasks) {
    await createTask(userId, task);
  }
}


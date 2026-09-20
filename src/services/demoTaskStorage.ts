import { Task, TaskFormData, TaskPriority, TaskStatus } from '../types';

const DEMO_TASKS_KEY_PREFIX = 'task_app_demo_tasks_';

export function getDemoUserTasks(userId: string): Task[] {
  try {
    const raw = localStorage.getItem(`${DEMO_TASKS_KEY_PREFIX}${userId}`);
    if (!raw) return [];
    return JSON.parse(raw) as Task[];
  } catch (e) {
    console.error('Error reading demo tasks:', e);
    return [];
  }
}

export function saveDemoUserTasks(userId: string, tasks: Task[]): void {
  try {
    localStorage.setItem(`${DEMO_TASKS_KEY_PREFIX}${userId}`, JSON.stringify(tasks));
    window.dispatchEvent(new CustomEvent('demo_tasks_changed', { detail: { userId } }));
  } catch (e) {
    console.error('Error saving demo tasks:', e);
  }
}

export function createDemoTask(userId: string, formData: TaskFormData): string {
  const currentTasks = getDemoUserTasks(userId);
  const now = new Date().toISOString();
  const newTaskId = `demo_task_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const newTask: Task = {
    id: newTaskId,
    userId,
    title: formData.title.trim(),
    description: formData.description ? formData.description.trim() : '',
    priority: formData.priority,
    status: formData.status,
    dueDate: formData.dueDate,
    createdAt: now,
    updatedAt: now,
  };
  saveDemoUserTasks(userId, [newTask, ...currentTasks]);
  return newTaskId;
}

export function updateDemoTask(
  userId: string,
  taskId: string,
  currentTask: Task,
  formData: TaskFormData
): void {
  const currentTasks = getDemoUserTasks(userId);
  const now = new Date().toISOString();
  const updated = currentTasks.map((t) => {
    if (t.id === taskId) {
      return {
        ...t,
        title: formData.title.trim(),
        description: formData.description ? formData.description.trim() : '',
        priority: formData.priority,
        status: formData.status,
        dueDate: formData.dueDate,
        updatedAt: now,
      };
    }
    return t;
  });
  saveDemoUserTasks(userId, updated);
}

export function updateDemoTaskStatus(
  userId: string,
  currentTask: Task,
  newStatus: TaskStatus
): void {
  const currentTasks = getDemoUserTasks(userId);
  const now = new Date().toISOString();
  const updated = currentTasks.map((t) => {
    if (t.id === currentTask.id) {
      return {
        ...t,
        status: newStatus,
        updatedAt: now,
      };
    }
    return t;
  });
  saveDemoUserTasks(userId, updated);
}

export function deleteDemoTask(userId: string, taskId: string): void {
  const currentTasks = getDemoUserTasks(userId);
  const filtered = currentTasks.filter((t) => t.id !== taskId);
  saveDemoUserTasks(userId, filtered);
}

export function seedDemoUserTasks(userId: string): void {
  const today = new Date();
  const getOffsetDate = (days: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  };

  const sampleTasks: TaskFormData[] = [
    {
      title: 'Complete Web Development Project Submission',
      description: 'Review code structure, test real-time task synchronization, and package documentation.',
      priority: 'High',
      status: 'In Progress',
      dueDate: getOffsetDate(1),
    },
    {
      title: 'Prepare Presentation Slides for Evaluation',
      description: 'Highlight Authentication architecture, CRUD operations, state security, and responsive UI.',
      priority: 'High',
      status: 'To Do',
      dueDate: getOffsetDate(3),
    },
    {
      title: 'Review Security Rules & Access Control',
      description: 'Ensure user-level task isolation and prevent unauthorized read/write access.',
      priority: 'Medium',
      status: 'Completed',
      dueDate: getOffsetDate(-2),
    },
    {
      title: 'Submit College Assignment Report',
      description: 'Upload system architecture diagram and screenshots of mobile and desktop dashboard layouts.',
      priority: 'Low',
      status: 'To Do',
      dueDate: getOffsetDate(-1),
    },
  ];

  const now = new Date().toISOString();
  const newTasks: Task[] = sampleTasks.map((task, idx) => ({
    id: `demo_seed_${Date.now()}_${idx}`,
    userId,
    title: task.title,
    description: task.description,
    priority: task.priority,
    status: task.status,
    dueDate: task.dueDate,
    createdAt: now,
    updatedAt: now,
  }));

  const existing = getDemoUserTasks(userId);
  saveDemoUserTasks(userId, [...newTasks, ...existing]);
}

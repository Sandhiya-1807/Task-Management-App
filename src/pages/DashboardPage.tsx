import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Task,
  TaskFormData,
  TaskStatus,
  TaskPriority,
  FilterState,
  TaskStats,
} from '../types';
import {
  subscribeToUserTasks,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
  loadDemoTasks,
} from '../services/taskService';
import { isTaskOverdue } from '../utils/dateUtils';
import { Navbar } from '../components/Navbar';
import { StatsCards } from '../components/StatsCards';
import { TaskFilters } from '../components/TaskFilters';
import { TaskCard } from '../components/TaskCard';
import { TaskTable } from '../components/TaskTable';
import { TaskModal } from '../components/TaskModal';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import { EmptyState } from '../components/EmptyState';
import {
  LayoutGrid,
  Table as TableIcon,
  AlertCircle,
  Loader2,
  CheckCircle2,
  X,
  RefreshCw,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { currentUser } = useAuth();

  // Tasks state populated by Firestore real-time listener
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState<boolean>(true);
  const [tasksError, setTasksError] = useState<string | null>(null);

  // Filters & Sorting state
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: 'All',
    priority: 'All',
    sortBy: 'dueDate',
    sortDirection: 'asc',
  });

  // UI View preference: 'cards' | 'table'
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Modals state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Demo tasks loader state
  const [isLoadingDemo, setIsLoadingDemo] = useState<boolean>(false);

  // Quick status update spinner state (stores task ID being updated)
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);

  // Feedback Notification Banner / Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // 1. Setup Firestore Real-Time Listener
  useEffect(() => {
    if (!currentUser?.uid) {
      setTasks([]);
      setIsLoadingTasks(false);
      return;
    }

    setIsLoadingTasks(true);
    setTasksError(null);

    const unsubscribe = subscribeToUserTasks(
      currentUser.uid,
      (fetchedTasks) => {
        setTasks(fetchedTasks);
        setIsLoadingTasks(false);
      },
      (err) => {
        setTasksError('Failed to synchronize tasks in real-time. Please check your network.');
        setIsLoadingTasks(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser?.uid]);

  // 2. Dynamic Statistics Calculation
  const stats: TaskStats = useMemo(() => {
    const total = tasks.length;
    let todo = 0;
    let inProgress = 0;
    let completed = 0;
    let overdue = 0;

    for (const task of tasks) {
      if (task.status === 'To Do') todo++;
      if (task.status === 'In Progress') inProgress++;
      if (task.status === 'Completed') completed++;

      if (isTaskOverdue(task.dueDate, task.status)) {
        overdue++;
      }
    }

    return { total, todo, inProgress, completed, overdue };
  }, [tasks]);

  // 3. Search, Filtering, and Sorting Pipeline
  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    // Search by Title and Description
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.description && t.description.toLowerCase().includes(q))
      );
    }

    // Status Filter
    if (filters.status !== 'All') {
      result = result.filter((t) => t.status === filters.status);
    }

    // Priority Filter
    if (filters.priority !== 'All') {
      result = result.filter((t) => t.priority === filters.priority);
    }

    // Sorting
    const priorityWeight: Record<TaskPriority, number> = {
      High: 3,
      Medium: 2,
      Low: 1,
    };

    result.sort((a, b) => {
      let comparison = 0;

      if (filters.sortBy === 'dueDate') {
        const dateA = a.dueDate || '';
        const dateB = b.dueDate || '';
        comparison = dateA.localeCompare(dateB);
      } else if (filters.sortBy === 'priority') {
        comparison = priorityWeight[a.priority] - priorityWeight[b.priority];
      } else if (filters.sortBy === 'createdAt') {
        comparison = (a.createdAt || '').localeCompare(b.createdAt || '');
      } else if (filters.sortBy === 'title') {
        comparison = a.title.localeCompare(b.title);
      }

      return filters.sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [tasks, filters]);

  const hasActiveFilters = Boolean(
    filters.search || filters.status !== 'All' || filters.priority !== 'All'
  );

  const handleResetFilters = () => {
    setFilters({
      search: '',
      status: 'All',
      priority: 'All',
      sortBy: 'dueDate',
      sortDirection: 'asc',
    });
  };

  // 4. Modal Handlers
  const handleOpenCreateModal = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const handleOpenEditModal = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = async (formData: TaskFormData) => {
    if (!currentUser?.uid) return;

    if (editingTask) {
      await updateTask(editingTask.id, editingTask, formData);
      showToast('Task updated successfully.');
    } else {
      await createTask(currentUser.uid, formData);
      showToast('Task created successfully.');
    }
  };

  // 5. Quick Status Change
  const handleQuickStatusChange = async (task: Task, nextStatus: TaskStatus) => {
    try {
      setUpdatingTaskId(task.id);
      await updateTaskStatus(task, nextStatus);
      showToast(`Task status updated to "${nextStatus}".`);
    } catch (err) {
      showToast('Failed to update status.', 'error');
    } finally {
      setUpdatingTaskId(null);
    }
  };

  // 6. Delete Task Flow
  const handleOpenDeleteModal = (task: Task) => {
    setTaskToDelete(task);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;
    try {
      setIsDeleting(true);
      await deleteTask(taskToDelete.id, currentUser?.uid);
      setIsDeleteModalOpen(false);
      setTaskToDelete(null);
      showToast('Task deleted successfully.');
    } catch (err) {
      showToast('Failed to delete task.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // 7. Load Demo Tasks
  const handleLoadDemoTasks = async () => {
    if (!currentUser?.uid) return;
    try {
      setIsLoadingDemo(true);
      await loadDemoTasks(currentUser.uid);
      showToast('Sample tasks loaded successfully.');
    } catch (err) {
      showToast('Failed to load demo tasks.', 'error');
    } finally {
      setIsLoadingDemo(false);
    }
  };

  const userName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Student';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Top Navigation */}
      <Navbar
        onOpenCreateModal={handleOpenCreateModal}
        onLoadDemoTasks={handleLoadDemoTasks}
        isLoadingDemo={isLoadingDemo}
        tasksCount={tasks.length}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        
        {/* Floating Toast Notification */}
        {toast && (
          <div
            role="status"
            className={`fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium animate-in slide-in-from-bottom-5 duration-200 ${
              toast.type === 'success'
                ? 'bg-slate-900 text-white border-slate-800'
                : 'bg-rose-600 text-white border-rose-700'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-white" />
            )}
            <span>{toast.message}</span>
            <button
              type="button"
              onClick={() => setToast(null)}
              className="ml-2 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Welcome Section */}
        <section className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Welcome back, {userName}!
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Logged in as <span className="font-semibold text-slate-800">{currentUser?.email}</span>
            </p>
          </div>

          {/* Real-time sync status badge */}
          <div className="flex items-center gap-2 self-start sm:self-auto bg-white border border-slate-200/80 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-600 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Firestore Real-Time Sync Active</span>
          </div>
        </section>

        {/* Real-time Error Alert if any */}
        {tasksError && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between text-xs sm:text-sm text-rose-800">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{tasksError}</span>
            </div>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="text-xs font-semibold text-rose-700 underline flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              Retry
            </button>
          </div>
        )}

        {/* Dynamic Summary Cards */}
        <StatsCards
          stats={stats}
          currentStatusFilter={filters.status}
          onSelectStatusFilter={(status) => setFilters({ ...filters, status })}
        />

        {/* Search, Filters, and Sorting Controls */}
        <TaskFilters
          filters={filters}
          onFilterChange={setFilters}
          onResetFilters={handleResetFilters}
          hasActiveFilters={hasActiveFilters}
          filteredCount={filteredTasks.length}
          totalCount={tasks.length}
        />

        {/* View Mode Bar (Cards vs Table) */}
        {tasks.length > 0 && (
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              {filters.status === 'All' ? 'All Tasks' : `${filters.status} Tasks`} ({filteredTasks.length})
            </h3>
            
            <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200">
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`p-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  viewMode === 'cards'
                    ? 'bg-slate-100 text-indigo-700 font-semibold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Cards View"
                aria-label="Cards View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-slate-100 text-indigo-700 font-semibold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Table View"
                aria-label="Table View"
              >
                <TableIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Tasks List Area */}
        {isLoadingTasks ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-3" />
            <p className="text-sm font-medium text-slate-600">
              Connecting to Firestore and loading tasks...
            </p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <EmptyState
            isFiltered={hasActiveFilters && tasks.length > 0}
            onOpenCreateModal={handleOpenCreateModal}
            onResetFilters={handleResetFilters}
            onLoadDemoTasks={handleLoadDemoTasks}
            isLoadingDemo={isLoadingDemo}
          />
        ) : viewMode === 'table' ? (
          <TaskTable
            tasks={filteredTasks}
            onEdit={handleOpenEditModal}
            onDelete={handleOpenDeleteModal}
            onQuickStatusChange={handleQuickStatusChange}
            isUpdatingStatus={Boolean(updatingTaskId)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={handleOpenEditModal}
                onDelete={handleOpenDeleteModal}
                onQuickStatusChange={handleQuickStatusChange}
                isUpdatingStatus={updatingTaskId === task.id}
              />
            ))}
          </div>
        )}

      </main>

      {/* Task Add / Edit Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleSaveTask}
        initialTask={editingTask}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        task={taskToDelete}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setTaskToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};

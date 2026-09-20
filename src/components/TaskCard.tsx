import React from 'react';
import { Task, TaskPriority, TaskStatus } from '../types';
import { formatDate, formatDateTime, isTaskOverdue } from '../utils/dateUtils';
import {
  Calendar,
  Clock,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ArrowRightCircle,
  RotateCw,
} from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onQuickStatusChange: (task: Task, nextStatus: TaskStatus) => void;
  isUpdatingStatus: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onQuickStatusChange,
  isUpdatingStatus,
}) => {
  const overdue = isTaskOverdue(task.dueDate, task.status);

  // Next status in flow: To Do -> In Progress -> Completed -> To Do
  const getNextStatus = (current: TaskStatus): TaskStatus => {
    if (current === 'To Do') return 'In Progress';
    if (current === 'In Progress') return 'Completed';
    return 'To Do';
  };

  const nextStatus = getNextStatus(task.status);

  const priorityStyles: Record<TaskPriority, { bg: string; text: string; border: string; label: string }> = {
    High: {
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-200',
      label: 'High Priority',
    },
    Medium: {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
      label: 'Medium Priority',
    },
    Low: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      label: 'Low Priority',
    },
  };

  const statusStyles: Record<TaskStatus, { bg: string; text: string; border: string; icon: React.ReactNode }> = {
    'To Do': {
      bg: 'bg-slate-100',
      text: 'text-slate-700',
      border: 'border-slate-300',
      icon: <Clock className="w-3.5 h-3.5 mr-1 text-slate-500" />,
    },
    'In Progress': {
      bg: 'bg-indigo-50',
      text: 'text-indigo-700',
      border: 'border-indigo-200',
      icon: <span className="w-2 h-2 rounded-full bg-indigo-600 mr-1.5 animate-pulse" />,
    },
    Completed: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      icon: <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />,
    },
  };

  const priorityConfig = priorityStyles[task.priority] || priorityStyles.Medium;
  const statusConfig = statusStyles[task.status] || statusStyles['To Do'];

  return (
    <article
      id={`task-card-${task.id}`}
      className={`bg-white rounded-xl border transition-all hover:shadow-md flex flex-col justify-between p-5 relative ${
        overdue
          ? 'border-rose-300 ring-1 ring-rose-200 bg-rose-50/10'
          : task.status === 'Completed'
          ? 'border-slate-200 opacity-90'
          : 'border-slate-200/90'
      }`}
    >
      <div>
        {/* Badges Bar: Status, Priority, Overdue indicator */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Status Badge */}
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
            >
              {statusConfig.icon}
              {task.status}
            </span>

            {/* Priority Badge */}
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${priorityConfig.bg} ${priorityConfig.text} ${priorityConfig.border}`}
            >
              {priorityConfig.label}
            </span>
          </div>

          {/* Overdue Badge if applicable */}
          {overdue && (
            <span
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-600 text-white shadow-xs animate-pulse"
              title="This task's due date has passed and it is not completed"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              Overdue
            </span>
          )}
        </div>

        {/* Task Title */}
        <h3
          className={`text-base font-bold text-slate-900 mb-2 line-clamp-2 ${
            task.status === 'Completed' ? 'line-through text-slate-500' : ''
          }`}
          title={task.title}
        >
          {task.title}
        </h3>

        {/* Task Description */}
        {task.description ? (
          <p className="text-sm text-slate-600 mb-4 line-clamp-3 whitespace-pre-wrap leading-relaxed">
            {task.description}
          </p>
        ) : (
          <p className="text-xs italic text-slate-400 mb-4">
            No description provided.
          </p>
        )}
      </div>

      {/* Footer Area: Meta dates and Action Buttons */}
      <div className="pt-3 border-t border-slate-100 mt-2 space-y-3">
        {/* Date Meta */}
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 gap-y-1">
          <div
            className={`flex items-center gap-1.5 ${
              overdue ? 'text-rose-600 font-semibold' : 'text-slate-600'
            }`}
            title={`Due: ${task.dueDate}`}
          >
            <Calendar className="w-3.5 h-3.5 shrink-0" />
            <span>Due {formatDate(task.dueDate)}</span>
          </div>
          <div className="text-[11px] text-slate-400" title={`Created: ${formatDateTime(task.createdAt)}`}>
            Created {formatDate(task.createdAt)}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between gap-2 pt-1">
          {/* Quick status cycle button */}
          <button
            id={`btn-cycle-status-${task.id}`}
            type="button"
            onClick={() => onQuickStatusChange(task, nextStatus)}
            disabled={isUpdatingStatus}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer border ${
              task.status === 'Completed'
                ? 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200'
            }`}
            title={`Change status to: ${nextStatus}`}
          >
            {isUpdatingStatus ? (
              <RotateCw className="w-3.5 h-3.5 animate-spin" />
            ) : task.status === 'Completed' ? (
              <RotateCw className="w-3.5 h-3.5" />
            ) : (
              <ArrowRightCircle className="w-3.5 h-3.5" />
            )}
            <span>Mark {nextStatus}</span>
          </button>

          {/* Edit and Delete Buttons */}
          <div className="flex items-center gap-1">
            <button
              id={`btn-edit-task-${task.id}`}
              type="button"
              onClick={() => onEdit(task)}
              className="p-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
              title="Edit Task"
              aria-label="Edit Task"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              id={`btn-delete-task-${task.id}`}
              type="button"
              onClick={() => onDelete(task)}
              className="p-1.5 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              title="Delete Task"
              aria-label="Delete Task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

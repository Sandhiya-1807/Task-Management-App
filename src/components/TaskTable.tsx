import React from 'react';
import { Task, TaskPriority, TaskStatus } from '../types';
import { formatDate, isTaskOverdue } from '../utils/dateUtils';
import { Edit2, Trash2, AlertCircle, RotateCw, CheckCircle2, Clock } from 'lucide-react';

interface TaskTableProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onQuickStatusChange: (task: Task, nextStatus: TaskStatus) => void;
  isUpdatingStatus: boolean;
}

export const TaskTable: React.FC<TaskTableProps> = ({
  tasks,
  onEdit,
  onDelete,
  onQuickStatusChange,
  isUpdatingStatus,
}) => {
  const getNextStatus = (current: TaskStatus): TaskStatus => {
    if (current === 'To Do') return 'In Progress';
    if (current === 'In Progress') return 'Completed';
    return 'To Do';
  };

  const priorityBadge = (priority: TaskPriority) => {
    const map = {
      High: 'bg-rose-50 text-rose-700 border-rose-200',
      Medium: 'bg-amber-50 text-amber-700 border-amber-200',
      Low: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    };
    return (
      <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full border ${map[priority]}`}>
        {priority}
      </span>
    );
  };

  const statusBadge = (status: TaskStatus) => {
    if (status === 'Completed') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3 h-3" />
          Completed
        </span>
      );
    }
    if (status === 'In Progress') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
          In Progress
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-slate-100 text-slate-700 border border-slate-300">
        <Clock className="w-3 h-3 text-slate-500" />
        To Do
      </span>
    );
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
              <th scope="col" className="py-3.5 px-4">Task Details</th>
              <th scope="col" className="py-3.5 px-4">Status</th>
              <th scope="col" className="py-3.5 px-4">Priority</th>
              <th scope="col" className="py-3.5 px-4">Due Date</th>
              <th scope="col" className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {tasks.map((task) => {
              const overdue = isTaskOverdue(task.dueDate, task.status);
              const nextStatus = getNextStatus(task.status);

              return (
                <tr
                  key={task.id}
                  id={`table-row-${task.id}`}
                  className="hover:bg-slate-50/70 transition-colors"
                >
                  {/* Title & Description */}
                  <td className="py-3.5 px-4 max-w-xs sm:max-w-md">
                    <div className="flex items-start gap-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`font-semibold text-slate-900 ${
                              task.status === 'Completed' ? 'line-through text-slate-400' : ''
                            }`}
                          >
                            {task.title}
                          </span>
                          {overdue && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-rose-600 text-white animate-pulse">
                              <AlertCircle className="w-2.5 h-2.5" />
                              Overdue
                            </span>
                          )}
                        </div>
                        {task.description && (
                          <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                            {task.description}
                          </p>
                        )}
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          Created {formatDate(task.createdAt)}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {statusBadge(task.status)}
                      <button
                        type="button"
                        onClick={() => onQuickStatusChange(task, nextStatus)}
                        disabled={isUpdatingStatus}
                        className="p-1 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition-colors cursor-pointer"
                        title={`Cycle status to: ${nextStatus}`}
                      >
                        <RotateCw className="w-3 h-3" />
                      </button>
                    </div>
                  </td>

                  {/* Priority */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {priorityBadge(task.priority)}
                  </td>

                  {/* Due Date */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`text-xs font-medium ${
                        overdue ? 'text-rose-600 font-bold' : 'text-slate-700'
                      }`}
                    >
                      {formatDate(task.dueDate)}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => onEdit(task)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                        title="Edit Task"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(task)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete Task"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

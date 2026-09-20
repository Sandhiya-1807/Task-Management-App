import React from 'react';
import { ClipboardList, Plus, Sparkles, FilterX } from 'lucide-react';

interface EmptyStateProps {
  isFiltered: boolean;
  onOpenCreateModal: () => void;
  onResetFilters?: () => void;
  onLoadDemoTasks?: () => void;
  isLoadingDemo?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  isFiltered,
  onOpenCreateModal,
  onResetFilters,
  onLoadDemoTasks,
  isLoadingDemo,
}) => {
  if (isFiltered) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-2xl p-10 sm:p-14 text-center max-w-lg mx-auto my-8 shadow-xs">
        <div className="w-14 h-14 bg-slate-100 text-slate-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <FilterX className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-1.5">
          No matching tasks found
        </h3>
        <p className="text-sm text-slate-600 mb-6 max-w-sm mx-auto">
          We couldn't find any tasks matching your current search query or filter selection.
        </p>
        {onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer border border-indigo-200"
          >
            Clear Filters & Search
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-10 sm:p-14 text-center max-w-md mx-auto my-8 shadow-xs">
      <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 ring-8 ring-indigo-50/50">
        <ClipboardList className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">
        No tasks yet
      </h3>
      <p className="text-sm text-slate-600 mb-6 leading-relaxed">
        Get started by creating your first task to track work, set priorities, and monitor deadlines.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          id="btn-empty-create-task"
          type="button"
          onClick={onOpenCreateModal}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Your First Task</span>
        </button>

        {onLoadDemoTasks && (
          <button
            id="btn-empty-load-demo"
            type="button"
            onClick={onLoadDemoTasks}
            disabled={isLoadingDemo}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 hover:text-indigo-600 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>{isLoadingDemo ? 'Loading Demo...' : 'Load Demo Tasks'}</span>
          </button>
        )}
      </div>
    </div>
  );
};

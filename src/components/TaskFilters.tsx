import React from 'react';
import { FilterState, SortField, SortDirection, TaskPriority, TaskStatus } from '../types';
import { Search, X, ArrowDownAZ, ArrowUpZA, SlidersHorizontal, RotateCcw } from 'lucide-react';

interface TaskFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
  filteredCount: number;
  totalCount: number;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  hasActiveFilters,
  filteredCount,
  totalCount,
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, search: e.target.value });
  };

  const handleStatusChange = (status: 'All' | TaskStatus) => {
    onFilterChange({ ...filters, status });
  };

  const handlePriorityChange = (priority: 'All' | TaskPriority) => {
    onFilterChange({ ...filters, priority });
  };

  const handleSortByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, sortBy: e.target.value as SortField });
  };

  const toggleSortDirection = () => {
    const newDir: SortDirection = filters.sortDirection === 'asc' ? 'desc' : 'asc';
    onFilterChange({ ...filters, sortDirection: newDir });
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs mb-6 space-y-3.5">
      {/* Top Row: Search input + Sorting Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search Bar */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            id="input-task-search"
            type="text"
            value={filters.search}
            onChange={handleSearchChange}
            placeholder="Search tasks by title or description..."
            className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => onFilterChange({ ...filters, search: '' })}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <label htmlFor="select-sort-by" className="text-xs font-medium text-slate-600 hidden md:inline">
            Sort by:
          </label>
          <div className="relative">
            <select
              id="select-sort-by"
              value={filters.sortBy}
              onChange={handleSortByChange}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 cursor-pointer pr-7"
            >
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
              <option value="createdAt">Date Created</option>
              <option value="title">Title</option>
            </select>
          </div>

          <button
            id="btn-toggle-sort-direction"
            type="button"
            onClick={toggleSortDirection}
            className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
            title={`Sort ${filters.sortDirection === 'asc' ? 'Ascending' : 'Descending'} (Click to reverse)`}
            aria-label={`Sort ${filters.sortDirection === 'asc' ? 'Ascending' : 'Descending'}`}
          >
            {filters.sortDirection === 'asc' ? (
              <ArrowDownAZ className="w-4 h-4" />
            ) : (
              <ArrowUpZA className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Bottom Row: Status pills, Priority pills, and Reset */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-100">
        
        <div className="flex flex-wrap items-center gap-4">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mr-1">
              Status:
            </span>
            {(['All', 'To Do', 'In Progress', 'Completed'] as const).map((status) => (
              <button
                key={status}
                id={`filter-status-${status.toLowerCase().replace(' ', '-')}`}
                type="button"
                onClick={() => handleStatusChange(status)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  filters.status === status
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mr-1">
              Priority:
            </span>
            {(['All', 'High', 'Medium', 'Low'] as const).map((priority) => (
              <button
                key={priority}
                id={`filter-priority-${priority.toLowerCase()}`}
                type="button"
                onClick={() => handlePriorityChange(priority)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  filters.priority === priority
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {priority}
              </button>
            ))}
          </div>
        </div>

        {/* Counter and Reset Filters */}
        <div className="flex items-center gap-3 ml-auto text-xs">
          <span className="text-slate-500">
            Showing <strong className="text-slate-800 font-semibold">{filteredCount}</strong> of {totalCount}
          </span>
          {hasActiveFilters && (
            <button
              id="btn-reset-filters"
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-slate-600 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 border border-slate-200 rounded-md font-medium transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

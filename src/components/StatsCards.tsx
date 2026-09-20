import React from 'react';
import { TaskStats, TaskStatus } from '../types';
import { CheckCircle2, Clock, AlertTriangle, Layers, ArrowUpRight } from 'lucide-react';

interface StatsCardsProps {
  stats: TaskStats;
  currentStatusFilter: 'All' | TaskStatus;
  onSelectStatusFilter: (status: 'All' | TaskStatus) => void;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  stats,
  currentStatusFilter,
  onSelectStatusFilter,
}) => {
  const completionPercentage = stats.total > 0
    ? Math.round((stats.completed / stats.total) * 100)
    : 0;

  return (
    <section className="space-y-4 mb-6" aria-label="Task Summary Statistics">
      {/* Progress Bar Header */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-800">Overall Completion Rate</span>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
              {completionPercentage}% Done
            </span>
          </div>
          <span className="text-xs text-slate-500">
            {stats.completed} of {stats.total} {stats.total === 1 ? 'task' : 'tasks'} finished
          </span>
        </div>
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
          <div
            className="bg-emerald-500 h-full transition-all duration-500 ease-out"
            style={{ width: `${completionPercentage}%` }}
            role="progressbar"
            aria-valuenow={completionPercentage}
            aria-valuemin={0}
            aria-valuemax={100}
            title={`${completionPercentage}% Completed`}
          />
        </div>
      </div>

      {/* 4 Primary Cards + Overdue Indicator */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        
        {/* Total Tasks */}
        <button
          id="stat-card-total"
          type="button"
          onClick={() => onSelectStatusFilter('All')}
          className={`text-left p-4 rounded-xl border transition-all cursor-pointer ${
            currentStatusFilter === 'All'
              ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900/10'
              : 'bg-white text-slate-800 border-slate-200/80 hover:border-slate-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold uppercase tracking-wider ${currentStatusFilter === 'All' ? 'text-slate-300' : 'text-slate-500'}`}>
              Total Tasks
            </span>
            <Layers className={`w-4 h-4 ${currentStatusFilter === 'All' ? 'text-slate-300' : 'text-slate-400'}`} />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <p className="text-2xl sm:text-3xl font-bold tracking-tight">
              {stats.total}
            </p>
            <span className={`text-[11px] font-medium flex items-center ${currentStatusFilter === 'All' ? 'text-slate-300' : 'text-slate-500'}`}>
              View all
              <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
        </button>

        {/* To Do / Pending Tasks */}
        <button
          id="stat-card-todo"
          type="button"
          onClick={() => onSelectStatusFilter('To Do')}
          className={`text-left p-4 rounded-xl border transition-all cursor-pointer ${
            currentStatusFilter === 'To Do'
              ? 'bg-amber-500 text-white border-amber-500 shadow-md ring-2 ring-amber-500/20'
              : 'bg-white text-slate-800 border-slate-200/80 hover:border-slate-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold uppercase tracking-wider ${currentStatusFilter === 'To Do' ? 'text-amber-100' : 'text-amber-600'}`}>
              Pending (To Do)
            </span>
            <Clock className={`w-4 h-4 ${currentStatusFilter === 'To Do' ? 'text-amber-100' : 'text-amber-500'}`} />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <p className="text-2xl sm:text-3xl font-bold tracking-tight">
              {stats.todo}
            </p>
            <span className={`text-[11px] font-medium ${currentStatusFilter === 'To Do' ? 'text-amber-100' : 'text-slate-500'}`}>
              Queue
            </span>
          </div>
        </button>

        {/* In Progress */}
        <button
          id="stat-card-in-progress"
          type="button"
          onClick={() => onSelectStatusFilter('In Progress')}
          className={`text-left p-4 rounded-xl border transition-all cursor-pointer ${
            currentStatusFilter === 'In Progress'
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-600/20'
              : 'bg-white text-slate-800 border-slate-200/80 hover:border-slate-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold uppercase tracking-wider ${currentStatusFilter === 'In Progress' ? 'text-indigo-100' : 'text-indigo-600'}`}>
              In Progress
            </span>
            <div className={`w-2.5 h-2.5 rounded-full animate-pulse ${currentStatusFilter === 'In Progress' ? 'bg-indigo-200' : 'bg-indigo-500'}`} />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <p className="text-2xl sm:text-3xl font-bold tracking-tight">
              {stats.inProgress}
            </p>
            <span className={`text-[11px] font-medium ${currentStatusFilter === 'In Progress' ? 'text-indigo-100' : 'text-slate-500'}`}>
              Active
            </span>
          </div>
        </button>

        {/* Completed */}
        <button
          id="stat-card-completed"
          type="button"
          onClick={() => onSelectStatusFilter('Completed')}
          className={`text-left p-4 rounded-xl border transition-all cursor-pointer ${
            currentStatusFilter === 'Completed'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-600/20'
              : 'bg-white text-slate-800 border-slate-200/80 hover:border-slate-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold uppercase tracking-wider ${currentStatusFilter === 'Completed' ? 'text-emerald-100' : 'text-emerald-600'}`}>
              Completed
            </span>
            <CheckCircle2 className={`w-4 h-4 ${currentStatusFilter === 'Completed' ? 'text-emerald-100' : 'text-emerald-500'}`} />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <p className="text-2xl sm:text-3xl font-bold tracking-tight">
              {stats.completed}
            </p>
            <span className={`text-[11px] font-medium ${currentStatusFilter === 'Completed' ? 'text-emerald-100' : 'text-slate-500'}`}>
              Finished
            </span>
          </div>
        </button>

        {/* Overdue Card */}
        <div
          id="stat-card-overdue"
          className={`col-span-2 sm:col-span-2 lg:col-span-1 p-4 rounded-xl border transition-all ${
            stats.overdue > 0
              ? 'bg-rose-50/80 border-rose-200 text-rose-900 shadow-xs'
              : 'bg-white border-slate-200/80 text-slate-800 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold uppercase tracking-wider ${stats.overdue > 0 ? 'text-rose-700' : 'text-slate-500'}`}>
              Overdue
            </span>
            <AlertTriangle className={`w-4 h-4 ${stats.overdue > 0 ? 'text-rose-600' : 'text-slate-400'}`} />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <p className={`text-2xl sm:text-3xl font-bold tracking-tight ${stats.overdue > 0 ? 'text-rose-600' : 'text-slate-700'}`}>
              {stats.overdue}
            </p>
            <span className={`text-[11px] font-medium ${stats.overdue > 0 ? 'text-rose-600' : 'text-slate-400'}`}>
              {stats.overdue > 0 ? 'Action needed' : 'On track'}
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};

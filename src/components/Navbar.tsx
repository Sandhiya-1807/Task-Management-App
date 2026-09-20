import React from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckSquare, LogOut, Plus, Sparkles, User as UserIcon } from 'lucide-react';

interface NavbarProps {
  onOpenCreateModal: () => void;
  onLoadDemoTasks: () => void;
  isLoadingDemo: boolean;
  tasksCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCreateModal,
  onLoadDemoTasks,
  isLoadingDemo,
  tasksCount,
}) => {
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const displayName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User';
  const email = currentUser?.email || '';

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-none">
                Task Management Dashboard
              </h1>
              <p className="text-xs text-slate-500 mt-1 hidden sm:block">
                Organize, track, and complete your tasks in real-time
              </p>
            </div>
          </div>

          {/* Action Buttons & User Section */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Demo Tasks button if empty or low count */}
            {tasksCount === 0 && (
              <button
                id="btn-load-demo-tasks"
                type="button"
                onClick={onLoadDemoTasks}
                disabled={isLoadingDemo}
                title="Load sample tasks for quick demonstration"
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors border border-indigo-200/60 disabled:opacity-50 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isLoadingDemo ? 'Loading...' : 'Load Demo Tasks'}</span>
              </button>
            )}

            {/* Add Task Primary Action */}
            <button
              id="btn-navbar-add-task"
              type="button"
              onClick={onOpenCreateModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="font-medium">Add Task</span>
            </button>

            {/* User Profile Pill */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700">
              <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-[10px]">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col text-left max-w-[140px]">
                <span className="font-semibold truncate text-slate-900 leading-tight">
                  {displayName}
                </span>
                <span className="text-[11px] text-slate-500 truncate" title={email}>
                  {email}
                </span>
              </div>
            </div>

            {/* Logout Action */}
            <button
              id="btn-navbar-logout"
              type="button"
              onClick={handleLogout}
              title={`Sign out (${email})`}
              className="inline-flex items-center gap-1 px-2.5 py-2 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-rose-100"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>

        </div>

        {/* Mobile Sub-bar for User Identity */}
        <div className="lg:hidden pb-2.5 pt-0 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 mt-1">
          <div className="flex items-center gap-1.5 truncate">
            <UserIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-medium text-slate-700 truncate">{email}</span>
          </div>
          {tasksCount === 0 && (
            <button
              type="button"
              onClick={onLoadDemoTasks}
              disabled={isLoadingDemo}
              className="text-xs text-indigo-600 font-medium hover:underline shrink-0 ml-2"
            >
              {isLoadingDemo ? 'Loading...' : '+ Load Demo Tasks'}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

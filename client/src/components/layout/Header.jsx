import React from 'react';
import { Menu, Search, Bell, Plus, ChevronDown } from 'lucide-react';
import { ThemeToggle } from '../common/ThemeToggle';
import { useProjectStore } from '../../store/projectStore';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

export const Header = ({ onMenuClick, onOpenNewTask }) => {
  const { currentProject, projects } = useProjectStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const handleProjectSelect = (e) => {
    const projectId = e.target.value;
    if (projectId) {
      navigate(`/projects/${projectId}`);
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 w-full px-4 sm:px-6 flex items-center justify-between
      bg-white/90 dark:bg-[#0F172A]/90 backdrop-blur-md
      border-b border-slate-200 dark:border-slate-800
      transition-colors duration-200
    ">
      {/* Left section: Hamburger & Project Switcher */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Project Selector */}
        {projects.length > 0 && (
          <div className="relative flex items-center">
            <select
              value={currentProject?._id || ''}
              onChange={handleProjectSelect}
              className="appearance-none bg-slate-100 dark:bg-slate-800/80
                text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-200
                py-1.5 pl-3 pr-8 rounded-lg border border-slate-300 dark:border-slate-700
                hover:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="" disabled>Select Project...</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 pointer-events-none" />
          </div>
        )}
      </div>

      {/* Right section: Theme Toggle, Quick Create, Notifications */}
      <div className="flex items-center gap-2 sm:gap-3">
        {onOpenNewTask && currentProject && (
          <button
            onClick={onOpenNewTask}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
              bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Task</span>
          </button>
        )}

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notifications */}
        <div className="relative">
          <button
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          </button>
        </div>

        {/* User Avatar */}
        <button
          onClick={() => navigate('/settings')}
          className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-blue-500/50 transition-all"
        >
          {user?.avatarUrl ? (
            <img 
              src={user.avatarUrl} 
              alt={user?.name} 
              className="w-8 h-8 rounded-full object-cover border border-slate-300 dark:border-slate-700" 
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
              {user?.name?.charAt(0) || 'U'}
            </div>
          )}
        </button>
      </div>
    </header>
  );
};

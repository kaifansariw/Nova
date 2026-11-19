import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Kanban, 
  Users, 
  Settings, 
  Layers, 
  Plus,
  LogOut
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useProjectStore } from '../../store/projectStore';

export const Sidebar = ({ isOpen, onClose, onOpenNewProject }) => {
  const { user, logout } = useAuthStore();
  const { currentProject } = useProjectStore();
  const location = useLocation();

  const navItems = [
    { 
      to: '/dashboard', 
      label: 'Dashboard', 
      icon: LayoutDashboard,
      isActive: location.pathname === '/dashboard'
    },
    { 
      to: '/projects', 
      label: 'Projects', 
      icon: FolderKanban,
      isActive: (location.pathname === '/projects' || location.pathname.startsWith('/projects/')) && 
                !location.pathname.endsWith('/board') && 
                !location.pathname.endsWith('/team')
    },
    { 
      to: currentProject ? `/projects/${currentProject._id}/board` : '/board', 
      label: 'Task Board', 
      icon: Kanban,
      isActive: location.pathname === '/board' || location.pathname.endsWith('/board')
    },
    { 
      to: currentProject ? `/projects/${currentProject._id}/team` : '/team', 
      label: 'Team', 
      icon: Users,
      isActive: location.pathname === '/team' || location.pathname.endsWith('/team')
    },
    { 
      to: '/settings', 
      label: 'Settings', 
      icon: Settings,
      isActive: location.pathname === '/settings'
    },
  ];

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`fixed top-0 left-0 z-40 h-screen w-64 transition-colors duration-200 ease-in-out
        bg-white dark:bg-[#1E293B]
        border-r border-slate-200 dark:border-slate-800
        flex flex-col justify-between
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand / Logo */}
        <div>
          <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800">
            <NavLink to="/dashboard" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white shadow-glow-primary group-hover:scale-105 transition-transform">
                <Layers className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white leading-tight">
                  Nova<span className="text-blue-500">-Team</span>
                </span>
                <span className="text-[10px] uppercase font-semibold text-cyan-600 dark:text-cyan-400 tracking-wider">
                  Workspace
                </span>
              </div>
            </NavLink>
          </div>

          {/* Quick Action Button */}
          <div className="p-4">
            <button
              onClick={() => {
                if (onOpenNewProject) onOpenNewProject();
                if (onClose) onClose();
              }}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium
                bg-blue-600 hover:bg-blue-500 text-white shadow-sm hover:shadow-glow-primary transition-all duration-150 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Project</span>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1.5 mt-1">
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                  ${item.isActive 
                    ? 'bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-600/15 dark:text-blue-400 dark:border-blue-500/20' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800/60'
                  }
                `}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* User Info & Logout Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              {user?.avatarUrl ? (
                <img 
                  src={user.avatarUrl} 
                  alt={user?.name} 
                  className="w-9 h-9 rounded-full object-cover border border-slate-300 dark:border-slate-700" 
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-600/20 dark:text-blue-400 flex items-center justify-center font-bold text-sm border border-blue-200 dark:border-blue-500/30">
                  {user?.name?.charAt(0) || 'U'}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {user?.organization || 'Nova Workspace'}
                </p>
              </div>
            </div>

            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:text-rose-400 dark:hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

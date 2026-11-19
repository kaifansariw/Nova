import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate, NavLink } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { LayoutDashboard, FolderKanban, Kanban, Users, Settings } from 'lucide-react';
import { useProjectStore } from '../../store/projectStore';
import { ProjectModal } from '../projects/ProjectModal';
import { TaskCreateModal } from '../tasks/TaskCreateModal';

export const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { fetchProjects, currentProject } = useProjectStore();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] text-[#0F172A] dark:text-[#F8FAFC] flex flex-col transition-colors duration-200">
      {/* Sidebar for Desktop & Drawer for Mobile */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        onOpenNewProject={() => setIsProjectModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col flex-1 pb-16 lg:pb-0">
        <Header 
          onMenuClick={() => setSidebarOpen(true)} 
          onOpenNewTask={() => setIsTaskModalOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
          <Outlet context={{ onOpenNewProject: () => setIsProjectModalOpen(true), onOpenNewTask: () => setIsTaskModalOpen(true) }} />
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (WCAG & PRD Breakpoint compliant) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 h-16 bg-white dark:bg-[#1E293B] border-t border-slate-200 dark:border-slate-800 flex items-center justify-around px-2">
        <NavLink
          to="/dashboard"
          className={({ isActive }) => `flex flex-col items-center gap-1 p-1 text-xs font-medium ${
            isActive ? 'text-blue-500' : 'text-slate-400'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/projects"
          className={({ isActive }) => `flex flex-col items-center gap-1 p-1 text-xs font-medium ${
            isActive ? 'text-blue-500' : 'text-slate-400'
          }`}
        >
          <FolderKanban className="w-5 h-5" />
          <span>Projects</span>
        </NavLink>

        <NavLink
          to={currentProject ? `/projects/${currentProject._id}/board` : '/board'}
          className={() => `flex flex-col items-center gap-1 p-1 text-xs font-medium ${
            location.pathname === '/board' || location.pathname.endsWith('/board') ? 'text-blue-500 font-semibold' : 'text-slate-400'
          }`}
        >
          <Kanban className="w-5 h-5" />
          <span>Board</span>
        </NavLink>

        <NavLink
          to={currentProject ? `/projects/${currentProject._id}/team` : '/team'}
          className={() => `flex flex-col items-center gap-1 p-1 text-xs font-medium ${
            location.pathname === '/team' || location.pathname.endsWith('/team') ? 'text-blue-500 font-semibold' : 'text-slate-400'
          }`}
        >
          <Users className="w-5 h-5" />
          <span>Team</span>
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) => `flex flex-col items-center gap-1 p-1 text-xs font-medium ${
            isActive ? 'text-blue-500' : 'text-slate-400'
          }`}
        >
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </NavLink>
      </nav>

      {/* Global Modals */}
      <ProjectModal 
        isOpen={isProjectModalOpen} 
        onClose={() => setIsProjectModalOpen(false)} 
      />

      {currentProject && (
        <TaskCreateModal
          isOpen={isTaskModalOpen}
          onClose={() => setIsTaskModalOpen(false)}
          projectId={currentProject._id}
        />
      )}
    </div>
  );
};

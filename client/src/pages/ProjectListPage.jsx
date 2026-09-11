import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Search, Plus, Filter, LayoutGrid, List as ListIcon, FolderKanban } from 'lucide-react';
import { useProjectStore } from '../store/projectStore';
import { ProjectCard } from '../components/projects/ProjectCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const ProjectListPage = () => {
  const { onOpenNewProject } = useOutletContext() || {};
  const { projects, fetchProjects, isLoadingProjects } = useProjectStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  useEffect(() => {
    fetchProjects({ status: statusFilter, search: searchTerm });
  }, [fetchProjects, statusFilter, searchTerm]);

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Projects
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Manage your workspaces, track milestones, and view team deliverables.
          </p>
        </div>

        <button
          onClick={onOpenNewProject}
          className="inline-flex items-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold
            bg-[#3B82F6] hover:bg-blue-600 text-white shadow-sm hover:shadow-glow-primary transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg text-xs sm:text-sm bg-slate-50 dark:bg-slate-900/60 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700/80 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs sm:text-sm rounded-lg py-2 px-3 bg-slate-50 dark:bg-slate-900/60 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700/80 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 bg-slate-100 dark:bg-slate-900/40">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md text-xs transition-colors ${
                viewMode === 'grid'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md text-xs transition-colors ${
                viewMode === 'list'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="List View"
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Projects Display */}
      {isLoadingProjects ? (
        <LoadingSpinner size="lg" className="h-64" />
      ) : filteredProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-transparent">
          <FolderKanban className="w-12 h-12 text-slate-400 mb-3" />
          <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
            No projects found
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-4">
            {searchTerm || statusFilter !== 'all'
              ? 'Try adjusting your filters or search keywords.'
              : 'Create your very first project to start organizing tasks with your team.'}
          </p>
          <button
            onClick={onOpenNewProject}
            className="inline-flex items-center gap-2 py-2 px-4 rounded-xl text-xs font-semibold
              bg-[#3B82F6] hover:bg-blue-600 text-white shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Project</span>
          </button>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" : "space-y-3"}>
          {filteredProjects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
};

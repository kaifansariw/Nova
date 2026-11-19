import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { 
  Kanban as KanbanIcon, 
  List as ListIcon, 
  Search, 
  Filter, 
  Plus, 
  ArrowLeft,
  Calendar,
  Layers,
  FolderKanban,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { useProjectStore } from '../store/projectStore';
import { TaskBoard } from '../components/tasks/TaskBoard';
import { TaskList } from '../components/tasks/TaskList';
import { TaskDetailModal } from '../components/tasks/TaskDetailModal';
import { TaskCreateModal } from '../components/tasks/TaskCreateModal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const TaskBoardPage = () => {
  const { id: routeProjectId } = useParams();
  const navigate = useNavigate();
  const { onOpenNewProject } = useOutletContext() || {};

  const {
    projects,
    fetchProjects,
    fetchProject,
    currentProject,
    tasks,
    isLoadingProjects,
    isLoadingCurrentProject,
    updateTaskStatusOptimistic
  } = useProjectStore();

  const [viewMode, setViewMode] = useState('board'); // 'board' | 'list'
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [assigneeFilter, setAssigneeFilter] = useState('all');

  // Modals state
  const [selectedTask, setSelectedTask] = useState(null);
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false);
  const [isTaskCreateOpen, setIsTaskCreateOpen] = useState(false);
  const [createInitialStatus, setCreateInitialStatus] = useState('todo');

  // Ensure projects are loaded
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Determine active project ID: route param, or current selected, or first available project
  const activeProjectId = routeProjectId || currentProject?._id || (projects.length > 0 ? projects[0]._id : null);

  // Fetch project details and tasks whenever activeProjectId changes
  useEffect(() => {
    if (activeProjectId) {
      fetchProject(activeProjectId);
    }
  }, [activeProjectId, fetchProject]);

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setIsTaskDetailOpen(true);
  };

  const handleOpenCreateInColumn = (status) => {
    setCreateInitialStatus(status);
    setIsTaskCreateOpen(true);
  };

  const handleProjectChange = (e) => {
    const newProjectId = e.target.value;
    if (newProjectId) {
      navigate(`/projects/${newProjectId}/board`);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (task.tags && task.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase())));

    const matchesPriority =
      priorityFilter === 'all' || task.priority === priorityFilter;

    const matchesAssignee =
      assigneeFilter === 'all' ||
      (task.assignees && task.assignees.some((a) => (a._id || a) === assigneeFilter));

    return matchesSearch && matchesPriority && matchesAssignee;
  });

  // Loading state when initial projects list is loading
  if (isLoadingProjects && projects.length === 0) {
    return <LoadingSpinner size="lg" className="h-96" />;
  }

  // Empty state when user has no projects
  if (!isLoadingProjects && projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-[#1E293B]/40 animate-fade-in my-8">
        <KanbanIcon className="w-12 h-12 text-slate-400 mb-3" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
          No projects available
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-5">
          You don't have any projects yet. Create a project to start organizing tasks and tracking workflows on the Task Board.
        </p>
        <button
          onClick={onOpenNewProject}
          className="inline-flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold
            bg-blue-600 hover:bg-blue-500 text-white shadow-sm hover:shadow-glow-primary transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create First Project</span>
        </button>
      </div>
    );
  }

  // Loading state while active project details/tasks load
  if (isLoadingCurrentProject || !currentProject) {
    return <LoadingSpinner size="lg" className="h-96" />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header: Project Selector & Action Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          {/* Breadcrumb Navigation & Overview link */}
          <div className="flex items-center gap-2 mb-1.5">
            <button
              onClick={() => navigate('/projects')}
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Projects</span>
            </button>
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <button
              onClick={() => navigate(`/projects/${currentProject._id}`)}
              className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              <span>{currentProject.name} Overview</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          {/* Project Switcher Dropdown */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <FolderKanban className="w-6 h-6 text-blue-500 shrink-0" />
              <div className="relative inline-block">
                <select
                  value={currentProject._id}
                  onChange={handleProjectChange}
                  className="appearance-none text-xl sm:text-2xl font-bold bg-white dark:bg-[#1E293B] text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700/80 rounded-xl pl-3.5 pr-9 py-1.5 focus:border-blue-500 focus:outline-none cursor-pointer shadow-sm hover:border-slate-400 dark:hover:border-slate-600 transition-colors"
                  title="Switch between projects"
                >
                  {projects.map((p) => (
                    <option key={p._id} value={p._id} className="dark:bg-[#1E293B] text-slate-900 dark:text-white text-base font-medium">
                      {p.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-500/15 dark:text-blue-400 dark:border-blue-500/30 font-medium">
              Task Board
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 self-start md:self-auto">
          {/* View mode toggle (Kanban vs List) */}
          <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-800 p-0.5 bg-slate-100 dark:bg-slate-900/50">
            <button
              onClick={() => setViewMode('board')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'board'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <KanbanIcon className="w-3.5 h-3.5" />
              <span>Board</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'list'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ListIcon className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
          </div>

          <button
            onClick={() => handleOpenCreateInColumn('todo')}
            className="inline-flex items-center gap-1.5 py-2 px-3.5 rounded-xl text-xs font-semibold
              bg-[#3B82F6] hover:bg-blue-600 text-white shadow-sm hover:shadow-glow-primary transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Filter and Search controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tasks, tags, or descriptions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg text-xs sm:text-sm bg-slate-50 dark:bg-slate-900/60 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700/80 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Priority filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="text-xs rounded-lg py-2 px-3 bg-slate-50 dark:bg-slate-900/60 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700/80 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {/* Assignee filter */}
          <select
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            className="text-xs rounded-lg py-2 px-3 bg-slate-50 dark:bg-slate-900/60 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700/80 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="all">All Assignees</option>
            {(currentProject.members || []).map((m, idx) => {
              const u = m.userId;
              if (!u) return null;
              return (
                <option key={idx} value={u._id}>
                  {u.name}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Main Board or List Component */}
      {viewMode === 'board' ? (
        <TaskBoard
          tasks={filteredTasks}
          onTaskClick={handleTaskClick}
          onTaskStatusChange={updateTaskStatusOptimistic}
          onAddTask={handleOpenCreateInColumn}
        />
      ) : (
        <TaskList
          tasks={filteredTasks}
          onTaskClick={handleTaskClick}
        />
      )}

      {/* Detail and Create Modals */}
      <TaskDetailModal
        isOpen={isTaskDetailOpen}
        onClose={() => setIsTaskDetailOpen(false)}
        task={selectedTask}
        onUpdate={() => fetchProject(currentProject._id)}
      />

      <TaskCreateModal
        isOpen={isTaskCreateOpen}
        onClose={() => setIsTaskCreateOpen(false)}
        projectId={currentProject._id}
        initialStatus={createInitialStatus}
      />
    </div>
  );
};

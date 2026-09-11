import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Kanban as KanbanIcon, 
  List as ListIcon, 
  Search, 
  Filter, 
  Plus, 
  ArrowLeft,
  Calendar,
  Layers
} from 'lucide-react';
import { useProjectStore } from '../store/projectStore';
import { TaskBoard } from '../components/tasks/TaskBoard';
import { TaskList } from '../components/tasks/TaskList';
import { TaskDetailModal } from '../components/tasks/TaskDetailModal';
import { TaskCreateModal } from '../components/tasks/TaskCreateModal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const TaskBoardPage = () => {
  const { id: projectId } = useParams();
  const navigate = useNavigate();

  const {
    fetchProject,
    currentProject,
    tasks,
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

  useEffect(() => {
    if (projectId) {
      fetchProject(projectId);
    }
  }, [projectId, fetchProject]);

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setIsTaskDetailOpen(true);
  };

  const handleOpenCreateInColumn = (status) => {
    setCreateInitialStatus(status);
    setIsTaskCreateOpen(true);
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

  if (isLoadingCurrentProject || !currentProject) {
    return <LoadingSpinner size="lg" className="h-96" />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Breadcrumb & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <button
            onClick={() => navigate(`/projects/${currentProject._id}`)}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to {currentProject.name}</span>
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {currentProject.name}
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-500/15 dark:text-blue-400 dark:border-blue-500/30 font-medium">
              Board
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
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
        onUpdate={() => fetchProject(projectId)}
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

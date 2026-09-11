import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { 
  FolderKanban, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Plus, 
  ArrowRight, 
  Activity, 
  TrendingUp, 
  Calendar,
  Users
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip 
} from 'recharts';
import api from '../utils/api';
import { useAuthStore } from '../store/authStore';
import { useProjectStore } from '../store/projectStore';
import { ProjectCard } from '../components/projects/ProjectCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { formatDistanceToNow, format } from 'date-fns';

const PRIORITY_COLORS = {
  Low: '#64748B',
  Medium: '#3B82F6',
  High: '#F59E0B',
  Critical: '#EF4444'
};

export const DashboardPage = () => {
  const { onOpenNewProject } = useOutletContext() || {};
  const { user } = useAuthStore();
  const { projects, fetchProjects } = useProjectStore();
  const navigate = useNavigate();

  const [metrics, setMetrics] = useState(null);
  const [workload, setWorkload] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        await fetchProjects();
        const res = await api.get('/projects/dashboard/metrics');
        setMetrics(res.data.metrics);
        setWorkload(res.data.workload);
        setRecentActivity(res.data.recentActivity);
        setUpcomingDeadlines(res.data.upcomingDeadlines);
      } catch (err) {
        console.error('Failed to load dashboard metrics:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [fetchProjects]);

  if (loading && !metrics) {
    return <LoadingSpinner size="lg" className="h-96" />;
  }

  const statusDistribution = metrics ? [
    { name: 'To Do', value: metrics.todoTasks, color: '#64748B' },
    { name: 'In Progress', value: metrics.inProgressTasks, color: '#3B82F6' },
    { name: 'Review', value: metrics.reviewTasks, color: '#F59E0B' },
    { name: 'Done', value: metrics.completedTasks, color: '#10B981' }
  ] : [];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome & Quick Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Welcome back, <span className="text-blue-500">{user?.name || 'Explorer'}</span> 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Here is your team's execution progress and workload across all active projects.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenNewProject}
            className="inline-flex items-center gap-2 py-2 px-4 rounded-xl text-sm font-semibold
              bg-[#3B82F6] hover:bg-blue-600 text-white shadow-sm hover:shadow-glow-primary transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Project</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Projects</span>
            <FolderKanban className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {metrics?.activeProjects || 0}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            {metrics?.totalProjects || 0} total created
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Completion Rate</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {metrics?.completionRate || 0}%
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 mt-2 overflow-hidden">
            <div 
              className="h-full bg-emerald-500 rounded-full" 
              style={{ width: `${metrics?.completionRate || 0}%` }} 
            />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Tasks in Flight</span>
            <Clock className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {(metrics?.inProgressTasks || 0) + (metrics?.reviewTasks || 0)}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            {metrics?.inProgressTasks || 0} in progress, {metrics?.reviewTasks || 0} in review
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Overdue Tasks</span>
            <AlertCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">
            {metrics?.overdueTasks || 0}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Requires immediate attention
          </p>
        </div>
      </div>

      {/* Analytics Charts & Upcoming Deadlines Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task Status Distribution Chart */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
              Task Status Distribution
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Current distribution across all active projects</p>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1E293B', 
                    border: '1px solid #334155', 
                    borderRadius: '8px', 
                    fontSize: '12px',
                    color: '#F8FAFC' 
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs">
            {statusDistribution.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-600 dark:text-slate-400">{item.name}:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Team Workload Chart */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
              Team Workload Overview
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Pending task distribution per team member</p>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={workload.slice(0, 5)} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1E293B', 
                    border: '1px solid #334155', 
                    borderRadius: '8px', 
                    fontSize: '12px',
                    color: '#F8FAFC' 
                  }} 
                />
                <Bar dataKey="pending" name="Pending Tasks" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="completed" name="Done" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
            <span>Showing top 5 contributors</span>
            <button onClick={() => navigate('/team')} className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
              View All Team →
            </button>
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
              Upcoming Deadlines
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Tasks due in the next few days</p>
          </div>

          <div className="space-y-2.5 overflow-y-auto max-h-56 pr-1">
            {upcomingDeadlines.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No impending deadlines.</p>
            ) : (
              upcomingDeadlines.map((t) => (
                <div
                  key={t._id}
                  onClick={() => navigate(`/projects/${t.projectId?._id || t.projectId}/board`)}
                  className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors cursor-pointer flex items-center justify-between text-xs"
                >
                  <div className="min-w-0 pr-2">
                    <p className="font-medium text-slate-900 dark:text-white truncate">
                      {t.title}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {t.projectId?.name || 'Project'}
                    </p>
                  </div>
                  <span className="shrink-0 flex items-center gap-1 font-mono text-[11px] text-cyan-600 dark:text-cyan-400 font-semibold">
                    <Calendar className="w-3 h-3" />
                    {format(new Date(t.dueDate), 'MMM d')}
                  </span>
                </div>
              ))
            )}
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-right">
            <button 
              onClick={() => navigate('/projects')}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Browse all projects →
            </button>
          </div>
        </div>
      </div>

      {/* Active Projects Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Active Projects
          </h2>
          <button
            onClick={() => navigate('/projects')}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>View All ({projects.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.slice(0, 3).map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      </div>

      {/* Recent Activity Feed (PRD #22) */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-500" />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Recent Activity Timeline
            </h3>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">Live Team Actions</span>
        </div>

        <div className="space-y-3">
          {recentActivity.length === 0 ? (
            <p className="text-xs text-slate-500 py-4 text-center">No recent activity logged.</p>
          ) : (
            recentActivity.slice(0, 6).map((item, idx) => (
              <div
                key={idx}
                className="flex items-start justify-between gap-4 text-xs py-2 border-b border-slate-200 dark:border-slate-800/60 last:border-0"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-2 h-2 rounded-full bg-cyan-500 shrink-0" />
                  <span className="text-slate-900 dark:text-white font-medium">
                    {item.action}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 truncate">
                    in <span className="text-slate-700 dark:text-slate-300 font-semibold">{item.projectName}</span>
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap">
                  {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

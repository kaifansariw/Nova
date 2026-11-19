import React, { useState, useEffect } from 'react';
import {
  Kanban,
  BarChart3,
  Users,
  FolderKanban,
  CheckCircle2,
  Clock,
  AlertCircle,
  Play,
  Pause,
  ArrowRight,
  Sparkles,
  Tag,
  MessageSquare,
  Paperclip,
  Plus,
  ChevronRight,
  TrendingUp,
  Layers,
  Search,
  Check
} from 'lucide-react';

export const RunningMockups = () => {
  const [activeTab, setActiveTab] = useState('kanban'); // 'kanban' | 'analytics' | 'collab' | 'projects'
  const [autoPlay, setAutoPlay] = useState(true);

  // Kanban running state simulation
  const [kanbanTasks, setKanbanTasks] = useState([
    {
      id: 'task-1',
      title: 'Architect JWT refresh token rotation with HTTP-only cookies',
      status: 'inProgress',
      priority: 'critical',
      tag: 'Security',
      assignee: 'Alex R.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80',
      comments: 6,
      subtasks: '3/4'
    },
    {
      id: 'task-2',
      title: 'Build Drag & Drop Kanban column reordering engine',
      status: 'review',
      priority: 'high',
      tag: 'Frontend',
      assignee: 'Elena R.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80',
      comments: 3,
      subtasks: '5/5'
    },
    {
      id: 'task-3',
      title: 'Setup automated Render deployment blueprint & MongoDB Atlas sync',
      status: 'done',
      priority: 'medium',
      tag: 'DevOps',
      assignee: 'Marcus C.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80',
      comments: 4,
      subtasks: '2/2'
    },
    {
      id: 'task-4',
      title: 'Design Dark & Light mode WCAG AA accessible color palette',
      status: 'todo',
      priority: 'high',
      tag: 'Design',
      assignee: 'Sarah C.',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&auto=format&fit=crop&q=80',
      comments: 1,
      subtasks: '1/3'
    }
  ]);

  const [activeTaskStep, setActiveTaskStep] = useState(0);
  const [highlightedTaskId, setHighlightedTaskId] = useState(null);

  // Auto-play simulation cycle
  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      // Simulate task movement in Kanban
      setKanbanTasks((prev) => {
        const statuses = ['todo', 'inProgress', 'review', 'done'];
        return prev.map((task, idx) => {
          if (idx === activeTaskStep % prev.length) {
            setHighlightedTaskId(task.id);
            const currentIdx = statuses.indexOf(task.status);
            const nextStatus = statuses[(currentIdx + 1) % statuses.length];
            return { ...task, status: nextStatus };
          }
          return task;
        });
      });

      setActiveTaskStep((s) => s + 1);
    }, 3200);

    return () => clearInterval(interval);
  }, [autoPlay, activeTaskStep]);

  // Tab definitions
  const tabs = [
    { id: 'kanban', name: 'Interactive Kanban Board', icon: Kanban, badge: 'Live Workflow' },
    { id: 'analytics', name: 'Real-Time Velocity & Metrics', icon: BarChart3, badge: 'Insights' },
    { id: 'collab', name: 'Team Collaboration & Detail', icon: Users, badge: 'Discussions' },
    { id: 'projects', name: 'Multi-Project Workspaces', icon: FolderKanban, badge: 'Portfolio' },
  ];

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'critical':
        return <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20">Critical</span>;
      case 'high':
        return <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">High</span>;
      case 'medium':
        return <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">Medium</span>;
      default:
        return <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-500/10 text-slate-500 border border-slate-500/20">Low</span>;
    }
  };

  return (
    <div id="mockups" className="w-full py-16 scroll-mt-20">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 px-4">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          See What You Can Build & Ship
        </h2>
        <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400">
          Experience Nova-Team’s live execution engine. Watch cards transition across sprint stages, explore real-time telemetry, and inspect team velocity.
        </p>

        {/* Feature Tab Switcher & Auto-Play Toggle */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-102'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60 border border-slate-200 dark:border-slate-700/80'
                  }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.name}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                  }`}>
                  {tab.badge}
                </span>
              </button>
            );
          })}

          <button
            onClick={() => setAutoPlay(!autoPlay)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${autoPlay
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700'
              }`}
            title={autoPlay ? 'Pause Live Simulation' : 'Resume Live Simulation'}
          >
            {autoPlay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{autoPlay ? 'Live Demo Running' : 'Paused'}</span>
          </button>
        </div>
      </div>

      {/* Main Mockup Window Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-2xl overflow-hidden bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-2xl transition-all">

          {/* Mockup macOS Window Titlebar */}
          <div className="h-11 px-4 bg-slate-100/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Sprint Active</span>
            </div>
          </div>

          {/* Mockup Content Body */}
          <div className="p-4 sm:p-6 md:p-8 min-h-[460px]">
            {/* 1. KANBAN MOCKUP */}
            {activeTab === 'kanban' && (
              <div className="space-y-6 animate-fade-in">
                {/* Board Subheader */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>Sprint 24: Core Architecture</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
                        8 Days Left
                      </span>
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">Live Stage Transitioning</span>
                    <button
                      onClick={() => {
                        setKanbanTasks((prev) => {
                          const statuses = ['todo', 'inProgress', 'review', 'done'];
                          return prev.map((t) => ({
                            ...t,
                            status: statuses[(statuses.indexOf(t.status) + 1) % statuses.length]
                          }));
                        });
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-500 transition-colors cursor-pointer"
                    >
                      <span>Simulate Move</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* 4 Kanban Columns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { key: 'todo', label: 'To Do', color: 'border-slate-400 text-slate-600 dark:text-slate-400' },
                    { key: 'inProgress', label: 'In Progress', color: 'border-blue-500 text-blue-600 dark:text-blue-400' },
                    { key: 'review', label: 'In Review', color: 'border-amber-500 text-amber-600 dark:text-amber-400' },
                    { key: 'done', label: 'Done', color: 'border-emerald-500 text-emerald-600 dark:text-emerald-400' }
                  ].map((col) => {
                    const colTasks = kanbanTasks.filter((t) => t.status === col.key);
                    return (
                      <div
                        key={col.key}
                        className="rounded-xl p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 flex flex-col min-h-[300px]"
                      >
                        {/* Column Header */}
                        <div className="flex items-center justify-between mb-3 px-1">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full border-2 ${col.color}`} />
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                              {col.label}
                            </span>
                          </div>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            {colTasks.length}
                          </span>
                        </div>

                        {/* Cards in column */}
                        <div className="space-y-2.5 flex-1">
                          {colTasks.map((task) => {
                            const isJustMoved = highlightedTaskId === task.id;
                            return (
                              <div
                                key={task.id}
                                className={`rounded-xl p-3 bg-white dark:bg-[#1E293B] border transition-all duration-300 shadow-sm ${isJustMoved
                                  ? 'border-blue-500 ring-2 ring-blue-500/30 scale-[1.02]'
                                  : 'border-slate-200 dark:border-slate-700/80 hover:border-blue-500/60'
                                  }`}
                              >
                                <div className="flex items-center justify-between gap-1 mb-2">
                                  <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                                    {task.tag}
                                  </span>
                                  {getPriorityBadge(task.priority)}
                                </div>
                                <h4 className="text-xs font-semibold text-slate-900 dark:text-white mb-3 line-clamp-2 leading-relaxed">
                                  {task.title}
                                </h4>

                                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                                  <div className="flex items-center gap-1.5">
                                    <img
                                      src={task.avatar}
                                      alt={task.assignee}
                                      className="w-5 h-5 rounded-full object-cover ring-1 ring-slate-300 dark:ring-slate-700"
                                    />
                                    <span className="truncate max-w-[70px]">{task.assignee}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="flex items-center gap-0.5">
                                      <CheckCircle2 className="w-3 h-3 text-cyan-500" />
                                      {task.subtasks}
                                    </span>
                                    <span className="flex items-center gap-0.5">
                                      <MessageSquare className="w-3 h-3 text-slate-400" />
                                      {task.comments}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}

                          {colTasks.length === 0 && (
                            <div className="h-28 rounded-lg border border-dashed border-slate-300 dark:border-slate-800 flex items-center justify-center text-xs text-slate-400">
                              Drop task here
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 2. ANALYTICS & VELOCITY MOCKUP */}
            {activeTab === 'analytics' && (
              <div className="space-y-6 animate-fade-in">
                {/* Metric Summary Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: 'Sprint Velocity', value: '48 pts', change: '+18% vs avg', up: true },
                    { label: 'On-Time Delivery', value: '94.2%', change: '+4.5% improvement', up: true },
                    { label: 'Completed Deliverables', value: '38 tasks', change: '8 left in review', up: true },
                    { label: 'Blocked / Overdue', value: '1 task', change: 'Addressed in standup', up: false },
                  ].map((stat, i) => (
                    <div key={i} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                      <span className="text-xs uppercase font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                        {stat.label}
                      </span>
                      <span className="text-2xl font-black text-slate-900 dark:text-white font-mono block">
                        {stat.value}
                      </span>
                      <span className={`text-[11px] font-medium flex items-center gap-1 mt-1 ${stat.up ? 'text-emerald-500' : 'text-amber-500'
                        }`}>
                        <TrendingUp className="w-3 h-3" />
                        {stat.change}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Simulated Chart & Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Burndown Bar Mockup */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-3">
                      Weekly Burndown Rate
                    </h4>
                    <div className="space-y-3">
                      {[
                        { day: 'Mon', target: 50, actual: 48 },
                        { day: 'Tue', target: 40, actual: 38 },
                        { day: 'Wed', target: 30, actual: 27 },
                        { day: 'Thu', target: 20, actual: 16 },
                        { day: 'Fri (Today)', target: 10, actual: 8 },
                      ].map((item, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                            <span>{item.day}</span>
                            <span className="font-mono text-cyan-600 dark:text-cyan-400 font-bold">{item.actual} tasks left</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-700"
                              style={{ width: `${100 - (item.actual / 50) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Workload Allocation per Member */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-3">
                      Contributor Workload Balance
                    </h4>
                    <div className="space-y-3.5">
                      {[
                        { name: 'Alex Rivera (Owner)', tasks: 9, capacity: '85%', color: 'bg-blue-500' },
                        { name: 'Elena Rostova (Admin)', tasks: 12, capacity: '92%', color: 'bg-cyan-500' },
                        { name: 'Marcus Chen (Member)', tasks: 7, capacity: '70%', color: 'bg-emerald-500' },
                        { name: 'Sarah Connor (Member)', tasks: 10, capacity: '80%', color: 'bg-amber-500' },
                      ].map((m, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${m.color}`} />
                            <span className="font-medium text-slate-800 dark:text-slate-200">{m.name}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-slate-500 dark:text-slate-400">{m.tasks} tasks</span>
                            <span className="font-semibold text-cyan-600 dark:text-cyan-400 font-mono">{m.capacity}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. TEAM COLLABORATION MOCKUP */}
            {activeTab === 'collab' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 animate-fade-in">
                {/* Left: Task Details Card */}
                <div className="md:col-span-2 p-5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500">
                        TASK-104
                      </span>
                      <span className="text-xs uppercase font-bold text-rose-500">Critical Priority</span>
                    </div>
                    <span className="text-xs text-slate-500">Due Nov 28</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Implement real-time task sync & role-based permissions matrix
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Ensure owners, admins, and members have correctly scoped CRUD capabilities on project resources, task status transitions, and invite generation.
                  </p>

                  {/* Checklist */}
                  <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">Subtasks (3 of 4 completed)</span>
                    {[
                      { text: 'Define RBAC middleware routes in Express', done: true },
                      { text: 'Add optimistic UI mutation in Zustand projectStore', done: true },
                      { text: 'Render role badge & permissions modal in Team tab', done: true },
                      { text: 'Unit tests for unauthorized privilege escalation', done: false }
                    ].map((st, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <span className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${st.done ? 'bg-blue-600 text-white' : 'border border-slate-400 dark:border-slate-600'
                          }`}>
                          {st.done && <Check className="w-3 h-3" />}
                        </span>
                        <span className={st.done ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-300'}>
                          {st.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Simulated Real-time Activity Stream */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-blue-500" />
                      <span>Live Activity Stream</span>
                    </h4>

                    <div className="space-y-3">
                      {[
                        { author: 'Elena R.', action: 'marked subtask #3 complete', time: '2m ago' },
                        { author: 'Marcus C.', action: 'attached design-tokens.json', time: '14m ago' },
                        { author: 'Alex R.', action: 'changed status to In Review', time: '45m ago' },
                        { author: 'Sarah C.', action: 'commented: "Tested in dark mode, looks solid"', time: '1h ago' }
                      ].map((act, i) => (
                        <div key={i} className="text-xs pb-2 border-b border-slate-200/60 dark:border-slate-800/60 last:border-none">
                          <p className="text-slate-800 dark:text-slate-200">
                            <span className="font-semibold text-blue-600 dark:text-blue-400">{act.author}</span> {act.action}
                          </p>
                          <span className="text-[10px] text-slate-400">{act.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Add comment..."
                      className="w-full text-xs px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none"
                      readOnly
                      value="Ready for staging deployment! 🚀"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 4. WORKSPACES PORTFOLIO MOCKUP */}
            {activeTab === 'projects' && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Active Projects Portfolio</h3>
                  <span className="text-xs text-slate-500">3 Workspaces Active</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    {
                      name: 'Nova Mobile Client',
                      status: 'active',
                      desc: 'iOS and Android client written in React Native with full offline sync.',
                      progress: 82,
                      tasks: '28/34'
                    },
                    {
                      name: 'Cloud Infrastructure v2',
                      status: 'active',
                      desc: 'Kubernetes orchestration, Redis caching tier, and automated MongoDB backups.',
                      progress: 64,
                      tasks: '16/25'
                    },
                    {
                      name: 'Design System & Tokens',
                      status: 'completed',
                      desc: 'Tailwind CSS token definitions, accessible icon sets, and micro-interactions.',
                      progress: 100,
                      tasks: '20/20'
                    }
                  ].map((p, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-sm">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{p.name}</h4>
                          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${p.status === 'completed'
                            ? 'bg-emerald-500/10 text-emerald-500'
                            : 'bg-blue-500/10 text-blue-500'
                            }`}>
                            {p.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">{p.desc}</p>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500">Progress</span>
                          <span className="font-bold text-cyan-600 dark:text-cyan-400 font-mono">{p.progress}%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                            style={{ width: `${p.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Mockup Footer Ribbon */}
          <div className="p-3 px-6 bg-slate-100/90 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Zero Latency Optimistic State</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-blue-500" />
                <span>Drag & Drop Physics Engine</span>
              </span>
            </div>

            <span className="text-slate-400">
              Auto-demo loops through live stage transitions every 3.2s
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};


import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  UserX, 
  CheckCircle2, 
  Clock, 
  Mail,
  Building,
  ArrowRight
} from 'lucide-react';
import { useProjectStore } from '../store/projectStore';
import { useAuthStore } from '../store/authStore';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { InviteMemberModal } from '../components/team/InviteMemberModal';
import api from '../utils/api';

export const TeamPage = () => {
  const { currentProject, projects, fetchProject } = useProjectStore();
  const { user } = useAuthStore();

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState('');

  useEffect(() => {
    if (currentProject?._id) {
      setSelectedProjectId(currentProject._id);
    } else if (projects.length > 0) {
      setSelectedProjectId(projects[0]._id);
    }
  }, [currentProject, projects]);

  const loadTeamMembers = async (projId) => {
    if (!projId) return;
    try {
      setLoading(true);
      const res = await api.get(`/projects/${projId}/members`);
      setMembers(res.data.members || []);
    } catch (err) {
      console.error('Failed to load members:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedProjectId) {
      loadTeamMembers(selectedProjectId);
    }
  }, [selectedProjectId]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.patch(`/projects/${selectedProjectId}/members/${userId}/role`, { role: newRole });
      loadTeamMembers(selectedProjectId);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update role');
    }
  };

  const handleRemoveMember = async (userId, memberName) => {
    if (window.confirm(`Are you sure you want to remove ${memberName} from this project?`)) {
      try {
        await api.delete(`/projects/${selectedProjectId}/members/${userId}`);
        loadTeamMembers(selectedProjectId);
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to remove member');
      }
    }
  };

  const activeProjectObj = projects.find((p) => p._id === selectedProjectId);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Team & Workload
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Manage contributors, access permissions, and monitor task balance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Project selector */}
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="text-xs sm:text-sm rounded-xl py-2 px-3 bg-white dark:bg-[#1E293B] text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700/80 focus:outline-none focus:border-blue-500 cursor-pointer shadow-sm"
          >
            {projects.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => setIsInviteOpen(true)}
            disabled={!selectedProjectId}
            className="inline-flex items-center gap-1.5 py-2 px-3.5 rounded-xl text-xs font-semibold
              bg-[#3B82F6] hover:bg-blue-600 text-white shadow-sm hover:shadow-glow-primary transition-all cursor-pointer disabled:opacity-50"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Invite Member</span>
          </button>
        </div>
      </div>

      {/* Team Member Cards Grid */}
      {loading ? (
        <LoadingSpinner size="lg" className="h-64" />
      ) : members.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-transparent">
          <Users className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
            No members in this project yet
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Invite colleagues via email to start delegating tasks.
          </p>
          <button
            onClick={() => setIsInviteOpen(true)}
            className="py-2 px-4 rounded-xl text-xs font-semibold bg-[#3B82F6] text-white shadow-sm"
          >
            Invite First Teammate
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {members.map((m, idx) => {
            const u = m.user;
            if (!u) return null;
            const isSelf = u._id === user?.id;

            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
              >
                <div>
                  {/* Top user header */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      {u.avatarUrl ? (
                        <img
                          src={u.avatarUrl}
                          alt={u.name}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-300 dark:border-slate-700"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 text-white flex items-center justify-center font-bold text-lg">
                          {u.name?.charAt(0) || 'U'}
                        </div>
                      )}
                      <div className="min-w-0">
                        <h4 className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                          {u.name} {isSelf && <span className="text-[10px] text-blue-500 font-normal">(You)</span>}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate flex items-center gap-1">
                          <Mail className="w-3 h-3 shrink-0" />
                          {u.email}
                        </p>
                      </div>
                    </div>

                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                      m.role === 'owner' 
                        ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                        : m.role === 'admin'
                        ? 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30'
                        : 'bg-slate-100 text-slate-700 dark:bg-slate-700/60 dark:text-slate-300'
                    }`}>
                      {m.role}
                    </span>
                  </div>

                  {/* Workload Stats (PRD #21) */}
                  <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-center mb-4">
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-slate-500 dark:text-slate-400 block">Total</span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {m.taskStats?.total || 0}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-blue-600 dark:text-blue-400 block">Pending</span>
                      <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                        {m.taskStats?.pending || 0}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-emerald-600 dark:text-emerald-400 block">Done</span>
                      <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                        {m.taskStats?.completed || 0}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Role Changer & Member Removal */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2 text-xs">
                  {m.role !== 'owner' ? (
                    <div className="flex items-center gap-2 w-full justify-between">
                      <select
                        value={m.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        className="text-xs rounded-lg py-1 px-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 focus:outline-none"
                      >
                        <option value="member">Member</option>
                        <option value="admin">Admin</option>
                      </select>

                      <button
                        onClick={() => handleRemoveMember(u._id, u.name)}
                        className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:text-rose-400 dark:hover:bg-rose-500/10 p-1 rounded transition-colors"
                        title="Remove member"
                      >
                        <UserX className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-[11px] text-slate-400 italic">Project Owner</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Invite Modal */}
      {selectedProjectId && (
        <InviteMemberModal
          isOpen={isInviteOpen}
          onClose={() => setIsInviteOpen(false)}
          projectId={selectedProjectId}
          onMemberInvited={() => loadTeamMembers(selectedProjectId)}
        />
      )}
    </div>
  );
};

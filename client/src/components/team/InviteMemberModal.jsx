import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import api from '../../utils/api';

export const InviteMemberModal = ({ isOpen, onClose, projectId, onMemberInvited }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('member');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Email address is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post(`/projects/${projectId}/members`, {
        email: email.trim().toLowerCase(),
        name: name.trim(),
        role
      });

      setLoading(false);
      onClose();
      if (onMemberInvited) onMemberInvited(response.data.member);
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Failed to invite team member');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Invite Team Member">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-xs bg-rose-50 dark:bg-rose-500/15 border border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-400 rounded-lg">
            {error}
          </div>
        )}

        <Input
          label="Email Address"
          type="email"
          placeholder="colleague@nova.team"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          label="Name (Optional)"
          placeholder="e.g. Jordan Miller"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div>
          <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">
            Project Role
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full rounded-lg text-sm bg-white dark:bg-[#1E293B] text-slate-900 dark:text-[#F8FAFC] border border-slate-300 dark:border-slate-700 focus:border-[#3B82F6] focus:outline-none p-2.5"
          >
            <option value="member">Member (Can view and update assigned tasks)</option>
            <option value="admin">Admin (Can manage project, tasks, and members)</option>
            <option value="owner">Owner (Full control)</option>
          </select>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700/60">
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            Send Invitation
          </Button>
        </div>
      </form>
    </Modal>
  );
};

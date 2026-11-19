import React, { useState } from 'react';
import { 
  User, 
  Building, 
  Mail, 
  Moon, 
  Sun, 
  Bell, 
  ShieldCheck, 
  Check, 
  Palette,
  Sparkles
} from 'lucide-react';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';

export const SettingsPage = () => {
  const { user, updateProfile } = useAuthStore();
  const { theme, setTheme } = useThemeStore();

  const [name, setName] = useState(user?.name || '');
  const [organization, setOrganization] = useState(user?.organization || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [notifyTaskAssign, setNotifyTaskAssign] = useState(true);
  const [notifyComments, setNotifyComments] = useState(true);
  const [notifyDeadlineDigest, setNotifyDeadlineDigest] = useState(false);

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);
    setErrorMessage('');

    const res = await updateProfile({
      name: name.trim(),
      organization: organization.trim(),
      avatarUrl: avatarUrl.trim()
    });

    setSaving(false);
    if (res.success) {
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } else {
      setErrorMessage(res.error);
    }
  };

  return (
    <div className="max-w-4xl space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Settings & Preferences
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
          Customize your workspace experience, themes, and personal account details.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-sm flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Profile preferences saved successfully!</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-500/15 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-400 text-sm">
          {errorMessage}
        </div>
      )}

      {/* Profile Section */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <User className="w-4 h-4 text-blue-500" />
          Profile Information
        </h2>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="flex items-center gap-4 mb-4">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Avatar"
                className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-300 dark:border-slate-700"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 text-white flex items-center justify-center font-bold text-2xl">
                {name?.charAt(0) || 'U'}
              </div>
            )}
            <div className="flex-1">
              <Input
                label="Avatar Image URL"
                placeholder="https://..."
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <Input
              label="Organization / Company"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-400">
              Email Address (Account identifier)
            </label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full rounded-lg text-sm bg-slate-100 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 p-2.5 cursor-not-allowed"
            />
          </div>

          <div className="pt-2">
            <Button type="submit" variant="primary" loading={saving}>
              Save Profile
            </Button>
          </div>
        </form>
      </div>

      {/* Theme Appearance Section (PRD #24, #25, #26) */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
          <Palette className="w-4 h-4 text-cyan-500" />
          Theme Appearance
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
          Choose between dark mode (default #0F172A) or light mode (#F8FAFC) adhering to WCAG 2.1 AA standards.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Dark Theme Card */}
          <div
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
              theme === 'dark'
                ? 'border-blue-500 bg-slate-900 ring-2 ring-blue-500/20'
                : 'border-slate-200 dark:border-slate-800 bg-slate-800/20 dark:bg-slate-900/40 opacity-70 hover:opacity-100'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Moon className="w-4 h-4 text-cyan-400" />
                Dark Theme (Default)
              </span>
              {theme === 'dark' && <Check className="w-4 h-4 text-blue-500" />}
            </div>
            <div className="h-16 rounded-lg bg-[#0F172A] border border-slate-800 p-2 flex gap-2 items-center">
              <div className="w-8 h-8 rounded bg-[#1E293B] border border-slate-700" />
              <div className="flex-1 space-y-1">
                <div className="w-16 h-2 rounded bg-blue-500" />
                <div className="w-24 h-1.5 rounded bg-slate-600" />
              </div>
            </div>
          </div>

          {/* Light Theme Card */}
          <div
            onClick={() => setTheme('light')}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
              theme === 'light'
                ? 'border-blue-500 bg-blue-50/50 ring-2 ring-blue-500/20 text-slate-900'
                : 'border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/40 opacity-70 hover:opacity-100 text-slate-900 dark:text-white'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-500" />
                Light Theme
              </span>
              {theme === 'light' && <Check className="w-4 h-4 text-blue-600" />}
            </div>
            <div className="h-16 rounded-lg bg-[#F8FAFC] border border-slate-300 p-2 flex gap-2 items-center">
              <div className="w-8 h-8 rounded bg-white border border-slate-300 shadow-sm" />
              <div className="flex-1 space-y-1">
                <div className="w-16 h-2 rounded bg-blue-600" />
                <div className="w-24 h-1.5 rounded bg-slate-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Bell className="w-4 h-4 text-amber-500" />
          Notification Preferences
        </h2>

        <div className="space-y-4 text-sm">
          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 cursor-pointer">
            <div>
              <p className="font-medium text-slate-900 dark:text-white">Task Assignments</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Receive alert when assigned to a task</p>
            </div>
            <input
              type="checkbox"
              checked={notifyTaskAssign}
              onChange={(e) => setNotifyTaskAssign(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 dark:border-slate-700 focus:ring-blue-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 cursor-pointer">
            <div>
              <p className="font-medium text-slate-900 dark:text-white">Comment Threads</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Notify when someone comments on your tasks</p>
            </div>
            <input
              type="checkbox"
              checked={notifyComments}
              onChange={(e) => setNotifyComments(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 dark:border-slate-700 focus:ring-blue-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 cursor-pointer">
            <div>
              <p className="font-medium text-slate-900 dark:text-white">Upcoming Deadline Digest</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Daily summary of tasks due within 48 hours</p>
            </div>
            <input
              type="checkbox"
              checked={notifyDeadlineDigest}
              onChange={(e) => setNotifyDeadlineDigest(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 dark:border-slate-700 focus:ring-blue-500"
            />
          </label>
        </div>
      </div>
    </div>
  );
};

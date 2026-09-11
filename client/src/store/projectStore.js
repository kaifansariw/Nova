import { create } from 'zustand';
import api from '../utils/api';

export const useProjectStore = create((set, get) => ({
  projects: [],
  currentProject: null,
  tasks: [],
  isLoadingProjects: false,
  isLoadingCurrentProject: false,
  error: null,

  fetchProjects: async (params = {}) => {
    set({ isLoadingProjects: true, error: null });
    try {
      const response = await api.get('/projects', { params });
      set({
        projects: response.data.projects,
        isLoadingProjects: false
      });
      return response.data;
    } catch (err) {
      set({
        isLoadingProjects: false,
        error: err.response?.data?.message || 'Failed to load projects'
      });
    }
  },

  fetchProject: async (projectId) => {
    set({ isLoadingCurrentProject: true, error: null });
    try {
      const response = await api.get(`/projects/${projectId}`);
      set({
        currentProject: response.data.project,
        tasks: response.data.tasks,
        isLoadingCurrentProject: false
      });
      return response.data;
    } catch (err) {
      set({
        isLoadingCurrentProject: false,
        error: err.response?.data?.message || 'Failed to load project details'
      });
    }
  },

  createProject: async (projectData) => {
    try {
      const response = await api.post('/projects', projectData);
      const newProject = response.data.project;
      set((state) => ({
        projects: [newProject, ...state.projects]
      }));
      return { success: true, project: newProject };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || 'Failed to create project'
      };
    }
  },

  updateProject: async (projectId, projectData) => {
    try {
      const response = await api.put(`/projects/${projectId}`, projectData);
      const updated = response.data.project;
      set((state) => ({
        projects: state.projects.map((p) => (p._id === projectId ? updated : p)),
        currentProject: state.currentProject?._id === projectId ? updated : state.currentProject
      }));
      return { success: true, project: updated };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || 'Failed to update project'
      };
    }
  },

  deleteProject: async (projectId) => {
    try {
      await api.delete(`/projects/${projectId}`);
      set((state) => ({
        projects: state.projects.filter((p) => p._id !== projectId),
        currentProject: state.currentProject?._id === projectId ? null : state.currentProject
      }));
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || 'Failed to delete project'
      };
    }
  },

  // Task methods
  createTask: async (projectId, taskData) => {
    try {
      const response = await api.post(`/projects/${projectId}/tasks`, taskData);
      const newTask = response.data.task;
      set((state) => ({
        tasks: [...state.tasks, newTask]
      }));
      return { success: true, task: newTask };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || 'Failed to create task'
      };
    }
  },

  updateTaskStatusOptimistic: async (taskId, newStatus, newOrder) => {
    const prevTasks = get().tasks;
    // Optimistic UI update
    set({
      tasks: prevTasks.map((t) =>
        t._id === taskId ? { ...t, status: newStatus, order: newOrder ?? t.order } : t
      )
    });

    try {
      await api.patch(`/tasks/${taskId}/status`, { status: newStatus, order: newOrder });
    } catch (err) {
      // Revert if API call fails
      console.error('Failed to persist task status update:', err);
      set({ tasks: prevTasks });
    }
  },

  updateTaskDetails: async (taskId, updateData) => {
    try {
      const response = await api.put(`/tasks/${taskId}`, updateData);
      const updatedTask = response.data.task;
      set((state) => ({
        tasks: state.tasks.map((t) => (t._id === taskId ? updatedTask : t))
      }));
      return { success: true, task: updatedTask };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || 'Failed to update task'
      };
    }
  },

  archiveTask: async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      set((state) => ({
        tasks: state.tasks.filter((t) => t._id !== taskId)
      }));
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || 'Failed to archive task'
      };
    }
  },

  addCommentToTask: async (taskId, text) => {
    try {
      const response = await api.post(`/tasks/${taskId}/comments`, { text });
      const newComment = response.data.comment;
      set((state) => ({
        tasks: state.tasks.map((t) => {
          if (t._id === taskId) {
            return {
              ...t,
              comments: [...(t.comments || []), newComment]
            };
          }
          return t;
        })
      }));
      return { success: true, comment: newComment };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || 'Failed to add comment'
      };
    }
  }
}));

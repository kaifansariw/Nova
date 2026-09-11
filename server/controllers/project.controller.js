import { Project } from '../models/Project.js';
import { Task } from '../models/Task.js';
import { User } from '../models/User.js';

export const getProjects = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const userId = req.user._id;

    // Filter projects where user is owner or member
    const filter = {
      $or: [{ owner: userId }, { 'members.userId': userId }]
    };

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Project.countDocuments(filter);

    const projects = await Project.find(filter)
      .populate('owner', 'name email avatarUrl')
      .populate('members.userId', 'name email avatarUrl role')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Enrich projects with task stats
    const enrichedProjects = await Promise.all(
      projects.map(async (project) => {
        const tasks = await Task.find({ projectId: project._id, isArchived: false }).select('status priority dueDate');
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(t => t.status === 'done').length;
        const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
        const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        return {
          ...project,
          taskStats: {
            total: totalTasks,
            completed: completedTasks,
            inProgress: inProgressTasks,
            progressPercentage
          }
        };
      })
    );

    res.json({
      projects: enrichedProjects,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    next(error);
  }
};

export const createProject = async (req, res, next) => {
  try {
    const { name, description, startDate, deadline, coverImageUrl } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Project name is required.' });
    }

    const project = await Project.create({
      name,
      description: description || '',
      owner: req.user._id,
      coverImageUrl: coverImageUrl || '',
      startDate: startDate || new Date(),
      deadline: deadline || null,
      members: [
        {
          userId: req.user._id,
          role: 'owner',
          joinedAt: new Date()
        }
      ]
    });

    const populatedProject = await Project.findById(project._id)
      .populate('owner', 'name email avatarUrl')
      .populate('members.userId', 'name email avatarUrl');

    res.status(201).json({ project: populatedProject });
  } catch (error) {
    next(error);
  }
};

export const getProjectById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id)
      .populate('owner', 'name email avatarUrl')
      .populate('members.userId', 'name email avatarUrl');

    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    // Check user membership or ownership
    const isOwner = project.owner._id.toString() === req.user._id.toString();
    const isMember = project.members.some(m => m.userId && m.userId._id.toString() === req.user._id.toString());

    if (!isOwner && !isMember) {
      return res.status(403).json({ message: 'You do not have access to this project.' });
    }

    const tasks = await Task.find({ projectId: id, isArchived: false })
      .populate('assignees', 'name email avatarUrl')
      .populate('createdBy', 'name email avatarUrl')
      .sort({ order: 1, createdAt: -1 });

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'done').length;
    const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    res.json({
      project: {
        ...project.toObject(),
        taskStats: {
          total: totalTasks,
          completed: completedTasks,
          todo: tasks.filter(t => t.status === 'todo').length,
          inProgress: tasks.filter(t => t.status === 'in-progress').length,
          review: tasks.filter(t => t.status === 'review').length,
          progressPercentage
        }
      },
      tasks
    });
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, deadline, status, coverImageUrl } = req.body;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    // Check permissions
    const isOwner = project.owner.toString() === req.user._id.toString();
    const memberObj = project.members.find(m => m.userId.toString() === req.user._id.toString());
    const isAdmin = memberObj && (memberObj.role === 'admin' || memberObj.role === 'owner');

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'You do not have permission to edit this project.' });
    }

    if (name) project.name = name;
    if (description !== undefined) project.description = description;
    if (deadline !== undefined) project.deadline = deadline;
    if (status) project.status = status;
    if (coverImageUrl !== undefined) project.coverImageUrl = coverImageUrl;

    await project.save();

    const updated = await Project.findById(id)
      .populate('owner', 'name email avatarUrl')
      .populate('members.userId', 'name email avatarUrl');

    res.json({ project: updated });
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the project owner can delete this project.' });
    }

    // Cascade delete tasks
    await Task.deleteMany({ projectId: id });
    await Project.findByIdAndDelete(id);

    res.json({ message: 'Project and all associated tasks deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

export const getDashboardMetrics = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Get all user projects
    const userProjects = await Project.find({
      $or: [{ owner: userId }, { 'members.userId': userId }]
    }).select('_id name status deadline members');

    const projectIds = userProjects.map(p => p._id);

    // Fetch all active tasks across user projects
    const tasks = await Task.find({
      projectId: { $in: projectIds },
      isArchived: false
    })
      .populate('assignees', 'name email avatarUrl')
      .populate('projectId', 'name')
      .sort({ createdAt: -1 });

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'done').length;
    const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
    const reviewTasks = tasks.filter(t => t.status === 'review').length;
    const todoTasks = tasks.filter(t => t.status === 'todo').length;

    const now = new Date();
    const overdueTasks = tasks.filter(t => t.dueDate && new Date(t.dueDate) < now && t.status !== 'done').length;

    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Workload by team member
    const workloadMap = {};
    tasks.forEach(t => {
      (t.assignees || []).forEach(assignee => {
        const id = assignee._id.toString();
        if (!workloadMap[id]) {
          workloadMap[id] = {
            id,
            name: assignee.name,
            email: assignee.email,
            avatarUrl: assignee.avatarUrl,
            total: 0,
            completed: 0,
            pending: 0,
            overdue: 0
          };
        }
        workloadMap[id].total += 1;
        if (t.status === 'done') {
          workloadMap[id].completed += 1;
        } else {
          workloadMap[id].pending += 1;
          if (t.dueDate && new Date(t.dueDate) < now) {
            workloadMap[id].overdue += 1;
          }
        }
      });
    });

    // Recent activity feed across user projects
    const recentActivities = [];
    tasks.forEach(t => {
      if (t.activityLog && t.activityLog.length > 0) {
        t.activityLog.forEach(a => {
          recentActivities.push({
            id: a._id,
            action: a.action,
            timestamp: a.timestamp,
            taskTitle: t.title,
            taskId: t._id,
            projectName: t.projectId ? t.projectId.name : 'Project'
          });
        });
      }
    });

    recentActivities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.json({
      metrics: {
        totalProjects: userProjects.length,
        activeProjects: userProjects.filter(p => p.status === 'active').length,
        totalTasks,
        completedTasks,
        inProgressTasks,
        reviewTasks,
        todoTasks,
        overdueTasks,
        completionRate
      },
      workload: Object.values(workloadMap),
      recentActivity: recentActivities.slice(0, 15),
      upcomingDeadlines: tasks
        .filter(t => t.dueDate && t.status !== 'done')
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 5)
    });
  } catch (error) {
    next(error);
  }
};

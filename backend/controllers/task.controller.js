import { Task } from '../models/Task.js';
import { Project } from '../models/Project.js';

export const getTasks = async (req, res, next) => {
  try {
    const { id: projectId } = req.params;
    const { status, priority, assignee, search, sort = 'order' } = req.query;

    const filter = { projectId, isArchived: false };

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (priority && priority !== 'all') {
      filter.priority = priority;
    }

    if (assignee && assignee !== 'all') {
      filter.assignees = assignee;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    let sortOption = { order: 1, createdAt: -1 };
    if (sort === 'dueDate') sortOption = { dueDate: 1 };
    if (sort === 'priority') sortOption = { priority: -1 };
    if (sort === 'createdAt') sortOption = { createdAt: -1 };

    const tasks = await Task.find(filter)
      .populate('assignees', 'name email avatarUrl')
      .populate('createdBy', 'name email avatarUrl')
      .populate('comments.author', 'name email avatarUrl')
      .sort(sortOption);

    res.json({ tasks, total: tasks.length });
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req, res, next) => {
  try {
    const { id: projectId } = req.params;
    const { title, description, status = 'todo', priority = 'medium', assignees = [], tags = [], dueDate } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Task title is required.' });
    }

    // Verify project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    // Count tasks in column for ordering
    const columnCount = await Task.countDocuments({ projectId, status, isArchived: false });

    const task = await Task.create({
      title,
      description: description || '',
      projectId,
      status,
      priority,
      assignees,
      tags: Array.isArray(tags) ? tags : [],
      dueDate: dueDate || null,
      createdBy: req.user._id,
      order: columnCount,
      activityLog: [
        {
          action: `Task created by ${req.user.name}`,
          performedBy: req.user._id,
          timestamp: new Date()
        }
      ]
    });

    const populatedTask = await Task.findById(task._id)
      .populate('assignees', 'name email avatarUrl')
      .populate('createdBy', 'name email avatarUrl');

    res.status(201).json({ task: populatedTask });
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id)
      .populate('assignees', 'name email avatarUrl')
      .populate('createdBy', 'name email avatarUrl')
      .populate('comments.author', 'name email avatarUrl')
      .populate('activityLog.performedBy', 'name email avatarUrl')
      .populate('projectId', 'name');

    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    res.json({ task });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority, assignees, tags, dueDate, order } = req.body;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    const changes = [];

    if (title && title !== task.title) {
      changes.push(`renamed task to "${title}"`);
      task.title = title;
    }
    if (description !== undefined && description !== task.description) {
      changes.push('updated description');
      task.description = description;
    }
    if (status && status !== task.status) {
      changes.push(`changed status from ${task.status} to ${status}`);
      task.status = status;
    }
    if (priority && priority !== task.priority) {
      changes.push(`changed priority from ${task.priority} to ${priority}`);
      task.priority = priority;
    }
    if (assignees !== undefined) {
      task.assignees = assignees;
      changes.push('updated assignees');
    }
    if (tags !== undefined) {
      task.tags = tags;
      changes.push('updated tags');
    }
    if (dueDate !== undefined) {
      task.dueDate = dueDate;
      changes.push('updated due date');
    }
    if (order !== undefined) {
      task.order = order;
    }

    if (changes.length > 0) {
      task.activityLog.push({
        action: `${req.user.name} ${changes.join(', ')}`,
        performedBy: req.user._id,
        timestamp: new Date()
      });
    }

    await task.save();

    const updatedTask = await Task.findById(id)
      .populate('assignees', 'name email avatarUrl')
      .populate('createdBy', 'name email avatarUrl')
      .populate('comments.author', 'name email avatarUrl');

    res.json({ task: updatedTask });
  } catch (error) {
    next(error);
  }
};

export const updateTaskStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, order } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required.' });
    }

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    const prevStatus = task.status;
    task.status = status;
    if (order !== undefined) task.order = order;

    task.activityLog.push({
      action: `Moved task from ${prevStatus} to ${status}`,
      performedBy: req.user._id,
      timestamp: new Date()
    });

    await task.save();

    const updatedTask = await Task.findById(id)
      .populate('assignees', 'name email avatarUrl')
      .populate('createdBy', 'name email avatarUrl');

    res.json({ task: updatedTask });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    // Soft delete per PRD Requirement #12
    task.isArchived = true;
    task.activityLog.push({
      action: `Task archived by ${req.user.name}`,
      performedBy: req.user._id,
      timestamp: new Date()
    });
    await task.save();

    res.json({ message: 'Task archived successfully.' });
  } catch (error) {
    next(error);
  }
};

export const addComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Comment text is required.' });
    }

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    const newComment = {
      author: req.user._id,
      text: text.trim(),
      createdAt: new Date()
    };

    task.comments.push(newComment);
    task.activityLog.push({
      action: `${req.user.name} commented: "${text.trim().substring(0, 30)}${text.length > 30 ? '...' : ''}"`,
      performedBy: req.user._id,
      timestamp: new Date()
    });

    await task.save();

    const populatedTask = await Task.findById(id)
      .populate('comments.author', 'name email avatarUrl');

    const addedComment = populatedTask.comments[populatedTask.comments.length - 1];

    res.status(201).json({ comment: addedComment });
  } catch (error) {
    next(error);
  }
};

export const addAttachment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { fileUrl } = req.body;

    if (!fileUrl) {
      return res.status(400).json({ message: 'Attachment URL is required.' });
    }

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    task.attachments.push(fileUrl);
    task.activityLog.push({
      action: `${req.user.name} added an attachment`,
      performedBy: req.user._id,
      timestamp: new Date()
    });

    await task.save();

    res.status(201).json({ attachments: task.attachments });
  } catch (error) {
    next(error);
  }
};

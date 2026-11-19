import { Project } from '../models/Project.js';
import { User } from '../models/User.js';
import { Task } from '../models/Task.js';

export const getProjectMembers = async (req, res, next) => {
  try {
    const { id: projectId } = req.params;

    const project = await Project.findById(projectId).populate('members.userId', 'name email avatarUrl organization');
    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    // Get task loads for all members
    const tasks = await Task.find({ projectId, isArchived: false }).select('assignees status');

    const membersWithLoad = project.members.map((member) => {
      if (!member.userId) return null;
      const memberId = member.userId._id.toString();
      const memberTasks = tasks.filter((t) =>
        t.assignees.some((a) => a.toString() === memberId)
      );

      return {
        user: member.userId,
        role: member.role,
        joinedAt: member.joinedAt,
        taskStats: {
          total: memberTasks.length,
          completed: memberTasks.filter((t) => t.status === 'done').length,
          pending: memberTasks.filter((t) => t.status !== 'done').length
        }
      };
    }).filter(Boolean);

    res.json({ members: membersWithLoad });
  } catch (error) {
    next(error);
  }
};

export const inviteMember = async (req, res, next) => {
  try {
    const { id: projectId } = req.params;
    const { email, role = 'member', name } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required to invite a member.' });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    // Find or create user
    let user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      // Create user with default password so they can log in immediately
      const defaultPassword = 'password123';
      const extractedName = name || email.split('@')[0].replace(/[._]/g, ' ');
      user = await User.create({
        name: extractedName.charAt(0).toUpperCase() + extractedName.slice(1),
        email: email.toLowerCase().trim(),
        password: defaultPassword,
        organization: project.name + ' Team',
        role: 'member'
      });
    }

    // Check if user is already a member
    const isExistingMember = project.members.some(
      (m) => m.userId && m.userId.toString() === user._id.toString()
    );

    if (isExistingMember) {
      return res.status(400).json({ message: 'User is already a member of this project.' });
    }

    project.members.push({
      userId: user._id,
      role: role || 'member',
      joinedAt: new Date()
    });

    await project.save();

    res.status(201).json({
      message: `User ${user.email} invited to the project.`,
      member: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          avatarUrl: user.avatarUrl
        },
        role,
        joinedAt: new Date(),
        taskStats: { total: 0, completed: 0, pending: 0 }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const removeMember = async (req, res, next) => {
  try {
    const { id: projectId, userId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    // Prevent removing owner
    if (project.owner.toString() === userId) {
      return res.status(400).json({ message: 'Cannot remove the project owner.' });
    }

    project.members = project.members.filter(
      (m) => m.userId && m.userId.toString() !== userId
    );

    await project.save();

    res.json({ message: 'Member removed from project successfully.' });
  } catch (error) {
    next(error);
  }
};

export const updateMemberRole = async (req, res, next) => {
  try {
    const { id: projectId, userId } = req.params;
    const { role } = req.body;

    if (!['owner', 'admin', 'member'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role specified.' });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    const member = project.members.find(
      (m) => m.userId && m.userId.toString() === userId
    );

    if (!member) {
      return res.status(404).json({ message: 'Member not found in project.' });
    }

    member.role = role;
    await project.save();

    res.json({ message: 'Member role updated successfully.', member });
  } catch (error) {
    next(error);
  }
};

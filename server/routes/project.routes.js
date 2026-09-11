import express from 'express';
import {
  getProjects,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
  getDashboardMetrics
} from '../controllers/project.controller.js';
import { getTasks, createTask } from '../controllers/task.controller.js';
import {
  getProjectMembers,
  inviteMember,
  removeMember,
  updateMemberRole
} from '../controllers/team.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.get('/dashboard/metrics', getDashboardMetrics);

router.route('/')
  .get(getProjects)
  .post(createProject);

router.route('/:id')
  .get(getProjectById)
  .put(updateProject)
  .delete(deleteProject);

// Nested task routes for a project
router.route('/:id/tasks')
  .get(getTasks)
  .post(createTask);

// Nested team routes for a project
router.route('/:id/members')
  .get(getProjectMembers)
  .post(inviteMember);

router.route('/:id/members/:userId')
  .delete(removeMember);

router.route('/:id/members/:userId/role')
  .patch(updateMemberRole);

export default router;

import express from 'express';
import {
  getTaskById,
  updateTask,
  deleteTask,
  updateTaskStatus,
  addComment,
  addAttachment
} from '../controllers/task.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.route('/:id')
  .get(getTaskById)
  .put(updateTask)
  .delete(deleteTask);

router.patch('/:id/status', updateTaskStatus);
router.post('/:id/comments', addComment);
router.post('/:id/attachments', addAttachment);

export default router;

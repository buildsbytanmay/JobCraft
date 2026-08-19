import { Router } from 'express';
import {
  generateJob,
  saveJob,
  getJobs,
  getJobById,
  deleteJob,
} from '../controllers/jobController.js';

const router = Router();

// Route: /api/jobs/generate
router.post('/generate', generateJob);

// Routes: /api/jobs
router.route('/')
  .post(saveJob)
  .get(getJobs);

// Routes: /api/jobs/:id
router.route('/:id')
  .get(getJobById)
  .delete(deleteJob);

export default router;

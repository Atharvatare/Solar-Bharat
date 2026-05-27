import { Router } from 'express';
import {
  getDashboardSummary, getAnalytics, getWeeklyEnergy, getMonthlySavings,
} from '../controllers/dashboardController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.get('/summary', getDashboardSummary);
router.get('/analytics', getAnalytics);
router.get('/energy/weekly', getWeeklyEnergy);
router.get('/savings/monthly', getMonthlySavings);

export default router;

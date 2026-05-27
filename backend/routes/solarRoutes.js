import { Router } from 'express';
import {
  calculate, rooftopAnalysis, getReports, getReport, deleteReport,
} from '../controllers/solarController.js';
import { protect } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { calculateValidator, rooftopAnalysisValidator } from '../validators/solarValidator.js';

const router = Router();

router.use(protect);

router.post('/calculate', calculateValidator, validate, calculate);
router.post('/rooftop-analysis', rooftopAnalysisValidator, validate, rooftopAnalysis);
router.get('/reports', getReports);
router.get('/reports/:id', getReport);
router.delete('/reports/:id', deleteReport);

export default router;

import { Router } from 'express';
import {
  calculate, rooftopAnalysis, getReports, getReport, deleteReport, analyzeBill, analyzeRooftopImageController
} from '../controllers/solarController.js';
import multer from 'multer';

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});
import { protect } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { calculateValidator, rooftopAnalysisValidator } from '../validators/solarValidator.js';

const router = Router();

router.use(protect);

router.post('/calculate', calculateValidator, validate, calculate);
router.post('/rooftop-analysis', rooftopAnalysisValidator, validate, rooftopAnalysis);
router.post('/analyze-bill', upload.single('bill'), analyzeBill);
router.post('/analyze-rooftop-image', upload.single('rooftopImage'), analyzeRooftopImageController);
router.get('/reports', getReports);
router.get('/reports/:id', getReport);
router.delete('/reports/:id', deleteReport);

export default router;

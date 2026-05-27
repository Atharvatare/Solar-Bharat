import { Router } from 'express';
import { uploadBill, getBills, getBill, deleteBill, upload } from '../controllers/billController.js';
import { protect } from '../middleware/auth.js';
import { uploadLimiter } from '../middleware/rateLimiter.js';
import validate from '../middleware/validate.js';
import { billUploadValidator, billQueryValidator } from '../validators/billValidator.js';

const router = Router();

router.use(protect);

router.post('/upload', uploadLimiter, upload.single('bill'), billUploadValidator, validate, uploadBill);
router.get('/', billQueryValidator, validate, getBills);
router.get('/:id', getBill);
router.delete('/:id', deleteBill);

export default router;

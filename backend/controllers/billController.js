import path from 'path';
import multer from 'multer';
import Bill from '../models/Bill.js';
import config from '../config/config.js';
import { asyncHandler, sendSuccess, sendPaginated, ApiError, getPagination } from '../utils/helpers.js';
import { HTTP_STATUS, BILL_STATUS } from '../utils/constants.js';
import { calculateSolarSystem } from '../services/solarService.js';
import { sendBillAnalyzedNotification } from '../services/notificationService.js';
import logger from '../utils/logger.js';

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.upload.path);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `bill-${req.user._id}-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ApiError(HTTP_STATUS.BAD_REQUEST, 'Invalid file type. Only PDF, JPG, PNG allowed.'), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: config.upload.maxFileSize },
});

/**
 * @desc    Upload and analyze bill
 * @route   POST /api/bills/upload
 * @access  Private
 */
export const uploadBill = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Please upload a file');
  }

  const ext = path.extname(req.file.originalname).replace('.', '').toLowerCase();

  const bill = await Bill.create({
    userId: req.user._id,
    filename: req.file.filename,
    originalName: req.file.originalname,
    fileType: ext,
    fileSize: req.file.size,
    filePath: req.file.path,
    status: BILL_STATUS.PROCESSING,
    notes: req.body.notes || '',
  });

  // Simulate AI analysis (in production, this would be async with a queue)
  setTimeout(async () => {
    try {
      const analysisResult = simulateBillAnalysis();
      const recommendation = calculateSolarSystem({
        monthlyBill: analysisResult.totalAmount,
        electricityRate: analysisResult.averageRate,
        monthlyConsumption: analysisResult.unitsConsumed,
      });

      bill.analysis = analysisResult;
      bill.recommendation = {
        systemSize: recommendation.systemSize,
        estimatedPanels: recommendation.numberOfPanels,
        estimatedSavings: recommendation.monthlySavings,
        estimatedCost: recommendation.costAfterSubsidy,
        paybackPeriod: recommendation.paybackPeriod,
        co2Savings: recommendation.co2OffsetPerYear,
      };
      bill.status = BILL_STATUS.ANALYZED;
      bill.analyzedAt = new Date();
      await bill.save();

      await sendBillAnalyzedNotification(req.user._id, bill._id, recommendation.monthlySavings);
      logger.info(`Bill analyzed: ${bill._id}`);
    } catch (err) {
      bill.status = BILL_STATUS.FAILED;
      await bill.save();
      logger.error(`Bill analysis failed: ${err.message}`);
    }
  }, 3000);

  sendSuccess(res, { bill }, 'Bill uploaded. Analysis in progress.', HTTP_STATUS.CREATED);
});

/**
 * @desc    Get all bills for user
 * @route   GET /api/bills
 * @access  Private
 */
export const getBills = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = { userId: req.user._id };

  if (req.query.status) filter.status = req.query.status;

  const [bills, total] = await Promise.all([
    Bill.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Bill.countDocuments(filter),
  ]);

  sendPaginated(res, bills, { page, limit, total });
});

/**
 * @desc    Get single bill
 * @route   GET /api/bills/:id
 * @access  Private
 */
export const getBill = asyncHandler(async (req, res) => {
  const bill = await Bill.findOne({ _id: req.params.id, userId: req.user._id });
  if (!bill) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Bill not found');
  }
  sendSuccess(res, { bill });
});

/**
 * @desc    Delete bill
 * @route   DELETE /api/bills/:id
 * @access  Private
 */
export const deleteBill = asyncHandler(async (req, res) => {
  const bill = await Bill.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!bill) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Bill not found');
  }
  sendSuccess(res, null, 'Bill deleted successfully');
});

// Simulated bill analysis (in production, use OCR/AI)
function simulateBillAnalysis() {
  return {
    provider: 'MSEDCL',
    accountNumber: `ACC${Math.floor(Math.random() * 900000 + 100000)}`,
    billingPeriod: {
      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      to: new Date(),
    },
    totalAmount: Math.round(3000 + Math.random() * 7000),
    unitsConsumed: Math.round(300 + Math.random() * 500),
    averageRate: Math.round((6 + Math.random() * 4) * 10) / 10,
    peakUsageHours: '6:00 PM - 10:00 PM',
    sanctionedLoad: Math.round(3 + Math.random() * 7),
    connectedLoad: Math.round(2 + Math.random() * 5),
  };
}

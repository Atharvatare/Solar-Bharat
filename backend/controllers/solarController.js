import SolarReport from '../models/SolarReport.js';
import { asyncHandler, sendSuccess, sendPaginated, ApiError, getPagination } from '../utils/helpers.js';
import { HTTP_STATUS } from '../utils/constants.js';
import { calculateSolarSystem, analyzeRooftop } from '../services/solarService.js';

/**
 * @desc    Calculate solar system
 * @route   POST /api/solar/calculate
 * @access  Private
 */
export const calculate = asyncHandler(async (req, res) => {
  const results = calculateSolarSystem(req.body);

  // Save report
  const report = await SolarReport.create({
    userId: req.user._id,
    reportType: 'calculator',
    status: 'completed',
    inputs: req.body,
    results,
    monthlyProjection: results.monthlyProjection,
    roiProjection: results.roiProjection,
  });

  sendSuccess(res, { report }, 'Solar calculation completed', HTTP_STATUS.CREATED);
});

/**
 * @desc    Analyze rooftop
 * @route   POST /api/solar/rooftop-analysis
 * @access  Private
 */
export const rooftopAnalysis = asyncHandler(async (req, res) => {
  const { rooftopAnalysis: roofData, recommendation } = analyzeRooftop(req.body);

  const report = await SolarReport.create({
    userId: req.user._id,
    reportType: 'rooftop_analysis',
    status: 'completed',
    inputs: req.body,
    results: recommendation,
    rooftopAnalysis: roofData,
    monthlyProjection: recommendation.monthlyProjection,
    roiProjection: recommendation.roiProjection,
  });

  sendSuccess(res, { report }, 'Rooftop analysis completed', HTTP_STATUS.CREATED);
});

/**
 * @desc    Get all reports
 * @route   GET /api/solar/reports
 * @access  Private
 */
export const getReports = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = { userId: req.user._id };

  if (req.query.type) filter.reportType = req.query.type;

  const [reports, total] = await Promise.all([
    SolarReport.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    SolarReport.countDocuments(filter),
  ]);

  sendPaginated(res, reports, { page, limit, total });
});

/**
 * @desc    Get single report
 * @route   GET /api/solar/reports/:id
 * @access  Private
 */
export const getReport = asyncHandler(async (req, res) => {
  const report = await SolarReport.findOne({ _id: req.params.id, userId: req.user._id });
  if (!report) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Report not found');
  }
  sendSuccess(res, { report });
});

/**
 * @desc    Delete report
 * @route   DELETE /api/solar/reports/:id
 * @access  Private
 */
export const deleteReport = asyncHandler(async (req, res) => {
  const report = await SolarReport.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!report) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Report not found');
  }
  sendSuccess(res, null, 'Report deleted');
});

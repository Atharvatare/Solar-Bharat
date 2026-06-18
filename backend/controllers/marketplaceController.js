import Product from '../models/Product.js';
import Vendor from '../models/Vendor.js';
import { asyncHandler, sendSuccess, sendPaginated, ApiError, getPagination } from '../utils/helpers.js';
import { HTTP_STATUS } from '../utils/constants.js';

/**
 * @desc    Get marketplace products with filters, search, and sorting
 * @route   GET /api/marketplace/products
 * @access  Public
 */
export const getMarketplaceProducts = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = { isActive: true };

  // Category filter
  if (req.query.category) {
    filter.category = req.query.category;
  }

  // Brand filter
  if (req.query.brand) {
    filter.brand = { $regex: req.query.brand, $options: 'i' };
  }

  // Price range filter
  if (req.query.minPrice || req.query.maxPrice) {
    filter['pricing.sellingPrice'] = {};
    if (req.query.minPrice) {
      filter['pricing.sellingPrice'].$gte = Number(req.query.minPrice);
    }
    if (req.query.maxPrice) {
      filter['pricing.sellingPrice'].$lte = Number(req.query.maxPrice);
    }
  }

  // Text search (uses MongoDB text index on name + brand)
  if (req.query.search) {
    filter.$text = { $search: req.query.search };
  }

  // Sorting
  let sort = { createdAt: -1 };
  switch (req.query.sort) {
    case 'price_asc':
      sort = { 'pricing.sellingPrice': 1 };
      break;
    case 'price_desc':
      sort = { 'pricing.sellingPrice': -1 };
      break;
    case 'rating':
      sort = { 'rating.average': -1 };
      break;
    case 'newest':
      sort = { createdAt: -1 };
      break;
  }

  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate('vendorId', 'companyName')
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Product.countDocuments(filter),
  ]);

  sendPaginated(res, products, { page, limit, total });
});

/**
 * @desc    Get single product with full vendor details
 * @route   GET /api/marketplace/products/:id
 * @access  Public
 */
export const getProductDetail = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id, isActive: true })
    .populate('vendorId');

  if (!product) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Product not found');
  }

  sendSuccess(res, { product });
});

/**
 * @desc    Compare up to 4 products side-by-side
 * @route   POST /api/marketplace/products/compare
 * @access  Public
 */
export const compareProducts = asyncHandler(async (req, res) => {
  const { productIds } = req.body;

  if (!productIds || !Array.isArray(productIds) || productIds.length < 2) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Provide at least 2 product IDs to compare');
  }

  if (productIds.length > 4) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Maximum 4 products can be compared at once');
  }

  const products = await Product.find({
    _id: { $in: productIds },
    isActive: true,
  }).populate('vendorId', 'companyName');

  if (products.length === 0) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'No matching products found');
  }

  sendSuccess(res, { products });
});

/**
 * @desc    Get marketplace vendors with filters
 * @route   GET /api/marketplace/vendors
 * @access  Public
 */
export const getMarketplaceVendors = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = { verified: true, isActive: true };

  // State filter
  if (req.query.state) {
    filter['address.state'] = req.query.state;
  }

  // Services offered filter
  if (req.query.servicesOffered) {
    filter.servicesOffered = { $in: req.query.servicesOffered.split(',') };
  }

  const [vendors, total] = await Promise.all([
    Vendor.find(filter)
      .select('companyName contactPerson.name address.state address.city servicesOffered rating completedProjects')
      .sort({ 'rating.average': -1 })
      .skip(skip)
      .limit(limit),
    Vendor.countDocuments(filter),
  ]);

  sendPaginated(res, vendors, { page, limit, total });
});

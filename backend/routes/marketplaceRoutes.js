import { Router } from 'express';
import {
  getMarketplaceProducts,
  getProductDetail,
  compareProducts,
  getMarketplaceVendors,
} from '../controllers/marketplaceController.js';

const router = Router();

// All marketplace routes are public (no auth required)
router.get('/products', getMarketplaceProducts);
router.post('/products/compare', compareProducts);
router.get('/products/:id', getProductDetail);
router.get('/vendors', getMarketplaceVendors);

export default router;

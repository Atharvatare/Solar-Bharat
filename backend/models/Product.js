import mongoose from 'mongoose';
import { PRODUCT_CATEGORIES } from '../utils/constants.js';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: Object.values(PRODUCT_CATEGORIES),
      required: true,
    },
    brand: {
      type: String,
      required: true,
      trim: true,
    },
    model: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      maxlength: 2000,
    },
    specifications: {
      wattage: { type: Number },
      voltage: { type: Number },
      efficiency: { type: Number },
      warranty: { type: Number },   // years
      dimensions: {
        length: Number,
        width: Number,
        height: Number,
        unit: { type: String, default: 'mm' },
      },
      weight: { type: Number },      // kg
    },
    pricing: {
      mrp: { type: Number, required: true },
      sellingPrice: { type: Number, required: true },
      discount: { type: Number, default: 0 },
      currency: { type: String, default: 'INR' },
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
    },
    images: [{ type: String }],
    rating: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0 },
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ 'pricing.sellingPrice': 1 });
productSchema.index({ name: 'text', brand: 'text' });

const Product = mongoose.model('Product', productSchema);
export default Product;

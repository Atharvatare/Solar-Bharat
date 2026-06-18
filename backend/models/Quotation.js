import mongoose from 'mongoose';

const QUOTATION_STATUS = {
  DRAFT: 'draft',
  SENT: 'sent',
  VIEWED: 'viewed',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  EXPIRED: 'expired',
};

const quotationSchema = new mongoose.Schema(
  {
    quotationNumber: {
      type: String,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
    },
    // System details
    systemSize: {
      type: Number, // kW
      required: true,
    },
    panelType: {
      type: String,
      enum: ['monocrystalline', 'polycrystalline', 'thin_film'],
      default: 'monocrystalline',
    },
    panelCount: { type: Number },
    inverterType: { type: String },

    // Financials
    totalCost: { type: Number, required: true },
    subsidyAmount: { type: Number, default: 0 },
    netCost: { type: Number, required: true },
    monthlyEMI: { type: Number },
    estimatedSavingsPerYear: { type: Number },
    paybackPeriod: { type: Number }, // years

    // Status
    status: {
      type: String,
      enum: Object.values(QUOTATION_STATUS),
      default: QUOTATION_STATUS.DRAFT,
    },
    validUntil: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    },

    // Meta
    notes: { type: String, maxlength: 2000 },
    customerAddress: {
      street: String,
      city: String,
      state: String,
      pincode: String,
    },
  },
  { timestamps: true }
);

// Auto-generate quotation number
quotationSchema.pre('save', async function (next) {
  if (!this.quotationNumber) {
    const count = await mongoose.model('Quotation').countDocuments();
    this.quotationNumber = `SB-Q-${String(count + 1001).padStart(5, '0')}`;
  }
  next();
});

quotationSchema.index({ userId: 1, status: 1 });
quotationSchema.index({ vendorId: 1 });
quotationSchema.index({ createdAt: -1 });

export { QUOTATION_STATUS };
const Quotation = mongoose.model('Quotation', quotationSchema);
export default Quotation;

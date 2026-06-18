import mongoose from 'mongoose';

const LEAD_STATUS = {
  NEW: 'new',
  CONTACTED: 'contacted',
  QUALIFIED: 'qualified',
  PROPOSAL: 'proposal',
  NEGOTIATION: 'negotiation',
  CONVERTED: 'converted',
  LOST: 'lost',
};

const LEAD_SOURCE = {
  WEBSITE: 'website',
  REFERRAL: 'referral',
  SOCIAL_MEDIA: 'social_media',
  ADVERTISEMENT: 'advertisement',
  WALK_IN: 'walk_in',
  PARTNER: 'partner',
  OTHER: 'other',
};

const leadSchema = new mongoose.Schema(
  {
    // Contact info
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    location: {
      city: String,
      state: String,
      pincode: String,
    },

    // Lead tracking
    source: {
      type: String,
      enum: Object.values(LEAD_SOURCE),
      default: LEAD_SOURCE.WEBSITE,
    },
    status: {
      type: String,
      enum: Object.values(LEAD_STATUS),
      default: LEAD_STATUS.NEW,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
    },

    // Requirements
    systemRequirements: {
      systemSize: Number,        // kW
      roofArea: Number,          // sq ft
      monthlyBill: Number,       // INR
      propertyType: {
        type: String,
        enum: ['residential', 'commercial', 'industrial', 'institutional'],
        default: 'residential',
      },
    },

    // Follow-up
    notes: [{
      content: { type: String, required: true },
      createdBy: { type: String, default: 'admin' },
      createdAt: { type: Date, default: Date.now },
    }],
    followUpDate: { type: Date },
    lastContactedAt: { type: Date },

    // Conversion
    convertedAt: { type: Date },
    quotationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quotation' },
    estimatedValue: { type: Number }, // INR
  },
  { timestamps: true }
);

leadSchema.index({ status: 1, priority: -1 });
leadSchema.index({ assignedTo: 1 });
leadSchema.index({ createdAt: -1 });
leadSchema.index({ followUpDate: 1 });
leadSchema.index({ email: 1 });

export { LEAD_STATUS, LEAD_SOURCE };
const Lead = mongoose.model('Lead', leadSchema);
export default Lead;

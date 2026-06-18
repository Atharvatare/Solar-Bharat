import mongoose from 'mongoose';

const BOOKING_STATUS = {
  REQUESTED: 'requested',
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  RESCHEDULED: 'rescheduled',
};

const BOOKING_TYPE = {
  SITE_SURVEY: 'site_survey',
  INSTALLATION: 'installation',
  MAINTENANCE: 'maintenance',
  REPAIR: 'repair',
  INSPECTION: 'inspection',
};

const bookingSchema = new mongoose.Schema(
  {
    bookingNumber: { type: String, unique: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
    },
    bookingType: {
      type: String,
      enum: Object.values(BOOKING_TYPE),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(BOOKING_STATUS),
      default: BOOKING_STATUS.REQUESTED,
    },
    scheduledDate: {
      type: Date,
      required: true,
    },
    timeSlot: {
      type: String,
      enum: ['morning', 'afternoon', 'evening'],
      default: 'morning',
    },
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
    },
    notes: { type: String, maxlength: 1000 },
    completionNotes: { type: String },
    completedAt: { type: Date },
    cancelReason: { type: String },
  },
  { timestamps: true }
);

bookingSchema.pre('save', async function (next) {
  if (!this.bookingNumber) {
    const count = await mongoose.model('Booking').countDocuments();
    this.bookingNumber = `SB-B-${String(count + 1001).padStart(5, '0')}`;
  }
  next();
});

bookingSchema.index({ userId: 1, status: 1 });
bookingSchema.index({ vendorId: 1, scheduledDate: 1 });
bookingSchema.index({ status: 1, scheduledDate: 1 });

export { BOOKING_STATUS, BOOKING_TYPE };
const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;

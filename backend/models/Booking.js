import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  interestArea: { type: String, required: true },
  message: { type: String },
  scheduledAt: { type: Date, required: false }, // auto-assigned slot
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;

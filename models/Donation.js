import mongoose from 'mongoose';

const DonationSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address1: { type: String, required: true },
  address2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  donationAmount: { type: Number, required: true },
  frequency: { type: String, enum: ['monthly', 'biweekly', 'annually'], required: true },
  startDate: { type: Date, required: true },
  coverFee: { type: Boolean, default: false },
  stripePaymentId: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Donation', DonationSchema);

const mongoose = require('mongoose');

const tableBookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: String,
  userEmail: String,
  userPhone: String,
  tableType: {
    type: String,
    required: true,
    enum: ['Standard Table (2 People)', 'Family Table (4 People)', 'Large Table (6 People)', 'Banquet Table (10 People)', 'Private Dining Room (20 People)']
  },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  guests: { type: Number, required: true },
  occasion: String,
  foodPreference: { type: String, enum: ['Veg', 'Non-Veg', 'Both'] },
  selectedItems: [{ name: String, price: Number, quantity: Number }],
  tablePrice: Number,
  foodTotal: Number,
  totalPrice: Number,
  specialRequests: String,
  status: { type: String, default: 'confirmed', enum: ['confirmed', 'cancelled', 'completed', 'pending'] },
  bookingId: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now }
});

tableBookingSchema.pre('save', function(next) {
  if (!this.bookingId) {
    this.bookingId = 'TB' + Date.now() + Math.random().toString(36).substr(2, 4).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('TableBooking', tableBookingSchema);

const mongoose = require('mongoose');

const roomBookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: String,
  userEmail: String,
  userPhone: String,
  roomType: {
    type: String,
    required: true,
    enum: ['Deluxe Room', 'Premium Suite', 'Royal Suite', 'Presidential Suite', 'Penthouse']
  },
  roomNumber: String,
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  guests: { type: Number, required: true },
  pricePerNight: Number,
  totalPrice: Number,
  specialRequests: String,
  status: { type: String, default: 'confirmed', enum: ['confirmed', 'cancelled', 'completed', 'pending'] },
  bookingId: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now }
});

roomBookingSchema.pre('save', function(next) {
  if (!this.bookingId) {
    this.bookingId = 'RB' + Date.now() + Math.random().toString(36).substr(2, 4).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('RoomBooking', roomBookingSchema);

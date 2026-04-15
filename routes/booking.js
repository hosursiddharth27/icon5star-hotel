const express = require('express');
const router = express.Router();
const RoomBooking = require('../models/RoomBooking');
const TableBooking = require('../models/TableBooking');
const { isAuthenticated } = require('../middleware/auth');

const roomPrices = {
  'Deluxe Room': 4999,
  'Premium Suite': 9999,
  'Royal Suite': 18999,
  'Presidential Suite': 34999,
  'Penthouse': 74999
};

const tablePrices = {
  'Standard Table (2 People)': 500,
  'Family Table (4 People)': 1200,
  'Large Table (6 People)': 2200,
  'Banquet Table (10 People)': 4500,
  'Private Dining Room (20 People)': 15000
};

// Room booking
router.get('/room', isAuthenticated, (req, res) => res.render('book-room'));

router.post('/room', isAuthenticated, async (req, res) => {
  try {
    const { roomType, checkIn, checkOut, guests, specialRequests } = req.body;
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const pricePerNight = roomPrices[roomType] || 4999;
    const totalPrice = pricePerNight * nights;
    const user = req.session.user;

    const booking = new RoomBooking({
      user: user._id, userName: user.name, userEmail: user.email,
      roomType, checkIn: checkInDate, checkOut: checkOutDate,
      guests, pricePerNight, totalPrice, specialRequests,
      roomNumber: Math.floor(Math.random() * 400 + 100).toString()
    });
    await booking.save();
    req.flash('success', `Room booked! Booking ID: ${booking.bookingId}`);
    res.redirect('/auth/profile');
  } catch (err) {
    req.flash('error', 'Booking failed. Try again.');
    res.redirect('/booking/room');
  }
});

// Table booking
router.get('/table', isAuthenticated, (req, res) => res.render('book-table'));

router.post('/table', isAuthenticated, async (req, res) => {
  try {
    const { tableType, date, time, guests, occasion, foodPreference, specialRequests } = req.body;
    const tablePrice = tablePrices[tableType] || 500;
    const user = req.session.user;

    const booking = new TableBooking({
      user: user._id, userName: user.name, userEmail: user.email, userPhone: '',
      tableType, date: new Date(date), time, guests, occasion, foodPreference,
      tablePrice, foodTotal: 0, totalPrice: tablePrice, specialRequests
    });
    await booking.save();
    req.flash('success', `Table booked! Booking ID: ${booking.bookingId}`);
    res.redirect('/auth/profile');
  } catch (err) {
    req.flash('error', 'Booking failed. Try again.');
    res.redirect('/booking/table');
  }
});

// Cancel room booking
router.post('/room/cancel/:id', isAuthenticated, async (req, res) => {
  try {
    const booking = await RoomBooking.findOne({ _id: req.params.id, user: req.session.user._id });
    if (!booking) { req.flash('error', 'Booking not found'); return res.redirect('/auth/profile'); }
    if (booking.status === 'cancelled') { req.flash('error', 'Already cancelled'); return res.redirect('/auth/profile'); }
    booking.status = 'cancelled';
    await booking.save();
    req.flash('success', `Room booking ${booking.bookingId} cancelled successfully.`);
    res.redirect('/auth/profile');
  } catch (err) {
    req.flash('error', 'Cancellation failed.');
    res.redirect('/auth/profile');
  }
});

// Cancel table booking
router.post('/table/cancel/:id', isAuthenticated, async (req, res) => {
  try {
    const booking = await TableBooking.findOne({ _id: req.params.id, user: req.session.user._id });
    if (!booking) { req.flash('error', 'Booking not found'); return res.redirect('/auth/profile'); }
    if (booking.status === 'cancelled') { req.flash('error', 'Already cancelled'); return res.redirect('/auth/profile'); }
    booking.status = 'cancelled';
    await booking.save();
    req.flash('success', `Table booking ${booking.bookingId} cancelled successfully.`);
    res.redirect('/auth/profile');
  } catch (err) {
    req.flash('error', 'Cancellation failed.');
    res.redirect('/auth/profile');
  }
});

module.exports = router;

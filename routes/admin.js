const express = require('express');
const router = express.Router();
const User = require('../models/User');
const RoomBooking = require('../models/RoomBooking');
const TableBooking = require('../models/TableBooking');
const { isAdmin } = require('../middleware/auth');

router.get('/dashboard', isAdmin, async (req, res) => {
  try {
    const users = await User.countDocuments();
    const roomBookings = await RoomBooking.find().populate('user').sort({ createdAt: -1 });
    const tableBookings = await TableBooking.find().populate('user').sort({ createdAt: -1 });
    const revenue = roomBookings.filter(b => b.status !== 'cancelled').reduce((sum, b) => sum + b.totalPrice, 0)
      + tableBookings.filter(b => b.status !== 'cancelled').reduce((sum, b) => sum + b.totalPrice, 0);
    res.render('admin', { users, roomBookings, tableBookings, revenue });
  } catch (err) {
    res.redirect('/');
  }
});

module.exports = router;

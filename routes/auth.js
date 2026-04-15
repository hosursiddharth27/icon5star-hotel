const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { isGuest, isAuthenticated } = require('../middleware/auth');

router.get('/login', isGuest, (req, res) => res.render('login'));
router.get('/signup', isGuest, (req, res) => res.render('signup'));

router.post('/signup', isGuest, async (req, res) => {
  try {
    const { name, email, phone, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      req.flash('error', 'Passwords do not match');
      return res.redirect('/auth/signup');
    }
    const existing = await User.findOne({ email });
    if (existing) {
      req.flash('error', 'Email already registered');
      return res.redirect('/auth/signup');
    }
    const user = new User({ name, email, phone, password });
    await user.save();
    req.session.user = { _id: user._id, name: user.name, email: user.email, role: user.role };
    req.flash('success', `Welcome to Icon5Star Hotel, ${name}!`);
    res.redirect('/');
  } catch (err) {
    req.flash('error', 'Registration failed. Try again.');
    res.redirect('/auth/signup');
  }
});

router.post('/login', isGuest, async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      req.flash('error', 'Invalid email or password');
      return res.redirect('/auth/login');
    }
    req.session.user = { _id: user._id, name: user.name, email: user.email, role: user.role };
    req.flash('success', `Welcome back, ${user.name}!`);
    res.redirect('/');
  } catch (err) {
    req.flash('error', 'Login failed. Try again.');
    res.redirect('/auth/login');
  }
});

router.get('/logout', isAuthenticated, (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

router.get('/profile', isAuthenticated, async (req, res) => {
  try {
    const RoomBooking = require('../models/RoomBooking');
    const TableBooking = require('../models/TableBooking');
    const roomBookings = await RoomBooking.find({ user: req.session.user._id }).sort({ createdAt: -1 });
    const tableBookings = await TableBooking.find({ user: req.session.user._id }).sort({ createdAt: -1 });
    res.render('profile', { roomBookings, tableBookings });
  } catch (err) {
    res.redirect('/');
  }
});

module.exports = router;

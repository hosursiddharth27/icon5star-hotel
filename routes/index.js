const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.render('home'));
router.get('/rooms', (req, res) => res.render('rooms'));
router.get('/dining', (req, res) => res.render('dining'));
router.get('/gallery', (req, res) => res.render('gallery'));
router.get('/contact', (req, res) => res.render('contact'));
router.get('/amenities', (req, res) => res.render('amenities'));

module.exports = router;

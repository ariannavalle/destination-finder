const express = require('express');
const router = express.Router();

/* GET home page */
router.get('/', (req, res) => res.render('index', { 
  title: 'Find Your Next Travel Destination',
  user: req.user
 }));

module.exports = router;

const express = require('express');
const { getAllReviews } = require('../controllers/review');
const router = express.Router();

router.get('/',getAllReviews);

module.exports = router;
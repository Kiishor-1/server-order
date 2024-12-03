const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    name: { type: String, required: true },
    address: { type: String, required: true },
  },
  rating: { type: Number, required: true },
  content: { type: String, required: true },
  createdAt: { type: String, default: new Date().toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) },
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;

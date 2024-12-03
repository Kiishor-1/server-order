const mongoose = require('mongoose');
const { Schema } = mongoose;
const FoodItem = require('./FoodItem');

const RestaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  reviews: {
    rating: { type: Number, required: true },
    review: { type: Number, required: true },
  },
  image: { type: String },
  opensUntil: { type: String, required: true },
  foodItems: [{ type: Schema.Types.ObjectId, ref: 'FoodItem' }],
  phone: { type: String },
  website: { type: String },
  address: { type: String },
  geometry: {
    type: {
      type: String,
      enum: ['Point'], 
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }
});

const Restaurant = mongoose.model('Restaurant', RestaurantSchema);

module.exports = Restaurant;


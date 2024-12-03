const mongoose = require('mongoose');

const FoodItemSchema = new mongoose.Schema({
    item: { type: String, required: true },
    name: { type: String, required: true },
    desc: { type: String },
    price: { type: Number, required: true },
    image: { type: String }
});

const FoodItem = mongoose.model('FoodItem', FoodItemSchema);

module.exports = FoodItem;

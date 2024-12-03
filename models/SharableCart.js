const mongoose = require("mongoose");
const User = require('../models/User');

const SharableCartSchema = new mongoose.Schema({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    items: [
        {
            foodItem: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: "FoodItem",
            },
            quantity: {
                type: Number,
                required: true,
                default: 1,
            },
        },
    ],
    shared: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

SharableCartSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

const SharableCart = mongoose.model("SharableCart", SharableCartSchema);

module.exports = SharableCart;

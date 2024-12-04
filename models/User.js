const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const addressSchema = new Schema({
    fullAddress: {
        type: String,
        required: true,
    },
    cityOrDistrict: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    zip: {
        type: String,
        required: true,
    },
    country: {
        type: String,
    },
    phone: {
        type: String,
        required: true,
    },
    isDefault: {
        type: Boolean,
        default: false,
    },
});

const cartItemSchema = new Schema({
    foodItem: {
        type: Schema.Types.ObjectId,
        ref: 'FoodItem',
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1,
    },
});

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    gender:{
        type:String,
        enum:['Male','Female'],
    },
    password: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
    },
    addresses: {
        type: [addressSchema],
        default: [],
    },
    country:{
        type:String,
    },
    cart: {
        type: [cartItemSchema],
        default: [],
    },
    tokenVersion: {
        type: Number,
        default: 0,
    },
});

userSchema.pre('save', function (next) {
    if (this.addresses.filter((addr) => addr.isDefault).length > 1) {
        const err = new Error("Only one address can be set as default.");
        return next(err);
    }
    next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;

const { required } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    phoneNumber:{
        type:String,
        required:true
    },
    address:{
        location:{
            type:String,
            // required:true,
        },
        country:{
            type:String,
            // required:true,
        }
    },
    tokenVersion: {
        type: Number,
        default: 0,
    }
})

const User = mongoose.model("User", userSchema);
module.exports = User;
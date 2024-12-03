const Restaurant = require('../models/Restaurant');
const mongoose = require('mongoose')

module.exports.AllRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find({}).populate('foodItems');
        res.status(200).json({
            success: true,
            message: "Restaurant data fetched successfully",
            restaurants,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            error: "Internal Server error",
        })
    }
}

module.exports.restaurantDetails = async (req, res) => {
    const { id } = req.params;
    try {
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                error: "Invalid ID format",
            });
        }
        const restaurant = await Restaurant.findById(id).populate('foodItems');
        if (!restaurant) {
            return res.status(404).json({
                success: false,
                error: "No restaurant found with associated ID",
            })
        }
        res.status(200).json({
            success: true,
            message: "Restaurant Details fetched successfully",
            restaurant,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            error: "Internal Server error",
        })
    }
}


module.exports.FirstRestaurant = async (req, res) => {
    try {
        const restaurant = await Restaurant.findOne({}).populate('foodItems');

        if (!restaurant) {
            return res.status(404).json({
                success: false,
                error: "No restaurants found",
            });
        }

        res.status(200).json({
            success: true,
            message: "First restaurant fetched successfully",
            restaurant,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            error: "Internal Server error",
        });
    }
};

const Review = require('../models/Review');

const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find();
        res.status(200).json({
            success:true,
            message:'Reviews fetched successfully',
            reviews
        });
    } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).json({ 
            error: error.message || 'Internal Server Error', 
            success:false,
        });
    }
};

module.exports = {
    getAllReviews,
}
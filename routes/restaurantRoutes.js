const express = require('express');
const router = express.Router();
const restaurantControllers = require('../controllers/restaurant');
const { Types } = require('mongoose');


const validateObjectId = (req, res, next) => {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid ID format" });
    }
    next();
};

router.get('/first', restaurantControllers.FirstRestaurant);

router.get('/:id', validateObjectId, restaurantControllers.restaurantDetails);


router.get('/', restaurantControllers.AllRestaurants);

module.exports = router;

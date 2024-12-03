const User = require('../models/User');
const FoodItem = require('../models/FoodItem'); // Assuming a FoodItem model exists
const SharableCart = require("../models/SharableCart");

const getCart = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('cart.foodItem');
        if (!user) {
            return res.status(404).json({
                error: 'User not found',
                success: false,
            });
        }

        const totalPrice = user.cart.reduce((total, item) => {
            return total + (item.foodItem.price * item.quantity);
        }, 0);

        // Return cart and total price
        res.status(200).json({
            cart: user.cart,
            totalPrice,
            success: true,
            message: 'Cart Fetched'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || 'Internal Server Error'
        });
    }
};


const addToCart = async (req, res) => {
    console.log('Request received');
    const { _id: foodItemId, quantity } = req.body;
    console.log(req.body);

    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        const foodItem = await FoodItem.findById(foodItemId);
        if (!foodItem) {
            return res.status(404).json({
                success: false,
                error: 'Food item not found'
            });
        }
        let updatedItem;
        const existingItem = user.cart.find(item => item.foodItem.toString() === foodItemId);

        if (existingItem) {
            existingItem.quantity += quantity || 1;
            updatedItem = {
                foodItem,
                quantity: existingItem.quantity,
            };
        } else {
            const newItem = { foodItem: foodItemId, quantity: quantity || 1 };
            user.cart.push(newItem);
            updatedItem = {
                foodItem,
                quantity: newItem.quantity,
            };
        }

        await user.save();

        res.status(200).json({
            message: 'Item added to cart',
            item: updatedItem,
            success: true,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: error.message || 'Internal Server Error'
        });
    }
};

const updateCartItem = async (req, res) => {
    const { foodItemId } = req.params;
    const { quantity } = req.body;

    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                error: 'User not found',
                success: false,
            });
        }

        const cartItem = user.cart.find(item => item.foodItem.toString() === foodItemId);
        if (!cartItem) {
            return res.status(404).json({
                error: 'Cart item not found',
                success: false,
            });
        }

        if (quantity > 0) {
            cartItem.quantity = quantity;
        } else {
            return res.status(400).json({
                error: 'Quantity must be greater than zero',
                success: false,
            });
        }

        await user.save();
        res.status(200).json({
            message: 'Cart item updated',
            cart: user.cart,
            success: true,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || 'Internal Server Error'
        });
    }
};


const removeFromCart = async (req, res) => {
    const { foodItemId } = req.params;

    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                error: 'User not found',
                success: false,
            });
        }

        const cartItem = user.cart.find(item => item.foodItem.toString() === foodItemId);

        if (!cartItem) {
            return res.status(404).json({
                error: 'Item not found in cart',
                success: false,
            });
        }

        let responseItem;
        if (cartItem.quantity === 1) {
            user.cart = user.cart.filter(item => item.foodItem.toString() !== foodItemId);
            responseItem = { itemId: foodItemId, quantity: 0 };
        } else {
            cartItem.quantity -= 1;
            responseItem = { itemId: foodItemId, quantity: cartItem.quantity };
        }

        await user.save();
        res.status(200).json({
            message: 'Cart updated successfully',
            item: responseItem,
            success: true,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || 'Internal Server Error'
        });
    }
};


const clearCart = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found',
            });
        }
        user.cart = [];
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Cart cleared successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || 'Internal Server Error',
        });
    }
};



const createSharableCart = async (req, res) => {
    const { items } = req.body;

    console.log(req.body);

    try {
        // Validate the request body
        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                error: "Invalid request. 'items' must be a non-empty array.",
            });
        }

        // Find an existing shared cart with the same items and ownerId
        const existingCart = await SharableCart.findOne({
            ownerId: req.user?._id,
            shared: true,
            items: {
                $size: items.length, // Check the size matches
                $all: items.map((item) => ({
                    $elemMatch: {
                        foodItem: item.foodItem, // Match foodItem ID
                        quantity: item.quantity, // Match quantity
                    },
                })),
            },
        });

        if (existingCart) {
            console.log("Existing shared cart found:", existingCart);
            return res.status(200).json({
                success: true,
                message: "A shared cart with the same items already exists.",
                data: existingCart,
            });
        }

        // Create a new shared cart if no match is found
        const newCart = new SharableCart({
            ownerId: req.user?._id,
            items: items,
            shared: true,
        });

        const savedCart = await newCart.save();

        console.log("Sharable Cart Created:", savedCart);
        return res.status(201).json({
            success: true,
            message: "Sharable cart created successfully.",
            data: savedCart,
        });
    } catch (error) {
        console.error("Error creating sharable cart:", error);
        return res.status(500).json({
            success: false,
            error: error.message || 'Internal Server Error',
        });
    }
};

const getSharableCart = async (req, res) => {
    const { cartId } = req.params;

    console.log(cartId)

    try {
        if (!cartId) {
            return res.status(400).json({
                success: false,
                error: "Invalid request. 'cartId' is required.",
            });
        }

        const cart = await SharableCart.findById(cartId).populate({
            path: "items.foodItem",
            select: "name price",
        });

        if (!cart || !cart.shared) {
            return res.status(404).json({
                success: false,
                error: "Cart not found or is not shared.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Sharable cart fetched successfully.",
            data: cart,
        });
    } catch (error) {
        console.error("Error fetching sharable cart:", error);
        return res.status(500).json({
            success: false,
            error: error.message || 'Internal Server Error',
        });
    }
};

const syncCart = async (req, res) => {
    try {
        const userId = req.user?._id;
        const { items } = req.body;

        if (!items || !Array.isArray(items)) {
            return res.status(400).json({ success: false, message: "Invalid cart items." });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        items.forEach((newItem) => {
            const existingItem = user.cart.find(
                (item) => item.foodItem.toString() === newItem.foodItem
            );

            if (existingItem) {
                existingItem.quantity += newItem.quantity;
            } else {
                user.cart.push(newItem);
            }
        });

        await user.save();

        return res.status(200).json({
            success: true,
            data: user.cart,
        });
    } catch (error) {
        console.error("Error syncing cart:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    createSharableCart,
    getSharableCart,
    syncCart,
};

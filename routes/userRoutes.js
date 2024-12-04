const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware')
const User = require('../models/User');
const { addToCart,
    updateCartItem,
    removeFromCart,
    getCart,
    createSharableCart,
    getSharableCart,
    clearCart,
    syncCart,
} = require('../controllers/cart');


const {
    UserAddresses,
    AddAddress,
    UpdateAddress,
    RemoveAddress,
    SetDefaultAddress
} = require('../controllers/addresses')


const {
    getUser,
    editUser
} = require('../controllers/user')

router.get('/', authMiddleware, getUser);

router.put('/', authMiddleware, editUser);

router.get('/addresses', authMiddleware, UserAddresses);

router.post('/addresses', authMiddleware, AddAddress);


router.put('/addresses/:addressId', authMiddleware, UpdateAddress);


router.delete('/addresses/:addressId', authMiddleware, RemoveAddress);


router.put('/addresses/:addressId/default', authMiddleware, SetDefaultAddress);

router.get('/cart', authMiddleware, getCart);

router.post('/cart', authMiddleware, addToCart);

router.get('/cart/clear', authMiddleware, clearCart);

router.put('/cart/:foodItemId', authMiddleware, updateCartItem);

router.delete('/cart/:foodItemId', authMiddleware, removeFromCart);


router.post('/cart/shared', authMiddleware, createSharableCart);

router.get('/cart/shared/:cartId', getSharableCart);

router.post('/cart/sync', authMiddleware, syncCart);

module.exports = router;

import asyncHandler from 'express-async-handler';
import { CartItem } from '../modals/cartModal.js';


export const addToCart = asyncHandler(async (req, res) => {
    const { itemId, quantity } = req.body;

    if (!itemId || typeof quantity !== 'number') {
        res.status(400);
        throw new Error('ItemId and quantity are required');
    }
    let cartItem = await CartItem.findOne({
        user: req.user.id,
        item: itemId,
    });
    if (cartItem) {
        cartItem.quantity = Math.max(1, cartItem.quantity + quantity);
        await cartItem.save();
        await cartItem.populate('item');

        return res.status(200).json({
            _id: cartItem._id.toString(),
            item: cartItem.item,
            quantity: cartItem.quantity,
        });
    }
    cartItem = await CartItem.create({
        user: req.user.id,
        item: itemId,
        quantity,
    });

    await cartItem.populate('item');
    res.status(201).json({
        _id: cartItem._id.toString(),
        item: cartItem.item,
        quantity: cartItem.quantity,
    });
});


export const getCart = asyncHandler(async (req, res) => {
    const items = await CartItem.find({ user: req.user.id }).populate('item');
    const formatted = items.map(ci => ({
        _id: ci._id.toString(),
        item: ci.item,
        quantity: ci.quantity,
    }));

    res.json(formatted);
});

export const updateCartItem = asyncHandler(async (req, res) => {
    const { quantity } = req.body;
    const id = req.params.id;
    let cartItem = await CartItem.findOne({
        _id: id,
        user: req.user.id,
    });
    if (!cartItem) {
        cartItem = await CartItem.findOne({
            item: id,
            user: req.user.id,
        });
    }
    if (!cartItem) {
        res.status(404);
        throw new Error('Cart item not found');
    }

    cartItem.quantity = Math.max(1, quantity);
    await cartItem.save();
    await cartItem.populate('item');

    res.json({
        _id: cartItem._id.toString(),
        item: cartItem.item,
        quantity: cartItem.quantity,
    });
});


export const deleteCartItem = asyncHandler(async (req, res) => {
    const id = req.params.id;
    let cartItem = await CartItem.findOne({
        _id: id,
        user: req.user.id,
    });
    if (!cartItem) {
        cartItem = await CartItem.findOne({
            item: id,
            user: req.user.id,
        });
    }
    if (!cartItem) {
        return res.status(204).send();
    }
    await cartItem.deleteOne();
    res.status(204).send();
});


export const clearCart = asyncHandler(async (req, res) => {
    await CartItem.deleteMany({ user: req.user.id });
    res.json({ message: 'Cart cleared' });
});

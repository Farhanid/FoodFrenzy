import asyncHandler from 'express-async-handler';
import { CartItem } from '../modals/cartModal.js';


// //Get CART 
// export const getCart = asyncHandler(async (req, res) => {
//     const items = await CartItem.find({ user: req.user._id}).populate('item');

//     const formatted = items.map(ci => ({
//         _id: ci._id.toString(),
//         item: ci.item,
//         quantity: ci.quantity
//     }))
//     res.json(formatted)
// })

// //ADDTO CART FUNCTION TO ADD ITEMS TO CART
// export const addToCart = asyncHandler(async (req, res) => {
//      const {itemId, quantity} = req.body;
//      if(!itemId || typeof quantity != 'number'){
//         res.status(400);
//         throw new Error('ItemId and quantity are Required')
//      }
    
//      let cartItem = await CartItem.findOne({ user: req.user._id, item: itemId}) //check

//     if (cartItem){
//         cartItem.quantity = Math.max(1, cartItem.quantity + quantity)

//         if(cartItem.quantity < 1){
//             await cartItem.remove();
//             return res.json({_id: cartItem._id.toString(), item: cartItem.item, quantity:0 })
//         }
//         await cartItem.save();
//         await cartItem.populate('item');
//         return res.status(200).json({
//             _id: cartItem._id.toString(),
//             item: cartItem.item,
//             quantity: cartItem.quantity,
//         })
//     }

//     cartItem = await CartItem.create({
//         user:req.user._id,
//         item: itemId,
//         quantity,
//     })
//     await cartItem.populate('item');
//     res.status(201).json({
//         _id: cartItem._id.toString(),
//         item: cartItem.item,
//         quantity: cartItem.quantity,
//     })
   
// }
// )

// //LETS CREATE A METHOD TO UPDATE CART AND ITEMS QUANTITY
// export const updateCartItem =asyncHandler(async (req, res) => {
//     const {quantity} = req.body;

//     const cartItem = await CartItem.findOne({_id: req.params.id, user:req.user._id})
//     if(!cartItem){ 
//         res.status(404);
//          throw new Error("Cart item is not found ")
//         }
//         cartItem.quantity = Math.max(1, quantity)
//         await cartItem.save();
//         await cartItem.populate('item')
//         res.json({
//             _id: cartItem._id.toString(),
//             item: cartItem.item,
//             quantity: cartItem.quantity,
//         })
// }

// )

// //DELETE FUNCTION
// export const deleteCartItem = asyncHandler(async (req, res) => {
//     const cartItem = await CartItem.findOne({_id: req.params.id, user:req.user._id })
//     if (!cartItem) {
//         res.status(404);
//         throw new Error("Cart item is not found ")
//     }
//     await cartItem.deleteOne();
//     res.json({ _id: req.params.id})
// })

// //CLEAR CART FUNCTION  TO EMPTY THE CART

// export const clearCart = asyncHandler(async (req, res) => {
//     await CartItem.deleteMany({ user: req.user._id});
//     res.json({ message: 'Cart cleared'})
// })


//ADDTO CART FUNCTION TO ADD ITEMS TO CART
export const addToCart = asyncHandler(async (req, res) => {
    const { itemId, quantity } = req.body;
    if (!itemId || typeof quantity != 'number') {
        res.status(400);
        throw new Error('ItemId and quantity are Required')
    }

    // DEBUG: Check what's in req.user
    console.log("req.user:", req.user);
    console.log("req.user._id:", req.user?._id);
    console.log("req.user.id:", req.user?.id);

    let cartItem = await CartItem.findOne({
        user: req.user.id, // ← Change to req.user.id
        item: itemId
    })

    if (cartItem) {
        cartItem.quantity = Math.max(1, cartItem.quantity + quantity)

        if (cartItem.quantity < 1) {
            await cartItem.deleteOne(); // Use deleteOne() instead of remove()
            return res.json({ _id: cartItem._id.toString(), item: cartItem.item, quantity: 0 })
        }
        await cartItem.save();
        await cartItem.populate('item');
        return res.status(200).json({
            _id: cartItem._id.toString(),
            item: cartItem.item,
            quantity: cartItem.quantity,
        })
    }

    cartItem = await CartItem.create({
        user: req.user.id, // ← Change to req.user.id
        item: itemId,
        quantity,
    })
    await cartItem.populate('item');
    res.status(201).json({
        _id: cartItem._id.toString(),
        item: cartItem.item,
        quantity: cartItem.quantity,
    })
})



//Get CART 
export const getCart = asyncHandler(async (req, res) => {
    const items = await CartItem.find({ user: req.user.id }).populate('item'); // ← Change

    const formatted = items.map(ci => ({
        _id: ci._id.toString(),
        item: ci.item,
        quantity: ci.quantity
    }))
    res.json(formatted)
})

//LETS CREATE A METHOD TO UPDATE CART AND ITEMS QUANTITY
export const updateCartItem = asyncHandler(async (req, res) => {
    const { quantity } = req.body;

    const cartItem = await CartItem.findOne({
        _id: req.params.id,
        user: req.user.id // ← Change
    })
    if (!cartItem) {
        res.status(404);
        throw new Error("Cart item is not found ")
    }
    cartItem.quantity = Math.max(1, quantity)
    await cartItem.save();
    await cartItem.populate('item')
    res.json({
        _id: cartItem._id.toString(),
        item: cartItem.item,
        quantity: cartItem.quantity,
    })
})

//DELETE FUNCTION
export const deleteCartItem = asyncHandler(async (req, res) => {
    const cartItem = await CartItem.findOne({
        _id: req.params.id,
        user: req.user.id // ← Change
    })
    if (!cartItem) {
        res.status(404);
        throw new Error("Cart item is not found ")
    }
    await cartItem.deleteOne();
    res.json({ _id: req.params.id })
})

//CLEAR CART FUNCTION TO EMPTY THE CART
export const clearCart = asyncHandler(async (req, res) => {
    await CartItem.deleteMany({ user: req.user.id }); // ← Change
    res.json({ message: 'Cart cleared' })
})
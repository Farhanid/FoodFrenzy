import express from 'express'
import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import { createItem, getItems, deleteItem,getItemById, updateItem } from '../controllers/itemController.js'

const itemRouter = express.Router();


// 1. Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

console.log('🌥️ Cloudinary configured for:', process.env.CLOUDINARY_CLOUD_NAME);

// 2. Cloudinary Storage 
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'food-frenzy-items',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
        transformation: [{ width: 800, height: 800, crop: 'limit' }]
    }
});

// 3. Multer with Cloudinary
const upload = multer({
    storage: storage,  // ← MUST be CloudinaryStorage!
    limits: { fileSize: 5 * 1024 * 1024 }
});


itemRouter.post('/', upload.single('image'), createItem);
itemRouter.get('/', getItems);
itemRouter.get('/:id', getItemById);      // ✅ ADD THIS ROUTE
itemRouter.put('/:id', upload.single('image'), updateItem); // ✅ ADD THIS ROUTE
itemRouter.delete('/:id', deleteItem);

export default itemRouter;
// import express from 'express'
// import multer from 'multer'
// import { createItem, getItems, deleteItem } from '../controllers/itemController.js'


// const itemRouter = express.Router();

// //Type here multer function to store images

// const storage = multer.diskStorage({
//     destination: (_req, _file, cb) => cb(null, 'uploads/'),
//     filename: (_req,file,cb) => cb(null, `${Date.now()}-${file.originalname}`)
// })

// const upload = multer({ storage});

// itemRouter.post('/', upload.single('image'), createItem);
// itemRouter.get('/', getItems);
// itemRouter.delete('/:id', deleteItem )


// export default itemRouter;



import express from 'express'
import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import { createItem, getItems, deleteItem } from '../controllers/itemController.js'

const itemRouter = express.Router();

// ========== CLOUDINARY SETUP ==========
// 1. Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

console.log('🌥️ Cloudinary configured for:', process.env.CLOUDINARY_CLOUD_NAME);

// 2. Cloudinary Storage (REPLACES diskStorage!)
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

// ========== ROUTES ==========
itemRouter.post('/', upload.single('image'), createItem);
itemRouter.get('/', getItems);
itemRouter.delete('/:id', deleteItem);

export default itemRouter;
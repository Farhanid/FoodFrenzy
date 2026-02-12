import itemModal from "../modals/itemModal.js";

export const createItem = async (req, res, next) => {
    try {

        console.log('📦 req.file from Cloudinary:', req.file);

        const { name, description, category, price, rating, hearts } = req.body;
        const imageUrl = req.file ? req.file.path : '';
        console.log(' Cloudinary Image URL:', imageUrl);
        const total = Number(price) * 1;
        const newItem = new itemModal({
            name,
            description,
            category,
            price,
            rating,
            hearts,
            imageUrl,
            total
        })

        const saved = await newItem.save();
        console.log(' Saved with imageUrl:', saved.imageUrl);
        res.status(201).json(saved)

    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: 'Item name already exists' })
        }
        next(err);
    }
}


export const getItems = async (req, res, next) => {
    try {
        const items = await itemModal.find().sort({ createdAt: -1 });
        res.json(items)
    } catch (err) {
        next(err);
    }
}


export const getItemById = async (req, res, next) => {
    try {
        const item = await itemModal.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }
        res.json(item);
    } catch (err) {
        next(err);
    }
}

// ============================================
// 2. UPDATE ITEM (ADD THIS)
// ============================================
export const updateItem = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, description, category, price, rating, hearts } = req.body;

        // Get existing item
        const existingItem = await itemModal.findById(id);
        if (!existingItem) {
            return res.status(404).json({ message: "Item not found" });
        }

        // Handle image - if new image uploaded, use it
        let imageUrl = existingItem.imageUrl;
        if (req.file) {
            imageUrl = req.file.path;
            console.log(' New Cloudinary Image URL:', imageUrl);
        }

        // Calculate total
        const total = Number(price) * 1;

        // Update the item
        const updatedItem = await itemModal.findByIdAndUpdate(
            id,
            {
                name,
                description,
                category,
                price,
                rating,
                hearts,
                imageUrl,
                total
            },
            { new: true, runValidators: true }
        );

        console.log(' Item updated:', updatedItem.name);
        res.json(updatedItem);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: 'Item name already exists' });
        }
        next(err);
    }
}

export const deleteItem = async (req, res, next) => {
    try {
        const removed = await itemModal.findByIdAndDelete(req.params.id)
        if (!removed) return res.status(404).json({ message: "Item not Found" })
        res.status(204).end()
    } catch (err) {
        next(err)
    }
}

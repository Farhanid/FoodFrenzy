import itemModal from "../modals/itemModal.js";

export const createItem = async (req, res, next) => {
    try {

        console.log('📦 req.file from Cloudinary:', req.file);

        const { name, description, category, price, rating, hearts } = req.body;
        const imageUrl = req.file ? req.file.path : '';
        console.log('🖼️ Cloudinary Image URL:', imageUrl);
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
        console.log('💾 Saved with imageUrl:', saved.imageUrl);
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


export const deleteItem = async (req, res, next) => {
    try {
        const removed = await itemModal.findByIdAndDelete(req.params.id)
        if (!removed) return res.status(404).json({ message: "Item not Found" })
        res.status(204).end()
    } catch (err) {
        next(err)
    }
}
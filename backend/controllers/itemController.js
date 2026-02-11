import itemModal from "../modals/itemModal.js";

export const createItem = async (req, res, next) => {
    try {
        // DEBUG: Check what Cloudinary gives us
        console.log('📦 req.file from Cloudinary:', req.file);

        const { name, description, category, price, rating, hearts } = req.body;

        // ✅ Cloudinary automatically provides FULL URL in req.file.path
        const imageUrl = req.file ? req.file.path : '';
        // Should be: "https://res.cloudinary.com/your-cloud/..."
        // NOT: "/uploads/filename.jpg"

        console.log('🖼️ Cloudinary Image URL:', imageUrl);

        const total = Number(price) * 1;
        const newItem = new itemModal({
            name,
            description,
            category,
            price,
            rating,
            hearts,
            imageUrl,  // ← This should be Cloudinary URL
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

// ✅ REMOVE URL construction - Cloudinary URLs are already complete!
export const getItems = async (req, res, next) => {
    try {
        const items = await itemModal.find().sort({ createdAt: -1 });
        // NO need to modify URLs - they're already full Cloudinary URLs
        res.json(items)
    } catch (err) {
        next(err);
    } }

// Delete function remains same
export const deleteItem = async (req, res, next) => {
    try {
        const removed = await itemModal.findByIdAndDelete(req.params.id)
        if (!removed) return res.status(404).json({ message: "Item not Found" })
        res.status(204).end()
    } catch (err) {
        next(err)
    }
}
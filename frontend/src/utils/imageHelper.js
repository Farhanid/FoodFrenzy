// frontend/src/utils/imageHelper.js
export const getImageUrl = (imageUrl) => {
    if (!imageUrl) return '';

    // Cloudinary URLs
    if (imageUrl.startsWith('http')) {
        return imageUrl;
    }

    // Local uploads - prepend backend URL
    if (imageUrl.startsWith('/uploads')) {
        return `https://foodfrenzy-backend.onrender.com${imageUrl}`;
    }

    return imageUrl;
};

// For production (if using Render/Railway)
export const getImageUrlForEnv = (imageUrl) => {
    if (!imageUrl) return '';

    if (imageUrl.startsWith('http')) return imageUrl;

    if (imageUrl.startsWith('/uploads')) {
        const backendUrl = import.meta.env.VITE_API_URL || 'https://foodfrenzy-backend.onrender.com';
        return `${backendUrl}${imageUrl}`;
    }

    return imageUrl;
};
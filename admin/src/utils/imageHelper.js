// // frontend/src/utils/imageHelper.js
// export const getImageUrl = (imageUrl) => {
//     if (!imageUrl) return '';

//     // Cloudinary URLs
//     if (imageUrl.startsWith('http')) {
//         return imageUrl;
//     }

//     // Local uploads - prepend backend URL
//     if (imageUrl.startsWith('/uploads')) {
//         return `http://localhost:4000${imageUrl}`;
//     }

//     return imageUrl;
// };

// // For production (if using Render/Railway)
// export const getImageUrlForEnv = (imageUrl) => {
//     if (!imageUrl) return '';

//     if (imageUrl.startsWith('http')) return imageUrl;

//     if (imageUrl.startsWith('/uploads')) {
//         const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
//         return `${backendUrl}${imageUrl}`;
//     }

//     return imageUrl;
// };


// Single function that works for both localhost and production (Render)
export const getImageUrl = (imageUrl) => {
    if (!imageUrl) return '';

    // If it's already a full URL (Cloudinary or external), return as is
    if (imageUrl.startsWith('http')) {
        return imageUrl;
    }

    // For local uploads (starts with /uploads)
    if (imageUrl.startsWith('/uploads')) {
        // Use environment variable for production (Render), fallback to localhost for development
        const backendUrl = import.meta.env.VITE_API_URL || 'https://foodfrenzy-backend.onrender.com';
        return `${backendUrl}${imageUrl}`;
    }

    // For any other relative paths that don't start with /uploads
    // You might want to handle them too
    if (imageUrl.startsWith('/')) {
        const backendUrl = import.meta.env.VITE_API_URL || 'https://foodfrenzy-backend.onrender.com';
        return `${backendUrl}${imageUrl}`;
    }

    return imageUrl;
};
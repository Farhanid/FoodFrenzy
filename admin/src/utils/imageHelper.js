

export const getImageUrl = (imageUrl) => {
    if (!imageUrl) return '';


    if (imageUrl.startsWith('http')) {
        return imageUrl;
    }
    if (imageUrl.startsWith('/uploads')) {
        const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
        return `${backendUrl}${imageUrl}`;
    }

    if (imageUrl.startsWith('/')) {
        const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
        return `${backendUrl}${imageUrl}`;
    }

    return imageUrl;
};
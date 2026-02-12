import React, { useState, useEffect } from 'react';
import { styles } from '../assets/dummyadmin';
import { FiHeart, FiStar, FiUpload, FiArrowLeft } from 'react-icons/fi';
import axios from 'axios';
import { FaRupeeSign } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

const UpdateItem = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        price: '',
        rating: 0,
        hearts: 0,
        image: null,
        preview: '',
        existingImage: ''
    });

    const [categories] = useState([
        'Breakfast', 'Lunch', 'Dinner', 'Mexican', 'Italian', 'Desserts', 'Drinks'
    ]);

    const [hoverRating, setHoverRating] = useState(0);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    // FETCH ITEM DATA
    useEffect(() => {
        const fetchItem = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get(`${API_URL}/api/items/${id}`);

                setFormData({
                    name: data.name || '',
                    description: data.description || '',
                    category: data.category || '',
                    price: data.price || '',
                    rating: data.rating || 0,
                    hearts: data.hearts || 0,
                    image: null,
                    preview: '',
                    existingImage: data.imageUrl || ''
                });
            } catch (err) {
                console.error('Error fetching item:', err);
                alert('Failed to load item details');
                navigate('/list');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchItem();
        }
    }, [id, navigate]);

    const handleRating = rating => setFormData(prev => ({ ...prev, rating }));

    const handleHearts = () => setFormData(prev => ({ ...prev, hearts: prev.hearts + 1 }));

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    const handleImageUpload = e => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                image: file,
                preview: URL.createObjectURL(file)
            }));
        }
    }

    const handleSubmit = async e => {
        e.preventDefault();

        if (!window.confirm('Are you sure you want to update this item?')) {
            return;
        }

        try {
            setUpdating(true);

            const payload = new FormData();
            payload.append('name', formData.name);
            payload.append('description', formData.description);
            payload.append('category', formData.category);
            payload.append('price', formData.price);
            payload.append('rating', formData.rating);
            payload.append('hearts', formData.hearts);

            if (formData.image) {
                payload.append('image', formData.image);
            }

            await axios.put(
                `${API_URL}/api/items/${id}`,
                payload,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );

            alert('✅ Item updated successfully!');
            navigate('/list');

        } catch (err) {
            console.error('Error updating item:', err);
            alert(err.response?.data?.message || 'Failed to update item');
        } finally {
            setUpdating(false);
        }
    }

    if (loading) {
        return (
            <div className={styles.pageWrapper}>
                <div className="flex items-center justify-center h-64">
                    <div className="text-amber-400 text-xl animate-pulse">
                        Loading item details...
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.formWrapper}>
            <div className='max-w-4xl mx-auto'>
                <div className={styles.formCard}>
                    <div className="flex items-center gap-4 mb-6">
                        <button
                            onClick={() => navigate('/list')}
                            className="p-2 bg-amber-600 hover:bg-amber-700 rounded-lg text-white transition-colors"
                        >
                            <FiArrowLeft className='text-xl' />
                        </button>
                        <h2 className={styles.formTitle}>✏️ Update Menu Item</h2>
                    </div>

                    <form className='space-y-6 sm:space-y-8' onSubmit={handleSubmit}>
                        <div className={styles.uploadWrapper}>
                            <label className={styles.uploadLabel}>
                                {formData.preview ? (
                                    <div className="relative">
                                        <img src={formData.preview} alt="Preview" className={styles.previewImage} />
                                        <p className="text-xs text-amber-400 mt-2">New Image</p>
                                    </div>
                                ) : formData.existingImage ? (
                                    <div className="relative">
                                        <img
                                            src={formData.existingImage}
                                            alt="Current"
                                            className={styles.previewImage}
                                        />
                                        <p className="text-xs text-amber-400 mt-2">Current Image</p>
                                        <p className="text-xs text-amber-100/60 mt-1">Click to change</p>
                                    </div>
                                ) : (
                                    <div className='text-center p-4'>
                                        <FiUpload className={styles.uploadIcon} />
                                        <p className={styles.uploadText}>Click to upload new image</p>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept='image/*'
                                    onChange={handleImageUpload}
                                    className='hidden'
                                />
                            </label>
                        </div>

                        <div>
                            <label className='block mb-2 text-amber-400'>Product Name</label>
                            <input
                                type="text"
                                name='name'
                                value={formData.name}
                                onChange={handleInputChange}
                                className={styles.inputField}
                                required
                            />
                        </div>

                        <div>
                            <label className='block mb-2 text-amber-400'>Description</label>
                            <textarea
                                name='description'
                                value={formData.description}
                                onChange={handleInputChange}
                                className={styles.inputField + ' h-32'}
                                required
                            />
                        </div>

                        <div className={styles.gridTwoCols}>
                            <div>
                                <label className='block mb-2 text-amber-400'>Category</label>
                                <select
                                    name='category'
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className={styles.inputField}
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className='block mb-2 text-amber-400'>Price (Rupees)</label>
                                <div className={styles.relativeInput}>
                                    <FaRupeeSign className={styles.rupeeIcon} />
                                    <input
                                        type="number"
                                        name='price'
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        className={styles.inputField + ' pl-10'}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className={styles.gridTwoCols}>
                            <div>
                                <label className='block mb-2 text-amber-400'>Rating</label>
                                <div className='flex gap-2'>
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <button
                                            key={star}
                                            type='button'
                                            onClick={() => handleRating(star)}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            className='text-2xl hover:scale-110'
                                        >
                                            <FiStar className={
                                                star <= (hoverRating || formData.rating)
                                                    ? 'text-amber-400 fill-current'
                                                    : 'text-amber-100/30'
                                            } />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className='block mb-2 text-amber-400'>Hearts</label>
                                <div className='flex items-center gap-3'>
                                    <button
                                        type='button'
                                        onClick={handleHearts}
                                        className='text-2xl text-amber-400 hover:text-amber-300'
                                    >
                                        <FiHeart />
                                    </button>
                                    <input
                                        type="number"
                                        name='hearts'
                                        value={formData.hearts}
                                        onChange={handleInputChange}
                                        className={styles.inputField + ' w-24'}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                className={`${styles.actionBtn} flex-1 bg-blue-600 hover:bg-blue-700`}
                                type='submit'
                                disabled={updating}
                            >
                                {updating ? 'Updating...' : '✏️ Update Item'}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/list')}
                                className="px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg text-white"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UpdateItem;
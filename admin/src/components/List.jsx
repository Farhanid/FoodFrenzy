import React, { useEffect, useState } from 'react'
import { styles } from '../assets/dummyadmin'
import { FiHeart, FiStar, FiTrash2, FiEdit2 } from 'react-icons/fi'
import axios from "axios";
import { getImageUrl } from '../utils/imageHelper';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

const List = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/items`);
        setItems(data)
      } catch (err) {
        console.error('Error fetching Items:', err)
      } finally {
        setLoading(false)
      }
    };
    fetchItems()
  }, [])


  const handleDelete = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return
    try {
      await axios.delete(`${API_URL}/api/items/${itemId}`)
      setItems(prev => prev.filter(item => item._id !== itemId))
    } catch (err) {
      console.error('Error deleting item:', err)
    }
  }


  const handleEdit = (itemId) => {
    navigate(`/update-item/${itemId}`);
  }

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <FiStar className={`text-xl ${i < rating ? 'text-amber-400 fill-current' : 'text-amber-100/30'}`}
        key={i} />
    ))
  }

  if (loading) {
    return (
      <div className={styles.pageWrapper.replace(/bg-gradient-to-br.*/, '').concat('flex items-center justify-center text-amber-100')}>
        Loading menu...
      </div>
    )
  }

  return (
    <div className={styles.pageWrapper}>
      <div className='max-w-7xl mx-auto'>
        <div className={styles.cardContainer}>
          <h2 className={styles.title}>Manage Menu Items</h2>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead className={styles.thead}>
                <tr>
                  <th className={styles.th}>Image</th>
                  <th className={styles.th}>Name</th>
                  <th className={styles.th}>Category</th>
                  <th className={styles.th}>Price</th>
                  <th className={styles.th}>Rating</th>
                  <th className={styles.th}>Hearts</th>
                  <th className={styles.thCenter}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item._id} className={styles.tr}>
                    <td className={styles.imgCell}>
                      <img
                        src={getImageUrl(item.imageUrl)}
                        alt={item.name}
                        className={item.img}
                        onError={(e) => {
                          e.target.src = '/admin-placeholder.jpg';
                        }}
                      />
                    </td>
                    <td className={styles.nameCell}>
                      <div className='space-y-1'>
                        <p className={styles.nameText}>{item.name}</p>
                        <p className={styles.descText}>{item.description}</p>
                      </div>
                    </td>
                    <td className={styles.categoryCell}>{item.category}</td>
                    <td className={styles.priceCell}>₹{item.price}</td>
                    <td className={styles.ratingCell}>
                      <div className='flex gap-1'>{renderStars(item.rating)}</div>
                    </td>
                    <td className={styles.heartsCell}>
                      <div className={styles.heartsWrapper}>
                        <FiHeart className='text-xl' />
                        <span>{item.hearts}</span>
                      </div>
                    </td>
                    <td className='p-4'>
                      <div className="flex items-center justify-center gap-3">

                        <button
                          onClick={() => handleEdit(item._id)}
                          className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
                          title="Edit Item"
                        >
                          <FiEdit2 className='text-xl' />
                        </button>
                        {/* DELETE BUTTON */}
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="p-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-colors"
                          title="Delete Item"
                        >
                          <FiTrash2 className='text-xl' />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {items.length === 0 && (
            <div className={styles.emptyState}>
              No items found in the Menu
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default List
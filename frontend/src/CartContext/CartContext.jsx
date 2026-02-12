import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from 'react';
import axios from 'axios';
import { API_URL } from '../utils/config';

const CartContext = createContext();


const cartReducer = (state, action) => {
  switch (action.type) {
    case 'HYDRATE_CART':
      return action.payload || [];

    case 'ADD_ITEM': {
      const { _id, item, quantity } = action.payload;
      const exists = state.find(ci => ci._id === _id);
      if (exists) {
        return state.map(ci =>
          ci._id === _id ? { ...ci, quantity: ci.quantity + quantity } : ci
        );
      }
      return [...state, { _id, item, quantity }];
    }

    case 'REMOVE_ITEM':
      return state.filter(ci => ci._id !== action.payload);

    case 'UPDATE_ITEM': {
      const { _id, quantity } = action.payload;
      return state.map(ci =>
        ci._id === _id ? { ...ci, quantity } : ci
      );
    }

    case 'CLEAR_CART':
      return [];

    default:
      return state;
  }
};


const initializer = () => {
  try {
    return JSON.parse(localStorage.getItem('cart') || '[]');
  } catch {
    return [];
  }
};


const api = axios.create({
  baseURL: `${API_URL}`,
  withCredentials: true,
});


export const CartProvider = ({ children }) => {
  const [cartItems, dispatch] = useReducer(cartReducer, [], initializer);
  const hasHydratedRef = useRef(false);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);


  useEffect(() => {
    const hydrateCart = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      if (hasHydratedRef.current) return;

      try {
        const res = await api.get('/api/cart', {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 5000,
        });

        if (Array.isArray(res.data)) {
          const validCartData = res.data.filter(cartItem =>
            cartItem &&
            cartItem.item &&
            cartItem.item._id &&
            cartItem.item.name
          );

          dispatch({ type: 'HYDRATE_CART', payload: validCartData });
        }

        hasHydratedRef.current = true;
      } catch (err) {
        console.error('Cart hydration error:', err);

        if (err.response?.status === 401) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('cart');
        }

        hasHydratedRef.current = true;
      }
    };

    hydrateCart();

    const handleStorageChange = e => {
      if (e.key === 'authToken') {
        hasHydratedRef.current = false;
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);


  const addToCart = useCallback(async (item, qty) => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Authentication required');

    // Optimistic UI update
    dispatch({
      type: 'ADD_ITEM',
      payload: { _id: item._id, item, quantity: qty },
    });

    try {
      await api.post(
        '/api/cart',
        { itemId: item._id, quantity: qty },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (err) {
      console.error('Add to cart failed:', err);

      // Rollback on failure
      dispatch({ type: 'REMOVE_ITEM', payload: item._id });

      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem('authToken');
        throw new Error('Session expired. Please log in again.');
      }

      throw err;
    }
  }, []);


  const removeFromCart = useCallback(async (_id) => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Authentication required');

    // Optimistic UI update
    dispatch({ type: 'REMOVE_ITEM', payload: _id });

    try {
      await api.delete(`/api/cart/${_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error('Remove from cart failed:', err);
      throw err;
    }
  }, []);



  const updateQuantity = useCallback(async (_id, qty) => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Authentication required');

    // Optimistic UI update
    dispatch({ type: 'UPDATE_ITEM', payload: { _id, quantity: qty } });

    try {
      await api.put(
        `/api/cart/${_id}`,
        { quantity: qty },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (err) {
      console.error('Update quantity failed:', err);
      throw err;
    }
  }, []);


  const clearCart = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Authentication required');

    // Optimistic UI update
    dispatch({ type: 'CLEAR_CART' });

    try {
      await api.post(
        '/api/cart/clear',
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (err) {
      console.error('Clear cart failed:', err);
      throw err;
    }
  }, []);


  const totalItems = cartItems.reduce((sum, ci) => sum + (ci?.quantity || 0), 0);

  const totalAmount = cartItems.reduce((sum, ci) => {
    const price = ci?.item?.price ?? 0;
    const qty = ci?.quantity ?? 0;
    return sum + price * qty;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalAmount,
        isLoading: false,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};


export const useCart = () => useContext(CartContext);
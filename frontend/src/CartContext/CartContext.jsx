// import React, {createContext, useCallback, useContext, useEffect, useReducer} from 'react'
// import axios from 'axios'

// const CartContext =createContext();

// //Reducer Handling Cart actions likeadd, remove, update,quantit and item

// const cartReducer = (state, action) => {
//   switch(action.type){
      
//     case 'HYDRATE_CART':
//       return action.payload;

//     case 'ADD_ITEM':{
//       const { _id, item, quantity} = action.payload;
//       const exists = state.find(ci => ci._id === _id);
//       if (exists){
//         return state.map(ci => ci.id === _id ? {...ci, quantity : ci.quantity + quantity } : ci)
//       }
//       return [...state, { _id, item, quantity }]
//     }
//     case 'REMOVE_ITEM': {
//       return state.filter(ci => ci._id !== action.payload);
//     }
//     case 'UPDATE_ITEM': {
//       const { _id, quantity} = action.payload;
//       return state.map(ci => ci._id === _id ? {...ci, quantity} : ci)
//     }
//     case 'CLEAR_CART':
//       return [];
//     default: return state;

//   }
// }

// //initialise cart from local storage
// const initializer = () => {
//   // if(typeof window !== 'undefined'){
//   //   const localCart = localStorage.getItem('cart');
//   //   return localCart ? JSON.parse(localCart) : [];
//   // }
//   // return [];

//   try{
//     return JSON.parse(localStorage.getItem('cart') || '[]')
//   }
//   catch {
//     return []
//   }
// }

// export const CartProvider = ({ children }) => {
//   const [cartItems, dispatch] = useReducer(cartReducer, [], initializer);
//   //persist cart state to localstorage
//   useEffect(() => {
//     localStorage.setItem('cart', JSON.stringify(cartItems))

//   }, [cartItems])

//       //HYDRATE FROM SERVER API
//       useEffect(() => {
//         const token = localStorage.getItem('authToken')
//         axios.get('http://localhost:4000/api/cart',{
//           withCredentials: true,
//           headers:{ Authorization : `Bearer ${token}`},
//         })
//         .then(res => dispatch({ type: 'HYDRATE_CART', payload: res.data}))
//         .catch(err => {if (err.response?.status !==401) console.error(err)})
//       })


 
//   //dispatcher wrapped with useCallback for performance
//   const addToCart = useCallback(async (item, qty) => {
//     const token = localStorage.getItem('authToken')

//     const res = await axios.post(
//       'http://localhost:4000/api/cart',
//       { itemId:  item._id, quantity: qty},
//       {
//          withCredentials: true,
//          headers:{ Authorization: `Bearer ${token}`}
//       }
//     )

//     dispatch({type: 'ADD_ITEM', payload: res.data})
//   }, [])

//   const removeFromCart = useCallback(async _id =>{
//     const token = localStorage.getItem('authToken')
//      await axios.delete(
//        `http://localhost:4000/api/cart/${_id}`,
//        {
//          withCredentials: true,
//          headers: { Authorization: `Bearer ${token}` }
//        }

//      )
//     dispatch({type: 'REMOVE_ITEM', payload: _id})
//   }, [])

//   const updateQuantity = useCallback(async (_id, qty) => {
//     const token = localStorage.getItem('authToken')
//     const res = await axios.put(
//       `http://localhost:4000/api/cart/${_id}`,
//       {quantity: qty},
//       {
//         withCredentials: true,
//         headers: { Authorization: `Bearer ${token}` }
//       }
//     )
//     dispatch({type: 'UPDATE_ITEM', payload: res.data })
//   },[])

//   const clearCart = useCallback(async () => {
//     const token = localStorage.getItem('authToken')
//     await axios.post(
//       'http://localhost:4000/api/cart/clear',
//       {},
//       {
//         withCredentials: true,
//         headers: { Authorization: `Bearer ${token}` }
//       }
//     )
//     dispatch({ type: 'CLEAR_CART'})
//   }, [])


//   const totalItems = cartItems.reduce((sum, ci) => sum + ci.quantity, 0);
//   const totalAmount = cartItems.reduce((sum,ci) => {
//     const price = ci?.item?.price ?? 0;
//     const qty = ci?.quantity ?? 0;
//     return sum + price * qty
//   }, 0)


//   return (
//     <CartContext.Provider value={{
//       cartItems,
//       addToCart,
//       removeFromCart,
//       updateQuantity,
//       clearCart,
//       totalItems,
//       totalAmount
//     }}>
//           {children}
//     </CartContext.Provider>
//   )
// }

// export const useCart =() => useContext(CartContext)






import React, { createContext, useCallback, useContext, useEffect, useReducer, useRef } from 'react'
import axios from 'axios'

const CartContext = createContext();

// Reducer Handling Cart actions like add, remove, update, quantity and item
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

    case 'REMOVE_ITEM': {
      return state.filter(ci => ci._id !== action.payload);
    }

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
}

// Initialize cart from local storage
const initializer = () => {
  try {
    return JSON.parse(localStorage.getItem('cart') || '[]');
  } catch {
    return [];
  }
}

export const CartProvider = ({ children }) => {
  const [cartItems, dispatch] = useReducer(cartReducer, [], initializer);

  // Track if we've already attempted to hydrate
  const hasHydratedRef = useRef(false);

  // Persist cart state to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // HYDRATE FROM SERVER API - ONLY ONCE and when token changes
  useEffect(() => {
    const hydrateCart = async () => {
      const token = localStorage.getItem('authToken');

      // If no token, don't attempt to fetch
      if (!token) {
        console.log('No auth token, skipping cart hydration');
        return;
      }

      // Prevent multiple hydration attempts
      if (hasHydratedRef.current) {
        console.log('Already hydrated, skipping');
        return;
      }

      try {
        console.log('Attempting to hydrate cart...');
        const res = await axios.get('http://localhost:4000/api/cart', {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          timeout: 5000 // Add timeout to prevent hanging
        });

        console.log('Cart hydration successful:', res.data);
        hasHydratedRef.current = true;

        // Only update if we have valid data
        if (res.data && Array.isArray(res.data)) {
          dispatch({ type: 'HYDRATE_CART', payload: res.data });
        }
      } catch (err) {
        console.error('Cart hydration error:', err);

        // Handle specific error cases
        if (err.response?.status === 401) {
          console.log('Token expired or invalid, clearing token');
          localStorage.removeItem('authToken');
          localStorage.removeItem('cart'); // Clear local cart too
        } else if (err.response?.status === 403) {
          console.log('Forbidden - insufficient permissions');
        } else if (err.code === 'ECONNABORTED') {
          console.log('Request timeout - server might be down');
        }

        // Mark as hydrated even on error to prevent retries
        hasHydratedRef.current = true;
      }
    };

    // Only hydrate if we haven't already
    if (!hasHydratedRef.current) {
      hydrateCart();
    }

    // Add event listener for login/logout events
    const handleStorageChange = (e) => {
      if (e.key === 'authToken') {
        // Reset hydration flag when token changes
        hasHydratedRef.current = false;
        console.log('Auth token changed, resetting hydration flag');
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []); // Empty dependency array - runs once on mount

  // Dispatcher wrapped with useCallback for performance
  const addToCart = useCallback(async (item, qty) => {
    const token = localStorage.getItem('authToken');

    // Validate token exists
    if (!token) {
      console.error('No auth token found. Please log in.');
      throw new Error('Authentication required');
    }

    try {
      const res = await axios.post(
        'http://localhost:4000/api/cart',
        { itemId: item._id, quantity: qty },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      dispatch({ type: 'ADD_ITEM', payload: res.data });
      return res.data;
    } catch (err) {
      console.error('Add to cart error:', err);

      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem('authToken');
        throw new Error('Session expired. Please log in again.');
      }

      throw err;
    }
  }, []);

  const removeFromCart = useCallback(async (_id) => {
    const token = localStorage.getItem('authToken');

    if (!token) {
      throw new Error('Authentication required');
    }

    try {
      await axios.delete(
        `http://localhost:4000/api/cart/${_id}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      dispatch({ type: 'REMOVE_ITEM', payload: _id });
    } catch (err) {
      console.error('Remove from cart error:', err);

      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem('authToken');
        throw new Error('Session expired');
      }

      throw err;
    }
  }, []);

  const updateQuantity = useCallback(async (_id, qty) => {
    const token = localStorage.getItem('authToken');

    if (!token) {
      throw new Error('Authentication required');
    }

    try {
      const res = await axios.put(
        `http://localhost:4000/api/cart/${_id}`,
        { quantity: qty },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      dispatch({ type: 'UPDATE_ITEM', payload: res.data });
      return res.data;
    } catch (err) {
      console.error('Update quantity error:', err);

      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem('authToken');
        throw new Error('Session expired');
      }

      throw err;
    }
  }, []);

  const clearCart = useCallback(async () => {
    const token = localStorage.getItem('authToken');

    if (!token) {
      throw new Error('Authentication required');
    }

    try {
      await axios.post(
        'http://localhost:4000/api/cart/clear',
        {},
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      dispatch({ type: 'CLEAR_CART' });
    } catch (err) {
      console.error('Clear cart error:', err);

      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem('authToken');
        throw new Error('Session expired');
      }

      throw err;
    }
  }, []);

  const totalItems = cartItems.reduce((sum, ci) => sum + (ci?.quantity || 0), 0);

  const totalAmount = cartItems.reduce((sum, ci) => {
    const price = ci?.item?.price ?? 0;
    const qty = ci?.quantity ?? 0;
    return sum + (price * qty);
  }, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalAmount,
      isLoading: false // Add loading state if needed
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
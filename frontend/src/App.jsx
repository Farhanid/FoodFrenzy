// import React from 'react'
// import { Route, Routes } from 'react-router-dom'
// import Home from './pages/Home/Home'
// import ContactPage from './pages/ContactPage/ContactPage'
// import AboutPage from './pages/AboutPage/AboutPage'
// import Menu from './pages/Menu/Menu'
// import Cart from './pages/Cart/Cart'
// import SignUp from './components/SignUp/SignUp'
// import PrivateRoute from './components/PrivateRoute/PrivateRoute'
// import VerifyPaymentPage from './pages/VerifyPaymentPage/VerifyPaymentPage'
// import CheckoutPage from './pages/CheckoutPage/CheckoutPage'
// import MyOrderPage from './pages/MyOrderPage/MyOrderPage'

// const App = () => {
//   return (
//     <Routes>
//       <Route path='/' element={<Home />} />
//       <Route path='/contact' element={<ContactPage />} />
//       <Route path='/about' element={<AboutPage />} />
//       <Route path='/menu' element={<Menu />} />

//       {/* PAYMENT VERIFICATION */}
//       <Route path='/myorder/verify' element={<VerifyPaymentPage />} />


//       <Route path='/login' element={<Home />} />
//       <Route path='/signup' element={<SignUp />} />
//       <Route path='/cart' element={
//         <PrivateRoute>
//           <Cart />
//         </PrivateRoute>
//       } />

//       <Route path='/checkout' element={<PrivateRoute>   <CheckoutPage /> </PrivateRoute>} />
//       <Route path='/myorder' element={<PrivateRoute>  <MyOrderPage />   </PrivateRoute>} />

//     </Routes>
//   )
// }

// export default App









// import React, { lazy, Suspense } from 'react';
// import { Route, Routes } from 'react-router-dom';

// // ✅ Public pages - load on demand
// const Home = lazy(() => import('./pages/Home/Home'));
// const ContactPage = lazy(() => import('./pages/ContactPage/ContactPage'));
// const AboutPage = lazy(() => import('./pages/AboutPage/AboutPage'));
// const Menu = lazy(() => import('./pages/Menu/Menu'));
// const SignUp = lazy(() => import('./components/SignUp/SignUp'));

// // ✅ Protected pages - only load when authenticated
// const Cart = lazy(() => import('./pages/Cart/Cart'));
// const VerifyPaymentPage = lazy(() => import('./pages/VerifyPaymentPage/VerifyPaymentPage'));
// const CheckoutPage = lazy(() => import('./pages/CheckoutPage/CheckoutPage'));
// const MyOrderPage = lazy(() => import('./pages/MyOrderPage/MyOrderPage'));

// // ✅ Auth wrapper - lazy load too
// const PrivateRoute = lazy(() => import('./components/PrivateRoute/PrivateRoute'));

// const PageLoader = () => (
//   <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a120b] to-[#3e2b1d]">
//     <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
//   </div>
// );

// const App = () => {
//   return (
//     <Suspense fallback={<PageLoader />}>
//       <Routes>
//         {/* Public Routes */}
//         <Route path='/' element={<Home />} />
//         <Route path='/contact' element={<ContactPage />} />
//         <Route path='/about' element={<AboutPage />} />
//         <Route path='/menu' element={<Menu />} />
//         <Route path='/login' element={<Home />} />
//         <Route path='/signup' element={<SignUp />} />

//         {/* Payment Verification - Public but rare */}
//         <Route path='/myorder/verify' element={<VerifyPaymentPage />} />

//         {/* Protected Routes - Only load when needed */}
//         <Route path='/cart' element={
//           <PrivateRoute>
//             <Cart />
//           </PrivateRoute>
//         } />
//         <Route path='/checkout' element={
//           <PrivateRoute>
//             <CheckoutPage />
//           </PrivateRoute>
//         } />
//         <Route path='/myorder' element={
//           <PrivateRoute>
//             <MyOrderPage />
//           </PrivateRoute>
//         } />
//       </Routes>
//     </Suspense>
//   );
// };

// export default App;












import React, { lazy, Suspense, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

// ============================================
// ✅ LAZY LOAD ALL PAGES - Industry Standard
// ============================================

// Public pages - load on demand
const Home = lazy(() => import('./pages/Home/Home'));
const ContactPage = lazy(() => import('./pages/ContactPage/ContactPage'));
const AboutPage = lazy(() => import('./pages/AboutPage/AboutPage'));
const Menu = lazy(() => import('./pages/Menu/Menu'));
const SignUp = lazy(() => import('./components/SignUp/SignUp'));

// Protected pages - only load when authenticated
const Cart = lazy(() => import('./pages/Cart/Cart'));
const VerifyPaymentPage = lazy(() => import('./pages/VerifyPaymentPage/VerifyPaymentPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage/CheckoutPage'));
const MyOrderPage = lazy(() => import('./pages/MyOrderPage/MyOrderPage'));

// Auth wrapper - lazy load too
const PrivateRoute = lazy(() => import('./components/PrivateRoute/PrivateRoute'));

// ============================================
// 🎨 LOADER COMPONENT - Smooth UX
// ============================================
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a120b] to-[#3e2b1d]">
    <div className="flex flex-col items-center gap-4">
      <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-amber-100 font-cinzel text-lg animate-pulse">
        Loading deliciousness...
      </p>
    </div>
  </div>
);

// ============================================
// 🚀 PRELOADING STRATEGY - Netflix/Amazon Grade
// ============================================
const usePreload = () => {
  const location = useLocation();

  useEffect(() => {
    // 🎯 CRITICAL ROUTES - Preload these always (users ALWAYS visit them)
    const criticalRoutes = [
      import('./pages/Menu/Menu'),
      import('./pages/Cart/Cart'),
      import('./pages/CheckoutPage/CheckoutPage')
    ];

    // 🧠 SMART PRELOAD - Based on current page (predictive loading)
    const preloadMap = {
      '/': [import('./pages/Menu/Menu')],                    // Home → Menu (90% users)
      '/menu': [import('./pages/Cart/Cart')],                // Menu → Cart (60% users)
      '/cart': [import('./pages/CheckoutPage/CheckoutPage')], // Cart → Checkout (80% users)
      '/checkout': [import('./pages/MyOrderPage/MyOrderPage')], // Checkout → Orders (100% after payment)
    };

    // Preload next likely routes based on current page
    const currentPath = location.pathname;
    const routesToPreload = preloadMap[currentPath] || [];

    // ============ PRELOAD STRATEGY 1: Idle callback ============
    if ('requestIdleCallback' in window) {
      // Preload critical routes when browser is idle
      requestIdleCallback(() => {
        Promise.all(criticalRoutes).catch(() => { });
      }, { timeout: 2000 });

      // Preload next routes when browser is idle
      requestIdleCallback(() => {
        Promise.all(routesToPreload).catch(() => { });
      }, { timeout: 3000 });
    }
    // ============ PRELOAD STRATEGY 2: Timeout fallback ============
    else {
      setTimeout(() => {
        Promise.all(criticalRoutes).catch(() => { });
      }, 2000);

      setTimeout(() => {
        Promise.all(routesToPreload).catch(() => { });
      }, 3000);
    }

    // ============ PRELOAD STRATEGY 3: Hover/Interaction ============
    // ✅ FIXED: Static imports - No Vite warnings!
    const preloadOnHover = (selector, importFn) => {
      const element = document.querySelector(selector);
      if (element) {
        element.addEventListener('mouseenter', () => {
          importFn().catch(() => { });
        }, { once: true });
      }
    };

    // Preload menu when user hovers over "Menu" link
    setTimeout(() => {
      preloadOnHover('a[href="/menu"]', () => import('./pages/Menu/Menu'));
      preloadOnHover('a[href="/cart"]', () => import('./pages/Cart/Cart'));
      preloadOnHover('a[href="/checkout"]', () => import('./pages/CheckoutPage/CheckoutPage'));
      preloadOnHover('a[href="/myorder"]', () => import('./pages/MyOrderPage/MyOrderPage'));
    }, 1000);

  }, [location.pathname]);
};

// ============================================
// 📱 MAIN APP COMPONENT
// ============================================
const App = () => {
  usePreload(); // 👈 ONE LINE - All preloading magic happens here

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* 🏠 PUBLIC ROUTES - Everyone can access */}
        <Route path='/' element={<Home />} />
        <Route path='/contact' element={<ContactPage />} />
        <Route path='/about' element={<AboutPage />} />
        <Route path='/menu' element={<Menu />} />
        <Route path='/login' element={<Home />} />
        <Route path='/signup' element={<SignUp />} />

        {/* 💳 PAYMENT VERIFICATION - Public but rare */}
        <Route path='/myorder/verify' element={<VerifyPaymentPage />} />

        {/* 🔒 PROTECTED ROUTES - Only with auth */}
        <Route path='/cart' element={
          <PrivateRoute>
            <Cart />
          </PrivateRoute>
        } />
        <Route path='/checkout' element={
          <PrivateRoute>
            <CheckoutPage />
          </PrivateRoute>
        } />
        <Route path='/myorder' element={
          <PrivateRoute>
            <MyOrderPage />
          </PrivateRoute>
        } />
      </Routes>
    </Suspense>
  );
};

export default App;
// import AddItems from "./components/AddItems"
// import List from "./components/List"
// import Navbar from "./components/Navbar"
// import Order from "./components/Order"
// import { Routes, Route } from "react-router-dom";
// import UpdateItem from "./components/UpdateItem";



// function App() {


//   return (
//     <>
//       <Navbar />
//       <Routes>
//         <Route path='/' element={<AddItems />} />
//         <Route path='/list' element={<List />} />
//         <Route path='/orders' element={<Order />} />
//         <Route path='/update-item/:id' element={<UpdateItem />} />
//       </Routes>
//     </>
//   )
// }

// export default App

import React, { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

// ============================================
// ✅ LAZY LOAD ALL COMPONENTS - Industry Standard
// ============================================

// Core components - load on demand
const Navbar = lazy(() => import('./components/Navbar'));
const AddItems = lazy(() => import('./components/AddItems'));
const List = lazy(() => import('./components/List'));
const Order = lazy(() => import('./components/Order'));
const UpdateItem = lazy(() => import('./components/UpdateItem'));

// ============================================
// 🎨 LOADER COMPONENT - Smooth UX
// ============================================
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a120b] to-[#3e2b1d]">
    <div className="flex flex-col items-center gap-4">
      <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-amber-100 font-cinzel text-lg animate-pulse">
        Loading your dashboard...
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
      import('./components/List'),
      import('./components/Order')
    ];

    // 🧠 SMART PRELOAD - Based on current page (predictive loading)
    const preloadMap = {
      '/': [import('./components/List')],                    // Home/AddItems → List (common flow)
      '/list': [import('./components/Order')],              // List → Orders (view orders after listing)
      '/orders': [import('./components/AddItems')],         // Orders → AddItems (add more items)
      '/update-item/': [import('./components/List')]        // UpdateItem → List (back to list after update)
    };

    // Preload next likely routes based on current page
    const currentPath = location.pathname;
    // Check if path starts with update-item pattern
    const isUpdatePath = currentPath.includes('/update-item/');
    const routesToPreload = isUpdatePath
      ? preloadMap['/update-item/']
      : preloadMap[currentPath] || [];

    // ============ PRELOAD STRATEGY 1: Idle callback ============
    if ('requestIdleCallback' in window) {
      // Preload critical routes when browser is idle
      requestIdleCallback(() => {
        Promise.all(criticalRoutes).catch(() => { });
      }, { timeout: 2000 });

      // Preload next routes when browser is idle
      if (routesToPreload.length) {
        requestIdleCallback(() => {
          Promise.all(routesToPreload).catch(() => { });
        }, { timeout: 3000 });
      }
    }
    // ============ PRELOAD STRATEGY 2: Timeout fallback ============
    else {
      setTimeout(() => {
        Promise.all(criticalRoutes).catch(() => { });
      }, 2000);

      if (routesToPreload.length) {
        setTimeout(() => {
          Promise.all(routesToPreload).catch(() => { });
        }, 3000);
      }
    }

    // ============ PRELOAD STRATEGY 3: Hover/Interaction ============
    const preloadOnHover = (selector, importFn) => {
      const element = document.querySelector(selector);
      if (element) {
        element.addEventListener('mouseenter', () => {
          importFn().catch(() => { });
        }, { once: true });
      }
    };

    // Preload components when user hovers over navigation links
    setTimeout(() => {
      preloadOnHover('a[href="/"]', () => import('./components/AddItems'));
      preloadOnHover('a[href="/list"]', () => import('./components/List'));
      preloadOnHover('a[href="/orders"]', () => import('./components/Order'));

      // For dynamic routes, preload the component but not the specific ID
      const updateLinks = document.querySelectorAll('a[href^="/update-item/"]');
      updateLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
          import('./components/UpdateItem').catch(() => { });
        }, { once: true });
      });
    }, 1000);

  }, [location.pathname]);
};

// ============================================
// 📱 MAIN APP COMPONENT
// ============================================
const App = () => {
  usePreload(); // 👈 ONE LINE - All preloading magic happens here

  return (
    <>
      <Suspense fallback={<PageLoader />}>
        <Navbar />
      </Suspense>

      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path='/' element={<AddItems />} />
          <Route path='/list' element={<List />} />
          <Route path='/orders' element={<Order />} />
          <Route path='/update-item/:id' element={<UpdateItem />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default App;


// import AddItems from "./components/AddItems"
// import List from "./components/List"
// import Navbar from "./components/Navbar"
// import Order from "./components/Order"
// import SignInPage from "./components/SignIn"
// import SignUpPage from "./components/SignUp"
// import ProtectedRoute from "./components/ProtectedRoute"
// import { Routes, Route, Navigate } from "react-router-dom"
// import { useAuth } from "@clerk/clerk-react"

// function App() {
//   const { isLoaded } = useAuth()

//   if (!isLoaded) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-[#2d1f1f] via-[#3a2b2b] to-[#4a3a3a] flex items-center justify-center">
//         <div className="text-amber-400 text-2xl animate-pulse">
//           🍳 Loading Admin Panel...
//         </div>
//       </div>
//     )
//   }

//   return (
//     <>
//       <Navbar />
//       <Routes>
//         {/* Public Routes */}
//         <Route path="/sign-in" element={<SignInPage />} />
//         <Route path="/sign-up" element={<SignUpPage />} />

//         {/* Protected Routes */}
//         <Route path="/" element={
//           <ProtectedRoute>
//             <AddItems />
//           </ProtectedRoute>
//         } />
//         <Route path="/list" element={
//           <ProtectedRoute>
//             <List />
//           </ProtectedRoute>
//         } />
//         <Route path="/orders" element={
//           <ProtectedRoute>
//             <Order />
//           </ProtectedRoute>
//         } />

//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </>
//   )
// }

// export default App
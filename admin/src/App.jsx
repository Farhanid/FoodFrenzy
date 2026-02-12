

import React, { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';



const Navbar = lazy(() => import('./components/Navbar'));
const AddItems = lazy(() => import('./components/AddItems'));
const List = lazy(() => import('./components/List'));
const Order = lazy(() => import('./components/Order'));
const UpdateItem = lazy(() => import('./components/UpdateItem'));


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


const usePreload = () => {
  const location = useLocation();

  useEffect(() => {
   
    const criticalRoutes = [
      import('./components/List'),
      import('./components/Order')
    ];

   
    const preloadMap = {
      '/': [import('./components/List')],                    
      '/list': [import('./components/Order')],             
      '/orders': [import('./components/AddItems')],         
      '/update-item/': [import('./components/List')]      
    };

 
    const currentPath = location.pathname;

    const isUpdatePath = currentPath.includes('/update-item/');
    const routesToPreload = isUpdatePath
      ? preloadMap['/update-item/']
      : preloadMap[currentPath] || [];

    if ('requestIdleCallback' in window) {
    
      requestIdleCallback(() => {
        Promise.all(criticalRoutes).catch(() => { });
      }, { timeout: 2000 });

   
      if (routesToPreload.length) {
        requestIdleCallback(() => {
          Promise.all(routesToPreload).catch(() => { });
        }, { timeout: 3000 });
      }
    }
 
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

 
    const preloadOnHover = (selector, importFn) => {
      const element = document.querySelector(selector);
      if (element) {
        element.addEventListener('mouseenter', () => {
          importFn().catch(() => { });
        }, { once: true });
      }
    };


    setTimeout(() => {
      preloadOnHover('a[href="/"]', () => import('./components/AddItems'));
      preloadOnHover('a[href="/list"]', () => import('./components/List'));
      preloadOnHover('a[href="/orders"]', () => import('./components/Order'));

     
      const updateLinks = document.querySelectorAll('a[href^="/update-item/"]');
      updateLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
          import('./components/UpdateItem').catch(() => { });
        }, { once: true });
      });
    }, 1000);

  }, [location.pathname]);
};


const App = () => {
  usePreload();

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

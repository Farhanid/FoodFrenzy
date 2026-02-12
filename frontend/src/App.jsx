import React, { lazy, Suspense, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';




const Home = lazy(() => import('./pages/Home/Home'));
const ContactPage = lazy(() => import('./pages/ContactPage/ContactPage'));
const AboutPage = lazy(() => import('./pages/AboutPage/AboutPage'));
const Menu = lazy(() => import('./pages/Menu/Menu'));
const SignUp = lazy(() => import('./components/SignUp/SignUp'));


const Cart = lazy(() => import('./pages/Cart/Cart'));
const VerifyPaymentPage = lazy(() => import('./pages/VerifyPaymentPage/VerifyPaymentPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage/CheckoutPage'));
const MyOrderPage = lazy(() => import('./pages/MyOrderPage/MyOrderPage'));


const PrivateRoute = lazy(() => import('./components/PrivateRoute/PrivateRoute'));


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


const usePreload = () => {
  const location = useLocation();

  useEffect(() => {

    const criticalRoutes = [
      import('./pages/Menu/Menu'),
      import('./pages/Cart/Cart'),
      import('./pages/CheckoutPage/CheckoutPage')
    ];


    const preloadMap = {
      '/': [import('./pages/Menu/Menu')],
      '/menu': [import('./pages/Cart/Cart')],
      '/cart': [import('./pages/CheckoutPage/CheckoutPage')],
      '/checkout': [import('./pages/MyOrderPage/MyOrderPage')],
    };


    const currentPath = location.pathname;
    const routesToPreload = preloadMap[currentPath] || [];


    if ('requestIdleCallback' in window) {

      requestIdleCallback(() => {
        Promise.all(criticalRoutes).catch(() => { });
      }, { timeout: 2000 });


      requestIdleCallback(() => {
        Promise.all(routesToPreload).catch(() => { });
      }, { timeout: 3000 });
    }

    else {
      setTimeout(() => {
        Promise.all(criticalRoutes).catch(() => { });
      }, 2000);

      setTimeout(() => {
        Promise.all(routesToPreload).catch(() => { });
      }, 3000);
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
      preloadOnHover('a[href="/menu"]', () => import('./pages/Menu/Menu'));
      preloadOnHover('a[href="/cart"]', () => import('./pages/Cart/Cart'));
      preloadOnHover('a[href="/checkout"]', () => import('./pages/CheckoutPage/CheckoutPage'));
      preloadOnHover('a[href="/myorder"]', () => import('./pages/MyOrderPage/MyOrderPage'));
    }, 1000);

  }, [location.pathname]);
};


const App = () => {
  usePreload();

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>

        <Route path='/' element={<Home />} />
        <Route path='/contact' element={<ContactPage />} />
        <Route path='/about' element={<AboutPage />} />
        <Route path='/menu' element={<Menu />} />
        <Route path='/login' element={<Home />} />
        <Route path='/signup' element={<SignUp />} />


        <Route path='/myorder/verify' element={<VerifyPaymentPage />} />


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
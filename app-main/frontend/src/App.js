import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Toaster } from '@/components/ui/sonner';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import CartDrawer from '@/components/CartDrawer';
import Home from '@/pages/Home';
import Stores from '@/pages/Stores';
import StoreProfile from '@/pages/StoreProfile';
import News from '@/pages/News';
import Services from '@/pages/Services';
import Trips from '@/pages/Trips';
import Admin from '@/pages/Admin';
import '@/App.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <div className="App min-h-screen">
              <Routes>
                <Route path="/admin" element={<Admin />} />
                <Route
                  path="*"
                  element={
                    <>
                      <Header />
                      <main className="max-w-7xl mx-auto">
                        <Routes>
                          <Route path="/" element={<Home />} />
                          <Route path="/stores" element={<Stores />} />
                          <Route path="/stores/:storeId" element={<StoreProfile />} />
                          <Route path="/news" element={<News />} />
                          <Route path="/services" element={<Services />} />
                          <Route path="/trips" element={<Trips />} />
                        </Routes>
                      </main>
                      <BottomNav />
                      <CartDrawer />
                    </>
                  }
                />
              </Routes>
              <Toaster position="top-center" />
            </div>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { IntroLoader } from './components/IntroLoader';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { Home } from './pages/Home/Home';
import { Creations } from './pages/Creations/Creations';
import { Menu } from './pages/Menu/Menu';
import { About } from './pages/About/About';
import { Contact } from './pages/Contact/Contact';

export const App: React.FC = () => {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      {/* Subtle Reference Scanlines Overlay */}
      <div className="page-scanlines" aria-hidden="true" />

      {/* Patisserie Atelier Slatted Shutter Loader */}
      <IntroLoader />

      {/* Top Navigation & Fullscreen ANK Menu Overlay */}
      <Navigation />

      {/* 5 Main Editorial Pages */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/creations" element={<Creations />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/story" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>

      {/* Animated ARK-Style Footer */}
      <Footer />
    </BrowserRouter>
  );
};

export default App;

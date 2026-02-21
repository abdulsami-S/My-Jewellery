// import React from "react";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import "@/App.css";
// import HomePage from "@/pages/HomePage";
// import CollectionsPage from "@/pages/CollectionsPage";
// import ProductDetailPage from "@/pages/ProductDetailPage";
// import WorkshopPage from "@/pages/WorkshopPage";
// import MetalRatesPage from "@/pages/MetalRatesPage";
// import AboutPage from "@/pages/AboutPage";
// import ContactPage from "@/pages/ContactPage";
// import OrganizerDashboard from "@/pages/OrganizerDashboard";
// import { Toaster } from "@/components/ui/sonner";



// function App() {
//   return (
//     <div className="App">
//       <BrowserRouter>
//         <Routes>
//           <Route path="/" element={<HomePage />} />
//           <Route path="/collections" element={<CollectionsPage />} />
//           <Route path="/product/:id" element={<ProductDetailPage />} />
//           <Route path="/workshop" element={<WorkshopPage />} />
//           <Route path="/metal-rates" element={<MetalRatesPage />} />
//           <Route path="/about" element={<AboutPage />} />
//           <Route path="/contact" element={<ContactPage />} />
//           <Route path="/organizer" element={<OrganizerDashboard />} />
//         </Routes>
//       </BrowserRouter>
//       <Toaster position="top-center" />
//     </div>
//   );
// }

// export default App;


import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "@/App.css";

import HomePage from "@/pages/HomePage";
import CollectionsPage from "@/pages/CollectionsPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import WorkshopPage from "@/pages/WorkshopPage";
import MetalRatesPage from "@/pages/MetalRatesPage";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";
import OrganizerDashboard from "@/pages/OrganizerDashboard";

import { Toaster } from "@/components/ui/sonner";
import Lenis from "@studio-freight/lenis";

// Scroll to top on page change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // If Lenis exists, scroll using Lenis
    if (window.lenis) {
      window.lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}

function App() {
  // Initialize smooth scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
      smoothTouch: false,
    });

    // Make Lenis global
    window.lenis = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  return (
    <div className="App">
      <BrowserRouter>

        {/* IMPORTANT → Scroll to top */}
        <ScrollToTop />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/collections" element={<CollectionsPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/workshop" element={<WorkshopPage />} />
          <Route path="/metal-rates" element={<MetalRatesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/organizer" element={<OrganizerDashboard />} />
        </Routes>
      </BrowserRouter>

      <Toaster position="top-center" />
    </div>
  );
}

export default App;

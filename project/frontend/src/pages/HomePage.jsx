import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Star, Award, Clock, Shield } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function HomePage() {
  const navigate = useNavigate();
  const [bestsellers, setBestsellers] = useState([]);
  const [metalRates, setMetalRates] = useState(null);
  const [testimonials, setTestimonials] = useState([]);

  // AUTO UPDATE EVERY 5 SEC
  useEffect(() => {
    fetchBestsellers();
    fetchMetalRates();
    fetchTestimonials();

    const interval = setInterval(() => {
      fetchBestsellers();
      fetchMetalRates();
      fetchTestimonials();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchBestsellers = async () => {
    try {
      const response = await axios.get(`${API}/bestsellers?limit=3`);
      setBestsellers(response.data);
    } catch (error) {
      console.error("Error fetching bestsellers:", error);
    }
  };

  const fetchMetalRates = async () => {
    try {
      const response = await axios.get(`${API}/metal-rates`);
      setMetalRates(response.data);
    } catch (error) {
      console.error("Error fetching metal rates:", error);
    }
  };

  const fetchTestimonials = async () => {
    try {
      const response = await axios.get(`${API}/testimonials`);
      setTestimonials(response.data.slice(0, 3));
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    }
  };

  const collections = [
    { name: "Gold", image: "https://i.pinimg.com/736x/6a/62/0d/6a620df89dd487d7603e77f24e6a81d7.jpg" },
    { name: "Silver", image: "https://i.pinimg.com/736x/f3/77/e1/f377e1d79af5ddb053b918ec937c677a.jpg" },
    { name: "Diamond", image: "https://i.pinimg.com/736x/73/11/ae/7311ae4ca26ebbf48c45bade8aed200e.jpg" }
  ];

  const categories = [
    { name: "Women", image: "https://i.pinimg.com/736x/2d/69/9c/2d699ccf37c804988a84dea96eb43d73.jpg" },
    { name: "Men", image: "https://i.pinimg.com/736x/e6/ec/75/e6ec75aa1dc5059b3de9a403338f799e.jpg" },
    { name: "Kids", image: "https://i.pinimg.com/736x/0c/71/8f/0c718f661046bb7e431fb7343719182d.jpg" }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* HERO SECTION */}
      <section className="hero-gradient relative min-h-[90vh] flex items-center justify-center px-4">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-amber-200/20 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-tl from-rose-200/20 to-transparent rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 text-center max-w-5xl mx-auto">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="gold-shimmer">Crafting Dreams into</span>
            <br />
            <span className="maroon-text">Timeless Treasures</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Where Tradition Meets Elegance Since 1995
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button className="btn-gold text-lg px-8 py-6" onClick={() => navigate("/collections")}> 
              Shop Now
            </Button>
            <Button
              variant="outline"
              className="border-2 border-amber-700 text-amber-900 hover:bg-amber-70 text-lg px-8 py-6"
              onClick={() => navigate("/workshop")}
            >
              Our Workshop
            </Button>
          </div>
        </div>
      </section>

      {/* 🟡 FIXED — LIVE METAL RATES TICKER*/}
      {metalRates && (
        <section className="bg-gradient-to-r from-amber-900 via-amber-800 to-rose-900 text-white py-3 border-y border-amber-700/40">
          <div className="max-w-7xl mx-auto flex items-center gap-6 overflow-hidden">

            {/* Label */}
            <div className="flex items-center gap-2 flex-shrink-0">
            
            <span className="text-base sm:text-lg font-semibold uppercase tracking-[0.25em] text-amber-200">
              Live Metal Rates
            </span>

              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            {/* Smooth Scroll */}
            <div className="marquee">
              <div className="animate-marquee">

                <div className="metal-pill">
                  <span className="metal-pill-label">Gold 22K</span>
                  <span className="metal-pill-value">₹{metalRates.gold_22k}/g</span>
                </div>

                <div className="metal-pill">
                  <span className="metal-pill-label">Gold 24K</span>
                  <span className="metal-pill-value">₹{metalRates.gold_24k}/g</span>
                </div>

                <div className="metal-pill">
                  <span className="metal-pill-label">Silver 999</span>
                  <span className="metal-pill-value">₹{metalRates.silver_999}/g</span>
                </div>

                <div className="metal-pill">
                  <span className="metal-pill-label">Diamond</span>
                  <span className="metal-pill-value">₹{metalRates.diamond_per_carat}/ct</span>
                </div>

              </div>
            </div>
          </div>
        </section>
      )}

      {/* REST OF YOUR PAGE — Collections / Categories / Testimonials */}
      {/* (Unchanged, left as in your original code) */}
      
      {/* Featured Collections */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-bold text-center mb-4">
            <span className="gold-text">Explore Our</span> Collections
          </h2>
          <p className="text-center text-gray-600 mb-12 text-lg">Handcrafted with passion and precision</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {collections.map((collection, index) => (
              <Card
                key={index}
                className="product-card overflow-hidden cursor-pointer luxury-border bg-white"
                onClick={() => navigate(`/collections?metal=${collection.name}`)}
              >
                <div className="relative h-80 overflow-hidden">
                  <img src={collection.image} alt={collection.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                    <h3 className="text-3xl font-bold text-white p-6">{collection.name}</h3>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* (Categories, Bestsellers, Why Choose Us, Testimonials — unchanged) */}

      <Footer />

      {/* WhatsApp Float */}
      <a
        href="https://wa.me/917013174340"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float"
      >
        <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884" />
        </svg>
      </a>

    </div>
  );
}










import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SlidersHorizontal } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function CollectionsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [metalRates, setMetalRates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    metal_type: searchParams.get("metal") || "",
    category: searchParams.get("category") || "",
    occasion: "",
    purity: "",
    min_price: "",
    max_price: "",
    sort_by: "new"
  });

  useEffect(() => {
    fetchProducts();
    fetchMetalRates();
  }, [filters]);

  // Auto-update every 60 seconds
  useEffect(() => {
  const interval = setInterval(() => {
    fetchProducts();
    fetchMetalRates();
  }, 60000); // 5 seconds

  return () => clearInterval(interval);
}, []);


  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== "all") params.append(key, value);
      });
      
      const response = await axios.get(`${API}/products?${params.toString()}`);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
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

  const calculatePrice = (product) => {
    if (!metalRates) return 0;
    
    let rate = 0;
    if (product.metal_type === "Gold") {
      rate = product.purity === "22K" ? metalRates.gold_22k : metalRates.gold_24k;
    } else if (product.metal_type === "Silver") {
      rate = metalRates.silver_999;
    } else {
      rate = metalRates.diamond_per_carat;
    }
    
    const metalValue = rate * product.weight;
    const makingCharges = metalValue * 0.10;
    const gstOnMetal = metalValue * 0.03;
    const gstOnMaking = makingCharges * 0.05;
    return Math.round(metalValue + makingCharges + gstOnMetal + gstOnMaking);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      metal_type: "",
      category: "",
      occasion: "",
      purity: "",
      min_price: "",
      max_price: "",
      sort_by: "new"
    });
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            <span className="gold-text">Our</span> Collections
          </h1>
          <p className="text-lg text-gray-600">Discover exquisite handcrafted jewellery</p>
        </div>

        {/* Filters & Sort */}
        <div className="mb-8" data-testid="filters-section">
          <div className="flex flex-wrap gap-4 items-center justify-between mb-4">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
              data-testid="toggle-filters-btn"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </Button>

            <div className="flex items-center gap-4">
              <span className="text-gray-600">Sort By:</span>
              <Select value={filters.sort_by} onValueChange={(value) => handleFilterChange("sort_by", value)}>
                <SelectTrigger className="w-[200px]" data-testid="sort-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bestseller">Best Sellers</SelectItem>
                  <SelectItem value="new">New Arrivals</SelectItem>
                  <SelectItem value="price_low">Price: Low to High</SelectItem>
                  <SelectItem value="price_high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <Card className="p-6 bg-white" data-testid="filters-panel">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Metal Type</label>
                  <Select value={filters.metal_type} onValueChange={(value) => handleFilterChange("metal_type", value)}>
                    <SelectTrigger data-testid="metal-type-select">
                      <SelectValue placeholder="All Metals" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Metals</SelectItem>
                      <SelectItem value="Gold">Gold</SelectItem>
                      <SelectItem value="Silver">Silver</SelectItem>
                      <SelectItem value="Diamond">Diamond</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <Select value={filters.category} onValueChange={(value) => handleFilterChange("category", value)}>
                    <SelectTrigger data-testid="category-select">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Men">Men</SelectItem>
                      <SelectItem value="Women">Women</SelectItem>
                      <SelectItem value="Kids">Kids</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Occasion</label>
                  <Select value={filters.occasion} onValueChange={(value) => handleFilterChange("occasion", value)}>
                    <SelectTrigger data-testid="occasion-select">
                      <SelectValue placeholder="All Occasions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Occasions</SelectItem>
                      <SelectItem value="Daily Wear">Daily Wear</SelectItem>
                      <SelectItem value="Wedding">Wedding</SelectItem>
                      <SelectItem value="Festive">Festive</SelectItem>
                      <SelectItem value="Gifting">Gifting</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Purity</label>
                  <Select value={filters.purity} onValueChange={(value) => handleFilterChange("purity", value)}>
                    <SelectTrigger data-testid="purity-select">
                      <SelectValue placeholder="All Purity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Purity</SelectItem>
                      <SelectItem value="18K">18K</SelectItem>
                      <SelectItem value="22K">22K</SelectItem>
                      <SelectItem value="24K">24K</SelectItem>
                      <SelectItem value="925">925 Silver</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button variant="outline" onClick={clearFilters} data-testid="clear-filters-btn">
                Clear Filters
              </Button>
            </Card>
          )}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="spinner"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20" data-testid="no-products-message">
            <p className="text-xl text-gray-600">No products found matching your criteria.</p>
            <Button onClick={clearFilters} className="mt-4 btn-gold">Clear Filters</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6" data-testid="products-grid">
            {products.map((product) => (
              <Card
                key={product.id}
                className="product-card overflow-hidden cursor-pointer bg-white"
                onClick={() => navigate(`/product/${product.id}`)}
                data-testid={`product-card-${product.id}`}
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={product.images[0]?.url || "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {product.view_count > 50 && (
                    <div className="absolute top-3 right-3 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      Bestseller
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2 line-clamp-1">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {product.purity} • {product.weight}g
                  </p>
                  <p className="text-xl font-bold gold-text">
                    ₹{calculatePrice(product).toLocaleString()}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

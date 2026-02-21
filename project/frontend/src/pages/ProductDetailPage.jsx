import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [priceBreakdown, setPriceBreakdown] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random()}`);

  useEffect(() => {
    fetchProduct();
    fetchPriceBreakdown();
    logVisit();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${API}/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  const fetchPriceBreakdown = async () => {
    try {
      const response = await axios.get(`${API}/products/${id}/price`);
      setPriceBreakdown(response.data);
    } catch (error) {
      console.error("Error fetching price breakdown:", error);
    }
  };

  const logVisit = async () => {
    try {
      await axios.post(`${API}/visitor-log`, {
        product_id: id,
        session_id: sessionId
      });
    } catch (error) {
      console.error("Error logging visit:", error);
    }
  };

  const nextImage = () => {
    if (product && product.images.length > 0) {
      setSelectedImage((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product && product.images.length > 0) {
      setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Product Not Found</h1>
          <Button onClick={() => window.history.back()} className="btn-gold">Go Back</Button>
        </div>
        <Footer />
      </div>
    );
  }

  const images = product.images.length > 0 ? product.images : [
    { url: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800", caption: "Product Image" }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-12" data-testid="product-detail-page">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Image Gallery */}
          <div data-testid="image-gallery">
            {/* Main Image */}
            <Card className="relative overflow-hidden mb-4 bg-white">
              <div className="relative h-[500px]">
                <img
                  src={images[selectedImage]?.url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  data-testid="main-product-image"
                />
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all"
                      data-testid="prev-image-btn"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all"
                      data-testid="next-image-btn"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}
              </div>
            </Card>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto" data-testid="image-thumbnails">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index ? "border-amber-600" : "border-transparent"
                    }`}
                    data-testid={`thumbnail-${index}`}
                  >
                    <img
                      src={image.url}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div data-testid="product-info">
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
            
            {priceBreakdown && (
              <div className="mb-6">
                <p className="text-4xl font-bold gold-text" data-testid="product-price">
                  ₹{priceBreakdown.total_price.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 mt-1">Inclusive of all taxes</p>
              </div>
            )}

            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-2">
                <span className="font-semibold">Metal Type:</span>
                <span className="text-gray-700">{product.metal_type}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">Purity:</span>
                <span className="text-gray-700">{product.purity}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">Weight:</span>
                <span className="text-gray-700">{product.weight}g</span>
              </div>
              {product.dimensions && (
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Dimensions:</span>
                  <span className="text-gray-700">{product.dimensions}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="font-semibold">Category:</span>
                <span className="text-gray-700">{product.category}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">Occasion:</span>
                <span className="text-gray-700">{product.occasion}</span>
              </div>
            </div>

            <div className="space-y-3">
              <Button 
                className="btn-gold w-full py-6 text-lg"
                onClick={() => window.open(`https://wa.me/917013174340?text=I'm interested in ${product.name}`, '_blank')}
                data-testid="enquire-whatsapp-btn"
              >
                Enquire on WhatsApp
              </Button>
              <Button 
                variant="outline" 
                className="w-full py-6 text-lg border-2 border-amber-700 text-amber-900 hover:bg-amber-50"
                onClick={() => window.location.href = '/contact'}
                data-testid="custom-design-btn"
              >
                Request Custom Design
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <Card className="p-6 bg-white" data-testid="product-tabs">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="w-full justify-start border-b mb-6">
              <TabsTrigger value="details" data-testid="details-tab">Product Details</TabsTrigger>
              <TabsTrigger value="price" data-testid="price-tab">Price Breakup</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" data-testid="details-content">
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold mb-4">Description</h3>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
                
                <div className="mt-6 pt-6 border-t">
                  <h4 className="text-xl font-semibold mb-4">Specifications</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-600">Metal Type</p>
                      <p className="font-semibold">{product.metal_type}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Purity</p>
                      <p className="font-semibold">{product.purity}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Weight</p>
                      <p className="font-semibold">{product.weight} grams</p>
                    </div>
                    {product.dimensions && (
                      <div>
                        <p className="text-gray-600">Dimensions</p>
                        <p className="font-semibold">{product.dimensions}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="price" data-testid="price-content">
              {priceBreakdown && (
                <div className="space-y-4">
                  <h3 className="text-2xl font-semibold mb-6">Price Breakdown</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between py-3 border-b">
                      <span className="text-gray-700">Metal Rate ({product.purity})</span>
                      <span className="font-semibold">₹{priceBreakdown.rate}/g</span>
                    </div>
                    <div className="flex justify-between py-3 border-b">
                      <span className="text-gray-700">Weight</span>
                      <span className="font-semibold">{priceBreakdown.weight}g</span>
                    </div>
                    <div className="flex justify-between py-3 border-b">
                      <span className="text-gray-700">Metal Value</span>
                      <span className="font-semibold">₹{priceBreakdown.metal_value.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b">
                      <span className="text-gray-700">Making Charges (10%)</span>
                      <span className="font-semibold">₹{priceBreakdown.making_charges.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b">
                      <span className="text-gray-700">GST on Metal (3%)</span>
                      <span className="font-semibold">₹{priceBreakdown.gst_on_metal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b">
                      <span className="text-gray-700">GST on Making (5%)</span>
                      <span className="font-semibold">₹{priceBreakdown.gst_on_making.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-4 border-t-2 border-amber-600 text-xl">
                      <span className="font-bold">Total Price</span>
                      <span className="font-bold gold-text">₹{priceBreakdown.total_price.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mt-4">
                    * Prices are calculated based on current metal rates and subject to change.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </Card>
      </div>

      <Footer />
    </div>
  );
}

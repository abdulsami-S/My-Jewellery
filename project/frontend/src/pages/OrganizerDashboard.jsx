
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LogOut,
  Plus,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
  Package,
  Mail,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function OrganizerDashboard() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mustChangePassword, setMustChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [analytics, setAnalytics] = useState(null);
  const [products, setProducts] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [metalRates, setMetalRates] = useState(null);

  const [showProductDialog, setShowProductDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    metal_type: "Gold",
    purity: "22K",
    weight: "",
    dimensions: "",
    category: "Women",
    occasion: "Daily Wear",
    images: [],
  });

  // image controls
  const [imageInput, setImageInput] = useState(""); // URL text
  const [imageCaption, setImageCaption] = useState("");
  const [imageFile, setImageFile] = useState(null); // gallery file
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("organizer_token");
    setIsLoggedIn(false);
    setEmail("");
    setPassword("");
    setAnalytics(null);
    navigate("/");
  };

  useEffect(() => {
    // Setup axios interceptors for JWT
    const requestInterceptor = axios.interceptors.request.use((config) => {
      const token = localStorage.getItem("organizer_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("organizer_token");
          setIsLoggedIn(false);
          toast.error("Session expired, please login again");
        }
        return Promise.reject(error);
      }
    );

    // Auto-login if token exists
    if (localStorage.getItem("organizer_token")) {
      setIsLoggedIn(true);
    }

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchDashboardData();
    }
  }, [isLoggedIn]);

  const fetchDashboardData = async () => {
    try {
      const [
        analyticsRes,
        productsRes,
        enquiriesRes,
        testimonialsRes,
        ratesRes,
      ] = await Promise.all([
        axios.get(`${API}/organizer/analytics`),
        axios.get(`${API}/products`),
        axios.get(`${API}/enquiries`),
        axios.get(`${API}/testimonials?approved_only=false`),
        axios.get(`${API}/metal-rates`),
      ]);

      setAnalytics(analyticsRes.data);
      setProducts(productsRes.data);
      setEnquiries(enquiriesRes.data);
      setTestimonials(testimonialsRes.data);
      setMetalRates(ratesRes.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API}/organizer/login`, {
        email,
        password,
      });
      if (response.status === 200) {
        localStorage.setItem("organizer_token", response.data.access_token);
        setIsLoggedIn(true);
        setMustChangePassword(response.data.must_change_password);
        toast.success("Login successful!");
      }
    } catch (error) {
      toast.error("Invalid credentials");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/organizer/change-password`, {
        old_password: oldPassword,
        new_password: newPassword,
      });
      setMustChangePassword(false);
      toast.success("Password changed successfully!");
    } catch (error) {
      toast.error("Failed to change password");
    }
  };

  const handleProductSave = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        ...productForm,
        weight: parseFloat(productForm.weight),
      };

      if (editingProduct) {
        await axios.put(`${API}/products/${editingProduct.id}`, productData);
        toast.success("Product updated successfully!");
      } else {
        await axios.post(`${API}/products`, productData);
        toast.success("Product created successfully!");
      }

      setShowProductDialog(false);
      resetProductForm();
      fetchDashboardData();
    } catch (error) {
      toast.error("Failed to save product");
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`${API}/products/${id}`);
      toast.success("Product deleted!");
      fetchDashboardData();
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  const handleApproveTestimonial = async (id) => {
    try {
      await axios.put(`${API}/testimonials/${id}/approve`);
      toast.success("Testimonial approved!");
      fetchDashboardData();
    } catch (error) {
      toast.error("Failed to approve testimonial");
    }
  };

  const handleUpdateRates = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API}/metal-rates`, metalRates);
      toast.success("Metal rates updated!");
    } catch (error) {
      toast.error("Failed to update rates");
    }
  };

  // 🔥 New addImage: supports URL OR file
  const addImage = async () => {
    if (!imageInput && !imageFile) {
      toast.error("Enter an image URL or choose a file");
      return;
    }

    try {
      setUploadingImage(true);
      let finalUrl = "";

      if (imageFile) {
        // upload gallery file to backend
        const formData = new FormData();
        formData.append("file", imageFile);

        const res = await axios.post(`${API}/upload-by-file`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        const filename = res.data.filename;
        // served as http://localhost:8000/uploads/<filename>
        finalUrl = `${BACKEND_URL}/uploads/${filename}`;
      } else {
        // only URL → keep as-is (works like before)
        finalUrl = imageInput.trim();
      }

      setProductForm((prev) => ({
        ...prev,
        images: [
          ...prev.images,
          {
            url: finalUrl,
            caption: imageCaption,
            is_cover: prev.images.length === 0,
          },
        ],
      }));

      setImageInput("");
      setImageCaption("");
      setImageFile(null);
      toast.success("Image added");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = (index) => {
    setProductForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const resetProductForm = () => {
    setProductForm({
      name: "",
      description: "",
      metal_type: "Gold",
      purity: "22K",
      weight: "",
      dimensions: "",
      category: "Women",
      occasion: "Daily Wear",
      images: [],
    });
    setEditingProduct(null);
    setImageInput("");
    setImageCaption("");
    setImageFile(null);
  };

  const openEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm(product);
    setShowProductDialog(true);
  };

  // Login Screen
  if (!isLoggedIn) {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-amber-50 to-rose-50 flex items-center justify-center px-4"
        data-testid="login-screen"
      >
        <Card className="p-8 w-full max-w-md bg-white shadow-2xl">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold mb-2">
              <span className="gold-text">SAM</span>{" "}
              <span className="maroon-text">Organizer</span>
            </h1>
            <p className="text-gray-600">Admin Dashboard Login</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                required
                data-testid="login-email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                data-testid="login-password"
              />
            </div>
            <Button
              type="submit"
              className="btn-gold w-full py-6"
              data-testid="login-submit-btn"
            >
              Login
            </Button>
          </form>
          <div className="mt-6 text-center">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              data-testid="back-to-home-btn"
            >
              Back to Home
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Password Change Screen
  if (mustChangePassword) {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-amber-50 to-rose-50 flex items-center justify-center px-4"
        data-testid="password-change-screen"
      >
        <Card className="p-8 w-full max-w-md bg-white shadow-2xl">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Change Password
          </h2>
          <p className="text-gray-600 mb-6 text-center">
            Please change your password to continue
          </p>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Old Password
              </label>
              <Input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
                data-testid="old-password-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                New Password
              </label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                data-testid="new-password-input"
              />
            </div>
            <Button
              type="submit"
              className="btn-gold w-full py-6"
              data-testid="change-password-btn"
            >
              Change Password
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  // Dashboard
  return (
    <div className="min-h-screen bg-gray-50" data-testid="organizer-dashboard">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            <span className="gold-text">SAM</span> Dashboard
          </h1>
          <Button
            variant="ghost"
            onClick={handleLogout}
            data-testid="logout-btn"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Analytics Cards */}
        {analytics && (
          <div
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
            data-testid="analytics-section"
          >
            <Card className="p-6 bg-white">
              <div className="flex items-center justify-between mb-2">
                <Package className="w-8 h-8 text-amber-600" />
                <span className="text-3xl font-bold gold-text">
                  {analytics.total_products}
                </span>
              </div>
              <p className="text-gray-600">Total Products</p>
            </Card>
            <Card className="p-6 bg-white">
              <div className="flex items-center justify-between mb-2">
                <Mail className="w-8 h-8 text-blue-600" />
                <span className="text-3xl font-bold text-blue-600">
                  {analytics.total_enquiries}
                </span>
              </div>
              <p className="text-gray-600">Enquiries</p>
            </Card>
            <Card className="p-6 bg-white">
              <div className="flex items-center justify-between mb-2">
                <MessageSquare className="w-8 h-8 text-green-600" />
                <span className="text-3xl font-bold text-green-600">
                  {analytics.pending_testimonials}
                </span>
              </div>
              <p className="text-gray-600">Pending Reviews</p>
            </Card>
            <Card className="p-6 bg-white">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-8 h-8 text-purple-600" />
                <span className="text-3xl font-bold text-purple-600">
                  {analytics.bestsellers.length}
                </span>
              </div>
              <p className="text-gray-600">Bestsellers</p>
            </Card>
          </div>
        )}

        {/* Tabs */}
        <Tabs
          defaultValue="products"
          className="w-full"
          data-testid="dashboard-tabs"
        >
          <TabsList className="mb-6">
            <TabsTrigger value="products" data-testid="products-tab">
              Products
            </TabsTrigger>
            <TabsTrigger value="rates" data-testid="rates-tab">
              Metal Rates
            </TabsTrigger>
            <TabsTrigger
              value="enquiries"
              data-testid="enquiries-tab"
            >{`Enquiries (${enquiries.length})`}</TabsTrigger>
            <TabsTrigger value="testimonials" data-testid="testimonials-tab">
              Testimonials
            </TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" data-testid="products-content">
            <Card className="p-6 bg-white">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Products</h2>
                <Dialog
                  open={showProductDialog}
                  onOpenChange={setShowProductDialog}
                >
                  <DialogTrigger asChild>
                    <Button
                      className="btn-gold"
                      onClick={resetProductForm}
                      data-testid="add-product-btn"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Add Product
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {editingProduct ? "Edit Product" : "Add New Product"}
                      </DialogTitle>
                    </DialogHeader>
                    <form
                      onSubmit={handleProductSave}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                          <label className="block text-sm font-medium mb-2">
                            Product Name
                          </label>
                          <Input
                            value={productForm.name}
                            onChange={(e) =>
                              setProductForm({
                                ...productForm,
                                name: e.target.value,
                              })
                            }
                            required
                            data-testid="product-name-input"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Metal Type
                          </label>
                          <Select
                            value={productForm.metal_type}
                            onValueChange={(value) =>
                              setProductForm({
                                ...productForm,
                                metal_type: value,
                              })
                            }
                          >
                            <SelectTrigger data-testid="product-metal-select">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Gold">Gold</SelectItem>
                              <SelectItem value="Silver">Silver</SelectItem>
                              <SelectItem value="Diamond">Diamond</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Purity
                          </label>
                          <Select
                            value={productForm.purity}
                            onValueChange={(value) =>
                              setProductForm({
                                ...productForm,
                                purity: value,
                              })
                            }
                          >
                            <SelectTrigger data-testid="product-purity-select">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="18K">18K</SelectItem>
                              <SelectItem value="22K">22K</SelectItem>
                              <SelectItem value="24K">24K</SelectItem>
                              <SelectItem value="925">925 Silver</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Weight (grams)
                          </label>
                          <Input
                            type="number"
                            step="0.01"
                            value={productForm.weight}
                            onChange={(e) =>
                              setProductForm({
                                ...productForm,
                                weight: e.target.value,
                              })
                            }
                            required
                            data-testid="product-weight-input"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Category
                          </label>
                          <Select
                            value={productForm.category}
                            onValueChange={(value) =>
                              setProductForm({
                                ...productForm,
                                category: value,
                              })
                            }
                          >
                            <SelectTrigger data-testid="product-category-select">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Men">Men</SelectItem>
                              <SelectItem value="Women">Women</SelectItem>
                              <SelectItem value="Kids">Kids</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Occasion
                          </label>
                          <Select
                            value={productForm.occasion}
                            onValueChange={(value) =>
                              setProductForm({
                                ...productForm,
                                occasion: value,
                              })
                            }
                          >
                            <SelectTrigger data-testid="product-occasion-select">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Daily Wear">
                                Daily Wear
                              </SelectItem>
                              <SelectItem value="Wedding">Wedding</SelectItem>
                              <SelectItem value="Festive">Festive</SelectItem>
                              <SelectItem value="Gifting">Gifting</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Dimensions (Optional)
                          </label>
                          <Input
                            value={productForm.dimensions}
                            onChange={(e) =>
                              setProductForm({
                                ...productForm,
                                dimensions: e.target.value,
                              })
                            }
                            placeholder="e.g. 2.5cm x 1.5cm"
                            data-testid="product-dimensions-input"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-sm font-medium mb-2">
                            Description
                          </label>
                          <Textarea
                            value={productForm.description}
                            onChange={(e) =>
                              setProductForm({
                                ...productForm,
                                description: e.target.value,
                              })
                            }
                            rows={4}
                            required
                            data-testid="product-description-input"
                          />
                        </div>
                      </div>

                      {/* Image Management */}
                      <div className="border-t pt-4">
                        <label className="block text-sm font-medium mb-2">
                          Product Images
                        </label>
                        <div className="flex flex-col gap-2 mb-2">
                          {/* URL input (works like before) */}
                          <div className="flex gap-2">
                            <Input
                              value={imageInput}
                              onChange={(e) => setImageInput(e.target.value)}
                              placeholder="Image URL (optional if file selected)"
                              data-testid="image-url-input"
                            />
                            <Input
                              value={imageCaption}
                              onChange={(e) =>
                                setImageCaption(e.target.value)
                              }
                              placeholder="Caption (optional)"
                              data-testid="image-caption-input"
                            />
                          </div>
                          {/* File input for gallery */}
                          <div className="flex items-center gap-2">
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                setImageFile(
                                  e.target.files?.[0] ? e.target.files[0] : null
                                )
                              }
                              data-testid="image-file-input"
                            />
                            <Button
                              type="button"
                              onClick={addImage}
                              disabled={uploadingImage}
                              data-testid="add-image-btn"
                            >
                              {uploadingImage ? "Uploading..." : "Add"}
                            </Button>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {productForm.images.map((img, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={img.url}
                                alt={img.caption}
                                className="w-full h-24 object-cover rounded"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                data-testid={`remove-image-${index}`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="btn-gold w-full"
                        data-testid="save-product-btn"
                      >
                        {editingProduct ? "Update Product" : "Create Product"}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-4" data-testid="products-list">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={
                          product.images[0]?.url ||
                          "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=100"
                        }
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div>
                        <h3 className="font-semibold">{product.name}</h3>
                        <p className="text-sm text-gray-600">
                          {product.metal_type} {product.purity} •{" "}
                          {product.weight}g
                        </p>
                        <p className="text-sm text-gray-500">
                          {product.view_count} views
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditProduct(product)}
                        data-testid={`edit-product-${product.id}`}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteProduct(product.id)}
                        data-testid={`delete-product-${product.id}`}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Metal Rates Tab */}
          <TabsContent value="rates" data-testid="rates-content">
            <Card className="p-6 bg-white">
              <h2 className="text-2xl font-bold mb-6">Update Metal Rates</h2>
              {metalRates && (
                <form
                  onSubmit={handleUpdateRates}
                  className="space-y-4 max-w-md"
                >
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Gold 22K (per gram)
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      value={metalRates.gold_22k}
                      onChange={(e) =>
                        setMetalRates({
                          ...metalRates,
                          gold_22k: parseFloat(e.target.value),
                        })
                      }
                      data-testid="gold-22k-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Gold 24K (per gram)
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      value={metalRates.gold_24k}
                      onChange={(e) =>
                        setMetalRates({
                          ...metalRates,
                          gold_24k: parseFloat(e.target.value),
                        })
                      }
                      data-testid="gold-24k-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Silver 999 (per gram)
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      value={metalRates.silver_999}
                      onChange={(e) =>
                        setMetalRates({
                          ...metalRates,
                          silver_999: parseFloat(e.target.value),
                        })
                      }
                      data-testid="silver-999-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Diamond (per carat)
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      value={metalRates.diamond_per_carat}
                      onChange={(e) =>
                        setMetalRates({
                          ...metalRates,
                          diamond_per_carat: parseFloat(e.target.value),
                        })
                      }
                      data-testid="diamond-input"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="btn-gold"
                    data-testid="update-rates-btn"
                  >
                    Update Rates
                  </Button>
                </form>
              )}
            </Card>
          </TabsContent>

          {/* Enquiries Tab */}
          <TabsContent value="enquiries" data-testid="enquiries-content">
            <Card className="p-6 bg-white">
              <h2 className="text-2xl font-bold mb-6">Customer Enquiries</h2>
              <div className="space-y-4">
                {enquiries.map((enquiry) => (
                  <div
                    key={enquiry.id}
                    className="p-4 border rounded-lg"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">{enquiry.name}</h3>
                        <p className="text-sm text-gray-600">
                          {enquiry.email} • {enquiry.phone}
                        </p>
                      </div>
                      <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">
                        {enquiry.enquiry_type}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-2">{enquiry.message}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(enquiry.created_at).toLocaleDateString()}{" "}
                      {new Date(enquiry.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Testimonials Tab */}
          <TabsContent value="testimonials" data-testid="testimonials-content">
            <Card className="p-6 bg-white">
              <h2 className="text-2xl font-bold mb-6">Customer Testimonials</h2>
              <div className="space-y-4">
                {testimonials.map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className="p-4 border rounded-lg"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">
                          {testimonial.customer_name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {testimonial.rating} ⭐ • {testimonial.product_type}
                        </p>
                      </div>
                      {!testimonial.is_approved && (
                        <Button
                          size="sm"
                          className="btn-gold"
                          onClick={() =>
                            handleApproveTestimonial(testimonial.id)
                          }
                          data-testid={`approve-testimonial-${testimonial.id}`}
                        >
                          Approve
                        </Button>
                      )}
                      {testimonial.is_approved && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          Approved
                        </span>
                      )}
                    </div>
                    <p className="text-gray-700">{testimonial.review}</p>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

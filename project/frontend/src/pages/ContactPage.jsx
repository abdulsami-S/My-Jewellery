import React, { useState } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mail, Phone, MapPin, Instagram } from "lucide-react";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    enquiry_type: "General",
    message: ""
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone || !formData.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(`${API}/enquiries`, formData);
      toast.success("Thank you! Your enquiry has been submitted. We'll contact you soon.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        enquiry_type: "General",
        message: ""
      });
    } catch (error) {
      console.error("Error submitting enquiry:", error);
      toast.error("Failed to submit enquiry. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-12" data-testid="contact-page">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Get In <span className="gold-text">Touch</span>
          </h1>
          <p className="text-lg text-gray-600">We'd love to hear from you. Let's create something beautiful together.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="p-8 bg-white shadow-lg" data-testid="contact-form">
            <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Your full name"
                  required
                  data-testid="name-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email *</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="your@email.com"
                  required
                  data-testid="email-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Phone *</label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="+91 XXXXX XXXXX"
                  required
                  data-testid="phone-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Enquiry Type</label>
                <Select 
                  value={formData.enquiry_type} 
                  onValueChange={(value) => handleChange("enquiry_type", value)}
                >
                  <SelectTrigger data-testid="enquiry-type-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="General">General Enquiry</SelectItem>
                    <SelectItem value="Custom Design">Custom Design</SelectItem>
                    <SelectItem value="Appointment">Book Appointment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Message *</label>
                <Textarea
                  value={formData.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  placeholder="Tell us about your requirements..."
                  rows={6}
                  required
                  data-testid="message-input"
                />
              </div>

              <Button 
                type="submit" 
                className="btn-gold w-full py-6 text-lg" 
                disabled={submitting}
                data-testid="submit-btn"
              >
                {submitting ? "Submitting..." : "Submit Enquiry"}
              </Button>
            </form>
          </Card>

          {/* Contact Info */}
          <div className="space-y-6">
            <Card className="p-6 bg-white shadow-lg" data-testid="contact-info">
              <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-amber-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Address</h3>
                    <p className="text-gray-600">Proddatur, Andhra Pradesh, India</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-amber-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Phone</h3>
                    <a href="tel:+917013174340" className="text-amber-700 hover:text-amber-800">
                      +91 70131 74340
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-amber-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <a href="mailto:dgm.jewellerss@gmail.com" className="text-amber-700 hover:text-amber-800">
                      dgm.jewellerss@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Instagram className="w-6 h-6 text-amber-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Instagram</h3>
                    <a 
                      href="https://instagram.com/dgm_jewellerss" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-amber-700 hover:text-amber-800"
                    >
                      @dgm_jewellerss
                    </a>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-amber-50 to-rose-50" data-testid="business-hours">
              <h2 className="text-2xl font-bold mb-4">Business Hours</h2>
              <div className="space-y-2 text-gray-700">
                <div className="flex justify-between">
                  <span className="font-medium">Monday - Saturday</span>
                  <span>9:30 AM - 8:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Sunday</span>
                  <span>9:30 AM - 12:30 PM</span>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Quick Connect</h2>
              <p className="text-gray-600 mb-4">For immediate assistance, reach us on WhatsApp</p>
              <a
                href="https://wa.me/917013174340"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold inline-block w-full text-center py-3 rounded-full"
                data-testid="whatsapp-link"
              >
                Chat on WhatsApp
              </a>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

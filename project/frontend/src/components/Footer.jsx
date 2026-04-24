import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    // <footer className="bg-gradient-to-br from-amber-900 to-amber-950 text-white" data-testid="main-footer">
    <footer style={{ backgroundColor: '#5a3d2b' }} className="text-white" data-testid="main-footer">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* About */}
          <div>
            <h3 className="text-2xl font-bold mb-4">
              <span className="text-amber-300">SAM</span> Gold Works
            </h3>
            <p className="text-amber-100 mb-4">
              Crafting timeless treasures since 1995. Where tradition meets elegance.
            </p>
            <div className="flex space-x-4">
              <a href="https://instagram.com/sam__jewellerss" target="_blank" rel="noopener noreferrer" data-testid="instagram-link">
                <Instagram className="w-6 h-6 hover:text-amber-300 transition-colors" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" data-testid="facebook-link">
                <Facebook className="w-6 h-6 hover:text-amber-300 transition-colors" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-amber-300">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/collections" className="text-amber-100 hover:text-amber-300 transition-colors">Collections</Link></li>
              <li><Link to="/workshop" className="text-amber-100 hover:text-amber-300 transition-colors">Our Workshop</Link></li>
              <li><Link to="/metal-rates" className="text-amber-100 hover:text-amber-300 transition-colors">Metal Rates</Link></li>
              <li><Link to="/about" className="text-amber-100 hover:text-amber-300 transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-amber-300">Shop By</h4>
            <ul className="space-y-2">
              <li><Link to="/collections?metal=Gold" className="text-amber-100 hover:text-amber-300 transition-colors">Gold Jewellery</Link></li>
              <li><Link to="/collections?metal=Silver" className="text-amber-100 hover:text-amber-300 transition-colors">Silver Jewellery</Link></li>
              <li><Link to="/collections?metal=Diamond" className="text-amber-100 hover:text-amber-300 transition-colors">Diamond Jewellery</Link></li>
              <li><Link to="/contact" className="text-amber-100 hover:text-amber-300 transition-colors">Custom Design</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-amber-300">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2">
                <MapPin className="w-5 h-5 mt-1 flex-shrink-0" />
                <span className="text-amber-100">Proddatur, Andhra Pradesh, India</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <a href="tel:+917013174340" className="text-amber-100 hover:text-amber-300 transition-colors">+91 70131 74340</a>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <a href="mailto:dgm.jewellerss@gmail.com" className="text-amber-100 hover:text-amber-300 transition-colors">dgm.jewellerss@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-amber-700 mt-12 pt-8 text-center">
          <p className="text-amber-100">
            &copy; {new Date().getFullYear()} SAM Gold Works. All rights reserved. | Hallmark Certified
          </p>
        </div>
      </div>
    </footer>
  );
}



















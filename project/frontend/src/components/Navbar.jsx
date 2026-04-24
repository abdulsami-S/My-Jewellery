import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Collections", path: "/collections" },
    { name: "Workshop", path: "/workshop" },
    { name: "Metal Rates", path: "/metal-rates" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" }
  ];

  return (
    <nav className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-amber-200" data-testid="main-navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3" data-testid="logo-link">
            <div className="text-2xl font-bold">
              <span className="gold-shimmer">SAM</span> <span className="maroon-animate">Gold Works</span>
              </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`header-link font-medium transition-all duration-300 ${location.pathname === link.path ? 'active text-amber-700' : 'text-gray-700 hover:text-amber-700'}`}
                data-testid={`nav-link-${link.name.toLowerCase().replace(' ', '-')}`}
              >
                {link.name}
              </Link>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/organizer")}
              className="text-gray-700 hover:text-amber-700"
              data-testid="organizer-login-btn"
            >
              <User className="w-5 h-5" />
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2"
            data-testid="mobile-menu-btn"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-amber-200" data-testid="mobile-menu">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="block py-3 px-4 text-gray-700 hover:bg-amber-50 hover:text-amber-700 rounded-lg transition-colors"
                data-testid={`mobile-nav-link-${link.name.toLowerCase().replace(' ', '-')}`}
              >
                {link.name}
              </Link>
            ))}
            <button
              onClick={() => {
                setIsOpen(false);
                navigate("/organizer");
              }}
              className="w-full text-left py-3 px-4 text-gray-700 hover:bg-amber-50 hover:text-amber-700 rounded-lg transition-colors"
              data-testid="mobile-organizer-login-btn"
            >
              Organizer Login
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
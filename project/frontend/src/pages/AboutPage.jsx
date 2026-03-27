import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Award, Heart, Shield, Star } from "lucide-react";

export default function AboutPage() {
  const values = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Passion",
      description: "Every piece is crafted with love and dedication, ensuring it becomes a cherished heirloom."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Trust",
      description: "Transparency in pricing, purity certification, and honest dealings have earned us customer loyalty for 30 years."
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "Excellence",
      description: "We never compromise on quality. Each piece undergoes rigorous quality checks before reaching you."
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Innovation",
      description: "While respecting tradition, we embrace modern designs and techniques to create contemporary masterpieces."
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center" data-testid="about-hero">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1610375461246-83df859d849d?w=1600" 
            alt="DGM Gold Works" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50"></div>
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl lg:text-6xl font-bold mb-6">
            About <span className="gold-shimmer">DGM Gold Works</span>
          </h1>
          <p className="text-xl lg:text-2xl max-w-3xl mx-auto">
            Where Tradition Meets Elegance Since 1995
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 px-4" data-testid="our-story">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                Our <span className="gold-text">Story</span>
              </h2>
              <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
                <p>
                  Founded in 1995 in the heart of Proddatur, Andhra Pradesh, DGM Gold Works began as a humble goldsmith workshop with a vision to create jewellery that tells stories.
                </p>
                <p>
                  Over three decades, we have grown from a small family business to a trusted name in luxury jewellery, yet we've never lost sight of our roots. Every piece that leaves our workshop carries the same dedication, precision, and passion that defined our very first creation.
                </p>
                <p>
                  Today, DGM Gold Works stands as a testament to the enduring power of craftsmanship, quality, and customer trust. We are proud to serve generations of families, helping them celebrate life's most precious moments with jewellery that lasts forever.
                </p>
              </div>
            </div>
            <div className="relative h-[500px] rounded-lg overflow-hidden shadow-2xl">
              <img 
                src="https://i.pinimg.com/736x/ca/bf/23/cabf23975e69b1f7203688f9d22110c7.jpg" 
                alt="Our Workshop" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 px-4 bg-gradient-to-br from-amber-50 to-rose-50" data-testid="our-values">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-bold text-center mb-6">
            Our <span className="gold-text">Values</span>
          </h2>
          <p className="text-center text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
            The principles that guide everything we do
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="glass p-8 text-center" data-testid={`value-card-${index}`}>
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-700">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4" data-testid="why-choose-us">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-bold text-center mb-12">
            Why Choose <span className="gold-text">DGM Gold Works</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-8 bg-white shadow-lg">
              <h3 className="text-2xl font-bold mb-4 gold-text">Hallmark Certified</h3>
              <p className="text-gray-700 leading-relaxed">
                Every piece of jewellery we create is hallmarked, guaranteeing the purity and authenticity of precious metals. Your trust deserves nothing less than complete transparency.
              </p>
            </Card>

            <Card className="p-8 bg-white shadow-lg">
              <h3 className="text-2xl font-bold mb-4 gold-text">Master Artisans</h3>
              <p className="text-gray-700 leading-relaxed">
                Our team comprises skilled goldsmiths with decades of experience. They blend traditional techniques with modern innovations to create pieces that are both timeless and contemporary.
              </p>
            </Card>

            <Card className="p-8 bg-white shadow-lg">
              <h3 className="text-2xl font-bold mb-4 gold-text">Custom Design Services</h3>
              <p className="text-gray-700 leading-relaxed">
                Have a unique design in mind? Our expert designers work closely with you to bring your vision to life, creating bespoke jewellery that reflects your personal style.
              </p>
            </Card>

            <Card className="p-8 bg-white shadow-lg">
              <h3 className="text-2xl font-bold mb-4 gold-text">Transparent Pricing</h3>
              <p className="text-gray-700 leading-relaxed">
                We believe in honest pricing. Every product comes with a detailed price breakdown showing metal rates, making charges, and GST, so you know exactly what you're paying for.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="py-20 px-4 bg-white" data-testid="location-section">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Visit Our <span className="gold-text">Workshop</span>
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Proddatur, Andhra Pradesh, India
          </p>
          <p className="text-gray-700 mb-8 max-w-2xl mx-auto">
            Experience our craftsmanship firsthand. Visit our workshop to explore our collections, discuss custom designs, or simply learn about the art of jewellery making.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a 
              href="tel:+917013174340" 
              className="btn-gold inline-block px-8 py-3 rounded-full"
              data-testid="call-us-btn"
            >
              Call Us: +91 70131 74340
            </a>
            <a 
              href="https://wa.me/917013174340" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block px-8 py-3 rounded-full border-2 border-amber-700 text-amber-900 hover:bg-amber-50 font-semibold"
              data-testid="whatsapp-btn"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

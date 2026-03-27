import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Award, Shield, Users, Gem } from "lucide-react";

export default function WorkshopPage() {
  const process = [
    {
      title: "Design Consultation",
      description: "Our expert designers work with you to understand your vision and create a unique design that reflects your style.",
      image: "https://media.istockphoto.com/id/183380736/photo/jeweler.jpg?s=612x612&w=0&k=20&c=bM3sssYyj3vK7PMrT_hrCfOgN0D7DzikCg9ULO4Xdgw="
    },
    {
      title: "Casting & Crafting",
      description: "Master artisans bring your design to life using traditional techniques passed down through generations.",
      image: "https://i.pinimg.com/1200x/f8/45/73/f845737ae2b2b31c3841cf5acc345708.jpg"
    },
    {
      title: "Polishing & Finishing",
      description: "Each piece undergoes meticulous polishing and finishing to achieve the perfect shine and smoothness.",
      image: "https://i.pinimg.com/1200x/ca/ad/23/caad231557738aa5274643f8d9dcc16c.jpg"
    },
    {
      title: "Hallmarking & Certification",
      description: "Every piece is hallmarked, guaranteeing purity and authenticity for your peace of mind.",
      image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600"
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center" data-testid="workshop-hero">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1610375461246-83df859d849d?w=1600" 
            alt="Workshop" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50"></div>
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl lg:text-6xl font-bold mb-6">
            Craftsmanship <span className="gold-shimmer">Beyond Time</span>
          </h1>
          <p className="text-xl lg:text-2xl max-w-3xl mx-auto">
            Step into our workshop where tradition meets innovation, and every piece tells a story of dedication and artistry.
          </p>
        </div>
      </section>

      {/* Our Legacy */}
      <section className="py-20 px-4" data-testid="our-legacy">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                <span className="gold-text">30 Years</span> of Excellence
              </h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Since 1995, DGM Gold Works has been a trusted name in Proddatur, Andhra Pradesh. What started as a small goldsmith workshop has grown into a legacy of craftsmanship, quality, and trust.
              </p>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Our artisans bring decades of experience, combining time-honored techniques with modern innovations to create jewellery that stands the test of time.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Every piece that leaves our workshop carries the mark of authenticity, precision, and passion that defines DGM Gold Works.
              </p>
            </div>
            <div className="relative h-[500px] rounded-lg overflow-hidden shadow-2xl">
              <img 
                src="https://i.shgcdn.com/69669185-e007-4960-a2dd-95459a5577ad/-/format/auto/-/preview/3000x3000/-/quality/lighter/" 
                alt="Artisan at work" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Crafting Process */}
      <section className="py-20 px-4 bg-gradient-to-br from-amber-50 to-rose-50" data-testid="crafting-process">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-bold text-center mb-6">
            Our <span className="gold-text">Crafting Process</span>
          </h2>
          <p className="text-center text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
            From concept to creation, every step is handled with care and expertise
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {process.map((step, index) => (
              <Card key={index} className="overflow-hidden bg-white shadow-lg" data-testid={`process-step-${index}`}>
                <div className="relative h-64">
                  <img 
                    src={step.image} 
                    alt={step.title}
                    className="w-full h-full object-cover"
                  />
                  {/* <div className="absolute top-4 left-4 w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {index + 1}
                  </div> */}
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                  <p className="text-gray-700 leading-relaxed">{step.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-20 px-4" data-testid="trust-badges">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-bold text-center mb-12">
            Your <span className="gold-text">Trust</span> is Our Pride
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <Card className="glass p-8 text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-amber-700" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Hallmark Certified</h3>
              <p className="text-gray-600">Every piece is certified for purity</p>
            </Card>
            
            <Card className="glass p-8 text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-amber-700" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Trusted Since 1995</h3>
              <p className="text-gray-600">30 years of excellence</p>
            </Card>
            
            <Card className="glass p-8 text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-amber-700" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Master Artisans</h3>
              <p className="text-gray-600">Skilled goldsmiths with expertise</p>
            </Card>
            
            <Card className="glass p-8 text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gem className="w-8 h-8 text-amber-700" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-gray-600">Only the finest materials used</p>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

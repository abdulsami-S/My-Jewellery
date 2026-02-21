import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { TrendingUp, Calendar } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function MetalRatesPage() {
  const [metalRates, setMetalRates] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetalRates();
  }, []);

  const fetchMetalRates = async () => {
    try {
      const response = await axios.get(`${API}/metal-rates`);
      setMetalRates(response.data);
    } catch (error) {
      console.error("Error fetching metal rates:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const rates = [
    {
      name: "Gold 22K",
      value: metalRates?.gold_22k,
      unit: "per gram",
      color: "from-yellow-400 to-yellow-600",
      icon: "💍"
    },
    {
      name: "Gold 24K",
      value: metalRates?.gold_24k,
      unit: "per gram",
      color: "from-amber-400 to-amber-600",
      icon: "✨"
    },
    {
      name: "Silver 999",
      value: metalRates?.silver_999,
      unit: "per gram",
      color: "from-gray-300 to-gray-500",
      icon: "🥈"
    },
    {
      name: "Diamond",
      value: metalRates?.diamond_per_carat,
      unit: "per carat",
      color: "from-blue-400 to-purple-500",
      icon: "💎"
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-12" data-testid="metal-rates-page">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            <span className="gold-text">Live</span> Metal Rates
          </h1>
          <p className="text-lg text-gray-600">Today's precious metal rates</p>
          {metalRates && (
            <div className="flex items-center justify-center gap-2 mt-4 text-gray-600">
              <Calendar className="w-5 h-5" />
              <span data-testid="last-updated">Last Updated: {formatDate(metalRates.updated_at)}</span>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="spinner"></div>
          </div>
        ) : (
          <>
            {/* Rates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12" data-testid="rates-grid">
              {rates.map((rate, index) => (
                <Card key={index} className="relative overflow-hidden bg-white shadow-lg" data-testid={`rate-card-${rate.name.toLowerCase().replace(' ', '-')}`}>
                  <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${rate.color}`}></div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-gray-800">{rate.name}</h3>
                      <span className="text-3xl">{rate.icon}</span>
                    </div>
                    <div className="mb-2">
                      <span className="text-3xl font-bold gold-text" data-testid={`rate-value-${rate.name.toLowerCase().replace(' ', '-')}`}>
                        ₹{rate.value?.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{rate.unit}</p>
                  </div>
                </Card>
              ))}
            </div>

            {/* Information Card */}
            <Card className="p-8 bg-gradient-to-br from-amber-50 to-rose-50" data-testid="info-card">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-amber-700" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-4">About Our Pricing</h3>
                  <div className="space-y-3 text-gray-700">
                    <p>
                      • Our rates are updated daily to reflect current market conditions
                    </p>
                    <p>
                      • All products are priced using the formula: Metal Value + Making Charges (10%) + GST
                    </p>
                    <p>
                      • Making charges are calculated at 10% of the metal value
                    </p>
                    <p>
                      • GST is applied at 3% on metal value and 5% on making charges
                    </p>
                    <p>
                      • Final prices may vary based on design complexity and customization
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Price Calculation Example */}
            <Card className="p-8 mt-6 bg-white" data-testid="calculation-example">
              <h3 className="text-2xl font-bold mb-6 text-center">Price Calculation Example</h3>
              <div className="max-w-2xl mx-auto">
                <div className="space-y-3 text-lg">
                  <div className="flex justify-between pb-2 border-b">
                    <span>Gold 22K Rate:</span>
                    <span className="font-semibold">₹{metalRates?.gold_22k}/g</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b">
                    <span>Weight:</span>
                    <span className="font-semibold">10g</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b">
                    <span>Metal Value:</span>
                    <span className="font-semibold">₹{(metalRates?.gold_22k * 10).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b">
                    <span>Making Charges (10%):</span>
                    <span className="font-semibold">₹{(metalRates?.gold_22k * 10 * 0.10).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b">
                    <span>GST on Metal (3%):</span>
                    <span className="font-semibold">₹{(metalRates?.gold_22k * 10 * 0.03).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b">
                    <span>GST on Making (5%):</span>
                    <span className="font-semibold">₹{(metalRates?.gold_22k * 10 * 0.10 * 0.05).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t-2 border-amber-600 text-xl">
                    <span className="font-bold">Total Price:</span>
                    <span className="font-bold gold-text">
                      ₹{Math.round(
                        metalRates?.gold_22k * 10 + 
                        metalRates?.gold_22k * 10 * 0.10 + 
                        metalRates?.gold_22k * 10 * 0.03 + 
                        metalRates?.gold_22k * 10 * 0.10 * 0.05
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}

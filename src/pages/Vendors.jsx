import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Store, MapPin, Phone, Globe, Star } from 'lucide-react';
import { Link } from 'react-router-dom'; // ✅ ADDED LINK IMPORT

import { Button } from '../ui/button.jsx';
import { useToast } from '../ui/use-toast.js';

const Vendors = () => {
  const { toast } = useToast();

  const vendors = [
    {
      id: 1,
      name: "Green Leaf Organics",
      category: "Organic Grocery",
      description: "Fresh organic produce and natural products sourced from local farms.",
      address: "123 Main Street",
      phone: "(555) 123-4567",
      website: "greenleaforganics.com",
      rating: 4.8
    },
    {
      id: 2,
      name: "Artisan Coffee House",
      category: "Café",
      description: "Specialty coffee roasted in-house with homemade pastries and light meals.",
      address: "456 Oak Avenue",
      phone: "(555) 234-5678",
      website: "artisancoffeehouse.com",
      rating: 4.9
    },
    {
      id: 3,
      name: "Bloom & Grow Florist",
      category: "Florist",
      description: "Beautiful fresh flowers and custom arrangements for all occasions.",
      address: "789 Elm Street",
      phone: "(555) 345-6789",
      website: "bloomandgrow.com",
      rating: 4.7
    },
    {
      id: 4,
      name: "The Book Nook",
      category: "Bookstore",
      description: "Independent bookstore featuring local authors and cozy reading spaces.",
      address: "321 Pine Road",
      phone: "(555) 456-7890",
      website: "thebooknook.com",
      rating: 4.9
    },
    {
      id: 5,
      name: "Sunshine Yoga Studio",
      category: "Wellness",
      description: "Yoga and meditation classes for all levels in a peaceful environment.",
      address: "654 Maple Drive",
      phone: "(555) 567-8901",
      website: "sunshineyoga.com",
      rating: 4.8
    },
    {
      id: 6,
      name: "Fresh Bites Bakery",
      category: "Bakery",
      description: "Artisan breads and pastries baked fresh daily with organic ingredients.",
      address: "987 Cedar Lane",
      phone: "(555) 678-9012",
      website: "freshbitesbakery.com",
      rating: 4.9
    }
  ];

  const getCategoryColor = (category) => {
    const colors = {
      "Organic Grocery": "from-green-500 to-emerald-600",
      "Café": "from-amber-500 to-orange-600",
      "Florist": "from-pink-500 to-rose-600",
      "Bookstore": "from-indigo-500 to-purple-600",
      "Wellness": "from-purple-500 to-violet-600",
      "Bakery": "from-yellow-500 to-amber-600"
    };
    return colors[category] || "from-gray-500 to-gray-600";
  };

  const handleContact = (vendor) => {
    toast({
      title: "Contact Information",
      description: `${vendor.name}: ${vendor.phone}`,
    });
  };

  // This function is no longer needed since the button is changed to a link
  // const handleVisitWebsite = (website) => {
  //   toast({
  //     title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
  //   });
  // };

  return (
    <>
      <Helmet>
        <title>Local Vendors - MaitriConnect Community Platform</title>
        <meta name="description" content="Discover and support local businesses in your community. Browse our directory of trusted vendors, shops, and service providers." />
      </Helmet>

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 py-16">
          <div className="absolute inset-0 bg-black/10"></div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Local Vendors Directory
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Discover amazing local businesses and support your community.
            </p>
          </motion.div>
        </section>

        {/* Vendors Grid */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {vendors.map((vendor, index) => (
                <motion.div
                  key={vendor.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 group"
                >
                  <div className={`h-2 bg-gradient-to-r ${getCategoryColor(vendor.category)}`}></div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${getCategoryColor(vendor.category)}`}>
                        {vendor.category}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-semibold text-gray-700">{vendor.rating}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 mb-3">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getCategoryColor(vendor.category)} flex items-center justify-center flex-shrink-0`}>
                        <Store className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                          {vendor.name}
                        </h3>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4">
                      {vendor.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-start gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span>{vendor.address}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4 text-purple-600" />
                        <span>{vendor.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Globe className="w-4 h-4 text-purple-600" />
                        <span className="truncate">{vendor.website}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleContact(vendor)}
                        variant="outline"
                        className="flex-1 border-purple-200 hover:bg-purple-50 hover:border-purple-300 transition-all duration-300"
                      >
                        Contact
                      </Button>
                      {/* FIX: Replaced 'Visit' Button with a Link to the /register page */}
                      <Link to="/register" className="flex-1">
                        <Button
                          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
                        >
                          Register
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Are You a Local Business?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join our vendor directory and connect with your community.
            </p>
            {/* CTA Link (Already pointing to /register) */}
            <Link to="/register">
              <Button
                size="lg"
                className="bg-white text-purple-600 hover:bg-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                List Your Business
              </Button>
            </Link>
          </motion.div>
        </section>
      </div>
    </>
  );
};

export default Vendors;
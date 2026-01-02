import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Store, Users, Heart, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../ui/button.jsx';

const Home = () => {
  const features = [
    {
      icon: Calendar,
      title: 'Community Events',
      description: 'Discover and join exciting events happening in your neighborhood',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Store,
      title: 'Local Vendors',
      description: 'Support local businesses and discover amazing products and services',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Users,
      title: 'Connect & Network',
      description: 'Build meaningful relationships with neighbors and community members',
      color: 'from-pink-500 to-pink-600'
    },
    {
      icon: Heart,
      title: 'Give Back',
      description: 'Participate in volunteer opportunities and make a positive impact',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  return (
    <>
      <Helmet>
        <title>MaitriConnect - Building Stronger Communities Together</title>
        <meta
          name="description"
          content="Join MaitriConnect to discover local events, support vendors, and connect with your community. Building stronger neighborhoods through meaningful connections."
        />
      </Helmet>

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 py-20 lg:py-32">

          {/* FIX: Added pointer-events-none and z-index-0 to decorative elements 
            to ensure they do not block clicks on the buttons/links.
          */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob pointer-events-none z-0"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000 pointer-events-none z-0"></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000 pointer-events-none z-0"></div>

          {/* Overlay with z-index 10 */}
          <div className="absolute inset-0 bg-black/10 z-10"></div>

          {/* Main Hero Content with z-index 20 to be clickable */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-20"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6"
            >
              <Sparkles className="w-5 h-5 text-yellow-300" />
              <span className="text-white font-medium">Welcome to MaitriConnect</span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Building Stronger Communities
              <span className="block mt-2 bg-gradient-to-r from-yellow-200 to-pink-200 bg-clip-text text-transparent pb-2">
                Together
              </span>
            </h1>

            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Connect with neighbors, discover local events, support community vendors, and make a lasting impact in your neighborhood.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button
                  size="lg"
                  className="bg-white text-purple-600 hover:bg-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 group"
                >
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>

              <Link to="/events">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20 shadow-xl"
                >
                  Explore Events
                </Button>
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">What You Can Do</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover all the ways MaitriConnect helps you engage with your community
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="relative group"
                >
                  <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-100">
                    <div
                      className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to Make a Difference?</h2>
            <p className="text-xl text-white/90 mb-8">
              Join MaitriConnect today and start building stronger connections in your community.
            </p>
            <Link to="/register">
              <Button
                size="lg"
                className="bg-white text-purple-600 hover:bg-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 group"
              >
                Join Our Community
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </section>
      </div>
    </>
  );
};

export default Home;
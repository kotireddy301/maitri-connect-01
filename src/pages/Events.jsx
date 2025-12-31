import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { ExternalLink, Calendar, MapPin, Search, Heart, Eye, Star } from "lucide-react";
import { Link } from 'react-router-dom';
import api from '../lib/api';

import PageHeader from "../components/PageHeader";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get('/events');
        const approvedEvents = res.data.filter(e => e.status === 'approved');
        setEvents(approvedEvents);
      } catch (err) {
        console.error("Failed to fetch events", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <>
      <Helmet>
        <title>Events | MaitriConnect</title>
        <meta
          name="description"
          content="Upcoming community events on MaitriConnect"
        />
      </Helmet>

      <PageHeader title="Listings - Grid" path="Home / Grid" />

      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">

          {/* Removed old header div */}

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block w-8 h-8 border-4 border-[#D3043C] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900">No upcoming events found</h3>
              <p className="text-gray-500">Check back later for new updates.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event, index) => (
                <Link to={`/events/${event.id}`} key={event.id} className="block">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 h-full"
                  >
                    {/* Image Section */}
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={event.image_url ? `http://localhost:5000${event.image_url}` : "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80"}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />

                      {/* Featured Badge */}
                      <div className="absolute top-4 left-4 bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-sm shadow-sm">
                        Featured
                      </div>

                      {/* Heart Icon */}
                      <button className="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow-sm hover:bg-[#D3043C] hover:text-white transition-colors">
                        <Heart className="w-4 h-4" />
                      </button>

                      {/* User Avatar (Overlapping) */}
                      <div className="absolute -bottom-4 left-4">
                        <div className="w-12 h-12 rounded-full border-4 border-white overflow-hidden shadow-sm">
                          <img
                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80"
                            alt="User"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="pt-8 pb-6 px-6">
                      {/* Meta: Category & Views */}
                      <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full border border-gray-400"></div> {/* Placeholder for generic icon */}
                          <span>{event.category || 'General'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          <span>{Math.floor(Math.random() * 5000) + 500}</span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-gray-800 mb-2 truncate" title={event.title}>
                        {event.title}
                      </h3>

                      {/* Location & Date */}
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4 pb-4 border-b border-gray-100">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" />
                          <span className="truncate max-w-[120px]">{event.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          <span>{new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                      </div>

                      {/* Footer: Price & Rating */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-baseline gap-2">
                          {/* Display generic price for now until schema update */}
                          <span className="text-xl font-bold text-[#D3043C]">Free</span>
                          <span className="text-xs text-gray-400 line-through">$150</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 bg-orange-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-sm">
                            <span>4.7</span>
                          </div>
                          <span className="text-xs text-gray-400">(50)</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Events;

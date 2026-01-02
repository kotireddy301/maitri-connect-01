import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Users, Plus, ChevronDown, User, LayoutDashboard, List, Bookmark, MessageSquare, Star, PlusCircle, LogOut } from 'lucide-react';
import { Button } from '../ui/button.jsx';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About Us' },
    { path: '/events', label: 'Events' },
    { path: '/vendors', label: 'Vendors' },
  ];

  /* ✅ USER DROPDOWN MENU ITEMS */
  /* ✅ USER DROPDOWN MENU ITEMS */
  const userMenuItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Profile', path: '/profile' },
    { label: 'My Listing', path: '/my-listing' },
    // Removed: Bookmarks, Messages, Reviews as per user request
    { label: 'Add Listing', path: '/add-event' }, // Updated to point to main AddEvent page for now
  ];

  const [showUserMenu, setShowUserMenu] = useState(false);

  const isActive = (path) => location.pathname === path;

  /* Hide Navigation on Admin and User Dashboard pages */
  if (location.pathname.startsWith('/admin') || ['/dashboard', '/profile', '/my-listing'].includes(location.pathname)) {
    return null;
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-lg group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              MaitriConnect
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-3 py-2 text-sm font-medium transition-colors ${isActive(item.path)
                  ? 'text-blue-600'
                  : 'text-gray-700 hover:text-blue-600'
                  }`}
              >
                {item.label}
                {isActive(item.path) && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                  />
                )}
              </Link>
            ))}

            {/* ✅ USER DROPDOWN (Logged In State Mock) */}
            <div
              className="relative"
              onMouseEnter={() => setShowUserMenu(true)}
              onMouseLeave={() => setShowUserMenu(false)}
            >
              <button className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium px-3 py-2">
                <span>User Pages</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full right-0 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 mt-2"
                  >
                    {userMenuItems.map((item, index) => (
                      <Link
                        key={index}
                        to={item.path}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 hover:text-red-500 transition-colors"
                      >
                        {/* Icons Mapping based on label */}
                        {item.label === 'Dashboard' && <LayoutDashboard className="w-4 h-4" />}
                        {item.label === 'Profile' && <User className="w-4 h-4" />}
                        {item.label === 'My Listing' && <List className="w-4 h-4" />}
                        {item.label === 'Bookmarks' && <Bookmark className="w-4 h-4" />}
                        {item.label === 'Messages' && <MessageSquare className="w-4 h-4" />}
                        {item.label === 'Reviews' && <Star className="w-4 h-4" />}
                        {item.label === 'Add Listing' && <PlusCircle className="w-4 h-4" />}

                        {item.label}
                      </Link>
                    ))}
                    <div className="h-px bg-gray-100 my-2" />
                    <button
                      onClick={() => {
                        localStorage.removeItem('user_token');
                        localStorage.removeItem('user_role');
                        localStorage.removeItem('user_user');
                        window.location.href = '/login';
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 hover:text-red-500 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out User
                    </button>
                    {localStorage.getItem('admin_token') && (
                      <button
                        onClick={() => {
                          localStorage.removeItem('admin_token');
                          localStorage.removeItem('admin_role');
                          localStorage.removeItem('admin_user');
                          window.location.href = '/login';
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 hover:text-red-500 transition-colors border-t border-gray-100"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out Admin
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="h-6 w-px bg-gray-200" />

            {/* Admin Link */}
            <Link to="/admin" className="text-gray-700 font-medium hover:text-blue-600">
              Admin
            </Link>

            {/* Sign Up Link */}
            <Link to="/register" className="text-gray-700 font-medium hover:text-blue-600">
              Sign Up
            </Link>

            {/* Red Sign In Button */}
            <Button
              asChild
              className="bg-[#D3043C] text-white hover:bg-[#a0032e] shadow-md px-6 rounded-md"
            >
              <Link to="/login">
                Sign In
              </Link>
            </Button>

            {/* Dark Add Listing Button */}
            <Button
              asChild
              className="ml-2 bg-[#2d3748] text-white shadow-md hover:bg-[#1a202c] px-6 rounded-md"
            >
              <Link to="/add-event" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Listing
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-2 rounded-lg text-sm font-medium ${isActive(item.path)
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    {item.label}
                  </Link>
                ))}

                {/* ✅ MOBILE ADD EVENT BUTTON */}
                <div className="px-4 pt-2">
                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white"
                  >
                    <Link to="/add-event" onClick={() => setIsOpen(false)}>
                      Add Event
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navigation;

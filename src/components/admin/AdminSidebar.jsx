import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    List,
    Grid,
    MapPin,
    Star,
    MessageSquare,
    Box,
    Settings
} from 'lucide-react';

const AdminSidebar = ({ isOpen, onClose }) => {
    const location = useLocation();

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
        { icon: List, label: 'Listings', path: '/admin/listings' },
        { icon: Grid, label: 'Categories', path: '/admin/categories' },
        { icon: Box, label: 'Sub Categories', path: '/admin/sub-categories' },
    ];

    return (
        <>
            <div className={`
                fixed top-0 left-0 bottom-0 w-64 bg-white border-r border-gray-200 z-[100] transform transition-transform duration-300 lg:translate-x-0
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-lg group-hover:scale-110 transition-transform">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="w-6 h-6 text-white"
                            >
                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            MaitriConnect
                        </span>
                    </Link>
                </div>

                <div className="p-4">
                    <div className="text-xs font-semibold text-gray-400 mb-4 px-2 tracking-wider">MAIN</div>
                    <nav className="space-y-1">
                        {menuItems.map((item) => (
                            <Link
                                key={item.label}
                                to={item.path}
                                onClick={onClose} // Close sidebar on mobile when link is clicked
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${location.pathname === item.path
                                    ? 'bg-[#D3043C] text-white shadow-md'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <item.icon className="w-5 h-5" />
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>
        </>
    );
};

export default AdminSidebar;

import React, { useState, useEffect } from 'react';
import { Menu, Search, Bell, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../lib/api';

const UserHeader = ({ onMenuClick }) => {
    const [user, setUser] = useState({ first_name: 'User', profile_pic: null });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/auth/profile');
                if (res.data) {
                    // Normalize profile pic url
                    let profile_pic = res.data.profile_pic;
                    if (profile_pic && !profile_pic.startsWith('http')) {
                        profile_pic = `http://localhost:5000${profile_pic}`;
                    }
                    setUser({ ...res.data, profile_pic });
                }
            } catch (err) {
                console.error("Failed to fetch user profile for header");
            }
        };
        fetchProfile();
    }, []);
    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 lg:ml-64 sticky top-0 z-40">

            {/* Mobile Menu Button */}
            <button
                onClick={onMenuClick}
                className="lg:hidden p-2 -ml-2 hover:bg-gray-100 rounded-lg text-gray-600"
            >
                <Menu className="w-6 h-6" />
            </button>

            {/* Search - Hidden on mobile */}
            <div className="w-full max-w-md hidden md:block">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search listings..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-200"
                    />
                </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4 ml-auto">
                <Link to="/" className="text-sm text-gray-500 hover:text-gray-900 hidden sm:block">Back to Home</Link>

                <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>

                <div className="flex items-center gap-3">
                    <button className="p-2 hover:bg-gray-50 rounded-full text-gray-500 relative">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>

                    <Link to="/profile" className="flex items-center gap-2 ml-2 hover:bg-gray-50 p-1.5 rounded-lg transition-colors">
                        {user.profile_pic ? (
                            <img
                                src={user.profile_pic}
                                alt="Profile"
                                className="w-8 h-8 rounded-full object-cover border border-gray-200"
                            />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                <User className="w-5 h-5" />
                            </div>
                        )}
                        <span className="text-sm font-medium text-gray-700 hidden mobile:block">
                            {user.first_name || 'User'}
                        </span>
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default UserHeader;

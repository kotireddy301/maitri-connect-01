import React, { useState, useRef, useEffect } from 'react';
import { Search, Globe, Moon, Bell, Maximize, LogOut, User, Settings as SettingsIcon, Menu } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api, { FILE_BASE_URL } from '../../lib/api';

const AdminHeader = ({ onMenuClick }) => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [adminUser, setAdminUser] = useState({
        first_name: 'Admin',
        last_name: 'User',
        email: 'admin@example.com',
        role: 'admin',
        profile_pic: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"
    });
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/auth/profile');
                const data = res.data;

                let pic = data.profile_pic;
                if (pic && !pic.startsWith('http')) {
                    pic = `${FILE_BASE_URL}${pic}`;
                }
                setAdminUser({
                    first_name: data.first_name,
                    last_name: data.last_name,
                    email: data.email,
                    role: data.role,
                    profile_pic: pic || "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"
                });
            } catch (err) {
                console.error("Failed to fetch admin profile", err);
            }
        };
        fetchProfile();
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 lg:ml-64 sticky top-0 z-40 transition-all duration-300">

            {/* Mobile Menu Button */}
            <button
                onClick={onMenuClick}
                className="lg:hidden p-2 -ml-2 hover:bg-gray-100 rounded-lg"
            >
                <Menu className="w-6 h-6 text-gray-600" />
            </button>

            {/* Search */}
            <div className="w-96 relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search"
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-200"
                />
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">

                <div className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 cursor-pointer">
                    <Globe className="w-4 h-4" />
                    <span className="hidden sm:inline">View Site</span>
                </div>

                <div className="flex items-center gap-3 border-l border-gray-200 pl-4">
                    <button className="p-2 hover:bg-gray-50 rounded-full text-gray-500">
                        <Moon className="w-5 h-5" />
                    </button>
                    <button className="p-2 hover:bg-gray-50 rounded-full text-gray-500 relative">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>
                    <button className="p-2 hover:bg-gray-50 rounded-full text-gray-500">
                        <Maximize className="w-5 h-5" />
                    </button>
                </div>

                {/* Profile Dropdown */}
                <div className="relative pl-4 border-l border-gray-200" ref={dropdownRef}>
                    <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors focus:outline-none"
                    >
                        <img
                            src={adminUser.profile_pic}
                            alt="Admin"
                            className="w-8 h-8 rounded-full bg-gray-100 object-cover"
                        />
                        <div className="hidden sm:block text-left">
                            <p className="text-sm font-semibold text-gray-900 leading-tight">{adminUser.first_name} {adminUser.last_name}</p>
                            <p className="text-xs text-gray-500 capitalize">{adminUser.role || 'User'}</p>
                        </div>
                    </button>

                    {/* Dropdown Menu */}
                    {isProfileOpen && (
                        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                            {/* User Header */}
                            <div className="px-4 py-3 flex items-center gap-3 border-b border-gray-100">
                                <img
                                    src={adminUser.profile_pic}
                                    alt="Admin"
                                    className="w-10 h-10 rounded-full bg-gray-100 object-cover"
                                />
                                <div>
                                    <p className="text-sm font-bold text-gray-900 max-w-full truncate">{adminUser.first_name} {adminUser.last_name}</p>
                                    <p className="text-xs text-gray-500 max-w-full truncate">{adminUser.email}</p>
                                </div>
                            </div>

                            {/* Menu Items */}
                            <div className="py-2">
                                <Link to="/admin/profile" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#D3043C]">
                                    <User className="w-4 h-4" />
                                    Profile
                                </Link>
                                <Link to="/admin/profile" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#D3043C]">
                                    <SettingsIcon className="w-4 h-4" />
                                    Settings
                                </Link>
                            </div>

                            <div className="border-t border-gray-100 my-1"></div>

                            {/* Logout */}
                            <button
                                onClick={handleLogout}
                                className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#D3043C]"
                            >
                                <LogOut className="w-4 h-4" />
                                Log Out
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </header>
    );
};

export default AdminHeader;

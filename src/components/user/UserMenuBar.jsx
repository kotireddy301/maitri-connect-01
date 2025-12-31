import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, User, List, LogOut } from 'lucide-react';

const UserMenuBar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: User, label: 'Profile', path: '/profile' },
        { icon: List, label: 'My Listing', path: '/my-listing' },
    ];

    const handleLogout = () => {
        // Add actual logout logic here
        navigate('/login');
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-2 flex flex-wrap items-center justify-between gap-2 overflow-x-auto">
            <div className="flex items-center gap-2">
                {menuItems.map((item) => (
                    <Link
                        key={item.label}
                        to={item.path}
                        className={`flex items-center gap-2 px-6 py-3 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${location.pathname === item.path
                                ? 'bg-[#D3043C] text-white'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                    >
                        <item.icon className="w-4 h-4" />
                        {item.label}
                    </Link>
                ))}
            </div>

            <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-6 py-3 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 whitespace-nowrap ml-auto"
            >
                <LogOut className="w-4 h-4" />
                Logout
            </button>
        </div>
    );
};

export default UserMenuBar;

import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import UserLayout from '../../components/user/UserLayout';
import { FileText, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../lib/api';

const UserDashboard = () => {
    const [stats, setStats] = useState({
        activeListings: 0,
        totalViews: 0,
        totalReviews: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch user's events to count them
                const res = await api.get('/events/user');
                setStats({
                    activeListings: res.data.length,
                    totalViews: 0, // Placeholder until views are implemented
                    totalReviews: 0
                });
            } catch (err) {
                console.error("Failed to fetch dashboard stats", err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <UserLayout>
            <Helmet>
                <title>Dashboard | MaitriConnect User</title>
            </Helmet>

            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500">Welcome back!</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Premium Stats Grid */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group cursor-default relative overflow-hidden">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Active Listings</p>
                            <h3 className="text-4xl font-extrabold text-gray-900 group-hover:text-[#D3043C] transition-colors">
                                {loading ? '-' : stats.activeListings}
                            </h3>
                        </div>
                        <div className="p-3 bg-red-50 rounded-xl text-[#D3043C] group-hover:scale-110 transition-transform">
                            <FileText className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
                        <div className="bg-[#D3043C] h-1.5 rounded-full" style={{ width: '70%' }}></div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group cursor-default relative overflow-hidden">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Total Views</p>
                            <h3 className="text-4xl font-extrabold text-gray-900 group-hover:text-blue-600 transition-colors">{stats.totalViews}</h3>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-xl text-blue-600 group-hover:scale-110 transition-transform">
                            <Eye className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
                        <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                </div>

                {/* Placeholders for future stats if needed */}
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to grow your business?</h3>
                <p className="text-gray-500 mb-6">Add more listings to reach more customers on MaitriConnect.</p>
                <Link to="/add-event" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#D3043C] hover:bg-[#a0032e] transition-colors">
                    Add New Listing
                </Link>
            </div>

        </UserLayout>
    );
};

export default UserDashboard;

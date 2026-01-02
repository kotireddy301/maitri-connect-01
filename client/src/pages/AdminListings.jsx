import React, { useState, useEffect } from 'react';
import { Helmet } from "react-helmet";
import { Search, Filter, MoreVertical, CheckCircle, XCircle, Clock, Trash2, Eye, Edit2 } from 'lucide-react';
import AdminLayout from '../components/admin/AdminLayout';
import api, { FILE_BASE_URL } from '../lib/api';
import { Link } from 'react-router-dom'; // Import Link
import DeleteConfirmationModal from '../components/DeleteConfirmationModal'; // Import Modal

const AdminListings = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('All');

    // Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [eventToDelete, setEventToDelete] = useState(null);

    // Fetch listings
    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const res = await api.get('/events/admin/all');
            setEvents(res.data);
        } catch (err) {
            console.error("Failed to fetch events", err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await api.put(`/ events / ${id}/status`, { status });
            // Optimistic update
            setEvents(events.map(ev => ev.id === id ? { ...ev, status } : ev));
        } catch (err) {
            console.error("Failed to update status", err);
        }
    };

    // Open Modal
    const openDeleteModal = (id) => {
        setEventToDelete(id);
        setIsDeleteModalOpen(true);
    };

    // Confirm Delete
    const handleDeleteConfirm = async () => {
        if (!eventToDelete) return;
        try {
            await api.delete(`/events/admin/${eventToDelete}`);
            setEvents(events.filter(ev => ev.id !== eventToDelete));
            setIsDeleteModalOpen(false);
            setEventToDelete(null);
        } catch (err) {
            console.error("Failed to delete event", err);
        }
    };

    const filteredEvents = events.filter(event => {
        if (activeTab === 'All') return true;
        if (activeTab === 'Pending') return event.status === 'pending';
        if (activeTab === 'Approved') return event.status === 'approved';
        if (activeTab === 'Rejected') return event.status === 'rejected';
        return true;
    });

    const categories = ['All', 'Pending', 'Approved', 'Rejected'];

    return (
        <AdminLayout>
            <Helmet>
                <title>All Listings | Admin Board</title>
            </Helmet>

            {/* Header Controls */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-2xl font-bold text-gray-800">All Listings</h1>
                <div className="flex items-center gap-3">
                    <button className="p-2 bg-[#D3043C] text-white rounded-lg"><Filter className="w-5 h-5" /></button>
                    <button className="p-2 bg-white border border-gray-200 rounded-lg text-gray-600"><MoreVertical className="w-5 h-5" /></button>
                    <Link to="/add-event" className="bg-[#1f2937] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                        + Add Listing
                    </Link>
                </div>
            </div>

            {/* Tabs & Filter */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
                <div className="border-b border-gray-100 p-4">
                    <div className="flex flex-wrap gap-6">
                        {categories.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`text-sm font-medium pb-4 -mb-4 border-b-2 transition-colors ${activeTab === tab
                                    ? 'border-[#D3043C] text-[#D3043C]'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {tab} Listings
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50/50 text-xs text-gray-500 uppercase font-semibold">
                            <tr>
                                <th className="px-6 py-4 text-left">Listing</th>
                                <th className="px-6 py-4 text-left">Category</th>
                                <th className="px-6 py-4 text-left">Amount</th>
                                <th className="px-6 py-4 text-left">Date</th>
                                <th className="px-6 py-4 text-left">Status</th>
                                <th className="px-6 py-4 text-left">Created By</th>
                                <th className="px-6 py-4 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredEvents.map((event) => (
                                <tr key={event.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={event.image_url ? `${FILE_BASE_URL}${event.image_url}` : "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=100&q=80"}
                                                alt={event.title}
                                                className="w-10 h-10 rounded-lg object-cover bg-gray-100"
                                            />
                                            <span className="text-sm font-medium text-gray-900 line-clamp-1 max-w-[150px]" title={event.title}>{event.title}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{event.category || 'General'}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">$50</td> {/* Placeholder */}
                                    <td className="px-6 py-4 text-sm text-gray-600">{new Date(event.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${event.status === 'approved' ? 'bg-green-50 text-green-600' :
                                            event.status === 'rejected' ? 'bg-red-50 text-red-600' :
                                                'bg-yellow-50 text-yellow-600'
                                            }`}>
                                            {event.status === 'approved' ? 'Active' : event.status === 'rejected' ? 'Inactive' : 'Pending'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden">
                                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${event.first_name}`} alt="User" />
                                            </div>
                                            <span className="text-sm text-gray-600">{event.role === 'admin' ? 'Admin' : 'Provider'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center items-center gap-2">
                                            {event.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleStatusUpdate(event.id, 'approved')}
                                                        className="p-1.5 rounded-full bg-green-50 text-green-600 hover:bg-green-100 transition-colors" title="Approve">
                                                        <CheckCircle className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(event.id, 'rejected')}
                                                        className="p-1.5 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors" title="Reject">
                                                        <XCircle className="w-4 h-4" />
                                                    </button>
                                                </>
                                            )}

                                            {/* Eye Icon Link */}
                                            <Link to={`/events/${event.id}`} className="p-1.5 rounded-full bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-blue-600 transition-colors" title="View Details">
                                                <Eye className="w-4 h-4" />
                                            </Link>

                                            <button className="p-1.5 rounded-full bg-gray-50 text-gray-500 hover:bg-gray-100 transition-colors" title="Edit">
                                                <Edit2 className="w-4 h-4" />
                                            </button>

                                            {/* Delete Button Triggers Modal */}
                                            <button
                                                onClick={() => openDeleteModal(event.id)}
                                                className="p-1.5 rounded-full bg-gray-50 text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors" title="Delete">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination (Static) */}
                <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
                    <span>Showing 1-10 of {filteredEvents.length} results</span>
                    <div className="flex gap-1">
                        <button className="w-8 h-8 flex items-center justify-center rounded bg-[#D3043C] text-white">1</button>
                        <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100">2</button>
                        <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100">3</button>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                title="Delete Services"
                message="Are you sure want to Delete?"
            />
        </AdminLayout>
    );
};

export default AdminListings;

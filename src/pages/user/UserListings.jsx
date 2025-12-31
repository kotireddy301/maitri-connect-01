import React from 'react';
import { Helmet } from 'react-helmet';
import UserLayout from '../../components/user/UserLayout';
import { Search, Eye, Edit2, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal'; // Import Modal
import api, { FILE_BASE_URL } from '../../lib/api'; // Import api instance

const UserListings = () => {
    const [listings, setListings] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    // Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
    const [eventToDelete, setEventToDelete] = React.useState(null);

    React.useEffect(() => {
        const fetchListings = async () => {
            try {
                // Using API instance instead of fetch for consistency
                const res = await api.get('/events/user');
                setListings(Array.isArray(res.data) ? res.data : []);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch listings", err);
                const errorMessage = err.response?.data?.message || err.message || "Failed to load listings. Please try again.";
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };
        fetchListings();
    }, []);

    // Open Modal
    const openDeleteModal = (id) => {
        setEventToDelete(id);
        setIsDeleteModalOpen(true);
    };

    // Confirm Delete
    const handleDeleteConfirm = async () => {
        if (!eventToDelete) return;
        try {
            await api.delete(`/events/${eventToDelete}`);
            setListings(listings.filter(item => item.id !== eventToDelete));
            setIsDeleteModalOpen(false);
            setEventToDelete(null);
        } catch (err) {
            console.error("Failed to delete event", err);
            // Optionally handle error (e.g., toast)
        }
    };

    return (
        <UserLayout className="min-h-screen">
            <Helmet>
                <title>My Listings | MaitriConnect</title>
            </Helmet>

            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900">My Listings</h1>
                <Link to="/add-event" className="inline-flex items-center gap-2 px-4 py-2 bg-[#D3043C] text-white text-sm font-medium rounded-lg hover:bg-[#a0032e] transition-colors">
                    + Add Listing
                </Link>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl">
                    {error}
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                {/* Filters Header */}
                <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gradient-to-r from-gray-50 to-white">
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 font-bold" />
                        <input
                            type="text"
                            placeholder="Search your listings..."
                            className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D3043C]/20 focus:border-[#D3043C] transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-500">Sort by:</span>
                        <select className="bg-white border border-gray-200 text-sm font-medium text-gray-700 rounded-xl px-4 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D3043C]/20 focus:border-[#D3043C] cursor-pointer hover:bg-gray-50 transition-colors">
                            <option>Newest First</option>
                            <option>Oldest First</option>
                            <option>Price: High to Low</option>
                        </select>
                    </div>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="p-12 text-center">
                        <div className="inline-block w-8 h-8 border-4 border-[#D3043C] border-t-transparent rounded-full animate-spin"></div>
                        <p className="mt-4 text-gray-500 font-medium">Loading your listings...</p>
                    </div>
                ) : listings.length === 0 ? (
                    <div className="p-16 text-center bg-gray-50/50">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">No listings found</h3>
                        <p className="text-gray-500 mb-6">You haven't posted any events yet.</p>
                        <Link to="/add-event" className="inline-flex items-center px-6 py-3 bg-[#D3043C] text-white font-medium rounded-xl hover:bg-[#a0032e] shadow-lg shadow-red-200 transition-all hover:-translate-y-0.5">
                            Create First Listing
                        </Link>
                    </div>
                ) : (
                    /* Modern Table */
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100">
                                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-gray-500">Listing Info</th>
                                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-gray-500">Status</th>
                                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-gray-500">Stats</th>
                                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-gray-500 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {listings.map((item) => (
                                    <tr key={item.id} className="group hover:bg-blue-50/30 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex gap-4">
                                                <div className="relative w-32 h-24 flex-shrink-0 overflow-hidden rounded-xl shadow-sm group-hover:shadow-md transition-all">
                                                    <img
                                                        src={item.image_url ? `${FILE_BASE_URL}${item.image_url}` : "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=400&q=80"}
                                                        alt={item.title}
                                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                    <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-medium text-white">
                                                        {item.category || 'Event'}
                                                    </div>
                                                </div>
                                                <div className="py-1">
                                                    <h3 className="text-base font-bold text-gray-900 line-clamp-1 mb-1 group-hover:text-[#D3043C] transition-colors">
                                                        {item.title}
                                                    </h3>
                                                    <p className="text-sm text-gray-500 line-clamp-2 mb-3 leading-relaxed">
                                                        {item.description}
                                                    </p>
                                                    <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                                                        <span>{new Date(item.date).toLocaleDateString()}</span>
                                                        <span>•</span>
                                                        <span>{item.location}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 align-middle">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${item.status === 'approved'
                                                ? 'bg-green-50 text-green-600 border-green-100'
                                                : item.status === 'rejected'
                                                    ? 'bg-red-50 text-red-600 border-red-100'
                                                    : 'bg-yellow-50 text-yellow-600 border-yellow-100'
                                                }`}>
                                                {item.status === 'approved' ? 'Published' : item.status === 'rejected' ? 'Rejected' : 'Under Review'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-6 align-middle">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-sm font-bold text-gray-900 flex items-center gap-1">
                                                    <Eye className="w-4 h-4 text-gray-400" />
                                                    {item.views || 0}
                                                </span>
                                                <span className="text-xs text-gray-400">Total Views</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 align-middle text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {/* Eye Icon Link */}
                                                <Link
                                                    to={`/events/${item.id}`}
                                                    className="w-9 h-9 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-500 hover:text-[#D3043C] hover:border-[#D3043C] hover:bg-red-50 shadow-sm transition-all"
                                                    title="View"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                                <Link
                                                    to={`/edit-event/${item.id}`}
                                                    className="w-9 h-9 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-500 hover:text-blue-600 hover:border-blue-600 hover:bg-blue-50 shadow-sm transition-all"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => openDeleteModal(item.id)}
                                                    className="w-9 h-9 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-500 hover:text-red-600 hover:border-red-600 hover:bg-red-50 shadow-sm transition-all"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                title="Delete Listing"
                message="Are you sure you want to delete this listing? This action cannot be undone."
            />

        </UserLayout>
    );
};

export default UserListings;

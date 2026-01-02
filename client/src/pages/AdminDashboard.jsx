import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import api, { FILE_BASE_URL } from '../lib/api';
import { User, Briefcase, Calendar, Layers, Clock, CheckCircle } from 'lucide-react';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';
import StatCard from '../components/admin/StatCard';
import { Button } from '../ui/button';
import { useToast } from '../ui/use-toast';

const AdminDashboard = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const fetchEvents = async () => {
        try {
            const res = await api.get('/events/admin/all');
            setEvents(res.data);
        } catch (err) {
            console.error(err);
            toast({ title: "Error fetching data" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchEvents(); }, []);

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await api.put(`/events/${id}/status`, { status: newStatus });
            toast({ title: `Event ${newStatus}` });
            fetchEvents();
        } catch (err) {
            toast({ title: "Update failed", variant: "destructive" });
        }
    };

    // Calculate Mock Stats based on real data
    const totalEvents = events.length;
    const approvedEvents = events.filter(e => e.status === 'approved').length;
    const pendingEvents = events.filter(e => e.status === 'pending').length;
    const rejectedEvents = events.filter(e => e.status === 'rejected').length;

    return (
        <div className="bg-gray-50 min-h-screen">
            <Helmet>
                <title>Dashboard | MaitriConnect Admin</title>
            </Helmet>

            <AdminSidebar />
            <AdminHeader />

            <main className="lg:ml-64 p-6">

                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <StatCard
                        title="User"
                        count={150} // Mock
                        icon={User}
                        color="bg-purple-100 text-purple-600"
                    />
                    <StatCard
                        title="No. of Events"
                        count={totalEvents}
                        icon={Calendar}
                        color="bg-blue-100 text-blue-600"
                    />
                </div>

                {/* Charts Section Removed as per user request */}

                {/* Existing Functionality: Moderation Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-semibold text-gray-800">Recent Event Submissions</h3>
                        <button className="text-sm text-[#D3043C] font-medium">View All</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {events.slice(0, 5).map((event) => (
                                    <tr key={event.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                                    {event.image_url ? (
                                                        <img src={`${FILE_BASE_URL}${event.image_url}`} className="h-10 w-10 rounded-lg object-cover" alt="" />
                                                    ) : (
                                                        <Calendar className="w-5 h-5 text-gray-400" />
                                                    )}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{event.title}</div>
                                                    <div className="text-sm text-gray-500">{event.location}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(event.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${event.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                event.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {event.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            {event.status === 'pending' && (
                                                <div className="flex justify-end gap-2">
                                                    <Button size="sm" className="h-8 bg-green-600 hover:bg-green-700 text-white" onClick={() => handleStatusUpdate(event.id, 'approved')}>
                                                        Approve
                                                    </Button>
                                                    <Button size="sm" variant="destructive" className="h-8" onClick={() => handleStatusUpdate(event.id, 'rejected')}>
                                                        Reject
                                                    </Button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </main>
        </div>
    );
};

export default AdminDashboard;

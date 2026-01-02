import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import api, { FILE_BASE_URL } from '../lib/api';
import PageHeader from '../components/PageHeader';
import { MapPin, Calendar, Clock, Share2, Heart, Flag, Phone, Globe, Star, CheckCircle, Navigation as NavIcon, User } from 'lucide-react';
import { Button } from '../ui/button';

const EventDetails = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await api.get(`/events/${id}`);
                setEvent(res.data);
            } catch (err) {
                console.error("Failed to fetch event details", err);
                setError("Event not found");
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="inline-block w-8 h-8 border-4 border-[#D3043C] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error || !event) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Event Not Found</h2>
                <p className="text-gray-500 mb-6">The event you are looking for does not exist or has been removed.</p>
                <Link to="/events" className="text-[#D3043C] hover:underline font-medium">Back to Events</Link>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>{event.title} | MaitriConnect</title>
            </Helmet>

            <PageHeader title="Event Details" path={`Events / ${event.title}`} />

            <div className="bg-gray-50 min-h-screen py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Top Section: Header & Price */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                            <div className="flex items-start gap-4">
                                <div className="h-20 w-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                                    <img
                                        src={event.organizer_pic ? `${FILE_BASE_URL}${event.organizer_pic}` : `https://api.dicebear.com/7.x/avataaars/svg?seed=${event.first_name}`} // Fallback to organizer avatar if no event logo, or just random
                                        alt="Organizer"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{event.title}</h1>
                                    <p className="text-gray-500 text-sm flex items-center gap-1.5 mb-2">
                                        <MapPin className="w-4 h-4 text-gray-400" />
                                        {event.location}
                                    </p>
                                    <div className="flex items-center gap-1 text-yellow-400 text-sm font-medium">
                                        <Star className="w-4 h-4 fill-current" />
                                        <Star className="w-4 h-4 fill-current" />
                                        <Star className="w-4 h-4 fill-current" />
                                        <Star className="w-4 h-4 fill-current" />
                                        <Star className="w-4 h-4 fill-current text-gray-300" />
                                        <span className="text-gray-400 ml-1">(4.5 Reviews)</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <div className="text-3xl font-bold text-[#D3043C]">$150 <span className="text-sm font-normal text-gray-400">/ Fixed</span></div>
                                <div className="flex gap-2">
                                    <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-semibold uppercase tracking-wide">Open</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-gray-100 flex flex-wrap gap-4 text-sm text-gray-600 font-medium">
                            <button className="flex items-center gap-2 hover:text-[#D3043C] transition-colors"><NavIcon className="w-4 h-4" /> Get Directions</button>
                            <button className="flex items-center gap-2 hover:text-[#D3043C] transition-colors"><Globe className="w-4 h-4" /> Website</button>
                            <button className="flex items-center gap-2 hover:text-[#D3043C] transition-colors"><Share2 className="w-4 h-4" /> Share</button>
                            <button className="flex items-center gap-2 hover:text-[#D3043C] transition-colors"><Flag className="w-4 h-4" /> Report</button>
                            <button className="flex items-center gap-2 hover:text-[#D3043C] transition-colors"><Heart className="w-4 h-4" /> Save</button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8">

                            {/* Gallery / Main Image */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-[400px]">
                                <img
                                    src={event.image_url ? `${FILE_BASE_URL}${event.image_url}` : "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1200&q=80"}
                                    alt={event.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Description */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-1 h-6 bg-[#D3043C] rounded-full"></div>
                                    <h3 className="text-xl font-bold text-gray-900">Description</h3>
                                </div>
                                <div className="prose prose-gray max-w-none text-gray-600">
                                    <p>{event.description || "No description provided for this event."}</p>
                                </div>
                            </div>

                            {/* Features */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-1 h-6 bg-[#D3043C] rounded-full"></div>
                                    <h3 className="text-xl font-bold text-gray-900">Event Features</h3>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-8">
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <div className="p-2 bg-red-50 text-[#D3043C] rounded-lg">
                                            <CheckCircle className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm font-medium">Free Parking</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <div className="p-2 bg-red-50 text-[#D3043C] rounded-lg">
                                            <CheckCircle className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm font-medium">Wi-Fi Access</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <div className="p-2 bg-red-50 text-[#D3043C] rounded-lg">
                                            <CheckCircle className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm font-medium">Accessible</span>
                                    </div>
                                    {/* Mock features */}
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <div className="p-2 bg-red-50 text-[#D3043C] rounded-lg">
                                            <CheckCircle className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm font-medium">Restrooms</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-8">

                            {/* Organizer / Contact */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-1 h-6 bg-[#D3043C] rounded-full"></div>
                                    <h3 className="text-lg font-bold text-gray-900">Organizer</h3>
                                </div>
                                <div className="flex items-center gap-4 mb-6">
                                    <img
                                        src={event.profile_pic ? `${FILE_BASE_URL}${event.profile_pic}` : "https://api.dicebear.com/7.x/avataaars/svg?seed=Organizer"}
                                        className="w-14 h-14 rounded-full bg-gray-100 object-cover"
                                        alt="Organizer"
                                    />
                                    <div>
                                        <h4 className="font-bold text-gray-900">{event.first_name} {event.last_name}</h4>
                                        <p className="text-xs text-gray-500">Event Organizer</p>
                                    </div>
                                </div>

                                <Button className="w-full mb-3 bg-[#D3043C] hover:bg-[#a0032e] text-white">Call Now</Button>
                                <Button variant="outline" className="w-full border-gray-200 text-gray-700 hover:bg-gray-50">Send Message</Button>
                            </div>

                            {/* Details Info */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-1 h-6 bg-[#D3043C] rounded-full"></div>
                                    <h3 className="text-lg font-bold text-gray-900">Details</h3>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                                        <span className="text-sm text-gray-500">Date</span>
                                        <span className="text-sm font-medium text-gray-900">{new Date(event.date).toLocaleDateString('en-GB')}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                                        <span className="text-sm text-gray-500">Time</span>
                                        <span className="text-sm font-medium text-gray-900">{event.time}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                                        <span className="text-sm text-gray-500">Category</span>
                                        <span className="text-sm font-medium text-gray-900">{event.category}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                                        <span className="text-sm text-gray-500">Location</span>
                                        <span className="text-sm font-medium text-gray-900 text-right max-w-[50%] truncate">{event.location}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Map Placeholder */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-1 h-6 bg-[#D3043C] rounded-full"></div>
                                    <h3 className="text-lg font-bold text-gray-900">Business Info</h3>
                                </div>
                                <div className="h-48 bg-gray-100 rounded-xl relative overflow-hidden flex items-center justify-center">
                                    <MapPin className="w-8 h-8 text-gray-400" />
                                    <span className="absolute bottom-4 left-4 bg-white/90 px-3 py-1 text-xs font-semibold rounded-md shadow-sm">View on Google Maps</span>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EventDetails;

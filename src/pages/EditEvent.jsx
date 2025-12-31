import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import {
    Calendar,
    MapPin,
    Clock,
    User,
    Phone,
} from "lucide-react";
import { Button } from "../ui/button.jsx";
import { Input } from "../ui/input.jsx";
import { Label } from "../ui/label.jsx";
import { useToast } from "../ui/use-toast.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PageHeader from "../components/PageHeader";
import api from "../lib/api";
import { useNavigate, useParams } from "react-router-dom";

const EditEvent = () => {
    const { id } = useParams();
    const { toast } = useToast();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [form, setForm] = useState({
        first_name: "",
        last_name: "", // Note: Backend might not update user details via this endpoint, usually it returns them. We'll verify.
        user_email: "",
        phone: "",
        title: "",
        date: "",
        time: "",
        location: "",
        description: "",
        category: "Community",
        external_reg_url: ""
    });

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await api.get(`/events/${id}`);
                const event = res.data;

                // Pre-fill form
                setForm({
                    first_name: event.first_name || "",
                    last_name: event.last_name || "",
                    user_email: event.email || "",
                    phone: event.mobile || "",
                    title: event.title || "",
                    date: event.date ? new Date(event.date) : new Date(),
                    time: event.time || "",
                    location: event.location || "",
                    description: event.description || "",
                    category: event.category || "Community",
                    external_reg_url: event.external_reg_url || ""
                });
            } catch (err) {
                console.error("Failed to fetch event", err);
                toast({
                    title: "Error",
                    description: "Could not load event details",
                    variant: "destructive",
                });
                navigate('/my-listing');
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id, navigate, toast]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleDateChange = (date) => {
        setForm({ ...form, date: date });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const submitData = {};
        Object.keys(form).forEach(key => {
            if (key === 'date' && form[key]) {
                const d = new Date(form[key]);
                const formattedDate = d.toISOString().split('T')[0];
                submitData[key] = formattedDate;
            } else {
                submitData[key] = form[key];
            }
            // For now, removing user fields if sending specifically to route. 
            // The backend reads title, description, date, time, location, category, external_reg_url.
        });

        try {
            await api.put(`/events/${id}`, submitData);
            toast({
                title: "Event Updated",
                description: "Your event changes have been saved and are pending review.",
            });
            navigate('/my-listing');
        } catch (err) {
            console.error(err);
            toast({
                title: "Update Failed",
                description: err.response?.data?.message || "Could not update event",
                variant: "destructive"
            });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D3043C]"></div>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>Edit Listing | MaitriConnect</title>
            </Helmet>

            <PageHeader title="Edit Listing" path="Home / Edit Listing" />

            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden"
                >
                    <div className="bg-[#D3043C] px-8 py-6 text-white text-center">
                        <h2 className="text-2xl font-bold">Edit Your Event</h2>
                        <p className="opacity-90 mt-1">Update your event details</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-8">
                        {/* Note: Organizer details are read-only or just for context here, typically we don't edit user profile via event edit */}
                        <div className="space-y-6 opacity-60">
                            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center gap-2">
                                <User className="w-5 h-5 text-[#D3043C]" /> Organizer Details (Read Only)
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>First Name</Label>
                                    <Input value={form.first_name} disabled className="bg-gray-100" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Last Name</Label>
                                    <Input value={form.last_name} disabled className="bg-gray-100" />
                                </div>
                            </div>
                        </div>

                        {/* Event Details */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-[#D3043C]" /> Event Information
                            </h3>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Event Title</Label>
                                    <Input name="title" required value={form.title} onChange={handleChange} />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2 flex flex-col">
                                        <Label>Date</Label>
                                        <DatePicker
                                            selected={form.date}
                                            onChange={handleDateChange}
                                            className="w-full flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Time</Label>
                                        <div className="relative">
                                            <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input name="time" type="time" className="pl-10" required value={form.time} onChange={handleChange} />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Location / Venue</Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input name="location" className="pl-10" required value={form.location} onChange={handleChange} />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Category</Label>
                                    <select
                                        name="category"
                                        value={form.category}
                                        onChange={handleChange}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <option value="Community">Community</option>
                                        <option value="Music">Music</option>
                                        <option value="Food & Drink">Food & Drink</option>
                                        <option value="Charity">Charity</option>
                                        <option value="Business">Business</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Description</Label>
                                    <textarea
                                        name="description"
                                        required
                                        value={form.description}
                                        onChange={handleChange}
                                        className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                </div>
                            </div>
                        </div>

                        <Button type="submit" className="w-full bg-[#D3043C] hover:bg-[#b00332] text-white py-6 text-lg" disabled={submitting}>
                            {submitting ? "Updating..." : "Update Event"}
                        </Button>
                    </form>
                </motion.div>
            </div>
        </>
    );
};

export default EditEvent;

import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import {
    Upload,
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
import { useNavigate } from "react-router-dom";

const AddEvent = () => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [flyer, setFlyer] = useState(null);

    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        user_email: "",
        phone: "",
        title: "",
        date: "",
        time: "",
        location: "",
        description: "",
        category: "Community",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleDateChange = (date) => {
        setForm({ ...form, date: date });
    };

    const handleFlyerChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFlyer(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!flyer) {
            toast({
                title: "Flyer required",
                description: "Please upload an event flyer image.",
                variant: "destructive",
            });
            return;
        }

        setLoading(true);
        const submitData = new FormData();
        Object.keys(form).forEach(key => {
            if (key === 'date' && form[key]) {
                // Format Date object to YYYY-MM-DD
                const d = new Date(form[key]);
                const formattedDate = d.toISOString().split('T')[0];
                submitData.append(key, formattedDate);
            } else {
                submitData.append(key, form[key]);
            }
        });
        submitData.append('flyer', flyer);

        try {
            await api.post('/events', submitData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const role = localStorage.getItem('role');
            if (role === 'admin') {
                toast({
                    title: "Event Created!",
                    description: "Your event is now live.",
                });
                navigate('/admin/listings');
            } else {
                toast({
                    title: "Event Submitted!",
                    description: "Your event is under review by an admin.",
                });
                navigate('/dashboard');
            }
        } catch (err) {
            console.error(err);
            toast({
                title: "Submission Failed",
                description: err.response?.data?.message || "Could not save event",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>Add Listing | MaitriConnect</title>
            </Helmet>

            <PageHeader title="Add Listing" path="Home / Add Listing" />

            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden"
                >
                    <div className="bg-[#D3043C] px-8 py-6 text-white text-center">
                        <h2 className="text-2xl font-bold">Submit Your Event</h2>
                        <p className="opacity-90 mt-1">Share your event with the community</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-8">
                        {/* Organizer Info */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center gap-2">
                                <User className="w-5 h-5 text-[#D3043C]" /> Organizer Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>First Name</Label>
                                    <Input name="first_name" required value={form.first_name} onChange={handleChange} placeholder="John" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Last Name</Label>
                                    <Input name="last_name" required value={form.last_name} onChange={handleChange} placeholder="Doe" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Email</Label>
                                    <Input name="user_email" type="email" required value={form.user_email} onChange={handleChange} placeholder="john@example.com" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Phone Number</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input name="phone" className="pl-10" required value={form.phone} onChange={handleChange} placeholder="(555) 123-4567" />
                                    </div>
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
                                    <Input name="title" required value={form.title} onChange={handleChange} placeholder="Annual Summer Festival" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2 flex flex-col">
                                        <Label>Date</Label>
                                        <DatePicker
                                            selected={form.date}
                                            onChange={handleDateChange}
                                            className="w-full flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            placeholderText="Select date"
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
                                        <Input name="location" className="pl-10" required value={form.location} onChange={handleChange} placeholder="Houston Community Center" />
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
                                        placeholder="Tell us about your event..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Event Flyer</Label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFlyerChange}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                        <div className="flex flex-col items-center justify-center space-y-2">
                                            <Upload className="w-8 h-8 text-gray-400" />
                                            <span className="text-sm text-gray-500">
                                                {flyer ? flyer.name : "Click to upload or drag and drop"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Button type="submit" className="w-full bg-[#D3043C] hover:bg-[#b00332] text-white py-6 text-lg" disabled={loading}>
                            {loading ? "Submitting..." : "Submit Event"}
                        </Button>
                    </form>
                </motion.div>
            </div>
        </>
    );
};

export default AddEvent;

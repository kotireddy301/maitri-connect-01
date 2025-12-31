import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import UserLayout from '../../components/user/UserLayout';
import { Camera, Trash2, Lock, Save } from 'lucide-react';
import { Button } from '../../ui/button';
import { useToast } from '../../ui/use-toast';
import api from '../../lib/api';

const UserProfile = () => {
    const { toast } = useToast();
    const [user, setUser] = useState({
        first_name: '',
        last_name: '',
        email: '',
        role: ''
    });
    const [image, setImage] = useState("https://api.dicebear.com/7.x/avataaars/svg?seed=John");
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);

    // Passwords
    const [passwords, setPasswords] = useState({
        current_password: '',
        new_password: '',
        confirm_password: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/auth/profile');
                const data = res.data;
                setUser(data);
                if (data.profile_pic) {
                    const imgUrl = data.profile_pic.startsWith('http')
                        ? data.profile_pic
                        : `http://localhost:5000${data.profile_pic}`;
                    setImage(imgUrl);
                }
            } catch (err) {
                console.error(err);
                if (err.response?.status === 401) {
                    // Token expired or invalid
                    // window.location.href = '/login'; // Optional: Redirect
                }
            }
        };
        fetchProfile();
    }, []);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('first_name', user.first_name);
            formData.append('last_name', user.last_name);
            formData.append('email', user.email);

            if (selectedFile) {
                formData.append('profile_pic', selectedFile);
            }

            const res = await api.put('/auth/profile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const data = res.data;
            toast({ title: "Profile updated successfully" });
            if (data.profile_pic) {
                setImage(data.profile_pic);
            }
        } catch (err) {
            console.error("Profile update error:", err);
            toast({
                title: "Update failed",
                description: err.response?.data?.message || "Server error occurred",
                variant: "destructive"
            });
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwords.new_password !== passwords.confirm_password) {
            return toast({ title: "Passwords do not match", variant: "destructive" });
        }

        try {
            const res = await api.put('/auth/password', {
                current_password: passwords.current_password,
                new_password: passwords.new_password
            });

            toast({ title: res.data.message });
            setPasswords({ current_password: '', new_password: '', confirm_password: '' });
        } catch (err) {
            console.error("Password change error:", err);
            toast({
                title: "Update failed",
                description: err.response?.data?.message || "Something went wrong.",
                variant: "destructive"
            });
        }
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setImage(imageUrl);
            setSelectedFile(file);
        }
    };

    const handleImageRemove = () => {
        setImage("https://api.dicebear.com/7.x/avataaars/svg?seed=" + user.first_name);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <UserLayout>
            <Helmet>
                <title>Profile | MaitriConnect</title>
            </Helmet>

            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Profile Details</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Personal Info */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">

                        {/* Profile Image */}
                        <div className="flex items-center gap-6 mb-8">
                            <img
                                src={image}
                                alt="Profile"
                                className="w-24 h-24 rounded-full bg-gray-100 object-cover"
                            />
                            <div className="flex gap-3">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />
                                <Button
                                    className="bg-[#D3043C] hover:bg-[#a0032e] text-white"
                                    onClick={() => fileInputRef.current.click()}
                                >
                                    <Camera className="w-4 h-4 mr-2" />
                                    Upload New Photo
                                </Button>
                                <Button
                                    variant="outline"
                                    className="text-red-500 border-red-100 hover:bg-red-50"
                                    onClick={handleImageRemove}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleProfileUpdate} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">First Name</label>
                                    <input
                                        type="text"
                                        value={user.first_name}
                                        onChange={(e) => setUser({ ...user, first_name: e.target.value })}
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D3043C]/20 focus:border-[#D3043C]"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Last Name</label>
                                    <input
                                        type="text"
                                        value={user.last_name}
                                        onChange={(e) => setUser({ ...user, last_name: e.target.value })}
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D3043C]/20 focus:border-[#D3043C]"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Email Address</label>
                                    <input
                                        type="email"
                                        value={user.email}
                                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D3043C]/20 focus:border-[#D3043C]"
                                    />
                                </div>
                            </div>

                            <Button type="submit" className="bg-[#D3043C] hover:bg-[#a0032e] text-white w-full md:w-auto">
                                <Save className="w-4 h-4 mr-2" />
                                Save Changes
                            </Button>
                        </form>
                    </div>
                </div>

                {/* Right Column: Change Password */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Lock className="w-5 h-5 text-gray-400" />
                            Change Password
                        </h3>

                        <form onSubmit={handlePasswordChange} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Current Password</label>
                                <input
                                    type="password"
                                    value={passwords.current_password}
                                    onChange={(e) => setPasswords({ ...passwords, current_password: e.target.value })}
                                    required
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D3043C]/20 focus:border-[#D3043C]"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">New Password</label>
                                <input
                                    type="password"
                                    value={passwords.new_password}
                                    onChange={(e) => setPasswords({ ...passwords, new_password: e.target.value })}
                                    required
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D3043C]/20 focus:border-[#D3043C]"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Confirm New Password</label>
                                <input
                                    type="password"
                                    value={passwords.confirm_password}
                                    onChange={(e) => setPasswords({ ...passwords, confirm_password: e.target.value })}
                                    required
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D3043C]/20 focus:border-[#D3043C]"
                                />
                            </div>

                            <Button type="submit" className="w-full bg-[#D3043C] hover:bg-[#a0032e] text-white">
                                Update Password
                            </Button>
                        </form>
                    </div>
                </div>

            </div>
        </UserLayout>
    );
};

export default UserProfile;

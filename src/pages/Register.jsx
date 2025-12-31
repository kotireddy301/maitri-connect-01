import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button.jsx';
import { Input } from '../ui/input.jsx';
import api from '../lib/api';
import { useToast } from '../ui/use-toast';
import PageHeader from '../components/PageHeader';
import { Label } from '../ui/label.jsx';

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/auth/register', formData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('role', res.data.user.role); // Update role to prevent stale admin access
            toast({ title: "Account created!", description: "Welcome to MaitriConnect" });
            navigate('/dashboard');
        } catch (err) {
            toast({
                title: "Registration failed",
                description: err.response?.data?.message || "Something went wrong",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>Register | MaitriConnect</title>
            </Helmet>

            <PageHeader title="Register" path="Home / Register" />

            <div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl"
                >
                    <div className="text-center">
                        <h2 className="mt-6 text-3xl font-bold text-gray-900">Create an Account</h2>
                        <p className="mt-2 text-sm text-gray-600">Lets start with MaitriConnect</p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-5">

                            {/* Full Name */}
                            <div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <Input
                                        type="text"
                                        placeholder="Full Name"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="pl-10 py-6 bg-white border-gray-200 focus:border-red-500 focus:ring-red-500 rounded-lg w-full"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <Input
                                        type="email"
                                        placeholder="Email Address"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="pl-10 py-6 bg-white border-gray-200 focus:border-red-500 focus:ring-red-500 rounded-lg w-full"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Password"
                                        required
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="pl-10 pr-10 py-6 bg-white border-gray-200 focus:border-red-500 focus:ring-red-500 rounded-lg w-full"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                        ) : (
                                            <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-6 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#D3043C] hover:bg-[#a0032e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                            {loading ? "Creating Account..." : "Create Account"}
                        </Button>

                        <div className="text-center mt-4">
                            <span className="text-sm text-gray-600">Already have an account? </span>
                            <Link to="/login" className="font-medium text-red-600 hover:text-red-500">
                                Sign In
                            </Link>
                        </div>
                    </form>
                </motion.div>
            </div>
        </>
    );
};

export default Register;

import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, CheckSquare, Square } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button.jsx';
import { Input } from '../ui/input.jsx';
import api from '../lib/api';
import { useToast } from '../ui/use-toast';
import PageHeader from '../components/PageHeader';
import { Label } from '../ui/label.jsx';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/auth/login', formData);
            const { token, user } = res.data;

            if (user.role === 'admin') {
                localStorage.setItem('admin_token', token);
                localStorage.setItem('admin_role', user.role);
                localStorage.setItem('admin_user', JSON.stringify(user));
                toast({ title: "Welcome back, Admin!", description: "Admin login successful" });
                navigate('/admin');
            } else {
                localStorage.setItem('user_token', token);
                localStorage.setItem('user_role', user.role);
                localStorage.setItem('user_user', JSON.stringify(user));
                toast({ title: "Welcome back!", description: "User login successful" });
                navigate('/dashboard');
            }
        } catch (err) {
            toast({
                title: "Login failed",
                description: err.response?.data?.message || "Invalid credentials",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>Login | MaitriConnect</title>
            </Helmet>

            <PageHeader title="Login" path="Home / Login" />

            <div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl"
                >
                    <div className="text-center">
                        <h2 className="mt-6 text-3xl font-bold text-gray-900">Welcome Back</h2>
                        <p className="mt-2 text-sm text-gray-600">Please Enter your Details</p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-5">
                            <div>
                                <Label htmlFor="email">Email address</Label>
                                <div className="relative mt-1">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        className="pl-10"
                                        placeholder="you@example.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="password">Password</Label>
                                <div className="relative mt-1">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        className="pl-10 pr-10"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <button
                                    type="button"
                                    onClick={() => setRememberMe(!rememberMe)}
                                    className="flex items-center text-sm text-gray-600 hover:text-gray-900"
                                >
                                    {rememberMe ? (
                                        <CheckSquare className="h-4 w-4 text-[#D3043C] mr-2" />
                                    ) : (
                                        <Square className="h-4 w-4 text-gray-300 mr-2" />
                                    )}
                                    Remember me
                                </button>
                            </div>

                            <div className="text-sm">
                                <Link to="/forgot-password" className="font-medium text-[#D3043C] hover:text-[#b00332]">
                                    Forgot password?
                                </Link>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-[#D3043C] hover:bg-[#b00332] text-white py-2"
                            disabled={loading}
                        >
                            {loading ? "Signing in..." : "Sign in"}
                        </Button>

                        <div className="text-center text-sm">
                            <span className="text-gray-600">Don't have an account? </span>
                            <Link to="/register" className="font-medium text-[#D3043C] hover:text-[#b00332]">
                                Sign up
                            </Link>
                        </div>
                    </form>
                </motion.div>
            </div>
        </>
    );
};

export default Login;

import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../ui/button.jsx';
import { Input } from '../ui/input.jsx';
import api from '../lib/api';
import { useToast } from '../ui/use-toast';
import PageHeader from '../components/PageHeader';
import { Label } from '../ui/label.jsx';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { token } = useParams();
    const { toast } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast({
                title: "Passwords do not match",
                variant: "destructive"
            });
            return;
        }

        setLoading(true);
        try {
            await api.post('/auth/reset-password', { token, new_password: password });
            toast({
                title: "Password Reset Successful",
                description: "You can now login with your new password."
            });
            navigate('/login');
        } catch (err) {
            toast({
                title: "Reset Failed",
                description: err.response?.data?.message || "Invalid or expired token",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>Reset Password | MaitriConnect</title>
            </Helmet>

            <PageHeader title="Reset Password" path="Home / Reset Password" />

            <div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl"
                >
                    <div className="text-center">
                        <h2 className="mt-6 text-3xl font-bold text-gray-900">Reset Password</h2>
                        <p className="mt-2 text-sm text-gray-600">Enter your new password below.</p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <Label htmlFor="password">New Password</Label>
                            <div className="relative mt-1 mb-4">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="pl-10 pr-10"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
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

                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <div className="relative mt-1">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    required
                                    className="pl-10"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-[#D3043C] hover:bg-[#b00332] text-white py-2"
                            disabled={loading}
                        >
                            {loading ? "Resetting..." : "Reset Password"}
                        </Button>
                    </form>
                </motion.div>
            </div>
        </>
    );
};

export default ResetPassword;

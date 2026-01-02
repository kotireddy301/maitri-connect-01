import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button.jsx';
import { Input } from '../ui/input.jsx';
import api from '../lib/api';
import { useToast } from '../ui/use-toast';
import PageHeader from '../components/PageHeader';
import { Label } from '../ui/label.jsx';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/auth/forgot-password', { email });
            toast({
                title: "Check your email",
                description: "If an account exists, we've sent a password reset link."
            });
        } catch (err) {
            toast({
                title: "Error",
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
                <title>Forgot Password | MaitriConnect</title>
            </Helmet>

            <PageHeader title="Forgot Password" path="Home / Forgot Password" />

            <div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl"
                >
                    <div className="text-center">
                        <h2 className="mt-6 text-3xl font-bold text-gray-900">Forgot Password?</h2>
                        <p className="mt-2 text-sm text-gray-600">Enter your email and we'll send you instructions to reset your password.</p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-[#D3043C] hover:bg-[#b00332] text-white py-2"
                            disabled={loading}
                        >
                            {loading ? "Sending Link..." : "Send Reset Link"}
                        </Button>

                        <div className="text-center">
                            <Link to="/login" className="inline-flex items-center font-medium text-gray-600 hover:text-gray-900">
                                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Login
                            </Link>
                        </div>
                    </form>
                </motion.div>
            </div>
        </>
    );
};

export default ForgotPassword;

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MoreVertical } from 'lucide-react';
import { Link } from 'react-router-dom';

const StatCard = ({ title, count, icon: Icon, color, trend }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-visible"
        >
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-lg ${color}`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-50 transition-colors"
                    >
                        <MoreVertical className="w-5 h-5" />
                    </button>

                    {isOpen && (
                        <div className="absolute right-0 top-8 w-32 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-10 animate-in fade-in zoom-in-95 duration-200">
                            <button className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#D3043C]">
                                View
                            </button>
                            <button className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#D3043C]">
                                Edit
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="relative z-0">
                <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
                <p className="text-2xl font-bold text-gray-900">{count}</p>
                <div className="flex items-center text-sm text-green-500 mt-2">
                    <span className="font-medium">↑</span>
                    <span className="ml-1">Current Month</span>
                </div>
            </div>

            {/* Decorative Sparkline (SVG) */}
            <div className="absolute right-0 bottom-4 w-24 h-12 opacity-50 z-0 pointer-events-none">
                <svg viewBox="0 0 100 50" preserveAspectRatio="none" className="w-full h-full text-blue-500 fill-none stroke-current stroke-2">
                    <path d="M0 40 C 20 40, 30 20, 50 30 C 70 40, 80 10, 100 20" />
                </svg>
            </div>
        </motion.div>
    );
};

export default StatCard;

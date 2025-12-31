import React from 'react';
import { motion } from 'framer-motion';

const PageHeader = ({ title, path }) => {
    return (
        <div className="relative bg-[#1e293b] text-white py-20 overflow-hidden">
            {/* Background decoration - Abstract circles */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-10">
                <div className="absolute -left-10 -top-10 w-64 h-64 rounded-full border-4 border-white/20"></div>
                <div className="absolute -left-4 -top-4 w-48 h-48 rounded-full border-4 border-white/20"></div>
                <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full border-4 border-white/20"></div>
                <div className="absolute -right-4 -bottom-4 w-48 h-48 rounded-full border-4 border-white/20"></div>
            </div>

            <div className="relative z-10 container mx-auto px-4 text-center">
                <motion.h1
                    className="text-4xl md:text-5xl font-bold mb-4"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {title}
                </motion.h1>

                <motion.div
                    className="flex items-center justify-center space-x-2 text-gray-300 text-sm md:text-base"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <span className="hover:text-white transition-colors cursor-default">Home</span>
                    <span>/</span>
                    <span className="text-white font-medium">{path.split('/').pop().trim()}</span>
                </motion.div>
            </div>
        </div>
    );
};

export default PageHeader;

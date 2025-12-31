import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

const AdminLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Sidebar with Mobile State */}
            <AdminSidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            {/* Header with Menu Toggle */}
            <AdminHeader
                onMenuClick={() => setIsSidebarOpen(true)}
            />

            {/* Main Content Area */}
            {/* lg:ml-64 matches the sidebar width on desktop */}
            <main className="lg:ml-64 p-4 md:p-6 transition-all duration-300">
                {children}
            </main>

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </div>
    );
};

export default AdminLayout;

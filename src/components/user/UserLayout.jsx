import React, { useState } from 'react';
import UserSidebar from './UserSidebar';
import UserHeader from './UserHeader';

const UserLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Sidebar with Mobile State */}
            <UserSidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            {/* Header with Menu Toggle */}
            <UserHeader
                onMenuClick={() => setIsSidebarOpen(true)}
            />

            {/* Main Content Area */}
            <main className="lg:ml-64 p-4 md:p-6 fade-in">
                {children}
            </main>
        </div>
    );
};

export default UserLayout;

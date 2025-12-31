import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    // Check if token exists AND role is admin
    if (!token || role !== 'admin') {
        // Redirect to home or login if not authorized
        // Redirect to login if not authorized
        return <Navigate to="/login" replace />;
    }

    // Render child routes if authorized
    return <Outlet />;
};

export default AdminRoute;

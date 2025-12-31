import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
    const token = localStorage.getItem('token');

    // Check if token exists
    if (!token) {
        // Redirect to login if not authenticated
        return <Navigate to="/login" replace />;
    }

    // Render child routes if authorized
    return <Outlet />;
};

export default PrivateRoute;

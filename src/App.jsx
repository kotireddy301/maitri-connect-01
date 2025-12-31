import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Toaster } from "./ui/toaster.jsx";
import Navigation from "./components/Navigation.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";

import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Events from "./pages/Events.jsx";
import EventDetails from "./pages/EventDetails.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Vendors from "./pages/Vendors.jsx";
import AddEvent from "./pages/AddEvent.jsx";
import EditEvent from "./pages/EditEvent.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminListings from "./pages/AdminListings.jsx";
import AdminProfile from "./pages/AdminProfile.jsx";

import AdminRoute from "./components/admin/AdminRoute.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";

// User Pages
import UserDashboard from "./pages/user/UserDashboard.jsx";
import UserProfile from "./pages/user/UserProfile.jsx";
import UserListings from "./pages/user/UserListings.jsx";

export default function App() {
  return (
    <Router>
      <Navigation />

      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/vendors" element={<Vendors />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Protected User Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/add-event" element={<AddEvent />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/my-listing" element={<UserListings />} />
            <Route path="/edit-event/:id" element={<EditEvent />} />
          </Route>

          {/* Protected Admin Routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/listings" element={<AdminListings />} />
            <Route path="/admin/profile" element={<AdminProfile />} />
          </Route>
        </Routes>
      </ErrorBoundary>

      <Toaster />
    </Router>
  );
}

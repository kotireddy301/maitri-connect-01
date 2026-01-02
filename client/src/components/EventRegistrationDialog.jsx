import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, User, Mail, Phone, Loader2 } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog.jsx';                 // ✅ FIXED

import { Button } from '../ui/button.jsx';  // ✅ FIXED
import { Input } from '../ui/input.jsx';    // ✅ FIXED
import { Label } from '../ui/label.jsx';    // ✅ FIXED
import { useToast } from '../ui/use-toast.js'; // ✅ FIXED

import { sendConfirmationEmail } from '../lib/emailService.js';

const EventRegistrationDialog = ({ event, isOpen, onClose }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // If event has external registration link, open in new tab
    if (event?.details?.registrationLink) {
      window.open(event.details.registrationLink, '_blank');
      onClose();
      return;
    }

    setIsSubmitting(true);

    const registration = {
      event: event,
      attendee: formData,
      registeredAt: new Date().toISOString()
    };

    const existingRegistrations =
      JSON.parse(localStorage.getItem('maitriconnect_event_registrations') || '[]');

    existingRegistrations.push(registration);
    localStorage.setItem(
      'maitriconnect_event_registrations',
      JSON.stringify(existingRegistrations)
    );

    // Send Confirmation Email
    sendConfirmationEmail('event_registration', { event, ...formData })
      .then(() => {
        toast({
          title: "Registration Successful! 🎉",
          description: `You're registered for ${event.title}. A confirmation email has been sent.`,
        });
        setFormData({ name: '', email: '', phone: '' });
        onClose();
      })
      .catch(() => {
        toast({
          title: "Registration Successful",
          description: `You're registered for ${event.title}, but the confirmation email could not be sent.`,
          variant: "warning"
        });
        onClose();
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  if (!event) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Register for Event
          </DialogTitle>
          <DialogDescription>
            Fill out the form below to register for this event.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Event Summary */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-4 space-y-2">
            <h3 className="font-bold text-gray-900">{event.title}</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-600" />
                <span>{formatDate(event.date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-600" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-purple-600" />
                <span>{event.location}</span>
              </div>
            </div>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="w-4 h-4 text-purple-600" />
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                disabled={isSubmitting}
                className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-purple-600" />
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="john.doe@example.com"
                disabled={isSubmitting}
                className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-purple-600" />
                Phone Number
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="(555) 123-4567"
                disabled={isSubmitting}
                className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Registering...
                  </>
                ) : (
                  'Register'
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventRegistrationDialog;

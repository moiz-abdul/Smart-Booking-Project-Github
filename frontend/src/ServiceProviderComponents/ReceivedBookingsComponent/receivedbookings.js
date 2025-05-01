import React, { useState, useEffect } from 'react';
import { Button, Badge, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";
import './receivedbookings.css';
import axios from "axios";

// Set up axios interceptor
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem("userToken");
      localStorage.removeItem("userData");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

const ServiceProviderBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([
    {
      id: 1,
      customerName: "John Doe",
      customerContact: "john@example.com",
      serviceTitle: "Dental Checkup",
      serviceCategory: "Medical Appointment",
      bookingDate: "2025-05-15",
      bookingTimeSlot: "10:00 AM - 11:00 AM",
      bookingCreatedAt: "2025-05-10 14:30",
      status: "pending"
    },
    {
      id: 2,
      customerName: "Jane Smith",
      customerContact: "555-123-4567",
      serviceTitle: "Yoga Class",
      serviceCategory: "Fitness Class",
      bookingDate: "2025-05-16",
      bookingTimeSlot: "5:00 PM - 6:00 PM",
      bookingCreatedAt: "2025-05-11 09:15",
      status: "pending"
    },
    {
      id: 3,
      customerName: "Mike Johnson",
      customerContact: "mike@example.com",
      serviceTitle: "Electrical Repair",
      serviceCategory: "Home Repair & Maintenance",
      bookingDate: "2025-05-17",
      bookingTimeSlot: "2:00 PM - 4:00 PM",
      bookingCreatedAt: "2025-05-12 16:45",
      status: "accepted"
    }
  ]);

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    const userData = localStorage.getItem("userData");
    
    if (!token || !userData) {
      navigate("/login");
      return;
    }
    
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    // In a real app, you would fetch bookings here
    // axios.get('/api/provider/bookings').then(response => setBookings(response.data));
  }, [navigate]);

  const handleAccept = (bookingId) => {
    // In a real app, you would call API to accept booking
    const updatedBookings = bookings.map(booking => 
      booking.id === bookingId 
        ? { ...booking, status: "accepted" }
        : booking
    );
    setBookings(updatedBookings);
  };

  const handleDecline = (bookingId) => {
    // In a real app, you would call API to decline booking
    const updatedBookings = bookings.filter(booking => booking.id !== bookingId);
    setBookings(updatedBookings);
  };

  const getBadgeColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'accepted': return 'success';
      case 'completed': return 'primary';
      case 'cancelled': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <div className="container mt-4">
      <div className="text-center mb-4">
        <h1>Received Bookings</h1>
        <p className="text-muted">Manage customer service requests</p>
      </div>

      <div className="booking-list">
        {bookings.map((booking) => (
          <div key={booking.id} className="card mb-3">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h5 className="card-title">{booking.serviceTitle}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">{booking.serviceCategory}</h6>
                </div>
                <Badge pill bg={getBadgeColor(booking.status)}>
                  {booking.status.toUpperCase()}
                </Badge>
              </div>
              
              <div className="row mt-3">
                <div className="col-md-6">
                  <p><strong>Customer:</strong> {booking.customerName}</p>
                  <p><strong>Contact:</strong> {booking.customerContact}</p>
                  <p><strong>Booked On:</strong> {booking.bookingCreatedAt}</p>
                </div>
                <div className="col-md-6">
                  <p><strong>Service Date:</strong> {booking.bookingDate}</p>
                  <p><strong>Time Slot:</strong> {booking.bookingTimeSlot}</p>
                </div>
              </div>

              {booking.status === 'pending' && (
                <div className="d-flex justify-content-end mt-3">
                  <Button 
                    variant="success" 
                    size="sm" 
                    className="me-2"
                    onClick={() => handleAccept(booking.id)}
                  >
                    Accept
                  </Button>
                  <Button 
                    variant="danger" 
                    size="sm"
                    onClick={() => handleDecline(booking.id)}
                  >
                    Decline
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceProviderBookings;
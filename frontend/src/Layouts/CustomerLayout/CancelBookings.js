import React, { useState, useEffect } from 'react';
import './CancelBookings.css';
import { useNavigate } from "react-router-dom";
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

const CancelBookingCustomerDashboard = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    const userData = localStorage.getItem("userData");
    
    if (!token || !userData) {
      navigate("/login");
      return;
    }
    
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    try {
      const parsedUserData = JSON.parse(userData);
      const userId = parsedUserData.id;
      
      if (userId) {
        fetchBookings(userId);
      } else {
        throw new Error("User ID not found in user data");
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to load user data. Please login again.');
      setLoading(false);
    }
  }, [navigate]);

  const fetchBookings = async (userId) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`http://localhost:5000/api/customerbookingdetails/cancel`, {
        params: { 
          user_id: userId,
          status: 'cancel'
        }
      });

      if (response.data?.success) {
        setBookings(response.data.data);
      } else {
        throw new Error(response.data?.message || 'Invalid response format');
      }
    } catch (err) {
      console.error('API Error:', {
        message: err.message,
        response: err.response?.data,
        config: err.config
      });
      
      let errorMsg = 'Failed to load bookings';
      if (err.response) {
        errorMsg = err.response.data?.message || `Server error: ${err.response.status}`;
      } else if (err.request) {
        errorMsg = 'No response from server';
      } else {
        errorMsg = err.message;
      }
      
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const renderBookingItem = (booking) => (
    <li key={booking.id} className="booking-item">
      <div className="booking-header">
        <span className="booking-service">
          <strong>Service Name: {booking.service_name}</strong> <br></br>
          <strong><div>Service Category: ({booking.service_category})</div></strong>
        </span>
      </div>

      <div className="booking-details">
        <div className="booking-row">
          <strong><span className="booking-label">Customer Name: </span></strong>
          <span className="booking-value">{booking.customer_name}</span>
        </div>
        <div className="booking-row">
          <strong><span className="booking-label">Email: </span> </strong>
          <span className="booking-value">{booking.customer_email}</span>
        </div>
        <div className="booking-row">
          <strong><span className="booking-label">Phone: </span></strong>
          <span className="booking-value">{booking.customer_phone}</span>
        </div>
        <div className="booking-row">
          <strong><span className="booking-label">Duration: </span></strong>
          <span className="booking-value">{booking.duration_minutes} minutes</span>
        </div>
        <div className="booking-row">
          <strong><span className="booking-label">Day: </span></strong>
          <span className="booking-value">{booking.selected_available_day}</span>
        </div>
        <div className="booking-row">
          <strong><span className="booking-label">Time Slot: </span></strong>
          <span className="booking-value">{booking.selected_available_time_slot}</span>
        </div>
        <div className="booking-row">
          <strong><span className="booking-label">Status: </span></strong>
          <span className={`booking-value status-${booking.is_status.toLowerCase()}`}>
            {booking.is_status}
          </span>
        </div>
      </div>
    </li>
  );

  if (loading) {
    return <div className="dashboard-loading">Loading your bookings...</div>;
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="customer-dashboard">
      <h2>Your Cancel Bookings</h2>
      <div className="bookings-container">
        {bookings.length > 0 ? (
          <ul className="booking-list">
            {bookings.map(renderBookingItem)}
          </ul>
        ) : (
          <p className="no-bookings">No Cancel bookings found.</p>
        )}
      </div>
    </div>
  );
};

export default CancelBookingCustomerDashboard;
import React, { useState, useEffect } from 'react';
import './Dashboard.css';
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

const CusDashboard = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reminders, setReminders] = useState([]);
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


  useEffect(() => {
    const token = localStorage.getItem("userToken");
    const userData = localStorage.getItem("userData");

    if (!token || !userData) {
      navigate("/login");
      return;
    }

    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const parsedUserData = JSON.parse(userData);

    if (parsedUserData.id) {
      fetchReminders(parsedUserData.id); // New
      fetchBookings(parsedUserData.id);  // Existing
    }
  }, []);

  const fetchReminders = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/customerbookingdetails/reminders`, {
        params: { user_id: userId }
      });

      if (response.data?.success) {
        setReminders(response.data.data);
      }
    } catch (err) {
      console.error('Error while fetching reminders:', err);
    }
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [hour, minute] = timeStr.split(':');
    let h = +hour;
    const suffix = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${minute} ${suffix}`;
  };



  const fetchBookings = async (userId) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`http://localhost:5000/api/customerbookingdetails/pending`, {
        params: { 
          user_id: userId,
          status: 'pending'
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

{reminders.length > 0 && (
        <div className="reminders-section">
          <h3>Reminders</h3>
          <ul className="reminder-list">
            {reminders.map((reminder, index) => (
              <li key={index} className="reminder-item alert alert-info">
                <strong>
                  You have a Reminder of Booking service <em>{reminder.service_title}</em> of your selected timeslot {formatTime(reminder.start_time)} - {formatTime(reminder.end_time)}.
                </strong>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <h2>Your Pending Bookings</h2>
      <div className="bookings-container">
        {bookings.length > 0 ? (
          <ul className="booking-list">
            {bookings.map(renderBookingItem)}
          </ul>
        ) : (
          <p className="no-bookings">No pending bookings found.</p>
        )}
      </div>


    </div>
  );
};

export default CusDashboard;
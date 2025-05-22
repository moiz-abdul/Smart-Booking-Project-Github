import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {  FiCalendar, FiClock, FiUser, FiMail, FiPhone, FiWatch, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

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
        fetchReminders(userId);
      } else {
        throw new Error("User ID not found in user data");
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to load user data. Please login again.');
      setLoading(false);
    }
  }, [navigate]);

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

    h = h % 12 || 12;
    return `${h}:${minute} `;
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
    <div key={booking.id} className="booking-card">
      <div className="booking-card-header">
        <div className="service-info">
          <h3>{booking.service_name}</h3>
          <span className="service-category">{booking.service_category}</span>
        </div>
        <div className={`status-badge ${booking.is_status.toLowerCase()}`}>
          {booking.is_status === 'confirmed' ? <FiCheckCircle /> : <FiAlertCircle />}
          {booking.is_status}
        </div>
      </div>

      <div className="booking-details-grid">
        <div className="detail-item">
          <FiUser className="detail-icon" />
          <div>
            <label>Customer</label>
            <p>{booking.customer_name}</p>
          </div>
        </div>
        
        <div className="detail-item">
          <FiMail className="detail-icon" />
          <div>
            <label>Email</label>
            <p>{booking.customer_email}</p>
          </div>
        </div>
        
        <div className="detail-item">
          <FiPhone className="detail-icon" />
          <div>
            <label>Phone</label>
            <p>{booking.customer_phone}</p>
          </div>
        </div>
        
        <div className="detail-item">
          <FiWatch className="detail-icon" />
          <div>
            <label>Duration</label>
            <p>{booking.duration_minutes} minutes</p>
          </div>
        </div>
        
        <div className="detail-item">
          <FiCalendar className="detail-icon" />
          <div>
            <label>Day</label>
            <p>{booking.selected_available_day}</p>
          </div>
        </div>
        
        <div className="detail-item">
          <FiClock className="detail-icon" />
          <div>
            <label>Time Slot</label>
            <p>{formatTime(booking.start_time)} - {formatTime(booking.end_time)}</p>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <h3>Something went wrong</h3>
          <p>{error}</p>
          <button className="retry-button" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  
  return (
    <div className="modern-dashboard">
      

      <div className="dashboard-content">
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

        <section className="bookings-section">
          <div className="section-header">
            <div className="customer-dashboard h2" />
            <h2>Your Pending Bookings</h2>
          </div>
          
          {bookings.length > 0 ? (
            <div className="bookings-grid">
              {bookings.map(renderBookingItem)}
            </div>
          ) : (
            <div className="empty-state">
              <h3>No pending bookings</h3>
              <p>You don't have any pending bookings at the moment</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default CusDashboard;
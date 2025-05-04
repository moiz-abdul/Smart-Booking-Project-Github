import React, { useState, useEffect } from 'react';
import './providercompletedbookings.css';
import { useNavigate } from "react-router-dom";
import axios from "axios";

axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem("userToken");
      localStorage.removeItem("userData");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

const ProviderCompletedBookings = () => {
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
        fetchCompletedBookings(userId);
      }
    } catch (err) {
      setError('Failed to load user data');
      setLoading(false);
    }
  }, [navigate]);

  const fetchCompletedBookings = async (userId) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`http://localhost:5000/api/providerbookingdetails/completed`, {
        params: { user_id: userId }
      });

      if (response.data?.success) {
        setBookings(response.data.data);
      } else {
        throw new Error(response.data?.message || 'Failed to load bookings');
      }
    } catch (err) {
      console.error('API Error:', {
        message: err.message,
        response: err.response?.data,
        config: err.config
      });
      setError(err.response?.data?.message || err.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const time = new Date(`2000-01-01T${timeString}`);
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) return <div className="dashboard-loading">Loading Completed bookings...</div>;
  if (error) return (
    <div className="dashboard-error">
      <p>{error}</p>
      <button onClick={() => window.location.reload()}>Try Again</button>
    </div>
  );

  return (
    <div className="customer-dashboard">
      <h2>Completed Bookings</h2>
      <div className="bookings-container">
        {bookings.length > 0 ? (
          <ul className="booking-list">
            {bookings.map(booking => (
              <li key={booking.id} className="booking-item">
                <div className="booking-header">
                  <span className="booking-service">
                    <strong>{booking.service_name}</strong> ({booking.service_category})
                  </span>
                </div>

                <div className="booking-details">
                  <div className="booking-row">
                    <span className="booking-label">Customer:</span>
                    <span className="booking-value">{booking.customer_name}</span>
                  </div>
                  <div className="booking-row">
                    <span className="booking-label">Email:</span>
                    <span className="booking-value">{booking.customer_email}</span>
                  </div>
                  <div className="booking-row">
                    <span className="booking-label">Phone:</span>
                    <span className="booking-value">{booking.customer_phone}</span>
                  </div>
                  <div className="booking-row">
                    <span className="booking-label">Date:</span>
                    <span className="booking-value">
                      {booking.selected_available_day}
                    </span>
                  </div>
                  <div className="booking-row">
                    <span className="booking-label">Time:</span>
                    <span className="booking-value">
                      {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                    </span>
                  </div>
                  <div className="booking-row">
                    <span className="booking-label">Status:</span>
                    <span className="booking-value status-completed">
                      {booking.is_status}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-bookings">No Completed bookings found</p>
        )}
      </div>
    </div>
  );
};

export default ProviderCompletedBookings;
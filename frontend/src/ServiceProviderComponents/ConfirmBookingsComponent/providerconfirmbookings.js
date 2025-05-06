import React, { useState, useEffect } from 'react';
import './providerconfirmbookings.css';
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

const ProviderConfirmedBookings  = () => {
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
        fetchConfirmedBookings(userId);
      }
    } catch (err) {
      setError('Failed to load user data');
      setLoading(false);
    }
  }, [navigate]);

  const fetchConfirmedBookings = async (userId) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`http://localhost:5000/api/providerbookingdetails/confirm`, {
        params: { user_id: userId }
      });

      if (response.data?.success) {
        setBookings(response.data.data);
      } else {
        throw new Error(response.data?.message || 'Failed to load bookings');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/providerbookingdetails/${bookingId}/status`, {
        status: newStatus
      });
      setBookings(prev => prev.filter(b => b.id !== bookingId));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const time = new Date(`2000-01-01T${timeString}`);
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) return <div className="dashboard-loading">Loading Confirmed bookings...</div>;
  if (error) return (
    <div className="dashboard-error">
      <p>{error}</p>
      <button onClick={() => window.location.reload()}>Try Again</button>
    </div>
  );

  return (
    <div className="Provider-confirmedbooking-dashboard-container">
      <h2>Confirmed Bookings</h2>
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
                    <span className="booking-label">Day:</span>
                    <span className="booking-value">{booking.selected_available_day}</span>
                  </div>
                  <div className="booking-row">
                    <span className="booking-label">Time:</span>
                    <span className="booking-value">
                      {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                    </span>
                  </div>
                  <div className="booking-row">
                    <span className="booking-label">Payment:</span>
                    <span className="booking-value">{booking.payment_type}</span>
                  </div>
                </div>

                <div className="booking-actions">
                  <button 
                    className="complete-btn"
                    onClick={() => handleStatusUpdate(booking.id, 'completed')}
                  >
                    Completed
                  </button>

                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-bookings">No Confirmed bookings found</p>
        )}
      </div>
    </div>
  );
};

export default ProviderConfirmedBookings;
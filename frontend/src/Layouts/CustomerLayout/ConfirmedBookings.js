import React, { useState, useEffect } from 'react';
import './ConfirmedBookings.css';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UpdateBookingModal from './ModifyBookingModal';

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

const ConfirmBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [serviceDetails, setServiceDetails] = useState(null);

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

  // Format HH:MM:SS ➤ 12-hour time format with AM/PM (e.g. 19:00:00 ➤ 7:00 PM)
const formatTimeToAMPM = (timeStr) => {
  if (!timeStr) return '';
  const [hour, minute] = timeStr.split(':');
  const date = new Date();
  date.setHours(parseInt(hour));
  date.setMinutes(parseInt(minute));
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
};

  const fetchConfirmedBookings = async (userId) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`http://localhost:5000/api/customerbookingdetails/confirm`, {
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

  const handleCancelBooking = async (bookingId) => {
    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      await axios.put(
        `http://localhost:5000/api/customerbookingdetails/${bookingId}/cancel`,
        null, // No body needed
        { params: { user_id: userData.id } } // Pass user_id as query param
      );
      fetchConfirmedBookings(userData.id);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const handleModifyBooking = async (booking) => {
    try {
      if (!booking?.service_id) {
        throw new Error('Service information missing');
      }
      
      const response = await axios.get(
        `http://localhost:5000/api/bookform/updateform/bookingdetails/${booking.service_id}`
      );
      
      if (response.data.success) {
        console.log('Service Details Received:', response.data.data); // Add this line for debugging
        setServiceDetails(response.data.data);
        setSelectedBooking(booking);
        setShowUpdateModal(true);
      } else {
        throw new Error(response.data.message || 'Failed to load service details');
      }
    } catch (err) {
      alert(err.message || 'Failed to fetch service details for modification');
      console.error('Modify Error:', err);
    }
  };
  
  const handleUpdateBooking = async (updatedData) => {
    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      await axios.put(
        `http://localhost:5000/api/customerbookingdetails/${selectedBooking.id}/update`,
        {
          selected_available_day: updatedData.day,
          selected_available_time_slot: updatedData.timeSlot
        },
        { params: { user_id: userData.id } }
      );
      setShowUpdateModal(false);
      fetchConfirmedBookings(userData.id);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update booking');
    }
  };

  if (loading) return <div className="dashboard-loading">Loading confirmed bookings...</div>;
  if (error) return (
    <div className="dashboard-error">
      <p>{error}</p>
      <button onClick={() => window.location.reload()}>Try Again</button>
    </div>
  );

  return (
    <div className="customer-dashboard">
      <h2>Your Confirmed Bookings</h2>
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
                    <span className="booking-label">Day:</span>
                    <span className="booking-value">{booking.selected_available_day}</span>
                  </div>
                  <div className="booking-row">
  <span className="booking-label">Time:</span>
  <span className="booking-value">{formatTimeToAMPM(booking.selected_available_time_slot)}</span>
</div>
                  <div className="booking-row">
                    <span className="booking-label">Duration:</span>
                    <span className="booking-value">{booking.duration_minutes} minutes</span>
                  </div>
                  <div className="booking-row">
                    <span className="booking-label">Provider:</span>
                    <span className="booking-value">{booking.provider_name}</span>
                  </div>
                  <div className="booking-row">
                    <span className="booking-label">Payment Type:</span>
                    <span className="booking-value">{booking.payment_type}</span>
                  </div>
                </div>

                <div className="booking-actions">
                  <button 
                    className="modify-btn"
                    onClick={() => handleModifyBooking(booking)}
                  >
                    Modify
                  </button>
                  <button 
                    className="cancel-btn"
                    onClick={() => handleCancelBooking(booking.id)}
                  >
                    Cancel
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-bookings">No confirmed bookings found</p>
        )}
      </div>

      {showUpdateModal && selectedBooking && serviceDetails && (
        <UpdateBookingModal
          show={showUpdateModal}
          onClose={() => setShowUpdateModal(false)}
          onSubmit={handleUpdateBooking}
          booking={selectedBooking}
          service={serviceDetails}
        />
      )}
    </div>
  );
};

export default ConfirmBookings;
import React, { useState, useEffect } from 'react';
import './CompletedBookings.css';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AddReviewModal from './customer-reviews-modal';

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

const CompletedBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

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
      
      const response = await axios.get(`http://localhost:5000/api/customerbookingdetails/completed`, {
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

  const handleAddReview = (booking) => {
    setSelectedBooking(booking);
    setShowReviewModal(true);
  };

  const handleReviewSubmit = async (reviewData) => {
    try {
      await axios.post('http://localhost:5000/api/customerreviews', {
        ...reviewData,
        service_id: selectedBooking.service_id,
        booking_id: selectedBooking.id,
        user_id: selectedBooking.user_id
      });
      setShowReviewModal(false);
      fetchConfirmedBookings(selectedBooking.user_id);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit review');
    }
  };

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading completed bookings...</p>
    </div>
  );

  if (error) return (
    <div className="error-container">
      <p>{error}</p>
      <button className="retry-btn" onClick={() => window.location.reload()}>Try Again</button>
    </div>
  );

  return (
    <div className="completed-bookings-container">
      <h1 className="page-title">Your Completed Bookings</h1>
      <div className="bookings-grid">
        {bookings.length > 0 ? (
          bookings.map(booking => (
            <div key={booking.id} className="booking-card">
              <div className="booking-header">
                <h2 className="service-name">{booking.service_name}</h2>
                <span className="service-category">{booking.service_category}</span>
              </div>

              <div className="booking-details-grid">
                <div className="detail-item">
                  <span className="label">Day:</span>
                  <span className="value">{booking.selected_available_day}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Time:</span>
                  <span className="value">{booking.selected_available_time_slot}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Duration:</span>
                  <span className="value">{booking.duration_minutes} minutes</span>
                </div>
                <div className="detail-item">
                  <span className="label">Provider:</span>
                  <span className="value">{booking.provider_name}</span>
                </div>
              </div>

              <div className="booking-actions">
                <button 
                  className="add-review-btn"
                  onClick={() => handleAddReview(booking)}
                >
                  Add Review
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-bookings">No completed bookings found</p>
        )}
      </div>

      {showReviewModal && selectedBooking && (
        <AddReviewModal
          show={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          onSubmit={handleReviewSubmit}
          booking={selectedBooking}
        />
      )}
    </div>
  );
};

export default CompletedBookings;
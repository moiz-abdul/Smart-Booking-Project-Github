import React, { useState, useEffect } from 'react';
import './providercompletedbookings.css';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProviderReviewModal from '../ProviderReviewsModal/providerreviewsmodal';

const ProviderCompletedBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);

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
      console.error('API Error:', err);
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

  const openReviewModal = (booking) => {
    setSelectedBooking(booking);
    setShowReviewModal(true);
  };

  const handleSubmitReview = async (reviewData) => {
    try {
      await axios.post('http://localhost:5000/api/providerreviews', reviewData);
      alert("Review submitted!");
      setShowReviewModal(false);
      setSelectedBooking(null);
    } catch (err) {
      alert("Failed to submit review");
    }
  };

  if (loading) return <div className="dashboard-loading">Loading Completed bookings...</div>;
  if (error) return (
    <div className="dashboard-error">
      <p>{error}</p>
      <button onClick={() => window.location.reload()}>Try Again</button>
    </div>
  );

  return (
    <div className="Provider-completedbooking-dashboard-container">
      <h2>Completed Bookings</h2>
      <div className="bookings-container">
        {bookings.length > 0 ? (
          <ul className="booking-list">
            {bookings.map(booking => (
              <li key={booking.id} className="booking-item">
                <div className="booking-header">
                  <span className="booking-service">
                    <strong>Service Name: {booking.service_name}<br></br>
                    </strong>Service Category: ({booking.service_category})
                  </span>
                </div>

                <div className="booking-details">
                  <div className="booking-row">
                    <span className="booking-label">Customer Name:</span>
                    <span className="booking-value">{booking.customer_name}</span>
                  </div>
                  <div className="booking-row">
                    <span className="booking-label">Day:</span>
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

{/*
                <div className="booking-actions">
                  <button 
                    className="add-review-btn"
                    onClick={() => openReviewModal(booking)}
                  >
                    Add Review
                  </button>
                </div>
* */}

              <div className="booking-actions">
                {booking.has_provider_review === 0 ? (
                  <button 
                    className="add-review-btn"
                    onClick={() => openReviewModal(booking)}
                  >
                    Add Review
                  </button>
                ) : (
                  <div className="submitted-review">
                    <h5>Your Review</h5>
                    <div className="review-row">
                      <strong>Review:</strong> {booking.provider_review_text}
                    </div>
                  </div>
                )}
              </div>

              </li>
            ))}
          </ul>
        ) : (
          <p className="no-bookings">No Completed bookings found</p>
        )}
      </div>

      {showReviewModal && selectedBooking && (
        <ProviderReviewModal
          show={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          onSubmit={handleSubmitReview}
          booking={selectedBooking}
        />
      )}
    </div>
  );
};

export default ProviderCompletedBookings;
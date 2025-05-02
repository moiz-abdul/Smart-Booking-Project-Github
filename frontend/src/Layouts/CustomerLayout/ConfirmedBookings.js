import React, { useState, useEffect } from 'react';
import './ConfirmedBookings.css';
import { useNavigate } from 'react-router-dom';

import ModifyBookingModal from './ModifyBookingModal'; // Import the new component

const ConfirmedBookings = () => {
  const [confirmedBookings, setConfirmedBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState(null);

  // New states for modify functionality
  const [showModifyModal, setShowModifyModal] = useState(false);
  const [bookingToModify, setBookingToModify] = useState(null);
  const navigate = useNavigate();
  // New state for status change notification
  const [showStatusNotification, setShowStatusNotification] = useState(false);
  const [modifiedBooking, setModifiedBooking] = useState(null);

  // Mock current logged-in user_id
  const currentUserId = 'user123';

  useEffect(() => {
    // Mock data including user_id and all requested fields
    const mockBookings = [
      {
        id: 1,
        user_id: 'user123',
        service_name: 'House Cleaning',
        service_category: 'Cleaning',
        selected_available_day: '2025-05-02',
        selected_available_time_slot: '10:00 AM - 12:00 PM',
        special_instructions: 'Use eco-friendly products',
        confirmed: true,
        status: 'confirmed'
      },
      {
        id: 2,
        user_id: 'user123',
        service_name: 'Gardening',
        service_category: 'Outdoor',
        selected_available_day: '2025-05-10',
        selected_available_time_slot: '02:00 PM - 04:00 PM',
        special_instructions: '',
        confirmed: true,
        status: 'confirmed'
      },
      {
        id: 3,
        user_id: 'user456', // Different user, will be filtered out
        service_name: 'Window Cleaning',
        service_category: 'Cleaning',
        selected_available_day: '2025-05-15',
        selected_available_time_slot: '09:30 AM - 11:30 AM',
        special_instructions: 'Focus on living room windows',
        confirmed: true,
        status: 'confirmed'
      }
    ];

    // Simulate API delay
    setTimeout(() => {
      // Filter bookings for current user and confirmed only
      const filtered = mockBookings.filter(
        booking => booking.user_id === currentUserId && booking.status === 'confirmed'
      );
      setConfirmedBookings(filtered);
      setIsLoading(false);
    }, 3000);
  }, [currentUserId]);

  const handleDeleteClick = (id) => {
    setBookingToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (bookingToDelete) {
      // Remove the booking from state
      const updatedBookings = confirmedBookings.filter(booking => booking.id !== bookingToDelete);
      setConfirmedBookings(updatedBookings);
    }
    // Close the confirmation popup
    setShowDeleteConfirm(false);
    setBookingToDelete(null);
  };

  const cancelDelete = () => {
    // Close the confirmation popup without deleting
    setShowDeleteConfirm(false);
    setBookingToDelete(null);
  };

  // New handlers for modify functionality
  const handleModifyClick = (booking) => {
    setBookingToModify(booking);
    setShowModifyModal(true);
  };

  const handleModifySave = (updatedBooking) => {
    // Update the booking to pending status
    const modifiedBooking = {
      ...updatedBooking,
      status: 'pending',
      confirmed: false
    };

    // Remove from confirmed bookings (as it's now pending)
    const updatedBookings = confirmedBookings.filter(
      booking => booking.id !== modifiedBooking.id
    );

    setConfirmedBookings(updatedBookings);
    setModifiedBooking(modifiedBooking);

    // Close the modify modal
    setShowModifyModal(false);
    setBookingToModify(null);

    // Show the status notification
    setShowStatusNotification(true);

    // Here you would typically make an API call to update the booking
    console.log('Booking modified and status changed to pending:', modifiedBooking);

    // Auto-close the notification after 5 seconds
    setTimeout(() => {
      setShowStatusNotification(false);
    }, 8000);
  };

  // Handler to close the status notification
  const closeStatusNotification = () => {
    setShowStatusNotification(false);
    setModifiedBooking(null);
  };

  if (isLoading) {
    return <div className="loading">Loading your bookings...</div>;
  }

  return (
    <div className="confirmed-bookings">
      <h2>Your Confirmed Bookings</h2>

      {confirmedBookings.length === 0 ? (
        <div className="no-bookings">
          <p>You don't have any confirmed bookings at the moment.</p>
        </div>
      ) : (
        <div className="bookings-list">
          {confirmedBookings.map(booking => (
            <div key={booking.id} className="booking-card">
              <div className="booking-header">
                <h3>{booking.service_name} ({booking.service_category})</h3>
                <span className="booking-status confirmed">Confirmed</span>
              </div>

              <div className="booking-details">
                <div className="detail-item">
                  <span className="label">Date:</span>
                  <span className="value">{booking.selected_available_day}</span>
                </div>

                <div className="detail-item">
                  <span className="label">Time:</span>
                  <span className="value">{booking.selected_available_time_slot}</span>
                </div>

                <div className="detail-item">
                  <span className="label">Instructions:</span>
                  <span className="value">{booking.special_instructions || 'No special instructions'}</span>
                </div>
              </div>

              <div className="booking-actions">
                <button
                  className="modify-btn"
                  onClick={() => handleModifyClick(booking)}
                >
                  Modify
                </button>

                <button
                  className="cancel"
                  onClick={() => handleDeleteClick(booking.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Popup */}
      {showDeleteConfirm && (
        <div className="delete-confirmation-overlay">
          <div className="delete-confirmation-modal">
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete this booking?</p>
            <div className="confirmation-actions">
              <button className="cancel-btn" onClick={cancelDelete}>Cancel</button>
              <button className="confirm-btn" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Modify Booking Modal */}
      <ModifyBookingModal
        show={showModifyModal}
        onClose={() => setShowModifyModal(false)}
        booking={bookingToModify}
        onSave={handleModifySave}
      />

      {/* Status Change Notification */}
      {showStatusNotification && modifiedBooking && (
        <div className="status-notification-overlay">
          <div className="status-notification-modal">
            <button className="close-notification-btn" onClick={closeStatusNotification}>×</button>
            <div className="notification-content">
              <h3>Booking Status Changed</h3>
              <p>
                Your booking for <strong>{modifiedBooking.service_name}</strong> has been modified.
              </p>
              <p>
                The booking status has changed to <span className="status-pending">PENDING</span> and has been moved to the Bookings page.
              </p>
              <p className="notification-instruction">
                Please check the Bookings page to track your modified booking.
              </p>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfirmedBookings;
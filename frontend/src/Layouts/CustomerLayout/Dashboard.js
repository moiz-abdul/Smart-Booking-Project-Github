import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const CusDashboard = () => {
  const [recentBookings, setRecentBookings] = useState([]);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [stats, setStats] = useState({
    totalBookings: 0,
    completedBookings: 0,
    pendingPayments: 0
  });

  // Track which booking's user_id is visible (store booking IDs)
  const [visibleUserIds, setVisibleUserIds] = useState(new Set());

  useEffect(() => {
    // Mock data including user_id


    const mockUpcomingBookings = [

      {
        id: 4,
        user_id: 'user123',
        service_name: 'Plumbing Service',
        service_category: 'Maintenance',
        selected_available_day: '2025-05-05',
        selected_available_time_slot: '01:00 PM - 03:00 PM',
        special_instructions: 'Check kitchen sink',
        pending: true
      }
    ];

    const mockStats = {
      totalBookings: 8,
      completedBookings: 5,
      pendingPayments: 2
    };


    setUpcomingBookings(mockUpcomingBookings);
    setStats(mockStats);
  }, []);

  // Toggle visibility of user_id for a booking
  const toggleUserIdVisibility = (bookingId) => {
    setVisibleUserIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(bookingId)) {
        newSet.delete(bookingId);
      } else {
        newSet.add(bookingId);
      }
      return newSet;
    });
  };

  // Eye icon SVG components for show/hide


  // Render booking card
  const renderBookingItem = (booking) => {
    const isUserIdVisible = visibleUserIds.has(booking.id);

    return (
      <li key={booking.id} className="booking-item">
        <div className="booking-header">
          <span className="booking-service">
            <strong>{booking.service_name}</strong> ({booking.service_category})
          </span>
          <button
            className="toggle-userid-btn"
            onClick={() => toggleUserIdVisibility(booking.id)}
            aria-label={isUserIdVisible ? 'Hide user ID' : 'Show user ID'}
            title={isUserIdVisible ? 'Hide user ID' : 'Show user ID'}
          >

          </button>
        </div>

        {isUserIdVisible && (
          <div className="booking-userid">
            <strong>User ID:</strong> {booking.user_id}
          </div>
        )}

        <span className="booking-day">
          <strong>Date:</strong> {booking.selected_available_day}
        </span>
        <span className="booking-time">
          <strong>Time:</strong> {booking.selected_available_time_slot}
        </span>
        <span className="booking-instructions">
          <strong>Instructions:</strong> {booking.special_instructions || 'No special instructions'}
        </span>
        <span className={`booking-status status-${booking.pending ? 'pending' : 'confirmed'}`}>
          {booking.pending ? 'Pending' : 'Confirmed'}
        </span>
      </li>
    );
  };

  return (



    <div className="upcoming-bookings">

      {upcomingBookings.length > 0 ? (
        <ul className="booking-list">
          {upcomingBookings.map(renderBookingItem)}
        </ul>
      ) : (
        <p>No upcoming bookings found.</p>
      )}
    </div>


  );
};

export default CusDashboard;

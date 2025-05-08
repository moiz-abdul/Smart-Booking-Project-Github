import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './booking.css'

// Utility function to format time to AM/PM
const formatTimeToAMPM = (timeString) => {
  if (!timeString) return '';

  const timePart = timeString.split(':').slice(0, 2).join(':');
  const [hours, minutes] = timePart.split(':').map(Number);

  const period = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12;

  return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
};

const BookingForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    user_id: '',
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    service_id: '',
    service_name: '',
    service_category: '',
    duration_minutes: 0,
    selected_available_day: '',
    selected_available_time_slot: '',
    start_time: '',
    end_time: '',
    pay_per_booking_price: 0,
    membership_price: 0,
    payment_type: '',
    location: '',
    special_instructions: '',
    // New membership-related fields
    membership_type: '',
    membership_start_time: null,
    membership_end_time: null,
    monthly_membership_fee: 0,
    yearly_membership_fee: 0
  });

  const [service, setService] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [availableDays, setAvailableDays] = useState([]);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [hasActiveMembership, setHasActiveMembership] = useState(false);

  const getUserData = () => {
    const storedUserData = localStorage.getItem('userData');
    if (!storedUserData) {
      throw new Error('User not logged in');
    }
    return JSON.parse(storedUserData);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const serviceId = localStorage.getItem('booking_service_id');
        const userData = getUserData();
        const userId = userData.id;

        if (!serviceId || !userId) {
          throw new Error('Please select a service and ensure you\'re logged in');
        }

        const serviceResponse = await axios.get(`http://localhost:5000/api/addservice/servicedetails/${serviceId}`);
        if (!serviceResponse.data.success) {
          throw new Error('Failed to load service details');
        }

        const userResponse = await axios.get(`http://localhost:5000/api/users/userdetails/${userId}`);
        if (!userResponse.data.success) {
          throw new Error('Failed to load user details');
        }

        // Check membership status
        const membershipResponse = await axios.post(
          'http://localhost:5000/api/bookform/check-membership', 
          { user_id: userId, service_id: serviceId }
        );

        const serviceData = serviceResponse.data.data;
        const completeUserData = userResponse.data.user;

        const slots = [
          serviceData.slot_1_time,
          serviceData.slot_2_time,
          serviceData.slot_3_time
        ].filter(slot => slot);

        const days = serviceData.available_days ?
          serviceData.available_days.split(',') : [];

        setFormData({
          ...formData,
          user_id: userId,
          customer_name: userData.username,
          customer_email: completeUserData.email,
          customer_phone: completeUserData.phone,
          service_id: serviceId,
          service_name: serviceData.service_title,
          service_category: serviceData.categoryname,
          duration_minutes: serviceData.duration_minutes,
          pay_per_booking_price: serviceData.regular_price,
          membership_price: serviceData.member_price || 0,
          location: serviceData.location
        });

        setService(serviceData);
        setUser(completeUserData);
        setTimeSlots(slots);
        setAvailableDays(days);
        setHasActiveMembership(membershipResponse.data.has_active_membership);

      } catch (err) {
        console.error('Booking Error:', err);
        setError(err.message);
        if (err.message.includes('not logged in')) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'selected_available_time_slot') {
      const startTime = value;
      const duration = formData.duration_minutes;

      if (startTime && duration) {
        const [hours, minutes] = startTime.split(':').map(Number);
        const startDate = new Date();
        startDate.setHours(hours, minutes, 0, 0);

        const endDate = new Date(startDate.getTime() + duration * 60000);
        const endTime = `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;

        setFormData(prev => ({
          ...prev,
          start_time: startTime.includes(':') ? startTime.split(':').slice(0, 2).join(':') : startTime,
          end_time: endTime
        }));
      }
    }
  };

  const checkReservedTime = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/bookform/check-reserved-period', {
        selected_day: formData.selected_available_day,
        selected_start_time: formData.start_time,
        selected_end_time: formData.end_time
      });
  
      if (res.data.success && res.data.is_reserved) {
        setError(`Booking time blocked by admin: ${res.data.reason}`);
        return false;
      }
  
      return true;
    } catch (err) {
      setError("Failed to check reserved periods.");
      return false;
    }
  };

  const checkAvailability = async () => {
    try {
      setCheckingAvailability(true);
      const response = await axios.post(
        'http://localhost:5000/api/bookform/check-availability',
        {
          service_id: formData.service_id,
          selected_day: formData.selected_available_day,
          selected_time_slot: formData.selected_available_time_slot
        }
      );

      if (!response.data.available) {
        throw new Error('This day and time slot has already been booked. Please choose another.');
      }
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setCheckingAvailability(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate required fields
    if (!formData.customer_name || !formData.selected_available_day ||
      !formData.selected_available_time_slot || 
      (!hasActiveMembership && !formData.payment_type)) {
    throw new Error('Please fill all required fields');
  }

        // Frist Check reserved period
    const isReserved = await checkReservedTime();
    if (!isReserved) return;

    // Then Second Check availability
    const isAvailable = await checkAvailability();
    if (!isAvailable) return;

    // Membership-specific logic
    let membershipStartTime = null;
    let membershipEndTime = null;
    let monthlyMembershipFee = null;
    let yearlyMembershipFee = null;

    if (formData.payment_type === 'Membership') {
      // Fetch server time to ensure consistency
      const serverTimeResponse = await axios.get('http://localhost:5000/api/bookform/server-time');
      const currentDate = new Date(serverTimeResponse.data.timestamp);

      if (formData.membership_type === 'Monthly') {
        membershipStartTime = currentDate;
        membershipEndTime = new Date(currentDate);
        membershipEndTime.setMonth(membershipEndTime.getMonth() + 1);
        monthlyMembershipFee = formData.membership_price;
        yearlyMembershipFee = formData.membership_price * 12;
      } else if (formData.membership_type === 'Yearly') {
        membershipStartTime = currentDate;
        membershipEndTime = new Date(currentDate);
        membershipEndTime.setFullYear(membershipEndTime.getFullYear() + 1);
        monthlyMembershipFee = formData.membership_price;
        yearlyMembershipFee = formData.membership_price * 12;
      }
    }

    const bookingPayload = {
      ...formData,
      payment_type: hasActiveMembership ? 'Membership' : formData.payment_type,
      membership_type: hasActiveMembership ? 'Monthly' : formData.membership_type,
      membership_start_time: membershipStartTime,
      membership_end_time: membershipEndTime,
      monthly_membership_fee: monthlyMembershipFee,
      yearly_membership_fee: yearlyMembershipFee,
      is_status: 'pending'
    };

      // Check if user has an active membership
      if (hasActiveMembership) {
        // Direct booking to dashboard for active members
        const bookingResponse = await axios.post(
          'http://localhost:5000/api/bookform/bookingdetails',
          bookingPayload
        );

        if (bookingResponse.data.success) {
          navigate('/CustomerDashboard/Dashboard');
          return;
        }
      }

      // Proceed to payment for non-members or expired memberships
      const response = await axios.post(
        'http://localhost:5000/api/bookform/bookingdetails',
        bookingPayload
      );

      if (response.data.success) {
        localStorage.setItem('booking_id', response.data.booking_id);
        navigate('/payment');
      } else {
        throw new Error(response.data.message || 'Booking failed');
      }
    } catch (err) {
      console.error('Booking error:', err);
      setError(err.response?.data?.message || err.message);
    }
  };

  // Render membership type selection
  const renderMembershipTypeSelection = () => {
    if (formData.payment_type === 'Membership') {
      return (
        <div className="mb-3">
          <label className="form-label">Membership Duration*</label>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="membership_type"
              id="monthlyMembership"
              value="Monthly"
              checked={formData.membership_type === 'Monthly'}
              onChange={handleChange}
              required
            />
            <label className="form-check-label" htmlFor="monthlyMembership">
              Monthly Subscription (${formData.membership_price}) - Unlimited Monthly Bookings
            </label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="membership_type"
              id="yearlyMembership"
              value="Yearly"
              checked={formData.membership_type === 'Yearly'}
              onChange={handleChange}
            />
            <label className="form-check-label" htmlFor="yearlyMembership">
              Yearly Subscription (${formData.membership_price * 12}) - Unlimited Yearly Bookings
            </label>
          </div>
        </div>
      );
    }
    return null;
  };

  // Render membership status message for active members
  const renderMembershipStatusMessage = () => {
    if (hasActiveMembership) {
      return (
        <div className="alert alert-info">
          You have an active membership. You can book this service for free!
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return <div className="container py-5 text-center">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p>Loading booking form...</p>
    </div>;
  }

  if (error) {
    return <div className="container py-5">
      <div className="alert alert-danger">
        <h4 className="alert-heading">Error</h4>
        <p>{error}</p>
        <div className="d-flex justify-content-between mt-3">
          <button className="btn btn-secondary" onClick={() => navigate(-1)}>
            Go Back
          </button>
          <button className="btn btn-primary" onClick={() => {
            if (error.includes('login')) navigate('/login');
            else if (error.includes('service')) navigate('/services');
            else window.location.reload();
          }}>
            {error.includes('login') ? 'Go to Login' :
              error.includes('service') ? 'Browse Services' : 'Try Again'}
          </button>
        </div>
      </div>
    </div>;
  }

  return (
    <div className="container py-4">
      <h2 className="mb-4">Complete Your Booking</h2>

      {renderMembershipStatusMessage()}

      <form onSubmit={handleSubmit}>
        <input type="hidden" name="user_id" value={formData.user_id} />
        <input type="hidden" name="service_id" value={formData.service_id} />

        {/* Existing form fields... */}

<div className="row mb-3">
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Customer Name*</label>
              <input
                type="text"
                className="form-control"
                name="customer_name"
                value={formData.customer_name}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Customer Email</label>
              <input
                type="email"
                className="form-control"
                value={formData.customer_email}
                readOnly
              />
            </div>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Customer Phone</label>
              <input
                type="tel"
                className="form-control"
                value={formData.customer_phone}
                readOnly
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Service Name</label>
              <input
                type="text"
                className="form-control"
                value={formData.service_name}
                readOnly
              />
            </div>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Service Category</label>
              <input
                type="text"
                className="form-control"
                value={formData.service_category}
                readOnly
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Duration (minutes)</label>
              <input
                type="text"
                className="form-control"
                value={formData.duration_minutes}
                readOnly
              />
            </div>
          </div>
        </div>


        <div className="row mb-3">
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Available Day*</label>
              <select
                className="form-select"
                name="selected_available_day"
                value={formData.selected_available_day}
                onChange={handleChange}
                required
              >
                <option value="">Select a day</option>
                {availableDays.map(day => (
                  <option key={day} value={day.trim()}>{day.trim()}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Time Slot*</label>
              <select
                className="form-select"
                name="selected_available_time_slot"
                value={formData.selected_available_time_slot}
                onChange={handleChange}
                required
                disabled={!formData.selected_available_day}
              >
                <option value="">Select a time slot</option>
                {timeSlots.map(slot => (
                  <option key={slot} value={slot}>
                    {formatTimeToAMPM(slot)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Appointment Time</label>
          {formData.start_time && formData.end_time ? (
            <p>
              {formatTimeToAMPM(formData.start_time)} - {formatTimeToAMPM(formData.end_time)}
              (Duration: {formData.duration_minutes} minutes)
            </p>
          ) : (
            <p className="text-muted">Select a time slot to see appointment time</p>
          )}
        </div>
        
        {/* Payment Type Selection */}
        {!hasActiveMembership && (
          <div className="mb-3">
            <label className="form-label">Payment Type*</label>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="payment_type"
                id="payPerBooking"
                value="Pay Per Booking"
                checked={formData.payment_type === 'Pay Per Booking'}
                onChange={handleChange}
                required
              />
              <label className="form-check-label" htmlFor="payPerBooking">
                Pay Per Booking: ${formData.pay_per_booking_price}
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="payment_type"
                id="membership"
                value="Membership"
                checked={formData.payment_type === 'Membership'}
                onChange={handleChange}
                disabled={!formData.membership_price}
              />
              <label className="form-check-label" htmlFor="membership">
                Membership: ${formData.membership_price || 'Not available'}
              </label>
            </div>
          </div>
        )}

        {/* Membership Type Selection */}
        {renderMembershipTypeSelection()}


        {/* Rest of the form fields... */}

<div className="mb-3">
          <label className="form-label">Location</label>
          <input
            type="text"
            className="form-control"
            value={formData.location}
            readOnly
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Special Instructions (Optional)</label>
          <textarea
            className="form-control"
            rows="3"
            name="special_instructions"
            value={formData.special_instructions}
            onChange={handleChange}
          />
        </div>


        <div className="d-flex justify-content-between">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={checkingAvailability}
          >
            {checkingAvailability ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Checking Availability...
              </>
            ) : (
              'Proceed to Book'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;

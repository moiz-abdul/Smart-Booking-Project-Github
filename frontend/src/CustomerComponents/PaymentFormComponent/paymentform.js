import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const PaymentForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    booking_id: '',
    user_id: '',
    is_subscribe: false,
    service_id: '',
    cardholder_name: '',
    card_number: '',
    expiry_date: '',
    cvv_code: '',
    amount_paid: 0
  });
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({}); // Changed from error to errors object
  const [processingPayment, setProcessingPayment] = useState(false);

  // Reusable function to get user data
  const getUserData = () => {
    const storedUserData = localStorage.getItem('userData');
    if (!storedUserData) {
      setErrors({general: 'User not logged in'});
      return null;
    }
    return JSON.parse(storedUserData);
  };

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        // Get booking_id from localStorage
        const bookingId = localStorage.getItem('booking_id');
        if (!bookingId) {
          setErrors({general: 'Booking information not found'});
          return;
        }

        // Get user data
        const userData = getUserData();
        if (!userData) return;
        
        const userId = userData.id;

        // Fetch booking details to get payment type and service_id
        const bookingResponse = await axios.get(
          `http://localhost:5000/api/bookform/bookingdetails/${bookingId}`
        );

        if (!bookingResponse.data.success) {
          setErrors({general: 'Failed to load booking details'});
          return;
        }

        const bookingData = bookingResponse.data.data;
        const isSubscribe = bookingData.payment_type === 'Membership';

        // Fetch service details to get the correct price
        const serviceResponse = await axios.get(
          `http://localhost:5000/api/addservice/servicedetails/${bookingData.service_id}`
        );

        if (!serviceResponse.data.success) {
          setErrors({general: 'Failed to load service details'});
          return;
        }

        const serviceData = serviceResponse.data.data;
        const amount = isSubscribe ? serviceData.member_price : serviceData.regular_price;

        setFormData({
          booking_id: bookingId,
          user_id: userId,
          is_subscribe: isSubscribe,
          service_id: bookingData.service_id,
          amount_paid: Number(amount),
          cardholder_name: '',
          card_number: '',
          expiry_date: '',
          cvv_code: ''
        });

      } catch (err) {
        console.error('Payment Error:', err);
        setErrors({general: err.message});
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentDetails();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setErrors({...errors, [name]: ''}); // Clear error when user types
   
  
    // Cardholder name - alphabets and spaces only
    if (name === 'cardholder_name') {
      if (/[^a-zA-Z\s]/.test(value)) return; // Don't update if non-alphabet characters
      setFormData(prev => ({ ...prev, [name]: value }));
      return;
    }

    // Format expiry date automatically
    if (name === 'expiry_date') {
      const cleanedValue = value.replace(/\D/g, '');
      let formattedValue = cleanedValue;
      if (cleanedValue.length > 2) {
        formattedValue = `${cleanedValue.substring(0, 2)}/${cleanedValue.substring(2, 4)}`;
      }
      if (formattedValue.length > 5) return;
      setFormData(prev => ({ ...prev, [name]: formattedValue }));
      return;
    }
    if (name === 'cvv_code') {
      const digitsOnly = value.replace(/\D/g, '');
      if (digitsOnly.length > 4) return;
      setFormData(prev => ({ ...prev, [name]: digitsOnly }));
      return;
    }

    // Format card number with spaces every 4 digits
    if (name === 'card_number') {
      const cleanedValue = value.replace(/\D/g, '');
      let formattedValue = '';
      for (let i = 0; i < cleanedValue.length; i++) {
        if (i > 0 && i % 4 === 0) formattedValue += ' ';
        formattedValue += cleanedValue[i];
      }
      if (formattedValue.length > 19) return;
      setFormData(prev => ({ ...prev, [name]: formattedValue }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.cardholder_name.trim()) {
      newErrors.cardholder_name = 'Cardholder name is required';
    } else if (!/^[a-zA-Z\s]+$/.test(formData.cardholder_name)) {
      newErrors.cardholder_name = 'Only alphabets and spaces allowed';
    }

    const cardDigits = formData.card_number.replace(/\s/g, '');
    if (cardDigits.length !== 16 || !/^\d+$/.test(cardDigits)) {
      newErrors.card_number = 'Please enter a valid 16-digit card number';
    }

    if (!formData.expiry_date.match(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/)) {
      newErrors.expiry_date = 'Please enter a valid expiry date (MM/YY)';
    } else {
      // Additional expiry date validation
      const [month, year] = formData.expiry_date.split('/');
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;
      
      if (parseInt(year) < currentYear || 
          (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
        newErrors.expiry_date = 'Card has expired';
      }
    }

    if (!formData.cvv_code.match(/^\d{3,4}$/)) {
      newErrors.cvv_code = 'Please enter a valid CVV (3 or 4 digits)';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setProcessingPayment(true);
      
      const formErrors = validateForm();
      if (Object.keys(formErrors).length > 0) {
        setErrors(formErrors);
        return;
      }

      const response = await axios.post(
        'http://localhost:5000/api/paymentform/process',
        formData
      );

      if (response.data.success) {
        localStorage.removeItem('booking_id');
        localStorage.removeItem('booking_service_id');
        navigate('/CustomerDashboard/Dashboard/', {
          state: {
            paymentId: response.data.payment_id,
            amount: formData.amount_paid,
            serviceName: response.data.service_name
          }
        });
      }
    } catch (err) {
      console.error('Payment error:', err);
      setErrors({
        general: err.response?.data?.message || 'Payment processing failed. Please try again.'
      });
    } finally {
      setProcessingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>Loading payment details...</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="mb-4">Complete Your Payment</h2>

      {/* General error display */}
      {errors.general && (
        <div className="alert alert-danger mb-4">
          {errors.general}
          <div className="d-flex justify-content-between mt-3">
            {errors.general.includes('Booking') || errors.general.includes('User') ? (
              <>
                <button className="btn btn-secondary" onClick={() => navigate('/')}>
                  Back to Home
                </button>
                <button className="btn btn-primary" onClick={() => window.location.reload()}>
                  Try Again
                </button>
              </>
            ) : null}
          </div>
        </div>
      )}

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Order Summary</h5>
          <p className="card-text">
            {formData.is_subscribe ? 'Membership Subscription' : 'One-time Payment'}:
            <strong> ${Number(formData.amount_paid).toFixed(2)}</strong>
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <input type="hidden" name="booking_id" value={formData.booking_id} />
        <input type="hidden" name="user_id" value={formData.user_id} />
        <input type="hidden" name="is_subscribe" value={formData.is_subscribe.toString()} />
        <input type="hidden" name="service_id" value={formData.service_id} />
        <input type="hidden" name="amount_paid" value={formData.amount_paid} />

        <div className="row mb-3">
          <div className="col-md-12">
            <div className="mb-3">
              <label className="form-label">Cardholder Name*</label>
              <input
                type="text"
                className={`form-control ${errors.cardholder_name ? 'is-invalid' : ''}`}
                name="cardholder_name"
                value={formData.cardholder_name}
                onChange={handleChange}
                required
              />
              {errors.cardholder_name && (
                <div className="invalid-feedback">{errors.cardholder_name}</div>
              )}
            </div>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-8">
            <div className="mb-3">
              <label className="form-label">Card Number*</label>
              <input
                type="text"
                className={`form-control ${errors.card_number ? 'is-invalid' : ''}`}
                name="card_number"
                value={formData.card_number}
                onChange={handleChange}
                placeholder="1234 5678 9012 3456"
                required
              />
              {errors.card_number && (
                <div className="invalid-feedback">{errors.card_number}</div>
              )}
            </div>
          </div>
          <div className="col-md-4">
            <div className="mb-3">
              <label className="form-label">Expiry Date (MM/YY)*</label>
              <input
                type="text"
                className={`form-control ${errors.expiry_date ? 'is-invalid' : ''}`}
                name="expiry_date"
                value={formData.expiry_date}
                onChange={handleChange}
                placeholder="MM/YY"
                required
              />
              {errors.expiry_date && (
                <div className="invalid-feedback">{errors.expiry_date}</div>
              )}
            </div>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-md-4">
            <div className="mb-3">
              <label className="form-label">CVV Code*</label>
              <input
                type="text"
                className={`form-control ${errors.cvv_code ? 'is-invalid' : ''}`}
                name="cvv_code"
                value={formData.cvv_code}
                onChange={handleChange}
                placeholder="123"
                required
              />
              {errors.cvv_code && (
                <div className="invalid-feedback">{errors.cvv_code}</div>
              )}
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-between">
          <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
            Back
          </button>
          <button type="submit" className="btn btn-primary" disabled={processingPayment}>
            {processingPayment ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status"></span>
                Processing...
              </>
            ) : `Pay $${Number(formData.amount_paid).toFixed(2)}`}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;
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
  const [error, setError] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);

  // Reusable function to get user data
  const getUserData = () => {
    const storedUserData = localStorage.getItem('userData');
    if (!storedUserData) {
      throw new Error('User not logged in');
    }
    return JSON.parse(storedUserData);
  };

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        // Get booking_id from localStorage
        const bookingId = localStorage.getItem('booking_id');
        if (!bookingId) {
          throw new Error('Booking information not found');
        }

        // Get user data
        const userData = getUserData();
        const userId = userData.id;

        // Fetch booking details to get payment type and service_id
        const bookingResponse = await axios.get(
          `http://localhost:5000/api/bookform/bookingdetails/${bookingId}`
        );

        if (!bookingResponse.data.success) {
          throw new Error('Failed to load booking details');
        }

        const bookingData = bookingResponse.data.data;
        const isSubscribe = bookingData.payment_type === 'Membership';

        // Fetch service details to get the correct price
        const serviceResponse = await axios.get(
          `http://localhost:5000/api/addservice/servicedetails/${bookingData.service_id}`
        );

        if (!serviceResponse.data.success) {
          throw new Error('Failed to load service details');
        }

        const serviceData = serviceResponse.data.data;
        const amount = isSubscribe ? serviceData.member_price : serviceData.regular_price;

        setFormData({
          booking_id: bookingId,
          user_id: userId,
          is_subscribe: isSubscribe,
          service_id: bookingData.service_id,
          amount_paid: Number(amount), // Ensure this is a number
          cardholder_name: '',
          card_number: '',
          expiry_date: '',
          cvv_code: ''
        });

      } catch (err) {
        console.error('Payment Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentDetails();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

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
    if (!formData.cardholder_name.trim()) {
      throw new Error('Cardholder name is required');
    }

    const cardDigits = formData.card_number.replace(/\s/g, '');
    if (cardDigits.length !== 16 || !/^\d+$/.test(cardDigits)) {
      throw new Error('Please enter a valid 16-digit card number');
    }

    if (!formData.expiry_date.match(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/)) {
      throw new Error('Please enter a valid expiry date (MM/YY)');
    }

    if (!formData.cvv_code.match(/^\d{3,4}$/)) {
      throw new Error('Please enter a valid CVV (3 or 4 digits)');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setProcessingPayment(true);
      validateForm();

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
      setError(err.response?.data?.message || err.message);
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

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          <h4 className="alert-heading">Payment Error</h4>
          <p>{error}</p>
          <div className="d-flex justify-content-between mt-3">
            <button className="btn btn-secondary" onClick={() => navigate(-1)}>
              Back to Booking
            </button>
            <button className="btn btn-primary" onClick={() => window.location.reload()}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="mb-4">Complete Your Payment</h2>

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
        <input type="hidden" name="is_subscribe" value={formData.is_subscribe.toString()} /> {/* Fixed */}
        <input type="hidden" name="service_id" value={formData.service_id} />
        <input type="hidden" name="amount_paid" value={formData.amount_paid} />

        <div className="row mb-3">
          <div className="col-md-12">
            <div className="mb-3">
              <label className="form-label">Cardholder Name*</label>
              <input
                type="text"
                className="form-control"
                name="cardholder_name"
                value={formData.cardholder_name}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-8">
            <div className="mb-3">
              <label className="form-label">Card Number*</label>
              <input
                type="text"
                className="form-control"
                name="card_number"
                value={formData.card_number}
                onChange={handleChange}
                placeholder="1234 5678 9012 3456"
                required
              />
            </div>
          </div>
          <div className="col-md-4">
            <div className="mb-3">
              <label className="form-label">Expiry Date (MM/YY)*</label>
              <input
                type="text"
                className="form-control"
                name="expiry_date"
                value={formData.expiry_date}
                onChange={handleChange}
                placeholder="MM/YY"
                required
              />
            </div>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-md-4">
            <div className="mb-3">
              <label className="form-label">CVV Code*</label>
              <input
                type="text"
                className="form-control"
                name="cvv_code"
                value={formData.cvv_code}
                onChange={handleChange}
                placeholder="123"
                required
              />
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
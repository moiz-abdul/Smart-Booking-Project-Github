import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./css/procurement.css";
import { FaMapMarkerAlt, FaClock, FaCalendarAlt, FaMoneyBillWave, FaEnvelope, FaPhone, FaHome, FaInfoCircle } from "react-icons/fa";

const ProcurementSection = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [serviceDetails, setServiceDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/bookingdetails/details/${serviceId}`);
        const data = await response.json();
        if (data.success) {
          setServiceDetails(data.data);
        } else {
          console.error("Failed to fetch service details");
        }
      } catch (err) {
        console.error("API error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [serviceId]);

  const handleBookNow = () => {
    localStorage.setItem('booking_service_id', serviceId);
    navigate('/login');
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: "70vh" }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  if (!serviceDetails) return (
    <div className="container py-5 text-center">
      <div className="card shadow-sm p-5">
        <FaInfoCircle size={50} className="text-muted mx-auto mb-3" />
        <h3>No service found</h3>
        <p className="text-muted">The requested service could not be found.</p>
        <button className="btn btn-outline-primary mx-auto mt-3" onClick={() => navigate("/")}>
          Back to Home
        </button>
      </div>
    </div>
  );

  const {
    service_title,
    provider_name,
    description,
    duration_minutes,
    regular_price,
    member_price,
    available_days,
    slot_1_time,
    slot_2_time,
    slot_3_time,
    location,
    business_name,
    email,
    phone,
    address,
    provider_description,
  } = serviceDetails;

  return (
    <div className="procurement-section container py-5">
      <h2 className="mb-4 text-center fw-bold">Service Booking</h2>

      <div className="row g-4">
        {/* Service Details Card */}
        <div className="col-lg-8">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h3 className="card-title fw-bold mb-4">{service_title}</h3>
              <div className="d-flex align-items-center mb-3">
                <img
                  src={`https://ui-avatars.com/api/?name=${provider_name}&background=random&color=fff`}
                  alt={provider_name}
                  className="rounded-circle me-2"
                  width="40"
                  height="40"
                />
                <h5 className="mb-0">{provider_name}</h5>
              </div>

              <p className="card-text mb-4">{description}</p>

              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <div className="d-flex align-items-center">
                    <FaMapMarkerAlt className="text-primary me-2" />
                    <span><strong>Location:</strong> {location}</span>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-center">
                    <FaClock className="text-primary me-2" />
                    <span><strong>Duration:</strong> {duration_minutes} minutes</span>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-center">
                    <FaCalendarAlt className="text-primary me-2" />
                    <span><strong>Available:</strong> {available_days}</span>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-center">
                    <FaMoneyBillWave className="text-primary me-2" />
                    <span><strong>Price:</strong> ${regular_price} / ${member_price} (Members)</span>
                  </div>
                </div>
              </div>

              <div className="time-slots mb-4">
                <h5 className="mb-3">Available Time Slots</h5>
                <div className="d-flex flex-wrap gap-2">
                  {slot_1_time && (
                    <div className="time-slot-pill">{slot_1_time}</div>
                  )}
                  {slot_2_time && (
                    <div className="time-slot-pill">{slot_2_time}</div>
                  )}
                  {slot_3_time && (
                    <div className="time-slot-pill">{slot_3_time}</div>
                  )}
                </div>
              </div>
            </div>
            <div className="card-footer bg-white border-top-0 d-flex gap-2 justify-content-end">
              <button
                className="btn btn-primary"
                onClick={() => navigate("/")}
              >
                Back to Home
              </button>
              <button
                className="btn btn-primary"
                onClick={handleBookNow}
              >
                Book Now
              </button>
            </div>
          </div>
        </div>

        {/* Provider Info Card */}
        <div className="col-lg-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h4 className="card-title fw-bold mb-4">Provider Information</h4>
              <h5 className="fw-bold mb-3">{business_name}</h5>

              <div className="provider-info">
                <div className="d-flex align-items-center mb-3">
                  <FaEnvelope className="text-primary me-2" />
                  <span>{email}</span>
                </div>
                <div className="d-flex align-items-center mb-3">
                  <FaPhone className="text-primary me-2" />
                  <span>{phone}</span>
                </div>
                <div className="d-flex align-items-center mb-3">
                  <FaHome className="text-primary me-2" />
                  <span>{address}</span>
                </div>
              </div>

              <hr className="my-4" />

              <h5 className="mb-3">About Provider</h5>
              <p>{provider_description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcurementSection;
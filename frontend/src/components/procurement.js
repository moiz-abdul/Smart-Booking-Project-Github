import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./css/procurement.css";

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
    // Store service ID in localStorage before redirecting to login
    localStorage.setItem('booking_service_id', serviceId);
    navigate('/login');
  };

  if (loading) return <div className="text-center py-5">Loading service details...</div>;

  if (!serviceDetails) return <div className="text-center py-5">No service found.</div>;

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
      <h2 className="mb-3">🧼 {service_title}</h2>
      <p><strong>By:</strong> {provider_name}</p>
      <p>{description}</p>
      <p><strong>📍 Location:</strong> {location}</p>
      <p><strong>🕒 Duration:</strong> {duration_minutes} minutes</p>
      <p><strong>💲 Price:</strong> Rs. {regular_price} (Regular) / Rs. {member_price} (Members)</p>
      <p><strong>📆 Available:</strong> {available_days}</p>
      <p><strong>🕰 Time Slots:</strong> {slot_1_time}, {slot_2_time}, {slot_3_time}</p>

      <hr />

      <h4>🧾 Provider Info</h4>
      <p><strong>{business_name}</strong></p>
      <p>📧 {email}</p>
      <p>📞 {phone}</p>
      <p>🏠 {address}</p>
      <p>📝 {provider_description}</p>

      <div className="mt-4 d-flex gap-2">
        <button 
          className="btn btn-primary" 
          onClick={handleBookNow}
        >
          Book Now
        </button>
        <button 
          className="btn btn-outline-secondary" 
          onClick={() => navigate("/")}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default ProcurementSection;
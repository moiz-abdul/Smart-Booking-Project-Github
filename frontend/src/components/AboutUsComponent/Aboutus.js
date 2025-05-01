import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import './Aboutus.css';
import { useNavigate } from 'react-router-dom';

export default function AboutUsPage ()  {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
      const fetchServices = async () => {
          try {
              const response = await fetch('http://localhost:5000/api/homepagecardservices/all');
              const data = await response.json();
              if (data.success) {
                  setServices(data.data);
              }
          } catch (error) {
              console.error("Error fetching services:", error);
          } finally {
              setLoading(false);
          }
      };

      fetchServices();
  }, []);

  const formatTime = (timeString) => {
      if (!timeString) return '';
      const time = new Date(`1970-01-01T${timeString}`);
      return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleBookNow = (serviceId) => {
      navigate(`/procurement/${serviceId}`);
  };

  if (loading) return <div className="text-center py-5">Loading services...</div>;

  return (
      <div className="container py-4">
          <h2 className="text-center mb-4">Available Services</h2>
          
          <div className="row">
              {services.length > 0 ? (
                  services.map((service) => (
                      <div key={service.id} className="col-md-4 mb-4">
                          <div className="service-card p-3 h-100">
                              <h4>{service.serviceTitle}</h4>
                              <span className="category-badge">{service.category}</span>
                              
                              <div className="my-2">
                                  <strong>Available Days:</strong> {service.availableDays.join(', ')}
                              </div>
                              
                              <div className="my-2">
                                  <strong>Duration:</strong> {service.duration} mins | 
                                  <strong> Slots:</strong> {service.timeSlots.map(formatTime).join(', ')}
                              </div>
                              
                              <div className="my-2">
                                  <strong>Price:</strong> ${service.regularPrice} 
                                  {service.memberPrice && (
                                      <span className="text-success"> (${service.memberPrice} for members)</span>
                                  )}
                              </div>
                              
                              <div className="my-2">
                                  <strong>Location:</strong> {service.location}
                              </div>
                              
                              <button 
                                  className="btn btn-primary mt-2 w-100"
                                  onClick={() => handleBookNow(service.id)}
                              >
                                  Book Now
                              </button>
                          </div>
                      </div>
                  ))
              ) : (
                  <div className="col-12 text-center py-5">
                      No services available at the moment.
                  </div>
              )}
          </div>
      </div>
  );
  };


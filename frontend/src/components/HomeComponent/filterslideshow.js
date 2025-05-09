import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';

import {
  FaCalendarAlt,
  FaUserMd,
  FaSearch,
  FaCreditCard,
  FaRegStar,
  FaSignInAlt,
  FaUserPlus,
  FaChevronRight,
  FaChevronLeft,
  FaClock,
  FaStar
} from 'react-icons/fa';

const Home = () => {
  const [activeTab, setActiveTab] = useState('customer');
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [services, setServices] = useState([]);
  const [allServices, setAllServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState({});
  const [filters, setFilters] = useState({
    timeslots: [],
    availableDays: [],
    minRating: null
  });
  const [activeFilterTab, setActiveFilterTab] = useState('timeslots');
  const slideInterval = useRef(null);
  const [error, setError] = useState(null);

  const logDebugInfo = (message, data) => {
    console.log(`[DEBUG] ${message}:`, data);
  };

  const fetchAllServices = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/homepagecardservices/allservices');
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        logDebugInfo("Fetched all services", data.data);
        // Normalize service data to ensure consistent property names
        const normalizedServices = data.data.map(service => ({
          ...service,
          timeSlots: service.timeSlots || service.time_slots || [],
          availableDays: service.availableDays || service.available_days || []
        }));
        setServices(normalizedServices);
        setAllServices(normalizedServices);
        setError(null);
      } else {
        throw new Error("API returned success: false");
      }
    } catch (error) {
      console.error("Error fetching all services:", error);
      setError("Failed to load services. Please try again later.");
      setServices([]);
      setAllServices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [categoriesRes, ratingsRes] = await Promise.all([
          fetch('http://localhost:5000/api/homepagecardservices/categories'),
          fetch('http://localhost:5000/api/homepagecardservices/ratings')
        ]);

        if (!categoriesRes.ok || !ratingsRes.ok) {
          throw new Error("One or more API requests failed");
        }

        const categoriesData = await categoriesRes.json();
        const ratingsData = await ratingsRes.json();

        if (categoriesData.success) setCategories(categoriesData.data);
        if (ratingsData.success) {
          const ratingsMap = {};
          ratingsData.data.forEach(item => {
            ratingsMap[item.service_id] = item;
          });
          setRatings(ratingsMap);
        }
        
        await fetchAllServices();
        
      } catch (error) {
        console.error("Error fetching initial data:", error);
        setError("Failed to load initial data. Please try again later.");
      }
    };

    fetchInitialData();
  }, []);

  
 

  const applyFilters = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const hasActiveFilters = filters.timeslots.length > 0 || 
                              filters.availableDays.length > 0 || 
                              filters.minRating !== null;
      
      if (!hasActiveFilters) {
        setServices(allServices);
        setLoading(false);
        return;
      }
      
      const filterPayload = {
        time_slots: filters.timeslots,
        available_days: filters.availableDays,
        min_rating: filters.minRating
      };
      
      logDebugInfo("Applying filters with payload", filterPayload);
      
      const url = 'http://localhost:5000/api/homepagecardservices/filter';
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(filterPayload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      logDebugInfo("Filter API response", data);
      
      if (data.success) {
        const normalizedServices = data.data.map(service => ({
          ...service,
          timeSlots: service.timeSlots || service.time_slots || [],
          availableDays: service.availableDays || service.available_days || []
        }));
        setServices(normalizedServices);
        setCurrentSlide(0);
      } else {
        throw new Error("API returned success: false");
      }
    } catch (error) {
      console.error('Error during filtering:', error);
    
      clientSideFiltering();
    } finally {
      setLoading(false);
    }
  };

  const clientSideFiltering = () => {
    try {
      if (!allServices || allServices.length === 0) {
        setError("No services available to filter.");
        setServices([]);
        return;
      }
      
      let filteredServices = [...allServices];
      
      // Time slots filter
      if (filters.timeslots && filters.timeslots.length > 0) {
        filteredServices = filteredServices.filter(service => {
          const serviceSlots = service.timeSlots || [];
          if (serviceSlots.length === 0) return false;
          
          return filters.timeslots.some(slot => {
            return serviceSlots.some(timeStr => {
              if (!timeStr) return false;
              const hour = parseInt(timeStr.split(':')[0], 10);
              
              if (slot === 'morning' && hour >= 6 && hour < 12) return true;
              if (slot === 'afternoon' && hour >= 12 && hour < 17) return true;
              if (slot === 'evening' && hour >= 17 && hour < 21) return true;
              if (slot === 'night' && (hour >= 21 || hour < 6)) return true;
              
              return false;
            });
          });
        });
      }
      
      // Days filter
      if (filters.availableDays && filters.availableDays.length > 0) {
        filteredServices = filteredServices.filter(service => {
          const serviceDays = service.availableDays || [];
          if (serviceDays.length === 0) return false;
          return filters.availableDays.some(day => serviceDays.includes(day));
        });
      }
      
      // Rating filter
      if (filters.minRating !== null) {
        filteredServices = filteredServices.filter(service => {
          const serviceRating = ratings[service.id]?.average_rating || 0;
          return serviceRating >= filters.minRating;
        });
      }
      
      logDebugInfo("Client-side filtered services", filteredServices);
      setServices(filteredServices);
      setCurrentSlide(0);
      
    } catch (error) {
      console.error("Error in client-side filtering:", error);
      setError("Client-side filtering failed. Showing all services.");
      setServices(allServices);
    }
  };

  const onFilterChange = (filterType, value) => {
    setFilters(prev => {
      const newFilters = { ...prev };

      if (['timeslots', 'availableDays'].includes(filterType)) {
        if (!newFilters[filterType]) {
          newFilters[filterType] = [];
        }
        
        const index = newFilters[filterType].indexOf(value);
        if (index === -1) {
          newFilters[filterType].push(value);
        } else {
          newFilters[filterType].splice(index, 1);
        }
      } else {
        newFilters[filterType] = value;
      }

      logDebugInfo("Filter changed", newFilters);
      return newFilters;
    });
  };

  const resetFilters = () => {
    setFilters({
      timeslots: [],
      availableDays: [],
      minRating: null
    });
    setServices(allServices);
    setError(null);
  };

  const servicesPerSlide = 3;
  const totalSlides = Math.max(1, Math.ceil((services?.length || 0) / servicesPerSlide));

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const currentServices = services?.slice(
    currentSlide * servicesPerSlide,
    (currentSlide + 1) * servicesPerSlide
  ) || [];

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [hour, minute] = timeStr.split(':');
    const h = parseInt(hour, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const formattedHour = h % 12 || 12;
    return `${formattedHour}:${minute} ${ampm}`;
  };

  const handleBookNow = (serviceId) => {
    navigate(`/procurement/${serviceId}`);
  };
  const navigate = useNavigate();


  const renderStars = (rating) => {
    const numericRating = Number(rating) || 0;
    const clampedRating = Math.min(Math.max(numericRating, 0), 5);

    const fullStars = Math.floor(clampedRating);
    const hasHalfStar = clampedRating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="star-rating">
        {[...Array(fullStars)].map((_, i) => (
          <i key={`full-${i}`} className="fas fa-star text-warning"></i>
        ))}
        {hasHalfStar && <i className="fas fa-star-half-alt text-warning"></i>}
        {[...Array(emptyStars)].map((_, i) => (
          <i key={`empty-${i}`} className="far fa-star text-warning"></i>
        ))}
        <span className="ms-2">{clampedRating.toFixed(1)}/5</span>
      </div>
    );
  };

  // This is the fixed renderFilterSection function

const renderFilterSection = () => {
  const timeslots = filters.timeslots || [];
  const availableDays = filters.availableDays || [];
  
  switch(activeFilterTab) {
    case 'timeslots':
      return (
        <div className="filter-options">
          <h4>Time Slots</h4>
          <div className="checkbox-group">
            {['morning', 'afternoon', 'evening', 'night'].map((slot) => (
              <label key={slot} className="modern-checkbox">
                <input
                  type="checkbox"
                  checked={timeslots.includes(slot)}
                  onChange={() => onFilterChange('timeslots', slot)}
                />
                <span className="checkbox-label">{slot.charAt(0).toUpperCase() + slot.slice(1)}</span>
              </label>
            ))}
          </div>
        </div>
      );
    case 'days':
      return (
        <div className="filter-options">
          <h4>Available Days</h4>
          <div className="checkbox-group">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
              <label key={day} className="modern-checkbox">
                <input
                  type="checkbox"
                  checked={availableDays.includes(day)}
                  onChange={() => onFilterChange('availableDays', day)}
                />
                <span className="checkbox-label">{day}</span>
              </label>
            ))}
          </div>
        </div>
      );
    case 'rating':
      return (
        <div className="filter-options">
          <h4>Minimum Rating</h4>
          <div className="radio-group">
            {[1, 2, 3, 4, 5].map((rating) => (
              <label key={rating} className="modern-radio">
                <input
                  type="radio"
                  name="minRating"
                  checked={filters.minRating === rating}
                  onChange={() => onFilterChange('minRating', rating)}
                />
                <span className="radio-label">{rating}★ & above</span>
              </label>
            ))}
          </div>
        </div>
      );
    default:
      return null;
  }
};

  return (
    <div>
    

      {/* FILTERS */}
      <div className="modern-filters-container">
        <div className="filter-tabs">
          <button 
            className={`filter-tab ${activeFilterTab === 'timeslots' ? 'active' : ''}`}
            onClick={() => setActiveFilterTab('timeslots')}
          >
            <FaClock /> Time
          </button>
          <button 
            className={`filter-tab ${activeFilterTab === 'days' ? 'active' : ''}`}
            onClick={() => setActiveFilterTab('days')}
          >
            <FaCalendarAlt /> Days
          </button>
          <button 
            className={`filter-tab ${activeFilterTab === 'rating' ? 'active' : ''}`}
            onClick={() => setActiveFilterTab('rating')}
          >
            <FaStar /> Rating
          </button>
        </div>
        
        <div className="filter-content">
          {renderFilterSection()}
          
          <div className="filter-actions">
            <button className="apply-filter-btn" onClick={applyFilters}>
              Apply Filters
            </button>
            <button className="reset-filter-btn" onClick={resetFilters}>
              Reset Filters
            </button>
          </div>
          
          {(filters.timeslots.length > 0 || filters.availableDays.length > 0 || filters.minRating !== null) && (
            <div className="active-filters">
              <p>Active filters:</p>
              <div className="filter-tags">
                {filters.timeslots.map(slot => (
                  <span key={slot} className="filter-tag">
                    {slot.charAt(0).toUpperCase() + slot.slice(1)}
                    <button 
                      className="remove-filter" 
                      onClick={() => onFilterChange('timeslots', slot)}
                    >×</button>
                  </span>
                ))}
                {filters.availableDays.map(day => (
                  <span key={day} className="filter-tag">
                    {day}
                    <button 
                      className="remove-filter" 
                      onClick={() => onFilterChange('availableDays', day)}
                    >×</button>
                  </span>
                ))}
                {filters.minRating !== null && (
                  <span className="filter-tag">
                    Rating: {filters.minRating}★ & above
                    <button 
                      className="remove-filter" 
                      onClick={() => setFilters(prev => ({...prev, minRating: null}))}
                    >×</button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      {/* SERVICES SLIDESHOW */}
      <section className="services-slideshow-section">
        <div className="section-heading">
          <h2>Available Services {services?.length > 0 ? `(${services.length})` : ''}</h2>
          {loading && <div className="loading-indicator">Loading...</div>}
        </div>

        <div className="slideshow-container">
          {services && services.length > 0 ? (
            <>
              <button
                className="slide-nav-btn prev-btn"
                onClick={prevSlide}
                disabled={totalSlides <= 1}
              >
                <FaChevronLeft />
              </button>

              <div className="slideshow-cards-container">
                <div className="slideshow-cards">
                  {currentServices.map(service => (
                    <div key={service.id} className="service-card">
                      <h4>{service.serviceTitle}</h4>
                      <span className="category-badge">{service.category}</span>

                      <div className="my-2">
                        <strong>Rating:</strong>{' '}
                        {ratings[service.id] ? renderStars(ratings[service.id].average_rating) : (
                          <span className="text-muted">No ratings yet</span>
                        )}
                      </div>

                      <div className="my-2">
                        <strong>Available Days:</strong>{' '}
                        {service.availableDays?.join(', ') || 'Not specified'}
                      </div>

                      <div className="my-2">
                        <strong>Duration:</strong> {service.duration} mins |
                        <strong> Slots:</strong>{' '}
                        {service.timeSlots?.map(formatTime).join(', ') || 'No slots'}
                      </div>

                      <div className="my-2">
                        <strong>Price:</strong> ${service.regularPrice}
                        {service.memberPrice && (
                          <span className="text-success">
                            {' '}(${service.memberPrice} for members)
                          </span>
                        )}
                      </div>

                      <div className="my-2">
                        <strong>Location:</strong> {service.location || 'Not specified'}
                      </div>

                      <button className="book-now-btn" onClick={() => handleBookNow(service.id)}>
                        Book Now
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <button
                className="slide-nav-btn next-btn"
                onClick={nextSlide}
                disabled={totalSlides <= 1}
              >
                <FaChevronRight />
              </button>
            </>
          ) : (
            <div className="no-services-message">
              {loading ? 'Loading services...' : (
                <>
                  <p>No services available matching your criteria.</p>
                  <button className="reset-btn" onClick={resetFilters}>Reset Filters</button>
                  <button className="reload-btn" onClick={fetchAllServices}>
                    Reload All Services
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {totalSlides > 1 && (
          <div className="slideshow-dots">
            {[...Array(totalSlides)].map((_, index) => (
              <div
                key={index}
                className={`dot ${currentSlide === index ? 'active-dot' : ''}`}
                onClick={() => setCurrentSlide(index)}
              ></div>
            ))}
          </div>
        )}
      </section>
      
      <style jsx>{`
        .search-container {
          margin-bottom: 20px;
        }
        .search-input-wrapper {
          position: relative;
          max-width: 500px;
          margin: 0 auto;
        }
        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #777;
        }
        .search-input {
          width: 100%;
          padding: 10px 10px 10px 40px;
          border-radius: 20px;
          border: 1px solid #ddd;
          font-size: 16px;
        }
        .modern-filters-container {
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          padding: 20px;
          margin-bottom: 20px;
        }
        .filter-tabs {
          display: flex;
          border-bottom: 1px solid #eee;
          margin-bottom: 15px;
        }
        .filter-tab {
          padding: 10px 15px;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 14px;
          color: #666;
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .filter-tab.active {
          color: #0066cc;
          border-bottom: 2px solid #0066cc;
        }
        .filter-options {
          margin-bottom: 15px;
        }
        .filter-options h4 {
          margin-bottom: 10px;
          font-size: 16px;
          color: #333;
        }
        .checkbox-group, .radio-group {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        .modern-checkbox, .modern-radio {
          display: flex;
          align-items: center;
          gap: 5px;
          cursor: pointer;
        }
        .checkbox-label, .radio-label {
          font-size: 14px;
        }
        .filter-actions {
          display: flex;
          gap: 10px;
          margin-top: 15px;
        }
        .apply-filter-btn {
          padding: 8px 16px;
          background-color: #0066cc;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .reset-filter-btn {
          padding: 8px 16px;
          background-color: #f8f9fa;
          border: 1px solid #ddd;
          border-radius: 4px;
          cursor: pointer;
        }
        .active-filters {
          margin-top: 15px;
          border-top: 1px solid #eee;
          padding-top: 10px;
        }
        .filter-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .filter-tag {
          background-color: #f1f1f1;
          padding: 5px 10px;
          border-radius: 16px;
          font-size: 14px;
          display: flex;
          align-items: center;
        }
        .remove-filter {
          border: none;
          background: none;
          margin-left: 5px;
          cursor: pointer;
          font-size: 16px;
          line-height: 1;
          color: #777;
        }
        .error-message {
          background-color: #fff3f3;
          border-left: 4px solid #ff6b6b;
          padding: 12px;
          margin: 15px 0;
          color: #d32f2f;
        }
        .services-slideshow-section {
          margin-top: 30px;
        }
        .section-heading {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
        }
        .section-heading h2 {
          margin: 0;
          font-size: 24px;
        }
        .loading-indicator {
          display: inline-block;
          margin-left: 15px;
          font-style: italic;
          color: #666;
        }
        .slideshow-container {
          position: relative;
          min-height: 300px;
        }
        .slideshow-cards-container {
          overflow: hidden;
          padding: 0 40px;
        }
        .slideshow-cards {
          display: flex;
          transition: transform 0.3s ease;
          gap: 20px;
        }
        .service-card {
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          padding: 20px;
          min-width: 300px;
          flex: 1;
        }
        .category-badge {
          display: inline-block;
          background: #e6f7ff;
          color: #0066cc;
          padding: 3px 8px;
          border-radius: 4px;
          font-size: 12px;
          margin-bottom: 10px;
        }
        .book-now-btn {
          background: #0066cc;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          margin-top: 10px;
          width: 100%;
        }
        .slide-nav-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255,255,255,0.8);
          border: 1px solid #ddd;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
        }
        .slide-nav-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .prev-btn {
          left: 0;
        }
        .next-btn {
          right: 0;
        }
        .slideshow-dots {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-top: 20px;
        }
        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #ddd;
          cursor: pointer;
        }
        .active-dot {
          background: #0066cc;
        }
        .no-services-message {
          text-align: center;
          padding: 40px;
          background: #f8f9fa;
          border-radius: 8px;
        }
        .reset-btn, .reload-btn {
          margin: 10px 5px;
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .reset-btn {
          background-color: #f1f1f1;
        }
        .reload-btn {
          background-color: #e6f7ff;
          color: #0066cc;
        }
        .star-rating {
          display: flex;
          align-items: center;
        }
      `}</style>
    </div>
  );
};

export default Home;
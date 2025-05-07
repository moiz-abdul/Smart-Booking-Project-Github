import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './Home.css';

const ServiceFiltersAndSlideshow = ({
  ratings = {},
  handleBookNow,
  formatTime
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [services, setServices] = useState([]);
  const [filters, setFilters] = useState({
    timeslots: [],
    availableDays: [],
    minRating: null
  });

  const onFilterChange = (filterType, value) => {
    setFilters(prev => {
      const newFilters = { ...prev };

      if (['timeslots', 'availableDays'].includes(filterType)) {
        const index = newFilters[filterType].indexOf(value);
        if (index === -1) {
          newFilters[filterType].push(value);
        } else {
          newFilters[filterType].splice(index, 1);
        }
      } else {
        newFilters[filterType] = value;
      }

      return newFilters;
    });
  };

  const applyFilters = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/homepagecardservices/filter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(filters)
      });

      const data = await response.json();
      setServices(data.services);
    } catch (error) {
      console.error('Filter error:', error);
    }
  };

  const filteredServices = services;
  const servicesPerSlide = 3;
  const totalSlides = Math.max(1, Math.ceil(filteredServices.length / servicesPerSlide));

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + totalSlides) % totalSlides);
  };

  const currentServices = filteredServices.slice(
    currentSlide * servicesPerSlide,
    (currentSlide + 1) * servicesPerSlide
  );

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

  return (
    <div className="filters-and-results-wrapper">
      {/* FILTERS */}
      <div className="service-filters">
        <div className="filter-section">
          <h4>Time Slots</h4>
          {['morning', 'afternoon', 'evening', 'night'].map((slot) => (
            <label key={slot}>
              <input
                type="checkbox"
                checked={filters.timeslots.includes(slot)}
                onChange={() => onFilterChange('timeslots', slot)}
              />
              {slot.charAt(0).toUpperCase() + slot.slice(1)}
            </label>
          ))}
        </div>

        <div className="filter-section">
          <h4>Available Days</h4>
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
            <label key={day}>
              <input
                type="checkbox"
                checked={filters.availableDays.includes(day)}
                onChange={() => onFilterChange('availableDays', day)}
              />
              {day}
            </label>
          ))}
        </div>

        <div className="filter-section">
          <h4>Minimum Rating</h4>
          {[1, 2, 3, 4, 5].map((rating) => (
            <label key={rating}>
              <input
                type="radio"
                name="minRating"
                checked={filters.minRating === rating}
                onChange={() => onFilterChange('minRating', rating)}
              />
              {rating}★ & above
            </label>
          ))}
        </div>

        <button className="apply-filter-btn" onClick={applyFilters}>
          Apply Filters
        </button>
      </div>

      {/* FILTERED SERVICE CARDS */}
      <div className="slideshow-container">
        {filteredServices.length > 0 ? (
          <>
            <button className="slide-nav-btn prev-btn" onClick={prevSlide} disabled={totalSlides <= 1}>
              <FaChevronLeft />
            </button>

            <div className="slideshow-cards-container">
              <div className="slideshow-cards">
                {currentServices.map((service) => (
                  <div key={service.id} className="service-card">
                    <h4>{service.serviceTitle}</h4>
                    <span className="category-badge">{service.category}</span>

                    <div className="my-2">
                      <strong>Rating:</strong>{' '}
                      {ratings[service.id]
                        ? renderStars(ratings[service.id].average_rating)
                        : 'No ratings yet'}
                    </div>

                    <div className="my-2">
                      <strong>Available Days:</strong>{' '}
                      {Array.isArray(service.availableDays)
                        ? service.availableDays.join(', ')
                        : 'N/A'}
                    </div>

                    <div className="my-2">
                      <strong>Duration:</strong> {service.duration} mins | <strong>Slots:</strong>{' '}
                      {Array.isArray(service.timeSlots)
                        ? service.timeSlots.map(formatTime).join(', ')
                        : 'No time slots'}
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

                    <button className="book-now-btn" onClick={() => handleBookNow(service.id)}>
                      Book Now
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button className="slide-nav-btn next-btn" onClick={nextSlide} disabled={totalSlides <= 1}>
              <FaChevronRight />
            </button>
          </>
        ) : (
          <div className="no-services-message">No services available for the selected filters.</div>
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
    </div>
  );
};

export default ServiceFiltersAndSlideshow;

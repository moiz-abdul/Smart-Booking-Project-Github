import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight, FaClock, FaCalendarAlt, FaStar } from 'react-icons/fa';
import './Home.css';

const ServiceFiltersAndSlideshow = ({
  handleBookNow,
  formatTime
}) => {
  const [categories, setCategories] = useState({});
  const [currentSlide, setCurrentSlide] = useState(0);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ratings, setRatings] = useState({});
  const [filters, setFilters] = useState({
    timeslots: [],
    availableDays: [],
    minRating: null
  });
  const [activeFilterTab, setActiveFilterTab] = useState('timeslots'); // Default active tab

  // Fetch data useEffect remains the same
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        
        // Fetch categories first
        try {
          const categoriesRes = await fetch('http://localhost:5000/api/homepagecardservices/categories');
          const categoriesData = await categoriesRes.json();
          
          const categoriesMap = {};
          
          if (categoriesData.success && Array.isArray(categoriesData.data)) {
            categoriesData.data.forEach(cat => {
              if (cat && cat.id) {
                categoriesMap[cat.id] = cat.name;
              }
            });
          } else if (Array.isArray(categoriesData)) {
            categoriesData.forEach(cat => {
              if (cat && cat.id) {
                categoriesMap[cat.id] = cat.name;
              }
            });
          }
          
          setCategories(categoriesMap);
        } catch (catError) {
          console.error("Error fetching categories:", catError);
          try {
            const backupCategoriesRes = await fetch('http://localhost:5000/api/categories');
            const backupCategoriesData = await backupCategoriesRes.json();
            
            const categoriesMap = {};
            if (backupCategoriesData.success && Array.isArray(backupCategoriesData.data)) {
              backupCategoriesData.data.forEach(cat => {
                if (cat && cat.id) {
                  categoriesMap[cat.id] = cat.name;
                }
              });
            } else if (Array.isArray(backupCategoriesData)) {
              backupCategoriesData.forEach(cat => {
                if (cat && cat.id) {
                  categoriesMap[cat.id] = cat.name;
                }
              });
            }
            
            setCategories(categoriesMap);
          } catch (backupCatError) {
            console.error("Error fetching backup categories:", backupCatError);
          }
        }
        
        // Then fetch services and ratings
        const [servicesRes, ratingsRes] = await Promise.all([
          fetch('http://localhost:5000/api/homepagecardservices'),
          fetch('http://localhost:5000/api/homepagecardservices/ratings')
        ]);
        
        if (!servicesRes.ok || !ratingsRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const servicesData = await servicesRes.json();
        const ratingsData = await ratingsRes.json();
        
        // Process services
        const servicesList = servicesData.services || servicesData;
        if (!Array.isArray(servicesList)) {
          throw new Error('Unexpected services data format');
        }
        
        setServices(servicesList);

        // Process ratings
        if (ratingsData.success) {
          const ratingsMap = {};
          ratingsData.data.forEach(item => {
            ratingsMap[item.service_id] = item;
          });
          setRatings(ratingsMap);
        }

        setError(null);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Rest of the functions remain the same
  const fetchServices = async (filterParams = null) => {
    try {
      setLoading(true);
      const url = 'http://localhost:5000/api/homepagecardservices';
     
      const endpoint = filterParams ? `${url}/filter` : url;
      const method = filterParams ? 'POST' : 'GET';

      const options = {
        method,
        headers: {
          'Content-Type': 'application/json'
        }
      };

      if (filterParams) {
        options.body = JSON.stringify(filterParams);
      }

      const response = await fetch(endpoint, options);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const servicesData = data.services || data;

      if (!Array.isArray(servicesData)) {
        throw new Error('Unexpected response format from server');
      }

      setServices(servicesData);
      setError(null);
    } catch (error) {
      console.error('Error during fetchServices:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

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
    console.log('Applying filters:', filters);
    await fetchServices(filters);
  };

  const servicesPerSlide = 3;
  const totalSlides = Math.max(1, Math.ceil(services.length / servicesPerSlide));

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + totalSlides) % totalSlides);
  };

  const currentServices = services.slice(
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

  const getServiceProperty = (service, propertyName, fallback = 'N/A') => {
    const propertyMappings = {
      serviceTitle: ['serviceTitle', 'service_title', 'title'],
      category: ['category', 'categoryname', 'service_category'],
      availableDays: ['availableDays', 'available_days'],
      category_id: ['category_id', 'categoryId'],
      duration: ['duration', 'duration_minutes'],
      timeSlots: ['timeSlots', 'time_slots', 'slots'],
      regularPrice: ['regularPrice', 'regular_price', 'price', 'pay_per_booking_price'],
      memberPrice: ['memberPrice', 'member_price', 'membership_price'],
      location: ['location']
    };

    const possibleKeys = propertyMappings[propertyName] || [propertyName];

    for (const key of possibleKeys) {
      if (service[key] !== undefined) {
        return service[key];
      }
    }

    return fallback;
  };

  const formatAvailableDays = (days) => {
    if (!days) return 'N/A';
    
    if (Array.isArray(days)) {
      return days.join(', ');
    } else if (typeof days === 'string') {
      return days.split(',').join(', ');
    }
    return 'N/A';
  };

  const formatTimeSlots = (service) => {
    // Check for the specific slot_1_time format first
    const individualSlots = [];
    for (let i = 1; i <= 3; i++) {
      const slotKey = `slot_${i}_time`;
      if (service[slotKey] && service[slotKey] !== '00:00:00') {
        // Format the time to include AM/PM
        const formattedTime = formatTimeWithAMPM(service[slotKey]);
        individualSlots.push(formattedTime);
      }
    }
    
    if (individualSlots.length > 0) {
      return individualSlots.join(', ');
    }
    
    // Fall back to other time slot formats
    const slots = getServiceProperty(service, 'timeSlots', []);
    if (Array.isArray(slots) && slots.length > 0) {
      return slots.map(slot => formatTimeWithAMPM(slot)).join(', ');
    }
    
    return 'No time slots';
  };
  
  // Helper function to format time with AM/PM
  const formatTimeWithAMPM = (timeStr) => {
    if (!timeStr) return '';
    
    try {
      // Parse the time string (assumes format like "11:00:00")
      const [hours, minutes] = timeStr.split(':').map(num => parseInt(num, 10));
      
      // Determine if it's AM or PM
      const period = hours >= 12 ? 'PM' : 'AM';
      
      // Convert to 12-hour format
      const displayHours = hours % 12 || 12;
      
      // Format the time
      return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
    } catch (error) {
      console.error('Error formatting time:', error);
      return timeStr; // Return original string if parsing fails
    }
  };

  const getCategoryName = (service) => {
    if (!service) return 'Uncategorized';
    
    // First check if service already has a category name directly
    if (service.category) {
      return service.category;
    }
    
    // Try different possible category ID field names
    const categoryId = service.category_id || service.categoryId || service.categoryID;
    
    if (!categoryId) {
      return 'Uncategorized';
    }
    
    // Convert to string in case the ID is stored as different types
    const categoryName = categories[categoryId] || categories[String(categoryId)] || categories[Number(categoryId)];
    
    return categoryName || 'Uncategorized';
  };

  // New function to render the appropriate filter section based on active tab
  const renderFilterSection = () => {
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
                    checked={filters.timeslots.includes(slot)}
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
                    checked={filters.availableDays.includes(day)}
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
    <div className="filters-and-results-wrapper">
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
          
          <button className="apply-filter-btn" onClick={applyFilters}>
            Apply Filters
          </button>
        </div>
      </div>

      <div className="slideshow-container">
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading services...</p>
          </div>
        ) : error ? (
          <div className="error-message">
            <p>Error: {error}</p>
          </div>
        ) : services.length > 0 ? (
          <>
            <button className="slide-nav-btn prev-btn" onClick={prevSlide} disabled={totalSlides <= 1}>
              <FaChevronLeft />
            </button>

            <div className="slideshow-cards-container">
              <div className="slideshow-cards">
                {currentServices.map((service) => (
                  <div key={service.id} className="service-card">
                    <h4>{getServiceProperty(service, 'serviceTitle')}</h4>
                    <span className="category-badge">
                      {getCategoryName(service)}
                    </span>
                    
                    <div className="service-rating">
                      {service.average_rating ? (
                        renderStars(service.average_rating)
                      ) : (
                        <span className="no-rating">No ratings yet</span>
                      )}
                    </div>

                    <div className="service-details">
                      <div className="detail-item">
                        <FaCalendarAlt className="detail-icon" />
                        <span>{formatAvailableDays(getServiceProperty(service, 'availableDays'))}</span>
                      </div>

                      <div className="detail-item">
                        <FaClock className="detail-icon" />
                        <span>{getServiceProperty(service, 'duration')} mins | {formatTimeSlots(service)}</span>
                      </div>

                      <div className="price-info">
                        <span className="regular-price">${getServiceProperty(service, 'regularPrice')}</span>
                        {getServiceProperty(service, 'memberPrice') && (
                          <span className="member-price">
                            ${getServiceProperty(service, 'memberPrice')} for members
                          </span>
                        )}
                      </div>

                      <div className="detail-item">
                        <strong>Location:</strong> {getServiceProperty(service, 'location')}
                      </div>
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
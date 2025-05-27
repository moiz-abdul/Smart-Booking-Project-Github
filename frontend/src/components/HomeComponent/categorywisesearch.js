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
  FaChevronLeft
} from 'react-icons/fa';

const Home = () => {
  const [activeTab, setActiveTab] = useState('customer');
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState({});
  const slideInterval = useRef(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [categoriesRes, ratingsRes] = await Promise.all([
          fetch('http://localhost:5000/api/homepagecardservices/categories'),
          fetch('http://localhost:5000/api/homepagecardservices/ratings')
        ]);

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
      } catch (error) {
        console.error("Error fetching categories/ratings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const performSearch = useCallback(async () => {
    const url =
      searchQuery.trim() === ''
        ? 'http://localhost:5000/api/homepagecardservices/allservices'
        : `http://localhost:5000/api/homepagecardservices/search?query=${encodeURIComponent(searchQuery)}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.success) {
        setServices(data.data);
        setCurrentSlide(0);
      }
    } catch (error) {
      console.error("Error performing search:", error);
    }
  }, [searchQuery]);

  useEffect(() => {
    performSearch();
  }, [performSearch]);

  const filteredServices =
    selectedCategory === 'all'
      ? services
      : services.filter(service => service.category === selectedCategory);

  const servicesPerSlide = 3;
  const totalSlides = Math.max(1, Math.ceil(filteredServices.length / servicesPerSlide));

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const currentServices = filteredServices.slice(
    currentSlide * servicesPerSlide,
    (currentSlide + 1) * servicesPerSlide
  );

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

  return (
    <div>
      {/* SEARCH BY CATEGORIES SECTION */}
      <div className="category-filters">
        {categories.map(category => (
          <button
            key={category.id}
            className={`category-btn ${selectedCategory === category.id ? 'selected-category' : ''}`}
            onClick={() => {
              setSelectedCategory(category.id);
              setCurrentSlide(0);
            }}
          >
            <span className="category-icon">{category.icon}</span>
            {category.name}
          </button>
        ))}
      </div>

      {/* CATEGORY SERVICES SLIDESHOW */}
      <section className="services-slideshow-section">
        <div className="section-heading">
          <h2>
            {selectedCategory === 'all'
              ? 'All Services'
              : `${categories.find(c => c.id === selectedCategory)?.name} Services`}
          </h2>
        </div>

        <div className="slideshow-container">
          {filteredServices.length > 0 ? (
            <>
              <button
                className="slide-nav-btn2 prev-btn"
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

                      {/* Rating Display */}
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
                        <strong>Location:</strong> {service.location}
                      </div>

                      <button className="book-now-btn" onClick={() => handleBookNow(service.id)}>
                        Book Now
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <button
                className="slide-nav-btn2 next-btn"
                onClick={nextSlide}
                disabled={totalSlides <= 1}
              >
                <FaChevronRight />
              </button>
            </>
          ) : (
            <div className="no-services-message">
              No services available for this category.
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
    </div>
  );
};

export default Home;

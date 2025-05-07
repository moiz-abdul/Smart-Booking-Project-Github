
//import logo from '../../Assets/images/logoblack.JPG';
import ServiceFiltersAndSlideshow from './filterslideshow'

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaCalendarAlt, FaUserMd, FaSearch, FaCreditCard, FaRegStar, FaSignInAlt, FaUserPlus, FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import { MdCategory, MdNotifications } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import Categorywisesearch from './categorywisesearch'

// Home Component
const HomePage = () => {
  const [activeTab, setActiveTab] = useState('customer');
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [SearchKeycurrentSlide, setSearchKeycurrentSlide] = useState(0);
  const [FiltersApplycurrentSlide, setFiltersApplycurrentSlide] = useState(0);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState({});
  const slideInterval = useRef(null);
  const [filters, setFilters] = useState({
    timeslots: [],
    availableDays: [],
    minRating: null
  });

  const navigate = useNavigate();

  // Fetch services and ratings
  // Fetch categories, services, and ratings
  useEffect(() => {
    const fetchData = async () => {
        try {
            // Fetch categories, services, and ratings in parallel
            const [categoriesRes, servicesRes, ratingsRes] = await Promise.all([
                fetch('http://localhost:5000/api/homepagecardservices/categories'),
                fetch('http://localhost:5000/api/homepagecardservices/allservices'),
                fetch('http://localhost:5000/api/homepagecardservices/ratings')
            ]);

            const categoriesData = await categoriesRes.json();
            const servicesData = await servicesRes.json();
            const ratingsData = await ratingsRes.json();

            if (categoriesData.success) {
                setCategories(categoriesData.data);
            }

            if (servicesData.success) {
                setServices(servicesData.data);
            }

            if (ratingsData.success) {
                const ratingsMap = {};
                ratingsData.data.forEach(item => {
                    ratingsMap[item.service_id] = item;
                });
                setRatings(ratingsMap);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    fetchData();
}, []);

      // Fetch services for  search keyword 

      const performSearch = useCallback(async () => {
        if (searchQuery.trim() === '') {
            // If search query is empty, fetch all services
            try {
                const response = await fetch('http://localhost:5000/api/homepagecardservices/allservices');
                const data = await response.json();
                
                if (data.success) {
                    setServices(data.data);
                    setSearchKeycurrentSlide(0);
                }
            } catch (error) {
                console.error("Error fetching all services:", error);
            }
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/homepagecardservices/search?query=${encodeURIComponent(searchQuery)}`);
            const data = await response.json();
            
            if (data.success) {
                setServices(data.data);
                setSearchKeycurrentSlide(0);
            }
        } catch (error) {
            console.error("Error performing search:", error);
        }
    }, [searchQuery]);

    // Trigger search when search query changes
    useEffect(() => {
        performSearch();
    }, [performSearch]);


  //  Fetch  Services Card on the basis of  Filter Data
  
  

  const filteredServices = selectedCategory === 'all'
  ? services
  : services.filter(service => service.category === selectedCategory);

  // Calculate how many slides are needed
  const servicesPerSlide = 3;
  const totalSlides = Math.max(1, Math.ceil(filteredServices.length / servicesPerSlide));

  // Move to next slide
  const nextSlide = () => {
  setCurrentSlide((prevSlide) => (prevSlide + 1) % totalSlides);
  };

  // Move to previous slide
  const prevSlide = () => {
  setCurrentSlide((prevSlide) => 
    (prevSlide - 1 + totalSlides) % totalSlides);
  };

  // Get current slide services
  const currentServices = filteredServices.slice(
  currentSlide * servicesPerSlide,
  (currentSlide + 1) * servicesPerSlide
  );



  // Auto-advance slideshow every 5 seconds
  useEffect(() => {
    slideInterval.current = setInterval(() => {
      if (filteredServices.length > 3) {
        setCurrentSlide((prev) => (prev + 1) % Math.ceil(filteredServices.length / 3));
      }
    }, 5000);

    return () => {
      if (slideInterval.current) {
        clearInterval(slideInterval.current);
      }
    };
  }, [selectedCategory, services]);

  // Format time function
  const formatTime = (timeString) => {
    if (!timeString) return '';
    const time = new Date(`1970-01-01T${timeString}`);
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Render rating stars
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

  // Handle booking
  const handleBookNow = (serviceId) => {
    navigate(`/procurement/${serviceId}`);
  };

  // Handle feature clicks
  const handleFeatureClick = (feature) => {
    switch (feature) {
      case 'book-appointments':
        navigate('/book-appointments');
        break;
      case 'services-category':
        navigate('/services');
        break;
      case 'reminders':
        alert('Appointment reminders feature coming soon!');
        break;
      case 'payments':
        navigate('/payments');
        break;
      case 'reviews':
        navigate('/reviews');
        break;
      default:
        break;
    }
  };



  // FILTER SERVICES BY CATEGORY SECTION END  


// Search button handler
const handleSearch = () => {
  performSearch();
};


// FILTER SERVICES BY SEARCH SECTION START 


  // Filter services by Search Keyword

const SearchkeyfilteredServices = searchQuery.trim() === ''
  ? services
  : services.filter(service => 
      service.serviceTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.providerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase())
    );


// Calculate how many slides are needed
const SearchkeyservicesPerSlide = 3;
const SearchkeytotalSlides = Math.max(1, Math.ceil(SearchkeyfilteredServices.length / SearchkeyservicesPerSlide));

// Move to next slide
const SearchkeynextSlide = () => {
  setSearchKeycurrentSlide((prevSlide) => (prevSlide + 1) % SearchkeytotalSlides);
};

// Move to previous slide
const SearchkeyprevSlide = () => {
  setSearchKeycurrentSlide((prevSlide) => (prevSlide - 1 + SearchkeytotalSlides) % SearchkeytotalSlides);
};

// Get current slide services
const SearchkeycurrentServices = SearchkeyfilteredServices.slice(
  SearchKeycurrentSlide * SearchkeyservicesPerSlide,
  (SearchKeycurrentSlide + 1) * SearchkeyservicesPerSlide
);
// FILTER SERVICES BY SEARCH SECTION END   
  

// FILTER SERVICES BY 3 FILTER APPLY SECTION START 

  // Filter services by  3 FILTER APPLY
  const FiltersApplyfilteredServices = services || [];

  // Calculate how many slides are needed
  const FiltersApplyservicesPerSlide = 3;
  const FiltersApplytotalSlides = Math.max(1, Math.ceil(FiltersApplyfilteredServices.length / FiltersApplyservicesPerSlide));

  // Move to next slide
  const FiltersApplynextSlide = () => {
  setFiltersApplycurrentSlide((FiltersApplyprevSlide) => (FiltersApplyprevSlide + 1) % FiltersApplytotalSlides);
  };

  // Move to previous slide
  const FiltersApplyprevSlide = () => {
  setFiltersApplycurrentSlide((FiltersApplyprevSlide) => (FiltersApplyprevSlide - 1 + FiltersApplytotalSlides) % FiltersApplytotalSlides);
  };

  // Get current slide services
  const FiltersApplycurrentServices = FiltersApplyfilteredServices.slice(
  FiltersApplycurrentSlide * FiltersApplyservicesPerSlide,
  (FiltersApplycurrentSlide + 1) * FiltersApplyservicesPerSlide
  );

  // FILTER SERVICES BY 3 FILTER APPLY SECTION END


  // Mock data for featured service providers
  const featuredProviders = [
    { id: 1, name: "Dr. Sarah Johnson", specialty: "Cardiologist", rating: 4.9, availableSlots: 3, category: "medical" },
    { id: 2, name: "Alex Rodriguez", specialty: "Fitness Trainer", rating: 4.8, availableSlots: 7, category: "fitness" },
    { id: 3, name: "Emma Williams", specialty: "Nutritionist", rating: 4.7, availableSlots: 5, category: "medical" },
    { id: 4, name: "Dr. Michael Chen", specialty: "Dermatologist", rating: 4.9, availableSlots: 2, category: "medical" },
  ];

  if (loading) return <div className="text-center py-5">Loading services...</div>;

  return (
    <div className="homepage-wrapper">
      <main>

        {/* Hero section of search keyword START */}

        <section className="hero-section">
                <div className="hero-content">
                    <h1>Book Your Services Online</h1>
                    <p>Find and book appointments with top professionals in your area</p>

                    <div className="search-box">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search services, providers..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    handleSearch();
                                }
                            }}
                        />
                        <button 
                            className="search-btn"
                            onClick={handleSearch}
                        >
                            Search
                        </button>
                    </div>
                </div>
            </section>


            <section className="services-slideshow-section">
    <div className="section-heading">
        <h2>
            {searchQuery 
                ? `Search Results for "${searchQuery}"` 
                : 'Services'}
        </h2>
    </div>

    <div className="slideshow-container">
        {SearchkeyfilteredServices.length > 0 ? (
            <>
                <button
                    className="slide-nav-btn prev-btn"
                    onClick={SearchkeyprevSlide}
                    disabled={SearchkeytotalSlides <= 1}
                >
                    <FaChevronLeft />
                </button>

                <div className="slideshow-cards-container">
                    <div className="slideshow-cards">
                    
                    {/* Show Service CARDS OF APPLIED KEYWORD SEARCH START */}

    <div className="slideshow-cards-container">
    <div className="slideshow-cards">
                    {SearchkeycurrentServices.map((service) => (
                      <div key={service.id} className="service-card">
                        <h4>{service.serviceTitle}</h4>
                        <span className="category-badge">{service.category}</span>

                        {/* Rating Display */}
                        <div className="my-2">
                          <strong>Rating:</strong>
                          {ratings[service.id] ? (
                            renderStars(ratings[service.id].average_rating)
                          ) : (
                            <span className="text-muted">No ratings yet</span>
                          )}
                        </div>

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
                          className="book-now-btn"
                          onClick={() => handleBookNow(service.id)}
                        >
                          Book Now
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

        {/* Show Service CARDS OF APPLIED KEYWORD SEARCH END */}

        
                    </div>
                    
                </div>

                
                <button


                    className="slide-nav-btn next-btn"
                    onClick={SearchkeynextSlide}
                    disabled={SearchkeytotalSlides <= 1}
                >
                    <FaChevronRight />
                </button>
            </>
        ) : (
            <div className="no-services-message">
                {searchQuery 
                    ? `No services found for "${searchQuery}"` 
                    : "No services available"}
            </div>
        )}
    </div>

    <ServiceFiltersAndSlideshow/>
    {/* Search Slideshow navigation dots */}
    {SearchkeytotalSlides > 1 && (
        <div className="slideshow-dots">
            {[...Array(SearchkeytotalSlides)].map((_, index) => (
                <div
                    key={index}
                    className={`dot ${SearchKeycurrentSlide === index ? 'active-dot' : ''}`}
                    onClick={() => setSearchKeycurrentSlide(index)}
                ></div>
            ))}
        </div>
    )}
</section>
        
           {/* Hero section of search keyword END  */}



        {/* Role-specific features section */}
        <section className="features-section">
          <div className="section-heading">
            <h2>{activeTab === 'customer' ? 'Customer Features' : 'Service Provider Features'}</h2>
          </div>

          <div className="features-grid">
            {activeTab === 'customer' && (
              <>
                <div
                  className="feature-card"
                  tabIndex={0}
                  role="button"
                  onClick={() => handleFeatureClick('book-appointments')}
                  onKeyPress={e => (e.key === 'Enter' || e.key === ' ') && handleFeatureClick('book-appointments')}
                >
                  <FaCalendarAlt className="feature-icon" />
                  <h3>Book Appointments</h3>
                  <p>Browse and book available time slots with your preferred service providers</p>
                </div>
                <div
                  className="feature-card"
                  tabIndex={0}
                  role="button"
                  onClick={() => handleFeatureClick('services-category')}
                  onKeyPress={e => (e.key === 'Enter' || e.key === ' ') && handleFeatureClick('services-category')}
                >
                  <MdCategory className="feature-icon" />
                  <h3>Services by Category</h3>
                  <p>Find services organized by categories for easy browsing</p>
                </div>

                <div
                  className="feature-card"
                  tabIndex={0}
                  role="button"
                  onClick={() => handleFeatureClick('payments')}
                  onKeyPress={e => (e.key === 'Enter' || e.key === ' ') && handleFeatureClick('payments')}
                >
                  <FaCreditCard className="feature-icon" />
                  <h3>Flexible Payment Options</h3>
                  <p>Choose between membership subscriptions or pay-per-booking</p>
                </div>
                <div
                  className="feature-card"
                  tabIndex={0}
                  role="button"
                  onClick={() => handleFeatureClick('reviews')}
                  onKeyPress={e => (e.key === 'Enter' || e.key === ' ') && handleFeatureClick('reviews')}
                >
                  <FaRegStar className="feature-icon" />
                  <h3>Reviews & Ratings</h3>
                  <p>Rate service providers and read reviews from other customers</p>
                </div>
              </>
            )}

            {activeTab === 'provider' && (
              <>
                <div className="feature-card">
                  <FaCalendarAlt className="feature-icon" />
                  <h3>Manage Time Slots</h3>
                  <p>Update your availability and manage your schedule</p>
                </div>
                <div className="feature-card">
                  <MdNotifications className="feature-icon" />
                  <h3>Booking Notifications</h3>
                  <p>Receive instant notifications for new appointment requests</p>
                </div>
                <div className="feature-card">
                  <FaUserMd className="feature-icon" />
                  <h3>Service Management</h3>
                  <p>Edit the services you offer and their details</p>
                </div>
                <div className="feature-card">
                  <FaCreditCard className="feature-icon" />
                  <h3>Revenue Reports</h3>
                  <p>View and analyze your earnings over custom time periods</p>
                </div>
                <div className="feature-card">
                  <FaRegStar className="feature-icon" />
                  <h3>Customer Reviews</h3>
                  <p>Review your customers and see your ratings</p>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Featured Providers Section (shown only in customer tab) */}
        {activeTab === 'customer' && (
          <section className="featured-providers-section">
            <div className="section-heading">
              <h2>Featured Service Providers</h2>
            </div>
            <div className="providers-grid">
              {featuredProviders.map(provider => (
                <div key={provider.id} className="provider-card">
                  <div className="provider-avatar">
                    {provider.name.charAt(0)}
                  </div>
                  <h3>{provider.name}</h3>
                  <p className="provider-specialty">{provider.specialty}</p>
                  <div className="provider-rating">
                    <span className="stars">{'★'.repeat(Math.floor(provider.rating))}{'☆'.repeat(5 - Math.floor(provider.rating))}</span>
                    <span className="rating-value">{provider.rating}</span>
                  </div>
                  <div className="available-slots">
                    <FaCalendarAlt /> {provider.availableSlots} slots available today
                  </div>
                  <button className="book-now-btn">Book Now</button>
                </div>
              ))}
            </div>
          </section>
        )}

          

          
 


        {/* Call to action section */}
        <section className="cta-section">
          <h2>Ready to get started?</h2>
          <p>Join thousands of users who are already enjoying our Smart Booking System</p>
          <div className="cta-buttons">
            <button
              className="cta-primary"
              onClick={() => navigate('/register')}
            >
              Sign Up Now
            </button>
          </div>
        </section>
        <Categorywisesearch/>
      </main>


      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
        
            <h3>Smart Booking System</h3>
            <p>Efficiently manage appointments and bookings online</p>
          </div>
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="#">Home</a></li>
              <li><a href="#">Services</a></li>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Contact Us</h3>
            <p>Email: support@smartbooking.com</p>
            <p>Phone: (123) 456-7890</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Smart Booking Management System. All rights reserved.</p>
        </div>
      </footer>

      <style jsx>{`
        /* General Styles */
        .homepage-wrapper {
          font-family: 'Segoe UI', sans-serif;
          color: #333;
        }

        /* Hero Section */
        .hero-section {
          height: 70vh;
          background-image: url('https://images.unsplash.com/photo-1556761175-4b46a572b786?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80');
          background-size: cover;
          background-position: center;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          text-align: center;
          position: relative;
        }
          .footer-logo {
  width: 100px;
  height: auto;
}


        .hero-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0,0,0,0.6);
        }

        .hero-content {
          position: relative;
          z-index: 1;
          width: 80%;
          max-width: 800px;
        }

        .hero-content h1 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
        }

        .hero-content p {
          font-size: 1.2rem;
          margin-bottom: 2rem;
          text-shadow: 1px 1px 3px rgba(0,0,0,0.5);
        }

        .search-box {
          display: flex;
          align-items: center;
          background-color: white;
          border-radius: 30px;
          padding: 0.5rem 1rem;
          margin-bottom: 2rem;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        }

        .search-icon {
          color: #777;
          margin-right: 0.5rem;
        }

        .search-box input {
          flex: 1;
          border: none;
          padding: 0.5rem;
          font-size: 1rem;
          outline: none;
        }

        .search-btn {
          background-color: orange;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          cursor: pointer;
          font-weight: bold;
        }

        .category-filters {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .category-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          background-color: rgba(255,255,255,0.9);
          border: none;
          border-radius: 10px;
          padding: 0.8rem 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          color: #333;
        }

        .category-icon {
          font-size: 1.5rem;
          margin-bottom: 0.3rem;
        }

        .selected-category {
          background-color: orange;
          color: white;
        }

        /* Services Slideshow Section Styles */
        .services-slideshow-section {
          padding: 4rem 5%;
          background-color: #f9f9f9;
          overflow: hidden;
        }

        .slideshow-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          position: relative;
          margin: 2rem 0;
        }

        .slideshow-cards-container {
          flex: 1;
          overflow: hidden;
          max-width: 1200px;
        }

        .slideshow-cards {
          display: flex;
          gap: 1.5rem;
          width: 100%;
          justify-content: center;
        }

        .service-card {
          background-color: white;
          padding: 1.5rem;
          border-radius: 10px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          flex: 1;
          min-width: 250px;
          max-width: 350px;
          transition: transform 0.3s ease;
        }

        .service-card:hover {
          transform: translateY(-10px);
        }

        .category-badge {
          background-color: #f8f9fa;
          padding: 3px 8px;
          border-radius: 4px;
          font-size: 0.8rem;
          color: #6c757d;
        }

        .star-rating {
          display: inline-flex;
          align-items: center;
        }

        .star-rating i {
          font-size: 1rem;
          margin-right: 2px;
        }

        .slide-nav-btn {
          background-color: orange;
          color: white;
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          z-index: 5;
        }

        .slide-nav-btn:hover {
          background-color: #e67e00;
        }

        .slide-nav-btn:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }

        .slideshow-dots {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 1rem;
        }

        .dot {
          width: 10px;
          height: 10px;
          background-color: #ccc;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .active-dot {
          background-color: orange;
          transform: scale(1.2);
        }

        .book-now-btn {
          background-color: orange;
          color: white;
          border: none;
          padding: 0.6rem 1.5rem;
          border-radius: 5px;
          cursor: pointer;
          font-weight: bold;
          transition: all 0.3s ease;
          width: 100%;
          margin-top: 1rem;
        }

        .book-now-btn:hover {
          background-color: #e67e00;
        }

        .no-services-message {
          text-align: center;
          padding: 2rem;
          background-color: white;
          border-radius: 10px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          width: 100%;
        }

        /* Features Section */
        .features-section {
          padding: 4rem 5%;
        }

        .section-heading {
          text-align: center;
          margin-bottom: 3rem;
        }

        .section-heading h2 {
          font-size: 2rem;
          color: #333;
          position: relative;
          padding-bottom: 1rem;
        }

        .section-heading h2::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 100px;
          height: 4px;
          background-color: orange;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 2rem;
        }

        .feature-card {
          background-color: white;
          padding: 2rem;
          border-radius: 10px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          text-align: center;
          transition: transform 0.3s ease;
          cursor: pointer;
        }

        .feature-card:hover {
          transform: translateY(-10px);
        }

        .feature-icon {
          font-size: 2.5rem;
          color: orange;
          margin-bottom: 1rem;
        }

        .feature-card h3 {
          font-size: 1.2rem;
          margin-bottom: 1rem;
        }

        .feature-card p {
          color: #666;
          font-size: 0.9rem;
        }

        /* Featured Providers Section */
        .featured-providers-section {
          padding: 4rem 5%;
          background-color: #f9f9f9;
        }

        .providers-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 2rem;
        }

        .provider-card {
          background-color: white;
          padding: 2rem;
          border-radius: 10px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          text-align: center;
          transition: transform 0.3s ease;
        }

        .provider-card:hover {
          transform: translateY(-10px);
        }

        .provider-avatar {
          width: 80px;
          height: 80px;
          background-color: orange;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          margin: 0 auto 1rem;
        }

        .provider-specialty {
          color: #666;
          margin-bottom: 1rem;
        }

        .provider-rating {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .stars {
          color: orange;
          font-size: 1.1rem;
        }

        .rating-value {
          font-weight: bold;
        }

        .available-slots {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          color: #666;
          font-size: 0.9rem;
          margin-bottom: 1.5rem;
        }

        /* CTA Section */
        .cta-section {
          padding: 4rem 5%;
          text-align: center;
          background-color: #f0f0f0;
        }

        .cta-section h2 {
          font-size: 2rem;
          margin-bottom: 1rem;
        }

        .cta-section p {
          margin-bottom: 2rem;
          font-size: 1.1rem;
          color: #555;
        }

        .cta-buttons {
          display: flex;
          justify-content: center;
          gap: 1rem;
        }

        .cta-primary, .cta-secondary {
          padding: 0.8rem 2rem;
          border-radius: 5px;
          cursor: pointer;
          font-weight: bold;
          transition: all 0.3s ease;
          font-size: 1rem;
        }

        .cta-primary {
          background-color: orange;
          color: white;
          border: none;
        }

        .cta-secondary {
          background-color: transparent;
          color: #333;
          border: 2px solid orange;
        }

        /* Footer */
        .footer {
          background-color: #333;
          color: white;
          padding: 3rem 5% 1rem;
        }

        .footer-content {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .footer-section h3 {
          font-size: 1.2rem;
          margin-bottom: 1rem;
          color: orange;
        }
        .footer-section ul {
          list-style: none;
          padding: 0;
        }

        .footer-section li {
          margin-bottom: 0.5rem;
        }

        .footer-section a {
          color: #ccc;
          text-decoration: none;
        }

        .footer-section a:hover {
          color: orange;
        }

        .footer-bottom {
          text-align: center;
          padding-top: 1.5rem;
          border-top: 1px solid #444;
          color: #888;
        }

        @media (max-width: 768px) {
          .nav-tabs {
            display: none;
          }

          .hero-content h1 {
            font-size: 2rem;
          }

          .features-grid, .providers-grid {
            grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          }

          .category-filters {
            gap: 0.5rem;
          }

          .category-btn {
            padding: 0.5rem;
            font-size: 0.8rem;
          }

          .category-icon {
            font-size: 1.2rem;
          }

          .slideshow-cards {
            flex-direction: column;
            align-items: center;
          }

          .slideshow-card {
            width: 100%;
            max-width: 300px;
          }
        }
      `}</style>
    </div>
  );
};


export default HomePage;
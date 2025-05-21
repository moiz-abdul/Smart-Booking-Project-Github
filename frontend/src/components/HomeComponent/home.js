
//import logo from '../../Assets/images/logoblack.JPG';
import ServiceFiltersAndSlideshow from './filterslideshow'

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaCalendarAlt, FaBell, FaCalendarCheck, FaFilter, FaTags, FaUserMd, FaSearch, FaCreditCard, FaRegStar, FaSignInAlt, FaUserPlus, FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import { MdCategory, MdNotifications, MdPadding } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import Categorywisesearch from './categorywisesearch'
import { Button } from 'bootstrap';

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

// Reveal elements on scroll
function revealOnScroll() {
  const reveals = document.querySelectorAll('.reveal');
  
  reveals.forEach(element => {
    const windowHeight = window.innerHeight;
    const revealTop = element.getBoundingClientRect().top;
    const revealPoint = 50; // trigger point from bottom
    
    if (revealTop < windowHeight - revealPoint) {
      element.classList.add('active');
    }
  });
}

// Trigger on scroll and page load
window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);
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
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading) return <div className="text-center py-5">Loading services...</div>;

  return (
    <div className="homepage-wrapper">
      <main>

        {/* Hero section of search keyword START */}

        <section id='Searchbarsection' className="hero-section">
          <div className="hero-content">
            <h1>Book Your Services Online</h1>
            <p>Find and book appointments with top professionals in your area</p>

            <div className="search-box">
              <FaSearch className="search-icon" />
              <input className='searchinput'
                type="text"
                placeholder="    Search services, providers..."
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
            <div className="navigation-buttons">
              <button
                className="search-btn spacebetween"
                onClick={() => scrollToSection('Searchbarsection')} // Corrected id string
              >
                <FaSearch className="btn-icon spacebetween" />
                Filter by Search
              </button>

              <button
                className="search-btn spacebetween"
                onClick={() => scrollToSection('filtercategorysection')} // Add appropriate id here
              >
                <FaFilter className="btn-icon spacebetween" />
                Search Category by Filters
              </button>

              <button
                className="search-btn spacebetween"
                onClick={() => scrollToSection('categorysection')}
              >
                <FaTags className="btn-icon spacebetween" />
                Filter by Category
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
                  className="slide-nav-btn2 prev-btn"
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


                  className="slide-nav-btn2 next-btn"
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
           {/* Role-specific features section */}
        <section className="features-section">
          <div className="section-heading">
            <h2>Customer Features</h2>
          </div>

          <div className="features-grid">

            <>
              <div
                className="feature-card"


              >
                <FaCalendarAlt className="feature-icon" />
                <h3>Book Appointments</h3>
                <p>Browse and book available time slots with your preferred service providers</p>
              </div>
              <div
                className="feature-card"


              >
                <MdCategory className="feature-icon" />
                <h3>Get Service Providers by Category</h3>
                <p>Find services organized by categories for easy browsing</p>
              </div>

              <div
                className="feature-card"


              >
                <FaCreditCard className="feature-icon" />
                <h3>Flexible Payment Options</h3>
                <p>Choose between membership subscriptions or pay-per-booking</p>
              </div>
              <div
                className="feature-card"


              >
                <FaRegStar className="feature-icon" />
                <h3>Reviews & Ratings</h3>
                <p>Rate service providers and read reviews from other customers</p>
              </div>
            </>
            <div className="feature-card">
              <FaBell className="feature-icon" />
              <h3>Reminders & Notifications</h3>
              <p>Get timely alerts for upcoming appointments and important updates from your service providers</p>
            </div>
            <div className="feature-card">
              <FaSearch className="feature-icon" />
              <h3>Search Services</h3>
              <p>Find exactly what you need by searching for specific services offered by professionals</p>
            </div>
            <div className="feature-card">
              <FaCalendarCheck className="feature-icon" />
              <h3>Reschedules</h3>
              <p>Easily modify your bookings with flexible rescheduling options when plans change</p>
            </div>
            <div className="feature-card">
              <FaFilter className="feature-icon" />
              <h3>Search by Filters</h3>
              <p>Narrow down options using filters like Days, Time slots availability and rating </p>
            </div>



          </div>
        </section>
          <br></br>
          <br></br>
          <div className="section-heading">
            <h2>Search Category By Filters</h2>
          </div>

          <div id='filtercategorysection' >
            <br></br>
            <ServiceFiltersAndSlideshow />
          </div>
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

{/* Provider Features Section */}
<section className="features-section">
  <div className="section-heading">
    <h2>Provider Features</h2>
  </div>

  <div className="features-grid">
    <div className="feature-card">
      <FaUserMd className="feature-icon" />
      <h3>Profile Management</h3>
      <p>Create and manage your professional profile to showcase your services and expertise</p>
    </div>
    
    <div className="feature-card">
      <FaCalendarAlt className="feature-icon" />
      <h3>Appointment Management</h3>
      <p>Add, Delete or Modify Your Services easily. Manage your schedule, availability, and client appointments</p>
    </div>
    
    <div className="feature-card">
      <FaRegStar className="feature-icon" />
      <h3>Client Reviews</h3>
      <p>Receive and respond to client feedback to build your reputation</p>
    </div>
    
    <div className="feature-card">
      <FaBell className="feature-icon" />
      <h3>Notifications & Reminders</h3>
      <p>Automated reminders to manage Booking Service and Client notifications to reduce no-shows</p>
    </div>
    
    <div className="feature-card">
      <FaSearch className="feature-icon" />
      <h3>Service Visibility</h3>
      <p>Increase your discoverability with optimized search results</p>
    </div>
    
    <div className="feature-card">
      <FaCalendarCheck className="feature-icon" />
      <h3>Booking Customization</h3>
      <p>Set your Service Durations, Available Days and Timeslots, and Booking rules</p>
    </div>
    
    <div className="feature-card">
      <FaFilter className="feature-icon" />
      <h3>Client Management</h3>
      <p>Track client history, preferences and special requirements</p>
    </div>

    <div className="feature-card">
      <FaFilter className="feature-icon" />
      <h3>Revenue Report</h3>
      <p>View and track earnings easily</p>
    </div>

  </div>
</section>
       

        {/* Featured Providers Section (shown only in customer tab) */}
        {/*
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
                <div id='categorysection' className="available-slots">
                  <FaCalendarAlt /> {provider.availableSlots} slots available today
                </div>
                <button className="book-now-btn">Book Now</button>
              </div>
            ))}
          </div>
          <div ></div>
        </section>


*/}
<div id='categorysection' className="available-slots"></div>
        <br></br>
        <br></br>
        <div className="section-heading spacebetween2">
          <h2>  Services by Category</h2>
        </div>


        <div >
          <Categorywisesearch />
        </div>
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

      </main>


      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">

            <h3>Smart Booking System</h3>
            <p>Efficiently manage appointments and bookings online</p>
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


    </div>
  );
};


export default HomePage;
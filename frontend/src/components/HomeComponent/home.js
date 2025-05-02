import React, { useState, useEffect} from 'react';
import { FaCalendarAlt, FaUserMd, FaSearch, FaCreditCard, FaRegStar, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import { MdCategory, MdNotifications } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";

// import Header from '../../Layouts/UserLayout/UserNavbar';


const HomePage = () => {
  const [activeTab, setActiveTab] = useState('customer');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSlideCategory, setSelectedSlideCategory] = useState('all');
  const [currentSlide, setCurrentSlide] = useState(0);

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

  // Categories data
  const categories = [
    { id: 'medical', name: 'Medical', icon: '🏥' },
    { id: 'fitness', name: 'Fitness', icon: '💪' },
    { id: 'consultation', name: 'Consultation', icon: '📋' },
    { id: 'coworking', name: 'Co-working', icon: '💼' },
    { id: 'education', name: 'Education', icon: '🎓' },
    { id: 'all', name: 'All Services', icon: '🔍' },
  ];

  // Mock data for service providers
  const serviceProviders = [
    { id: 1, name: "Dr. Sarah Johnson", specialty: "Cardiologist", rating: 4.9, availableSlots: 3, category: "medical" },
    { id: 2, name: "Alex Rodriguez", specialty: "Fitness Trainer", rating: 4.8, availableSlots: 7, category: "fitness" },
    { id: 3, name: "Emma Williams", specialty: "Nutritionist", rating: 4.7, availableSlots: 5, category: "medical" },
    { id: 4, name: "Legal Associates", specialty: "Law Firm", rating: 4.6, availableSlots: 2, category: "consultation" },
    { id: 5, name: "WeWork", specialty: "Co-working Space", rating: 4.5, availableSlots: 10, category: "coworking" },
    { id: 6, name: "Tutor Pro", specialty: "Online Tutoring", rating: 4.8, availableSlots: 8, category: "education" },
    { id: 7, name: "Dr. Michael Chen", specialty: "Dermatologist", rating: 4.9, availableSlots: 2, category: "medical" },
    { id: 8, name: "Yoga Studio", specialty: "Yoga Classes", rating: 4.7, availableSlots: 6, category: "fitness" },
  ];

  // Mock data for featured service providers
  const featuredProviders = [
    { id: 1, name: "Dr. Sarah Johnson", specialty: "Cardiologist", rating: 4.9, availableSlots: 3, category: "medical" },
    { id: 2, name: "Alex Rodriguez", specialty: "Fitness Trainer", rating: 4.8, availableSlots: 7, category: "fitness" },
    { id: 3, name: "Emma Williams", specialty: "Nutritionist", rating: 4.7, availableSlots: 5, category: "medical" },
    { id: 4, name: "Dr. Michael Chen", specialty: "Dermatologist", rating: 4.9, availableSlots: 2, category: "medical" },
  ];

  // Mock data for slideshow providers
  const slideshowProviders = [
    { id: 5, name: "Dr. John Smith", specialty: "Pediatrician", rating: 4.9, availableSlots: 4, category: "medical" },
    { id: 6, name: "Mary Johnson", specialty: "Personal Trainer", rating: 4.7, availableSlots: 6, category: "fitness" },
    { id: 7, name: "Robert Lee", specialty: "Tax Attorney", rating: 4.8, availableSlots: 3, category: "consultation" },
    { id: 8, name: "Sophia Garcia", specialty: "Psychologist", rating: 4.9, availableSlots: 5, category: "medical" },
    { id: 9, name: "David Wilson", specialty: "Corporate Lawyer", rating: 4.6, availableSlots: 4, category: "consultation" },
    { id: 10, name: "Linda Brown", specialty: "Yoga Instructor", rating: 4.8, availableSlots: 7, category: "fitness" },
    { id: 11, name: "James Taylor", specialty: "Dentist", rating: 4.7, availableSlots: 2, category: "medical" },
    { id: 12, name: "Jennifer Wright", specialty: "Immigration Attorney", rating: 4.8, availableSlots: 5, category: "consultation" },
  ];

  // Filter providers based on selected category
  const filteredProviders = selectedCategory === 'all' 
    ? serviceProviders 
    : serviceProviders.filter(provider => provider.category === selectedCategory);

  // Filter slideshow providers based on selected category
  const filteredSlideshowProviders = selectedSlideCategory === 'all'
    ? slideshowProviders
    : slideshowProviders.filter(provider => provider.category === selectedSlideCategory);

  // Calculate how many slides there are (assuming 3 providers per slide)
  const providersPerSlide = 3;
  const totalSlides = Math.ceil(filteredSlideshowProviders.length / providersPerSlide);

  // Move to the next slide
  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % totalSlides);
  };

  // Move to the previous slide
  const prevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + totalSlides) % totalSlides);
  };

  // Get current slide providers
  const currentProviders = filteredSlideshowProviders.slice(
    currentSlide * providersPerSlide,
    (currentSlide + 1) * providersPerSlide
  );

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

  return (
    <div className="homepage-wrapper">
    {/* <Header/>  */} 

      <main>
        {/* Hero section with search and category filter */}
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
              />
              <button className="search-btn">Search</button>
            </div>

            <div className="category-filters">
              {categories.map(category => (
                <button
                  key={category.id}
                  className={`category-btn ${selectedCategory === category.id ? 'selected-category' : ''}`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <span className="category-icon">{category.icon}</span>
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Service Providers Section */}
        <section className="providers-section">
          <div className="section-heading">
            <h2>{selectedCategory === 'all' ? 'All Service Providers' : `${categories.find(c => c.id === selectedCategory)?.name} Providers`}</h2>
          </div>
              
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

        </section>

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
                  style={{ cursor: 'pointer' }}
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
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleFeatureClick('/services')}
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
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleFeatureClick('reminders')}
                  onKeyPress={e => (e.key === 'Enter' || e.key === ' ') && handleFeatureClick('reminders')}
                >
                  <MdNotifications className="feature-icon" />
                  <h3>Appointment Reminders</h3>
                  <p>Get notified about upcoming appointments and booking status</p>
                </div>
                <div
                  className="feature-card"
                  tabIndex={0}
                  role="button"
                  style={{ cursor: 'pointer' }}
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
                  style={{ cursor: 'pointer' }}
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

        {/* New Providers Slideshow Section */}
        {activeTab === 'customer' && (
          <section className="providers-slideshow-section">
            <div className="section-heading">
              <h2>Browse Providers by Category</h2>
            </div>

            <div className="slideshow-category-filter">
              <div className="category-filters">
                {categories.map(category => (
                  <button
                    key={category.id}
                    className={`category-btn ${selectedSlideCategory === category.id ? 'selected-category' : ''}`}
                    onClick={() => {
                      setSelectedSlideCategory(category.id);
                      setCurrentSlide(0); // Reset to first slide when changing category
                    }}
                  >
                    <span className="category-icon">{category.icon}</span>
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="slideshow-container">
              <button className="slide-nav-btn prev-btn" onClick={prevSlide} disabled={totalSlides <= 1}>
                &lt;
              </button>

              <div className="slideshow-cards">
                {currentProviders.map(provider => (
                  <div key={provider.id} className="slideshow-card">
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

              <button className="slide-nav-btn next-btn" onClick={nextSlide} disabled={totalSlides <= 1}>
                &gt;
              </button>
            </div>

            <div className="slideshow-dots">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <span
                  key={index}
                  className={`dot ${currentSlide === index ? 'active-dot' : ''}`}
                  onClick={() => setCurrentSlide(index)}
                ></span>
              ))}
            </div>
          </section>
        )}

        {/* Call to action section */}
        <section className="cta-section">
          <h2>Ready to get started?</h2>
          <p>Join thousands of users who are already enjoying our Smart Booking System</p>
          <div className="cta-buttons">
            <button className="cta-primary">Sign Up Now</button>
            <button className="cta-secondary">Learn More</button>
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
        /* Previous styles remain the same */

        .providers-section {
          padding: 4rem 5%;
          background-color: #f9f9f9;
        }

        .providers-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 2rem;
          margin-top: 2rem;
        }

        .provider-card {
          background-color: white;
          padding: 1.5rem;
          border-radius: 10px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          text-align: center;
          transition: all 0.3s ease;
        }

        .provider-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.15);
        }

        .provider-avatar {
          width: 70px;
          height: 70px;
          background-color: orange;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.8rem;
          margin: 0 auto 1rem;
          font-weight: bold;
        }

        .provider-specialty {
          color: #666;
          font-size: 0.9rem;
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
        }

        .book-now-btn:hover {
          background-color: #e67e00;
        }

        .no-results {
          grid-column: 1 / -1;
          text-align: center;
          padding: 2rem;
          color: #666;
        }

        @media (max-width: 768px) {
          .providers-grid {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          }
        }
      `}</style>
       <style jsx>{`
        .homepage-wrapper {
          font-family: 'Segoe UI', sans-serif;
          color: #333;
        }

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
        }

        .book-now-btn:hover {
          background-color: #e67e00;
        }

        .no-results {
          grid-column: 1 / -1;
          text-align: center;
          padding: 2rem;
          color: #666;
        }

        @media (max-width: 768px) {
          .providers-grid {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          }
        }
      `}</style>
       <style jsx>{`
        .homepage-wrapper {
          font-family: 'Segoe UI', sans-serif;
          color: #333;
        }

        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 5%;
          background-color: white;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .logo h1 {
          color: orange;
          margin: 0;
          font-size: 1.8rem;
        }

        .nav-tabs {
          display: flex;
          gap: 1rem;
        }

        .nav-tab {
          padding: 0.5rem 1rem;
          background: none;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .active-tab {
          background-color: #f0f0f0;
          font-weight: bold;
          color: orange;
        }

        .nav-buttons {
          display: flex;
          gap: 1rem;
        }

        .login-btn, .signup-btn {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }

        .login-btn {
          background-color: #f0f0f0;
          color: #333;
        }

        .signup-btn {
          background-color: orange;
          color: white;
        }

        .hero-section {
          height: 70vh;
          background-size: cover;
          background-position: center;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          text-align: center;
          position: relative;
        }

        .hero-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0,0,0,0.5);
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
        }

        .hero-content p {
          font-size: 1.2rem;
          margin-bottom: 2rem;
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
        }

        .available-slots {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          color: #666;
        }

        .book-now-btn {
          background-color: orange;
          color: white;
          border: none;
          padding: 0.5rem 1.5rem;
          border-radius: 5px;
          cursor: pointer;
          font-weight: bold;
          transition: all 0.3s ease;
        }

        .book-now-btn:hover {
          background-color: #e67e00;
        }

        /* Slideshow Section Styles */
        .providers-slideshow-section {
          padding: 4rem 5%;
          background-color: white;
        }

        .slideshow-category-filter {
          display: flex;
          justify-content: center;
          margin-bottom: 2rem;
        }

        .category-dropdown {
          padding: 0.8rem 1.5rem;
          border-radius: 5px;
          border: 2px solid orange;
          background-color: white;
          font-size: 1rem;
          cursor: pointer;
          outline: none;
          min-width: 200px;
        }

        .slideshow-container {
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          margin-bottom: 2rem;
        }

        .slideshow-cards {
          display: flex;
          justify-content: center;
          gap: 2rem;
          width: 100%;
          max-width: 1200px;
        }

        .slideshow-card {
          background-color: white;
          padding: 2rem;
          border-radius: 10px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          text-align: center;
          transition: transform 0.3s ease;
          flex: 1;
          min-width: 250px;
          max-width: 350px;
        }

        .slideshow-card:hover {
          transform: translateY(-10px);
        }

        .slide-nav-btn {
          background-color: rgba(255, 165, 0, 0.8);
          color: white;
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          font-size: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          margin: 0 1rem;
        }

        .slide-nav-btn:hover {
          background-color: orange;
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
          width: 12px;
          height: 12px;
          background-color: #ccc;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .active-dot {
          background-color: orange;
          transform: scale(1.2);
        }

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
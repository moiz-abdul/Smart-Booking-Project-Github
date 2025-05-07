const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const sequelize = require('./config/db'); // MySQL connection

const userapi = require('./api/userapi');
const UserAuthenticationAPI = require('./api/userauthenticationapi');
const UpdateUserApi = require('./api/userupdateapi');
const adminauthenticationAPI = require('./api/adminauthenticationapi');
const FetchCategoriesAPI = require('./api/fetch-categories-api');
const AddServiceAPI = require('./api/add-service-api');
const ServicesApi = require('./api/view-service-api');
const UpdateServicesApi = require('./api/update-service-api');
const HomepageServicesCardApi = require('./api/homepage-cards-api');
const provider_profile_info = require('./api/provider-profile-api');
const fetchBookingDetails = require('./api/booking-details-api');
const BookingFormApi = require('./api/booking-form-api');
const PaymentFormApi = require('./api/payment-form-api');
const CustomerBookingsApi = require('./api/customerbookingapi');
const ProviderDashboardBookingsDetailsApi = require('./api/provider-dashboard-bookingdetails-api');
const CustomerReviewsAPI = require('./api/customer-reviews-api');
const ProviderRevenueReportApi = require('./api/provider-revenue-report-api');
const SubscriptionApi = require('./api/subscriptions-api');


// Load environment variables
dotenv.config();

// Sync MySQL Database
sequelize.sync()
  .then(() => console.log("MySQL Database Synced"))
  .catch(err => console.error("Database Sync Error:", err));

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files
app.use('/ServerDataStorage/UploadedDocumentFiles', express.static(path.join(__dirname, 'ServerDataStorage', 'UploadedDocumentFiles')));
app.use('/ServerDataStorage/UploadedDocumentThumbnails', express.static(path.join(__dirname, 'ServerDataStorage', 'UploadedDocumentThumbnails')));

// API Routes 
app.use('/api/users', userapi);
app.use('/api/update', UpdateUserApi);
app.use('/api/auth', UserAuthenticationAPI);
app.use('/api/admin/auth', adminauthenticationAPI);
app.use('/api/categories',FetchCategoriesAPI);
app.use('/api/addservice',AddServiceAPI);
app.use('/api/services', ServicesApi);
app.use('/api/updateservices',UpdateServicesApi);
app.use('/api/homepagecardservices',HomepageServicesCardApi);
app.use('/api/providerprofile',provider_profile_info);
app.use('/api/bookingdetails',fetchBookingDetails);
app.use('/api/bookform/',BookingFormApi);
app.use('/api/paymentform/',PaymentFormApi);
app.use('/api/customerbookingdetails',CustomerBookingsApi);
app.use('/api/providerbookingdetails',ProviderDashboardBookingsDetailsApi);
app.use('/api/customerreviews',CustomerReviewsAPI);
app.use('/api/providerrevenuereport',ProviderRevenueReportApi);
app.use('/api/subscriptions/',SubscriptionApi);


// Base Route
app.get('/', (req, res) => res.send('API is running...'));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

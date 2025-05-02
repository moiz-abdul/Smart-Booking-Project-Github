import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Routes, Route, Link } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';

import CustomerDashboard from './Layouts/CustomerLayout/CustomerMainLayoutfile';
import CusDashboard from './Layouts/CustomerLayout/Dashboard'
import ConfirmedBookings from './Layouts/CustomerLayout/ConfirmedBookings'

// COMMON LINKS 
import RoleBasedLogin from './CommonComponents/LoginComponent/login';
import RoleBaseRegister from './CommonComponents/RegisterComponent/register';


// MAIN SIDE LINKS

import UserLayout from './Layouts/UserLayout/UserLayoutFile';
import Home from './components/HomeComponent/home';
import CustomerProtectedRoute from './components/ProtectedRoutes/UserProtectedRoute';
import ProjectStatusPage from './components/ProjectStatusComponent/projectstatus';
import AboutUsPage from './components/AboutUsComponent/Aboutus';
import Complaints from './components/complaints';
import ProcurementSection from './components/procurement';
import Public_Documents from './components/public-documents';
import ProjectMis from './components/projectmis';
import Careers from './components/careers';


//  CUSTOMER SIDE LINKS

import CustomerLayout from './Layouts/CustomerLayout/CustomerMainLayoutfile';
import Dashboard from './CustomerComponents/DashboardComponent/userdashboard';
import BookingForm from './CustomerComponents/BookingFormComponent/bookingformcomponent';
import PaymentFormPage from './CustomerComponents/PaymentFormComponent/paymentform';

// ----------------  SERVICE PROVIDER SIDE LINKS --------------------

import ServiceProviderLayout from './Layouts/ProviderLayout/ProviderMainLayoutfile';
import ServiceDashboard from './ServiceProviderComponents/ProviderDashboardComponent/ProviderDashboard';
import ServiceProviderBookings from './ServiceProviderComponents/ReceivedBookingsComponent/receivedbookings';


// ---------------- ADMIN SIDE LINKS --------------------

import AdminLayout from './Layouts/AdminLayout/Adminlayoutfile';
import AdminProtectedRoute from './AdminComponents/ProtectedRoutes/AdminProtectedRoute';
import AdminLogin from './AdminComponents/LoginComponent/login';
import AdminDashboard from './AdminComponents/DashboardComponent/UserDetailsComponent/ViewUsers';
import DocumentPage from './AdminComponents/DocumentsPage/documentspage';
import AdminCareersPage from './AdminComponents/CareersPage/careerspage';

// ADMIN SIDE LINKS END


// OTHER LINKS

// import TopRibbon from './components/HomeComponent/topribbon';
// import BottomRibbon from './components/HomeComponent/BottomRibbon';
// import Footer from './components/HomeComponent/Footer'; 


function App() {
  return (
    <div >

      {/* Common Routing Links  */}
      <Routes>
        <Route path="/register" element={<RoleBaseRegister />} />   {/* Role Based Register Link */}
        <Route path="/login" element={<RoleBasedLogin />} />   {/* Role Based  Login Link */}
      </Routes>


      {/* Main (HOME PAGE) Side Routing Links  */}
      <Routes>
        <Route path='/' element={<UserLayout><Home /></UserLayout>} />
        <Route path='/projectstatus' element={<UserLayout> <ProjectStatusPage /> </UserLayout>} />
        <Route path='/aboutus' element={<UserLayout> <AboutUsPage /> </UserLayout>} />
        <Route path='/procurement/:serviceId' element={<UserLayout> <ProcurementSection /> </UserLayout>} />
        <Route path='/public-documents' element={<UserLayout><Public_Documents /></UserLayout>} />
        <Route path="/complaints" element={<UserLayout> <Complaints /> </UserLayout>} />
        <Route path="/projectmis" element={<UserLayout>  <ProjectMis /> </UserLayout>} />
        <Route path="/careers" element={<UserLayout> <Careers /> </UserLayout>} />
      </Routes>

      {/* Customer Side Routing Links  */}
      <Routes>
        <Route path='/customer/dashboard' element={<CustomerProtectedRoute><CustomerLayout><Dashboard /></CustomerLayout></CustomerProtectedRoute>} />   {/* Customer Dashboard Link  */}
        <Route path='/booking-form' element={<BookingForm />} />
        <Route path='/payment' element={<PaymentFormPage />} />
        <Route path='/registerstaff/documentspage' element={<CustomerLayout> <DocumentPage /> </CustomerLayout>} />
        <Route path='/registerstaff/careerspage' element={<CustomerLayout> <AdminCareersPage /> </CustomerLayout>} />
      </Routes>

      {/* Service Provider Side Routing Links  */}
      <Routes>
        <Route path='/provider/dashboard' element={<ServiceProviderLayout> <ServiceDashboard /> </ServiceProviderLayout>} />
        <Route path='/provider/receivedbookings' element={<ServiceProviderLayout> <ServiceProviderBookings /> </ServiceProviderLayout>} />
      </Routes>

      {/* Admin Side Routing Links */}

      <Routes>
        <Route path='/admin/login' element={<AdminLogin />} />
        <Route path='/registeradmins/users' element={<AdminProtectedRoute><AdminLayout> <AdminDashboard /> </AdminLayout></AdminProtectedRoute>} />
        <Route path='/registeradmins/documentspage' element={<AdminLayout> <DocumentPage /> </AdminLayout>} />
        <Route path='/registeradmins/careerspage' element={<AdminLayout> <AdminCareersPage /> </AdminLayout>} />
      </Routes>

      <Routes>
        <Route path="/CustomerDashboard" element={<CustomerProtectedRoute><CustomerDashboard />  </CustomerProtectedRoute>} >
          <Route index path="/CustomerDashboard/Dashboard" element={<CusDashboard />} />
          <Route path="/CustomerDashboard/ConfirmedBookings" element={<ConfirmedBookings />} />

        </Route>
      </Routes>
    </div>
  );
}

export default App;

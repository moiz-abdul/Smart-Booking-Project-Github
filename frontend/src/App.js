import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Routes, Route, Link } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';



// COMMON LINKS 
import RoleBasedLogin from './CommonComponents/LoginComponent/login';
import RoleBaseRegister from './CommonComponents/RegisterComponent/register';


// MAIN SIDE LINKS

import UserLayout from './Layouts/UserLayout/UserLayoutFile';
import Home from './components/HomeComponent/home';
import CustomerProtectedRoute from './components/ProtectedRoutes/UserProtectedRoute';
import ProcurementSection from './components/procurement';


//  CUSTOMER SIDE LINKS

import CustomerLayout from './Layouts/CustomerLayout/CustomerMainLayoutfile';
// import Dashboard from './CustomerComponents/DashboardComponent/userdashboard';
import BookingForm from './CustomerComponents/BookingFormComponent/bookingformcomponent';
import PaymentFormPage from './CustomerComponents/PaymentFormComponent/paymentform';
import CustomerDashboard from './Layouts/CustomerLayout/CustomerMainLayoutfile';
import CusDashboard from './Layouts/CustomerLayout/Dashboard'
import ConfirmedBookings from './Layouts/CustomerLayout/ConfirmedBookings'
import CancelBookingCustomerDashboard from './Layouts/CustomerLayout/CancelBookings';
import CompletedBookings from './Layouts/CustomerLayout/CompletedBookings';
import CustomerSubscriptions from './Layouts/CustomerLayout/Subscription';

// ----------------  SERVICE PROVIDER SIDE LINKS --------------------

import ServiceProviderLayout from './Layouts/ProviderLayout/ProviderMainLayoutfile';
import ServiceDashboard from './ServiceProviderComponents/ProviderDashboardComponent/ProviderDashboard';
import ProviderReceivedBookings  from './ServiceProviderComponents/ReceivedBookingsComponent/receivedbookings';
import ProviderCancelBookings from './ServiceProviderComponents/CancelBookingsComponent/providercancelbookings';
import ProviderConfirmedBookings from './ServiceProviderComponents/ConfirmBookingsComponent/providerconfirmbookings';
import ProviderCompletedBookings from './ServiceProviderComponents/CompletedBookingsComponent/providercompletedbookings';
import ProviderRevenueReport from './ServiceProviderComponents/RevenueReportComponent/provider-revenue-report';


// ---------------- ADMIN SIDE LINKS --------------------

import AdminLayout from './Layouts/AdminLayout/Adminlayoutfile';
import AdminProtectedRoute from './AdminComponents/ProtectedRoutes/AdminProtectedRoute';
import AdminLogin from './AdminComponents/LoginComponent/login';
import AdminUserManagement from './AdminComponents/DashboardComponent/UserDetailsComponent/ViewUsers';
import AdminReservationManagement from './AdminComponents/ReservationManagementComponent/reservationmanagement';
import AdminReservedPeriods from './AdminComponents/AdminReservedPeriodsComponent/adminreservedperiods';


// ADMIN SIDE LINKS END


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
        <Route path='/procurement/:serviceId' element={<UserLayout> <ProcurementSection /> </UserLayout>} />
      </Routes>

            {/* Customer Side Routing Links  */}

      <Routes>
          <Route path="/CustomerDashboard" element={<CustomerProtectedRoute><CustomerDashboard /></CustomerProtectedRoute>} >
          <Route index path="/CustomerDashboard/Dashboard" element={<CustomerProtectedRoute><CusDashboard /></CustomerProtectedRoute>} />
          <Route path="/CustomerDashboard/ConfirmedBookings" element={<CustomerProtectedRoute><ConfirmedBookings /></CustomerProtectedRoute>} />
          <Route index path="/CustomerDashboard/CompletedBookings" element={<CustomerProtectedRoute><CompletedBookings /></CustomerProtectedRoute>} />
          <Route index path="/CustomerDashboard/CancelBookings" element={<CustomerProtectedRoute><CancelBookingCustomerDashboard /></CustomerProtectedRoute>} />
          <Route index path="/CustomerDashboard/Subscriptions" element={<CustomerProtectedRoute><CustomerSubscriptions /></CustomerProtectedRoute>} />
        </Route>
        <Route path='/booking-form' element={<BookingForm />} />
        <Route path='/payment' element={<PaymentFormPage />} /> 
      </Routes>


      {/* Service Provider Side Routing Links  */}
      <Routes>
        <Route path='/provider/dashboard' element={<ServiceProviderLayout> <ServiceDashboard/> </ServiceProviderLayout>} />
        <Route path='/provider/receivedbookings' element={<ServiceProviderLayout> <ProviderReceivedBookings/> </ServiceProviderLayout>} />
        <Route path='/provider/cancelbookings' element={<ServiceProviderLayout> <ProviderCancelBookings/> </ServiceProviderLayout>} />
        <Route path='/provider/confirmedbookings' element={<ServiceProviderLayout> <ProviderConfirmedBookings/> </ServiceProviderLayout>} />
        <Route path='/provider/completedbookings' element={<ServiceProviderLayout> <ProviderCompletedBookings/> </ServiceProviderLayout>} />
        <Route path='/provider/revenuereport' element={<ServiceProviderLayout> <ProviderRevenueReport/> </ServiceProviderLayout>} />
      </Routes>

      {/* Admin Side Routing Links */}

      <Routes>
        <Route path='/admin/login' element={<AdminLogin />} />
        <Route path='/registeradmin/usermanagement' element={<AdminProtectedRoute><AdminLayout> <AdminUserManagement /> </AdminLayout></AdminProtectedRoute>} />
        <Route path='/registeradmin/reservationmanagement' element={<AdminProtectedRoute><AdminLayout> <AdminReservationManagement /> </AdminLayout></AdminProtectedRoute>} />
        <Route path='/registeradmin/reservedperiods' element={<AdminProtectedRoute><AdminLayout> <AdminReservedPeriods /> </AdminLayout></AdminProtectedRoute>} />
      </Routes>

    </div>
  );
}

export default App;

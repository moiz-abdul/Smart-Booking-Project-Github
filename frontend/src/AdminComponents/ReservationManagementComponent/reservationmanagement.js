import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';


axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  }
);

const AdminReservationManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Convert '21:00:00' ➜ '9:00 PM'
const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [hour, minute] = timeStr.split(':');
    const date = new Date();
    date.setHours(parseInt(hour));
    date.setMinutes(parseInt(minute));
  
    return date.toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

 //  TOKEN HEADER AND DATA FETCH
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    axios.get('http://localhost:5000/api/adminside/adminreservationmanagement')
      .then(res => {
        if (res.data.success) {
          setBookings(res.data.bookings);
        } else {
          setError("Failed to load reservations.");
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching reservations:", err);
        setError("Something went wrong.");
        setLoading(false);
      });
  }, []);

  const exportCSV = () => {
    window.open('http://localhost:5000/api/adminside/adminreservationmanagement/export', '_blank');
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between mb-3">
        <h2>Reservation Management</h2>
        <button className="btn btn-success" onClick={exportCSV}>
          Export CSV
        </button>
      </div>

      {loading && <p>Loading reservations...</p>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && bookings.length === 0 && <p>No reservations found.</p>}

      {!loading && bookings.length > 0 && (
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Customer</th>
                <th>Service</th>
                <th>Category</th>
                <th>Day</th>
                <th>Time Slot</th>
                <th>Start-End</th>
                <th>Payment Type</th>
                <th>Pay Per Booking Price</th>
                <th>Member Price</th>
                <th>Status</th>
                <th>Booked At</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b, index) => (
                <tr key={b.booking_id}>
                  <td>{index + 1}</td>
                  <td>{b.customer_name}</td>
                  <td>{b.service_name}</td>
                  <td>{b.service_category}</td>
                  <td>{b.day}</td>
                  <td>{formatTime(b.time_slot)}</td>
                  <td>{formatTime(b.start_time)} - {formatTime(b.end_time)}</td>
                  <td>{b.payment_type}</td>
                  <td>{b.pay_per_booking_price}</td>
                  <td>{b.membership_price}</td>
                  <td>{b.is_status}</td>
                  <td>{new Date(b.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminReservationManagement;
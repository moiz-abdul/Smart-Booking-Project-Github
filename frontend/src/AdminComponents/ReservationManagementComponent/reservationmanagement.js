import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaFileExport, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';

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

  useEffect(() => {
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
        setError("Something went wrong while fetching reservations.");
        setLoading(false);
      });
  }, []);

  const exportCSV = () => {
    window.open('http://localhost:5000/api/adminside/adminreservationmanagement/export', '_blank');
  };

  // Status badge styling
  const getStatusBadge = (status) => {
    let badgeClass = '';
    switch (status.toLowerCase()) {
      case 'confirmed':
        badgeClass = 'bg-success';
        break;
      case 'pending':
        badgeClass = 'bg-warning text-dark';
        break;
      case 'cancelled':
        badgeClass = 'bg-danger';
        break;
      case 'completed':
        badgeClass = 'bg-info';
        break;
      default:
        badgeClass = 'bg-secondary';
    }
    return <span className={`badge ${badgeClass}`}>{status}</span>;
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
      <div className="  text-white d-flex justify-content-between align-items-center">
      <h2 className="mb-0 d-flex align-items-center bg-white text-warning p-2 rounded">
  <i className="fas fa-calendar-alt me-2 align-items-center" ></i>
  Reservation Management
</h2>
  <div>
    <button 
      className="btn btn-light text-primary" 
      onClick={exportCSV}
      disabled={loading || bookings.length === 0}
    >
      <FaFileExport className="me-2" />
      Export CSV
    </button>
  </div>
</div>

        <div className="card-body">
          {loading && (
            <div className="text-center py-5">
              <FaSpinner className="fa-spin me-2" size="2em" />
              <span>Loading reservations...</span>
            </div>
          )}

          {error && (
            <div className="alert alert-danger d-flex align-items-center">
              <FaExclamationTriangle className="me-2" />
              <div>{error}</div>
            </div>
          )}

          {!loading && bookings.length === 0 && !error && (
            <div className="text-center py-5">
              <img 
                src="/empty-state.svg" 
                alt="No reservations" 
                style={{ height: '120px', opacity: 0.7 }}
                className="mb-3"
              />
              <h5>No reservations found</h5>
              <p className="text-muted">When new reservations are made, they'll appear here.</p>
            </div>
          )}

          {!loading && bookings.length > 0 && (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: '3%' }}>#</th>
                    <th style={{ width: '12%' }}>Customer</th>
                    <th style={{ width: '12%' }}>Service</th>
                    <th style={{ width: '6%' }}>Category</th>
                    <th style={{ width: '7%' }}>Day</th>
                    <th style={{ width: '8%' }}>Time Slot</th>
                    <th style={{ width: '17%' }}>Start-End</th>
                    <th style={{ width: '8%' }}>Payment</th>
                    <th style={{ width: '7%' }}>Price</th>
                    <th style={{ width: '7%' }}>Member Price</th>
                    <th style={{ width: '8%' }}>Status</th>
                    <th style={{ width: '10%' }}>Booked At</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b, index) => (
                    <tr key={b.booking_id} className={index % 2 === 0 ? '' : 'table-row-alt'}>
                      <td className="text-muted">{index + 1}</td>
                      <td>
                        <div className="fw-semibold">{b.customer_name}</div>
                      </td>
                      <td>{b.service_name}</td>
                      <td>
                        <span className="badge bg-light text-dark">
                          {b.service_category}
                        </span>
                      </td>
                      <td>{b.day}</td>
                      <td>{formatTime(b.time_slot)}</td>
                      <td>
                        <small className="text-muted">
                          {formatTime(b.start_time)} - {formatTime(b.end_time)}
                        </small>
                      </td>
                      <td>{b.payment_type}</td>
                      <td className="fw-bold">${b.pay_per_booking_price}</td>
                      <td className="fw-bold text-success">${b.membership_price}</td>
                      <td>{getStatusBadge(b.is_status)}</td>
                      <td>
                        <small>
                          {new Date(b.created_at).toLocaleDateString()}<br />
                          {new Date(b.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </small>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .table-row-alt {
          background-color: rgba(248, 249, 250, 0.7);
        }
        .table th {
          font-weight: 600;
          text-transform: uppercase;
          font-size: 0.8rem;
          letter-spacing: 0.5px;
          border-top: none;
        }
        .table td {
          vertical-align: middle;
        }
        .card-header {
          border-radius: 0.375rem 0.375rem 0 0 !important;
        }
        .badge {
          font-weight: 500;
          padding: 0.35em 0.65em;
          font-size: 0.75em;
        }
        .text-muted {
          color: #6c757d !important;
        }
      `}</style>
    </div>
  );
};

export default AdminReservationManagement;
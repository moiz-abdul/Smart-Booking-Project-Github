import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './adminreservedperiods.css';

const AdminReservedPeriods = () => {
  const [reservedPeriods, setReservedPeriods] = useState([]);
  const [formData, setFormData] = useState({
    day: '',
    start_time: '',
    end_time: '',
    reason: ''
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Fetch reserved periods
  const fetchReservedPeriods = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/adminside/reserved-periods');
      if (res.data.success) {
        setReservedPeriods(res.data.data);
      }
    } catch (err) {
      setError('Failed to load reserved periods.');
    }
  };

  useEffect(() => {
    fetchReservedPeriods();
  }, []);

  // Handle form change
  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  
  const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this reserved period?")) return;

  try {
    const res = await axios.delete(`http://localhost:5000/api/adminside/reserved-periods/${id}`);
    if (res.data.success) {
      setMessage("Reserved period deleted successfully.");
      fetchReservedPeriods(); // Refresh table
    } else {
      setError("Failed to delete reserved period.");
    }
  } catch (err) {
    console.error("Delete error:", err);
    setError("Server error occurred during deletion.");
  }
};

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/api/adminside/reserved-periods', formData);

      if (res.data.success) {
        setMessage(res.data.message);
        setFormData({ day: '', start_time: '', end_time: '', reason: '' });
        fetchReservedPeriods();
      } else {
        setError(res.data.message || 'Failed to add reserved period');
      }
    } catch (err) {
      console.error(err);
      setError("Server error occurred");
    }
  };

  // Format time to AM/PM
  const formatTime = (timeStr) => {
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

  return (
    <div className="container mt-5">
     <h2 className="mb-4 text-start">Manage Reserved Periods</h2>

      <form className="border p-3 mb-4" onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-3">
            <label className="form-label">Day</label>
            <select className="form-select" name="day" value={formData.day} onChange={handleChange} required>
              <option value="">Select Day</option>
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label">Start Time</label>
            <input type="time" className="form-control" name="start_time" value={formData.start_time} onChange={handleChange} required />
          </div>
          <div className="col-md-3">
            <label className="form-label">End Time</label>
            <input type="time" className="form-control" name="end_time" value={formData.end_time} onChange={handleChange} required />
          </div>
          <div className="col-md-3">
            <label className="form-label">Reason (optional)</label>
            <input type="text" className="form-control" name="reason" value={formData.reason} onChange={handleChange} />
          </div>
        </div>

        <button type="submit" className="btn btn-primary mt-3">Add Reserved Period</button>
      </form>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table table-light table-hover align-middle">
              <tr>
       {/**         <th>ID</th>  */}
                <th>Day</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Reason</th>
                <th>Created At</th>
                <th>Action</th>
              </tr>
            </thead>
          <tbody>
            {reservedPeriods.length === 0 ? (
              <tr><td colSpan="6" className="text-center">No reserved periods</td></tr>
            ) : (
              reservedPeriods.map(rp => (
                <tr key={rp.id}>
   {/**  <td>{rp.id}</td> */}
  <td>{rp.day}</td>
  <td>{formatTime(rp.start_time)}</td>
  <td>{formatTime(rp.end_time)}</td>
  <td>{rp.reason || '—'}</td>
  <td>{new Date(rp.created_at).toLocaleString()}</td>
  <td>
    <button
      className="btn btn-danger btn-sm"
      onClick={() => handleDelete(rp.id)}
    >
      Delete
    </button>
  </td>
</tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminReservedPeriods;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './provider-revenue-report.css'; // Optional: Create basic styling

const ProviderRevenueReport = () => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [revenueData, setRevenueData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [error, setError] = useState(null);

  const fetchRevenueReport = async () => {
    const provider = JSON.parse(localStorage.getItem('userData'));

    if (!provider?.id || !fromDate || !toDate) {
      setError('Please provide all required inputs.');
      return;
    }

    try {
      setError(null);
      const response = await axios.get('http://localhost:5000/api/providerrevenuereport/revenuereport', {
        params: {
          user_id: provider.id,
          from: fromDate,
          to: toDate
        }
      });

      if (response.data?.success) {
        setRevenueData(response.data.data);
        setTotalRevenue(response.data.totalRevenue.toFixed(2));
      } else {
        setError('Failed to fetch data');
      }
    } catch (err) {
      console.error('API Error:', err);
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="revenue-report">
      <h2>Provider Revenue Report</h2>

      <div className="filters">
        <label>From: </label>
        <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} required />

        <label>To: </label>
        <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} required />

        <button onClick={fetchRevenueReport}>Search</button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <h3>Total Revenue: ${totalRevenue}</h3>

      <table className="revenue-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Customer Name</th>
            <th>Service</th>
            <th>Amount Paid</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {revenueData.length === 0 ? (
            <tr>
              <td colSpan="5">No records found</td>
            </tr>
          ) : (
            revenueData.map((item, index) => (
              <tr key={item.payment_id}>
                <td>{index + 1}</td>
                <td>{item.customer_name}</td>
                <td>{item.service_title}</td>
                <td>${item.amount_paid}</td>
                <td>{new Date(item.created_at).toLocaleDateString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProviderRevenueReport;
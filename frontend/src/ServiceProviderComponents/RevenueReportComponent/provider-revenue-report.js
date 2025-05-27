import React, { useState } from 'react';
import axios from 'axios';
import './provider-revenue-report.css';

const ProviderRevenueReport = () => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [revenueData, setRevenueData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchRevenueReport = async () => {
    const provider = JSON.parse(localStorage.getItem('userData'));

    if (!provider?.id || !fromDate || !toDate) {
      setError('Please provide all required inputs.');
      return;
    }

    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="revenue-report-container">
      <div className="revenue-card">
        <div className="card-header">
          <h2>Provider Revenue Report</h2>
          <div className="total-revenue">
            <span>Total Revenue:</span>
            <h3>${totalRevenue}</h3>
          </div>
        </div>
        
        <div className="filters-section">
          <div className="filter-group">
            <label htmlFor="fromDate">From</label>
            <input 
              id="fromDate"
              type="date" 
              value={fromDate} 
              onChange={(e) => setFromDate(e.target.value)} 
              required 
            />
          </div>

          <div className="filter-group">
            <label htmlFor="toDate">To</label>
            <input 
              id="toDate"
              type="date" 
              value={toDate} 
              onChange={(e) => setToDate(e.target.value)} 
              required 
            />
          </div>

          <button 
            className="search-button" 
            onClick={fetchRevenueReport}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Generate Report'}
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}
        
        <div className="table-container">
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
                  <td colSpan="5" className="no-records">
                    {loading ? 'Loading data...' : 'No records found'}
                  </td>
                </tr>
              ) : (
                revenueData.map((item, index) => (
                  <tr key={item.payment_id}>
                    <td>{index + 1}</td>
                    <td>{item.customer_name}</td>
                    <td>{item.service_title}</td>
                    <td className="amount">${item.amount_paid}</td>
                    <td>{new Date(item.created_at).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProviderRevenueReport;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Subscription.css'; // You can style it if needed

const CustomerSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [renewModalData, setRenewModalData] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("userData"));

  const fetchSubscriptions = async () => {
    if (!user) return;
    try {
      const response = await axios.get('http://localhost:5000/api/subscriptions/subscribeusers', {
        params: { user_id: user.id }
      });

      if (response.data?.success) {
        setSubscriptions(response.data.data);
      }
    } catch (err) {
      console.error("Error loading subscriptions:", err);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const handleCancel = async (booking_id) => {
    try {
      await axios.put('http://localhost:5000/api/subscriptions/cancelsubsription', {
        booking_id
      });
      alert("Membership cancelled");
      fetchSubscriptions();
    } catch (err) {
      alert("Cancel failed");
    }
  };

  const handleRenew = async () => {
    if (!selectedPlan || !renewModalData) return;

    try {
      await axios.put('http://localhost:5000/api/subscriptions/renewsubscription', {
        booking_id: renewModalData.id,
        membership_type: selectedPlan
      });

      alert("Membership renewed");
      setRenewModalData(null);
      setSelectedPlan("");
      fetchSubscriptions();
    } catch (err) {
      alert("Failed to renew!");
    }
  };

  const openRenewModal = (booking) => {
    setRenewModalData(booking);
  };

  const isExpired = (endDate) => {
    return new Date(endDate) < new Date();
  };

  return (
    <div className="subscriptions-page">
      <h2>My Active Subscriptions</h2>
      <div className="subscription-list">
        {subscriptions.length === 0 && <p>No active memberships.</p>}
        {subscriptions.map((item) => (
          <div className="subscription-card" key={item.id}>
            <h3>{item.service_name}</h3>
            <p><strong>Category:</strong> {item.service_category}</p>
            <p><strong>Membership Type:</strong> {item.membership_type}</p>
            <p><strong>Start:</strong> {new Date(item.membership_start_time).toLocaleDateString()}</p>
            <p><strong>End:</strong> {new Date(item.membership_end_time).toLocaleDateString()}</p>

            <div className="btn-group">
              <button
                onClick={() => openRenewModal(item)}
                disabled={!isExpired(item.membership_end_time)}
              >
                Renew
              </button>
              <button onClick={() => handleCancel(item.id)}>
                Cancel
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Renew Modal */}
      {renewModalData && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>Renew Membership for {renewModalData.service_name}</h3>

            <div className="option">
              <label>
                <input
                  type="radio"
                  value="Monthly"
                  checked={selectedPlan === "Monthly"}
                  onChange={(e) => setSelectedPlan(e.target.value)}
                />
                Monthly - ${renewModalData.membership_price}
              </label>
            </div>

            <div className="option">
              <label>
                <input
                  type="radio"
                  value="Yearly"
                  checked={selectedPlan === "Yearly"}
                  onChange={(e) => setSelectedPlan(e.target.value)}
                />
                Yearly - ${parseFloat(renewModalData.membership_price) * 12}
              </label>
            </div>

            <p className="note">
              You already added payment method, membership fee will be deducted from your account.
            </p>

            <div className="btn-group">
              <button onClick={() => setRenewModalData(null)}>Cancel</button>
              <button onClick={handleRenew} disabled={!selectedPlan}>
                Renew Membership
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerSubscriptions;
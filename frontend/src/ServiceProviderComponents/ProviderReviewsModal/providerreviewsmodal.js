import { useState } from 'react';
import './providerreviewsmodal.css';

const ProviderReviewModal = ({ show, onClose, onSubmit, booking }) => {
  const [text, setText] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) {
      setError('Review cannot be empty');
      return;
    }
    onSubmit({
      booking_id: booking.id,
      review_text: text
    });
  };

  return (
    <div className={`modal-overlay ${show ? 'show' : ''}`}>
      <div className="modal-container">
        <div className="modal-header">
          <h2>Write a Review for {booking.customer_name}</h2>
          <button className="close-btn" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div className="modal-body">
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Your Review:</label>
              <textarea
                className="form-textarea"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Share your experience with the customer..."
                rows={5}
              />
            </div>
            <div className="modal-footer">
              <button type="button" className="cancel-btn" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="submit-btn">
                Submit Review
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProviderReviewModal;
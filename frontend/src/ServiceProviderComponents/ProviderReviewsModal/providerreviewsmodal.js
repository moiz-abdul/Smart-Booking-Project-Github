import { useState } from 'react';
import './providerreviewsmodal.css'; // Create small CSS file if needed

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
    <div className={`modal ${show ? 'show' : ''}`}>
      <div className="modal-content">
        <div className="modal-header">
          <h3>Write a Review for {booking.customer_name}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Review:</label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Write your experience with customer..."
                rows={4}
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
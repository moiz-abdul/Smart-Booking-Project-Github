import React, { useState } from 'react';
import './ModifyBookingModal.css';

const ModifyBookingModal = ({ 
  show, 
  onClose, 
  booking, 
  onSave
}) => {
  // Initialize state with current booking time slot
  const [newTimeSlot, setNewTimeSlot] = useState(booking?.selected_available_time_slot || "");

  // Available time slots - you can adjust these as needed
  const availableTimeSlots = [
    "9:00 AM - 11:00 AM",
    "10:00 AM - 12:00 PM",
    "11:00 AM - 1:00 PM",
    "2:00 PM - 4:00 PM",
    "3:00 PM - 5:00 PM",
    "4:00 PM - 6:00 PM"
  ];

  const handleSubmit = () => {
    // Call the parent component's save function with the updated time slot
    onSave({
      ...booking,
      selected_available_time_slot: newTimeSlot
    });
  };

  // Reset the selected time slot when booking changes
  React.useEffect(() => {
    if (booking) {
      setNewTimeSlot(booking.selected_available_time_slot);
    }
  }, [booking]);

  // If not showing or no booking, don't render
  if (!show || !booking) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3>Modify Booking</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="form-group">
            <label>Service Name</label>
            <input 
              type="text" 
              className="form-control" 
              value={booking.service_name} 
              readOnly 
            />
          </div>
          
          <div className="form-group">
            <label>Service Category</label>
            <input 
              type="text" 
              className="form-control" 
              value={booking.service_category} 
              readOnly 
            />
          </div>
          
          <div className="form-group">
            <label>Date</label>
            <input 
              type="text" 
              className="form-control" 
              value={booking.selected_available_day} 
              readOnly 
            />
          </div>
          
          <div className="form-group">
            <label>Current Time Slot</label>
            <input 
              type="text" 
              className="form-control" 
              value={booking.selected_available_time_slot} 
              readOnly 
            />
          </div>
          
          <div className="form-group">
            <label>Select New Time Slot</label>
            <div className="time-slots-container">
              {availableTimeSlots.map((slot, index) => (
                <button
                  key={index}
                  className={`time-slot-btn ${newTimeSlot === slot ? 'selected' : ''}`}
                  onClick={() => setNewTimeSlot(slot)}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
          
          <div className="status-change-notice">
            <p>
              <strong>Note:</strong> Modifying this booking will change its status to "Pending" and move it to the Bookings page.
            </p>
          </div>
        </div>
        
        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button 
            className="save-btn" 
            onClick={handleSubmit}
            disabled={!newTimeSlot || newTimeSlot === booking.selected_available_time_slot}
          >
            Update Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModifyBookingModal;
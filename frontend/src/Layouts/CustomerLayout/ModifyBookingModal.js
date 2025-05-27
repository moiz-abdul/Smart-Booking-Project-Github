import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import './ModifyBookingModal.css';

const UpdateBookingModal = ({ show, onClose, onSubmit, booking, service }) => {
  const [selectedDay, setSelectedDay] = useState(booking.selected_available_day);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(booking.selected_available_time_slot);
  const [availableDays, setAvailableDays] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);

  // Add debug logging
  useEffect(() => {
    console.log('Service details received:', service);
    
    if (service) {
      // Safely handle available_days
      const days = Array.isArray(service.available_days) 
        ? service.available_days 
        : (typeof service.available_days === 'string' 
            ? service.available_days.split(',') 
            : []);
      
      setAvailableDays(days.map(day => day.trim()).filter(day => day));
      
      // Use time_slots from service if available
      const slots = service.time_slots || [
        service.slot_1_time,
        service.slot_2_time,
        service.slot_3_time
      ].filter(slot => slot && typeof slot === 'string');
      
      console.log('Available Time Slots:', slots);
      setAvailableTimeSlots(slots);
    }
  }, [service]);

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const time = new Date(`1970-01-01T${timeString}`);
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const checkReservedPeriod = async () => {
    try {
      const serviceDuration = booking.duration_minutes;
      const [hour, minute] = selectedTimeSlot.split(':').map(Number);
  
      const start = new Date();
      start.setHours(hour);
      start.setMinutes(minute);
  
      const end = new Date(start.getTime() + serviceDuration * 60000);
      const endTime = `${end.getHours().toString().padStart(2, '0')}:${end.getMinutes().toString().padStart(2, '0')}`;
  
      const res = await fetch('http://localhost:5000/api/bookform/check-reserved-period', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selected_day: selectedDay,
          selected_start_time: selectedTimeSlot,
          selected_end_time: endTime
        })
      });
  
      const data = await res.json();
  
      if (data.success && data.is_reserved) {
        alert(`Booking time blocked by admin: For ${data.reason} `);
        return false;
      }
  
      return true;
    } catch (err) {
      console.error("Reserved period check failed:", err);
      alert("Failed to check reserved period. Please try again.");
      return false;
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // 🛡️ Check if selected time falls in reserved period
    const isReserved = await checkReservedPeriod();
    if (!isReserved) return;
  
    // Everything is fine — continue
    onSubmit({
      day: selectedDay,
      timeSlot: selectedTimeSlot
    });
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Modify Booking</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Service Name</Form.Label>
            <Form.Control 
              type="text" 
              value={booking.service_name} 
              readOnly 
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Current Booking Details</Form.Label>
            <div className="current-booking-details">
              <p><strong>Day:</strong> {booking.selected_available_day}</p>
              <p><strong>Time:</strong> {formatTime(booking.selected_available_time_slot)}</p>
              <p><strong>Duration:</strong> {booking.duration_minutes} minutes</p>
            </div>
          </Form.Group>

          <div className="payment-info">
            <p className="text-success">
              <strong>You have already paid, please select a new timeslot or day for rescheduling</strong>
            </p>
          </div>

          <Form.Group className="mb-3">
            <Form.Label>Available Day</Form.Label>
            <Form.Select 
              value={selectedDay} 
              onChange={(e) => setSelectedDay(e.target.value)}
              required
            >
              <option value="">Select a day</option>
              {availableDays.map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </Form.Select>
          </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Time Slot</Form.Label>
        <Form.Select 
          value={selectedTimeSlot} 
          onChange={(e) => setSelectedTimeSlot(e.target.value)}
          required
          disabled={!selectedDay}
        >
          <option value="">Select a time slot</option>
          {availableTimeSlots.map((slot, index) => (
            <option key={`${slot}-${index}`} value={slot}>
              {formatTime(slot)}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Update Booking
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default UpdateBookingModal;
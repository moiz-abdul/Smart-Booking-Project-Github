import React, { useState,useEffect  } from 'react';
import { Modal, Button, Badge, Form, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";
import axios from "axios";


// Set up axios interceptor
axios.interceptors.response.use(
    response => response,
    error => {
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        localStorage.removeItem("userToken");
        localStorage.removeItem("userData");
        window.location.href = "/login"; // Redirect to login page
      }
      return Promise.reject(error);
    }
  );

const CustomerDashboard = () => {

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("userToken");
        const userData = localStorage.getItem("userData");
        
        if (!token || !userData) {
            navigate("/login");
            return;
        }
        
        // Set authorization header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }, [navigate]);

    
  const [bookings, setBookings] = useState([
    {
      id: 1,
      serviceName: "Plumbing Repair",
      providerName: "John's Plumbing",
      date: "2025-04-25",
      timeSlot: "2:00 PM - 4:00 PM",
      originalPrice: 120,
      finalPrice: 120,
      status: "pending",
      isSubscriber: false,
      serviceCompleted: false
    },
    {
      id: 2,
      serviceName: "AC Maintenance",
      providerName: "Cool Air Services",
      date: "2025-04-26",
      timeSlot: "10:00 AM - 12:00 PM",
      originalPrice: 200,
      finalPrice: 120,
      status: "confirmed",
      isSubscriber: true,
      serviceCompleted: false
    },
    {
      id: 3,
      serviceName: "Electrical Wiring",
      providerName: "Safe Electric",
      date: "2025-04-20",
      timeSlot: "3:00 PM - 5:00 PM",
      originalPrice: 150,
      finalPrice: 150,
      status: "completed",
      isSubscriber: false,
      serviceCompleted: true
    }
  ]);

  const [showModifyModal, setShowModifyModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [newTimeSlot, setNewTimeSlot] = useState("");
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  
  const availableTimeSlots = [
    "9:00 AM - 11:00 AM",
    "11:00 AM - 1:00 PM",
    "2:00 PM - 4:00 PM",
    "4:00 PM - 6:00 PM"
  ];

  const handleModify = (booking) => {
    setCurrentBooking(booking);
    setNewTimeSlot(booking.timeSlot);
    setShowModifyModal(true);
  };

  const handleModifySubmit = () => {
    const updatedBookings = bookings.map(booking => 
      booking.id === currentBooking.id 
        ? { ...booking, timeSlot: newTimeSlot, status: "pending" }
        : booking
    );
    setBookings(updatedBookings);
    setShowModifyModal(false);
  };

  const handleCancel = (bookingId) => {
    const updatedBookings = bookings.map(booking => 
      booking.id === bookingId 
        ? { ...booking, status: "cancelled" }
        : booking
    );
    setBookings(updatedBookings);
  };

  const handleReviewSubmit = () => {
    setShowReviewModal(false);
    setRating(0);
    setReviewText("");
  };

  const getBadgeColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'confirmed': return 'success';
      case 'completed': return 'primary';
      case 'cancelled': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <div className="container mt-4">
      <div className="text-center mb-4">
        <h1>My Bookings</h1>
        <p className="text-muted">View and manage your service bookings</p>
      </div>

      <Row>
        {bookings.map((booking) => (
          <Col key={booking.id} md={4} className="mb-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <h5 className="card-title">{booking.serviceName}</h5>
                  <Badge pill bg={getBadgeColor(booking.status)}>
                    {booking.status.toUpperCase()}
                  </Badge>
                </div>
                <h6 className="card-subtitle mb-2 text-muted">{booking.providerName}</h6>
                
                <div className="card-text mt-3">
                  <p><strong>Date:</strong> {booking.date}</p>
                  <p><strong>Time Slot:</strong> {booking.timeSlot}</p>
                  <p>
                    <strong>Price:</strong> 
                    {booking.isSubscriber ? (
                      <>
                        <span className="text-decoration-line-through me-2">${booking.originalPrice}</span>
                        <span className="text-success">${booking.finalPrice}</span>
                        <Badge bg="info" className="ms-2">Subscriber Discount</Badge>
                      </>
                    ) : (
                      <span>${booking.finalPrice}</span>
                    )}
                  </p>
                </div>
              </div>
              
              <div className="card-footer bg-transparent border-top-0">
                <div className="d-flex justify-content-end">
                  {booking.status === 'confirmed' && !booking.serviceCompleted && (
                    <>
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        className="me-2"
                        onClick={() => handleModify(booking)}
                      >
                        Modify
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleCancel(booking.id)}
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                  
                  {booking.status === 'completed' && (
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => {
                        setCurrentBooking(booking);
                        setShowReviewModal(true);
                      }}
                    >
                      Add Review
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Col>
        ))}
      </Row>

      <Modal show={showModifyModal} onHide={() => setShowModifyModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Modify Booking Time Slot</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentBooking && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Service Name</Form.Label>
                <Form.Control type="text" readOnly value={currentBooking.serviceName} />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Provider</Form.Label>
                <Form.Control type="text" readOnly value={currentBooking.providerName} />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Date</Form.Label>
                <Form.Control type="text" readOnly value={currentBooking.date} />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Current Time Slot</Form.Label>
                <Form.Control type="text" readOnly value={currentBooking.timeSlot} />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Available Time Slots</Form.Label>
                <div className="d-flex flex-wrap gap-2">
                  {availableTimeSlots.map((slot, index) => (
                    <Button
                      key={index}
                      variant={newTimeSlot === slot ? 'primary' : 'outline-primary'}
                      onClick={() => setNewTimeSlot(slot)}
                    >
                      {slot}
                    </Button>
                  ))}
                </div>
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModifyModal(false)}>
            Close
          </Button>
          <Button 
            variant="primary" 
            onClick={handleModifySubmit}
            disabled={!newTimeSlot}
          >
            Update Booking
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showReviewModal} onHide={() => setShowReviewModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Review</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentBooking && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Service</Form.Label>
                <Form.Control type="text" readOnly value={currentBooking.serviceName} />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Provider</Form.Label>
                <Form.Control type="text" readOnly value={currentBooking.providerName} />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Rating</Form.Label>
                <div className="d-flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Button
                      key={star}
                      variant={rating >= star ? 'warning' : 'outline-warning'}
                      className="me-2"
                      onClick={() => setRating(star)}
                    >
                      ★
                    </Button>
                  ))}
                </div>
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Your Review</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  maxLength={200}
                  placeholder="Share your experience (max 200 characters)"
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowReviewModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleReviewSubmit}
            disabled={rating === 0 || reviewText.length < 10}
          >
            Submit Review
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CustomerDashboard;
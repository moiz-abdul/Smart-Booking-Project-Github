import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import './projectstatus.css';

// Project Status Section ( Added below Crousel Section)
export default function ProjectStatusPage() {
  return (
    <section className="container project-status alignment my-5">
      <h2 className="text-center heading mb-4">Book a Service</h2>

      <form className="p-4 bg-white shadow rounded">

        {/* Booking Form Inputs */}
        <h4 className="mb-3">Booking Details</h4>        
        <div className="mb-3">
          <label htmlFor="fullName" className="form-label">Customer Full Name</label>
          <input type="text" className="form-control" id="fullName" required />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">Customer Email</label>
          <input type="email" className="form-control" id="email" required />
        </div>

        <div className="mb-3">
          <label htmlFor="phone" className="form-label">Customer Phone Number</label>
          <input type="text" className="form-control" id="phone" required />
        </div>

        <div className="mb-3">
          <label htmlFor="serviceName" className="form-label">Service Name</label>
          <input type="text" className="form-control" id="serviceName" value="Dental Checkup" readOnly />
        </div>

        <div className="mb-3">
          <label htmlFor="serviceCategory" className="form-label">Service Category</label>
          <input type="text" className="form-control" id="serviceCategory" value="Medical Appointment" readOnly />
        </div>

        <div className="mb-3">
          <label htmlFor="availableDayDate" className="form-label">Select Available Day & Date</label>
          <select className="form-select" id="availableDayDate" required>
            <option value="">-- Select Day & Date --</option>
            <option value="Monday - 15 May 2025">Monday - 15 May 2025</option>
            <option value="Wednesday - 17 May 2025">Wednesday - 17 May 2025</option>
            <option value="Friday - 19 May 2025">Friday - 19 May 2025</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="availableTime" className="form-label">Select Available Time Slot</label>
          <select className="form-select" id="availableTime" required>
            <option value="">-- Select Time Slot --</option>
            <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
            <option value="12:00 PM - 01:00 PM">12:00 PM - 01:00 PM</option>
            <option value="03:00 PM - 04:00 PM">03:00 PM - 04:00 PM</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="specialNotes" className="form-label">Special Instructions / Notes (Optional)</label>
          <textarea className="form-control" id="specialNotes" rows="3" placeholder="Any special request..."></textarea>
        </div>

        {/* Line Divider */}
        <hr className="my-5"/>

        {/* Payment Form Inputs */}
        <h4 className="mb-3">Payment Details</h4>
        
        <div className="mb-3">
            <label className="form-label">Total Payment</label>
            <input
              type="text"
              className="form-control"
              value="$120"
              readOnly
            />
          </div>
          
        <div className="mb-3">
          <label htmlFor="cardholderName" className="form-label">Cardholder Name</label>
          <input type="text" className="form-control" id="cardholderName" required />
        </div>

        <div className="mb-3">
          <label htmlFor="cardNumber" className="form-label">Card Number</label>
          <input type="text" className="form-control" id="cardNumber" pattern="\d{16}" placeholder="1234 5678 9012 3456" required />
        </div>

        <div className="mb-3">
          <label htmlFor="expiryDate" className="form-label">Expiry Date</label>
          <input type="month" className="form-control" id="expiryDate" required />
        </div>

        <div className="mb-3">
          <label htmlFor="cvv" className="form-label">CVV/CVC Code</label>
          <input type="password" className="form-control" id="cvv" pattern="\d{3,4}" required />
        </div>

        <div className="mb-4">
          <label htmlFor="billingAddress" className="form-label">Billing Address (Optional)</label>
          <textarea className="form-control" id="billingAddress" rows="2" placeholder="Street, City, Country"></textarea>
        </div>

        {/* Button Group */}
        <div className="d-flex gap-3">
          <button type="submit" className="btn btn-success">Book Now</button>
          <button type="button" className="btn btn-primary" onClick={() => window.location.href = '/'}>Back to Home</button>
        </div>

      </form>
    </section>
  );
};

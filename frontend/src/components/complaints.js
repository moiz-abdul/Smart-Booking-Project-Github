import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/Complaints.css";

const Complaints = () => {
  return (
    <div className="complaints-section">
      <div className="complaints-hero text-center text-white">
        <h1 className="display-4">We Value Your Feedback</h1>
        <p className="lead">
          Let us know about any issues or complaints to help us improve our services.
        </p>
      </div>
      <div className="container complaints-content py-5">
        <h2 className="text-center mb-4">Submit Your Complaint</h2>
        <form className="complaint-form mx-auto">
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              placeholder="Enter your name"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="complaint" className="form-label">
              Complaint
            </label>
            <textarea
              className="form-control"
              id="complaint"
              rows="4"
              placeholder="Describe your complaint"
            ></textarea>
          </div>
          <div className="text-center">
            <button type="submit" className="btn btn-primary px-5">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Complaints;

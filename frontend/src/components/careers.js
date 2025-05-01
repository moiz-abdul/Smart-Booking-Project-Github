import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/Careers.css";

const Careers = () => {
  return (
    <div className="careers-page">
      {/* Hero Section */}
      <div className="careers-hero text-center text-white">
        <h1 className="display-4">Join Our Team</h1>
        <p className="lead">
          Be part of a dynamic and innovative organization shaping the future.
        </p>
      </div>

      {/* Open Positions */}
      <div className="container-fluid open-positions py-5">
        <h2 className="text-center mb-5">Current Openings</h2>
        <div className="row">
          <div className="col-md-4 mb-4">
            <div className="position-card">
              <h4>Software Developer</h4>
              <p>Location: Remote</p>
              <p>Experience: 2+ years</p>
              <button className="btn btn-primary btn-sm">Apply Now</button>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="position-card">
              <h4>Project Manager</h4>
              <p>Location: On-Site</p>
              <p>Experience: 5+ years</p>
              <button className="btn btn-primary btn-sm">Apply Now</button>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="position-card">
              <h4>UI/UX Designer</h4>
              <p>Location: Remote</p>
              <p>Experience: 3+ years</p>
              <button className="btn btn-primary btn-sm">Apply Now</button>
            </div>
          </div>
        </div>
      </div>

      {/* Why Join Us Section */}
      <div className="why-join-us py-5 text-center">
        <h2>Why Work With Us?</h2>
        <p className="mt-3">
          At our company, we foster a culture of innovation, collaboration, and
          growth. We provide opportunities to learn, grow, and make an impact.
        </p>
      </div>

      {/* Call to Action */}
      <div className="careers-cta text-center py-4">
        <h3 className="mb-3">Excited to Work With Us?</h3>
        <button className="btn btn-lg btn-success px-5">View All Positions</button>
      </div>
    </div>
  );
};

export default Careers;
